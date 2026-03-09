'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import {
  PhoneIcon, CalendarIcon, CheckIcon, BrainIcon,
  MapPinIcon, DollarIcon, ClockIcon, ShieldIcon,
  StarIcon, GoogleIcon, QuoteIcon,
} from './Icons';
import { LeadCaptureForm } from './LeadCaptureForm';
import { DemoOverlay } from './DemoOverlay';

const HOME_DEMO_CONFIGS = [
  {
    label: 'Window Cleaning',
    phone: '(845) 209-2401',
    tel: '+18452092401',
    addresses: [
      '12 Market Street, Poughkeepsie, NY 12601',
      '45 Oak Street, Newburgh, NY 12550',
      '8 River Road, Kingston, NY 12401',
    ],
    whatToTry: 'Book an exterior clean, ask about pricing for a 2-story colonial, or try rescheduling. Sarah handles it all.',
  },
  {
    label: 'Plumbing',
    phone: '(240) 301-1473',
    tel: '+12403011473',
    addresses: [
      '51 Market St, Poughkeepsie, NY 12601',
      '20 Margaret St, Poughkeepsie, NY 12601',
      '35 Market St, Poughkeepsie, NY 12601',
    ],
    whatToTry: 'Report an active leak, ask about a dripping faucet, or request a water heater quote. Try saying it\'s urgent.',
  },
];

export function HomePage() {
  const [showDemo, setShowDemo] = useState(false);
  const [playing, setPlaying] = useState<string | null>(null);
  const [progress, setProgress] = useState<Record<string, number>>({});
  const [durations, setDurations] = useState<Record<string, number>>({});
  const audioRefs = useRef<Record<string, HTMLAudioElement>>({});

  function togglePlay(id: string, src: string) {
    const existing = audioRefs.current[id];
    if (playing === id && existing) {
      existing.pause();
      setPlaying(null);
      return;
    }
    // Pause any other playing audio
    Object.entries(audioRefs.current).forEach(([k, el]) => { if (k !== id) el.pause(); });

    if (!existing) {
      const audio = new Audio(src);
      audio.addEventListener('timeupdate', () => setProgress(p => ({ ...p, [id]: audio.currentTime / (audio.duration || 1) * 100 })));
      audio.addEventListener('loadedmetadata', () => setDurations(d => ({ ...d, [id]: audio.duration })));
      audio.addEventListener('ended', () => { setPlaying(null); setProgress(p => ({ ...p, [id]: 0 })); });
      audioRefs.current[id] = audio;
    }
    audioRefs.current[id].play();
    setPlaying(id);
  }

  function seekAudio(id: string, e: React.MouseEvent<HTMLDivElement>) {
    const audio = audioRefs.current[id];
    if (!audio) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const pct = (e.clientX - rect.left) / rect.width;
    audio.currentTime = pct * audio.duration;
    setProgress(p => ({ ...p, [id]: pct * 100 }));
  }

  function fmtTime(s: number) { const m = Math.floor(s / 60); return `${m}:${String(Math.floor(s % 60)).padStart(2, '0')}`; }

  return (
    <>
      {showDemo && <DemoOverlay onClose={() => setShowDemo(false)} configs={HOME_DEMO_CONFIGS} defaultIndex={0} />}

      {/* ===== HERO ===== */}
      <section className="pt-16 pb-6 md:pt-20 md:pb-8 px-6 md:px-10 max-w-[860px] mx-auto text-center">
        <h1 className="text-[40px] md:text-[50px] font-extrabold text-[#1a2e3b] leading-[1.12] mb-5 tracking-[-1.5px]">
          Built for the trades that can&apos;t
          <br className="hidden md:block" /> afford to miss a call.
        </h1>
        <p className="text-lg md:text-[19px] text-[#5a7184] leading-relaxed max-w-[600px] mx-auto mb-9">
          Every missed call is a lost job. We answer your phone 24/7,
          book jobs into your live calendar, and send confirmations — so you stop
          losing customers and stop doing admin at night. Keep your existing number.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center mb-3">
          <Link
            href="/onboarding"
            className="bg-[#e8930c] text-white px-8 py-[15px] rounded-lg text-base font-bold no-underline hover:bg-[#d17f00] transition-colors shadow-[0_2px_8px_rgba(232,147,12,0.3)]"
          >
            Start Your Free Trial
          </Link>
          {/* Both mobile and desktop: open overlay */}
          <button
            onClick={() => setShowDemo(true)}
            className="bg-white text-[#1a2e3b] px-8 py-[15px] rounded-lg text-base font-semibold border border-[#d1ccc6] hover:bg-[#f0eeeb] transition-colors flex items-center justify-center gap-2 cursor-pointer"
          >
            <PhoneIcon size={18} /> Call our demo agent
          </button>
        </div>
        <p className="text-[13px] text-[#94a7b8]">7-day free trial · up to 50 calls · no credit card required.</p>
        <p className="text-[11px] text-[#b8c4ce] mt-1">Demo calls: standard call rates apply</p>
      </section>

      {/* ===== KEEP YOUR NUMBER ===== */}
      <section className="py-12 px-6 md:px-10 bg-[#faf9f7] border-t border-[#e5e0da]">
        <div className="max-w-[860px] mx-auto">
          <div className="flex flex-col md:flex-row items-center gap-8 md:gap-12">
            <div className="flex-shrink-0 w-full md:w-[280px]">
              <div className="bg-white rounded-2xl border border-[#e5e0da] p-6 text-center">
                <p className="text-[11px] font-semibold text-[#94a7b8] uppercase tracking-wider mb-2">Your number</p>
                <p className="text-[26px] font-extrabold text-[#1a2e3b] tracking-tight mb-1">281.398.1700</p>
                <p className="text-[12px] text-[#94a7b8] mb-4">on your van, your cards, your Google listing</p>
                <div className="flex items-center justify-center gap-2 bg-[#ecfdf5] rounded-lg py-2 px-4">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#059669" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg>
                  <p className="text-[13px] font-semibold text-[#059669]">Stays exactly the same</p>
                </div>
              </div>
            </div>
            <div className="flex-1">
              <h2 className="text-[28px] md:text-[30px] font-bold text-[#1a2e3b] mb-3 leading-tight">
                Keep your number.<br />You control everything.
              </h2>
              <p className="text-[15px] text-[#5a7184] leading-relaxed mb-5">
                Your number is on the van, the yard signs, the Google listing — you&apos;re not changing it.
                You decide when the AI picks up. You set your hours, your pricing, your service area. Configure it yourself in 5 minutes from your dashboard.
              </p>
              <div className="space-y-2.5">
                {[
                  { mode: 'After 4 rings', desc: 'You get first crack. AI catches what you miss.', dot: '#e8930c' },
                  { mode: 'After hours only', desc: 'You answer during the day. AI handles nights, weekends, holidays.', dot: '#3b82f6' },
                  { mode: 'Always on', desc: 'AI answers every call. Urgent ones get forwarded to you instantly.', dot: '#059669' },
                ].map((item, i) => (
                  <div key={i} className="flex items-start gap-3 p-3 rounded-xl bg-white border border-[#e5e0da]">
                    <span className="w-2.5 h-2.5 rounded-full mt-1.5 flex-shrink-0" style={{ backgroundColor: item.dot }} />
                    <div>
                      <span className="text-[14px] font-bold text-[#1a2e3b]">{item.mode}</span>
                      <span className="text-[13px] text-[#5a7184] ml-1.5">{item.desc}</span>
                    </div>
                  </div>
                ))}
              </div>
              <p className="text-[13px] text-[#94a7b8] mt-3">
                Set up call forwarding yourself — takes one short code from your phone. No tech needed.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ===== TRUST BAR — Google / integrations ===== */}
      <section className="py-5 border-t border-b border-[#e5e0da] bg-white">
        <div className="max-w-[860px] mx-auto px-6 md:px-10 flex flex-wrap justify-center items-center gap-6 md:gap-10">
          <div className="flex items-center gap-2">
            <GoogleIcon size={18} />
            <span className="text-sm font-semibold text-[#5a7184]">Google Calendar</span>
          </div>
          <span className="text-[#d1ccc6]">·</span>
          <div className="flex items-center gap-2">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="#635BFF"><path d="M13.976 9.15c-2.172-.806-3.356-1.426-3.356-2.409 0-.831.683-1.305 1.901-1.305 2.227 0 4.515.858 6.09 1.631l.89-5.494C18.252.975 15.697 0 12.165 0 9.667 0 7.589.654 6.104 1.872 4.56 3.147 3.757 4.992 3.757 7.218c0 4.039 2.467 5.76 6.476 7.219 2.585.92 3.445 1.574 3.445 2.583 0 .98-.84 1.545-2.354 1.545-1.875 0-4.965-.921-6.99-2.109l-.9 5.555C5.175 22.99 8.385 24 11.714 24c2.641 0 4.843-.624 6.328-1.813 1.664-1.305 2.525-3.236 2.525-5.732 0-4.128-2.524-5.851-6.591-7.305z"/></svg>
            <span className="text-sm font-semibold text-[#5a7184]">Stripe Payments</span>
          </div>
          <span className="text-[#d1ccc6]">·</span>
          <div className="flex items-center gap-2">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="#25D366"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
            <span className="text-sm font-semibold text-[#5a7184]">WhatsApp</span>
          </div>
          <span className="text-[#d1ccc6]">·</span>
          <div className="flex items-center gap-2">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="#F22F46"><path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm4.75 17.25h-3l-1.5-3.75h-.5v3.75h-2.5V6.75h4c2.21 0 3.75 1.29 3.75 3.38 0 1.53-.84 2.66-2.13 3.12l2.38 4z"/></svg>
            <span className="text-sm font-semibold text-[#5a7184]">Twilio Voice + SMS</span>
          </div>
        </div>
      </section>

      {/* ===== CAPABILITY CARDS ===== */}
      <section className="py-10 px-6 md:px-10 max-w-[860px] mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            {
              icon: <BrainIcon className="text-[#e8930c]" />,
              title: 'Trade-trained agents',
              desc: 'Every agent is trained on your specific trade — window cleaning, plumbing, HVAC. Asks the right qualifying questions. Handles objections.',
            },
            {
              icon: <MapPinIcon className="text-[#e8930c]" />,
              title: 'Location-smart scheduling',
              desc: 'Books appointments based on your existing route. Clusters nearby jobs together. Minimises drive time between appointments.',
            },
            {
              icon: <DollarIcon className="text-[#e8930c]" />,
              title: 'Invoice to payment in one tap',
              desc: 'Send a payment link after the job. Auto-reminders at 24h and 48h. Payments go directly to your Stripe account.',
            },
          ].map((c, i) => (
            <div key={i} className="bg-white rounded-xl p-6 border border-[#e5e0da]">
              <div className="mb-3.5">{c.icon}</div>
              <h3 className="text-base font-bold text-[#1a2e3b] mb-1.5">{c.title}</h3>
              <p className="text-sm text-[#5a7184] leading-relaxed">{c.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ===== WHATSAPP USP CALLOUT ===== */}
      <section className="py-8 px-6 md:px-10 max-w-[860px] mx-auto">
        <div className="bg-white rounded-2xl p-6 md:p-8 flex flex-col md:flex-row items-center gap-5 border border-[#e5e0da]">
          <div className="flex-shrink-0">
            <div className="w-12 h-12 rounded-full bg-[#25D366] flex items-center justify-center">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="white"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
            </div>
          </div>
          <div className="text-center md:text-left">
            <h3 className="text-[16px] font-bold text-[#1a2e3b] mb-1">WhatsApp AI agent included free</h3>
            <p className="text-[14px] text-[#5a7184] leading-relaxed">
              Customers can call <em>or</em> text. Same AI, same intelligence — in a chat. Included on every plan at no extra cost.
            </p>
          </div>
        </div>
      </section>

      {/* ===== HOW IT WORKS ===== */}
      <section id="how-it-works" className="py-16 px-6 md:px-10 max-w-[860px] mx-auto">
        <h2 className="text-[30px] font-bold text-[#1a2e3b] text-center mb-3">How it works</h2>
        <p className="text-[15px] text-[#5a7184] text-center mb-12">Live in under 5 minutes. No tech skills needed.</p>
        <div className="relative flex flex-col md:flex-row gap-8 md:gap-0">
          {/* Connecting line (desktop) */}
          <div className="hidden md:block absolute top-6 left-10 right-10 h-[2px] bg-[#d1ccc6] z-0" />
          {[
            { n: '1', title: 'Sign up & name your AI', desc: 'Create your account in 30 seconds. Pick a local area code. Your AI gets its own number.' },
            { n: '2', title: 'Add your business details', desc: 'Tell it your pricing, services, hours, and credentials. Takes 2 minutes. No tech skills needed.' },
            { n: '3', title: 'Test it with a real call', desc: 'Call your AI number and experience it yourself. Book a job, ask about pricing, try a reschedule. Happy? Go live.' },
            { n: '4', title: 'Forward your existing number', desc: 'Keep the number on your van, your cards, everywhere. One short code forwards missed calls to your AI. Done.' },
          ].map((s, i) => (
            <div key={i} className="flex-1 text-center relative z-[1]">
              <div className="w-12 h-12 rounded-full bg-[#1a2e3b] text-white flex items-center justify-center mx-auto mb-4 text-lg font-bold">
                {s.n}
              </div>
              <h3 className="text-sm font-bold text-[#1a2e3b] mb-1.5">{s.title}</h3>
              <p className="text-[13px] text-[#5a7184] leading-snug px-2">{s.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ===== HEAR IT IN ACTION — Real Call Recordings ===== */}
      <section id="hear-it" className="py-16 px-6 md:px-10" style={{ scrollMarginTop: '5rem' }}>
        <div className="max-w-[860px] mx-auto">
          <div className="text-center mb-10">
            <h2 className="text-[30px] font-bold text-[#1a2e3b] mb-2.5">Hear real conversations</h2>
            <p className="text-[15px] text-[#5a7184]">Actual calls handled by our AI agents. Unedited.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {[
              {
                id: 'wc-mike',
                src: '/audio/demo-call-wc-booking-mike.m4a',
                label: 'Window Cleaning',
                scenario: 'New booking — 2-story colonial',
                bubbles: [
                  { role: 'ai', text: "Hey there! Thanks for calling Clean Pro Window Washing, this is Sarah. How can I help you today?" },
                  { role: 'customer', text: "I'm interested in getting my two story colonial home washed, just the exterior windows only." },
                  { role: 'ai', text: "For a two-story exterior, every job is a little different, but typically you're looking at somewhere between $250 to $400." },
                  { role: 'customer', text: "That sounds great. It's 34 Elm Street in Poughkeepsie, 12601." },
                  { role: 'ai', text: "We have openings at 8 AM, 9 AM, and 10 AM. Would any of those work for you?" },
                  { role: 'customer', text: "Let's book it in for Friday at 10 AM." },
                  { role: 'ai', text: "You're all set for Friday, March 6th at 10 AM! You'll get a confirmation text shortly." },
                ],
              },
              {
                id: 'plumb-john',
                src: '/audio/demo-call-plumbing-emergency-john.m4a',
                label: 'Plumbing Emergency',
                scenario: 'Active leak — emergency escalation',
                bubbles: [
                  { role: 'ai', text: "Thank you for calling Hudson Valley Plumbing! This is Sarah. How can I help you today?" },
                  { role: 'customer', text: "I'm up to my ankle in water. I have a leaky faucet in the upstairs bathroom." },
                  { role: 'ai', text: "That sounds like it could be an emergency. Do you have water actively leaking or flooding right now?" },
                  { role: 'customer', text: "Yes, actively leaking and it's rising quickly." },
                  { role: 'ai', text: "Okay, I'm going to get someone out to you right away. First, I need your name please." },
                  { role: 'customer', text: "My name is John. I'm at 60 Market Street in Poughkeepsie." },
                  { role: 'ai', text: "I've escalated this as an emergency and our team will call you right back to get someone out there immediately. Stay safe, John." },
                ],
              },
            ].map((conv) => (
              <div key={conv.id} className="bg-white rounded-2xl border border-[#e5e0da] overflow-hidden">
                {/* Header */}
                <div className="px-5 py-3.5 bg-[#faf9f7] border-b border-[#e5e0da] flex items-center justify-between gap-3">
                  <div className="min-w-0">
                    <span className="text-[12px] font-bold text-[#e8930c] uppercase tracking-wide">{conv.label}</span>
                    <p className="text-[13px] font-semibold text-[#1a2e3b] truncate">{conv.scenario}</p>
                  </div>
                  <span className="flex-shrink-0 whitespace-nowrap text-[11px] font-semibold text-white bg-[#059669] px-2 py-0.5 rounded-full">Real call</span>
                </div>

                {/* Chat bubbles */}
                <div className="p-4 space-y-3 max-h-[320px] overflow-y-auto">
                  {conv.bubbles.map((b, j) => (
                    <div key={j} className={`flex ${b.role === 'customer' ? 'justify-end' : 'justify-start'}`}>
                      <div className={`max-w-[85%] px-3.5 py-2.5 rounded-2xl text-[13px] leading-relaxed ${
                        b.role === 'customer'
                          ? 'bg-[#1a2e3b] text-white rounded-br-md'
                          : 'bg-[#f0eeeb] text-[#1a2e3b] rounded-bl-md'
                      }`}>
                        {b.text}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Audio player */}
                <div className="px-4 pb-4">
                  <div className="flex items-center gap-3 bg-[#faf9f7] rounded-xl px-4 py-3 border border-[#e5e0da]">
                    <button
                      onClick={() => togglePlay(conv.id, conv.src)}
                      className="w-8 h-8 rounded-full bg-[#e8930c] hover:bg-[#d17f00] flex items-center justify-center flex-shrink-0 cursor-pointer border-none transition-colors"
                    >
                      {playing === conv.id ? (
                        <svg width="12" height="14" viewBox="0 0 12 14" fill="white"><rect x="1" y="1" width="3" height="12" rx="1"/><rect x="8" y="1" width="3" height="12" rx="1"/></svg>
                      ) : (
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="white"><polygon points="5 3 19 12 5 21 5 3"/></svg>
                      )}
                    </button>
                    <div className="flex-1 h-1.5 bg-[#e5e0da] rounded-full cursor-pointer" onClick={(e) => seekAudio(conv.id, e)}>
                      <div className="h-full bg-[#e8930c] rounded-full transition-all" style={{ width: `${progress[conv.id] || 0}%` }} />
                    </div>
                    <span className="text-[11px] text-[#94a7b8] font-mono min-w-[32px]">
                      {durations[conv.id] ? fmtTime(
                        playing === conv.id
                          ? (progress[conv.id] || 0) / 100 * durations[conv.id]
                          : durations[conv.id]
                      ) : '--:--'}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <p className="text-center text-[13px] text-[#94a7b8] mt-6">
            Real, unedited recordings from test calls — or{' '}
            <button onClick={() => setShowDemo(true)} className="text-[#1a2e3b] font-semibold hover:underline bg-transparent border-none cursor-pointer p-0 text-[13px]">call our demo agent</button>{' '}
            yourself to hear it live.
          </p>
        </div>
      </section>

      {/* ===== TESTIMONIALS — hidden for now ===== */}

      {/* ===== DEMO CALL CTA ===== */}
      <section className="py-16 px-6 md:px-10">
        <div className="max-w-[780px] mx-auto bg-[#1a2e3b] rounded-2xl p-10 md:p-12 text-center">
          <h2 className="text-[26px] font-bold text-white mb-2.5">Hear it in action</h2>
          <p className="text-[15px] text-[#b8c9d4] mb-6">
            Call our demo agents from your phone. Experience real AI-powered booking in 60 seconds.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            {/* Window cleaning */}
            <button onClick={() => setShowDemo(true)}
              className="inline-flex items-center gap-3 bg-[#243d4e] rounded-xl px-6 py-4 border border-[#35596e] hover:bg-[#2c4a5d] transition-colors cursor-pointer">
              <PhoneIcon size={20} className="text-[#e8930c]" />
              <div className="text-left">
                <span className="text-[18px] font-bold text-white">(845) 209-2401</span>
                <span className="block text-[11px] text-[#6b8fa3]">Window Cleaning</span>
              </div>
            </button>
            {/* Plumbing */}
            <button onClick={() => setShowDemo(true)}
              className="inline-flex items-center gap-3 bg-[#243d4e] rounded-xl px-6 py-4 border border-[#35596e] hover:bg-[#2c4a5d] transition-colors cursor-pointer">
              <PhoneIcon size={20} className="text-[#e8930c]" />
              <div className="text-left">
                <span className="text-[18px] font-bold text-white">(240) 301-1473</span>
                <span className="block text-[11px] text-[#6b8fa3]">Plumbing</span>
              </div>
            </button>
          </div>
          <p className="text-[11px] text-[#4a6a7d] mt-3">Standard call rates apply · no premium charges</p>
        </div>
      </section>

      {/* ===== WHY US ===== */}
      <section className="py-16 px-6 md:px-10 max-w-[860px] mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-[30px] font-bold text-[#1a2e3b] mb-2.5">
            Not another generic answering service
          </h2>
          <p className="text-base text-[#5a7184]">
            Purpose-built for home services. Every feature designed around how tradespeople actually work.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {[
            {
              icon: <BrainIcon className="text-[#e8930c]" />,
              title: 'Human-like AI, built to your business',
              desc: 'Your AI answers with your business name, knows your pricing, your services, your credentials. Customise the name, tone, and what it says — it sounds like part of your team, not a call centre.',
            },
            {
              icon: <MapPinIcon className="text-[#e8930c]" />,
              title: 'Route-optimised booking',
              desc: 'Knows where your crew is today. Suggests slots that cluster jobs by location. Reduces drive time between appointments.',
            },
            {
              icon: <ClockIcon className="text-[#e8930c]" />,
              title: '24/7 — no exceptions',
              desc: 'Evenings, weekends, holidays. Emergency calls at 2am get triaged and escalated. Every lead captured, no voicemail.',
            },
            {
              icon: <CalendarIcon className="text-[#e8930c]" />,
              title: 'Live calendar integration',
              desc: 'Reads your real Google Calendar availability. Books directly. No double-bookings. Sends SMS confirmations instantly.',
            },
            {
              icon: <DollarIcon className="text-[#e8930c]" />,
              title: 'Get paid faster',
              desc: 'One-tap invoicing. Secure Stripe payment links via SMS. Auto-reminders at 24h and 48h. Overdue flagging at 3 days.',
            },
            {
              icon: <ShieldIcon className="text-[#e8930c]" />,
              title: 'Direct-to-you payments',
              desc: 'Money goes straight to your bank via Stripe Connect. No middleman holding your funds. No delays.',
            },
          ].map((b, i) => (
            <div key={i} className="flex gap-4 p-6 rounded-xl border border-[#e5e0da] bg-white">
              <div className="flex-shrink-0 mt-0.5">{b.icon}</div>
              <div>
                <h3 className="text-[15px] font-bold text-[#1a2e3b] mb-1">{b.title}</h3>
                <p className="text-sm text-[#5a7184] leading-relaxed">{b.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ===== SETUP + TRIAL YOUR WAY ===== */}
      <section className="py-16 px-6 md:px-10 bg-white border-t border-[#e5e0da]">
        <div className="max-w-[860px] mx-auto">
          <div className="text-center mb-10">
            <h2 className="text-[30px] font-bold text-[#1a2e3b] mb-2">Live in 5 minutes, not 5 days</h2>
            <p className="text-[15px] text-[#5a7184]">Set it up yourself — or we&apos;ll walk you through it. Either way, it&apos;s fast.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* Self-serve setup */}
            <div className="rounded-xl border border-[#e5e0da] p-6">
              <h3 className="text-[17px] font-bold text-[#1a2e3b] mb-0.5">Set it up yourself</h3>
              <p className="text-[13px] text-[#5a7184] mb-5">Takes under 5 minutes</p>
              <div className="space-y-3">
                {[
                  { step: '1', text: 'Create your account (30 seconds)' },
                  { step: '2', text: 'Pick your local area code — get your AI number' },
                  { step: '3', text: 'Add your pricing, services & details (2 min)' },
                  { step: '4', text: 'Make a test call — hear it in action' },
                  { step: '5', text: 'Connect Google Calendar' },
                  { step: '6', text: 'Forward calls & go live' },
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <span className="w-6 h-6 rounded-full bg-[#1a2e3b] text-white text-[11px] font-bold flex items-center justify-center flex-shrink-0">{item.step}</span>
                    <span className="text-[14px] text-[#2a4a5e]">{item.text}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Guided setup */}
            <div className="rounded-xl border border-[#e5e0da] overflow-hidden">
              <div className="bg-[#e8930c] px-6 py-4">
                <h3 className="text-[17px] font-bold text-white">Need a hand? We&apos;re here.</h3>
                <p className="text-[13px] text-white/80 mt-0.5">Free 15-minute setup call</p>
              </div>
              <div className="p-6">
                <p className="text-[14px] text-[#5a7184] leading-relaxed mb-5">
                  Not sure about call forwarding or calendar setup? No worries — book a quick call and we&apos;ll walk you through it in 5 minutes.
                </p>
                {[
                  'We walk you through every step live',
                  'Test your AI with a real call together',
                  'Customise how and when it picks up',
                  'Answer any questions about your setup',
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-2.5 mb-2.5">
                    <CheckIcon size={15} className="text-[#059669] flex-shrink-0" />
                    <span className="text-[14px] text-[#2a4a5e]">{item}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Trial control */}
          <div className="mt-8 bg-[#faf9f7] rounded-xl border border-[#e5e0da] p-6">
            <h3 className="text-[15px] font-bold text-[#1a2e3b] mb-4 text-center">You control when the AI picks up</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {[
                { mode: 'After 4 rings', desc: 'AI catches what you miss. Most popular.' },
                { mode: 'After hours only', desc: 'AI handles evenings and weekends.' },
                { mode: 'Always on', desc: 'AI answers every call. You focus on work.' },
              ].map((item, i) => (
                <div key={i} className="flex items-start gap-3 p-3 rounded-lg bg-white border border-[#e5e0da]">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#e8930c] mt-2 flex-shrink-0" />
                  <div>
                    <span className="text-[13px] font-bold text-[#1a2e3b]">{item.mode}</span>
                    <span className="text-[13px] text-[#5a7184] ml-1.5">{item.desc}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ===== PRICING ===== */}
      <section id="pricing" className="py-16 px-6 md:px-10 bg-white border-t border-[#e5e0da]">
        <div className="max-w-[860px] mx-auto">
          <h2 className="text-[30px] font-bold text-[#1a2e3b] text-center mb-2">
            Simple, honest pricing
          </h2>
          <p className="text-[15px] text-[#5a7184] text-center mb-12">
            No hidden fees. No per-seat pricing. One price, everything included.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {[
              {
                name: 'Starter',
                price: 149,
                calls: '150 calls/mo',
                target: 'Solo operators',
                features: ['24/7 AI answering', 'Dashboard & call analytics', 'Route-optimised booking', 'Calendar + SMS confirmations', 'WhatsApp AI agent', 'Payment links', '1st line customer service'],
                note: '$1.50/call overage',
                popular: false,
              },
              {
                name: 'Pro',
                price: 299,
                calls: '500 calls/mo',
                target: 'Growing businesses',
                features: ['Everything in Starter', 'Multi-crew scheduling', 'Priority support', 'Review requests'],
                note: '$1.25/call overage',
                popular: true,
              },
              {
                name: 'Growth',
                price: 499,
                calls: 'Unlimited calls',
                target: 'Established teams',
                features: ['Everything in Pro', 'Unlimited calls', 'API access', 'Dedicated account manager', 'Custom-built features'],
                note: null,
                popular: false,
              },
            ].map((plan) => (
              <div
                key={plan.name}
                className={`p-7 rounded-xl relative ${
                  plan.popular
                    ? 'border-2 border-[#e8930c] bg-[#fffdf9]'
                    : 'border border-[#e5e0da] bg-white'
                }`}
              >
                {plan.popular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-[#e8930c] text-white px-4 py-1 rounded-full text-xs font-semibold">
                    Most popular
                  </div>
                )}
                <h3 className="text-xl font-bold text-[#1a2e3b] mb-1">{plan.name}</h3>
                <p className="text-[13px] text-[#5a7184] mb-4">{plan.target}</p>
                <div className="mb-1">
                  <span className="text-[40px] font-extrabold text-[#1a2e3b]">${plan.price}</span>
                  <span className="text-[15px] text-[#5a7184]">/mo</span>
                </div>
                <p className="text-[13px] text-[#e8930c] font-bold mb-1">{plan.calls}</p>
                {plan.note && <p className="text-[11px] text-[#94a7b8] mb-5">{plan.note}</p>}
                {!plan.note && <div className="mb-5" />}
                <ul className="space-y-2 mb-6">
                  {plan.features.map((f) => (
                    <li key={f} className="flex items-center gap-2 text-sm text-[#2a4a5e]">
                      <CheckIcon size={16} className="text-[#059669] flex-shrink-0" />
                      {f}
                    </li>
                  ))}
                </ul>
                <Link
                  href={plan.name === 'Growth' ? '/#contact' : '/onboarding'}
                  className={`block text-center py-3 rounded-lg text-sm font-semibold no-underline transition-colors ${
                    plan.popular
                      ? 'bg-[#e8930c] text-white hover:bg-[#d17f00] shadow-[0_2px_8px_rgba(232,147,12,0.25)]'
                      : 'bg-white text-[#1a2e3b] border border-[#d1ccc6] hover:bg-[#f0eeeb]'
                  }`}
                >
                  {plan.name === 'Growth' ? 'Contact us' : 'Start free trial'}
                </Link>
              </div>
            ))}
          </div>
          <p className="text-center text-[13px] text-[#94a7b8] mt-5">
            7-day free trial on all plans (up to 50 calls). No setup fees. Cancel anytime.
          </p>
          <div className="mt-4 mx-auto max-w-[540px] bg-[#f9f8f6] border border-[#e5e0da] rounded-lg px-5 py-3 text-center">
            <p className="text-[13px] text-[#2a4a5e]">
              <span className="font-semibold text-[#1a2e3b]">Go over your limit? No worries.</span>{' '}
              We keep answering your calls — you'll never miss a customer. Overage calls are billed at your plan rate at the end of the month. No surprises.
            </p>
          </div>
        </div>
      </section>

      {/* ===== LEAD CAPTURE ===== */}
      <section className="py-16 px-6 md:px-10 bg-[#faf9f7] border-t border-[#e5e0da]">
        <div className="max-w-[580px] mx-auto">
          <div className="text-center mb-8">
            <h2 className="text-[24px] font-bold text-[#1a2e3b] mb-2">
              Want to see exactly how it would work for your business?
            </h2>
            <p className="text-[15px] text-[#5a7184]">
              We&apos;ll send you a sample conversation, a breakdown of what it handles,
              and how to get it live in 5 minutes.
            </p>
          </div>
          <div className="bg-white rounded-2xl border border-[#e5e0da] p-6">
            <LeadCaptureForm />
          </div>
          <div className="flex justify-center gap-6 mt-6">
            {['7-day free trial', 'No credit card', 'Cancel anytime'].map((s, i) => (
              <div key={i} className="flex items-center gap-1.5">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#059669" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg>
                <span className="text-[13px] text-[#5a7184] font-medium">{s}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== SIGN UP MODULE ===== */}
      <section className="py-16 px-6 md:px-10 bg-[#faf9f7] border-t border-[#e5e0da]">
        <div className="max-w-[680px] mx-auto text-center">
          <h2 className="text-[28px] font-bold text-[#1a2e3b] mb-3">Start your free trial today</h2>
          <p className="text-[15px] text-[#5a7184] mb-8 max-w-[480px] mx-auto">
            Pick your area code, add your details, and you can be live in under 5 minutes.
          </p>
          <div className="bg-white rounded-2xl border border-[#e5e0da] p-8 text-left">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
              {[
                { value: '7 days', label: 'Free trial' },
                { value: '50 calls', label: 'Included free' },
                { value: '5 min', label: 'To go live' },
              ].map((s, i) => (
                <div key={i} className="text-center p-4 rounded-xl bg-[#faf9f7] border border-[#e5e0da]">
                  <div className="text-[24px] font-extrabold text-[#1a2e3b]">{s.value}</div>
                  <div className="text-[12px] text-[#5a7184] font-medium">{s.label}</div>
                </div>
              ))}
            </div>
            <div className="space-y-2.5 mb-6">
              {[
                'No credit card required to start',
                'Your own local phone number included',
                'Connects to Google Calendar in one click',
                'Cancel anytime — no contracts',
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-2.5">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#059669" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg>
                  <span className="text-[14px] text-[#2a4a5e]">{item}</span>
                </div>
              ))}
            </div>
            <Link
              href="/onboarding"
              className="block text-center bg-[#e8930c] text-white py-4 rounded-lg text-base font-bold no-underline hover:bg-[#d17f00] transition-colors shadow-[0_2px_8px_rgba(232,147,12,0.3)]"
            >
              Start free trial — no card needed
            </Link>
          </div>
        </div>
      </section>

      {/* ===== FINAL CTA ===== */}
      <section className="py-16 px-6 md:px-10">
        <div className="max-w-[680px] mx-auto text-center">
          <h2 className="text-[28px] font-bold text-[#1a2e3b] mb-3">
            Ready to stop missing calls?
          </h2>
          <p className="text-base text-[#5a7184] mb-8">
            Sign up, pick your area code, and you can be live
            <br className="hidden md:block" /> in under 5 minutes. Keep your existing number.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              href="/onboarding"
              className="bg-[#e8930c] text-white px-8 py-[15px] rounded-lg text-base font-bold no-underline hover:bg-[#d17f00] transition-colors shadow-[0_2px_8px_rgba(232,147,12,0.3)]"
            >
              Start Your Free Trial
            </Link>
            <button
              onClick={() => setShowDemo(true)}
              className="bg-white text-[#1a2e3b] px-8 py-[15px] rounded-lg text-base font-semibold border border-[#d1ccc6] hover:bg-[#f0eeeb] transition-colors flex items-center justify-center gap-2 cursor-pointer"
            >
              <PhoneIcon size={18} /> Call a demo agent
            </button>
          </div>
          <p className="text-[11px] text-[#94a7b8] mt-3">Standard call rates apply</p>
        </div>
      </section>
    </>
  );
}
