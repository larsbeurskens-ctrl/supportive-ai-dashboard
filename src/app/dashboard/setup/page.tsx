'use client';

import { useState } from 'react';
import { useSession } from 'next-auth/react';

type ForwardingMode = 'no-answer' | 'busy' | 'always' | 'after-hours';

const carriers = [
  {
    name: 'AT&T',
    modes: {
      'no-answer': { enable: '*61*{NUMBER}#', disable: '#61#', desc: 'Forwards after ~4 rings if no answer' },
      'busy': { enable: '*67*{NUMBER}#', disable: '#67#', desc: 'Forwards when you\'re on another call' },
      'always': { enable: '*21*{NUMBER}#', disable: '#21#', desc: 'All calls go to your AI immediately' },
    },
  },
  {
    name: 'Verizon',
    modes: {
      'no-answer': { enable: '*71{NUMBER}', disable: '*73', desc: 'Forwards after ~4 rings if no answer' },
      'busy': { enable: '*90{NUMBER}', disable: '*91', desc: 'Forwards when you\'re on another call' },
      'always': { enable: '*72{NUMBER}', disable: '*73', desc: 'All calls go to your AI immediately' },
    },
  },
  {
    name: 'T-Mobile',
    modes: {
      'no-answer': { enable: '**61*{NUMBER}#', disable: '##61#', desc: 'Forwards after ~4 rings if no answer' },
      'busy': { enable: '**67*{NUMBER}#', disable: '##67#', desc: 'Forwards when you\'re on another call' },
      'always': { enable: '**21*{NUMBER}#', disable: '##21#', desc: 'All calls go to your AI immediately' },
    },
  },
  {
    name: 'Spectrum Mobile',
    modes: {
      'no-answer': { enable: '*92{NUMBER}', disable: '*93', desc: 'Forwards after ~4 rings if no answer' },
      'busy': { enable: '*90{NUMBER}', disable: '*91', desc: 'Forwards when you\'re on another call' },
      'always': { enable: '*72{NUMBER}', disable: '*73', desc: 'All calls go to your AI immediately' },
    },
  },
  {
    name: 'Landline (most providers)',
    modes: {
      'no-answer': { enable: '*92{NUMBER}', disable: '*93', desc: 'Forwards after ~4 rings if no answer' },
      'always': { enable: '*72{NUMBER}', disable: '*73', desc: 'All calls go to your AI immediately' },
    },
  },
];

const modeLabels: Record<string, { label: string; icon: string; description: string }> = {
  'no-answer': {
    label: 'Forward if no answer',
    icon: '📱',
    description: 'Your phone rings first. If you don\'t pick up after 4 rings, the AI answers. Most popular option — catches overflow without changing your routine.',
  },
  'busy': {
    label: 'Forward when busy',
    icon: '📞',
    description: 'If you\'re already on a call, the AI picks up the second call. Never miss a lead while you\'re talking to another customer.',
  },
  'always': {
    label: 'Forward all calls',
    icon: '🤖',
    description: 'Every call goes straight to your AI receptionist. Best for after-hours or when you want the AI handling all calls.',
  },
  'after-hours': {
    label: 'After-hours only',
    icon: '🌙',
    description: 'Turn on "Forward all calls" at the end of your work day, and disable it in the morning. We\'ll help you automate this.',
  },
};

export default function ForwardingPage() {
  const { data: session } = useSession();
  const [selectedMode, setSelectedMode] = useState<ForwardingMode>('no-answer');
  const [selectedCarrier, setSelectedCarrier] = useState<string>('');
  const [savedMode, setSavedMode] = useState<ForwardingMode | null>(null);
  const [saving, setSaving] = useState(false);

  // Replace placeholder with actual AI phone number
  const aiNumber = (session?.user as any)?.twilioPhoneNumber || '(your AI number)';

  const carrier = carriers.find(c => c.name === selectedCarrier);
  const modeData = carrier?.modes[selectedMode as keyof typeof carrier.modes];

  function handleSavePreference() {
    setSaving(true);
    setTimeout(() => {
      setSavedMode(selectedMode);
      setSaving(false);
    }, 600);
  }

  return (
    <div className="space-y-7">
      <div>
        <h1 className="text-[22px] font-bold text-[#1a2e3b]">Call Forwarding Setup</h1>
        <p className="text-[14px] text-[#5a7184] mt-1 leading-relaxed max-w-[600px]">
          Connect your existing business number to your AI receptionist. Takes about 2 minutes.
          Your number stays the same — callers won&apos;t know the difference.
        </p>
      </div>

      {/* Step 1: Choose when AI picks up */}
      <div className="bg-white rounded-xl border border-[#e5e0da] p-6">
        <h2 className="text-[15px] font-bold text-[#1a2e3b] mb-1">Step 1: When should your AI pick up?</h2>
        <p className="text-[13px] text-[#94a7b8] mb-4">You can change this anytime</p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
          {(Object.entries(modeLabels) as [ForwardingMode, typeof modeLabels[string]][]).map(([key, mode]) => (
            <button
              key={key}
              onClick={() => setSelectedMode(key)}
              className={`text-left p-4 rounded-xl border-2 transition-all cursor-pointer bg-white ${
                selectedMode === key
                  ? 'border-[#e8930c] bg-[#fffbf5]'
                  : 'border-[#e5e0da] hover:border-[#d1ccc6]'
              }`}
            >
              <div className="flex items-center gap-2 mb-1.5">
                <span className="text-base">{mode.icon}</span>
                <span className="text-[14px] font-bold text-[#1a2e3b]">{mode.label}</span>
              </div>
              <p className="text-[12px] text-[#5a7184] leading-relaxed">{mode.description}</p>
            </button>
          ))}
        </div>

        <div className="flex items-center gap-3 pt-3 border-t border-[#f0eeeb]">
          <button
            onClick={handleSavePreference}
            disabled={saving}
            className="px-5 py-2.5 bg-[#1a2e3b] text-white text-[13px] font-bold rounded-xl hover:bg-[#243d4e] transition-colors cursor-pointer border-none disabled:opacity-60"
          >
            {saving ? 'Saving…' : 'Save preference'}
          </button>
          {savedMode === selectedMode && !saving && (
            <span className="flex items-center gap-1.5 text-[13px] font-semibold text-[#059669]">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg>
              Saved — <span className="font-normal text-[#5a7184]">{modeLabels[savedMode].label}</span>
            </span>
          )}
        </div>
      </div>

      {/* Step 2: Select carrier */}
      {selectedMode !== 'after-hours' && (
        <div className="bg-white rounded-xl border border-[#e5e0da] p-6">
          <h2 className="text-[15px] font-bold text-[#1a2e3b] mb-1">Step 2: What&apos;s your phone carrier?</h2>
          <p className="text-[13px] text-[#94a7b8] mb-4">This is for your business phone line</p>

          <div className="flex flex-wrap gap-2">
            {carriers.map(c => (
              <button
                key={c.name}
                onClick={() => setSelectedCarrier(c.name)}
                className={`px-4 py-2.5 rounded-lg text-[13px] font-semibold border transition-all cursor-pointer ${
                  selectedCarrier === c.name
                    ? 'border-[#e8930c] bg-[#fffbf5] text-[#1a2e3b]'
                    : 'border-[#e5e0da] bg-white text-[#5a7184] hover:border-[#d1ccc6]'
                }`}
              >
                {c.name}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Step 3: Instructions */}
      {carrier && modeData && selectedMode !== 'after-hours' && (
        <div className="bg-white rounded-xl border border-[#e5e0da] p-6">
          <h2 className="text-[15px] font-bold text-[#1a2e3b] mb-4">Step 3: Dial this code from your phone</h2>

          <div className="bg-[#faf9f7] rounded-xl p-5 mb-4">
            <p className="text-[12px] font-semibold text-[#5a7184] uppercase tracking-wide mb-2">To enable</p>
            <p className="text-[22px] font-bold text-[#1a2e3b] font-mono tracking-wider">
              {modeData.enable.replace('{NUMBER}', aiNumber)}
            </p>
            <p className="text-[13px] text-[#5a7184] mt-2">{modeData.desc}</p>
          </div>

          <div className="bg-[#faf9f7] rounded-xl p-5 mb-5">
            <p className="text-[12px] font-semibold text-[#5a7184] uppercase tracking-wide mb-2">To disable (go back to normal)</p>
            <p className="text-[22px] font-bold text-[#1a2e3b] font-mono tracking-wider">
              {modeData.disable}
            </p>
          </div>

          <div className="bg-[#eef9f0] rounded-xl p-4 flex items-start gap-3">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#059669" strokeWidth="2" className="flex-shrink-0 mt-0.5"><path d="M20 6L9 17l-5-5"/></svg>
            <div>
              <p className="text-[13px] font-semibold text-[#059669]">That&apos;s it!</p>
              <p className="text-[12px] text-[#5a7184] mt-0.5">
                Dial the code, listen for the confirmation tone, and hang up. Your AI receptionist is now connected.
                Test it by calling your business number.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* After-hours special instructions */}
      {selectedMode === 'after-hours' && (
        <div className="bg-white rounded-xl border border-[#e5e0da] p-6">
          <h2 className="text-[15px] font-bold text-[#1a2e3b] mb-3">After-hours setup</h2>
          <p className="text-[14px] text-[#5a7184] leading-relaxed mb-4">
            For after-hours handling, you&apos;ll use &quot;Forward all calls&quot; and toggle it on/off:
          </p>
          <div className="space-y-3">
            <div className="flex items-start gap-3 text-[14px]">
              <span className="text-[#e8930c] font-bold">→</span>
              <span className="text-[#5a7184]"><strong className="text-[#1a2e3b]">End of day:</strong> Dial the &quot;Forward all calls&quot; code for your carrier</span>
            </div>
            <div className="flex items-start gap-3 text-[14px]">
              <span className="text-[#e8930c] font-bold">→</span>
              <span className="text-[#5a7184]"><strong className="text-[#1a2e3b]">Morning:</strong> Dial the disable code to take calls yourself again</span>
            </div>
            <div className="flex items-start gap-3 text-[14px]">
              <span className="text-[#e8930c] font-bold">→</span>
              <span className="text-[#5a7184]"><strong className="text-[#1a2e3b]">Want to automate it?</strong> Book a setup call and we&apos;ll help configure scheduled forwarding with your carrier</span>
            </div>
          </div>
          <div className="mt-5">
            <button onClick={() => setSelectedMode('always')} className="text-[13px] font-semibold text-[#e8930c] bg-transparent border-none cursor-pointer underline">
              Show me the &quot;Forward all calls&quot; codes →
            </button>
          </div>
        </div>
      )}

      {/* Help section */}
      <div className="bg-[#fffbf5] rounded-xl border border-[#f0dcc0] p-5">
        <h3 className="text-[14px] font-bold text-[#1a2e3b] mb-2">Need help?</h3>
        <p className="text-[13px] text-[#5a7184] leading-relaxed">
          Carrier codes can vary by region and plan. If the code doesn&apos;t work, try calling your carrier and asking them to
          &quot;set up conditional call forwarding to {aiNumber}&quot;. Or chat with us — we&apos;ve done this hundreds of times.
        </p>
      </div>
    </div>
  );
}
