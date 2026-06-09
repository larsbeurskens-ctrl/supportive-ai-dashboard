'use client';

import { SessionProvider, useSession } from 'next-auth/react';
import { useEffect } from 'react';
import { setBusinessId, setUserEmail } from '@/lib/api';
import { isAdminEmail } from '@/lib/admin';

function BusinessIdSync() {
  const { data: session } = useSession();
  const email = session?.user?.email ?? null;
  const sessionBusinessId = session?.user?.businessId ?? null;

  useEffect(() => {
    setUserEmail(email);
    // Admins can pin an "active business" via the switcher (stored locally).
    let active: string | null = sessionBusinessId;
    if (isAdminEmail(email) && typeof window !== 'undefined') {
      const pinned = window.localStorage.getItem('activeBusinessId');
      if (pinned) active = pinned;
    }
    setBusinessId(active);
  }, [email, sessionBusinessId]);

  return null;
}

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <BusinessIdSync />
      {children}
    </SessionProvider>
  );
}
