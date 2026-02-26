import { Metadata } from 'next';
import { VerticalPage } from '@/components/marketing/VerticalPage';

export const metadata: Metadata = {
  title: 'AI Receptionist for Window Cleaners — Supportive AI',
  description: 'Never miss a call while you\'re on a ladder. AI answers, books jobs, sends confirmations. Built specifically for window cleaning businesses.',
};

export default function WindowCleaningPage() {
  return (
    <VerticalPage
      trade="Window Cleaning"
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
        { title: 'Invoicing & payment links', desc: 'After the job, send an invoice from the app. Customer pays via secure Stripe link. Auto-reminders if they forget.' },
        { title: 'Post-job review requests', desc: 'Automated Google review texts after completed jobs. Builds your online reputation on autopilot.' },
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
      phoneNumber="(845) 209-2401"
      accentColor="#e8930c"
      available={true}
    />
  );
}
