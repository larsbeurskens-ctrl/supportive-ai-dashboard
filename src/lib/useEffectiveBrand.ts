'use client';

import { useEffect, useState } from 'react';
import { isAdminEmail } from '@/lib/admin';

// The brand that should theme the dashboard for the current viewer.
// Non-admins always get their own business brand. Admins get the pinned
// business's brand when the switcher has an active selection.
export function useEffectiveBrand(
  email: string | null | undefined,
  sessionBrand: string | null | undefined,
): string | null | undefined {
  const [brand, setBrand] = useState<string | null | undefined>(sessionBrand);
  useEffect(() => {
    if (
      isAdminEmail(email) &&
      typeof window !== 'undefined' &&
      window.localStorage.getItem('activeBusinessId')
    ) {
      setBrand(window.localStorage.getItem('activeBrand'));
    } else {
      setBrand(sessionBrand);
    }
  }, [email, sessionBrand]);
  return brand;
}
