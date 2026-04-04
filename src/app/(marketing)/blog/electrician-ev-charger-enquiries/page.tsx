import Link from 'next/link';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'EV Charger Demand Is Surging — Are You Answering Every Enquiry? | Supportive AI',
  description: 'EV charger installations are the fastest-growing segment for UK electricians. Every missed call is an £800-1,500 job walking away.',
};

export default function BlogPost() {
  return (
    <article className="pt-16 pb-14 px-6 md:px-10">
      <div className="max-w-[680px] mx-auto">
        <div className="mb-10">
          <p className="text-[13px] font-semibold text-[#e8930c] uppercase tracking-wider mb-3">Blog</p>
          <h1 className="text-[32px] md:text-[40px] font-extrabold text-[#1a2e3b] leading-[1.15] mb-4 tracking-tight">EV charger demand is surging — are you answering every enquiry?</h1>
          <p className="text-[15px] text-[#94a7b8]">April 4, 2026 · 4 min read</p>
        </div>
        <div className="text-[16px] text-[#5a7184] leading-relaxed space-y-5">
          <p>The UK registered over 380,000 new electric vehicles in 2025. Every single one needs a home charger installed. At £800-1,500 per installation, this is the highest-value growth segment for UK electricians in a generation.</p>
          <p>But EV charger customers are not like your typical electrical clients. They are researching. They are comparing 3-4 installers. And they are making decisions fast — because the car is already on the driveway.</p>
          <h2 className="text-[22px] font-bold text-[#1a2e3b] mt-8 mb-3">The EV charger caller profile</h2>
          <p>The typical EV charger enquiry comes from someone who has just bought or ordered an electric car. They have already read about OZEV grants, they know roughly what a charger costs, and they want to book a site visit. They are calling during work hours — their lunch break, between meetings, on the way home.</p>
          <p>If you are mid-rewire or up a ladder, you miss the call. They call the next OZEV-approved installer. That £1,200 job is gone in 30 seconds.</p>
          <h2 className="text-[22px] font-bold text-[#1a2e3b] mt-8 mb-3">What your AI says when they call about an EV charger</h2>
          <p>It answers instantly. It confirms you install EV chargers, gives your price range, explains that a site visit is needed to give a precise quote, and books the visit into your calendar. The caller hangs up knowing exactly what happens next.</p>
          <p>It also asks the questions that help you prepare: what car they have, where they want the charger, how far from the consumer unit, and whether they have off-street parking. You arrive at the site visit with all the information you need.</p>
          <div className="bg-[#faf9f7] rounded-xl px-6 py-5 border border-[#e5e0da] mt-10">
            <p className="text-[15px] font-bold text-[#1a2e3b] mb-2">Capture every EV charger enquiry</p>
            <p className="text-[14px] text-[#5a7184] mb-4">Supportive AI answers every call, quotes your EV charger pricing, and books site visits. From £69/month.</p>
            <Link href="/ai-receptionist-for-electricians" className="inline-block bg-[#e8930c] text-white px-6 py-3 rounded-lg text-sm font-bold no-underline hover:bg-[#d17f00] transition-colors">See how it works for electricians →</Link>
          </div>
        </div>
      </div>
    </article>
  );
}
