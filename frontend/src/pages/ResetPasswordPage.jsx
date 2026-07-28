import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import MainLayout from '../layouts/MainLayout';
import { authService } from '../api/services';
import SEO from '../components/ui/SEO';
import { ShieldCheck, Check, Eye, EyeOff } from 'lucide-react';

const ResetPasswordPage = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');
  const navigate = useNavigate();

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [status, setStatus] = useState('idle'); // idle, loading, success, error
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    if (!token) {
      setStatus('error');
      setErrorMessage('Invalid or missing reset token.');
    }
  }, [token]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setStatus('error');
      setErrorMessage('Passwords do not match.');
      return;
    }
    if (password.length < 6) {
      setStatus('error');
      setErrorMessage('Password must be at least 6 characters long.');
      return;
    }

    setStatus('loading');
    try {
      await authService.resetPassword({ token, newPassword: password });
      setStatus('success');
    } catch (err) {
      setStatus('error');
      setErrorMessage(err.response?.data?.message || 'Failed to reset password. Token may have expired.');
    }
  };

  return (
    <MainLayout>
      <SEO title="Reset Password" description="Reset your MobiMart account password" />
      <div className="min-h-[70vh] flex flex-col items-center justify-center p-6 bg-[#FAF9F6]">
        <div className="w-full max-w-md bg-white rounded-3xl p-8 shadow-soft-ui border border-gray-150/40 text-center">
          <div className="w-16 h-16 bg-[#ECEFF2]/50 rounded-full flex items-center justify-center mx-auto mb-6 text-neutral-800">
            <ShieldCheck size={32} strokeWidth={2} />
          </div>
          <h2 className="text-xl font-extrabold text-neutral-950 mb-2">Reset Password</h2>
          
          {status === 'success' ? (
            <div className="flex flex-col gap-4 animate-fade-in mt-4">
              <div className="w-12 h-12 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto">
                <Check size={24} strokeWidth={3} />
              </div>
              <p className="text-sm font-bold text-gray-500">
                Your password has been successfully reset.
              </p>
              <Link
                to="/"
                className="w-full py-3 bg-neutral-950 hover:bg-neutral-800 text-white text-xs font-black rounded-xl mt-4 inline-block"
              >
                Go to Home
              </Link>
            </div>
          ) : (
            <>
              <p className="text-xs text-gray-400 font-bold mb-6">
                Enter your new password below.
              </p>

              {status === 'error' && (
                <div className="mb-6 p-3 bg-red-50 text-red-600 text-[11px] font-bold rounded-xl text-left border border-red-200">
                  {errorMessage}
                </div>
              )}

              <form onSubmit={handleSubmit} className="flex flex-col gap-4 text-left">
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-black text-neutral-900 uppercase tracking-wider">New Password</label>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      disabled={!token || status === 'loading'}
                      className="w-full bg-[#ECEFF2]/30 focus:bg-white text-xs text-neutral-850 px-4 py-2.5 rounded-xl border border-neutral-200/50 focus:outline-none focus:border-[#C5A880] transition-all pr-10"
                      placeholder="••••••••"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors p-1"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-black text-neutral-900 uppercase tracking-wider">Confirm Password</label>
                  <div className="relative">
                    <input
                      type={showConfirmPassword ? "text" : "password"}
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      required
                      disabled={!token || status === 'loading'}
                      className="w-full bg-[#ECEFF2]/30 focus:bg-white text-xs text-neutral-850 px-4 py-2.5 rounded-xl border border-neutral-200/50 focus:outline-none focus:border-[#C5A880] transition-all pr-10"
                      placeholder="••••••••"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors p-1"
                    >
                      {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
                <button
                  type="submit"
                  disabled={!token || status === 'loading'}
                  className="w-full py-3 bg-neutral-950 hover:bg-neutral-800 text-white text-xs font-black rounded-xl flex items-center justify-center mt-2 disabled:opacity-50"
                >
                  {status === 'loading' ? (
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    'Reset Password'
                  )}
                </button>
              </form>
            </>
          )}
        </div>
      </div>
    </MainLayout>
  );
};

export default ResetPasswordPage;
