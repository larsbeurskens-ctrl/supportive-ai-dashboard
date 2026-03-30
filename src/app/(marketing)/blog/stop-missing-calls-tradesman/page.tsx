import { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'How to Stop Missing Calls When You Are on a Job | Supportive AI',
  description: 'UK tradespeople lose thousands every year to missed calls. Compare voicemail, answering services, and AI receptionists to find the best solution for your trade business.',
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Article",
  "headline": "How to Stop Missing Calls When You Are on a Job",
  "description": "UK tradespeople lose thousands every year to missed calls. Compare voicemail, answering services, and AI receptionists.",
  "author": { "@type": "Person", "name": "Lars Beurskens" },
  "publisher": { "@type": "Organization", "name": "Supportive AI", "url": "https://supportive-ai.com" },
  "datePublished": "2026-03-30",
  "url": "https://supportive-ai.com/blog/stop-missing-calls-tradesman",
};

export default function BlogPost() {
  return (
    <article className="pt-16 pb-14 px-6 md:px-10">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <div className="max-w-[680px] mx-auto">
        <div className="mb-10">
          <p className="text-[13px] font-semibold text-[#e8930c] uppercase tracking-wider mb-3">Blog</p>
          <h1 className="text-[32px] md:text-[40px] font-extrabold text-[#1a2e3b] leading-[1.15] mb-4 tracking-tight">
            How to stop missing calls when you are on a job
          </h1>
          <p className="text-[15px] text-[#94a7b8]">March 30, 2026 · 5 min read</p>
        </div>

        <div className="prose-custom space-y-5 text-[16px] text-[#3a4f5e] leading-[1.8]">
          <p>If you are a plumber, electrician, or any tradesperson who works with your hands, you already know the problem. Your phone rings while you are under a sink, up a ladder, mid-rewire, or driving between jobs. You cannot answer it. The customer does not leave a voicemail. They call the next tradesperson on Google.</p>

          <p>That job is gone in 30 seconds. And it happens 3-5 times a week for most trade businesses.</p>

          <h2 className="text-[24px] font-bold text-[#1a2e3b] mt-10 mb-4">What missed calls actually cost you</h2>

          <p>Research shows that 80% of callers will not leave a voicemail. Of those who do, 67% hang up the moment they hear a voicemail greeting. And 85% of people who cannot reach you on the first try will never call back.</p>

          <p>For a plumber with an average job value of £200, missing just 3 calls per week means roughly £1,200 per month in lost revenue. For an electrician averaging £250 per job, that number climbs to £1,500. Over a year, that is £14,000-18,000 walking out the door because nobody answered the phone.</p>

          <p>The irony is brutal: you are too busy doing the work to answer the call that would give you more work.</p>

          <h2 className="text-[24px] font-bold text-[#1a2e3b] mt-10 mb-4">Option 1: Voicemail</h2>

          <p>Free, already on your phone, and almost completely useless. Most callers will not leave a message. The ones who do often mumble their number or forget to mention what they actually need. By the time you call back two hours later, they have already booked someone else.</p>

          <p>Voicemail tells your customers: &quot;I am too busy for you right now. Maybe I will get back to you later.&quot; That is not the impression you want to make.</p>

          <h2 className="text-[24px] font-bold text-[#1a2e3b] mt-10 mb-4">Option 2: Traditional answering service</h2>

          <p>A human receptionist at a call centre answers your phone. They take a message - the caller&apos;s name, number, and what they need. They email it to you. You call the customer back when you are free.</p>

          <p>The problem: they take a message. They do not book a job. The customer still has to wait for your callback. By the time you ring them, the urgency has faded or they have already found someone else.</p>

          <p>Cost: £200-400 per month, plus per-minute overage charges. After-hours and weekends cost extra. Bank holidays cost double. And the receptionist can only handle one call at a time - if two customers ring within 30 seconds, one goes to voicemail anyway.</p>

          <h2 className="text-[24px] font-bold text-[#1a2e3b] mt-10 mb-4">Option 3: AI receptionist</h2>

          <p>This is the option that did not exist two years ago. An AI receptionist answers your calls with your business name, has a natural conversation with the customer, checks your live calendar, books the job, and texts both you and the customer a confirmation. The call ends and the job is locked in before you even check your phone.</p>

          <p>It handles pricing questions (&quot;Our call-out fee is £80, and that comes off the final bill if you go ahead with the work&quot;). It detects emergencies (&quot;That sounds urgent - let me get your details and have our electrician call you back within 10 minutes&quot;). It works 24/7 including evenings, weekends, and bank holidays at no extra cost.</p>

          <p>Cost: from £69 per month. Flat rate. No per-minute charges. No overage. No contract.</p>

          <p>The difference is not incremental. A traditional answering service takes a message. An AI receptionist books a job. One requires a callback. The other locks in the customer before they hang up.</p>

          <h2 className="text-[24px] font-bold text-[#1a2e3b] mt-10 mb-4">Which option actually works?</h2>

          <p>If your calls are mostly informational and you do not mind calling people back, voicemail might be enough. But if your customers are comparing quotes and calling multiple tradespeople, whoever answers first wins. And that is the reality for most plumbers, electricians, and trade businesses in the UK today.</p>

          <p>The maths is simple. At £69 per month, an AI receptionist costs £828 per year. If it catches just one extra job per month that you would have missed, it pays for itself many times over. Most users report 5-10 additional bookings per month.</p>

          <h2 className="text-[24px] font-bold text-[#1a2e3b] mt-10 mb-4">Related reading</h2>
          <div className="space-y-2 text-[15px]">
            <p>→ <Link href="/blog/phone-answering-service-cost-plumber-2026" className="text-[#1a6dca] underline">How much does a phone answering service cost for plumbers in 2026?</Link></p>
            <p>→ <Link href="/blog/electrician-misses-emergency-call" className="text-[#1a6dca] underline">What happens when an electrician misses an emergency call?</Link></p>
            <p>→ <Link href="/compare" className="text-[#1a6dca] underline">AI receptionist vs answering service vs voicemail — full comparison</Link></p>
            <p>→ <Link href="/missed-calls-calculator" className="text-[#1a6dca] underline">Calculate how much missed calls cost your business</Link></p>
          </div>
        </div>


        <div className="mt-12 bg-[#faf9f7] rounded-xl p-6 border border-[#e5e0da]">
          <h3 className="text-[18px] font-bold text-[#1a2e3b] mb-3">Want to hear what it sounds like?</h3>
          <p className="text-[15px] text-[#5a7184] mb-4">Call our live demo line and pretend you need a plumber or electrician. It is a real AI receptionist — not a recording.</p>
          <div className="flex flex-col sm:flex-row gap-3">
            <Link href="/demo" className="bg-[#e8930c] text-white px-6 py-3 rounded-lg text-[15px] font-bold no-underline hover:bg-[#d17f00] text-center">
              Try the Live Demo
            </Link>
            <Link href="/missed-calls-calculator" className="bg-white text-[#1a2e3b] px-6 py-3 rounded-lg text-[15px] font-semibold border border-[#d1ccc6] no-underline hover:bg-[#f0eeeb] text-center">
              Calculate Your Lost Revenue
            </Link>
          </div>
        </div>
      </div>
    </article>
  );
}
