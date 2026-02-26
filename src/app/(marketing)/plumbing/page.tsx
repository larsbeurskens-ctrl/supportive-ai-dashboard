import { Metadata } from 'next';
import { VerticalPage } from '@/components/marketing/VerticalPage';

export const metadata: Metadata = {
  title: 'AI Receptionist for Plumbers — Supportive AI',
  description: 'Never miss an emergency call again. AI triages urgency, qualifies leads, and books jobs 24/7. Built for plumbing businesses.',
};

export default function PlumbingPage() {
  return (
    <VerticalPage
      trade="Plumbing"
      headline="Never miss an emergency call again."
      subheadline="Your AI receptionist triages urgency, qualifies the lead, and books the job — so you never lose an emergency call to voicemail again."
      painPoints={[
        "Missed calls go straight to voicemail. The customer Googles the next plumber.",
        "You can't tell urgent from routine when you're already on a job.",
        "Customers expect instant response. If you don't pick up, they move on.",
        "You lose $300-800 emergency jobs to a single missed call.",
      ]}
      capabilities={[
        { title: 'Emergency triage', desc: 'Detects burst pipes, flooding, sewage backup, no hot water. Flags emergencies and notifies you immediately via SMS and phone.' },
        { title: 'Homeowner verification', desc: 'Asks if caller is homeowner or renter. Renters advised to check with landlord — saves you wasted trips.' },
        { title: 'Structured diagnostic intake', desc: "What's the issue? Where in the home? How long? Is water shut off? Access details? Your tech arrives prepared." },
        { title: 'Safety guidance', desc: 'Tells callers to shut off water main if there\'s active flooding. Basic safety advice before you arrive.' },
        { title: 'Service call fee disclosed', desc: 'Communicates your standard service call fee upfront. Full quote on-site — no phone quoting for plumbing.' },
        { title: 'Priority scheduling', desc: 'Emergency calls get the next available slot. Routine maintenance books normally. You set the rules.' },
      ]}
      stats={[
        { value: '$300-800', label: 'Avg emergency job value' },
        { value: '24/7', label: 'Always answering' },
        { value: '< 1s', label: 'Pickup time' },
      ]}
      testimonial={{
        quote: "The AI actually knows plumbing. It asks about water shut-off, property type, the right things. My customers think they're talking to a real receptionist.",
        name: 'Sarah Chen',
        title: 'S. Chen Plumbing',
        stars: 5,
      }}
      phoneNumber="(240) 301-1473"
      accentColor="#e8930c"
      available={true}
    />
  );
}
