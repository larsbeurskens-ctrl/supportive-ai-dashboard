import { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'AI Receptionist for HVAC & Heating Engineers UK | Supportive AI',
  description: 'AI phone answering for heating engineers. Books boiler repairs, handles Gas Safe enquiries, detects emergencies. From £69/month.',
};

export default function AIReceptionistForHVAC() {
  return (
    <>
      <section className="pt-16 pb-10 px-6 md:px-10 max-w-[820px] mx-auto text-center">
        <p className="text-[13px] font-semibold text-[#e8930c] uppercase tracking-wider mb-3">AI receptionist for heating engineers</p>
        <h1 className="text-[36px] md:text-[44px] font-extrabold text-[#1a2e3b] leading-[1.15] mb-5 tracking-tight">Boiler breaks down at 10pm. Your phone still gets answered.</h1>
        <p className="text-lg text-[#5a7184] leading-relaxed max-w-[580px] mx-auto mb-8">HVAC emergencies do not keep office hours. Supportive AI answers every call, qualifies the job, and books it into your calendar - even when you are on a rooftop or in an attic.</p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center mb-4">
          <Link href="/onboarding" className="bg-[#e8930c] text-white px-8 py-[15px] rounded-lg text-base font-bold no-underline hover:bg-[#d17f00] transition-colors shadow-[0_2px_8px_rgba(232,147,12,0.3)]">Start Your Free Trial</Link>
          <Link href="/demo" className="bg-white text-[#1a2e3b] px-8 py-[15px] rounded-lg text-base font-semibold border border-[#d1ccc6] no-underline hover:bg-[#f0eeeb] transition-colors">Hear the Live Demo</Link>
        </div>
        <p className="text-[13px] text-[#94a7b8]">From £69/month · No setup fee · Cancel anytime</p>
      </section>

      <section className="py-14 px-6 md:px-10 bg-white border-t border-b border-[#e5e0da]">
        <div className="max-w-[820px] mx-auto">
          <h2 className="text-[26px] font-bold text-[#1a2e3b] mb-4">Heating calls cannot wait</h2>
          <div className="text-[16px] text-[#5a7184] leading-relaxed space-y-4">
            <p>When a boiler breaks in January, the customer is not going to leave a voicemail. They are cold, worried about frozen pipes, and calling the next Gas Safe engineer.</p>
            <p className="text-[#1a2e3b] font-semibold">Every call answered. Emergency or routine, evening or weekend.</p>
          </div>
        </div>
      </section>

      <section className="py-14 px-6 md:px-10">
        <div className="max-w-[820px] mx-auto">
          <h2 className="text-[26px] font-bold text-[#1a2e3b] mb-6">Built for heating and HVAC businesses</h2>
          <div className="grid sm:grid-cols-2 gap-5">
            {[
              { icon: '🔥', title: 'Understands HVAC terminology', desc: 'Boiler breakdowns, central heating faults, radiator issues, thermostat problems, air conditioning servicing.' },
              { icon: '🚨', title: 'Emergency triage', desc: 'No heating in winter? Gas smell? Carbon monoxide alarm? Detects urgency and texts you immediately.' },
              { icon: '📅', title: 'Books into your calendar', desc: 'Annual services, repair callouts, installation quotes - all scheduled with live availability.' },
              { icon: '💰', title: 'Handles pricing questions', desc: 'Callout fees, service costs, boiler installation ballparks. Real information, not "call back later."' },
              { icon: '🏠', title: 'Collects property details', desc: 'Boiler make and model, property type, system type. You arrive prepared.' },
              { icon: '🌙', title: 'After-hours and weekends', desc: 'Peak call times for HVAC are evenings and weekends when systems fail. That is when the AI is most valuable.' },
            ].map((item, i) => (
              <div key={i} className="bg-[#faf9f7] rounded-xl px-5 py-4 border border-[#e5e0da]">
                <span className="text-[20px]">{item.icon}</span>
                <h3 className="text-[15px] font-bold text-[#1a2e3b] mt-2 mb-1">{item.title}</h3>
                <p className="text-[13px] text-[#5a7184] leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-14 px-6 md:px-10 bg-white border-t border-b border-[#e5e0da]">
        <div className="max-w-[820px] mx-auto">
          <h2 className="text-[26px] font-bold text-[#1a2e3b] mb-4">The seasonal reality</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-[#fef2f2] rounded-xl px-6 py-5 border border-[#fecaca]">
              <p className="text-[15px] font-bold text-[#dc2626] mb-3">October - March (without AI)</p>
              <div className="text-[14px] text-[#5a7184] space-y-2">
                <p>Phone rings 30+ times a day. You are on a job.</p>
                <p>5-10 missed calls daily. Each = potential £300-500 job.</p>
                <p className="font-semibold text-[#dc2626]">£1,500-5,000 lost revenue per week</p>
              </div>
            </div>
            <div className="bg-[#f0fdf4] rounded-xl px-6 py-5 border border-[#bbf7d0]">
              <p className="text-[15px] font-bold text-[#059669] mb-3">October - March (with Supportive AI)</p>
              <div className="text-[14px] text-[#5a7184] space-y-2">
                <p>Every call answered. Emergencies escalated via text.</p>
                <p>Routine jobs booked into your calendar.</p>
                <p className="font-semibold text-[#059669]">Zero missed opportunities. £69/month.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-10 px-6 md:px-10"><div className="max-w-[820px] mx-auto"><h2 className="text-[18px] font-bold text-[#1a2e3b] mb-4">Related</h2><div className="grid sm:grid-cols-2 gap-3">
        <Link href="/blog/stop-missing-calls-tradesman" className="bg-[#faf9f7] rounded-xl px-4 py-3 border border-[#e5e0da] no-underline hover:border-[#e8930c] block"><p className="text-[13px] font-bold text-[#1a2e3b]">How to stop missing calls on a job</p><p className="text-[11px] text-[#94a7b8]">Blog · 5 min</p></Link>
        <Link href="/compare" className="bg-[#faf9f7] rounded-xl px-4 py-3 border border-[#e5e0da] no-underline hover:border-[#e8930c] block"><p className="text-[13px] font-bold text-[#1a2e3b]">AI vs answering service vs voicemail</p><p className="text-[11px] text-[#94a7b8]">Comparison</p></Link>
        <Link href="/guarantee" className="bg-[#faf9f7] rounded-xl px-4 py-3 border border-[#e5e0da] no-underline hover:border-[#e8930c] block"><p className="text-[13px] font-bold text-[#1a2e3b]">3 jobs in 30 days or your money back</p><p className="text-[11px] text-[#94a7b8]">Guarantee</p></Link>
        <Link href="/missed-calls-calculator" className="bg-[#faf9f7] rounded-xl px-4 py-3 border border-[#e5e0da] no-underline hover:border-[#e8930c] block"><p className="text-[13px] font-bold text-[#1a2e3b]">Calculate your lost revenue</p><p className="text-[11px] text-[#94a7b8]">Calculator</p></Link>
      </div></div></section>

      <section className="py-14 px-6 md:px-10 text-center">
        <div className="max-w-lg mx-auto">
          <h2 className="text-[26px] font-extrabold text-[#1a2e3b] mb-3">Get ready before next winter</h2>
          <p className="text-[16px] text-[#5a7184] mb-8">Set up now. Test it before the busy season. 7 days free.</p>
          <Link href="/onboarding" className="inline-block bg-[#e8930c] text-white px-8 py-4 rounded-xl text-[17px] font-bold no-underline hover:bg-[#d17f00] transition-colors shadow-[0_2px_8px_rgba(232,147,12,0.3)]">Start Your Free Trial</Link>
          <p className="text-[13px] text-[#94a7b8] mt-4">From £69/month · No setup fee · Cancel anytime</p>
        </div>
      </section>
    </>
  );
}
