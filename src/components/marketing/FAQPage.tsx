'use client';

import { useState } from 'react';
import Link from 'next/link';
import { PhoneIcon } from './Icons';
import { LeadCaptureForm } from './LeadCaptureForm';

interface FAQItem {
  question: string;
  answer: string | React.ReactNode;
}

function Accordion({ item }: { item: FAQItem }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border border-[#e5e0da] rounded-xl bg-white overflow-hidden">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-6 py-5 text-left bg-white border-none cursor-pointer hover:bg-[#faf9f7] transition-colors"
      >
        <span className="text-[15px] font-semibold text-[#1a2e3b] pr-4">{item.question}</span>
        <svg
          width="20"
          height="20"
          viewBox="0 0 20 20"
          fill="none"
          className={`flex-shrink-0 text-[#94a7b8] transition-transform duration-200 ${open ? 'rotate-180' : ''}`}
        >
          <path d="M5 7.5L10 12.5L15 7.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>
      {open && (
        <div className="px-6 pb-5 pt-0 text-sm text-[#5a7184] leading-relaxed border-t border-[#e5e0da]">
          <div className="pt-4">{item.answer}</div>
        </div>
      )}
    </div>
  );
}

const gettingStartedSteps = [
  { n: '1', title: 'Sign up for your free trial', desc: 'Create your account — no credit card needed. Pick your AI\'s name and a local area code. Your AI phone number is ready in 30 seconds.' },
  { n: '2', title: 'Add your business details', desc: 'Tell your AI your pricing, services, service area, credentials, and any discounts you offer. Takes about 2 minutes. This is what makes it sound like your business — not a generic answering service.' },
  { n: '3', title: 'Make a test call', desc: 'Call your new AI number from your phone. Book a fake job, ask about pricing, try to reschedule — put it through its paces. Adjust anything before going live.' },
  { n: '4', title: 'Connect your Google Calendar', desc: 'One click to authorise Google Calendar access. Your AI can now see your real availability and book directly into open slots — no double-bookings.' },
  { n: '5', title: 'Forward your calls', desc: 'Dial a short code from your phone to forward missed calls (or all calls) to your AI. Step-by-step instructions for every major carrier are on the setup page. Takes 2 minutes.' },
  { n: '6', title: 'Go live', desc: 'Hit the "Go live" button in your dashboard. From that point, your AI starts answering real customer calls. You\'ll get an SMS for every booking with full details.' },
];

const faqSections: { title: string; items: FAQItem[] }[] = [
  {
    title: 'The basics',
    items: [
      {
        question: 'What is Supportive AI?',
        answer: 'Supportive AI is an AI phone assistant built specifically for home service businesses — plumbers, window cleaners, HVAC technicians, and similar trades. It answers your business calls 24/7, has natural conversations with your customers, books appointments directly into your calendar, and sends you SMS notifications with the details. Your customers talk to a friendly, knowledgeable assistant instead of hitting a voicemail box.',
      },
      {
        question: 'How does it actually work?',
        answer: 'When a customer calls your business number, the AI answers within one second using your business name. It has a natural conversation — asking about their needs, property type, urgency level, and preferred timing. It then checks your Google Calendar for real availability, books the appointment, and sends confirmation texts to both you and the customer. The entire call typically takes 2-3 minutes.',
      },
      {
        question: 'Does it really sound like a human?',
        answer: (
          <span>
            The AI uses advanced voice synthesis that sounds natural and conversational — not robotic or scripted.
            The best way to judge is to try it yourself: call our demo line at{' '}
            <a href="tel:+18452092401" className="text-[#1a2e3b] font-semibold no-underline hover:text-[#e8930c]">(845) 209-2401</a>.
            Most callers don&apos;t realize they&apos;re speaking with an AI.
          </span>
        ),
      },
      {
        question: 'What trades do you support?',
        answer: 'We currently have specialized agents for window cleaning, plumbing, and HVAC. Each agent is trained on trade-specific terminology, qualifying questions, and common scenarios. For example, our plumbing agent asks about water shut-off valves and distinguishes emergencies from routine work. We\'re adding more trades throughout 2026.',
      },
    ],
  },
  {
    title: 'Phone setup & your number',
    items: [
      {
        question: 'Do I need to change my phone number?',
        answer: 'No. You have two options: (1) We give you a new local number that the AI answers — you can put this on your website and marketing materials. (2) You forward your existing business number to the AI number. Most customers use option 2 during business hours and the AI catches overflow and after-hours calls.',
      },
      {
        question: 'How do I forward my existing number?',
        answer: 'It depends on your carrier, but it\'s usually a simple settings change or a short code you dial. We provide step-by-step instructions for every major carrier (AT&T, Verizon, T-Mobile, etc.) during setup. Most people have it done in under 5 minutes. You can also set up conditional forwarding — so calls only go to the AI when you\'re busy or don\'t answer after a few rings.',
      },
      {
        question: 'Can I still answer calls myself?',
        answer: 'Absolutely. The most common setup is conditional forwarding: your phone rings first, and if you don\'t pick up within 3-4 rings, it forwards to the AI. That way you answer when you can, and the AI catches everything else. You\'re always in control.',
      },
      {
        question: 'What happens during after-hours calls?',
        answer: 'The AI answers 24/7 — nights, weekends, holidays. For routine calls, it books the appointment for your next available slot. For urgent situations (like a plumbing emergency), it can send you an immediate SMS alert so you can decide whether to call back right away. You set the rules for what counts as urgent.',
      },
    ],
  },
  {
    title: 'Calendar & scheduling',
    items: [
      {
        question: 'Which calendars do you integrate with?',
        answer: 'Google Calendar. The AI reads your real-time availability and books directly into your calendar. It respects existing appointments, blocked time, and travel buffers between jobs.',
      },
      {
        question: 'Can it handle travel time between jobs?',
        answer: 'Yes. We automatically add travel buffers between appointments based on your service area. If you have a job in the north side of town at 10am, the AI won\'t book someone across town at 10:30am. It clusters nearby jobs together to minimize your drive time.',
      },
      {
        question: 'What if I need to cancel or reschedule a booking?',
        answer: 'You manage your calendar as normal. If you delete or move an appointment in Google Calendar, the AI sees the updated availability immediately. We don\'t lock you into anything — your calendar is always the source of truth.',
      },
      {
        question: 'Can it book for multiple crew members?',
        answer: 'Yes, on our Growth plan. You can connect multiple calendars (one per crew member or truck), and the AI will check availability across all of them and book the right one.',
      },
    ],
  },
  {
    title: 'Pricing & billing',
    items: [
      {
        question: 'How much does it cost?',
        answer: (
          <div>
            <p className="mb-3">Three plans, all with a 7-day free trial (up to 50 calls):</p>
            <div className="space-y-2">
              <div className="flex items-baseline gap-2"><strong className="text-[#1a2e3b]">Starter — $149/mo</strong><span>150 calls/month. Everything you need to get started. Includes WhatsApp AI agent.</span></div>
              <div className="flex items-baseline gap-2"><strong className="text-[#1a2e3b]">Pro — $299/mo</strong><span>500 calls/month. Multi-crew scheduling, priority support, review requests.</span></div>
              <div className="flex items-baseline gap-2"><strong className="text-[#1a2e3b]">Growth — $499/mo</strong><span>Unlimited calls. API access, dedicated account manager, custom-built features.</span></div>
            </div>
            <p className="mt-3">No setup fees. No per-seat charges. Cancel anytime.</p>
          </div>
        ),
      },
      {
        question: 'Is there a free trial?',
        answer: 'Yes — 7 days, fully functional, up to 50 calls, no credit card required. You get your own AI phone number and can test it with real calls. If it\'s not for you, just don\'t subscribe.',
      },
      {
        question: 'What happens if I exceed my call limit?',
        answer: 'We keep answering your calls — we\'ll never cut a customer off mid-month. Overage calls are billed at the end of the month at your plan rate (Starter: $1.50/call, Pro: $1.25/call). Growth is unlimited with no overage.',
      },
      {
        question: 'What counts as a "call"?',
        answer: 'Any inbound call that the AI answers and has a real conversation with. Hang-ups under 5 seconds and spam calls don\'t count toward your limit.',
      },
    ],
  },
  {
    title: 'Payments & invoicing',
    items: [
      {
        question: 'How do payments work?',
        answer: 'After completing a job, you can send an invoice from your dashboard with one tap. The customer receives an SMS with a secure Stripe payment link. They pay online, and the money goes directly to your bank account via Stripe. Auto-reminders go out at 24 and 48 hours if unpaid.',
      },
      {
        question: 'Do I need a Stripe account?',
        answer: 'Yes, but we\'ll walk you through setting one up during onboarding — it takes about 5 minutes. Stripe handles all payment processing securely, and funds go directly to your bank account. We never touch your money.',
      },
    ],
  },
  {
    title: 'WhatsApp AI agent',
    items: [
      {
        question: 'Is there a WhatsApp AI agent too?',
        answer: 'Yes — every plan includes a WhatsApp AI agent at no extra cost. Customers who prefer to message rather than call can reach you on WhatsApp. The same AI handles it — same knowledge of your pricing, services, and availability, same ability to book appointments.',
      },
      {
        question: 'Do I need to do anything extra to set up WhatsApp?',
        answer: 'No extra setup. When you sign up, your WhatsApp agent is provisioned automatically alongside your phone number. You can share the WhatsApp number on your website or marketing materials.',
      },
      {
        question: 'Can the WhatsApp agent book appointments too?',
        answer: 'Yes. It has full booking capabilities — it can check your Google Calendar, offer available slots, and confirm bookings just like the voice agent. You\'ll get the same SMS notification for every booking.',
      },
    ],
  },
  {
    title: 'Customisation',
    items: [
      {
        question: 'Can I customise what the AI says?',
        answer: 'Yes. During setup — and at any time from your dashboard — you can update your pricing, services, service area, credentials, special discounts (veterans, seniors, recurring customers), and any custom instructions. The AI uses all of this to have informed conversations that sound specific to your business.',
      },
      {
        question: 'Does it handle discounts and special pricing?',
        answer: 'Yes. You can specify any discounts you offer — veteran discounts, senior rates, first-service offers, referral discounts — and the AI will mention them naturally when relevant. For example, if a caller mentions they\'re a veteran, the AI will bring up your veteran discount without you having to prompt it.',
      },
      {
        question: 'Can it mention financing options?',
        answer: 'Yes. If you offer financing (e.g. through GreenSky or another provider), you can add those details in your setup. The AI will bring it up naturally when a customer asks about payment options or reacts to a price — something like "we do offer financing for larger jobs, would that help?"',
      },
    ],
  },
  {
    title: 'Privacy, security & control',
    items: [
      {
        question: 'Can I see what the AI said to my customers?',
        answer: 'Yes. Every call has a full transcript and summary available in your dashboard. You can review exactly what was discussed, what was booked, and any details the customer shared. Call recordings are also available.',
      },
      {
        question: 'What if the AI makes a mistake?',
        answer: 'The AI is designed to err on the side of caution. If it\'s unsure about something, it\'ll let the caller know and offer to have you call them back. You can review all bookings in your dashboard and adjust anything. The AI gets smarter over time as it learns your specific business preferences.',
      },
      {
        question: 'Is my customer data secure?',
        answer: 'Yes. All data is encrypted in transit and at rest. We don\'t sell or share your customer information with anyone. Your data is yours. We comply with standard data protection practices and you can request data deletion at any time.',
      },
      {
        question: 'Can I customize what the AI says?',
        answer: 'Yes. During setup, you provide your business details, service offerings, pricing guidelines, and any special instructions. The AI uses this to have informed conversations. You can update these anytime from your dashboard.',
      },
    ],
  },
  {
    title: 'Technical & troubleshooting',
    items: [
      {
        question: 'Do I need any technical skills to set up?',
        answer: 'None. The entire setup takes about 15 minutes and is guided step-by-step. If you can use a smartphone and a calendar app, you can set up Supportive AI.',
      },
      {
        question: 'What if I have issues or need help?',
        answer: 'Pro and Growth plans include priority support. All plans have email support. We\'re a small team and we actually respond quickly — usually within a few hours.',
      },
      {
        question: 'Does it work with landlines?',
        answer: 'Yes. Any phone number that supports call forwarding can work with Supportive AI. This includes landlines, cell phones, and VoIP numbers.',
      },
    ],
  },
];

export function FAQPage() {
  return (
    <>
      {/* Hero */}
      <section className="pt-16 pb-8 md:pt-20 md:pb-10 px-6 md:px-10 max-w-[860px] mx-auto text-center">
        <h1 className="text-[36px] md:text-[44px] font-extrabold text-[#1a2e3b] leading-[1.12] mb-4 tracking-[-1px]">
          Frequently Asked Questions
        </h1>
        <p className="text-lg text-[#5a7184] leading-relaxed max-w-[560px] mx-auto">
          Everything you need to know about Supportive AI.
          Can&apos;t find what you&apos;re looking for? Call us.
        </p>
      </section>

      {/* Getting Started Steps */}
      <section className="pb-12 px-6 md:px-10 max-w-[860px] mx-auto">
        <div className="bg-white rounded-2xl border border-[#e5e0da] p-8 md:p-10">
          <h2 className="text-[24px] font-bold text-[#1a2e3b] mb-2">Getting started</h2>
          <p className="text-sm text-[#5a7184] mb-8">Up and running in 15 minutes. Here&apos;s the process:</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-6">
            {gettingStartedSteps.map((step) => (
              <div key={step.n} className="flex gap-4">
                <div className="w-9 h-9 rounded-full bg-[#1a2e3b] text-white flex items-center justify-center flex-shrink-0 text-sm font-bold">
                  {step.n}
                </div>
                <div>
                  <h3 className="text-[14px] font-bold text-[#1a2e3b] mb-0.5">{step.title}</h3>
                  <p className="text-[13px] text-[#5a7184] leading-relaxed">{step.desc}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-8 pt-6 border-t border-[#e5e0da] flex flex-col sm:flex-row gap-3 items-center">
            <Link
              href="/onboarding"
              className="bg-[#e8930c] text-white px-6 py-3 rounded-lg text-sm font-bold no-underline hover:bg-[#d17f00] transition-colors"
            >
              Start Your Free Trial
            </Link>
            <span className="text-[13px] text-[#94a7b8]">14-day free trial · No credit card · Cancel anytime</span>
          </div>
        </div>
      </section>

      {/* FAQ Sections */}
      <section className="pb-16 px-6 md:px-10 max-w-[860px] mx-auto">
        {faqSections.map((section) => (
          <div key={section.title} className="mb-10">
            <h2 className="text-[20px] font-bold text-[#1a2e3b] mb-4 capitalize">{section.title}</h2>
            <div className="space-y-3">
              {section.items.map((item) => (
                <Accordion key={item.question} item={item} />
              ))}
            </div>
          </div>
        ))}
      </section>

      {/* Lead Capture */}
      <section className="pb-16 px-6 md:px-10">
        <div className="max-w-[580px] mx-auto">
          <div className="text-center mb-8">
            <h2 className="text-[24px] font-bold text-[#1a2e3b] mb-2">
              Want to see exactly how it would work for your business?
            </h2>
            <p className="text-[15px] text-[#5a7184]">
              We&apos;ll send you a sample conversation, a breakdown of what it handles,
              and how to get it live in 5 minutes.
            </p>
          </div>
          <div className="bg-white rounded-2xl border border-[#e5e0da] p-6">
            <LeadCaptureForm />
          </div>
          <div className="flex justify-center gap-6 mt-6">
            {['7-day free trial', 'No credit card', 'Cancel anytime'].map((s, i) => (
              <div key={i} className="flex items-center gap-1.5">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#059669" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg>
                <span className="text-[13px] text-[#5a7184] font-medium">{s}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="pb-16 px-6 md:px-10">
        <div className="max-w-[780px] mx-auto bg-[#1a2e3b] rounded-2xl p-10 md:p-12 text-center">
          <h2 className="text-[24px] font-bold text-white mb-2">Still have questions?</h2>
          <p className="text-[15px] text-[#b8c9d4] mb-6">
            The fastest way to understand Supportive AI is to hear it yourself.
          </p>
          <a
            href="tel:+18452092401"
            className="inline-flex items-center gap-3 bg-[#243d4e] rounded-xl px-8 py-[18px] border border-[#35596e] no-underline hover:bg-[#2c4a5d] transition-colors"
          >
            <PhoneIcon size={22} className="text-[#e8930c]" />
            <span className="text-2xl font-bold text-white tracking-wide">(845) 209-2401</span>
          </a>
          <p className="text-[13px] text-[#6b8fa3] mt-3">Call our demo agent — takes 60 seconds.</p>
        </div>
      </section>
    </>
  );
}
