'use client';

import { useState } from 'react';
import Link from 'next/link';

const TAGS = ['All', 'Plumbing', 'Electrical', 'Locksmith', 'Landscaping', 'HVAC', 'All trades', 'Guides'];

const POSTS: { href: string; title: string; excerpt: string; date: string; readTime: string; tag: string }[] = [
  // --- Plumbing ---
  { href: '/blog/phone-answering-service-cost-plumber-2026', title: 'How much does a phone answering service cost for plumbers in 2026?', excerpt: 'An honest breakdown: voicemail, human answering, in-house receptionist, AI receptionist. Real UK pricing compared.', date: 'March 30, 2026', readTime: '6 min', tag: 'Plumbing' },
  { href: '/blog/plumber-friday-afternoon-calls', title: '5 calls every UK plumber misses on a Friday afternoon', excerpt: 'Friday 3-5pm is peak call time for weekend emergencies. You are finishing a job. Your phone is ringing. Here is what you are losing.', date: 'April 4, 2026', readTime: '4 min', tag: 'Plumbing' },
  { href: '/blog/plumber-checkatrade-leads', title: 'You paid for Checkatrade leads — then missed the call', excerpt: 'The average Checkatrade lead costs £8-15. If your phone goes to voicemail, that money is gone in 30 seconds.', date: 'April 4, 2026', readTime: '5 min', tag: 'Plumbing' },
  { href: '/ai-receptionist-for-plumbers', title: 'AI receptionist built for UK plumbers — every feature explained', excerpt: 'Emergency leaks, pricing questions, calendar booking, SMS confirmations. With FAQ from real plumbers.', date: 'March 29, 2026', readTime: '8 min', tag: 'Plumbing' },
  // --- Electrical ---
  { href: '/blog/electrician-misses-emergency-call', title: 'What happens when an electrician misses an emergency call?', excerpt: 'Burning smells, sparking sockets, total power loss. How AI handles safety-critical electrical calls differently from voicemail.', date: 'March 30, 2026', readTime: '5 min', tag: 'Electrical' },
  { href: '/blog/electrician-ev-charger-enquiries', title: 'EV charger demand is surging — are you answering every enquiry?', excerpt: 'EV charger installations are the fastest-growing segment for UK electricians. Every missed call is an £800-1,500 job walking away.', date: 'April 4, 2026', readTime: '4 min', tag: 'Electrical' },
  { href: '/blog/electrician-part-p-calls', title: 'How AI handles Part P and certification questions on calls', excerpt: 'Callers ask about Part P, EICR certificates, and whether work is notifiable. Your AI answers confidently without you picking up.', date: 'April 4, 2026', readTime: '5 min', tag: 'Electrical' },
  { href: '/ai-receptionist-for-electricians', title: 'AI receptionist for electricians — safety-first call handling', excerpt: 'Part P language, EICR booking, EV charger enquiries, and emergency escalation that never gives DIY advice.', date: 'March 30, 2026', readTime: '8 min', tag: 'Electrical' },
  // --- Locksmith ---
  { href: '/blog/locksmith-missed-call-midnight', title: 'What happens when a locksmith misses a midnight call?', excerpt: 'Someone locked out at midnight calls 3 locksmiths. Whoever answers first gets the job. Here is what happens when you miss it.', date: 'April 3, 2026', readTime: '4 min', tag: 'Locksmith' },
  { href: '/blog/locksmith-pricing-calls', title: 'How much? — handling the pricing question on every locksmith call', excerpt: 'Every lockout caller asks the price before they commit. How your AI quotes confidently, sets expectations, and books the job.', date: 'April 4, 2026', readTime: '4 min', tag: 'Locksmith' },
  { href: '/ai-receptionist-for-locksmiths', title: 'AI receptionist for locksmiths — 24/7 lockout and emergency handling', excerpt: 'Midnight lockouts, break-in repairs, lock changes. Answers instantly, quotes your pricing, texts you the job.', date: 'April 3, 2026', readTime: '7 min', tag: 'Locksmith' },
  // --- Landscaping ---
  { href: '/blog/landscaper-losing-customers-missed-calls', title: 'Why landscapers are losing £1,000+ customers to missed calls', excerpt: 'A homeowner looking for regular lawn care is worth over £1,000 a year. Most landscapers lose them before the first visit.', date: 'April 3, 2026', readTime: '4 min', tag: 'Landscaping' },
  { href: '/blog/landscaper-seasonal-phone-problem', title: 'The landscaper seasonal phone problem — spring rush, winter silence', excerpt: 'In March your phone rings non-stop while you are on a mower. In December it barely rings at all. How to capture every spring lead.', date: 'April 4, 2026', readTime: '5 min', tag: 'Landscaping' },
  { href: '/ai-receptionist-for-landscapers', title: 'AI receptionist for landscapers — book jobs while you are on the mower', excerpt: 'Books maintenance directly, arranges free estimates for projects, handles regular service enquiries.', date: 'April 3, 2026', readTime: '7 min', tag: 'Landscaping' },
  // --- HVAC ---
  { href: '/ai-receptionist-for-hvac', title: 'AI receptionist for HVAC — handle the seasonal rush without hiring', excerpt: 'Boiler breakdowns in winter, AC installs in summer. How AI handles feast-or-famine HVAC call volume.', date: 'March 29, 2026', readTime: '6 min', tag: 'HVAC' },
  // --- All trades / Guides ---
  { href: '/blog/stop-missing-calls-tradesman', title: 'How to stop missing calls when you are on a job', excerpt: 'Compare voicemail, answering services, and AI receptionists. Which one actually books the job while your hands are full?', date: 'March 30, 2026', readTime: '5 min', tag: 'All trades' },
  { href: '/compare', title: 'AI receptionist vs answering service vs voicemail — which wins?', excerpt: 'Side-by-side comparison of cost, features, and what happens when a customer calls. With 12-month pricing timeline.', date: 'March 29, 2026', readTime: '7 min', tag: 'Guides' },
  { href: '/case-studies', title: 'Real call scenarios: bookings, emergencies, and pricing questions', excerpt: 'Four real scenarios — evening call, pricing question, emergency leak, Saturday rush. See exactly how the AI responds.', date: 'March 29, 2026', readTime: '6 min', tag: 'Guides' },
  { href: '/missed-calls-calculator', title: 'How much are missed calls costing your trade business?', excerpt: 'Interactive calculator. Plug in your numbers and see what you are actually losing to unanswered calls.', date: 'March 29, 2026', readTime: '3 min', tag: 'Guides' },
  { href: '/for-checkatrade-businesses', title: 'Stop wasting Checkatrade leads you paid for but never answered', excerpt: 'You pay per Checkatrade lead. If you miss the call, that money is gone. Capture every single one.', date: 'March 29, 2026', readTime: '5 min', tag: 'All trades' },
  { href: '/guarantee', title: 'Our guarantee: 3 jobs in 30 days or your money back', excerpt: 'How the guarantee works, what counts as a job, and why we offer it. No small print.', date: 'March 29, 2026', readTime: '4 min', tag: 'Guides' },
  { href: '/for-trade-franchises', title: 'AI receptionist for trade franchises — one system, every location', excerpt: 'Postcode routing, multi-calendar support, branded greetings per branch. AI phone answering at scale.', date: 'March 29, 2026', readTime: '5 min', tag: 'All trades' },
];

export default function BlogIndex() {
  const [activeTag, setActiveTag] = useState('All');
  const filtered = activeTag === 'All' ? POSTS : POSTS.filter(p => p.tag === activeTag);

  return (
    <main className="pt-16 pb-14 px-6 md:px-10">
      <div className="max-w-[820px] mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-[36px] font-extrabold text-[#1a2e3b] mb-3">Blog</h1>
          <p className="text-[16px] text-[#5a7184]">Guides, comparisons, and insights for UK trade businesses.</p>
        </div>

        {/* Filter buttons */}
        <div className="flex flex-wrap gap-2 mb-8 justify-center">
          {TAGS.map(tag => (
            <button
              key={tag}
              onClick={() => setActiveTag(tag)}
              className={`px-4 py-2 rounded-full text-[13px] font-semibold border transition-all cursor-pointer ${
                activeTag === tag
                  ? 'bg-[#e8930c] text-white border-[#e8930c]'
                  : 'bg-white text-[#5a7184] border-[#e5e0da] hover:border-[#e8930c] hover:text-[#e8930c]'
              }`}
            >
              {tag}
            </button>
          ))}
        </div>

        <div className="space-y-5">
          {filtered.map((post, i) => (
            <Link key={i} href={post.href} className="block bg-white rounded-xl border border-[#e5e0da] px-6 py-5 no-underline hover:border-[#e8930c] hover:shadow-[0_2px_12px_rgba(232,147,12,0.1)] transition-all">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-[11px] font-bold text-[#e8930c] bg-[#fffbf5] px-2 py-0.5 rounded-full">{post.tag}</span>
                <span className="text-[12px] text-[#94a7b8]">{post.date} &middot; {post.readTime}</span>
              </div>
              <h2 className="text-[18px] font-bold text-[#1a2e3b] mb-2">{post.title}</h2>
              <p className="text-[14px] text-[#5a7184] leading-relaxed">{post.excerpt}</p>
            </Link>
          ))}
          {filtered.length === 0 && (
            <p className="text-center text-[#94a7b8] py-10">No posts in this category yet. Check back soon.</p>
          )}
        </div>
      </div>
    </main>
  );
}
