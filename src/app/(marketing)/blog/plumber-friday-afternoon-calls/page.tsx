import Link from 'next/link';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: '5 Calls Every UK Plumber Misses on a Friday Afternoon | Supportive AI',
  description: 'Friday 3-5pm is peak call time for weekend emergencies. Here is what you are losing while finishing your last job of the week.',
};

export default function BlogPost() {
  return (
    <article className="pt-16 pb-14 px-6 md:px-10">
      <div className="max-w-[680px] mx-auto">
        <div className="mb-10">
          <p className="text-[13px] font-semibold text-[#e8930c] uppercase tracking-wider mb-3">Blog</p>
          <h1 className="text-[32px] md:text-[40px] font-extrabold text-[#1a2e3b] leading-[1.15] mb-4 tracking-tight">5 calls every UK plumber misses on a Friday afternoon</h1>
          <p className="text-[15px] text-[#94a7b8]">April 4, 2026 · 4 min read</p>
        </div>
        <div className="text-[16px] text-[#5a7184] leading-relaxed space-y-5">
          <p>Friday between 3pm and 5pm is the busiest call window for UK plumbers. Homeowners have spent the week noticing a drip, hearing a gurgle, or discovering a damp patch — and they want it sorted before the weekend.</p>
          <p>But you are on your last job. You are under a sink, tightening a fitting, trying to get home at a reasonable time. Your phone buzzes in your pocket. Then again. And again.</p>
          <p>By 5:30pm when you check your phone, you have 3-5 missed calls. Each one was a potential weekend emergency booking worth £150-300. Most of them have already called someone else.</p>
          <h2 className="text-[22px] font-bold text-[#1a2e3b] mt-8 mb-3">The five Friday afternoon callers</h2>
          <p>They follow a pattern. The homeowner who has been putting off a call all week and finally picks up the phone. The landlord who needs a repair done before tenants complain over the weekend. The estate agent who needs a plumber for a pre-sale inspection on Monday. The panicker who just noticed water where water should not be. And the price shopper comparing three plumbers before committing.</p>
          <p>All five of them share one thing: they will not leave a voicemail. They want to speak to someone, get a price, and book a time. Right now.</p>
          <h2 className="text-[22px] font-bold text-[#1a2e3b] mt-8 mb-3">What an AI receptionist does at 4:17pm on Friday</h2>
          <p>It answers on the first ring. It says &quot;Hello, thanks for calling [your business], this is Sarah. How can I help?&quot; It asks what the issue is. It checks your live calendar. It books a Saturday morning slot and texts you both a confirmation.</p>
          <p>You finish your job. You drive home. You check your phone and see three new bookings for tomorrow. No callbacks needed. No voicemails to listen to. Just confirmed jobs in your diary.</p>
          <div className="bg-[#faf9f7] rounded-xl px-6 py-5 border border-[#e5e0da] mt-10">
            <p className="text-[15px] font-bold text-[#1a2e3b] mb-2">Stop losing Friday afternoon jobs</p>
            <p className="text-[14px] text-[#5a7184] mb-4">Supportive AI answers every call and books jobs into your calendar — even when your hands are full. From £69/month.</p>
            <Link href="/ai-receptionist-for-plumbers" className="inline-block bg-[#e8930c] text-white px-6 py-3 rounded-lg text-sm font-bold no-underline hover:bg-[#d17f00] transition-colors">See how it works for plumbers →</Link>
          </div>
        </div>
      </div>
    </article>
  );
}
