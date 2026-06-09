'use client';

import { useEffect, useState } from 'react';
import {
  getCotorraMetrics, getCotorraConversations,
  CotorraMetrics, CotorraConversation,
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
  return (
    <span className="inline-flex items-center justify-center rounded text-[10px] font-bold px-1.5 py-0.5"
      style={{ background: isWa ? '#25D36618' : '#0F9A6618', color: isWa ? '#1da851' : JADE }}>
      {isWa ? 'WhatsApp' : 'Voice'}
    </span>
  );
}

function Badge({ color, text }: { color: string; text: string }) {
  return <span className="text-[10px] font-bold px-1.5 py-0.5 rounded" style={{ background: color + '18', color }}>{text}</span>;
}

export default function CotorraDashboard() {
  const [metrics, setMetrics] = useState<CotorraMetrics | null>(null);
  const [convos, setConvos] = useState<CotorraConversation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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

  const cards = [
    { label: 'Conversations this week', value: metrics?.conversationsThisWeek ?? '-', sub: metrics ? `${metrics.conversationsToday} today` : '' },
    { label: 'Booking links sent', value: metrics?.bookingLinksSent ?? '-', sub: metrics ? `${metrics.bookingsMade} booked` : '' },
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
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
        {cards.map((c) => (
          <div key={c.label} className="bg-white rounded-xl p-5 border border-[#ece9e2]">
            <span className="text-xs font-semibold uppercase tracking-wide text-[#8a8a82]">{c.label}</span>
            {loading ? (
              <div className="w-5 h-5 mt-3 border-2 rounded-full animate-spin" style={{ borderColor: JADE, borderTopColor: 'transparent' }} />
            ) : (
              <>
                <div className="text-[28px] font-bold mt-1.5" style={{ color: INK }}>{c.value}</div>
                {c.sub && <div className="text-xs font-semibold mt-1" style={{ color: JADE }}>{c.sub}</div>}
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
        <div className="flex items-end gap-2 h-28">
          {(metrics?.perDay ?? []).map((d) => {
            const h = Math.round((d.count / maxDay) * 100);
            const label = new Date(d.date + 'T00:00:00').toLocaleDateString('en-US', { weekday: 'short' });
            return (
              <div key={d.date} className="flex-1 flex flex-col items-center justify-end gap-1.5">
                <span className="text-[11px] font-semibold" style={{ color: d.count ? INK : '#c9c6bf' }}>{d.count}</span>
                <div className="w-full rounded-t-md" style={{ height: `${Math.max(h, 3)}%`, background: d.count ? JADE : '#ece9e2' }} />
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
            convos.map((c, i) => (
              <div key={c.id} className={`px-5 py-3.5 ${i < convos.length - 1 ? 'border-b border-[#f3f1ec]' : ''}`}>
                <div className="flex justify-between items-start gap-3">
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <ChannelBadge channel={c.channel} />
                      <p className="text-sm font-medium truncate" style={{ color: INK }}>{c.customerName || c.customerPhone || 'Unknown'}</p>
                    </div>
                    {(c.summary || c.preview) && <p className="text-xs text-[#8a8a82] mt-1 line-clamp-2">{c.summary || c.preview}</p>}
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
            ))
          )}
        </div>
      </div>
    </div>
  );
}
