'use client';

import { Copy, ExternalLink, CheckCircle, XCircle, ArrowRight, Fuel, Clock } from 'lucide-react';
import { DecodedTransaction } from '@/lib/types';
import { SUPPORTED_CHAINS } from '@/lib/chains';
import { shortenAddress, formatTokenAmount, formatUSD, formatGas } from '@/lib/format';
import { formatEther } from 'viem';
import { useState } from 'react';

interface TransactionDetailsProps {
  transaction: DecodedTransaction;
}

export function TransactionDetails({ transaction }: TransactionDetailsProps) {
  const config = SUPPORTED_CHAINS[transaction.chain];

  return (
    <div className="w-full max-w-4xl space-y-6 animate-scale-in">
      {/* Summary Card - Enhanced */}
      <div className="bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 rounded-2xl p-8 border-2 border-gray-200 dark:border-gray-700 shadow-xl hover:shadow-2xl transition-shadow duration-300">
        <div className="flex items-start gap-6">
          <div className="flex-shrink-0">
            {transaction.status === 'success' ? (
              <div className="p-3 bg-green-100 dark:bg-green-900/30 rounded-xl">
                <CheckCircle className="w-10 h-10 text-green-600 dark:text-green-400" />
              </div>
            ) : (
              <div className="p-3 bg-red-100 dark:bg-red-900/30 rounded-xl">
                <XCircle className="w-10 h-10 text-red-600 dark:text-red-400" />
              </div>
            )}
          </div>
          <div className="flex-1">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-3">
              {transaction.summary}
            </h2>
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-600 dark:text-gray-400">Status:</span>
              <span className={`px-3 py-1 rounded-full text-sm font-semibold ${transaction.status === 'success' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'}`}>
                {transaction.status === 'success' ? '✓ Success' : '✗ Failed'}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Basic Info - Enhanced Card */}
      <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl p-6 border border-gray-200/50 dark:border-gray-700/50 shadow-lg hover:shadow-xl transition-all duration-300">
        <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-6 flex items-center gap-2">
          <div className="w-1.5 h-6 bg-gradient-to-b from-blue-500 to-indigo-500 rounded-full"></div>
          Transaction Info
        </h3>
        <div className="space-y-4">
          <InfoRow label="Hash" value={transaction.hash} copyable linkTo={`${config.explorerUrl}/tx/${transaction.hash}`} />
          <InfoRow label="From" value={transaction.from} copyable linkTo={`${config.explorerUrl}/address/${transaction.from}`} />
          <InfoRow label="To" value={transaction.to || 'Contract Creation'} copyable={!!transaction.to} linkTo={transaction.to ? `${config.explorerUrl}/address/${transaction.to}` : undefined} />
          <InfoRow
            label="Value"
            value={`${formatEther(transaction.value)} ${config.nativeCurrency}`}
            extraValue={transaction.valueUSD > 0 ? formatUSD(transaction.valueUSD) : undefined}
          />
          <InfoRow label="Block" value={transaction.blockNumber.toString()} linkTo={`${config.explorerUrl}/block/${transaction.blockNumber}`} />
          {transaction.timestamp && (
            <InfoRow
              label="Timestamp"
              value={new Date(transaction.timestamp * 1000).toLocaleString()}
              icon={<Clock className="w-4 h-4 text-gray-400" />}
            />
          )}
        </div>
      </div>

      {/* Gas Info - Enhanced Card */}
      <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl p-6 border border-gray-200/50 dark:border-gray-700/50 shadow-lg hover:shadow-xl transition-all duration-300">
        <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-6 flex items-center gap-2">
          <Fuel className="w-6 h-6 text-orange-500" />
          Gas Details
        </h3>
        <div className="space-y-4">
          <InfoRow label="Gas Used" value={formatGas(transaction.gasUsed)} />
          <InfoRow label="Gas Price" value={`${formatEther(transaction.gasPrice)} ${config.nativeCurrency}`} />
          <InfoRow
            label="Transaction Fee"
            value={formatUSD(transaction.gasCostUSD)}
            highlighted
          />
        </div>
      </div>

      {/* Token Transfers - Enhanced */}
      {transaction.tokenTransfers.length > 0 && (
        <div className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-2xl p-6 border border-blue-200 dark:border-blue-800 shadow-lg hover:shadow-xl transition-all duration-300">
          <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-6 flex items-center gap-2">
            <div className="w-1.5 h-6 bg-gradient-to-b from-blue-500 to-indigo-500 rounded-full"></div>
            Token Transfers
          </h3>
          <div className="space-y-4">
            {transaction.tokenTransfers.map((transfer, index) => (
              <div key={index} className="group flex items-center gap-4 p-5 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-xl border border-blue-200/50 dark:border-blue-800/50 hover:border-blue-400 dark:hover:border-blue-600 transition-all duration-200 hover:shadow-md">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-3">
                    <span className="text-lg font-bold bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400 bg-clip-text text-transparent">
                      {formatTokenAmount(transfer.value, transfer.token.decimals)} {transfer.token.symbol}
                    </span>
                    {transfer.valueUSD && transfer.valueUSD > 0 && (
                      <span className="px-2 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 text-sm font-semibold rounded-lg">
                        {formatUSD(transfer.valueUSD)}
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <AddressLink address={transfer.from} explorerUrl={config.explorerUrl} label="From" />
                    <ArrowRight className="w-4 h-4 text-blue-500 flex-shrink-0" />
                    <AddressLink address={transfer.to} explorerUrl={config.explorerUrl} label="To" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Function Call - Enhanced */}
      {transaction.functionName && (
        <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl p-6 border border-gray-200/50 dark:border-gray-700/50 shadow-lg hover:shadow-xl transition-all duration-300">
          <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-6 flex items-center gap-2">
            <div className="w-1.5 h-6 bg-gradient-to-b from-purple-500 to-pink-500 rounded-full"></div>
            Function Call
          </h3>
          <div className="space-y-4">
            <InfoRow label="Function" value={transaction.functionName} />
            {transaction.functionArgs && Object.keys(transaction.functionArgs).length > 0 && (
              <div>
                <p className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">Arguments:</p>
                <pre className="bg-gray-900 dark:bg-black p-4 rounded-xl overflow-x-auto text-sm text-green-400 font-mono border border-gray-700 shadow-inner">
                  {JSON.stringify(transaction.functionArgs, (_, v) =>
                    typeof v === 'bigint' ? v.toString() : v, 2
                  )}
                </pre>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Event Logs - Enhanced */}
      {transaction.decodedLogs.length > 0 && (
        <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl p-6 border border-gray-200/50 dark:border-gray-700/50 shadow-lg hover:shadow-xl transition-all duration-300">
          <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-6 flex items-center gap-2">
            <div className="w-1.5 h-6 bg-gradient-to-b from-green-500 to-emerald-500 rounded-full"></div>
            Events ({transaction.decodedLogs.length})
          </h3>
          <div className="space-y-3">
            {transaction.decodedLogs.map((log, index) => (
              <div key={index} className="p-4 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/10 dark:to-emerald-900/10 rounded-xl border border-green-200 dark:border-green-800 hover:shadow-md transition-all duration-200">
                <div className="flex items-center gap-2 mb-2">
                  <span className="font-bold text-gray-900 dark:text-gray-100">{log.eventName}</span>
                  <span className="px-2 py-0.5 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 text-xs rounded-full font-medium">
                    #{log.logIndex}
                  </span>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400 flex items-center gap-2">
                  <span className="text-gray-500 dark:text-gray-500">Contract:</span>
                  <AddressLink address={log.address} explorerUrl={config.explorerUrl} />
                </p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function InfoRow({ label, value, copyable, linkTo, icon, highlighted, extraValue }: {
  label: string;
  value: string;
  copyable?: boolean;
  linkTo?: string;
  icon?: React.ReactNode;
  highlighted?: boolean;
  extraValue?: string;
}) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(value);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className={`flex items-center justify-between gap-4 p-3 rounded-lg transition-colors ${highlighted ? 'bg-blue-50 dark:bg-blue-900/20' : 'hover:bg-gray-50 dark:hover:bg-gray-900/50'}`}>
      <span className="text-sm font-semibold text-gray-700 dark:text-gray-300 flex items-center gap-2">
        {icon}
        {label}
      </span>
      <div className="flex items-center gap-2">
        <div className="flex flex-col items-end">
          <span className={`text-sm font-mono ${highlighted ? 'text-blue-700 dark:text-blue-300 font-bold' : 'text-gray-900 dark:text-gray-100'}`}>
            {value.startsWith('0x') && value.length > 20 ? shortenAddress(value) : value}
          </span>
          {extraValue && (
            <span className="text-xs text-green-600 dark:text-green-400 font-semibold">
              {extraValue}
            </span>
          )}
        </div>
        {copyable && (
          <button
            onClick={handleCopy}
            className="p-2 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg transition-all duration-200 hover:scale-110 active:scale-95"
            title="Copy to clipboard"
          >
            {copied ? (
              <CheckCircle className="w-4 h-4 text-green-500" />
            ) : (
              <Copy className="w-4 h-4 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300" />
            )}
          </button>
        )}
        {linkTo && (
          <a
            href={linkTo}
            target="_blank"
            rel="noopener noreferrer"
            className="p-2 hover:bg-blue-100 dark:hover:bg-blue-900/30 rounded-lg transition-all duration-200 hover:scale-110 active:scale-95"
            title="View on explorer"
          >
            <ExternalLink className="w-4 h-4 text-blue-500 hover:text-blue-600 dark:hover:text-blue-400" />
          </a>
        )}
      </div>
    </div>
  );
}

function AddressLink({ address, explorerUrl, label }: { address: string; explorerUrl: string; label?: string }) {
  return (
    <a
      href={`${explorerUrl}/address/${address}`}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex items-center gap-1.5 px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 hover:bg-blue-200 dark:hover:bg-blue-900/50 rounded-lg font-mono text-xs font-medium transition-all duration-200 hover:shadow-sm"
      title="View on explorer"
    >
      {label && <span className="font-semibold">{label}:</span>}
      {shortenAddress(address)}
      <ExternalLink className="w-3 h-3" />
    </a>
  );
}
