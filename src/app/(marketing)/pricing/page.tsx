import { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Pricing - AI Receptionist for UK Trades | Supportive AI',
  description: 'Transparent pricing from £69/month. 40-250 calls included per plan, £1/call overage. No setup fee, no contracts. AI phone answering for plumbers, electricians, and trades.',
};

// Canonical pricing — must match HomePage.tsx and VerticalPage.tsx
// Source of truth: supportive-ai.com homepage tier display.
const TIERS = [
  {
    name: 'Starter',
    price: '£69',
    target: 'One-man crews',
    calls: '40 calls/mo',
    overage: '£1.75/call overage',
    features: [
      'AI answering — ideal for after-hours & missed calls',
      'Google Calendar booking',
      'SMS confirmations',
      'Keep your existing number',
      'Emergency escalation',
      'Junk call screening',
      'Dashboard & call history',
      'Call recordings & transcripts',
    ],
    popular: false,
  },
  {
    name: 'Standard',
    price: '£119',
    target: 'Busy trades businesses',
    calls: '150 calls/mo',
    overage: '£1.25/call overage',
    features: [
      'Everything in Starter',
      'WhatsApp AI agent',
      'Payment links (Stripe)',
      'Detailed call analytics',
    ],
    popular: true,
  },
  {
    name: 'Business',
    price: '£229',
    target: 'Multi-van operations',
    calls: '250 calls/mo',
    overage: '£1.00/call overage',
    features: [
      'Everything in Standard',
      'Priority support',
      'Multi-crew scheduling',
      'Review requests',
    ],
    popular: false,
  },
];

export default function PricingPage() {
  return (
    <>
      <section className="pt-16 pb-6 px-6 md:px-10 max-w-[820px] mx-auto text-center">
        <h1 className="text-[36px] md:text-[44px] font-extrabold text-[#1a2e3b] leading-[1.15] mb-5 tracking-tight">Simple, honest pricing</h1>
        <p className="text-lg text-[#5a7184] leading-relaxed max-w-[560px] mx-auto mb-4">No hidden fees. No per-seat pricing. One price, everything included.</p>
      </section>

      <section className="px-6 md:px-10 pb-14">
        <div className="max-w-[920px] mx-auto grid md:grid-cols-3 gap-5">
          {TIERS.map((tier) => (
            <div
              key={tier.name}
              className={
                tier.popular
                  ? 'bg-white rounded-2xl px-6 py-6 border-2 border-[#e8930c] relative'
                  : 'bg-[#faf9f7] rounded-2xl px-6 py-6 border border-[#e5e0da]'
              }
            >
              {tier.popular && (
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-[#e8930c] text-white text-[11px] font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                  Most popular
                </span>
              )}
              <p className={tier.popular ? 'text-[13px] font-bold text-[#e8930c] uppercase tracking-wider mb-1' : 'text-[13px] font-bold text-[#5a7184] uppercase tracking-wider mb-1'}>
                {tier.name}
              </p>
              <p className="text-[36px] font-extrabold text-[#1a2e3b] mb-1">
                {tier.price}<span className="text-[16px] font-normal text-[#5a7184]">/month</span>
              </p>
              <p className="text-[13px] text-[#94a7b8] mb-3">{tier.target}</p>
              <div className="mb-5">
                <p className="text-[14px] font-bold text-[#e8930c]">{tier.calls}</p>
                <p className="text-[12px] text-[#94a7b8]">{tier.overage}</p>
              </div>
              <ul className="space-y-2.5 text-[13px] text-[#5a7184] mb-6">
                {tier.features.map((f) => (
                  <li key={f} className="flex items-start gap-2">
                    <svg className="flex-shrink-0 mt-0.5" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#059669" strokeWidth="2.5"><polyline points="20 6 9 17 4 12" /></svg>
                    {f}
                  </li>
                ))}
              </ul>
              <Link
                href="/onboarding"
                className={
                  tier.popular
                    ? 'block text-center bg-[#e8930c] text-white px-6 py-3 rounded-lg text-[14px] font-bold no-underline hover:bg-[#d17f00] transition-colors shadow-[0_2px_8px_rgba(232,147,12,0.3)]'
                    : 'block text-center bg-white text-[#1a2e3b] px-6 py-3 rounded-lg text-[14px] font-bold no-underline border border-[#d1ccc6] hover:bg-[#f0eeeb] transition-colors'
                }
              >
                Start free trial
              </Link>
            </div>
          ))}
        </div>
        <p className="text-center text-[13px] text-[#94a7b8] mt-6 max-w-[820px] mx-auto">
          14-day free trial on all plans (up to 50 calls during the trial). No credit card required. No setup fees. Cancel anytime.
        </p>
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

      <section className="py-10 px-6 md:px-10"><div className="max-w-[820px] mx-auto"><h2 className="text-[18px] font-bold text-[#1a2e3b] mb-4">Related</h2><div className="grid sm:grid-cols-2 gap-3">
        <Link href="/blog/phone-answering-service-cost-plumber-2026" className="bg-[#faf9f7] rounded-xl px-4 py-3 border border-[#e5e0da] no-underline hover:border-[#e8930c] block"><p className="text-[13px] font-bold text-[#1a2e3b]">Phone answering cost breakdown 2026</p><p className="text-[11px] text-[#94a7b8]">Blog · 6 min</p></Link>
        <Link href="/compare" className="bg-[#faf9f7] rounded-xl px-4 py-3 border border-[#e5e0da] no-underline hover:border-[#e8930c] block"><p className="text-[13px] font-bold text-[#1a2e3b]">AI vs answering service vs voicemail</p><p className="text-[11px] text-[#94a7b8]">Comparison</p></Link>
        <Link href="/guarantee" className="bg-[#faf9f7] rounded-xl px-4 py-3 border border-[#e5e0da] no-underline hover:border-[#e8930c] block"><p className="text-[13px] font-bold text-[#1a2e3b]">3 jobs in 30 days or your money back</p><p className="text-[11px] text-[#94a7b8]">Guarantee</p></Link>
        <Link href="/missed-calls-calculator" className="bg-[#faf9f7] rounded-xl px-4 py-3 border border-[#e5e0da] no-underline hover:border-[#e8930c] block"><p className="text-[13px] font-bold text-[#1a2e3b]">Calculate your lost revenue</p><p className="text-[11px] text-[#94a7b8]">Calculator</p></Link>
      </div></div></section>

      <section className="py-14 px-6 md:px-10 text-center">
        <div className="max-w-lg mx-auto">
          <h2 className="text-[26px] font-extrabold text-[#1a2e3b] mb-3">Start your free trial today</h2>
          <p className="text-[16px] text-[#5a7184] mb-8">14 days free, up to 50 calls. No credit card needed. 15-minute setup call, live within a day.</p>
          <Link href="/onboarding" className="inline-block bg-[#e8930c] text-white px-8 py-4 rounded-xl text-[17px] font-bold no-underline hover:bg-[#d17f00] transition-colors shadow-[0_2px_8px_rgba(232,147,12,0.3)]">Start Your Free Trial</Link>
        </div>
      </section>
    </>
  );
}
