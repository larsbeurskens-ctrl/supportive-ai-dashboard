'use client';

import { ChevronDown, ChevronUp } from 'lucide-react';
import { useState, useEffect } from 'react';
import { getCalls, Call } from '@/lib/api';

function OutcomeBadge({ outcome }: { outcome: string }) {
  const config: Record<string, { bg: string; text: string; dot: string; label: string }> = {
    booked: { bg: 'bg-[#eef9f0]', text: 'text-[#059669]', dot: 'bg-[#059669]', label: 'Booked' },
    completed: { bg: 'bg-[#eef9f0]', text: 'text-[#059669]', dot: 'bg-[#059669]', label: 'Completed' },
    inquiry: { bg: 'bg-[#fef8f0]', text: 'text-[#d97706]', dot: 'bg-[#d97706]', label: 'Inquiry' },
    missed: { bg: 'bg-[#fef2f2]', text: 'text-[#dc2626]', dot: 'bg-[#dc2626]', label: 'Missed' },
    'in-progress': { bg: 'bg-[#f4f3f1]', text: 'text-[#5a7184]', dot: 'bg-[#94a7b8]', label: 'In progress' },
  };
  const c = config[outcome] || config['in-progress'];
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[12px] font-semibold ${c.bg} ${c.text}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${c.dot}`} />
      {c.label}
    </span>
  );
}

function SentimentDot({ sentiment }: { sentiment?: string }) {
  const config: Record<string, { color: string; label: string }> = {
    positive: { color: '#059669', label: 'Positive' },
    neutral: { color: '#94a7b8', label: 'Neutral' },
    negative: { color: '#dc2626', label: 'Negative' },
  };
  const c = config[sentiment || 'neutral'] || config.neutral;
  return (
    <span title={c.label} className="w-2.5 h-2.5 rounded-full inline-block" style={{ backgroundColor: c.color }} />
  );
}

function formatDuration(seconds?: number): string {
  if (!seconds) return '-';
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}:${secs.toString().padStart(2, '0')}`;
}

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

function formatTime(dateStr: string): string {
  return new Date(dateStr).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
}

function CallRow({ call }: { call: Call }) {
  const [expanded, setExpanded] = useState(false);
  const dateStr = call.startTime || call.createdAt;
  const firstName = call.customer?.firstName || 'Unknown';

  return (
    <div className="border-b border-[#f0eeeb] last:border-0">
      <div className="px-5 py-3.5 hover:bg-[#faf9f7] cursor-pointer transition-colors" onClick={() => setExpanded(!expanded)}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-5">
            <div className="text-[13px] text-[#94a7b8] w-28">{formatDate(dateStr)}</div>
            <div className="text-[14px] font-semibold text-[#1a2e3b] w-20">{formatTime(dateStr)}</div>
            <div className="text-[14px] font-medium text-[#1a2e3b]">{firstName}</div>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-[13px] text-[#5a7184] font-mono">{formatDuration(call.duration)}</span>
            <OutcomeBadge outcome={call.status} />
            <SentimentDot sentiment={call.sentiment} />
            {expanded ? <ChevronUp size={16} className="text-[#94a7b8]" /> : <ChevronDown size={16} className="text-[#94a7b8]" />}
          </div>
        </div>
      </div>
      {expanded && (
        <div className="px-5 pb-4 bg-[#faf9f7]">
          {call.audioUrl && (
            <div className="mb-3">
              <audio controls className="w-full h-10" preload="none">
                <source src={call.audioUrl} type="audio/wav" />
                Your browser does not support audio.
              </audio>
            </div>
          )}
          {!call.audioUrl && (
            <p className="text-[12px] text-[#94a7b8] mb-3 italic">No recording available</p>
          )}
          <div className="bg-white p-4 rounded-xl border border-[#e5e0da]">
            <h4 className="text-[13px] font-bold text-[#1a2e3b] mb-3">Transcript</h4>
            {call.transcript?.messages && call.transcript.messages.length > 0 ? (
              <div className="space-y-2">
                {call.transcript.messages.map((msg: { role: string; content: string }, idx: number) => (
                  <div key={idx} className={`flex ${msg.role === 'agent' ? 'justify-start' : 'justify-end'}`}>
                    <div className={`max-w-[85%] px-3 py-2 rounded-xl text-[13px] leading-relaxed ${
                      msg.role === 'agent'
                        ? 'bg-[#f0eeeb] text-[#1a2e3b] rounded-bl-sm'
                        : 'bg-[#1a2e3b] text-white rounded-br-sm'
                    }`}>
                      {msg.content}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <pre className="text-[13px] text-[#5a7184] whitespace-pre-wrap font-sans leading-relaxed">
                {call.transcript?.fullText || 'No transcript available'}
              </pre>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default function CallsPage() {
  const [calls, setCalls] = useState<Call[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isLive, setIsLive] = useState(false);

  // Demo calls for new accounts
  const now = Date.now();
  const demoCalls: Call[] = [
    { id: 'dc1', customer: { firstName: 'Test Caller' } as any, startTime: new Date(now - 1800000).toISOString(), createdAt: new Date().toISOString(), status: 'booked', duration: 142, phoneNumber: '(555) 123-4567', sentiment: 'positive', transcript: { fullText: 'Hi, I\'d like to book a window cleaning for my two-story home on Market Street...' } } as any,
    { id: 'dc2', customer: { firstName: 'Test Caller' } as any, startTime: new Date(now - 7200000).toISOString(), createdAt: new Date().toISOString(), status: 'booked', duration: 98, phoneNumber: '(555) 234-5678', sentiment: 'positive', transcript: { fullText: 'Can I schedule someone for next Tuesday morning? I have a ranch-style house...' } } as any,
    { id: 'dc3', customer: { firstName: 'Test Caller' } as any, startTime: new Date(now - 14400000).toISOString(), createdAt: new Date().toISOString(), status: 'inquiry', duration: 67, phoneNumber: '(555) 345-6789', sentiment: 'neutral', transcript: { fullText: 'How much do you charge for a three-story Victorian? And do you do gutters too?' } } as any,
    { id: 'dc4', customer: { firstName: 'Test Caller' } as any, startTime: new Date(now - 28800000).toISOString(), createdAt: new Date().toISOString(), status: 'booked', duration: 215, phoneNumber: '(555) 456-7890', sentiment: 'positive', transcript: { fullText: 'I need to reschedule my appointment from Thursday to Friday afternoon if possible...' } } as any,
    { id: 'dc5', customer: { firstName: 'Test Caller' } as any, startTime: new Date(now - 86400000).toISOString(), createdAt: new Date().toISOString(), status: 'completed', duration: 180, phoneNumber: '(555) 567-8901', sentiment: 'positive', transcript: { fullText: 'I\'m calling about getting my windows cleaned before a party this weekend...' } } as any,
    { id: 'dc6', customer: { firstName: 'Test Caller' } as any, startTime: new Date(now - 90000000).toISOString(), createdAt: new Date().toISOString(), status: 'missed', duration: 0, phoneNumber: '(555) 678-9012', sentiment: 'neutral' } as any,
  ];

  useEffect(() => {
    async function fetchCalls() {
      try {
        setLoading(true);
        const data = await getCalls(50);
        setCalls(data);
        try { const { getProvisionStatus } = await import('@/lib/api'); const s = await getProvisionStatus(); setIsLive(s.isLive || false); } catch {}
      } catch (err) {
        console.error('Failed to fetch calls:', err);
        setError('Failed to load calls');
      } finally {
        setLoading(false);
      }
    }
    fetchCalls();
  }, []);

  const isDemo = !isLive && calls.length === 0 && !loading;
  const displayCalls = calls.length > 0 ? calls : (isDemo ? demoCalls : []);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-[22px] font-bold text-[#1a2e3b]">Calls</h1>
        <p className="text-[13px] text-[#94a7b8] mt-1">View all incoming calls and transcripts</p>
      </div>

      {error && (
        <div className="bg-[#fef2f2] text-[#991b1b] p-4 rounded-xl text-sm">{error}</div>
      )}

      {isDemo && (
        <div className="bg-[#fef8f0] border border-[#f0dcc0] rounded-xl px-4 py-3">
          <p className="text-[13px] text-[#92640a]">
            <span className="font-semibold">Sample data</span> — your call history will appear here once your AI starts taking calls.
          </p>
        </div>
      )}

      <div className="bg-white rounded-xl border border-[#e5e0da]">
        <div className="px-5 py-3.5 border-b border-[#e5e0da] flex items-center gap-3">
          <select className="px-3 py-2 border border-[#e5e0da] rounded-lg text-[13px] text-[#1a2e3b] bg-white">
            <option>All Outcomes</option>
            <option>Booked</option>
            <option>Inquiry</option>
            <option>Missed</option>
          </select>
          <select className="px-3 py-2 border border-[#e5e0da] rounded-lg text-[13px] text-[#1a2e3b] bg-white">
            <option>Last 7 days</option>
            <option>Last 30 days</option>
            <option>All time</option>
          </select>
        </div>
        <div>
          {loading ? (
            <div className="p-8 text-center">
              <div className="w-5 h-5 border-2 border-[#1a2e3b] border-t-transparent rounded-full animate-spin mx-auto" />
            </div>
          ) : displayCalls.length > 0 ? (
            displayCalls.map((call) => <CallRow key={call.id} call={call} />)
          ) : (
            <div className="p-8 text-center text-[13px] text-[#94a7b8]">No calls yet</div>
          )}
        </div>
      </div>
    </div>
  );
}
