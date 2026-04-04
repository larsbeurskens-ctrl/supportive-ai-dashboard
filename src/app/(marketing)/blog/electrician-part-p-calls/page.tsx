import Link from 'next/link';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'How AI Handles Part P and Certification Questions on Calls | Supportive AI',
  description: 'Callers ask about Part P, EICR certificates, and whether work is notifiable. Your AI answers confidently without you picking up.',
};

export default function BlogPost() {
  return (
    <article className="pt-16 pb-14 px-6 md:px-10">
      <div className="max-w-[680px] mx-auto">
        <div className="mb-10">
          <p className="text-[13px] font-semibold text-[#e8930c] uppercase tracking-wider mb-3">Blog</p>
          <h1 className="text-[32px] md:text-[40px] font-extrabold text-[#1a2e3b] leading-[1.15] mb-4 tracking-tight">How AI handles Part P and certification questions on calls</h1>
          <p className="text-[15px] text-[#94a7b8]">April 4, 2026 · 5 min read</p>
        </div>
        <div className="text-[16px] text-[#5a7184] leading-relaxed space-y-5">
          <p>Customers are getting savvier about electrical work. They have read about Part P regulations. They want to know if their job is notifiable. They ask whether you provide EICR certificates. And they expect a confident answer on the first call.</p>
          <p>If that call goes to voicemail, they do not get their answer — and they call the electrician who picks up and sounds like they know what they are talking about.</p>
          <h2 className="text-[22px] font-bold text-[#1a2e3b] mt-8 mb-3">The three certification questions callers ask</h2>
          <p>First: &quot;Are you Part P registered?&quot; Your AI confirms that all work is carried out by Part P registered electricians with full certification. Simple, professional, reassuring.</p>
          <p>Second: &quot;Do I need an EICR?&quot; The AI explains what an EICR inspection involves, quotes your pricing, and can book the inspection directly. For landlords, it mentions the legal requirement for a valid EICR.</p>
          <p>Third: &quot;Is this work notifiable?&quot; The AI explains that certain work — new circuits, consumer unit changes, work in bathrooms and kitchens — requires Building Control notification. It confirms that as a Part P registered electrician, you handle all the paperwork.</p>
          <h2 className="text-[22px] font-bold text-[#1a2e3b] mt-8 mb-3">Why this matters for winning the job</h2>
          <p>When a homeowner calls two electricians and one gives confident, knowledgeable answers about certifications while the other goes to voicemail — the decision is made before you even call back. Professional answering builds trust instantly.</p>
          <p>The AI does not guess or improvise. It uses the exact language you want — your qualifications, your certifications, your pricing — delivered consistently on every single call.</p>
          <div className="bg-[#faf9f7] rounded-xl px-6 py-5 border border-[#e5e0da] mt-10">
            <p className="text-[15px] font-bold text-[#1a2e3b] mb-2">Sound professional on every call — even when you cannot answer</p>
            <p className="text-[14px] text-[#5a7184] mb-4">Your AI receptionist knows your certifications, quotes your pricing, and books jobs into your calendar. From £69/month.</p>
            <Link href="/ai-receptionist-for-electricians" className="inline-block bg-[#e8930c] text-white px-6 py-3 rounded-lg text-sm font-bold no-underline hover:bg-[#d17f00] transition-colors">See how it works for electricians →</Link>
          </div>
        </div>
      </div>
    </article>
  );
}
