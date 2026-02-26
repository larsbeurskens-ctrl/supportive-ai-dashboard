'use client';

import { User, Phone as PhoneIcon } from 'lucide-react';
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
      } finally { setLoading(false); }
    }
    fetchCustomers();
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-[22px] font-bold text-[#1a2e3b]">Customers</h1>
        <p className="text-[13px] text-[#94a7b8] mt-1">View customer history and details</p>
      </div>
      {error && <div className="bg-[#fef2f2] text-[#991b1b] p-4 rounded-xl text-sm">{error}</div>}
      <div className="bg-white rounded-xl border border-[#e5e0da]">
        <div className="divide-y divide-[#f0eeeb]">
          {loading ? (
            <div className="p-8 text-center">
              <div className="w-5 h-5 border-2 border-[#1a2e3b] border-t-transparent rounded-full animate-spin mx-auto" />
            </div>
          ) : customers.length > 0 ? (
            customers.map((customer) => (
              <div key={customer.id} className="px-5 py-4 hover:bg-[#faf9f7] transition-colors">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3.5">
                    <div className="w-10 h-10 bg-[#f4f3f1] rounded-full flex items-center justify-center">
                      <User size={18} className="text-[#5a7184]" />
                    </div>
                    <div>
                      <h3 className="text-[14px] font-semibold text-[#1a2e3b]">
                        {customer.firstName}
                      </h3>
                      <div className="flex items-center gap-3 text-[12px] text-[#94a7b8]">
                        <span className="flex items-center gap-1">
                          <PhoneIcon size={12} />
                          {customer.phone}
                        </span>
                        {customer.email && <span>{customer.email}</span>}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-6">
                    <div className="text-center">
                      <p className="text-[18px] font-bold text-[#1a2e3b]">
                        {customer._count?.bookings || customer.totalBookings || 0}
                      </p>
                      <p className="text-[11px] text-[#94a7b8]">Bookings</p>
                    </div>
                    <div className="text-center">
                      <p className="text-[18px] font-bold text-[#059669]">
                        ${customer.lifetimeValue || 0}
                      </p>
                      <p className="text-[11px] text-[#94a7b8]">Spent</p>
                    </div>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="p-8 text-center text-[13px] text-[#94a7b8]">No customers yet</div>
          )}
        </div>
      </div>
    </div>
  );
}
