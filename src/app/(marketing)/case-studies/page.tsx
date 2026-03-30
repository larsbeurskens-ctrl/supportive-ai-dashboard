import { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'How UK Plumbers Use AI Phone Answering | Supportive AI',
  description: 'Real examples of how plumbing businesses handle calls with AI. Bookings, pricing enquiries, and emergency triage.',
};

export default function CaseStudiesPage() {
  const scenarios = [
    { tag: 'Scenario 1', tagBg: '#059669', label: 'Evening booking', title: 'Customer calls about a leaking tap at 6pm. Plumber is under a sink.',
      without: ['Phone rings. Plumber cannot answer.', 'Voicemail plays. Customer hangs up.', 'Customer calls next plumber on Google.', 'Job gone. £150 lost.'],
      withAI: ['AI answers with business name.', 'Customer explains the issue. AI asks for postcode.', 'AI checks calendar: "We have Thursday at 1pm."', 'Job booked. Customer gets confirmation text.', 'Plumber gets a text with all the details.'],
      result: 'Job locked in. £150 saved.' },
    { tag: 'Scenario 2', tagBg: '#e8930c', label: 'Pricing comparison', title: 'Customer rings three plumbers to compare call-out fees. Two go to voicemail.',
      story: 'The AI answers instantly. The customer asks about pricing. AI responds with real numbers: "Our call-out fee is £65. For a leaky tap that typically runs £80 to £150. If you go ahead with the repair, the call-out fee comes off the final bill." The customer books immediately. They never call the other two plumbers back. The plumber who answered first wins the job. Every time.' },
    { tag: 'Scenario 3', tagBg: '#dc2626', label: 'Emergency - 11pm Sunday', title: 'Water pouring through a ceiling. Homeowner panicking. Plumber asleep.',
      story: 'The AI answers, detects "burst pipe" and "water through the ceiling" as emergency keywords. It collects the customer name, address, postcode, and phone number. Immediately sends the plumber an emergency SMS. Meanwhile, the AI advises the customer to find the stopcock and turn off the water supply. Emergency callout booked. Customer helped immediately. Plumber gets a £400+ job instead of sleeping through it.' },
    { tag: 'Scenario 4', tagBg: '#3b82f6', label: 'Saturday morning rush', title: 'It is 9am Saturday. Three customers all call within two minutes.',
      story: 'A human receptionist can handle one call at a time. You would miss two. Supportive AI handles all three simultaneously. Each customer gets a full conversation, a calendar check, and a confirmed booking. Three jobs booked in two minutes. Three customers served. Zero missed. £600+ in bookings captured.' },
  ];

  return (
    <>
      <section className="pt-16 pb-10 px-6 md:px-10 max-w-[820px] mx-auto text-center">
        <p className="text-[13px] font-semibold text-[#e8930c] uppercase tracking-wider mb-3">Real examples</p>
        <h1 className="text-[36px] md:text-[44px] font-extrabold text-[#1a2e3b] leading-[1.15] mb-5 tracking-tight">What happens when a plumber cannot answer the phone</h1>
        <p className="text-lg text-[#5a7184] leading-relaxed max-w-[580px] mx-auto">Real call scenarios showing how Supportive AI handles enquiries, books jobs, and triages emergencies.</p>
      </section>

      {scenarios.map((s, i) => (
        <section key={i} className={`py-14 px-6 md:px-10 ${i % 2 === 0 ? 'bg-white' : ''} border-t border-[#e5e0da]`}>
          <div className="max-w-[820px] mx-auto">
            <div className="flex items-center gap-3 mb-4">
              <span className="text-[11px] font-bold text-white px-3 py-1 rounded-full uppercase tracking-wider" style={{backgroundColor: s.tagBg}}>{s.tag}</span>
              <span className="text-[11px] font-semibold text-[#5a7184]">{s.label}</span>
            </div>
            <h2 className="text-[24px] font-bold text-[#1a2e3b] mb-3">{s.title}</h2>
            {s.without ? (
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-[14px] font-bold text-[#dc2626] mb-2">Without Supportive AI</h3>
                  <div className="bg-[#fef2f2] rounded-xl px-5 py-4 border border-[#fecaca] text-[14px] text-[#5a7184] space-y-2">
                    {s.without.map((line, j) => <p key={j} className={j === s.without!.length-1 ? 'text-[#dc2626] font-semibold' : ''}>{line}</p>)}
                  </div>
                </div>
                <div>
                  <h3 className="text-[14px] font-bold text-[#059669] mb-2">With Supportive AI</h3>
                  <div className="bg-[#f0fdf4] rounded-xl px-5 py-4 border border-[#bbf7d0] text-[14px] text-[#5a7184] space-y-2">
                    {s.withAI!.map((line, j) => <p key={j}>{line}</p>)}
                    <p className="font-semibold text-[#059669]">{s.result}</p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-[#faf9f7] rounded-xl px-6 py-5 border border-[#e5e0da] text-[15px] text-[#5a7184] leading-relaxed">
                {s.story!.split('. ').reduce((acc: string[], sentence, idx, arr) => {
                  if (idx === arr.length - 1) return [...acc, sentence];
                  return [...acc, sentence + '.'];
                }, []).map((para, j) => <p key={j} className={j === s.story!.split('. ').length - 1 ? 'text-[#1a2e3b] font-semibold mt-2' : 'mb-2'}>{para}</p>)}
              </div>
            )}
          </div>
        </section>
      ))}

      <section className="py-10 px-6 md:px-10"><div className="max-w-[820px] mx-auto"><h2 className="text-[18px] font-bold text-[#1a2e3b] mb-4">Related</h2><div className="grid sm:grid-cols-2 gap-3">
        <Link href="/blog/electrician-misses-emergency-call" className="bg-[#faf9f7] rounded-xl px-4 py-3 border border-[#e5e0da] no-underline hover:border-[#e8930c] block"><p className="text-[13px] font-bold text-[#1a2e3b]">What happens when you miss an emergency call?</p><p className="text-[11px] text-[#94a7b8]">Blog · 5 min</p></Link>
        <Link href="/guarantee" className="bg-[#faf9f7] rounded-xl px-4 py-3 border border-[#e5e0da] no-underline hover:border-[#e8930c] block"><p className="text-[13px] font-bold text-[#1a2e3b]">3 jobs in 30 days or your money back</p><p className="text-[11px] text-[#94a7b8]">Guarantee</p></Link>
        <Link href="/ai-receptionist-for-plumbers" className="bg-[#faf9f7] rounded-xl px-4 py-3 border border-[#e5e0da] no-underline hover:border-[#e8930c] block"><p className="text-[13px] font-bold text-[#1a2e3b]">AI receptionist for plumbers</p><p className="text-[11px] text-[#94a7b8]">Industry</p></Link>
        <Link href="/ai-receptionist-for-electricians" className="bg-[#faf9f7] rounded-xl px-4 py-3 border border-[#e5e0da] no-underline hover:border-[#e8930c] block"><p className="text-[13px] font-bold text-[#1a2e3b]">AI receptionist for electricians</p><p className="text-[11px] text-[#94a7b8]">Industry</p></Link>
      </div></div></section>

      <section className="py-14 px-6 md:px-10 bg-white border-t border-[#e5e0da] text-center">
        <div className="max-w-lg mx-auto">
          <h2 className="text-[26px] font-extrabold text-[#1a2e3b] mb-3">Want this for your business?</h2>
          <p className="text-[16px] text-[#5a7184] mb-8">We set up a version tailored to your plumbing business. Test it before going live.</p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link href="/onboarding" className="bg-[#e8930c] text-white px-8 py-4 rounded-xl text-[17px] font-bold no-underline hover:bg-[#d17f00] transition-colors shadow-[0_2px_8px_rgba(232,147,12,0.3)]">Start Your Free Trial</Link>
            <Link href="/demo" className="bg-white text-[#1a2e3b] px-8 py-4 rounded-xl text-[17px] font-bold border-2 border-[#1a2e3b] no-underline hover:bg-[#1a2e3b] hover:text-white transition-colors">Try the Live Demo</Link>
          </div>
          <p className="text-[13px] text-[#94a7b8] mt-4">From £69/month · No setup fee · Cancel anytime</p>
        </div>
      </section>
    </>
  );
}
