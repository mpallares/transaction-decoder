'use client';

import { useState } from 'react';
import { Search, Loader2 } from 'lucide-react';
import { SupportedChain, SUPPORTED_CHAINS } from '@/lib/chains';
import { Hash } from 'viem';

interface SearchBarProps {
  onSearch: (txHash: Hash, chain: SupportedChain) => void;
  loading: boolean;
}

export function SearchBar({ onSearch, loading }: SearchBarProps) {
  const [txHash, setTxHash] = useState('');
  const [selectedChain, setSelectedChain] = useState<SupportedChain>('ethereum');
  const [isFocused, setIsFocused] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (txHash.trim() && !loading) {
      onSearch(txHash.trim() as Hash, selectedChain);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-4xl">
      <div className="flex flex-col gap-4">
        {/* Input Container */}
        <div className="flex flex-col sm:flex-row gap-4">
          {/* Transaction Hash Input */}
          <div className={`relative flex-1 transition-all duration-300 ${isFocused ? 'scale-[1.02]' : ''}`}>
            <input
              type="text"
              value={txHash}
              onChange={(e) => setTxHash(e.target.value)}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
              placeholder="Paste transaction hash (0x...)"
              className="w-full px-4 py-4 pl-12 rounded-xl border-2 border-gray-200 dark:border-gray-700 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:border-blue-500 dark:focus:border-blue-400 focus:ring-4 focus:ring-blue-100 dark:focus:ring-blue-900/30 transition-all duration-200 shadow-sm hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={loading}
            />
            <Search className={`absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 transition-colors duration-200 ${isFocused ? 'text-blue-500 dark:text-blue-400' : 'text-gray-400'}`} />

            {/* Clear Button */}
            {txHash && !loading && (
              <button
                type="button"
                onClick={() => setTxHash('')}
                className="absolute right-4 top-1/2 -translate-y-1/2 w-6 h-6 flex items-center justify-center rounded-full bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
              >
                <span className="text-gray-600 dark:text-gray-400 text-sm">×</span>
              </button>
            )}
          </div>

          {/* Chain Selector */}
          <select
            value={selectedChain}
            onChange={(e) => setSelectedChain(e.target.value as SupportedChain)}
            className="px-4 py-4 rounded-xl border-2 border-gray-200 dark:border-gray-700 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm text-gray-900 dark:text-gray-100 focus:outline-none focus:border-blue-500 dark:focus:border-blue-400 focus:ring-4 focus:ring-blue-100 dark:focus:ring-blue-900/30 transition-all duration-200 shadow-sm hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed font-medium cursor-pointer"
            disabled={loading}
          >
            {Object.entries(SUPPORTED_CHAINS).map(([key, config]) => (
              <option key={key} value={key} className="py-2">
                {config.name}
              </option>
            ))}
          </select>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading || !txHash.trim()}
          className="group relative w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 disabled:from-gray-400 disabled:to-gray-400 dark:disabled:from-gray-600 dark:disabled:to-gray-600 text-white font-semibold rounded-xl transition-all duration-200 focus:outline-none focus:ring-4 focus:ring-blue-100 dark:focus:ring-blue-900/30 shadow-lg hover:shadow-xl disabled:shadow-none disabled:cursor-not-allowed transform hover:scale-[1.02] active:scale-[0.98]"
        >
          <span className="flex items-center justify-center gap-2">
            {loading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                <span>Decoding Transaction...</span>
              </>
            ) : (
              <>
                <Search className="w-5 h-5 group-hover:rotate-12 transition-transform duration-200" />
                <span>Decode Transaction</span>
              </>
            )}
          </span>
        </button>
      </div>
    </form>
  );
}
