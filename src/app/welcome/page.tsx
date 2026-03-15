'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'https://supportive-ai-backend-production.up.railway.app';

export default function WelcomePage() {
  const { data: session, update: updateSession } = useSession();
  const router = useRouter();
  const [error, setError] = useState('');

  // Create business from signup data, then redirect to dashboard
  useEffect(() => {
    async function setup() {
      const raw = localStorage.getItem('supportive_signup');
      if (!raw) {
        // No signup data — just go to dashboard
        router.replace('/dashboard');
        return;
      }

      try {
        const data = JSON.parse(raw);

        if (session?.user?.email) {
          const tz = data.timezone || Intl.DateTimeFormat().resolvedOptions().timeZone || 'America/New_York';
          const isUK = data.country === 'UK' || tz === 'Europe/London';

          const res = await fetch(`${API_BASE}/api/businesses/onboard`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              email: data.email,
              businessName: data.company,
              industry: data.trade,
              verticalType: data.trade,
              ownerName: data.name,
              timezone: tz,
              serviceRadius: isUK ? '20' : '30',
              selectedPlan: data.plan || 'starter',
              country: isUK ? 'UK' : 'US',
            }),
          });

          if (res.ok) {
            localStorage.removeItem('supportive_signup');
            await updateSession();
            router.replace('/dashboard');
          } else {
            const err = await res.json();
            if (err.error?.includes('already') || err.error?.includes('exists')) {
              localStorage.removeItem('supportive_signup');
              router.replace('/dashboard');
            } else {
              setError(err.error || 'Setup issue');
              // Still redirect after a moment
              setTimeout(() => router.replace('/dashboard'), 2000);
            }
          }
        }
      } catch {
        // On any error, still go to dashboard
        router.replace('/dashboard');
      }
    }

    if (session) setup();
  }, [session]);

  return (
    <div className="min-h-screen bg-[#faf9f7] flex items-center justify-center">
      <div className="text-center">
        <div className="w-6 h-6 border-2 border-[#e8930c] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
        <p className="text-[15px] font-medium text-[#1a2e3b]">Setting up your account...</p>
        {error && (
          <p className="text-[13px] text-[#d97706] mt-2">{error}</p>
        )}
      </div>
    </div>
  );
}
