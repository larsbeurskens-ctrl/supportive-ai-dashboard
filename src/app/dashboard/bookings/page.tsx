'use client';

import { MapPin, Clock, DollarSign, Loader2 } from 'lucide-react';
import { useState, useEffect } from 'react';
import { getBookings, Booking } from '@/lib/api';

function StatusBadge({ status }: { status: string }) {
  const styles: Record<string, string> = {
    confirmed: 'bg-green-100 text-green-700',
    pending: 'bg-yellow-100 text-yellow-700',
    cancelled: 'bg-red-100 text-red-700',
    completed: 'bg-gray-100 text-gray-700',
  };
  return (
    <span className={`px-3 py-1 rounded-full text-sm font-medium capitalize ${styles[status] || 'bg-gray-100 text-gray-700'}`}>
      {status}
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
  return new Date(dateStr).toLocaleDateString('en-US', { 
    weekday: 'short',
    month: 'short', 
    day: 'numeric'
  });
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
      } finally {
        setLoading(false);
      }
    }
    fetchBookings();
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Bookings</h1>
        <p className="text-gray-500 mt-1">Manage your scheduled appointments</p>
      </div>

      {error && (
        <div className="bg-red-50 text-red-700 p-4 rounded-xl">{error}</div>
      )}

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100">
        <div className="p-4 border-b border-gray-100 flex items-center gap-4">
          <select className="px-4 py-2 border border-gray-200 rounded-lg text-gray-700">
            <option>All Status</option>
            <option>Confirmed</option>
            <option>Pending</option>
            <option>Completed</option>
          </select>
          <select className="px-4 py-2 border border-gray-200 rounded-lg text-gray-700">
            <option>This Week</option>
            <option>Next Week</option>
            <option>This Month</option>
          </select>
        </div>
        
        <div className="divide-y divide-gray-100">
          {loading ? (
            <div className="p-8 text-center">
              <Loader2 className="animate-spin text-gray-400 mx-auto" size={32} />
            </div>
          ) : bookings.length > 0 ? (
            bookings.map((booking) => (
              <div key={booking.id} className="p-4 hover:bg-gray-50 transition-colors">
                <div className="flex items-start justify-between">
                  <div className="space-y-2">
                    <div className="flex items-center gap-4">
                      <span className="text-lg font-semibold text-blue-600">{formatTime(booking.scheduledTime)}</span>
                      <span className="text-gray-500">{formatDate(booking.scheduledDate)}</span>
                      <StatusBadge status={booking.status} />
                    </div>
                    <h3 className="text-xl font-medium text-gray-900">
                      {booking.customer?.firstName} {booking.customer?.lastName}
                    </h3>
                    <div className="flex items-center gap-6 text-gray-600">
                      <span className="flex items-center gap-1">
                        <MapPin size={16} />
                        {booking.serviceAddress}, {booking.serviceCity}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock size={16} />
                        {booking.estimatedDuration} min
                      </span>
                      {booking.quotedPrice && (
                        <span className="flex items-center gap-1">
                          <DollarSign size={16} />
                          ${booking.quotedPrice}
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="px-3 py-1 bg-gray-100 rounded-full text-sm text-gray-600">
                      {booking.stories ? `${booking.stories}-story` : booking.propertyType || 'Residential'}
                    </span>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="p-8 text-center text-gray-500">No bookings found</div>
          )}
        </div>
      </div>
    </div>
  );
}
