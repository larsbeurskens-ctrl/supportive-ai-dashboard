import { AlertCircle, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function AuthErrorPage() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 text-center">
          {/* Icon */}
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <AlertCircle className="text-red-600" size={32} />
          </div>

          {/* Content */}
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Something went wrong</h1>
          <p className="text-gray-500 mb-8">
            We couldn't sign you in. The link may have expired or already been used.
          </p>

          {/* Back link */}
          <Link
            href="/login"
            className="inline-flex items-center justify-center gap-2 w-full bg-[#e8930c] text-white py-4 px-6 rounded-xl text-lg font-semibold hover:bg-[#d17f00] transition-colors shadow-[0_2px_8px_rgba(232,147,12,0.25)]"
          >
            <ArrowLeft size={20} />
            Try again
          </Link>
        </div>
      </div>
    </div>
  );
}
