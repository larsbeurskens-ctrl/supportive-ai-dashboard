import { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'AI Phone Answering for Checkatrade Businesses | Supportive AI',
  description: 'You pay Checkatrade for leads. Make sure you actually answer them. AI receptionist for Checkatrade-listed trades. From £69/month.',
};

export default function ForCheckatrade() {
  return (
    <>
      <section className="pt-16 pb-10 px-6 md:px-10 max-w-[820px] mx-auto text-center">
        <p className="text-[13px] font-semibold text-[#e8930c] uppercase tracking-wider mb-3">For Checkatrade businesses</p>
        <h1 className="text-[36px] md:text-[44px] font-extrabold text-[#1a2e3b] leading-[1.15] mb-5 tracking-tight">
          You pay for leads. Make sure you actually answer them.
        </h1>
        <p className="text-lg text-[#5a7184] leading-relaxed max-w-[580px] mx-auto mb-8">
          Checkatrade sends you enquiries. But if you are on a job when they call, that lead goes to the next tradesperson on the list. Supportive AI makes sure every Checkatrade lead gets answered.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center mb-4">
          <Link href="/onboarding" className="bg-[#e8930c] text-white px-8 py-[15px] rounded-lg text-base font-bold no-underline hover:bg-[#d17f00] transition-colors shadow-[0_2px_8px_rgba(232,147,12,0.3)]">Start Your Free Trial</Link>
          <Link href="/demo" className="bg-white text-[#1a2e3b] px-8 py-[15px] rounded-lg text-base font-semibold border border-[#d1ccc6] no-underline hover:bg-[#f0eeeb] transition-colors">Hear the Live Demo</Link>
        </div>
        <p className="text-[13px] text-[#94a7b8]">From £69/month · No setup fee · Cancel anytime</p>
      </section>

      <section className="py-14 px-6 md:px-10 bg-white border-t border-b border-[#e5e0da]">
        <div className="max-w-[820px] mx-auto">
          <h2 className="text-[26px] font-bold text-[#1a2e3b] mb-4">The Checkatrade problem nobody talks about</h2>
          <div className="text-[16px] text-[#5a7184] leading-relaxed space-y-4">
            <p>You pay Checkatrade £30-50 per lead. A customer sees your profile, likes your reviews, and calls your number. But you are under a sink, on a roof, or driving to the next job.</p>
            <p>The call goes to voicemail. The customer does not leave a message. They go back to Checkatrade and call the next tradesperson.</p>
            <p>You just paid for a lead you never spoke to. That happens 3-5 times a week for most Checkatrade businesses.</p>
            <p className="text-[#1a2e3b] font-semibold">At £30-50 per lead, those missed calls are costing you £100-250 per week in wasted Checkatrade spend - before you even count the lost job revenue.</p>
          </div>
        </div>
      </section>

      <section className="py-14 px-6 md:px-10">
        <div className="max-w-[820px] mx-auto">
          <h2 className="text-[26px] font-bold text-[#1a2e3b] mb-6">How it works with Checkatrade</h2>
          <div className="space-y-6">
            {[
              { step: '1', title: 'Customer finds you on Checkatrade', desc: 'They see your profile, your reviews, your rating. They call your business number.' },
              { step: '2', title: 'Call gets answered instantly', desc: 'Even if you are on a job. The AI picks up with your business name, handles the enquiry, and books the job into your calendar.' },
              { step: '3', title: 'You get the job, not your competitor', desc: 'Customer gets a confirmation text. You get the details. The lead you paid for actually converts into work.' },
            ].map((s, i) => (
              <div key={i} className="flex gap-4 items-start">
                <div className="w-10 h-10 rounded-full bg-[#1a2e3b] text-white flex items-center justify-center text-[16px] font-bold flex-shrink-0">{s.step}</div>
                <div>
                  <h3 className="text-[16px] font-bold text-[#1a2e3b] mb-1">{s.title}</h3>
                  <p className="text-[14px] text-[#5a7184] leading-relaxed">{s.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-14 px-6 md:px-10 bg-white border-t border-b border-[#e5e0da]">
        <div className="max-w-[820px] mx-auto">
          <h2 className="text-[26px] font-bold text-[#1a2e3b] mb-6">The ROI for Checkatrade businesses</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-[#fef2f2] rounded-xl px-6 py-5 border border-[#fecaca]">
              <p className="text-[15px] font-bold text-[#dc2626] mb-3">Without Supportive AI</p>
              <div className="space-y-2 text-[14px] text-[#5a7184]">
                <div className="flex justify-between"><span>Checkatrade leads per week</span><span className="font-bold text-[#1a2e3b]">10</span></div>
                <div className="flex justify-between"><span>Calls missed (on a job)</span><span className="font-bold text-[#dc2626]">3-4</span></div>
                <div className="flex justify-between"><span>Cost per missed lead</span><span className="font-bold text-[#dc2626]">£30-50</span></div>
                <div className="flex justify-between border-t border-[#fecaca] pt-2"><span>Wasted Checkatrade spend/month</span><span className="font-extrabold text-[#dc2626]">£400-800</span></div>
                <div className="flex justify-between"><span>+ Lost job revenue/month</span><span className="font-extrabold text-[#dc2626]">£2,000-4,000</span></div>
              </div>
            </div>
            <div className="bg-[#f0fdf4] rounded-xl px-6 py-5 border border-[#bbf7d0]">
              <p className="text-[15px] font-bold text-[#059669] mb-3">With Supportive AI</p>
              <div className="space-y-2 text-[14px] text-[#5a7184]">
                <div className="flex justify-between"><span>Checkatrade leads per week</span><span className="font-bold text-[#1a2e3b]">10</span></div>
                <div className="flex justify-between"><span>Calls answered</span><span className="font-bold text-[#059669]">10 out of 10</span></div>
                <div className="flex justify-between"><span>Jobs booked from those leads</span><span className="font-bold text-[#059669]">7-8</span></div>
                <div className="flex justify-between border-t border-[#bbf7d0] pt-2"><span>Supportive AI cost</span><span className="font-extrabold text-[#059669]">£69/month</span></div>
                <div className="flex justify-between"><span>Extra revenue captured</span><span className="font-extrabold text-[#059669]">£2,000-4,000</span></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-14 px-6 md:px-10">
        <div className="max-w-[820px] mx-auto">
          <h2 className="text-[26px] font-bold text-[#1a2e3b] mb-6">Also works with</h2>
          <div className="grid sm:grid-cols-3 gap-4">
            {[
              { name: 'MyBuilder', desc: 'Same problem, same solution. Leads you pay for deserve to be answered.' },
              { name: 'Bark', desc: 'When a Bark lead calls, the first responder wins. Be the first responder every time.' },
              { name: 'Rated People', desc: 'Stop paying for leads that go to voicemail. Every call answered, every job booked.' },
            ].map((p, i) => (
              <div key={i} className="bg-[#faf9f7] rounded-xl px-5 py-4 border border-[#e5e0da]">
                <h3 className="text-[15px] font-bold text-[#1a2e3b] mb-1">{p.name}</h3>
                <p className="text-[13px] text-[#5a7184] leading-relaxed">{p.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-14 px-6 md:px-10 bg-white border-t border-[#e5e0da] text-center">
        <div className="max-w-lg mx-auto">
          <h2 className="text-[26px] font-extrabold text-[#1a2e3b] mb-3">Stop paying for leads you never answer</h2>
          <p className="text-[16px] text-[#5a7184] mb-8">Supportive AI costs less than two missed Checkatrade leads per month. And it catches every single one.</p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center mb-4">
            <Link href="/onboarding" className="bg-[#e8930c] text-white px-8 py-4 rounded-xl text-[17px] font-bold no-underline hover:bg-[#d17f00] transition-colors shadow-[0_2px_8px_rgba(232,147,12,0.3)]">Start Your Free Trial</Link>
            <Link href="/guarantee" className="bg-white text-[#1a2e3b] px-8 py-4 rounded-xl text-[17px] font-bold border-2 border-[#1a2e3b] no-underline hover:bg-[#1a2e3b] hover:text-white transition-colors">See Our Guarantee</Link>
          </div>
          <p className="text-[13px] text-[#94a7b8]">From £69/month · 3 jobs in 30 days or your money back</p>
        </div>
      </section>
    </>
  );
}
