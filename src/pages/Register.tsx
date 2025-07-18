import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, Eye, EyeOff, User, Phone, UserPlus, ArrowLeft, Flag, Shield } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';
import { useAuth } from '../contexts/AuthContext';
import { useData } from '../contexts/DataContext';
import LoadingSpinner from '../components/LoadingSpinner';

const Register: React.FC = () => {
  const { darkMode } = useTheme();
  const { signUp, createAdminAccount } = useAuth();
  const { teams } = useData();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    favoriteTeamId: '',
    agreeToTerms: false,
    createAsAdmin: false
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      setLoading(false);
      return;
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters long');
      setLoading(false);
      return;
    }

    try {
      const userData = {
        firstName: formData.firstName,
        lastName: formData.lastName,
        phone: formData.phone,
        favoriteTeamId: formData.favoriteTeamId || undefined
      };

      if (formData.createAsAdmin) {
        await createAdminAccount(formData.email, formData.password, userData);
      } else {
        await signUp(formData.email, formData.password, userData);
      }
      
      navigate('/');
    } catch (err: any) {
      setError(err.message || 'Failed to create account. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`min-h-screen ${darkMode ? 'text-white' : 'text-gray-900'} pt-8 pb-12`}>
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back to Home */}
        <Link
          to="/"
          className="inline-flex items-center space-x-2 mb-8 text-purple-500 hover:text-purple-600 transition-colors duration-200"
        >
          <ArrowLeft className="h-5 w-5" />
          <span>Back to Home</span>
        </Link>

        {/* Logo and Header */}
        <div className="text-center mb-8">
          <img 
            src="/LPTL Transparent Logo.png" 
            alt="LPTL Logo" 
            className="h-20 w-auto mx-auto mb-4"
          />
          <h1 className="text-3xl font-bold mb-2">
            <span className="bg-gradient-to-r from-purple-400 via-blue-500 to-green-400 bg-clip-text text-transparent">
              Join LPTL
            </span>
          </h1>
          <p className={`text-lg ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
            Create your account and become part of the community
          </p>
        </div>

        {/* Registration Form */}
        <div className={`${darkMode ? 'bg-slate-800' : 'bg-white'} rounded-xl shadow-lg p-8`}>
          {error && (
            <div className="mb-6 p-4 bg-red-100 dark:bg-red-900/20 border border-red-300 dark:border-red-700 rounded-lg">
              <p className="text-red-700 dark:text-red-400 text-sm">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Name Fields */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium mb-2">First Name</label>
                <div className="relative">
                  <User className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                  <input
                    type="text"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleInputChange}
                    placeholder="Enter your first name"
                    required
                    disabled={loading}
                    className={`w-full pl-10 pr-4 py-3 rounded-lg border transition-colors duration-200 ${
                      darkMode
                        ? 'bg-slate-700 border-slate-600 text-white placeholder-gray-400 focus:border-purple-500'
                        : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500 focus:border-purple-500'
                    } focus:outline-none focus:ring-2 focus:ring-purple-500/20 disabled:opacity-50`}
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Last Name</label>
                <div className="relative">
                  <User className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                  <input
                    type="text"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleInputChange}
                    placeholder="Enter your last name"
                    required
                    disabled={loading}
                    className={`w-full pl-10 pr-4 py-3 rounded-lg border transition-colors duration-200 ${
                      darkMode
                        ? 'bg-slate-700 border-slate-600 text-white placeholder-gray-400 focus:border-purple-500'
                        : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500 focus:border-purple-500'
                    } focus:outline-none focus:ring-2 focus:ring-purple-500/20 disabled:opacity-50`}
                  />
                </div>
              </div>
            </div>

            {/* Email Field */}
            <div>
              <label className="block text-sm font-medium mb-2">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="Enter your email"
                  required
                  disabled={loading}
                  className={`w-full pl-10 pr-4 py-3 rounded-lg border transition-colors duration-200 ${
                    darkMode
                      ? 'bg-slate-700 border-slate-600 text-white placeholder-gray-400 focus:border-purple-500'
                      : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500 focus:border-purple-500'
                  } focus:outline-none focus:ring-2 focus:ring-purple-500/20 disabled:opacity-50`}
                />
              </div>
            </div>

            {/* Phone Field */}
            <div>
              <label className="block text-sm font-medium mb-2">Phone Number</label>
              <div className="relative">
                <Phone className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  placeholder="Enter your phone number"
                  disabled={loading}
                  className={`w-full pl-10 pr-4 py-3 rounded-lg border transition-colors duration-200 ${
                    darkMode
                      ? 'bg-slate-700 border-slate-600 text-white placeholder-gray-400 focus:border-purple-500'
                      : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500 focus:border-purple-500'
                  } focus:outline-none focus:ring-2 focus:ring-purple-500/20 disabled:opacity-50`}
                />
              </div>
            </div>

            {/* Favorite Team */}
            <div>
              <label className="block text-sm font-medium mb-2">Favorite Team (Optional)</label>
              <div className="relative">
                <Flag className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                <select
                  name="favoriteTeamId"
                  value={formData.favoriteTeamId}
                  onChange={handleInputChange}
                  disabled={loading}
                  className={`w-full pl-10 pr-4 py-3 rounded-lg border transition-colors duration-200 ${
                    darkMode
                      ? 'bg-slate-700 border-slate-600 text-white focus:border-purple-500'
                      : 'bg-white border-gray-300 text-gray-900 focus:border-purple-500'
                  } focus:outline-none focus:ring-2 focus:ring-purple-500/20 disabled:opacity-50`}
                >
                  <option value="">Select your favorite team</option>
                  {teams.map(team => (
                    <option key={team.id} value={team.id}>
                      {team.logo} {team.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Password Fields */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium mb-2">Password</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    placeholder="Create a password"
                    required
                    disabled={loading}
                    className={`w-full pl-10 pr-12 py-3 rounded-lg border transition-colors duration-200 ${
                      darkMode
                        ? 'bg-slate-700 border-slate-600 text-white placeholder-gray-400 focus:border-purple-500'
                        : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500 focus:border-purple-500'
                    } focus:outline-none focus:ring-2 focus:ring-purple-500/20 disabled:opacity-50`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    disabled={loading}
                    className="absolute right-3 top-3 text-gray-400 hover:text-gray-600 transition-colors duration-200 disabled:opacity-50"
                  >
                    {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Confirm Password</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    placeholder="Confirm your password"
                    required
                    disabled={loading}
                    className={`w-full pl-10 pr-12 py-3 rounded-lg border transition-colors duration-200 ${
                      darkMode
                        ? 'bg-slate-700 border-slate-600 text-white placeholder-gray-400 focus:border-purple-500'
                        : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500 focus:border-purple-500'
                    } focus:outline-none focus:ring-2 focus:ring-purple-500/20 disabled:opacity-50`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    disabled={loading}
                    className="absolute right-3 top-3 text-gray-400 hover:text-gray-600 transition-colors duration-200 disabled:opacity-50"
                  >
                    {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </div>
              </div>
            </div>

            {/* Terms Agreement */}
            <div className="flex items-start space-x-2">
              <input
                type="checkbox"
                name="createAsAdmin"
                checked={formData.createAsAdmin}
                onChange={handleInputChange}
                disabled={loading}
                className="w-4 h-4 text-red-600 bg-gray-100 border-gray-300 rounded focus:ring-red-500 focus:ring-2 mt-1 disabled:opacity-50"
              />
              <label className="text-sm flex items-center space-x-2">
                <Shield className="h-4 w-4 text-red-500" />
                <span>Create as Admin Account (for testing purposes)</span>
              </label>
            </div>

            <div className="flex items-start space-x-2">
              <input
                type="checkbox"
                name="agreeToTerms"
                checked={formData.agreeToTerms}
                onChange={handleInputChange}
                required
                disabled={loading}
                className="w-4 h-4 text-purple-600 bg-gray-100 border-gray-300 rounded focus:ring-purple-500 focus:ring-2 mt-1 disabled:opacity-50"
              />
              <label className="text-sm">
                I agree to the{' '}
                <button
                  type="button"
                  disabled={loading}
                  className="text-purple-500 hover:text-purple-600 transition-colors duration-200 disabled:opacity-50"
                >
                  Terms of Service
                </button>{' '}
                and{' '}
                <button
                  type="button"
                  disabled={loading}
                  className="text-purple-500 hover:text-purple-600 transition-colors duration-200 disabled:opacity-50"
                >
                  Privacy Policy
                </button>
              </label>
            </div>

            {/* Register Button */}
            <button
              type="submit"
              disabled={!formData.agreeToTerms || loading}
              className={`w-full py-3 rounded-lg font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl flex items-center justify-center space-x-2 ${
                formData.agreeToTerms && !loading
                  ? 'bg-gradient-to-r from-green-500 to-teal-500 hover:from-green-600 hover:to-teal-600 text-white'
                  : 'bg-gray-400 text-gray-600 cursor-not-allowed transform-none'
              }`}
            >
              {loading ? (
                <LoadingSpinner size="sm" />
              ) : (
                <>
                  <UserPlus className="h-5 w-5" />
                  <span>Create Account</span>
                </>
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="my-6">
            <div className="relative">
              <div className={`absolute inset-0 flex items-center`}>
                <div className={`w-full border-t ${darkMode ? 'border-slate-600' : 'border-gray-300'}`}></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className={`px-2 ${darkMode ? 'bg-slate-800 text-gray-400' : 'bg-white text-gray-500'}`}>
                  Already have an account?
                </span>
              </div>
            </div>
          </div>

          {/* Sign In Link */}
          <Link
            to="/signin"
            className="w-full bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white py-3 rounded-lg font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl flex items-center justify-center space-x-2"
          >
            <span>Sign In Instead</span>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Register;