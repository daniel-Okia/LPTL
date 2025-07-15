import React from 'react';
import { Link } from 'react-router-dom';
import { Trophy, Users, Calendar, TrendingUp, Play, Star, ArrowRightLeft, Newspaper, LogIn, UserPlus, Clock, MapPin, Target } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';
import { useData } from '../contexts/DataContext';

const Home: React.FC = () => {
  const { darkMode } = useTheme();
  const { teams, players, matches } = useData();

  const liveMatches = matches.filter(match => match.status === 'live');
  const upcomingMatches = matches.filter(match => match.status === 'scheduled').slice(0, 3);
  const topScorers = players.sort((a, b) => b.goals - a.goals).slice(0, 5);
  const topTeams = teams.sort((a, b) => b.points - a.points).slice(0, 4);
  const recentTransfers = [
    { playerName: 'Marcus Johnson', fromTeam: 'Thunder Bolts', toTeam: 'Green Eagles', value: 85000, date: '2024-01-20' },
    { playerName: 'Carlos Rodriguez', fromTeam: 'Purple Panthers', toTeam: 'Fire Dragons', value: 88000, date: '2024-01-19' },
    { playerName: 'James Wilson', fromTeam: 'Golden Lions', toTeam: 'Silver Sharks', value: 65000, date: '2024-01-18' }
  ];
  const latestNews = [
    { title: 'Thunder Bolts Maintain Lead in LPTL', summary: 'Thunder Bolts continue their impressive form with a 2-1 victory over Green Eagles', date: '2024-01-21', category: 'Match Report' },
    { title: 'New Transfer Window Opens', summary: 'Teams can now make player transfers for the remainder of the season', date: '2024-01-20', category: 'Transfer News' },
    { title: 'Player of the Month: Marcus Johnson', summary: 'Thunder Bolts striker takes home the award after scoring 5 goals in January', date: '2024-01-19', category: 'Awards' }
  ];

  return (
    <div className={`min-h-screen ${darkMode ? 'text-white' : 'text-gray-900'}`}>
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-purple-600/20 via-blue-600/20 to-green-600/20"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center">
            {/* Logo */}
            <div className="flex justify-center mb-8">
              <img 
                src="/LPTL Transparent Logo.png" 
                alt="LPTL Logo" 
                className="h-32 w-auto"
              />
            </div>
            
            <h1 className="text-5xl md:text-7xl font-bold mb-6">
              <span className="bg-gradient-to-r from-purple-400 via-blue-500 to-green-400 bg-clip-text text-transparent">
                LPTL
              </span>
            </h1>
            <p className="text-2xl md:text-3xl font-semibold mb-4 bg-gradient-to-r from-green-400 via-purple-500 to-blue-400 bg-clip-text text-transparent">
              Leisure Park Turf League
            </p>
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
              <Link
                to="/signin"
                className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white px-8 py-4 rounded-lg font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl flex items-center space-x-2"
              >
                <LogIn className="h-5 w-5" />
                <span>Sign In / Register</span>
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

      {/* Latest News */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <Newspaper className="h-8 w-8 text-purple-500" />
            <h2 className="text-3xl font-bold">Latest News</h2>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {latestNews.map((news, index) => (
            <div key={index} className={`${darkMode ? 'bg-slate-800' : 'bg-white'} rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105`}>
              <div className="flex items-center justify-between mb-3">
                <span className={`text-xs px-3 py-1 rounded-full font-semibold ${
                  news.category === 'Match Report' ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400' :
                  news.category === 'Transfer News' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400' :
                  'bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-400'
                }`}>
                  {news.category}
                </span>
                <span className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  {new Date(news.date).toLocaleDateString()}
                </span>
              </div>
              <h3 className="font-bold text-lg mb-2">{news.title}</h3>
              <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'} mb-4`}>
                {news.summary}
              </p>
              <button className="text-purple-500 hover:text-purple-600 font-semibold text-sm transition-colors duration-200">
                Read More →
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Quick Stats */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold mb-2">League Overview</h2>
          <p className={`text-lg ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
            Current season statistics and highlights
          </p>
        </div>
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

      {/* Recent Transfers */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <ArrowRightLeft className="h-8 w-8 text-orange-500" />
            <h2 className="text-3xl font-bold">Recent Transfers</h2>
          </div>
          <Link
            to="/transfers"
            className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white px-6 py-2 rounded-lg font-semibold transition-all duration-300 transform hover:scale-105"
          >
            Transfer Market
          </Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {recentTransfers.map((transfer, index) => (
            <div key={index} className={`${darkMode ? 'bg-slate-800' : 'bg-white'} rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300`}>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-2">
                  <ArrowRightLeft className="h-5 w-5 text-purple-500" />
                  <span className="text-sm font-semibold text-purple-500">TRANSFER</span>
                </div>
                <span className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  {new Date(transfer.date).toLocaleDateString()}
                </span>
              </div>
              <h3 className="font-bold text-lg mb-2">{transfer.playerName}</h3>
              <div className="flex items-center justify-between mb-4">
                <span className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  {transfer.fromTeam}
                </span>
                <ArrowRightLeft className="h-4 w-4 text-purple-500" />
                <span className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  {transfer.toTeam}
                </span>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold bg-gradient-to-r from-green-500 to-teal-500 bg-clip-text text-transparent">
                  ${transfer.value.toLocaleString()}
                </p>
                <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  Transfer Fee
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* League Table Preview */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <Trophy className="h-8 w-8 text-yellow-500" />
            <h2 className="text-3xl font-bold">League Standings</h2>
          </div>
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
          <div className="flex items-center space-x-3">
            <Target className="h-8 w-8 text-red-500" />
            <h2 className="text-3xl font-bold">Top Scorers</h2>
          </div>
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
          <div className="flex items-center space-x-3">
            <Calendar className="h-8 w-8 text-blue-500" />
            <h2 className="text-3xl font-bold">Upcoming Fixtures</h2>
          </div>
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
                  <div className="flex items-center space-x-1">
                    <Calendar className="h-4 w-4 text-gray-500" />
                    <span className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                      {new Date(match.date).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Clock className="h-4 w-4 text-gray-500" />
                    <span className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                      {match.time}
                    </span>
                  </div>
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
                <div className="mt-4 flex items-center justify-center space-x-1">
                  <MapPin className="h-4 w-4 text-gray-500" />
                  <span className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                    {match.venue}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Sign In / Register Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className={`${darkMode ? 'bg-slate-800' : 'bg-white'} rounded-xl shadow-lg p-8 text-center`}>
          <div className="flex justify-center mb-6">
            <div className="bg-gradient-to-r from-purple-500 to-blue-500 p-4 rounded-full">
              <Users className="h-8 w-8 text-white" />
            </div>
          </div>
          <h2 className="text-3xl font-bold mb-4">Join the LPTL Community</h2>
          <p className={`text-lg ${darkMode ? 'text-gray-300' : 'text-gray-600'} mb-8`}>
            Get exclusive access to player stats, match predictions, and league updates
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/signin"
              className="bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white px-8 py-4 rounded-lg font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl flex items-center justify-center space-x-2"
            >
              <LogIn className="h-5 w-5" />
              <span>Sign In</span>
            </Link>
            <Link
              to="/register"
              className="bg-gradient-to-r from-green-500 to-teal-500 hover:from-green-600 hover:to-teal-600 text-white px-8 py-4 rounded-lg font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl flex items-center justify-center space-x-2"
            >
              <UserPlus className="h-5 w-5" />
              <span>Register</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;