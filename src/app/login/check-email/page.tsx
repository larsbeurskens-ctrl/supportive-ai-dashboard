'use client';

import { useState, useEffect } from 'react';
import { Mail, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function CheckEmailPage() {
  const [isCotorra, setIsCotorra] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const host = window.location.hostname;
    const param = new URLSearchParams(window.location.search).get('brand');
    setIsCotorra(host.includes('cotorra') || param === 'cotorra');
  }, []);

  const accent = isCotorra ? '#0F9A66' : '#e8930c';
  const accentBg = isCotorra ? '#eafaf3' : '#fef8f0';
  const dark = isCotorra ? '#16150F' : '#1a2e3b';

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 text-center">
          {/* Icon */}
          <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6" style={{ background: accentBg }}>
            <Mail size={32} style={{ color: accent }} />
          </div>

          {/* Content */}
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Check your email</h1>
          <p className="text-gray-500 mb-8">
            We sent you a sign-in link.<br />
            Click the link in the email to access your dashboard.
          </p>

          {/* Tips */}
          <div className="bg-gray-50 rounded-xl p-4 text-left text-sm text-gray-600 mb-6">
            <p className="font-medium text-gray-700 mb-2">Didn&apos;t get the email?</p>
            <ul className="space-y-1 list-disc list-inside">
              <li>Check your spam folder</li>
              <li>Make sure you entered the right email</li>
              <li>The link expires in 1 hour</li>
            </ul>
          </div>

          {/* Back link */}
          <Link
            href={isCotorra ? '/login?brand=cotorra' : '/login'}
            className="inline-flex items-center gap-2 font-medium no-underline"
            style={{ color: dark }}
          >
            <ArrowLeft size={16} />
            Try a different email
          </Link>
        </div>
      </div>
    </div>
  );
}
