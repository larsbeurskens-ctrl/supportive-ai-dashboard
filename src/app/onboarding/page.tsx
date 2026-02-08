'use client';

import { useState } from 'react';
import { useSession, signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { Building2, MapPin, Phone, Loader2, ArrowRight, ChevronDown, LogOut } from 'lucide-react';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'https://supportive-ai-backend-production.up.railway.app';

const TRADES = [
  { value: 'window_cleaning', label: 'Window Cleaning' },
  { value: 'plumbing', label: 'Plumbing' },
  { value: 'hvac', label: 'HVAC (Heating & Air Conditioning)' },
  { value: 'pest_control', label: 'Pest Control' },
  { value: 'electrician', label: 'Electrician' },
  { value: 'cleaning', label: 'Cleaning / Janitorial' },
  { value: 'roofing', label: 'Roofing' },
  { value: 'handyman', label: 'Handyman' },
  { value: 'landscaping', label: 'Landscaping / Lawn Care' },
  { value: 'appliance_repair', label: 'Appliance Repair' },
  { value: 'garage_door', label: 'Garage Door Service' },
  { value: 'other', label: 'Other Home Service' },
];

const TIMEZONES = [
  { value: 'America/New_York', label: 'Eastern Time (ET)' },
  { value: 'America/Chicago', label: 'Central Time (CT)' },
  { value: 'America/Denver', label: 'Mountain Time (MT)' },
  { value: 'America/Los_Angeles', label: 'Pacific Time (PT)' },
  { value: 'America/Anchorage', label: 'Alaska Time (AKT)' },
  { value: 'Pacific/Honolulu', label: 'Hawaii Time (HT)' },
];

export default function OnboardingPage() {
  const { data: session, update: updateSession } = useSession();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [form, setForm] = useState({
    businessName: '',
    industry: '',
    city: '',
    state: '',
    zipCode: '',
    timezone: 'America/New_York',
    serviceRadius: '30',
    ownerPhone: '',
  });

  const updateField = (field: string, value: string) => {
    setForm(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    if (!form.businessName || !form.industry) {
      setError('Please fill in your business name and trade.');
      setLoading(false);
      return;
    }

    try {
      const res = await fetch(`${API_BASE}/api/businesses/onboard`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: session?.user?.email,
          businessName: form.businessName,
          industry: form.industry,
          city: form.city,
          state: form.state,
          zipCode: form.zipCode,
          timezone: form.timezone,
          serviceRadius: form.serviceRadius,
          ownerPhone: form.ownerPhone,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Failed to create business');
      }

      // Refresh the session so JWT picks up the new businessId
      await updateSession();
      
      // Redirect to dashboard
      router.push('/dashboard');
    } catch (err: any) {
      setError(err.message || 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="w-full max-w-lg">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Welcome to Supportive AI</h1>
            <p className="text-gray-500 mt-2">
              Let&apos;s set up your AI receptionist. This takes about 60 seconds.
            </p>
          </div>

          {error && (
            <div className="bg-red-50 text-red-700 p-4 rounded-xl mb-6 text-sm">{error}</div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Business Name */}
            <div>
              <label htmlFor="businessName" className="block text-sm font-medium text-gray-700 mb-1.5">
                Business Name *
              </label>
              <div className="relative">
                <Building2 className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                <input
                  id="businessName"
                  type="text"
                  value={form.businessName}
                  onChange={(e) => updateField('businessName', e.target.value)}
                  placeholder="e.g. Smith's Plumbing"
                  required
                  className="w-full pl-11 pr-4 py-3 border border-gray-200 rounded-xl text-base focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            {/* Trade / Industry */}
            <div>
              <label htmlFor="industry" className="block text-sm font-medium text-gray-700 mb-1.5">
                Your Trade *
              </label>
              <div className="relative">
                <select
                  id="industry"
                  value={form.industry}
                  onChange={(e) => updateField('industry', e.target.value)}
                  required
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl text-base focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none bg-white"
                >
                  <option value="">Select your trade...</option>
                  {TRADES.map((t) => (
                    <option key={t.value} value={t.value}>{t.label}</option>
                  ))}
                </select>
                <ChevronDown className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={18} />
              </div>
            </div>

            {/* Location Row: City + State */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label htmlFor="city" className="block text-sm font-medium text-gray-700 mb-1.5">City</label>
                <div className="relative">
                  <MapPin className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                  <input
                    id="city"
                    type="text"
                    value={form.city}
                    onChange={(e) => updateField('city', e.target.value)}
                    placeholder="e.g. Poughkeepsie"
                    className="w-full pl-11 pr-4 py-3 border border-gray-200 rounded-xl text-base focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>
              <div>
                <label htmlFor="state" className="block text-sm font-medium text-gray-700 mb-1.5">State</label>
                <input
                  id="state"
                  type="text"
                  value={form.state}
                  onChange={(e) => updateField('state', e.target.value)}
                  placeholder="e.g. NY"
                  maxLength={2}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl text-base focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent uppercase"
                />
              </div>
            </div>

            {/* Timezone + Service Radius */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label htmlFor="timezone" className="block text-sm font-medium text-gray-700 mb-1.5">Timezone</label>
                <div className="relative">
                  <select
                    id="timezone"
                    value={form.timezone}
                    onChange={(e) => updateField('timezone', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl text-base focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none bg-white"
                  >
                    {TIMEZONES.map((tz) => (
                      <option key={tz.value} value={tz.value}>{tz.label}</option>
                    ))}
                  </select>
                  <ChevronDown className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={18} />
                </div>
              </div>
              <div>
                <label htmlFor="serviceRadius" className="block text-sm font-medium text-gray-700 mb-1.5">
                  Service Area (miles)
                </label>
                <input
                  id="serviceRadius"
                  type="number"
                  value={form.serviceRadius}
                  onChange={(e) => updateField('serviceRadius', e.target.value)}
                  min="5"
                  max="100"
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl text-base focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            {/* Owner Phone */}
            <div>
              <label htmlFor="ownerPhone" className="block text-sm font-medium text-gray-700 mb-1.5">
                Your Phone Number
              </label>
              <div className="relative">
                <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                <input
                  id="ownerPhone"
                  type="tel"
                  value={form.ownerPhone}
                  onChange={(e) => updateField('ownerPhone', e.target.value)}
                  placeholder="+1 (555) 123-4567"
                  className="w-full pl-11 pr-4 py-3 border border-gray-200 rounded-xl text-base focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <p className="text-xs text-gray-400 mt-1">We&apos;ll notify you here when your AI books a job.</p>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading || !form.businessName || !form.industry}
              className="w-full flex items-center justify-center gap-2 bg-blue-600 text-white py-3.5 px-6 rounded-xl text-lg font-semibold hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed mt-2"
            >
              {loading ? (
                <>
                  <Loader2 className="animate-spin" size={20} />
                  Setting up...
                </>
              ) : (
                <>
                  Get Started
                  <ArrowRight size={20} />
                </>
              )}
            </button>
          </form>

          {/* Footer */}
          <div className="mt-6 pt-4 border-t border-gray-100 flex items-center justify-between">
            <p className="text-sm text-gray-400">
              Signed in as {session?.user?.email}
            </p>
            <button
              onClick={() => signOut({ callbackUrl: '/login' })}
              className="flex items-center gap-1.5 text-sm text-gray-400 hover:text-red-500 transition-colors"
            >
              <LogOut size={14} />
              Sign out
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
