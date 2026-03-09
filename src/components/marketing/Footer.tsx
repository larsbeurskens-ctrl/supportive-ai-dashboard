import Link from 'next/link';
import { Logo } from '@/components/Logo';

export function MarketingFooter() {
  return (
    <footer className="border-t border-[#e5e0da] bg-white">

      {/* ===== Sign-up strip ===== */}
      <div className="bg-[#1a2e3b] px-6 md:px-10 py-10">
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <p className="text-[20px] font-bold text-white mb-1">Ready to stop missing calls?</p>
            <p className="text-[14px] text-[#94a7b8]">7-day free trial · up to 50 calls · no credit card required.</p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3 flex-shrink-0">
            <Link
              href="/onboarding"
              className="bg-[#e8930c] text-white px-7 py-3.5 rounded-lg text-[15px] font-bold no-underline hover:bg-[#d17f00] transition-colors whitespace-nowrap"
            >
              Start free trial
            </Link>
            <Link
              href="/#pricing"
              className="bg-transparent text-white px-7 py-3.5 rounded-lg text-[15px] font-semibold no-underline border border-[#35596e] hover:bg-[#243d4e] transition-colors whitespace-nowrap"
            >
              See pricing
            </Link>
          </div>
        </div>
      </div>
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
            <h4 className="text-xs font-bold text-[#1a2e3b] uppercase tracking-wider mb-4">Get in touch</h4>
            <div className="space-y-2.5">
              <a href="mailto:lars@supportive-ai.com" className="block text-sm text-[#5a7184] no-underline hover:text-[#1a2e3b]">lars@supportive-ai.com</a>
              <a href="tel:+18323466405" className="block text-sm text-[#5a7184] no-underline hover:text-[#1a2e3b]">(832) 346-6405</a>
            </div>
            <p className="text-[12px] text-[#94a7b8] mt-4 mb-2">Try our demo agents:</p>
            <div className="space-y-1.5">
              <div>
                <a href="tel:+18452092401" className="text-[14px] font-bold text-[#1a2e3b] no-underline hover:text-[#e8930c]">(845) 209-2401</a>
                <span className="text-[11px] text-[#94a7b8] ml-1.5">Window Cleaning</span>
              </div>
              <div>
                <a href="tel:+12403011473" className="text-[14px] font-bold text-[#1a2e3b] no-underline hover:text-[#e8930c]">(240) 301-1473</a>
                <span className="text-[11px] text-[#94a7b8] ml-1.5">Plumbing</span>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-[#e5e0da] pt-6 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-xs text-[#94a7b8]">
            © 2026 Supportive AI LLC. All rights reserved.
          </p>
          <div className="flex items-center gap-4">
            <Link href="/privacy" className="text-xs text-[#94a7b8] no-underline hover:text-[#5a7184]">Privacy Policy</Link>
            <span className="text-xs text-[#d1ccc6]">·</span>
            <Link href="/terms" className="text-xs text-[#94a7b8] no-underline hover:text-[#5a7184]">Terms of Service</Link>
            <span className="text-xs text-[#d1ccc6]">·</span>
            <a href="mailto:lars@supportive-ai.com" className="text-xs text-[#94a7b8] no-underline hover:text-[#5a7184]">Support</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
