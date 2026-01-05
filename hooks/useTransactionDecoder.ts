'use client';

import { useState } from 'react';
import { Hash } from 'viem';
import { SupportedChain } from '@/lib/chains';
import { decodeTransaction } from '@/lib/decoder';
import { DecodedTransaction, TransactionError } from '@/lib/types';

interface UseTransactionDecoderReturn {
  transaction: DecodedTransaction | null;
  loading: boolean;
  error: TransactionError | null;
  decode: (txHash: Hash, chain: SupportedChain) => Promise<void>;
  reset: () => void;
}

export function useTransactionDecoder(): UseTransactionDecoderReturn {
  const [transaction, setTransaction] = useState<DecodedTransaction | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<TransactionError | null>(null);

  const decode = async (txHash: Hash, chain: SupportedChain) => {
    setLoading(true);
    setError(null);
    setTransaction(null);

    try {
      const decoded = await decodeTransaction(txHash, chain);
      setTransaction(decoded);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to decode transaction';
      setError({ message });
    } finally {
      setLoading(false);
    }
  };

  const reset = () => {
    setTransaction(null);
    setError(null);
    setLoading(false);
  };

  return {
    transaction,
    loading,
    error,
    decode,
    reset,
  };
}
