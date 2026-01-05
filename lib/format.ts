import { formatUnits } from 'viem';

export function shortenAddress(address: string, chars = 4): string {
  return `${address.slice(0, chars + 2)}...${address.slice(-chars)}`;
}

export function formatTokenAmount(amount: bigint, decimals: number): string {
  const formatted = formatUnits(amount, decimals);
  const num = parseFloat(formatted);

  if (num === 0) return '0';
  if (num < 0.0001) return '< 0.0001';
  if (num < 1) return num.toFixed(4);
  if (num < 1000) return num.toFixed(2);
  if (num < 1000000) return `${(num / 1000).toFixed(2)}K`;
  return `${(num / 1000000).toFixed(2)}M`;
}

export function formatUSD(amount: number): string {
  if (amount < 0.01) return '< $0.01';
  if (amount < 1000) return `$${amount.toFixed(2)}`;
  if (amount < 1000000) return `$${(amount / 1000).toFixed(2)}K`;
  return `$${(amount / 1000000).toFixed(2)}M`;
}

export function formatGas(gas: bigint): string {
  return Number(gas).toLocaleString();
}

export async function getEthPrice(): Promise<number> {
  try {
    const response = await fetch(
      'https://api.coingecko.com/api/v3/simple/price?ids=ethereum&vs_currencies=usd'
    );
    const data = await response.json();
    return data.ethereum?.usd || 0;
  } catch (error) {
    console.error('Failed to fetch ETH price:', error);
    return 0;
  }
}

export async function getTokenPrice(tokenAddress: string): Promise<number> {
  try {
    // Use CoinGecko API to get token price by contract address
    const response = await fetch(
      `https://api.coingecko.com/api/v3/simple/token_price/ethereum?contract_addresses=${tokenAddress}&vs_currencies=usd`
    );
    const data = await response.json();
    return data[tokenAddress.toLowerCase()]?.usd || 0;
  } catch (error) {
    console.error('Failed to fetch token price:', error);
    return 0;
  }
}
