import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Trophy, Users, Calendar, BarChart3, ArrowRightLeft, Settings, Moon, Sun } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';

const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const { darkMode, toggleDarkMode } = useTheme();

  const navItems = [
    { name: 'Home', path: '/', icon: Trophy },
    { name: 'Teams', path: '/teams', icon: Users },
    { name: 'Players', path: '/players', icon: Users },
    { name: 'Fixtures', path: '/fixtures', icon: Calendar },
    { name: 'Standings', path: '/standings', icon: BarChart3 },
    { name: 'Transfers', path: '/transfers', icon: ArrowRightLeft },
    { name: 'Admin', path: '/admin', icon: Settings },
  ];

  const isActive = (path: string) => location.pathname === path;

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
            <div className="bg-gradient-to-r from-purple-500 to-green-500 p-2 rounded-lg">
              <Trophy className="h-6 w-6 text-white" />
            </div>
            <span className={`text-xl font-bold bg-gradient-to-r from-purple-500 to-green-500 bg-clip-text text-transparent`}>
              LPTL
            </span>
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
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;