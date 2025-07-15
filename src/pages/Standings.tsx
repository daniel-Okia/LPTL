import React, { useState } from 'react';
import { Trophy, TrendingUp, Target, Shield } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';
import { useData } from '../contexts/DataContext';

const Standings: React.FC = () => {
  const { darkMode } = useTheme();
  const { teams } = useData();
  const [selectedTeam, setSelectedTeam] = useState<string | null>(null);

  const sortedTeams = [...teams].sort((a, b) => {
    if (b.points !== a.points) return b.points - a.points;
    const goalDiffA = a.goalsFor - a.goalsAgainst;
    const goalDiffB = b.goalsFor - b.goalsAgainst;
    if (goalDiffB !== goalDiffA) return goalDiffB - goalDiffA;
    return b.goalsFor - a.goalsFor;
  });

  const getPositionColor = (position: number) => {
    if (position === 1) return 'from-yellow-400 to-yellow-600';
    if (position === 2) return 'from-gray-400 to-gray-600';
    if (position === 3) return 'from-orange-400 to-orange-600';
    if (position <= 4) return 'from-green-400 to-green-600';
    if (position >= teams.length - 2) return 'from-red-400 to-red-600';
    return 'from-blue-400 to-blue-600';
  };

  const getPositionIcon = (position: number) => {
    if (position === 1) return <Trophy className="h-4 w-4 text-yellow-100" />;
    if (position <= 4) return <TrendingUp className="h-4 w-4 text-white" />;
    if (position >= teams.length - 2) return <Target className="h-4 w-4 text-white" />;
    return <Shield className="h-4 w-4 text-white" />;
  };

  const getPositionText = (position: number) => {
    if (position === 1) return 'Champion';
    if (position <= 4) return 'Top 4';
    if (position >= teams.length - 2) return 'Relegation';
    return 'Mid Table';
  };

  return (
    <div className={`min-h-screen ${darkMode ? 'text-white' : 'text-gray-900'} pt-8`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            <span className="bg-gradient-to-r from-purple-400 via-blue-500 to-green-400 bg-clip-text text-transparent">
              League Standings
            </span>
          </h1>
          <p className={`text-xl ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
            Current position of all teams in the Leisure Park Turf League
          </p>
        </div>

        {/* League Table */}
        <div className={`${darkMode ? 'bg-slate-800' : 'bg-white'} rounded-xl shadow-lg overflow-hidden mb-8`}>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gradient-to-r from-purple-500 to-blue-500 text-white">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-semibold uppercase tracking-wider">Position</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold uppercase tracking-wider">Team</th>
                  <th className="px-6 py-4 text-center text-sm font-semibold uppercase tracking-wider">P</th>
                  <th className="px-6 py-4 text-center text-sm font-semibold uppercase tracking-wider">W</th>
                  <th className="px-6 py-4 text-center text-sm font-semibold uppercase tracking-wider">D</th>
                  <th className="px-6 py-4 text-center text-sm font-semibold uppercase tracking-wider">L</th>
                  <th className="px-6 py-4 text-center text-sm font-semibold uppercase tracking-wider">GF</th>
                  <th className="px-6 py-4 text-center text-sm font-semibold uppercase tracking-wider">GA</th>
                  <th className="px-6 py-4 text-center text-sm font-semibold uppercase tracking-wider">GD</th>
                  <th className="px-6 py-4 text-center text-sm font-semibold uppercase tracking-wider">Points</th>
                </tr>
              </thead>
              <tbody className={`${darkMode ? 'bg-slate-800' : 'bg-white'} divide-y ${darkMode ? 'divide-slate-700' : 'divide-gray-200'}`}>
                {sortedTeams.map((team, index) => {
                  const position = index + 1;
                  const goalDifference = team.goalsFor - team.goalsAgainst;
                  
                  return (
                    <tr
                      key={team.id}
                      className={`transition-all duration-200 cursor-pointer ${
                        selectedTeam === team.id
                          ? 'bg-purple-50 dark:bg-purple-900/20'
                          : 'hover:bg-gray-50 dark:hover:bg-slate-700'
                      }`}
                      onClick={() => setSelectedTeam(selectedTeam === team.id ? null : team.id)}
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center space-x-3">
                          <div className={`w-8 h-8 rounded-full bg-gradient-to-r ${getPositionColor(position)} flex items-center justify-center font-bold text-white text-sm`}>
                            {position}
                          </div>
                          <div className="flex items-center space-x-2">
                            {getPositionIcon(position)}
                            <span className={`text-xs font-medium ${
                              position === 1 ? 'text-yellow-600' :
                              position <= 4 ? 'text-green-600' :
                              position >= teams.length - 2 ? 'text-red-600' :
                              'text-blue-600'
                            }`}>
                              {getPositionText(position)}
                            </span>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center space-x-4">
                          <div 
                            className="w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-lg"
                            style={{ backgroundColor: team.primaryColor }}
                          >
                            {team.logo}
                          </div>
                          <div>
                            <div className="font-bold text-lg">{team.name}</div>
                            <div className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                              {team.played} matches played
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-center font-medium">{team.played}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-center">
                        <span className="text-green-600 font-semibold">{team.won}</span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-center">
                        <span className="text-yellow-600 font-semibold">{team.drawn}</span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-center">
                        <span className="text-red-600 font-semibold">{team.lost}</span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-center">
                        <span className="text-green-600 font-semibold">{team.goalsFor}</span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-center">
                        <span className="text-red-600 font-semibold">{team.goalsAgainst}</span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-center">
                        <span className={`font-semibold ${goalDifference >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                          {goalDifference >= 0 ? '+' : ''}{goalDifference}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-center">
                        <span className="text-2xl font-bold bg-gradient-to-r from-purple-500 to-blue-500 bg-clip-text text-transparent">
                          {team.points}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Team Details */}
        {selectedTeam && (
          <div className="mb-8">
            {(() => {
              const team = teams.find(t => t.id === selectedTeam);
              const position = sortedTeams.findIndex(t => t.id === selectedTeam) + 1;
              if (!team) return null;
              
              return (
                <div className={`${darkMode ? 'bg-slate-800' : 'bg-white'} rounded-xl shadow-lg p-6`}>
                  <div className="flex items-center space-x-4 mb-6">
                    <div 
                      className="w-16 h-16 rounded-full flex items-center justify-center text-white font-bold text-2xl"
                      style={{ backgroundColor: team.primaryColor }}
                    >
                      {team.logo}
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold">{team.name}</h2>
                      <p className={`${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                        Position: {position} | Points: {team.points}
                      </p>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4">
                    <div className="text-center">
                      <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'} mb-1`}>Played</p>
                      <p className="text-2xl font-bold">{team.played}</p>
                    </div>
                    <div className="text-center">
                      <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'} mb-1`}>Won</p>
                      <p className="text-2xl font-bold text-green-500">{team.won}</p>
                    </div>
                    <div className="text-center">
                      <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'} mb-1`}>Drawn</p>
                      <p className="text-2xl font-bold text-yellow-500">{team.drawn}</p>
                    </div>
                    <div className="text-center">
                      <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'} mb-1`}>Lost</p>
                      <p className="text-2xl font-bold text-red-500">{team.lost}</p>
                    </div>
                    <div className="text-center">
                      <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'} mb-1`}>Goals For</p>
                      <p className="text-2xl font-bold text-green-500">{team.goalsFor}</p>
                    </div>
                    <div className="text-center">
                      <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'} mb-1`}>Goals Against</p>
                      <p className="text-2xl font-bold text-red-500">{team.goalsAgainst}</p>
                    </div>
                    <div className="text-center">
                      <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'} mb-1`}>Goal Difference</p>
                      <p className={`text-2xl font-bold ${team.goalsFor - team.goalsAgainst >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                        {team.goalsFor - team.goalsAgainst >= 0 ? '+' : ''}{team.goalsFor - team.goalsAgainst}
                      </p>
                    </div>
                    <div className="text-center">
                      <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'} mb-1`}>Points</p>
                      <p className="text-2xl font-bold bg-gradient-to-r from-purple-500 to-blue-500 bg-clip-text text-transparent">
                        {team.points}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })()}
          </div>
        )}

        {/* Legend */}
        <div className={`${darkMode ? 'bg-slate-800' : 'bg-white'} rounded-xl shadow-lg p-6`}>
          <h3 className="text-lg font-bold mb-4">Position Legend</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="flex items-center space-x-2">
              <div className="w-6 h-6 rounded-full bg-gradient-to-r from-yellow-400 to-yellow-600 flex items-center justify-center">
                <Trophy className="h-3 w-3 text-yellow-100" />
              </div>
              <span className="text-sm">Champion</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-6 h-6 rounded-full bg-gradient-to-r from-green-400 to-green-600 flex items-center justify-center">
                <TrendingUp className="h-3 w-3 text-white" />
              </div>
              <span className="text-sm">Top 4</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-6 h-6 rounded-full bg-gradient-to-r from-blue-400 to-blue-600 flex items-center justify-center">
                <Shield className="h-3 w-3 text-white" />
              </div>
              <span className="text-sm">Mid Table</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-6 h-6 rounded-full bg-gradient-to-r from-red-400 to-red-600 flex items-center justify-center">
                <Target className="h-3 w-3 text-white" />
              </div>
              <span className="text-sm">Relegation</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Standings;