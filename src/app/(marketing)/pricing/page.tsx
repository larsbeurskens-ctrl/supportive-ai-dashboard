import { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Pricing - AI Receptionist for UK Trades | Supportive AI',
  description: 'Transparent pricing from £69/month. No per-minute charges, no setup fee, no contracts. AI phone answering for plumbers, electricians, and trades.',
};

export default function PricingPage() {
  return (
    <>
      <section className="pt-16 pb-6 px-6 md:px-10 max-w-[820px] mx-auto text-center">
        <h1 className="text-[36px] md:text-[44px] font-extrabold text-[#1a2e3b] leading-[1.15] mb-5 tracking-tight">Simple pricing. No surprises.</h1>
        <p className="text-lg text-[#5a7184] leading-relaxed max-w-[520px] mx-auto mb-4">One price. Unlimited calls. No per-minute charges. No setup fee. Cancel anytime.</p>
      </section>

      <section className="px-6 md:px-10 pb-14">
        <div className="max-w-[820px] mx-auto grid md:grid-cols-3 gap-5">
          <div className="bg-[#faf9f7] rounded-2xl px-6 py-6 border border-[#e5e0da]">
            <p className="text-[13px] font-bold text-[#5a7184] uppercase tracking-wider mb-1">Starter</p>
            <p className="text-[36px] font-extrabold text-[#1a2e3b] mb-1">£69<span className="text-[16px] font-normal text-[#5a7184]">/month</span></p>
            <p className="text-[13px] text-[#94a7b8] mb-5">For solo tradespeople and small teams</p>
            <ul className="space-y-2.5 text-[13px] text-[#5a7184] mb-6">
              {['24/7 call answering', 'Calendar booking with live availability', 'SMS confirmations (you + customer)', 'Emergency call detection + SMS alert', 'Pricing and FAQ handling', 'UK postcode + address validation', 'Call recordings and transcripts', 'Your business name and branding'].map((f, i) => (
                <li key={i} className="flex items-start gap-2"><svg className="flex-shrink-0 mt-0.5" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#059669" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg>{f}</li>
              ))}
            </ul>
            <Link href="/onboarding" className="block text-center bg-white text-[#1a2e3b] px-6 py-3 rounded-lg text-[14px] font-bold no-underline border border-[#d1ccc6] hover:bg-[#f0eeeb] transition-colors">Start free trial</Link>
          </div>
          <div className="bg-white rounded-2xl px-6 py-6 border-2 border-[#e8930c] relative">
            <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-[#e8930c] text-white text-[11px] font-bold px-3 py-1 rounded-full uppercase tracking-wider">Most popular</span>
            <p className="text-[13px] font-bold text-[#e8930c] uppercase tracking-wider mb-1">Standard</p>
            <p className="text-[36px] font-extrabold text-[#1a2e3b] mb-1">£149<span className="text-[16px] font-normal text-[#5a7184]">/month</span></p>
            <p className="text-[13px] text-[#94a7b8] mb-5">For growing trade businesses</p>
            <ul className="space-y-2.5 text-[13px] text-[#5a7184] mb-6">
              {['Everything in Starter', 'Multiple team members', 'Advanced call routing', 'Customer follow-up sequences', 'Priority support', 'Monthly performance report', 'Custom call scripts', 'Dedicated onboarding call'].map((f, i) => (
                <li key={i} className="flex items-start gap-2"><svg className="flex-shrink-0 mt-0.5" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#059669" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg>{f}</li>
              ))}
            </ul>
            <Link href="/onboarding" className="block text-center bg-[#e8930c] text-white px-6 py-3 rounded-lg text-[14px] font-bold no-underline hover:bg-[#d17f00] transition-colors shadow-[0_2px_8px_rgba(232,147,12,0.3)]">Start free trial</Link>
          </div>
          <div className="bg-[#faf9f7] rounded-2xl px-6 py-6 border border-[#e5e0da]">
            <p className="text-[13px] font-bold text-[#5a7184] uppercase tracking-wider mb-1">Business</p>
            <p className="text-[36px] font-extrabold text-[#1a2e3b] mb-1">£299<span className="text-[16px] font-normal text-[#5a7184]">/month</span></p>
            <p className="text-[13px] text-[#94a7b8] mb-5">For multi-van operations</p>
            <ul className="space-y-2.5 text-[13px] text-[#5a7184] mb-6">
              {['Everything in Standard', 'Unlimited team members', 'Multi-location routing', 'API access', 'Custom integrations', 'White-label option', 'Dedicated account manager', 'SLA guarantee'].map((f, i) => (
                <li key={i} className="flex items-start gap-2"><svg className="flex-shrink-0 mt-0.5" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#059669" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg>{f}</li>
              ))}
            </ul>
            <Link href="/onboarding" className="block text-center bg-white text-[#1a2e3b] px-6 py-3 rounded-lg text-[14px] font-bold no-underline border border-[#d1ccc6] hover:bg-[#f0eeeb] transition-colors">Start free trial</Link>
          </div>
        </div>
        <p className="text-center text-[13px] text-[#94a7b8] mt-6 max-w-[820px] mx-auto">All plans include a 7-day free trial. No credit card required to start. No setup fees. Cancel anytime.</p>
      </section>

      <section className="py-14 px-6 md:px-10 bg-white border-t border-b border-[#e5e0da]">
        <div className="max-w-[820px] mx-auto text-center">
          <h2 className="text-[26px] font-bold text-[#1a2e3b] mb-4">Does it pay for itself?</h2>
          <p className="text-[15px] text-[#5a7184] mb-8 max-w-[520px] mx-auto">If you miss just 2 calls a week that could have been jobs, you are losing more per month than the entire cost of Supportive AI for a year.</p>
          <div className="bg-[#faf9f7] rounded-2xl px-6 py-6 border border-[#e5e0da] max-w-[500px] mx-auto text-left">
            <div className="space-y-3 text-[14px] text-[#5a7184]">
              <div className="flex justify-between"><span>Missed calls per week</span><span className="font-bold text-[#1a2e3b]">2</span></div>
              <div className="flex justify-between"><span>Average job value</span><span className="font-bold text-[#1a2e3b]">£200</span></div>
              <div className="flex justify-between"><span>Conversion rate</span><span className="font-bold text-[#1a2e3b]">50%</span></div>
              <div className="flex justify-between border-t border-[#e5e0da] pt-3"><span>Lost revenue per month</span><span className="font-bold text-[#dc2626]">£800</span></div>
              <div className="flex justify-between"><span>Supportive AI cost</span><span className="font-bold text-[#059669]">£69</span></div>
              <div className="flex justify-between border-t border-[#e5e0da] pt-3 text-[16px]"><span className="font-bold text-[#1a2e3b]">ROI</span><span className="font-extrabold text-[#059669]">11x return</span></div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-14 px-6 md:px-10 text-center">
        <div className="max-w-lg mx-auto">
          <h2 className="text-[26px] font-extrabold text-[#1a2e3b] mb-3">Start your free trial today</h2>
          <p className="text-[16px] text-[#5a7184] mb-8">7 days free. No credit card needed. Set up in a day.</p>
          <Link href="/onboarding" className="inline-block bg-[#e8930c] text-white px-8 py-4 rounded-xl text-[17px] font-bold no-underline hover:bg-[#d17f00] transition-colors shadow-[0_2px_8px_rgba(232,147,12,0.3)]">Start Your Free Trial</Link>
        </div>
      </section>
    </>
  );
}
