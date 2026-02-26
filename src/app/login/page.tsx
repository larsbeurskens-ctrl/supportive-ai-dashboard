'use client';

import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { Mail, Loader2, ArrowRight } from 'lucide-react';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const result = await signIn('email', {
        email,
        callbackUrl: '/dashboard',
        redirect: false,
      });

      if (result?.error) {
        setError('Something went wrong. Please try again.');
      } else {
        // Redirect to check-email page
        window.location.href = '/login/check-email';
      }
    } catch (err) {
      setError('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
          {/* Logo/Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Supportive AI</h1>
            <p className="text-gray-500 mt-2">Sign in to your dashboard</p>
          </div>

          {/* Error message */}
          {error && (
            <div className="bg-red-50 text-red-700 p-4 rounded-xl mb-6 text-sm">
              {error}
            </div>
          )}

          {/* Login form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                Email address
              </label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@company.com"
                  required
                  className="w-full pl-12 pr-4 py-4 border border-[#e5e0da] rounded-xl text-lg focus:outline-none focus:ring-2 focus:ring-[#e8930c] focus:border-transparent"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading || !email}
              className="w-full flex items-center justify-center gap-2 bg-[#e8930c] text-white py-4 px-6 rounded-xl text-lg font-semibold hover:bg-[#d17f00] transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-[0_2px_8px_rgba(232,147,12,0.25)]"
            >
              {loading ? (
                <>
                  <Loader2 className="animate-spin" size={20} />
                  Sending link...
                </>
              ) : (
                <>
                  Continue with Email
                  <ArrowRight size={20} />
                </>
              )}
            </button>
          </form>

          {/* Footer */}
          <p className="text-center text-sm text-gray-500 mt-8">
            We'll send you a magic link to sign in.<br />
            No password needed!
          </p>
        </div>
      </div>
    </div>
  );
}
