'use client';

import { Phone, Calendar, DollarSign, Smile, ChevronRight, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { getDashboardMetrics, getTodaysBookings, getCalls, DashboardMetrics, Booking, Call } from '@/lib/api';

function MetricCard({ 
  title, 
  value, 
  subValue,
  icon: Icon, 
  color,
  loading
}: { 
  title: string; 
  value: string | number; 
  subValue?: string;
  icon: React.ElementType; 
  color: string;
  loading?: boolean;
}) {
  const colorClasses: Record<string, string> = {
    blue: 'bg-blue-50 text-blue-600',
    green: 'bg-green-50 text-green-600',
    yellow: 'bg-yellow-50 text-yellow-600',
    purple: 'bg-purple-50 text-purple-600',
  };

  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
      <div className="flex items-center gap-4">
        <div className={`p-3 rounded-xl ${colorClasses[color]}`}>
          <Icon size={28} />
        </div>
        <div>
          <p className="text-gray-500 text-sm font-medium">{title}</p>
          <div className="flex items-baseline gap-2">
            {loading ? (
              <Loader2 className="animate-spin text-gray-400" size={24} />
            ) : (
              <>
                <p className="text-3xl font-bold text-gray-900">{value}</p>
                {subValue && (
                  <span className="text-sm text-gray-500">{subValue}</span>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function OutcomeBadge({ outcome }: { outcome: string }) {
  const styles: Record<string, string> = {
    booked: 'bg-green-100 text-green-700',
    completed: 'bg-green-100 text-green-700',
    inquiry: 'bg-yellow-100 text-yellow-700',
    missed: 'bg-red-100 text-red-700',
  };
  const labels: Record<string, string> = {
    booked: '✅ Booked',
    completed: '✅ Done',
    inquiry: '❓ Inquiry',
    missed: '❌ Missed',
  };
  return (
    <span className={`px-3 py-1 rounded-full text-sm font-medium ${styles[outcome] || 'bg-gray-100 text-gray-700'}`}>
      {labels[outcome] || outcome}
    </span>
  );
}

function SentimentEmoji({ sentiment }: { sentiment?: string }) {
  const emojis: Record<string, string> = {
    positive: '😊',
    neutral: '😐',
    negative: '😞',
  };
  return <span className="text-2xl">{sentiment ? emojis[sentiment] || '😐' : '😐'}</span>;
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
          getDashboardMetrics(),
          getTodaysBookings(),
          getCalls(5)
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

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-500 mt-1">Last 7 days overview</p>
      </div>

      {error && (
        <div className="bg-red-50 text-red-700 p-4 rounded-xl">
          {error}
        </div>
      )}

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          title="Calls Answered"
          value={metrics?.callsLast7Days ?? '-'}
          icon={Phone}
          color="blue"
          loading={loading}
        />
        <MetricCard
          title="Bookings Made"
          value={metrics?.bookingsLast7Days ?? '-'}
          subValue={metrics ? `${metrics.bookingSuccessRate}% success` : undefined}
          icon={Calendar}
          color="green"
          loading={loading}
        />
        <MetricCard
          title="Revenue Scheduled"
          value={metrics ? `$${metrics.revenueScheduled.toLocaleString()}` : '-'}
          icon={DollarSign}
          color="yellow"
          loading={loading}
        />
        <MetricCard
          title="Happy Callers"
          value={metrics ? `${metrics.happyCallerPercent}%` : '-'}
          icon={Smile}
          color="purple"
          loading={loading}
        />
      </div>

      {/* Today's Jobs & Recent Calls */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Today's Jobs */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100">
          <div className="p-6 border-b border-gray-100">
            <h2 className="text-xl font-bold text-gray-900">Today's Jobs</h2>
          </div>
          <div className="divide-y divide-gray-100">
            {loading ? (
              <div className="p-8 text-center">
                <Loader2 className="animate-spin text-gray-400 mx-auto" size={32} />
              </div>
            ) : todaysJobs.length > 0 ? (
              todaysJobs.map((job) => (
                <div key={job.id} className="p-4 hover:bg-gray-50 transition-colors">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="text-lg font-semibold text-blue-600 w-24">
                        {formatTime(job.scheduledTime)}
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">
                          {job.customer?.firstName} {job.customer?.lastName}
                        </p>
                        <p className="text-sm text-gray-500">{job.serviceAddress}</p>
                      </div>
                    </div>
                    <span className="px-3 py-1 bg-gray-100 rounded-full text-sm text-gray-600">
                      {job.stories ? `${job.stories}-story` : job.propertyType || 'Residential'}
                    </span>
                  </div>
                </div>
              ))
            ) : (
              <div className="p-8 text-center text-gray-500">
                No jobs scheduled for today
              </div>
            )}
          </div>
        </div>

        {/* Recent Calls */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100">
          <div className="p-6 border-b border-gray-100">
            <h2 className="text-xl font-bold text-gray-900">Recent Calls</h2>
          </div>
          <div className="divide-y divide-gray-100">
            {loading ? (
              <div className="p-8 text-center">
                <Loader2 className="animate-spin text-gray-400 mx-auto" size={32} />
              </div>
            ) : recentCalls.length > 0 ? (
              recentCalls.map((call) => (
                <div key={call.id} className="p-4 hover:bg-gray-50 transition-colors">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-500">{formatCallTime(call.startTime || call.createdAt)}</p>
                      <p className="font-medium text-gray-900">
                        {call.customer ? `${call.customer.firstName} ${call.customer.lastName}` : call.phoneNumber}
                      </p>
                    </div>
                    <div className="flex items-center gap-3">
                      <OutcomeBadge outcome={call.status} />
                      <SentimentEmoji sentiment={call.sentiment} />
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="p-8 text-center text-gray-500">
                No recent calls
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Link
          href="/dashboard/calls"
          className="flex items-center justify-between p-6 bg-white rounded-2xl shadow-sm border border-gray-100 hover:bg-gray-50 transition-colors group"
        >
          <div className="flex items-center gap-4">
            <div className="p-3 bg-blue-50 rounded-xl text-blue-600">
              <Phone size={28} />
            </div>
            <span className="text-xl font-semibold text-gray-900">View All Calls</span>
          </div>
          <ChevronRight size={24} className="text-gray-400 group-hover:text-gray-600" />
        </Link>

        <Link
          href="/dashboard/bookings"
          className="flex items-center justify-between p-6 bg-white rounded-2xl shadow-sm border border-gray-100 hover:bg-gray-50 transition-colors group"
        >
          <div className="flex items-center gap-4">
            <div className="p-3 bg-green-50 rounded-xl text-green-600">
              <Calendar size={28} />
            </div>
            <span className="text-xl font-semibold text-gray-900">Full Schedule</span>
          </div>
          <ChevronRight size={24} className="text-gray-400 group-hover:text-gray-600" />
        </Link>
      </div>
    </div>
  );
}
