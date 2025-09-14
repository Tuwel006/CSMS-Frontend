// src/components/MatchCard.tsx
import React from 'react';
import { type Match } from '@/context/CurrentMatchContext';

interface Props {
  match: Match;
}

const MatchCard: React.FC<Props> = ({ match }) => (
  <div className="bg-white rounded-xl shadow-lg p-5 w-80 mx-2">
    <h2 className="text-xl font-semibold mb-2">{match.name}</h2>

    <div className="flex justify-between items-center mb-3">
      {match.teamInfo.map(team => (
        <div key={team.name} className="flex items-center space-x-2">
          <img src={team.img} alt={team.shortname} className="w-10 h-10 rounded-full" />
          <span className="font-medium">{team.shortname}</span>
        </div>
      ))}
    </div>

    <div className="mb-3">
      {match.score.map((score, idx) => (
        <div key={idx} className="text-gray-700">
          <span className="font-semibold">{score.inning}: </span>
          {score.r} runs, {score.w} wickets in {score.o} overs
        </div>
      ))}
    </div>

    <div className="text-sm text-gray-500">
      <div>Status: {match.status}</div>
      <div>Venue: {match.venue}</div>
      <div>Date: {new Date(match.dateTimeGMT).toLocaleString()}</div>
    </div>
  </div>
);

export default MatchCard;
