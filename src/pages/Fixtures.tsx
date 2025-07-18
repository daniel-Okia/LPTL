import React, { useState } from 'react';
import { Calendar, Clock, MapPin, Play, Pause, Trophy, Eye } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';
import { useData } from '../contexts/DataContext';

const Fixtures: React.FC = () => {
  const { darkMode } = useTheme();
  const { matches, teams, updateMatch } = useData();
  const [selectedMatch, setSelectedMatch] = useState<string | null>(null);

  const getMatchesByStatus = (status: string) => {
    return matches.filter(match => match.status === status);
  };

  const liveMatches = getMatchesByStatus('live');
  const upcomingMatches = getMatchesByStatus('scheduled');
  const finishedMatches = getMatchesByStatus('finished');

  const handleScoreUpdate = (matchId: string, homeScore: number, awayScore: number) => {
    updateMatch(matchId, homeScore, awayScore, 'live');
  };

  const handleMatchFinish = (matchId: string) => {
    const match = matches.find(m => m.id === matchId);
    if (match) {
      updateMatch(matchId, match.homeScore, match.awayScore, 'finished');
    }
  };

  const MatchCard: React.FC<{ match: any }> = ({ match }) => {
    const homeTeam = teams.find(t => t.id === match.homeTeam);
    const awayTeam = teams.find(t => t.id === match.awayTeam);

    return (
      <div className={`${darkMode ? 'bg-slate-800' : 'bg-white'} rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden ${
        match.status === 'live' ? 'border-2 border-red-500' : ''
      }`}>
        {/* Match Header */}
        <div className={`px-6 py-4 border-b ${darkMode ? 'border-slate-700' : 'border-gray-200'}`}>
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-2">
              {match.status === 'live' && (
                <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
              )}
              <span className={`text-sm font-semibold ${
                match.status === 'live' ? 'text-red-500' : 
                match.status === 'finished' ? 'text-green-500' : 
                darkMode ? 'text-gray-400' : 'text-gray-600'
              }`}>
                {match.status === 'live' ? 'LIVE' : 
                 match.status === 'finished' ? 'FINISHED' : 'SCHEDULED'}
              </span>
            </div>
            <div className="flex items-center space-x-4">
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
          </div>
        </div>

        {/* Match Content */}
        <div className="p-6">
          {/* Teams */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3 flex-1">
              <img 
                src={homeTeam?.logo} 
                alt={`${homeTeam?.name} logo`}
                className="w-12 h-12 object-contain rounded-lg"
              />
              <div>
                <h3 className="font-bold text-lg">{homeTeam?.name}</h3>
                <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Home</p>
              </div>
            </div>

            {/* Score */}
            <div className="flex items-center space-x-4">
              {match.status === 'finished' || match.status === 'live' ? (
                <div className="text-center">
                  <div className="text-4xl font-bold bg-gradient-to-r from-purple-500 to-blue-500 bg-clip-text text-transparent">
                    {match.homeScore} - {match.awayScore}
                  </div>
                  {match.status === 'live' && (
                    <p className="text-sm text-red-500 font-semibold">Live</p>
                  )}
                </div>
              ) : (
                <div className="text-2xl font-bold bg-gradient-to-r from-purple-500 to-blue-500 bg-clip-text text-transparent">
                  VS
                </div>
              )}
            </div>

            <div className="flex items-center space-x-3 flex-1 justify-end">
              <div className="text-right">
                <h3 className="font-bold text-lg">{awayTeam?.name}</h3>
                <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Away</p>
              </div>
              <img 
                src={awayTeam?.logo} 
                alt={`${awayTeam?.name} logo`}
                className="w-12 h-12 object-contain rounded-lg"
              />
            </div>
          </div>

          {/* Venue */}
          <div className="flex items-center justify-center space-x-2 mb-4">
            <MapPin className="h-4 w-4 text-gray-500" />
            <span className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              {match.venue}
            </span>
          </div>

          {/* Actions */}
          <div className="flex space-x-2">
            {match.status === 'live' && (
              <>
                <button
                  onClick={() => setSelectedMatch(selectedMatch === match.id ? null : match.id)}
                  className="flex-1 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white px-4 py-2 rounded-lg font-semibold transition-all duration-300 transform hover:scale-105 flex items-center justify-center space-x-2"
                >
                  <Eye className="h-4 w-4" />
                  <span>Update Score</span>
                </button>
                <button
                  onClick={() => handleMatchFinish(match.id)}
                  className="bg-gradient-to-r from-green-500 to-teal-500 hover:from-green-600 hover:to-teal-600 text-white px-4 py-2 rounded-lg font-semibold transition-all duration-300 transform hover:scale-105 flex items-center justify-center space-x-2"
                >
                  <Trophy className="h-4 w-4" />
                  <span>Finish</span>
                </button>
              </>
            )}
            {match.status === 'scheduled' && (
              <button
                onClick={() => updateMatch(match.id, 0, 0, 'live')}
                className="flex-1 bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 text-white px-4 py-2 rounded-lg font-semibold transition-all duration-300 transform hover:scale-105 flex items-center justify-center space-x-2"
              >
                <Play className="h-4 w-4" />
                <span>Start Match</span>
              </button>
            )}
            {match.status === 'finished' && (
              <button className="flex-1 bg-gradient-to-r from-gray-500 to-gray-600 text-white px-4 py-2 rounded-lg font-semibold cursor-not-allowed flex items-center justify-center space-x-2">
                <Trophy className="h-4 w-4" />
                <span>Match Ended</span>
              </button>
            )}
          </div>
        </div>

        {/* Score Update Panel */}
        {selectedMatch === match.id && match.status === 'live' && (
          <div className={`${darkMode ? 'bg-slate-700' : 'bg-gray-50'} border-t p-4`}>
            <div className="flex items-center justify-center space-x-4">
              <div className="text-center">
                <p className="text-sm font-semibold mb-2">{homeTeam?.name}</p>
                <input
                  type="number"
                  min="0"
                  value={match.homeScore}
                  onChange={(e) => handleScoreUpdate(match.id, parseInt(e.target.value) || 0, match.awayScore)}
                  className={`w-16 text-center py-2 rounded-lg border ${
                    darkMode
                      ? 'bg-slate-600 border-slate-500 text-white'
                      : 'bg-white border-gray-300 text-gray-900'
                  } focus:outline-none focus:ring-2 focus:ring-purple-500`}
                />
              </div>
              <span className="text-2xl font-bold">-</span>
              <div className="text-center">
                <p className="text-sm font-semibold mb-2">{awayTeam?.name}</p>
                <input
                  type="number"
                  min="0"
                  value={match.awayScore}
                  onChange={(e) => handleScoreUpdate(match.id, match.homeScore, parseInt(e.target.value) || 0)}
                  className={`w-16 text-center py-2 rounded-lg border ${
                    darkMode
                      ? 'bg-slate-600 border-slate-500 text-white'
                      : 'bg-white border-gray-300 text-gray-900'
                  } focus:outline-none focus:ring-2 focus:ring-purple-500`}
                />
              </div>
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className={`min-h-screen ${darkMode ? 'text-white' : 'text-gray-900'} pt-8`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            <span className="bg-gradient-to-r from-purple-400 via-blue-500 to-green-400 bg-clip-text text-transparent">
              Fixtures & Results
            </span>
          </h1>
          <p className={`text-xl ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
            Follow all the action from the Leisure Park Turf League
          </p>
        </div>

        {/* Live Matches */}
        {liveMatches.length > 0 && (
          <div className="mb-12">
            <div className="flex items-center mb-6">
              <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse mr-3"></div>
              <h2 className="text-3xl font-bold">Live Matches</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {liveMatches.map((match) => (
                <MatchCard key={match.id} match={match} />
              ))}
            </div>
          </div>
        )}

        {/* Upcoming Matches */}
        {upcomingMatches.length > 0 && (
          <div className="mb-12">
            <h2 className="text-3xl font-bold mb-6">Upcoming Matches</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {upcomingMatches.map((match) => (
                <MatchCard key={match.id} match={match} />
              ))}
            </div>
          </div>
        )}

        {/* Recent Results */}
        {finishedMatches.length > 0 && (
          <div className="mb-12">
            <h2 className="text-3xl font-bold mb-6">Recent Results</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {finishedMatches.map((match) => (
                <MatchCard key={match.id} match={match} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Fixtures;