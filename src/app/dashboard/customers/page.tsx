'use client';

import { User, Phone as PhoneIcon, Loader2 } from 'lucide-react';
import { useState, useEffect } from 'react';
import { getCustomers, Customer } from '@/lib/api';

export default function CustomersPage() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchCustomers() {
      try {
        setLoading(true);
        const data = await getCustomers(50);
        setCustomers(data);
      } catch (err) {
        console.error('Failed to fetch customers:', err);
        setError('Failed to load customers');
      } finally {
        setLoading(false);
      }
    }
    fetchCustomers();
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Customers</h1>
        <p className="text-gray-500 mt-1">View customer history and details</p>
      </div>

      {error && (
        <div className="bg-red-50 text-red-700 p-4 rounded-xl">{error}</div>
      )}

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100">
        <div className="divide-y divide-gray-100">
          {loading ? (
            <div className="p-8 text-center">
              <Loader2 className="animate-spin text-gray-400 mx-auto" size={32} />
            </div>
          ) : customers.length > 0 ? (
            customers.map((customer) => (
              <div key={customer.id} className="p-4 hover:bg-gray-50 transition-colors">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                      <User size={24} className="text-blue-600" />
                    </div>
                    <div>
                      <h3 className="text-lg font-medium text-gray-900">
                        {customer.firstName} {customer.lastName}
                      </h3>
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
                      <p className="text-2xl font-bold text-gray-900">
                        {customer._count?.bookings || customer.totalBookings || 0}
                      </p>
                      <p className="text-sm text-gray-500">Bookings</p>
                    </div>
                    <div className="text-center">
                      <p className="text-2xl font-bold text-green-600">
                        ${customer.lifetimeValue || 0}
                      </p>
                      <p className="text-sm text-gray-500">Total Spent</p>
                    </div>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="p-8 text-center text-gray-500">No customers found</div>
          )}
        </div>
      </div>
    </div>
  );
}
