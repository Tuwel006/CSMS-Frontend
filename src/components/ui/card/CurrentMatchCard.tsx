import React from "react";
import { type Match } from "@/context/CurrentMatchContext";
import ScoreCard from "../ScoreCard";

interface Props {
  match: Match;
}

const MatchCard: React.FC<Props> = ({ match }) => (
  <div className="w-80 mx-2">
    <ScoreCard match={match as any} />
  </div>
);

export default MatchCard;
