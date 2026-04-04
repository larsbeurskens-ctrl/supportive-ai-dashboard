import Link from 'next/link';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'The Landscaper Seasonal Phone Problem — Spring Rush, Winter Silence | Supportive AI',
  description: 'In March your phone rings non-stop while you are on a mower. In December it barely rings. How to capture every spring lead without hiring.',
};

export default function BlogPost() {
  return (
    <article className="pt-16 pb-14 px-6 md:px-10">
      <div className="max-w-[680px] mx-auto">
        <div className="mb-10">
          <p className="text-[13px] font-semibold text-[#e8930c] uppercase tracking-wider mb-3">Blog</p>
          <h1 className="text-[32px] md:text-[40px] font-extrabold text-[#1a2e3b] leading-[1.15] mb-4 tracking-tight">The landscaper&apos;s seasonal phone problem — spring rush, winter silence</h1>
          <p className="text-[15px] text-[#94a7b8]">April 4, 2026 · 5 min read</p>
        </div>
        <div className="text-[16px] text-[#5a7184] leading-relaxed space-y-5">
          <p>Every UK landscaper knows the pattern. In January and February, the phone barely rings. You are catching up on maintenance, sharpening blades, maybe doing the odd clearance job. Then March hits and the floodgates open.</p>
          <p>Suddenly everyone wants their garden sorted. Mowing to start again. Hedges that have grown wild over winter. That patio they have been thinking about since last summer. Your phone rings constantly — while you are on your busiest jobs of the year.</p>
          <p>The spring rush is when you make your money. It is also when you miss the most calls. And every missed call in March is a customer you could have had on your regular round for the next 8 months.</p>
          <h2 className="text-[22px] font-bold text-[#1a2e3b] mt-8 mb-3">Why hiring a receptionist does not make sense</h2>
          <p>Some landscapers think about hiring someone to answer the phone during peak season. But the maths does not work. A part-time receptionist costs £800-1,200 per month. You need them for 4-5 months. Then they sit idle from November to February — or you let them go and start again next spring.</p>
          <p>An AI receptionist costs £69 per month year-round. It handles 3 calls a day or 30 — no difference. In the quiet months, it costs almost nothing. In the busy months, it pays for itself many times over.</p>

          <h2 className="text-[22px] font-bold text-[#1a2e3b] mt-8 mb-3">The March to May window</h2>
          <p>Those three months account for roughly 40% of new customer acquisition for the average UK landscaper. A homeowner who calls in March and starts fortnightly mowing will be on your round through October — seven months of regular income from one phone call.</p>
          <p>Miss that call in March, and you do not just lose one mowing visit. You lose the entire season with that customer. They sign up with someone else. They are happy. They never call you again.</p>

          <div className="bg-[#faf9f7] rounded-xl px-6 py-5 border border-[#e5e0da] mt-10">
            <p className="text-[15px] font-bold text-[#1a2e3b] mb-2">Capture every spring lead without hiring</p>
            <p className="text-[14px] text-[#5a7184] mb-4">Supportive AI answers every call in the rush and costs almost nothing in the quiet months. From £69/month.</p>
            <Link href="/ai-receptionist-for-landscapers" className="inline-block bg-[#e8930c] text-white px-6 py-3 rounded-lg text-sm font-bold no-underline hover:bg-[#d17f00] transition-colors">See how it works for landscapers →</Link>
          </div>
        </div>
      </div>
    </article>
  );
}
