import { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'AI Receptionist for Plumbers UK - 24/7 Call Answering & Booking | Supportive AI',
  description: 'AI phone answering built for UK plumbers. Books jobs into your live calendar, handles pricing questions, texts confirmations. From £69/month. Hear a real call.',
  keywords: 'AI receptionist plumber, AI phone answering plumber UK, plumber answering service, 24/7 plumber receptionist, virtual receptionist plumber',
};

export default function AIReceptionistForPlumbers() {
  return (
    <>
      <section className="pt-16 pb-10 px-6 md:px-10 max-w-[820px] mx-auto text-center">
        <p className="text-[13px] font-semibold text-[#e8930c] uppercase tracking-wider mb-3">AI receptionist for plumbers</p>
        <h1 className="text-[36px] md:text-[44px] font-extrabold text-[#1a2e3b] leading-[1.15] mb-5 tracking-tight">Every call answered. Every job booked. Even when you can&apos;t pick up.</h1>
        <p className="text-lg text-[#5a7184] leading-relaxed max-w-[580px] mx-auto mb-8">Supportive AI answers your phone 24/7, handles customer enquiries, checks your live calendar, and books jobs - so you stop losing work to voicemail.</p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center mb-4">
          <Link href="/onboarding" className="bg-[#e8930c] text-white px-8 py-[15px] rounded-lg text-base font-bold no-underline hover:bg-[#d17f00] transition-colors shadow-[0_2px_8px_rgba(232,147,12,0.3)]">Start Your Free Trial</Link>
          <Link href="/plumbing#hear-it" className="bg-white text-[#1a2e3b] px-8 py-[15px] rounded-lg text-base font-semibold border border-[#d1ccc6] no-underline hover:bg-[#f0eeeb] transition-colors">Hear Real Call Recordings</Link>
        </div>
        <p className="text-[13px] text-[#94a7b8]">From £69/month · No setup fee · Cancel anytime</p>
      </section>

      <section className="py-14 px-6 md:px-10 bg-white border-t border-b border-[#e5e0da]">
        <div className="max-w-[820px] mx-auto">
          <h2 className="text-[26px] md:text-[30px] font-bold text-[#1a2e3b] mb-3">Built specifically for plumbing businesses</h2>
          <p className="text-[15px] text-[#5a7184] mb-8">Not a generic answering service. Every detail is designed for how plumbers actually work.</p>
          <div className="grid sm:grid-cols-2 gap-5">
            {[
              { icon: '📅', title: 'Books jobs into your live calendar', desc: 'Checks your real availability, offers slots to the caller, and confirms the booking. No double-bookings. No callbacks needed.' },
              { icon: '💰', title: 'Knows your pricing', desc: "Answers call-out fees, ballpark repair costs, and explains how pricing works - so customers don't need to call back." },
              { icon: '🚨', title: 'Handles emergencies differently', desc: 'Detects urgent calls like burst pipes and floods. Escalates immediately via text so you can respond fast.' },
              { icon: '💬', title: 'Texts both sides', desc: 'Customer gets a booking confirmation. You get the job details. Everyone knows what is happening, instantly.' },
              { icon: '📍', title: 'Understands UK addresses', desc: 'Handles postcodes, corrects garbled street names, and validates locations. Built for the UK from the ground up.' },
              { icon: '🌙', title: '24/7 including evenings and weekends', desc: "Customers call at 9pm on a Sunday. The call still gets answered and the job gets booked for Monday." },
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

      <section className="py-14 px-6 md:px-10">
        <div className="max-w-[820px] mx-auto">
          <h2 className="text-[26px] md:text-[30px] font-bold text-[#1a2e3b] mb-6">Why plumbers switch from answering services</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-[14px]">
              <thead><tr className="border-b-2 border-[#1a2e3b]">
                <th className="text-left py-3 pr-4 text-[#5a7184] font-semibold"></th>
                <th className="text-center py-3 px-4 text-[#1a2e3b] font-bold">Supportive AI</th>
                <th className="text-center py-3 px-4 text-[#94a7b8] font-semibold">Traditional answering</th>
                <th className="text-center py-3 pl-4 text-[#94a7b8] font-semibold">Voicemail</th>
              </tr></thead>
              <tbody className="text-[13px]">
                {[
                  ['Books into your calendar', '✅', '❌ Takes a message', '❌'],
                  ['Checks real availability', '✅', '❌', '❌'],
                  ['Handles pricing questions', '✅', '❌ "Someone will call back"', '❌'],
                  ['Texts confirmation to customer', '✅', '❌', '❌'],
                  ['24/7 including bank holidays', '✅', '💰 Extra charge', '✅'],
                  ['Multiple calls at once', '✅ Unlimited', '❌ One at a time', '✅'],
                  ['Monthly cost', '£69', '£200-400+', 'Free'],
                  ['Per-minute charges', 'None', '£1-2/min', 'None'],
                ].map((row, i) => (
                  <tr key={i} className="border-b border-[#e5e0da]">
                    <td className="py-3 pr-4 font-semibold text-[#1a2e3b]">{row[0]}</td>
                    <td className="py-3 px-4 text-center">{row[1]}</td>
                    <td className="py-3 px-4 text-center text-[#94a7b8]">{row[2]}</td>
                    <td className="py-3 pl-4 text-center text-[#94a7b8]">{row[3]}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      <section className="py-14 px-6 md:px-10 bg-white border-t border-b border-[#e5e0da]">
        <div className="max-w-[820px] mx-auto">
          <h2 className="text-[26px] font-bold text-[#1a2e3b] mb-6">Common questions from plumbers</h2>
          <div className="space-y-4">
            {[
              { q: 'Do I need to change my phone number?', a: "No. Keep your existing number. Just forward calls when you want. You control when the AI answers - after hours, when you miss a call, or all the time." },
              { q: 'How does it know my availability?', a: "It connects to your Google Calendar. When a customer asks for Thursday at 2pm, it checks your real diary and only offers slots that are genuinely free." },
              { q: 'Can it handle emergency calls?', a: "Yes. It detects burst pipes, flooding, and gas leaks. Emergency calls trigger an instant text to you. Non-urgent enquiries get booked normally." },
              { q: "What if the customer asks something it can't answer?", a: "It takes their details and lets them know someone will call back shortly. You get a text immediately with the customer name, number, and what they asked." },
              { q: 'Will customers know it is AI?', a: "Most callers don't notice. It sounds natural, uses your business name, and knows your pricing. Press play on our demo recordings and judge for yourself." },
              { q: 'How quickly can I get set up?', a: "You can be live in a day. We set up a version tailored to your plumbing business. You hear it and approve it before it goes live." },
            ].map((item, i) => (
              <div key={i} className="bg-[#faf9f7] rounded-xl px-5 py-4 border border-[#e5e0da]">
                <h3 className="text-[14px] font-bold text-[#1a2e3b] mb-2">{item.q}</h3>
                <p className="text-[13px] text-[#5a7184] leading-relaxed">{item.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-14 px-6 md:px-10 text-center">
        <div className="max-w-lg mx-auto">
          <h2 className="text-[26px] md:text-[30px] font-extrabold text-[#1a2e3b] mb-3">Hear how it would sound for your plumbing business</h2>
          <p className="text-[16px] text-[#5a7184] mb-8">We set up a free version tailored to your business so you can test it before going live.</p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center mb-4">
            <Link href="/onboarding" className="bg-[#e8930c] text-white px-8 py-4 rounded-xl text-[17px] font-bold no-underline hover:bg-[#d17f00] transition-colors shadow-[0_2px_8px_rgba(232,147,12,0.3)]">Start Your Free Trial</Link>
            <Link href="/demo" className="bg-white text-[#1a2e3b] px-8 py-4 rounded-xl text-[17px] font-bold border-2 border-[#1a2e3b] no-underline hover:bg-[#1a2e3b] hover:text-white transition-colors">Call the Live Demo</Link>
          </div>
          <p className="text-[13px] text-[#94a7b8]">From £69/month · No setup fee · Cancel anytime</p>
        </div>
      </section>
    </>
  );
}
