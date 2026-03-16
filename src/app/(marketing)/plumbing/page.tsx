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
    id: 'plumb-lance',
    src: '/audio/demo-call-plumbing-lance-booking.m4a',
    scenario: 'Leaky faucet — booking a Monday slot',
    bubbles: [
      { role: 'ai' as const, text: "Thank you for calling Hudson Valley Plumbing! This is Sarah. How can I help you today?" },
      { role: 'customer' as const, text: "Hi, Sarah. This is Lance. I'd like to book an appointment at 150 Market Street. My faucet is leaking." },
      { role: 'ai' as const, text: "Got it, Lance! A leaky faucet at 150 Market Street. Is that in the kitchen, bathroom, or somewhere else?" },
      { role: 'customer' as const, text: "It's in the bathroom." },
      { role: 'ai' as const, text: "Great news! We have openings at 8 AM, 9 AM, and 10 AM on Monday. Which one works best for you?" },
      { role: 'customer' as const, text: "9 AM will be best. Thank you." },
      { role: 'ai' as const, text: "You're all set for Monday, March 9 at 9 AM! There's an $89 diagnostic visit fee — the plumber will assess and quote before starting any work. No surprises. You'll get a confirmation text shortly." },
    ],
  },
  {
    id: 'plumb-rob',
    src: '/audio/demo-call-plumbing-rob-pricing.m4a',
    scenario: 'Pricing + insurance — clogged drain',
    bubbles: [
      { role: 'ai' as const, text: "Thank you for calling Hudson Valley Plumbing! This is Sarah. How can I help you today?" },
      { role: 'customer' as const, text: "Hi, Sarah. Can you give me some ballpark figures to fix a clogged drain, please?" },
      { role: 'ai' as const, text: "Sure! For drain clearing it typically runs $150–$300. Our plumber will give you an exact quote on-site before starting — no surprises. There's also an $89 diagnostic fee for the visit." },
      { role: 'customer' as const, text: "Yes, that would be great. I just wanted to make sure that you're also insured." },
      { role: 'ai' as const, text: "Absolutely — we're fully licensed and insured. You're in good hands. Let me grab a few details to get you on the schedule." },
    ],
  },
  {
    id: 'plumb-john',
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
    id: 'uk-plumb-michael',
    src: '/audio/demo-call-uk-plumbing-michael-trimmed.m4a',
    scenario: 'UK — Leaky tap, booking next day',
    bubbles: [
      { role: 'ai' as const, text: "Hello, thank you for calling London Plumbing Services! This is Sarah. How can I help you today?" },
      { role: 'customer' as const, text: "Hi, this is Michael. I have a leaky tap in the upstairs bathroom." },
      { role: 'ai' as const, text: "Hi Michael! Yeah, absolutely we can help with that. What's your full address?" },
      { role: 'customer' as const, text: "28 Annaly Park Mansions, London, SE28 0NE." },
      { role: 'ai' as const, text: "For tomorrow we've got an opening at 12 PM. Would that work?" },
      { role: 'customer' as const, text: "12 PM works really well. Let's lock it in." },
      { role: 'ai' as const, text: "You're all set for Tuesday at 12 PM! There's a £65 call-out fee — gets applied to the repair. No surprises." },
    ],
  },
];

export default function PlumbingPage() {
  return (
    <VerticalPage
      trade="Plumbing"
      verticalSlug="plumbing"
      headline="Stop losing plumbing jobs to voicemail."
      subheadline="Every missed call is a lost job. We answer your phone 24/7, book the job, and text you — so you never miss another customer. Keep your existing number."
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
      recordings={plumbingRecordings}
      phoneNumber="(240) 301-1473"
      accentColor="#e8930c"
      available={true}
    />
  );
}
