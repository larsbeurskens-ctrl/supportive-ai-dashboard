import { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Blog — AI Receptionist for Trade Businesses | Supportive AI',
  description: 'Tips, guides, and insights on phone answering, missed calls, and AI receptionists for UK plumbers, electricians, and trade businesses.',
};

const POSTS = [
  {
    slug: 'stop-missing-calls-tradesman',
    title: 'How to stop missing calls when you are on a job',
    excerpt: 'Compare voicemail, answering services, and AI receptionists. Which one actually books the job while your hands are full?',
    date: 'March 30, 2026',
    readTime: '5 min',
    tag: 'All trades',
  },
  {
    slug: 'phone-answering-service-cost-plumber-2026',
    title: 'How much does a phone answering service cost for plumbers in 2026?',
    excerpt: 'An honest breakdown: voicemail (£0), human answering (£250-550/mo), in-house receptionist (£2,000+/mo), AI receptionist (£69/mo).',
    date: 'March 30, 2026',
    readTime: '6 min',
    tag: 'Plumbing',
  },
  {
    slug: 'electrician-misses-emergency-call',
    title: 'What happens when an electrician misses an emergency call?',
    excerpt: 'Burning smells, sparking sockets, total power loss. How AI handles safety-critical electrical calls differently.',
    date: 'March 30, 2026',
    readTime: '5 min',
    tag: 'Electrical',
  },
];

export default function BlogIndex() {
  return (
    <main className="pt-16 pb-14 px-6 md:px-10">
      <div className="max-w-[820px] mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-[36px] font-extrabold text-[#1a2e3b] mb-3">Blog</h1>
          <p className="text-[16px] text-[#5a7184]">Tips and insights for UK trade businesses on phone answering, missed calls, and growing your bookings.</p>
        </div>
        <div className="space-y-6">
          {POSTS.map(post => (
            <Link key={post.slug} href={`/blog/${post.slug}`} className="block bg-white rounded-xl border border-[#e5e0da] px-6 py-5 no-underline hover:border-[#e8930c] hover:shadow-[0_2px_12px_rgba(232,147,12,0.1)] transition-all">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-[11px] font-bold text-[#e8930c] bg-[#fffbf5] px-2 py-0.5 rounded-full">{post.tag}</span>
                <span className="text-[12px] text-[#94a7b8]">{post.date} · {post.readTime}</span>
              </div>
              <h2 className="text-[18px] font-bold text-[#1a2e3b] mb-2">{post.title}</h2>
              <p className="text-[14px] text-[#5a7184] leading-relaxed">{post.excerpt}</p>
            </Link>
          ))}
        </div>
      </div>
    </main>
  );
}
