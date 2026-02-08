'use client';

import { SessionProvider, useSession } from 'next-auth/react';
import { useEffect } from 'react';
import { setBusinessId } from '@/lib/api';

function BusinessIdSync() {
  const { data: session } = useSession();

  useEffect(() => {
    if (session?.user?.businessId) {
      setBusinessId(session.user.businessId);
    } else {
      setBusinessId(null);
    }
  }, [session?.user?.businessId]);

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
