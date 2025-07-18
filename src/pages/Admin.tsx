import React, { useState } from 'react';
import { Settings, Users, Calendar, Trophy, Plus, Edit, Trash2, Save, X } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';
import { useData } from '../contexts/DataContext';
import { useAuth } from '../contexts/AuthContext';
import { PERMISSIONS } from '../utils/permissions';

const Admin: React.FC = () => {
  const { darkMode } = useTheme();
  const { hasPermission } = useAuth();
  const { teams, players, matches, updateMatch } = useData();
  const [activeTab, setActiveTab] = useState('overview');
  const [editingMatch, setEditingMatch] = useState<string | null>(null);
  const [showAddTeamModal, setShowAddTeamModal] = useState(false);
  const [showAddPlayerModal, setShowAddPlayerModal] = useState(false);
  const [showAddMatchModal, setShowAddMatchModal] = useState(false);
  const [editingTeam, setEditingTeam] = useState<string | null>(null);
  const [editingPlayer, setEditingPlayer] = useState<string | null>(null);

  // Form states
  const [teamForm, setTeamForm] = useState({
    name: '',
    logo: '',
    primaryColor: '#1E40AF',
    secondaryColor: '#3B82F6'
  });

  const [playerForm, setPlayerForm] = useState({
    name: '',
    position: 'Forward',
    teamId: '',
    age: 25,
    nationality: 'Zambia',
    avatar: 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=150',
    value: 20000
  });

  const [matchForm, setMatchForm] = useState({
    homeTeam: '',
    awayTeam: '',
    date: '',
    time: '15:00',
    venue: 'Leisure Park Main Field'
  });

  const handleAddTeam = async () => {
    try {
      await teamsService.add({
        ...teamForm,
        played: 0,
        won: 0,
        drawn: 0,
        lost: 0,
        goalsFor: 0,
        goalsAgainst: 0,
        points: 0
      });
      setShowAddTeamModal(false);
      setTeamForm({ name: '', logo: '', primaryColor: '#1E40AF', secondaryColor: '#3B82F6' });
    } catch (error) {
      console.error('Error adding team:', error);
    }
  };

  const handleAddPlayer = async () => {
    try {
      await playersService.add({
        ...playerForm,
        goals: 0,
        assists: 0,
        yellowCards: 0,
        redCards: 0
      });
      setShowAddPlayerModal(false);
      setPlayerForm({
        name: '',
        position: 'Forward',
        teamId: '',
        age: 25,
        nationality: 'Zambia',
        avatar: 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=150',
        value: 20000
      });
    } catch (error) {
      console.error('Error adding player:', error);
    }
  };

  const handleAddMatch = async () => {
    try {
      await matchesService.add({
        ...matchForm,
        homeScore: 0,
        awayScore: 0,
        status: 'scheduled'
      });
      setShowAddMatchModal(false);
      setMatchForm({
        homeTeam: '',
        awayTeam: '',
        date: '',
        time: '15:00',
        venue: 'Leisure Park Main Field'
      });
    } catch (error) {
      console.error('Error adding match:', error);
    }
  };

  const handleDeleteTeam = async (teamId: string) => {
    if (window.confirm('Are you sure you want to delete this team?')) {
      try {
        await teamsService.delete(teamId);
      } catch (error) {
        console.error('Error deleting team:', error);
      }
    }
  };

  const handleDeletePlayer = async (playerId: string) => {
    if (window.confirm('Are you sure you want to delete this player?')) {
      try {
        await playersService.delete(playerId);
      } catch (error) {
        console.error('Error deleting player:', error);
      }
    }
  };

  const handleDeleteMatch = async (matchId: string) => {
    if (window.confirm('Are you sure you want to delete this match?')) {
      try {
        await matchesService.delete(matchId);
      } catch (error) {
        console.error('Error deleting match:', error);
      }
    }
  };

  const tabs = [
    { id: 'overview', name: 'Overview', icon: Trophy },
    { id: 'teams', name: 'Teams', icon: Users, permission: PERMISSIONS.VIEW_TEAMS },
    { id: 'matches', name: 'Matches', icon: Calendar, permission: PERMISSIONS.VIEW_MATCHES },
    { id: 'settings', name: 'Settings', icon: Settings, permission: PERMISSIONS.MANAGE_LEAGUE_SETTINGS },
  ].filter(tab => !tab.permission || hasPermission(tab.permission));

  const OverviewTab = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className={`${darkMode ? 'bg-slate-800' : 'bg-white'} rounded-xl p-6 shadow-lg`}>
          <div className="flex items-center justify-between">
            <div>
              <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Total Teams</p>
              <p className="text-3xl font-bold text-purple-500">{teams.length}</p>
            </div>
            <Users className="h-8 w-8 text-purple-500" />
          </div>
        </div>
        
        <div className={`${darkMode ? 'bg-slate-800' : 'bg-white'} rounded-xl p-6 shadow-lg`}>
          <div className="flex items-center justify-between">
            <div>
              <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Total Players</p>
              <p className="text-3xl font-bold text-blue-500">{players.length}</p>
            </div>
            <Users className="h-8 w-8 text-blue-500" />
          </div>
        </div>
        
        <div className={`${darkMode ? 'bg-slate-800' : 'bg-white'} rounded-xl p-6 shadow-lg`}>
          <div className="flex items-center justify-between">
            <div>
              <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Total Matches</p>
              <p className="text-3xl font-bold text-green-500">{matches.length}</p>
            </div>
            <Calendar className="h-8 w-8 text-green-500" />
          </div>
        </div>
        
        <div className={`${darkMode ? 'bg-slate-800' : 'bg-white'} rounded-xl p-6 shadow-lg`}>
          <div className="flex items-center justify-between">
            <div>
              <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Live Matches</p>
              <p className="text-3xl font-bold text-red-500">
                {matches.filter(m => m.status === 'live').length}
              </p>
            </div>
            <Trophy className="h-8 w-8 text-red-500" />
          </div>
        </div>
      </div>

      <div className={`${darkMode ? 'bg-slate-800' : 'bg-white'} rounded-xl p-6 shadow-lg`}>
        <h3 className="text-xl font-bold mb-4">Recent Activity</h3>
        <div className="space-y-3">
          <div className="flex items-center space-x-3 p-3 rounded-lg bg-green-50 dark:bg-green-900/20">
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            <span>Match between Thunder Bolts and Green Eagles completed</span>
          </div>
          <div className="flex items-center space-x-3 p-3 rounded-lg bg-blue-50 dark:bg-blue-900/20">
            <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
            <span>New player Marcus Johnson registered</span>
          </div>
          <div className="flex items-center space-x-3 p-3 rounded-lg bg-purple-50 dark:bg-purple-900/20">
            <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
            <span>League standings updated</span>
          </div>
        </div>
      </div>
    </div>
  );

  const TeamsTab = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-2xl font-bold">Team Management</h3>
        {hasPermission(PERMISSIONS.CREATE_TEAMS) && (
          <button 
            onClick={() => setShowAddTeamModal(true)}
            className="bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white px-4 py-2 rounded-lg font-semibold transition-all duration-300 transform hover:scale-105 flex items-center space-x-2"
          >
            <Plus className="h-4 w-4" />
            <span>Add Team</span>
          </button>
        )}
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {teams.map((team) => (
          <div key={team.id} className={`${darkMode ? 'bg-slate-800' : 'bg-white'} rounded-xl p-6 shadow-lg`}>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div 
                  className="w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-xl"
                  style={{ backgroundColor: team.primaryColor }}
                >
                  {team.logo}
                </div>
                <div>
                  <h4 className="font-bold">{team.name}</h4>
                  <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                    {players.filter(p => p.teamId === team.id).length} players
                  </p>
                </div>
              </div>
              {(hasPermission(PERMISSIONS.EDIT_TEAMS) || hasPermission(PERMISSIONS.DELETE_TEAMS)) && (
                <div className="flex space-x-2">
                  {hasPermission(PERMISSIONS.EDIT_TEAMS) && (
                    <button 
                      onClick={() => setEditingTeam(team.id)}
                      className="p-2 text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors"
                    >
                      <Edit className="h-4 w-4" />
                    </button>
                  )}
                  {hasPermission(PERMISSIONS.DELETE_TEAMS) && (
                    <button 
                      onClick={() => handleDeleteTeam(team.id)}
                      className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  )}
                </div>
              )}
            </div>
            <div className="grid grid-cols-3 gap-2 text-center text-sm">
              <div>
                <p className="font-semibold text-green-500">{team.won}</p>
                <p className={`${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Wins</p>
              </div>
              <div>
                <p className="font-semibold text-yellow-500">{team.drawn}</p>
                <p className={`${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Draws</p>
              </div>
              <div>
                <p className="font-semibold text-red-500">{team.lost}</p>
                <p className={`${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Losses</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const MatchesTab = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-2xl font-bold">Match Management</h3>
        {hasPermission(PERMISSIONS.CREATE_MATCHES) && (
          <button 
            onClick={() => setShowAddMatchModal(true)}
            className="bg-gradient-to-r from-green-500 to-teal-500 hover:from-green-600 hover:to-teal-600 text-white px-4 py-2 rounded-lg font-semibold transition-all duration-300 transform hover:scale-105 flex items-center space-x-2"
          >
            <Plus className="h-4 w-4" />
            <span>Schedule Match</span>
          </button>
        )}
      </div>
      
      <div className="space-y-4">
        {matches.map((match) => {
          const homeTeam = teams.find(t => t.id === match.homeTeam);
          const awayTeam = teams.find(t => t.id === match.awayTeam);
          
          return (
            <div key={match.id} className={`${darkMode ? 'bg-slate-800' : 'bg-white'} rounded-xl p-6 shadow-lg`}>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-6">
                  <div className="flex items-center space-x-3">
                    <div 
                      className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold"
                      style={{ backgroundColor: homeTeam?.primaryColor }}
                    >
                      {homeTeam?.logo}
                    </div>
                    <span className="font-semibold">{homeTeam?.name}</span>
                  </div>
                  
                  <div className="text-center">
                    {editingMatch === match.id ? (
                      <div className="flex items-center space-x-2">
                        <input
                          type="number"
                          min="0"
                          defaultValue={match.homeScore}
                          className="w-12 text-center py-1 rounded border"
                        />
                        <span>-</span>
                        <input
                          type="number"
                          min="0"
                          defaultValue={match.awayScore}
                          className="w-12 text-center py-1 rounded border"
                        />
                        <button
                          onClick={() => setEditingMatch(null)}
                          className="p-1 text-green-500 hover:bg-green-50 rounded"
                        >
                          <Save className="h-4 w-4" />
                        </button>
                      </div>
                    ) : (
                      <div className="text-2xl font-bold">
                        {match.status === 'scheduled' ? 'VS' : `${match.homeScore} - ${match.awayScore}`}
                      </div>
                    )}
                  </div>
                  
                  <div className="flex items-center space-x-3">
                    <span className="font-semibold">{awayTeam?.name}</span>
                    <div 
                      className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold"
                      style={{ backgroundColor: awayTeam?.primaryColor }}
                    >
                      {awayTeam?.logo}
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center space-x-4">
                  <div className="text-right">
                    <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                      {new Date(match.date).toLocaleDateString()} • {match.time}
                    </p>
                    <p className={`text-sm font-semibold ${
                      match.status === 'live' ? 'text-red-500' :
                      match.status === 'finished' ? 'text-green-500' :
                      'text-blue-500'
                    }`}>
                      {match.status.toUpperCase()}
                    </p>
                  </div>
                  
                  {hasPermission(PERMISSIONS.EDIT_MATCHES) && (
                    <button
                      onClick={() => setEditingMatch(editingMatch === match.id ? null : match.id)}
                      className="p-2 text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors"
                    >
                      <Edit className="h-4 w-4" />
                    </button>
                  )}
                  
                  {hasPermission(PERMISSIONS.DELETE_MATCHES) && (
                    <button
                      onClick={() => handleDeleteMatch(match.id)}
                      className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );

  const SettingsTab = () => (
    <div className="space-y-6">
      <h3 className="text-2xl font-bold">League Settings</h3>
      
      <div className={`${darkMode ? 'bg-slate-800' : 'bg-white'} rounded-xl p-6 shadow-lg`}>
        <h4 className="text-lg font-semibold mb-4">General Settings</h4>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">League Name</label>
            <input
              type="text"
              defaultValue="Leisure Park Turf League"
              className={`w-full px-4 py-2 rounded-lg border ${
                darkMode
                  ? 'bg-slate-700 border-slate-600 text-white'
                  : 'bg-white border-gray-300 text-gray-900'
              } focus:outline-none focus:ring-2 focus:ring-purple-500`}
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Season</label>
            <input
              type="text"
              defaultValue="2024"
              className={`w-full px-4 py-2 rounded-lg border ${
                darkMode
                  ? 'bg-slate-700 border-slate-600 text-white'
                  : 'bg-white border-gray-300 text-gray-900'
              } focus:outline-none focus:ring-2 focus:ring-purple-500`}
            />
          </div>
        </div>
      </div>
      
      <div className={`${darkMode ? 'bg-slate-800' : 'bg-white'} rounded-xl p-6 shadow-lg`}>
        <h4 className="text-lg font-semibold mb-4">Match Settings</h4>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Match Duration (minutes)</label>
            <input
              type="number"
              defaultValue="90"
              className={`w-full px-4 py-2 rounded-lg border ${
                darkMode
                  ? 'bg-slate-700 border-slate-600 text-white'
                  : 'bg-white border-gray-300 text-gray-900'
              } focus:outline-none focus:ring-2 focus:ring-purple-500`}
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Points for Win</label>
            <input
              type="number"
              defaultValue="3"
              className={`w-full px-4 py-2 rounded-lg border ${
                darkMode
                  ? 'bg-slate-700 border-slate-600 text-white'
                  : 'bg-white border-gray-300 text-gray-900'
              } focus:outline-none focus:ring-2 focus:ring-purple-500`}
            />
          </div>
        </div>
      </div>
    </div>
  );

  const renderTabContent = () => {
    switch (activeTab) {
      case 'overview':
        return <OverviewTab />;
      case 'teams':
        return <TeamsTab />;
      case 'matches':
        return <MatchesTab />;
      case 'settings':
        return <SettingsTab />;
      default:
        return <OverviewTab />;
    }
  };

  return (
    <div className={`min-h-screen ${darkMode ? 'text-white' : 'text-gray-900'} pt-8`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            <span className="bg-gradient-to-r from-purple-400 via-blue-500 to-green-400 bg-clip-text text-transparent">
              Admin Dashboard
            </span>
          </h1>
          <p className={`text-xl ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
            Manage your league with complete control
          </p>
        </div>

        {/* Tabs */}
        <div className="flex space-x-1 mb-8">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-2 px-6 py-3 rounded-lg font-semibold transition-all duration-300 ${
                  activeTab === tab.id
                    ? 'bg-gradient-to-r from-purple-500 to-blue-500 text-white shadow-lg'
                    : darkMode
                    ? 'text-gray-300 hover:text-white hover:bg-slate-700'
                    : 'text-gray-700 hover:text-purple-600 hover:bg-purple-50'
                }`}
              >
                <Icon className="h-5 w-5" />
                <span>{tab.name}</span>
              </button>
            );
          })}
        </div>


      {/* Add Player Section */}
      <div className="mb-8">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-2xl font-bold">Player Management</h3>
          {hasPermission(PERMISSIONS.CREATE_PLAYERS) && (
            <button 
              onClick={() => setShowAddPlayerModal(true)}
              className="bg-gradient-to-r from-green-500 to-teal-500 hover:from-green-600 hover:to-teal-600 text-white px-4 py-2 rounded-lg font-semibold transition-all duration-300 transform hover:scale-105 flex items-center space-x-2"
            >
              <Plus className="h-4 w-4" />
              <span>Add Player</span>
            </button>
          )}
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {players.slice(0, 12).map((player) => {
            const team = teams.find(t => t.id === player.teamId);
            return (
              <div key={player.id} className={`${darkMode ? 'bg-slate-800' : 'bg-white'} rounded-xl p-6 shadow-lg`}>
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <img
                      src={player.avatar}
                      alt={player.name}
                      className="w-12 h-12 rounded-full"
                    />
                    <div>
                      <h4 className="font-bold">{player.name}</h4>
                      <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                        {player.position} • {team?.name}
                      </p>
                    </div>
                  </div>
                  {(hasPermission(PERMISSIONS.EDIT_PLAYERS) || hasPermission(PERMISSIONS.DELETE_PLAYERS)) && (
                    <div className="flex space-x-2">
                      {hasPermission(PERMISSIONS.EDIT_PLAYERS) && (
                        <button 
                          onClick={() => setEditingPlayer(player.id)}
                          className="p-2 text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors"
                        >
                          <Edit className="h-4 w-4" />
                        </button>
                      )}
                      {hasPermission(PERMISSIONS.DELETE_PLAYERS) && (
                        <button 
                          onClick={() => handleDeletePlayer(player.id)}
                          className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      )}
                    </div>
                  )}
                </div>
                <div className="grid grid-cols-2 gap-4 text-center text-sm">
                  <div>
                    <p className="font-semibold text-yellow-500">{player.goals}</p>
                    <p className={`${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Goals</p>
                  </div>
                  <div>
                    <p className="font-semibold text-blue-500">{player.assists}</p>
                    <p className={`${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Assists</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
        {/* Tab Content */}
        <div className="mb-8">
          {renderTabContent()}
        </div>

        {/* Add Team Modal */}
        {showAddTeamModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className={`${darkMode ? 'bg-slate-800' : 'bg-white'} rounded-xl p-6 w-full max-w-md mx-4`}>
              <h3 className="text-xl font-bold mb-4">Add New Team</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Team Name</label>
                  <input
                    type="text"
                    value={teamForm.name}
                    onChange={(e) => setTeamForm(prev => ({ ...prev, name: e.target.value }))}
                    className={`w-full px-4 py-2 rounded-lg border ${
                      darkMode
                        ? 'bg-slate-700 border-slate-600 text-white'
                        : 'bg-white border-gray-300 text-gray-900'
                    } focus:outline-none focus:ring-2 focus:ring-purple-500`}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Logo (Emoji or URL)</label>
                  <input
                    type="text"
                    value={teamForm.logo}
                    onChange={(e) => setTeamForm(prev => ({ ...prev, logo: e.target.value }))}
                    placeholder="⚽ or image URL"
                    className={`w-full px-4 py-2 rounded-lg border ${
                      darkMode
                        ? 'bg-slate-700 border-slate-600 text-white'
                        : 'bg-white border-gray-300 text-gray-900'
                    } focus:outline-none focus:ring-2 focus:ring-purple-500`}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Primary Color</label>
                    <input
                      type="color"
                      value={teamForm.primaryColor}
                      onChange={(e) => setTeamForm(prev => ({ ...prev, primaryColor: e.target.value }))}
                      className="w-full h-10 rounded-lg border"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Secondary Color</label>
                    <input
                      type="color"
                      value={teamForm.secondaryColor}
                      onChange={(e) => setTeamForm(prev => ({ ...prev, secondaryColor: e.target.value }))}
                      className="w-full h-10 rounded-lg border"
                    />
                  </div>
                </div>
              </div>
              <div className="flex space-x-3 mt-6">
                <button
                  onClick={handleAddTeam}
                  className="flex-1 bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white py-2 rounded-lg font-semibold transition-all duration-300"
                >
                  Add Team
                </button>
                <button
                  onClick={() => setShowAddTeamModal(false)}
                  className={`flex-1 ${darkMode ? 'bg-slate-700 hover:bg-slate-600' : 'bg-gray-200 hover:bg-gray-300'} py-2 rounded-lg font-semibold transition-all duration-300`}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Add Player Modal */}
        {showAddPlayerModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className={`${darkMode ? 'bg-slate-800' : 'bg-white'} rounded-xl p-6 w-full max-w-md mx-4`}>
              <h3 className="text-xl font-bold mb-4">Add New Player</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Player Name</label>
                  <input
                    type="text"
                    value={playerForm.name}
                    onChange={(e) => setPlayerForm(prev => ({ ...prev, name: e.target.value }))}
                    className={`w-full px-4 py-2 rounded-lg border ${
                      darkMode
                        ? 'bg-slate-700 border-slate-600 text-white'
                        : 'bg-white border-gray-300 text-gray-900'
                    } focus:outline-none focus:ring-2 focus:ring-purple-500`}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Position</label>
                    <select
                      value={playerForm.position}
                      onChange={(e) => setPlayerForm(prev => ({ ...prev, position: e.target.value }))}
                      className={`w-full px-4 py-2 rounded-lg border ${
                        darkMode
                          ? 'bg-slate-700 border-slate-600 text-white'
                          : 'bg-white border-gray-300 text-gray-900'
                      } focus:outline-none focus:ring-2 focus:ring-purple-500`}
                    >
                      <option value="Forward">Forward</option>
                      <option value="Midfielder">Midfielder</option>
                      <option value="Defender">Defender</option>
                      <option value="Goalkeeper">Goalkeeper</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Age</label>
                    <input
                      type="number"
                      min="16"
                      max="45"
                      value={playerForm.age}
                      onChange={(e) => setPlayerForm(prev => ({ ...prev, age: parseInt(e.target.value) }))}
                      className={`w-full px-4 py-2 rounded-lg border ${
                        darkMode
                          ? 'bg-slate-700 border-slate-600 text-white'
                          : 'bg-white border-gray-300 text-gray-900'
                      } focus:outline-none focus:ring-2 focus:ring-purple-500`}
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Team</label>
                  <select
                    value={playerForm.teamId}
                    onChange={(e) => setPlayerForm(prev => ({ ...prev, teamId: e.target.value }))}
                    className={`w-full px-4 py-2 rounded-lg border ${
                      darkMode
                        ? 'bg-slate-700 border-slate-600 text-white'
                        : 'bg-white border-gray-300 text-gray-900'
                    } focus:outline-none focus:ring-2 focus:ring-purple-500`}
                  >
                    <option value="">Select Team</option>
                    {teams.map(team => (
                      <option key={team.id} value={team.id}>{team.name}</option>
                    ))}
                  </select>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Nationality</label>
                    <input
                      type="text"
                      value={playerForm.nationality}
                      onChange={(e) => setPlayerForm(prev => ({ ...prev, nationality: e.target.value }))}
                      className={`w-full px-4 py-2 rounded-lg border ${
                        darkMode
                          ? 'bg-slate-700 border-slate-600 text-white'
                          : 'bg-white border-gray-300 text-gray-900'
                      } focus:outline-none focus:ring-2 focus:ring-purple-500`}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Market Value ($)</label>
                    <input
                      type="number"
                      min="1000"
                      value={playerForm.value}
                      onChange={(e) => setPlayerForm(prev => ({ ...prev, value: parseInt(e.target.value) }))}
                      className={`w-full px-4 py-2 rounded-lg border ${
                        darkMode
                          ? 'bg-slate-700 border-slate-600 text-white'
                          : 'bg-white border-gray-300 text-gray-900'
                      } focus:outline-none focus:ring-2 focus:ring-purple-500`}
                    />
                  </div>
                </div>
              </div>
              <div className="flex space-x-3 mt-6">
                <button
                  onClick={handleAddPlayer}
                  className="flex-1 bg-gradient-to-r from-green-500 to-teal-500 hover:from-green-600 hover:to-teal-600 text-white py-2 rounded-lg font-semibold transition-all duration-300"
                >
                  Add Player
                </button>
                <button
                  onClick={() => setShowAddPlayerModal(false)}
                  className={`flex-1 ${darkMode ? 'bg-slate-700 hover:bg-slate-600' : 'bg-gray-200 hover:bg-gray-300'} py-2 rounded-lg font-semibold transition-all duration-300`}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Add Match Modal */}
        {showAddMatchModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className={`${darkMode ? 'bg-slate-800' : 'bg-white'} rounded-xl p-6 w-full max-w-md mx-4`}>
              <h3 className="text-xl font-bold mb-4">Schedule New Match</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Home Team</label>
                  <select
                    value={matchForm.homeTeam}
                    onChange={(e) => setMatchForm(prev => ({ ...prev, homeTeam: e.target.value }))}
                    className={`w-full px-4 py-2 rounded-lg border ${
                      darkMode
                        ? 'bg-slate-700 border-slate-600 text-white'
                        : 'bg-white border-gray-300 text-gray-900'
                    } focus:outline-none focus:ring-2 focus:ring-purple-500`}
                  >
                    <option value="">Select Home Team</option>
                    {teams.map(team => (
                      <option key={team.id} value={team.id}>{team.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Away Team</label>
                  <select
                    value={matchForm.awayTeam}
                    onChange={(e) => setMatchForm(prev => ({ ...prev, awayTeam: e.target.value }))}
                    className={`w-full px-4 py-2 rounded-lg border ${
                      darkMode
                        ? 'bg-slate-700 border-slate-600 text-white'
                        : 'bg-white border-gray-300 text-gray-900'
                    } focus:outline-none focus:ring-2 focus:ring-purple-500`}
                  >
                    <option value="">Select Away Team</option>
                    {teams.filter(team => team.id !== matchForm.homeTeam).map(team => (
                      <option key={team.id} value={team.id}>{team.name}</option>
                    ))}
                  </select>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Date</label>
                    <input
                      type="date"
                      value={matchForm.date}
                      onChange={(e) => setMatchForm(prev => ({ ...prev, date: e.target.value }))}
                      className={`w-full px-4 py-2 rounded-lg border ${
                        darkMode
                          ? 'bg-slate-700 border-slate-600 text-white'
                          : 'bg-white border-gray-300 text-gray-900'
                      } focus:outline-none focus:ring-2 focus:ring-purple-500`}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Time</label>
                    <input
                      type="time"
                      value={matchForm.time}
                      onChange={(e) => setMatchForm(prev => ({ ...prev, time: e.target.value }))}
                      className={`w-full px-4 py-2 rounded-lg border ${
                        darkMode
                          ? 'bg-slate-700 border-slate-600 text-white'
                          : 'bg-white border-gray-300 text-gray-900'
                      } focus:outline-none focus:ring-2 focus:ring-purple-500`}
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Venue</label>
                  <input
                    type="text"
                    value={matchForm.venue}
                    onChange={(e) => setMatchForm(prev => ({ ...prev, venue: e.target.value }))}
                    className={`w-full px-4 py-2 rounded-lg border ${
                      darkMode
                        ? 'bg-slate-700 border-slate-600 text-white'
                        : 'bg-white border-gray-300 text-gray-900'
                    } focus:outline-none focus:ring-2 focus:ring-purple-500`}
                  />
                </div>
              </div>
              <div className="flex space-x-3 mt-6">
                <button
                  onClick={handleAddMatch}
                  className="flex-1 bg-gradient-to-r from-green-500 to-teal-500 hover:from-green-600 hover:to-teal-600 text-white py-2 rounded-lg font-semibold transition-all duration-300"
                >
                  Schedule Match
                </button>
                <button
                  onClick={() => setShowAddMatchModal(false)}
                  className={`flex-1 ${darkMode ? 'bg-slate-700 hover:bg-slate-600' : 'bg-gray-200 hover:bg-gray-300'} py-2 rounded-lg font-semibold transition-all duration-300`}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Admin;