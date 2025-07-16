import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import LoadingSpinner from './components/LoadingSpinner';
import ErrorMessage from './components/ErrorMessage';
import Home from './pages/Home';
import Teams from './pages/Teams';
import Players from './pages/Players';
import Fixtures from './pages/Fixtures';
import Standings from './pages/Standings';
import Transfers from './pages/Transfers';
import Admin from './pages/Admin';
import SignIn from './pages/SignIn';
import Register from './pages/Register';
import UserManagement from './pages/UserManagement';
import PlayerProfile from './pages/PlayerProfile';
import ProtectedRoute from './components/ProtectedRoute';
import { ThemeProvider } from './contexts/ThemeContext';
import { AuthProvider } from './contexts/AuthContext';
import { DataProvider, useData } from './contexts/DataContext';
import { PERMISSIONS, ROLES } from './utils/permissions';

const AppContent: React.FC = () => {
  const { loading, error, refreshData } = useData();

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <LoadingSpinner size="lg" text="Loading LPTL data..." />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-4">
        <div className="max-w-md w-full">
          <ErrorMessage message={error} onRetry={refreshData} />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/teams" element={<Teams />} />
        <Route path="/players" element={<Players />} />
        <Route path="/fixtures" element={<Fixtures />} />
        <Route path="/standings" element={<Standings />} />
        <Route path="/transfers" element={
          <ProtectedRoute requiredPermission={PERMISSIONS.TRANSFER_PLAYERS}>
            <Transfers />
          </ProtectedRoute>
        } />
        <Route path="/admin" element={
          <ProtectedRoute requiredPermissions={[PERMISSIONS.MANAGE_LIVE_MATCHES, PERMISSIONS.SYSTEM_ADMIN]}>
            <Admin />
          </ProtectedRoute>
        } />
        <Route path="/users" element={
          <ProtectedRoute requiredPermission={PERMISSIONS.MANAGE_USERS}>
            <UserManagement />
          </ProtectedRoute>
        } />
        <Route path="/signin" element={<SignIn />} />
        <Route path="/register" element={<Register />} />
        <Route path="/player/:id" element={<PlayerProfile />} />
      </Routes>
    </div>
  );
};

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <DataProvider>
          <Router>
            <AppContent />
          </Router>
        </DataProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;