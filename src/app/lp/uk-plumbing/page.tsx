'use client';

import { useState, useRef } from 'react';
import { Metadata } from 'next';
import Link from 'next/link';

const DEMO_PHONE = '+447427846243';
const DEMO_PHONE_DISPLAY = '07427 846 243';
const DEMO_RECORDING = '/audio/demo-call-uk-bob-booking.m4a';
const PRICING_RECORDING = '/audio/demo-call-uk-robert-pricing.m4a';

export default function UKPlumbingLandingPage() {
  const [playing, setPlaying] = useState<string | null>(null);
  const [progress, setProgress] = useState<Record<string, number>>({});
  const [durations, setDurations] = useState<Record<string, number>>({});
  const audioRefs = useRef<Record<string, HTMLAudioElement>>({});

  function togglePlay(id: string, src: string) {
    const existing = audioRefs.current[id];
    if (playing === id && existing) {
      existing.pause(); setPlaying(null); return;
    }
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

  function fmt(s: number) { const m = Math.floor(s/60); return `${m}:${String(Math.floor(s%60)).padStart(2,'0')}`; }

  const scrollTo = (id: string) => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });

  function AudioPlayer({ id, src, label }: { id: string; src: string; label: string }) {
    const isPlaying = playing === id;
    const pct = progress[id] || 0;
    const dur = durations[id];
    return (
      <div className="bg-white rounded-2xl border border-[#e5e0da] overflow-hidden shadow-sm">
        <div className="px-5 py-3 bg-[#faf9f7] border-b border-[#e5e0da] flex items-center justify-between">
          <div>
            <span className="text-[11px] font-bold text-[#059669] uppercase tracking-wider">Real call recording</span>
            <p className="text-[13px] font-semibold text-[#1a2e3b]">{label}</p>
          </div>
          <span className="text-[10px] font-semibold text-white bg-[#059669] px-2 py-0.5 rounded-full">Not scripted</span>
        </div>
        <div className="px-5 py-4 flex items-center gap-4">
          <button onClick={() => togglePlay(id, src)}
            className={`w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0 border-none cursor-pointer transition-all ${isPlaying ? 'bg-[#1a2e3b]' : 'bg-[#e8930c] hover:bg-[#d17f00]'}`}>
            {isPlaying
              ? <svg width="16" height="16" viewBox="0 0 16 16" fill="white"><rect x="3" y="2" width="4" height="12" rx="1"/><rect x="9" y="2" width="4" height="12" rx="1"/></svg>
              : <svg width="16" height="16" viewBox="0 0 16 16" fill="white"><path d="M4 2l10 6-10 6V2z"/></svg>}
          </button>
          <div className="flex-1">
            <div className="h-2 bg-[#e5e0da] rounded-full cursor-pointer overflow-hidden" onClick={e => seekAudio(id, e)}>
              <div className="h-full bg-[#e8930c] rounded-full transition-all" style={{ width: `${pct}%` }} />
            </div>
            {dur && <p className="text-[11px] text-[#94a7b8] mt-1">{fmt((pct/100)*dur)} / {fmt(dur)}</p>}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      {/* Sticky header - minimal, just logo + CTA */}
      <div className="sticky top-0 z-50 bg-white/90 backdrop-blur-sm border-b border-[#e5e0da]">
        <div className="max-w-3xl mx-auto px-5 py-3 flex items-center justify-between">
          <span className="text-[15px] font-bold text-[#1a2e3b]">Supportive AI</span>
          <button onClick={() => scrollTo('demo')}
            className="bg-[#e8930c] text-white px-4 py-2 rounded-lg text-[13px] font-semibold border-none cursor-pointer hover:bg-[#d17f00] transition-colors">
            Hear it in action
          </button>
        </div>
      </div>

      {/* === HERO === */}
      <section className="px-5 pt-12 pb-8 max-w-3xl mx-auto">
        <p className="text-[13px] font-semibold text-[#e8930c] uppercase tracking-wider mb-3">Built for UK plumbers</p>
        <h1 className="text-[32px] sm:text-[42px] leading-[1.1] font-extrabold text-[#1a2e3b] mb-5">
          Never miss another plumbing job because you couldn&apos;t answer the phone
        </h1>
        <p className="text-[17px] sm:text-[19px] text-[#5a7184] leading-relaxed mb-8 max-w-xl">
          When a customer calls, it gets answered instantly, handles the enquiry, and books the job — even when you&apos;re on the tools, driving, or off the clock.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 mb-4">
          <button onClick={() => scrollTo('demo')}
            className="bg-[#e8930c] text-white px-6 py-3.5 rounded-xl text-[16px] font-bold border-none cursor-pointer hover:bg-[#d17f00] transition-colors shadow-lg shadow-[#e8930c]/20">
            🎧 Hear it in action
          </button>
          <a href={`tel:${DEMO_PHONE}`}
            className="bg-white text-[#1a2e3b] px-6 py-3.5 rounded-xl text-[16px] font-bold border-2 border-[#1a2e3b] no-underline text-center hover:bg-[#1a2e3b] hover:text-white transition-colors">
            📞 Call the demo line
          </a>
        </div>
        <p className="text-[13px] text-[#94a7b8]">Works with your current number. No setup fee. Cancel anytime.</p>
      </section>

      {/* === DEMO AUDIO === */}
      <section id="demo" className="px-5 py-10 bg-white border-y border-[#e5e0da]">
        <div className="max-w-3xl mx-auto">
          <p className="text-[13px] font-semibold text-[#e8930c] uppercase tracking-wider mb-2">Hear a real call</p>
          <h2 className="text-[24px] sm:text-[28px] font-extrabold text-[#1a2e3b] mb-2">
            This is what happens when a customer calls and you don&apos;t answer
          </h2>
          <p className="text-[15px] text-[#5a7184] mb-6">Instead of going to voicemail, the call gets handled for you. Press play — this is a real, unscripted call.</p>
          <div className="space-y-4">
            <AudioPlayer id="demo-booking" src={DEMO_RECORDING} label="Customer books a plumbing job — full call" />
            <AudioPlayer id="demo-pricing" src={PRICING_RECORDING} label="Customer asks about pricing and call-out fees" />
          </div>

          <div className="mt-6 bg-[#f0fdf4] border border-[#bbf7d0] rounded-xl px-5 py-4">
            <p className="text-[14px] text-[#166534] font-semibold mb-1">🎯 Try it yourself right now</p>
            <p className="text-[13px] text-[#166534]">
              Call <a href={`tel:${DEMO_PHONE}`} className="font-bold underline">{DEMO_PHONE_DISPLAY}</a> and pretend you need a plumber. 
              Report a leaky tap, ask about pricing, or try to book a job. It&apos;s a live demo.
            </p>
          </div>
        </div>
      </section>

      {/* === PAIN SECTION === */}
      <section className="px-5 py-12 max-w-3xl mx-auto">
        <h2 className="text-[24px] sm:text-[28px] font-extrabold text-[#1a2e3b] mb-4">Miss the call, lose the job</h2>
        <div className="text-[16px] text-[#5a7184] leading-relaxed space-y-4">
          <p>Most customers don&apos;t wait around. If they can&apos;t get through, they call the next plumber on the list.</p>
          <p>When you&apos;re under a sink, driving between jobs, with a customer, or off for the evening — you can&apos;t always pick up. That doesn&apos;t mean you should lose the work.</p>
          <p className="text-[#1a2e3b] font-semibold">Every call gets answered, so new enquiries don&apos;t slip through the cracks.</p>
        </div>
      </section>

      {/* === WHAT IT DOES === */}
      <section className="px-5 py-10 bg-white border-y border-[#e5e0da]">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-[24px] sm:text-[28px] font-extrabold text-[#1a2e3b] mb-6">What it does for you</h2>
          <div className="grid sm:grid-cols-2 gap-4">
            {[
              { icon: '📞', title: 'Picks up when you can\'t', desc: 'On the tools, driving, with family — calls still get handled professionally.' },
              { icon: '📅', title: 'Books jobs into your calendar', desc: 'No double-bookings. Customers pick a slot and it goes straight into your diary.' },
              { icon: '💬', title: 'Texts you and the customer', desc: 'You get a notification. They get a confirmation. Everyone knows what\'s happening.' },
              { icon: '💰', title: 'Handles pricing questions', desc: 'Answers call-out fees, ballpark costs, and service area — so you don\'t have to call back.' },
              { icon: '🌙', title: 'Works nights, weekends, bank holidays', desc: 'Customers call at 9pm on a Sunday. The call still gets answered.' },
              { icon: '🔁', title: 'Keeps your existing number', desc: 'No new number needed. Just forward your calls when you\'re busy.' },
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
      <section className="px-5 py-12 max-w-3xl mx-auto">
        <h2 className="text-[24px] sm:text-[28px] font-extrabold text-[#1a2e3b] mb-2">Simple for you. Easy for your customers.</h2>
        <p className="text-[15px] text-[#5a7184] mb-8">No apps to install. No complicated setup. Here&apos;s how it works:</p>
        <div className="space-y-6">
          {[
            { step: '1', title: 'Customer calls your number', desc: 'They phone your business as normal — nothing changes for them.' },
            { step: '2', title: 'Call gets answered instantly', desc: 'If you can\'t pick up, it answers, speaks naturally, gathers the right details, and books the job.' },
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
      </section>

      {/* === OBJECTION HANDLING === */}
      <section className="px-5 py-10 bg-white border-y border-[#e5e0da]">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-[24px] sm:text-[28px] font-extrabold text-[#1a2e3b] mb-6">Built for the way plumbing businesses actually work</h2>
          <div className="grid sm:grid-cols-2 gap-5">
            {[
              { q: 'Do I need to change my number?', a: 'No. Keep using your existing business number. Just forward calls when you\'re busy.' },
              { q: 'What if I\'m busy or off for the day?', a: 'That\'s exactly when it works. On the tools, driving, with family, closed for the evening — calls still get handled.' },
              { q: 'Will customers know it\'s not a person?', a: 'It sounds natural and professional. Most callers don\'t notice — they just get a smooth experience instead of voicemail.' },
              { q: 'Is it hard to set up?', a: 'It takes a few minutes. We set up a version for your business so you can hear exactly how it sounds before going live.' },
            ].map((item, i) => (
              <div key={i} className="bg-[#faf9f7] rounded-xl px-5 py-4 border border-[#e5e0da]">
                <h3 className="text-[14px] font-bold text-[#1a2e3b] mb-2">{item.q}</h3>
                <p className="text-[13px] text-[#5a7184] leading-relaxed">{item.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* === FINAL CTA === */}
      <section className="px-5 py-14 max-w-3xl mx-auto text-center">
        <h2 className="text-[24px] sm:text-[30px] font-extrabold text-[#1a2e3b] mb-3">
          Want to hear what this sounds like for your business?
        </h2>
        <p className="text-[16px] text-[#5a7184] mb-8 max-w-lg mx-auto">
          We&apos;ll set up a version tailored to your plumbing business, so you can hear exactly how it would handle your calls. Takes a few minutes.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center mb-6">
          <a href="https://supportive-ai.com/onboarding"
            className="bg-[#e8930c] text-white px-8 py-4 rounded-xl text-[17px] font-bold no-underline hover:bg-[#d17f00] transition-colors shadow-lg shadow-[#e8930c]/20">
            Hear it for your business
          </a>
          <a href={`tel:${DEMO_PHONE}`}
            className="bg-white text-[#1a2e3b] px-8 py-4 rounded-xl text-[17px] font-bold border-2 border-[#1a2e3b] no-underline hover:bg-[#1a2e3b] hover:text-white transition-colors">
            📞 {DEMO_PHONE_DISPLAY}
          </a>
        </div>
        <p className="text-[13px] text-[#94a7b8]">Plans from £69/month · No setup fee · Cancel anytime</p>
      </section>

      {/* === MINIMAL FOOTER === */}
      <footer className="px-5 py-6 border-t border-[#e5e0da] bg-white">
        <div className="max-w-3xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
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
