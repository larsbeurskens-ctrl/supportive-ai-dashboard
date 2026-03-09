'use client';

import { useState, useEffect, useCallback } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';

const ADMIN_EMAIL = 'larsbeurskens@gmail.com';

interface Activity {
  id: string;
  createdAt: string;
  type: string;
  outcome: string | null;
  notes: string | null;
}

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
  lastContactedAt: string | null;
  trackingSlug: string | null;
  emailTemplate: string | null;
  notes: string | null;
  _count: { activities: number };
}

interface Pipeline { total: number; unsent: number; sent: number; called: number; spoke: number; interested: number; not_interested: number; signed_up: number; }

const VERTICAL_LABELS: Record<string, string> = {
  plumbing: '🔧 Plumbing', window_cleaning: '🪟 Window Cleaning', hvac: '❄️ HVAC',
};
const STATUS_STYLES: Record<string, { bg: string; text: string; label: string }> = {
  unsent: { bg: 'bg-[#f5f4f2]', text: 'text-[#5a7184]', label: 'Unsent' },
  sent: { bg: 'bg-[#eff6ff]', text: 'text-[#3b82f6]', label: 'Emailed' },
  clicked: { bg: 'bg-[#fef3e0]', text: 'text-[#e8930c]', label: 'Clicked' },
  called: { bg: 'bg-[#fef3e0]', text: 'text-[#e8930c]', label: 'Called' },
  voicemail: { bg: 'bg-[#fef3e0]', text: 'text-[#d97706]', label: 'Voicemail' },
  spoke: { bg: 'bg-[#ecfdf5]', text: 'text-[#059669]', label: 'Spoke' },
  demo_played: { bg: 'bg-[#ecfdf5]', text: 'text-[#047857]', label: 'Demo played' },
  interested: { bg: 'bg-[#dcfce7]', text: 'text-[#16a34a]', label: '🔥 Interested' },
  not_interested: { bg: 'bg-[#fef2f2]', text: 'text-[#dc2626]', label: 'Not interested' },
  signed_up: { bg: 'bg-[#dcfce7]', text: 'text-[#059669]', label: '✅ Signed up' },
};
const OUTCOME_OPTIONS = [
  { value: 'no_answer', label: 'No answer' },
  { value: 'voicemail', label: 'Left voicemail' },
  { value: 'spoke', label: 'Spoke with them' },
  { value: 'demo_played', label: 'Played demo' },
  { value: 'interested', label: 'Interested!' },
  { value: 'not_interested', label: 'Not interested' },
  { value: 'callback_scheduled', label: 'Callback scheduled' },
];

function timeAgo(d: string | null) {
  if (!d) return '';
  const diff = Date.now() - new Date(d).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  return `${Math.floor(hrs / 24)}d ago`;
}

export default function OutreachSendPage() {
  const { data: session, status: authStatus } = useSession();
  const router = useRouter();
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [pipeline, setPipeline] = useState<Pipeline>({ total: 0, unsent: 0, sent: 0, called: 0, spoke: 0, interested: 0, not_interested: 0, signed_up: 0 });
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

  // Activity log state
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loadingActivities, setLoadingActivities] = useState(false);
  const [logCallId, setLogCallId] = useState<string | null>(null);
  const [logOutcome, setLogOutcome] = useState('no_answer');
  const [logNotes, setLogNotes] = useState('');
  const [savingLog, setSavingLog] = useState(false);

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
        method: 'POST', headers: { 'Content-Type': 'application/json' },
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
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ contactId, template }),
      });
      if (res.ok) { setPreview({ ...(await res.json()), contactId, template }); }
      else { alert('Preview failed'); }
    } catch { alert('Preview failed'); }
    finally { setPreviewing(null); }
  }

  async function fetchActivities(contactId: string) {
    setLoadingActivities(true);
    const res = await fetch(`/api/admin/outreach-contacts/activities?contactId=${contactId}`);
    if (res.ok) setActivities(await res.json());
    setLoadingActivities(false);
  }

  function toggleExpand(contactId: string) {
    if (expandedId === contactId) { setExpandedId(null); return; }
    setExpandedId(contactId);
    fetchActivities(contactId);
  }

  async function handleLogCall() {
    if (!logCallId) return;
    setSavingLog(true);
    try {
      await fetch('/api/admin/outreach-contacts/activities', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ contactId: logCallId, type: 'call', outcome: logOutcome, notes: logNotes || null }),
      });
      setLogCallId(null);
      setLogOutcome('no_answer');
      setLogNotes('');
      await fetchContacts();
      if (expandedId) fetchActivities(expandedId);
    } catch { alert('Failed to save'); }
    finally { setSavingLog(false); }
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
      const slug = bizName.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '').slice(0, 40);
      const resolvedEmail = email.includes('@') ? email : `${slug || 'unknown'}@no-email.placeholder`;
      return {
        email: resolvedEmail, name: row['first_name'] || '', businessName: bizName,
        phone: row['phone'] || '', vertical: row['vertical'] || 'plumbing',
        score: parseInt(row['_score'] || row['score'] || '0') || 0,
        painSignal: row['pain_signals'] || row['painSignal'] || '',
        website: row['website'] || '', notes: row['metro'] ? `Metro: ${row['metro']}` : '',
      };
    }).filter(c => c.businessName);
    if (contacts.length === 0) { setImportResult('No valid contacts found.'); setImporting(false); return; }
    const res = await fetch('/api/admin/outreach-contacts', {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ contacts }),
    });
    const data = await res.json();
    setImportResult(data.error ? `Error: ${data.error}` : `Imported ${data.imported}, skipped ${data.skipped} (of ${data.total})`);
    setImporting(false);
    await fetchContacts();
    e.target.value = '';
  }

  if (loading) {
    return <div className="flex items-center justify-center py-20"><div className="w-6 h-6 border-2 border-[#1a2e3b] border-t-transparent rounded-full animate-spin" /></div>;
  }

  return (
    <div>
      {/* Log Call Modal */}
      {logCallId && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={() => setLogCallId(null)}>
          <div className="bg-white rounded-2xl max-w-[440px] w-full" onClick={e => e.stopPropagation()}>
            <div className="px-6 py-4 border-b border-[#e5e0da]">
              <h3 className="text-[16px] font-bold text-[#1a2e3b]">Log call</h3>
              <p className="text-[12px] text-[#94a7b8]">{contacts.find(c => c.id === logCallId)?.businessName}</p>
            </div>
            <div className="px-6 py-4 space-y-4">
              <div>
                <label className="block text-[12px] font-semibold text-[#5a7184] mb-1.5">Outcome</label>
                <select value={logOutcome} onChange={e => setLogOutcome(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-lg border border-[#d1ccc6] text-[14px] text-[#1a2e3b] bg-white">
                  {OUTCOME_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-[12px] font-semibold text-[#5a7184] mb-1.5">Notes</label>
                <textarea value={logNotes} onChange={e => setLogNotes(e.target.value)} rows={3} placeholder="Call back Thursday. Seemed interested but busy..."
                  className="w-full px-3 py-2.5 rounded-lg border border-[#d1ccc6] text-[14px] text-[#1a2e3b] placeholder-[#94a7b8] resize-none" />
              </div>
            </div>
            <div className="px-6 py-4 border-t border-[#e5e0da] flex justify-end gap-3">
              <button onClick={() => setLogCallId(null)} className="px-4 py-2 rounded-lg text-[13px] font-semibold text-[#5a7184] border border-[#d1ccc6] bg-white hover:bg-[#f0eeeb] cursor-pointer transition-colors">Cancel</button>
              <button onClick={handleLogCall} disabled={savingLog}
                className="px-5 py-2 rounded-lg text-[13px] font-bold text-white bg-[#1a2e3b] hover:bg-[#243d4e] disabled:opacity-50 cursor-pointer border-none transition-colors">
                {savingLog ? 'Saving...' : 'Save'}
              </button>
            </div>
          </div>
        </div>
      )}
      {/* Preview Modal */}
      {preview && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={() => setPreview(null)}>
          <div className="bg-white rounded-2xl max-w-[640px] w-full max-h-[90vh] flex flex-col overflow-hidden" onClick={e => e.stopPropagation()}>
            <div className="px-6 py-4 border-b border-[#e5e0da] flex items-center justify-between">
              <div>
                <h3 className="text-[16px] font-bold text-[#1a2e3b]">Email Preview</h3>
                <p className="text-[12px] text-[#94a7b8]">{preview.template === 'follow_up' ? 'Follow-up' : 'First touch'}</p>
              </div>
              <button onClick={() => setPreview(null)} className="text-[#94a7b8] hover:text-[#1a2e3b] text-xl cursor-pointer bg-transparent border-none">✕</button>
            </div>
            <div className="px-6 py-4 border-b border-[#e5e0da] space-y-2 bg-[#faf9f7]">
              <div className="flex gap-2 text-[13px]"><span className="text-[#94a7b8] w-16">From:</span><span className="text-[#1a2e3b] font-medium">{preview.from}</span></div>
              <div className="flex gap-2 text-[13px]"><span className="text-[#94a7b8] w-16">To:</span><span className="text-[#1a2e3b] font-medium">{preview.to}</span></div>
              <div className="flex gap-2 text-[13px]"><span className="text-[#94a7b8] w-16">Subject:</span><span className="text-[#1a2e3b] font-semibold">{preview.subject}</span></div>
            </div>
            <div className="px-6 py-4 overflow-y-auto flex-1 min-h-0" style={{ maxHeight: '40vh' }}>
              <div className="border border-[#e5e0da] rounded-xl p-5" dangerouslySetInnerHTML={{ __html: preview.html }} />
            </div>
            <div className="px-6 py-4 border-t-2 border-[#e5e0da] flex justify-end gap-3 flex-shrink-0 bg-[#faf9f7]">
              <button onClick={() => setPreview(null)} className="px-4 py-2 rounded-lg text-[13px] font-semibold text-[#5a7184] border border-[#d1ccc6] hover:bg-[#f0eeeb] cursor-pointer bg-white transition-colors">Cancel</button>
              <button onClick={async () => { await handleSend(preview.contactId, preview.template); setPreview(null); }} disabled={sending === preview.contactId}
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
      {importResult && <div className="bg-[#eef9f0] text-[#059669] text-[13px] font-medium px-4 py-2 rounded-lg mb-4">{importResult}</div>}

      {/* Pipeline Stats */}
      <div className="grid grid-cols-4 lg:grid-cols-8 gap-3 mb-6">
        {[
          { label: 'Total', value: pipeline.total, color: '#1a2e3b' },
          { label: 'Unsent', value: pipeline.unsent, color: '#94a7b8' },
          { label: 'Emailed', value: pipeline.sent, color: '#3b82f6' },
          { label: 'Called', value: pipeline.called, color: '#e8930c' },
          { label: 'Spoke', value: pipeline.spoke, color: '#059669' },
          { label: 'Interested', value: pipeline.interested, color: '#16a34a' },
          { label: 'Not int.', value: pipeline.not_interested, color: '#dc2626' },
          { label: 'Signed up', value: pipeline.signed_up, color: '#059669' },
        ].map(s => (
          <div key={s.label} className="bg-white rounded-xl border border-[#e5e0da] p-3 text-center">
            <div className="text-[20px] font-extrabold" style={{ color: s.color }}>{s.value}</div>
            <div className="text-[10px] font-semibold text-[#94a7b8] uppercase tracking-wide">{s.label}</div>
          </div>
        ))}
      </div>
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
          <option value="sent">Emailed</option>
          <option value="called">Called</option>
          <option value="voicemail">Voicemail</option>
          <option value="spoke">Spoke</option>
          <option value="demo_played">Demo played</option>
          <option value="interested">Interested</option>
          <option value="not_interested">Not interested</option>
          <option value="signed_up">Signed up</option>
        </select>
      </div>

      {/* Contacts Table */}
      <div className="bg-white rounded-xl border border-[#e5e0da] overflow-hidden">
        <table className="w-full text-left">
          <thead>
            <tr className="border-b border-[#e5e0da] bg-[#faf9f7]">
              <th className="px-4 py-3 text-[11px] font-semibold text-[#5a7184] uppercase tracking-wide">Business</th>
              <th className="px-4 py-3 text-[11px] font-semibold text-[#5a7184] uppercase tracking-wide">Contact</th>
              <th className="px-4 py-3 text-[11px] font-semibold text-[#5a7184] uppercase tracking-wide">Vertical</th>
              <th className="px-4 py-3 text-[11px] font-semibold text-[#5a7184] uppercase tracking-wide w-16">Score</th>
              <th className="px-4 py-3 text-[11px] font-semibold text-[#5a7184] uppercase tracking-wide">Status</th>
              <th className="px-4 py-3 text-[11px] font-semibold text-[#5a7184] uppercase tracking-wide w-56">Actions</th>
            </tr>
          </thead>
          <tbody>
            {contacts.map(c => {
              const st = STATUS_STYLES[c.status] || STATUS_STYLES.unsent;
              const isExpanded = expandedId === c.id;
              const hasEmail = !c.email.endsWith('@no-email.placeholder');
              return (
                <tr key={c.id} className={`border-b border-[#f0eeeb] last:border-0 ${isExpanded ? 'bg-[#faf9f7]' : 'hover:bg-[#faf9f7]'}`}>
                  <td className="px-4 py-3 align-top">
                    <div className="text-[13px] font-semibold text-[#1a2e3b] truncate max-w-[200px] cursor-pointer hover:text-[#3b82f6]"
                      onClick={() => toggleExpand(c.id)}>{c.businessName || '—'}</div>
                    {c.painSignal && <div className="text-[11px] text-[#e8930c] mt-0.5">🔥 {c.painSignal}</div>}
                    {c.lastContactedAt && <div className="text-[10px] text-[#94a7b8] mt-0.5">Last contact: {timeAgo(c.lastContactedAt)}</div>}
                    {c._count.activities > 0 && <div className="text-[10px] text-[#94a7b8]">{c._count.activities} interaction{c._count.activities !== 1 ? 's' : ''}</div>}
                  </td>
                  <td className="px-4 py-3 align-top">
                    <div className="text-[13px] text-[#1a2e3b] truncate max-w-[200px]">
                      {hasEmail ? c.email : <span className="text-[#94a7b8] italic">needs email</span>}
                    </div>
                    {c.phone && <div className="text-[11px] text-[#94a7b8]">{c.phone}</div>}
                  </td>
                  <td className="px-4 py-3 text-[12px] text-[#5a7184] align-top">{VERTICAL_LABELS[c.vertical] || c.vertical}</td>
                  <td className="px-4 py-3 text-[13px] font-bold text-[#1a2e3b] text-center align-top">{c.score}</td>
                  <td className="px-4 py-3 align-top">
                    <span className={`inline-block text-[11px] font-semibold px-2 py-0.5 rounded-full ${st.bg} ${st.text}`}>{st.label}</span>
                    {c.sentAt && <div className="text-[10px] text-[#94a7b8] mt-0.5">{timeAgo(c.sentAt)}</div>}
                  </td>
                  <td className="px-4 py-3 align-top">
                    <div className="flex flex-wrap items-center gap-1.5">
                      {/* Log call button — always visible if has phone */}
                      {c.phone && (
                        <button onClick={() => { setLogCallId(c.id); setLogOutcome('no_answer'); setLogNotes(''); }}
                          className="bg-[#1a2e3b] text-white px-2.5 py-1 rounded-lg text-[11px] font-semibold hover:bg-[#243d4e] cursor-pointer border-none transition-colors">
                          📞 Log call
                        </button>
                      )}
                      {/* Email actions */}
                      {hasEmail && c.status === 'unsent' && (
                        <button onClick={() => handlePreview(c.id, 'first_touch')} disabled={previewing === c.id}
                          className="bg-[#e8930c] text-white px-2.5 py-1 rounded-lg text-[11px] font-semibold hover:bg-[#d17f00] disabled:opacity-50 cursor-pointer border-none transition-colors">
                          {previewing === c.id ? '...' : '✉️ Email'}
                        </button>
                      )}
                      {hasEmail && (c.status === 'sent' || c.status === 'called' || c.status === 'voicemail') && (
                        <button onClick={() => handlePreview(c.id, 'follow_up')} disabled={previewing === c.id}
                          className="bg-white text-[#1a2e3b] px-2.5 py-1 rounded-lg text-[11px] font-semibold border border-[#d1ccc6] hover:bg-[#f0eeeb] disabled:opacity-50 cursor-pointer transition-colors">
                          {previewing === c.id ? '...' : 'Follow up'}
                        </button>
                      )}
                      {c.website && (
                        <a href={c.website.startsWith('http') ? c.website : `https://${c.website}`} target="_blank" rel="noopener"
                          className="text-[11px] text-[#3b82f6] hover:underline">site</a>
                      )}
                    </div>
                  </td>
                </tr>
              );
            }).flatMap((row, i) => {
              const c = contacts[i];
              if (expandedId !== c.id) return [row];
              return [row, (
                <tr key={`${c.id}-exp`} className="bg-[#faf9f7]">
                  <td colSpan={6} className="px-6 py-4 border-b border-[#e5e0da]">
                    <div className="flex items-center justify-between mb-3">
                      <p className="text-[12px] font-bold text-[#5a7184] uppercase tracking-wider">Activity history</p>
                      <button onClick={() => { setLogCallId(c.id); setLogOutcome('no_answer'); setLogNotes(''); }}
                        className="text-[12px] font-semibold text-[#3b82f6] hover:underline cursor-pointer bg-transparent border-none">+ Log activity</button>
                    </div>
                    {loadingActivities ? (
                      <div className="py-2"><div className="w-4 h-4 border-2 border-[#1a2e3b] border-t-transparent rounded-full animate-spin" /></div>
                    ) : activities.length === 0 ? (
                      <p className="text-[13px] text-[#94a7b8] py-2">No activity logged yet.</p>
                    ) : (
                      <div className="space-y-2 max-h-[250px] overflow-y-auto">
                        {activities.map(a => (
                          <div key={a.id} className="flex items-start gap-3 py-2 border-b border-[#e5e0da] last:border-0">
                            <div className="w-6 h-6 rounded-full bg-[#eff6ff] flex items-center justify-center flex-shrink-0 mt-0.5">
                              <span className="text-[11px]">{a.type === 'call' ? '📞' : a.type === 'email' ? '✉️' : '📝'}</span>
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2">
                                <span className="text-[13px] font-semibold text-[#1a2e3b] capitalize">{a.type}</span>
                                {a.outcome && <span className={`text-[11px] font-semibold px-1.5 py-0.5 rounded-full ${(STATUS_STYLES[a.outcome] || STATUS_STYLES.unsent).bg} ${(STATUS_STYLES[a.outcome] || STATUS_STYLES.unsent).text}`}>
                                  {OUTCOME_OPTIONS.find(o => o.value === a.outcome)?.label || a.outcome}
                                </span>}
                                <span className="text-[11px] text-[#94a7b8]">{timeAgo(a.createdAt)}</span>
                              </div>
                              {a.notes && <p className="text-[12px] text-[#5a7184] mt-0.5">{a.notes}</p>}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </td>
                </tr>
              )];
            })}
          </tbody>
        </table>
        {contacts.length === 0 && (
          <div className="text-center py-12 text-[#94a7b8] text-[14px]">No contacts yet. Import your CSV to get started.</div>
        )}
      </div>

      {/* Pagination */}
      {total > PAGE_SIZE && (
        <div className="flex items-center justify-between mt-4">
          <span className="text-[13px] text-[#94a7b8]">Showing {page * PAGE_SIZE + 1}-{Math.min((page + 1) * PAGE_SIZE, total)} of {total}</span>
          <div className="flex gap-2">
            <button onClick={() => setPage(p => Math.max(0, p - 1))} disabled={page === 0}
              className="px-3 py-1.5 rounded-lg text-[13px] font-semibold border border-[#d1ccc6] bg-white text-[#1a2e3b] hover:bg-[#f0eeeb] disabled:opacity-40 cursor-pointer transition-colors">← Prev</button>
            <span className="px-3 py-1.5 text-[13px] text-[#5a7184]">Page {page + 1} of {Math.ceil(total / PAGE_SIZE)}</span>
            <button onClick={() => setPage(p => p + 1)} disabled={(page + 1) * PAGE_SIZE >= total}
              className="px-3 py-1.5 rounded-lg text-[13px] font-semibold border border-[#d1ccc6] bg-white text-[#1a2e3b] hover:bg-[#f0eeeb] disabled:opacity-40 cursor-pointer transition-colors">Next →</button>
          </div>
        </div>
      )}
    </div>
  );
}
