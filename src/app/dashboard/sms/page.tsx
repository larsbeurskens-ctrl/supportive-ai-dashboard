'use client';

import { useState, useEffect, useCallback } from 'react';
import { getSMSConversations, getSMSConversation, sendSMS, SMSConversation, SMSMessage } from '@/lib/api';

const DEMO_NUMBERS: Record<string, string> = {
  plumbing: '(240) 301-1473',
  window_cleaning: '(845) 209-2401',
  hvac: '(737) 327-8220',
};

const LANDING_PAGES: Record<string, string> = {
  plumbing: 'https://supportive-ai.com/plumbing#hear-it',
  window_cleaning: 'https://supportive-ai.com/window-cleaning#hear-it',
  hvac: 'https://supportive-ai.com/hvac#hear-it',
};

function ComposeModal({ onSend, onClose }: { onSend: (data: any) => Promise<void>; onClose: () => void }) {
  const [to, setTo] = useState('');
  const [name, setName] = useState('');
  const [company, setCompany] = useState('');
  const [vertical, setVertical] = useState('plumbing');
  const [body, setBody] = useState('');
  const [sending, setSending] = useState(false);

  function applyTemplate() {
    const demo = DEMO_NUMBERS[vertical] || DEMO_NUMBERS.plumbing;
    const link = LANDING_PAGES[vertical] || LANDING_PAGES.plumbing;
    const verticalLabel = vertical === 'window_cleaning' ? 'window cleaning' : vertical;
    setBody(`Thanks for the good chat just now, it's Lars from Supportive AI. Here's your link: ${link}\nOn there you can hear how the receptionist sounds for ${verticalLabel} companies. You can also try it yourself by calling the demo number: ${demo}\nIf it feels like a fit, you can create a free account and hear a version set up for your own business before switching anything live.`);
  }

  async function handleSend() {
    if (!to.trim() || !body.trim()) return;
    setSending(true);
    await onSend({ to: to.trim(), body: body.trim(), name: name.trim() || undefined, company: company.trim() || undefined, vertical });
    setSending(false);
    onClose();
  }

  return (
    <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg p-6 space-y-4">
        <div className="flex justify-between items-center">
          <h2 className="text-[17px] font-bold text-[#1a2e3b]">New Message</h2>
          <button onClick={onClose} className="text-[#94a7b8] text-xl bg-transparent border-none cursor-pointer">&times;</button>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-[12px] font-semibold text-[#5a7184] mb-1">Phone number *</label>
            <input type="tel" value={to} onChange={e => setTo(e.target.value)} placeholder="(555) 123-4567"
              className="w-full px-3 py-2 border border-[#e5e0da] rounded-lg text-[14px] focus:outline-none focus:ring-2 focus:ring-[#0d9488]" />
          </div>
          <div>
            <label className="block text-[12px] font-semibold text-[#5a7184] mb-1">Name</label>
            <input type="text" value={name} onChange={e => setName(e.target.value)} placeholder="Mike Reynolds"
              className="w-full px-3 py-2 border border-[#e5e0da] rounded-lg text-[14px] focus:outline-none focus:ring-2 focus:ring-[#0d9488]" />
          </div>
          <div>
            <label className="block text-[12px] font-semibold text-[#5a7184] mb-1">Company</label>
            <input type="text" value={company} onChange={e => setCompany(e.target.value)} placeholder="ABC Plumbing"
              className="w-full px-3 py-2 border border-[#e5e0da] rounded-lg text-[14px] focus:outline-none focus:ring-2 focus:ring-[#0d9488]" />
          </div>
          <div>
            <label className="block text-[12px] font-semibold text-[#5a7184] mb-1">Industry</label>
            <select value={vertical} onChange={e => setVertical(e.target.value)}
              className="w-full px-3 py-2 border border-[#e5e0da] rounded-lg text-[14px] bg-white focus:outline-none focus:ring-2 focus:ring-[#0d9488]">
              <option value="plumbing">Plumbing</option>
              <option value="window_cleaning">Window Cleaning</option>
              <option value="hvac">HVAC</option>
            </select>
          </div>
        </div>

        <div>
          <div className="flex justify-between items-center mb-1">
            <label className="text-[12px] font-semibold text-[#5a7184]">Message *</label>
            <button onClick={applyTemplate}
              className="text-[12px] font-semibold text-[#e8930c] bg-transparent border-none cursor-pointer hover:underline">
              Use follow-up template
            </button>
          </div>
          <textarea value={body} onChange={e => setBody(e.target.value)} rows={6} placeholder="Type your message..."
            className="w-full px-3 py-2 border border-[#e5e0da] rounded-lg text-[14px] resize-none focus:outline-none focus:ring-2 focus:ring-[#0d9488]" />
          <p className="text-[11px] text-[#94a7b8] mt-1">{body.length} characters</p>
        </div>
        <button onClick={handleSend} disabled={sending || !to.trim() || !body.trim()}
          className="w-full bg-[#e8930c] text-white py-3 rounded-xl text-[14px] font-bold hover:bg-[#d17f00] transition-colors cursor-pointer border-none disabled:opacity-50">
          {sending ? 'Sending...' : 'Send SMS'}
        </button>
      </div>
    </div>
  );
}

export default function SMSPage() {
  const [conversations, setConversations] = useState<SMSConversation[]>([]);
  const [selected, setSelected] = useState<SMSConversation | null>(null);
  const [loading, setLoading] = useState(true);
  const [showCompose, setShowCompose] = useState(false);
  const [reply, setReply] = useState('');
  const [sendingReply, setSendingReply] = useState(false);

  const refresh = useCallback(async () => {
    try {
      const data = await getSMSConversations();
      setConversations(data);
    } catch { /* */ }
    setLoading(false);
  }, []);

  useEffect(() => { refresh(); }, [refresh]);

  async function loadConversation(id: string) {
    const convo = await getSMSConversation(id);
    setSelected(convo);
    refresh(); // clear unread badge
  }

  async function handleSend(data: any) {
    await sendSMS(data);
    refresh();
  }

  async function handleReply() {
    if (!reply.trim() || !selected) return;
    setSendingReply(true);
    await sendSMS({ to: selected.toNumber, body: reply.trim() });
    setReply('');
    setSendingReply(false);
    loadConversation(selected.id);
  }

  function formatTime(dateStr: string) {
    const d = new Date(dateStr);
    const now = new Date();
    const diffMs = now.getTime() - d.getTime();
    if (diffMs < 60000) return 'just now';
    if (diffMs < 3600000) return `${Math.floor(diffMs / 60000)}m ago`;
    if (diffMs < 86400000) return d.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  }

  if (loading) return <div className="flex justify-center py-20"><div className="w-6 h-6 border-2 border-[#0d9488] border-t-transparent rounded-full animate-spin" /></div>;

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-[22px] font-bold text-[#1a2e3b]">Messages</h1>
          <p className="text-[13px] text-[#94a7b8] mt-0.5">Send follow-ups and view replies</p>
        </div>
        <button onClick={() => setShowCompose(true)}
          className="px-5 py-2.5 bg-[#e8930c] text-white text-[14px] font-bold rounded-xl hover:bg-[#d17f00] transition-colors cursor-pointer border-none">
          + New Message
        </button>
      </div>

      {showCompose && <ComposeModal onSend={handleSend} onClose={() => setShowCompose(false)} />}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4" style={{ minHeight: '500px' }}>
        {/* Conversation list */}
        <div className="lg:col-span-1 bg-white rounded-xl border border-[#e5e0da] overflow-hidden">
          {conversations.length === 0 ? (
            <div className="p-8 text-center">
              <p className="text-[14px] text-[#94a7b8]">No conversations yet</p>
              <p className="text-[12px] text-[#c4b5a6] mt-1">Send your first follow-up message</p>
            </div>
          ) : (
            <div className="divide-y divide-[#f0eeeb]">
              {conversations.map(c => (
                <button key={c.id} onClick={() => loadConversation(c.id)}
                  className={`w-full text-left p-4 hover:bg-[#faf9f7] transition-colors cursor-pointer border-none ${selected?.id === c.id ? 'bg-[#faf9f7]' : 'bg-white'}`}>
                  <div className="flex justify-between items-start">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        {c.unread && <div className="w-2 h-2 rounded-full bg-[#e8930c] flex-shrink-0" />}
                        <p className="text-[14px] font-semibold text-[#1a2e3b] truncate">{c.toName || c.toNumber}</p>
                      </div>
                      {c.toCompany && <p className="text-[12px] text-[#5a7184] truncate">{c.toCompany}</p>}
                      <p className="text-[12px] text-[#94a7b8] truncate mt-0.5">{c.lastMessage}</p>
                    </div>
                    <span className="text-[11px] text-[#c4b5a6] flex-shrink-0 ml-2">{c.lastAt ? formatTime(c.lastAt) : ''}</span>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>


        {/* Conversation detail */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-[#e5e0da] flex flex-col">
          {selected ? (
            <>
              {/* Header */}
              <div className="p-4 border-b border-[#f0eeeb]">
                <p className="text-[15px] font-bold text-[#1a2e3b]">{selected.toName || selected.toNumber}</p>
                {selected.toCompany && <p className="text-[12px] text-[#5a7184]">{selected.toCompany}</p>}
                <p className="text-[12px] text-[#94a7b8]">{selected.toNumber}</p>
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-4 space-y-3" style={{ maxHeight: '400px' }}>
                {(selected.messages || []).map((msg: SMSMessage) => (
                  <div key={msg.id} className={`flex ${msg.direction === 'outbound' ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-[80%] rounded-xl px-4 py-2.5 ${
                      msg.direction === 'outbound' ? 'bg-[#e8930c] text-white' : 'bg-[#f4f3f1] text-[#1a2e3b]'
                    }`}>
                      <p className="text-[13px] whitespace-pre-wrap">{msg.body}</p>
                      <p className={`text-[10px] mt-1 ${msg.direction === 'outbound' ? 'text-white/70' : 'text-[#94a7b8]'}`}>
                        {formatTime(msg.createdAt)}
                        {msg.direction === 'outbound' && msg.status === 'failed' && <span className="ml-1 text-red-200">· Failed</span>}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Reply box */}
              <div className="p-4 border-t border-[#f0eeeb]">
                <div className="flex gap-2">
                  <input type="text" value={reply} onChange={e => setReply(e.target.value)}
                    placeholder="Type a reply..." onKeyDown={e => e.key === 'Enter' && handleReply()}
                    className="flex-1 px-4 py-2.5 border border-[#e5e0da] rounded-xl text-[14px] focus:outline-none focus:ring-2 focus:ring-[#0d9488]" />
                  <button onClick={handleReply} disabled={sendingReply || !reply.trim()}
                    className="px-5 py-2.5 bg-[#1a2e3b] text-white text-[13px] font-bold rounded-xl hover:bg-[#243d4e] cursor-pointer border-none disabled:opacity-50">
                    {sendingReply ? '...' : 'Send'}
                  </button>
                </div>
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center text-center p-8">
              <div>
                <p className="text-[16px] text-[#94a7b8] mb-1">Select a conversation</p>
                <p className="text-[12px] text-[#c4b5a6]">or send a new message to get started</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
