'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useSession, signOut } from 'next-auth/react';
import { useState, useEffect } from 'react';
import {
  PhoneIcon, CalendarIcon, UsersIcon, SettingsIcon,
  TrendUpIcon, DollarIcon,
} from '@/components/marketing/Icons';

const navItems = [
  { href: '/dashboard', label: 'Dashboard', icon: TrendUpIcon },
  { href: '/dashboard/calls', label: 'Calls', icon: PhoneIcon },
  { href: '/dashboard/bookings', label: 'Bookings', icon: CalendarIcon },
  { href: '/dashboard/customers', label: 'Customers', icon: UsersIcon },
  { href: '/dashboard/settings', label: 'Settings', icon: SettingsIcon },
];

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { data: session, status } = useSession();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    if (status === 'authenticated' && session?.user && !session.user.businessId) {
      router.replace('/onboarding');
    }
  }, [status, session, router]);

  const handleSignOut = () => signOut({ callbackUrl: '/login' });

  if (status === 'loading' || (status === 'authenticated' && !session?.user?.businessId)) {
    return (
      <div className="min-h-screen bg-[#faf9f7] flex items-center justify-center">
        <div className="w-6 h-6 border-2 border-[#1a2e3b] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#faf9f7]">
      {/* Mobile header */}
      <header className="lg:hidden bg-white border-b border-[#e5e0da] px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-md bg-gradient-to-br from-[#1a2e3b] to-[#2a4a5e] flex items-center justify-center text-white font-extrabold text-sm">S</div>
          <span className="text-[15px] font-bold text-[#1a2e3b]">Supportive AI</span>
        </div>
        <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="p-2 rounded-lg hover:bg-[#f0eeeb]">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#1a2e3b" strokeWidth="2">
            {mobileMenuOpen ? (
              <><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></>
            ) : (
              <><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="18" x2="21" y2="18"/></>
            )}
          </svg>
        </button>
      </header>

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <nav className="lg:hidden bg-white border-b border-[#e5e0da] px-4 py-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            return (
              <Link key={item.href} href={item.href} onClick={() => setMobileMenuOpen(false)}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm no-underline ${isActive ? 'bg-[#faf9f7] text-[#1a2e3b] font-semibold' : 'text-[#5a7184]'}`}>
                <Icon size={20} />{item.label}
              </Link>
            );
          })}
          <button onClick={handleSignOut} className="flex items-center gap-3 px-4 py-3 text-sm text-[#dc2626] w-full bg-transparent border-none cursor-pointer">
            Sign out
          </button>
        </nav>
      )}

      <div className="flex">
        {/* Desktop sidebar */}
        <aside className="hidden lg:flex lg:flex-col lg:w-60 lg:fixed lg:inset-y-0 bg-white border-r border-[#e5e0da]">
          <div className="p-5 border-b border-[#e5e0da]">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-md bg-gradient-to-br from-[#1a2e3b] to-[#2a4a5e] flex items-center justify-center text-white font-extrabold text-sm">S</div>
              <span className="text-[15px] font-bold text-[#1a2e3b]">Supportive AI</span>
            </div>
            <p className="text-xs text-[#94a7b8] mt-1">{session?.user?.businessName || 'Loading...'}</p>
          </div>

          <nav className="flex-1 px-3 py-4 space-y-0.5">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              return (
                <Link key={item.href} href={item.href}
                  className={`flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm no-underline transition-colors ${
                    isActive
                      ? 'bg-[#faf9f7] text-[#1a2e3b] font-semibold'
                      : 'text-[#5a7184] hover:bg-[#faf9f7]'
                  }`}>
                  <Icon size={18} />{item.label}
                </Link>
              );
            })}
          </nav>

          <div className="p-4 border-t border-[#e5e0da]">
            {session?.user?.email && (
              <p className="text-xs text-[#94a7b8] truncate mb-2">{session.user.email}</p>
            )}
            <button onClick={handleSignOut}
              className="text-[13px] text-[#dc2626] bg-transparent border-none cursor-pointer font-medium p-0">
              Sign out
            </button>
          </div>
        </aside>

        {/* Main content */}
        <main className="flex-1 lg:pl-60">
          <div className="p-4 lg:p-7 max-w-[960px] mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
