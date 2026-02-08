import 'next-auth';
import { JWT } from 'next-auth/jwt';

declare module 'next-auth' {
  interface Session {
    user: {
      id: string;
      email: string;
      name?: string | null;
      image?: string | null;
      userId?: string;
      role?: string;
      businessId?: string | null;
      businessName?: string | null;
      industry?: string | null;
      timezone?: string | null;
    };
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    userId?: string;
    role?: string;
    businessId?: string | null;
    businessName?: string | null;
    industry?: string | null;
    timezone?: string | null;
  }
}
