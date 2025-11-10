export function LoadingSkeleton() {
  return (
    <div className="animate-pulse space-y-4">
      <div className="h-4 w-3/4 rounded bg-gray-200 dark:bg-gray-800"></div>
      <div className="h-4 w-1/2 rounded bg-gray-200 dark:bg-gray-800"></div>
      <div className="h-4 w-5/6 rounded bg-gray-200 dark:bg-gray-800"></div>
    </div>
  );
}

export function CardSkeleton() {
  return (
    <div className="animate-pulse rounded-lg border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-gray-900">
      <div className="h-4 w-1/4 rounded bg-gray-200 dark:bg-gray-800 mb-4"></div>
      <div className="h-8 w-1/2 rounded bg-gray-200 dark:bg-gray-800"></div>
    </div>
  );
}

export function TableSkeleton() {
  return (
    <div className="animate-pulse space-y-3">
      {[1, 2, 3, 4, 5].map((i) => (
        <div key={i} className="flex gap-4">
          <div className="h-4 w-1/4 rounded bg-gray-200 dark:bg-gray-800"></div>
          <div className="h-4 w-1/4 rounded bg-gray-200 dark:bg-gray-800"></div>
          <div className="h-4 w-1/4 rounded bg-gray-200 dark:bg-gray-800"></div>
          <div className="h-4 w-1/4 rounded bg-gray-200 dark:bg-gray-800"></div>
        </div>
      ))}
    </div>
  );
}


