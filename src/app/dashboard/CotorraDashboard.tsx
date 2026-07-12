'use client';

import { useEffect, useState } from 'react';
import {
  getCotorraMetrics, getCotorraConversations, getCotorraConversationDetail,
  CotorraMetrics, CotorraConversation, CotorraConversationDetail,
} from '@/lib/api';

const JADE = '#0F9A66';
const INK = '#16150F';

function fmtWhen(iso: string): string {
  const d = new Date(iso);
  const now = new Date();
  const time = d.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
  if (d.toDateString() === now.toDateString()) return `Today ${time}`;
  const y = new Date(now); y.setDate(y.getDate() - 1);
  if (d.toDateString() === y.toDateString()) return `Yesterday ${time}`;
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) + ` ${time}`;
}

function ChannelBadge({ channel }: { channel: string }) {
  const isWa = channel === 'whatsapp';
  const isSms = channel === 'sms';
  const bg = isWa ? '#25D36618' : isSms ? '#2563eb18' : '#0F9A6618';
  const color = isWa ? '#1da851' : isSms ? '#2563eb' : JADE;
  return (
    <span className="inline-flex items-center justify-center rounded text-[10px] font-bold px-1.5 py-0.5"
      style={{ background: bg, color }}>
      {isWa ? 'WhatsApp' : isSms ? 'SMS' : 'Voice'}
    </span>
  );
}

function Badge({ color, text }: { color: string; text: string }) {
  return <span className="text-[10px] font-bold px-1.5 py-0.5 rounded" style={{ background: color + '18', color }}>{text}</span>;
}

function Thread({ detail }: { detail: CotorraConversationDetail }) {
  if (detail.messages.length === 0 && detail.fullTranscript) {
    return <pre className="text-xs whitespace-pre-wrap text-[#5a584f] bg-[#faf9f7] rounded-lg p-3 m-0 font-sans">{detail.fullTranscript}</pre>;
  }
  if (detail.messages.length === 0) {
    return <p className="text-xs text-[#8a8a82] m-0">No messages recorded for this conversation.</p>;
  }
  return (
    <div className="space-y-2">
      {detail.messages.map((m) => (
        <div key={m.id} className={`flex ${m.direction === 'outbound' ? 'justify-end' : 'justify-start'}`}>
          <div className="max-w-[78%] rounded-2xl px-3.5 py-2 text-[13px] leading-relaxed"
            style={m.direction === 'outbound'
              ? { background: '#0F9A6612', color: INK, borderBottomRightRadius: 6 }
              : { background: '#f3f1ec', color: INK, borderBottomLeftRadius: 6 }}>
            <p className="whitespace-pre-wrap break-words m-0">{m.body}</p>
            {m.createdAt && (
              <p className="text-[10px] text-[#a8a59e] mt-1 mb-0 text-right">
                {new Date(m.createdAt).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })}
              </p>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}

export default function CotorraDashboard() {
  const [metrics, setMetrics] = useState<CotorraMetrics | null>(null);
  const [convos, setConvos] = useState<CotorraConversation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [details, setDetails] = useState<Record<string, CotorraConversationDetail>>({});
  const [detailLoading, setDetailLoading] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        const [m, c] = await Promise.all([getCotorraMetrics(), getCotorraConversations(50)]);
        setMetrics(m);
        setConvos(c);
      } catch (e) {
        console.error('Failed to load Cotorra dashboard:', e);
        setError('Failed to load dashboard data');
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const toggleConvo = async (id: string) => {
    if (expandedId === id) { setExpandedId(null); return; }
    setExpandedId(id);
    if (!details[id]) {
      try {
        setDetailLoading(id);
        const d = await getCotorraConversationDetail(id);
        setDetails((prev) => ({ ...prev, [id]: d }));
      } catch (e) {
        console.error('Failed to load conversation detail:', e);
      } finally {
        setDetailLoading(null);
      }
    }
  };

  const used = metrics?.conversationsThisMonth ?? 0;
  const planLimit = metrics?.planMonthlyConversations ?? 400;
  const usagePct = metrics ? Math.min(100, Math.round((used / Math.max(1, planLimit)) * 100)) : 0;

  const cards: { label: string; value: number | string; sub: string; usage?: boolean }[] = [
    { label: 'Conversations this month', value: metrics ? used : '-', sub: metrics ? `of ${planLimit} in your plan` : '', usage: true },
    { label: 'Conversations this week', value: metrics?.conversationsThisWeek ?? '-', sub: metrics ? `${metrics.conversationsToday} today` : '' },
    { label: 'Booking links sent', value: metrics?.bookingLinksSent ?? '-', sub: '' },
    { label: 'Questions answered', value: metrics?.questionsAnswered ?? '-', sub: '' },
  ];
  const maxDay = Math.max(1, ...(metrics?.perDay?.map((d) => d.count) ?? [1]));

  return (
    <div className="space-y-7">
      <div>
        <h1 className="text-[22px] font-bold" style={{ color: INK }}>Dashboard</h1>
        <p className="text-[13px] text-[#8a8a82] mt-1">Last 7 days · WhatsApp + voice</p>
      </div>

      {error && <div className="bg-[#fef2f2] text-[#991b1b] p-4 rounded-xl text-sm font-medium">{error}</div>}

      {/* Stat cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5">
        {cards.map((c) => (
          <div key={c.label} className="bg-white rounded-xl p-5 border border-[#ece9e2]">
            <span className="text-xs font-semibold uppercase tracking-wide text-[#8a8a82]">{c.label}</span>
            {loading ? (
              <div className="w-5 h-5 mt-3 border-2 rounded-full animate-spin" style={{ borderColor: JADE, borderTopColor: 'transparent' }} />
            ) : (
              <>
                <div className="text-[28px] font-bold mt-1.5" style={{ color: INK }}>{c.value}</div>
                {c.sub && <div className="text-xs font-semibold mt-1" style={{ color: JADE }}>{c.sub}</div>}
                {c.usage && (
                  <div className="mt-2.5 h-1.5 rounded-full bg-[#ece9e2] overflow-hidden">
                    <div className="h-full rounded-full" style={{ width: `${usagePct}%`, background: JADE, minWidth: used > 0 ? 6 : 0 }} />
                  </div>
                )}
              </>
            )}
          </div>
        ))}
      </div>

      {/* Per-day mini chart */}
      <div className="bg-white rounded-xl p-5 border border-[#ece9e2]">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-sm font-bold" style={{ color: INK }}>Conversations per day</h2>
          <span className="text-xs text-[#8a8a82]">last 7 days</span>
        </div>
        <div className="flex items-end gap-2">
          {(metrics?.perDay ?? []).map((d) => {
            const barPx = d.count ? Math.max(Math.round((d.count / maxDay) * 96), 10) : 4;
            const label = new Date(d.date + 'T00:00:00').toLocaleDateString('en-US', { weekday: 'short' });
            return (
              <div key={d.date} className="flex-1 flex flex-col items-center gap-1.5">
                <span className="text-[11px] font-semibold" style={{ color: d.count ? INK : '#c9c6bf' }}>{d.count}</span>
                <div className="w-full rounded-t-md" style={{ height: barPx, background: d.count ? JADE : '#ece9e2' }} />
                <span className="text-[10px] text-[#8a8a82]">{label}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Conversation list */}
      <div className="bg-white rounded-xl border border-[#ece9e2]">
        <div className="px-5 py-3.5 border-b border-[#ece9e2] flex justify-between items-center">
          <h2 className="text-sm font-bold" style={{ color: INK }}>Recent conversations</h2>
          <span className="text-xs text-[#8a8a82]">{convos.length}</span>
        </div>
        <div>
          {loading ? (
            <div className="p-8 text-center"><div className="w-5 h-5 border-2 rounded-full animate-spin mx-auto" style={{ borderColor: JADE, borderTopColor: 'transparent' }} /></div>
          ) : convos.length === 0 ? (
            <div className="p-8 text-center text-sm text-[#8a8a82]">
              <p className="mb-1">No conversations yet</p>
              <p className="text-xs">WhatsApp and voice chats will show up here</p>
            </div>
          ) : (
            convos.map((c, i) => {
              const isOpen = expandedId === c.id;
              return (
                <div key={c.id} className={i < convos.length - 1 ? 'border-b border-[#f3f1ec]' : ''}>
                  <div
                    role="button"
                    tabIndex={0}
                    onClick={() => toggleConvo(c.id)}
                    onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); toggleConvo(c.id); } }}
                    className="px-5 py-3.5 cursor-pointer hover:bg-[#faf9f7] transition-colors"
                  >
                    <div className="flex justify-between items-start gap-3">
                      <div className="min-w-0 flex items-start gap-2">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#a8a59e" strokeWidth="2.5"
                          className="mt-1 flex-shrink-0 transition-transform" style={{ transform: isOpen ? 'rotate(90deg)' : 'none' }}>
                          <polyline points="9 18 15 12 9 6" />
                        </svg>
                        <div className="min-w-0">
                          <div className="flex items-center gap-2">
                            <ChannelBadge channel={c.channel} />
                            <p className="text-sm font-medium truncate" style={{ color: INK }}>{c.customerName || c.customerPhone || 'Unknown'}</p>
                          </div>
                          {!isOpen && (c.summary || c.preview) && <p className="text-xs text-[#8a8a82] mt-1 line-clamp-2">{c.summary || c.preview}</p>}
                        </div>
                      </div>
                      <div className="flex flex-col items-end gap-1.5 flex-shrink-0">
                        <span className="text-[11px] text-[#a8a59e] whitespace-nowrap">{fmtWhen(c.createdAt)}</span>
                        <div className="flex gap-1.5">
                          {c.bookingMade && <Badge color={JADE} text="Booked" />}
                          {c.bookingLinkSent && <Badge color="#2563eb" text="Link sent" />}
                        </div>
                      </div>
                    </div>
                  </div>
                  {isOpen && (
                    <div className="px-5 pb-4 pt-1 pl-[42px]">
                      {detailLoading === c.id ? (
                        <div className="py-4"><div className="w-4 h-4 border-2 rounded-full animate-spin" style={{ borderColor: JADE, borderTopColor: 'transparent' }} /></div>
                      ) : details[c.id] ? (
                        <Thread detail={details[c.id]} />
                      ) : (
                        <p className="text-xs text-[#8a8a82] py-2 m-0">Could not load this conversation.</p>
                      )}
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
