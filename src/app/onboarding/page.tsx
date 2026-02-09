'use client';

import { useState } from 'react';
import { useSession, signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { Building2, MapPin, Phone, Loader2, ArrowRight, ArrowLeft, ChevronDown, LogOut, User, Clock, Wrench, Zap, Shield } from 'lucide-react';

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

// Vertical-specific field definitions
const VERTICAL_FIELDS: Record<string, { key: string; label: string; placeholder: string; type?: string; helpText?: string }[]> = {
  plumbing: [
    { key: 'diagnosticFee', label: 'Diagnostic Fee', placeholder: 'e.g. $89', helpText: 'What do you charge for a diagnostic visit? Your AI will mention this to callers.' },
    { key: 'afterHoursInfo', label: 'After-Hours Availability', placeholder: 'e.g. We offer emergency service 24/7 with a $50 premium', helpText: 'Do you offer after-hours or weekend service? What are the terms?' },
    { key: 'gasLineInfo', label: 'Gas Line Work', placeholder: 'e.g. Yes, we handle gas line repairs and installations', helpText: 'Does your team do gas line work? If not, leave blank.' },
  ],
  hvac: [
    { key: 'diagnosticFee', label: 'Service Call Fee', placeholder: 'e.g. $75', helpText: 'What do you charge for a service call?' },
    { key: 'afterHoursInfo', label: 'Emergency/After-Hours', placeholder: 'e.g. 24/7 emergency service available', helpText: 'Do you offer emergency HVAC service?' },
    { key: 'maintenancePlans', label: 'Maintenance Plans', placeholder: 'e.g. Annual maintenance plans starting at $199/year', helpText: 'Do you offer maintenance plans or service agreements?' },
  ],
  electrician: [
    { key: 'diagnosticFee', label: 'Service Call Fee', placeholder: 'e.g. $85', helpText: 'What do you charge for a service call?' },
    { key: 'afterHoursInfo', label: 'Emergency/After-Hours', placeholder: 'e.g. Emergency electrical service available evenings and weekends', helpText: 'Do you offer emergency electrical service?' },
  ],
};

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

type BusinessHoursEntry = { open: string; close: string; closed: boolean };
type BusinessHoursMap = Record<string, BusinessHoursEntry>;

const DEFAULT_HOURS: BusinessHoursMap = {
  Monday: { open: '08:00', close: '17:00', closed: false },
  Tuesday: { open: '08:00', close: '17:00', closed: false },
  Wednesday: { open: '08:00', close: '17:00', closed: false },
  Thursday: { open: '08:00', close: '17:00', closed: false },
  Friday: { open: '08:00', close: '17:00', closed: false },
  Saturday: { open: '09:00', close: '14:00', closed: false },
  Sunday: { open: '09:00', close: '14:00', closed: true },
};

export default function OnboardingPage() {
  const { data: session, update: updateSession } = useSession();
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Step 1: Basic info
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

  // Step 2: Vertical-specific
  const [ownerName, setOwnerName] = useState('');
  const [businessExperience, setBusinessExperience] = useState('');
  const [businessHours, setBusinessHours] = useState<BusinessHoursMap>(DEFAULT_HOURS);
  const [verticalOverrides, setVerticalOverrides] = useState<Record<string, string>>({});

  const updateField = (field: string, value: string) => {
    setForm(prev => ({ ...prev, [field]: value }));
  };

  const updateHours = (day: string, field: 'open' | 'close' | 'closed', value: string | boolean) => {
    setBusinessHours(prev => ({
      ...prev,
      [day]: { ...prev[day], [field]: value },
    }));
  };

  const updateOverride = (key: string, value: string) => {
    setVerticalOverrides(prev => ({ ...prev, [key]: value }));
  };

  const goToStep2 = () => {
    if (!form.businessName || !form.industry) {
      setError('Please fill in your business name and trade.');
      return;
    }
    setError(null);
    setStep(2);
  };

  const handleSubmit = async () => {
    setLoading(true);
    setError(null);

    try {
      // Build agentCustomOverrides from vertical fields + common fields
      const overrides: Record<string, string> = { ...verticalOverrides };
      if (businessExperience) overrides.businessExperience = businessExperience;

      // Build opening hours summary for the AI prompt
      const hoursEntries = DAYS.map(day => {
        const h = businessHours[day];
        return h.closed ? `${day}: Closed` : `${day}: ${h.open} - ${h.close}`;
      });
      const hoursSummary = hoursEntries.join(', ');

      const res = await fetch(`${API_BASE}/api/businesses/onboard`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: session?.user?.email,
          businessName: form.businessName,
          industry: form.industry,
          verticalType: form.industry, // Map trade selection to verticalType
          city: form.city,
          state: form.state,
          zipCode: form.zipCode,
          timezone: form.timezone,
          serviceRadius: form.serviceRadius,
          ownerPhone: form.ownerPhone,
          ownerName: ownerName || undefined,
          agentCustomOverrides: Object.keys(overrides).length > 0 ? overrides : undefined,
          businessHoursSchedule: hoursSummary,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Failed to create business');
      }

      await updateSession();
      router.push('/dashboard');
    } catch (err: any) {
      setError(err.message || 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const verticalFields = VERTICAL_FIELDS[form.industry] || [];
  const tradeName = TRADES.find(t => t.value === form.industry)?.label || 'your trade';

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="w-full max-w-lg">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900">
              {step === 1 ? 'Welcome to Supportive AI' : `Customize Your AI for ${tradeName}`}
            </h1>
            <p className="text-gray-500 mt-2">
              {step === 1
                ? "Let's set up your AI receptionist. This takes about 60 seconds."
                : 'Help your AI answer calls like a real member of your team.'}
            </p>
            {/* Step indicator */}
            <div className="flex items-center justify-center gap-2 mt-4">
              <div className={`h-2 w-12 rounded-full ${step >= 1 ? 'bg-blue-600' : 'bg-gray-200'}`} />
              <div className={`h-2 w-12 rounded-full ${step >= 2 ? 'bg-blue-600' : 'bg-gray-200'}`} />
            </div>
          </div>

          {error && (
            <div className="bg-red-50 text-red-700 p-4 rounded-xl mb-6 text-sm">{error}</div>
          )}

          {/* ===== STEP 1: Basic Info ===== */}
          {step === 1 && (
            <div className="space-y-5">
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

              {/* Location Row */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label htmlFor="city" className="block text-sm font-medium text-gray-700 mb-1.5">City</label>
                  <div className="relative">
                    <MapPin className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                    <input id="city" type="text" value={form.city} onChange={(e) => updateField('city', e.target.value)}
                      placeholder="e.g. Poughkeepsie"
                      className="w-full pl-11 pr-4 py-3 border border-gray-200 rounded-xl text-base focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
                  </div>
                </div>
                <div>
                  <label htmlFor="state" className="block text-sm font-medium text-gray-700 mb-1.5">State</label>
                  <input id="state" type="text" value={form.state} onChange={(e) => updateField('state', e.target.value)}
                    placeholder="e.g. NY" maxLength={2}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl text-base focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent uppercase" />
                </div>
              </div>

              {/* Timezone + Service Radius */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label htmlFor="timezone" className="block text-sm font-medium text-gray-700 mb-1.5">Timezone</label>
                  <div className="relative">
                    <select id="timezone" value={form.timezone} onChange={(e) => updateField('timezone', e.target.value)}
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl text-base focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none bg-white">
                      {TIMEZONES.map((tz) => (
                        <option key={tz.value} value={tz.value}>{tz.label}</option>
                      ))}
                    </select>
                    <ChevronDown className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={18} />
                  </div>
                </div>
                <div>
                  <label htmlFor="serviceRadius" className="block text-sm font-medium text-gray-700 mb-1.5">Service Area (miles)</label>
                  <input id="serviceRadius" type="number" value={form.serviceRadius}
                    onChange={(e) => updateField('serviceRadius', e.target.value)} min="5" max="100"
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl text-base focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
                </div>
              </div>

              {/* Owner Phone */}
              <div>
                <label htmlFor="ownerPhone" className="block text-sm font-medium text-gray-700 mb-1.5">Your Phone Number</label>
                <div className="relative">
                  <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                  <input id="ownerPhone" type="tel" value={form.ownerPhone}
                    onChange={(e) => updateField('ownerPhone', e.target.value)} placeholder="+1 (555) 123-4567"
                    className="w-full pl-11 pr-4 py-3 border border-gray-200 rounded-xl text-base focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
                </div>
                <p className="text-xs text-gray-400 mt-1">We&apos;ll notify you here when your AI books a job.</p>
              </div>

              {/* Next button */}
              <button type="button" onClick={goToStep2}
                disabled={!form.businessName || !form.industry}
                className="w-full flex items-center justify-center gap-2 bg-blue-600 text-white py-3.5 px-6 rounded-xl text-lg font-semibold hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed mt-2">
                Next: Customize Your AI <ArrowRight size={20} />
              </button>
            </div>
          )}

          {/* ===== STEP 2: Customize Your AI ===== */}
          {step === 2 && (
            <div className="space-y-5">
              {/* Owner Name */}
              <div>
                <label htmlFor="ownerName" className="block text-sm font-medium text-gray-700 mb-1.5">
                  Owner / Operator Name
                </label>
                <div className="relative">
                  <User className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                  <input id="ownerName" type="text" value={ownerName}
                    onChange={(e) => setOwnerName(e.target.value)} placeholder="e.g. Mike Johnson"
                    className="w-full pl-11 pr-4 py-3 border border-gray-200 rounded-xl text-base focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
                </div>
                <p className="text-xs text-gray-400 mt-1">Your AI will refer to you by name when talking to callers.</p>
              </div>

              {/* Business Experience */}
              <div>
                <label htmlFor="experience" className="block text-sm font-medium text-gray-700 mb-1.5">
                  About Your Business
                </label>
                <div className="relative">
                  <Shield className="absolute left-3.5 top-3 text-gray-400" size={18} />
                  <textarea id="experience" value={businessExperience}
                    onChange={(e) => setBusinessExperience(e.target.value)}
                    placeholder="e.g. We've been serving the Poughkeepsie area for over 15 years. Licensed and insured."
                    rows={2}
                    className="w-full pl-11 pr-4 py-3 border border-gray-200 rounded-xl text-base focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none" />
                </div>
                <p className="text-xs text-gray-400 mt-1">Your AI will use this to build trust with callers.</p>
              </div>

              {/* Vertical-specific fields */}
              {verticalFields.length > 0 && (
                <div className="border-t border-gray-100 pt-5">
                  <div className="flex items-center gap-2 mb-4">
                    <Wrench className="text-blue-600" size={18} />
                    <h3 className="text-sm font-semibold text-gray-700">{tradeName} Settings</h3>
                  </div>
                  <div className="space-y-4">
                    {verticalFields.map((field) => (
                      <div key={field.key}>
                        <label htmlFor={field.key} className="block text-sm font-medium text-gray-700 mb-1.5">
                          {field.label}
                        </label>
                        <input id={field.key} type={field.type || 'text'}
                          value={verticalOverrides[field.key] || ''}
                          onChange={(e) => updateOverride(field.key, e.target.value)}
                          placeholder={field.placeholder}
                          className="w-full px-4 py-3 border border-gray-200 rounded-xl text-base focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
                        {field.helpText && (
                          <p className="text-xs text-gray-400 mt-1">{field.helpText}</p>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Business Hours */}
              <div className="border-t border-gray-100 pt-5">
                <div className="flex items-center gap-2 mb-4">
                  <Clock className="text-blue-600" size={18} />
                  <h3 className="text-sm font-semibold text-gray-700">Business Hours</h3>
                </div>
                <div className="space-y-2">
                  {DAYS.map((day) => (
                    <div key={day} className="flex items-center gap-2">
                      <span className="w-20 text-sm text-gray-600 shrink-0">{day.slice(0, 3)}</span>
                      <label className="flex items-center gap-1.5 shrink-0">
                        <input type="checkbox" checked={!businessHours[day].closed}
                          onChange={(e) => updateHours(day, 'closed', !e.target.checked)}
                          className="rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
                        <span className="text-xs text-gray-500">Open</span>
                      </label>
                      {!businessHours[day].closed ? (
                        <div className="flex items-center gap-1 text-sm">
                          <input type="time" value={businessHours[day].open}
                            onChange={(e) => updateHours(day, 'open', e.target.value)}
                            className="px-2 py-1.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-blue-500" />
                          <span className="text-gray-400">–</span>
                          <input type="time" value={businessHours[day].close}
                            onChange={(e) => updateHours(day, 'close', e.target.value)}
                            className="px-2 py-1.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-blue-500" />
                        </div>
                      ) : (
                        <span className="text-sm text-gray-400 italic">Closed</span>
                      )}
                    </div>
                  ))}
                </div>
                <p className="text-xs text-gray-400 mt-2">Your AI will only book appointments during these hours.</p>
              </div>

              {/* Buttons */}
              <div className="flex gap-3 mt-2">
                <button type="button" onClick={() => { setStep(1); setError(null); }}
                  className="flex items-center justify-center gap-2 px-6 py-3.5 border border-gray-200 rounded-xl text-base font-medium text-gray-600 hover:bg-gray-50 transition-colors">
                  <ArrowLeft size={18} /> Back
                </button>
                <button type="button" onClick={handleSubmit} disabled={loading}
                  className="flex-1 flex items-center justify-center gap-2 bg-blue-600 text-white py-3.5 px-6 rounded-xl text-lg font-semibold hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
                  {loading ? (
                    <><Loader2 className="animate-spin" size={20} /> Setting up...</>
                  ) : (
                    <><Zap size={20} /> Launch My AI Receptionist</>
                  )}
                </button>
              </div>
            </div>
          )}

          {/* Footer */}
          <div className="mt-6 pt-4 border-t border-gray-100 flex items-center justify-between">
            <p className="text-sm text-gray-400">
              Signed in as {session?.user?.email}
            </p>
            <button onClick={() => signOut({ callbackUrl: '/login' })}
              className="flex items-center gap-1.5 text-sm text-gray-400 hover:text-red-500 transition-colors">
              <LogOut size={14} /> Sign out
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
