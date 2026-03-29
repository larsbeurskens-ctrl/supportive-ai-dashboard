'use client';

import Link from 'next/link';
import { useState } from 'react';
import { usePathname } from 'next/navigation';
import { Logo } from '@/components/Logo';

const VERTICAL_BANNERS: Record<string, { label: string; emoji: string; href: string }> = {
  '/plumbing':        { label: 'Built for plumbers', emoji: '🔧', href: '/plumbing' },
  '/window-cleaning': { label: 'Built for window cleaners', emoji: '🪟', href: '/window-cleaning' },
  '/hvac':            { label: 'Built for HVAC technicians', emoji: '❄️', href: '/hvac' },
};

export function MarketingNav() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname();
  const banner = VERTICAL_BANNERS[pathname];

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-[#e5e0da]">

      <nav className="relative flex justify-between items-center px-6 md:px-10 py-3.5">
        <Link href="/" className="flex items-center no-underline">
          <Logo size="md" />
        </Link>

        {/* Desktop nav */}
        <div className="hidden md:flex items-center gap-8">
          <Link href="/how-it-works" className="text-sm text-[#2a4a5e] font-medium no-underline hover:text-[#1a2e3b]">
            How It Works
          </Link>
          <Link href="/pricing" className="text-sm text-[#2a4a5e] font-medium no-underline hover:text-[#1a2e3b]">
            Pricing
          </Link>
          <Link href="/demo" className="text-sm text-[#2a4a5e] font-medium no-underline hover:text-[#1a2e3b]">
            Try Demo
          </Link>
          <div className="relative group">
            <button className={`text-sm font-medium cursor-pointer bg-transparent border-none transition-colors ${banner ? 'text-[#e8930c]' : 'text-[#2a4a5e]'}`}>
              Industries ▾
            </button>
            <div className="hidden group-hover:block absolute top-full left-0 pt-1 z-50">
              <div className="bg-white border border-[#e5e0da] rounded-lg shadow-lg py-2 min-w-[200px]">
              <Link href="/plumbing" className={`flex items-center gap-2.5 px-4 py-2.5 text-sm no-underline hover:bg-[#faf9f7] transition-colors ${pathname === '/plumbing' ? 'text-[#e8930c] font-semibold bg-[#fffbf5]' : 'text-[#2a4a5e]'}`}>
                <span>🔧</span> Plumbing
              </Link>
              <Link href="/window-cleaning" className={`flex items-center gap-2.5 px-4 py-2.5 text-sm no-underline hover:bg-[#faf9f7] transition-colors ${pathname === '/window-cleaning' ? 'text-[#e8930c] font-semibold bg-[#fffbf5]' : 'text-[#2a4a5e]'}`}>
                <span>🪟</span> Window Cleaning
              </Link>
              <Link href="/hvac" className={`flex items-center gap-2.5 px-4 py-2.5 text-sm no-underline hover:bg-[#faf9f7] transition-colors ${pathname === '/hvac' ? 'text-[#e8930c] font-semibold bg-[#fffbf5]' : 'text-[#2a4a5e]'}`}>
                <span>❄️</span> HVAC
              </Link>
              </div>
            </div>
          </div>
          <Link href="/login" className="text-sm text-[#2a4a5e] font-medium no-underline hover:text-[#1a2e3b]">
            Log in
          </Link>
          <Link href="/onboarding" className="bg-[#e8930c] text-white px-5 py-2.5 rounded-lg text-sm font-semibold no-underline hover:bg-[#d17f00] transition-colors shadow-[0_2px_6px_rgba(232,147,12,0.3)]">
            Start Free Trial
          </Link>
        </div>

        {/* Mobile hamburger */}
        <button onClick={() => setMobileOpen(!mobileOpen)} className="md:hidden p-2 bg-transparent border-none cursor-pointer">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#1a2e3b" strokeWidth="2">
            {mobileOpen ? (
              <><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></>
            ) : (
              <><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="18" x2="21" y2="18"/></>
            )}
          </svg>
        </button>

        {/* Mobile menu */}
        {mobileOpen && (
          <div className="absolute top-full left-0 right-0 bg-white border-b border-[#e5e0da] shadow-lg p-4 md:hidden z-50">
            <Link href="/how-it-works" onClick={() => setMobileOpen(false)} className="block py-3 text-[#2a4a5e] font-medium no-underline border-b border-[#f0eeeb]">How It Works</Link>
            <Link href="/pricing" onClick={() => setMobileOpen(false)} className="block py-3 text-[#2a4a5e] font-medium no-underline border-b border-[#f0eeeb]">Pricing</Link>
            <Link href="/demo" onClick={() => setMobileOpen(false)} className="block py-3 text-[#2a4a5e] font-medium no-underline border-b border-[#f0eeeb]">Try Demo</Link>
            <div className="py-2 border-b border-[#f0eeeb]">
              <p className="text-[11px] font-bold text-[#94a7b8] uppercase tracking-wider mb-2 px-0">Industries</p>
              <Link href="/plumbing" onClick={() => setMobileOpen(false)} className="flex items-center gap-2 py-2 text-[#2a4a5e] font-medium no-underline">🔧 Plumbing</Link>
              <Link href="/window-cleaning" onClick={() => setMobileOpen(false)} className="flex items-center gap-2 py--2 text-[#2a4a5e] font-medium no-underline">🪟 Window Cleaning</Link>
              <Link href="/hvac" onClick={() => setMobileOpen(false)} className="flex items-center gap-2 py-2 text-[#2a4a5e] font-medium no-underline">❄️ HVAC</Link>
            </div>
            <Link href="/login" onClick={() => setMobileOpen(false)} className="block py-3 text-[#2a4a5e] font-medium no-underline border-b border-[#f0eeeb]">Log in</Link>
            <Link href="/onboarding" onClick={() => setMobileOpen(false)} className="block mt-3 text-center bg-[#e8930c] text-white py-3 rounded-lg font-semibold no-underline hover:bg-[#d17f00] transition-colors">Start Free Trial</Link>
          </div>
        )}
      </nav>
    </header>
  );
}
