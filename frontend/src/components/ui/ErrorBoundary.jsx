import React from 'react';
import { Link } from 'react-router-dom';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Uncaught error in React ErrorBoundary:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex flex-col items-center justify-center text-center p-6 bg-[#FAF9F6] select-none">
          <div className="w-16 h-16 rounded-full bg-red-50 flex items-center justify-center text-red-500 border border-red-150/40 mb-5 shadow-sm">
            <span className="text-2xl font-bold">!</span>
          </div>
          <h2 className="text-xl font-bold text-neutral-900 mb-2">
            Something went wrong
          </h2>
          <p className="text-xs sm:text-sm text-gray-500 max-w-sm mb-8 leading-relaxed">
            We encountered an unexpected error. Please refresh the page or return to the home page.
          </p>
          <div className="flex gap-4">
            <button
              onClick={() => window.location.reload()}
              className="px-6 py-2.5 text-xs font-bold text-neutral-800 bg-white border border-neutral-200 hover:bg-neutral-50 rounded-full transition-all shadow-sm cursor-pointer"
            >
              Refresh Page
            </button>
            <a
              href="/"
              className="px-6 py-2.5 text-xs font-bold text-white bg-neutral-950 hover:bg-neutral-850 rounded-full transition-all shadow-md cursor-pointer"
            >
              Back to Home
            </a>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
