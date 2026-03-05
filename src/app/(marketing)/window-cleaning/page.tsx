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
    id: 'wc-pricing',
    src: '/audio/demo-call-wc-booking-mike.m4a', // Replace with /audio/wc-pricing.m4a
    scenario: 'Pricing question — quote request',
    bubbles: [
      { role: 'ai' as const, text: "Thanks for calling Clean Pro! This is Sarah. How can I help?" },
      { role: 'customer' as const, text: "Hi, I just want a rough idea of pricing before I book. It's a 3-story house." },
      { role: 'ai' as const, text: "For three stories — exterior only — you're usually looking at $350 to $550. Interior windows add roughly $150 on top of that." },
      { role: 'customer' as const, text: "Does that include screens?" },
      { role: 'ai' as const, text: "Yes, cleaning the screens is included. If any need to be repaired or replaced, that would be quoted separately on-site." },
      { role: 'customer' as const, text: "Great. Can I book something for next week?" },
      { role: 'ai' as const, text: "Absolutely. What day works best for you?" },
    ],
  },
  {
    id: 'wc-reschedule',
    src: '/audio/demo-call-wc-booking-mike.m4a', // Replace with /audio/wc-reschedule.m4a
    scenario: 'Reschedule — existing appointment',
    bubbles: [
      { role: 'ai' as const, text: "Clean Pro Window Washing, this is Sarah. How can I help you today?" },
      { role: 'customer' as const, text: "Hi, I need to move my appointment. I have one for Thursday but something came up." },
      { role: 'ai' as const, text: "No problem at all. Can I get your name so I can pull up the booking?" },
      { role: 'customer' as const, text: "It's under Jessica Williams, 14 Harbor Road." },
      { role: 'ai' as const, text: "Got it — I can see your Thursday 9 AM. We have Friday at 10 AM or Monday at 8 AM. Which works better?" },
      { role: 'customer' as const, text: "Monday at 8 works perfectly." },
      { role: 'ai' as const, text: "Done! Moved to Monday at 8 AM. You'll get a confirmation text in a moment, Jessica." },
    ],
  },
];

export default function WindowCleaningPage() {
  return (
    <VerticalPage
      trade="Window Cleaning"
      verticalSlug="window-cleaning"
      headline="Every missed call is a job gone to your competitor."
      subheadline="Your AI agent answers every call, books the job, and sends confirmation — while you're on a ladder."
      painPoints={[
        "You miss 3-5 calls a day because you're on a job site.",
        "By the time you call back from voicemail, they've booked someone else.",
        "You're doing admin at 9pm — returning calls, sending quotes, chasing payments.",
        "Answering services don't know a 2-story colonial from a ranch house.",
      ]}
      capabilities={[
        { title: 'Knows your trade', desc: 'Asks about property type, number of stories, interior/exterior, screens, hard water stains. Gives accurate ballpark pricing.' },
        { title: 'Qualifies every lead', desc: 'Captures address, property details, and special concerns before booking. No wasted site visits.' },
        { title: 'Route-aware booking', desc: 'Suggests time slots that cluster jobs by location. Reduces your drive time between appointments.' },
        { title: 'Handles 20+ common questions', desc: 'Pricing, insurance, what\'s included, how long it takes, rain policy. Trained on real customer conversations.' },
        { title: 'Reschedule & cancel', desc: 'Customers can call to reschedule or cancel. The AI finds their booking by name, updates the calendar, and texts confirmation.' },
        { title: 'Booking confirmations by SMS', desc: 'Every booking triggers an automatic confirmation text to the customer and a notification to you.' },
      ]}
      stats={[
        { value: '100%', label: 'Calls answered' },
        { value: '< 1s', label: 'Average pickup' },
        { value: '66%', label: 'Call-to-booking rate' },
      ]}
      testimonial={{
        quote: "I used to miss 4-5 calls a day while I was up a ladder. Now every call gets answered and booked. My revenue went up 30% in the first month.",
        name: 'Mike Reynolds',
        title: 'Owner, Crystal Clear Windows',
        stars: 5,
      }}
      recordings={windowCleaningRecordings}
      phoneNumber="(845) 209-2401"
      accentColor="#e8930c"
      available={true}
    />
  );
}
