'use client';

import { useState, useRef } from 'react';
import Link from 'next/link';
import { PhoneIcon, CheckIcon, StarIcon, GoogleIcon } from './Icons';

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
  verticalSlug: string; // 'plumbing' | 'window-cleaning'
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
      <div className="flex gap-2">
        <input
          type="email"
          required
          placeholder="Work email address"
          value={email}
          onChange={e => setEmail(e.target.value)}
          className="flex-1 px-4 py-3 rounded-lg border border-[#d1ccc6] text-[14px] text-[#1a2e3b] placeholder-[#94a7b8] focus:outline-none focus:border-[#e8930c] bg-white"
        />
        <button
          type="submit"
          disabled={loading || !email}
          className="bg-[#e8930c] text-white px-6 py-3 rounded-lg text-[14px] font-bold whitespace-nowrap hover:bg-[#d17f00] transition-colors disabled:opacity-60 cursor-pointer border-none"
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
  stats, testimonial, phoneNumber, available, recordings, verticalSlug,
}: VerticalPageProps) {
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
      {/* ===== HERO ===== */}
      <section className="pt-16 pb-10 md:pt-20 px-6 md:px-10 max-w-[820px] mx-auto text-center">
        <span className="inline-block px-4 py-1.5 rounded-full text-[13px] font-bold mb-6 uppercase tracking-wide bg-[#e8930c]/10 text-[#e8930c]">
          {trade} AI Receptionist
        </span>
        <h1 className="text-[36px] md:text-[44px] font-extrabold text-[#1a2e3b] leading-[1.15] mb-5 tracking-tight">
          {headline}
        </h1>
        <p className="text-lg text-[#5a7184] leading-relaxed max-w-[580px] mx-auto mb-8">
          {subheadline}
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center mb-4">
          {available && phoneNumber ? (
            <>
              <a
                href={`tel:+1${phoneNumber.replace(/\D/g, '')}`}
                className="bg-[#e8930c] text-white px-8 py-[15px] rounded-lg text-base font-bold no-underline hover:bg-[#d17f00] transition-colors shadow-[0_2px_8px_rgba(232,147,12,0.3)] flex items-center justify-center gap-2"
              >
                <PhoneIcon size={18} /> Call the demo agent
              </a>
              <Link
                href="/onboarding"
                className="bg-white text-[#1a2e3b] px-8 py-[15px] rounded-lg text-base font-semibold no-underline border border-[#d1ccc6] hover:bg-[#f0eeeb] transition-colors"
              >
                Start free trial
              </Link>
            </>
          ) : (
            <Link
              href="/onboarding"
              className="bg-[#e8930c] text-white px-8 py-[15px] rounded-lg text-base font-bold no-underline hover:bg-[#d17f00]"
            >
              Join the Waitlist
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
        <section className="py-14 px-6 md:px-10 bg-white border-t border-b border-[#e5e0da]">
          <div className="max-w-[820px] mx-auto">
            <div className="text-center mb-10">
              <h2 className="text-[26px] font-bold text-[#1a2e3b] mb-2">Hear it handle real {trade.toLowerCase()} calls</h2>
              <p className="text-[15px] text-[#5a7184]">Real conversations. Not scripted. Not edited.</p>
            </div>
            <div className={`grid grid-cols-1 ${recordings.length > 1 ? 'md:grid-cols-2' : ''} gap-5`}>
              {recordings.map(conv => (
                <div key={conv.id} className="bg-white rounded-2xl border border-[#e5e0da] overflow-hidden">
                  <div className="px-5 py-3.5 bg-[#faf9f7] border-b border-[#e5e0da] flex items-center justify-between">
                    <div>
                      <span className="text-[12px] font-bold text-[#e8930c] uppercase tracking-wide">{trade}</span>
                      <p className="text-[13px] font-semibold text-[#1a2e3b]">{conv.scenario}</p>
                    </div>
                    <span className="text-[11px] font-semibold text-white bg-[#059669] px-2 py-0.5 rounded-full">Real call</span>
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

      {/* ===== TESTIMONIAL ===== */}
      <section className="py-12 px-6 md:px-10 bg-white border-t border-[#e5e0da]">
        <div className="max-w-[600px] mx-auto text-center">
          <div className="flex gap-0.5 justify-center mb-4">
            {Array.from({ length: testimonial.stars }).map((_, j) => (
              <StarIcon key={j} size={18} className="text-[#e8930c]" />
            ))}
          </div>
          <p className="text-base text-[#2a4a5e] leading-relaxed italic mb-4">
            &ldquo;{testimonial.quote}&rdquo;
          </p>
          <p className="text-sm font-bold text-[#1a2e3b]">{testimonial.name}</p>
          <p className="text-xs text-[#5a7184]">{testimonial.title}</p>
          <div className="mt-4 flex items-center justify-center gap-2">
            <GoogleIcon size={16} />
            <span className="text-xs text-[#94a7b8]">Verified Google Review</span>
          </div>
        </div>
      </section>

      {/* ===== FIND OUT MORE — email capture ===== */}
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
            <a
              href={`tel:+1${phoneNumber.replace(/\D/g, '')}`}
              className="inline-flex items-center gap-3 bg-[#243d4e] rounded-xl px-8 py-4 border border-[#35596e] no-underline hover:bg-[#2c4a5d] transition-colors"
            >
              <PhoneIcon size={22} className="text-[#e8930c]" />
              <span className="text-[22px] font-bold text-white tracking-wide">{phoneNumber}</span>
            </a>
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
