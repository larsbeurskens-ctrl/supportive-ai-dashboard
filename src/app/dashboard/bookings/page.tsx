'use client';

import { MapPin, Clock, DollarSign } from 'lucide-react';
import { useState, useEffect } from 'react';
import { getBookings, Booking } from '@/lib/api';

function StatusBadge({ status }: { status: string }) {
  const config: Record<string, { bg: string; text: string; label: string }> = {
    confirmed: { bg: 'bg-[#eef9f0]', text: 'text-[#059669]', label: 'Confirmed' },
    pending: { bg: 'bg-[#fef8f0]', text: 'text-[#d97706]', label: 'Pending' },
    cancelled: { bg: 'bg-[#fef2f2]', text: 'text-[#dc2626]', label: 'Cancelled' },
    completed: { bg: 'bg-[#f4f3f1]', text: 'text-[#5a7184]', label: 'Completed' },
  };
  const c = config[status] || { bg: 'bg-[#f4f3f1]', text: 'text-[#5a7184]', label: status };
  return (
    <span className={`px-2.5 py-1 rounded-full text-[12px] font-semibold capitalize ${c.bg} ${c.text}`}>
      {c.label}
    </span>
  );
}

function formatTime(timeStr: string): string {
  if (!timeStr) return '';
  const [hours, minutes] = timeStr.split(':').map(Number);
  const ampm = hours >= 12 ? 'PM' : 'AM';
  const hour12 = hours % 12 || 12;
  return `${hour12}:${minutes.toString().padStart(2, '0')} ${ampm}`;
}

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
}

export default function BookingsPage() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchBookings() {
      try {
        setLoading(true);
        const data = await getBookings(50);
        setBookings(data);
      } catch (err) {
        console.error('Failed to fetch bookings:', err);
        setError('Failed to load bookings');
      } finally { setLoading(false); }
    }
    fetchBookings();
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-[22px] font-bold text-[#1a2e3b]">Bookings</h1>
        <p className="text-[13px] text-[#94a7b8] mt-1">Manage your scheduled appointments</p>
      </div>
      {error && <div className="bg-[#fef2f2] text-[#991b1b] p-4 rounded-xl text-sm">{error}</div>}
      <div className="bg-white rounded-xl border border-[#e5e0da]">
        <div className="px-5 py-3.5 border-b border-[#e5e0da] flex items-center gap-3">
          <select className="px-3 py-2 border border-[#e5e0da] rounded-lg text-[13px] text-[#1a2e3b] bg-white">
            <option>All Status</option><option>Confirmed</option><option>Pending</option><option>Completed</option>
          </select>
          <select className="px-3 py-2 border border-[#e5e0da] rounded-lg text-[13px] text-[#1a2e3b] bg-white">
            <option>This Week</option><option>Next Week</option><option>This Month</option>
          </select>
        </div>
        <div className="divide-y divide-[#f0eeeb]">
          {loading ? (
            <div className="p-8 text-center">
              <div className="w-5 h-5 border-2 border-[#1a2e3b] border-t-transparent rounded-full animate-spin mx-auto" />
            </div>
          ) : bookings.length > 0 ? (
            bookings.map((booking) => (
              <div key={booking.id} className="px-5 py-4 hover:bg-[#faf9f7] transition-colors">
                <div className="flex items-start justify-between">
                  <div className="space-y-1.5">
                    <div className="flex items-center gap-3">
                      <span className="text-[15px] font-bold text-[#1a2e3b]">{formatTime(booking.scheduledTime)}</span>
                      <span className="text-[13px] text-[#94a7b8]">{formatDate(booking.scheduledDate)}</span>
                      <StatusBadge status={booking.status} />
                    </div>
                    <h3 className="text-[15px] font-semibold text-[#1a2e3b]">
                      {booking.customer?.firstName || 'Customer'}
                    </h3>
                    <div className="flex items-center gap-5 text-[13px] text-[#5a7184]">
                      <span className="flex items-center gap-1">
                        <MapPin size={14} className="text-[#94a7b8]" />
                        {booking.serviceAddress}{booking.serviceCity ? `, ${booking.serviceCity}` : ''}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock size={14} className="text-[#94a7b8]" />
                        {booking.estimatedDuration} min
                      </span>
                      {booking.quotedPrice && (
                        <span className="flex items-center gap-1">
                          <DollarSign size={14} className="text-[#94a7b8]" />
                          ${booking.quotedPrice}
                        </span>
                      )}
                    </div>
                  </div>
                  <span className="text-[11px] font-semibold text-[#5a7184] bg-[#faf9f7] px-2.5 py-1 rounded">
                    {booking.stories ? `${booking.stories}-story` : booking.propertyType || 'Residential'}
                  </span>
                </div>
              </div>
            ))
          ) : (
            <div className="p-8 text-center text-[13px] text-[#94a7b8]">No bookings yet</div>
          )}
        </div>
      </div>
    </div>
  );
}
