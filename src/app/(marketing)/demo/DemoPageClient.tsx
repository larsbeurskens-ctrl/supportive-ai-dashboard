'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';

interface Recording {
  id: string;
  title: string;
  subtitle: string;
  duration: string;
  url: string;
  transcript: { speaker: string; text: string }[];
}

const RECORDINGS: Recording[] = [
  {
    id: 'booking',
    title: 'Customer books a window cleaning',
    subtitle: '2-story colonial — full booking with pricing',
    duration: '2:00',
    url: '/audio/demo-call-wc-booking-mike.m4a',
    transcript: [
      { speaker: 'Sarah', text: "Hey there! Thanks for calling Clean Pro Window Washing, this is Sarah. How can I help you today?" },
      { speaker: 'Caller', text: "I'm interested in getting my two story colonial home washed, just the exterior windows only." },
      { speaker: 'Sarah', text: "For a two-story exterior, every job is a little different, but typically you're looking at somewhere between $250 to $400." },
      { speaker: 'Caller', text: "That sounds great. It's 34 Elm Street in Poughkeepsie, 12601." },
      { speaker: 'Sarah', text: "We have openings at 8 AM, 9 AM, and 10 AM. Would any of those work for you?" },
      { speaker: 'Caller', text: "Let's book it in for Friday at 10 AM." },
      { speaker: 'Sarah', text: "You're all set for Friday, March 6th at 10 AM! You'll get a confirmation text shortly." },
    ],
  },
  {
    id: 'emergency',
    title: 'Emergency call — active kitchen leak',
    subtitle: 'Water leaking from kitchen sink — immediate escalation',
    duration: '2:45',
    url: '/audio/demo-call-plumbing-emergency-david.m4a',
    transcript: [
      { speaker: 'Sarah', text: 'Thank you for calling Hudson Valley Plumbing! This is Sarah. How can I help you today?' },
      { speaker: 'Caller', text: 'I have water leaking coming from my kitchen sink. I need somebody out today.' },
      { speaker: 'Sarah', text: 'Just to confirm — do you have water actively leaking or flooding right now?' },
      { speaker: 'Caller', text: "I do. It's actively leaking." },
      { speaker: 'Sarah', text: "Okay David, I'm going to get someone out to you right away." },
      { speaker: 'Sarah', text: "I've sent an emergency alert to our team right now. Someone will call you back as soon as possible." },
      { speaker: 'Caller', text: "Alright. I appreciate it. I'll wait for their call." },
      { speaker: 'Sarah', text: "You're welcome, David. Have a great day!" },
    ],
  },
];

export function DemoPageClient() {
  const [playing, setPlaying] = useState<string | null>(null);
  const [progress, setProgress] = useState<Record<string, number>>({});
  const [durations, setDurations] = useState<Record<string, number>>({});
  const audioRefs = useRef<Record<string, HTMLAudioElement>>({});

  useEffect(() => {
    return () => { Object.values(audioRefs.current).forEach(a => a.pause()); };
  }, []);

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
    audioRefs.current[id].play();
    setPlaying(id);
  }

  function seekAudio(id: string, e: React.MouseEvent<HTMLDivElement>) {
    const audio = audioRefs.current[id];
    if (!audio) return;
    const rect = e.currentTarget.getBoundingClientRect();
    audio.currentTime = ((e.clientX - rect.left) / rect.width) * audio.duration;
  }

  function fmtTime(s: number) { return `${Math.floor(s / 60)}:${String(Math.floor(s % 60)).padStart(2, '0')}`; }

  return (
    <main className="min-h-screen bg-[#f7f5f2] py-16 px-6">
      <div className="max-w-[760px] mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-[36px] font-extrabold text-[#1a2e3b] mb-3">Hear it in action</h1>
          <p className="text-[16px] text-[#5a7184]">Real calls handled by our AI agents. Unedited.</p>
        </div>
        <div className="space-y-6">
          {RECORDINGS.map(rec => (
            <div key={rec.id} className="bg-white rounded-2xl border border-[#e5e0da] overflow-hidden">
              <div className="px-6 py-4 bg-[#faf9f7] border-b border-[#e5e0da] flex items-center justify-between">
                <div>
                  <h2 className="text-[16px] font-bold text-[#1a2e3b]">{rec.title}</h2>
                  <p className="text-[13px] text-[#5a7184]">{rec.subtitle}</p>
                </div>
                <span className="text-[11px] font-semibold text-white bg-[#059669] px-2 py-0.5 rounded-full">Real call</span>
              </div>
              <div className="p-5 space-y-3 max-h-[300px] overflow-y-auto">
                {rec.transcript.map((line, i) => (
                  <div key={i} className={`flex ${line.speaker === 'Caller' ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-[85%] px-3.5 py-2.5 rounded-2xl text-[13px] leading-relaxed ${
                      line.speaker === 'Caller' ? 'bg-[#1a2e3b] text-white rounded-br-md' : 'bg-[#f0eeeb] text-[#1a2e3b] rounded-bl-md'
                    }`}>{line.text}</div>
                  </div>
                ))}
              </div>
              <div className="px-5 pb-5">
                <div className="flex items-center gap-3 bg-[#faf9f7] rounded-xl px-4 py-3 border border-[#e5e0da]">
                  <button onClick={() => togglePlay(rec.id, rec.url)}
                    className="w-8 h-8 rounded-full bg-[#e8930c] hover:bg-[#d17f00] flex items-center justify-center flex-shrink-0 cursor-pointer border-none">
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
          ))}
        </div>
        <div className="text-center mt-10">
          <Link href="/onboarding" className="inline-block bg-[#e8930c] text-white px-8 py-4 rounded-lg text-base font-bold no-underline hover:bg-[#d17f00]">
            Start your free trial →
          </Link>
        </div>
      </div>
    </main>
  );
}
