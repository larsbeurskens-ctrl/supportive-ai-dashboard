'use client';
import { useState } from 'react';
import Link from 'next/link';

export default function MissedCallsCalculator() {
  const [missed, setMissed] = useState(3);
  const [jobVal, setJobVal] = useState(250);
  const [conv, setConv] = useState(50);
  const lostMonth = missed * 4 * jobVal * (conv / 100);
  const lostYear = lostMonth * 12;
  const roi = Math.round(lostMonth / 69);

  const Slider = ({ label, value, onChange, min, max, step, fmt }: { label: string; value: number; onChange: (v: number) => void; min: number; max: number; step: number; fmt: string }) => (
    <div>
      <div className="flex justify-between mb-2">
        <label className="text-[14px] font-semibold text-[#1a2e3b]">{label}</label>
        <span className="text-[16px] font-extrabold text-[#e8930c]">{fmt}</span>
      </div>
      <input type="range" min={min} max={max} step={step} value={value} onChange={e => onChange(Number(e.target.value))}
        className="w-full h-2 bg-[#e5e0da] rounded-full appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:h-5 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-[#e8930c]" />
    </div>
  );

  return (
    <>
      <section className="pt-16 pb-6 px-6 md:px-10 max-w-[820px] mx-auto text-center">
        <p className="text-[13px] font-semibold text-[#dc2626] uppercase tracking-wider mb-3">Free calculator</p>
        <h1 className="text-[36px] md:text-[44px] font-extrabold text-[#1a2e3b] leading-[1.15] mb-5 tracking-tight">How much are missed calls costing your business?</h1>
        <p className="text-lg text-[#5a7184] leading-relaxed max-w-[580px] mx-auto">Most trade businesses lose thousands every month to calls they cannot answer. See what it is really costing you.</p>
      </section>

      <section className="px-6 md:px-10 pb-14">
        <div className="max-w-[600px] mx-auto bg-white rounded-2xl border border-[#e5e0da] overflow-hidden shadow-sm">
          <div className="px-6 py-5 bg-[#1a2e3b]">
            <h2 className="text-[20px] font-bold text-white">Your missed call cost</h2>
            <p className="text-[13px] text-white/60">Adjust the sliders to match your business</p>
          </div>
          <div className="px-6 py-6 space-y-6">
            <Slider label="Missed calls per week" value={missed} onChange={setMissed} min={1} max={20} step={1} fmt={String(missed)} />
            <Slider label="Average job value" value={jobVal} onChange={setJobVal} min={50} max={1000} step={25} fmt={`£${jobVal}`} />
            <Slider label="Conversion rate" value={conv} onChange={setConv} min={10} max={80} step={5} fmt={`${conv}%`} />
          </div>
          <div className="px-6 py-6 bg-[#fef2f2] border-t border-[#fecaca]">
            <div className="grid grid-cols-2 gap-4 mb-2">
              <div><p className="text-[12px] text-[#dc2626] font-semibold uppercase tracking-wider">Lost per month</p><p className="text-[28px] font-extrabold text-[#dc2626]">£{lostMonth.toLocaleString()}</p></div>
              <div><p className="text-[12px] text-[#dc2626] font-semibold uppercase tracking-wider">Lost per year</p><p className="text-[28px] font-extrabold text-[#dc2626]">£{lostYear.toLocaleString()}</p></div>
            </div>
          </div>
          <div className="px-6 py-6 bg-[#f0fdf4] border-t border-[#bbf7d0]">
            <div className="flex items-center justify-between mb-3">
              <div><p className="text-[12px] text-[#059669] font-semibold uppercase tracking-wider">Supportive AI cost</p><p className="text-[28px] font-extrabold text-[#059669]">£69/month</p></div>
              <div className="text-right"><p className="text-[12px] text-[#059669] font-semibold uppercase tracking-wider">Your ROI</p><p className="text-[28px] font-extrabold text-[#059669]">{roi}x return</p></div>
            </div>
            <Link href="/onboarding" className="block text-center bg-[#e8930c] text-white px-6 py-3.5 rounded-xl text-[16px] font-bold no-underline hover:bg-[#d17f00] transition-colors shadow-[0_2px_8px_rgba(232,147,12,0.3)]">Stop the bleeding - start your free trial</Link>
          </div>
        </div>
      </section>

      <section className="py-14 px-6 md:px-10 bg-white border-t border-b border-[#e5e0da]">
        <div className="max-w-[820px] mx-auto">
          <h2 className="text-[26px] font-bold text-[#1a2e3b] mb-6 text-center">The numbers behind missed calls</h2>
          <div className="grid sm:grid-cols-3 gap-5">
            {[
              { stat: '80%', desc: 'of callers will not leave a voicemail if you do not answer' },
              { stat: '67%', desc: 'of customers hang up when they reach a voicemail greeting' },
              { stat: '85%', desc: 'of people who cannot reach you on the first try will not call back' },
            ].map((item, i) => (
              <div key={i} className="text-center px-4 py-6 bg-[#faf9f7] rounded-xl border border-[#e5e0da]">
                <p className="text-[36px] font-extrabold text-[#dc2626] mb-2">{item.stat}</p>
                <p className="text-[13px] text-[#5a7184] leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-14 px-6 md:px-10 text-center">
        <div className="max-w-lg mx-auto">
          <h2 className="text-[26px] font-extrabold text-[#1a2e3b] mb-3">One missed job pays for a full year</h2>
          <p className="text-[16px] text-[#5a7184] mb-8">At £69/month, one extra booking per month gives you a positive return. Most businesses get three to five.</p>
          <Link href="/onboarding" className="inline-block bg-[#e8930c] text-white px-8 py-4 rounded-xl text-[17px] font-bold no-underline hover:bg-[#d17f00] transition-colors shadow-[0_2px_8px_rgba(232,147,12,0.3)]">Start Your Free Trial</Link>
          <p className="text-[13px] text-[#94a7b8] mt-4">7 days free · No credit card needed</p>
        </div>
      </section>
    </>
  );
}
