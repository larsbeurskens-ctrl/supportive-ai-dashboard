import { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'What Happens When an Electrician Misses an Emergency Call? | Supportive AI',
  description: 'Burning smells, sparking sockets, total power loss — electrical emergencies cannot wait. How AI answering handles safety-critical calls differently from voicemail.',
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Article",
  "headline": "What Happens When an Electrician Misses an Emergency Call?",
  "description": "Electrical emergencies cannot wait. How AI answering handles safety-critical calls differently from voicemail.",
  "author": { "@type": "Person", "name": "Lars Beurskens" },
  "publisher": { "@type": "Organization", "name": "Supportive AI", "url": "https://supportive-ai.com" },
  "datePublished": "2026-03-30",
  "url": "https://supportive-ai.com/blog/electrician-misses-emergency-call",
};

export default function BlogPost() {
  return (
    <article className="pt-16 pb-14 px-6 md:px-10">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <div className="max-w-[680px] mx-auto">
        <div className="mb-10">
          <p className="text-[13px] font-semibold text-[#e8930c] uppercase tracking-wider mb-3">Blog</p>
          <h1 className="text-[32px] md:text-[40px] font-extrabold text-[#1a2e3b] leading-[1.15] mb-4 tracking-tight">
            What happens when an electrician misses an emergency call?
          </h1>
          <p className="text-[15px] text-[#94a7b8]">March 30, 2026 · 5 min read</p>
        </div>

        <div className="prose-custom space-y-5 text-[16px] text-[#3a4f5e] leading-[1.8]">
          <p>A customer calls. They can smell burning coming from a socket in their kitchen. There are scorch marks on the wall. They are frightened. They call the electrician they used last year.</p>

          <p>The phone rings. Nobody answers. They get a voicemail greeting. They hang up and call the next electrician on Google.</p>

          <p>That call was worth £150-300 in immediate revenue. But more than that — it was a customer in genuine danger, looking for someone they trust. They will never call you again. And if something goes wrong while they waited, it becomes a liability question you do not want to answer.</p>

          <h2 className="text-[24px] font-bold text-[#1a2e3b] mt-10 mb-4">Emergency electrical calls are different</h2>

          <p>A missed plumbing call usually means a leaky tap waits another day. Annoying, but rarely dangerous. A missed electrical call can involve burning smells, sparking sockets, exposed wires, water near electrics, or complete power loss. These are situations where delay creates real safety risk.</p>

          <p>The standard voicemail greeting (&quot;We are unable to take your call right now...&quot;) is the worst possible response to someone reporting a burning smell. It tells them: nobody is here, you are on your own, try someone else.</p>

          <h2 className="text-[24px] font-bold text-[#1a2e3b] mt-10 mb-4">How AI handles emergency electrical calls</h2>

          <p>An AI receptionist built for electricians does something voicemail cannot: it has a real conversation with the caller, assesses the urgency, and takes immediate action.</p>

          <p>When a caller says &quot;there is a burning smell coming from my socket,&quot; the AI recognises this as an emergency. It does not ask about appointment preferences or pricing. It says:</p>

          <div className="bg-[#fef2f2] rounded-xl px-6 py-4 border border-[#fecaca] my-6">
            <p className="text-[15px] text-[#5a7184] italic">&quot;That sounds like it could be serious. Please make sure everyone stays well away from the area. I am going to take your details right now so our emergency electrician can call you back within 10 minutes.&quot;</p>
          </div>

          <p>It collects the customer&apos;s name, phone number, postcode, and address in under 60 seconds. It sends you an immediate SMS with all the details marked as EMERGENCY. The customer hangs up knowing that someone is coming. You check your phone and call them back.</p>

          <h2 className="text-[24px] font-bold text-[#1a2e3b] mt-10 mb-4">What the AI never does</h2>

          <p>This is critical. A well-built AI receptionist for electricians never gives DIY electrical advice. It does not tell the caller to check the fuse box, reset the breaker, or open the consumer unit. Unlike a generic answering service or chatbot, it understands that telling an untrained person to interact with electrical equipment is dangerous.</p>

          <p>The only safe advice for a non-professional during an electrical emergency is: stay away from the area and wait for a qualified electrician. That is exactly what the AI says. Safety first, every time.</p>

          <h2 className="text-[24px] font-bold text-[#1a2e3b] mt-10 mb-4">Emergency vs routine: different responses</h2>

          <p>The same AI handles routine calls completely differently. A customer wanting sockets installed gets the full service: job qualification, pricing information, calendar check, and a confirmed booking. An EICR enquiry gets a quote and a booked inspection date.</p>

          <p>The difference is that the AI understands context. &quot;I need some sockets&quot; is a booking conversation. &quot;I can smell burning&quot; is an emergency escalation. The response path is completely different, and it switches instantly based on what the caller says — even mid-conversation.</p>

          <h2 className="text-[24px] font-bold text-[#1a2e3b] mt-10 mb-4">The business case</h2>

          <p>Emergency call-outs are the highest-margin work an electrician does. A standard call-out at £80-160 often leads to additional work worth £300-600. Emergency customers also become long-term customers — they remember who showed up when they were scared.</p>

          <p>Missing these calls does not just cost you one job. It costs you the customer for life. An AI receptionist at £69 per month ensures you never miss an emergency call again. It answers instantly, stays calm, collects the details, and gets you the message within seconds.</p>

          <p>Your customer is safe. Your reputation is intact. And the job is yours.</p>

          <h2 className="text-[24px] font-bold text-[#1a2e3b] mt-10 mb-4">Related reading</h2>
          <div className="space-y-2 text-[15px]">
            <p>→ <Link href="/blog/stop-missing-calls-tradesman" className="text-[#1a6dca] underline">How to stop missing calls when you are on a job</Link></p>
            <p>→ <Link href="/blog/phone-answering-service-cost-plumber-2026" className="text-[#1a6dca] underline">How much does a phone answering service cost for plumbers in 2026?</Link></p>
            <p>→ <Link href="/ai-receptionist-for-electricians" className="text-[#1a6dca] underline">AI receptionist built for UK electricians</Link></p>
            <p>→ <Link href="/case-studies" className="text-[#1a6dca] underline">Real call scenarios — see how the AI handles different situations</Link></p>
          </div>
        </div>


        <div className="mt-12 bg-[#faf9f7] rounded-xl p-6 border border-[#e5e0da]">
          <h3 className="text-[18px] font-bold text-[#1a2e3b] mb-3">Hear how it handles an emergency call</h3>
          <p className="text-[15px] text-[#5a7184] mb-4">Call our live electrical demo and report a burning smell. Listen to how it handles the emergency — no DIY advice, immediate escalation, details collected in under a minute.</p>
          <div className="flex flex-col sm:flex-row gap-3">
            <Link href="/ai-receptionist-for-electricians" className="bg-[#e8930c] text-white px-6 py-3 rounded-lg text-[15px] font-bold no-underline hover:bg-[#d17f00] text-center">
              Electrician AI Receptionist
            </Link>
            <Link href="/guarantee" className="bg-white text-[#1a2e3b] px-6 py-3 rounded-lg text-[15px] font-semibold border border-[#d1ccc6] no-underline hover:bg-[#f0eeeb] text-center">
              Our Guarantee
            </Link>
          </div>
        </div>
      </div>
    </article>
  );
}
