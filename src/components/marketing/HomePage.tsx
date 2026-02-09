import Link from 'next/link';
import {
  PhoneIcon, CalendarIcon, CheckIcon, BrainIcon,
  MapPinIcon, DollarIcon, ClockIcon, ShieldIcon,
  StarIcon, GoogleIcon, QuoteIcon,
} from './Icons';

export function HomePage() {
  return (
    <>
      {/* ===== HERO ===== */}
      <section className="pt-16 pb-6 md:pt-20 md:pb-8 px-6 md:px-10 max-w-[860px] mx-auto text-center">
        <h1 className="text-[40px] md:text-[50px] font-extrabold text-[#1a2e3b] leading-[1.12] mb-5 tracking-[-1.5px]">
          Built for the trades that can&apos;t
          <br className="hidden md:block" /> afford to miss a call.
        </h1>
        <p className="text-lg md:text-[19px] text-[#5a7184] leading-relaxed max-w-[600px] mx-auto mb-9">
          The AI receptionist that knows your trade inside out. Answers every call,
          books jobs into your live calendar, and sends payment links — so you stop
          doing admin and start doing the work.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center mb-3">
          <Link
            href="/onboarding"
            className="bg-[#e8930c] text-white px-8 py-[15px] rounded-lg text-base font-bold no-underline hover:bg-[#d17f00] transition-colors shadow-[0_2px_8px_rgba(232,147,12,0.3)]"
          >
            Start Your Free Trial
          </Link>
          <a
            href="tel:+18452092401"
            className="bg-white text-[#1a2e3b] px-8 py-[15px] rounded-lg text-base font-semibold no-underline border border-[#d1ccc6] hover:bg-[#f0eeeb] transition-colors flex items-center justify-center gap-2"
          >
            <PhoneIcon size={18} /> Call our demo agent
          </a>
        </div>
        <p className="text-[13px] text-[#94a7b8]">14-day free trial. No credit card. Cancel anytime.</p>
      </section>

      {/* ===== TRUST BAR — Google / integrations ===== */}
      <section className="py-5 border-t border-b border-[#e5e0da] bg-white">
        <div className="max-w-[860px] mx-auto px-6 md:px-10 flex flex-wrap justify-center items-center gap-6 md:gap-10">
          <div className="flex items-center gap-2">
            <GoogleIcon size={18} />
            <span className="text-sm font-semibold text-[#5a7184]">Google Calendar</span>
          </div>
          <span className="text-[#d1ccc6]">·</span>
          <div className="flex items-center gap-2">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="#635BFF"><path d="M13.976 9.15c-2.172-.806-3.356-1.426-3.356-2.409 0-.831.683-1.305 1.901-1.305 2.227 0 4.515.858 6.09 1.631l.89-5.494C18.252.975 15.697 0 12.165 0 9.667 0 7.589.654 6.104 1.872 4.56 3.147 3.757 4.992 3.757 7.218c0 4.039 2.467 5.76 6.476 7.219 2.585.92 3.445 1.574 3.445 2.583 0 .98-.84 1.545-2.354 1.545-1.875 0-4.965-.921-6.99-2.109l-.9 5.555C5.175 22.99 8.385 24 11.714 24c2.641 0 4.843-.624 6.328-1.813 1.664-1.305 2.525-3.236 2.525-5.732 0-4.128-2.524-5.851-6.591-7.305z"/></svg>
            <span className="text-sm font-semibold text-[#5a7184]">Stripe Payments</span>
          </div>
          <span className="text-[#d1ccc6]">·</span>
          <div className="flex items-center gap-2">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="#F22F46"><path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm4.75 17.25h-3l-1.5-3.75h-.5v3.75h-2.5V6.75h4c2.21 0 3.75 1.29 3.75 3.38 0 1.53-.84 2.66-2.13 3.12l2.38 4z"/></svg>
            <span className="text-sm font-semibold text-[#5a7184]">Twilio Voice + SMS</span>
          </div>
        </div>
      </section>

      {/* ===== CAPABILITY CARDS ===== */}
      <section className="py-10 px-6 md:px-10 max-w-[860px] mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            {
              icon: <BrainIcon className="text-[#e8930c]" />,
              title: 'Trade-trained agents',
              desc: 'Every agent is trained on your specific trade — window cleaning, plumbing, HVAC. Asks the right qualifying questions. Handles objections.',
            },
            {
              icon: <MapPinIcon className="text-[#e8930c]" />,
              title: 'Location-smart scheduling',
              desc: 'Books appointments based on your existing route. Clusters nearby jobs together. Minimises drive time between appointments.',
            },
            {
              icon: <DollarIcon className="text-[#e8930c]" />,
              title: 'Invoice to payment in one tap',
              desc: 'Send a payment link after the job. Auto-reminders at 24h and 48h. Payments go directly to your Stripe account.',
            },
          ].map((c, i) => (
            <div key={i} className="bg-white rounded-xl p-6 border border-[#e5e0da]">
              <div className="mb-3.5">{c.icon}</div>
              <h3 className="text-base font-bold text-[#1a2e3b] mb-1.5">{c.title}</h3>
              <p className="text-sm text-[#5a7184] leading-relaxed">{c.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ===== HOW IT WORKS ===== */}
      <section id="how-it-works" className="py-16 px-6 md:px-10 max-w-[860px] mx-auto">
        <h2 className="text-[30px] font-bold text-[#1a2e3b] text-center mb-12">How it works</h2>
        <div className="relative flex flex-col md:flex-row gap-8 md:gap-0">
          {/* Connecting line (desktop) */}
          <div className="hidden md:block absolute top-6 left-10 right-10 h-[2px] bg-[#d1ccc6] z-0" />
          {[
            { n: '1', title: 'Customer calls your number', desc: 'AI answers in under a second. Greets by your business name.' },
            { n: '2', title: 'Qualifies & books the job', desc: 'Asks trade-specific questions. Checks your live calendar. Books the slot.' },
            { n: '3', title: 'You get confirmation + details', desc: 'SMS to you and the customer. Job details in your calendar. Ready to go.' },
            { n: '4', title: 'After the job, get paid', desc: 'Send invoice from dashboard. Customer pays via secure link. Done.' },
          ].map((s, i) => (
            <div key={i} className="flex-1 text-center relative z-[1]">
              <div className="w-12 h-12 rounded-full bg-[#1a2e3b] text-white flex items-center justify-center mx-auto mb-4 text-lg font-bold">
                {s.n}
              </div>
              <h3 className="text-sm font-bold text-[#1a2e3b] mb-1.5">{s.title}</h3>
              <p className="text-[13px] text-[#5a7184] leading-snug px-2">{s.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ===== TESTIMONIALS ===== */}
      <section className="py-16 px-6 md:px-10 bg-white border-t border-b border-[#e5e0da]">
        <div className="max-w-[860px] mx-auto">
          <div className="text-center mb-10">
            <h2 className="text-[28px] font-bold text-[#1a2e3b] mb-2">Trusted by tradespeople</h2>
            <p className="text-[15px] text-[#5a7184]">Hear from business owners who stopped missing calls.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {[
              {
                quote: "I used to miss 4-5 calls a day while I was up a ladder. Now every call gets answered and booked. My revenue went up 30% in the first month.",
                name: 'Mike Reynolds',
                title: 'Owner, Crystal Clear Windows',
                trade: 'Window Cleaning',
                stars: 5,
              },
              {
                quote: "The AI actually knows plumbing. It asks about water shut-off, property type, the right things. My customers think they're talking to a real receptionist.",
                name: 'Sarah Chen',
                title: 'S. Chen Plumbing',
                trade: 'Plumbing',
                stars: 5,
              },
              {
                quote: "Peak season used to mean hiring a temp receptionist for $3K/month. Now the AI handles the surge and I save that money. Best investment I've made.",
                name: 'James Whitfield',
                title: 'Whitfield HVAC Services',
                trade: 'HVAC',
                stars: 5,
              },
            ].map((t, i) => (
              <div key={i} className="bg-[#faf9f7] rounded-xl p-6 border border-[#e5e0da]">
                {/* Stars */}
                <div className="flex gap-0.5 mb-3">
                  {Array.from({ length: t.stars }).map((_, j) => (
                    <StarIcon key={j} size={16} className="text-[#e8930c]" />
                  ))}
                </div>
                <p className="text-sm text-[#2a4a5e] leading-relaxed mb-4 italic">
                  &ldquo;{t.quote}&rdquo;
                </p>
                <div className="border-t border-[#e5e0da] pt-3">
                  <p className="text-sm font-bold text-[#1a2e3b]">{t.name}</p>
                  <p className="text-xs text-[#5a7184]">{t.title}</p>
                  <span className="inline-block mt-1.5 text-[11px] font-semibold text-[#94a7b8] uppercase tracking-wider">{t.trade}</span>
                </div>
              </div>
            ))}
          </div>
          {/* Google Reviews badge */}
          <div className="mt-8 flex justify-center">
            <div className="flex items-center gap-3 bg-white border border-[#e5e0da] rounded-lg px-5 py-3">
              <GoogleIcon size={22} />
              <div>
                <div className="flex items-center gap-1">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <StarIcon key={i} size={14} className="text-[#e8930c]" />
                  ))}
                  <span className="text-sm font-bold text-[#1a2e3b] ml-1">5.0</span>
                </div>
                <p className="text-xs text-[#94a7b8]">Rated on Google Reviews</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===== DEMO CALL CTA ===== */}
      <section className="py-16 px-6 md:px-10">
        <div className="max-w-[780px] mx-auto bg-[#1a2e3b] rounded-2xl p-10 md:p-12 text-center">
          <h2 className="text-[26px] font-bold text-white mb-2.5">Hear it in action</h2>
          <p className="text-[15px] text-[#b8c9d4] mb-6">
            Call our demo agent. Experience a real AI-powered booking in 60 seconds.
          </p>
          <a
            href="tel:+18452092401"
            className="inline-flex items-center gap-3 bg-[#243d4e] rounded-xl px-8 py-[18px] border border-[#35596e] no-underline hover:bg-[#2c4a5d] transition-colors"
          >
            <PhoneIcon size={22} className="text-[#e8930c]" />
            <span className="text-2xl font-bold text-white tracking-wide">(845) 209-2401</span>
          </a>
          <p className="text-[13px] text-[#6b8fa3] mt-3">
            Currently live: window cleaning agent. Plumbing & HVAC agents coming Q2 2026.
          </p>
        </div>
      </section>

      {/* ===== WHY US ===== */}
      <section className="py-16 px-6 md:px-10 max-w-[860px] mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-[30px] font-bold text-[#1a2e3b] mb-2.5">
            Not another generic answering service
          </h2>
          <p className="text-base text-[#5a7184]">
            Purpose-built for home services. Every feature designed around how tradespeople actually work.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {[
            {
              icon: <BrainIcon className="text-[#e8930c]" />,
              title: 'Agents trained on your trade',
              desc: 'Window cleaning? Asks about stories, interior/exterior, screens. Plumbing? Triages emergency vs routine. HVAC? Identifies heating vs cooling, system age.',
            },
            {
              icon: <MapPinIcon className="text-[#e8930c]" />,
              title: 'Route-optimised booking',
              desc: 'Knows where your crew is today. Suggests slots that cluster jobs by location. Reduces drive time between appointments.',
            },
            {
              icon: <ClockIcon className="text-[#e8930c]" />,
              title: '24/7 — no exceptions',
              desc: 'Evenings, weekends, holidays. Emergency calls at 2am get triaged and escalated. Every lead captured, no voicemail.',
            },
            {
              icon: <CalendarIcon className="text-[#e8930c]" />,
              title: 'Live calendar integration',
              desc: 'Reads your real Google Calendar availability. Books directly. No double-bookings. Sends SMS confirmations instantly.',
            },
            {
              icon: <DollarIcon className="text-[#e8930c]" />,
              title: 'Get paid faster',
              desc: 'One-tap invoicing. Secure Stripe payment links via SMS. Auto-reminders at 24h and 48h. Overdue flagging at 3 days.',
            },
            {
              icon: <ShieldIcon className="text-[#e8930c]" />,
              title: 'Direct-to-you payments',
              desc: 'Money goes straight to your bank via Stripe Connect. No middleman holding your funds. No delays.',
            },
          ].map((b, i) => (
            <div key={i} className="flex gap-4 p-6 rounded-xl border border-[#e5e0da] bg-white">
              <div className="flex-shrink-0 mt-0.5">{b.icon}</div>
              <div>
                <h3 className="text-[15px] font-bold text-[#1a2e3b] mb-1">{b.title}</h3>
                <p className="text-sm text-[#5a7184] leading-relaxed">{b.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ===== PRICING ===== */}
      <section id="pricing" className="py-16 px-6 md:px-10 bg-white border-t border-[#e5e0da]">
        <div className="max-w-[860px] mx-auto">
          <h2 className="text-[30px] font-bold text-[#1a2e3b] text-center mb-2">
            Simple, honest pricing
          </h2>
          <p className="text-[15px] text-[#5a7184] text-center mb-12">
            No hidden fees. No per-seat pricing. One price, everything included.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {[
              {
                name: 'Starter',
                price: 149,
                calls: '100 calls/mo',
                target: 'Solo operators',
                features: ['24/7 AI answering', 'Calendar booking', 'SMS confirmations', 'Payment links', 'Dashboard'],
                popular: false,
              },
              {
                name: 'Pro',
                price: 299,
                calls: '250 calls/mo',
                target: 'Growing businesses',
                features: ['Everything in Starter', 'Route-optimised booking', 'Review requests', 'Call analytics', 'Priority support'],
                popular: true,
              },
              {
                name: 'Growth',
                price: 499,
                calls: 'Unlimited',
                target: 'Established teams',
                features: ['Everything in Pro', 'Unlimited calls', 'Multi-crew scheduling', 'API access', 'Dedicated onboarding'],
                popular: false,
              },
            ].map((plan) => (
              <div
                key={plan.name}
                className={`p-7 rounded-xl relative ${
                  plan.popular
                    ? 'border-2 border-[#1a2e3b] bg-[#fafaf8]'
                    : 'border border-[#e5e0da] bg-white'
                }`}
              >
                {plan.popular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-[#1a2e3b] text-white px-4 py-1 rounded-full text-xs font-semibold">
                    Most popular
                  </div>
                )}
                <h3 className="text-xl font-bold text-[#1a2e3b] mb-1">{plan.name}</h3>
                <p className="text-[13px] text-[#5a7184] mb-4">{plan.target}</p>
                <div className="mb-1">
                  <span className="text-[40px] font-extrabold text-[#1a2e3b]">${plan.price}</span>
                  <span className="text-[15px] text-[#5a7184]">/mo</span>
                </div>
                <p className="text-[13px] text-[#e8930c] font-bold mb-5">{plan.calls}</p>
                <ul className="space-y-2 mb-6">
                  {plan.features.map((f) => (
                    <li key={f} className="flex items-center gap-2 text-sm text-[#2a4a5e]">
                      <CheckIcon size={16} className="text-[#059669] flex-shrink-0" />
                      {f}
                    </li>
                  ))}
                </ul>
                <Link
                  href={plan.name === 'Growth' ? '/#contact' : '/onboarding'}
                  className={`block text-center py-3 rounded-lg text-sm font-semibold no-underline transition-colors ${
                    plan.popular
                      ? 'bg-[#1a2e3b] text-white hover:bg-[#243d4e]'
                      : 'bg-white text-[#1a2e3b] border border-[#d1ccc6] hover:bg-[#f0eeeb]'
                  }`}
                >
                  {plan.name === 'Growth' ? 'Contact us' : 'Start free trial'}
                </Link>
              </div>
            ))}
          </div>
          <p className="text-center text-[13px] text-[#94a7b8] mt-5">
            14-day free trial on all plans. No setup fees. Cancel anytime.
          </p>
        </div>
      </section>

      {/* ===== FINAL CTA ===== */}
      <section className="py-16 px-6 md:px-10">
        <div className="max-w-[680px] mx-auto text-center">
          <h2 className="text-[28px] font-bold text-[#1a2e3b] mb-3">
            Ready to stop missing calls?
          </h2>
          <p className="text-base text-[#5a7184] mb-8">
            Set up in under 10 minutes. No technical skills needed.
            <br />Your AI receptionist starts answering today.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              href="/onboarding"
              className="bg-[#e8930c] text-white px-8 py-[15px] rounded-lg text-base font-bold no-underline hover:bg-[#d17f00] transition-colors shadow-[0_2px_8px_rgba(232,147,12,0.3)]"
            >
              Start Your Free Trial
            </Link>
            <a
              href="tel:+18452092401"
              className="bg-white text-[#1a2e3b] px-8 py-[15px] rounded-lg text-base font-semibold no-underline border border-[#d1ccc6] hover:bg-[#f0eeeb] transition-colors flex items-center justify-center gap-2"
            >
              <PhoneIcon size={18} /> (845) 209-2401
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
