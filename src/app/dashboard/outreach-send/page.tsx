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
  mobilePhone: string | null;
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
  textSequence: number;
  hasUnreadReply: boolean;
  lastReplyAt: string | null;
  lastReplyText: string | null;
  emailOpenedAt: string | null;
  linkClickedAt: string | null;
  nextActionAt: string | null;
  nextActionNote: string | null;
  _count: { activities: number };
  activities: Activity[];
}

interface Pipeline { total: number; has_email: number; emailed: number; opened: number; clicked: number; texted: number; called: number; spoke: number; interested: number; not_interested: number; signed_up: number; unread_replies: number; }

interface SMSMessage { id: string; direction: string; body: string; createdAt: string; status: string; }
interface SMSConversation { id: string; fromNumber: string; toNumber: string; toName: string | null; toCompany: string | null; unread: boolean; lastMessage: string; lastAt: string; messages: SMSMessage[]; }

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'https://supportive-ai-backend-production.up.railway.app';

const VERTICAL_LABELS: Record<string, string> = {
  plumbing: '🔧 Plumbing', window_cleaning: '🪟 Window Cleaning', hvac: '❄️ HVAC', plumbing_uk: '🔧 Plumbing (UK)', window_cleaning_uk: '🪟 Window Cleaning (UK)',
};
const STATUS_STYLES: Record<string, { bg: string; text: string; label: string }> = {
  unsent: { bg: 'bg-[#f5f4f2]', text: 'text-[#5a7184]', label: 'Unsent' },
  sent: { bg: 'bg-[#eff6ff]', text: 'text-[#3b82f6]', label: 'Emailed' },
  opened: { bg: 'bg-[#fef3e0]', text: 'text-[#d97706]', label: '👀 Opened' },
  texted: { bg: 'bg-[#f0fdf4]', text: 'text-[#059669]', label: 'Texted' },
  clicked: { bg: 'bg-[#fef3e0]', text: 'text-[#e8930c]', label: 'Clicked' },
  called: { bg: 'bg-[#fef3e0]', text: 'text-[#e8930c]', label: 'Called' },
  voicemail: { bg: 'bg-[#fef3e0]', text: 'text-[#d97706]', label: 'Voicemail' },
  spoke: { bg: 'bg-[#ecfdf5]', text: 'text-[#059669]', label: 'Spoke' },
  demo_played: { bg: 'bg-[#ecfdf5]', text: 'text-[#047857]', label: 'Demo played' },
  interested: { bg: 'bg-[#dcfce7]', text: 'text-[#16a34a]', label: '🔥 Interested' },
  not_interested: { bg: 'bg-[#fef2f2]', text: 'text-[#dc2626]', label: 'Not interested' },
  signed_up: { bg: 'bg-[#dcfce7]', text: 'text-[#059669]', label: '✅ Signed up' },
  bounced: { bg: 'bg-[#fef2f2]', text: 'text-[#dc2626]', label: '⛔ Bounced' },
};
const OUTCOME_OPTIONS = [
  { value: 'no_answer', label: 'No answer' },
  { value: 'voicemail', label: 'Left voicemail' },
  { value: 'spoke', label: 'Spoke with them' },
  { value: 'demo_played', label: 'Played demo' },
  { value: 'interested', label: 'Interested!' },
  { value: 'not_interested', label: 'Not interested' },
  { value: 'callback_scheduled', label: 'Callback scheduled' },
  { value: 'note', label: 'Just a note' },
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
  const [pipeline, setPipeline] = useState<Pipeline>({ total: 0, has_email: 0, emailed: 0, opened: 0, clicked: 0, texted: 0, called: 0, spoke: 0, interested: 0, not_interested: 0, signed_up: 0, unread_replies: 0 });
  const [loading, setLoading] = useState(true);
  const [filterVertical, setFilterVertical] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [searchDebounce, setSearchDebounce] = useState('');
  const [sortBy, setSortBy] = useState('score');
  const [followUps, setFollowUps] = useState<{ email: Contact[]; call: Contact[]; text: Contact[] }>({ email: [], call: [], text: [] });
  const [actionItems, setActionItems] = useState<Contact[]>([]);  const [sending, setSending] = useState<string | null>(null);
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
  const [editSubject, setEditSubject] = useState('');
  const [editHtml, setEditHtml] = useState('');

  // Activity log state
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loadingActivities, setLoadingActivities] = useState(false);
  const [logCallId, setLogCallId] = useState<string | null>(null);
  const [logOutcome, setLogOutcome] = useState('no_answer');
  const [logNotes, setLogNotes] = useState('');
  const [logNextDate, setLogNextDate] = useState('');
  const [logNextNote, setLogNextNote] = useState('');
  const [savingLog, setSavingLog] = useState(false);
  const [callingId, setCallingId] = useState<string | null>(null);

  // SMS state
  const [smsContact, setSmsContact] = useState<Contact | null>(null);
  const [smsBody, setSmsBody] = useState('');
  const [smsIsFollowUp, setSmsIsFollowUp] = useState(false);
  const [sendingSms, setSendingSms] = useState(false);

  // Conversation thread state
  const [threadContact, setThreadContact] = useState<Contact | null>(null);
  const [threadMessages, setThreadMessages] = useState<SMSMessage[]>([]);
  const [threadLoading, setThreadLoading] = useState(false);
  const [threadReply, setThreadReply] = useState('');
  const [threadSending, setThreadSending] = useState(false);

  // Mobile phone edit state
  const [editMobileId, setEditMobileId] = useState<string | null>(null);
  const [editMobileValue, setEditMobileValue] = useState('');
  const [editEmailId, setEditEmailId] = useState<string | null>(null);
  const [editEmailValue, setEditEmailValue] = useState('');

  async function handleSaveMobile(contactId: string) {
    await fetch('/api/admin/outreach-contacts', {
      method: 'PATCH', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ contactId, mobilePhone: editMobileValue.trim() }),
    });
    setEditMobileId(null);
    setEditMobileValue('');
    await fetchContacts();
  }

  async function handleSaveEmail(contactId: string) {
    await fetch('/api/admin/outreach-contacts', {
      method: 'PATCH', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ contactId, email: editEmailValue.trim() }),
    });
    setEditEmailId(null);
    setEditEmailValue('');
    await fetchContacts();
  }

  async function handleMarkRead(contactId: string) {
    await fetch('/api/admin/outreach-contacts', {
      method: 'PATCH', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ contactId, hasUnreadReply: false }),
    });
    await fetchContacts();
  }

  useEffect(() => {
    if (authStatus === 'authenticated' && session?.user?.email !== ADMIN_EMAIL) {
      router.replace('/dashboard');
    }
  }, [authStatus, session, router]);

  const fetchContacts = useCallback(async () => {
    const params = new URLSearchParams();
    if (filterVertical) params.set('vertical', filterVertical);
    if (filterStatus) params.set('status', filterStatus);
    if (searchDebounce) params.set('search', searchDebounce);
    params.set('sort', sortBy);
    params.set('limit', String(PAGE_SIZE));
    params.set('offset', String(page * PAGE_SIZE));
    const res = await fetch(`/api/admin/outreach-contacts?${params}`);
    if (res.ok) {
      const data = await res.json();
      setContacts(data.contacts);
      setPipeline(data.pipeline);
      setTotal(data.total);
      if (data.followUps) setFollowUps(data.followUps);
      if (data.actionItems) setActionItems(data.actionItems);
    } else {
      console.error('Outreach API error:', res.status, await res.text().catch(() => ''));
      setContacts([]);
      setTotal(0);
    }
    setLoading(false);
  }, [filterVertical, filterStatus, searchDebounce, sortBy, page]);

  // Debounce search input
  useEffect(() => {
    const timer = setTimeout(() => { setSearchDebounce(searchQuery); setPage(0); }, 300);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  useEffect(() => { fetchContacts(); }, [fetchContacts]);

  async function handleSend(contactId: string, template: string, customSubject?: string, customHtml?: string) {
    setSending(contactId);
    try {
      const res = await fetch('/api/admin/outreach-contacts/send', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ contactId, template, customSubject, customHtml }),
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
      if (res.ok) { const data = await res.json(); setPreview({ ...data, contactId, template }); setEditSubject(data.subject); setEditHtml(data.html); }
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

  async function handleDeleteContact(contactId: string, name: string) {
    if (!confirm(`Delete ${name}? This can't be undone.`)) return;
    try {
      await fetch('/api/admin/outreach-contacts', {
        method: 'DELETE', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ contactId }),
      });
      await fetchContacts();
    } catch { alert('Delete failed'); }
  }

  async function handleLogCall() {
    if (!logCallId) return;
    setSavingLog(true);
    try {
      await fetch('/api/admin/outreach-contacts/activities', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contactId: logCallId, type: 'call', outcome: logOutcome, notes: logNotes || null,
          nextActionAt: logNextDate ? new Date(logNextDate + 'T09:00:00').toISOString() : null,
          nextActionNote: logNextNote || null,
        }),
      });
      setLogCallId(null);
      setLogOutcome('no_answer');
      setLogNotes('');
      setLogNextDate('');
      setLogNextNote('');
      await fetchContacts();
      if (expandedId) fetchActivities(expandedId);
    } catch { alert('Failed to save'); }
    finally { setSavingLog(false); }
  }

  async function handleTwilioCall(contact: Contact) {
    const phone = contact.mobilePhone || contact.phone;
    if (!phone) { alert('No phone number for this contact'); return; }
    setCallingId(contact.id);
    try {
      const resp = await fetch(`${API_BASE}/api/outreach/call`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ to: phone, contactName: contact.name || contact.businessName, contactCompany: contact.businessName }),
      });
      const data = await resp.json();
      if (data.success) {
        alert(`📞 Calling your phone now!\n\nWhen you pick up, you'll be connected to ${contact.name || contact.businessName}.`);
        // Auto-open the log modal after the call is initiated
        setLogCallId(contact.id);
        setLogOutcome('spoke');
        setLogNotes('');
      } else {
        alert('Call failed: ' + (data.error || 'Unknown error'));
      }
    } catch (err) { alert('Failed to initiate call'); }
    finally { setCallingId(null); }
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

  const DEMO_NUMBERS: Record<string, string> = {
    plumbing: '(240) 301-1473', window_cleaning: '(845) 209-2401', hvac: '(737) 327-8220',
    plumbing_uk: '+44 7427 846243', window_cleaning_uk: '+44 7427 846243',
  };
  const LANDING_PAGES: Record<string, string> = {
    plumbing: 'https://supportive-ai.com/plumbing#hear-it',
    window_cleaning: 'https://supportive-ai.com/window-cleaning#hear-it',
    hvac: 'https://supportive-ai.com/hvac#hear-it',
    plumbing_uk: 'https://supportive-ai.com/plumbing#hear-it',
    window_cleaning_uk: 'https://supportive-ai.com/window-cleaning#hear-it',
  };

  function openSmsModal(contact: Contact, isFollowUp: boolean) {
    setSmsContact(contact);
    setSmsIsFollowUp(isFollowUp);
    const verticalLabel = contact.vertical === 'window_cleaning' ? 'window cleaning' : contact.vertical === 'window_cleaning_uk' ? 'window cleaning' : contact.vertical === 'plumbing_uk' ? 'plumbing' : contact.vertical;
    const demo = DEMO_NUMBERS[contact.vertical] || DEMO_NUMBERS.plumbing;
    const link = LANDING_PAGES[contact.vertical] || LANDING_PAGES.plumbing;
    const isUKContact = contact.vertical.endsWith('_uk');
    const seq = (contact.textSequence || 0) + 1;
    const firstName = contact.name ? contact.name.split(' ')[0] : '';
    if (seq === 1 && !isFollowUp) {
      setSmsBody(`Thanks for the good chat just now, it's Lars from Supportive AI. Here's your link: ${link}\nOn there you can hear how the receptionist sounds for ${verticalLabel} companies. You can also try it yourself by calling the demo number: ${demo}\nIf it feels like a fit, you can create a free account and hear a version set up for your own business before switching anything live.`);
    } else if (seq === 2 || (isFollowUp && (contact.textSequence || 0) <= 1)) {
      setSmsBody(`Hey${firstName ? ` ${firstName}` : ''}, just checking in — did you get a chance to listen to the AI receptionist demo I sent over? Happy to answer any questions. - Lars`);
    } else {
      setSmsBody(`Hey${firstName ? ` ${firstName}` : ''}, last nudge from me — the demo line is still live if you want to hear it: ${demo}. No pressure, just thought it could help. - Lars`);
    }
  }

  async function handleSendSms() {
    if (!smsContact || !smsBody.trim()) return;
    setSendingSms(true);
    try {
      const res = await fetch('/api/admin/outreach-contacts/text', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ contactId: smsContact.id, body: smsBody.trim(), isFollowUp: smsIsFollowUp }),
      });
      if (res.ok) {
        setSmsContact(null); setSmsBody('');
        await fetchContacts();
        if (expandedId) fetchActivities(expandedId);
      } else {
        const d = await res.json();
        alert(d.error || 'Failed to send text');
      }
    } catch { alert('Failed to send text'); }
    finally { setSendingSms(false); }
  }

  async function openThread(contact: Contact) {
    setThreadContact(contact);
    setThreadLoading(true);
    setThreadMessages([]);
    setThreadReply('');
    try {
      // Get conversations from backend, find one matching this contact's phone
      const phone = (contact.phone || '').replace(/\D/g, '').slice(-10);
      const res = await fetch(`${API_BASE}/api/sms/conversations`);
      if (res.ok) {
        const convos: SMSConversation[] = await res.json();
        const match = convos.find((c: SMSConversation) => c.toNumber.replace(/\D/g, '').slice(-10) === phone);
        if (match) {
          const convoRes = await fetch(`${API_BASE}/api/sms/conversations/${match.id}`);
          if (convoRes.ok) {
            const full: SMSConversation = await convoRes.json();
            setThreadMessages(full.messages || []);
          }
        }
      }
      // Mark as read in outreach contact
      if (contact.hasUnreadReply) {
        await fetch('/api/admin/outreach-contacts', {
          method: 'PATCH', headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ contactId: contact.id, hasUnreadReply: false }),
        });
        await fetchContacts();
      }
    } catch (e) { console.error('Thread load error:', e); }
    finally { setThreadLoading(false); }
  }

  async function handleThreadReply() {
    if (!threadContact || !threadReply.trim()) return;
    setThreadSending(true);
    try {
      const res = await fetch('/api/admin/outreach-contacts/text', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ contactId: threadContact.id, body: threadReply.trim(), isFollowUp: true }),
      });
      if (res.ok) {
        setThreadReply('');
        // Reload thread
        await openThread(threadContact);
        await fetchContacts();
      } else {
        const d = await res.json();
        alert(d.error || 'Failed to send');
      }
    } catch { alert('Failed to send reply'); }
    finally { setThreadSending(false); }
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
              <h3 className="text-[16px] font-bold text-[#1a2e3b]">Log activity</h3>
              <p className="text-[12px] text-[#94a7b8]">{[...contacts, ...followUps.email, ...followUps.call, ...(followUps.text || [])].find(c => c.id === logCallId)?.businessName}</p>
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
              <div className="border-t border-[#f0eeeb] pt-3">
                <label className="block text-[12px] font-semibold text-[#5a7184] mb-1.5">⚡ Next action (optional)</label>
                <div className="flex gap-2">
                  <input type="date" value={logNextDate} onChange={e => setLogNextDate(e.target.value)}
                    className="px-3 py-2 rounded-lg border border-[#d1ccc6] text-[13px] text-[#1a2e3b] bg-white" />
                  <input type="text" value={logNextNote} onChange={e => setLogNextNote(e.target.value)}
                    placeholder="e.g. Call back, Send follow-up..."
                    className="flex-1 px-3 py-2 rounded-lg border border-[#d1ccc6] text-[13px] text-[#1a2e3b] placeholder-[#94a7b8]" />
                </div>
                <p className="text-[11px] text-[#94a7b8] mt-1">Shows as an action item on the due date.</p>
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
              <div className="flex gap-2 text-[13px] items-center"><span className="text-[#94a7b8] w-16">Subject:</span>
                <input value={editSubject} onChange={e => setEditSubject(e.target.value)}
                  className="flex-1 px-2 py-1.5 rounded-lg border border-[#d1ccc6] text-[13px] font-semibold text-[#1a2e3b] bg-white" />
              </div>
            </div>
            <div className="px-6 py-4 overflow-y-auto flex-1 min-h-0" style={{ maxHeight: '40vh' }}>
              <div className="border border-[#e5e0da] rounded-xl p-5"
                contentEditable suppressContentEditableWarning
                onBlur={e => setEditHtml(e.currentTarget.innerHTML)}
                dangerouslySetInnerHTML={{ __html: editHtml }} />
            </div>
            <div className="px-6 py-4 border-t-2 border-[#e5e0da] flex justify-end gap-3 flex-shrink-0 bg-[#faf9f7]">
              <button onClick={() => setPreview(null)} className="px-4 py-2 rounded-lg text-[13px] font-semibold text-[#5a7184] border border-[#d1ccc6] hover:bg-[#f0eeeb] cursor-pointer bg-white transition-colors">Cancel</button>
              <button onClick={async () => { await handleSend(preview.contactId, preview.template, editSubject, editHtml); setPreview(null); }} disabled={sending === preview.contactId}
                className="px-5 py-2 rounded-lg text-[13px] font-bold text-white bg-[#e8930c] hover:bg-[#d17f00] disabled:opacity-50 cursor-pointer border-none transition-colors">
                {sending === preview.contactId ? 'Sending...' : 'Confirm & Send'}
              </button>
            </div>
          </div>
        </div>
      )}
      {/* SMS Modal */}
      {smsContact && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={() => setSmsContact(null)}>
          <div className="bg-white rounded-2xl max-w-[540px] w-full" onClick={e => e.stopPropagation()}>
            <div className="px-6 py-4 border-b border-[#e5e0da]">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-[16px] font-bold text-[#1a2e3b]">
                    Text {(smsContact.textSequence || 0) + 1}
                    {smsIsFollowUp ? ' (follow-up)' : ''}
                  </h3>
                  <p className="text-[12px] text-[#94a7b8]">{smsContact.businessName}</p>
                </div>
                {(smsContact.textSequence || 0) > 0 && (
                  <span className="text-[11px] font-semibold text-[#5a7184] bg-[#f5f4f2] px-2 py-1 rounded-full">
                    {smsContact.textSequence} text{smsContact.textSequence !== 1 ? 's' : ''} sent
                  </span>
                )}
              </div>
            </div>
            <div className="px-6 py-4 space-y-3">
              <div>
                <label className="block text-[12px] font-semibold text-[#5a7184] mb-1">Sending to</label>
                <div className="flex items-center gap-2">
                  <span className="text-[13px] text-[#1a2e3b] font-medium">
                    {smsContact.mobilePhone || smsContact.phone}
                    {smsContact.mobilePhone ? ' (mobile)' : ''}
                  </span>
                  {!smsContact.mobilePhone && (
                    <button onClick={() => { setEditMobileId(smsContact.id); setEditMobileValue(''); }}
                      className="text-[11px] text-[#3b82f6] hover:underline cursor-pointer bg-transparent border-none">
                      + Add mobile
                    </button>
                  )}
                </div>
                {editMobileId === smsContact.id && (
                  <div className="flex gap-2 mt-2">
                    <input type="tel" placeholder="(555) 123-4567" value={editMobileValue}
                      onChange={e => setEditMobileValue(e.target.value)}
                      className="flex-1 px-3 py-1.5 rounded-lg border border-[#d1ccc6] text-[13px]" />
                    <button onClick={() => handleSaveMobile(smsContact.id)}
                      className="px-3 py-1.5 rounded-lg text-[12px] font-semibold bg-[#1a2e3b] text-white cursor-pointer border-none">Save</button>
                    <button onClick={() => setEditMobileId(null)}
                      className="px-2 py-1.5 text-[12px] text-[#94a7b8] cursor-pointer bg-transparent border-none">✕</button>
                  </div>
                )}
              </div>
              <div>
                <label className="block text-[12px] font-semibold text-[#5a7184] mb-1.5">Message</label>
                <textarea value={smsBody} onChange={e => setSmsBody(e.target.value)} rows={6}
                  className="w-full px-3 py-2.5 rounded-lg border border-[#d1ccc6] text-[14px] text-[#1a2e3b] resize-none focus:outline-none focus:ring-2 focus:ring-[#0d9488]" />
                <p className="text-[11px] text-[#94a7b8] mt-1">{smsBody.length} characters · Sent from (845) 209-2401</p>
              </div>
            </div>
            <div className="px-6 py-4 border-t border-[#e5e0da] flex justify-end gap-3">
              <button onClick={() => setSmsContact(null)} className="px-4 py-2 rounded-lg text-[13px] font-semibold text-[#5a7184] border border-[#d1ccc6] bg-white hover:bg-[#f0eeeb] cursor-pointer transition-colors">Cancel</button>
              <button onClick={handleSendSms} disabled={sendingSms || !smsBody.trim()}
                className="px-5 py-2 rounded-lg text-[13px] font-bold text-white bg-[#059669] hover:bg-[#047857] disabled:opacity-50 cursor-pointer border-none transition-colors">
                {sendingSms ? 'Sending...' : `Send text ${(smsContact.textSequence || 0) + 1}`}
              </button>
            </div>
          </div>
        </div>
      )}
      {/* Thread Modal */}
      {threadContact && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={() => setThreadContact(null)}>
          <div className="bg-white rounded-2xl max-w-[540px] w-full max-h-[85vh] flex flex-col" onClick={e => e.stopPropagation()}>
            <div className="px-6 py-4 border-b border-[#e5e0da] flex items-center justify-between">
              <div>
                <h3 className="text-[16px] font-bold text-[#1a2e3b]">💬 {threadContact.businessName}</h3>
                <p className="text-[12px] text-[#94a7b8]">{threadContact.mobilePhone || threadContact.phone} · {threadContact.textSequence || 0} texts sent</p>
              </div>
              <button onClick={() => setThreadContact(null)} className="text-[#94a7b8] hover:text-[#1a2e3b] text-xl cursor-pointer bg-transparent border-none">✕</button>
            </div>
            <div className="flex-1 overflow-y-auto px-6 py-4 space-y-3 min-h-[200px] max-h-[50vh] bg-[#faf9f7]">
              {threadLoading ? (
                <div className="flex items-center justify-center py-8"><div className="w-5 h-5 border-2 border-[#1a2e3b] border-t-transparent rounded-full animate-spin" /></div>
              ) : threadMessages.length === 0 ? (
                <p className="text-[13px] text-[#94a7b8] text-center py-8">No messages yet. Send a text to start the conversation.</p>
              ) : (
                threadMessages.map(m => (
                  <div key={m.id} className={`flex ${m.direction === 'outbound' ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-[80%] rounded-xl px-3.5 py-2.5 ${
                      m.direction === 'outbound'
                        ? 'bg-[#1a2e3b] text-white'
                        : 'bg-white border border-[#e5e0da] text-[#1a2e3b]'
                    }`}>
                      <p className="text-[13px] whitespace-pre-wrap">{m.body}</p>
                      <p className={`text-[10px] mt-1 ${m.direction === 'outbound' ? 'text-white/60' : 'text-[#94a7b8]'}`}>
                        {new Date(m.createdAt).toLocaleString('en-US', { month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' })}
                        {m.direction === 'inbound' && ' · 📨 Reply'}
                      </p>
                    </div>
                  </div>
                ))
              )}
            </div>
            <div className="px-6 py-4 border-t border-[#e5e0da]">
              <div className="flex gap-2">
                <textarea value={threadReply} onChange={e => setThreadReply(e.target.value)} rows={2} placeholder="Type a reply..."
                  className="flex-1 px-3 py-2 rounded-lg border border-[#d1ccc6] text-[13px] text-[#1a2e3b] resize-none focus:outline-none focus:ring-2 focus:ring-[#0d9488]"
                  onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleThreadReply(); } }} />
                <button onClick={handleThreadReply} disabled={threadSending || !threadReply.trim()}
                  className="px-4 py-2 rounded-lg text-[13px] font-bold text-white bg-[#059669] hover:bg-[#047857] disabled:opacity-50 cursor-pointer border-none transition-colors self-end">
                  {threadSending ? '...' : 'Send'}
                </button>
              </div>
              <p className="text-[10px] text-[#94a7b8] mt-1">Enter to send · Shift+Enter for new line</p>
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
      <div className="grid grid-cols-3 lg:grid-cols-10 gap-3 mb-6">
        {[
          { label: 'Total', value: pipeline.total, color: '#1a2e3b' },
          { label: 'Has email', value: pipeline.has_email, color: '#3b82f6', filter: 'has_email' },
          { label: 'Emailed', value: pipeline.emailed, color: '#6366f1' },
          { label: '👀 Opened', value: pipeline.opened, color: pipeline.opened > 0 ? '#d97706' : '#94a7b8', filter: 'opened' },
          { label: '🔗 Clicked', value: pipeline.clicked, color: pipeline.clicked > 0 ? '#e8930c' : '#94a7b8', filter: 'clicked' },
          { label: 'Called', value: pipeline.called, color: '#e8930c' },
          { label: 'Texted', value: pipeline.texted, color: '#059669' },
          { label: '💬 Replies', value: pipeline.unread_replies, color: pipeline.unread_replies > 0 ? '#dc2626' : '#94a7b8' },
          { label: 'Interested', value: pipeline.interested, color: '#16a34a' },
          { label: 'Signed up', value: pipeline.signed_up, color: '#059669' },
        ].map(s => (
          <div key={s.label} className={`bg-white rounded-xl border border-[#e5e0da] p-3 text-center ${'filter' in s ? 'cursor-pointer hover:border-[#e8930c] transition-colors' : ''}`}
            onClick={() => { if ('filter' in s && s.filter) { setFilterStatus(s.filter as string); setPage(0); } }}>
            <div className="text-[20px] font-extrabold" style={{ color: s.color }}>{s.value}</div>
            <div className="text-[10px] font-semibold text-[#94a7b8] uppercase tracking-wide">{s.label}</div>
          </div>
        ))}
      </div>
      {/* ⚡ Action Items Due */}
      {actionItems.length > 0 && (
        <div className="mb-4 bg-[#fef8f0] border-2 border-[#e8930c] rounded-xl p-4">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-[14px] font-bold text-[#92400e]">⚡ {actionItems.length} action {actionItems.length === 1 ? 'item' : 'items'} due</h3>
            <button onClick={() => { setFilterStatus('action_due'); setPage(0); }}
              className="text-[12px] font-semibold text-[#e8930c] hover:underline cursor-pointer bg-transparent border-none">
              View all →
            </button>
          </div>
          <div className="space-y-2">
            {actionItems.map(c => (
              <div key={c.id} className="bg-white rounded-lg px-4 py-3 border border-[#f0dcc0] flex items-start justify-between gap-3">
                <div className="min-w-0 flex-1">
                  <div className="text-[13px] font-bold text-[#1a2e3b]">{c.businessName}</div>
                  {c.nextActionNote && <p className="text-[13px] text-[#5a7184] mt-0.5">{c.nextActionNote}</p>}
                  <div className="text-[11px] text-[#94a7b8] mt-0.5">
                    Due {c.nextActionAt ? new Date(c.nextActionAt).toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'short' }) : ''} · {c.phone || 'no phone'}
                  </div>
                </div>
                <div className="flex gap-1.5 flex-shrink-0">
                  {c.phone && (
                    <button onClick={() => handleTwilioCall(c)} disabled={callingId === c.id}
                      className="bg-[#1a2e3b] text-white px-2.5 py-1 rounded-lg text-[11px] font-semibold hover:bg-[#243d4e] cursor-pointer border-none transition-colors disabled:opacity-50">
                      {callingId === c.id ? '⏳' : '📞'}
                    </button>
                  )}
                  <button onClick={() => { setLogCallId(c.id); setLogOutcome('spoke'); setLogNotes(''); setLogNextDate(''); setLogNextNote(''); }}
                    className="bg-[#e8930c] text-white px-2.5 py-1 rounded-lg text-[11px] font-semibold hover:bg-[#d17f00] cursor-pointer border-none transition-colors">
                    ✅ Done
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
      {/* Follow-ups Due */}
      {/* Unread Replies — URGENT */}
      {pipeline.unread_replies > 0 && (
        <div className="mb-4 bg-[#fef2f2] border-2 border-[#dc2626] rounded-xl p-4 animate-pulse-subtle">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-[14px] font-bold text-[#dc2626]">🔴 {pipeline.unread_replies} unread {pipeline.unread_replies === 1 ? 'reply' : 'replies'} — respond ASAP!</h3>
            <button onClick={() => { setFilterStatus('has_reply'); setPage(0); }}
              className="text-[12px] font-semibold text-[#dc2626] hover:underline cursor-pointer bg-transparent border-none">
              View all →
            </button>
          </div>
          <p className="text-[12px] text-[#991b1b] mb-3">Someone texted back. Click to see the conversation and reply.</p>
          <div className="space-y-2">
            {contacts.filter(c => c.hasUnreadReply).map(c => (
              <div key={c.id} className="bg-white rounded-lg px-4 py-3 border border-[#fca5a5] flex items-start justify-between gap-3">
                <div className="min-w-0 flex-1">
                  <div className="text-[13px] font-bold text-[#1a2e3b]">{c.businessName}</div>
                  {c.lastReplyText && (
                    <p className="text-[13px] text-[#1a2e3b] mt-1 bg-[#fef2f2] px-3 py-2 rounded-lg border-l-3 border-[#dc2626]" style={{ borderLeft: '3px solid #dc2626' }}>
                      &ldquo;{c.lastReplyText.length > 150 ? c.lastReplyText.substring(0, 150) + '...' : c.lastReplyText}&rdquo;
                    </p>
                  )}
                  <div className="text-[11px] text-[#94a7b8] mt-1">{c.lastReplyAt ? timeAgo(c.lastReplyAt) : ''} · {c.phone}</div>
                </div>
                <button onClick={() => openThread(c)}
                  className="bg-[#dc2626] text-white px-3 py-1.5 rounded-lg text-[11px] font-bold hover:bg-[#b91c1c] cursor-pointer border-none transition-colors flex-shrink-0">
                  💬 Reply
                </button>
                <button onClick={async () => {
                  await fetch('/api/admin/outreach-contacts', {
                    method: 'PATCH', headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ contactId: c.id, hasUnreadReply: false }),
                  });
                  await fetchContacts();
                }}
                  className="text-[#94a7b8] hover:text-[#dc2626] px-1 py-1.5 rounded-lg text-[14px] cursor-pointer bg-transparent border-none transition-colors flex-shrink-0" title="Dismiss">
                  ✕
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
      {(followUps.email.length > 0 || followUps.call.length > 0 || followUps.text?.length > 0) && (
        <div className="mb-6 space-y-3">
          {followUps.text?.length > 0 && (
            <div className="bg-[#ecfdf5] border border-[#059669] rounded-xl p-4">
              <h3 className="text-[13px] font-bold text-[#065f46] mb-3">💬 Text follow-ups due ({followUps.text.length})</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
                {followUps.text.map(c => (
                  <div key={c.id} className="bg-white rounded-lg px-3 py-2 flex items-center justify-between gap-2">
                    <div className="min-w-0">
                      <div className="text-[13px] font-semibold text-[#1a2e3b] truncate">{c.businessName}</div>
                      <div className="text-[11px] text-[#94a7b8]">
                        Texted {c.lastContactedAt ? `${Math.floor((Date.now() - new Date(c.lastContactedAt).getTime()) / 86400000)}d ago` : ''} · no reply
                      </div>
                    </div>
                    <div className="flex gap-1.5 flex-shrink-0">
                      {c.phone && (
                        <button onClick={() => handleTwilioCall(c)} disabled={callingId === c.id}
                          className="bg-[#1a2e3b] text-white px-2.5 py-1 rounded-lg text-[11px] font-semibold hover:bg-[#243d4e] cursor-pointer border-none transition-colors disabled:opacity-50">
                          {callingId === c.id ? '⏳' : '📞'}
                        </button>
                      )}
                      <button onClick={() => openSmsModal(c, true)}
                        className="bg-[#059669] text-white px-2.5 py-1 rounded-lg text-[11px] font-semibold hover:bg-[#047857] cursor-pointer border-none transition-colors">
                        💬 Follow up
                      </button>
                      <button onClick={async () => {
                        await fetch('/api/admin/outreach-contacts', {
                          method: 'PATCH', headers: { 'Content-Type': 'application/json' },
                          body: JSON.stringify({ contactId: c.id, dismissFollowUp: true }),
                        });
                        await fetchContacts();
                      }}
                        className="text-[#94a7b8] hover:text-[#dc2626] px-1 py-1 rounded-lg text-[14px] cursor-pointer bg-transparent border-none transition-colors" title="Dismiss">
                        ✕
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
          {followUps.call.length > 0 && (
            <div className="bg-[#fef3e0] border border-[#f59e0b] rounded-xl p-4">
              <h3 className="text-[13px] font-bold text-[#92400e] mb-3">📞 Call-backs due ({followUps.call.length})</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
                {followUps.call.map(c => (
                  <div key={c.id} className="bg-white rounded-lg px-3 py-2 flex items-center justify-between gap-2">
                    <div className="min-w-0">
                      <div className="text-[13px] font-semibold text-[#1a2e3b] truncate">{c.businessName}</div>
                      <div className="text-[11px] text-[#94a7b8]">
                        {c.status === 'voicemail' ? 'Left VM' : 'No answer'} · {c.lastContactedAt ? `${Math.floor((Date.now() - new Date(c.lastContactedAt).getTime()) / 86400000)}d ago` : ''}
                      </div>
                      {c.phone && <div className="text-[11px] text-[#5a7184]">{c.phone}</div>}
                    </div>
                    <button onClick={() => handleTwilioCall(c)} disabled={callingId === c.id}
                      className="bg-[#1a2e3b] text-white px-2.5 py-1 rounded-lg text-[11px] font-semibold hover:bg-[#243d4e] cursor-pointer border-none transition-colors flex-shrink-0 disabled:opacity-50">
                      {callingId === c.id ? '⏳ Calling...' : '📞 Call'}
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
          {followUps.email.length > 0 && (
            <div className="bg-[#eff6ff] border border-[#3b82f6] rounded-xl p-4">
              <h3 className="text-[13px] font-bold text-[#1e40af] mb-3">✉️ Email follow-ups due ({followUps.email.length})</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
                {followUps.email.map(c => (
                  <div key={c.id} className="bg-white rounded-lg px-3 py-2 flex items-center justify-between gap-2">
                    <div className="min-w-0">
                      <div className="text-[13px] font-semibold text-[#1a2e3b] truncate">{c.businessName}</div>
                      <div className="text-[11px] text-[#94a7b8]">
                        Emailed {c.sentAt ? `${Math.floor((Date.now() - new Date(c.sentAt).getTime()) / 86400000)}d ago` : ''} · no response
                      </div>
                    </div>
                    <div className="flex gap-1.5 flex-shrink-0">
                      {c.phone && (
                        <button onClick={() => handleTwilioCall(c)} disabled={callingId === c.id}
                          className="bg-[#1a2e3b] text-white px-2.5 py-1 rounded-lg text-[11px] font-semibold hover:bg-[#243d4e] cursor-pointer border-none transition-colors disabled:opacity-50">
                          {callingId === c.id ? '⏳' : '📞'}
                        </button>
                      )}
                      <button onClick={() => handlePreview(c.id, 'follow_up')}
                        className="bg-white text-[#1a2e3b] px-2.5 py-1 rounded-lg text-[11px] font-semibold border border-[#d1ccc6] hover:bg-[#f0eeeb] cursor-pointer transition-colors">
                        Follow up
                      </button>
                      <button onClick={async () => {
                        await fetch('/api/admin/outreach-contacts', {
                          method: 'PATCH', headers: { 'Content-Type': 'application/json' },
                          body: JSON.stringify({ contactId: c.id, dismissFollowUp: true }),
                        });
                        await fetchContacts();
                      }}
                        className="text-[#94a7b8] hover:text-[#dc2626] px-1 py-1 rounded-lg text-[14px] cursor-pointer bg-transparent border-none transition-colors" title="Dismiss">
                        ✕
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Filters + Sort + Search */}
      <div className="flex gap-3 mb-4 flex-wrap">
        <input
          type="text" placeholder="Search by name, business, email, phone..."
          value={searchQuery} onChange={e => setSearchQuery(e.target.value)}
          className="px-3 py-2 rounded-lg border border-[#d1ccc6] text-[13px] text-[#1a2e3b] bg-white min-w-[250px] flex-1 max-w-[400px] placeholder-[#94a7b8]"
        />
        <select value={filterVertical} onChange={e => { setFilterVertical(e.target.value); setPage(0); }}
          className="px-3 py-2 rounded-lg border border-[#d1ccc6] text-[13px] text-[#1a2e3b] bg-white">
          <option value="">All verticals</option>
          <option value="plumbing">Plumbing (US)</option>
          <option value="plumbing_uk">Plumbing (UK)</option>
          <option value="window_cleaning">Window Cleaning (US)</option>
          <option value="window_cleaning_uk">Window Cleaning (UK)</option>
          <option value="hvac">HVAC</option>
        </select>
        <select value={filterStatus} onChange={e => { setFilterStatus(e.target.value); setPage(0); }}
          className="px-3 py-2 rounded-lg border border-[#d1ccc6] text-[13px] text-[#1a2e3b] bg-white">
          <option value="">All statuses</option>
          <option value="has_email">📧 Has email</option>
          <option value="has_phone">📞 Has phone</option>
          <option value="has_reply">💬 Has reply</option>
          <option value="action_due">⚡ Action due</option>
          <option disabled>── Sent date ──</option>
          <option value="sent_today">📧 Emailed today</option>
          <option value="sent_yesterday">📧 Emailed yesterday</option>
          <option value="sent_2d">📧 Emailed 2 days ago</option>
          <option value="sent_3d_plus">📧 Emailed 3+ days ago</option>
          <option disabled>── Status ──</option>
          <option value="unsent">Unsent</option>
          <option value="sent">Emailed</option>
          <option value="opened">👀 Opened</option>
          <option value="clicked">🔗 Clicked link</option>
          <option value="texted">Texted</option>
          <option value="called">Called</option>
          <option value="voicemail">Voicemail</option>
          <option value="spoke">Spoke</option>
          <option value="demo_played">Demo played</option>
          <option value="interested">Interested</option>
          <option value="not_interested">Not interested</option>
          <option value="signed_up">Signed up</option>
        </select>
        <div className="ml-auto flex items-center gap-1.5">
          <span className="text-[11px] text-[#94a7b8] font-medium">Sort:</span>
          <button onClick={() => { setSortBy('score'); setPage(0); }}
            className={`px-2.5 py-1.5 rounded-lg text-[12px] font-semibold cursor-pointer border transition-colors ${sortBy === 'score' ? 'bg-[#1a2e3b] text-white border-[#1a2e3b]' : 'bg-white text-[#5a7184] border-[#d1ccc6] hover:bg-[#f0eeeb]'}`}>
            By score
          </button>
          <button onClick={() => { setSortBy('last_contact'); setPage(0); }}
            className={`px-2.5 py-1.5 rounded-lg text-[12px] font-semibold cursor-pointer border transition-colors ${sortBy === 'last_contact' ? 'bg-[#1a2e3b] text-white border-[#1a2e3b]' : 'bg-white text-[#5a7184] border-[#d1ccc6] hover:bg-[#f0eeeb]'}`}>
            By last contact
          </button>
        </div>
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
                    <div className="flex items-center gap-1.5">
                      <div className="text-[13px] font-semibold text-[#1a2e3b] truncate max-w-[200px] cursor-pointer hover:text-[#3b82f6]"
                        onClick={() => toggleExpand(c.id)}>{c.businessName || '—'}</div>
                      {c.hasUnreadReply && (
                        <button onClick={() => openThread(c)}
                          className="flex items-center gap-1 bg-[#dc2626] text-white px-1.5 py-0.5 rounded-full text-[10px] font-bold cursor-pointer border-none animate-pulse flex-shrink-0">
                          💬 REPLY
                        </button>
                      )}
                    </div>
                    {c.hasUnreadReply && c.lastReplyText && (
                      <div className="text-[12px] text-[#1a2e3b] mt-1 bg-[#fef2f2] px-2 py-1.5 rounded border-l-2 cursor-pointer hover:bg-[#fee2e2]"
                        style={{ borderLeft: '2px solid #dc2626' }} onClick={() => openThread(c)}>
                        &ldquo;{c.lastReplyText.length > 80 ? c.lastReplyText.substring(0, 80) + '...' : c.lastReplyText}&rdquo;
                      </div>
                    )}
                    {c.painSignal && <div className="text-[11px] text-[#e8930c] mt-0.5">🔥 {c.painSignal}</div>}
                    {c.lastContactedAt && <div className="text-[10px] text-[#94a7b8] mt-0.5">Last contact: {timeAgo(c.lastContactedAt)}</div>}
                    {c.activities?.[0]?.notes && <div className="text-[10px] text-[#5a7184] mt-0.5 italic truncate max-w-[200px]">&ldquo;{c.activities[0].notes}&rdquo;</div>}
                    {c._count.activities > 0 && <div className="text-[10px] text-[#94a7b8]">{c._count.activities} interaction{c._count.activities !== 1 ? 's' : ''}</div>}
                  </td>
                  <td className="px-4 py-3 align-top">
                    {editEmailId === c.id ? (
                      <div className="flex gap-1 items-center">
                        <input type="email" value={editEmailValue} onChange={e => setEditEmailValue(e.target.value)}
                          placeholder="email@example.com" autoFocus onKeyDown={e => e.key === 'Enter' && handleSaveEmail(c.id)}
                          className="w-full px-2 py-1 border border-[#d1ccc6] rounded text-[12px] text-[#1a2e3b] focus:outline-none focus:ring-1 focus:ring-[#0d9488]" />
                        <button onClick={() => handleSaveEmail(c.id)} className="text-[#059669] text-[12px] font-bold cursor-pointer bg-transparent border-none">✓</button>
                        <button onClick={() => setEditEmailId(null)} className="text-[#94a7b8] text-[12px] cursor-pointer bg-transparent border-none">✕</button>
                      </div>
                    ) : (
                      <div className="text-[13px] text-[#1a2e3b] truncate max-w-[200px] cursor-pointer hover:text-[#0d9488]"
                        onClick={() => { setEditEmailId(c.id); setEditEmailValue(hasEmail ? c.email : ''); }}>
                        {hasEmail ? c.email : <span className="text-[#3b82f6] italic">+ add email</span>}
                      </div>
                    )}
                    {c.phone && <div className="text-[11px] text-[#94a7b8]">{c.phone}</div>}
                    {c.mobilePhone && <div className="text-[11px] text-[#059669]">📱 {c.mobilePhone}</div>}
                    {!c.mobilePhone && c.phone && (
                      <button onClick={() => { setEditMobileId(c.id); setEditMobileValue(''); }}
                        className="text-[10px] text-[#3b82f6] hover:underline cursor-pointer bg-transparent border-none p-0 mt-0.5">
                        + add mobile
                      </button>
                    )}
                    {editMobileId === c.id && (
                      <div className="flex gap-1 mt-1">
                        <input type="tel" placeholder="Mobile #" value={editMobileValue}
                          onChange={e => setEditMobileValue(e.target.value)}
                          className="w-28 px-2 py-1 rounded border border-[#d1ccc6] text-[11px]" />
                        <button onClick={() => handleSaveMobile(c.id)}
                          className="px-2 py-1 rounded text-[10px] font-semibold bg-[#1a2e3b] text-white cursor-pointer border-none">✓</button>
                        <button onClick={() => setEditMobileId(null)}
                          className="text-[10px] text-[#94a7b8] cursor-pointer bg-transparent border-none">✕</button>
                      </div>
                    )}
                  </td>
                  <td className="px-4 py-3 text-[12px] text-[#5a7184] align-top">{VERTICAL_LABELS[c.vertical] || c.vertical}</td>
                  <td className="px-4 py-3 text-[13px] font-bold text-[#1a2e3b] text-center align-top">{c.score}</td>
                  <td className="px-4 py-3 align-top">
                    <span className={`inline-block text-[11px] font-semibold px-2 py-0.5 rounded-full ${st.bg} ${st.text}`}>{st.label}</span>
                    {c.hasUnreadReply && (
                      <span className="inline-block ml-1 text-[11px] font-bold px-2 py-0.5 rounded-full bg-[#dc2626] text-white">💬 Reply!</span>
                    )}
                    {c.textSequence > 0 && !c.hasUnreadReply && (
                      <div className="text-[10px] text-[#94a7b8] mt-0.5">{c.textSequence} text{c.textSequence !== 1 ? 's' : ''} sent</div>
                    )}
                    {c.sentAt && <div className="text-[10px] text-[#94a7b8] mt-0.5">{timeAgo(c.sentAt)}</div>}
                  </td>
                  <td className="px-4 py-3 align-top">
                    <div className="flex flex-wrap items-center gap-1.5">
                      {/* Call via Twilio — rings your phone, bridges to lead */}
                      {c.phone && (
                        <button onClick={() => handleTwilioCall(c)} disabled={callingId === c.id}
                          className="bg-[#1a2e3b] text-white px-2.5 py-1 rounded-lg text-[11px] font-semibold hover:bg-[#243d4e] cursor-pointer border-none transition-colors disabled:opacity-50">
                          {callingId === c.id ? '⏳ Calling...' : '📞 Call'}
                        </button>
                      )}
                      {c.phone && (
                        <button onClick={() => { setLogCallId(c.id); setLogOutcome('no_answer'); setLogNotes(''); }}
                          className="bg-white text-[#5a7184] px-2 py-1 rounded-lg text-[11px] font-semibold border border-[#d1ccc6] hover:bg-[#f0eeeb] cursor-pointer transition-colors">
                          ✏️ Log
                        </button>
                      )}
                      <button onClick={() => handleDeleteContact(c.id, c.businessName || c.email)}
                        className="bg-white text-[#dc2626] px-2 py-1 rounded-lg text-[11px] font-semibold border border-[#fecaca] hover:bg-[#fef2f2] cursor-pointer transition-colors">
                        🗑️
                      </button>
                      {/* Send text — if has phone */}
                      {c.phone && c.status !== 'texted' && c.status !== 'interested' && c.status !== 'signed_up' && c.status !== 'not_interested' && (
                        <button onClick={() => openSmsModal(c, false)}
                          className="bg-[#059669] text-white px-2.5 py-1 rounded-lg text-[11px] font-semibold hover:bg-[#047857] cursor-pointer border-none transition-colors">
                          💬 Text {(c.textSequence || 0) + 1}
                        </button>
                      )}
                      {/* Text follow-up — if already texted */}
                      {c.phone && c.status === 'texted' && (
                        c.hasUnreadReply ? (
                          <button onClick={() => openThread(c)}
                            className="bg-[#dc2626] text-white px-2.5 py-1 rounded-lg text-[11px] font-semibold cursor-pointer border-none transition-colors hover:bg-[#b91c1c]">
                            💬 View reply
                          </button>
                        ) : (
                          <button onClick={() => openSmsModal(c, true)}
                            className="bg-white text-[#059669] px-2.5 py-1 rounded-lg text-[11px] font-semibold cursor-pointer border border-[#059669] hover:bg-[#ecfdf5] transition-colors">
                            💬 Text {(c.textSequence || 0) + 1}
                          </button>
                        )
                      )}
                      {/* View conversation thread */}
                      {c.phone && (c.status === 'texted' || c.hasUnreadReply) && (
                        <button onClick={() => openThread(c)}
                          className="bg-white text-[#5a7184] px-2 py-1 rounded-lg text-[10px] font-semibold border border-[#d1ccc6] hover:bg-[#f0eeeb] cursor-pointer transition-colors">
                          Thread
                        </button>
                      )}
                      {/* Email actions */}
                      {hasEmail && c.status === 'unsent' && (
                        <button onClick={() => handlePreview(c.id, 'first_touch')} disabled={previewing === c.id}
                          className="bg-[#e8930c] text-white px-2.5 py-1 rounded-lg text-[11px] font-semibold hover:bg-[#d17f00] disabled:opacity-50 cursor-pointer border-none transition-colors">
                          {previewing === c.id ? '...' : '✉️ Email'}
                        </button>
                      )}
                      {hasEmail && (c.status === 'sent' || c.status === 'opened' || c.status === 'called' || c.status === 'voicemail') && (
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
                              <span className="text-[11px]">{a.type === 'call' ? '📞' : a.type === 'email' ? '✉️' : a.type === 'text' || a.type === 'text_follow_up' ? '💬' : '📝'}</span>
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2">
                                <span className="text-[13px] font-semibold text-[#1a2e3b] capitalize">{a.type === 'text_follow_up' ? 'Text follow-up' : a.type}</span>
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
          <div className="flex gap-1 items-center">
            {(() => {
              const totalPages = Math.ceil(total / PAGE_SIZE);
              const pages: (number | '...')[] = [];
              if (totalPages <= 9) {
                for (let i = 0; i < totalPages; i++) pages.push(i);
              } else {
                pages.push(0);
                if (page > 3) pages.push('...');
                for (let i = Math.max(1, page - 2); i <= Math.min(totalPages - 2, page + 2); i++) pages.push(i);
                if (page < totalPages - 4) pages.push('...');
                pages.push(totalPages - 1);
              }
              return (
                <>
                  <button onClick={() => setPage(0)} disabled={page === 0}
                    className="px-2 py-1.5 rounded-lg text-[12px] font-semibold border border-[#d1ccc6] bg-white text-[#1a2e3b] hover:bg-[#f0eeeb] disabled:opacity-30 cursor-pointer transition-colors">«</button>
                  <button onClick={() => setPage(p => Math.max(0, p - 1))} disabled={page === 0}
                    className="px-2 py-1.5 rounded-lg text-[12px] font-semibold border border-[#d1ccc6] bg-white text-[#1a2e3b] hover:bg-[#f0eeeb] disabled:opacity-30 cursor-pointer transition-colors">‹</button>
                  {pages.map((p, i) => p === '...' ? (
                    <span key={`dots-${i}`} className="px-1 text-[12px] text-[#94a7b8]">…</span>
                  ) : (
                    <button key={p} onClick={() => setPage(p as number)}
                      className={`px-2.5 py-1.5 rounded-lg text-[12px] font-semibold border cursor-pointer transition-colors ${
                        p === page ? 'bg-[#1a2e3b] text-white border-[#1a2e3b]' : 'border-[#d1ccc6] bg-white text-[#5a7184] hover:bg-[#f0eeeb]'
                      }`}>{(p as number) + 1}</button>
                  ))}
                  <button onClick={() => setPage(p => Math.min(totalPages - 1, p + 1))} disabled={(page + 1) * PAGE_SIZE >= total}
                    className="px-2 py-1.5 rounded-lg text-[12px] font-semibold border border-[#d1ccc6] bg-white text-[#1a2e3b] hover:bg-[#f0eeeb] disabled:opacity-30 cursor-pointer transition-colors">›</button>
                  <button onClick={() => setPage(totalPages - 1)} disabled={page === totalPages - 1}
                    className="px-2 py-1.5 rounded-lg text-[12px] font-semibold border border-[#d1ccc6] bg-white text-[#1a2e3b] hover:bg-[#f0eeeb] disabled:opacity-30 cursor-pointer transition-colors">»</button>
                </>
              );
            })()}
          </div>
        </div>
      )}
    </div>
  );
}
