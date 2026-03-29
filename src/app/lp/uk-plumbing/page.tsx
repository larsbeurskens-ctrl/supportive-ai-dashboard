'use client';

import { useState, useRef } from 'react';
import Link from 'next/link';
import { DemoOverlay } from '@/components/marketing/DemoOverlay';
import { GetCalledNow } from '@/components/marketing/GetCalledNow';

const DEMO_CONFIG = {
  label: 'UK Plumbing Demo',
  phone: '07427 846 243',
  tel: '+447427846243',
  addresses: ['2 Anerley Park Mansions, SE20 8NE', '14 Lavender Hill, SW11 3RB', '9 Japan Crescent, N4 4BB'],
  whatToTry: 'Report a leaky tap, ask about pricing and the call-out fee, or try booking a job. Mention a London postcode like SE20 8NE.',
};

const HERO_RECORDING = {
  id: 'hero-booking',
  src: '/audio/demo-call-uk-bob-booking.m4a',
  scenario: 'Customer books a plumbing job - full call',
  bubbles: [
    { role: 'ai' as const, text: "Hello, thank you for calling London Plumbing Services! This is Sarah. How can I help you today?" },
    { role: 'customer' as const, text: "Hi Sarah, this is Bob. My tap upstairs in the bathroom is leaking." },
    { role: 'ai' as const, text: "Hi Bob! A leaky tap in the upstairs bathroom - what's the postcode there?" },
    { role: 'customer' as const, text: "SE20 8NE. Two Emily Park Mansions." },
    { role: 'ai' as const, text: "On Thursday we've got 11 AM, 12 PM, and 1 PM. Which works best?" },
    { role: 'customer' as const, text: "One PM." },
    { role: 'ai' as const, text: "You're all set for Thursday at 1 PM! There's a £65 call-out fee, but if you go ahead with the repair, that comes off the final bill. No surprises." },
  ],
};

const SECOND_RECORDING = {
  id: 'pricing-call',
  src: '/audio/demo-call-uk-robert-pricing.m4a',
  scenario: 'Customer asks about pricing and call-out fees',
  bubbles: [
    { role: 'ai' as const, text: "Hello, thank you for calling London Plumbing Services! This is Sarah. How can I help you today?" },
    { role: 'customer' as const, text: "Hi, this is Robert. I have a question about your pricing and services." },
    { role: 'ai' as const, text: "Our call-out fee is £65. A leaky tap runs £80 to £150, blocked drains £80 to £200, boiler repairs £150 to £400." },
    { role: 'customer' as const, text: "Is the call-out fee on top of the repair cost?" },
    { role: 'ai' as const, text: "No - if you go ahead with the repair, the £65 comes off the final bill. So you're not paying extra." },
    { role: 'customer' as const, text: "That would be great. Thank you so much." },
  ],
};

function fmtTime(s: number) { const m = Math.floor(s / 60); return `${m}:${String(Math.floor(s % 60)).padStart(2, '0')}`; }

export default function UKPlumbingLandingPage() {
  const [showDemo, setShowDemo] = useState(false);
  const [playing, setPlaying] = useState<string | null>(null);
  const [progress, setProgress] = useState<Record<string, number>>({});
  const [durations, setDurations] = useState<Record<string, number>>({});
  const audioRefs = useRef<Record<string, HTMLAudioElement>>({});

  function togglePlay(id: string, src: string) {
    const existing = audioRefs.current[id];
    if (playing === id && existing) { existing.pause(); setPlaying(null); return; }
    Object.entries(audioRefs.current).forEach(([k, el]) => { if (k !== id) el.pause(); });
    if (!existing) {
      const audio = new Audio(src);
      audio.addEventListener('timeupdate', () => setProgress(p => ({ ...p, [id]: audio.currentTime / (audio.duration || 1) * 100 })));
      audio.addEventListener('loadedmetadata', () => setDurations(d => ({ ...d, [id]: audio.duration })));
      audio.addEventListener('ended', () => { setPlaying(null); setProgress(p => ({ ...p, [id]: 0 })); });
      audioRefs.current[id] = audio;
    }
    audioRefs.current[id].play(); setPlaying(id);
  }

  function seekAudio(id: string, e: React.MouseEvent<HTMLDivElement>) {
    const audio = audioRefs.current[id];
    if (!audio) return;
    const rect = e.currentTarget.getBoundingClientRect();
    audio.currentTime = ((e.clientX - rect.left) / rect.width) * audio.duration;
  }

  function RecordingCard({ rec }: { rec: typeof HERO_RECORDING }) {
    return (
      <div className="bg-white rounded-2xl border border-[#e5e0da] overflow-hidden">
        <div className="px-5 py-3.5 bg-[#faf9f7] border-b border-[#e5e0da] flex items-center justify-between gap-3">
          <div className="min-w-0">
            <span className="text-[12px] font-bold text-[#e8930c] uppercase tracking-wide">Plumbing</span>
            <p className="text-[13px] font-semibold text-[#1a2e3b] truncate">{rec.scenario}</p>
          </div>
          <span className="flex-shrink-0 whitespace-nowrap text-[11px] font-semibold text-white bg-[#059669] px-2 py-0.5 rounded-full">Real call</span>
        </div>
        <div className="relative cursor-pointer" onClick={() => { if (playing !== rec.id) togglePlay(rec.id, rec.src); }}>
          <div className="p-4 space-y-3 max-h-[280px] overflow-y-auto">
            {rec.bubbles.map((b, j) => (
              <div key={j} className={`flex ${b.role === 'customer' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[85%] px-3.5 py-2.5 rounded-2xl text-[13px] leading-relaxed ${
                  b.role === 'customer' ? 'bg-[#1a2e3b] text-white rounded-br-md' : 'bg-[#f0eeeb] text-[#1a2e3b] rounded-bl-md'
                }`}>{b.text}</div>
              </div>
            ))}
          </div>
          {playing !== rec.id && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/20 transition-opacity hover:bg-black/30">
              <div className="w-16 h-16 rounded-full bg-[#e8930c] flex items-center justify-center shadow-lg">
                <svg width="28" height="28" viewBox="0 0 24 24" fill="white"><polygon points="6 3 20 12 6 21 6 3"/></svg>
              </div>
            </div>
          )}
        </div>
        <div className="px-4 pb-4">
          <div className="flex items-center gap-3 bg-[#faf9f7] rounded-xl px-4 py-3 border border-[#e5e0da]">
            <button onClick={() => togglePlay(rec.id, rec.src)}
              className="w-8 h-8 rounded-full bg-[#e8930c] hover:bg-[#d17f00] flex items-center justify-center flex-shrink-0 cursor-pointer border-none transition-colors">
              {playing === rec.id
                ? <svg width="12" height="14" viewBox="0 0 12 14" fill="white"><rect x="1" y="1" width="3" height="12" rx="1"/><rect x="8" y="1" width="3" height="12" rx="1"/></svg>
                : <svg width="14" height="14" viewBox="0 0 24 24" fill="white"><polygon points="5 3 19 12 5 21 5 3"/></svg>}
            </button>
            <div className="flex-1 h-1.5 bg-[#e5e0da] rounded-full cursor-pointer" onClick={e => seekAudio(rec.id, e)}>
              <div className="h-full bg-[#e8930c] rounded-full transition-all" style={{ width: `${progress[rec.id] || 0}%` }} />
            </div>
            <span className="text-[11px] text-[#94a7b8] font-mono min-w-[32px]">
              {durations[rec.id] ? fmtTime(playing === rec.id ? (progress[rec.id] || 0) / 100 * durations[rec.id] : durations[rec.id]) : '--:--'}
            </span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      {showDemo && <DemoOverlay onClose={() => setShowDemo(false)} configs={[DEMO_CONFIG]} />}

      {/* Sticky header */}
      <div className="sticky top-0 z-50 bg-white/90 backdrop-blur-sm border-b border-[#e5e0da]">
        <div className="max-w-[820px] mx-auto px-5 py-3 flex items-center justify-between">
          <span className="text-[15px] font-bold text-[#1a2e3b]">Supportive AI</span>
          <Link href="/onboarding"
            className="bg-[#e8930c] text-white px-4 py-2 rounded-lg text-[13px] font-semibold no-underline hover:bg-[#d17f00] transition-colors">
            Start Your Free Trial
          </Link>
        </div>
      </div>

      {/* === HERO === */}
      <section className="pt-12 pb-4 px-6 md:px-10 max-w-[820px] mx-auto text-center">
        <p className="text-[13px] font-semibold text-[#e8930c] uppercase tracking-wider mb-3">Built for UK plumbers</p>
        <h1 className="text-[32px] sm:text-[42px] leading-[1.1] font-extrabold text-[#1a2e3b] mb-5">
          Never miss another plumbing job because you couldn&apos;t answer the phone
        </h1>
        <p className="text-[17px] sm:text-[19px] text-[#5a7184] leading-relaxed mb-8 max-w-xl mx-auto">
          When you can&apos;t pick up, every call still gets answered - so you stop losing jobs to voicemail.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center mb-4">
          <Link href="/onboarding"
            className="bg-[#e8930c] text-white px-8 py-[15px] rounded-lg text-base font-bold no-underline hover:bg-[#d17f00] transition-colors shadow-[0_2px_8px_rgba(232,147,12,0.3)] flex items-center justify-center">
            Start Your Free Trial
          </Link>
          <button onClick={() => setShowDemo(true)}
            className="bg-white text-[#1a2e3b] px-8 py-[15px] rounded-lg text-base font-semibold border border-[#d1ccc6] hover:bg-[#f0eeeb] transition-colors flex items-center justify-center gap-2 cursor-pointer">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#1a2e3b" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
            Call the Live Demo
          </button>
        </div>
        <p className="text-[13px] text-[#94a7b8] mb-10">From £69/month · No setup fee · Cancel anytime</p>
      </section>

      {/* === HERO RECORDING === */}
      <section className="px-6 md:px-10 pb-14 max-w-[600px] mx-auto">
        <div className="text-center mb-4">
          <p className="text-[14px] text-[#5a7184]">Press play - this is a real, unscripted call.</p>
        </div>
        <RecordingCard rec={HERO_RECORDING} />
      </section>

      {/* === PAIN SECTION === */}
      <section className="px-6 md:px-10 py-12 bg-white border-y border-[#e5e0da]">
        <div className="max-w-[820px] mx-auto">
          <h2 className="text-[24px] sm:text-[28px] font-extrabold text-[#1a2e3b] mb-4">Miss the call, lose the job</h2>
          <div className="text-[16px] text-[#5a7184] leading-relaxed space-y-4">
            <p>Most customers don&apos;t wait around. If they can&apos;t get through, they call the next plumber on the list.</p>
            <p>When you&apos;re under a sink, driving between jobs, with a customer, or off for the evening - you can&apos;t always pick up. That doesn&apos;t mean you should lose the work.</p>
            <p className="text-[#1a2e3b] font-semibold">Every call gets answered, so new enquiries don&apos;t slip through the cracks.</p>
          </div>
        </div>
      </section>

      {/* === WHAT IT DOES === */}
      <section className="px-6 md:px-10 py-12">
        <div className="max-w-[820px] mx-auto">
          <h2 className="text-[24px] sm:text-[28px] font-extrabold text-[#1a2e3b] mb-6">What it does for you</h2>
          <div className="grid sm:grid-cols-2 gap-4">
            {[
              { icon: '📞', title: "Picks up when you can't", desc: "On the tools, driving, with family - calls still get handled professionally." },
              { icon: '📅', title: 'Books jobs into your calendar', desc: "No double-bookings. Customers pick a slot and it goes straight into your diary." },
              { icon: '💬', title: 'Texts you and the customer', desc: "You get a notification. They get a confirmation. Everyone knows what's happening." },
              { icon: '💰', title: 'Handles pricing questions', desc: "Answers call-out fees, ballpark costs, and service area - so you don't have to call back." },
              { icon: '🌙', title: 'Works nights, weekends, bank holidays', desc: "Customers call at 9pm on a Sunday. The call still gets answered." },
              { icon: '🔁', title: 'Keeps your existing number', desc: "No new number needed. Just forward your calls when you're busy." },
            ].map((item, i) => (
              <div key={i} className="bg-[#faf9f7] rounded-xl px-5 py-4 border border-[#e5e0da]">
                <span className="text-[20px]">{item.icon}</span>
                <h3 className="text-[15px] font-bold text-[#1a2e3b] mt-2 mb-1">{item.title}</h3>
                <p className="text-[13px] text-[#5a7184] leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* === HOW IT WORKS === */}
      <section className="px-6 md:px-10 py-12 bg-white border-y border-[#e5e0da]">
        <div className="max-w-[820px] mx-auto">
          <h2 className="text-[24px] sm:text-[28px] font-extrabold text-[#1a2e3b] mb-2">Simple for you. Easy for your customers.</h2>
          <p className="text-[15px] text-[#5a7184] mb-8">No apps to install. No complicated setup.</p>
          <div className="space-y-6">
            {[
              { step: '1', title: 'Customer calls your number', desc: "They phone your business as normal - nothing changes for them." },
              { step: '2', title: 'Call gets answered instantly', desc: "If you can't pick up, it answers, speaks naturally, gathers the right details, and books the job." },
              { step: '3', title: 'You get a text, they get a confirmation', desc: 'You stay focused on the work in front of you. The call is handled professionally.' },
            ].map((s, i) => (
              <div key={i} className="flex gap-4 items-start">
                <div className="w-10 h-10 rounded-full bg-[#1a2e3b] text-white flex items-center justify-center text-[16px] font-bold flex-shrink-0">{s.step}</div>
                <div>
                  <h3 className="text-[16px] font-bold text-[#1a2e3b] mb-1">{s.title}</h3>
                  <p className="text-[14px] text-[#5a7184] leading-relaxed">{s.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* === SECOND RECORDING === */}
      <section className="px-6 md:px-10 py-12">
        <div className="max-w-[600px] mx-auto">
          <div className="text-center mb-4">
            <h2 className="text-[22px] font-bold text-[#1a2e3b] mb-1">Another real call</h2>
            <p className="text-[14px] text-[#5a7184]">A customer asks about pricing - hear how it handles it.</p>
          </div>
          <RecordingCard rec={SECOND_RECORDING} />
        </div>
      </section>

      {/* === OBJECTION HANDLING === */}
      <section className="px-6 md:px-10 py-12 bg-white border-y border-[#e5e0da]">
        <div className="max-w-[820px] mx-auto">
          <h2 className="text-[24px] sm:text-[28px] font-extrabold text-[#1a2e3b] mb-6">Built for the way plumbing businesses actually work</h2>
          <div className="grid sm:grid-cols-2 gap-5">
            {[
              { q: 'Do I need to change my number?', a: "No. Keep using your existing business number. Just forward calls when you're busy." },
              { q: "What if I'm busy or off for the day?", a: "That's exactly when it works. On the tools, driving, with family, closed for the evening - calls still get handled." },
              { q: 'Will customers know it\'s not a person?', a: "It sounds natural and professional. Most callers don't notice - they just get a smooth experience instead of voicemail." },
              { q: 'Is it hard to set up?', a: "Takes a few minutes. We set up a version for your business so you can hear exactly how it sounds before going live." },
            ].map((item, i) => (
              <div key={i} className="bg-[#faf9f7] rounded-xl px-5 py-4 border border-[#e5e0da]">
                <h3 className="text-[14px] font-bold text-[#1a2e3b] mb-2">{item.q}</h3>
                <p className="text-[13px] text-[#5a7184] leading-relaxed">{item.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* === GET CALLED NOW === */}
      <section className="px-6 md:px-10 py-12">
        <div className="max-w-[500px] mx-auto">
          <GetCalledNow variant="dark" />
        </div>
      </section>

      {/* === FINAL CTA === */}
      <section className="px-6 md:px-10 py-14 text-center">
        <div className="max-w-lg mx-auto">
          <h2 className="text-[24px] sm:text-[30px] font-extrabold text-[#1a2e3b] mb-3">
            Want to hear how this would sound for your plumbing business?
          </h2>
          <p className="text-[16px] text-[#5a7184] mb-8">
            We&apos;ll set up a free version tailored to your business so you can test it before going live.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center mb-4">
            <Link href="/onboarding"
              className="bg-[#e8930c] text-white px-8 py-4 rounded-xl text-[17px] font-bold no-underline hover:bg-[#d17f00] transition-colors shadow-[0_2px_8px_rgba(232,147,12,0.3)]">
              Start Your Free Trial
            </Link>
            <button onClick={() => setShowDemo(true)}
              className="bg-white text-[#1a2e3b] px-8 py-4 rounded-xl text-[17px] font-bold border-2 border-[#1a2e3b] hover:bg-[#1a2e3b] hover:text-white transition-colors cursor-pointer">
              Call the Live Demo
            </button>
          </div>
          <p className="text-[13px] text-[#94a7b8]">From £69/month · No setup fee · Cancel anytime</p>
        </div>
      </section>

      {/* === FOOTER === */}
      <footer className="px-5 py-6 border-t border-[#e5e0da] bg-white">
        <div className="max-w-[820px] mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="text-[13px] font-semibold text-[#1a2e3b]">Supportive AI</span>
            <span className="text-[12px] text-[#94a7b8]">· Built for UK trade businesses</span>
          </div>
          <div className="flex items-center gap-4">
            <a href="https://supportive-ai.com/privacy" className="text-[12px] text-[#94a7b8] hover:text-[#1a2e3b] no-underline">Privacy</a>
            <a href="https://supportive-ai.com/terms" className="text-[12px] text-[#94a7b8] hover:text-[#1a2e3b] no-underline">Terms</a>
            <a href="mailto:lars@supportive-ai.com" className="text-[12px] text-[#94a7b8] hover:text-[#1a2e3b] no-underline">Contact</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
