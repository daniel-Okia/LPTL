import React, { useState, useEffect } from 'react';
import { Mail, UserPlus, Shield, Users, Crown, Settings, Search, Filter, MoreVertical, Check, X, Clock } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';
import { useAuth } from '../contexts/AuthContext';
import { usersService, invitationsService } from '../services/firestore';
import { User, UserInvitation } from '../types';
import { ROLES, ROLE_DEFINITIONS, canAssignRole, getRoleDisplayName, getRoleDescription } from '../utils/permissions';
import LoadingSpinner from '../components/LoadingSpinner';

const UserManagement: React.FC = () => {
  const { darkMode } = useTheme();
  const { userProfile } = useAuth();
  const [users, setUsers] = useState<User[]>([]);
  const [invitations, setInvitations] = useState<UserInvitation[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRole, setFilterRole] = useState('all');
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [showRoleModal, setShowRoleModal] = useState(false);

  // Invite form state
  const [inviteForm, setInviteForm] = useState({
    email: '',
    role: ROLES.ORGANIZER,
    message: ''
  });

  useEffect(() => {
    loadData();
    
    // Set up real-time subscriptions
    const unsubscribeUsers = usersService.subscribe(setUsers);
    const unsubscribeInvitations = invitationsService.subscribe(setInvitations);
    
    return () => {
      unsubscribeUsers();
      unsubscribeInvitations();
    };
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [usersData, invitationsData] = await Promise.all([
        usersService.getAll(),
        invitationsService.getAll()
      ]);
      setUsers(usersData);
      setInvitations(invitationsData);
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleInviteUser = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      // Check if user already exists
      const existingUser = users.find(u => u.email === inviteForm.email);
      if (existingUser) {
        alert('User with this email already exists');
        return;
      }

      // Check if invitation already exists
      const existingInvitation = invitations.find(i => i.email === inviteForm.email && i.status === 'pending');
      if (existingInvitation) {
        alert('Invitation already sent to this email');
        return;
      }

      // Create invitation
      const expiresAt = new Date();
      expiresAt.setDate(expiresAt.getDate() + 7); // Expires in 7 days

      await invitationsService.create({
        email: inviteForm.email,
        role: inviteForm.role as 'organizer' | 'admin',
        invitedBy: userProfile!.id,
        invitedByName: `${userProfile!.firstName} ${userProfile!.lastName}`,
        status: 'pending',
        expiresAt
      });

      setInviteForm({ email: '', role: ROLES.ORGANIZER, message: '' });
      setShowInviteModal(false);
      
      // TODO: Send email invitation
      alert('Invitation sent successfully!');
    } catch (error) {
      console.error('Error sending invitation:', error);
      alert('Failed to send invitation');
    }
  };

  const handleUpdateUserRole = async (userId: string, newRole: string) => {
    try {
      const rolePermissions = ROLE_DEFINITIONS[newRole as keyof typeof ROLE_DEFINITIONS]?.permissions || [];
      await usersService.updateRole(userId, newRole, rolePermissions, userProfile!.id);
      setShowRoleModal(false);
      setSelectedUser(null);
    } catch (error) {
      console.error('Error updating user role:', error);
      alert('Failed to update user role');
    }
  };

  const handleSuspendUser = async (userId: string, suspend: boolean) => {
    try {
      await usersService.updateStatus(userId, suspend ? 'suspended' : 'active');
    } catch (error) {
      console.error('Error updating user status:', error);
      alert('Failed to update user status');
    }
  };

  const handleCancelInvitation = async (invitationId: string) => {
    try {
      await invitationsService.delete(invitationId);
    } catch (error) {
      console.error('Error canceling invitation:', error);
      alert('Failed to cancel invitation');
    }
  };

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = filterRole === 'all' || user.role === filterRole;
    return matchesSearch && matchesRole;
  });

  const getRoleIcon = (role: string) => {
    switch (role) {
      case ROLES.SUPER_ADMIN:
        return <Crown className="h-4 w-4 text-yellow-500" />;
      case ROLES.ADMIN:
        return <Shield className="h-4 w-4 text-red-500" />;
      case ROLES.ORGANIZER:
        return <Settings className="h-4 w-4 text-blue-500" />;
      default:
        return <Users className="h-4 w-4 text-gray-500" />;
    }
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case ROLES.SUPER_ADMIN:
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400';
      case ROLES.ADMIN:
        return 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400';
      case ROLES.ORGANIZER:
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <LoadingSpinner size="lg" text="Loading users..." />
      </div>
    );
  }

  return (
    <div className={`min-h-screen ${darkMode ? 'text-white' : 'text-gray-900'} pt-8`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold mb-2">
              <span className="bg-gradient-to-r from-purple-400 via-blue-500 to-green-400 bg-clip-text text-transparent">
                User Management
              </span>
            </h1>
            <p className={`text-lg ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
              Manage users, roles, and permissions
            </p>
          </div>
          
          {userProfile?.role === ROLES.SUPER_ADMIN && (
            <button
              onClick={() => setShowInviteModal(true)}
              className="bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white px-6 py-3 rounded-lg font-semibold transition-all duration-300 transform hover:scale-105 flex items-center space-x-2"
            >
              <UserPlus className="h-5 w-5" />
              <span>Invite User</span>
            </button>
          )}
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className={`${darkMode ? 'bg-slate-800' : 'bg-white'} rounded-xl p-6 shadow-lg`}>
            <div className="flex items-center justify-between">
              <div>
                <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Total Users</p>
                <p className="text-3xl font-bold text-purple-500">{users.length}</p>
              </div>
              <Users className="h-8 w-8 text-purple-500" />
            </div>
          </div>
          
          <div className={`${darkMode ? 'bg-slate-800' : 'bg-white'} rounded-xl p-6 shadow-lg`}>
            <div className="flex items-center justify-between">
              <div>
                <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Admins</p>
                <p className="text-3xl font-bold text-red-500">
                  {users.filter(u => u.role === ROLES.ADMIN).length}
                </p>
              </div>
              <Shield className="h-8 w-8 text-red-500" />
            </div>
          </div>
          
          <div className={`${darkMode ? 'bg-slate-800' : 'bg-white'} rounded-xl p-6 shadow-lg`}>
            <div className="flex items-center justify-between">
              <div>
                <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Organizers</p>
                <p className="text-3xl font-bold text-blue-500">
                  {users.filter(u => u.role === ROLES.ORGANIZER).length}
                </p>
              </div>
              <Settings className="h-8 w-8 text-blue-500" />
            </div>
          </div>
          
          <div className={`${darkMode ? 'bg-slate-800' : 'bg-white'} rounded-xl p-6 shadow-lg`}>
            <div className="flex items-center justify-between">
              <div>
                <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Pending Invites</p>
                <p className="text-3xl font-bold text-orange-500">
                  {invitations.filter(i => i.status === 'pending').length}
                </p>
              </div>
              <Clock className="h-8 w-8 text-orange-500" />
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className={`${darkMode ? 'bg-slate-800' : 'bg-white'} rounded-xl shadow-lg p-6 mb-8`}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search users..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className={`w-full pl-10 pr-4 py-2 rounded-lg border transition-colors duration-200 ${
                  darkMode
                    ? 'bg-slate-700 border-slate-600 text-white placeholder-gray-400 focus:border-purple-500'
                    : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500 focus:border-purple-500'
                } focus:outline-none focus:ring-2 focus:ring-purple-500/20`}
              />
            </div>
            
            <div className="relative">
              <Filter className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <select
                value={filterRole}
                onChange={(e) => setFilterRole(e.target.value)}
                className={`w-full pl-10 pr-4 py-2 rounded-lg border transition-colors duration-200 ${
                  darkMode
                    ? 'bg-slate-700 border-slate-600 text-white focus:border-purple-500'
                    : 'bg-white border-gray-300 text-gray-900 focus:border-purple-500'
                } focus:outline-none focus:ring-2 focus:ring-purple-500/20`}
              >
                <option value="all">All Roles</option>
                {Object.values(ROLES).map(role => (
                  <option key={role} value={role}>
                    {getRoleDisplayName(role)}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Users Table */}
        <div className={`${darkMode ? 'bg-slate-800' : 'bg-white'} rounded-xl shadow-lg overflow-hidden mb-8`}>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gradient-to-r from-purple-500 to-blue-500 text-white">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-semibold uppercase tracking-wider">User</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold uppercase tracking-wider">Role</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold uppercase tracking-wider">Status</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold uppercase tracking-wider">Joined</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className={`${darkMode ? 'bg-slate-800' : 'bg-white'} divide-y ${darkMode ? 'divide-slate-700' : 'divide-gray-200'}`}>
                {filteredUsers.map((user) => (
                  <tr key={user.id} className="hover:bg-purple-50 dark:hover:bg-purple-900/20 transition-colors duration-200">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full flex items-center justify-center text-white font-bold">
                          {user.firstName.charAt(0)}{user.lastName.charAt(0)}
                        </div>
                        <div>
                          <div className="font-semibold">{user.firstName} {user.lastName}</div>
                          <div className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                            {user.email}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center space-x-2">
                        {getRoleIcon(user.role)}
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getRoleColor(user.role)}`}>
                          {getRoleDisplayName(user.role)}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        user.status === 'active' 
                          ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400'
                          : 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400'
                      }`}>
                        {user.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      {user.createdAt.toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {userProfile?.role === ROLES.SUPER_ADMIN && user.id !== userProfile.id && (
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => {
                              setSelectedUser(user);
                              setShowRoleModal(true);
                            }}
                            className="text-blue-500 hover:text-blue-600 transition-colors duration-200"
                          >
                            <Settings className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => handleSuspendUser(user.id, user.status === 'active')}
                            className={`transition-colors duration-200 ${
                              user.status === 'active'
                                ? 'text-red-500 hover:text-red-600'
                                : 'text-green-500 hover:text-green-600'
                            }`}
                          >
                            {user.status === 'active' ? <X className="h-4 w-4" /> : <Check className="h-4 w-4" />}
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Pending Invitations */}
        {invitations.filter(i => i.status === 'pending').length > 0 && (
          <div className={`${darkMode ? 'bg-slate-800' : 'bg-white'} rounded-xl shadow-lg p-6`}>
            <h3 className="text-xl font-bold mb-4">Pending Invitations</h3>
            <div className="space-y-3">
              {invitations
                .filter(i => i.status === 'pending')
                .map((invitation) => (
                  <div key={invitation.id} className={`${darkMode ? 'bg-slate-700' : 'bg-gray-50'} rounded-lg p-4 flex items-center justify-between`}>
                    <div className="flex items-center space-x-3">
                      <Mail className="h-5 w-5 text-blue-500" />
                      <div>
                        <p className="font-semibold">{invitation.email}</p>
                        <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                          Invited as {getRoleDisplayName(invitation.role)} by {invitation.invitedByName}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                        Expires: {invitation.expiresAt.toLocaleDateString()}
                      </span>
                      {userProfile?.role === ROLES.SUPER_ADMIN && (
                        <button
                          onClick={() => handleCancelInvitation(invitation.id)}
                          className="text-red-500 hover:text-red-600 transition-colors duration-200"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      )}
                    </div>
                  </div>
                ))}
            </div>
          </div>
        )}

        {/* Invite User Modal */}
        {showInviteModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className={`${darkMode ? 'bg-slate-800' : 'bg-white'} rounded-xl p-6 w-full max-w-md mx-4`}>
              <h3 className="text-xl font-bold mb-4">Invite User</h3>
              <form onSubmit={handleInviteUser} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Email Address</label>
                  <input
                    type="email"
                    value={inviteForm.email}
                    onChange={(e) => setInviteForm(prev => ({ ...prev, email: e.target.value }))}
                    required
                    className={`w-full px-4 py-2 rounded-lg border ${
                      darkMode
                        ? 'bg-slate-700 border-slate-600 text-white'
                        : 'bg-white border-gray-300 text-gray-900'
                    } focus:outline-none focus:ring-2 focus:ring-purple-500`}
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-2">Role</label>
                  <select
                    value={inviteForm.role}
                    onChange={(e) => setInviteForm(prev => ({ ...prev, role: e.target.value }))}
                    className={`w-full px-4 py-2 rounded-lg border ${
                      darkMode
                        ? 'bg-slate-700 border-slate-600 text-white'
                        : 'bg-white border-gray-300 text-gray-900'
                    } focus:outline-none focus:ring-2 focus:ring-purple-500`}
                  >
                    {userProfile?.role === ROLES.SUPER_ADMIN && (
                      <>
                        <option value={ROLES.ORGANIZER}>{getRoleDisplayName(ROLES.ORGANIZER)}</option>
                        <option value={ROLES.ADMIN}>{getRoleDisplayName(ROLES.ADMIN)}</option>
                      </>
                    )}
                  </select>
                </div>
                
                <div className="flex space-x-3">
                  <button
                    type="submit"
                    className="flex-1 bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white py-2 rounded-lg font-semibold transition-all duration-300"
                  >
                    Send Invitation
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowInviteModal(false)}
                    className={`flex-1 ${darkMode ? 'bg-slate-700 hover:bg-slate-600' : 'bg-gray-200 hover:bg-gray-300'} py-2 rounded-lg font-semibold transition-all duration-300`}
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Role Change Modal */}
        {showRoleModal && selectedUser && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className={`${darkMode ? 'bg-slate-800' : 'bg-white'} rounded-xl p-6 w-full max-w-md mx-4`}>
              <h3 className="text-xl font-bold mb-4">Change User Role</h3>
              <p className={`${darkMode ? 'text-gray-300' : 'text-gray-600'} mb-4`}>
                Change role for {selectedUser.firstName} {selectedUser.lastName}
              </p>
              
              <div className="space-y-3 mb-6">
                {Object.values(ROLES)
                  .filter(role => canAssignRole(userProfile!.role, role))
                  .map(role => (
                    <button
                      key={role}
                      onClick={() => handleUpdateUserRole(selectedUser.id, role)}
                      className={`w-full p-3 rounded-lg border text-left transition-all duration-200 ${
                        selectedUser.role === role
                          ? 'border-purple-500 bg-purple-50 dark:bg-purple-900/20'
                          : darkMode
                          ? 'border-slate-600 hover:border-purple-500'
                          : 'border-gray-300 hover:border-purple-500'
                      }`}
                    >
                      <div className="flex items-center space-x-3">
                        {getRoleIcon(role)}
                        <div>
                          <div className="font-semibold">{getRoleDisplayName(role)}</div>
                          <div className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                            {getRoleDescription(role)}
                          </div>
                        </div>
                      </div>
                    </button>
                  ))}
              </div>
              
              <button
                onClick={() => {
                  setShowRoleModal(false);
                  setSelectedUser(null);
                }}
                className={`w-full ${darkMode ? 'bg-slate-700 hover:bg-slate-600' : 'bg-gray-200 hover:bg-gray-300'} py-2 rounded-lg font-semibold transition-all duration-300`}
              >
                Cancel
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserManagement;