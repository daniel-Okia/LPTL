import React from 'react';
import { AlertCircle, RefreshCw } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';

interface ErrorMessageProps {
  message: string;
  onRetry?: () => void;
}

const ErrorMessage: React.FC<ErrorMessageProps> = ({ message, onRetry }) => {
  const { darkMode } = useTheme();

  return (
    <div className={`${darkMode ? 'bg-red-900/20' : 'bg-red-50'} border border-red-200 rounded-lg p-6 text-center`}>
      <div className="flex items-center justify-center mb-4">
        <AlertCircle className="h-8 w-8 text-red-500" />
      </div>
      <h3 className="text-lg font-semibold text-red-700 dark:text-red-400 mb-2">
        Something went wrong
      </h3>
      <p className={`text-sm ${darkMode ? 'text-red-300' : 'text-red-600'} mb-4`}>
        {message}
      </p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg font-semibold transition-colors duration-200 flex items-center space-x-2 mx-auto"
        >
          <RefreshCw className="h-4 w-4" />
          <span>Try Again</span>
        </button>
      )}
    </div>
  );
};

export default ErrorMessage;