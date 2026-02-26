'use client';

import { useState } from 'react';
import { signIn } from 'next-auth/react';
import Link from 'next/link';

const TRADES = [
  { value: 'window_cleaning', label: 'Window Cleaning' },
  { value: 'plumbing', label: 'Plumbing' },
  { value: 'hvac', label: 'HVAC' },
  { value: 'pest_control', label: 'Pest Control' },
  { value: 'electrician', label: 'Electrician' },
  { value: 'cleaning', label: 'Cleaning / Janitorial' },
  { value: 'roofing', label: 'Roofing' },
  { value: 'landscaping', label: 'Landscaping' },
  { value: 'other', label: 'Other Home Service' },
];

export default function OnboardingPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [company, setCompany] = useState('');
  const [trade, setTrade] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const canSubmit = name && email && company && trade;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!canSubmit) return;
    setLoading(true);
    setError('');

    try {
      // Store signup data for after email verification
      localStorage.setItem('supportive_signup', JSON.stringify({
        name, email, company, trade,
        createdAt: new Date().toISOString(),
      }));

      const result = await signIn('email', {
        email,
        callbackUrl: '/welcome',
        redirect: false,
      });

      if (result?.error) {
        setError('Something went wrong. Please try again.');
        setLoading(false);
      } else {
        window.location.href = '/onboarding/check-email';
      }
    } catch {
      setError('Something went wrong. Please try again.');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#faf9f7] flex flex-col">
      {/* Minimal nav */}
      <nav className="px-6 py-4">
        <Link href="/" className="flex items-center gap-2.5 no-underline w-fit">
          <div className="w-[34px] h-[34px] rounded-lg bg-gradient-to-br from-[#1a2e3b] to-[#2a4a5e] flex items-center justify-center text-white font-extrabold text-[17px]">S</div>
          <span className="text-[17px] font-bold text-[#1a2e3b] tracking-tight">Supportive AI</span>
        </Link>
      </nav>

      <div className="flex-1 flex items-center justify-center px-4 pb-12">
        <div className="w-full max-w-[440px]">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-[32px] font-extrabold text-[#1a2e3b] leading-tight mb-2">
              Get your AI receptionist
            </h1>
            <p className="text-[16px] text-[#5a7184]">
              Takes 30 seconds. No credit card required.
            </p>
          </div>

          {/* Form card */}
          <div className="bg-white rounded-2xl border border-[#e5e0da] p-7 shadow-sm">
            {error && (
              <div className="bg-red-50 text-red-700 p-3 rounded-xl mb-5 text-sm">{error}</div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="name" className="block text-sm font-semibold text-[#1a2e3b] mb-1.5">Your name</label>
                <input
                  id="name" type="text" value={name}
                  onChange={e => setName(e.target.value)}
                  placeholder="Mike Johnson"
                  className="w-full px-4 py-3 border border-[#e5e0da] rounded-xl text-[15px] text-[#1a2e3b] placeholder:text-[#b8c4ce] focus:outline-none focus:ring-2 focus:ring-[#1a2e3b] focus:border-transparent bg-white"
                />
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-semibold text-[#1a2e3b] mb-1.5">Email address</label>
                <input
                  id="email" type="email" value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="mike@smithplumbing.com"
                  className="w-full px-4 py-3 border border-[#e5e0da] rounded-xl text-[15px] text-[#1a2e3b] placeholder:text-[#b8c4ce] focus:outline-none focus:ring-2 focus:ring-[#1a2e3b] focus:border-transparent bg-white"
                />
              </div>

              <div>
                <label htmlFor="company" className="block text-sm font-semibold text-[#1a2e3b] mb-1.5">Company name</label>
                <input
                  id="company" type="text" value={company}
                  onChange={e => setCompany(e.target.value)}
                  placeholder="Smith's Plumbing"
                  className="w-full px-4 py-3 border border-[#e5e0da] rounded-xl text-[15px] text-[#1a2e3b] placeholder:text-[#b8c4ce] focus:outline-none focus:ring-2 focus:ring-[#1a2e3b] focus:border-transparent bg-white"
                />
              </div>

              <div>
                <label htmlFor="trade" className="block text-sm font-semibold text-[#1a2e3b] mb-1.5">Your trade</label>
                <div className="relative">
                  <select
                    id="trade" value={trade}
                    onChange={e => setTrade(e.target.value)}
                    className="w-full px-4 py-3 border border-[#e5e0da] rounded-xl text-[15px] text-[#1a2e3b] focus:outline-none focus:ring-2 focus:ring-[#1a2e3b] focus:border-transparent appearance-none bg-white"
                  >
                    <option value="" className="text-[#b8c4ce]">Select your trade...</option>
                    {TRADES.map(t => (
                      <option key={t.value} value={t.value}>{t.label}</option>
                    ))}
                  </select>
                  <svg className="absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none text-[#94a7b8]" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M6 9l6 6 6-6"/></svg>
                </div>
              </div>

              <button
                type="submit"
                disabled={!canSubmit || loading}
                className="w-full bg-[#e8930c] text-white py-3.5 rounded-xl text-[16px] font-bold hover:bg-[#d17f00] transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-[0_2px_8px_rgba(232,147,12,0.3)] mt-2"
              >
                {loading ? 'Sending verification...' : 'Get Started Free →'}
              </button>
            </form>

            <p className="text-center text-[12px] text-[#94a7b8] mt-4">
              We&apos;ll email you a secure link to verify your account.<br />No password needed.
            </p>
          </div>

          {/* Trust signals */}
          <div className="flex items-center justify-center gap-5 mt-6 text-[12px] text-[#94a7b8]">
            <span className="flex items-center gap-1.5">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
              14-day free trial
            </span>
            <span className="text-[#d1ccc6]">·</span>
            <span>No credit card</span>
            <span className="text-[#d1ccc6]">·</span>
            <span>Cancel anytime</span>
          </div>

          {/* Existing user */}
          <p className="text-center text-[13px] text-[#5a7184] mt-5">
            Already have an account? <Link href="/login" className="text-[#1a2e3b] font-semibold no-underline hover:underline">Log in</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
