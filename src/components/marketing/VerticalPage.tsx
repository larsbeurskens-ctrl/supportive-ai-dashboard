'use client';

import { useState, useRef } from 'react';
import Link from 'next/link';
import { PhoneIcon, CheckIcon, StarIcon, GoogleIcon } from './Icons';
import { DemoOverlay, DemoConfig } from './DemoOverlay';

interface Capability {
  title: string;
  desc: string;
}

interface Stat {
  value: string;
  label: string;
}

interface Testimonial {
  quote: string;
  name: string;
  title: string;
  stars: number;
}

interface Recording {
  id: string;
  src: string;
  scenario: string;
  bubbles: Array<{ role: 'ai' | 'customer'; text: string }>;
}

interface VerticalPageProps {
  trade: string;
  headline: string;
  subheadline: string;
  painPoints: string[];
  capabilities: Capability[];
  stats: Stat[];
  testimonial: Testimonial;
  phoneNumber: string | null;
  accentColor: string;
  available: boolean;
  recordings: Recording[];
  verticalSlug: string;
  demoConfig: DemoConfig; // vertical-specific overlay content
}

/* ===== Audio Player hook helpers ===== */
function fmtTime(s: number) {
  const m = Math.floor(s / 60);
  return `${m}:${String(Math.floor(s % 60)).padStart(2, '0')}`;
}

/* ===== Email capture form ===== */
function LeadCaptureForm({ trade, verticalSlug }: { trade: string; verticalSlug: string }) {
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
        <input
          type="text"
          placeholder="Your name"
          value={name}
          onChange={e => setName(e.target.value)}
          className="w-full px-4 py-3 rounded-lg border border-[#d1ccc6] text-[14px] text-[#1a2e3b] placeholder-[#94a7b8] focus:outline-none focus:border-[#e8930c] bg-white"
        />
        <input
          type="text"
          placeholder="Business name"
          value={business}
          onChange={e => setBusiness(e.target.value)}
          className="w-full px-4 py-3 rounded-lg border border-[#d1ccc6] text-[14px] text-[#1a2e3b] placeholder-[#94a7b8] focus:outline-none focus:border-[#e8930c] bg-white"
        />
      </div>
      <div className="flex flex-col sm:flex-row gap-2">
        <input
          type="email"
          required
          placeholder="Work email address"
          value={email}
          onChange={e => setEmail(e.target.value)}
          className="flex-1 w-full px-4 py-3 rounded-lg border border-[#d1ccc6] text-[14px] text-[#1a2e3b] placeholder-[#94a7b8] focus:outline-none focus:border-[#e8930c] bg-white"
        />
        <button
          type="submit"
          disabled={loading || !email}
          className="w-full sm:w-auto bg-[#e8930c] text-white px-6 py-3 rounded-lg text-[14px] font-bold whitespace-nowrap hover:bg-[#d17f00] transition-colors disabled:opacity-60 cursor-pointer border-none"
        >
          {loading ? 'Sending…' : 'Send demo →'}
        </button>
      </div>
      {error && <p className="text-[13px] text-red-500">{error}</p>}
      <p className="text-[12px] text-[#94a7b8]">No spam. You&apos;ll get 3 emails about how it works — that&apos;s it.</p>
    </form>
  );
}

export function VerticalPage({
  trade, headline, subheadline, painPoints, capabilities,
  stats, testimonial, phoneNumber, available, recordings, verticalSlug, demoConfig,
}: VerticalPageProps) {
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

  return (
    <>
      {showDemo && <DemoOverlay onClose={() => setShowDemo(false)} configs={[demoConfig]} />}

      {/* ===== HERO ===== */}
      <section className="pt-16 pb-10 md:pt-20 px-6 md:px-10 max-w-[820px] mx-auto text-center">
        <h1 className="text-[36px] md:text-[44px] font-extrabold text-[#1a2e3b] leading-[1.15] mb-5 tracking-tight">
          {headline}
        </h1>
        <p className="text-lg text-[#5a7184] leading-relaxed max-w-[580px] mx-auto mb-8">
          {subheadline}
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center mb-4">
          {available && phoneNumber ? (
            <>
              <Link
                href="/onboarding"
                className="bg-[#e8930c] text-white px-8 py-[15px] rounded-lg text-base font-bold no-underline hover:bg-[#d17f00] transition-colors shadow-[0_2px_8px_rgba(232,147,12,0.3)] flex items-center justify-center gap-2"
              >
                Start free trial
              </Link>
              <button
                onClick={() => setShowDemo(true)}
                className="bg-white text-[#1a2e3b] px-8 py-[15px] rounded-lg text-base font-semibold border border-[#d1ccc6] hover:bg-[#f0eeeb] transition-colors flex items-center justify-center gap-2 cursor-pointer"
              >
                <PhoneIcon size={18} /> Call the demo agent
              </button>
            </>
          ) : (
            <Link
              href="/onboarding"
              className="bg-[#e8930c] text-white px-8 py-[15px] rounded-lg text-base font-bold no-underline hover:bg-[#d17f00]"
            >
              Start free trial
            </Link>
          )}
        </div>
        {available && phoneNumber && (
          <p className="text-[13px] text-[#94a7b8]">
            Call <strong className="text-[#5a7184]">{phoneNumber}</strong> right now — hear it answer, qualify the lead, and book a job.
          </p>
        )}
      </section>

      {/* ===== STATS ===== */}
      <section className="py-8 px-6 md:px-10 max-w-[820px] mx-auto">
        <div className="flex justify-center gap-12 md:gap-16">
          {stats.map((s, i) => (
            <div key={i} className="text-center">
              <div className="text-[32px] font-extrabold text-[#1a2e3b]">{s.value}</div>
              <div className="text-[13px] text-[#5a7184] font-medium">{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ===== REAL RECORDINGS ===== */}
      {recordings.length > 0 && (
        <section id="hear-it" className="py-14 px-6 md:px-10 bg-white border-t border-b border-[#e5e0da]">
          <div className="max-w-[820px] mx-auto">
            <div className="text-center mb-10">
              <h2 className="text-[26px] font-bold text-[#1a2e3b] mb-2">Hear it handle real {trade.toLowerCase()} calls</h2>
              <p className="text-[15px] text-[#5a7184]">Real conversations. Not scripted. Not edited.</p>
            </div>
            <div className={`grid grid-cols-1 ${recordings.length > 1 ? 'md:grid-cols-2' : ''} gap-5`}>
              {recordings.map(conv => (
                <div key={conv.id} className="bg-white rounded-2xl border border-[#e5e0da] overflow-hidden">
                  <div className="px-5 py-3.5 bg-[#faf9f7] border-b border-[#e5e0da] flex items-center justify-between gap-3">
                    <div className="min-w-0">
                      <span className="text-[12px] font-bold text-[#e8930c] uppercase tracking-wide">{trade}</span>
                      <p className="text-[13px] font-semibold text-[#1a2e3b] truncate">{conv.scenario}</p>
                    </div>
                    <span className="flex-shrink-0 whitespace-nowrap text-[11px] font-semibold text-white bg-[#059669] px-2 py-0.5 rounded-full">Real call</span>
                  </div>
                  <div className="p-4 space-y-3 max-h-[280px] overflow-y-auto">
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
                      <div className="flex-1 h-1.5 bg-[#e5e0da] rounded-full cursor-pointer" onClick={e => seekAudio(conv.id, e)}>
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
          </div>
        </section>
      )}

      {/* ===== PAIN POINTS ===== */}
      <section className="py-14 px-6 md:px-10 border-t border-b border-[#e5e0da]">
        <div className="max-w-[820px] mx-auto">
          <h2 className="text-[26px] font-bold text-[#1a2e3b] mb-2 text-center">Sound familiar?</h2>
          <p className="text-[15px] text-[#5a7184] text-center mb-8">These problems cost you real money every single week.</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {painPoints.map((p, i) => (
              <div key={i} className="flex items-start gap-3.5 p-5 rounded-xl bg-[#faf9f7] border border-[#e5e0da]">
                <span className="flex-shrink-0 w-6 h-6 rounded-full bg-[#fef2e0] flex items-center justify-center mt-0.5">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#e8930c" strokeWidth="3"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                </span>
                <p className="text-[14px] text-[#2a4a5e] leading-relaxed font-medium">{p}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== CAPABILITIES ===== */}
      <section className="py-16 px-6 md:px-10 max-w-[820px] mx-auto">
        <h2 className="text-[26px] font-bold text-[#1a2e3b] mb-3 text-center">
          What it actually does on every call
        </h2>
        <p className="text-[15px] text-[#5a7184] text-center mb-10">
          Purpose-built for {trade.toLowerCase()}. Not a generic answering service.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {capabilities.map((c, i) => (
            <div key={i} className="flex gap-3.5 p-5 bg-white rounded-xl border border-[#e5e0da]">
              <span className="flex-shrink-0 mt-0.5 text-[#059669]"><CheckIcon size={18} /></span>
              <div>
                <h3 className="text-[15px] font-bold text-[#1a2e3b] mb-1">{c.title}</h3>
                <p className="text-[13px] text-[#5a7184] leading-relaxed">{c.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ===== TESTIMONIAL — hidden for now ===== */}

      {/* ===== HOW IT WORKS ===== */}
      <section id="how-it-works" className="py-16 px-6 md:px-10 bg-white border-t border-[#e5e0da]">
        <div className="max-w-[820px] mx-auto">
          <h2 className="text-[26px] font-bold text-[#1a2e3b] text-center mb-2">How it works</h2>
          <p className="text-[15px] text-[#5a7184] text-center mb-12">Live in under 5 minutes. No tech skills needed.</p>
          <div className="relative flex flex-col md:flex-row gap-8 md:gap-0">
            <div className="hidden md:block absolute top-6 left-10 right-10 h-[2px] bg-[#d1ccc6] z-0" />
            {[
              { n: '1', title: 'Sign up & name your AI', desc: 'Create your account in 30 seconds. Pick a local area code. Your AI gets its own number.' },
              { n: '2', title: 'Add your business details', desc: 'Tell it your pricing, services, hours, and credentials. Takes 2 minutes. No tech skills needed.' },
              { n: '3', title: 'Test it with a real call', desc: 'Call your AI number and experience it yourself. Book a job, ask about pricing, try a reschedule.' },
              { n: '4', title: 'Forward calls & start booking', desc: 'Dial a short code from your phone to forward missed calls. Connect Google Calendar. Done.' },
            ].map((s, i) => (
              <div key={i} className="flex-1 text-center relative z-[1]">
                <div className="w-12 h-12 rounded-full bg-[#1a2e3b] text-white flex items-center justify-center mx-auto mb-4 text-lg font-bold">{s.n}</div>
                <h3 className="text-sm font-bold text-[#1a2e3b] mb-1.5">{s.title}</h3>
                <p className="text-[13px] text-[#5a7184] leading-snug px-2">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== LIVE IN 5 MINUTES ===== */}
      <section className="py-16 px-6 md:px-10 bg-[#faf9f7] border-t border-[#e5e0da]">
        <div className="max-w-[820px] mx-auto">
          <div className="text-center mb-10">
            <h2 className="text-[26px] font-bold text-[#1a2e3b] mb-2">Live in 5 minutes, not 5 days</h2>
            <p className="text-[15px] text-[#5a7184]">Set it up yourself — or we&apos;ll walk you through it.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* Self-serve */}
            <div className="rounded-xl border border-[#e5e0da] bg-white p-6">
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
            {/* Guided */}
            <div className="rounded-xl border border-[#e5e0da] overflow-hidden">
              <div className="bg-[#e8930c] px-6 py-4">
                <h3 className="text-[17px] font-bold text-white">Need a hand? We&apos;re here.</h3>
                <p className="text-[13px] text-white/80 mt-0.5">Free 15-minute setup call</p>
              </div>
              <div className="p-6 bg-white">
                <p className="text-[14px] text-[#5a7184] leading-relaxed mb-5">
                  Not sure about call forwarding or calendar setup? Book a quick call and we&apos;ll do it together.
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
        </div>
      </section>

      {/* ===== PRICING ===== */}
      <section id="pricing" className="py-16 px-6 md:px-10 bg-white border-t border-[#e5e0da]">
        <div className="max-w-[820px] mx-auto">
          <h2 className="text-[26px] font-bold text-[#1a2e3b] text-center mb-2">Simple, honest pricing</h2>
          <p className="text-[15px] text-[#5a7184] text-center mb-12">No hidden fees. No per-seat pricing. Everything included.</p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {[
              {
                name: 'Starter', price: 149, calls: '150 calls/mo', target: 'Solo operators',
                features: ['24/7 AI answering', 'Dashboard & call analytics', 'Route-optimised booking', 'Calendar + SMS confirmations', 'WhatsApp AI agent', 'Payment links', '1st line customer service'],
                note: '$1.50/call overage', popular: false,
              },
              {
                name: 'Pro', price: 299, calls: '500 calls/mo', target: 'Growing businesses',
                features: ['Everything in Starter', 'Multi-crew scheduling', 'Priority support', 'Review requests'],
                note: '$1.25/call overage', popular: true,
              },
              {
                name: 'Growth', price: 499, calls: 'Unlimited calls', target: 'Established teams',
                features: ['Everything in Pro', 'Unlimited calls', 'API access', 'Dedicated account manager', 'Custom-built features'],
                note: null, popular: false,
              },
            ].map((plan) => (
              <div key={plan.name} className={`p-7 rounded-xl relative ${plan.popular ? 'border-2 border-[#e8930c] bg-[#fffdf9]' : 'border border-[#e5e0da] bg-white'}`}>
                {plan.popular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-[#e8930c] text-white px-4 py-1 rounded-full text-xs font-semibold">Most popular</div>
                )}
                <h3 className="text-xl font-bold text-[#1a2e3b] mb-1">{plan.name}</h3>
                <p className="text-[13px] text-[#5a7184] mb-4">{plan.target}</p>
                <div className="mb-1">
                  <span className="text-[40px] font-extrabold text-[#1a2e3b]">${plan.price}</span>
                  <span className="text-[15px] text-[#5a7184]">/mo</span>
                </div>
                <p className="text-[13px] text-[#e8930c] font-bold mb-1">{plan.calls}</p>
                {plan.note ? <p className="text-[11px] text-[#94a7b8] mb-5">{plan.note}</p> : <div className="mb-5" />}
                <ul className="space-y-2 mb-6">
                  {plan.features.map((f) => (
                    <li key={f} className="flex items-center gap-2 text-sm text-[#2a4a5e]">
                      <CheckIcon size={16} className="text-[#059669] flex-shrink-0" />{f}
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
        </div>
      </section>
      <section className="py-16 px-6 md:px-10 bg-[#faf9f7] border-t border-[#e5e0da]">
        <div className="max-w-[580px] mx-auto">
          <div className="text-center mb-8">
            <h2 className="text-[24px] font-bold text-[#1a2e3b] mb-2">
              Want to see exactly how it would work for your business?
            </h2>
            <p className="text-[15px] text-[#5a7184]">
              We&apos;ll send you a sample {trade.toLowerCase()} conversation, a breakdown of what it handles,
              and how to get it live in 5 minutes.
            </p>
          </div>
          <div className="bg-white rounded-2xl border border-[#e5e0da] p-6">
            <LeadCaptureForm trade={trade} verticalSlug={verticalSlug} />
          </div>
          <div className="flex justify-center gap-6 mt-6">
            {[
              '7-day free trial',
              'No credit card',
              'Cancel anytime',
            ].map((s, i) => (
              <div key={i} className="flex items-center gap-1.5">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#059669" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg>
                <span className="text-[13px] text-[#5a7184] font-medium">{s}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== FINAL CTA ===== */}
      {available && phoneNumber && (
        <section className="py-16 px-6 md:px-10">
          <div className="max-w-[700px] mx-auto bg-[#1a2e3b] rounded-2xl p-10 text-center">
            <h2 className="text-2xl font-bold text-white mb-2">
              Call our {trade.toLowerCase()} demo agent right now
            </h2>
            <p className="text-[14px] text-white/60 mb-6">
              It answers in under 1 second. Book a fake appointment — say you need to reschedule — ask about pricing.
            </p>
            <button
              onClick={() => setShowDemo(true)}
              className="inline-flex items-center gap-3 bg-[#243d4e] rounded-xl px-8 py-4 border border-[#35596e] hover:bg-[#2c4a5d] transition-colors cursor-pointer border-none"
            >
              <PhoneIcon size={22} className="text-[#e8930c]" />
              <span className="text-[22px] font-bold text-white tracking-wide">{phoneNumber}</span>
            </button>
            <p className="text-[12px] text-white/40 mt-4">Standard call rates apply</p>
          </div>
        </section>
      )}

      {!available && (
        <section className="py-16 px-6 md:px-10">
          <div className="max-w-[600px] mx-auto text-center">
            <h2 className="text-2xl font-bold text-[#1a2e3b] mb-3">
              Be the first to get your {trade.toLowerCase()} AI agent
            </h2>
            <p className="text-[15px] text-[#5a7184] mb-6">
              We&apos;re launching {trade.toLowerCase()} agents in Q2 2026. Join the waitlist and we&apos;ll set you up first.
            </p>
            <Link
              href="/onboarding"
              className="inline-block bg-[#e8930c] text-white px-8 py-[15px] rounded-lg text-base font-bold no-underline hover:bg-[#d17f00]"
            >
              Join the Waitlist
            </Link>
          </div>
        </section>
      )}
    </>
  );
}
