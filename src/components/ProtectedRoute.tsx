import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import LoadingSpinner from './LoadingSpinner';
import { useTheme } from '../contexts/ThemeContext';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredPermission?: string;
  requiredPermissions?: string[];
  requiredRole?: string;
  fallbackPath?: string;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  requiredPermission,
  requiredPermissions,
  requiredRole,
  fallbackPath = '/'
}) => {
  const { currentUser, userProfile, loading, hasPermission, hasAnyPermission, isRole } = useAuth();
  const { darkMode } = useTheme();

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <LoadingSpinner size="lg" text="Checking permissions..." />
      </div>
    );
  }

  if (!currentUser || !userProfile) {
    return <Navigate to="/signin" replace />;
  }

  // Check role requirement
  if (requiredRole && !isRole(requiredRole)) {
    return (
      <div className={`min-h-screen ${darkMode ? 'text-white' : 'text-gray-900'} pt-8`}>
        <div className="max-w-md mx-auto px-4 sm:px-6 lg:px-8">
          <div className={`${darkMode ? 'bg-slate-800' : 'bg-white'} rounded-xl shadow-lg p-8 text-center`}>
            <div className="text-6xl mb-4">🚫</div>
            <h2 className="text-2xl font-bold mb-4">Access Denied</h2>
            <p className={`${darkMode ? 'text-gray-300' : 'text-gray-600'} mb-6`}>
              You don't have the required role to access this page.
            </p>
            <button
              onClick={() => window.history.back()}
              className="bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white px-6 py-3 rounded-lg font-semibold transition-all duration-300 transform hover:scale-105"
            >
              Go Back
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Check single permission requirement
  if (requiredPermission && !hasPermission(requiredPermission)) {
    return <Navigate to={fallbackPath} replace />;
  }

  // Check multiple permissions requirement (user needs at least one)
  if (requiredPermissions && !hasAnyPermission(requiredPermissions)) {
    return <Navigate to={fallbackPath} replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;