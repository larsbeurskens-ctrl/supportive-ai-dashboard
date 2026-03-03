import Link from 'next/link';
import { Logo } from '@/components/Logo';

export function MarketingFooter() {
  return (
    <footer className="border-t border-[#e5e0da] bg-white">
      <div className="max-w-5xl mx-auto px-6 md:px-10 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-10">
          {/* Brand */}
          <div>
            <div className="mb-3">
              <Logo size="sm" />
            </div>
            <p className="text-sm text-[#5a7184] leading-relaxed">
              Built for the trades that can&apos;t afford to miss a call.
            </p>
          </div>

          {/* Industries */}
          <div>
            <h4 className="text-xs font-bold text-[#1a2e3b] uppercase tracking-wider mb-4">Industries</h4>
            <div className="space-y-2.5">
              <Link href="/window-cleaning" className="block text-sm text-[#5a7184] no-underline hover:text-[#1a2e3b]">Window Cleaning</Link>
              <Link href="/plumbing" className="block text-sm text-[#5a7184] no-underline hover:text-[#1a2e3b]">Plumbing</Link>
              <Link href="/hvac" className="block text-sm text-[#5a7184] no-underline hover:text-[#1a2e3b]">HVAC</Link>
            </div>
          </div>

          {/* Product */}
          <div>
            <h4 className="text-xs font-bold text-[#1a2e3b] uppercase tracking-wider mb-4">Product</h4>
            <div className="space-y-2.5">
              <Link href="/#how-it-works" className="block text-sm text-[#5a7184] no-underline hover:text-[#1a2e3b]">How it works</Link>
              <Link href="/#pricing" className="block text-sm text-[#5a7184] no-underline hover:text-[#1a2e3b]">Pricing</Link>
              <Link href="/faq" className="block text-sm text-[#5a7184] no-underline hover:text-[#1a2e3b]">FAQ</Link>
              <Link href="/dashboard" className="block text-sm text-[#5a7184] no-underline hover:text-[#1a2e3b]">Dashboard</Link>
            </div>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-xs font-bold text-[#1a2e3b] uppercase tracking-wider mb-4">Try it</h4>
            <p className="text-[12px] text-[#94a7b8] mb-2">Call our demo agents:</p>
            <div className="space-y-1.5">
              <div>
                <a href="tel:+18452092401" className="text-[15px] font-bold text-[#1a2e3b] no-underline hover:text-[#e8930c]">(845) 209-2401</a>
                <span className="text-[11px] text-[#94a7b8] ml-1.5">Window Cleaning</span>
              </div>
              <div>
                <a href="tel:+12403011473" className="text-[15px] font-bold text-[#1a2e3b] no-underline hover:text-[#e8930c]">(240) 301-1473</a>
                <span className="text-[11px] text-[#94a7b8] ml-1.5">Plumbing</span>
              </div>
            </div>
            <p className="text-[10px] text-[#b8c4ce] mt-2">Standard call rates apply</p>
          </div>
        </div>

        <div className="border-t border-[#e5e0da] pt-6 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-xs text-[#94a7b8]">
            © 2026 Supportive AI. All rights reserved.
          </p>
          <div className="flex items-center gap-4">
            <span className="text-xs text-[#94a7b8]">Integrates with</span>
            <span className="text-xs font-semibold text-[#5a7184]">Google Calendar</span>
            <span className="text-xs text-[#94a7b8]">·</span>
            <span className="text-xs font-semibold text-[#5a7184]">Stripe</span>
            <span className="text-xs text-[#94a7b8]">·</span>
            <span className="text-xs font-semibold text-[#5a7184]">Twilio</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
