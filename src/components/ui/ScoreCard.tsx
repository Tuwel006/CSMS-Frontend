import React from "react";
import { type MatchDetails } from "../../types/scorecard";
import ScoreCard from "./lib/ScoreCard";

interface Props {
  match: MatchDetails;
  onClick?: () => void;
  variant?: 'default' | 'compact';
}

const MatchCard: React.FC<Props> = ({ match, onClick, variant = 'compact' }) => {
  if (!match?.innings || !match?.teams) {
    return null;
  }

  const teamAInnings = match.innings?.find(i => i.battingTeam === match.teams.A.short);
  const teamBInnings = match.innings?.find(i => i.battingTeam === match.teams.B.short);

  return (
    <ScoreCard
      teamA={{
        name: match.teams.A.name,
        short: match.teams.A.short,
        score: teamAInnings ? `${teamAInnings.score.r}-${teamAInnings.score.w}` : '-',
        overs: teamAInnings ? String(Math.floor(teamAInnings.score.b / 6) + (teamAInnings.score.b % 6) / 10) : '-'
      }}
      teamB={{
        name: match.teams.B.name,
        short: match.teams.B.short,
        score: teamBInnings ? `${teamBInnings.score.r}-${teamBInnings.score.w}` : '-',
        overs: teamBInnings ? String(Math.floor(teamBInnings.score.b / 6) + (teamBInnings.score.b % 6) / 10) : '-'
      }}
      status={match.meta.status}
      matchType={`${match.meta.format} Overs`}
      onClick={onClick}
      variant={variant}
    />
  );
};

export default MatchCard;
