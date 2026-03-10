'use client';

import { useState, useEffect, useCallback } from 'react';
import { useSession } from 'next-auth/react';
import { 
  getProvisionStatus, provisionBusiness, getProvisionOptions,
  saveBusinessDetails, goLive, connectStripe,
  ProvisionStatus,
} from '@/lib/api';

// Area code hints
const AREA_CODE_HINTS: Record<string, string> = {
  '212': 'New York, NY', '213': 'Los Angeles, CA', '214': 'Dallas, TX',
  '305': 'Miami, FL', '312': 'Chicago, IL', '415': 'San Francisco, CA',
  '512': 'Austin, TX', '602': 'Phoenix, AZ', '713': 'Houston, TX',
  '727': 'Tampa/St Pete, FL', '845': 'Hudson Valley, NY', '914': 'Westchester, NY',
  '479': 'NW Arkansas', '210': 'San Antonio, TX', '404': 'Atlanta, GA',
};

type WizardStep = 'loading' | 'create-agent' | 'business-details' | 'test-call' | 'checklist';

// Vertical-specific labels
const VERTICAL_LABELS: Record<string, {
  feeLabel: string; feePlaceholder: string; servicesPlaceholder: string;
  showGasLine?: boolean; showCleaningMethod?: boolean; feeFieldName: string;
}> = {
  plumbing: {
    feeLabel: 'What do you charge for a service call?',
    feePlaceholder: 'e.g. $89 service call fee, $0 — free estimates, $69 diagnostic waived with repair',
    servicesPlaceholder: 'e.g. drain cleaning, water heater repair, emergency plumbing, bathroom remodels...',
    showGasLine: true, feeFieldName: 'diagnosticFee',
  },
  window_cleaning: {
    feeLabel: 'What do you charge for a typical job?',
    feePlaceholder: 'e.g. from $150 for a standard home, $5 per pane, free quotes available',
    servicesPlaceholder: 'e.g. interior/exterior windows, screens, tracks, skylights, pressure washing, gutter cleaning...',
    showCleaningMethod: true, feeFieldName: 'diagnosticFee',
  },
  hvac: {
    feeLabel: 'What do you charge for a service call?',
    feePlaceholder: 'e.g. $79 diagnostic fee — waived if you go ahead with the repair',
    servicesPlaceholder: 'e.g. AC repair, furnace install, duct cleaning, thermostat replacement...',
    feeFieldName: 'serviceCallFee',
  },
  electrician: {
    feeLabel: 'Service call fee',
    feePlaceholder: 'e.g. $75 trip charge, free estimates for big jobs',
    servicesPlaceholder: 'e.g. panel upgrades, outlet install, lighting, ceiling fans, rewiring...',
    feeFieldName: 'diagnosticFee',
  },
  roofing: {
    feeLabel: 'Inspection / estimate fee',
    feePlaceholder: 'e.g. free inspections, $150 for detailed report',
    servicesPlaceholder: 'e.g. shingle repair, metal roofing, flat roofs, storm damage, gutter install...',
    feeFieldName: 'diagnosticFee',
  },
  pest_control: {
    feeLabel: 'Initial treatment price',
    feePlaceholder: 'e.g. $149 initial treatment, monthly plans from $49',
    servicesPlaceholder: 'e.g. termites, rodents, ants, mosquitoes, bed bugs, wildlife removal...',
    feeFieldName: 'diagnosticFee',
  },
  landscaping: {
    feeLabel: 'Starting price',
    feePlaceholder: 'e.g. mowing from $40, free estimates for projects',
    servicesPlaceholder: 'e.g. lawn care, tree trimming, hardscaping, irrigation, seasonal cleanup...',
    feeFieldName: 'diagnosticFee',
  },
};

export default function SetupWizard() {
  const { data: session } = useSession();
  const [step, setStep] = useState<WizardStep>('loading');
  const [status, setStatus] = useState<ProvisionStatus | null>(null);
  const [error, setError] = useState('');

  // Step 1: Phone setup
  const [phoneChoice, setPhoneChoice] = useState<'keep' | 'new' | ''>('');
  const [existingPhone, setExistingPhone] = useState('');
  const [pickupAfterHours, setPickupAfterHours] = useState(true);
  const [pickupMissedCalls, setPickupMissedCalls] = useState(true);
  const [pickupAlwaysOn, setPickupAlwaysOn] = useState(false);
  const [areaCode, setAreaCode] = useState('');
  const [agentName, setAgentName] = useState('');
  const [nameSuggestions, setNameSuggestions] = useState<string[]>([]);
  const [provisioning, setProvisioning] = useState(false);
  const [provisionResult, setProvisionResult] = useState<{
    phoneNumber: string; phoneNumberPretty: string;
    agentName: string; calendarAuthUrl: string | null;
  } | null>(null);

  // Step 2: Business details
  const [ownerName, setOwnerName] = useState('');
  const [ownerPhone, setOwnerPhone] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [serviceRadius, setServiceRadius] = useState('30');
  const [diagnosticFee, setDiagnosticFee] = useState('');
  const [feeDeductible, setFeeDeductible] = useState(false);  const [services, setServices] = useState('');
  const [isLicensed, setIsLicensed] = useState(true);
  const [isInsured, setIsInsured] = useState(true);
  const [yearsExperience, setYearsExperience] = useState('');
  const [emergencyService, setEmergencyService] = useState(false);
  const [gasLineWork, setGasLineWork] = useState('');
  const [cleaningMethod, setCleaningMethod] = useState('');
  const [financing, setFinancing] = useState('');
  const [discounts, setDiscounts] = useState('');
  const [customFAQ, setCustomFAQ] = useState('');
  const [saving, setSaving] = useState(false);

  // Go live
  const [goingLive, setGoingLive] = useState(false);

  const vertical = status?.vertical || 'window_cleaning';
  const labels = VERTICAL_LABELS[vertical] || VERTICAL_LABELS.window_cleaning;

  const refreshStatus = useCallback(async () => {
    try {
      const s = await getProvisionStatus();
      setStatus(s);
      return s;
    } catch { return null; }
  }, []);

  // Pre-fill form from existing data
  function prefillFromStatus(s: ProvisionStatus) {
    const o = s.overrides || {};
    if (o.ownerName) setOwnerName(o.ownerName);
    if (o.ownerPhone) setOwnerPhone(o.ownerPhone);
    if (o.city) setCity(o.city);
    if (o.state) setState(o.state);
    if (o.diagnosticFee) setDiagnosticFee(o.diagnosticFee);
    if (o.feeDeductible !== undefined) setFeeDeductible(o.feeDeductible);
    if (o.services) setServices(o.services);
    if (o.customFAQ) setCustomFAQ(o.customFAQ);
    if (o.yearsExperience) setYearsExperience(o.yearsExperience);
    if (o.isLicensed !== undefined) setIsLicensed(o.isLicensed);
    if (o.isInsured !== undefined) setIsInsured(o.isInsured);
    if (o.emergencyAvailability !== undefined) setEmergencyService(o.emergencyAvailability);
    if (o.gasLineInfo) setGasLineWork(o.gasLineInfo);
    if (o.cleaningMethod) setCleaningMethod(o.cleaningMethod);
    if (o.financing) setFinancing(o.financing);
    if (o.discounts) setDiscounts(o.discounts);
  }

  useEffect(() => {
    let retries = 0;
    async function init() {
      try {
        const opts = await getProvisionOptions();
        setNameSuggestions(opts.nameSuggestions);
        const s = await getProvisionStatus();
        setStatus(s);
        prefillFromStatus(s);
        determineStep(s);
      } catch {
        if (retries < 3) { retries++; setTimeout(init, 1000); }
        else setStep('create-agent');
      }
    }
    init();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  function determineStep(s: ProvisionStatus) {
    if (!s.provisioned) setStep('create-agent');
    else if (!s.checklist.businessDetailsAdded) setStep('business-details');
    else if (!s.checklist.testCallMade) setStep('test-call');
    else setStep('checklist');
  }

  // === Handlers ===
  async function handleProvision() {
    if (!agentName.trim()) { setError('Give your AI a name'); return; }
    if (phoneChoice === 'new' && areaCode.length !== 3) { setError('Enter a 3-digit area code'); return; }
    if (phoneChoice === 'keep' && !existingPhone.trim()) { setError('Enter your business phone number'); return; }
    setProvisioning(true); setError('');
    try {
      // For "keep" flow, extract area code from their number, or use 845 as fallback
      const effectiveAreaCode = phoneChoice === 'new' ? areaCode : (existingPhone.replace(/\D/g, '').slice(0, 3) || '845');
      const res = await provisionBusiness(effectiveAreaCode, agentName.trim());
      setProvisionResult(res);
      // Store phone preferences
      await saveBusinessDetails({
        phoneSetup: phoneChoice,
        existingBusinessPhone: phoneChoice === 'keep' ? existingPhone.trim() : null,
        ownerPhone: phoneChoice === 'keep' ? existingPhone.trim() : null,
        pickupRules: {
          afterHours: pickupAfterHours,
          missedCalls: pickupMissedCalls,
          alwaysOn: pickupAlwaysOn,
        },
      });
      await refreshStatus();
      setStep('business-details');
    } catch (err: any) {
      const msg = err?.message || String(err) || '';
      if (msg.includes('already provisioned')) window.location.reload();
      else if (msg.includes('area code') || msg.includes('phone number') || msg.includes('not available') || msg.includes('Unable') || msg.includes('Twilio') || msg.includes('AvailablePhoneNumber')) setError(`No phone numbers available for area code ${areaCode || 'entered'}. Try a real US area code like 713 (Houston), 404 (Atlanta), or 845 (Hudson Valley).`);
      else setError(`Something went wrong: ${msg || 'Provisioning failed'}. Try a different area code.`);
    } finally { setProvisioning(false); }
  }

  async function handleSaveDetails() {
    if (!ownerName.trim()) { setError('We need your name so your AI knows who to refer customers to'); return; }
    if (!status?.overrides?.ownerPhone && !ownerPhone.trim()) { setError('Your phone number is required for emergency escalations and appointment texts'); return; }
    setSaving(true); setError('');
    try {
      await saveBusinessDetails({
        ownerPhone: ownerPhone.trim(), ownerName: ownerName.trim(),
        city: city.trim(), state: state.trim(),
        serviceRadius: parseInt(serviceRadius) || 30,
        diagnosticFee: diagnosticFee.trim(),
        feeDeductible,        services: services.trim(), customFAQ: customFAQ.trim(),
        isLicensed, isInsured,
        yearsExperience: yearsExperience.trim(),
        emergencyAvailability: emergencyService,
        gasLineInfo: gasLineWork.trim(),
        cleaningMethod: cleaningMethod.trim(),
        financing: financing.trim(),
        discounts: discounts.trim(),
      });
      const s = await refreshStatus();
      if (s) { prefillFromStatus(s); determineStep(s); }
      else setStep('test-call');
    } catch { setError('Failed to save. Please try again.'); }
    finally { setSaving(false); }
  }

  async function handleGoLive() {
    setGoingLive(true);
    try {
      await goLive();
      const s = await refreshStatus();
      if (s) determineStep(s);
    } catch { setError('Failed to go live. Please try again.'); }
    finally { setGoingLive(false); }
  }

  function goToEdit() {
    if (status) prefillFromStatus(status);
    setStep('business-details');
  }

  const displayName = provisionResult?.agentName || status?.agentName || agentName || 'your AI';
  const displayPhone = provisionResult?.phoneNumberPretty || status?.phoneNumber || '';
  const areaHint = AREA_CODE_HINTS[areaCode] || '';

  if (step === 'loading') {
    return (
      <div className="bg-white rounded-2xl border border-[#e5e0da] p-8 text-center">
        <div className="w-6 h-6 border-2 border-[#0d9488] border-t-transparent rounded-full animate-spin mx-auto" />
      </div>
    );
  }

  // If live, show minimal status with pickup rules — persist for returning visits
  if (status?.isLive) {
    // Track when they first saw the live state
    if (typeof window !== 'undefined' && !localStorage.getItem('agent_live_since')) {
      localStorage.setItem('agent_live_since', new Date().toISOString());
    }
    const rules = (status as any).pickupRules || { afterHours: true, missedCalls: true, alwaysOn: false };
    const ruleLabels: string[] = [];
    if (rules.afterHours) ruleLabels.push('after hours');
    if (rules.missedCalls) ruleLabels.push('when you miss a call');
    if (rules.alwaysOn) ruleLabels.push('on every call');
    const ruleText = ruleLabels.length > 0 ? ruleLabels.join(' and ') : 'when you need it';
    return (
      <div className="bg-[#f0fdf4] rounded-2xl border border-[#bbf7d0] p-6">
        <div className="flex items-center gap-3">
          <div className="w-3 h-3 bg-[#22c55e] rounded-full animate-pulse" />
          <div>
            <p className="text-[15px] font-bold text-[#0f172a]">{displayName} is live — picks up {ruleText}</p>
            <p className="text-[13px] text-[#64748b]">{displayPhone}</p>
          </div>
        </div>
      </div>
    );
  }

  // Show the live banner if agent went live recently (within 7 days) even if page was navigated away
  if (typeof window !== 'undefined' && !status?.isLive) {
    const liveSince = localStorage.getItem('agent_live_since');
    if (liveSince) {
      const daysSince = (Date.now() - new Date(liveSince).getTime()) / (1000 * 60 * 60 * 24);
      if (daysSince > 7) localStorage.removeItem('agent_live_since');
    }
  }

  const stepLabels = ['Phone setup', 'Business details', 'Test call', 'Go live'];
  const currentStepNum = step === 'create-agent' ? 1 : step === 'business-details' ? 2 : step === 'test-call' ? 3 : 4;

  return (
    <div className="bg-white rounded-2xl border-2 border-[#0d9488] overflow-hidden">
      {/* Header with step indicators */}
      <div className="bg-[#1a2e3b] px-6 py-5">
        <div className="flex gap-1 mb-3">
          {stepLabels.map((label, i) => (
            <div key={label} className="flex-1">
              <div className={`h-1.5 rounded-full ${i + 1 <= currentStepNum ? 'bg-[#0d9488]' : 'bg-white/15'}`} />
              <p className={`text-[10px] mt-1 ${i + 1 === currentStepNum ? 'text-white font-semibold' : 'text-white/40'}`}>{label}</p>
            </div>
          ))}
        </div>
        <h2 className="text-[18px] font-bold text-white">
          {step === 'create-agent' && 'Set up your phone'}
          {step === 'business-details' && `Tell ${displayName} about your business`}
          {step === 'test-call' && `Test ${displayName}`}
          {step === 'checklist' && 'Ready to go live'}
        </h2>
      </div>

      <div className="p-6">

        {/* ====== STEP 1: Phone Setup ====== */}
        {step === 'create-agent' && (
          <div className="space-y-5">
            <div className="bg-[#eff6ff] rounded-xl p-3 text-center">
              <p className="text-[13px] text-[#1e40af] font-medium">🔒 Nothing goes live until you say so. Set up at your own pace.</p>
            </div>

            {/* Agent name */}
            <div>
              <label className="block text-sm font-semibold text-[#1a2e3b] mb-1.5">Name your AI receptionist</label>
              <input type="text" value={agentName} onChange={e => setAgentName(e.target.value.slice(0, 20))}
                placeholder="e.g. Sarah, Emma, Lisa..."
                className="w-full px-4 py-3 border border-[#e5e0da] rounded-xl text-[15px] text-[#1a2e3b] placeholder:text-[#d1ccc6] focus:outline-none focus:ring-2 focus:ring-[#0d9488] focus:border-transparent" />
              <div className="flex gap-2 mt-2 flex-wrap">
                {nameSuggestions.slice(0, 6).map(n => (
                  <button key={n} onClick={() => setAgentName(n)}
                    className={`text-[12px] px-3 py-1 rounded-full border transition-colors ${agentName === n ? 'bg-[#0d9488] text-white border-[#0d9488]' : 'bg-[#f8f7f6] text-[#5a7184] border-[#e5e0da] hover:border-[#0d9488]'}`}>{n}</button>
                ))}
              </div>
            </div>

            {/* Phone choice */}
            <div>
              <label className="block text-sm font-semibold text-[#1a2e3b] mb-2">How do you want to set up your phone?</label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <button onClick={() => setPhoneChoice('keep')}
                  className={`text-left p-4 rounded-xl border-2 transition-all cursor-pointer ${phoneChoice === 'keep' ? 'border-[#0d9488] bg-[#f0fdf4]' : 'border-[#e5e0da] bg-white hover:border-[#94a7b8]'}`}>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-[16px]">📱</span>
                    <span className="text-[14px] font-bold text-[#1a2e3b]">Keep my existing number</span>
                  </div>
                  <p className="text-[12px] text-[#5a7184] leading-relaxed">Customers call the same number they always have. We answer when you can&apos;t.</p>
                  {phoneChoice === 'keep' && <span className="inline-block mt-2 text-[11px] font-semibold text-[#0d9488] bg-[#ecfdf5] px-2 py-0.5 rounded">Recommended</span>}
                </button>
                <button onClick={() => setPhoneChoice('new')}
                  className={`text-left p-4 rounded-xl border-2 transition-all cursor-pointer ${phoneChoice === 'new' ? 'border-[#0d9488] bg-[#f0fdf4]' : 'border-[#e5e0da] bg-white hover:border-[#94a7b8]'}`}>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-[16px]">🆕</span>
                    <span className="text-[14px] font-bold text-[#1a2e3b]">Get a new number</span>
                  </div>
                  <p className="text-[12px] text-[#5a7184] leading-relaxed">We&apos;ll create a new local number for your AI. Good if you don&apos;t have a business line yet.</p>
                </button>
              </div>
            </div>

            {/* Keep existing: enter number */}
            {phoneChoice === 'keep' && (
              <div>
                <label className="block text-sm font-semibold text-[#1a2e3b] mb-1.5">Your business phone number</label>
                <input type="tel" value={existingPhone} onChange={e => setExistingPhone(e.target.value)}
                  placeholder="(555) 123-4567"
                  className="w-full px-4 py-3 border border-[#e5e0da] rounded-xl text-[15px] text-[#1a2e3b] placeholder:text-[#d1ccc6] focus:outline-none focus:ring-2 focus:ring-[#0d9488]" />
                <p className="text-[11px] text-[#94a7b8] mt-1">We&apos;ll use this number for emergency escalations and appointment text confirmations.</p>
              </div>
            )}

            {/* New number: area code */}
            {phoneChoice === 'new' && (
              <div>
                <label className="block text-sm font-semibold text-[#1a2e3b] mb-1.5">Pick your local area code</label>
                <div className="relative">
                  <input type="text" value={areaCode}
                    onChange={e => { setAreaCode(e.target.value.replace(/[^0-9]/g, '').slice(0, 3)); setError(''); }}
                    placeholder="e.g. 845, 713, 404" maxLength={3}
                    className="w-[160px] px-4 py-3 border border-[#e5e0da] rounded-xl text-[18px] font-bold text-center text-[#1a2e3b] placeholder:text-[#d1ccc6] focus:outline-none focus:ring-2 focus:ring-[#0d9488]" />
                  {areaHint && <span className="ml-3 text-[13px] text-[#059669] font-medium">{areaHint}</span>}
                </div>
              </div>
            )}

            {/* Pickup rules */}
            {phoneChoice && (
              <div>
                <label className="block text-sm font-semibold text-[#1a2e3b] mb-2">When should your AI pick up?</label>
                <p className="text-[12px] text-[#94a7b8] mb-3">Select all that apply — you can change this anytime.</p>
                <div className="space-y-2.5">
                  <label className={`flex items-start gap-3 p-3.5 rounded-xl border-2 cursor-pointer transition-all ${pickupAfterHours ? 'border-[#0d9488] bg-[#f0fdf4]' : 'border-[#e5e0da] bg-white hover:border-[#94a7b8]'}`}>
                    <input type="checkbox" checked={pickupAfterHours} onChange={e => setPickupAfterHours(e.target.checked)}
                      className="w-5 h-5 rounded border-[#d1ccc6] text-[#0d9488] focus:ring-[#0d9488] mt-0.5 flex-shrink-0" />
                    <div>
                      <span className="text-[14px] font-bold text-[#1a2e3b]">After hours</span>
                      <p className="text-[12px] text-[#5a7184] mt-0.5">AI answers outside your business hours — evenings, weekends, holidays.</p>
                    </div>
                  </label>
                  <label className={`flex items-start gap-3 p-3.5 rounded-xl border-2 cursor-pointer transition-all ${pickupMissedCalls ? 'border-[#0d9488] bg-[#f0fdf4]' : 'border-[#e5e0da] bg-white hover:border-[#94a7b8]'}`}>
                    <input type="checkbox" checked={pickupMissedCalls} onChange={e => setPickupMissedCalls(e.target.checked)}
                      className="w-5 h-5 rounded border-[#d1ccc6] text-[#0d9488] focus:ring-[#0d9488] mt-0.5 flex-shrink-0" />
                    <div>
                      <span className="text-[14px] font-bold text-[#1a2e3b]">When I miss a call</span>
                      <p className="text-[12px] text-[#5a7184] mt-0.5">Your phone rings first. After 4 rings, the AI catches it. You never lose a call.</p>
                    </div>
                  </label>
                  <label className={`flex items-start gap-3 p-3.5 rounded-xl border-2 cursor-pointer transition-all ${pickupAlwaysOn ? 'border-[#0d9488] bg-[#f0fdf4]' : 'border-[#e5e0da] bg-white hover:border-[#94a7b8]'}`}>
                    <input type="checkbox" checked={pickupAlwaysOn} onChange={e => setPickupAlwaysOn(e.target.checked)}
                      className="w-5 h-5 rounded border-[#d1ccc6] text-[#0d9488] focus:ring-[#0d9488] mt-0.5 flex-shrink-0" />
                    <div>
                      <span className="text-[14px] font-bold text-[#1a2e3b]">Always on</span>
                      <p className="text-[12px] text-[#5a7184] mt-0.5">AI answers every call. Urgent ones get forwarded to you instantly.</p>
                    </div>
                  </label>
                </div>
              </div>
            )}

            {/* Submit */}
            {phoneChoice && (pickupAfterHours || pickupMissedCalls || pickupAlwaysOn) && (
              <button onClick={handleProvision}
                disabled={provisioning || !agentName.trim() || (phoneChoice === 'new' && areaCode.length !== 3)}
                className="w-full bg-[#0d9488] text-white py-3 rounded-xl text-[15px] font-bold hover:bg-[#0b7c72] transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
                {provisioning ? (
                  <span className="flex items-center justify-center gap-2">
                    <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Setting up {agentName || 'your AI'}...
                  </span>
                ) : `Continue →`}
              </button>
            )}

            {error && <div className="bg-red-50 text-red-700 p-3 rounded-xl text-[13px]">{error}</div>}
          </div>
        )}

        {/* ====== STEP 2: Business Details ====== */}
        {step === 'business-details' && (
          <div className="space-y-5">
            {/* Success banner — only after fresh provision */}
            {status?.provisioned && (
              <div className="bg-[#f0fdf4] rounded-xl p-4 flex items-start gap-3">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#059669" strokeWidth="2" className="flex-shrink-0 mt-0.5"><path d="M20 6L9 17l-5-5"/></svg>
                <div>
                  <p className="text-[13px] font-semibold text-[#059669]">{displayName} is ready to test!</p>
                  <p className="text-[13px] text-[#5a7184]">Test number: <span className="font-bold text-[#1a2e3b]">{displayPhone}</span> — call it to hear your AI in action. Nothing is live until you say so.</p>
                </div>
              </div>
            )}

            <p className="text-[14px] text-[#5a7184] leading-relaxed">
              {displayName} already knows your trade — now add your specifics so {displayName} sounds like part of your team.
            </p>

            {/* --- Section: About you --- */}
            <div className="border-t border-[#f0eeeb] pt-4">
              <h3 className="text-[13px] font-bold text-[#94a7b8] uppercase tracking-wider mb-3">About you</h3>
              <div className="space-y-3">
                <div className={`grid ${!status?.overrides?.ownerPhone ? 'grid-cols-2' : ''} gap-3`}>
                  <div>
                    <label className="block text-sm font-semibold text-[#1a2e3b] mb-1">Your name <span className="text-red-500">*</span></label>
                    <input type="text" value={ownerName} onChange={e => setOwnerName(e.target.value)}
                      placeholder="e.g. Mike Johnson"
                      className="w-full px-4 py-2.5 border border-[#e5e0da] rounded-xl text-[14px] text-[#1a2e3b] focus:outline-none focus:ring-2 focus:ring-[#0d9488]" />
                    <p className="text-[11px] text-[#94a7b8] mt-1">Your AI will refer customers to you by name — e.g. &quot;I&apos;ll have {ownerName || 'Mike'} call you back.&quot;</p>
                  </div>
                  {!status?.overrides?.ownerPhone && (
                    <div>
                      <label className="block text-sm font-semibold text-[#1a2e3b] mb-1">Your mobile <span className="text-red-500">*</span></label>
                      <input type="tel" value={ownerPhone} onChange={e => setOwnerPhone(e.target.value)}
                        placeholder="(555) 123-4567"
                        className="w-full px-4 py-2.5 border border-[#e5e0da] rounded-xl text-[14px] text-[#1a2e3b] focus:outline-none focus:ring-2 focus:ring-[#0d9488]" />
                      <p className="text-[11px] text-[#94a7b8] mt-1">For emergency escalations and appointment text confirmations.</p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* --- Section: Service area & credentials --- */}
            <div className="border-t border-[#f0eeeb] pt-4">
              <h3 className="text-[13px] font-bold text-[#94a7b8] uppercase tracking-wider mb-3">Service area &amp; credentials</h3>
              <div className="space-y-3">
                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <label className="block text-sm font-semibold text-[#1a2e3b] mb-1">City</label>
                    <input type="text" value={city} onChange={e => setCity(e.target.value)} placeholder="Houston"
                      className="w-full px-4 py-2.5 border border-[#e5e0da] rounded-xl text-[14px] text-[#1a2e3b] focus:outline-none focus:ring-2 focus:ring-[#0d9488]" />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-[#1a2e3b] mb-1">State</label>
                    <input type="text" value={state} onChange={e => setState(e.target.value)} placeholder="TX"
                      className="w-full px-4 py-2.5 border border-[#e5e0da] rounded-xl text-[14px] text-[#1a2e3b] focus:outline-none focus:ring-2 focus:ring-[#0d9488]" />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-[#1a2e3b] mb-1">Experience</label>
                    <input type="text" value={yearsExperience} onChange={e => setYearsExperience(e.target.value)} placeholder="10+ years"
                      className="w-full px-4 py-2.5 border border-[#e5e0da] rounded-xl text-[14px] text-[#1a2e3b] focus:outline-none focus:ring-2 focus:ring-[#0d9488]" />
                  </div>
                </div>
                {/* Service radius */}
                <div>
                  <label className="block text-sm font-semibold text-[#1a2e3b] mb-1">Service radius</label>
                  <div className="flex items-center gap-3">
                    <input type="range" min="5" max="75" value={serviceRadius} onChange={e => setServiceRadius(e.target.value)} className="flex-1 accent-[#0d9488]" />
                    <span className="text-[14px] font-bold text-[#1a2e3b] w-20 text-right">{serviceRadius} miles</span>
                  </div>
                </div>
                {/* Licensed & Insured */}
                <div className="flex gap-4">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" checked={isLicensed} onChange={e => setIsLicensed(e.target.checked)}
                      className="w-4 h-4 rounded border-[#e5e0da] text-[#0d9488] focus:ring-[#0d9488]" />
                    <span className="text-[13px] text-[#1a2e3b]">Licensed</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" checked={isInsured} onChange={e => setIsInsured(e.target.checked)}
                      className="w-4 h-4 rounded border-[#e5e0da] text-[#0d9488] focus:ring-[#0d9488]" />
                    <span className="text-[13px] text-[#1a2e3b]">Insured</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" checked={emergencyService} onChange={e => setEmergencyService(e.target.checked)}
                      className="w-4 h-4 rounded border-[#e5e0da] text-[#0d9488] focus:ring-[#0d9488]" />
                    <span className="text-[13px] text-[#1a2e3b]">Emergency / after-hours available</span>
                  </label>
                </div>
              </div>
            </div>

            {/* --- Section: Pricing & services --- */}
            <div className="border-t border-[#f0eeeb] pt-4">
              <h3 className="text-[13px] font-bold text-[#94a7b8] uppercase tracking-wider mb-3">Pricing &amp; services</h3>
              <div className="space-y-3">
                <div>
                  <label className="block text-sm font-semibold text-[#1a2e3b] mb-1">{labels.feeLabel}</label>
                  <p className="text-[11px] text-[#94a7b8] mb-1.5">Your AI will quote this to customers who ask about pricing.</p>
                  <input type="text" value={diagnosticFee} onChange={e => setDiagnosticFee(e.target.value)}
                    placeholder={labels.feePlaceholder}
                    className="w-full px-4 py-2.5 border border-[#e5e0da] rounded-xl text-[14px] text-[#1a2e3b] focus:outline-none focus:ring-2 focus:ring-[#0d9488]" />
                  <label className="flex items-center gap-2 mt-2 cursor-pointer">
                    <input type="checkbox" checked={feeDeductible} onChange={e => setFeeDeductible(e.target.checked)}
                      className="w-4 h-4 rounded border-[#e5e0da] text-[#0d9488] focus:ring-[#0d9488]" />
                    <span className="text-[12px] text-[#5a7184]">Fee is deducted from the cost of work if customer proceeds</span>
                  </label>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-[#1a2e3b] mb-1">Services you offer</label>
                  <textarea value={services} onChange={e => setServices(e.target.value)}
                    placeholder={labels.servicesPlaceholder} rows={2}
                    className="w-full px-4 py-2.5 border border-[#e5e0da] rounded-xl text-[14px] text-[#1a2e3b] focus:outline-none focus:ring-2 focus:ring-[#0d9488] resize-none" />
                </div>

                {/* Plumbing: gas line work */}
                {labels.showGasLine && (
                  <div>
                    <label className="block text-sm font-semibold text-[#1a2e3b] mb-1">Gas line work?</label>
                    <div className="flex gap-2">
                      {['Yes, licensed for gas', 'No, we refer gas work out', 'Some gas work'].map(opt => (
                        <button key={opt} onClick={() => setGasLineWork(opt)}
                          className={`text-[12px] px-3 py-1.5 rounded-lg border transition-colors ${gasLineWork === opt ? 'bg-[#0d9488] text-white border-[#0d9488]' : 'bg-[#f8f7f6] text-[#5a7184] border-[#e5e0da] hover:border-[#0d9488]'}`}>{opt}</button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Window cleaning: method */}
                {labels.showCleaningMethod && (
                  <div>
                    <label className="block text-sm font-semibold text-[#1a2e3b] mb-1">Cleaning method / materials</label>
                    <input type="text" value={cleaningMethod} onChange={e => setCleaningMethod(e.target.value)}
                      placeholder="e.g. water-fed pole, eco-friendly solutions, traditional squeegee, pure water..."
                      className="w-full px-4 py-2.5 border border-[#e5e0da] rounded-xl text-[14px] text-[#1a2e3b] focus:outline-none focus:ring-2 focus:ring-[#0d9488]" />
                  </div>
                )}

                {/* Financing */}
                <div>
                  <label className="block text-sm font-semibold text-[#1a2e3b] mb-1">Do you offer financing?</label>
                  <input type="text" value={financing} onChange={e => setFinancing(e.target.value)}
                    placeholder="e.g. Yes, through GreenSky — 12 months same as cash on jobs over $500. Or leave blank."
                    className="w-full px-4 py-2.5 border border-[#e5e0da] rounded-xl text-[14px] text-[#1a2e3b] focus:outline-none focus:ring-2 focus:ring-[#0d9488]" />
                  <p className="text-[11px] text-[#94a7b8] mt-1">Your AI will mention this when customers ask about payment options or large jobs.</p>
                </div>

                {/* Discounts */}
                <div>
                  <label className="block text-sm font-semibold text-[#1a2e3b] mb-1">Any discounts you offer?</label>
                  <input type="text" value={discounts} onChange={e => setDiscounts(e.target.value)}
                    placeholder="e.g. 10% for veterans, 5% senior discount, 15% off first service, referral discount..."
                    className="w-full px-4 py-2.5 border border-[#e5e0da] rounded-xl text-[14px] text-[#1a2e3b] focus:outline-none focus:ring-2 focus:ring-[#0d9488]" />
                  <p className="text-[11px] text-[#94a7b8] mt-1">Your AI will bring this up naturally when relevant — e.g. if a customer mentions they're a veteran.</p>
                </div>

                {/* Anything else */}
                <div>
                  <label className="block text-sm font-semibold text-[#1a2e3b] mb-1">Anything else customers should know?</label>
                  <textarea value={customFAQ} onChange={e => setCustomFAQ(e.target.value)}
                    placeholder="e.g. same-day service available, senior discounts, warranties offered, family-owned since 2010..."
                    rows={2}
                    className="w-full px-4 py-2.5 border border-[#e5e0da] rounded-xl text-[14px] text-[#1a2e3b] focus:outline-none focus:ring-2 focus:ring-[#0d9488] resize-none" />
                </div>
              </div>
            </div>

            <button onClick={handleSaveDetails} disabled={saving || !ownerName.trim() || (!status?.overrides?.ownerPhone && !ownerPhone.trim())}
              className="w-full bg-[#0d9488] text-white py-3 rounded-xl text-[15px] font-bold hover:bg-[#0b7c72] transition-colors disabled:opacity-50">
              {saving ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Saving &amp; updating {displayName}...
                </span>
              ) : `Save & test ${displayName} →`}
            </button>
            {error && <div className="bg-red-50 text-red-700 p-3 rounded-xl text-[13px]">{error}</div>}
          </div>
        )}

        {/* ====== STEP 3: Test Call ====== */}
        {step === 'test-call' && (
          <div className="space-y-5">
            <div className="bg-[#f0fdf4] rounded-xl p-4 flex items-start gap-3">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#059669" strokeWidth="2" className="flex-shrink-0 mt-0.5"><path d="M20 6L9 17l-5-5"/></svg>
              <p className="text-[13px] font-semibold text-[#059669]">Business details saved! {displayName} now knows your pricing, services, and area.</p>
            </div>
            <div className="text-center py-4">
              <p className="text-[14px] text-[#5a7184] mb-4">
                Give {displayName} a test call — pretend to be a customer needing a job done.
              </p>
              <div className="bg-[#f8fafc] rounded-2xl p-6 inline-block">
                <p className="text-[13px] text-[#64748b] mb-1">Call {displayName} now:</p>
                <a href={`tel:${displayPhone}`} className="text-[28px] font-bold text-[#0d9488] no-underline hover:underline">
                  {displayPhone}
                </a>
              </div>
              <p className="text-[12px] text-[#94a7b8] mt-4">
                Tip: Ask about pricing, book an appointment, or check if you serve their area.
              </p>
            </div>
            <div className="flex gap-3">
              <button onClick={async () => { await saveBusinessDetails({ testCallConfirmed: true }); await refreshStatus(); setStep('checklist'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                className="flex-1 bg-[#0d9488] text-white py-3 rounded-xl text-[15px] font-bold hover:bg-[#0b7c72] transition-colors">
                I&apos;ve tested {displayName} →
              </button>
              <button onClick={goToEdit}
                className="text-[13px] font-semibold text-[#5a7184] bg-transparent border border-[#e5e0da] px-4 py-3 rounded-xl hover:bg-[#faf9f7]">
                ← Edit details
              </button>
            </div>
          </div>
        )}

        {/* ====== STEP 4: Go-Live Checklist ====== */}
        {step === 'checklist' && status && (() => {
          const requiredDone = status.checklist.agentCreated && status.checklist.ownerPhoneSet && status.checklist.businessDetailsAdded && status.checklist.testCallMade;
          return (
          <div className="space-y-5">
            {/* Test mode / ready banner */}
            {!status.isLive ? (
              requiredDone ? (
                <div className="bg-[#f0fdf4] border border-[#86efac] rounded-xl p-4 flex items-start gap-3">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#059669" strokeWidth="2" className="flex-shrink-0 mt-0.5"><path d="M20 6L9 17l-5-5"/></svg>
                  <div>
                    <p className="text-[13px] font-bold text-[#059669]">All set! {displayName} is ready to go live.</p>
                    <p className="text-[12px] text-[#16a34a]">Hit the button below to start receiving real calls.</p>
                  </div>
                </div>
              ) : (
                <div className="bg-[#fef3c7] border border-[#fbbf24] rounded-xl p-4 flex items-start gap-3">
                  <span className="text-[18px]">⚡</span>
                  <div>
                    <p className="text-[13px] font-bold text-[#92400e]">{displayName} is in test mode</p>
                    <p className="text-[12px] text-[#a16207]">Complete the items below, then go live.</p>
                  </div>
                </div>
              )
            ) : null}

            {/* Required checklist */}
            <div>
              <p className="text-[11px] font-bold text-[#94a7b8] uppercase tracking-wider mb-2">Required</p>
              <div className="space-y-2">
                <ChecklistItem done={status.checklist.agentCreated} label={`AI created: ${displayName}`} sublabel={displayPhone} />
                <ChecklistItem done={status.checklist.ownerPhoneSet} label="Your phone number added" sublabel="SMS alerts for incoming calls" onFix={goToEdit} />
                <ChecklistItem done={status.checklist.businessDetailsAdded} label="Business details added" sublabel="Pricing, services, credentials" onFix={goToEdit} />
                <ChecklistItem done={status.checklist.testCallMade} label="Test call completed" sublabel={`Call ${displayPhone} to test`} />
              </div>
            </div>

            {/* Activate agent — based on their step 1 choice */}
            <div className="border-t border-[#f0eeeb] pt-4">
              {(() => {
                const rules = (status as any).pickupRules || { afterHours: true, missedCalls: true, alwaysOn: false };
                const isAlwaysOn = rules.alwaysOn;
                const ruleLabels: string[] = [];
                if (rules.afterHours) ruleLabels.push('after hours');
                if (rules.missedCalls) ruleLabels.push('when you miss a call');
                if (rules.alwaysOn) ruleLabels.push('every call');
                const ruleText = ruleLabels.join(' and ');
                const phoneNum = status.phoneNumber?.replace('+1', '') || '';
                return (
                  <>
                    <h3 className="text-[13px] font-bold text-[#1a2e3b] mb-1">📱 Activate {displayName}</h3>
                    <div className="bg-[#eff6ff] rounded-xl p-3 mb-4">
                      <p className="text-[13px] text-[#1e40af] font-medium">Your setting: {displayName} will pick up <strong>{ruleText}</strong></p>
                    </div>
                    <p className="text-[13px] text-[#5a7184] mb-4">
                      Dial this code from your business phone to connect {displayName}. One step — takes 5 seconds.
                    </p>

                    {/* Active option */}
                    <div className="bg-[#f0fdf4] rounded-xl p-4 border-2 border-[#0d9488] mb-3">
                      <div className="flex items-center gap-2 mb-1">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#059669" strokeWidth="2"><path d="M20 6L9 17l-5-5"/></svg>
                        <p className="text-[13px] font-semibold text-[#059669]">{isAlwaysOn ? 'Forward all calls' : 'Forward unanswered calls'} — your selection</p>
                      </div>
                      <p className="text-[12px] text-[#5a7184] mt-0.5 ml-6">{isAlwaysOn ? `Every call goes straight to ${displayName}. Your phone won't ring.` : `Your phone rings first. If you don't pick up, ${displayName} answers. Works for both missed calls during the day and after-hours.`}</p>
                      <div className="mt-2.5 ml-6">
                        <p className="text-[14px] text-[#1a2e3b]">
                          Dial <code className="bg-white px-2 py-1 rounded text-[#1a2e3b] font-bold text-[16px] border border-[#d1ccc6]">{isAlwaysOn ? '*72' : '*71'}{phoneNum}</code> from your phone
                        </p>
                      </div>
                    </div>

                    {/* Gray alternative */}
                    <div className="bg-[#faf9f7] rounded-xl p-4 border border-[#e5e0da] opacity-60">
                      <p className="text-[12px] font-semibold text-[#94a7b8]">{isAlwaysOn ? 'Or forward unanswered only' : 'Or forward all calls'}</p>
                      <p className="text-[11px] text-[#94a7b8] mt-0.5">{isAlwaysOn ? 'If you change your mind and want your phone to ring first.' : 'If you want every call to go straight to the AI.'}</p>
                      <p className="text-[11px] text-[#94a7b8] mt-1.5">Dial <code className="bg-[#e5e0da] px-1 py-0.5 rounded text-[#94a7b8] font-semibold">{isAlwaysOn ? '*71' : '*72'}{phoneNum}</code></p>
                    </div>

                    <p className="text-[11px] text-[#94a7b8] mt-3">
                      To disconnect {displayName}, dial <code className="bg-[#e5e0da] px-1 py-0.5 rounded text-[#94a7b8] font-semibold">*73</code> from your phone. Works for most US carriers.
                    </p>
                  </>
                );
              })()}
            </div>

            {/* Go live button */}
            <div className="pt-2">
              <button onClick={handleGoLive}
                disabled={goingLive || !requiredDone}
                className="w-full bg-[#22c55e] text-white py-4 rounded-xl text-[16px] font-bold hover:bg-[#16a34a] transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-[0_2px_8px_rgba(34,197,94,0.3)]">
                {goingLive ? (
                  <span className="flex items-center justify-center gap-2">
                    <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Going live...
                  </span>
                ) : `🚀 Go live — start receiving real calls`}
              </button>
              {!requiredDone && (
                <p className="text-[12px] text-[#94a7b8] text-center mt-2">Complete the required items above to go live</p>
              )}
            </div>

            {/* Optional add-ons — visually separate with explanations */}
            <div className="border-t border-[#f0eeeb] pt-5">
              <p className="text-[11px] font-bold text-[#94a7b8] uppercase tracking-wider mb-3">Optional add-ons</p>
              <div className="space-y-3">
                {/* Calendar */}
                <div className={`rounded-xl p-4 border ${status.checklist.calendarConnected ? 'bg-[#f0fdf4] border-[#86efac]' : 'bg-[#faf9f7] border-[#e5e0da]'}`}>
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        {status.checklist.calendarConnected ? (
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#059669" strokeWidth="2"><path d="M20 6L9 17l-5-5"/></svg>
                        ) : (
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#94a7b8" strokeWidth="2"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
                        )}
                        <p className="text-[13px] font-semibold text-[#1a2e3b]">Google Calendar</p>
                      </div>
                      {status.checklist.calendarConnected ? (
                        <p className="text-[12px] text-[#059669] ml-6">Your AI checks your calendar before booking, so customers never get double-booked.</p>
                      ) : (
                        <div className="ml-6">
                          <p className="text-[12px] text-[#5a7184]">Your AI can still book appointments without this — it&apos;ll offer standard time slots (mornings and afternoons) and you&apos;ll get an SMS for each booking. But it won&apos;t know when you&apos;re already busy, so you may need to reschedule some jobs manually.</p>
                          <p className="text-[12px] text-[#0d9488] font-semibold mt-1">With calendar connected: your AI sees your real availability and avoids conflicts automatically.</p>
                        </div>
                      )}
                    </div>
                    {!status.checklist.calendarConnected && status.calendarAuthUrl && (
                      <button onClick={() => window.location.href = status.calendarAuthUrl!}
                        className="px-3 py-1.5 rounded-lg bg-white border border-[#e5e0da] text-[#0d9488] text-[12px] font-semibold hover:bg-[#f0fdf4] cursor-pointer flex-shrink-0 mt-0.5">
                        Connect
                      </button>
                    )}
                  </div>
                </div>

                {/* Payments */}
                <div className={`rounded-xl p-4 border ${status.checklist.stripeConnected ? 'bg-[#f0fdf4] border-[#86efac]' : 'bg-[#faf9f7] border-[#e5e0da]'}`}>
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        {status.checklist.stripeConnected ? (
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#059669" strokeWidth="2"><path d="M20 6L9 17l-5-5"/></svg>
                        ) : (
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#94a7b8" strokeWidth="2"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6"/></svg>
                        )}
                        <p className="text-[13px] font-semibold text-[#1a2e3b]">Stripe Payments</p>
                      </div>
                      {status.checklist.stripeConnected ? (
                        <p className="text-[12px] text-[#059669] ml-6">You can send payment links to customers via SMS after jobs are done.</p>
                      ) : (
                        <p className="text-[12px] text-[#5a7184] ml-6">Lets you send payment links via SMS after completing a job. Customer taps the link, pays by card. You can skip this and add it later from Settings.</p>
                      )}
                    </div>
                    {!status.checklist.stripeConnected && (
                      <button onClick={async () => {
                        try {
                          const result = await connectStripe();
                          if (result.onboardingUrl) window.location.href = result.onboardingUrl;
                        } catch (e: any) { setError(e.message); }
                      }}
                        className="px-3 py-1.5 rounded-lg bg-[#635BFF] text-white text-[12px] font-semibold hover:bg-[#5046e5] cursor-pointer border-none flex-shrink-0 mt-0.5">
                        Connect Stripe
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {error && <div className="bg-[#fef8f0] border border-[#f0dcc0] text-[#92640a] p-3 rounded-xl text-[13px]">{error}</div>}
          </div>
          );
        })()}

        {/* Need help — always visible */}
        <div className="mt-6 pt-5 border-t border-[#f0eeeb]">
          <div className="bg-[#eef4f8] rounded-xl p-4 flex flex-col sm:flex-row items-center gap-4">
            <div className="flex-1 text-center sm:text-left">
              <p className="text-[14px] font-bold text-[#1a2e3b]">Need a hand? We&apos;ll set it up with you.</p>
              <p className="text-[12px] text-[#5a7184] mt-0.5">Free 15-minute call — no tech skills needed.</p>
            </div>
            <a href={`https://cal.com/lars-beurskens-g1aaqy/15min${session?.user?.email ? `?email=${encodeURIComponent(session.user.email)}&name=${encodeURIComponent(session.user.name || '')}` : ''}`} target="_blank" rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-[14px] font-bold text-white bg-[#2a4a5e] px-5 py-2.5 rounded-xl no-underline hover:bg-[#1a2e3b] transition-colors flex-shrink-0 shadow-sm">
              📞 Book free setup call
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

// Checklist item component
function ChecklistItem({ done, label, sublabel, optional, onFix, fixLabel }: {
  done: boolean; label: string; sublabel?: string; optional?: boolean;
  onFix?: () => void; fixLabel?: string;
}) {
  return (
    <div className={`flex items-center gap-3 px-4 py-3 rounded-xl ${done ? 'bg-[#f0fdf4]' : 'bg-[#faf9f7]'}`}>
      <div className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 ${done ? 'bg-[#22c55e]' : 'border-2 border-[#d1d5db]'}`}>
        {done && <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3"><path d="M20 6L9 17l-5-5"/></svg>}
      </div>
      <div className="flex-1 min-w-0">
        <p className={`text-[13px] font-medium ${done ? 'text-[#059669]' : 'text-[#1a2e3b]'}`}>
          {label} {optional && <span className="text-[#94a7b8] font-normal">(optional)</span>}
        </p>
        {sublabel && <p className="text-[11px] text-[#94a7b8]">{sublabel}</p>}
      </div>
      {!done && onFix && (
        <button onClick={onFix} className="text-[12px] font-semibold text-[#0d9488] hover:underline flex-shrink-0">
          {fixLabel || 'Fix →'}
        </button>
      )}
      {done && onFix && (
        <button onClick={onFix} className="text-[11px] text-[#94a7b8] hover:text-[#0d9488] flex-shrink-0">
          Edit
        </button>
      )}
    </div>
  );
}
