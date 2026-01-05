import {
  createPublicClient,
  http,
  decodeEventLog,
  decodeFunctionData,
  formatEther,
  formatUnits,
  Hash,
} from 'viem';
import { SupportedChain, SUPPORTED_CHAINS } from './chains';
import { getCommonABI } from './abi-fetcher';
import { ERC20_ABI, KNOWN_CONTRACTS } from './abis';
import { DecodedTransaction, TokenTransfer, DecodedLog } from './types';
import { getEthPrice, getTokenPrice } from './format';

export async function decodeTransaction(
  txHash: Hash,
  chain: SupportedChain
): Promise<DecodedTransaction> {
  const config = SUPPORTED_CHAINS[chain];

  const client = createPublicClient({
    chain: config.chain,
    transport: http(config.rpcUrl),
  });

  // Fetch transaction and receipt
  const [tx, receipt] = await Promise.all([
    client.getTransaction({ hash: txHash }),
    client.getTransactionReceipt({ hash: txHash }),
  ]);

  if (!tx || !receipt) {
    throw new Error('Transaction not found');
  }

  // Get block for timestamp
  const block = await client.getBlock({ blockNumber: receipt.blockNumber });

  // Decode function data
  let functionName: string | undefined;
  let functionArgs: Record<string, unknown> | undefined;

  if (tx.to && tx.input && tx.input !== '0x') {
    try {
      const contractABI = getCommonABI();
      const decoded = decodeFunctionData({
        abi: contractABI.abi,
        data: tx.input,
      });
      functionName = decoded.functionName;
      // Store args (can be array or object)
      if (decoded.args) {
        functionArgs = decoded.args as unknown as Record<string, unknown>;
      }
    } catch (error) {
      console.error('Failed to decode function:', error);
    }
  }

  // Decode logs
  const decodedLogs: DecodedLog[] = [];
  for (const log of receipt.logs) {
    try {
      const decoded = decodeEventLog({
        abi: ERC20_ABI,
        data: log.data,
        topics: log.topics,
      });

      decodedLogs.push({
        address: log.address,
        eventName: decoded.eventName || 'Unknown',
        args: (decoded.args || {}) as Record<string, unknown>,
        logIndex: log.logIndex || 0,
      });
    } catch {
      // Skip logs that can't be decoded with common ABIs
    }
  }

  // Extract token transfers from logs
  const tokenTransfers = await extractTokenTransfers(decodedLogs, client);

  // Calculate gas cost and value in USD
  const ethPrice = await getEthPrice();
  const gasCostETH = Number(formatEther(receipt.gasUsed * receipt.effectiveGasPrice));
  const gasCostUSD = gasCostETH * ethPrice;
  const valueETH = Number(formatEther(tx.value));
  const valueUSD = valueETH * ethPrice;

  // Generate summary
  const summary = generateSummary(tx, tokenTransfers, functionName);

  return {
    hash: txHash,
    chain,
    from: tx.from,
    to: tx.to,
    value: tx.value,
    valueUSD,
    gasUsed: receipt.gasUsed,
    gasPrice: receipt.effectiveGasPrice,
    gasCostUSD,
    blockNumber: receipt.blockNumber,
    timestamp: Number(block.timestamp),
    status: receipt.status === 'success' ? 'success' : 'failed',
    functionName,
    functionArgs,
    decodedLogs,
    tokenTransfers,
    summary,
  };
}

async function extractTokenTransfers(
  logs: DecodedLog[],
  client: ReturnType<typeof createPublicClient>
): Promise<TokenTransfer[]> {
  const transfers: TokenTransfer[] = [];

  for (const log of logs) {
    if (log.eventName === 'Transfer') {
      const from = log.args.from as string;
      const to = log.args.to as string;
      const value = log.args.value as bigint;

      // Check if it's ERC721 (tokenId) or ERC20 (value)
      const isERC721 = log.args.tokenId !== undefined;

      if (!isERC721) {
        // Fetch token info
        try {
          const [symbol, decimals] = await Promise.all([
            client.readContract({
              address: log.address as `0x${string}`,
              abi: ERC20_ABI,
              functionName: 'symbol',
            }) as Promise<string>,
            client.readContract({
              address: log.address as `0x${string}`,
              abi: ERC20_ABI,
              functionName: 'decimals',
            }) as Promise<number>,
          ]);

          // Try to fetch token price
          let valueUSD: number | undefined;
          try {
            const tokenPrice = await getTokenPrice(log.address);
            if (tokenPrice > 0) {
              const tokenAmount = Number(formatUnits(value, decimals));
              valueUSD = tokenAmount * tokenPrice;
            }
          } catch {
            // Price not available
          }

          transfers.push({
            from,
            to,
            value,
            valueUSD,
            token: {
              address: log.address,
              symbol,
              decimals,
            },
            type: 'ERC20',
          });
        } catch {
          // Skip if can't fetch token info
        }
      }
    }
  }

  return transfers;
}

function generateSummary(
  tx: { from: string; to: string | null; value: bigint },
  transfers: TokenTransfer[],
  functionName?: string
): string {
  // Check for known contracts
  const knownContract = tx.to ? KNOWN_CONTRACTS[tx.to] : undefined;

  if (transfers.length > 0) {
    const mainTransfer = transfers[0];
    const verb = functionName?.toLowerCase().includes('swap') ? 'Swapped' : 'Transferred';

    if (transfers.length === 1) {
      return `${verb} ${mainTransfer.token.symbol}`;
    } else if (transfers.length === 2) {
      return `${verb} ${transfers[0].token.symbol} for ${transfers[1].token.symbol}`;
    } else {
      return `${verb} ${transfers.length} tokens`;
    }
  }

  if (tx.value > BigInt(0)) {
    return `Sent ${formatEther(tx.value)} ETH`;
  }

  if (functionName) {
    return `Called ${functionName}${knownContract ? ` on ${knownContract.name}` : ''}`;
  }

  if (knownContract) {
    return `Interacted with ${knownContract.name}`;
  }

  return 'Contract interaction';
}
