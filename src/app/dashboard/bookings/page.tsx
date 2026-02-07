'use client';

import { Calendar, MapPin, Clock, DollarSign } from 'lucide-react';

// Mock data
const bookings = [
  {
    id: '1',
    date: '2026-02-07',
    time: '9:00 AM',
    customer: 'John Smith',
    phone: '+1 845-555-1234',
    address: '123 Main St, Poughkeepsie',
    type: 'Window Cleaning',
    stories: '2-story',
    duration: 120,
    price: 250,
    status: 'confirmed',
  },
  {
    id: '2',
    date: '2026-02-07',
    time: '1:00 PM',
    customer: 'Mary Jones',
    phone: '+1 845-555-5678',
    address: '456 Oak Ave, Beacon',
    type: 'Window Cleaning',
    stories: '1-story',
    duration: 90,
    price: 150,
    status: 'confirmed',
  },
  {
    id: '3',
    date: '2026-02-10',
    time: '10:00 AM',
    customer: 'Bob Wilson',
    phone: '+1 845-555-9012',
    address: '789 Elm St, Fishkill',
    type: 'Window Cleaning',
    stories: '3-story',
    duration: 180,
    price: 400,
    status: 'confirmed',
  },
];

function StatusBadge({ status }: { status: string }) {
  const styles: Record<string, string> = {
    confirmed: 'bg-green-100 text-green-700',
    pending: 'bg-yellow-100 text-yellow-700',
    cancelled: 'bg-red-100 text-red-700',
    completed: 'bg-gray-100 text-gray-700',
  };
  return (
    <span className={`px-3 py-1 rounded-full text-sm font-medium capitalize ${styles[status]}`}>
      {status}
    </span>
  );
}

export default function BookingsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Bookings</h1>
        <p className="text-gray-500 mt-1">Manage your scheduled appointments</p>
      </div>

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
          {bookings.map((booking) => (
            <div key={booking.id} className="p-4 hover:bg-gray-50 transition-colors">
              <div className="flex items-start justify-between">
                <div className="space-y-2">
                  <div className="flex items-center gap-4">
                    <span className="text-lg font-semibold text-blue-600">{booking.time}</span>
                    <span className="text-gray-500">{booking.date}</span>
                    <StatusBadge status={booking.status} />
                  </div>
                  <h3 className="text-xl font-medium text-gray-900">{booking.customer}</h3>
                  <div className="flex items-center gap-6 text-gray-600">
                    <span className="flex items-center gap-1">
                      <MapPin size={16} />
                      {booking.address}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock size={16} />
                      {booking.duration} min
                    </span>
                    <span className="flex items-center gap-1">
                      <DollarSign size={16} />
                      ${booking.price}
                    </span>
                  </div>
                </div>
                <div className="text-right">
                  <span className="px-3 py-1 bg-gray-100 rounded-full text-sm text-gray-600">
                    {booking.stories}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
