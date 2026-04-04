'use client';

import { useState } from 'react';
import Link from 'next/link';
import { DemoOverlay } from '@/components/marketing/DemoOverlay';

const FAQ_ITEMS = [
  { q: 'Can it handle emergency lockouts?', a: "Absolutely. It detects urgency instantly — locked out, break-in damage, snapped key. It collects the caller\'s location and details in under 60 seconds and sends you an immediate text so you can respond fast." },
  { q: 'What about after-hours calls?', a: "This is where it shines. Most lockout calls come evenings and weekends. Your AI answers 24/7, qualifies the job, and texts you the details — so you never miss a midnight lockout again." },
  { q: 'Does it give out DIY lock advice?', a: "Never. It will not suggest forcing a door, picking a lock, or any bypass method. It always directs callers to wait for a professional." },
  { q: 'Can it quote my pricing?', a: "Yes. It gives callers your price ranges — lockout fees, lock change costs, euro cylinder replacement — and always confirms the final price is given on arrival with no hidden charges." },
  { q: 'Do I need to change my number?', a: "No. Keep your existing number. Just forward calls when you want — after hours, when you miss a call, or all the time." },
  { q: 'How fast can I get set up?', a: "Live in a day. We build a version tailored to your locksmith business — your pricing, your service area, your calendar. You approve it before it goes live." },
];

const faqJsonLd = {
  "@context": "https://schema.org", "@type": "FAQPage",
  "mainEntity": FAQ_ITEMS.map(item => ({ "@type": "Question", "name": item.q, "acceptedAnswer": { "@type": "Answer", "text": item.a } })),
};

export default function AIReceptionistForLocksmiths() {
  const [showDemo, setShowDemo] = useState(false);

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />

      {/* HERO */}
      <section className="pt-16 pb-10 px-6 md:px-10 max-w-[820px] mx-auto text-center">
        <p className="text-[13px] font-semibold text-[#e8930c] uppercase tracking-wider mb-3">AI receptionist for locksmiths</p>
        <h1 className="text-[36px] md:text-[44px] font-extrabold text-[#1a2e3b] leading-[1.15] mb-5 tracking-tight">
          Someone locked out at midnight is not leaving a voicemail
        </h1>
        <p className="text-lg text-[#5a7184] leading-relaxed max-w-[580px] mx-auto mb-8">
          When you are picking a lock, driving to a call-out, or mid-way through a door change — you cannot answer the phone. Supportive AI picks up, qualifies the job, and books it into your calendar. 24/7.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center mb-4">
          <Link href="/onboarding" className="bg-[#e8930c] text-white px-8 py-[15px] rounded-lg text-base font-bold no-underline hover:bg-[#d17f00] transition-colors shadow-[0_2px_8px_rgba(232,147,12,0.3)]">
            Start Your Free Trial
          </Link>
        </div>
        <p className="text-[13px] text-[#94a7b8]">From £69/month · No setup fee · Cancel anytime</p>
      </section>

      {/* PAIN */}
      <section className="py-14 px-6 md:px-10 bg-white border-t border-b border-[#e5e0da]">
        <div className="max-w-[820px] mx-auto">
          <h2 className="text-[26px] font-bold text-[#1a2e3b] mb-4">The locksmith&apos;s phone problem</h2>
          <div className="text-[16px] text-[#5a7184] leading-relaxed space-y-4">
            <p>Someone locked out of their house at 11pm is not leaving a voicemail. They are calling three locksmiths, and whoever answers first gets the job. That is £80-150 gone in the time it takes to ring out.</p>
            <p>You are on a job, driving, or asleep. Your phone rings. You cannot answer. They call the next locksmith on Google.</p>
            <p className="text-[#1a2e3b] font-semibold">Supportive AI answers every call — day and night — qualifies the job, and texts you the details instantly.</p>
          </div>
        </div>
      </section>

      {/* WHAT IT HANDLES */}
      <section className="py-14 px-6 md:px-10">
        <div className="max-w-[820px] mx-auto">
          <h2 className="text-[26px] font-bold text-[#1a2e3b] mb-6">Built for how locksmiths actually work</h2>
          <div className="grid sm:grid-cols-2 gap-5">
            {[
              { icon: '🔑', title: 'Handles lockouts instantly', desc: 'Locked out? The AI detects urgency, collects location and details in under 60 seconds, and texts you immediately. Fastest response in the business.' },
              { icon: '📅', title: 'Books into your live calendar', desc: 'For scheduled work — lock changes, security upgrades, rekeying — it checks your real availability and books confirmed slots.' },
              { icon: '🚨', title: 'Break-in & burglary priority', desc: 'Caller been burgled? The AI expresses concern, collects details fast, and escalates as highest priority. Boarding up and emergency lock changes handled.' },
              { icon: '💰', title: 'Quotes your pricing', desc: 'Lockout fees, lock changes, euro cylinders, uPVC multipoint locks. Customers get real answers, with "final price confirmed on arrival" reassurance.' },
              { icon: '🌙', title: '24/7 — built for after-hours', desc: 'Most lockout calls come evenings and weekends. Your AI never sleeps, never misses a call, never sends someone to voicemail.' },
              { icon: '🔒', title: 'Security-conscious', desc: 'Never gives lock bypass advice. Asks callers to confirm they are the property owner. Protects your professional reputation.' },
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

      {/* EMERGENCY vs ROUTINE */}
      <section className="py-14 px-6 md:px-10 bg-white border-t border-b border-[#e5e0da]">
        <div className="max-w-[820px] mx-auto">
          <h2 className="text-[26px] font-bold text-[#1a2e3b] mb-6">It knows the difference between urgent and scheduled</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-[#fef2f2] rounded-xl px-6 py-5 border border-[#fecaca]">
              <p className="text-[15px] font-bold text-[#dc2626] mb-3">Emergency lockout</p>
              <p className="text-[14px] text-[#5a7184] mb-2 italic">&quot;I&apos;m locked out of my flat and it&apos;s freezing — can someone come now?&quot;</p>
              <div className="text-[14px] text-[#5a7184] space-y-1.5 mt-3">
                <p className="font-semibold text-[#dc2626]">AI response:</p>
                <p>&quot;I completely understand — let me get someone out to you as quickly as possible.&quot;</p>
                <p>Collects name, postcode, lock type in 60 seconds.</p>
                <p>Sends URGENT SMS to you immediately.</p>
              </div>
            </div>
            <div className="bg-[#f0fdf4] rounded-xl px-6 py-5 border border-[#bbf7d0]">
              <p className="text-[15px] font-bold text-[#059669] mb-3">Scheduled work</p>
              <p className="text-[14px] text-[#5a7184] mb-2 italic">&quot;We&apos;ve just moved in and want all the locks changed&quot;</p>
              <div className="text-[14px] text-[#5a7184] space-y-1.5 mt-3">
                <p className="font-semibold text-[#059669]">AI response:</p>
                <p>Collects details: name, number of locks, postcode, address.</p>
                <p>Checks your live calendar for available slots.</p>
                <p>Books the job, texts both sides a confirmation.</p>
                <p className="font-semibold text-[#059669]">Job locked in. You find out when you check your phone.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* PRICING THE AI KNOWS */}
      <section className="py-14 px-6 md:px-10">
        <div className="max-w-[820px] mx-auto">
          <h2 className="text-[26px] font-bold text-[#1a2e3b] mb-6">Your AI knows your pricing</h2>
          <p className="text-[15px] text-[#5a7184] mb-6">When a customer asks &quot;how much?&quot;, it gives them a real answer — not &quot;someone will call you back.&quot;</p>
          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4">
            {[
              { job: 'Emergency lockout', price: '£70-120', note: 'Day or night' },
              { job: 'Lock change (standard)', price: '£80-150', note: 'Yale or mortice' },
              { job: 'Lock change (high security)', price: '£120-250', note: 'Anti-snap, anti-pick' },
              { job: 'Euro cylinder', price: '£60-100', note: 'Supplied and fitted' },
              { job: 'uPVC multipoint lock', price: '£150-300', note: 'Full mechanism' },
              { job: 'Boarding up', price: '£80-200', note: 'After break-in' },
            ].map((item, i) => (
              <div key={i} className="bg-[#faf9f7] rounded-lg px-4 py-3 border border-[#e5e0da]">
                <p className="text-[13px] text-[#5a7184]">{item.job}</p>
                <p className="text-[20px] font-bold text-[#1a2e3b]">{item.price}</p>
                <p className="text-[12px] text-[#94a7b8]">{item.note}</p>
              </div>
            ))}
          </div>
          <p className="text-[13px] text-[#94a7b8] mt-4">These are example prices — your AI uses your actual pricing. Fully customisable.</p>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-14 px-6 md:px-10 bg-white border-t border-b border-[#e5e0da]">
        <div className="max-w-[820px] mx-auto">
          <h2 className="text-[26px] font-bold text-[#1a2e3b] mb-6">Common questions from locksmiths</h2>
          <div className="space-y-4">
            {FAQ_ITEMS.map((item, i) => (
              <details key={i} className="group bg-[#faf9f7] rounded-lg border border-[#e5e0da] overflow-hidden">
                <summary className="px-5 py-4 text-[15px] font-semibold text-[#1a2e3b] cursor-pointer list-none flex justify-between items-center">
                  {item.q}
                  <span className="text-[#94a7b8] group-open:rotate-180 transition-transform">▼</span>
                </summary>
                <div className="px-5 pb-4 text-[14px] text-[#5a7184] leading-relaxed">{item.a}</div>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="py-16 px-6 md:px-10 text-center">
        <div className="max-w-[580px] mx-auto">
          <h2 className="text-[28px] font-bold text-[#1a2e3b] mb-4">Stop losing lockout jobs to missed calls</h2>
          <p className="text-[16px] text-[#5a7184] mb-8">Your AI receptionist answers every call, qualifies the job, and books it — while you focus on the work in front of you.</p>
          <Link href="/onboarding" className="inline-block bg-[#e8930c] text-white px-10 py-4 rounded-lg text-lg font-bold no-underline hover:bg-[#d17f00] transition-colors shadow-[0_2px_8px_rgba(232,147,12,0.3)]">
            Start Your Free Trial
          </Link>
          <p className="text-[13px] text-[#94a7b8] mt-4">From £69/month · Live in a day · Cancel anytime</p>
        </div>
      </section>
    </>
  );
}
