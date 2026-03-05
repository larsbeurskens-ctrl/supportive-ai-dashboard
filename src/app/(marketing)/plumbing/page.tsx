import { Metadata } from 'next';
import { VerticalPage } from '@/components/marketing/VerticalPage';

export const metadata: Metadata = {
  title: 'AI Receptionist for Plumbers — Supportive AI',
  description: 'Never miss an emergency call again. AI triages urgency, qualifies leads, and books jobs 24/7. Built for plumbing businesses.',
};

// When Lars has 3 recordings, swap src paths to:
//   /audio/plumbing-booking.m4a
//   /audio/plumbing-emergency.m4a
//   /audio/plumbing-pricing.m4a
const plumbingRecordings = [
  {
    id: 'plumb-emergency',
    src: '/audio/demo-call-plumbing-emergency-john.m4a',
    scenario: 'Active leak — emergency escalation',
    bubbles: [
      { role: 'ai' as const, text: "Thank you for calling Hudson Valley Plumbing! This is Sarah. How can I help you today?" },
      { role: 'customer' as const, text: "I'm up to my ankle in water. I have a leaky faucet in the upstairs bathroom." },
      { role: 'ai' as const, text: "That sounds like it could be an emergency. Do you have water actively leaking or flooding right now?" },
      { role: 'customer' as const, text: "Yes, actively leaking and it's rising quickly." },
      { role: 'ai' as const, text: "First — can you locate your main water shut-off and turn it off? I'm flagging this as an emergency right now." },
      { role: 'customer' as const, text: "I'm at 60 Market Street in Poughkeepsie. Name is John." },
      { role: 'ai' as const, text: "Our team is being notified now and will call you right back. Stay safe, John." },
    ],
  },
  {
    id: 'plumb-booking',
    src: '/audio/demo-call-plumbing-emergency-john.m4a', // Replace with /audio/plumbing-booking.m4a
    scenario: 'Routine booking — dripping faucet',
    bubbles: [
      { role: 'ai' as const, text: "Hudson Valley Plumbing, this is Sarah. How can I help?" },
      { role: 'customer' as const, text: "Hi, I have a dripping kitchen faucet I'd like looked at. Nothing urgent." },
      { role: 'ai' as const, text: "Happy to schedule that. Are you the homeowner? And roughly how long has it been dripping?" },
      { role: 'customer' as const, text: "Yes, homeowner. Maybe a few weeks — it's getting worse." },
      { role: 'ai' as const, text: "Got it. What's a good day this week? We have morning slots on Tuesday and Thursday." },
      { role: 'customer' as const, text: "Thursday morning works. I'm at 45 Oak Street, Kingston." },
      { role: 'ai' as const, text: "Booked for Thursday at 9 AM. Our service call is $89 — the tech will quote any parts on-site. You'll get a confirmation text shortly." },
    ],
  },
  {
    id: 'plumb-pricing',
    src: '/audio/demo-call-plumbing-emergency-john.m4a', // Replace with /audio/plumbing-pricing.m4a
    scenario: 'Pricing question — hot water heater',
    bubbles: [
      { role: 'ai' as const, text: "Thanks for calling Hudson Valley Plumbing! What can I help you with today?" },
      { role: 'customer' as const, text: "I've got no hot water. I think my water heater is dead. How much does a replacement run?" },
      { role: 'ai' as const, text: "A water heater replacement typically runs $800 to $1,800 depending on tank size, type, and any code upgrades needed. Our tech would give you an exact quote on-site." },
      { role: 'customer' as const, text: "Is that with the $89 diagnostic fee?" },
      { role: 'ai' as const, text: "The $89 diagnostic is waived if you go ahead with the repair or replacement. So if it's a full replacement you're looking at the job cost, no extra fee on top." },
      { role: 'customer' as const, text: "Perfect. Can I get someone out today?" },
      { role: 'ai' as const, text: "Let me check today's availability for you right now." },
    ],
  },
];

export default function PlumbingPage() {
  return (
    <VerticalPage
      trade="Plumbing"
      verticalSlug="plumbing"
      headline="The AI receptionist built for plumbers."
      subheadline="Triages urgency, qualifies every lead, and books the job — 24/7. So you stop losing $500 emergency calls to voicemail."
      demoConfig={{
        label: 'Plumbing Demo',
        phone: '(240) 301-1473',
        tel: '+12403011473',
        addresses: [
          '60 Market Street, Poughkeepsie, NY 12601',
          '20 Margaret St, Poughkeepsie, NY 12601',
          '35 Oak Street, Kingston, NY 12401',
        ],
        whatToTry: 'Report an active leak and say water is rising — hear how it triages. Or ask about a dripping faucet, water heater replacement cost, or try booking a routine job.',
      }}
      painPoints={[
        "Missed calls go straight to voicemail. The customer Googles the next plumber.",
        "You can't tell urgent from routine when you're already on a job.",
        "Customers expect instant response. If you don't pick up, they move on.",
        "You lose $300-800 emergency jobs to a single missed call.",
      ]}
      capabilities={[
        { title: 'Emergency triage', desc: 'Detects burst pipes, flooding, sewage backup, no hot water. Flags emergencies and notifies you immediately via SMS and phone.' },
        { title: 'Homeowner verification', desc: 'Asks if caller is homeowner or renter. Renters advised to check with landlord — saves you wasted trips.' },
        { title: 'Structured diagnostic intake', desc: "What's the issue? Where in the home? How long? Is water shut off? Your tech arrives prepared." },
        { title: 'Safety guidance', desc: 'Tells callers to shut off the water main if there\'s active flooding. Basic safety advice before you arrive.' },
        { title: 'Service call fee disclosed', desc: 'Communicates your standard service call fee upfront. Full quote on-site — no phone quoting for plumbing.' },
        { title: 'Priority scheduling', desc: 'Emergency calls get the next available slot. Routine maintenance books normally. You set the rules.' },
      ]}
      stats={[
        { value: '0', label: 'Calls sent to voicemail' },
        { value: '24/7', label: 'Always answering' },
        { value: '< 1s', label: 'Pickup time' },
      ]}
      testimonial={{
        quote: "The AI actually knows plumbing. It asks about water shut-off, property type, the right things. My customers think they're talking to a real receptionist.",
        name: 'Sarah Chen',
        title: 'S. Chen Plumbing',
        stars: 5,
      }}
      recordings={plumbingRecordings}
      phoneNumber="(240) 301-1473"
      accentColor="#e8930c"
      available={true}
    />
  );
}
