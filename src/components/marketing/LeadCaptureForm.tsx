'use client';

import { useState } from 'react';

interface LeadCaptureFormProps {
  trade?: string;
  verticalSlug?: string;
}

export function LeadCaptureForm({ trade = 'home service', verticalSlug = 'homepage' }: LeadCaptureFormProps) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [business, setBusiness] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email) return;
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/outreach-leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, businessName: business, vertical: verticalSlug }),
      });
      if (!res.ok) throw new Error('Failed');
      setSubmitted(true);
    } catch {
      setError('Something went wrong. Try again.');
    } finally {
      setLoading(false);
    }
  }

  if (submitted) {
    return (
      <div className="text-center py-6">
        <div className="w-12 h-12 rounded-full bg-[#eef9f0] flex items-center justify-center mx-auto mb-4">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#059669" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg>
        </div>
        <h3 className="text-[17px] font-bold text-[#1a2e3b] mb-1">Check your inbox</h3>
        <p className="text-[14px] text-[#5a7184]">
          We&apos;ve sent you a sample {trade.toLowerCase()} conversation and a walkthrough of how it works.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <input type="text" placeholder="Your name" value={name} onChange={e => setName(e.target.value)}
          className="w-full px-4 py-3 rounded-lg border border-[#d1ccc6] text-[14px] text-[#1a2e3b] placeholder-[#94a7b8] focus:outline-none focus:border-[#e8930c] bg-white" />
        <input type="text" placeholder="Business name" value={business} onChange={e => setBusiness(e.target.value)}
          className="w-full px-4 py-3 rounded-lg border border-[#d1ccc6] text-[14px] text-[#1a2e3b] placeholder-[#94a7b8] focus:outline-none focus:border-[#e8930c] bg-white" />
      </div>
      <div className="flex flex-col sm:flex-row gap-2">
        <input type="email" required placeholder="Work email address" value={email} onChange={e => setEmail(e.target.value)}
          className="flex-1 w-full px-4 py-3 rounded-lg border border-[#d1ccc6] text-[14px] text-[#1a2e3b] placeholder-[#94a7b8] focus:outline-none focus:border-[#e8930c] bg-white" />
        <button type="submit" disabled={loading || !email}
          className="w-full sm:w-auto bg-[#e8930c] text-white px-6 py-3 rounded-lg text-[14px] font-bold whitespace-nowrap hover:bg-[#d17f00] transition-colors disabled:opacity-60 cursor-pointer border-none">
          {loading ? 'Sending…' : 'Send demo →'}
        </button>
      </div>
      {error && <p className="text-[13px] text-red-500">{error}</p>}
      <p className="text-[12px] text-[#94a7b8]">No spam. You&apos;ll get 3 emails about how it works — that&apos;s it.</p>
    </form>
  );
}
