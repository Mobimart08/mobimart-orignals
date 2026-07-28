import React, { useEffect, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import MainLayout from '../layouts/MainLayout';
import { authService } from '../api/services';
import SEO from '../components/ui/SEO';
import { MailCheck, Check, XCircle } from 'lucide-react';

const VerifyEmailPage = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');
  const [status, setStatus] = useState('verifying'); // verifying, success, error
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    if (!token) {
      setStatus('error');
      setErrorMessage('Invalid or missing verification token.');
      return;
    }

    const verifyToken = async () => {
      try {
        await authService.verifyEmail(token);
        setStatus('success');
      } catch (err) {
        setStatus('error');
        setErrorMessage(err.response?.data?.message || 'Verification failed. Token may have expired.');
      }
    };

    verifyToken();
  }, [token]);

  return (
    <MainLayout>
      <SEO title="Verify Email" description="Verify your MobiMart account email address" />
      <div className="min-h-[70vh] flex flex-col items-center justify-center p-6 bg-[#FAF9F6]">
        <div className="w-full max-w-md bg-white rounded-3xl p-8 shadow-soft-ui border border-gray-150/40 text-center">
          
          {status === 'verifying' && (
            <div className="flex flex-col items-center animate-pulse">
              <div className="w-16 h-16 bg-[#ECEFF2]/50 rounded-full flex items-center justify-center mb-6 text-neutral-800">
                <MailCheck size={32} strokeWidth={2} />
              </div>
              <h2 className="text-xl font-extrabold text-neutral-950 mb-2">Verifying Email...</h2>
              <p className="text-sm font-bold text-gray-500">Please wait while we verify your email address.</p>
            </div>
          )}

          {status === 'success' && (
            <div className="flex flex-col items-center animate-fade-in">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-6 text-green-600">
                <Check size={32} strokeWidth={3} />
              </div>
              <h2 className="text-xl font-extrabold text-neutral-950 mb-2">Email Verified</h2>
              <p className="text-sm font-bold text-gray-500 mb-6">
                Your email address has been successfully verified. Welcome to MobiMart!
              </p>
              <Link
                to="/"
                className="w-full py-3 bg-neutral-950 hover:bg-neutral-800 text-white text-xs font-black rounded-xl inline-block"
              >
                Go to Home
              </Link>
            </div>
          )}

          {status === 'error' && (
            <div className="flex flex-col items-center animate-fade-in">
              <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mb-6 text-red-500 border border-red-100">
                <XCircle size={32} strokeWidth={2} />
              </div>
              <h2 className="text-xl font-extrabold text-neutral-950 mb-2">Verification Failed</h2>
              <p className="text-sm font-bold text-gray-500 mb-6">
                {errorMessage}
              </p>
              <Link
                to="/"
                className="w-full py-3 bg-neutral-950 hover:bg-neutral-800 text-white text-xs font-black rounded-xl inline-block"
              >
                Go to Home
              </Link>
            </div>
          )}

        </div>
      </div>
    </MainLayout>
  );
};

export default VerifyEmailPage;
