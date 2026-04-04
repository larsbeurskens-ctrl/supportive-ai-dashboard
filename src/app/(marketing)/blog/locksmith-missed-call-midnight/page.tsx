import { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'What Happens When a Locksmith Misses a Midnight Call? | Supportive AI',
  description: 'Someone locked out at midnight calls 3 locksmiths. Whoever answers first gets the job. Here is what happens when you are the one who does not pick up.',
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Article",
  "headline": "What Happens When a Locksmith Misses a Midnight Call?",
  "description": "Someone locked out at midnight calls 3 locksmiths. Whoever answers first gets the job.",
  "author": { "@type": "Person", "name": "Lars Beurskens" },
  "publisher": { "@type": "Organization", "name": "Supportive AI", "url": "https://supportive-ai.com" },
  "datePublished": "2026-04-03",
  "url": "https://supportive-ai.com/blog/locksmith-missed-call-midnight",
};

export default function BlogPost() {
  return (
    <article className="pt-16 pb-14 px-6 md:px-10">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <div className="max-w-[680px] mx-auto">
        <div className="mb-10">
          <p className="text-[13px] font-semibold text-[#e8930c] uppercase tracking-wider mb-3">Blog</p>
          <h1 className="text-[32px] md:text-[40px] font-extrabold text-[#1a2e3b] leading-[1.15] mb-4 tracking-tight">
            What happens when a locksmith misses a midnight call?
          </h1>
          <p className="text-[15px] text-[#94a7b8]">April 3, 2026 · 4 min read</p>
        </div>

        <div className="text-[16px] text-[#5a7184] leading-relaxed space-y-5">
          <p>It is 11:47pm on a Tuesday. A woman gets home from a late shift, reaches for her keys, and realises they are still on her desk at work. She is standing outside her flat in the cold. She needs help now.</p>

          <p>She does what everyone does: she Googles &quot;locksmith near me&quot; and calls the first three numbers. The first locksmith does not answer — it goes to voicemail. She does not leave a message. She calls the second number. Voicemail again. The third locksmith picks up on the second ring.</p>

          <p>That third locksmith just earned £90 for 30 minutes of work. The first two earned nothing.</p>

          <h2 className="text-[22px] font-bold text-[#1a2e3b] mt-8 mb-3">The numbers that matter</h2>

          <p>Research shows that 85% of callers will not leave a voicemail if their first call goes unanswered. For lockout calls specifically, the figure is likely even higher — because the caller is stressed, standing outside, and needs someone now. Not in an hour. Not tomorrow. Now.</p>

          <p>The average UK lockout job is worth £70-120. If you miss just one lockout call per week — and many locksmiths miss far more than that — you are losing £4,000-6,000 per year in revenue. From a single missed call pattern.</p>

          <h2 className="text-[22px] font-bold text-[#1a2e3b] mt-8 mb-3">Why locksmiths miss more calls than any other trade</h2>

          <p>Plumbers miss calls because they are under a sink. Electricians miss calls because they are in a loft. Locksmiths miss calls because they are on a call-out — driving, working on a door, or asleep because they have been working until 2am.</p>

          <p>The irony is that locksmith work is the most time-sensitive of any trade. A burst pipe can wait an hour. A lockout cannot. The customer is standing outside right now, and they are calling someone else every 30 seconds until someone picks up.</p>

          <h2 className="text-[22px] font-bold text-[#1a2e3b] mt-8 mb-3">What the caller actually needs in the first 60 seconds</h2>

          <p>When someone is locked out, they do not need a detailed conversation. They need three things: confirmation that help is coming, a rough idea of the price, and an ETA. That is it. The entire interaction takes less than a minute.</p>

          <p>This is why AI answering works so well for locksmiths. The AI picks up instantly, collects the caller&apos;s location and lock type, gives them a price range, and texts you the details. The caller knows help is on the way. You get the job details when you check your phone.</p>

          <h2 className="text-[22px] font-bold text-[#1a2e3b] mt-8 mb-3">Voicemail vs AI: the midnight lockout test</h2>

          <p>With voicemail, the locked-out caller hears a generic message, decides not to leave one, and calls the next locksmith. You wake up to a missed call with no context. The job is gone.</p>

          <p>With an AI receptionist, the caller gets a live conversation. The AI collects their name, postcode, and lock type. It tells them the typical price range. It texts you immediately with all the details — &quot;URGENT: Sarah locked out at SW11 5QT, standard Yale lock, requesting ASAP.&quot; You can respond in minutes, not hours.</p>

          <p>The difference is not just answering the phone. It is answering the phone in a way that captures the job, reassures the caller, and gives you everything you need to respond — without you having to be awake at midnight.</p>

          <div className="bg-[#faf9f7] rounded-xl px-6 py-5 border border-[#e5e0da] mt-10">
            <p className="text-[15px] font-bold text-[#1a2e3b] mb-2">Stop losing lockout jobs to missed calls</p>
            <p className="text-[14px] text-[#5a7184] mb-4">Supportive AI answers every call — day and night — qualifies the job, and texts you the details instantly. From £69/month.</p>
            <Link href="/ai-receptionist-for-locksmiths" className="inline-block bg-[#e8930c] text-white px-6 py-3 rounded-lg text-sm font-bold no-underline hover:bg-[#d17f00] transition-colors">
              See how it works for locksmiths →
            </Link>
          </div>
        </div>
      </div>
    </article>
  );
}
