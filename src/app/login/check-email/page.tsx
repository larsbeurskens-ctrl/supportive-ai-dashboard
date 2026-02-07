import { Mail, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function CheckEmailPage() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 text-center">
          {/* Icon */}
          <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-6">
            <Mail className="text-blue-600" size={32} />
          </div>

          {/* Message */}
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Check your email</h1>
          <p className="text-gray-500 mb-8">
            We sent you a magic link to sign in. Click the link in your email to continue.
          </p>

          {/* Tips */}
          <div className="bg-gray-50 rounded-xl p-4 text-sm text-gray-600 text-left mb-6">
            <p className="font-medium mb-2">Didn't receive the email?</p>
            <ul className="list-disc list-inside space-y-1">
              <li>Check your spam folder</li>
              <li>Make sure you entered the correct email</li>
              <li>Wait a minute and try again</li>
            </ul>
          </div>

          {/* Back to login */}
          <Link
            href="/login"
            className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium"
          >
            <ArrowLeft size={18} />
            Back to login
          </Link>
        </div>

        {/* Footer */}
        <p className="mt-8 text-center text-sm text-gray-400">
          © 2026 Supportive AI. All rights reserved.
        </p>
      </div>
    </div>
  );
}
