import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { X, Eye, EyeOff } from 'lucide-react';
import { useToast } from '../../context/ToastContext';

const AuthModal = () => {
  const { authModalOpen, setAuthModalOpen, login, register } = useAuth();
  const { showToast } = useToast();
  const [view, setView] = useState('login'); // 'login' | 'register' | 'forgot'
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    password: '',
    rememberMe: false
  });
  const [loading, setLoading] = useState(false);
  const [forgotSuccess, setForgotSuccess] = useState(false);

  if (!authModalOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (view === 'login') {
        await login({ email: formData.email, password: formData.password, rememberMe: formData.rememberMe });
        showToast('Successfully logged in', 'success');
        setAuthModalOpen(false);
      } else if (view === 'register') {
        await register(formData);
        showToast('Successfully registered', 'success');
        setAuthModalOpen(false);
      } else if (view === 'forgot') {
        const { authService } = await import('../../api/services');
        await authService.forgotPassword(formData.email);
        setForgotSuccess(true);
        showToast('Password reset link sent to your email', 'success');
      }
    } catch (err) {
      const data = err.response?.data;
      if (data?.errors && data.errors.length > 0) {
        // Show the first validation error message instead of generic 'Input validation failed'
        showToast(data.errors[0].message, 'error');
      } else {
        const errorMessage = data?.message || (err.message === 'Network Error' ? 'Network Error: Cannot connect to server' : 'Authentication failed');
        showToast(errorMessage, 'error');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    let value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
    if (e.target.name === 'name') value = value.replace(/[^a-zA-Z\s-]/g, '');
    if (e.target.name === 'phone') value = value.replace(/\D/g, '').slice(0, 10);
    setFormData({ ...formData, [e.target.name]: value });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden relative">
        <button 
          onClick={() => setAuthModalOpen(false)}
          className="absolute right-4 top-4 text-gray-400 hover:text-gray-600"
        >
          <X className="w-6 h-6" />
        </button>

        <div className="p-6 sm:p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            {view === 'login' ? 'Welcome Back' : view === 'register' ? 'Create Account' : 'Reset Password'}
          </h2>

          {view === 'forgot' && forgotSuccess ? (
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4 text-green-500">
                <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">Check Your Email</h3>
              <p className="text-sm text-gray-600 mb-6">
                We've sent a password reset link to {formData.email}. The link will expire in 10 minutes.
              </p>
              <button
                type="button"
                onClick={() => {
                  setView('login');
                  setForgotSuccess(false);
                }}
                className="text-sm font-bold text-black hover:underline"
              >
                Back to Sign In
              </button>
            </div>
          ) : (
            <>
              <form onSubmit={handleSubmit} className="space-y-4">
                {view === 'register' && (
                  <>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-black outline-none transition-all"
                        placeholder="John Doe"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Mobile Number</label>
                      <input
                        type="tel"
                        name="phone"
                        maxLength={10}
                        value={formData.phone}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-black outline-none transition-all"
                        placeholder="10-digit number"
                      />
                    </div>
                  </>
                )}

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-black outline-none transition-all"
                    placeholder="you@example.com"
                  />
                </div>

                {view !== 'forgot' && (
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="block text-sm font-medium text-gray-700">Password</label>
                      {view === 'login' && (
                        <button
                          type="button"
                          onClick={() => setView('forgot')}
                          className="text-[11px] font-bold text-gray-500 hover:text-black transition-colors"
                        >
                          Forgot Password?
                        </button>
                      )}
                    </div>
                    <div className="relative">
                      <input
                        type={showPassword ? "text" : "password"}
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-black outline-none transition-all pr-10"
                        placeholder="••••••••"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors p-1 flex items-center justify-center focus:outline-none"
                      >
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>
                )}

                {view === 'login' && (
                  <div className="flex items-center">
                    <input
                      id="rememberMe"
                      name="rememberMe"
                      type="checkbox"
                      checked={formData.rememberMe}
                      onChange={handleChange}
                      className="h-4 w-4 text-black focus:ring-black border-gray-300 rounded cursor-pointer"
                    />
                    <label htmlFor="rememberMe" className="ml-2 block text-sm text-gray-700 cursor-pointer">
                      Remember me
                    </label>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-black text-white py-3 rounded-lg font-medium hover:bg-gray-900 transition-colors flex items-center justify-center mt-2"
                >
                  {loading ? (
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    view === 'login' ? 'Sign In' : view === 'register' ? 'Sign Up' : 'Send Reset Link'
                  )}
                </button>
              </form>

              <div className="mt-6 text-center">
                <button
                  type="button"
                  onClick={() => {
                    setView(view === 'login' ? 'register' : 'login');
                    setForgotSuccess(false);
                  }}
                  className="text-sm text-gray-600 hover:text-black hover:underline"
                >
                  {view === 'login' ? "Don't have an account? Sign up" : 'Already have an account? Sign in'}
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default AuthModal;
