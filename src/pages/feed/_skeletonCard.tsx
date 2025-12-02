// _skeletonCard.tsx
import React, { memo } from "react";

const SkeletonCard = memo(() => {
  return (
    <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm animate-pulse">
      <div className="flex items-start gap-4 mb-4">
        <div className="w-12 h-12 bg-gray-200 rounded-full"></div>
        <div className="flex-1">
          <div className="h-5 bg-gray-200 rounded mb-2 w-3/4"></div>
          <div className="h-4 bg-gray-200 rounded mb-2 w-1/2"></div>

          <div className="flex items-center gap-1">
            {[1, 2, 3, 4, 5].map((_, i) => (
              <div key={i} className="w-3.5 h-3.5 bg-gray-200 rounded"></div>
            ))}
            <div className="h-3 bg-gray-200 rounded ml-1 w-8"></div>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-2 mb-2">
        <div className="w-4 h-4 bg-gray-200 rounded"></div>
        <div className="h-4 bg-gray-200 rounded w-1/3"></div>
      </div>

      <div className="space-y-2 mb-4">
        <div className="h-4 bg-gray-200 rounded w-full"></div>
        <div className="h-4 bg-gray-200 rounded w-4/5"></div>
      </div>

      <div className="flex flex-wrap gap-2 mb-4">
        <div className="h-6 bg-gray-200 rounded-full w-16"></div>
        <div className="h-6 bg-gray-200 rounded-full w-20"></div>
        <div className="h-6 bg-gray-200 rounded-full w-14"></div>
      </div>

      <div className="h-10 bg-gray-200 rounded-lg w-full"></div>
    </div>
  );
});

SkeletonCard.displayName = "SkeletonCard";

export default SkeletonCard;
