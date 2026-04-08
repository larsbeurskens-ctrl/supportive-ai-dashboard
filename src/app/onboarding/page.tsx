'use client';

import { useState, useCallback, Suspense, Component, type ReactNode } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Logo } from '@/components/Logo';
import Turnstile from '@/components/Turnstile';

// Error boundary to catch client-side crashes
class OnboardingErrorBoundary extends Component<{ children: ReactNode }, { hasError: boolean; error: string }> {
  constructor(props: { children: ReactNode }) {
    super(props);
    this.state = { hasError: false, error: '' };
  }
  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error: error.message };
  }
  componentDidCatch(error: Error) {
    console.error('[Onboarding] Client error:', error);
  }
  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-[#faf9f7] flex items-center justify-center px-6">
          <div className="text-center max-w-md">
            <h1 className="text-2xl font-bold text-[#1a2e3b] mb-3">Something went wrong</h1>
            <p className="text-[#5a7184] mb-4">We hit a snag loading the signup page. Try refreshing.</p>
            <p className="text-xs text-red-400 mb-6 font-mono">{this.state.error}</p>
            <a href="/onboarding" className="bg-[#e8930c] text-white px-6 py-3 rounded-lg font-bold no-underline">Try again</a>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

const TRADES = [
  { value: 'plumbing', label: 'Plumbing' },
  { value: 'electrical', label: 'Electrical' },
  { value: 'hvac', label: 'HVAC' },
  { value: 'window_cleaning', label: 'Window Cleaning' },
  { value: 'locksmith', label: 'Locksmith' },
  { value: 'landscaping', label: 'Landscaping' },
];

const PLAN_LABELS: Record<string, string> = {
  starter: 'Starter',
  standard: 'Standard',
  business: 'Business',
};

const PLAN_PRICES_US: Record<string, string> = { starter: '$89/mo', standard: '$149/mo', business: '$299/mo' };
const PLAN_PRICES_UK: Record<string, string> = { starter: '£69/mo', standard: '£119/mo', business: '£229/mo' };

export default function OnboardingPage() {
  return (
    <OnboardingErrorBoundary>
      <Suspense fallback={<div className="min-h-screen bg-[#faf9f7] flex items-center justify-center"><div className="w-6 h-6 border-2 border-[#e8930c] border-t-transparent rounded-full animate-spin" /></div>}>
        <OnboardingForm />
      </Suspense>
    </OnboardingErrorBoundary>
  );
}

function OnboardingForm() {
  const searchParams = useSearchParams();
  const planFromUrl = searchParams.get('plan') || 'starter';
  const countryParam = searchParams.get('country');
  const isUS = countryParam === 'US' || (typeof window !== 'undefined' && !countryParam && Intl.DateTimeFormat().resolvedOptions().timeZone?.startsWith('America/') && !Intl.DateTimeFormat().resolvedOptions().timeZone?.includes('Costa_Rica'));
  const isUK = !isUS;
  const prices = isUK ? PLAN_PRICES_UK : PLAN_PRICES_US;
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [company, setCompany] = useState('');
  const [trade, setTrade] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [turnstileToken, setTurnstileToken] = useState<string | null>(null);

  const canSubmit = name && email && company && trade;

  const onTurnstileVerify = useCallback((token: string) => {
    setTurnstileToken(token);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!canSubmit) return;
    setLoading(true);
    setError('');

    try {
      // Store signup data for after email verification
      localStorage.setItem('supportive_signup', JSON.stringify({
        name, email, company, trade,
        plan: planFromUrl,
        timezone: isUK ? 'Europe/London' : Intl.DateTimeFormat().resolvedOptions().timeZone,
        country: isUS ? 'US' : 'UK',
        createdAt: new Date().toISOString(),
      }));

      const res = await fetch('/api/auth/request-signin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email,
          turnstileToken,
          callbackUrl: '/welcome',
        }),
      });
      const data = await res.json();

      if (!res.ok) {
        setError(data.error || 'Something went wrong. Please try again.');
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
        <Link href="/" className="flex items-center no-underline w-fit">
          <Logo size="md" />
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
              Live in 5 minutes. No credit card required.
            </p>
            {PLAN_LABELS[planFromUrl] && (
              <div className="inline-block mt-3 px-4 py-1.5 bg-[#eff6ff] text-[#1e40af] text-[13px] font-semibold rounded-full">
                Selected plan: {PLAN_LABELS[planFromUrl]} — {prices[planFromUrl]}
              </div>
            )}
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
                  className="w-full px-4 py-3 border border-[#e5e0da] rounded-xl text-[15px] text-[#1a2e3b] placeholder:text-[#b8c4ce] focus:outline-none focus:ring-2 focus:ring-[#e8930c] focus:border-transparent bg-white"
                />
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-semibold text-[#1a2e3b] mb-1.5">Email address</label>
                <input
                  id="email" type="email" value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="mike@smithplumbing.com"
                  className="w-full px-4 py-3 border border-[#e5e0da] rounded-xl text-[15px] text-[#1a2e3b] placeholder:text-[#b8c4ce] focus:outline-none focus:ring-2 focus:ring-[#e8930c] focus:border-transparent bg-white"
                />
              </div>

              <div>
                <label htmlFor="company" className="block text-sm font-semibold text-[#1a2e3b] mb-1.5">Company name</label>
                <input
                  id="company" type="text" value={company}
                  onChange={e => setCompany(e.target.value)}
                  placeholder="Smith's Plumbing"
                  className="w-full px-4 py-3 border border-[#e5e0da] rounded-xl text-[15px] text-[#1a2e3b] placeholder:text-[#b8c4ce] focus:outline-none focus:ring-2 focus:ring-[#e8930c] focus:border-transparent bg-white"
                />
              </div>

              <div>
                <label htmlFor="trade" className="block text-sm font-semibold text-[#1a2e3b] mb-1.5">Your trade</label>
                <div className="relative">
                  <select
                    id="trade" value={trade}
                    onChange={e => setTrade(e.target.value)}
                    className="w-full px-4 py-3 border border-[#e5e0da] rounded-xl text-[15px] text-[#1a2e3b] focus:outline-none focus:ring-2 focus:ring-[#e8930c] focus:border-transparent appearance-none bg-white"
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
              <Turnstile onVerify={onTurnstileVerify} />
            </form>

            <p className="text-center text-[12px] text-[#94a7b8] mt-4">
              We&apos;ll email you a secure link to verify your account.<br />No password needed.
            </p>
          </div>

          {/* Trust signals */}
          <div className="flex items-center justify-center gap-5 mt-6 text-[12px] text-[#94a7b8]">
            <span className="flex items-center gap-1.5">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
              7-day free trial
            </span>
            <span className="text-[#d1ccc6]">·</span>
            <span>No credit card</span>
            <span className="text-[#d1ccc6]">·</span>
            <span>Live in 5 minutes</span>
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
