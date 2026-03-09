import { Metadata } from 'next';
import { VerticalPage } from '@/components/marketing/VerticalPage';

export const metadata: Metadata = {
  title: 'AI Receptionist for HVAC Technicians — Supportive AI',
  description: 'Handle peak season call surges without hiring. AI answers every call, triages heating/cooling, books jobs 24/7. Built for HVAC businesses.',
};

export default function HVACPage() {
  return (
    <VerticalPage
      trade="HVAC"
      verticalSlug="hvac"
      recordings={[]}
      headline="Stop losing HVAC calls during peak season."
      subheadline="When the AC dies in July or the heater quits in January, every call matters. We answer your phone 24/7, book the job, and text you. Keep your existing number."
      painPoints={[
        "Call volume triples in summer and winter. You physically can't answer them all.",
        "Hiring temp receptionists for peak season is expensive and unreliable.",
        "Customers with no heat in January won't leave a voicemail. They call the next company.",
        "You lose thousands in peak season revenue to missed calls.",
      ]}
      capabilities={[
        { title: 'Heating vs cooling triage', desc: 'Identifies whether it\'s heating or cooling, system type, and urgency level. Routes the call accordingly.' },
        { title: 'System diagnostics intake', desc: 'Asks about system type, age, last maintenance, error codes, and symptoms. Your tech arrives prepared.' },
        { title: 'Unlimited concurrent calls', desc: 'No busy signals. No hold music. Peak season call surges handled without breaking a sweat.' },
        { title: 'Maintenance plan upsell', desc: 'Mentions your seasonal maintenance packages to callers. Builds recurring revenue on autopilot.' },
        { title: 'Emergency escalation', desc: 'No heat in winter with vulnerable occupants? Immediate owner alert + priority scheduling.' },
        { title: 'Warranty & equipment tracking', desc: 'Asks about warranty status and equipment age to help you prepare the right parts for the visit.' },
      ]}
      stats={[
        { value: '3x', label: 'Peak season call surge' },
        { value: '$0 extra', label: 'Per additional call' },
        { value: '100%', label: 'Calls handled' },
      ]}
      phoneNumber={null}
      accentColor="#e8930c"
      available={false}
      demoConfig={{
        label: 'HVAC Demo',
        phone: '(845) 209-2401',
        tel: '+18452092401',
        addresses: [
          '12 Maple Ave, Poughkeepsie, NY 12601',
          '45 Oak Street, Newburgh, NY 12550',
        ],
        whatToTry: 'Say your AC stopped working in the heat, ask about emergency service, or enquire about a maintenance plan. Coming soon — join the waitlist.',
      }}
    />
  );
}
