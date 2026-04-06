// API client for Supportive AI backend
const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'https://supportive-ai-backend-production.up.railway.app';

export interface Call {
  id: string;
  retellCallId: string;
  phoneNumber?: string;
  callerPhone?: string;
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
    messages?: Array<{ role: string; content: string }>;
  };
  audioUrl?: string;
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

// Store businessId from session — set by useApi hook
let _businessId: string | null = null;

export function setBusinessId(id: string | null) {
  _businessId = id;
}

export function getBusinessId(): string | null {
  return _businessId;
}

// Fetch with business ID header
async function fetchWithAuth(endpoint: string, options: RequestInit = {}) {
  const businessId = _businessId;
  if (!businessId) {
    throw new Error('Business ID not set. User may not have a business linked.');
  }

  const res = await fetch(`${API_BASE}${endpoint}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      'X-Business-Id': businessId,
      ...options.headers,
    },
  });
  
  if (!res.ok) {
    // Try to include the error body for better error handling
    let errorMsg = `API error: ${res.status}`;
    try {
      const body = await res.json();
      if (body?.error) errorMsg = body.error;
    } catch { /* ignore parse errors */ }
    throw new Error(errorMsg);
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

// Provisioning & Onboarding
export interface OnboardingChecklist {
  agentCreated: boolean;
  businessDetailsAdded: boolean;
  ownerPhoneSet: boolean;
  testCallMade: boolean;
  calendarConnected: boolean;
  stripeConnected: boolean;
  callForwardingSet: boolean;
}

export interface ProvisionStatus {
  provisioned: boolean;
  phoneNumber: string | null;
  agentId: string | null;
  agentName: string;
  voiceId: string | null;
  vertical: string;
  isLive: boolean;
  checklist: OnboardingChecklist;
  calendarAuthUrl: string | null;
  overrides: Record<string, any>;
}

export interface ProvisionResult {
  success: boolean;
  phoneNumber: string;
  phoneNumberPretty: string;
  agentId: string;
  agentName: string;
  calendarAuthUrl: string | null;
}

export interface ProvisionOptions {
  nameSuggestions: string[];
}

export async function getProvisionStatus(): Promise<ProvisionStatus> {
  return fetchWithAuth(`/api/businesses/${_businessId}/provision-status`);
}

export async function getProvisionOptions(): Promise<ProvisionOptions> {
  const res = await fetch(`${API_BASE}/api/provision/options`);
  if (!res.ok) throw new Error('Failed to fetch provision options');
  return res.json();
}

export async function provisionBusiness(areaCode: string, agentName?: string): Promise<ProvisionResult> {
  return fetchWithAuth(`/api/businesses/${_businessId}/provision`, {
    method: 'POST',
    body: JSON.stringify({ areaCode, agentName }),
  });
}

export async function saveBusinessDetails(details: Record<string, unknown>): Promise<{ success: boolean }> {
  return fetchWithAuth(`/api/businesses/${_businessId}/business-details`, {
    method: 'POST',
    body: JSON.stringify(details),
  });
}

export async function goLive(): Promise<{ success: boolean; isLive: boolean }> {
  return fetchWithAuth(`/api/businesses/${_businessId}/go-live`, {
    method: 'POST',
  });
}

// Stripe Connect
export async function connectStripe(): Promise<{ success: boolean; onboardingUrl: string }> {
  return fetchWithAuth('/api/stripe/connect', {
    method: 'POST',
    body: JSON.stringify({ businessId: _businessId }),
  });
}

// Stripe Subscription — billing Supportive AI to the customer
export async function startSubscription(plan?: string): Promise<{ url: string }> {
  const res = await fetch('/api/stripe/subscribe', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ plan }),
  });
  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw new Error(data.error || `HTTP ${res.status}`);
  }
  return res.json();
}

// Invoices
export interface Invoice {
  id: string;
  createdAt: string;
  updatedAt: string;
  bookingId: string;
  customerId: string;
  description: string;
  lineItems: { description: string; address?: string; date?: string; amount: number | null }[] | null;
  amount: number | null;
  status: 'draft' | 'sent' | 'paid' | 'overdue' | 'cancelled';
  stripePaymentLinkUrl?: string;
  sentAt?: string;
  paidAt?: string;
  reminderCount: number;
  notes?: string;
  customer?: {
    firstName: string;
    lastName: string;
    phone: string;
  };
  booking?: Booking;
}

export async function getInvoices(status?: string): Promise<Invoice[]> {
  const query = status ? `?status=${status}` : '';
  return fetchWithAuth(`/api/invoices/${_businessId}${query}`);
}

export async function createInvoice(bookingId: string): Promise<{ success: boolean; invoice: Invoice }> {
  return fetchWithAuth('/api/invoices', {
    method: 'POST',
    body: JSON.stringify({ bookingId }),
  });
}

export async function updateInvoice(invoiceId: string, data: { amount?: number; description?: string; lineItems?: any; notes?: string }): Promise<Invoice> {
  return fetchWithAuth(`/api/invoices/${invoiceId}`, {
    method: 'PATCH',
    body: JSON.stringify(data),
  });
}

export async function sendInvoice(invoiceId: string): Promise<{ success: boolean; invoice: Invoice; smsSent?: boolean }> {
  return fetchWithAuth(`/api/invoices/${invoiceId}/send`, {
    method: 'POST',
  });
}

export async function cancelInvoice(invoiceId: string): Promise<{ success: boolean }> {
  return fetchWithAuth(`/api/invoices/${invoiceId}/cancel`, {
    method: 'POST',
  });
}


// ==========================================
// SMS Outreach
// ==========================================
export interface SMSConversation {
  id: string;
  fromNumber: string;
  toNumber: string;
  toName: string | null;
  toCompany: string | null;
  vertical: string | null;
  lastMessage: string | null;
  lastAt: string | null;
  unread: boolean;
  createdAt: string;
  _count?: { messages: number };
  messages?: SMSMessage[];
}

export interface SMSMessage {
  id: string;
  conversationId: string;
  direction: 'outbound' | 'inbound';
  body: string;
  status: string;
  createdAt: string;
}

export async function getSMSConversations(): Promise<SMSConversation[]> {
  return fetchWithAuth('/api/sms/conversations');
}

export async function getSMSConversation(id: string): Promise<SMSConversation> {
  return fetchWithAuth(`/api/sms/conversations/${id}`);
}

export async function sendSMS(data: { to: string; body: string; name?: string; company?: string; vertical?: string }): Promise<{ success: boolean; messageId: string; conversationId: string }> {
  return fetchWithAuth('/api/sms/send', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
}

export async function getSMSTemplates(): Promise<Array<{ id: string; name: string; body: string; variables: string[] }>> {
  return fetchWithAuth('/api/sms/templates');
}
