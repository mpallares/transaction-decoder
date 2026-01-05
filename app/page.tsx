'use client';

import { useTransactionDecoder } from '@/hooks/useTransactionDecoder';
import { SearchBar } from '@/components/SearchBar';
import { TransactionDetails } from '@/components/TransactionDetails';
import { LoadingSkeleton } from '@/components/LoadingSkeleton';
import { ErrorDisplay } from '@/components/ErrorDisplay';
import { Sparkles, Blocks, Zap } from 'lucide-react';

export default function Home() {
  const { transaction, loading, error, decode, reset } = useTransactionDecoder();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-900 dark:via-blue-950 dark:to-indigo-950">
      <main className="container mx-auto px-4 py-12 md:py-20">
        <div className="flex flex-col items-center gap-12">
          {/* Header with animated gradient */}
          <div className="text-center space-y-6 animate-fade-in">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-100 dark:bg-blue-900/30 rounded-full mb-4">
              <Sparkles className="w-4 h-4 text-blue-600 dark:text-blue-400" />
              <span className="text-sm font-medium text-blue-700 dark:text-blue-300">
                Decode EVM Transactions
              </span>
            </div>

            <h1 className="text-5xl md:text-7xl font-bold bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 dark:from-blue-400 dark:via-indigo-400 dark:to-purple-400 bg-clip-text text-transparent">
              Transaction Decoder
            </h1>

            <p className="text-lg md:text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto leading-relaxed">
              Transform complex blockchain transactions into clear, human-readable insights.
              <br />
              <span className="text-base text-gray-500 dark:text-gray-400">
                Supporting Ethereum, Base, Arbitrum, and Polygon
              </span>
            </p>

            {/* Feature Pills */}
            <div className="flex flex-wrap justify-center gap-3 pt-4">
              <FeaturePill icon={<Blocks className="w-4 h-4" />} text="Multi-Chain" />
              <FeaturePill icon={<Zap className="w-4 h-4" />} text="Instant Decode" />
              <FeaturePill icon={<Sparkles className="w-4 h-4" />} text="Token Transfers" />
            </div>
          </div>

          {/* Search Bar */}
          <SearchBar onSearch={decode} loading={loading} />

          {/* Results with fade-in animation */}
          <div className="w-full flex justify-center animate-fade-in">
            {loading && <LoadingSkeleton />}
            {error && <ErrorDisplay error={error} onRetry={reset} />}
            {transaction && !loading && <TransactionDetails transaction={transaction} />}
          </div>

          {/* Example Transactions */}
          {!transaction && !loading && !error && (
            <div className="w-full max-w-4xl mt-8 animate-fade-in">
              <div className="bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm rounded-2xl p-6 border border-gray-200/50 dark:border-gray-700/50 shadow-xl">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4 flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                  Try an Example
                </h3>
                <div className="space-y-3 text-sm">
                  <ExampleTx
                    chain="Ethereum"
                    hash="0x5c504ed432cb51138bcf09aa5e8a410dd4a1e204ef84bfed1be16dfba1b22060"
                    description="Early ETH transfer"
                  />
                  <p className="text-gray-600 dark:text-gray-400 text-xs pt-2 border-t border-gray-200 dark:border-gray-700">
                    💡 Paste any transaction hash from Ethereum, Base, Arbitrum, or Polygon
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="py-8 text-center text-sm text-gray-500 dark:text-gray-400 border-t border-gray-200/50 dark:border-gray-700/50">
        <p className="flex items-center justify-center gap-2">
          Built with
          <span className="text-blue-600 dark:text-blue-400 font-semibold">Next.js 15</span>
          <span>•</span>
          <span className="text-indigo-600 dark:text-indigo-400 font-semibold">TypeScript</span>
          <span>•</span>
          <span className="text-purple-600 dark:text-purple-400 font-semibold">viem</span>
        </p>
      </footer>
    </div>
  );
}

function FeaturePill({ icon, text }: { icon: React.ReactNode; text: string }) {
  return (
    <div className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-full border border-gray-200 dark:border-gray-700 shadow-sm">
      <span className="text-blue-600 dark:text-blue-400">{icon}</span>
      <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{text}</span>
    </div>
  );
}

function ExampleTx({ chain, hash, description }: { chain: string; hash: string; description: string }) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center gap-2 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-gray-900 dark:to-blue-900/20 rounded-xl border border-blue-100 dark:border-blue-900/30 hover:shadow-md transition-all duration-200 cursor-pointer group">
      <span className="font-semibold text-blue-700 dark:text-blue-300 min-w-[100px] text-sm">{chain}</span>
      <code className="text-xs text-gray-700 dark:text-gray-300 font-mono break-all group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
        {hash}
      </code>
      <span className="text-gray-500 dark:text-gray-500 text-xs italic">— {description}</span>
    </div>
  );
}
