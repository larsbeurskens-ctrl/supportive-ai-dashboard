import { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Blog — AI Receptionist for Trade Businesses | Supportive AI',
  description: 'Tips, guides, and insights on phone answering, missed calls, and AI receptionists for UK plumbers, electricians, and trade businesses.',
};

const POSTS: { href: string; title: string; excerpt: string; date: string; readTime: string; tag: string }[] = [
  { href: '/blog/stop-missing-calls-tradesman', title: 'How to stop missing calls when you are on a job', excerpt: 'Compare voicemail, answering services, and AI receptionists. Which one actually books the job while your hands are full?', date: 'March 30, 2026', readTime: '5 min', tag: 'All trades' },
  { href: '/blog/phone-answering-service-cost-plumber-2026', title: 'How much does a phone answering service cost for plumbers in 2026?', excerpt: 'An honest breakdown: voicemail, human answering, in-house receptionist, AI receptionist. Real UK pricing.', date: 'March 30, 2026', readTime: '6 min', tag: 'Plumbing' },
  { href: '/blog/electrician-misses-emergency-call', title: 'What happens when an electrician misses an emergency call?', excerpt: 'Burning smells, sparking sockets, total power loss. How AI handles safety-critical electrical calls differently.', date: 'March 30, 2026', readTime: '5 min', tag: 'Electrical' },
  { href: '/compare', title: 'AI receptionist vs answering service vs voicemail — which wins?', excerpt: 'Side-by-side comparison of cost, features, and what actually happens when a customer calls. With 12-month pricing timeline.', date: 'March 29, 2026', readTime: '7 min', tag: 'Comparison' },
  { href: '/case-studies', title: 'Real call scenarios: bookings, emergencies, and pricing questions', excerpt: 'Four real scenarios — evening call, pricing question, emergency leak, Saturday rush. See exactly how the AI responds.', date: 'March 29, 2026', readTime: '6 min', tag: 'Case studies' },
  { href: '/missed-calls-calculator', title: 'How much are missed calls costing your trade business?', excerpt: 'Interactive calculator. Plug in your numbers and see what you are actually losing to unanswered calls.', date: 'March 29, 2026', readTime: '3 min', tag: 'Tools' },
  { href: '/ai-receptionist-for-plumbers', title: 'AI receptionist built for UK plumbers — every feature explained', excerpt: 'Emergency leaks, pricing questions, calendar booking, SMS confirmations. With FAQ from real plumbers.', date: 'March 29, 2026', readTime: '8 min', tag: 'Plumbing' },
  { href: '/ai-receptionist-for-electricians', title: 'AI receptionist for electricians — safety-first call handling', excerpt: 'Part P language, EICR booking, EV charger enquiries, and emergency escalation that never gives DIY advice.', date: 'March 30, 2026', readTime: '8 min', tag: 'Electrical' },
  { href: '/ai-receptionist-for-hvac', title: 'AI receptionist for HVAC — handle the seasonal rush without hiring', excerpt: 'Boiler breakdowns in winter, AC installs in summer. How AI handles feast-or-famine HVAC call volume.', date: 'March 29, 2026', readTime: '6 min', tag: 'HVAC' },
  { href: '/guarantee', title: 'Our guarantee: 3 jobs in 30 days or your money back', excerpt: 'How the guarantee works, what counts as a job, and why we offer it. No small print.', date: 'March 29, 2026', readTime: '4 min', tag: 'Trust' },
  { href: '/for-checkatrade-businesses', title: 'Stop wasting Checkatrade leads you paid for but never answered', excerpt: 'You pay per Checkatrade lead. If you miss the call, that money is gone. Capture every single one.', date: 'March 29, 2026', readTime: '5 min', tag: 'All trades' },
  { href: '/for-trade-franchises', title: 'AI receptionist for trade franchises — one system, every location', excerpt: 'Postcode routing, multi-calendar support, branded greetings per branch. AI phone answering at scale.', date: 'March 29, 2026', readTime: '5 min', tag: 'Franchises' },
];

export default function BlogIndex() {
  return (
    <main className="pt-16 pb-14 px-6 md:px-10">
      <div className="max-w-[820px] mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-[36px] font-extrabold text-[#1a2e3b] mb-3">Blog</h1>
          <p className="text-[16px] text-[#5a7184]">Guides, comparisons, and insights for UK trade businesses on phone answering, missed calls, and AI receptionists.</p>
        </div>
        <div className="space-y-5">
          {POSTS.map((post, i) => (
            <Link key={i} href={post.href} className="block bg-white rounded-xl border border-[#e5e0da] px-6 py-5 no-underline hover:border-[#e8930c] hover:shadow-[0_2px_12px_rgba(232,147,12,0.1)] transition-all">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-[11px] font-bold text-[#e8930c] bg-[#fffbf5] px-2 py-0.5 rounded-full">{post.tag}</span>
                <span className="text-[12px] text-[#94a7b8]">{post.date} &middot; {post.readTime}</span>
              </div>
              <h2 className="text-[18px] font-bold text-[#1a2e3b] mb-2">{post.title}</h2>
              <p className="text-[14px] text-[#5a7184] leading-relaxed">{post.excerpt}</p>
            </Link>
          ))}
        </div>
      </div>
    </main>
  );
}
