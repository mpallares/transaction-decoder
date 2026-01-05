import { Hash } from 'viem';
import { SupportedChain } from './chains';

export interface DecodedTransaction {
  hash: Hash;
  chain: SupportedChain;
  from: string;
  to: string | null;
  value: bigint;
  valueUSD: number;
  gasUsed: bigint;
  gasPrice: bigint;
  gasCostUSD: number;
  blockNumber: bigint;
  timestamp?: number;
  status: 'success' | 'failed';
  functionName?: string;
  functionArgs?: Record<string, unknown>;
  decodedLogs: DecodedLog[];
  tokenTransfers: TokenTransfer[];
  summary: string;
}

export interface DecodedLog {
  address: string;
  eventName: string;
  args: Record<string, unknown>;
  logIndex: number;
}

export interface TokenTransfer {
  from: string;
  to: string;
  value: bigint;
  valueUSD?: number;
  token: {
    address: string;
    symbol: string;
    decimals: number;
    name?: string;
  };
  type: 'ERC20' | 'ERC721' | 'native';
}

export interface TransactionError {
  message: string;
  code?: string;
}
