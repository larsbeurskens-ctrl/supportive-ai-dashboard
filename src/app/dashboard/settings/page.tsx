'use client';

import { useState, useEffect } from 'react';
import { getProvisionStatus, saveBusinessDetails, ProvisionStatus } from '@/lib/api';

interface PriceRange {
  service: string;
  low: number;
  high: number;
  note?: string;
}

// Default price ranges per vertical (same as backend)
const DEFAULT_RANGES: Record<string, PriceRange[]> = {
  plumbing: [
    { service: 'Faucet repair', low: 100, high: 250 },
    { service: 'Drain clearing', low: 150, high: 300 },
    { service: 'Toilet repair', low: 100, high: 250 },
    { service: 'Water heater replacement (tank)', low: 1200, high: 2500 },
    { service: 'Water heater replacement (tankless)', low: 2500, high: 4500 },
    { service: 'Garbage disposal', low: 150, high: 400 },
  ],
  window_cleaning: [
    { service: '1-story exterior', low: 150, high: 250 },
    { service: '2-story exterior', low: 250, high: 400 },
    { service: '3-story exterior', low: 400, high: 600 },
    { service: 'Interior add-on', low: 0, high: 0, note: 'add roughly 40-50% to exterior' },
  ],
  hvac: [
    { service: 'AC diagnostic / tune-up', low: 75, high: 150 },
    { service: 'Furnace diagnostic / tune-up', low: 75, high: 150 },
    { service: 'Capacitor replacement', low: 150, high: 350 },
    { service: 'Refrigerant recharge', low: 200, high: 500 },
    { service: 'Blower motor replacement', low: 300, high: 800 },
    { service: 'Compressor replacement', low: 800, high: 2500 },
    { service: 'Full AC system replacement', low: 4000, high: 10000 },
    { service: 'Full furnace replacement', low: 3000, high: 7000 },
  ],
};

function PriceRangeEditor({ ranges, onChange }: { ranges: PriceRange[]; onChange: (r: PriceRange[]) => void }) {
  function updateRow(idx: number, field: keyof PriceRange, value: string | number) {
    const updated = [...ranges];
    updated[idx] = { ...updated[idx], [field]: value };
    onChange(updated);
  }
  function addRow() {
    onChange([...ranges, { service: '', low: 0, high: 0 }]);
  }
  function removeRow(idx: number) {
    onChange(ranges.filter((_, i) => i !== idx));
  }

  return (
    <div className="space-y-2">
      {/* Header */}
      <div className="grid grid-cols-[1fr_80px_80px_80px_32px] gap-2 text-[11px] font-semibold text-[#94a7b8] uppercase tracking-wide px-1">
        <span>Service</span><span>Low ($)</span><span>High ($)</span><span>Note</span><span></span>
      </div>
      {ranges.map((r, i) => (
        <div key={i} className="grid grid-cols-[1fr_80px_80px_80px_32px] gap-2 items-center">
          <input type="text" value={r.service} onChange={e => updateRow(i, 'service', e.target.value)}
            placeholder="e.g. Faucet repair"
            className="px-3 py-2 border border-[#e5e0da] rounded-lg text-[13px] text-[#1a2e3b] focus:outline-none focus:border-[#e8930c]" />
          <input type="number" value={r.low || ''} onChange={e => updateRow(i, 'low', parseInt(e.target.value) || 0)}
            placeholder="100"
            className="px-2 py-2 border border-[#e5e0da] rounded-lg text-[13px] text-[#1a2e3b] text-center focus:outline-none focus:border-[#e8930c]" />
          <input type="number" value={r.high || ''} onChange={e => updateRow(i, 'high', parseInt(e.target.value) || 0)}
            placeholder="250"
            className="px-2 py-2 border border-[#e5e0da] rounded-lg text-[13px] text-[#1a2e3b] text-center focus:outline-none focus:border-[#e8930c]" />
          <input type="text" value={r.note || ''} onChange={e => updateRow(i, 'note', e.target.value)}
            placeholder="optional"
            className="px-2 py-2 border border-[#e5e0da] rounded-lg text-[11px] text-[#5a7184] focus:outline-none focus:border-[#e8930c]" />
          <button onClick={() => removeRow(i)}
            className="w-7 h-7 flex items-center justify-center rounded-lg text-[#dc2626] hover:bg-[#fef2f2] bg-transparent border-none cursor-pointer text-sm">
            ×
          </button>
        </div>
      ))}
      <button onClick={addRow}
        className="text-[13px] font-semibold text-[#e8930c] hover:text-[#d17f00] bg-transparent border-none cursor-pointer px-1 py-1">
        + Add service
      </button>
    </div>
  );
}

export default function SettingsPage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState('');
  const [status, setStatus] = useState<ProvisionStatus | null>(null);

  // Editable fields
  const [diagnosticFee, setDiagnosticFee] = useState('');
  const [priceRanges, setPriceRanges] = useState<PriceRange[]>([]);
  const [services, setServices] = useState('');
  const [emergencyService, setEmergencyService] = useState(false);
  const [ownerPhone, setOwnerPhone] = useState('');

  useEffect(() => {
    getProvisionStatus().then(s => {
      setStatus(s);
      const o = s.overrides || {};
      setDiagnosticFee(o.diagnosticFee?.toString() || o.serviceCallFee?.toString() || '');
      setPriceRanges(o.priceRanges || DEFAULT_RANGES[s.vertical] || []);
      setServices(o.services || '');
      setEmergencyService(o.emergencyAvailability || false);
      setOwnerPhone(o.ownerPhone || '');
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  async function handleSave() {
    setSaving(true);
    setError('');
    setSaved(false);
    try {
      await saveBusinessDetails({
        diagnosticFee: diagnosticFee.trim(),
        priceRanges: priceRanges.filter(r => r.service.trim()),
        services: services.trim(),
        emergencyAvailability: emergencyService,
        ownerPhone: ownerPhone.trim(),
      });
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (e: any) {
      setError(e.message);
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center py-16">
        <div className="w-6 h-6 border-2 border-[#1a2e3b] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const vertical = status?.vertical || 'plumbing';
  const feeLabel = vertical === 'window_cleaning' ? 'Starting price / estimate range' :
                   vertical === 'hvac' ? 'Service call fee' : 'Call-out / diagnostic fee';

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-[22px] font-bold text-[#1a2e3b]">Settings</h1>
          <p className="text-[13px] text-[#94a7b8] mt-0.5">Configure what your AI agent tells customers.</p>
        </div>
        <div className="flex items-center gap-2">
          {saved && <span className="text-[13px] font-semibold text-[#059669]">Saved!</span>}
          {error && <span className="text-[13px] text-[#dc2626]">{error}</span>}
          <button onClick={handleSave} disabled={saving}
            className="px-5 py-2.5 bg-[#e8930c] text-white text-[14px] font-bold rounded-xl hover:bg-[#d17f00] transition-colors cursor-pointer border-none disabled:opacity-50">
            {saving ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </div>

      {/* Plan & subscription */}
      {status && (() => {
        const planLabels: Record<string, string> = { starter: 'Starter', standard: 'Standard', business: 'Business' };
        const isUS = status && (status as any).phoneNumber?.startsWith('+1');
        const planPrices: Record<string, string> = isUS
          ? { starter: '$89/mo', standard: '$149/mo', business: '$299/mo' }
          : { starter: '£69/mo', standard: '£119/mo', business: '£229/mo' };
        const plan = (status as any).selectedPlan || 'starter';
        const tier = (status as any).subscriptionTier || 'trial';
        const liveSince = typeof window !== 'undefined' ? localStorage.getItem('agent_live_since') : null;
        const daysLeft = liveSince ? Math.max(0, 7 - Math.floor((Date.now() - new Date(liveSince).getTime()) / (1000 * 60 * 60 * 24))) : null;
        const expired = daysLeft !== null && daysLeft <= 0;

        return (
          <div className={`rounded-xl border p-5 ${expired ? 'bg-[#fef2f2] border-[#fecaca]' : 'bg-white border-[#e5e0da]'}`}>
            <div className="flex items-center justify-between">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <h2 className="text-[15px] font-bold text-[#1a2e3b]">Your plan</h2>
                  <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${
                    expired ? 'bg-[#fecaca] text-[#991b1b]' : tier === 'trial' ? 'bg-[#dbeafe] text-[#1e40af]' : 'bg-[#d1fae5] text-[#065f46]'
                  }`}>
                    {expired ? 'Trial ended' : tier === 'trial' ? 'Free trial' : 'Active'}
                  </span>
                </div>
                <p className="text-[14px] text-[#1a2e3b]">
                  <strong>{planLabels[plan] || 'Starter'}</strong> — {planPrices[plan] || '$89/mo'}
                  {daysLeft !== null && !expired && (
                    <span className="text-[#5a7184] ml-1">· {daysLeft} day{daysLeft !== 1 ? 's' : ''} left on trial</span>
                  )}
                </p>
              </div>
              {expired ? (
                <a href="https://cal.com/lars-beurskens-g1aaqy/15min" target="_blank" rel="noopener noreferrer"
                  className="px-4 py-2 bg-[#e8930c] text-white text-[13px] font-bold rounded-lg no-underline hover:bg-[#d17f00]">
                  Set up billing →
                </a>
              ) : (
                <a href="/#pricing" className="text-[13px] text-[#0d9488] font-semibold no-underline hover:underline">
                  Compare plans
                </a>
              )}
            </div>
          </div>
        );
      })()}

      {/* Pricing — the main event */}
      <div className="bg-white rounded-xl border border-[#e5e0da] p-6">
        <div className="flex items-center gap-2.5 mb-1">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#e8930c" strokeWidth="2" strokeLinecap="round"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6"/></svg>
          <h2 className="text-[15px] font-bold text-[#1a2e3b]">Pricing Your AI Quotes to Customers</h2>
        </div>
        <p className="text-[13px] text-[#5a7184] mb-5">These are the ballpark figures your AI gives when customers ask about cost. The AI always adds "every job is a little different" — these just give it something real to say.</p>

        {/* Diagnostic / call-out fee */}
        <div className="mb-5">
          <label className="block text-sm font-semibold text-[#1a2e3b] mb-1">{feeLabel}</label>
          <input type="text" value={diagnosticFee} onChange={e => setDiagnosticFee(e.target.value)}
            placeholder="e.g. $89, free estimates, varies by job"
            className="w-full max-w-md px-4 py-2.5 border border-[#e5e0da] rounded-xl text-[14px] text-[#1a2e3b] focus:outline-none focus:ring-2 focus:ring-[#e8930c]" />
          <p className="text-[11px] text-[#94a7b8] mt-1">Leave blank if you don't charge a diagnostic/call-out fee.</p>
        </div>

        {/* Service price ranges */}
        <div>
          <label className="block text-sm font-semibold text-[#1a2e3b] mb-2">Service price ranges</label>
          <PriceRangeEditor ranges={priceRanges} onChange={setPriceRanges} />
          <p className="text-[11px] text-[#94a7b8] mt-2">Your AI will say something like: "A faucet repair typically runs $100 to $250, but every job is a little different."</p>
        </div>
      </div>

      {/* Services */}
      <div className="bg-white rounded-xl border border-[#e5e0da] p-6">
        <div className="flex items-center gap-2.5 mb-1">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#e8930c" strokeWidth="2" strokeLinecap="round"><path d="M14.7 6.3a1 1 0 000 1.4l1.6 1.6a1 1 0 001.4 0l3.77-3.77a6 6 0 01-7.94 7.94l-6.91 6.91a2.12 2.12 0 01-3-3l6.91-6.91a6 6 0 017.94-7.94l-3.76 3.76z"/></svg>
          <h2 className="text-[15px] font-bold text-[#1a2e3b]">Services & Availability</h2>
        </div>
        <p className="text-[13px] text-[#5a7184] mb-4">What services does your business offer? Your AI uses this to answer customer questions.</p>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-[#1a2e3b] mb-1">Services you offer</label>
            <textarea value={services} onChange={e => setServices(e.target.value)}
              placeholder="e.g. drain cleaning, water heater repair, emergency plumbing, bathroom remodels..."
              rows={3}
              className="w-full px-4 py-2.5 border border-[#e5e0da] rounded-xl text-[14px] text-[#1a2e3b] focus:outline-none focus:ring-2 focus:ring-[#e8930c] resize-none" />
          </div>
          <label className="flex items-center gap-2.5 cursor-pointer">
            <input type="checkbox" checked={emergencyService} onChange={e => setEmergencyService(e.target.checked)}
              className="w-4 h-4 rounded border-[#e5e0da] accent-[#e8930c]" />
            <span className="text-[14px] text-[#1a2e3b]">We offer emergency / after-hours service</span>
          </label>
        </div>
      </div>

      {/* Owner contact */}
      <div className="bg-white rounded-xl border border-[#e5e0da] p-6">
        <div className="flex items-center gap-2.5 mb-1">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#e8930c" strokeWidth="2" strokeLinecap="round"><path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6A19.79 19.79 0 012.12 4.18 2 2 0 014.11 2h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z"/></svg>
          <h2 className="text-[15px] font-bold text-[#1a2e3b]">Owner Contact</h2>
        </div>
        <p className="text-[13px] text-[#5a7184] mb-4">Your number for SMS alerts when calls come in and emergencies are escalated.</p>
        <input type="tel" value={ownerPhone} onChange={e => setOwnerPhone(e.target.value)}
          placeholder="+1 (555) 123-4567"
          className="w-full max-w-sm px-4 py-2.5 border border-[#e5e0da] rounded-xl text-[14px] text-[#1a2e3b] focus:outline-none focus:ring-2 focus:ring-[#e8930c]" />
      </div>

      {/* Agent info (read-only) */}
      {status && (
        <div className="bg-[#faf9f7] rounded-xl border border-[#e5e0da] p-6">
          <h2 className="text-[13px] font-bold text-[#94a7b8] uppercase tracking-wide mb-3">Your AI Agent</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-[14px]">
            <div>
              <span className="text-[#94a7b8] text-[12px]">Name</span>
              <p className="font-semibold text-[#1a2e3b]">{status.agentName}</p>
            </div>
            <div>
              <span className="text-[#94a7b8] text-[12px]">Phone</span>
              <p className="font-semibold text-[#1a2e3b]">{status.phoneNumber || '—'}</p>
            </div>
            <div>
              <span className="text-[#94a7b8] text-[12px]">Trade</span>
              <p className="font-semibold text-[#1a2e3b] capitalize">{status.vertical?.replace('_', ' ')}</p>
            </div>
          </div>
        </div>
      )}

      {/* Bottom save */}
      <div className="flex justify-end pb-8">
        <button onClick={handleSave} disabled={saving}
          className="px-6 py-3 bg-[#e8930c] text-white text-[14px] font-bold rounded-xl hover:bg-[#d17f00] transition-colors cursor-pointer border-none disabled:opacity-50 shadow-[0_2px_8px_rgba(232,147,12,0.25)]">
          {saving ? 'Saving...' : 'Save Changes'}
        </button>
      </div>
    </div>
  );
}
