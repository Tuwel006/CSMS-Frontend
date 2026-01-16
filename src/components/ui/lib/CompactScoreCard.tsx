import React from 'react';
import ScoreCard from './ScoreCard';

interface CompactScoreCardProps {
  teamA: { name: string; short: string; score: string; overs: string; logo?: string; };
  teamB: { name: string; short: string; score: string; overs: string; logo?: string; };
  status: string;
  matchType: string;
  onClick?: () => void;
  className?: string;
}

const CompactScoreCard: React.FC<CompactScoreCardProps> = (props) => {
  return <ScoreCard {...props} variant="compact" />;
};

export default CompactScoreCard;