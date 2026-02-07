// API client for Supportive AI backend
const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'https://supportive-ai-backend-production.up.railway.app';

// Hardcoded for now — will come from auth session later
const BUSINESS_ID = process.env.NEXT_PUBLIC_BUSINESS_ID || 'cml3ihts00000ifulnw03qk9v';

export interface Call {
  id: string;
  retellCallId: string;
  phoneNumber: string;
  duration: number;
  status: string;
  sentiment?: string;
  createdAt: string;
  startTime?: string;
  customer?: {
    firstName: string;
    lastName: string;
    phone: string;
  };
  transcript?: {
    fullText: string;
  };
}

export interface Booking {
  id: string;
  scheduledDate: string;
  scheduledTime: string;
  serviceType: string;
  serviceAddress: string;
  serviceCity: string;
  serviceZipCode?: string;
  quotedPrice?: number;
  status: string;
  estimatedDuration: number;
  propertyType?: string;
  stories?: number;
  customer?: {
    firstName: string;
    lastName: string;
    phone: string;
  };
}

export interface Customer {
  id: string;
  firstName: string;
  lastName: string;
  phone: string;
  email?: string;
  createdAt: string;
  totalBookings?: number;
  lifetimeValue?: number;
  _count?: {
    bookings: number;
    calls: number;
  };
}

export interface DashboardMetrics {
  callsLast7Days: number;
  bookingsLast7Days: number;
  bookingSuccessRate: number;
  revenueScheduled: number;
  happyCallerPercent: number;
}

// Fetch with auth header
async function fetchWithAuth(endpoint: string, options: RequestInit = {}) {
  const res = await fetch(`${API_BASE}${endpoint}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      'X-Business-Id': BUSINESS_ID,
      ...options.headers,
    },
  });
  
  if (!res.ok) {
    throw new Error(`API error: ${res.status}`);
  }
  
  return res.json();
}

// Dashboard metrics
export async function getDashboardMetrics(): Promise<DashboardMetrics> {
  return fetchWithAuth('/api/dashboard/metrics');
}

// Calls
export async function getCalls(limit = 50): Promise<Call[]> {
  return fetchWithAuth(`/api/calls?limit=${limit}`);
}

export async function getCallById(callId: string): Promise<Call> {
  return fetchWithAuth(`/api/calls/${callId}`);
}

// Bookings
export async function getBookings(limit = 50): Promise<Booking[]> {
  return fetchWithAuth(`/api/bookings?limit=${limit}`);
}

export async function getTodaysBookings(): Promise<Booking[]> {
  return fetchWithAuth('/api/bookings/today');
}

export async function getUpcomingBookings(limit = 5): Promise<Booking[]> {
  return fetchWithAuth(`/api/bookings/upcoming?limit=${limit}`);
}

// Customers
export async function getCustomers(limit = 50): Promise<Customer[]> {
  return fetchWithAuth(`/api/customers?limit=${limit}`);
}
