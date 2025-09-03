import { createContext, useContext, useState, type ReactNode } from 'react';
import { type Player, type Team, type Match, type BallData, type Over, type Innings } from '../types/match';

interface MatchContextType {
  match: Match | null;
  currentInnings: Innings | null;
  
  // Match Setup
  createMatch: (matchData: Omit<Match, 'id'>) => Promise<void>;
  updateMatch: (matchData: Partial<Match>) => Promise<void>;
  
  // Ball Updates
  addBall: (ballData: BallData) => Promise<void>;
  
  // Team Management
  addTeam: (team: Omit<Team, 'id'>) => Promise<void>;
  updateTeam: (teamId: string, teamData: Partial<Team>) => Promise<void>;
  
  // Player Management
  addPlayer: (teamId: string, player: Omit<Player, 'id'>) => Promise<void>;
  updatePlayer: (teamId: string, playerId: string, playerData: Partial<Player>) => Promise<void>;
}

const MatchContext = createContext<MatchContextType | undefined>(undefined);

export const MatchProvider = ({ children }: { children: ReactNode }) => {
  const [match, setMatch] = useState<Match | null>(null);
  const [currentInnings, setCurrentInnings] = useState<Innings | null>(null);

  // Local storage helpers (easily replaceable with API calls)
  const saveToStorage = (key: string, data: any) => {
    localStorage.setItem(key, JSON.stringify(data));
  };

  const loadFromStorage = (key: string) => {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : null;
  };

  const createMatch = async (matchData: Omit<Match, 'id'>) => {
    const newMatch: Match = {
      ...matchData,
      id: Date.now().toString(),
    };
    
    setMatch(newMatch);
    saveToStorage('currentMatch', newMatch);
    
    // Initialize innings
    const innings: Innings = {
      battingTeam: newMatch.battingTeam,
      bowlingTeam: newMatch.bowlingTeam,
      score: 0,
      wickets: 0,
      overs: [],
      currentBatsmen: [
        newMatch.battingTeam === newMatch.team1.id 
          ? newMatch.team1.battingOrder[0] 
          : newMatch.team2.battingOrder[0],
        newMatch.battingTeam === newMatch.team1.id 
          ? newMatch.team1.battingOrder[1] 
          : newMatch.team2.battingOrder[1]
      ],
      currentBowler: ''
    };
    
    setCurrentInnings(innings);
    saveToStorage('currentInnings', innings);
  };

  const updateMatch = async (matchData: Partial<Match>) => {
    if (!match) return;
    
    const updatedMatch = { ...match, ...matchData };
    setMatch(updatedMatch);
    saveToStorage('currentMatch', updatedMatch);
  };

  const addBall = async (ballData: BallData) => {
    if (!currentInnings || !match) return;
    
    const updatedInnings = { ...currentInnings };
    
    // Add runs to score
    updatedInnings.score += ballData.runs + (ballData.extraRuns || 0);
    
    // Handle wicket
    if (ballData.ballType === 'wicket') {
      updatedInnings.wickets += 1;
      
      // Update batsmen if someone is out
      if (ballData.newBatsman) {
        const batsmanOutIndex = updatedInnings.currentBatsmen.findIndex(
          batsman => batsman === ballData.batsmanOut
        );
        if (batsmanOutIndex !== -1) {
          updatedInnings.currentBatsmen[batsmanOutIndex] = ballData.newBatsman;
        }
      }
    }
    
    // Add ball to current over or create new over
    const currentOverIndex = updatedInnings.overs.length - 1;
    const currentOver = updatedInnings.overs[currentOverIndex];
    
    if (!currentOver || currentOver.balls.length >= 6) {
      // Start new over
      updatedInnings.overs.push({
        overNumber: updatedInnings.overs.length + 1,
        bowler: updatedInnings.currentBowler,
        balls: [ballData]
      });
    } else {
      // Add to current over
      currentOver.balls.push(ballData);
    }
    
    setCurrentInnings(updatedInnings);
    saveToStorage('currentInnings', updatedInnings);
  };

  const addTeam = async (team: Omit<Team, 'id'>) => {
    // This would be an API call in real implementation
    const newTeam: Team = {
      ...team,
      id: Date.now().toString(),
    };
    
    saveToStorage(`team_${newTeam.id}`, newTeam);
  };

  const updateTeam = async (teamId: string, teamData: Partial<Team>) => {
    const existingTeam = loadFromStorage(`team_${teamId}`);
    if (existingTeam) {
      const updatedTeam = { ...existingTeam, ...teamData };
      saveToStorage(`team_${teamId}`, updatedTeam);
      
      // Update match if this team is part of current match
      if (match && (match.team1.id === teamId || match.team2.id === teamId)) {
        const updatedMatch = { ...match };
        if (match.team1.id === teamId) {
          updatedMatch.team1 = updatedTeam;
        } else {
          updatedMatch.team2 = updatedTeam;
        }
        setMatch(updatedMatch);
        saveToStorage('currentMatch', updatedMatch);
      }
    }
  };

  const addPlayer = async (teamId: string, player: Omit<Player, 'id'>) => {
    const team = loadFromStorage(`team_${teamId}`);
    if (team) {
      const newPlayer: Player = {
        ...player,
        id: Date.now().toString(),
      };
      
      team.players.push(newPlayer);
      saveToStorage(`team_${teamId}`, team);
    }
  };

  const updatePlayer = async (teamId: string, playerId: string, playerData: Partial<Player>) => {
    const team = loadFromStorage(`team_${teamId}`);
    if (team) {
      const playerIndex = team.players.findIndex((p: Player) => p.id === playerId);
      if (playerIndex !== -1) {
        team.players[playerIndex] = { ...team.players[playerIndex], ...playerData };
        saveToStorage(`team_${teamId}`, team);
      }
    }
  };

  return (
    <MatchContext.Provider value={{
      match,
      currentInnings,
      createMatch,
      updateMatch,
      addBall,
      addTeam,
      updateTeam,
      addPlayer,
      updatePlayer,
    }}>
      {children}
    </MatchContext.Provider>
  );
};

export const useMatch = () => {
  const context = useContext(MatchContext);
  if (!context) {
    throw new Error('useMatch must be used within MatchProvider');
  }
  return context;
};