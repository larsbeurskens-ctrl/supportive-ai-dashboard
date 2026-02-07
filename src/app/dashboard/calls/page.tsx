'use client';

import { Phone, ChevronDown, ChevronUp, Play, Loader2 } from 'lucide-react';
import { useState, useEffect } from 'react';
import { getCalls, Call } from '@/lib/api';

function OutcomeBadge({ outcome }: { outcome: string }) {
  const styles: Record<string, string> = {
    booked: 'bg-green-100 text-green-700',
    completed: 'bg-green-100 text-green-700',
    inquiry: 'bg-yellow-100 text-yellow-700',
    missed: 'bg-red-100 text-red-700',
  };
  const labels: Record<string, string> = {
    booked: '✅ Booked',
    completed: '✅ Done',
    inquiry: '❓ Inquiry',
    missed: '❌ Missed',
  };
  return (
    <span className={`px-3 py-1 rounded-full text-sm font-medium ${styles[outcome] || 'bg-gray-100 text-gray-700'}`}>
      {labels[outcome] || outcome}
    </span>
  );
}

function SentimentEmoji({ sentiment }: { sentiment?: string }) {
  const emojis: Record<string, string> = {
    positive: '😊',
    neutral: '😐',
    negative: '😞',
  };
  return <span className="text-2xl">{sentiment ? emojis[sentiment] || '😐' : '😐'}</span>;
}

function formatDuration(seconds?: number): string {
  if (!seconds) return '-';
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}:${secs.toString().padStart(2, '0')}`;
}

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString('en-US', { 
    month: 'short', 
    day: 'numeric',
    year: 'numeric'
  });
}

function formatTime(dateStr: string): string {
  return new Date(dateStr).toLocaleTimeString('en-US', { 
    hour: 'numeric', 
    minute: '2-digit'
  });
}

function CallRow({ call }: { call: Call }) {
  const [expanded, setExpanded] = useState(false);
  const dateStr = call.startTime || call.createdAt;

  return (
    <div className="border-b border-gray-100 last:border-0">
      <div 
        className="p-4 hover:bg-gray-50 cursor-pointer transition-colors"
        onClick={() => setExpanded(!expanded)}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-6">
            <div className="text-sm text-gray-500 w-28">{formatDate(dateStr)}</div>
            <div className="font-medium text-gray-900 w-24">{formatTime(dateStr)}</div>
            <div>
              <p className="font-medium text-gray-900">{call.phoneNumber}</p>
              <p className="text-sm text-gray-500">
                {call.customer ? `${call.customer.firstName} ${call.customer.lastName}` : 'Unknown'}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-gray-500">{formatDuration(call.duration)}</span>
            <OutcomeBadge outcome={call.status} />
            <SentimentEmoji sentiment={call.sentiment} />
            {expanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
          </div>
        </div>
      </div>
      
      {expanded && (
        <div className="px-4 pb-4 bg-gray-50">
          <div className="flex items-center gap-2 mb-3">
            <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
              <Play size={16} />
              Play Recording
            </button>
          </div>
          <div className="bg-white p-4 rounded-lg border border-gray-200">
            <h4 className="font-medium text-gray-900 mb-2">Transcript</h4>
            <pre className="text-sm text-gray-700 whitespace-pre-wrap font-sans">
              {call.transcript?.fullText || 'No transcript available'}
            </pre>
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

  useEffect(() => {
    async function fetchCalls() {
      try {
        setLoading(true);
        const data = await getCalls(50);
        setCalls(data);
      } catch (err) {
        console.error('Failed to fetch calls:', err);
        setError('Failed to load calls');
      } finally {
        setLoading(false);
      }
    }
    fetchCalls();
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Calls</h1>
        <p className="text-gray-500 mt-1">View all incoming calls and transcripts</p>
      </div>

      {error && (
        <div className="bg-red-50 text-red-700 p-4 rounded-xl">{error}</div>
      )}

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100">
        <div className="p-4 border-b border-gray-100 flex items-center gap-4">
          <select className="px-4 py-2 border border-gray-200 rounded-lg text-gray-700">
            <option>All Outcomes</option>
            <option>Booked</option>
            <option>Inquiry</option>
            <option>Missed</option>
          </select>
          <select className="px-4 py-2 border border-gray-200 rounded-lg text-gray-700">
            <option>Last 7 days</option>
            <option>Last 30 days</option>
            <option>All time</option>
          </select>
        </div>
        
        <div>
          {loading ? (
            <div className="p-8 text-center">
              <Loader2 className="animate-spin text-gray-400 mx-auto" size={32} />
            </div>
          ) : calls.length > 0 ? (
            calls.map((call) => <CallRow key={call.id} call={call} />)
          ) : (
            <div className="p-8 text-center text-gray-500">No calls found</div>
          )}
        </div>
      </div>
    </div>
  );
}
