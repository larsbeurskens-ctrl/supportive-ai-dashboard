'use client';

import { User, Phone as PhoneIcon, Calendar, DollarSign } from 'lucide-react';

// Mock data
const customers = [
  {
    id: '1',
    name: 'John Smith',
    phone: '+1 845-555-1234',
    email: 'john@email.com',
    totalBookings: 3,
    totalSpent: 750,
    lastBooking: '2026-02-07',
  },
  {
    id: '2',
    name: 'Mary Jones',
    phone: '+1 845-555-5678',
    email: 'mary@email.com',
    totalBookings: 1,
    totalSpent: 150,
    lastBooking: '2026-02-07',
  },
  {
    id: '3',
    name: 'Bob Wilson',
    phone: '+1 845-555-9012',
    email: null,
    totalBookings: 5,
    totalSpent: 1200,
    lastBooking: '2026-02-10',
  },
];

export default function CustomersPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Customers</h1>
        <p className="text-gray-500 mt-1">View customer history and details</p>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100">
        <div className="divide-y divide-gray-100">
          {customers.map((customer) => (
            <div key={customer.id} className="p-4 hover:bg-gray-50 transition-colors">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                    <User size={24} className="text-blue-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-medium text-gray-900">{customer.name}</h3>
                    <div className="flex items-center gap-4 text-sm text-gray-500">
                      <span className="flex items-center gap-1">
                        <PhoneIcon size={14} />
                        {customer.phone}
                      </span>
                      {customer.email && <span>{customer.email}</span>}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-6 text-gray-600">
                  <div className="text-center">
                    <p className="text-2xl font-bold text-gray-900">{customer.totalBookings}</p>
                    <p className="text-sm text-gray-500">Bookings</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-green-600">${customer.totalSpent}</p>
                    <p className="text-sm text-gray-500">Total Spent</p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
