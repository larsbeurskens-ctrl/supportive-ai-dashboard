'use client';

import { useState } from 'react';
import Link from 'next/link';

const FAQ_ITEMS = [
  { q: 'Can it handle quote requests for big projects?', a: "Yes. For larger work like patios, decking, or garden redesigns, the AI collects all the details — property size, what they want done, access — and books a free estimate visit. You arrive prepared." },
  { q: 'What about regular maintenance customers?', a: "It books the first visit and lets the caller know you can arrange a regular schedule after the initial appointment. Recurring customers are your most profitable — this makes sure you never miss the first enquiry." },
  { q: 'Does it know my pricing?', a: "Yes. It quotes your price ranges for standard work — mowing, hedge trimming, clearances — and for larger projects it offers a free estimate. Fully customisable to your actual rates." },
  { q: 'Can it tell the difference between a quick job and a big project?', a: "Absolutely. Lawn mowing gets booked straight into your calendar. A new patio gets flagged for an estimate visit. It routes each enquiry the right way automatically." },
  { q: 'Do I need to change my number?', a: "No. Keep your existing number. Just forward calls when you want — when you are on the mower, driving, or after hours. You control it." },
  { q: 'How fast can I get set up?', a: "Live in a day. We build a version tailored to your landscaping business — your services, your pricing, your service area, your calendar. You approve it before it goes live." },
];

const faqJsonLd = {
  "@context": "https://schema.org", "@type": "FAQPage",
  "mainEntity": FAQ_ITEMS.map(item => ({ "@type": "Question", "name": item.q, "acceptedAnswer": { "@type": "Answer", "text": item.a } })),
};

export default function AIReceptionistForLandscapers() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />

      {/* HERO */}
      <section className="pt-16 pb-10 px-6 md:px-10 max-w-[820px] mx-auto text-center">
        <p className="text-[13px] font-semibold text-[#e8930c] uppercase tracking-wider mb-3">AI receptionist for landscapers</p>
        <h1 className="text-[36px] md:text-[44px] font-extrabold text-[#1a2e3b] leading-[1.15] mb-5 tracking-tight">
          Every missed call is a garden you will never get paid to maintain
        </h1>
        <p className="text-lg text-[#5a7184] leading-relaxed max-w-[580px] mx-auto mb-8">
          When you are on the mower, trimming a hedge, or knee-deep in a garden clearance — you cannot answer the phone. Supportive AI picks up, qualifies the job, and books it into your calendar.
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
          <h2 className="text-[26px] font-bold text-[#1a2e3b] mb-4">The landscaper&apos;s phone problem</h2>
          <div className="text-[16px] text-[#5a7184] leading-relaxed space-y-4">
            <p>You are running a mower, operating a strimmer, or up a ladder with a hedge trimmer. You cannot hear your phone, let alone answer it. By the time you check your missed calls at 5pm, those customers have already booked someone else.</p>
            <p>A homeowner looking for regular lawn care is worth £1,000+ a year. A patio job is £3,000-5,000. One missed call, one lost customer — and they are not calling back.</p>
            <p className="text-[#1a2e3b] font-semibold">Supportive AI answers every call, finds out what they need, and books the job or arranges a free estimate — while you keep working.</p>
          </div>
        </div>
      </section>

      {/* WHAT IT HANDLES */}
      <section className="py-14 px-6 md:px-10">
        <div className="max-w-[820px] mx-auto">
          <h2 className="text-[26px] font-bold text-[#1a2e3b] mb-6">Built for how landscapers actually work</h2>
          <div className="grid sm:grid-cols-2 gap-5">
            {[
              { icon: '🌿', title: 'Books maintenance jobs directly', desc: 'Lawn mowing, hedge trimming, garden clearance — it checks your calendar and books a confirmed slot. No callbacks needed.' },
              { icon: '📐', title: 'Arranges free estimates for big projects', desc: 'Patios, decking, fencing, garden redesigns — it collects all the details and books an estimate visit. You arrive knowing what they want.' },
              { icon: '🔄', title: 'Handles regular service enquiries', desc: '"Can someone come every two weeks?" It books the first visit and lets them know you will set up a regular schedule when you meet.' },
              { icon: '💰', title: 'Quotes your pricing', desc: 'Mowing from £25, hedge trimming from £50, free estimates for projects. Customers get a real answer, not "we will call you back."' },
              { icon: '📅', title: 'Books into your live calendar', desc: 'Checks your real availability and books confirmed slots. Allocates the right amount of time based on garden size and job type.' },
              { icon: '📱', title: 'Texts you every detail', desc: 'After every call you get a text with the customer name, address, what they need, and when they are booked in. Check it when you stop for a brew.' },
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

      {/* BOOKABLE vs ESTIMATE */}
      <section className="py-14 px-6 md:px-10 bg-white border-t border-b border-[#e5e0da]">
        <div className="max-w-[820px] mx-auto">
          <h2 className="text-[26px] font-bold text-[#1a2e3b] mb-6">It knows which jobs to book and which need an estimate</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-[#f0fdf4] rounded-xl px-6 py-5 border border-[#bbf7d0]">
              <p className="text-[15px] font-bold text-[#059669] mb-3">Books directly</p>
              <div className="text-[14px] text-[#5a7184] space-y-2">
                <p>Lawn mowing · Hedge trimming · Garden clearance · Pressure washing · Leaf clearing · Regular maintenance</p>
                <p className="font-semibold text-[#059669] mt-3">Checks your calendar → books a slot → texts you both a confirmation.</p>
              </div>
            </div>
            <div className="bg-[#eff6ff] rounded-xl px-6 py-5 border border-[#bfdbfe]">
              <p className="text-[15px] font-bold text-[#2563eb] mb-3">Arranges a free estimate</p>
              <div className="text-[14px] text-[#5a7184] space-y-2">
                <p>Patios · Decking · Fencing · Turfing · Garden design · Tree surgery · Drainage · Landscaping projects</p>
                <p className="font-semibold text-[#2563eb] mt-3">Collects all details → arranges an estimate visit → you arrive prepared with everything you need.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* PRICING THE AI KNOWS */}
      <section className="py-14 px-6 md:px-10">
        <div className="max-w-[820px] mx-auto">
          <h2 className="text-[26px] font-bold text-[#1a2e3b] mb-6">Your AI knows your pricing</h2>
          <p className="text-[15px] text-[#5a7184] mb-6">When a customer asks &quot;how much for a lawn mow?&quot;, it gives them a real answer.</p>
          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4">
            {[
              { job: 'Lawn mowing', price: '£25-50', note: 'Standard garden' },
              { job: 'Hedge trimming', price: '£50-150', note: 'Depends on size and access' },
              { job: 'Garden clearance', price: '£100-350', note: 'Half day to full day' },
              { job: 'Tree trimming', price: '£150-500', note: 'Depends on size' },
              { job: 'Fencing (per panel)', price: '£80-150', note: 'Supplied and fitted' },
              { job: 'Patio / decking', price: 'Free estimate', note: 'Site visit required' },
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
          <h2 className="text-[26px] font-bold text-[#1a2e3b] mb-6">Common questions from landscapers</h2>
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
          <h2 className="text-[28px] font-bold text-[#1a2e3b] mb-4">Stop losing garden jobs to missed calls</h2>
          <p className="text-[16px] text-[#5a7184] mb-8">Your AI receptionist answers every call, qualifies the job, and books it — while you focus on the garden in front of you.</p>
          <Link href="/onboarding" className="inline-block bg-[#e8930c] text-white px-10 py-4 rounded-lg text-lg font-bold no-underline hover:bg-[#d17f00] transition-colors shadow-[0_2px_8px_rgba(232,147,12,0.3)]">
            Start Your Free Trial
          </Link>
          <p className="text-[13px] text-[#94a7b8] mt-4">From £69/month · Live in a day · Cancel anytime</p>
        </div>
      </section>
    </>
  );
}
