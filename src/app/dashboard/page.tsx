'use client';

import { Phone, Calendar, DollarSign, Smile, ChevronRight } from 'lucide-react';
import Link from 'next/link';

// Mock data - will be replaced with real API calls
const metrics = {
  callsLast7Days: 23,
  bookingsLast7Days: 18,
  bookingSuccessRate: 78,
  revenueScheduled: 4250,
  happyCallerPercent: 94,
};

const todaysJobs = [
  { id: '1', time: '9:00 AM', customer: 'John Smith', address: '123 Main St', type: '2-story' },
  { id: '2', time: '1:00 PM', customer: 'Mary Jones', address: '456 Oak Ave', type: '1-story' },
];

const recentCalls = [
  { id: '1', time: 'Today 8:23am', phone: '+1 845-555-1234', outcome: 'booked', sentiment: 'positive' },
  { id: '2', time: 'Today 7:45am', phone: '+1 845-555-9876', outcome: 'inquiry', sentiment: 'neutral' },
  { id: '3', time: 'Yesterday', phone: '+1 845-555-4567', outcome: 'booked', sentiment: 'positive' },
];

function MetricCard({ 
  title, 
  value, 
  subValue,
  icon: Icon, 
  color 
}: { 
  title: string; 
  value: string | number; 
  subValue?: string;
  icon: React.ElementType; 
  color: string;
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
            <p className="text-3xl font-bold text-gray-900">{value}</p>
            {subValue && (
              <span className="text-sm text-gray-500">{subValue}</span>
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
    inquiry: 'bg-yellow-100 text-yellow-700',
    missed: 'bg-red-100 text-red-700',
  };
  const labels: Record<string, string> = {
    booked: '✅ Booked',
    inquiry: '❓ Inquiry',
    missed: '❌ Missed',
  };
  return (
    <span className={`px-3 py-1 rounded-full text-sm font-medium ${styles[outcome]}`}>
      {labels[outcome]}
    </span>
  );
}

function SentimentEmoji({ sentiment }: { sentiment: string }) {
  const emojis: Record<string, string> = {
    positive: '😊',
    neutral: '😐',
    negative: '😞',
  };
  return <span className="text-2xl">{emojis[sentiment]}</span>;
}

export default function DashboardPage() {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-500 mt-1">Last 7 days overview</p>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          title="Calls Answered"
          value={metrics.callsLast7Days}
          icon={Phone}
          color="blue"
        />
        <MetricCard
          title="Bookings Made"
          value={metrics.bookingsLast7Days}
          subValue={`${metrics.bookingSuccessRate}% success`}
          icon={Calendar}
          color="green"
        />
        <MetricCard
          title="Revenue Scheduled"
          value={`$${metrics.revenueScheduled.toLocaleString()}`}
          icon={DollarSign}
          color="yellow"
        />
        <MetricCard
          title="Happy Callers"
          value={`${metrics.happyCallerPercent}%`}
          icon={Smile}
          color="purple"
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
            {todaysJobs.length > 0 ? (
              todaysJobs.map((job) => (
                <div key={job.id} className="p-4 hover:bg-gray-50 transition-colors">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="text-lg font-semibold text-blue-600 w-24">
                        {job.time}
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{job.customer}</p>
                        <p className="text-sm text-gray-500">{job.address}</p>
                      </div>
                    </div>
                    <span className="px-3 py-1 bg-gray-100 rounded-full text-sm text-gray-600">
                      {job.type}
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
            {recentCalls.map((call) => (
              <div key={call.id} className="p-4 hover:bg-gray-50 transition-colors">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-500">{call.time}</p>
                    <p className="font-medium text-gray-900">{call.phone}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <OutcomeBadge outcome={call.outcome} />
                    <SentimentEmoji sentiment={call.sentiment} />
                  </div>
                </div>
              </div>
            ))}
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
