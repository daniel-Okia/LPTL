import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Trophy, Target, Calendar, Flag, DollarSign, Award, TrendingUp } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';
import { useData } from '../contexts/DataContext';

const PlayerProfile: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { darkMode } = useTheme();
  const { players, teams, matches } = useData();

  const player = players.find(p => p.id === id);
  const team = teams.find(t => t.id === player?.teamId);

  if (!player) {
    return (
      <div className={`min-h-screen ${darkMode ? 'text-white' : 'text-gray-900'} pt-8`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center py-12">
            <h1 className="text-2xl font-bold mb-4">Player Not Found</h1>
            <Link
              to="/players"
              className="bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white px-6 py-3 rounded-lg font-semibold transition-all duration-300 transform hover:scale-105"
            >
              Back to Players
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const playerMatches = matches.filter(match => 
    match.homeTeam === player.teamId || match.awayTeam === player.teamId
  );

  const recentMatches = playerMatches
    .filter(match => match.status === 'finished')
    .slice(-5);

  return (
    <div className={`min-h-screen ${darkMode ? 'text-white' : 'text-gray-900'} pt-8`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back Button */}
        <Link
          to="/players"
          className="inline-flex items-center space-x-2 mb-8 text-purple-500 hover:text-purple-600 transition-colors duration-200"
        >
          <ArrowLeft className="h-5 w-5" />
          <span>Back to Players</span>
        </Link>

        {/* Player Header */}
        <div className={`${darkMode ? 'bg-slate-800' : 'bg-white'} rounded-xl shadow-lg overflow-hidden mb-8`}>
          <div className="relative h-64 bg-gradient-to-br from-purple-500 via-blue-500 to-green-500 p-8">
            <div className="absolute top-6 right-6 flex items-center space-x-2">
              <Flag className="h-5 w-5 text-white" />
              <span className="text-white font-semibold">{player.nationality}</span>
            </div>
            <div className="flex items-center space-x-8 h-full">
              <img
                src={player.avatar}
                alt={player.name}
                className="w-32 h-32 rounded-full border-4 border-white shadow-lg"
              />
              <div className="text-white">
                <h1 className="text-4xl font-bold mb-2">{player.name}</h1>
                <p className="text-xl mb-2">{player.position}</p>
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-2">
                    <span className="text-2xl">{team?.logo}</span>
                    <span className="text-lg font-semibold">{team?.name}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Calendar className="h-5 w-5" />
                    <span>{player.age} years old</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Stats Cards */}
          <div className="lg:col-span-2 space-y-6">
            {/* Performance Stats */}
            <div className={`${darkMode ? 'bg-slate-800' : 'bg-white'} rounded-xl shadow-lg p-6`}>
              <h2 className="text-2xl font-bold mb-6">Performance Stats</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                <div className="text-center">
                  <div className="flex items-center justify-center mb-3">
                    <div className="bg-gradient-to-r from-yellow-400 to-yellow-600 p-3 rounded-lg">
                      <Trophy className="h-6 w-6 text-white" />
                    </div>
                  </div>
                  <p className="text-3xl font-bold text-yellow-500">{player.goals}</p>
                  <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Goals</p>
                </div>
                
                <div className="text-center">
                  <div className="flex items-center justify-center mb-3">
                    <div className="bg-gradient-to-r from-blue-400 to-blue-600 p-3 rounded-lg">
                      <Target className="h-6 w-6 text-white" />
                    </div>
                  </div>
                  <p className="text-3xl font-bold text-blue-500">{player.assists}</p>
                  <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Assists</p>
                </div>
                
                <div className="text-center">
                  <div className="flex items-center justify-center mb-3">
                    <div className="w-6 h-8 bg-yellow-400 rounded-sm mx-auto"></div>
                  </div>
                  <p className="text-3xl font-bold text-yellow-500">{player.yellowCards}</p>
                  <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Yellow Cards</p>
                </div>
                
                <div className="text-center">
                  <div className="flex items-center justify-center mb-3">
                    <div className="w-6 h-8 bg-red-500 rounded-sm mx-auto"></div>
                  </div>
                  <p className="text-3xl font-bold text-red-500">{player.redCards}</p>
                  <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Red Cards</p>
                </div>
              </div>
            </div>

            {/* Recent Matches */}
            <div className={`${darkMode ? 'bg-slate-800' : 'bg-white'} rounded-xl shadow-lg p-6`}>
              <h2 className="text-2xl font-bold mb-6">Recent Matches</h2>
              <div className="space-y-4">
                {recentMatches.map((match) => {
                  const homeTeam = teams.find(t => t.id === match.homeTeam);
                  const awayTeam = teams.find(t => t.id === match.awayTeam);
                  const isHomeTeam = match.homeTeam === player.teamId;
                  const result = match.homeScore > match.awayScore ? 'home' : 
                               match.awayScore > match.homeScore ? 'away' : 'draw';
                  const playerResult = isHomeTeam ? 
                    (result === 'home' ? 'W' : result === 'away' ? 'L' : 'D') :
                    (result === 'away' ? 'W' : result === 'home' ? 'L' : 'D');
                  
                  return (
                    <div key={match.id} className={`${darkMode ? 'bg-slate-700' : 'bg-gray-50'} rounded-lg p-4`}>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-white ${
                            playerResult === 'W' ? 'bg-green-500' :
                            playerResult === 'L' ? 'bg-red-500' : 'bg-yellow-500'
                          }`}>
                            {playerResult}
                          </div>
                          <div className="flex items-center space-x-3">
                            <span className="text-lg">{homeTeam?.logo}</span>
                            <span className="font-semibold">{homeTeam?.name}</span>
                            <span className="text-xl font-bold">
                              {match.homeScore} - {match.awayScore}
                            </span>
                            <span className="font-semibold">{awayTeam?.name}</span>
                            <span className="text-lg">{awayTeam?.logo}</span>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                            {new Date(match.date).toLocaleDateString()}
                          </p>
                          <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                            {match.venue}
                          </p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Market Value */}
            <div className={`${darkMode ? 'bg-slate-800' : 'bg-white'} rounded-xl shadow-lg p-6`}>
              <div className="flex items-center space-x-3 mb-4">
                <DollarSign className="h-6 w-6 text-green-500" />
                <h3 className="text-xl font-bold">Market Value</h3>
              </div>
              <p className="text-3xl font-bold bg-gradient-to-r from-green-500 to-teal-500 bg-clip-text text-transparent">
                UGX {player.value.toLocaleString()}
              </p>
              <div className="flex items-center space-x-2 mt-2">
                <TrendingUp className="h-4 w-4 text-green-500" />
                <span className="text-sm text-green-500">Market Value</span>
              </div>
            </div>

            {/* Team Info */}
            <div className={`${darkMode ? 'bg-slate-800' : 'bg-white'} rounded-xl shadow-lg p-6`}>
              <h3 className="text-xl font-bold mb-4">Current Team</h3>
              <div className="flex items-center space-x-4 mb-4">
                <div 
                  className="w-16 h-16 rounded-full flex items-center justify-center text-white font-bold text-2xl"
                  style={{ backgroundColor: team?.primaryColor }}
                >
                  {team?.logo}
                </div>
                <div>
                  <h4 className="text-lg font-bold">{team?.name}</h4>
                  <p className={`${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                    Position: #{teams.sort((a, b) => b.points - a.points).findIndex(t => t.id === team?.id) + 1}
                  </p>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-2 text-center text-sm">
                <div>
                  <p className="font-semibold text-green-500">{team?.won}</p>
                  <p className={`${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Wins</p>
                </div>
                <div>
                  <p className="font-semibold text-yellow-500">{team?.drawn}</p>
                  <p className={`${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Draws</p>
                </div>
                <div>
                  <p className="font-semibold text-red-500">{team?.lost}</p>
                  <p className={`${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Losses</p>
                </div>
              </div>
            </div>

            {/* Achievements */}
            <div className={`${darkMode ? 'bg-slate-800' : 'bg-white'} rounded-xl shadow-lg p-6`}>
              <div className="flex items-center space-x-3 mb-4">
                <Award className="h-6 w-6 text-purple-500" />
                <h3 className="text-xl font-bold">Achievements</h3>
              </div>
              <div className="space-y-3">
                {player.goals >= 5 && (
                  <div className="flex items-center space-x-3 p-3 rounded-lg bg-yellow-50 dark:bg-yellow-900/20">
                    <Trophy className="h-5 w-5 text-yellow-500" />
                    <span className="text-sm font-semibold">Top Scorer</span>
                  </div>
                )}
                {player.assists >= 3 && (
                  <div className="flex items-center space-x-3 p-3 rounded-lg bg-blue-50 dark:bg-blue-900/20">
                    <Target className="h-5 w-5 text-blue-500" />
                    <span className="text-sm font-semibold">Playmaker</span>
                  </div>
                )}
                {player.redCards === 0 && (
                  <div className="flex items-center space-x-3 p-3 rounded-lg bg-green-50 dark:bg-green-900/20">
                    <Award className="h-5 w-5 text-green-500" />
                    <span className="text-sm font-semibold">Fair Play</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PlayerProfile;