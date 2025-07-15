import React from 'react';
import { Link } from 'react-router-dom';
import { Trophy, Users, Calendar, TrendingUp, Play, Star } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';
import { useData } from '../contexts/DataContext';

const Home: React.FC = () => {
  const { darkMode } = useTheme();
  const { teams, players, matches } = useData();

  const liveMatches = matches.filter(match => match.status === 'live');
  const upcomingMatches = matches.filter(match => match.status === 'scheduled').slice(0, 3);
  const topScorers = players.sort((a, b) => b.goals - a.goals).slice(0, 5);
  const topTeams = teams.sort((a, b) => b.points - a.points).slice(0, 4);

  return (
    <div className={`min-h-screen ${darkMode ? 'text-white' : 'text-gray-900'}`}>
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-purple-600/20 via-blue-600/20 to-green-600/20"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center">
            <h1 className="text-5xl md:text-7xl font-bold mb-6">
              <span className="bg-gradient-to-r from-purple-400 via-blue-500 to-green-400 bg-clip-text text-transparent">
                LEISURE PARK
              </span>
              <br />
              <span className="bg-gradient-to-r from-green-400 via-purple-500 to-blue-400 bg-clip-text text-transparent">
                TURF LEAGUE
              </span>
            </h1>
            <p className={`text-xl md:text-2xl mb-8 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
              The Premier Football Experience in Your Neighborhood
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/teams"
                className="bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white px-8 py-4 rounded-lg font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
              >
                View Teams
              </Link>
              <Link
                to="/fixtures"
                className="bg-gradient-to-r from-green-500 to-teal-500 hover:from-green-600 hover:to-teal-600 text-white px-8 py-4 rounded-lg font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
              >
                Match Fixtures
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Live Matches */}
      {liveMatches.length > 0 && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex items-center mb-6">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
              <h2 className="text-3xl font-bold">Live Matches</h2>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {liveMatches.map((match) => {
              const homeTeam = teams.find(t => t.id === match.homeTeam);
              const awayTeam = teams.find(t => t.id === match.awayTeam);
              return (
                <div key={match.id} className={`${darkMode ? 'bg-slate-800' : 'bg-white'} rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border-2 border-red-500/30`}>
                  <div className="flex justify-between items-center mb-4">
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                      <span className="text-red-500 font-semibold text-sm">LIVE</span>
                    </div>
                    <span className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                      {match.time}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <span className="text-2xl">{homeTeam?.logo}</span>
                      <span className="font-semibold">{homeTeam?.name}</span>
                    </div>
                    <div className="text-2xl font-bold bg-gradient-to-r from-purple-500 to-blue-500 bg-clip-text text-transparent">
                      {match.homeScore} - {match.awayScore}
                    </div>
                    <div className="flex items-center space-x-3">
                      <span className="font-semibold">{awayTeam?.name}</span>
                      <span className="text-2xl">{awayTeam?.logo}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Quick Stats */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className={`${darkMode ? 'bg-slate-800' : 'bg-white'} rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105`}>
            <div className="flex items-center justify-between">
              <div>
                <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Total Teams</p>
                <p className="text-3xl font-bold bg-gradient-to-r from-purple-500 to-blue-500 bg-clip-text text-transparent">
                  {teams.length}
                </p>
              </div>
              <div className="bg-gradient-to-r from-purple-500 to-blue-500 p-3 rounded-lg">
                <Users className="h-6 w-6 text-white" />
              </div>
            </div>
          </div>
          
          <div className={`${darkMode ? 'bg-slate-800' : 'bg-white'} rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105`}>
            <div className="flex items-center justify-between">
              <div>
                <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Total Players</p>
                <p className="text-3xl font-bold bg-gradient-to-r from-green-500 to-teal-500 bg-clip-text text-transparent">
                  {players.length}
                </p>
              </div>
              <div className="bg-gradient-to-r from-green-500 to-teal-500 p-3 rounded-lg">
                <Star className="h-6 w-6 text-white" />
              </div>
            </div>
          </div>
          
          <div className={`${darkMode ? 'bg-slate-800' : 'bg-white'} rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105`}>
            <div className="flex items-center justify-between">
              <div>
                <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Matches Played</p>
                <p className="text-3xl font-bold bg-gradient-to-r from-orange-500 to-red-500 bg-clip-text text-transparent">
                  {matches.filter(m => m.status === 'finished').length}
                </p>
              </div>
              <div className="bg-gradient-to-r from-orange-500 to-red-500 p-3 rounded-lg">
                <Calendar className="h-6 w-6 text-white" />
              </div>
            </div>
          </div>
          
          <div className={`${darkMode ? 'bg-slate-800' : 'bg-white'} rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105`}>
            <div className="flex items-center justify-between">
              <div>
                <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Total Goals</p>
                <p className="text-3xl font-bold bg-gradient-to-r from-pink-500 to-purple-500 bg-clip-text text-transparent">
                  {teams.reduce((sum, team) => sum + team.goalsFor, 0)}
                </p>
              </div>
              <div className="bg-gradient-to-r from-pink-500 to-purple-500 p-3 rounded-lg">
                <Trophy className="h-6 w-6 text-white" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* League Table Preview */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-3xl font-bold">League Standings</h2>
          <Link
            to="/standings"
            className="bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white px-6 py-2 rounded-lg font-semibold transition-all duration-300 transform hover:scale-105"
          >
            View Full Table
          </Link>
        </div>
        <div className={`${darkMode ? 'bg-slate-800' : 'bg-white'} rounded-xl shadow-lg overflow-hidden`}>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gradient-to-r from-purple-500 to-blue-500 text-white">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Pos</th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Team</th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">P</th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">W</th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">D</th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">L</th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">GF</th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">GA</th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">GD</th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Pts</th>
                </tr>
              </thead>
              <tbody className={`${darkMode ? 'bg-slate-800' : 'bg-white'} divide-y ${darkMode ? 'divide-gray-700' : 'divide-gray-200'}`}>
                {topTeams.map((team, index) => (
                  <tr key={team.id} className="hover:bg-purple-50 dark:hover:bg-purple-900/20 transition-colors duration-200">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className={`w-6 h-6 rounded-full flex items-center justify-center text-white font-bold ${
                        index === 0 ? 'bg-gradient-to-r from-yellow-400 to-yellow-600' :
                        index === 1 ? 'bg-gradient-to-r from-gray-400 to-gray-600' :
                        index === 2 ? 'bg-gradient-to-r from-orange-400 to-orange-600' :
                        'bg-gradient-to-r from-blue-400 to-blue-600'
                      }`}>
                        {index + 1}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center space-x-3">
                        <span className="text-2xl">{team.logo}</span>
                        <span className="font-semibold">{team.name}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">{team.played}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">{team.won}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">{team.drawn}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">{team.lost}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">{team.goalsFor}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">{team.goalsAgainst}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">{team.goalsFor - team.goalsAgainst}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-purple-600 dark:text-purple-400">
                      {team.points}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Top Scorers */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-3xl font-bold">Top Scorers</h2>
          <Link
            to="/players"
            className="bg-gradient-to-r from-green-500 to-teal-500 hover:from-green-600 hover:to-teal-600 text-white px-6 py-2 rounded-lg font-semibold transition-all duration-300 transform hover:scale-105"
          >
            View All Players
          </Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
          {topScorers.map((player, index) => {
            const team = teams.find(t => t.id === player.teamId);
            return (
              <div key={player.id} className={`${darkMode ? 'bg-slate-800' : 'bg-white'} rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 border-2 ${
                index === 0 ? 'border-yellow-400' : 'border-transparent'
              }`}>
                <div className="text-center">
                  <div className="relative">
                    <img
                      src={player.avatar}
                      alt={player.name}
                      className="w-16 h-16 rounded-full mx-auto mb-4 border-4 border-purple-500"
                    />
                    {index === 0 && (
                      <div className="absolute -top-2 -right-2 bg-yellow-400 w-6 h-6 rounded-full flex items-center justify-center">
                        <Trophy className="h-3 w-3 text-yellow-900" />
                      </div>
                    )}
                  </div>
                  <h3 className="font-bold text-lg mb-1">{player.name}</h3>
                  <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'} mb-2`}>
                    {team?.name}
                  </p>
                  <div className="text-3xl font-bold bg-gradient-to-r from-purple-500 to-blue-500 bg-clip-text text-transparent">
                    {player.goals}
                  </div>
                  <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                    Goals
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Upcoming Matches */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-3xl font-bold">Upcoming Matches</h2>
          <Link
            to="/fixtures"
            className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white px-6 py-2 rounded-lg font-semibold transition-all duration-300 transform hover:scale-105"
          >
            View All Fixtures
          </Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {upcomingMatches.map((match) => {
            const homeTeam = teams.find(t => t.id === match.homeTeam);
            const awayTeam = teams.find(t => t.id === match.awayTeam);
            return (
              <div key={match.id} className={`${darkMode ? 'bg-slate-800' : 'bg-white'} rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105`}>
                <div className="flex justify-between items-center mb-4">
                  <span className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                    {new Date(match.date).toLocaleDateString()}
                  </span>
                  <span className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                    {match.time}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <span className="text-2xl">{homeTeam?.logo}</span>
                    <span className="font-semibold">{homeTeam?.name}</span>
                  </div>
                  <div className="text-lg font-bold bg-gradient-to-r from-purple-500 to-blue-500 bg-clip-text text-transparent">
                    VS
                  </div>
                  <div className="flex items-center space-x-3">
                    <span className="font-semibold">{awayTeam?.name}</span>
                    <span className="text-2xl">{awayTeam?.logo}</span>
                  </div>
                </div>
                <div className="mt-4 text-center">
                  <span className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                    {match.venue}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Home;