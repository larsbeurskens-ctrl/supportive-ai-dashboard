// API client for Supportive AI backend
const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'https://supportive-ai-backend-production.up.railway.app';

export interface Call {
  id: string;
  retellCallId: string;
  phoneNumber: string;
  duration: number;
  status: string;
  sentiment?: string;
  createdAt: string;
  customer?: {
    firstName: string;
    lastName: string;
  };
}

export interface Booking {
  id: string;
  scheduledDate: string;
  scheduledTime: string;
  serviceType: string;
  serviceAddress: string;
  serviceCity: string;
  quotedPrice?: number;
  status: string;
  estimatedDuration: number;
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
async function fetchWithAuth(endpoint: string, businessId: string, options: RequestInit = {}) {
  const res = await fetch(`${API_BASE}${endpoint}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      'X-Business-Id': businessId,
      ...options.headers,
    },
  });
  
  if (!res.ok) {
    throw new Error(`API error: ${res.status}`);
  }
  
  return res.json();
}

// Dashboard metrics
export async function getDashboardMetrics(businessId: string): Promise<DashboardMetrics> {
  return fetchWithAuth('/api/dashboard/metrics', businessId);
}

// Calls
export async function getCalls(businessId: string, limit = 50): Promise<Call[]> {
  return fetchWithAuth(`/api/calls?limit=${limit}`, businessId);
}

export async function getCallById(businessId: string, callId: string): Promise<Call> {
  return fetchWithAuth(`/api/calls/${callId}`, businessId);
}

// Bookings
export async function getBookings(businessId: string, limit = 50): Promise<Booking[]> {
  return fetchWithAuth(`/api/bookings?limit=${limit}`, businessId);
}

export async function getTodaysBookings(businessId: string): Promise<Booking[]> {
  return fetchWithAuth('/api/bookings/today', businessId);
}

export async function getUpcomingBookings(businessId: string, limit = 5): Promise<Booking[]> {
  return fetchWithAuth(`/api/bookings/upcoming?limit=${limit}`, businessId);
}

// Customers
export async function getCustomers(businessId: string, limit = 50): Promise<Customer[]> {
  return fetchWithAuth(`/api/customers?limit=${limit}`, businessId);
}
