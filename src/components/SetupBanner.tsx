'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import Link from 'next/link';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'https://supportive-ai-backend-production.up.railway.app';

type SetupStatus = {
  hasPhone: boolean;
  hasCalendar: boolean;
  hasTestCall: boolean;
  isComplete: boolean;
};

export function SetupBanner() {
  const { data: session } = useSession();
  const [dismissed, setDismissed] = useState(false);
  const [status, setStatus] = useState<SetupStatus>({
    hasPhone: false, hasCalendar: false, hasTestCall: false, isComplete: false,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user dismissed the banner this session
    if (sessionStorage.getItem('setup_banner_dismissed') === 'true') {
      setDismissed(true);
    }

    // Check setup status
    async function checkSetup() {
      if (!session?.user?.businessId) {
        setLoading(false);
        return;
      }
      try {
        const res = await fetch(`${API_BASE}/api/business/${session.user.businessId}/status`);
        if (res.ok) {
          const data = await res.json();
          setStatus({
            hasPhone: !!data.twilioPhoneNumber,
            hasCalendar: !!data.googleCalendarId,
            hasTestCall: (data.totalCalls || 0) > 0,
            isComplete: !!data.twilioPhoneNumber && !!data.googleCalendarId && (data.totalCalls || 0) > 0,
          });
        }
      } catch { /* show banner by default */ }
      setLoading(false);
    }
    checkSetup();
  }, [session]);

  // Don't show if setup is complete, dismissed, or still loading
  if (loading || status.isComplete || dismissed) return null;

  const handleDismiss = () => {
    setDismissed(true);
    sessionStorage.setItem('setup_banner_dismissed', 'true');
  };

  const steps = [
    { label: 'Account created', done: true },
    { label: 'AI configured for your trade', done: status.hasPhone },
    { label: 'Dedicated phone number assigned', done: status.hasPhone },
    { label: 'Calendar connected', done: status.hasCalendar },
    { label: 'Test call completed', done: status.hasTestCall },
  ];

  const completedCount = steps.filter(s => s.done).length;
  const progress = Math.round((completedCount / steps.length) * 100);

  return (
    <div className="bg-white rounded-2xl border border-[#e5e0da] p-6 md:p-8 mb-6 relative">
      {/* Dismiss button */}
      <button
        onClick={handleDismiss}
        className="absolute top-4 right-4 text-[#94a7b8] hover:text-[#5a7184] bg-transparent border-none cursor-pointer text-lg"
        title="Dismiss for now"
      >
        ×
      </button>

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-start gap-6">
        <div className="flex-1">
          <h2 className="text-[20px] font-bold text-[#1a2e3b] mb-1">
            Let&apos;s get your AI receptionist live
          </h2>
          <p className="text-[14px] text-[#5a7184] leading-relaxed mb-5">
            Book a free 15-minute setup call and we&apos;ll configure everything together — your AI, phone number,
            calendar, and call forwarding. Or chat with us anytime using the bubble below.
          </p>

          {/* Progress bar */}
          <div className="mb-5">
            <div className="flex justify-between items-center mb-1.5">
              <span className="text-[12px] font-semibold text-[#5a7184]">Setup progress</span>
              <span className="text-[12px] font-bold text-[#1a2e3b]">{completedCount}/{steps.length}</span>
            </div>
            <div className="h-2 bg-[#f0eeeb] rounded-full overflow-hidden">
              <div
                className="h-full bg-[#e8930c] rounded-full transition-all duration-500"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>

          {/* Steps */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-5">
            {steps.map(s => (
              <div key={s.label} className="flex items-center gap-2">
                {s.done ? (
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="#059669" className="flex-shrink-0"><circle cx="12" cy="12" r="12"/><path d="M8 12.5l2.5 2.5 5.5-5.5" stroke="white" strokeWidth="2" fill="none"/></svg>
                ) : (
                  <div className="w-4 h-4 rounded-full border-2 border-[#d1ccc6] flex-shrink-0" />
                )}
                <span className={`text-[13px] ${s.done ? 'text-[#059669] font-medium' : 'text-[#5a7184]'}`}>
                  {s.label}
                </span>
              </div>
            ))}
          </div>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row gap-3">
            <a
              href="https://cal.com/supportive-ai/setup"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 bg-[#e8930c] text-white px-6 py-3 rounded-xl text-[14px] font-bold no-underline hover:bg-[#d17f00] transition-colors shadow-[0_2px_8px_rgba(232,147,12,0.25)]"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72 12.84 12.84 0 00.7 2.81 2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45 12.84 12.84 0 002.81.7A2 2 0 0122 16.92z"/></svg>
              Book free setup call
            </a>
            <button
              onClick={handleDismiss}
              className="inline-flex items-center justify-center gap-2 bg-white text-[#1a2e3b] px-6 py-3 rounded-xl text-[14px] font-semibold border border-[#d1ccc6] hover:bg-[#f4f3f1] transition-colors cursor-pointer"
            >
              I&apos;ll explore first
            </button>
          </div>
          <Link href="/dashboard/setup" className="text-[12px] text-[#5a7184] no-underline hover:text-[#1a2e3b] mt-2 inline-block">
            Already have a number? Set up call forwarding →
          </Link>
        </div>

        {/* Trial info card */}
        <div className="bg-[#faf9f7] rounded-xl border border-[#e5e0da] p-5 md:w-[220px] flex-shrink-0">
          <h4 className="text-[13px] font-bold text-[#1a2e3b] mb-3">Your free trial</h4>
          <div className="space-y-2.5 text-[12px] text-[#5a7184]">
            <div className="flex items-start gap-2">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#059669" strokeWidth="2" className="flex-shrink-0 mt-0.5"><path d="M20 6L9 17l-5-5"/></svg>
              <span>7 days completely free</span>
            </div>
            <div className="flex items-start gap-2">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#059669" strokeWidth="2" className="flex-shrink-0 mt-0.5"><path d="M20 6L9 17l-5-5"/></svg>
              <span>You choose when AI picks up: always, after 4 rings, or after hours only</span>
            </div>
            <div className="flex items-start gap-2">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#059669" strokeWidth="2" className="flex-shrink-0 mt-0.5"><path d="M20 6L9 17l-5-5"/></svg>
              <span>Personal setup — we configure it together</span>
            </div>
            <div className="flex items-start gap-2">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#059669" strokeWidth="2" className="flex-shrink-0 mt-0.5"><path d="M20 6L9 17l-5-5"/></svg>
              <span>Cancel anytime, no questions asked</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
