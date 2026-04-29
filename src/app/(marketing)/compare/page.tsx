import { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'AI Receptionist vs Answering Service for Plumbers UK | Supportive AI',
  description: 'Compare AI phone answering vs traditional answering services for plumbing businesses. Real costs, features, and what actually books jobs.',
};

export default function ComparePage() {
  return (
    <>
      <section className="pt-16 pb-10 px-6 md:px-10 max-w-[820px] mx-auto">
        <p className="text-[13px] font-semibold text-[#e8930c] uppercase tracking-wider mb-3">Honest comparison</p>
        <h1 className="text-[36px] md:text-[44px] font-extrabold text-[#1a2e3b] leading-[1.15] mb-5 tracking-tight">AI receptionist vs answering service: what actually books plumbing jobs?</h1>
        <p className="text-lg text-[#5a7184] leading-relaxed max-w-[620px] mb-8">Traditional answering services take messages. You call back hours later. The customer has already booked someone else. Here is how AI changes that.</p>
      </section>

      <section className="px-6 md:px-10 pb-14">
        <div className="max-w-[820px] mx-auto overflow-x-auto">
          <table className="w-full text-[14px]">
            <thead><tr className="border-b-2 border-[#1a2e3b]">
              <th className="text-left py-4 pr-4 text-[#1a2e3b] font-bold w-[30%]">Feature</th>
              <th className="text-center py-4 px-3 font-bold text-[#1a2e3b] bg-[#fef9f0] rounded-t-lg">Supportive AI<br/><span className="text-[11px] font-normal text-[#e8930c]">from £69/month</span></th>
              <th className="text-center py-4 px-3 text-[#5a7184] font-semibold">Human answering<br/><span className="text-[11px] font-normal">£200-400/month</span></th>
              <th className="text-center py-4 px-3 text-[#94a7b8] font-semibold">Voicemail<br/><span className="text-[11px] font-normal">Free</span></th>
            </tr></thead>
            <tbody className="text-[13px]">
              {[
                ['Answers the call', '✅ Instantly, 24/7', '✅ During staffed hours', '❌ Records a message'],
                ['Books into your calendar', '✅ Live availability check', '❌ Takes a message', '❌'],
                ['Handles pricing questions', '✅ Knows your rates', '❌ "Someone will call back"', '❌'],
                ['Sends confirmation texts', '✅ To you and the customer', '❌ Email summary only', '❌'],
                ['Emergency detection', '✅ Instant SMS escalation', '⚠️ Depends on training', '❌'],
                ['Multiple calls at once', '✅ Unlimited parallel', '❌ One at a time', '✅ But nobody answers'],
                ['Per-minute charges', 'None - flat rate', '£1-2 per minute', 'None'],
                ['Nights and weekends', '✅ No extra cost', '💰 Premium rates', '✅'],
                ['Setup time', '1 day', '1-2 weeks', 'Already on'],
              ].map((row, i) => (
                <tr key={i} className="border-b border-[#e5e0da]">
                  <td className="py-3 pr-4 font-semibold text-[#1a2e3b]">{row[0]}</td>
                  <td className="py-3 px-3 text-center bg-[#fef9f0]">{row[1]}</td>
                  <td className="py-3 px-3 text-center text-[#5a7184]">{row[2]}</td>
                  <td className="py-3 px-3 text-center text-[#94a7b8]">{row[3]}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="py-14 px-6 md:px-10 bg-white border-t border-b border-[#e5e0da]">
        <div className="max-w-[820px] mx-auto">
          <h2 className="text-[26px] font-bold text-[#1a2e3b] mb-6">The real cost of each option</h2>
          <div className="grid md:grid-cols-3 gap-5">
            <div className="bg-[#fef9f0] rounded-xl px-5 py-5 border-2 border-[#e8930c]">
              <p className="text-[13px] font-bold text-[#e8930c] uppercase tracking-wider mb-1">Supportive AI</p>
              <p className="text-[28px] font-extrabold text-[#1a2e3b] mb-2">£69<span className="text-[16px] font-normal text-[#5a7184]">/month</span></p>
              <p className="text-[13px] text-[#5a7184]">40 calls/mo. No per-minute charges. No setup fee. = <strong className="text-[#1a2e3b]">£828/year</strong></p>
            </div>
            <div className="bg-[#faf9f7] rounded-xl px-5 py-5 border border-[#e5e0da]">
              <p className="text-[13px] font-bold text-[#5a7184] uppercase tracking-wider mb-1">Human answering</p>
              <p className="text-[28px] font-extrabold text-[#1a2e3b] mb-2">£250<span className="text-[16px] font-normal text-[#5a7184]">/month avg</span></p>
              <p className="text-[13px] text-[#5a7184]">~100 minutes. +£1.50/min overage. After-hours + holiday surcharge. = <strong className="text-[#1a2e3b]">£3,000-5,000/year</strong></p>
            </div>
            <div className="bg-[#faf9f7] rounded-xl px-5 py-5 border border-[#e5e0da]">
              <p className="text-[13px] font-bold text-[#5a7184] uppercase tracking-wider mb-1">Receptionist hire</p>
              <p className="text-[28px] font-extrabold text-[#1a2e3b] mb-2">£2,000<span className="text-[16px] font-normal text-[#5a7184]">/month avg</span></p>
              <p className="text-[13px] text-[#5a7184]">£22-28k salary +NI +holidays. Mon-Fri 9-5 only. = <strong className="text-[#1a2e3b]">£28,000+/year</strong></p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-14 px-6 md:px-10">
        <div className="max-w-[820px] mx-auto">
          <h2 className="text-[26px] font-bold text-[#1a2e3b] mb-4">The difference between a message and a booking</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-[#faf9f7] rounded-xl px-6 py-5 border border-[#e5e0da]">
              <p className="text-[15px] font-bold text-[#94a7b8] mb-3">Answering service</p>
              <div className="space-y-2 text-[14px] text-[#5a7184]">
                <p>10:14am - Customer calls about a leaky tap</p>
                <p>10:17am - Receptionist takes a message</p>
                <p>12:30pm - Plumber sees email on lunch break</p>
                <p>12:45pm - Plumber calls customer back</p>
                <p className="text-[#dc2626] font-semibold">12:45pm - Customer already booked someone else</p>
              </div>
            </div>
            <div className="bg-[#f0fdf4] rounded-xl px-6 py-5 border border-[#bbf7d0]">
              <p className="text-[15px] font-bold text-[#059669] mb-3">Supportive AI</p>
              <div className="space-y-2 text-[14px] text-[#5a7184]">
                <p>10:14am - Customer calls about a leaky tap</p>
                <p>10:15am - AI checks calendar, offers Thursday 1pm</p>
                <p>10:16am - Customer confirms</p>
                <p>10:16am - Job booked. Texts sent to both sides.</p>
                <p className="text-[#059669] font-semibold">10:16am - Job locked in. Customer sorted.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-10 px-6 md:px-10"><div className="max-w-[820px] mx-auto"><h2 className="text-[18px] font-bold text-[#1a2e3b] mb-4">Related</h2><div className="grid sm:grid-cols-2 gap-3">
        <Link href="/blog/phone-answering-service-cost-plumber-2026" className="bg-[#faf9f7] rounded-xl px-4 py-3 border border-[#e5e0da] no-underline hover:border-[#e8930c] block"><p className="text-[13px] font-bold text-[#1a2e3b]">Phone answering cost breakdown 2026</p><p className="text-[11px] text-[#94a7b8]">Blog · 6 min</p></Link>
        <Link href="/pricing" className="bg-[#faf9f7] rounded-xl px-4 py-3 border border-[#e5e0da] no-underline hover:border-[#e8930c] block"><p className="text-[13px] font-bold text-[#1a2e3b]">Transparent pricing from £69/month</p><p className="text-[11px] text-[#94a7b8]">Pricing</p></Link>
        <Link href="/ai-receptionist-for-plumbers" className="bg-[#faf9f7] rounded-xl px-4 py-3 border border-[#e5e0da] no-underline hover:border-[#e8930c] block"><p className="text-[13px] font-bold text-[#1a2e3b]">AI receptionist for plumbers</p><p className="text-[11px] text-[#94a7b8]">Industry</p></Link>
        <Link href="/ai-receptionist-for-electricians" className="bg-[#faf9f7] rounded-xl px-4 py-3 border border-[#e5e0da] no-underline hover:border-[#e8930c] block"><p className="text-[13px] font-bold text-[#1a2e3b]">AI receptionist for electricians</p><p className="text-[11px] text-[#94a7b8]">Industry</p></Link>
      </div></div></section>

      <section className="py-14 px-6 md:px-10 bg-white border-t border-[#e5e0da] text-center">
        <div className="max-w-lg mx-auto">
          <h2 className="text-[26px] font-extrabold text-[#1a2e3b] mb-3">Ready to stop losing jobs to voicemail?</h2>
          <p className="text-[16px] text-[#5a7184] mb-8">Hear how it sounds for your business. Free trial, no setup fee, cancel anytime.</p>
          <Link href="/onboarding" className="inline-block bg-[#e8930c] text-white px-8 py-4 rounded-xl text-[17px] font-bold no-underline hover:bg-[#d17f00] transition-colors shadow-[0_2px_8px_rgba(232,147,12,0.3)]">Start Your Free Trial</Link>
          <p className="text-[13px] text-[#94a7b8] mt-4">From £69/month · No per-minute charges</p>
        </div>
      </section>
    </>
  );
}
