'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { getDashboardMetrics, getTodaysBookings, getCalls, DashboardMetrics, Booking, Call } from '@/lib/api';
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

export default function DashboardPage() {
  const [metrics, setMetrics] = useState<DashboardMetrics | null>(null);
  const [todaysJobs, setTodaysJobs] = useState<Booking[]>([]);
  const [recentCalls, setRecentCalls] = useState<Call[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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
      } catch (err) {
        console.error('Failed to fetch dashboard data:', err);
        setError('Failed to load dashboard data');
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  const metricCards = [
    { label: 'Calls Answered', value: metrics?.callsLast7Days ?? '-', change: metrics ? `${metrics.bookingSuccessRate}% success` : '', icon: PhoneIcon },
    { label: 'Jobs Booked', value: metrics?.bookingsLast7Days ?? '-', change: '', icon: CalendarIcon },
    { label: 'Revenue Scheduled', value: metrics ? `$${metrics.revenueScheduled.toLocaleString()}` : '-', change: '', icon: DollarIcon },
    { label: 'Happy Callers', value: metrics ? `${metrics.happyCallerPercent}%` : '-', change: '', icon: TrendUpIcon },
  ];

  return (
    <div className="space-y-7">
      {/* Header */}
      <div>
        <h1 className="text-[22px] font-bold text-[#1a2e3b]">Dashboard</h1>
        <p className="text-[13px] text-[#94a7b8] mt-1">Last 7 days overview</p>
      </div>

      {error && (
        <div className="bg-[#fef2f2] text-[#991b1b] p-4 rounded-xl text-sm font-medium">{error}</div>
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
            <h2 className="text-sm font-bold text-[#1a2e3b]">Today&apos;s Jobs</h2>
            <span className="text-xs text-[#94a7b8]">{todaysJobs.length} scheduled</span>
          </div>
          <div>
            {loading ? (
              <div className="p-8 text-center">
                <div className="w-5 h-5 border-2 border-[#1a2e3b] border-t-transparent rounded-full animate-spin mx-auto" />
              </div>
            ) : todaysJobs.length > 0 ? (
              todaysJobs.map((job, i) => (
                <div key={job.id} className={`px-5 py-3 flex justify-between items-center ${i < todaysJobs.length - 1 ? 'border-b border-[#f0eeeb]' : ''}`}>
                  <div className="flex gap-3.5 items-center">
                    <span className="text-[13px] font-semibold text-[#2a4a5e] w-[72px] tabular-nums">
                      {formatTime(job.scheduledTime)}
                    </span>
                    <div>
                      <p className="text-sm font-medium text-[#1a2e3b]">
                        {job.customer?.firstName} {job.customer?.lastName}
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
              <div className="p-8 text-center text-sm text-[#94a7b8]">No jobs scheduled for today</div>
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
            ) : recentCalls.length > 0 ? (
              recentCalls.map((call, i) => (
                <div key={call.id} className={`px-5 py-3 flex justify-between items-center ${i < recentCalls.length - 1 ? 'border-b border-[#f0eeeb]' : ''}`}>
                  <div>
                    <p className="text-sm font-medium text-[#1a2e3b]">
                      {call.customer ? `${call.customer.firstName} ${call.customer.lastName}` : call.phoneNumber}
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
              <div className="p-8 text-center text-sm text-[#94a7b8]">No recent calls</div>
            )}
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
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
      </div>
    </div>
  );
}
