import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Blog — AI Receptionist for Trade Businesses | Supportive AI',
  description: 'Tips, guides, and insights on phone answering, missed calls, and AI receptionists for UK plumbers, electricians, locksmiths, landscapers, and trade businesses.',
};

export default function BlogLayout({ children }: { children: React.ReactNode }) {
  return children;
}
