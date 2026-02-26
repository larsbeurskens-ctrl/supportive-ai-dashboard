'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import Link from 'next/link';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'https://supportive-ai-backend-production.up.railway.app';

export default function WelcomePage() {
  const { data: session, update: updateSession } = useSession();
  const [signupData, setSignupData] = useState<{
    name: string; company: string; trade: string;
  } | null>(null);
  const [setupDone, setSetupDone] = useState(false);
  const [setupError, setSetupError] = useState('');

  // Read signup data and create business
  useEffect(() => {
    const raw = localStorage.getItem('supportive_signup');
    if (!raw) return;
    try {
      const data = JSON.parse(raw);
      setSignupData(data);

      // Create business if we have session
      if (session?.user?.email && !setupDone) {
        createBusiness(data);
      }
    } catch { /* ignore parse errors */ }
  }, [session]);

  const createBusiness = async (data: { name: string; email: string; company: string; trade: string }) => {
    try {
      const res = await fetch(`${API_BASE}/api/businesses/onboard`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: data.email,
          businessName: data.company,
          industry: data.trade,
          verticalType: data.trade,
          ownerName: data.name,
          timezone: 'America/New_York',
          serviceRadius: '30',
        }),
      });

      if (res.ok) {
        setSetupDone(true);
        localStorage.removeItem('supportive_signup');
        await updateSession();
      } else {
        const err = await res.json();
        // Business might already exist — that's fine
        if (err.error?.includes('already') || err.error?.includes('exists')) {
          setSetupDone(true);
          localStorage.removeItem('supportive_signup');
        } else {
          setSetupError(err.error || 'Setup issue — but don\'t worry, we\'ll sort it out.');
        }
      }
    } catch {
      setSetupError('Could not connect to server. Chat with us below and we\'ll help.');
    }
  };

  const firstName = signupData?.name?.split(' ')[0] || session?.user?.name?.split(' ')[0] || '';

  return (
    <div className="min-h-screen bg-[#faf9f7] flex flex-col">
      {/* Minimal nav */}
      <nav className="px-6 py-4 border-b border-[#e5e0da] bg-white">
        <Link href="/" className="flex items-center gap-2.5 no-underline w-fit">
          <div className="w-[34px] h-[34px] rounded-lg bg-gradient-to-br from-[#1a2e3b] to-[#2a4a5e] flex items-center justify-center text-white font-extrabold text-[17px]">S</div>
          <span className="text-[17px] font-bold text-[#1a2e3b] tracking-tight">Supportive AI</span>
        </Link>
      </nav>

      <div className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-[640px]">
          {/* Welcome header */}
          <div className="text-center mb-10">
            <div className="w-14 h-14 rounded-full bg-[#eef9f0] flex items-center justify-center mx-auto mb-4">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#059669" strokeWidth="2"><path d="M20 6L9 17l-5-5"/></svg>
            </div>
            <h1 className="text-[32px] font-extrabold text-[#1a2e3b] leading-tight mb-2">
              {firstName ? `Welcome, ${firstName}!` : 'Welcome!'}
            </h1>
            <p className="text-[16px] text-[#5a7184] leading-relaxed max-w-[480px] mx-auto">
              Your account is set up. Now let&apos;s get your AI receptionist answering calls.
              Pick whichever option feels right — there&apos;s no wrong choice.
            </p>
          </div>

          {setupError && (
            <div className="bg-[#fef3cd] text-[#856404] p-4 rounded-xl mb-6 text-sm text-center">
              {setupError} — use the chat bubble below and we&apos;ll help you out.
            </div>
          )}

          {/* Three options */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
            {/* Option 1: Book a setup call */}
            <div className="bg-white rounded-2xl border-2 border-[#1a2e3b] p-6 flex flex-col">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-full bg-[#1a2e3b] flex items-center justify-center flex-shrink-0">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2"><path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72 12.84 12.84 0 00.7 2.81 2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45 12.84 12.84 0 002.81.7A2 2 0 0122 16.92z"/></svg>
                </div>
                <div>
                  <h3 className="text-[16px] font-bold text-[#1a2e3b]">Book a free setup call</h3>
                  <span className="text-[11px] font-semibold text-[#e8930c] uppercase tracking-wide">Recommended</span>
                </div>
              </div>
              <p className="text-[14px] text-[#5a7184] leading-relaxed mb-5 flex-1">
                15-minute call with our team. We&apos;ll configure everything together, test it live, and make sure you&apos;re good to go.
              </p>
              <a
                href="https://cal.com/supportive-ai/setup"
                target="_blank"
                rel="noopener noreferrer"
                className="block text-center bg-[#1a2e3b] text-white py-3 rounded-xl text-[14px] font-semibold no-underline hover:bg-[#243d4e] transition-colors"
              >
                Pick a time →
              </a>
            </div>

            {/* Option 2: Set it up myself */}
            <div className="bg-white rounded-2xl border border-[#e5e0da] p-6 flex flex-col">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-full bg-[#f4f3f1] flex items-center justify-center flex-shrink-0">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#1a2e3b" strokeWidth="2"><path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 013 3L7 19l-4 1 1-4L16.5 3.5z"/></svg>
                </div>
                <h3 className="text-[16px] font-bold text-[#1a2e3b]">Set it up myself</h3>
              </div>
              <p className="text-[14px] text-[#5a7184] leading-relaxed mb-5 flex-1">
                Head to your dashboard and configure your AI at your own pace. Add your location, hours, and phone — takes about 5 minutes.
              </p>
              <Link
                href="/dashboard/settings"
                className="block text-center bg-white text-[#1a2e3b] py-3 rounded-xl text-[14px] font-semibold no-underline border border-[#d1ccc6] hover:bg-[#f4f3f1] transition-colors"
              >
                Go to dashboard →
              </Link>
            </div>
          </div>

          {/* What happens next */}
          <div className="bg-white rounded-2xl border border-[#e5e0da] p-6 mb-6">
            <h3 className="text-[15px] font-bold text-[#1a2e3b] mb-4">What happens next?</h3>
            <div className="space-y-3">
              {[
                { step: '1', text: 'We configure your AI with your business details, hours, and service area', done: setupDone },
                { step: '2', text: 'You get a dedicated phone number for your AI receptionist' },
                { step: '3', text: 'We test it together to make sure everything sounds right' },
                { step: '4', text: 'Set up call forwarding from your existing number — takes 2 minutes' },
                { step: '5', text: 'Your AI starts answering calls. You start getting bookings.' },
              ].map(s => (
                <div key={s.step} className="flex items-start gap-3">
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 text-[11px] font-bold ${
                    s.done ? 'bg-[#059669] text-white' : 'bg-[#f4f3f1] text-[#5a7184]'
                  }`}>
                    {s.done ? '✓' : s.step}
                  </div>
                  <p className="text-[14px] text-[#5a7184] leading-snug">{s.text}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Chat prompt */}
          <div className="text-center">
            <p className="text-[13px] text-[#94a7b8]">
              Got a question? Use the chat bubble in the corner — we typically reply within minutes.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
