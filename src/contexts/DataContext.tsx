import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  teamsService, 
  playersService, 
  matchesService, 
  transfersService 
} from '../services/firestore';
import { Team, Player, Match, Transfer } from '../types';

interface DataContextType {
  teams: Team[];
  players: Player[];
  matches: Match[];
  transfers: Transfer[];
  loading: boolean;
  error: string | null;
  updateMatch: (matchId: string, homeScore: number, awayScore: number, status: string) => Promise<void>;
  transferPlayer: (playerId: string, newTeamId: string) => Promise<void>;
  refreshData: () => Promise<void>;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export const useData = () => {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
};

export const DataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [teams, setTeams] = useState<Team[]>([]);
  const [players, setPlayers] = useState<Player[]>([]);
  const [matches, setMatches] = useState<Match[]>([]);
  const [transfers, setTransfers] = useState<Transfer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load initial data
  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);

      const [teamsData, playersData, matchesData, transfersData] = await Promise.all([
        teamsService.getAll(),
        playersService.getAll(),
        matchesService.getAll(),
        transfersService.getAll()
      ]);

      setTeams(teamsData);
      setPlayers(playersData);
      setMatches(matchesData);
      setTransfers(transfersData);
    } catch (err) {
      console.error('Error loading data:', err);
      setError('Failed to load data. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Set up real-time subscriptions
  useEffect(() => {
    const unsubscribeTeams = teamsService.subscribe(setTeams);
    const unsubscribePlayers = playersService.subscribe(setPlayers);
    const unsubscribeMatches = matchesService.subscribe(setMatches);
    const unsubscribeTransfers = transfersService.subscribe(setTransfers);

    // Load initial data
    loadData();

    // Cleanup subscriptions
    return () => {
      unsubscribeTeams();
      unsubscribePlayers();
      unsubscribeMatches();
      unsubscribeTransfers();
    };
  }, []);

  const updateMatch = async (matchId: string, homeScore: number, awayScore: number, status: string) => {
    try {
      await matchesService.updateScore(matchId, homeScore, awayScore, status);
      
      // Update team stats if match is finished
      if (status === 'finished') {
        const match = matches.find(m => m.id === matchId);
        if (match) {
          await updateTeamStats(match.homeTeam, match.awayTeam, homeScore, awayScore);
        }
      }
    } catch (err) {
      console.error('Error updating match:', err);
      setError('Failed to update match. Please try again.');
    }
  };

  const updateTeamStats = async (homeTeamId: string, awayTeamId: string, homeScore: number, awayScore: number) => {
    try {
      const homeTeam = teams.find(t => t.id === homeTeamId);
      const awayTeam = teams.find(t => t.id === awayTeamId);

      if (!homeTeam || !awayTeam) return;

      // Calculate results
      const homeWin = homeScore > awayScore;
      const awayWin = awayScore > homeScore;
      const draw = homeScore === awayScore;

      // Update home team stats
      const homeUpdates = {
        played: homeTeam.played + 1,
        won: homeTeam.won + (homeWin ? 1 : 0),
        drawn: homeTeam.drawn + (draw ? 1 : 0),
        lost: homeTeam.lost + (awayWin ? 1 : 0),
        goalsFor: homeTeam.goalsFor + homeScore,
        goalsAgainst: homeTeam.goalsAgainst + awayScore,
        points: homeTeam.points + (homeWin ? 3 : draw ? 1 : 0)
      };

      // Update away team stats
      const awayUpdates = {
        played: awayTeam.played + 1,
        won: awayTeam.won + (awayWin ? 1 : 0),
        drawn: awayTeam.drawn + (draw ? 1 : 0),
        lost: awayTeam.lost + (homeWin ? 1 : 0),
        goalsFor: awayTeam.goalsFor + awayScore,
        goalsAgainst: awayTeam.goalsAgainst + homeScore,
        points: awayTeam.points + (awayWin ? 3 : draw ? 1 : 0)
      };

      await Promise.all([
        teamsService.update(homeTeamId, homeUpdates),
        teamsService.update(awayTeamId, awayUpdates)
      ]);
    } catch (err) {
      console.error('Error updating team stats:', err);
    }
  };

  const transferPlayer = async (playerId: string, newTeamId: string) => {
    try {
      const player = players.find(p => p.id === playerId);
      const fromTeam = teams.find(t => t.id === player?.teamId);
      const toTeam = teams.find(t => t.id === newTeamId);

      if (!player || !fromTeam || !toTeam) {
        throw new Error('Invalid transfer data');
      }

      // Update player's team
      await playersService.transfer(playerId, newTeamId);

      // Record the transfer
      await transfersService.add({
        playerId,
        playerName: player.name,
        fromTeamId: player.teamId,
        fromTeamName: fromTeam.name,
        toTeamId: newTeamId,
        toTeamName: toTeam.name,
        value: player.value,
        date: new Date().toISOString().split('T')[0]
      });
    } catch (err) {
      console.error('Error transferring player:', err);
      setError('Failed to transfer player. Please try again.');
    }
  };

  const refreshData = async () => {
    await loadData();
  };

  return (
    <DataContext.Provider value={{
      teams,
      players,
      matches,
      transfers,
      loading,
      error,
      updateMatch,
      transferPlayer,
      refreshData
    }}>
      {children}
    </DataContext.Provider>
  );
};