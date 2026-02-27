'use client';

import { useState, useEffect, useCallback } from 'react';
import { 
  getProvisionStatus, provisionBusiness, getProvisionOptions,
  saveBusinessDetails, goLive,
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
    feeLabel: 'Call-out / diagnostic fee',
    feePlaceholder: 'e.g. $89, free estimates, varies by job',
    servicesPlaceholder: 'e.g. drain cleaning, water heater repair, emergency plumbing, bathroom remodels...',
    showGasLine: true, feeFieldName: 'diagnosticFee',
  },
  window_cleaning: {
    feeLabel: 'Starting price / estimate range',
    feePlaceholder: 'e.g. from $150 for a standard home, free quotes',
    servicesPlaceholder: 'e.g. interior/exterior windows, screens, tracks, skylights, gutter cleaning...',
    showCleaningMethod: true, feeFieldName: 'diagnosticFee',
  },
  hvac: {
    feeLabel: 'Service call fee',
    feePlaceholder: 'e.g. $79 diagnostic, waived with repair',
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
  const [step, setStep] = useState<WizardStep>('loading');
  const [status, setStatus] = useState<ProvisionStatus | null>(null);
  const [error, setError] = useState('');

  // Step 1: Create agent
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
  const [services, setServices] = useState('');
  const [isLicensed, setIsLicensed] = useState(true);
  const [isInsured, setIsInsured] = useState(true);
  const [yearsExperience, setYearsExperience] = useState('');
  const [emergencyService, setEmergencyService] = useState(false);
  const [gasLineWork, setGasLineWork] = useState('');
  const [cleaningMethod, setCleaningMethod] = useState('');
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
    if (o.services) setServices(o.services);
    if (o.customFAQ) setCustomFAQ(o.customFAQ);
    if (o.yearsExperience) setYearsExperience(o.yearsExperience);
    if (o.isLicensed !== undefined) setIsLicensed(o.isLicensed);
    if (o.isInsured !== undefined) setIsInsured(o.isInsured);
    if (o.emergencyAvailability !== undefined) setEmergencyService(o.emergencyAvailability);
    if (o.gasLineInfo) setGasLineWork(o.gasLineInfo);
    if (o.cleaningMethod) setCleaningMethod(o.cleaningMethod);
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
    if (areaCode.length !== 3) { setError('Enter a 3-digit area code'); return; }
    if (!agentName.trim()) { setError('Give your AI a name'); return; }
    setProvisioning(true); setError('');
    try {
      const res = await provisionBusiness(areaCode, agentName.trim());
      setProvisionResult(res);
      await refreshStatus();
      setStep('business-details');
    } catch (err: any) {
      const msg = err?.message || '';
      if (msg.includes('already provisioned')) window.location.reload();
      else if (msg.includes('area code')) setError('No numbers available in that area code. Try a nearby one.');
      else setError('Something went wrong. Our team has been notified.');
    } finally { setProvisioning(false); }
  }

  async function handleSaveDetails() {
    if (!ownerPhone.trim()) { setError('Your phone number is required — we text you when calls come in'); return; }
    if (!ownerName.trim()) { setError('We need your name so your AI knows who to refer customers to'); return; }
    setSaving(true); setError('');
    try {
      await saveBusinessDetails({
        ownerPhone: ownerPhone.trim(), ownerName: ownerName.trim(),
        city: city.trim(), state: state.trim(),
        serviceRadius: parseInt(serviceRadius) || 30,
        diagnosticFee: diagnosticFee.trim(),
        services: services.trim(), customFAQ: customFAQ.trim(),
        isLicensed, isInsured,
        yearsExperience: yearsExperience.trim(),
        emergencyAvailability: emergencyService,
        gasLineInfo: gasLineWork.trim(),
        cleaningMethod: cleaningMethod.trim(),
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

  // If live, show minimal status
  if (status?.isLive) {
    return (
      <div className="bg-[#f0fdf4] rounded-2xl border border-[#bbf7d0] p-6">
        <div className="flex items-center gap-3">
          <div className="w-3 h-3 bg-[#22c55e] rounded-full animate-pulse" />
          <div>
            <p className="text-[15px] font-bold text-[#0f172a]">{displayName} is live and answering calls</p>
            <p className="text-[13px] text-[#64748b]">{displayPhone}</p>
          </div>
        </div>
      </div>
    );
  }

  const stepLabels = ['Create AI', 'Business details', 'Test call', 'Go live'];
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
          {step === 'create-agent' && 'Create your AI receptionist'}
          {step === 'business-details' && `Tell ${displayName} about your business`}
          {step === 'test-call' && `Test ${displayName}`}
          {step === 'checklist' && 'Ready to go live'}
        </h2>
      </div>

      <div className="p-6">

        {/* ====== STEP 1: Create Agent ====== */}
        {step === 'create-agent' && (
          <div className="space-y-5">
            <p className="text-[14px] text-[#5a7184] leading-relaxed">
              We&apos;ll create your AI phone assistant with a local number. Takes about 30 seconds.
            </p>
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
            {/* Area code */}
            <div>
              <label className="block text-sm font-semibold text-[#1a2e3b] mb-1.5">Pick your local area code</label>
              <div className="flex gap-3 items-start">
                <div className="relative">
                  <input type="text" value={areaCode}
                    onChange={e => { setAreaCode(e.target.value.replace(/[^0-9]/g, '').slice(0, 3)); setError(''); }}
                    placeholder="845" maxLength={3}
                    className="w-[120px] px-4 py-3 border border-[#e5e0da] rounded-xl text-[18px] font-bold text-center text-[#1a2e3b] placeholder:text-[#d1ccc6] focus:outline-none focus:ring-2 focus:ring-[#0d9488]" />
                  {areaHint && <p className="absolute -bottom-5 left-0 text-[11px] text-[#059669] font-medium whitespace-nowrap">{areaHint}</p>}
                </div>
                <button onClick={handleProvision}
                  disabled={areaCode.length !== 3 || !agentName.trim() || provisioning}
                  className="flex-1 bg-[#0d9488] text-white py-3 rounded-xl text-[15px] font-bold hover:bg-[#0b7c72] transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
                  {provisioning ? (
                    <span className="flex items-center justify-center gap-2">
                      <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Creating {agentName || 'your AI'}...
                    </span>
                  ) : `Create ${agentName || 'my AI'} →`}
                </button>
              </div>
            </div>
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
                  <p className="text-[13px] font-semibold text-[#059669]">{displayName} is set up!</p>
                  <p className="text-[13px] text-[#5a7184]">Number: <span className="font-bold text-[#1a2e3b]">{displayPhone}</span> — only you can call it until you go live.</p>
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
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm font-semibold text-[#1a2e3b] mb-1">Your name <span className="text-red-500">*</span></label>
                    <input type="text" value={ownerName} onChange={e => setOwnerName(e.target.value)}
                      placeholder="e.g. Mike Johnson"
                      className="w-full px-4 py-2.5 border border-[#e5e0da] rounded-xl text-[14px] text-[#1a2e3b] focus:outline-none focus:ring-2 focus:ring-[#0d9488]" />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-[#1a2e3b] mb-1">Your mobile <span className="text-red-500">*</span></label>
                    <p className="text-[11px] text-[#94a7b8] mb-1">We text you when calls come in</p>
                    <input type="tel" value={ownerPhone} onChange={e => setOwnerPhone(e.target.value)}
                      placeholder="(555) 123-4567"
                      className="w-full px-4 py-2.5 border border-[#e5e0da] rounded-xl text-[14px] text-[#1a2e3b] focus:outline-none focus:ring-2 focus:ring-[#0d9488]" />
                  </div>
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
                  <input type="text" value={diagnosticFee} onChange={e => setDiagnosticFee(e.target.value)}
                    placeholder={labels.feePlaceholder}
                    className="w-full px-4 py-2.5 border border-[#e5e0da] rounded-xl text-[14px] text-[#1a2e3b] focus:outline-none focus:ring-2 focus:ring-[#0d9488]" />
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
                      placeholder="e.g. water-fed pole, eco-friendly solutions, traditional squeegee..."
                      className="w-full px-4 py-2.5 border border-[#e5e0da] rounded-xl text-[14px] text-[#1a2e3b] focus:outline-none focus:ring-2 focus:ring-[#0d9488]" />
                  </div>
                )}

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

            <button onClick={handleSaveDetails} disabled={saving || !ownerPhone.trim() || !ownerName.trim()}
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
              <button onClick={async () => { await refreshStatus(); setStep('checklist'); }}
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
        {step === 'checklist' && status && (
          <div className="space-y-5">
            {/* Test mode banner */}
            <div className="bg-[#fef3c7] border border-[#fbbf24] rounded-xl p-4 flex items-start gap-3">
              <span className="text-[18px]">⚡</span>
              <div>
                <p className="text-[13px] font-bold text-[#92400e]">{displayName} is in test mode</p>
                <p className="text-[12px] text-[#a16207]">Only you can call {displayPhone}. Customers won&apos;t reach {displayName} until you go live.</p>
              </div>
            </div>

            {/* Checklist */}
            <div className="space-y-2">
              <ChecklistItem done={status.checklist.agentCreated} label={`AI created: ${displayName}`} sublabel={displayPhone} />
              <ChecklistItem done={status.checklist.ownerPhoneSet} label="Your phone number added" sublabel="SMS alerts for incoming calls" onFix={goToEdit} />
              <ChecklistItem done={status.checklist.businessDetailsAdded} label="Business details added" sublabel="Pricing, services, credentials" onFix={goToEdit} />
              <ChecklistItem done={status.checklist.testCallMade} label="Test call completed" sublabel={`Call ${displayPhone} to test`} />
              <ChecklistItem done={status.checklist.calendarConnected} label="Calendar connected" sublabel="Optional — lets AI check your real availability" optional
                onFix={() => { if (status.calendarAuthUrl) window.location.href = status.calendarAuthUrl; }} fixLabel="Connect" />
            </div>

            {/* Call forwarding instructions */}
            <div className="border-t border-[#f0eeeb] pt-4">
              <h3 className="text-[13px] font-bold text-[#1a2e3b] mb-2">📱 Set up call forwarding</h3>
              <p className="text-[13px] text-[#5a7184] mb-3">
                Forward your business line to {displayPhone} so {displayName} answers when you can&apos;t. You can forward all calls or just unanswered ones.
              </p>
              <div className="bg-[#f8fafc] rounded-xl p-4 space-y-2">
                <p className="text-[12px] font-semibold text-[#1a2e3b]">Quick setup (most carriers):</p>
                <p className="text-[12px] text-[#5a7184]">
                  <strong>Forward all calls:</strong> Dial <code className="bg-[#e5e0da] px-1.5 py-0.5 rounded text-[#1a2e3b]">*72{status.phoneNumber?.replace('+1', '')}</code> from your business phone
                </p>
                <p className="text-[12px] text-[#5a7184]">
                  <strong>Forward unanswered only:</strong> Dial <code className="bg-[#e5e0da] px-1.5 py-0.5 rounded text-[#1a2e3b]">*71{status.phoneNumber?.replace('+1', '')}</code> from your business phone
                </p>
                <p className="text-[11px] text-[#94a7b8]">
                  <a href="/dashboard/setup" className="text-[#0d9488] no-underline hover:underline">See detailed instructions for your carrier →</a>
                </p>
              </div>
            </div>

            {/* Go live button */}
            <div className="pt-2">
              <button onClick={handleGoLive}
                disabled={goingLive || !status.checklist.businessDetailsAdded || !status.checklist.ownerPhoneSet}
                className="w-full bg-[#22c55e] text-white py-4 rounded-xl text-[16px] font-bold hover:bg-[#16a34a] transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-[0_2px_8px_rgba(34,197,94,0.3)]">
                {goingLive ? (
                  <span className="flex items-center justify-center gap-2">
                    <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Going live...
                  </span>
                ) : `🚀 Go live — start receiving real calls`}
              </button>
              {(!status.checklist.businessDetailsAdded || !status.checklist.ownerPhoneSet) && (
                <p className="text-[12px] text-[#94a7b8] text-center mt-2">Complete the required items above to go live</p>
              )}
            </div>
            {error && <div className="bg-red-50 text-red-700 p-3 rounded-xl text-[13px]">{error}</div>}
          </div>
        )}

        {/* Need help — always visible */}
        <div className="mt-6 pt-5 border-t border-[#f0eeeb]">
          <div className="bg-[#eef4f8] rounded-xl p-4 flex flex-col sm:flex-row items-center gap-4">
            <div className="flex-1 text-center sm:text-left">
              <p className="text-[14px] font-bold text-[#1a2e3b]">Need a hand? We&apos;ll set it up with you.</p>
              <p className="text-[12px] text-[#5a7184] mt-0.5">Free 15-minute call — no tech skills needed.</p>
            </div>
            <a href="https://cal.com/lars-beurskens-g1aaqy/15min" target="_blank" rel="noopener noreferrer"
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
