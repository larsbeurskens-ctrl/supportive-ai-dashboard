'use client';

import Link from 'next/link';
import { useState } from 'react';

export function MarketingNav() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <nav className="flex justify-between items-center px-6 md:px-10 py-3.5 bg-white border-b border-[#e5e0da]">
      <Link href="/" className="flex items-center gap-2.5 no-underline">
        <div className="w-[34px] h-[34px] rounded-lg bg-gradient-to-br from-[#1a2e3b] to-[#2a4a5e] flex items-center justify-center text-white font-extrabold text-[17px]">
          S
        </div>
        <span className="text-[17px] font-bold text-[#1a2e3b] tracking-tight">
          Supportive AI
        </span>
      </Link>

      {/* Desktop nav */}
      <div className="hidden md:flex items-center gap-8">
        <Link href="/#how-it-works" className="text-sm text-[#2a4a5e] font-medium no-underline hover:text-[#1a2e3b]">
          How it works
        </Link>
        <Link href="/#pricing" className="text-sm text-[#2a4a5e] font-medium no-underline hover:text-[#1a2e3b]">
          Pricing
        </Link>
        <Link href="/faq" className="text-sm text-[#2a4a5e] font-medium no-underline hover:text-[#1a2e3b]">
          FAQ
        </Link>
        <div className="relative group">
          <button className="text-sm text-[#2a4a5e] font-medium cursor-pointer bg-transparent border-none">
            Industries
          </button>
          <div className="hidden group-hover:block absolute top-full left-0 mt-1 bg-white border border-[#e5e0da] rounded-lg shadow-lg py-2 min-w-[180px] z-50">
            <Link href="/window-cleaning" className="block px-4 py-2 text-sm text-[#2a4a5e] no-underline hover:bg-[#faf9f7]">Window Cleaning</Link>
            <Link href="/plumbing" className="block px-4 py-2 text-sm text-[#2a4a5e] no-underline hover:bg-[#faf9f7]">Plumbing</Link>
            <Link href="/hvac" className="block px-4 py-2 text-sm text-[#2a4a5e] no-underline hover:bg-[#faf9f7]">HVAC</Link>
          </div>
        </div>
        <Link
          href="/login"
          className="text-sm text-[#2a4a5e] font-medium no-underline hover:text-[#1a2e3b]"
        >
          Log in
        </Link>
        <Link
          href="/onboarding"
          className="bg-[#1a2e3b] text-white px-5 py-2.5 rounded-lg text-sm font-semibold no-underline hover:bg-[#243d4e] transition-colors"
        >
          Start Free Trial
        </Link>
      </div>

      {/* Mobile hamburger */}
      <button
        onClick={() => setMobileOpen(!mobileOpen)}
        className="md:hidden p-2 bg-transparent border-none cursor-pointer"
      >
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
        <div className="absolute top-full left-0 right-0 bg-white border-b border-[#e5e0da] p-4 md:hidden z-50">
          <Link href="/#how-it-works" className="block py-3 text-[#2a4a5e] font-medium no-underline">How it works</Link>
          <Link href="/#pricing" className="block py-3 text-[#2a4a5e] font-medium no-underline">Pricing</Link>
          <Link href="/window-cleaning" className="block py-3 text-[#2a4a5e] font-medium no-underline">Window Cleaning</Link>
          <Link href="/plumbing" className="block py-3 text-[#2a4a5e] font-medium no-underline">Plumbing</Link>
          <Link href="/hvac" className="block py-3 text-[#2a4a5e] font-medium no-underline">HVAC</Link>
          <Link href="/faq" className="block py-3 text-[#2a4a5e] font-medium no-underline">FAQ</Link>
          <Link href="/login" className="block py-3 text-[#2a4a5e] font-medium no-underline">Log in</Link>
          <Link href="/onboarding" className="block mt-2 text-center bg-[#1a2e3b] text-white py-3 rounded-lg font-semibold no-underline">Start Free Trial</Link>
        </div>
      )}
    </nav>
  );
}
