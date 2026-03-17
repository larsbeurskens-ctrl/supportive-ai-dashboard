import { Metadata } from 'next';
import { VerticalPage } from '@/components/marketing/VerticalPage';

export const metadata: Metadata = {
  title: 'AI Receptionist for Window Cleaners — Supportive AI',
  description: 'Never miss a call while you\'re on a ladder. AI answers, books jobs, sends confirmations. Built specifically for window cleaning businesses.',
};

// When Lars has 3 recordings, swap src paths to:
//   /audio/wc-booking.m4a
//   /audio/wc-pricing.m4a
//   /audio/wc-reschedule.m4a
const windowCleaningRecordings = [
  {
    id: 'wc-booking',
    src: '/audio/demo-call-wc-booking-mike.m4a',
    scenario: 'New booking — 2-story colonial',
    bubbles: [
      { role: 'ai' as const, text: "Hey there! Thanks for calling Clean Pro Window Washing, this is Sarah. How can I help you today?" },
      { role: 'customer' as const, text: "I'm interested in getting my two story colonial home washed, just the exterior windows only." },
      { role: 'ai' as const, text: "For a two-story exterior, typically you're looking at somewhere between $250 to $400 depending on the property." },
      { role: 'customer' as const, text: "That sounds great. It's 34 Elm Street in Poughkeepsie, 12601." },
      { role: 'ai' as const, text: "We have openings at 8 AM, 9 AM, and 10 AM on Friday. Would any of those work for you?" },
      { role: 'customer' as const, text: "Let's book it in for Friday at 10 AM." },
      { role: 'ai' as const, text: "You're all set for Friday, March 6th at 10 AM! You'll get a confirmation text shortly." },
    ],
  },
  {
    id: 'wc-douglas',
    src: '/audio/demo-call-wc-douglas-insurance.m4a',
    scenario: 'Pricing + insurance — 2-story townhouse',
    bubbles: [
      { role: 'ai' as const, text: "Hey there! Thanks for calling Clean Pro Window Washing. This is Sarah — how can I help you today?" },
      { role: 'customer' as const, text: "Hi, Sarah. This is Douglas. I'm looking for ballpark figures for my two story townhouse — exterior windows only." },
      { role: 'ai' as const, text: "Hey Douglas! For a two-story townhouse exterior, typically $250 to $400. Number of windows, accessibility, and condition all factor in — we'll give you an exact quote on-site." },
      { role: 'customer' as const, text: "Cool. And are you insured for the work that you're doing?" },
      { role: 'ai' as const, text: "Absolutely, Douglas! We're fully insured — liability and workers' comp. You're completely covered." },
      { role: 'customer' as const, text: "That's perfect. Thank you for letting me know." },
    ],
  },
  {
    id: 'wc-jake',
    src: '/audio/demo-call-wc-jake-service-area.m4a',
    scenario: 'Service area + residential vs commercial',
    bubbles: [
      { role: 'ai' as const, text: "Hey there! Thanks for calling Clean Pro Window Washing, this is Sarah. How can I help you today?" },
      { role: 'customer' as const, text: "Hi, Sarah. This is Jake. I have a question — do you serve the Houston area?" },
      { role: 'ai' as const, text: "I appreciate you asking, Jake! Unfortunately we're based in the Hudson Valley in New York, so Houston is outside our service area — I wish I could help!" },
      { role: 'customer' as const, text: "Okay, no worries. And do you serve both residential and commercial properties?" },
      { role: 'ai' as const, text: "Yep, we do both! Residential — houses, townhouses, apartments — and commercial buildings. Whatever you've got, we can take care of it." },
      { role: 'customer' as const, text: "Great. Unfortunately I'm out of the area, but thank you — you've been really helpful!" },
    ],
  },
];

export default function WindowCleaningPage() {
  return (
    <VerticalPage
      trade="Window Cleaning"
      verticalSlug="window-cleaning"
      headline="Stop losing jobs while you're on a ladder."
      subheadline="Every missed call goes to the next company. We answer your phone 24/7, book the job, and send confirmation — so you never lose another customer. Keep your existing number."
      demoConfig={{
        label: 'Window Cleaning Demo',
        phone: '(845) 209-2401',
        tel: '+18452092401',
        addresses: [
          '34 Elm Street, Poughkeepsie, NY 12601',
          '45 Oak Street, Newburgh, NY 12550',
          '8 River Road, Kingston, NY 12401',
        ],
        whatToTry: 'Ask for a quote on a 2-story colonial exterior, book a slot, or say you need to reschedule. Try asking about screens or interior windows too.',
      }}
      painPoints={[
        "You miss 3-5 calls a day because you're on a job site.",
        "By the time you call back from voicemail, they've booked someone else.",
        "You're doing admin at 9pm — returning calls, sending quotes, chasing payments.",
        "Answering services don't know a 2-story colonial from a ranch house.",
        "Half your incoming calls are marketing spam — SEO companies, lead gen services, insurance brokers.",
      ]}
      capabilities={[
        { title: 'Knows your trade', desc: 'Asks about property type, number of stories, interior/exterior, screens, hard water stains. Gives accurate ballpark pricing.' },
        { title: 'Qualifies every lead', desc: 'Captures address, property details, and special concerns before booking. No wasted site visits.' },
        { title: 'Route-aware booking', desc: 'Suggests time slots that cluster jobs by location. Reduces your drive time between appointments.' },
        { title: 'Handles 20+ common questions', desc: 'Pricing, insurance, what\'s included, how long it takes, rain policy. Trained on real customer conversations.' },
        { title: 'Reschedule & cancel', desc: 'Customers can call to reschedule or cancel. The AI finds their booking by name, updates the calendar, and texts confirmation.' },
        { title: 'Booking confirmations by SMS', desc: 'Every booking triggers an automatic confirmation text to the customer and a notification to you.' },
        { title: 'Screens out junk calls', desc: 'Marketing calls, cold sellers, and robocalls talk to your AI instead of you. Only genuine customer enquiries and emergencies get through.' },
      ]}
      stats={[
        { value: '100%', label: 'Calls answered' },
        { value: '< 1s', label: 'Average pickup' },
        { value: '66%', label: 'Call-to-booking rate' },
      ]}
      recordings={windowCleaningRecordings}
      phoneNumber="(845) 209-2401"
      accentColor="#e8930c"
      available={true}
    />
  );
}
