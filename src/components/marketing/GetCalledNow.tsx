'use client';

import { useState } from 'react';

interface GetCalledNowProps {
  /** Heading text */
  headline?: string;
  /** Subtext below the heading */
  subtext?: string;
  /** Background style variant */
  variant?: 'light' | 'dark';
}

export function GetCalledNow({
  headline = 'Hear it for yourself - we will call you now',
  subtext = 'Enter your number and our AI receptionist will call you in under 30 seconds. Pretend you need a plumber.',
  variant = 'dark',
}: GetCalledNowProps) {
  const [firstName, setFirstName] = useState('');
  const [phone, setPhone] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [errorMsg, setErrorMsg] = useState('');

  async function handleSubmit() {
    if (!phone.trim()) { setErrorMsg('Please enter your phone number'); return; }
    setStatus('loading');
    setErrorMsg('');
    try {
      const res = await fetch('/api/get-called-now', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ firstName: firstName.trim(), phone: phone.trim() }),
      });
      if (!res.ok) throw new Error('Failed to trigger call');
      setStatus('success');
    } catch {
      setStatus('error');
      setErrorMsg('Something went wrong. Try calling the demo line directly: 07427 846 243');
    }
  }

  const isDark = variant === 'dark';

  if (status === 'success') {
    return (
      <div className={`rounded-2xl px-6 py-8 text-center ${isDark ? 'bg-[#1a2e3b]' : 'bg-[#f0fdf4] border border-[#bbf7d0]'}`}>
        <div className="w-16 h-16 rounded-full bg-[#059669] flex items-center justify-center mx-auto mb-4">
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg>
        </div>
        <h3 className={`text-[20px] font-bold mb-2 ${isDark ? 'text-white' : 'text-[#1a2e3b]'}`}>Calling you now!</h3>
        <p className={`text-[14px] ${isDark ? 'text-white/60' : 'text-[#5a7184]'}`}>
          Your phone should ring in a few seconds. When you answer, pretend you need a plumber - report a leak, ask about pricing, or try booking a job.
        </p>
      </div>
    );
  }

  return (
    <div className={`rounded-2xl overflow-hidden ${isDark ? 'bg-[#1a2e3b]' : 'bg-white border border-[#e5e0da]'}`}>
      <div className="px-6 py-6">
        <h3 className={`text-[20px] font-bold mb-2 ${isDark ? 'text-white' : 'text-[#1a2e3b]'}`}>{headline}</h3>
        <p className={`text-[14px] mb-5 ${isDark ? 'text-white/60' : 'text-[#5a7184]'}`}>{subtext}</p>

        <div className="grid sm:grid-cols-2 gap-3 mb-3">
          <div>
            <label className={`block text-[12px] font-semibold mb-1.5 ${isDark ? 'text-white/80' : 'text-[#1a2e3b]'}`}>Your First Name</label>
            <input
              type="text" placeholder="John" value={firstName}
              onChange={e => setFirstName(e.target.value)}
              className="w-full px-4 py-3 rounded-lg border border-[#d1ccc6] bg-white text-[#1a2e3b] text-[14px] outline-none focus:border-[#e8930c] transition-colors"
            />
          </div>
          <div>
            <label className={`block text-[12px] font-semibold mb-1.5 ${isDark ? 'text-white/80' : 'text-[#1a2e3b]'}`}>Your Phone Number</label>
            <div className="flex">
              <span className="flex items-center gap-1.5 px-3 py-3 rounded-l-lg border border-r-0 border-[#d1ccc6] bg-[#faf9f7] text-[13px] text-[#5a7184]">
                🇬🇧 +44
              </span>
              <input
                type="tel" placeholder="7700 900123" value={phone}
                onChange={e => setPhone(e.target.value)}
                className="flex-1 px-4 py-3 rounded-r-lg border border-[#d1ccc6] bg-white text-[#1a2e3b] text-[14px] outline-none focus:border-[#e8930c] transition-colors"
              />
            </div>
          </div>
        </div>

        {errorMsg && <p className="text-[13px] text-[#dc2626] mb-3">{errorMsg}</p>}

        <button
          onClick={handleSubmit}
          disabled={status === 'loading'}
          className="w-full bg-[#e8930c] text-white px-6 py-3.5 rounded-xl text-[16px] font-bold border-none cursor-pointer hover:bg-[#d17f00] transition-colors shadow-[0_2px_8px_rgba(232,147,12,0.3)] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {status === 'loading' ? (
            <><div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> Calling you...</>
          ) : (
            <>Get Called Now <span className="text-[18px]">→</span></>
          )}
        </button>

        <p className={`text-[12px] mt-3 text-center ${isDark ? 'text-white/40' : 'text-[#94a7b8]'}`}>
          Or call the demo line directly: <a href="tel:+447427846243" className="underline">07427 846 243</a>
        </p>
      </div>
    </div>
  );
}
