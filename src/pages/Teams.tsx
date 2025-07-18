import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Users, Trophy, Target, Shield, TrendingUp } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';
import { useData } from '../contexts/DataContext';

const Teams: React.FC = () => {
  const { darkMode } = useTheme();
  const { teams, players } = useData();
  const [selectedTeam, setSelectedTeam] = useState<string | null>(null);

  const getTeamPlayers = (teamId: string) => {
    return players.filter(player => player.teamId === teamId);
  };

  const getTeamTopScorer = (teamId: string) => {
    const teamPlayers = getTeamPlayers(teamId);
    return teamPlayers.reduce((top, player) => 
      player.goals > top.goals ? player : top
    , teamPlayers[0]);
  };

  return (
    <div className={`min-h-screen ${darkMode ? 'text-white' : 'text-gray-900'} pt-8`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            <span className="bg-gradient-to-r from-purple-400 via-blue-500 to-green-400 bg-clip-text text-transparent">
              Teams
            </span>
          </h1>
          <p className={`text-xl ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
            Meet the warriors of the Leisure Park Turf League
          </p>
        </div>

        {/* Teams Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {teams.map((team) => {
            const teamPlayers = getTeamPlayers(team.id);
            const topScorer = getTeamTopScorer(team.id);
            
            return (
              <div
                key={team.id}
                className={`${darkMode ? 'bg-slate-800' : 'bg-white'} rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 overflow-hidden cursor-pointer`}
                onClick={() => setSelectedTeam(selectedTeam === team.id ? null : team.id)}
              >
                {/* Team Header */}
                <div 
                  className="p-6 text-white relative overflow-hidden"
                  style={{
                    background: `linear-gradient(135deg, ${team.primaryColor} 0%, ${team.secondaryColor} 100%)`
                  }}
                >
                  <div className="absolute top-2 right-2 opacity-30">
                    <img 
                      src={team.logo} 
                      alt={`${team.name} logo`}
                      className="w-16 h-16 object-contain rounded-lg"
                    />
                  </div>
                  <div className="relative z-10">
                    <div className="flex items-center space-x-3 mb-2">
                      <img 
                        src={team.logo} 
                        alt={`${team.name} logo`}
                        className="w-12 h-12 object-contain rounded-lg border-2 border-white/20"
                      />
                      <h2 className="text-xl font-bold">{team.name}</h2>
                    </div>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <p className="opacity-80">Position</p>
                        <p className="font-bold">
                          #{teams.sort((a, b) => b.points - a.points).findIndex(t => t.id === team.id) + 1}
                        </p>
                      </div>
                      <div>
                        <p className="opacity-80">Points</p>
                        <p className="font-bold">{team.points}</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Team Stats */}
                <div className="p-6">
                  <div className="grid grid-cols-3 gap-4 mb-4">
                    <div className="text-center">
                      <div className="flex items-center justify-center mb-2">
                        <Trophy className="h-5 w-5 text-green-500" />
                      </div>
                      <p className="text-2xl font-bold text-green-500">{team.won}</p>
                      <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Wins</p>
                    </div>
                    <div className="text-center">
                      <div className="flex items-center justify-center mb-2">
                        <Shield className="h-5 w-5 text-blue-500" />
                      </div>
                      <p className="text-2xl font-bold text-blue-500">{team.drawn}</p>
                      <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Draws</p>
                    </div>
                    <div className="text-center">
                      <div className="flex items-center justify-center mb-2">
                        <Target className="h-5 w-5 text-red-500" />
                      </div>
                      <p className="text-2xl font-bold text-red-500">{team.lost}</p>
                      <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Losses</p>
                    </div>
                  </div>

                  <div className="flex justify-between items-center mb-4">
                    <div className="text-center">
                      <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Goals For</p>
                      <p className="text-lg font-bold text-green-500">{team.goalsFor}</p>
                    </div>
                    <div className="text-center">
                      <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Goals Against</p>
                      <p className="text-lg font-bold text-red-500">{team.goalsAgainst}</p>
                    </div>
                    <div className="text-center">
                      <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Goal Diff</p>
                      <p className={`text-lg font-bold ${team.goalsFor - team.goalsAgainst >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                        {team.goalsFor - team.goalsAgainst >= 0 ? '+' : ''}{team.goalsFor - team.goalsAgainst}
                      </p>
                    </div>
                  </div>

                  {/* Top Scorer */}
                  {topScorer && (
                    <div className={`${darkMode ? 'bg-slate-700' : 'bg-gray-50'} rounded-lg p-3 mb-4`}>
                      <div className="flex items-center space-x-3">
                        <img
                          src={topScorer.avatar}
                          alt={topScorer.name}
                          className="w-8 h-8 rounded-full"
                        />
                        <div className="flex-1">
                          <p className="font-semibold text-sm">{topScorer.name}</p>
                          <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                            Top Scorer
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="font-bold text-purple-500">{topScorer.goals}</p>
                          <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                            Goals
                          </p>
                        </div>
                      </div>
                    </div>
                  )}

                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-1">
                      <Users className="h-4 w-4 text-gray-500" />
                      <span className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                        {teamPlayers.length} Players
                      </span>
                    </div>
                    <button className="bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-300 transform hover:scale-105">
                      View Details
                    </button>
                  </div>
                </div>

                {/* Expanded Team Details */}
                {selectedTeam === team.id && (
                  <div className={`${darkMode ? 'bg-slate-700' : 'bg-gray-50'} border-t p-6`}>
                    <h3 className="font-bold mb-4">Squad</h3>
                    <div className="space-y-3 max-h-64 overflow-y-auto">
                      {teamPlayers.map((player) => (
                        <Link
                          key={player.id}
                          to={`/player/${player.id}`}
                          className={`flex items-center space-x-3 p-3 rounded-lg ${darkMode ? 'bg-slate-800 hover:bg-slate-600' : 'bg-white hover:bg-gray-100'} transition-colors duration-200`}
                        >
                          <img
                            src={player.avatar}
                            alt={player.name}
                            className="w-10 h-10 rounded-full"
                          />
                          <div className="flex-1">
                            <p className="font-semibold">{player.name}</p>
                            <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                              {player.position}
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="font-bold text-purple-500">{player.goals}</p>
                            <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                              Goals
                            </p>
                          </div>
                        </Link>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Teams;