'use client';

import { useState } from 'react';
import Link from 'next/link';
import { DemoOverlay } from '@/components/marketing/DemoOverlay';

const DEMO_CONFIG = {
  label: 'UK Electrical Demo',
  phone: '07886 080 139',
  tel: '+447886080139',
  addresses: ['9 Japan Crescent, N4 4BB', '2 Anerley Park Mansions, SE20 8NE', '14 Lavender Hill, SW11 3RB'],
  whatToTry: 'Report a tripping fuse board, ask about socket installation pricing, or request an EICR. Use a London postcode like N4 4BB. Try reporting a burning smell to test emergency handling.',
};

export default function AIReceptionistForElectricians() {
  const [showDemo, setShowDemo] = useState(false);

  return (
    <>
      {showDemo && <DemoOverlay onClose={() => setShowDemo(false)} configs={[DEMO_CONFIG]} />}

      {/* HERO */}
      <section className="pt-16 pb-10 px-6 md:px-10 max-w-[820px] mx-auto text-center">
        <p className="text-[13px] font-semibold text-[#e8930c] uppercase tracking-wider mb-3">AI receptionist for electricians</p>
        <h1 className="text-[36px] md:text-[44px] font-extrabold text-[#1a2e3b] leading-[1.15] mb-5 tracking-tight">
          Stop losing electrical jobs to missed calls
        </h1>
        <p className="text-lg text-[#5a7184] leading-relaxed max-w-[580px] mx-auto mb-8">
          When you are up a ladder, in a loft, or mid-rewire, you cannot answer the phone. Supportive AI picks up, qualifies the job, and books it into your calendar - 24/7.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center mb-4">
          <Link href="/onboarding" className="bg-[#e8930c] text-white px-8 py-[15px] rounded-lg text-base font-bold no-underline hover:bg-[#d17f00] transition-colors shadow-[0_2px_8px_rgba(232,147,12,0.3)]">
            Start Your Free Trial
          </Link>
          <button onClick={() => setShowDemo(true)} className="bg-white text-[#1a2e3b] px-8 py-[15px] rounded-lg text-base font-semibold border border-[#d1ccc6] hover:bg-[#f0eeeb] transition-colors cursor-pointer">
            Call the Live Demo
          </button>
        </div>
        <p className="text-[13px] text-[#94a7b8]">From £69/month · No setup fee · Cancel anytime</p>
      </section>

      {/* PAIN */}
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

      {/* WHAT IT HANDLES */}
      <section className="py-14 px-6 md:px-10">
        <div className="max-w-[820px] mx-auto">
          <h2 className="text-[26px] font-bold text-[#1a2e3b] mb-6">Built for how electricians actually work</h2>
          <div className="grid sm:grid-cols-2 gap-5">
            {[
              { icon: '🔌', title: 'Qualifies the job type', desc: 'Socket fitting, rewire, consumer unit upgrade, EICR, EV charger installation, fault finding - it asks the right questions for electrical work.' },
              { icon: '📅', title: 'Books into your live calendar', desc: 'Checks your real availability and books confirmed slots. No double-bookings, no callbacks needed.' },
              { icon: '🚨', title: 'Safety-first emergency handling', desc: 'Burning smell? Sparking? Power out? The AI escalates immediately via text. It never gives DIY electrical advice - safety comes first.' },
              { icon: '💰', title: 'Handles pricing questions', desc: 'Call-out fees, socket costs, consumer unit upgrades, EICR pricing. Customers get real answers, not "we will call you back."' },
              { icon: '📋', title: 'Collects the details you need', desc: 'Property type, rough age of the property, nature of the work. You arrive prepared with the right kit.' },
              { icon: '🏆', title: 'Part P and certification ready', desc: '"All our work is carried out by Part P registered electricians and comes with full certification." Built into every call.' },
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

      {/* EMERGENCY vs ROUTINE */}
      <section className="py-14 px-6 md:px-10 bg-white border-t border-b border-[#e5e0da]">
        <div className="max-w-[820px] mx-auto">
          <h2 className="text-[26px] font-bold text-[#1a2e3b] mb-6">It knows the difference between urgent and routine</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-[#fef2f2] rounded-xl px-6 py-5 border border-[#fecaca]">
              <p className="text-[15px] font-bold text-[#dc2626] mb-3">Emergency call</p>
              <p className="text-[14px] text-[#5a7184] mb-2 italic">&quot;There is a burning smell coming from my socket and I can see scorch marks&quot;</p>
              <div className="text-[14px] text-[#5a7184] space-y-1.5 mt-3">
                <p className="font-semibold text-[#dc2626]">AI response:</p>
                <p>&quot;That sounds like it could be serious. Please make sure everyone stays well away from the area.&quot;</p>
                <p>Collects name, phone, postcode in 60 seconds.</p>
                <p>Sends EMERGENCY SMS to you immediately.</p>
                <p className="font-semibold text-[#dc2626]">No DIY advice. No &quot;try resetting the breaker.&quot; Safety first.</p>
              </div>
            </div>
            <div className="bg-[#f0fdf4] rounded-xl px-6 py-5 border border-[#bbf7d0]">
              <p className="text-[15px] font-bold text-[#059669] mb-3">Routine call</p>
              <p className="text-[14px] text-[#5a7184] mb-2 italic">&quot;I need a couple of extra sockets put in my kitchen&quot;</p>
              <div className="text-[14px] text-[#5a7184] space-y-1.5 mt-3">
                <p className="font-semibold text-[#059669]">AI response:</p>
                <p>Collects details: name, property type, postcode, address.</p>
                <p>Checks your live calendar for available slots.</p>
                <p>Books the job, texts both sides a confirmation.</p>
                <p className="font-semibold text-[#059669]">Job locked in. Customer sorted. You find out when you check your phone.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* PRICING THE AI KNOWS */}
      <section className="py-14 px-6 md:px-10">
        <div className="max-w-[820px] mx-auto">
          <h2 className="text-[26px] font-bold text-[#1a2e3b] mb-6">Your AI knows your pricing</h2>
          <p className="text-[15px] text-[#5a7184] mb-6">When a customer asks &quot;how much?&quot;, it gives them a real answer - not &quot;someone will call you back.&quot;</p>
          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4">
            {[
              { job: 'Call-out fee', price: '£80', note: 'Comes off the bill if work goes ahead' },
              { job: 'Socket installation', price: '£55-75', note: 'Per socket' },
              { job: 'Light fitting', price: '£50-80', note: 'Per fitting' },
              { job: 'Consumer unit upgrade', price: '£350-600', note: 'Depends on circuits' },
              { job: 'EICR inspection', price: '£150-250', note: 'Depends on property size' },
              { job: 'EV charger', price: '£800-1,500', note: 'Supplied and installed' },
            ].map((item, i) => (
              <div key={i} className="bg-[#faf9f7] rounded-xl px-4 py-3 border border-[#e5e0da]">
                <p className="text-[13px] font-semibold text-[#5a7184]">{item.job}</p>
                <p className="text-[20px] font-extrabold text-[#1a2e3b]">{item.price}</p>
                <p className="text-[11px] text-[#94a7b8]">{item.note}</p>
              </div>
            ))}
          </div>
          <p className="text-[13px] text-[#94a7b8] mt-4">These are the defaults. You set your own prices during setup and the AI uses yours.</p>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-14 px-6 md:px-10 bg-white border-t border-b border-[#e5e0da]">
        <div className="max-w-[820px] mx-auto">
          <h2 className="text-[26px] font-bold text-[#1a2e3b] mb-6">Questions from electricians</h2>
          <div className="space-y-4">
            {[
              { q: 'Can it handle Part P enquiries?', a: "It tells callers that all work is carried out by Part P registered electricians with full certification. It asks about the type of work and property details so you know whether it is notifiable before you arrive." },
              { q: 'What about emergency callouts?', a: "It detects urgent situations - burning smells, sparking, power out, exposed wires. Emergency calls trigger an immediate text to you with all the details. Critically, it never gives DIY electrical advice to callers. Safety first." },
              { q: 'Does it know about EICRs?', a: "Yes. It can explain what an EICR is, quote your pricing, and book the inspection into your calendar. It also asks about property size to help you prepare." },
              { q: 'Can it handle EV charger enquiries?', a: "Yes. It quotes your installation price, explains what is involved, and books a site visit. EV charger installation is the fastest growing segment - make sure every enquiry gets answered." },
              { q: 'Do I need to change my number?', a: "No. Keep your existing number. Just forward calls to us when you want. You control when the AI answers - after hours, when you miss a call, or all the time." },
              { q: 'How fast can I get set up?', a: "Live in a day. We build a version tailored to your electrical business - your pricing, your service area, your calendar. You approve it before it goes live." },
            ].map((item, i) => (
              <div key={i} className="bg-[#faf9f7] rounded-xl px-5 py-4 border border-[#e5e0da]">
                <h3 className="text-[14px] font-bold text-[#1a2e3b] mb-2">{item.q}</h3>
                <p className="text-[13px] text-[#5a7184] leading-relaxed">{item.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-14 px-6 md:px-10 text-center">
        <div className="max-w-lg mx-auto">
          <h2 className="text-[26px] font-extrabold text-[#1a2e3b] mb-3">
            Hear how it handles electrical calls
          </h2>
          <p className="text-[16px] text-[#5a7184] mb-8">
            Call our live demo now. Report a tripping fuse board, ask about pricing, or test the emergency handling. Judge for yourself.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center mb-4">
            <Link href="/onboarding" className="bg-[#e8930c] text-white px-8 py-4 rounded-xl text-[17px] font-bold no-underline hover:bg-[#d17f00] transition-colors shadow-[0_2px_8px_rgba(232,147,12,0.3)]">
              Start Your Free Trial
            </Link>
            <button onClick={() => setShowDemo(true)} className="bg-white text-[#1a2e3b] px-8 py-4 rounded-xl text-[17px] font-bold border-2 border-[#1a2e3b] hover:bg-[#1a2e3b] hover:text-white transition-colors cursor-pointer">
              Call the Live Demo
            </button>
          </div>
          <p className="text-[13px] text-[#94a7b8]">From £69/month · No setup fee · 3 jobs in 30 days or your money back</p>
        </div>
      </section>
    </>
  );
}
