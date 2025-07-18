import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Trophy, Users, Calendar, BarChart3, ArrowRightLeft, Settings, Moon, Sun, LogOut, User } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';
import { useAuth } from '../contexts/AuthContext';
import { PERMISSIONS } from '../utils/permissions';

const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const { darkMode, toggleDarkMode } = useTheme();
  const { currentUser, userProfile, hasPermission, logout } = useAuth();

  const navItems = [
    { name: 'Home', path: '/', icon: Trophy },
    { name: 'Teams', path: '/teams', icon: Users },
    { name: 'Players', path: '/players', icon: Users },
    { name: 'Fixtures', path: '/fixtures', icon: Calendar },
    { name: 'Standings', path: '/standings', icon: BarChart3 },
    { name: 'Transfers', path: '/transfers', icon: ArrowRightLeft },
  ].filter(item => {
    // Basic pages are available to everyone
    if (['/', '/teams', '/players', '/fixtures', '/standings'].includes(item.path)) {
      return true;
    }
    // Transfers page requires transfer permission
    if (item.path === '/transfers') {
      return hasPermission(PERMISSIONS.TRANSFER_PLAYERS);
    }
    return true;
  });

  // Admin navigation items
  const adminNavItems = [];
  if (hasPermission(PERMISSIONS.MANAGE_LIVE_MATCHES) || hasPermission(PERMISSIONS.SYSTEM_ADMIN)) {
    adminNavItems.push({ name: 'Admin', path: '/admin', icon: Settings });
  }
  if (hasPermission(PERMISSIONS.MANAGE_USERS)) {
    adminNavItems.push({ name: 'Users', path: '/users', icon: Users });
  }

  const isActive = (path: string) => location.pathname === path;

  const handleSignOut = async () => {
    try {
      await logout();
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };
  return (
    <nav className={`sticky top-0 z-50 backdrop-blur-lg border-b ${
      darkMode 
        ? 'bg-slate-900/90 border-purple-500/20' 
        : 'bg-white/90 border-purple-200'
    } transition-all duration-300`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center space-x-2">
            <img 
              src="/LPTL Transparent Logo.png" 
              alt="LPTL Logo" 
              className="h-10 w-auto"
            />
            <div className="flex flex-col">
              <span className={`text-lg font-bold bg-gradient-to-r from-purple-500 to-green-500 bg-clip-text text-transparent`}>
                LPTL
              </span>
              <span className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                12 Teams • Season 2024
              </span>
            </div>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-6">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.name}
                  to={item.path}
                  className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-all duration-200 ${
                    isActive(item.path)
                      ? 'bg-gradient-to-r from-purple-500 to-green-500 text-white shadow-lg transform scale-105'
                      : darkMode
                      ? 'text-gray-300 hover:text-white hover:bg-purple-800/50'
                      : 'text-gray-700 hover:text-purple-600 hover:bg-purple-50'
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  <span className="text-sm font-medium">{item.name}</span>
                </Link>
              );
            })}
            
            {/* Admin Navigation */}
            {adminNavItems.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.name}
                  to={item.path}
                  className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-all duration-200 ${
                    isActive(item.path)
                      ? 'bg-gradient-to-r from-red-500 to-orange-500 text-white shadow-lg transform scale-105'
                      : darkMode
                      ? 'text-gray-300 hover:text-white hover:bg-red-800/50'
                      : 'text-gray-700 hover:text-red-600 hover:bg-red-50'
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  <span className="text-sm font-medium">{item.name}</span>
                </Link>
              );
            })}
            
            {/* User Menu */}
            {currentUser && userProfile && (
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
                    {userProfile.firstName.charAt(0)}{userProfile.lastName.charAt(0)}
                  </div>
                  <div className="hidden lg:block">
                    <p className={`text-sm font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                      {userProfile.firstName} {userProfile.lastName}
                    </p>
                    <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                      {userProfile.role === 'super_admin' ? 'Super Admin' :
                       userProfile.role === 'admin' ? 'Admin' :
                       userProfile.role === 'organizer' ? 'Organizer' : 'Member'}
                    </p>
                  </div>
                </div>
                <button
                  onClick={handleSignOut}
                  className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-all duration-200 ${
                    darkMode
                      ? 'text-gray-300 hover:text-white hover:bg-red-800/50'
                      : 'text-gray-700 hover:text-red-600 hover:bg-red-50'
                  }`}
                  title="Sign Out"
                >
                  <LogOut className="h-4 w-4" />
                  <span className="text-sm font-medium">Sign Out</span>
                </button>
              </div>
            )}
            
            {/* Sign In Link for Non-Authenticated Users */}
            {!currentUser && (
              <Link
                to="/signin"
                className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-all duration-200 ${
                  darkMode
                    ? 'text-gray-300 hover:text-white hover:bg-green-800/50'
                    : 'text-gray-700 hover:text-green-600 hover:bg-green-50'
                }`}
              >
                <User className="h-4 w-4" />
                <span className="text-sm font-medium">Sign In</span>
              </Link>
            )}
            
            {/* Theme Toggle */}
            <button
              onClick={toggleDarkMode}
              className={`p-2 rounded-lg transition-all duration-200 ${
                darkMode
                  ? 'bg-purple-800/50 text-yellow-400 hover:bg-purple-700/50'
                  : 'bg-purple-100 text-purple-600 hover:bg-purple-200'
              }`}
            >
              {darkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </button>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center space-x-2">
            <button
              onClick={toggleDarkMode}
              className={`p-2 rounded-lg transition-all duration-200 ${
                darkMode
                  ? 'bg-purple-800/50 text-yellow-400'
                  : 'bg-purple-100 text-purple-600'
              }`}
            >
              {darkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </button>
            <button
              onClick={() => setIsOpen(!isOpen)}
              className={`p-2 rounded-lg transition-all duration-200 ${
                darkMode
                  ? 'text-gray-300 hover:text-white hover:bg-purple-800/50'
                  : 'text-gray-700 hover:text-purple-600 hover:bg-purple-50'
              }`}
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isOpen && (
        <div className={`md:hidden border-t ${
          darkMode ? 'border-purple-500/20 bg-slate-900/95' : 'border-purple-200 bg-white/95'
        } backdrop-blur-lg`}>
          <div className="px-2 pt-2 pb-3 space-y-1">
            {/* User Info Mobile */}
            {currentUser && userProfile && (
              <div className={`flex items-center space-x-3 px-3 py-2 rounded-lg ${
                darkMode ? 'bg-slate-800' : 'bg-gray-100'
              } mb-2`}>
                <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full flex items-center justify-center text-white font-bold">
                  {userProfile.firstName.charAt(0)}{userProfile.lastName.charAt(0)}
                </div>
                <div>
                  <p className={`font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                    {userProfile.firstName} {userProfile.lastName}
                  </p>
                  <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                    {userProfile.role === 'super_admin' ? 'Super Admin' :
                     userProfile.role === 'admin' ? 'Admin' :
                     userProfile.role === 'organizer' ? 'Organizer' : 'Member'}
                  </p>
                </div>
              </div>
            )}
            
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.name}
                  to={item.path}
                  onClick={() => setIsOpen(false)}
                  className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-all duration-200 ${
                    isActive(item.path)
                      ? 'bg-gradient-to-r from-purple-500 to-green-500 text-white shadow-lg'
                      : darkMode
                      ? 'text-gray-300 hover:text-white hover:bg-purple-800/50'
                      : 'text-gray-700 hover:text-purple-600 hover:bg-purple-50'
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  <span className="text-sm font-medium">{item.name}</span>
                </Link>
              );
            })}
            
            {/* Admin Navigation Mobile */}
            {adminNavItems.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.name}
                  to={item.path}
                  onClick={() => setIsOpen(false)}
                  className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-all duration-200 ${
                    isActive(item.path)
                      ? 'bg-gradient-to-r from-red-500 to-orange-500 text-white shadow-lg'
                      : darkMode
                      ? 'text-gray-300 hover:text-white hover:bg-red-800/50'
                      : 'text-gray-700 hover:text-red-600 hover:bg-red-50'
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  <span className="text-sm font-medium">{item.name}</span>
                </Link>
              );
            })}
            
            {/* Sign Out Mobile */}
            {currentUser && (
              <button
                onClick={() => {
                  handleSignOut();
                  setIsOpen(false);
                }}
                className={`w-full flex items-center space-x-2 px-3 py-2 rounded-lg transition-all duration-200 ${
                  darkMode
                    ? 'text-gray-300 hover:text-white hover:bg-red-800/50'
                    : 'text-gray-700 hover:text-red-600 hover:bg-red-50'
                }`}
              >
                <LogOut className="h-4 w-4" />
                <span className="text-sm font-medium">Sign Out</span>
              </button>
            )}
            
            {/* Sign In Mobile */}
            {!currentUser && (
              <Link
                to="/signin"
                onClick={() => setIsOpen(false)}
                className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-all duration-200 ${
                  darkMode
                    ? 'text-gray-300 hover:text-white hover:bg-green-800/50'
                    : 'text-gray-700 hover:text-green-600 hover:bg-green-50'
                }`}
              >
                <User className="h-4 w-4" />
                <span className="text-sm font-medium">Sign In</span>
              </Link>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;