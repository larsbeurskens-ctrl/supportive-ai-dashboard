import Link from 'next/link';
import { Logo } from '@/components/Logo';

export default function CheckEmailPage() {
  return (
    <div className="min-h-screen bg-[#faf9f7] flex flex-col">
      {/* Minimal nav */}
      <nav className="px-6 py-4">
        <Link href="/" className="flex items-center no-underline w-fit">
          <Logo size="md" />
        </Link>
      </nav>

      <div className="flex-1 flex items-center justify-center px-4 pb-12">
        <div className="w-full max-w-[440px] text-center">
          {/* Email icon */}
          <div className="w-16 h-16 rounded-full bg-[#eef4f8] flex items-center justify-center mx-auto mb-6">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#1a2e3b" strokeWidth="1.5">
              <rect x="2" y="4" width="20" height="16" rx="3"/>
              <path d="M22 7l-10 6L2 7"/>
            </svg>
          </div>

          <h1 className="text-[28px] font-extrabold text-[#1a2e3b] mb-2">Check your email</h1>
          <p className="text-[16px] text-[#5a7184] mb-8 leading-relaxed">
            We sent you a secure sign-in link.<br />
            Click it to finish setting up your account.
          </p>

          {/* Tips */}
          <div className="bg-white rounded-xl border border-[#e5e0da] p-5 text-left text-sm text-[#5a7184] mb-6">
            <p className="font-semibold text-[#1a2e3b] mb-2">Didn&apos;t get it?</p>
            <p className="mb-1">Check your spam folder — sometimes it ends up there.</p>
            <p>The link expires in 1 hour.</p>
          </div>

          <Link
            href="/onboarding"
            className="inline-flex items-center gap-1.5 text-[#1a2e3b] font-semibold text-sm no-underline hover:underline"
          >
            ← Try a different email
          </Link>
        </div>
      </div>
    </div>
  );
}
