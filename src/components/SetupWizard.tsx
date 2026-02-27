'use client';

import { useState, useEffect } from 'react';
import { getProvisionStatus, provisionBusiness, ProvisionStatus } from '@/lib/api';
import { CalendarIcon, PhoneIcon } from '@/components/marketing/Icons';

// Common US area codes by state for suggestions
const AREA_CODE_HINTS: Record<string, string> = {
  '212': 'New York, NY', '213': 'Los Angeles, CA', '214': 'Dallas, TX',
  '305': 'Miami, FL', '312': 'Chicago, IL', '415': 'San Francisco, CA',
  '512': 'Austin, TX', '602': 'Phoenix, AZ', '713': 'Houston, TX',
  '727': 'Tampa/St Pete, FL', '845': 'Hudson Valley, NY', '914': 'Westchester, NY',
};

type SetupStep = 'loading' | 'provision' | 'calendar' | 'forwarding' | 'done';

export default function SetupWizard() {
  const [step, setStep] = useState<SetupStep>('loading');
  const [status, setStatus] = useState<ProvisionStatus | null>(null);
  const [areaCode, setAreaCode] = useState('');
  const [provisioning, setProvisioning] = useState(false);
  const [error, setError] = useState('');
  const [result, setResult] = useState<{ phoneNumber: string; phoneNumberPretty: string; calendarAuthUrl: string | null } | null>(null);

  useEffect(() => {
    async function checkStatus() {
      try {
        const s = await getProvisionStatus();
        setStatus(s);
        if (!s.provisioned) {
          setStep('provision');
        } else if (!s.calendarConnected) {
          setResult({ phoneNumber: s.phoneNumber!, phoneNumberPretty: s.phoneNumber!, calendarAuthUrl: s.calendarAuthUrl });
          setStep('calendar');
        } else {
          setStep('done');
        }
      } catch {
        setStep('provision');
      }
    }
    checkStatus();
  }, []);

  async function handleProvision() {
    if (areaCode.length !== 3) {
      setError('Enter a 3-digit area code');
      return;
    }
    setProvisioning(true);
    setError('');
    try {
      const res = await provisionBusiness(areaCode);
      setResult({ phoneNumber: res.phoneNumber, phoneNumberPretty: res.phoneNumberPretty, calendarAuthUrl: res.calendarAuthUrl });
      setStep('calendar');
    } catch (err: any) {
      const msg = err?.message || '';
      if (msg.includes('already provisioned')) {
        window.location.reload();
      } else if (msg.includes('area code')) {
        setError('No numbers available in that area code. Try a nearby one.');
      } else {
        setError('Something went wrong. Our team has been notified.');
      }
    } finally {
      setProvisioning(false);
    }
  }

  const areaHint = AREA_CODE_HINTS[areaCode] || '';

  if (step === 'loading') {
    return (
      <div className="bg-white rounded-2xl border border-[#e5e0da] p-8 text-center">
        <div className="w-6 h-6 border-2 border-[#e8930c] border-t-transparent rounded-full animate-spin mx-auto" />
      </div>
    );
  }

  if (step === 'done') return null; // Hide wizard when fully set up

  const stepNumber = step === 'provision' ? 1 : step === 'calendar' ? 2 : 3;

  return (
    <div className="bg-white rounded-2xl border-2 border-[#e8930c] overflow-hidden">
      {/* Header */}
      <div className="bg-[#1a2e3b] px-6 py-5">
        <h2 className="text-[18px] font-bold text-white mb-1">
          {step === 'provision' && 'Set up your AI receptionist'}
          {step === 'calendar' && 'Connect your calendar'}
          {step === 'forwarding' && 'Connect your phone'}
        </h2>
        <p className="text-[13px] text-white/60">
          Step {stepNumber} of 3 — takes about {step === 'provision' ? '30 seconds' : '2 minutes'}
        </p>
        {/* Progress bar */}
        <div className="mt-3 h-1.5 bg-white/10 rounded-full overflow-hidden">
          <div className="h-full bg-[#e8930c] rounded-full transition-all duration-500" style={{ width: `${(stepNumber / 3) * 100}%` }} />
        </div>
      </div>

      <div className="p-6">
        {/* Step 1: Area code + provision */}
        {step === 'provision' && (
          <div className="space-y-5">
            <p className="text-[14px] text-[#5a7184] leading-relaxed">
              We&apos;ll create your AI phone assistant and get you a local number. Your customers will call this number
              (or you can forward your existing number to it).
            </p>

            <div>
              <label className="block text-sm font-semibold text-[#1a2e3b] mb-1.5">
                What area code do you want for your AI number?
              </label>
              <p className="text-[12px] text-[#94a7b8] mb-2">
                Pick your local area code so it looks familiar to your customers
              </p>
              <div className="flex gap-3 items-start">
                <div className="relative">
                  <input
                    type="text"
                    value={areaCode}
                    onChange={e => {
                      const v = e.target.value.replace(/[^0-9]/g, '').slice(0, 3);
                      setAreaCode(v);
                      setError('');
                    }}
                    placeholder="845"
                    maxLength={3}
                    className="w-[120px] px-4 py-3 border border-[#e5e0da] rounded-xl text-[18px] font-bold text-center text-[#1a2e3b] placeholder:text-[#d1ccc6] focus:outline-none focus:ring-2 focus:ring-[#e8930c] focus:border-transparent"
                  />
                  {areaHint && (
                    <p className="absolute -bottom-5 left-0 text-[11px] text-[#059669] font-medium">{areaHint}</p>
                  )}
                </div>
                <button
                  onClick={handleProvision}
                  disabled={areaCode.length !== 3 || provisioning}
                  className="flex-1 bg-[#e8930c] text-white py-3 rounded-xl text-[15px] font-bold hover:bg-[#d17f00] transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-[0_2px_8px_rgba(232,147,12,0.3)]"
                >
                  {provisioning ? (
                    <span className="flex items-center justify-center gap-2">
                      <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Setting up your AI...
                    </span>
                  ) : (
                    'Set up my AI receptionist →'
                  )}
                </button>
              </div>
            </div>

            {error && (
              <div className="bg-red-50 text-red-700 p-3 rounded-xl text-[13px]">{error}</div>
            )}
          </div>
        )}

        {/* Step 2: Calendar connection */}
        {step === 'calendar' && (
          <div className="space-y-5">
            <div className="bg-[#eef9f0] rounded-xl p-4 flex items-start gap-3">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#059669" strokeWidth="2" className="flex-shrink-0 mt-0.5"><path d="M20 6L9 17l-5-5"/></svg>
              <div>
                <p className="text-[13px] font-semibold text-[#059669]">Your AI is live!</p>
                <p className="text-[13px] text-[#5a7184]">
                  Number: <span className="font-bold text-[#1a2e3b]">{result?.phoneNumberPretty}</span>
                </p>
              </div>
            </div>

            <p className="text-[14px] text-[#5a7184] leading-relaxed">
              Connect your Google Calendar so your AI knows when you&apos;re free and can book jobs directly onto your schedule.
            </p>

            <div className="flex flex-col sm:flex-row gap-3">
              {result?.calendarAuthUrl ? (
                <a
                  href={result.calendarAuthUrl}
                  className="flex-1 inline-flex items-center justify-center gap-2 bg-[#e8930c] text-white py-3 rounded-xl text-[15px] font-bold no-underline hover:bg-[#d17f00] transition-colors shadow-[0_2px_8px_rgba(232,147,12,0.3)]"
                >
                  <CalendarIcon size={20} />
                  Connect Google Calendar
                </a>
              ) : (
                <p className="text-[13px] text-[#94a7b8]">Calendar connection not available yet. Our team will set this up on your onboarding call.</p>
              )}
              <button
                onClick={() => setStep('forwarding')}
                className="text-[13px] font-semibold text-[#5a7184] bg-transparent border border-[#e5e0da] px-4 py-3 rounded-xl cursor-pointer hover:bg-[#faf9f7]"
              >
                I&apos;ll do this later →
              </button>
            </div>
          </div>
        )}

        {/* Step 3: Forwarding setup */}
        {step === 'forwarding' && (
          <div className="space-y-4">
            <p className="text-[14px] text-[#5a7184] leading-relaxed">
              Last step! Set up call forwarding so your AI answers when you can&apos;t. Head to the
              {' '}<a href="/dashboard/setup" className="text-[#e8930c] font-semibold no-underline hover:underline">forwarding setup page</a>{' '}
              for step-by-step instructions for your carrier.
            </p>
            <a
              href="/dashboard/setup"
              className="inline-flex items-center gap-2 bg-[#e8930c] text-white px-6 py-3 rounded-xl text-[15px] font-bold no-underline hover:bg-[#d17f00] transition-colors"
            >
              <PhoneIcon size={20} />
              Set up call forwarding →
            </a>
          </div>
        )}

        {/* Need help? — always visible */}
        <div className="mt-6 pt-5 border-t border-[#f0eeeb]">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[13px] font-semibold text-[#1a2e3b]">Need a hand?</p>
              <p className="text-[12px] text-[#94a7b8]">We&apos;re here to guide you through setup — no question too small</p>
            </div>
            <a
              href="https://cal.com/lars-beurskens-g1aaqy/15min"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-[13px] font-semibold text-[#2a4a5e] bg-[#faf9f7] border border-[#e5e0da] px-4 py-2 rounded-lg no-underline hover:bg-[#f0eeeb] transition-colors flex-shrink-0"
            >
              <CalendarIcon size={14} />
              Book a setup call
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
