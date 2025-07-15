import React, { createContext, useContext, useState, useEffect } from 'react';

interface Team {
  id: string;
  name: string;
  logo: string;
  primaryColor: string;
  secondaryColor: string;
  played: number;
  won: number;
  drawn: number;
  lost: number;
  goalsFor: number;
  goalsAgainst: number;
  points: number;
}

interface Player {
  id: string;
  name: string;
  position: string;
  teamId: string;
  age: number;
  goals: number;
  assists: number;
  yellowCards: number;
  redCards: number;
  avatar: string;
  value: number;
  nationality: string;
}

interface Match {
  id: string;
  homeTeam: string;
  awayTeam: string;
  homeScore: number;
  awayScore: number;
  date: string;
  time: string;
  status: 'scheduled' | 'live' | 'finished';
  venue: string;
}

interface DataContextType {
  teams: Team[];
  players: Player[];
  matches: Match[];
  updateMatch: (matchId: string, homeScore: number, awayScore: number, status: string) => void;
  transferPlayer: (playerId: string, newTeamId: string) => void;
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
  const [teams, setTeams] = useState<Team[]>([
    {
      id: '1',
      name: 'Thunder Bolts',
      logo: '⚡',
      primaryColor: '#3B82F6',
      secondaryColor: '#1E40AF',
      played: 8,
      won: 6,
      drawn: 1,
      lost: 1,
      goalsFor: 18,
      goalsAgainst: 8,
      points: 19
    },
    {
      id: '2',
      name: 'Green Eagles',
      logo: '🦅',
      primaryColor: '#10B981',
      secondaryColor: '#047857',
      played: 8,
      won: 5,
      drawn: 2,
      lost: 1,
      goalsFor: 16,
      goalsAgainst: 9,
      points: 17
    },
    {
      id: '3',
      name: 'Purple Panthers',
      logo: '🐆',
      primaryColor: '#8B5CF6',
      secondaryColor: '#6D28D9',
      played: 8,
      won: 4,
      drawn: 2,
      lost: 2,
      goalsFor: 14,
      goalsAgainst: 11,
      points: 14
    },
    {
      id: '4',
      name: 'Fire Dragons',
      logo: '🐉',
      primaryColor: '#EF4444',
      secondaryColor: '#DC2626',
      played: 8,
      won: 3,
      drawn: 3,
      lost: 2,
      goalsFor: 12,
      goalsAgainst: 10,
      points: 12
    },
    {
      id: '5',
      name: 'Golden Lions',
      logo: '🦁',
      primaryColor: '#F59E0B',
      secondaryColor: '#D97706',
      played: 8,
      won: 3,
      drawn: 2,
      lost: 3,
      goalsFor: 11,
      goalsAgainst: 13,
      points: 11
    },
    {
      id: '6',
      name: 'Silver Sharks',
      logo: '🦈',
      primaryColor: '#6B7280',
      secondaryColor: '#4B5563',
      played: 8,
      won: 2,
      drawn: 1,
      lost: 5,
      goalsFor: 8,
      goalsAgainst: 16,
      points: 7
    },
    {
      id: '7',
      name: 'Blue Wolves',
      logo: '🐺',
      primaryColor: '#0EA5E9',
      secondaryColor: '#0284C7',
      played: 8,
      won: 1,
      drawn: 3,
      lost: 4,
      goalsFor: 7,
      goalsAgainst: 15,
      points: 6
    },
    {
      id: '8',
      name: 'Black Tigers',
      logo: '🐅',
      primaryColor: '#1F2937',
      secondaryColor: '#111827',
      played: 8,
      won: 1,
      drawn: 2,
      lost: 5,
      goalsFor: 6,
      goalsAgainst: 18,
      points: 5
    }
  ]);

  const [players, setPlayers] = useState<Player[]>([
    { id: '1', name: 'Marcus Johnson', position: 'Forward', teamId: '1', age: 24, goals: 8, assists: 3, yellowCards: 1, redCards: 0, avatar: 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=400', value: 85000, nationality: 'USA' },
    { id: '2', name: 'David Silva', position: 'Midfielder', teamId: '1', age: 26, goals: 4, assists: 6, yellowCards: 2, redCards: 0, avatar: 'https://images.pexels.com/photos/1681010/pexels-photo-1681010.jpeg?auto=compress&cs=tinysrgb&w=400', value: 92000, nationality: 'Spain' },
    { id: '3', name: 'Alex Thompson', position: 'Defender', teamId: '1', age: 28, goals: 2, assists: 1, yellowCards: 3, redCards: 0, avatar: 'https://images.pexels.com/photos/1043471/pexels-photo-1043471.jpeg?auto=compress&cs=tinysrgb&w=400', value: 78000, nationality: 'England' },
    { id: '4', name: 'Carlos Rodriguez', position: 'Forward', teamId: '2', age: 23, goals: 7, assists: 4, yellowCards: 1, redCards: 0, avatar: 'https://images.pexels.com/photos/1516680/pexels-photo-1516680.jpeg?auto=compress&cs=tinysrgb&w=400', value: 88000, nationality: 'Brazil' },
    { id: '5', name: 'James Wilson', position: 'Goalkeeper', teamId: '2', age: 29, goals: 0, assists: 0, yellowCards: 0, redCards: 0, avatar: 'https://images.pexels.com/photos/1300402/pexels-photo-1300402.jpeg?auto=compress&cs=tinysrgb&w=400', value: 65000, nationality: 'Scotland' },
    { id: '6', name: 'Mohammed Ali', position: 'Midfielder', teamId: '3', age: 25, goals: 5, assists: 5, yellowCards: 2, redCards: 0, avatar: 'https://images.pexels.com/photos/1559486/pexels-photo-1559486.jpeg?auto=compress&cs=tinysrgb&w=400', value: 82000, nationality: 'Morocco' },
    { id: '7', name: 'Lucas Santos', position: 'Forward', teamId: '3', age: 22, goals: 6, assists: 2, yellowCards: 1, redCards: 1, avatar: 'https://images.pexels.com/photos/1040881/pexels-photo-1040881.jpeg?auto=compress&cs=tinysrgb&w=400', value: 79000, nationality: 'Portugal' },
    { id: '8', name: 'Ryan O\'Connor', position: 'Defender', teamId: '4', age: 27, goals: 1, assists: 3, yellowCards: 4, redCards: 0, avatar: 'https://images.pexels.com/photos/1438761/pexels-photo-1438761.jpeg?auto=compress&cs=tinysrgb&w=400', value: 71000, nationality: 'Ireland' }
  ]);

  const [matches, setMatches] = useState<Match[]>([
    { id: '1', homeTeam: '1', awayTeam: '2', homeScore: 2, awayScore: 1, date: '2024-01-15', time: '19:00', status: 'finished', venue: 'Central Park Turf' },
    { id: '2', homeTeam: '3', awayTeam: '4', homeScore: 1, awayScore: 1, date: '2024-01-15', time: '20:30', status: 'finished', venue: 'Sports Complex A' },
    { id: '3', homeTeam: '5', awayTeam: '6', homeScore: 3, awayScore: 0, date: '2024-01-16', time: '19:00', status: 'finished', venue: 'Green Valley Turf' },
    { id: '4', homeTeam: '7', awayTeam: '8', homeScore: 0, awayScore: 2, date: '2024-01-16', time: '20:30', status: 'finished', venue: 'Stadium View' },
    { id: '5', homeTeam: '2', awayTeam: '3', homeScore: 0, awayScore: 0, date: '2024-01-22', time: '19:00', status: 'live', venue: 'Central Park Turf' },
    { id: '6', homeTeam: '1', awayTeam: '4', homeScore: 0, awayScore: 0, date: '2024-01-22', time: '20:30', status: 'scheduled', venue: 'Sports Complex A' },
    { id: '7', homeTeam: '6', awayTeam: '7', homeScore: 0, awayScore: 0, date: '2024-01-23', time: '19:00', status: 'scheduled', venue: 'Green Valley Turf' },
    { id: '8', homeTeam: '8', awayTeam: '5', homeScore: 0, awayScore: 0, date: '2024-01-23', time: '20:30', status: 'scheduled', venue: 'Stadium View' }
  ]);

  const updateMatch = (matchId: string, homeScore: number, awayScore: number, status: string) => {
    setMatches(prev => prev.map(match => 
      match.id === matchId 
        ? { ...match, homeScore, awayScore, status: status as 'scheduled' | 'live' | 'finished' }
        : match
    ));
  };

  const transferPlayer = (playerId: string, newTeamId: string) => {
    setPlayers(prev => prev.map(player => 
      player.id === playerId ? { ...player, teamId: newTeamId } : player
    ));
  };

  return (
    <DataContext.Provider value={{
      teams,
      players,
      matches,
      updateMatch,
      transferPlayer
    }}>
      {children}
    </DataContext.Provider>
  );
};