'use client';

export function LoadingSkeleton() {
  return (
    <div className="w-full max-w-4xl space-y-6 animate-pulse">
      {/* Summary skeleton */}
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
        <div className="flex items-start gap-4">
          <div className="w-8 h-8 bg-gray-300 dark:bg-gray-700 rounded-full"></div>
          <div className="flex-1 space-y-3">
            <div className="h-8 bg-gray-300 dark:bg-gray-700 rounded w-3/4"></div>
            <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-1/2"></div>
          </div>
        </div>
      </div>

      {/* Info skeleton */}
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
        <div className="h-6 bg-gray-300 dark:bg-gray-700 rounded w-1/4 mb-4"></div>
        <div className="space-y-3">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="flex justify-between">
              <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-1/5"></div>
              <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-2/5"></div>
            </div>
          ))}
        </div>
      </div>

      {/* Gas skeleton */}
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
        <div className="h-6 bg-gray-300 dark:bg-gray-700 rounded w-1/4 mb-4"></div>
        <div className="space-y-3">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="flex justify-between">
              <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-1/5"></div>
              <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-2/5"></div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
