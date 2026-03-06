'use client';

import { useState, useEffect, useCallback } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';

const ADMIN_EMAIL = 'larsbeurskens@gmail.com';

interface Contact {
  id: string;
  email: string;
  name: string | null;
  businessName: string | null;
  phone: string | null;
  website: string | null;
  vertical: string;
  score: number;
  painSignal: string | null;
  status: string;
  sentAt: string | null;
  trackingSlug: string | null;
  emailTemplate: string | null;
}

interface Pipeline { total: number; unsent: number; sent: number; clicked: number; signed_up: number; }

const VERTICAL_LABELS: Record<string, string> = {
  plumbing: '🔧 Plumbing', window_cleaning: '🪟 Window Cleaning', hvac: '❄️ HVAC',
};
const STATUS_STYLES: Record<string, { bg: string; text: string; label: string }> = {
  unsent: { bg: 'bg-[#f5f4f2]', text: 'text-[#5a7184]', label: 'Unsent' },
  sent: { bg: 'bg-[#eff6ff]', text: 'text-[#3b82f6]', label: 'Sent' },
  clicked: { bg: 'bg-[#fef3e0]', text: 'text-[#e8930c]', label: 'Clicked' },
  signed_up: { bg: 'bg-[#eef9f0]', text: 'text-[#059669]', label: 'Signed up' },
};

export default function OutreachSendPage() {
  const { data: session, status: authStatus } = useSession();
  const router = useRouter();
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [pipeline, setPipeline] = useState<Pipeline>({ total: 0, unsent: 0, sent: 0, clicked: 0, signed_up: 0 });
  const [loading, setLoading] = useState(true);
  const [filterVertical, setFilterVertical] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [sending, setSending] = useState<string | null>(null);
  const [importing, setImporting] = useState(false);
  const [importResult, setImportResult] = useState<string | null>(null);
  const [page, setPage] = useState(0);
  const [total, setTotal] = useState(0);
  const PAGE_SIZE = 50;
  const [preview, setPreview] = useState<{
    contactId: string; template: string; from: string; to: string;
    subject: string; html: string; trackingUrl: string;
    contact: { businessName: string | null; name: string | null; vertical: string; painSignal: string | null };
  } | null>(null);
  const [previewing, setPreviewing] = useState<string | null>(null);

  useEffect(() => {
    if (authStatus === 'authenticated' && session?.user?.email !== ADMIN_EMAIL) {
      router.replace('/dashboard');
    }
  }, [authStatus, session, router]);

  const fetchContacts = useCallback(async () => {
    const params = new URLSearchParams();
    if (filterVertical) params.set('vertical', filterVertical);
    if (filterStatus) params.set('status', filterStatus);
    params.set('limit', String(PAGE_SIZE));
    params.set('offset', String(page * PAGE_SIZE));
    const res = await fetch(`/api/admin/outreach-contacts?${params}`);
    if (res.ok) {
      const data = await res.json();
      setContacts(data.contacts);
      setPipeline(data.pipeline);
      setTotal(data.total);
    }
    setLoading(false);
  }, [filterVertical, filterStatus, page]);

  useEffect(() => { fetchContacts(); }, [fetchContacts]);

  async function handleSend(contactId: string, template: string) {
    setSending(contactId);
    try {
      const res = await fetch('/api/admin/outreach-contacts/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ contactId, template }),
      });
      if (res.ok) { await fetchContacts(); }
      else { const d = await res.json(); alert(d.error || 'Send failed'); }
    } catch { alert('Send failed'); }
    finally { setSending(null); }
  }

  async function handlePreview(contactId: string, template: string) {
    setPreviewing(contactId);
    try {
      const res = await fetch('/api/admin/outreach-contacts/preview', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ contactId, template }),
      });
      if (res.ok) { setPreview({ ...(await res.json()), contactId, template }); }
      else { alert('Preview failed'); }
    } catch { alert('Preview failed'); }
    finally { setPreviewing(null); }
  }

  async function handleImportCSV(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setImporting(true);
    setImportResult(null);
    const text = await file.text();
    const lines = text.replace(/\r/g, '').split('\n').filter(l => l.trim());
    const headers = lines[0].split(',').map(h => h.trim().replace(/^"|"$/g, ''));
    
    const contacts = lines.slice(1).map(line => {
      // Handle CSV with quoted fields
      const vals: string[] = [];
      let current = '';
      let inQuotes = false;
      for (const ch of line) {
        if (ch === '"') { inQuotes = !inQuotes; }
        else if (ch === ',' && !inQuotes) { vals.push(current.trim()); current = ''; }
        else { current += ch; }
      }
      vals.push(current.trim());

      const row: Record<string, string> = {};
      headers.forEach((h, i) => { row[h] = vals[i] || ''; });

      const email = row['email_to'] || row['email'] || '';
      const bizName = row['name'] || row['business_name'] || row['businessName'] || '';
      // Generate placeholder email for leads without one (won't be emailed)
      const slug = bizName.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '').slice(0, 40);
      const resolvedEmail = email.includes('@') ? email : `${slug || 'unknown'}@no-email.placeholder`;

      return {
        email: resolvedEmail,
        name: row['first_name'] || '',
        businessName: bizName,
        phone: row['phone'] || '',
        vertical: row['vertical'] || 'plumbing',
        score: parseInt(row['_score'] || row['score'] || '0') || 0,
        painSignal: row['pain_signals'] || row['painSignal'] || '',
        website: row['website'] || '',
        notes: row['metro'] ? `Metro: ${row['metro']}` : '',
      };
    }).filter(c => c.businessName);

    if (contacts.length === 0) {
      setImportResult('No valid contacts found in CSV. Needs a "name" column at minimum.');
      setImporting(false);
      return;
    }

    const res = await fetch('/api/admin/outreach-contacts', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ contacts }),
    });
    const data = await res.json();
    if (data.error) {
      setImportResult(`Error: ${data.error}`);
    } else {
      setImportResult(`Imported ${data.imported}, skipped ${data.skipped} (of ${data.total})`);
    }
    setImporting(false);
    await fetchContacts();
    e.target.value = '';
  }

  function timeAgo(d: string | null) {
    if (!d) return '';
    const diff = Date.now() - new Date(d).getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 60) return `${mins}m ago`;
    const hrs = Math.floor(mins / 60);
    if (hrs < 24) return `${hrs}h ago`;
    return `${Math.floor(hrs / 24)}d ago`;
  }

  if (loading) {
    return <div className="flex items-center justify-center py-20">
      <div className="w-6 h-6 border-2 border-[#1a2e3b] border-t-transparent rounded-full animate-spin" />
    </div>;
  }

  return (
    <div>
      {/* Preview Modal */}
      {preview && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={() => setPreview(null)}>
          <div className="bg-white rounded-2xl max-w-[640px] w-full max-h-[90vh] flex flex-col" onClick={e => e.stopPropagation()}>
            <div className="px-6 py-4 border-b border-[#e5e0da] flex items-center justify-between">
              <div>
                <h3 className="text-[16px] font-bold text-[#1a2e3b]">Email Preview</h3>
                <p className="text-[12px] text-[#94a7b8]">{preview.template === 'follow_up' ? 'Follow-up' : preview.contact.painSignal ? 'First touch (pain signal)' : 'First touch'}</p>
              </div>
              <button onClick={() => setPreview(null)} className="text-[#94a7b8] hover:text-[#1a2e3b] text-xl cursor-pointer bg-transparent border-none">✕</button>
            </div>
            <div className="px-6 py-4 border-b border-[#e5e0da] space-y-2 bg-[#faf9f7]">
              <div className="flex gap-2 text-[13px]"><span className="text-[#94a7b8] w-16">From:</span><span className="text-[#1a2e3b] font-medium">{preview.from}</span></div>
              <div className="flex gap-2 text-[13px]"><span className="text-[#94a7b8] w-16">To:</span><span className="text-[#1a2e3b] font-medium">{preview.to}</span></div>
              <div className="flex gap-2 text-[13px]"><span className="text-[#94a7b8] w-16">Subject:</span><span className="text-[#1a2e3b] font-semibold">{preview.subject}</span></div>
              <div className="flex gap-2 text-[13px]"><span className="text-[#94a7b8] w-16">Link:</span><span className="text-[#3b82f6]">{preview.trackingUrl}</span></div>
            </div>
            <div className="px-6 py-4 overflow-y-auto flex-1 min-h-0">
              <div className="border border-[#e5e0da] rounded-xl p-5" dangerouslySetInnerHTML={{ __html: preview.html }} />
            </div>
            <div className="px-6 py-4 border-t border-[#e5e0da] flex justify-end gap-3 flex-shrink-0">
              <button onClick={() => setPreview(null)}
                className="px-4 py-2 rounded-lg text-[13px] font-semibold text-[#5a7184] border border-[#d1ccc6] hover:bg-[#f0eeeb] cursor-pointer bg-white transition-colors">
                Cancel
              </button>
              <button onClick={async () => { await handleSend(preview.contactId, preview.template); setPreview(null); }}
                disabled={sending === preview.contactId}
                className="px-5 py-2 rounded-lg text-[13px] font-bold text-white bg-[#e8930c] hover:bg-[#d17f00] disabled:opacity-50 cursor-pointer border-none transition-colors">
                {sending === preview.contactId ? 'Sending...' : 'Confirm & Send'}
              </button>
            </div>
          </div>
        </div>
      )}
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-[22px] font-bold text-[#1a2e3b]">Outreach Sender</h1>
          <p className="text-[13px] text-[#94a7b8] mt-0.5">{pipeline.total} contacts loaded</p>
        </div>
        <label className="bg-[#1a2e3b] text-white px-4 py-2 rounded-lg text-[13px] font-semibold cursor-pointer hover:bg-[#243d4e] transition-colors">
          {importing ? 'Importing...' : 'Import CSV'}
          <input type="file" accept=".csv" onChange={handleImportCSV} className="hidden" />
        </label>
      </div>
      {importResult && (
        <div className="bg-[#eef9f0] text-[#059669] text-[13px] font-medium px-4 py-2 rounded-lg mb-4">{importResult}</div>
      )}

      {/* Pipeline Stats */}
      <div className="grid grid-cols-5 gap-3 mb-6">
        {[
          { label: 'Total', value: pipeline.total, color: '#1a2e3b' },
          { label: 'Unsent', value: pipeline.unsent, color: '#94a7b8' },
          { label: 'Sent', value: pipeline.sent, color: '#3b82f6' },
          { label: 'Clicked', value: pipeline.clicked, color: '#e8930c' },
          { label: 'Signed up', value: pipeline.signed_up, color: '#059669' },
        ].map(s => (
          <div key={s.label} className="bg-white rounded-xl border border-[#e5e0da] p-4 text-center">
            <div className="text-[24px] font-extrabold" style={{ color: s.color }}>{s.value}</div>
            <div className="text-[11px] font-semibold text-[#94a7b8] uppercase tracking-wide">{s.label}</div>
          </div>
        ))}
      </div>

      {/* Conversion funnel bar */}
      {pipeline.sent > 0 && (
        <div className="bg-white rounded-xl border border-[#e5e0da] p-4 mb-6">
          <div className="flex items-center gap-4 text-[13px]">
            <span className="text-[#5a7184]">Conversion:</span>
            <span className="font-semibold text-[#3b82f6]">
              {pipeline.sent} sent → {pipeline.clicked} clicked ({pipeline.sent > 0 ? Math.round(pipeline.clicked / pipeline.sent * 100) : 0}%)
            </span>
            <span className="text-[#d1ccc6]">→</span>
            <span className="font-semibold text-[#059669]">
              {pipeline.signed_up} signed up ({pipeline.clicked > 0 ? Math.round(pipeline.signed_up / pipeline.clicked * 100) : 0}%)
            </span>
          </div>
        </div>
      )}

      {/* Filters */}
      <div className="flex gap-3 mb-4">
        <select value={filterVertical} onChange={e => { setFilterVertical(e.target.value); setPage(0); }}
          className="px-3 py-2 rounded-lg border border-[#d1ccc6] text-[13px] text-[#1a2e3b] bg-white">
          <option value="">All verticals</option>
          <option value="plumbing">Plumbing</option>
          <option value="window_cleaning">Window Cleaning</option>
          <option value="hvac">HVAC</option>
        </select>
        <select value={filterStatus} onChange={e => { setFilterStatus(e.target.value); setPage(0); }}
          className="px-3 py-2 rounded-lg border border-[#d1ccc6] text-[13px] text-[#1a2e3b] bg-white">
          <option value="">All statuses</option>
          <option value="unsent">Unsent</option>
          <option value="sent">Sent</option>
          <option value="clicked">Clicked</option>
          <option value="signed_up">Signed up</option>
        </select>
      </div>

      {/* Contacts Table */}
      <div className="bg-white rounded-xl border border-[#e5e0da] overflow-hidden">
        <table className="w-full text-left">
          <thead>
            <tr className="border-b border-[#e5e0da] bg-[#faf9f7]">
              <th className="px-4 py-3 text-[11px] font-semibold text-[#5a7184] uppercase tracking-wide">Business</th>
              <th className="px-4 py-3 text-[11px] font-semibold text-[#5a7184] uppercase tracking-wide">Email</th>
              <th className="px-4 py-3 text-[11px] font-semibold text-[#5a7184] uppercase tracking-wide">Vertical</th>
              <th className="px-4 py-3 text-[11px] font-semibold text-[#5a7184] uppercase tracking-wide w-16">Score</th>
              <th className="px-4 py-3 text-[11px] font-semibold text-[#5a7184] uppercase tracking-wide">Status</th>
              <th className="px-4 py-3 text-[11px] font-semibold text-[#5a7184] uppercase tracking-wide w-40">Action</th>
            </tr>
          </thead>
          <tbody>
            {contacts.map(c => {
              const st = STATUS_STYLES[c.status] || STATUS_STYLES.unsent;
              const isSending = sending === c.id;
              return (
                <tr key={c.id} className="border-b border-[#f0eeeb] last:border-0 hover:bg-[#faf9f7]">
                  <td className="px-4 py-3">
                    <div className="text-[13px] font-semibold text-[#1a2e3b] truncate max-w-[200px]">{c.businessName || '—'}</div>
                    {c.painSignal && <div className="text-[11px] text-[#e8930c] mt-0.5">🔥 {c.painSignal}</div>}
                  </td>
                  <td className="px-4 py-3">
                    <div className="text-[13px] text-[#1a2e3b] truncate max-w-[200px]">
                      {c.email.endsWith('@no-email.placeholder') ? <span className="text-[#94a7b8] italic">needs email</span> : c.email}
                    </div>
                    {c.phone && <div className="text-[11px] text-[#94a7b8]">{c.phone}</div>}
                  </td>
                  <td className="px-4 py-3 text-[12px] text-[#5a7184]">{VERTICAL_LABELS[c.vertical] || c.vertical}</td>
                  <td className="px-4 py-3 text-[13px] font-bold text-[#1a2e3b] text-center">{c.score}</td>
                  <td className="px-4 py-3">
                    <span className={`inline-block text-[11px] font-semibold px-2 py-0.5 rounded-full ${st.bg} ${st.text}`}>
                      {st.label}
                    </span>
                    {c.sentAt && <div className="text-[10px] text-[#94a7b8] mt-0.5">{timeAgo(c.sentAt)}</div>}
                  </td>
                  <td className="px-4 py-3">
                    {c.email.endsWith('@no-email.placeholder') ? (
                      <span className="text-[11px] text-[#94a7b8]">No email</span>
                    ) : c.status === 'unsent' ? (
                      <button onClick={() => handlePreview(c.id, 'first_touch')} disabled={previewing === c.id}
                        className="bg-[#e8930c] text-white px-3 py-1.5 rounded-lg text-[12px] font-semibold hover:bg-[#d17f00] disabled:opacity-50 cursor-pointer border-none transition-colors">
                        {previewing === c.id ? 'Loading...' : 'Preview →'}
                      </button>
                    ) : c.status === 'sent' ? (
                      <button onClick={() => handlePreview(c.id, 'follow_up')} disabled={previewing === c.id}
                        className="bg-white text-[#1a2e3b] px-3 py-1.5 rounded-lg text-[12px] font-semibold border border-[#d1ccc6] hover:bg-[#f0eeeb] disabled:opacity-50 cursor-pointer transition-colors">
                        {previewing === c.id ? 'Loading...' : 'Follow up'}
                      </button>
                    ) : null}
                    {c.website && (
                      <a href={c.website.startsWith('http') ? c.website : `https://${c.website}`} target="_blank" rel="noopener"
                        className="text-[11px] text-[#3b82f6] hover:underline ml-2">site</a>
                    )}
                    {c.trackingSlug && (
                      <a href={`https://supportive-ai.com/for/${c.trackingSlug}`} target="_blank" rel="noopener"
                        className="text-[11px] text-[#94a7b8] hover:text-[#1a2e3b] ml-2">🔗</a>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        {contacts.length === 0 && (
          <div className="text-center py-12 text-[#94a7b8] text-[14px]">
            No contacts yet. Import your CSV to get started.
          </div>
        )}
      </div>

      {/* Pagination */}
      {total > PAGE_SIZE && (
        <div className="flex items-center justify-between mt-4">
          <span className="text-[13px] text-[#94a7b8]">
            Showing {page * PAGE_SIZE + 1}-{Math.min((page + 1) * PAGE_SIZE, total)} of {total}
          </span>
          <div className="flex gap-2">
            <button onClick={() => setPage(p => Math.max(0, p - 1))} disabled={page === 0}
              className="px-3 py-1.5 rounded-lg text-[13px] font-semibold border border-[#d1ccc6] bg-white text-[#1a2e3b] hover:bg-[#f0eeeb] disabled:opacity-40 cursor-pointer transition-colors">
              ← Prev
            </button>
            <span className="px-3 py-1.5 text-[13px] text-[#5a7184]">
              Page {page + 1} of {Math.ceil(total / PAGE_SIZE)}
            </span>
            <button onClick={() => setPage(p => p + 1)} disabled={(page + 1) * PAGE_SIZE >= total}
              className="px-3 py-1.5 rounded-lg text-[13px] font-semibold border border-[#d1ccc6] bg-white text-[#1a2e3b] hover:bg-[#f0eeeb] disabled:opacity-40 cursor-pointer transition-colors">
              Next →
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
