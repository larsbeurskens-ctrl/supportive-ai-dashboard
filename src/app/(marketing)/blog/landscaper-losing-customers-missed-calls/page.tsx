import { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Why Landscapers Are Losing £1,000+ Customers to Missed Calls | Supportive AI',
  description: 'A homeowner looking for regular lawn care is worth over £1,000 a year. Here is why most landscapers lose them before the first visit.',
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Article",
  "headline": "Why Landscapers Are Losing £1,000+ Customers to Missed Calls",
  "description": "A homeowner looking for regular lawn care is worth over £1,000 a year. Here is why most landscapers lose them before the first visit.",
  "author": { "@type": "Person", "name": "Lars Beurskens" },
  "publisher": { "@type": "Organization", "name": "Supportive AI", "url": "https://supportive-ai.com" },
  "datePublished": "2026-04-03",
  "url": "https://supportive-ai.com/blog/landscaper-losing-customers-missed-calls",
};

export default function BlogPost() {
  return (
    <article className="pt-16 pb-14 px-6 md:px-10">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <div className="max-w-[680px] mx-auto">
        <div className="mb-10">
          <p className="text-[13px] font-semibold text-[#e8930c] uppercase tracking-wider mb-3">Blog</p>
          <h1 className="text-[32px] md:text-[40px] font-extrabold text-[#1a2e3b] leading-[1.15] mb-4 tracking-tight">
            Why landscapers are losing £1,000+ customers to missed calls
          </h1>
          <p className="text-[15px] text-[#94a7b8]">April 3, 2026 · 4 min read</p>
        </div>

        <div className="text-[16px] text-[#5a7184] leading-relaxed space-y-5">
          <p>A homeowner rings you on a Tuesday afternoon. They have just moved into a new house and the garden is a mess. They want someone to come and do a clearance, then take over the mowing every fortnight. It is exactly the kind of customer you want — regular, local, low-maintenance once you are set up.</p>

          <p>But you are on a ride-on mower. You cannot hear your phone over the engine. By the time you check your missed calls at 5pm, they have already booked the landscaper who answered on the second ring.</p>

          <p>That customer was worth £25-50 per visit, every two weeks, for years. That is over £1,000 a year in recurring revenue — lost because your phone rang while you were doing your job.</p>

          <h2 className="text-[22px] font-bold text-[#1a2e3b] mt-8 mb-3">Landscaping has the worst phone problem of any trade</h2>

          <p>Plumbers work indoors. Electricians work in quiet rooms. Landscapers work outside with loud equipment. Mowers, strimmers, hedge trimmers, chainsaws — you literally cannot hear your phone for most of the working day.</p>

          <p>And unlike emergency trades where the customer will try again (a burst pipe demands attention), garden work is discretionary. If someone is shopping for a landscaper, they are comparing 3-4 options. Whoever answers first and sounds professional wins the job. There is no callback. There is no voicemail. They just move on.</p>

          <h2 className="text-[22px] font-bold text-[#1a2e3b] mt-8 mb-3">The two types of call you are missing</h2>

          <p>Landscaping enquiries split into two categories, and an AI receptionist handles both differently.</p>

          <p>The first is maintenance work — lawn mowing, hedge trimming, garden tidying. These callers know what they want and just need a time slot. An AI can check your calendar and book them in directly. No callback needed. By the time you finish mowing, you have a new customer in your diary.</p>

          <p>The second is project work — patios, fencing, decking, garden redesigns. These callers need a quote, which means a site visit. An AI collects all the details — what they want, how big the garden is, access — and arranges a free estimate visit. You arrive knowing exactly what to expect.</p>

          <h2 className="text-[22px] font-bold text-[#1a2e3b] mt-8 mb-3">Regular customers are the business</h2>

          <p>Most landscapers know this instinctively: your best revenue comes from regulars. A fortnightly mowing round of 20 gardens is predictable, efficient, and profitable. But every one of those 20 customers started with a single phone call. If that first call goes to voicemail, the relationship never begins.</p>

          <p>An AI receptionist does not just answer that first call. It books the first visit and tells the caller &quot;after the first visit, the gardener will set up a regular schedule with you.&quot; It plants the seed of an ongoing relationship before you have even met the customer.</p>

          <h2 className="text-[22px] font-bold text-[#1a2e3b] mt-8 mb-3">The maths of one missed call per day</h2>

          <p>Say you miss one call per day — a conservative estimate for a busy landscaper. Not all of those would have converted, but research suggests around 40% of first-time callers become customers if they reach a real person. That is roughly 2-3 new customers per week.</p>

          <p>At £40 per regular visit, fortnightly, each customer is worth £1,040 per year. Miss 2 potential regulars per week and you are leaving over £100,000 in lifetime revenue on the table annually. Even if only a fraction of those would have stuck, the numbers are significant.</p>

          <div className="bg-[#faf9f7] rounded-xl px-6 py-5 border border-[#e5e0da] mt-10">
            <p className="text-[15px] font-bold text-[#1a2e3b] mb-2">Stop losing garden jobs to missed calls</p>
            <p className="text-[14px] text-[#5a7184] mb-4">Supportive AI answers every call, books maintenance jobs directly into your calendar, and arranges free estimates for bigger projects. From £69/month.</p>
            <Link href="/ai-receptionist-for-landscapers" className="inline-block bg-[#e8930c] text-white px-6 py-3 rounded-lg text-sm font-bold no-underline hover:bg-[#d17f00] transition-colors">
              See how it works for landscapers →
            </Link>
          </div>
        </div>
      </div>
    </article>
  );
}
