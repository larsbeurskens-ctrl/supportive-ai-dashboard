// API Types for Supportive AI Dashboard

export interface Business {
  id: string;
  name: string;
  phone: string;
  email: string;
  address: string;
  timezone: string;
  calendarConnected: boolean;
  createdAt: string;
}

export interface Call {
  id: string;
  retellCallId: string;
  businessId: string;
  callerPhone: string;
  status: 'in_progress' | 'completed' | 'failed';
  duration: number;
  sentiment: 'positive' | 'neutral' | 'negative' | null;
  outcome: 'booked' | 'inquiry' | 'escalated' | 'missed' | null;
  createdAt: string;
  endedAt: string | null;
  customer?: Customer;
  transcript?: Transcript;
}

export interface Customer {
  id: string;
  businessId: string;
  phone: string;
  firstName: string | null;
  lastName: string | null;
  email: string | null;
  totalBookings: number;
  totalSpent: number;
  createdAt: string;
}

export interface Booking {
  id: string;
  businessId: string;
  customerId: string;
  callId: string | null;
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
  serviceType: string;
  serviceAddress: string;
  serviceCity: string;
  serviceZipCode: string;
  scheduledDate: string;
  scheduledTime: string;
  estimatedDuration: number;
  quotedPrice: number | null;
  propertyType: string | null;
  stories: number | null;
  specialInstructions: string | null;
  createdAt: string;
  customer?: Customer;
}

export interface Transcript {
  id: string;
  callId: string;
  fullText: string;
  summary: string | null;
  createdAt: string;
}

export interface DashboardMetrics {
  callsAnswered: number;
  bookingsMade: number;
  bookingSuccessRate: number;
  revenueScheduled: number;
  happyCallerPercent: number;
  periodDays: number;
}

export interface TodayJob {
  id: string;
  time: string;
  customerName: string;
  address: string;
  serviceType: string;
  stories: number | null;
}

export interface RecentCall {
  id: string;
  time: string;
  callerPhone: string;
  outcome: Call['outcome'];
  sentiment: Call['sentiment'];
  duration: number;
}
