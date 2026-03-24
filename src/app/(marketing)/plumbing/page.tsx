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
    id: 'uk-robert-pricing',
    src: '/audio/demo-call-uk-robert-pricing.m4a',
    scenario: '🇬🇧 UK — Price enquiry, leaky tap',
    bubbles: [
      { role: 'ai' as const, text: "Hello, thank you for calling London Plumbing Services! This is Sarah. How can I help you today?" },
      { role: 'customer' as const, text: "Hi, this is Robert. I have a question about your pricing and services." },
      { role: 'ai' as const, text: "Our call-out fee is £65. A leaky tap runs £80–£150, blocked drains £80–£200, boiler repairs £150–£400. Every job is different so the plumber quotes on site." },
      { role: 'customer' as const, text: "Is the call-out fee on top of the repair cost?" },
      { role: 'ai' as const, text: "No — if you go ahead with the repair, the £65 comes off the final bill. So you're not paying extra." },
      { role: 'customer' as const, text: "That would be great. Thank you so much." },
    ],
  },
  {
    id: 'uk-maria-booking',
    src: '/audio/demo-call-uk-maria-booking.m4a',
    scenario: '🇬🇧 UK — Clogged drain, full booking',
    bubbles: [
      { role: 'ai' as const, text: "Hello, thank you for calling London Plumbing Services! This is Sarah. How can I help you today?" },
      { role: 'customer' as const, text: "I'm calling regarding a clogged drain in my kitchen." },
      { role: 'ai' as const, text: "We can definitely help with that. Can I start by getting your name?" },
      { role: 'customer' as const, text: "My name is Maria. 9 Japan Crescent, N4 4BB, London." },
      { role: 'ai' as const, text: "We've got openings at 8 AM and 3 PM on Wednesday. Which works better?" },
      { role: 'customer' as const, text: "Three would be perfect." },
      { role: 'ai' as const, text: "You're all set for Wednesday at 3 PM! There's a £65 call-out fee, but that comes off the bill if you go ahead with the repair. No surprises." },
    ],
  },
  {
    id: 'plumb-lance',
    src: '/audio/demo-call-plumbing-lance-booking.m4a',
    scenario: '🇺🇸 Leaky faucet — booking a Monday slot',
    bubbles: [
      { role: 'ai' as const, text: "Thank you for calling Hudson Valley Plumbing! This is Sarah. How can I help you today?" },
      { role: 'customer' as const, text: "Hi, Sarah. Can you give me some ballpark figures to fix a clogged drain, please?" },
      { role: 'ai' as const, text: "Sure! For drain clearing it typically runs $150–$300. Our plumber will give you an exact quote on-site before starting — no surprises. There's also an $89 diagnostic fee for the visit." },
      { role: 'customer' as const, text: "Yes, that would be great. I just wanted to make sure that you're also insured." },
      { role: 'ai' as const, text: "Absolutely — we're fully licensed and insured. You're in good hands. Let me grab a few details to get you on the schedule." },
    ],
  },
  {
    id: 'plumb-rob',
    src: '/audio/demo-call-plumbing-rob-pricing.m4a',
    scenario: '🇺🇸 Pricing + insurance — clogged drain',
    bubbles: [
      { role: 'ai' as const, text: "Thank you for calling Hudson Valley Plumbing! This is Sarah. How can I help you today?" },
      { role: 'customer' as const, text: "Can you give me some ballpark figures to fix a clogged drain, please?" },
      { role: 'ai' as const, text: "For drain clearing it typically runs $150–$300. There's also an $89 diagnostic fee. No surprises." },
      { role: 'customer' as const, text: "I just wanted to make sure that you're also insured." },
      { role: 'ai' as const, text: "Absolutely — we're fully licensed and insured. You're in good hands." },
    ],
  },
  {
    id: 'plumb-john',
    src: '/audio/demo-call-plumbing-emergency-john.m4a',
    scenario: '🇺🇸 Active leak — emergency escalation',
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
    id: 'uk-bob-booking',
    src: '/audio/demo-call-uk-bob-booking.m4a',
    scenario: '🇬🇧 UK — Full booking, leaky tap',
    bubbles: [
      { role: 'ai' as const, text: "Hello, thank you for calling London Plumbing Services! This is Sarah. How can I help you today?" },
      { role: 'customer' as const, text: "Hi Sarah, this is Bob. I'd like to book an appointment — my tap upstairs in the bathroom is leaking." },
      { role: 'ai' as const, text: "Hi Bob! Leaky tap in the upstairs bathroom — what's the postcode there?" },
      { role: 'customer' as const, text: "SE20 8NE. Two Emily Park Mansions." },
      { role: 'ai' as const, text: "On Thursday we've got 11 AM, 12 PM, and 1 PM. Which works best?" },
      { role: 'customer' as const, text: "One PM." },
      { role: 'ai' as const, text: "You're all set for Thursday at 1 PM! There's a £65 call-out fee, but if you go ahead with the repair, that comes off the final bill. No surprises." },
      { role: 'customer' as const, text: "How much do you think the repair will be?" },
      { role: 'ai' as const, text: "It really depends on what's causing the leak — could be a washer or something with the valve. Our plumber will quote on site before doing any work. No surprises." },
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
        addresses: ['60 Market Street, Poughkeepsie, NY 12601', '20 Margaret St, Poughkeepsie, NY 12601'],
        whatToTry: 'Report an active leak and say water is rising — hear how it triages. Or ask about a dripping faucet, water heater replacement cost, or try booking a routine job.',
      }}
      demoConfigUK={{
        label: 'Plumbing Demo (UK)',
        phone: '+44 7427 846243',
        tel: '+447427846243',
        addresses: ['9 Japan Crescent, London, N4 4BB', '28 Annaly Park Mansions, London, SE28 0NE'],
        whatToTry: 'Report a leaky tap, ask about pricing and the call-out fee, or try booking a routine job. Mention a London address and postcode.',
      }}
      phoneNumber="(240) 301-1473"
      phoneNumberUK="+44 7427 846243"
      painPoints={[
        "Missed calls go straight to voicemail. The customer Googles the next plumber.",
        "You can't tell urgent from routine when you're already on a job.",
        "Customers expect instant response. If you don't pick up, they move on.",
        "You lose $300-800 emergency jobs to a single missed call.",
        "Half your calls are SEO companies and supplier reps. You waste time on calls that aren't customers.",
      ]}
      capabilities={[
        { title: 'Emergency triage', desc: 'Detects burst pipes, flooding, sewage backup, no hot water. Flags emergencies and notifies you immediately via SMS and phone.' },
        { title: 'Homeowner verification', desc: 'Asks if caller is homeowner or renter. Renters advised to check with landlord — saves you wasted trips.' },
        { title: 'Structured diagnostic intake', desc: "What's the issue? Where in the home? How long? Is water shut off? Your tech arrives prepared." },
        { title: 'Safety guidance', desc: 'Tells callers to shut off the water main if there\'s active flooding. Basic safety advice before you arrive.' },
        { title: 'Service call fee disclosed', desc: 'Communicates your standard service call fee upfront. Full quote on-site — no phone quoting for plumbing.' },
        { title: 'Priority scheduling', desc: 'Emergency calls get the next available slot. Routine maintenance books normally. You set the rules.' },
        { title: 'Screens out junk calls', desc: 'SEO companies, insurance brokers, supplier reps — they talk to your AI instead of you. Only real customers and emergencies get through to your phone.' },
      ]}
      stats={[
        { value: '0', label: 'Calls sent to voicemail' },
        { value: '24/7', label: 'Always answering' },
        { value: '< 1s', label: 'Pickup time' },
      ]}
      recordings={plumbingRecordings}
      accentColor="#e8930c"
      available={true}
    />
  );
}
