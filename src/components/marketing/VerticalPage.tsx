import Link from 'next/link';
import { PhoneIcon, CheckIcon, StarIcon, GoogleIcon } from './Icons';

interface Capability {
  title: string;
  desc: string;
}

interface Stat {
  value: string;
  label: string;
}

interface Testimonial {
  quote: string;
  name: string;
  title: string;
  stars: number;
}

interface VerticalPageProps {
  trade: string;
  headline: string;
  subheadline: string;
  painPoints: string[];
  capabilities: Capability[];
  stats: Stat[];
  testimonial: Testimonial;
  phoneNumber: string | null;
  accentColor: string;
  available: boolean;
}

export function VerticalPage({
  trade, headline, subheadline, painPoints, capabilities,
  stats, testimonial, phoneNumber, accentColor, available,
}: VerticalPageProps) {
  return (
    <>
      {/* Hero */}
      <section className="pt-16 pb-10 md:pt-20 px-6 md:px-10 max-w-[800px] mx-auto text-center">
        <span className="inline-block px-4 py-1.5 rounded-full text-[13px] font-bold mb-6 uppercase tracking-wide bg-[#e8930c]/10 text-[#e8930c]">
          {trade}
        </span>
        <h1 className="text-[36px] md:text-[42px] font-extrabold text-[#1a2e3b] leading-[1.15] mb-5 tracking-tight">
          {headline}
        </h1>
        <p className="text-lg text-[#5a7184] leading-relaxed max-w-[560px] mx-auto mb-9">
          {subheadline}
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          {available ? (
            <>
              <Link
                href="/onboarding"
                className="bg-[#e8930c] text-white px-8 py-[15px] rounded-lg text-base font-bold no-underline hover:bg-[#d17f00] transition-colors shadow-[0_2px_8px_rgba(232,147,12,0.3)]"
              >
                Start Free Trial
              </Link>
              <a
                href={phoneNumber ? `tel:+1${phoneNumber.replace(/\D/g, '')}` : '#'}
                className="bg-white text-[#1a2e3b] px-8 py-[15px] rounded-lg text-base font-semibold no-underline border border-[#d1ccc6] hover:bg-[#f0eeeb] transition-colors flex items-center justify-center gap-2"
              >
                <PhoneIcon size={18} /> Try a test call
              </a>
            </>
          ) : (
            <Link
              href="/onboarding"
              className="bg-[#e8930c] text-white px-8 py-[15px] rounded-lg text-base font-bold no-underline hover:bg-[#d17f00]"
            >
              Join the Waitlist
            </Link>
          )}
        </div>
      </section>

      {/* Stats */}
      <section className="py-8 px-6 md:px-10 max-w-[800px] mx-auto">
        <div className="flex justify-center gap-12 md:gap-16">
          {stats.map((s, i) => (
            <div key={i} className="text-center">
              <div className="text-[32px] font-extrabold text-[#1a2e3b]">{s.value}</div>
              <div className="text-[13px] text-[#5a7184] font-medium">{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Pain points — clean card design */}
      <section className="py-14 px-6 md:px-10 bg-white border-t border-b border-[#e5e0da]">
        <div className="max-w-[800px] mx-auto">
          <h2 className="text-[26px] font-bold text-[#1a2e3b] mb-2 text-center">Every {trade.toLowerCase()} business owner knows this</h2>
          <p className="text-[15px] text-[#5a7184] text-center mb-8">These problems cost you real money every week.</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {painPoints.map((p, i) => (
              <div key={i} className="flex items-start gap-3.5 p-5 rounded-xl bg-[#faf9f7] border border-[#e5e0da]">
                <span className="flex-shrink-0 w-6 h-6 rounded-full bg-[#fef2e0] flex items-center justify-center mt-0.5">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#e8930c" strokeWidth="3"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                </span>
                <p className="text-[14px] text-[#2a4a5e] leading-relaxed font-medium">{p}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Capabilities — green checkmarks always */}
      <section className="py-16 px-6 md:px-10 max-w-[800px] mx-auto">
        <h2 className="text-[26px] font-bold text-[#1a2e3b] mb-3 text-center">
          What your AI agent actually does
        </h2>
        <p className="text-[15px] text-[#5a7184] text-center mb-10">
          Not a script reader. A trade-trained specialist.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {capabilities.map((c, i) => (
            <div key={i} className="flex gap-3.5 p-5 bg-white rounded-xl border border-[#e5e0da]">
              <span className="flex-shrink-0 mt-0.5 text-[#059669]"><CheckIcon size={18} /></span>
              <div>
                <h3 className="text-[15px] font-bold text-[#1a2e3b] mb-1">{c.title}</h3>
                <p className="text-[13px] text-[#5a7184] leading-relaxed">{c.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Testimonial */}
      <section className="py-12 px-6 md:px-10 bg-white border-t border-[#e5e0da]">
        <div className="max-w-[600px] mx-auto text-center">
          <div className="flex gap-0.5 justify-center mb-4">
            {Array.from({ length: testimonial.stars }).map((_, j) => (
              <StarIcon key={j} size={18} className="text-[#e8930c]" />
            ))}
          </div>
          <p className="text-base text-[#2a4a5e] leading-relaxed italic mb-4">
            &ldquo;{testimonial.quote}&rdquo;
          </p>
          <p className="text-sm font-bold text-[#1a2e3b]">{testimonial.name}</p>
          <p className="text-xs text-[#5a7184]">{testimonial.title}</p>
          <div className="mt-4 flex items-center justify-center gap-2">
            <GoogleIcon size={16} />
            <span className="text-xs text-[#94a7b8]">Verified Google Review</span>
          </div>
        </div>
      </section>

      {/* Test call CTA */}
      {available && phoneNumber && (
        <section className="py-16 px-6 md:px-10">
          <div className="max-w-[700px] mx-auto bg-[#1a2e3b] rounded-2xl p-10 text-center">
            <h2 className="text-2xl font-bold text-white mb-2.5">
              Try it now — call our {trade.toLowerCase()} demo agent
            </h2>
            <a
              href={`tel:+1${phoneNumber.replace(/\D/g, '')}`}
              className="inline-flex items-center gap-3 bg-[#243d4e] rounded-xl px-8 py-4 border border-[#35596e] no-underline hover:bg-[#2c4a5d] transition-colors mt-4"
            >
              <PhoneIcon size={22} className="text-[#e8930c]" />
              <span className="text-[22px] font-bold text-white tracking-wide">{phoneNumber}</span>
            </a>
          </div>
        </section>
      )}

      {/* Waitlist CTA */}
      {!available && (
        <section className="py-16 px-6 md:px-10">
          <div className="max-w-[600px] mx-auto text-center">
            <h2 className="text-2xl font-bold text-[#1a2e3b] mb-3">
              Be the first to get your {trade.toLowerCase()} AI agent
            </h2>
            <p className="text-[15px] text-[#5a7184] mb-6">
              We&apos;re launching {trade.toLowerCase()} agents in Q2 2026. Join the waitlist and we&apos;ll set you up first.
            </p>
            <Link
              href="/onboarding"
              className="inline-block bg-[#e8930c] text-white px-8 py-[15px] rounded-lg text-base font-bold no-underline hover:bg-[#d17f00]"
            >
              Join the Waitlist
            </Link>
          </div>
        </section>
      )}
    </>
  );
}
