import React, { useState } from 'react';
import { ArrowRightLeft, Search, DollarSign, Users, Trophy, Star, Clock } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';
import { useData } from '../contexts/DataContext';

const Transfers: React.FC = () => {
  const { darkMode } = useTheme();
  const { players, teams, transferPlayer } = useData();
  const [selectedPlayer, setSelectedPlayer] = useState<string | null>(null);
  const [targetTeam, setTargetTeam] = useState<string>('');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterTeam, setFilterTeam] = useState('all');

  const filteredPlayers = players.filter(player => {
    const matchesSearch = player.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesTeam = filterTeam === 'all' || player.teamId === filterTeam;
    return matchesSearch && matchesTeam;
  });

  const handleTransfer = () => {
    if (selectedPlayer && targetTeam) {
      transferPlayer(selectedPlayer, targetTeam);
      setSelectedPlayer(null);
      setTargetTeam('');
    }
  };

  const { transfers } = useData();
  const recentTransfers = transfers.slice(0, 3);

  return (
    <div className={`min-h-screen ${darkMode ? 'text-white' : 'text-gray-900'} pt-8`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            <span className="bg-gradient-to-r from-purple-400 via-blue-500 to-green-400 bg-clip-text text-transparent">
              Transfer Market
            </span>
          </h1>
          <p className={`text-xl ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
            Manage player transfers between teams
          </p>
        </div>

        {/* Transfer Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className={`${darkMode ? 'bg-slate-800' : 'bg-white'} rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300`}>
            <div className="flex items-center justify-between">
              <div>
                <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Total Market Value</p>
                <p className="text-3xl font-bold bg-gradient-to-r from-green-500 to-teal-500 bg-clip-text text-transparent">
                  ${players.reduce((sum, player) => sum + player.value, 0).toLocaleString()}
                </p>
              </div>
              <div className="bg-gradient-to-r from-green-500 to-teal-500 p-3 rounded-lg">
                <DollarSign className="h-6 w-6 text-white" />
              </div>
            </div>
          </div>
          
          <div className={`${darkMode ? 'bg-slate-800' : 'bg-white'} rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300`}>
            <div className="flex items-center justify-between">
              <div>
                <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Available Players</p>
                <p className="text-3xl font-bold bg-gradient-to-r from-purple-500 to-blue-500 bg-clip-text text-transparent">
                  {players.length}
                </p>
              </div>
              <div className="bg-gradient-to-r from-purple-500 to-blue-500 p-3 rounded-lg">
                <Users className="h-6 w-6 text-white" />
              </div>
            </div>
          </div>
          
          <div className={`${darkMode ? 'bg-slate-800' : 'bg-white'} rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300`}>
            <div className="flex items-center justify-between">
              <div>
                <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Recent Transfers</p>
                <p className="text-3xl font-bold bg-gradient-to-r from-orange-500 to-red-500 bg-clip-text text-transparent">
                  {recentTransfers.length}
                </p>
              </div>
              <div className="bg-gradient-to-r from-orange-500 to-red-500 p-3 rounded-lg">
                <ArrowRightLeft className="h-6 w-6 text-white" />
              </div>
            </div>
          </div>
        </div>

        {/* Recent Transfers */}
        {recentTransfers.length > 0 && (
          <div className="mb-8">
            <h2 className="text-3xl font-bold mb-6">Recent Transfers</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {recentTransfers.map((transfer) => (
                <div key={transfer.id} className={`${darkMode ? 'bg-slate-800' : 'bg-white'} rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300`}>
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-2">
                      <ArrowRightLeft className="h-5 w-5 text-purple-500" />
                      <span className="text-sm font-semibold text-purple-500">TRANSFER</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Clock className="h-4 w-4 text-gray-500" />
                      <span className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                        {new Date(transfer.date).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                  <h3 className="font-bold text-lg mb-2">{transfer.playerName}</h3>
                  <div className="flex items-center justify-between mb-4">
                    <span className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                      {transfer.fromTeamName}
                    </span>
                    <ArrowRightLeft className="h-4 w-4 text-purple-500" />
                    <span className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                      {transfer.toTeamName}
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
        )}

        {/* Transfer Interface */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Player Selection */}
          <div className={`${darkMode ? 'bg-slate-800' : 'bg-white'} rounded-xl shadow-lg p-6`}>
            <h3 className="text-2xl font-bold mb-6">Select Player to Transfer</h3>
            
            {/* Filters */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
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
              
              <select
                value={filterTeam}
                onChange={(e) => setFilterTeam(e.target.value)}
                className={`px-4 py-2 rounded-lg border transition-colors duration-200 ${
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

            {/* Player List */}
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {filteredPlayers.map((player) => {
                const team = teams.find(t => t.id === player.teamId);
                return (
                  <div
                    key={player.id}
                    onClick={() => setSelectedPlayer(player.id)}
                    className={`p-4 rounded-lg cursor-pointer transition-all duration-200 ${
                      selectedPlayer === player.id
                        ? 'bg-gradient-to-r from-purple-500/20 to-blue-500/20 border-2 border-purple-500'
                        : darkMode
                        ? 'bg-slate-700 hover:bg-slate-600 border border-slate-600'
                        : 'bg-gray-50 hover:bg-gray-100 border border-gray-200'
                    }`}
                  >
                    <div className="flex items-center space-x-4">
                      <img
                        src={player.avatar}
                        alt={player.name}
                        className="w-12 h-12 rounded-full"
                      />
                      <div className="flex-1">
                        <h4 className="font-semibold">{player.name}</h4>
                        <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                          {player.position} • {team?.name}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-green-500">${player.value.toLocaleString()}</p>
                        <div className="flex items-center space-x-2">
                          <Trophy className="h-4 w-4 text-yellow-500" />
                          <span className="text-sm">{player.goals}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Transfer Action */}
          <div className={`${darkMode ? 'bg-slate-800' : 'bg-white'} rounded-xl shadow-lg p-6`}>
            <h3 className="text-2xl font-bold mb-6">Transfer Details</h3>
            
            {selectedPlayer ? (
              <div>
                {(() => {
                  const player = players.find(p => p.id === selectedPlayer);
                  const currentTeam = teams.find(t => t.id === player?.teamId);
                  
                  return (
                    <div className="space-y-6">
                      {/* Selected Player */}
                      <div className={`${darkMode ? 'bg-slate-700' : 'bg-gray-50'} rounded-lg p-4`}>
                        <div className="flex items-center space-x-4">
                          <img
                            src={player?.avatar}
                            alt={player?.name}
                            className="w-16 h-16 rounded-full"
                          />
                          <div>
                            <h4 className="text-xl font-bold">{player?.name}</h4>
                            <p className={`${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                              {player?.position} • Currently at {currentTeam?.name}
                            </p>
                            <p className="text-lg font-bold text-green-500">
                              ${player?.value.toLocaleString()}
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Target Team Selection */}
                      <div>
                        <label className="block text-sm font-medium mb-2">
                          Select Destination Team
                        </label>
                        <select
                          value={targetTeam}
                          onChange={(e) => setTargetTeam(e.target.value)}
                          className={`w-full px-4 py-3 rounded-lg border transition-colors duration-200 ${
                            darkMode
                              ? 'bg-slate-700 border-slate-600 text-white focus:border-purple-500'
                              : 'bg-white border-gray-300 text-gray-900 focus:border-purple-500'
                          } focus:outline-none focus:ring-2 focus:ring-purple-500/20`}
                        >
                          <option value="">Choose a team...</option>
                          {teams
                            .filter(team => team.id !== player?.teamId)
                            .map(team => (
                              <option key={team.id} value={team.id}>
                                {team.logo} {team.name}
                              </option>
                            ))}
                        </select>
                      </div>

                      {/* Transfer Button */}
                      <button
                        onClick={handleTransfer}
                        disabled={!targetTeam}
                        className={`w-full py-3 rounded-lg font-semibold transition-all duration-300 transform hover:scale-105 ${
                          targetTeam
                            ? 'bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white shadow-lg hover:shadow-xl'
                            : 'bg-gray-400 text-gray-600 cursor-not-allowed'
                        }`}
                      >
                        Complete Transfer
                      </button>
                    </div>
                  );
                })()}
              </div>
            ) : (
              <div className="text-center py-12">
                <ArrowRightLeft className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <h4 className="text-xl font-semibold mb-2">Select a Player</h4>
                <p className={`${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  Choose a player from the list to initiate a transfer
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Transfers;