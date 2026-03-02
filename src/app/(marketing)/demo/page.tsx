import { Metadata } from 'next';
import { DemoPageClient } from './DemoPageClient';

export const metadata: Metadata = {
  title: 'Hear Your AI Receptionist — Live Demo | Supportive AI',
  description: 'Listen to real phone calls handled by an AI receptionist. Bookings, emergencies, rescheduling — all handled automatically.',
};

export default function DemoPage() {
  return <DemoPageClient />;
}
