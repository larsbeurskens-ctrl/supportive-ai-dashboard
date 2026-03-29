import { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'AI Receptionist for Electricians UK - 24/7 Call Answering | Supportive AI',
  description: 'AI phone answering built for UK electricians. Books jobs, handles pricing, detects emergencies. From £69/month.',
};

export default function AIReceptionistForElectricians() {
  return (
    <>
      <section className="pt-16 pb-10 px-6 md:px-10 max-w-[820px] mx-auto text-center">
        <p className="text-[13px] font-semibold text-[#e8930c] uppercase tracking-wider mb-3">AI receptionist for electricians</p>
        <h1 className="text-[36px] md:text-[44px] font-extrabold text-[#1a2e3b] leading-[1.15] mb-5 tracking-tight">Stop losing electrical jobs to missed calls</h1>
        <p className="text-lg text-[#5a7184] leading-relaxed max-w-[580px] mx-auto mb-8">When you are up a ladder, in a loft, or mid-rewire, you cannot answer the phone. Supportive AI picks up, qualifies the job, and books it into your calendar - 24/7.</p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center mb-4">
          <Link href="/onboarding" className="bg-[#e8930c] text-white px-8 py-[15px] rounded-lg text-base font-bold no-underline hover:bg-[#d17f00] transition-colors shadow-[0_2px_8px_rgba(232,147,12,0.3)]">Start Your Free Trial</Link>
          <Link href="/demo" className="bg-white text-[#1a2e3b] px-8 py-[15px] rounded-lg text-base font-semibold border border-[#d1ccc6] no-underline hover:bg-[#f0eeeb] transition-colors">Hear the Live Demo</Link>
        </div>
        <p className="text-[13px] text-[#94a7b8]">From £69/month · No setup fee · Cancel anytime</p>
      </section>

      <section className="py-14 px-6 md:px-10 bg-white border-t border-b border-[#e5e0da]">
        <div className="max-w-[820px] mx-auto">
          <h2 className="text-[26px] font-bold text-[#1a2e3b] mb-4">The electrician&apos;s phone problem</h2>
          <div className="text-[16px] text-[#5a7184] leading-relaxed space-y-4">
            <p>You are in a consumer unit, halfway through a rewire, or testing circuits. Your phone rings. You cannot answer it safely, and you should not have to.</p>
            <p>But 80% of callers will not leave a voicemail. They call the next electrician on Google. That job is gone in 30 seconds.</p>
            <p className="text-[#1a2e3b] font-semibold">Supportive AI answers every call, qualifies the enquiry, and books the job - while your hands stay on the work.</p>
          </div>
        </div>
      </section>

      <section className="py-14 px-6 md:px-10">
        <div className="max-w-[820px] mx-auto">
          <h2 className="text-[26px] font-bold text-[#1a2e3b] mb-6">Built for how electricians actually work</h2>
          <div className="grid sm:grid-cols-2 gap-5">
            {[
              { icon: '🔌', title: 'Qualifies the job type', desc: 'Socket fitting, rewire, fuse board upgrade, emergency callout - it asks the right questions for electrical work.' },
              { icon: '📅', title: 'Books into your live calendar', desc: 'Checks your real availability and books confirmed slots. No double-bookings, no callbacks needed.' },
              { icon: '🚨', title: 'Emergency detection', desc: 'Power out? Burning smell? Sparking socket? The AI detects urgency and texts you immediately.' },
              { icon: '💰', title: 'Handles pricing questions', desc: 'Call-out fees, hourly rates, ballpark costs. Customers get real answers, not "we will call you back."' },
              { icon: '📋', title: 'Captures job details', desc: 'Property type, nature of the work, and whether it is notifiable - so you know what you are walking into.' },
              { icon: '🌙', title: '24/7 including evenings', desc: 'Power cuts do not wait until Monday morning. Neither should your phone answering.' },
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

      <section className="py-14 px-6 md:px-10 bg-white border-t border-[#e5e0da] text-center">
        <div className="max-w-lg mx-auto">
          <h2 className="text-[26px] font-extrabold text-[#1a2e3b] mb-3">Try it for your electrical business</h2>
          <p className="text-[16px] text-[#5a7184] mb-8">7 days free. Hear how it handles your calls before going live.</p>
          <Link href="/onboarding" className="inline-block bg-[#e8930c] text-white px-8 py-4 rounded-xl text-[17px] font-bold no-underline hover:bg-[#d17f00] transition-colors shadow-[0_2px_8px_rgba(232,147,12,0.3)]">Start Your Free Trial</Link>
          <p className="text-[13px] text-[#94a7b8] mt-4">From £69/month · No setup fee · Cancel anytime</p>
        </div>
      </section>
    </>
  );
}
