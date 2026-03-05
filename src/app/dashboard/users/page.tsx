'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';

const ADMIN_EMAIL = 'larsbeurskens@gmail.com';

interface User {
  id: string;
  email: string;
  name: string | null;
  emailVerified: string | null;
  createdAt: string;
  businessId: string | null;
  role: string;
}

export default function UsersPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (status === 'authenticated' && session?.user?.email !== ADMIN_EMAIL) {
      router.replace('/dashboard');
    }
  }, [status, session, router]);

  useEffect(() => {
    fetch('/api/admin/users')
      .then(r => r.ok ? r.json() : [])
      .then(setUsers)
      .finally(() => setLoading(false));
  }, []);

  function timeAgo(date: string) {
    const diff = Date.now() - new Date(date).getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 60) return `${mins}m ago`;
    const hrs = Math.floor(mins / 60);
    if (hrs < 24) return `${hrs}h ago`;
    const days = Math.floor(hrs / 24);
    return `${days}d ago`;
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="w-6 h-6 border-2 border-[#1a2e3b] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const verified = users.filter(u => u.emailVerified);
  const unverified = users.filter(u => !u.emailVerified);

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-[22px] font-bold text-[#1a2e3b]">Signups</h1>
          <p className="text-[13px] text-[#94a7b8] mt-0.5">
            {users.length} total · {verified.length} verified · {users.filter(u => u.businessId).length} with business
          </p>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-[#e5e0da] overflow-hidden">
        <table className="w-full text-left">
          <thead>
            <tr className="border-b border-[#e5e0da] bg-[#faf9f7]">
              <th className="px-4 py-3 text-[12px] font-semibold text-[#5a7184] uppercase tracking-wide">Email</th>
              <th className="px-4 py-3 text-[12px] font-semibold text-[#5a7184] uppercase tracking-wide">Status</th>
              <th className="px-4 py-3 text-[12px] font-semibold text-[#5a7184] uppercase tracking-wide">Signed up</th>
            </tr>
          </thead>
          <tbody>
            {users.map(user => (
              <tr key={user.id} className="border-b border-[#f0eeeb] last:border-0 hover:bg-[#faf9f7]">
                <td className="px-4 py-3">
                  <span className="text-[14px] font-medium text-[#1a2e3b]">{user.email}</span>
                  {user.name && <span className="text-[12px] text-[#94a7b8] ml-2">{user.name}</span>}
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    {user.emailVerified ? (
                      <span className="inline-flex items-center gap-1 text-[12px] font-semibold text-[#059669] bg-[#eef9f0] px-2 py-0.5 rounded-full">
                        <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><polyline points="20 6 9 17 4 12"/></svg>
                        Verified
                      </span>
                    ) : (
                      <span className="text-[12px] font-semibold text-[#94a7b8] bg-[#f5f4f2] px-2 py-0.5 rounded-full">Unverified</span>
                    )}
                    {user.businessId && (
                      <span className="text-[12px] font-semibold text-[#3b82f6] bg-[#eff6ff] px-2 py-0.5 rounded-full">Has business</span>
                    )}
                  </div>
                </td>
                <td className="px-4 py-3 text-[13px] text-[#5a7184]">{timeAgo(user.createdAt)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
