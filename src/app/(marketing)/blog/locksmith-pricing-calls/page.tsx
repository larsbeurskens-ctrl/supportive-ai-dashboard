import Link from 'next/link';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'How Much? — Handling the Pricing Question on Every Locksmith Call | Supportive AI',
  description: 'Every lockout caller asks the price before they commit. How your AI quotes confidently, sets expectations, and books the job.',
};

export default function BlogPost() {
  return (
    <article className="pt-16 pb-14 px-6 md:px-10">
      <div className="max-w-[680px] mx-auto">
        <div className="mb-10">
          <p className="text-[13px] font-semibold text-[#e8930c] uppercase tracking-wider mb-3">Blog</p>
          <h1 className="text-[32px] md:text-[40px] font-extrabold text-[#1a2e3b] leading-[1.15] mb-4 tracking-tight">&quot;How much?&quot; — handling the pricing question on every locksmith call</h1>
          <p className="text-[15px] text-[#94a7b8]">April 4, 2026 · 4 min read</p>
        </div>
        <div className="text-[16px] text-[#5a7184] leading-relaxed space-y-5">
          <p>Every locksmith knows the question. Before a locked-out customer commits, before they give you their address, often before they even tell you the full situation — they ask: &quot;How much is it going to cost?&quot;</p>
          <p>If you are on a job and miss the call, the customer calls the next locksmith who picks up. But even when you do answer, the pricing conversation is delicate. Quote too high and they hang up. Quote too low and you are working for nothing. Dodge the question and they lose trust.</p>
          <h2 className="text-[22px] font-bold text-[#1a2e3b] mt-8 mb-3">The sweet spot: ranges with reassurance</h2>
          <p>The best locksmiths handle pricing the same way every time: give a range, explain what affects the final price, and reassure the customer there are no hidden charges. An AI receptionist does this identically on every call.</p>
          <p>&quot;For a standard lockout, you are typically looking at £70 to £120 depending on the type of lock. The locksmith will confirm the exact price when they arrive — no hidden charges, no surprises.&quot;</p>
          <p>That one sentence does three things: it gives the customer a number to anchor on, it explains why there is a range, and it removes their biggest fear — being charged more than expected once you are already there.</p>
          <h2 className="text-[22px] font-bold text-[#1a2e3b] mt-8 mb-3">Consistency wins over improvisation</h2>
          <p>When you answer the phone yourself between jobs, your pricing delivery varies. Sometimes you are confident. Sometimes you hedge. Sometimes you are flustered because you are trying to talk while driving.</p>
          <p>An AI delivers your pricing the same way every single time. Calm, professional, with the exact phrasing you chose. It quotes lock changes, euro cylinders, boarding up, multipoint locks — whatever you have configured — with the same reassuring tone at 3pm and 3am.</p>
          <div className="bg-[#faf9f7] rounded-xl px-6 py-5 border border-[#e5e0da] mt-10">
            <p className="text-[15px] font-bold text-[#1a2e3b] mb-2">Handle pricing calls like a pro — even at 3am</p>
            <p className="text-[14px] text-[#5a7184] mb-4">Your AI receptionist quotes your pricing confidently and books the job. From £69/month.</p>
            <Link href="/ai-receptionist-for-locksmiths" className="inline-block bg-[#e8930c] text-white px-6 py-3 rounded-lg text-sm font-bold no-underline hover:bg-[#d17f00] transition-colors">See how it works for locksmiths →</Link>
          </div>
        </div>
      </div>
    </article>
  );
}
