import { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'AI Receptionist for Trade Franchises UK | Supportive AI',
  description: 'One setup, every location covered. AI phone answering for plumbing, electrical, and HVAC franchises. Postcode routing, per-location calendars.',
};

export default function ForTradeFranchises() {
  return (
    <>
      <section className="pt-16 pb-10 px-6 md:px-10 max-w-[820px] mx-auto text-center">
        <p className="text-[13px] font-semibold text-[#e8930c] uppercase tracking-wider mb-3">For franchise operators</p>
        <h1 className="text-[36px] md:text-[44px] font-extrabold text-[#1a2e3b] leading-[1.15] mb-5 tracking-tight">One AI receptionist per location. One dashboard for you.</h1>
        <p className="text-lg text-[#5a7184] leading-relaxed max-w-[620px] mx-auto mb-8">Every franchisee gets their own phone answering, calendar booking, and SMS confirmations. You get central visibility across all locations.</p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center mb-4">
          <a href="mailto:lars@supportive-ai.com?subject=Franchise enquiry" className="bg-[#e8930c] text-white px-8 py-[15px] rounded-lg text-base font-bold no-underline hover:bg-[#d17f00] transition-colors shadow-[0_2px_8px_rgba(232,147,12,0.3)]">Talk to Us</a>
          <Link href="/demo" className="bg-white text-[#1a2e3b] px-8 py-[15px] rounded-lg text-base font-semibold border border-[#d1ccc6] no-underline hover:bg-[#f0eeeb] transition-colors">Hear the Demo</Link>
        </div>
      </section>

      <section className="py-14 px-6 md:px-10 bg-white border-t border-b border-[#e5e0da]">
        <div className="max-w-[820px] mx-auto">
          <h2 className="text-[26px] font-bold text-[#1a2e3b] mb-4">The franchise phone problem</h2>
          <div className="text-[16px] text-[#5a7184] leading-relaxed space-y-4">
            <p>You have 10, 50, or 100 locations. Each franchisee handles their own calls. Some answer professionally. Some miss half their calls. The brand experience is inconsistent.</p>
            <p className="text-[#1a2e3b] font-semibold">Supportive AI gives every location the same professional phone answering - with central control for you.</p>
          </div>
        </div>
      </section>

      <section className="py-14 px-6 md:px-10">
        <div className="max-w-[820px] mx-auto">
          <h2 className="text-[26px] font-bold text-[#1a2e3b] mb-6">How it works at scale</h2>
          <div className="grid sm:grid-cols-2 gap-5">
            {[
              { icon: '📍', title: 'Per-location setup', desc: 'Each franchisee gets their own AI receptionist with local number, service area, pricing, and calendar. Takes minutes to provision.' },
              { icon: '🗺️', title: 'Postcode routing', desc: 'Calls are routed to the right location based on caller postcode. No wrong area, no confused transfers.' },
              { icon: '📅', title: 'Individual calendars', desc: 'Each location has their own calendar with their own availability. Jobs book into the right diary automatically.' },
              { icon: '📊', title: 'Central dashboard', desc: 'You see every call, every booking, every missed opportunity across all locations.' },
              { icon: '🎨', title: 'Brand consistency', desc: 'Same greeting, same tone, same quality across every location.' },
              { icon: '⚡', title: 'Fast rollout', desc: 'New location? Provisioned in minutes. AI receptionist, phone number, and calendar on day one.' },
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

      <section className="py-14 px-6 md:px-10 bg-white border-t border-b border-[#e5e0da]">
        <div className="max-w-[820px] mx-auto">
          <h2 className="text-[26px] font-bold text-[#1a2e3b] mb-6">The economics at scale</h2>
          <div className="grid md:grid-cols-3 gap-5">
            <div className="bg-[#faf9f7] rounded-xl px-5 py-5 border border-[#e5e0da]">
              <p className="text-[13px] font-bold text-[#5a7184] uppercase tracking-wider mb-1">Receptionist per location</p>
              <p className="text-[28px] font-extrabold text-[#1a2e3b]">£24,000<span className="text-[14px] font-normal text-[#5a7184]">/year</span></p>
              <p className="text-[13px] text-[#5a7184] mt-2">10 locations = £240,000/year. Plus NI, holidays, sick days. Mon-Fri 9-5 only.</p>
            </div>
            <div className="bg-[#faf9f7] rounded-xl px-5 py-5 border border-[#e5e0da]">
              <p className="text-[13px] font-bold text-[#5a7184] uppercase tracking-wider mb-1">Answering service</p>
              <p className="text-[28px] font-extrabold text-[#1a2e3b]">£250<span className="text-[14px] font-normal text-[#5a7184]">/mo/location</span></p>
              <p className="text-[13px] text-[#5a7184] mt-2">10 locations = £30,000/year. Per-minute overage. Takes messages only.</p>
            </div>
            <div className="bg-[#f0fdf4] rounded-xl px-5 py-5 border-2 border-[#059669]">
              <p className="text-[13px] font-bold text-[#059669] uppercase tracking-wider mb-1">Supportive AI</p>
              <p className="text-[28px] font-extrabold text-[#059669]">£69<span className="text-[14px] font-normal text-[#5a7184]">/mo/location</span></p>
              <p className="text-[13px] text-[#5a7184] mt-2">10 locations = £8,280/year. Unlimited calls. Actual bookings. 24/7. Volume discounts available.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-10 px-6 md:px-10"><div className="max-w-[820px] mx-auto"><h2 className="text-[18px] font-bold text-[#1a2e3b] mb-4">Related</h2><div className="grid sm:grid-cols-2 gap-3">
        <Link href="/for-checkatrade-businesses" className="bg-[#faf9f7] rounded-xl px-4 py-3 border border-[#e5e0da] no-underline hover:border-[#e8930c] block"><p className="text-[13px] font-bold text-[#1a2e3b]">AI receptionist for Checkatrade businesses</p><p className="text-[11px] text-[#94a7b8]">Industry</p></Link>
        <Link href="/case-studies" className="bg-[#faf9f7] rounded-xl px-4 py-3 border border-[#e5e0da] no-underline hover:border-[#e8930c] block"><p className="text-[13px] font-bold text-[#1a2e3b]">Real call scenarios handled by the AI</p><p className="text-[11px] text-[#94a7b8]">Case studies</p></Link>
        <Link href="/pricing" className="bg-[#faf9f7] rounded-xl px-4 py-3 border border-[#e5e0da] no-underline hover:border-[#e8930c] block"><p className="text-[13px] font-bold text-[#1a2e3b]">Transparent pricing from £69/month</p><p className="text-[11px] text-[#94a7b8]">Pricing</p></Link>
        <Link href="/how-it-works" className="bg-[#faf9f7] rounded-xl px-4 py-3 border border-[#e5e0da] no-underline hover:border-[#e8930c] block"><p className="text-[13px] font-bold text-[#1a2e3b]">How it works — 3 step setup</p><p className="text-[11px] text-[#94a7b8]">How it works</p></Link>
      </div></div></section>

      <section className="py-14 px-6 md:px-10 text-center">
        <div className="max-w-lg mx-auto">
          <h2 className="text-[26px] font-extrabold text-[#1a2e3b] mb-3">Let&apos;s talk about your network</h2>
          <p className="text-[16px] text-[#5a7184] mb-8">Whether you have 5 locations or 500, we can set up a pilot in days. Volume pricing available.</p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <a href="mailto:lars@supportive-ai.com?subject=Franchise enquiry" className="bg-[#e8930c] text-white px-8 py-4 rounded-xl text-[17px] font-bold no-underline hover:bg-[#d17f00] transition-colors shadow-[0_2px_8px_rgba(232,147,12,0.3)]">Email Lars Directly</a>
            <a href="tel:+447414153843" className="bg-white text-[#1a2e3b] px-8 py-4 rounded-xl text-[17px] font-bold border-2 border-[#1a2e3b] no-underline hover:bg-[#1a2e3b] hover:text-white transition-colors">Call +44 7414 153843</a>
          </div>
        </div>
      </section>
    </>
  );
}
