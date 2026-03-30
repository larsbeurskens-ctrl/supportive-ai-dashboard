import { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'How Much Does a Phone Answering Service Cost for Plumbers in 2026? | Supportive AI',
  description: 'Compare the real cost of phone answering for UK plumbers: voicemail (free), human answering (£200-400/mo), AI receptionist (£69/mo), in-house receptionist (£24k/yr).',
};

export default function BlogPost() {
  return (
    <article className="pt-16 pb-14 px-6 md:px-10">
      <div className="max-w-[680px] mx-auto">
        <div className="mb-10">
          <p className="text-[13px] font-semibold text-[#e8930c] uppercase tracking-wider mb-3">Blog</p>
          <h1 className="text-[32px] md:text-[40px] font-extrabold text-[#1a2e3b] leading-[1.15] mb-4 tracking-tight">
            How much does a phone answering service cost for plumbers in 2026?
          </h1>
          <p className="text-[15px] text-[#94a7b8]">March 30, 2026 · 6 min read</p>
        </div>

        <div className="prose-custom space-y-5 text-[16px] text-[#3a4f5e] leading-[1.8]">
          <p>You are losing jobs to missed calls. You know it. The question is what to do about it without blowing your margins. Here is an honest breakdown of every option available to UK plumbers in 2026, with real numbers.</p>

          <h2 className="text-[24px] font-bold text-[#1a2e3b] mt-10 mb-4">Option 1: Voicemail — £0/month</h2>

          <p>Free. Already on your phone. And almost entirely ineffective. Research consistently shows that 80% of callers will not leave a voicemail. They call the next plumber instead. Voicemail is not really a phone answering solution. It is a missed-call notification that sometimes includes a garbled phone number.</p>

          <p><strong>True cost:</strong> £0 per month. But if you miss 3 jobs per week at £200 average, you are losing roughly £2,400 per month in revenue. The cheapest option is actually the most expensive.</p>

          <h2 className="text-[24px] font-bold text-[#1a2e3b] mt-10 mb-4">Option 2: Human answering service — £200-400/month</h2>

          <p>Companies like Moneypenny and AnswerConnect staff real humans who answer your phone with your business name. They take a message, email it to you, and the customer waits for your callback.</p>

          <p>The base price sounds reasonable, but the real cost is in the extras. Most services charge per minute (£1.00-1.50/min), so a busy plumber taking 30 calls a day racks up overages fast. After-hours, weekends, and bank holidays cost 50-100% more. And they can only handle one call at a time — if two customers ring within seconds, one goes to voicemail anyway.</p>

          <p><strong>True cost:</strong> £200-400 base plus £50-150 in overages. Realistic monthly spend: £250-550. And they take a message — they do not book the job.</p>

          <h2 className="text-[24px] font-bold text-[#1a2e3b] mt-10 mb-4">Option 3: Hire a receptionist — £24,000+/year</h2>

          <p>A full-time receptionist at minimum wage costs roughly £24,000 per year before employer NI, pension contributions, holiday pay, sick pay, and the desk and phone they need. Realistically, you are looking at £28,000-32,000 all-in for a part-time to full-time admin person.</p>

          <p>They work 9-5 Monday to Friday. Evenings, weekends, and bank holidays? Back to voicemail. Sick day? Voicemail. Lunch break? Voicemail. For a solo plumber or a small team, the maths does not work.</p>

          <p><strong>True cost:</strong> £2,000-2,700 per month. Covers 40 hours per week only. You still need a solution for the other 128 hours.</p>

          <h2 className="text-[24px] font-bold text-[#1a2e3b] mt-10 mb-4">Option 4: AI receptionist — £69-149/month</h2>

          <p>This is the newest option. An AI receptionist answers your phone, has a natural conversation with the customer, checks your live calendar, books the job, and texts both you and the customer a confirmation. It handles pricing questions, detects emergencies, and works 24/7 at no extra cost.</p>

          <p>No per-minute charges. No overage fees. No contract. Flat monthly rate. And unlike a human answering service, it does not just take a message — it books the job before the customer hangs up.</p>

          <p><strong>True cost:</strong> £69-149 per month. That is £828-1,788 per year. No hidden fees. Cancel anytime.</p>

          <h2 className="text-[24px] font-bold text-[#1a2e3b] mt-10 mb-4">The comparison</h2>

          <div className="overflow-x-auto -mx-2">
            <table className="w-full text-[14px] border-collapse">
              <thead>
                <tr className="border-b-2 border-[#e5e0da]">
                  <th className="text-left py-3 px-2 text-[#1a2e3b] font-bold">Option</th>
                  <th className="text-left py-3 px-2 text-[#1a2e3b] font-bold">Monthly cost</th>
                  <th className="text-left py-3 px-2 text-[#1a2e3b] font-bold">Books jobs?</th>
                  <th className="text-left py-3 px-2 text-[#1a2e3b] font-bold">24/7?</th>
                </tr>
              </thead>
              <tbody className="text-[#5a7184]">
                <tr className="border-b border-[#e5e0da]"><td className="py-2 px-2">Voicemail</td><td className="py-2 px-2">£0</td><td className="py-2 px-2">No</td><td className="py-2 px-2">Yes</td></tr>
                <tr className="border-b border-[#e5e0da]"><td className="py-2 px-2">Human answering</td><td className="py-2 px-2">£250-550</td><td className="py-2 px-2">No</td><td className="py-2 px-2">Extra cost</td></tr>
                <tr className="border-b border-[#e5e0da]"><td className="py-2 px-2">Hire receptionist</td><td className="py-2 px-2">£2,000+</td><td className="py-2 px-2">Yes</td><td className="py-2 px-2">No</td></tr>
                <tr className="border-b border-[#e5e0da] bg-[#fffbf5]"><td className="py-2 px-2 font-semibold text-[#1a2e3b]">AI receptionist</td><td className="py-2 px-2 font-semibold text-[#e8930c]">£69-149</td><td className="py-2 px-2 font-semibold text-[#059669]">Yes</td><td className="py-2 px-2 font-semibold text-[#059669]">Yes</td></tr>
              </tbody>
            </table>
          </div>


          <h2 className="text-[24px] font-bold text-[#1a2e3b] mt-10 mb-4">The bottom line</h2>

          <p>For a solo plumber or small team, the economics are clear. A human answering service costs 3-5x more than an AI receptionist and does less (takes messages vs books jobs). A hired receptionist costs 15-20x more and only covers business hours. Voicemail costs nothing and achieves nothing.</p>

          <p>An AI receptionist at £69 per month pays for itself if it catches one extra job per month. Most plumbers report it catches 5-10. The ROI is not close.</p>
        </div>

        <div className="mt-12 bg-[#faf9f7] rounded-xl p-6 border border-[#e5e0da]">
          <h3 className="text-[18px] font-bold text-[#1a2e3b] mb-3">See pricing in detail</h3>
          <p className="text-[15px] text-[#5a7184] mb-4">Transparent pricing, no hidden fees, no per-minute charges. Compare our plans and start a free 7-day trial.</p>
          <div className="flex flex-col sm:flex-row gap-3">
            <Link href="/pricing" className="bg-[#e8930c] text-white px-6 py-3 rounded-lg text-[15px] font-bold no-underline hover:bg-[#d17f00] text-center">
              View Pricing
            </Link>
            <Link href="/compare" className="bg-white text-[#1a2e3b] px-6 py-3 rounded-lg text-[15px] font-semibold border border-[#d1ccc6] no-underline hover:bg-[#f0eeeb] text-center">
              AI vs Answering Service
            </Link>
          </div>
        </div>
      </div>
    </article>
  );
}
