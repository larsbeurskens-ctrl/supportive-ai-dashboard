'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { getDashboardMetrics, getTodaysBookings, getCalls, DashboardMetrics, Booking, Call } from '@/lib/api';
import SetupWizard from '@/components/SetupWizard';
import {
  PhoneIcon, CalendarIcon, DollarIcon, ClockIcon, TrendUpIcon,
} from '@/components/marketing/Icons';

// Status dot — replaces emoji badges
function StatusDot({ status }: { status: string }) {
  const colors: Record<string, string> = {
    booked: '#059669', completed: '#059669', positive: '#059669',
    inquiry: '#d97706', neutral: '#6b7280',
    missed: '#dc2626', negative: '#dc2626',
  };
  return (
    <span
      className="inline-block w-2 h-2 rounded-full mr-1.5"
      style={{ backgroundColor: colors[status] || '#6b7280' }}
    />
  );
}

function formatTime(timeStr: string): string {
  if (!timeStr) return '';
  const [hours, minutes] = timeStr.split(':').map(Number);
  const ampm = hours >= 12 ? 'PM' : 'AM';
  const hour12 = hours % 12 || 12;
  return `${hour12}:${minutes.toString().padStart(2, '0')} ${ampm}`;
}

function formatCallTime(dateStr: string): string {
  const date = new Date(dateStr);
  const now = new Date();
  const isToday = date.toDateString() === now.toDateString();
  const yesterday = new Date(now);
  yesterday.setDate(yesterday.getDate() - 1);
  const isYesterday = date.toDateString() === yesterday.toDateString();
  const time = date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
  if (isToday) return `Today ${time}`;
  if (isYesterday) return `Yesterday ${time}`;
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) + ` ${time}`;
}

function formatJobDate(dateStr: string): string {
  const date = new Date(dateStr);
  const now = new Date();
  const tomorrow = new Date(now); tomorrow.setDate(tomorrow.getDate() + 1);
  if (date.toDateString() === now.toDateString()) return 'Today';
  if (date.toDateString() === tomorrow.toDateString()) return 'Tomorrow';
  return date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
}

export default function DashboardPage() {
  const [metrics, setMetrics] = useState<DashboardMetrics | null>(null);
  const [todaysJobs, setTodaysJobs] = useState<Booking[]>([]);
  const [recentCalls, setRecentCalls] = useState<Call[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isLive, setIsLive] = useState(false);
  const [agentName, setAgentName] = useState('');
  const [agentPhone, setAgentPhone] = useState('');
  const [pickupRulesText, setPickupRulesText] = useState('');
  const [showLiveBanner, setShowLiveBanner] = useState(false);
  const [trialDaysLeft, setTrialDaysLeft] = useState<number | null>(null);
  const [selectedPlan, setSelectedPlan] = useState('');
  const [hasCalendar, setHasCalendar] = useState(false);
  const [calendarAuthUrl, setCalendarAuthUrl] = useState<string | null>(null);

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        const [metricsData, jobsData, callsData] = await Promise.all([
          getDashboardMetrics(), getTodaysBookings(), getCalls(5),
        ]);
        setMetrics(metricsData);
        setTodaysJobs(jobsData);
        setRecentCalls(callsData);
        // Check if business is live
        try {
          const { getProvisionStatus } = await import('@/lib/api');
          const status = await getProvisionStatus();
          const live = status.isLive || false;
          setIsLive(live);
          setAgentName(status.agentName || '');
          setAgentPhone(status.phoneNumber || '');
          if (live) {
            // Build pickup rules text
            const rules = (status as any).pickupRules || { afterHours: true, missedCalls: true };
            const parts: string[] = [];
            if (rules.afterHours) parts.push('after hours');
            if (rules.missedCalls) parts.push('after 4 rings');
            if (rules.alwaysOn) parts.push('on every call');
            setPickupRulesText(parts.join(' and '));
            // Plan info
            setSelectedPlan((status as any).selectedPlan || 'starter');
            setHasCalendar(!!status.checklist?.calendarConnected);
            setCalendarAuthUrl(status.calendarAuthUrl || null);
            // Calculate trial days remaining (7-day trial from createdAt)
            const liveSince = localStorage.getItem('agent_live_since');
            if (liveSince) {
              const daysSinceLive = Math.floor((Date.now() - new Date(liveSince).getTime()) / (1000 * 60 * 60 * 24));
              const daysLeft = Math.max(0, 7 - daysSinceLive);
              setTrialDaysLeft(daysLeft);
            }
            // Show banner for first 10 days
            const key = 'dashboard_live_visits';
            const visits = parseInt(localStorage.getItem(key) || '0') + 1;
            localStorage.setItem(key, String(visits));
            setShowLiveBanner(true); // Always show when live during trial
          }
        } catch { /* not provisioned yet */ }
      } catch (err) {
        console.error('Failed to fetch dashboard data:', err);
        setError('Failed to load dashboard data');
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  // Demo data for new accounts — shows what the dashboard looks like in action
  const tomorrow = new Date(); tomorrow.setDate(tomorrow.getDate() + 1);
  const dayAfter = new Date(); dayAfter.setDate(dayAfter.getDate() + 2);
  const nextWeek = new Date(); nextWeek.setDate(nextWeek.getDate() + 4);

  const demoJobs: Booking[] = [
    { id: 'demo-1', customer: { firstName: 'Test Caller' } as any, scheduledTime: '09:00', scheduledDate: tomorrow.toISOString(), serviceAddress: '12 Market St, Poughkeepsie', status: 'confirmed', stories: 2, propertyType: 'Residential' } as any,
    { id: 'demo-2', customer: { firstName: 'Test Caller' } as any, scheduledTime: '11:30', scheduledDate: tomorrow.toISOString(), serviceAddress: '45 Oak St, Newburgh', status: 'confirmed', stories: 1, propertyType: 'Residential' } as any,
    { id: 'demo-3', customer: { firstName: 'Test Caller' } as any, scheduledTime: '14:00', scheduledDate: dayAfter.toISOString(), serviceAddress: '8 River Rd, Kingston', status: 'confirmed', stories: 3, propertyType: 'Residential' } as any,
  ];
  const demoCalls: Call[] = [
    { id: 'demo-c1', customer: { firstName: 'Test Caller' } as any, startTime: new Date(Date.now() - 3600000).toISOString(), createdAt: new Date().toISOString(), status: 'completed', duration: 142, phoneNumber: '(555) 123-4567' } as any,
    { id: 'demo-c2', customer: { firstName: 'Test Caller' } as any, startTime: new Date(Date.now() - 7200000).toISOString(), createdAt: new Date().toISOString(), status: 'booked', duration: 98, phoneNumber: '(555) 234-5678' } as any,
    { id: 'demo-c3', customer: { firstName: 'Test Caller' } as any, startTime: new Date(Date.now() - 14400000).toISOString(), createdAt: new Date().toISOString(), status: 'completed', duration: 215, phoneNumber: '(555) 345-6789' } as any,
    { id: 'demo-c4', customer: { firstName: 'Test Caller' } as any, startTime: new Date(Date.now() - 28800000).toISOString(), createdAt: new Date().toISOString(), status: 'inquiry', duration: 67, phoneNumber: '(555) 456-7890' } as any,
  ];

  const isDemo = !isLive && (!metrics || (metrics.callsLast7Days === 0 && metrics.bookingsLast7Days === 0));
  const displayJobs = todaysJobs.length > 0 ? todaysJobs : (isDemo ? demoJobs : []);
  const displayCalls = recentCalls.length > 0 ? recentCalls : (isDemo ? demoCalls : []);

  const metricCards = [
    { label: 'Calls Answered', value: isDemo ? 23 : (metrics?.callsLast7Days ?? '-'), change: isDemo ? '78% booked a job' : (metrics ? `${metrics.bookingSuccessRate}% booked a job` : ''), icon: PhoneIcon },
    { label: 'Jobs Booked', value: isDemo ? 18 : (metrics?.bookingsLast7Days ?? '-'), change: '', icon: CalendarIcon },
    { label: 'Revenue Scheduled', value: isDemo ? '$4,250' : (metrics ? `$${metrics.revenueScheduled.toLocaleString()}` : '-'), change: '', icon: DollarIcon },
    { label: 'Happy Callers', value: isDemo ? '94%' : (metrics ? `${metrics.happyCallerPercent}%` : '-'), change: '', icon: TrendUpIcon },
  ];

  return (
    <div className="space-y-7">
      {/* Header */}
      <div>
        <h1 className="text-[22px] font-bold text-[#1a2e3b]">{isDemo && !loading ? 'Onboarding' : 'Dashboard'}</h1>
        <p className="text-[13px] text-[#94a7b8] mt-1">{isDemo && !loading ? 'Get your AI receptionist set up' : 'Last 7 days overview'}</p>
      </div>

      {/* Live agent banner — evolves over trial period */}
      {showLiveBanner && !loading && (() => {
        const planLabels: Record<string, string> = { starter: 'Starter — $89/mo', standard: 'Standard — $149/mo', business: 'Business — $299/mo' };
        const planLabel = planLabels[selectedPlan] || 'Starter — $89/mo';
        const trialExpired = trialDaysLeft !== null && trialDaysLeft <= 0;
        const trialUrgent = trialDaysLeft !== null && trialDaysLeft <= 2 && !trialExpired;

        if (trialExpired) {
          return (
            <div className="bg-[#fef2f2] rounded-2xl border border-[#fecaca] p-5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-[15px] font-bold text-[#991b1b]">Your 7-day trial has ended</p>
                  <p className="text-[13px] text-[#dc2626] mt-0.5">Add your payment details to keep {agentName} running. Your plan: {planLabel}.</p>
                </div>
                <a href="https://cal.com/lars-beurskens-g1aaqy/15min" target="_blank" rel="noopener noreferrer"
                  className="px-5 py-2.5 bg-[#e8930c] text-white text-[13px] font-bold rounded-xl no-underline hover:bg-[#d17f00] flex-shrink-0">
                  Set up billing →
                </a>
              </div>
            </div>
          );
        }

        return (
          <div className={`rounded-2xl border p-5 flex items-center justify-between ${trialUrgent ? 'bg-[#fef8f0] border-[#f0dcc0]' : 'bg-[#f0fdf4] border-[#bbf7d0]'}`}>
            <div className="flex items-center gap-3">
              <div className={`w-3 h-3 rounded-full animate-pulse ${trialUrgent ? 'bg-[#d97706]' : 'bg-[#22c55e]'}`} />
              <div>
                <p className="text-[15px] font-bold text-[#0f172a]">
                  {agentName} is live — picking up {pickupRulesText || 'your calls'}
                </p>
                <p className="text-[13px] text-[#64748b]">
                  {agentPhone}
                  {trialDaysLeft !== null && (
                    <span className={`ml-2 font-semibold ${trialUrgent ? 'text-[#d97706]' : 'text-[#059669]'}`}>
                      · {trialDaysLeft} day{trialDaysLeft !== 1 ? 's' : ''} left on free trial
                      {trialUrgent ? ' — add payment to continue' : ''}
                    </span>
                  )}
                </p>
              </div>
            </div>
            <button onClick={() => setShowLiveBanner(false)}
              className="text-[#94a7b8] hover:text-[#5a7184] bg-transparent border-none cursor-pointer text-lg px-2">×</button>
          </div>
        );
      })()}

      {/* Calendar not connected warning — only when live */}
      {isLive && !hasCalendar && !loading && (
        <div className="bg-[#fef8f0] rounded-xl border border-[#f0dcc0] p-4 flex items-center justify-between">
          <div className="flex items-start gap-3">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#d97706" strokeWidth="2" className="flex-shrink-0 mt-0.5"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
            <div>
              <p className="text-[13px] font-bold text-[#92640a]">{agentName} can&apos;t book appointments yet</p>
              <p className="text-[12px] text-[#a16207]">Without a calendar, {agentName} will collect customer details and text them to you instead of booking directly. Connect Google Calendar to enable live booking.</p>
            </div>
          </div>
          {calendarAuthUrl && (
            <a href={calendarAuthUrl} className="px-4 py-2 bg-[#e8930c] text-white text-[12px] font-bold rounded-lg no-underline hover:bg-[#d17f00] flex-shrink-0 whitespace-nowrap">
              Connect Calendar
            </a>
          )}
        </div>
      )}

      {error && (
        <div className="bg-[#fef2f2] text-[#991b1b] p-4 rounded-xl text-sm font-medium">{error}</div>
      )}

      {/* Setup wizard — shows for new accounts */}
      {isDemo && !loading && <SetupWizard />}

      {isDemo && !loading && (
        <div className="bg-[#fef8f0] border border-[#f0dcc0] rounded-xl px-4 py-3 flex items-center justify-between">
          <p className="text-[13px] text-[#92640a]">
            <span className="font-semibold">Sample data below</span> — this is what your dashboard will look like once your AI starts taking calls.
          </p>
        </div>
      )}

      {/* Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3.5">
        {metricCards.map((m) => {
          const Icon = m.icon;
          return (
            <div key={m.label} className="bg-white rounded-xl p-5 border border-[#e5e0da]">
              <div className="flex justify-between items-start mb-2.5">
                <span className="text-xs font-semibold text-[#5a7184] uppercase tracking-wide">{m.label}</span>
                <span className="text-[#b8c9d4]"><Icon size={18} /></span>
              </div>
              {loading ? (
                <div className="w-5 h-5 border-2 border-[#1a2e3b] border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <div className="text-[28px] font-bold text-[#1a2e3b]">{m.value}</div>
                  {m.change && <div className="text-xs text-[#059669] font-semibold mt-1">{m.change}</div>}
                </>
              )}
            </div>
          );
        })}
      </div>

      {/* Today's Jobs & Recent Calls */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Today's Jobs */}
        <div className="bg-white rounded-xl border border-[#e5e0da]">
          <div className="px-5 py-3.5 border-b border-[#e5e0da] flex justify-between items-center">
            <h2 className="text-sm font-bold text-[#1a2e3b]">Upcoming Jobs</h2>
            <span className="text-xs text-[#94a7b8]">{displayJobs.length} scheduled</span>
          </div>
          <div>
            {loading ? (
              <div className="p-8 text-center">
                <div className="w-5 h-5 border-2 border-[#1a2e3b] border-t-transparent rounded-full animate-spin mx-auto" />
              </div>
            ) : displayJobs.length > 0 ? (
              displayJobs.map((job, i) => (
                <div key={job.id} className={`px-5 py-3 flex justify-between items-center ${i < displayJobs.length - 1 ? 'border-b border-[#f0eeeb]' : ''}`}>
                  <div className="flex gap-3.5 items-center">
                    <div className="w-[90px]">
                      <span className="text-[13px] font-semibold text-[#1a2e3b] tabular-nums block">
                        {formatTime(job.scheduledTime)}
                      </span>
                      <span className="text-[11px] text-[#94a7b8]">{formatJobDate(job.scheduledDate)}</span>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-[#1a2e3b]">
                        {job.customer?.firstName || 'Customer'}
                      </p>
                      <p className="text-xs text-[#94a7b8]">{job.serviceAddress}</p>
                    </div>
                  </div>
                  <span className="text-[11px] font-semibold text-[#5a7184] bg-[#faf9f7] px-2.5 py-1 rounded">
                    {job.stories ? `${job.stories}-story` : job.propertyType || 'Residential'}
                  </span>
                </div>
              ))
            ) : (
              <div className="p-8 text-center text-sm text-[#94a7b8]">
                <p className="mb-1">No jobs scheduled yet</p>
                <p className="text-xs">Once your AI starts booking, today&apos;s jobs appear here</p>
              </div>
            )}
          </div>
        </div>

        {/* Recent Calls */}
        <div className="bg-white rounded-xl border border-[#e5e0da]">
          <div className="px-5 py-3.5 border-b border-[#e5e0da] flex justify-between items-center">
            <h2 className="text-sm font-bold text-[#1a2e3b]">Recent Calls</h2>
            <Link href="/dashboard/calls" className="text-xs text-[#2a4a5e] font-semibold no-underline hover:text-[#1a2e3b]">
              View all
            </Link>
          </div>
          <div>
            {loading ? (
              <div className="p-8 text-center">
                <div className="w-5 h-5 border-2 border-[#1a2e3b] border-t-transparent rounded-full animate-spin mx-auto" />
              </div>
            ) : displayCalls.length > 0 ? (
              displayCalls.map((call, i) => (
                <div key={call.id} className={`px-5 py-3 flex justify-between items-center ${i < displayCalls.length - 1 ? 'border-b border-[#f0eeeb]' : ''}`}>
                  <div>
                    <p className="text-sm font-medium text-[#1a2e3b]">
                      {call.customer ? call.customer.firstName : call.phoneNumber}
                    </p>
                    <p className="text-xs text-[#94a7b8]">{formatCallTime(call.startTime || call.createdAt)}</p>
                  </div>
                  <div className="inline-flex items-center text-xs font-medium text-[#1a2e3b] bg-[#faf9f7] px-2.5 py-1 rounded">
                    <StatusDot status={call.status} />
                    {call.status.charAt(0).toUpperCase() + call.status.slice(1)}
                  </div>
                </div>
              ))
            ) : (
              <div className="p-8 text-center text-sm text-[#94a7b8]">
                <p className="mb-1">No calls yet</p>
                <p className="text-xs">Your AI&apos;s call history will show up here</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
        <Link href="/dashboard/calls"
          className="flex items-center justify-between p-5 bg-white rounded-xl border border-[#e5e0da] no-underline hover:bg-[#faf9f7] transition-colors group">
          <div className="flex items-center gap-3.5">
            <span className="text-[#5a7184]"><PhoneIcon size={22} /></span>
            <span className="text-base font-semibold text-[#1a2e3b]">View All Calls</span>
          </div>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#94a7b8" strokeWidth="2" className="group-hover:stroke-[#1a2e3b]">
            <polyline points="9 18 15 12 9 6"/>
          </svg>
        </Link>
        <Link href="/dashboard/bookings"
          className="flex items-center justify-between p-5 bg-white rounded-xl border border-[#e5e0da] no-underline hover:bg-[#faf9f7] transition-colors group">
          <div className="flex items-center gap-3.5">
            <span className="text-[#5a7184]"><CalendarIcon size={22} /></span>
            <span className="text-base font-semibold text-[#1a2e3b]">Full Schedule</span>
          </div>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#94a7b8" strokeWidth="2" className="group-hover:stroke-[#1a2e3b]">
            <polyline points="9 18 15 12 9 6"/>
          </svg>
        </Link>
        <Link href="/dashboard/invoices"
          className="flex items-center justify-between p-5 bg-white rounded-xl border border-[#e5e0da] no-underline hover:bg-[#faf9f7] transition-colors group">
          <div className="flex items-center gap-3.5">
            <span className="text-[#5a7184]"><DollarIcon size={22} /></span>
            <span className="text-base font-semibold text-[#1a2e3b]">Invoices</span>
          </div>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#94a7b8" strokeWidth="2" className="group-hover:stroke-[#1a2e3b]">
            <polyline points="9 18 15 12 9 6"/>
          </svg>
        </Link>
      </div>
    </div>
  );
}
