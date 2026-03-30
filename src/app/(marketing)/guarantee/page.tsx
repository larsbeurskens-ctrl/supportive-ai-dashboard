import { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Our Guarantee - Book 3 Jobs or Your Money Back | Supportive AI',
  description: 'Book 3 real jobs in your first month or we refund every penny. No questions. No small print. AI phone answering that pays for itself.',
};

export default function GuaranteePage() {
  return (
    <>
      <section className="pt-16 pb-10 px-6 md:px-10 max-w-[700px] mx-auto text-center">
        <div className="inline-flex items-center gap-2 bg-[#f0fdf4] text-[#059669] text-[13px] font-bold px-4 py-2 rounded-full mb-6 border border-[#bbf7d0]">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#059669" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg>
          Money-back guarantee
        </div>
        <h1 className="text-[36px] md:text-[44px] font-extrabold text-[#1a2e3b] leading-[1.15] mb-5 tracking-tight">
          Book 3 jobs in your first month - or we refund every penny.
        </h1>
        <p className="text-lg text-[#5a7184] leading-relaxed max-w-[560px] mx-auto">
          We are confident Supportive AI pays for itself. So here is the deal.
        </p>
      </section>

      <section className="px-6 md:px-10 pb-14">
        <div className="max-w-[700px] mx-auto">
          <div className="bg-white rounded-2xl border-2 border-[#059669] overflow-hidden shadow-sm">
            <div className="px-8 py-8">
              <p className="text-[16px] text-[#5a7184] leading-relaxed mb-6">
                Sign up, connect your calendar, and forward your calls. If our AI receptionist does not book at least 3 real jobs for your business in the first 30 days, we will refund your subscription in full. No questions. No small print.
              </p>

              <h2 className="text-[20px] font-bold text-[#1a2e3b] mb-4">How it works</h2>
              <p className="text-[15px] text-[#5a7184] leading-relaxed mb-6">
                A &quot;booked job&quot; means a confirmed appointment in your calendar that came through a call our AI handled. We can see this in your dashboard - same data you see.
              </p>

              <h2 className="text-[20px] font-bold text-[#1a2e3b] mb-4">The rules are simple</h2>
              <div className="space-y-3 mb-8">
                {[
                  'You need to be forwarding calls to us (we cannot book jobs if the phone does not ring)',
                  'Your calendar needs to be connected with real availability',
                  'The 30-day window starts from your first live call',
                ].map((rule, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <div className="w-6 h-6 rounded-full bg-[#f0fdf4] flex items-center justify-center flex-shrink-0 mt-0.5">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#059669" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg>
                    </div>
                    <p className="text-[15px] text-[#5a7184] leading-relaxed">{rule}</p>
                  </div>
                ))}
              </div>

              <h2 className="text-[20px] font-bold text-[#1a2e3b] mb-4">Why we offer this</h2>
              <p className="text-[15px] text-[#5a7184] leading-relaxed mb-3">
                Most plumbers who try Supportive AI book their first job within the first week. By the end of the month, the typical user has booked 5-10 jobs they would have missed.
              </p>
              <p className="text-[15px] text-[#5a7184] leading-relaxed mb-6">
                At an average job value of £200, that is £1,000-2,000 in revenue from a £69 investment.
              </p>
              <p className="text-[16px] text-[#1a2e3b] font-bold">
                The guarantee is not a marketing gimmick. It is what happens when the product actually works.
              </p>
            </div>

            <div className="px-8 py-6 bg-[#f0fdf4] border-t border-[#bbf7d0]">
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                <div>
                  <p className="text-[14px] font-bold text-[#059669]">The guarantee kicks in automatically</p>
                  <p className="text-[13px] text-[#5a7184]">No forms to fill. No claims process. Just results or a refund.</p>
                </div>
                <Link href="/onboarding" className="bg-[#e8930c] text-white px-8 py-3.5 rounded-xl text-[16px] font-bold no-underline hover:bg-[#d17f00] transition-colors shadow-[0_2px_8px_rgba(232,147,12,0.3)] whitespace-nowrap">
                  Start Your Free Trial
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-14 px-6 md:px-10 bg-white border-t border-b border-[#e5e0da]">
        <div className="max-w-[700px] mx-auto">
          <h2 className="text-[26px] font-bold text-[#1a2e3b] mb-6 text-center">The maths behind the guarantee</h2>
          <div className="bg-[#faf9f7] rounded-2xl px-6 py-6 border border-[#e5e0da] max-w-[450px] mx-auto">
            <div className="space-y-3 text-[15px] text-[#5a7184]">
              <div className="flex justify-between"><span>Supportive AI cost</span><span className="font-bold text-[#1a2e3b]">£69/month</span></div>
              <div className="flex justify-between"><span>Guarantee threshold</span><span className="font-bold text-[#1a2e3b]">3 booked jobs</span></div>
              <div className="flex justify-between"><span>Average job value</span><span className="font-bold text-[#1a2e3b]">£200</span></div>
              <div className="flex justify-between border-t border-[#e5e0da] pt-3"><span>Revenue from 3 jobs</span><span className="font-extrabold text-[#059669]">£600</span></div>
              <div className="flex justify-between"><span>Your investment</span><span className="font-bold text-[#1a2e3b]">£69</span></div>
              <div className="flex justify-between border-t border-[#e5e0da] pt-3 text-[17px]"><span className="font-bold text-[#1a2e3b]">Return</span><span className="font-extrabold text-[#059669]">8.7x</span></div>
            </div>
          </div>
          <p className="text-center text-[14px] text-[#5a7184] mt-4">And most users book 5-10 jobs per month, not 3.</p>
        </div>
      </section>

      <section className="py-10 px-6 md:px-10"><div className="max-w-[820px] mx-auto"><h2 className="text-[18px] font-bold text-[#1a2e3b] mb-4">Related</h2><div className="grid sm:grid-cols-2 gap-3">
        <Link href="/case-studies" className="bg-[#faf9f7] rounded-xl px-4 py-3 border border-[#e5e0da] no-underline hover:border-[#e8930c] block"><p className="text-[13px] font-bold text-[#1a2e3b]">Real call scenarios handled by the AI</p><p className="text-[11px] text-[#94a7b8]">Case studies</p></Link>
        <Link href="/blog/stop-missing-calls-tradesman" className="bg-[#faf9f7] rounded-xl px-4 py-3 border border-[#e5e0da] no-underline hover:border-[#e8930c] block"><p className="text-[13px] font-bold text-[#1a2e3b]">How to stop missing calls on a job</p><p className="text-[11px] text-[#94a7b8]">Blog · 5 min</p></Link>
        <Link href="/pricing" className="bg-[#faf9f7] rounded-xl px-4 py-3 border border-[#e5e0da] no-underline hover:border-[#e8930c] block"><p className="text-[13px] font-bold text-[#1a2e3b]">Transparent pricing from £69/month</p><p className="text-[11px] text-[#94a7b8]">Pricing</p></Link>
        <Link href="/ai-receptionist-for-plumbers" className="bg-[#faf9f7] rounded-xl px-4 py-3 border border-[#e5e0da] no-underline hover:border-[#e8930c] block"><p className="text-[13px] font-bold text-[#1a2e3b]">AI receptionist for plumbers</p><p className="text-[11px] text-[#94a7b8]">Industry</p></Link>
      </div></div></section>

      <section className="py-14 px-6 md:px-10 text-center">
        <div className="max-w-lg mx-auto">
          <h2 className="text-[26px] font-extrabold text-[#1a2e3b] mb-3">Risk-free. Results or refund.</h2>
          <p className="text-[16px] text-[#5a7184] mb-8">7-day free trial to start. Then 30 days to see 3 booked jobs. If it does not deliver, you pay nothing.</p>
          <Link href="/onboarding" className="inline-block bg-[#e8930c] text-white px-8 py-4 rounded-xl text-[17px] font-bold no-underline hover:bg-[#d17f00] transition-colors shadow-[0_2px_8px_rgba(232,147,12,0.3)]">Start Your Free Trial</Link>
          <p className="text-[13px] text-[#94a7b8] mt-4">From £69/month · Guarantee included automatically</p>
        </div>
      </section>
    </>
  );
}
