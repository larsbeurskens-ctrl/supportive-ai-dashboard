'use client';

import { useState, useEffect } from 'react';
import { getInvoices, getBookings, createInvoice, updateInvoice, sendInvoice, cancelInvoice, Invoice, Booking } from '@/lib/api';

function StatusBadge({ status }: { status: string }) {
  const config: Record<string, { bg: string; text: string; label: string }> = {
    draft: { bg: 'bg-[#f4f3f1]', text: 'text-[#5a7184]', label: 'Draft' },
    sent: { bg: 'bg-[#eff6ff]', text: 'text-[#2563eb]', label: 'Sent' },
    paid: { bg: 'bg-[#eef9f0]', text: 'text-[#059669]', label: 'Paid' },
    overdue: { bg: 'bg-[#fef8f0]', text: 'text-[#d97706]', label: 'Overdue' },
    cancelled: { bg: 'bg-[#fef2f2]', text: 'text-[#dc2626]', label: 'Cancelled' },
  };
  const c = config[status] || { bg: 'bg-[#f4f3f1]', text: 'text-[#5a7184]', label: status };
  return <span className={`px-2.5 py-1 rounded-full text-[12px] font-semibold ${c.bg} ${c.text}`}>{c.label}</span>;
}

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

function formatCurrency(amount: number | null): string {
  if (amount === null || amount === undefined) return '—';
  return `$${amount.toFixed(2)}`;
}

/* ===== Invoice Editor (inline expand) ===== */
function InvoiceEditor({ invoice, onSaved, onClose }: { invoice: Invoice; onSaved: () => void; onClose: () => void }) {
  const [amount, setAmount] = useState(invoice.amount?.toString() || '');
  const [description, setDescription] = useState(invoice.description || '');
  const [notes, setNotes] = useState(invoice.notes || '');
  const [saving, setSaving] = useState(false);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState('');

  async function handleSave() {
    setSaving(true);
    setError('');
    try {
      await updateInvoice(invoice.id, {
        amount: parseFloat(amount) || undefined,
        description,
        notes: notes || undefined,
      });
      onSaved();
    } catch (e: any) {
      setError(e.message);
    } finally {
      setSaving(false);
    }
  }

  async function handleSend() {
    if (!amount || parseFloat(amount) <= 0) {
      setError('Set the invoice amount before sending.');
      return;
    }
    setSending(true);
    setError('');
    try {
      // Save first, then send
      await updateInvoice(invoice.id, {
        amount: parseFloat(amount),
        description,
        notes: notes || undefined,
      });
      await sendInvoice(invoice.id);
      onSaved();
      onClose();
    } catch (e: any) {
      setError(e.message);
    } finally {
      setSending(false);
    }
  }

  return (
    <div className="bg-[#faf9f7] border border-[#e5e0da] rounded-xl p-5 mt-3 space-y-4">
      {error && <div className="bg-[#fef2f2] text-[#991b1b] px-3 py-2 rounded-lg text-sm">{error}</div>}

      <div>
        <label className="block text-[12px] font-semibold text-[#5a7184] uppercase tracking-wide mb-1">Description</label>
        <input
          type="text"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full px-3 py-2.5 rounded-lg border border-[#d1ccc6] bg-white text-sm text-[#1a2e3b] focus:outline-none focus:border-[#e8930c]"
        />
      </div>

      <div className="flex gap-4">
        <div className="flex-1">
          <label className="block text-[12px] font-semibold text-[#5a7184] uppercase tracking-wide mb-1">Amount ($)</label>
          <input
            type="number"
            step="0.01"
            min="0"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="0.00"
            className="w-full px-3 py-2.5 rounded-lg border border-[#d1ccc6] bg-white text-sm text-[#1a2e3b] focus:outline-none focus:border-[#e8930c]"
          />
        </div>
        <div className="flex-1">
          <label className="block text-[12px] font-semibold text-[#5a7184] uppercase tracking-wide mb-1">Notes (optional)</label>
          <input
            type="text"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="e.g. Includes parts"
            className="w-full px-3 py-2.5 rounded-lg border border-[#d1ccc6] bg-white text-sm text-[#1a2e3b] focus:outline-none focus:border-[#e8930c]"
          />
        </div>
      </div>

      <div className="flex gap-2 pt-1">
        <button onClick={handleSave} disabled={saving}
          className="px-4 py-2 rounded-lg bg-white border border-[#d1ccc6] text-sm font-semibold text-[#1a2e3b] hover:bg-[#f0eeeb] transition-colors cursor-pointer disabled:opacity-50">
          {saving ? 'Saving...' : 'Save Draft'}
        </button>
        <button onClick={handleSend} disabled={sending || !amount}
          className="px-4 py-2 rounded-lg bg-[#e8930c] text-sm font-semibold text-white hover:bg-[#d17f00] transition-colors cursor-pointer disabled:opacity-50 border-none">
          {sending ? 'Sending...' : 'Send to Customer'}
        </button>
        <button onClick={onClose}
          className="px-4 py-2 rounded-lg bg-transparent text-sm text-[#94a7b8] hover:text-[#5a7184] cursor-pointer border-none">
          Cancel
        </button>
      </div>

      {invoice.customer?.phone && (
        <p className="text-[12px] text-[#94a7b8]">
          Payment link will be sent via SMS to {invoice.customer.phone}
        </p>
      )}
    </div>
  );
}

/* ===== Create Invoice Modal ===== */
function CreateFromBooking({ onCreated, onClose }: { onCreated: () => void; onClose: () => void }) {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState<string | null>(null);

  useEffect(() => {
    getBookings(100).then(b => {
      // Only show confirmed/completed bookings without invoices yet
      setBookings(b.filter(bk => ['confirmed', 'completed'].includes(bk.status)));
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  async function handleCreate(bookingId: string) {
    setCreating(bookingId);
    try {
      await createInvoice(bookingId);
      onCreated();
      onClose();
    } catch (e: any) {
      alert(e.message);
    } finally {
      setCreating(null);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4" onClick={onClose}>
      <div className="bg-white rounded-2xl max-w-[520px] w-full max-h-[70vh] overflow-hidden" onClick={e => e.stopPropagation()}>
        <div className="px-6 py-4 border-b border-[#e5e0da] flex items-center justify-between">
          <h3 className="text-lg font-bold text-[#1a2e3b]">Create Invoice from Booking</h3>
          <button onClick={onClose} className="text-[#94a7b8] hover:text-[#5a7184] bg-transparent border-none cursor-pointer text-xl">&times;</button>
        </div>
        <div className="p-4 overflow-y-auto max-h-[50vh] space-y-2">
          {loading && <p className="text-sm text-[#94a7b8] text-center py-6">Loading bookings...</p>}
          {!loading && bookings.length === 0 && (
            <p className="text-sm text-[#94a7b8] text-center py-6">No bookings available for invoicing.</p>
          )}
          {bookings.map(b => (
            <div key={b.id} className="flex items-center justify-between p-3 rounded-lg border border-[#e5e0da] hover:bg-[#faf9f7]">
              <div>
                <p className="text-sm font-semibold text-[#1a2e3b]">
                  {b.customer?.firstName} {b.customer?.lastName} — {b.serviceType?.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')}
                </p>
                <p className="text-[12px] text-[#5a7184]">
                  {formatDate(b.scheduledDate)} · {b.serviceAddress}, {b.serviceCity}
                </p>
              </div>
              <button
                onClick={() => handleCreate(b.id)}
                disabled={creating === b.id}
                className="px-3 py-1.5 rounded-lg bg-[#1a2e3b] text-white text-[12px] font-semibold hover:bg-[#243d4e] cursor-pointer border-none disabled:opacity-50"
              >
                {creating === b.id ? '...' : 'Invoice'}
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ===== Main Invoices Page ===== */
export default function InvoicesPage() {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<string>('all');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showCreate, setShowCreate] = useState(false);
  const [cancelling, setCancelling] = useState<string | null>(null);

  async function loadInvoices() {
    setLoading(true);
    try {
      const data = await getInvoices(filter === 'all' ? undefined : filter);
      setInvoices(data);
    } catch (e) {
      console.error('Failed to load invoices:', e);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { loadInvoices(); }, [filter]);

  async function handleCancel(invoiceId: string) {
    if (!confirm('Cancel this invoice? This will deactivate the payment link.')) return;
    setCancelling(invoiceId);
    try {
      await cancelInvoice(invoiceId);
      loadInvoices();
    } catch (e: any) {
      alert(e.message);
    } finally {
      setCancelling(null);
    }
  }

  // Summary stats
  const totalDraft = invoices.filter(i => i.status === 'draft').length;
  const totalSent = invoices.filter(i => i.status === 'sent').length;
  const totalPaid = invoices.filter(i => i.status === 'paid').length;
  const totalOverdue = invoices.filter(i => i.status === 'overdue').length;
  const revenue = invoices.filter(i => i.status === 'paid').reduce((sum, i) => sum + (i.amount || 0), 0);
  const outstanding = invoices.filter(i => ['sent', 'overdue'].includes(i.status)).reduce((sum, i) => sum + (i.amount || 0), 0);

  const filters = [
    { key: 'all', label: 'All' },
    { key: 'draft', label: `Draft (${totalDraft})` },
    { key: 'sent', label: `Sent (${totalSent})` },
    { key: 'paid', label: `Paid (${totalPaid})` },
    { key: 'overdue', label: `Overdue (${totalOverdue})` },
  ];

  return (
    <div className="space-y-6">
      {showCreate && <CreateFromBooking onCreated={loadInvoices} onClose={() => setShowCreate(false)} />}

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[#1a2e3b]">Invoices</h1>
          <p className="text-sm text-[#5a7184] mt-0.5">Create, edit, and send payment links to customers.</p>
        </div>
        <button
          onClick={() => setShowCreate(true)}
          className="px-4 py-2.5 rounded-lg bg-[#e8930c] text-white text-sm font-semibold hover:bg-[#d17f00] transition-colors cursor-pointer border-none shadow-sm"
        >
          + New Invoice
        </button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <div className="bg-white rounded-xl border border-[#e5e0da] p-4">
          <p className="text-[12px] font-semibold text-[#94a7b8] uppercase tracking-wide">Collected</p>
          <p className="text-xl font-bold text-[#059669] mt-1">{formatCurrency(revenue)}</p>
        </div>
        <div className="bg-white rounded-xl border border-[#e5e0da] p-4">
          <p className="text-[12px] font-semibold text-[#94a7b8] uppercase tracking-wide">Outstanding</p>
          <p className="text-xl font-bold text-[#2563eb] mt-1">{formatCurrency(outstanding)}</p>
        </div>
        <div className="bg-white rounded-xl border border-[#e5e0da] p-4">
          <p className="text-[12px] font-semibold text-[#94a7b8] uppercase tracking-wide">Awaiting Send</p>
          <p className="text-xl font-bold text-[#5a7184] mt-1">{totalDraft}</p>
        </div>
        <div className="bg-white rounded-xl border border-[#e5e0da] p-4">
          <p className="text-[12px] font-semibold text-[#94a7b8] uppercase tracking-wide">Overdue</p>
          <p className="text-xl font-bold text-[#d97706] mt-1">{totalOverdue}</p>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-1 bg-white rounded-xl border border-[#e5e0da] p-1 w-fit">
        {filters.map(f => (
          <button
            key={f.key}
            onClick={() => setFilter(f.key)}
            className={`px-3.5 py-1.5 rounded-lg text-[13px] font-semibold cursor-pointer border-none transition-colors ${
              filter === f.key
                ? 'bg-[#1a2e3b] text-white'
                : 'bg-transparent text-[#5a7184] hover:bg-[#f0eeeb]'
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* Invoice List */}
      {loading ? (
        <div className="flex justify-center py-12">
          <div className="w-6 h-6 border-2 border-[#1a2e3b] border-t-transparent rounded-full animate-spin" />
        </div>
      ) : invoices.length === 0 ? (
        <div className="bg-white rounded-xl border border-[#e5e0da] p-10 text-center">
          <p className="text-[#94a7b8] text-sm">No invoices yet. Create one from a completed booking.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {invoices.map(inv => (
            <div key={inv.id} className="bg-white rounded-xl border border-[#e5e0da] overflow-hidden">
              <div className="p-4 flex items-center gap-4">
                {/* Customer + description */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-0.5">
                    <p className="text-sm font-bold text-[#1a2e3b] truncate">
                      {inv.customer?.firstName} {inv.customer?.lastName}
                    </p>
                    <StatusBadge status={inv.status} />
                  </div>
                  <p className="text-[13px] text-[#5a7184] truncate">{inv.description}</p>
                  <p className="text-[11px] text-[#94a7b8] mt-0.5">
                    Created {formatDate(inv.createdAt)}
                    {inv.sentAt && ` · Sent ${formatDate(inv.sentAt)}`}
                    {inv.paidAt && ` · Paid ${formatDate(inv.paidAt)}`}
                  </p>
                </div>

                {/* Amount */}
                <div className="text-right flex-shrink-0">
                  <p className={`text-lg font-bold ${inv.status === 'paid' ? 'text-[#059669]' : 'text-[#1a2e3b]'}`}>
                    {formatCurrency(inv.amount)}
                  </p>
                </div>

                {/* Actions */}
                <div className="flex-shrink-0 flex gap-1.5">
                  {inv.status === 'draft' && (
                    <button
                      onClick={() => setEditingId(editingId === inv.id ? null : inv.id)}
                      className="px-3 py-1.5 rounded-lg bg-[#1a2e3b] text-white text-[12px] font-semibold hover:bg-[#243d4e] cursor-pointer border-none"
                    >
                      {editingId === inv.id ? 'Close' : 'Edit & Send'}
                    </button>
                  )}
                  {inv.status === 'sent' && inv.stripePaymentLinkUrl && (
                    <a
                      href={inv.stripePaymentLinkUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-3 py-1.5 rounded-lg bg-[#eff6ff] text-[#2563eb] text-[12px] font-semibold hover:bg-[#dbeafe] no-underline"
                    >
                      View Link
                    </a>
                  )}
                  {['draft', 'sent'].includes(inv.status) && (
                    <button
                      onClick={() => handleCancel(inv.id)}
                      disabled={cancelling === inv.id}
                      className="px-3 py-1.5 rounded-lg bg-transparent text-[#dc2626] text-[12px] font-semibold hover:bg-[#fef2f2] cursor-pointer border border-[#fecaca] disabled:opacity-50"
                    >
                      {cancelling === inv.id ? '...' : 'Cancel'}
                    </button>
                  )}
                </div>
              </div>

              {/* Inline editor */}
              {editingId === inv.id && inv.status === 'draft' && (
                <div className="px-4 pb-4">
                  <InvoiceEditor
                    invoice={inv}
                    onSaved={loadInvoices}
                    onClose={() => setEditingId(null)}
                  />
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
