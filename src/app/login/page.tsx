'use client';

import { useState, useCallback } from 'react';
import { Mail, Loader2, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { Logo } from '@/components/Logo';
import Turnstile from '@/components/Turnstile';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [turnstileToken, setTurnstileToken] = useState<string | null>(null);

  const onTurnstileVerify = useCallback((token: string) => {
    setTurnstileToken(token);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/auth/request-signin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email,
          turnstileToken,
          callbackUrl: '/dashboard',
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || 'Something went wrong. Please try again.');
      } else {
        window.location.href = '/login/check-email';
      }
    } catch { setError('Something went wrong. Please try again.'); }
    finally { setLoading(false); }
  };

  return (
    <div className="min-h-screen bg-[#faf9f7] flex flex-col">
      <nav className="px-6 py-4">
        <Link href="/" className="flex items-center no-underline w-fit">
          <Logo size="md" />
        </Link>
      </nav>
      <div className="flex-1 flex items-center justify-center px-4 pb-12">
        <div className="w-full max-w-[440px]">
          <div className="bg-white rounded-2xl border border-[#e5e0da] p-8">
            <div className="text-center mb-7">
              <h1 className="text-[28px] font-extrabold text-[#1a2e3b]">Welcome back</h1>
              <p className="text-[15px] text-[#5a7184] mt-1">Sign in to your dashboard</p>
            </div>
            {error && <div className="bg-[#fef2f2] text-[#991b1b] p-3 rounded-xl mb-5 text-sm">{error}</div>}
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label htmlFor="email" className="block text-sm font-semibold text-[#1a2e3b] mb-1.5">Email address</label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-[#94a7b8]" size={18} />
                  <input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@company.com" required
                    className="w-full pl-11 pr-4 py-3 border border-[#e5e0da] rounded-xl text-[15px] text-[#1a2e3b] placeholder:text-[#b8c4ce] focus:outline-none focus:ring-2 focus:ring-[#e8930c] focus:border-transparent" />
                </div>
              </div>
              <button type="submit" disabled={loading || !email}
                className="w-full flex items-center justify-center gap-2 bg-[#e8930c] text-white py-3.5 px-6 rounded-xl text-[16px] font-bold hover:bg-[#d17f00] transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-[0_2px_8px_rgba(232,147,12,0.25)]">
                {loading ? (<><Loader2 className="animate-spin" size={18} />Sending link...</>) : (<>Continue with Email<ArrowRight size={18} /></>)}
              </button>
              <Turnstile onVerify={onTurnstileVerify} />
            </form>
            <p className="text-center text-[12px] text-[#94a7b8] mt-5">
              We&apos;ll email you a secure link. No password needed.
            </p>
          </div>
          <p className="text-center text-[13px] text-[#5a7184] mt-5">
            Don&apos;t have an account? <Link href="/onboarding" className="text-[#e8930c] font-semibold no-underline hover:underline">Start free trial</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
