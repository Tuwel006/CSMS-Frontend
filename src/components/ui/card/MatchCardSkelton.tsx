// src/components/MatchCardSkeleton.tsx
import React from 'react';

const MatchCardSkeleton: React.FC = () => (
  <div className="bg-white rounded-xl shadow-lg p-5 w-80 mx-2 animate-pulse">
    <div className="h-6 bg-gray-300 rounded w-3/4 mb-4"></div>
    <div className="flex justify-between items-center mb-3">
      <div className="h-10 w-10 bg-gray-300 rounded-full" />
      <div className="h-10 w-10 bg-gray-300 rounded-full" />
    </div>
    <div className="space-y-2 mb-3">
      <div className="h-4 bg-gray-300 rounded w-5/6" />
      <div className="h-4 bg-gray-300 rounded w-4/6" />
    </div>
    <div className="space-y-1 text-gray-500">
      <div className="h-4 bg-gray-300 rounded w-3/4" />
      <div className="h-4 bg-gray-300 rounded w-2/3" />
      <div className="h-4 bg-gray-300 rounded w-1/2" />
    </div>
  </div>
);

export default MatchCardSkeleton;
