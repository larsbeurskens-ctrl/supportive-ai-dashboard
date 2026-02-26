import { Mail, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function CheckEmailPage() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 text-center">
          {/* Icon */}
          <div className="w-16 h-16 bg-[#fef8f0] rounded-full flex items-center justify-center mx-auto mb-6">
            <Mail className="text-[#e8930c]" size={32} />
          </div>

          {/* Content */}
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Check your email</h1>
          <p className="text-gray-500 mb-8">
            We sent you a sign-in link.<br />
            Click the link in the email to access your dashboard.
          </p>

          {/* Tips */}
          <div className="bg-gray-50 rounded-xl p-4 text-left text-sm text-gray-600 mb-6">
            <p className="font-medium text-gray-700 mb-2">Didn't get the email?</p>
            <ul className="space-y-1 list-disc list-inside">
              <li>Check your spam folder</li>
              <li>Make sure you entered the right email</li>
              <li>The link expires in 1 hour</li>
            </ul>
          </div>

          {/* Back link */}
          <Link
            href="/login"
            className="inline-flex items-center gap-2 text-[#1a2e3b] hover:text-[#e8930c] font-medium no-underline"
          >
            <ArrowLeft size={16} />
            Try a different email
          </Link>
        </div>
      </div>
    </div>
  );
}
