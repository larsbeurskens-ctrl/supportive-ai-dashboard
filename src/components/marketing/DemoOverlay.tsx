'use client';

import { useState } from 'react';

export interface DemoConfig {
  label: string;      // e.g. "Window Cleaning"
  phone: string;      // e.g. "(845) 209-2401"
  tel: string;        // e.g. "+18452092401"
  addresses: string[];
  whatToTry: string;
}

interface DemoOverlayProps {
  onClose: () => void;
  /**
   * Pass 2 configs → homepage mode (tabs shown, user can switch vertical).
   * Pass 1 config  → vertical-page mode (no tabs, pre-focused on that trade).
   */
  configs: DemoConfig[];
  defaultIndex?: number;
}

export function DemoOverlay({ onClose, configs, defaultIndex = 0 }: DemoOverlayProps) {
  const [tab, setTab] = useState(defaultIndex);
  const d = configs[tab] ?? configs[0];
  const showTabs = configs.length > 1;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 p-4"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl max-w-[440px] w-full overflow-hidden shadow-xl"
        onClick={e => e.stopPropagation()}
      >
        {/* ── Header ── */}
        <div className="bg-[#1a2e3b] px-6 py-5 relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-white/50 hover:text-white bg-transparent border-none cursor-pointer text-xl leading-none"
            aria-label="Close"
          >
            &times;
          </button>
          <h3 className="text-[20px] font-bold text-white mb-1">Try it yourself</h3>
          <p className="text-[13px] text-white/60">
            Call from your phone — hear it answer, qualify the lead, and book a job.
          </p>
        </div>

        {/* ── Tabs (homepage only) ── */}
        {showTabs && (
          <div className="flex border-b border-[#e5e0da]">
            {configs.map((c, i) => (
              <button
                key={i}
                onClick={() => setTab(i)}
                className={`flex-1 py-3 text-[13px] font-semibold transition-colors cursor-pointer border-none ${
                  tab === i
                    ? 'text-[#e8930c] border-b-2 border-[#e8930c] bg-white'
                    : 'text-[#94a7b8] bg-[#faf9f7]'
                }`}
              >
                {c.label}
              </button>
            ))}
          </div>
        )}

        <div className="p-6">
          {/* ── Phone number ── */}
          <div className="text-center mb-5">
            <a
              href={`tel:${d.tel}`}
              className="text-[28px] font-bold text-[#1a2e3b] no-underline hover:text-[#e8930c] transition-colors"
            >
              {d.phone}
            </a>
            <p className="text-[12px] text-[#94a7b8] mt-1">Tap to call · standard call rates apply</p>
          </div>

          {/* ── Test addresses ── */}
          <div className="bg-[#faf9f7] rounded-xl p-4 mb-4">
            <p className="text-[12px] font-semibold text-[#5a7184] mb-2">Use a test address:</p>
            <div className="space-y-1.5">
              {d.addresses.map((a, i) => (
                <p key={i} className="text-[13px] text-[#2a4a5e]">{a}</p>
              ))}
            </div>
          </div>

          {/* ── What to try ── */}
          <div className="bg-[#eef9f0] rounded-xl p-4">
            <p className="text-[12px] font-semibold text-[#059669] mb-1">What to try:</p>
            <p className="text-[13px] text-[#2a4a5e]">{d.whatToTry}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
