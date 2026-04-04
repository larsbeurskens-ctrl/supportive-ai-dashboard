import Link from 'next/link';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'You Paid for Checkatrade Leads — Then Missed the Call | Supportive AI',
  description: 'The average Checkatrade lead costs £8-15. If your phone goes to voicemail, that money vanishes in 30 seconds.',
};

export default function BlogPost() {
  return (
    <article className="pt-16 pb-14 px-6 md:px-10">
      <div className="max-w-[680px] mx-auto">
        <div className="mb-10">
          <p className="text-[13px] font-semibold text-[#e8930c] uppercase tracking-wider mb-3">Blog</p>
          <h1 className="text-[32px] md:text-[40px] font-extrabold text-[#1a2e3b] leading-[1.15] mb-4 tracking-tight">You paid for Checkatrade leads — then missed the call</h1>
          <p className="text-[15px] text-[#94a7b8]">April 4, 2026 · 5 min read</p>
        </div>
        <div className="text-[16px] text-[#5a7184] leading-relaxed space-y-5">
          <p>You are paying Checkatrade, MyBuilder, or Bark somewhere between £8 and £15 per lead. That lead comes through as a phone call. Your phone rings while you are on a job. You miss it. The customer calls the next plumber on the list.</p>
          <p>That is not just a missed call. That is £8-15 you have already spent, generating zero return. Do that three times a week and you are burning £1,500-2,000 a year on leads you never even spoke to.</p>
          <h2 className="text-[22px] font-bold text-[#1a2e3b] mt-8 mb-3">The Checkatrade lead lifecycle</h2>
          <p>A homeowner searches for a plumber on Checkatrade. They see your profile, your reviews, your pricing. They tap &quot;Call.&quot; Your phone rings. You are under a boiler. It goes to voicemail. They hang up and tap &quot;Call&quot; on the next profile. That plumber answers. Job gone.</p>
          <p>The cruel part is that Checkatrade has already charged you for the lead. Whether you answer or not, you pay. The only variable is whether you convert it into revenue.</p>
          <h2 className="text-[22px] font-bold text-[#1a2e3b] mt-8 mb-3">Why AI answering changes the ROI on paid leads</h2>
          <p>An AI receptionist answers instantly — before the second ring. It sounds professional, asks about the issue, checks your calendar, and books the job. The Checkatrade customer gets the experience they expect from a top-rated tradesperson. You get a confirmed booking in your diary.</p>
          <p>Your Checkatrade spend stays the same. Your conversion rate doubles. That is the difference between paying £15 for a lead and paying £15 for a booked job worth £200.</p>
          <h2 className="text-[22px] font-bold text-[#1a2e3b] mt-8 mb-3">The maths on 10 Checkatrade leads a week</h2>
          <p>Say you get 10 leads a week at £12 each. That is £120 per week, £480 per month. If you answer 6 of those and convert 4, your cost-per-job is £120. If an AI answers all 10 and you convert 7, your cost-per-job drops to £69. Add the £69 AI subscription and you are still ahead — with 3 extra jobs per week.</p>
          <div className="bg-[#faf9f7] rounded-xl px-6 py-5 border border-[#e5e0da] mt-10">
            <p className="text-[15px] font-bold text-[#1a2e3b] mb-2">Stop wasting leads you already paid for</p>
            <p className="text-[14px] text-[#5a7184] mb-4">Supportive AI answers every Checkatrade, MyBuilder, and Bark call instantly. From £69/month.</p>
            <Link href="/ai-receptionist-for-plumbers" className="inline-block bg-[#e8930c] text-white px-6 py-3 rounded-lg text-sm font-bold no-underline hover:bg-[#d17f00] transition-colors">See how it works for plumbers →</Link>
          </div>
        </div>
      </div>
    </article>
  );
}
