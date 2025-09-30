// src/components/MatchSliderWrapper.tsx
import React, { Suspense } from 'react';
import { useCurrentMatchContext } from '@/context/CurrentMatchContext';
import MatchCardSkeleton from '../card/MatchCardSkelton';

// Lazy load MatchSlider
const MatchSlider = React.lazy(() => import('./MatchSlider'));

const MatchSliderWrapper: React.FC = () => {
  const { error, matches } = useCurrentMatchContext();

  if (error) return <div className="p-5 text-red-500">Error: {error}</div>;

  return (
    <Suspense
      fallback={
        <div className="flex space-x-4 overflow-x-auto p-5">
          {matches.map((_, idx) => (
            <MatchCardSkeleton key={idx} />
          ))}
        </div>
      }
    >
        <MatchSlider matches={matches} />
    </Suspense>
  );
};

export default MatchSliderWrapper;
