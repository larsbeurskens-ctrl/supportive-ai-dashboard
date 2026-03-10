'use client';

import { useState, useEffect, useCallback } from 'react';
import { getProvisionStatus, saveBusinessDetails, goLive } from '@/lib/api';
import type { ProvisionStatus } from '@/lib/api';

const CARRIER_CODES: Record<string, { noAnswer: string; all: string; disable: string }> = {
  'AT&T': { noAnswer: '*61*{NUM}#', all: '*21*{NUM}#', disable: '#21#' },
  'Verizon': { noAnswer: '*71{NUM}', all: '*72{NUM}', disable: '*73' },
  'T-Mobile': { noAnswer: '**61*{NUM}#', all: '**21*{NUM}#', disable: '##21#' },
  'Spectrum': { noAnswer: '*92{NUM}', all: '*72{NUM}', disable: '*93' },
  'Landline': { noAnswer: '*92{NUM}', all: '*72{NUM}', disable: '*73' },
};

export default function CallSettingsPage() {
  const [status, setStatus] = useState<ProvisionStatus | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [goingLive, setGoingLive] = useState(false);
  const [selectedCarrier, setSelectedCarrier] = useState('');
  const [showCarrierCodes, setShowCarrierCodes] = useState(false);

  // Pickup rules state
  const [afterHours, setAfterHours] = useState(true);
  const [missedCalls, setMissedCalls] = useState(true);
  const [alwaysOn, setAlwaysOn] = useState(false);

  const refresh = useCallback(async () => {
    try {
      const s = await getProvisionStatus();
      setStatus(s);
      const rules = (s as any).pickupRules || {};
      setAfterHours(rules.afterHours ?? true);
      setMissedCalls(rules.missedCalls ?? true);
      setAlwaysOn(rules.alwaysOn ?? false);
    } catch { /* not provisioned */ }
    setLoading(false);
  }, []);

  useEffect(() => { refresh(); }, [refresh]);

  const agentName = status?.agentName || 'your AI';
  const phoneNum = status?.phoneNumber?.replace('+1', '') || '';
  const isLive = status?.isLive || false;

  async function handleSaveRules() {
    setSaving(true); setSaved(false);
    try {
      await saveBusinessDetails({ pickupRules: { afterHours, missedCalls, alwaysOn } });
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch { /* */ }
    setSaving(false);
  }

  async function handleToggleLive() {
    setGoingLive(true);
    try {
      if (isLive) {
        // Disable — set isLive to false via backend
        const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'https://supportive-ai-backend-production.up.railway.app';
        await fetch(`${API_BASE}/api/businesses/${(status as any)?.checklist ? 'go-offline' : 'go-offline'}`, { method: 'POST' });
        // Fallback: use saveBusinessDetails
        await saveBusinessDetails({ agentDisabled: true });
      } else {
        await goLive();
      }
      await refresh();
    } catch { /* */ }
    setGoingLive(false);
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="w-6 h-6 border-2 border-[#0d9488] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!status?.provisioned) {
    return (
      <div className="space-y-4">
        <h1 className="text-[22px] font-bold text-[#1a2e3b]">Call Settings</h1>
        <p className="text-[14px] text-[#5a7184]">Complete your setup first to configure call settings.</p>
      </div>
    );
  }

  const carrier = CARRIER_CODES[selectedCarrier];
  const dialCode = carrier ? (alwaysOn ? carrier.all : carrier.noAnswer).replace('{NUM}', phoneNum) : '';
  const disableCode = carrier?.disable || '*73';

  return (
    <div className="space-y-7">
      <div>
        <h1 className="text-[22px] font-bold text-[#1a2e3b]">Call Settings</h1>
        <p className="text-[14px] text-[#5a7184] mt-1">Control when and how {agentName} answers your calls.</p>
      </div>

      {/* Agent status */}
      <div className={`rounded-xl border-2 p-5 ${isLive ? 'bg-[#f0fdf4] border-[#86efac]' : 'bg-[#fef8f0] border-[#f0dcc0]'}`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className={`w-3 h-3 rounded-full ${isLive ? 'bg-[#22c55e] animate-pulse' : 'bg-[#d97706]'}`} />
            <div>
              <p className="text-[15px] font-bold text-[#1a2e3b]">
                {isLive ? `${agentName} is live` : `${agentName} is paused`}
              </p>
              <p className="text-[13px] text-[#5a7184]">
                {isLive ? `Answering calls at ${status?.phoneNumber || ''}` : 'Not answering calls right now'}
              </p>
            </div>
          </div>
          <button
            onClick={handleToggleLive}
            disabled={goingLive}
            className={`px-5 py-2.5 rounded-xl text-[13px] font-bold transition-colors cursor-pointer border-none ${
              isLive
                ? 'bg-[#fef2f2] text-[#dc2626] hover:bg-[#fee2e2]'
                : 'bg-[#22c55e] text-white hover:bg-[#16a34a]'
            }`}
          >
            {goingLive ? 'Updating...' : isLive ? 'Pause agent' : 'Enable agent'}
          </button>
        </div>
      </div>

      {/* Pickup rules */}
      <div className="bg-white rounded-xl border border-[#e5e0da] p-6">
        <h2 className="text-[15px] font-bold text-[#1a2e3b] mb-1">When should {agentName} answer?</h2>
        <p className="text-[13px] text-[#94a7b8] mb-4">Select all that apply — you can change this anytime.</p>

        <div className="space-y-2.5 mb-5">
          <label className={`flex items-start gap-3 p-3.5 rounded-xl border-2 cursor-pointer transition-all ${afterHours ? 'border-[#0d9488] bg-[#f0fdf4]' : 'border-[#e5e0da] bg-white'}`}>
            <input type="checkbox" checked={afterHours} onChange={e => setAfterHours(e.target.checked)}
              className="w-5 h-5 rounded border-[#d1ccc6] text-[#0d9488] focus:ring-[#0d9488] mt-0.5 flex-shrink-0" />
            <div>
              <span className="text-[14px] font-bold text-[#1a2e3b]">After hours</span>
              <p className="text-[12px] text-[#5a7184] mt-0.5">Evenings, weekends, holidays — when you&apos;re off the clock.</p>
            </div>
          </label>
          <label className={`flex items-start gap-3 p-3.5 rounded-xl border-2 cursor-pointer transition-all ${missedCalls ? 'border-[#0d9488] bg-[#f0fdf4]' : 'border-[#e5e0da] bg-white'}`}>
            <input type="checkbox" checked={missedCalls} onChange={e => setMissedCalls(e.target.checked)}
              className="w-5 h-5 rounded border-[#d1ccc6] text-[#0d9488] focus:ring-[#0d9488] mt-0.5 flex-shrink-0" />
            <div>
              <span className="text-[14px] font-bold text-[#1a2e3b]">When I miss a call</span>
              <p className="text-[12px] text-[#5a7184] mt-0.5">Your phone rings first. After 4 rings, {agentName} picks up.</p>
            </div>
          </label>
          <label className={`flex items-start gap-3 p-3.5 rounded-xl border-2 cursor-pointer transition-all ${alwaysOn ? 'border-[#0d9488] bg-[#f0fdf4]' : 'border-[#e5e0da] bg-white'}`}>
            <input type="checkbox" checked={alwaysOn} onChange={e => setAlwaysOn(e.target.checked)}
              className="w-5 h-5 rounded border-[#d1ccc6] text-[#0d9488] focus:ring-[#0d9488] mt-0.5 flex-shrink-0" />
            <div>
              <span className="text-[14px] font-bold text-[#1a2e3b]">Always on</span>
              <p className="text-[12px] text-[#5a7184] mt-0.5">{agentName} answers every call. Urgent ones get forwarded to you.</p>
            </div>
          </label>
        </div>

        <div className="flex items-center gap-3">
          <button onClick={handleSaveRules} disabled={saving}
            className="px-5 py-2.5 bg-[#1a2e3b] text-white text-[13px] font-bold rounded-xl hover:bg-[#243d4e] transition-colors cursor-pointer border-none disabled:opacity-60">
            {saving ? 'Saving...' : 'Save settings'}
          </button>
          {saved && <span className="text-[13px] font-semibold text-[#059669]">✓ Saved</span>}
        </div>
      </div>

      {/* Carrier dial codes — collapsible */}
      <div className="bg-white rounded-xl border border-[#e5e0da] p-6">
        <button onClick={() => setShowCarrierCodes(!showCarrierCodes)}
          className="flex items-center justify-between w-full bg-transparent border-none cursor-pointer text-left">
          <div>
            <h2 className="text-[15px] font-bold text-[#1a2e3b]">Phone dial codes</h2>
            <p className="text-[13px] text-[#94a7b8]">Carrier-specific codes to connect your phone to {agentName}</p>
          </div>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#94a7b8" strokeWidth="2"
            className={`transition-transform ${showCarrierCodes ? 'rotate-180' : ''}`}>
            <path d="M6 9l6 6 6-6"/>
          </svg>
        </button>

        {showCarrierCodes && (
          <div className="mt-4 pt-4 border-t border-[#f0eeeb]">
            <p className="text-[13px] text-[#5a7184] mb-3">Select your carrier to see the dial code:</p>
            <div className="flex flex-wrap gap-2 mb-4">
              {Object.keys(CARRIER_CODES).map(name => (
                <button key={name} onClick={() => setSelectedCarrier(name)}
                  className={`px-4 py-2 rounded-lg text-[13px] font-semibold border cursor-pointer transition-all ${
                    selectedCarrier === name ? 'border-[#0d9488] bg-[#f0fdf4] text-[#1a2e3b]' : 'border-[#e5e0da] bg-white text-[#5a7184]'
                  }`}>{name}</button>
              ))}
            </div>

            {carrier && (
              <div className="space-y-3">
                <div className="bg-[#f0fdf4] rounded-xl p-4 border border-[#86efac]">
                  <p className="text-[12px] font-semibold text-[#059669] mb-1">To connect {agentName} to your phone:</p>
                  <p className="text-[18px] font-bold text-[#1a2e3b] font-mono">{dialCode}</p>
                  <p className="text-[11px] text-[#5a7184] mt-1">Dial this from your business phone, wait for the tone, then hang up.</p>
                </div>
                <div className="bg-[#faf9f7] rounded-xl p-4 border border-[#e5e0da]">
                  <p className="text-[12px] font-semibold text-[#94a7b8] mb-1">To disconnect (pause {agentName}):</p>
                  <p className="text-[16px] font-bold text-[#94a7b8] font-mono">{disableCode}</p>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
