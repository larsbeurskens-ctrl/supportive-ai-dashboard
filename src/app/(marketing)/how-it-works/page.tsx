import { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'How AI Phone Answering Works for Plumbers | Supportive AI',
  description: 'See how Supportive AI answers calls, books jobs into your calendar, and texts confirmations. 3 simple steps. No tech needed.',
};

export default function HowItWorksPage() {
  return (
    <>
      <section className="pt-16 pb-10 px-6 md:px-10 max-w-[820px] mx-auto text-center">
        <h1 className="text-[36px] md:text-[44px] font-extrabold text-[#1a2e3b] leading-[1.15] mb-5 tracking-tight">How it works</h1>
        <p className="text-lg text-[#5a7184] leading-relaxed max-w-[520px] mx-auto">Your customers call your number as normal. Nothing changes for them. Everything changes for you.</p>
      </section>

      <section className="px-6 md:px-10 pb-14">
        <div className="max-w-[700px] mx-auto space-y-12">
          <div className="flex gap-6 items-start">
            <div className="w-14 h-14 rounded-2xl bg-[#1a2e3b] text-white flex items-center justify-center text-[22px] font-extrabold flex-shrink-0">1</div>
            <div>
              <h2 className="text-[22px] font-bold text-[#1a2e3b] mb-2">Keep your number. Forward your calls.</h2>
              <p className="text-[15px] text-[#5a7184] leading-relaxed mb-3">Your business number stays on the van, the cards, the Google listing. You set your phone to forward calls to Supportive AI. You choose when:</p>
              <div className="space-y-2 ml-1">
                {[
                  { mode: 'After 4 rings', desc: 'You get first crack. AI catches what you miss.', dot: '#e8930c' },
                  { mode: 'After hours only', desc: 'You answer during the day. AI handles nights and weekends.', dot: '#3b82f6' },
                  { mode: 'Always on', desc: 'AI answers every call. Urgent ones get forwarded to you.', dot: '#059669' },
                ].map((item, i) => (
                  <div key={i} className="flex items-start gap-3 p-3 rounded-xl bg-[#faf9f7] border border-[#e5e0da]">
                    <span className="w-2.5 h-2.5 rounded-full mt-1.5 flex-shrink-0" style={{ backgroundColor: item.dot }} />
                    <div><span className="text-[13px] font-bold text-[#1a2e3b]">{item.mode}</span><span className="text-[13px] text-[#5a7184] ml-1.5">{item.desc}</span></div>
                  </div>
                ))}
              </div>
              <p className="text-[12px] text-[#94a7b8] mt-3">Setting up call forwarding takes about 30 seconds. We walk you through it.</p>
            </div>
          </div>

          <div className="flex gap-6 items-start">
            <div className="w-14 h-14 rounded-2xl bg-[#1a2e3b] text-white flex items-center justify-center text-[22px] font-extrabold flex-shrink-0">2</div>
            <div>
              <h2 className="text-[22px] font-bold text-[#1a2e3b] mb-2">The call gets answered and the job gets booked.</h2>
              <p className="text-[15px] text-[#5a7184] leading-relaxed mb-3">The AI picks up instantly with your business name. Here is what happens on a typical call:</p>
              <div className="bg-[#faf9f7] rounded-xl px-5 py-4 border border-[#e5e0da] space-y-3 text-[13px]">
                <p><span className="font-bold text-[#1a2e3b]">Greets the caller</span> <span className="text-[#5a7184]">using your business name</span></p>
                <p><span className="font-bold text-[#1a2e3b]">Asks what they need</span> <span className="text-[#5a7184]">- leaky tap, blocked drain, boiler issue</span></p>
                <p><span className="font-bold text-[#1a2e3b]">Collects their details</span> <span className="text-[#5a7184]">- name, address, postcode</span></p>
                <p><span className="font-bold text-[#1a2e3b]">Checks your calendar</span> <span className="text-[#5a7184]">- real availability, not a guess</span></p>
                <p><span className="font-bold text-[#1a2e3b]">Offers available slots</span> <span className="text-[#5a7184]">- &quot;We have Thursday at 1 PM or Friday at 10 AM&quot;</span></p>
                <p><span className="font-bold text-[#1a2e3b]">Books the job</span> <span className="text-[#5a7184]">- straight into your calendar</span></p>
                <p><span className="font-bold text-[#1a2e3b]">Explains your pricing</span> <span className="text-[#5a7184]">- call-out fees, how it works, no surprises</span></p>
              </div>
            </div>
          </div>

          <div className="flex gap-6 items-start">
            <div className="w-14 h-14 rounded-2xl bg-[#1a2e3b] text-white flex items-center justify-center text-[22px] font-extrabold flex-shrink-0">3</div>
            <div>
              <h2 className="text-[22px] font-bold text-[#1a2e3b] mb-2">You get the details. They get a confirmation.</h2>
              <div className="grid sm:grid-cols-2 gap-4 mt-3">
                <div className="bg-[#f0fdf4] rounded-xl px-5 py-4 border border-[#bbf7d0]">
                  <p className="text-[13px] font-bold text-[#059669] mb-2">You receive</p>
                  <ul className="text-[13px] text-[#5a7184] space-y-1"><li>SMS with customer name + number</li><li>Job details and address</li><li>Booking in your calendar</li><li>Call recording + transcript</li></ul>
                </div>
                <div className="bg-[#eff6ff] rounded-xl px-5 py-4 border border-[#bfdbfe]">
                  <p className="text-[13px] font-bold text-[#2563eb] mb-2">Customer receives</p>
                  <ul className="text-[13px] text-[#5a7184] space-y-1"><li>Confirmation text with date and time</li><li>Your business address</li><li>Option to reply if anything needs correcting</li></ul>
                </div>
              </div>
              <p className="text-[15px] text-[#1a2e3b] font-semibold mt-4">The job is locked in before the customer hangs up. No callbacks. No voicemail. No lost work.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-14 px-6 md:px-10 bg-white border-t border-b border-[#e5e0da]">
        <div className="max-w-[820px] mx-auto text-center">
          <h2 className="text-[26px] font-bold text-[#1a2e3b] mb-4">Getting set up</h2>
          <p className="text-[15px] text-[#5a7184] mb-8">No apps to install. No hardware. No IT support needed.</p>
          <div className="grid sm:grid-cols-3 gap-6 text-left">
            {[
              { time: '5 min', title: 'Tell us about your business', desc: 'Your services, pricing, service area, and how you want calls handled.' },
              { time: '1 hour', title: 'We build your AI receptionist', desc: 'Tailored to your business. You hear it and approve it before going live.' },
              { time: '30 sec', title: 'Forward your calls', desc: 'One short dial code on your phone. Calls start getting answered immediately.' },
            ].map((s, i) => (
              <div key={i} className="bg-[#faf9f7] rounded-xl px-5 py-4 border border-[#e5e0da]">
                <p className="text-[11px] font-bold text-[#e8930c] uppercase tracking-wider mb-1">{s.time}</p>
                <h3 className="text-[15px] font-bold text-[#1a2e3b] mb-1">{s.title}</h3>
                <p className="text-[13px] text-[#5a7184] leading-relaxed">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-10 px-6 md:px-10"><div className="max-w-[820px] mx-auto"><h2 className="text-[18px] font-bold text-[#1a2e3b] mb-4">Related</h2><div className="grid sm:grid-cols-2 gap-3">
        <Link href="/pricing" className="bg-[#faf9f7] rounded-xl px-4 py-3 border border-[#e5e0da] no-underline hover:border-[#e8930c] block"><p className="text-[13px] font-bold text-[#1a2e3b]">Transparent pricing from £69/month</p><p className="text-[11px] text-[#94a7b8]">Pricing</p></Link>
        <Link href="/case-studies" className="bg-[#faf9f7] rounded-xl px-4 py-3 border border-[#e5e0da] no-underline hover:border-[#e8930c] block"><p className="text-[13px] font-bold text-[#1a2e3b]">Real call scenarios handled by the AI</p><p className="text-[11px] text-[#94a7b8]">Case studies</p></Link>
        <Link href="/blog/stop-missing-calls-tradesman" className="bg-[#faf9f7] rounded-xl px-4 py-3 border border-[#e5e0da] no-underline hover:border-[#e8930c] block"><p className="text-[13px] font-bold text-[#1a2e3b]">How to stop missing calls on a job</p><p className="text-[11px] text-[#94a7b8]">Blog · 5 min</p></Link>
        <Link href="/ai-receptionist-for-plumbers" className="bg-[#faf9f7] rounded-xl px-4 py-3 border border-[#e5e0da] no-underline hover:border-[#e8930c] block"><p className="text-[13px] font-bold text-[#1a2e3b]">AI receptionist for plumbers</p><p className="text-[11px] text-[#94a7b8]">Industry</p></Link>
      </div></div></section>

      <section className="py-14 px-6 md:px-10 text-center">
        <div className="max-w-lg mx-auto">
          <h2 className="text-[26px] font-extrabold text-[#1a2e3b] mb-3">Try it for your business</h2>
          <p className="text-[16px] text-[#5a7184] mb-8">7 days free. Hear how it sounds before going live.</p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center mb-4">
            <Link href="/onboarding" className="bg-[#e8930c] text-white px-8 py-4 rounded-xl text-[17px] font-bold no-underline hover:bg-[#d17f00] transition-colors shadow-[0_2px_8px_rgba(232,147,12,0.3)]">Start Your Free Trial</Link>
            <Link href="/demo" className="bg-white text-[#1a2e3b] px-8 py-4 rounded-xl text-[17px] font-bold border-2 border-[#1a2e3b] no-underline hover:bg-[#1a2e3b] hover:text-white transition-colors">Hear the Demo</Link>
          </div>
          <p className="text-[13px] text-[#94a7b8]">From £69/month · No setup fee · Cancel anytime</p>
        </div>
      </section>
    </>
  );
}
