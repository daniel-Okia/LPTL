import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Search, Filter, Trophy, Target, Calendar, Flag } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';
import { useData } from '../contexts/DataContext';

const Players: React.FC = () => {
  const { darkMode } = useTheme();
  const { players, teams } = useData();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterPosition, setFilterPosition] = useState('all');
  const [filterTeam, setFilterTeam] = useState('all');
  const [sortBy, setSortBy] = useState('goals');

  const filteredPlayers = players
    .filter(player => {
      const matchesSearch = player.name.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesPosition = filterPosition === 'all' || player.position === filterPosition;
      const matchesTeam = filterTeam === 'all' || player.teamId === filterTeam;
      return matchesSearch && matchesPosition && matchesTeam;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'goals':
          return b.goals - a.goals;
        case 'assists':
          return b.assists - a.assists;
        case 'age':
          return a.age - b.age;
        case 'value':
          return b.value - a.value;
        default:
          return 0;
      }
    });

  const positions = ['all', 'Forward', 'Midfielder', 'Defender', 'Goalkeeper'];

  return (
    <div className={`min-h-screen ${darkMode ? 'text-white' : 'text-gray-900'} pt-8`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            <span className="bg-gradient-to-r from-purple-400 via-blue-500 to-green-400 bg-clip-text text-transparent">
              Players
            </span>
          </h1>
          <p className={`text-xl ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
            Discover the stars of the Leisure Park Turf League
          </p>
        </div>

        {/* Filters */}
        <div className={`${darkMode ? 'bg-slate-800' : 'bg-white'} rounded-xl shadow-lg p-6 mb-8`}>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search players..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className={`w-full pl-10 pr-4 py-2 rounded-lg border transition-colors duration-200 ${
                  darkMode
                    ? 'bg-slate-700 border-slate-600 text-white placeholder-gray-400 focus:border-purple-500'
                    : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500 focus:border-purple-500'
                } focus:outline-none focus:ring-2 focus:ring-purple-500/20`}
              />
            </div>

            {/* Position Filter */}
            <div className="relative">
              <Filter className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <select
                value={filterPosition}
                onChange={(e) => setFilterPosition(e.target.value)}
                className={`w-full pl-10 pr-4 py-2 rounded-lg border transition-colors duration-200 ${
                  darkMode
                    ? 'bg-slate-700 border-slate-600 text-white focus:border-purple-500'
                    : 'bg-white border-gray-300 text-gray-900 focus:border-purple-500'
                } focus:outline-none focus:ring-2 focus:ring-purple-500/20`}
              >
                {positions.map(position => (
                  <option key={position} value={position}>
                    {position === 'all' ? 'All Positions' : position}
                  </option>
                ))}
              </select>
            </div>

            {/* Team Filter */}
            <div className="relative">
              <select
                value={filterTeam}
                onChange={(e) => setFilterTeam(e.target.value)}
                className={`w-full px-4 py-2 rounded-lg border transition-colors duration-200 ${
                  darkMode
                    ? 'bg-slate-700 border-slate-600 text-white focus:border-purple-500'
                    : 'bg-white border-gray-300 text-gray-900 focus:border-purple-500'
                } focus:outline-none focus:ring-2 focus:ring-purple-500/20`}
              >
                <option value="all">All Teams</option>
                {teams.map(team => (
                  <option key={team.id} value={team.id}>
                    {team.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Sort */}
            <div className="relative">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className={`w-full px-4 py-2 rounded-lg border transition-colors duration-200 ${
                  darkMode
                    ? 'bg-slate-700 border-slate-600 text-white focus:border-purple-500'
                    : 'bg-white border-gray-300 text-gray-900 focus:border-purple-500'
                } focus:outline-none focus:ring-2 focus:ring-purple-500/20`}
              >
                <option value="goals">Sort by Goals</option>
                <option value="assists">Sort by Assists</option>
                <option value="age">Sort by Age</option>
                <option value="value">Sort by Value</option>
              </select>
            </div>
          </div>
        </div>

        {/* Players Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredPlayers.map((player) => {
            const team = teams.find(t => t.id === player.teamId);
            
            return (
              <Link
                key={player.id}
                to={`/player/${player.id}`}
                className={`${darkMode ? 'bg-slate-800' : 'bg-white'} rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 overflow-hidden`}
              >
                {/* Player Header */}
                <div className="relative h-48 bg-gradient-to-br from-purple-500 to-blue-500 p-6 flex items-center justify-center">
                  <div className="absolute top-4 right-4 flex items-center space-x-2">
                    <Flag className="h-4 w-4 text-white" />
                    <span className="text-white text-sm font-semibold">{player.nationality}</span>
                  </div>
                  <div className="text-center">
                    <img
                      src={player.avatar}
                      alt={player.name}
                      className="w-24 h-24 rounded-full mx-auto mb-4 border-4 border-white shadow-lg"
                    />
                    <h2 className="text-xl font-bold text-white mb-1">{player.name}</h2>
                    <p className="text-white/80 text-sm">{player.position}</p>
                  </div>
                </div>

                {/* Player Stats */}
                <div className="p-6">
                  {/* Team Info */}
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-2">
                      <span className="text-lg">{team?.logo}</span>
                      <span className="font-semibold text-sm">{team?.name}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Calendar className="h-4 w-4 text-gray-500" />
                      <span className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                        {player.age}y
                      </span>
                    </div>
                  </div>

                  {/* Performance Stats */}
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div className="text-center">
                      <div className="flex items-center justify-center mb-2">
                        <Trophy className="h-5 w-5 text-yellow-500" />
                      </div>
                      <p className="text-2xl font-bold text-yellow-500">{player.goals}</p>
                      <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Goals</p>
                    </div>
                    <div className="text-center">
                      <div className="flex items-center justify-center mb-2">
                        <Target className="h-5 w-5 text-blue-500" />
                      </div>
                      <p className="text-2xl font-bold text-blue-500">{player.assists}</p>
                      <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Assists</p>
                    </div>
                  </div>

                  {/* Cards */}
                  <div className="flex justify-center space-x-4 mb-4">
                    <div className="flex items-center space-x-1">
                      <div className="w-3 h-4 bg-yellow-400 rounded-sm"></div>
                      <span className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                        {player.yellowCards}
                      </span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <div className="w-3 h-4 bg-red-500 rounded-sm"></div>
                      <span className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                        {player.redCards}
                      </span>
                    </div>
                  </div>

                  {/* Market Value */}
                  <div className={`${darkMode ? 'bg-slate-700' : 'bg-gray-50'} rounded-lg p-3 text-center`}>
                    <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'} mb-1`}>
                      Market Value
                    </p>
                    <p className="text-lg font-bold bg-gradient-to-r from-purple-500 to-blue-500 bg-clip-text text-transparent">
                      ${player.value.toLocaleString()}
                    </p>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>

        {/* No Results */}
        {filteredPlayers.length === 0 && (
          <div className="text-center py-12">
            <div className={`${darkMode ? 'bg-slate-800' : 'bg-white'} rounded-xl p-8 shadow-lg max-w-md mx-auto`}>
              <div className="text-6xl mb-4">🔍</div>
              <h3 className="text-xl font-bold mb-2">No players found</h3>
              <p className={`${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                Try adjusting your search or filter criteria
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Players;