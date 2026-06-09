'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { getAdminBusinesses, setBusinessId, AdminBusiness } from '@/lib/api';
import { isAdminEmail } from '@/lib/admin';

export function BusinessSwitcher() {
  const { data: session } = useSession();
  const email = session?.user?.email ?? null;
  const sessionBusinessId = (session?.user as { businessId?: string | null } | undefined)?.businessId ?? null;
  const [businesses, setBusinesses] = useState<AdminBusiness[]>([]);
  const [active, setActive] = useState<string | null>(null);

  useEffect(() => {
    if (!isAdminEmail(email)) return;
    const pinned = typeof window !== 'undefined' ? window.localStorage.getItem('activeBusinessId') : null;
    setActive(pinned || sessionBusinessId);
    getAdminBusinesses().then(setBusinesses).catch((e) => console.error('Failed to load businesses:', e));
  }, [email, sessionBusinessId]);

  if (!isAdminEmail(email)) return null;

  const onChange = (id: string) => {
    const picked = businesses.find((b) => b.id === id);
    if (typeof window !== 'undefined') {
      if (id === sessionBusinessId) {
        window.localStorage.removeItem('activeBusinessId');
        window.localStorage.removeItem('activeBrand');
      } else {
        window.localStorage.setItem('activeBusinessId', id);
        if (picked?.brand) window.localStorage.setItem('activeBrand', picked.brand);
        else window.localStorage.removeItem('activeBrand');
      }
    }
    setBusinessId(id);
    setActive(id);
    window.location.reload();
  };

  return (
    <div className="flex items-center gap-2">
      <span className="text-[11px] font-semibold uppercase tracking-wide text-[#8a8a82] hidden sm:inline">Viewing</span>
      <select
        value={active ?? ''}
        onChange={(e) => onChange(e.target.value)}
        className="text-sm font-medium bg-white border border-[#e2ded5] rounded-lg px-2.5 py-1.5 max-w-[210px] focus:outline-none focus:ring-2 focus:ring-[#0F9A66]/30"
      >
        {!businesses.length && active && <option value={active}>Loading...</option>}
        {businesses.map((b) => (
          <option key={b.id} value={b.id}>
            {b.brand === 'cotorra' ? 'Cotorra - ' : ''}{b.name}
          </option>
        ))}
      </select>
    </div>
  );
}
