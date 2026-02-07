'use client';

import { Phone, ChevronDown, ChevronUp, Play } from 'lucide-react';
import { useState } from 'react';

// Mock data
const calls = [
  { 
    id: '1', 
    date: '2026-02-07', 
    time: '8:23 AM', 
    phone: '+1 845-555-1234', 
    duration: '3:45',
    outcome: 'booked',
    sentiment: 'positive',
    customerName: 'John Smith',
    transcript: 'Sarah: Thank you for calling Clean Pro Window Washing! This is Sarah. How can I help you today?\n\nCaller: Hi, I\'d like to get my windows cleaned...'
  },
  { 
    id: '2', 
    date: '2026-02-07', 
    time: '7:45 AM', 
    phone: '+1 845-555-9876', 
    duration: '1:20',
    outcome: 'inquiry',
    sentiment: 'neutral',
    customerName: 'Unknown',
    transcript: 'Sarah: Thank you for calling Clean Pro Window Washing! This is Sarah. How can I help you today?\n\nCaller: Just checking your prices...'
  },
];

function OutcomeBadge({ outcome }: { outcome: string }) {
  const styles: Record<string, string> = {
    booked: 'bg-green-100 text-green-700',
    inquiry: 'bg-yellow-100 text-yellow-700',
    missed: 'bg-red-100 text-red-700',
  };
  const labels: Record<string, string> = {
    booked: '✅ Booked',
    inquiry: '❓ Inquiry',
    missed: '❌ Missed',
  };
  return (
    <span className={`px-3 py-1 rounded-full text-sm font-medium ${styles[outcome]}`}>
      {labels[outcome]}
    </span>
  );
}

function SentimentEmoji({ sentiment }: { sentiment: string }) {
  const emojis: Record<string, string> = {
    positive: '😊',
    neutral: '😐',
    negative: '😞',
  };
  return <span className="text-2xl">{emojis[sentiment]}</span>;
}

function CallRow({ call }: { call: typeof calls[0] }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="border-b border-gray-100 last:border-0">
      <div 
        className="p-4 hover:bg-gray-50 cursor-pointer transition-colors"
        onClick={() => setExpanded(!expanded)}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-6">
            <div className="text-sm text-gray-500 w-24">{call.date}</div>
            <div className="font-medium text-gray-900 w-20">{call.time}</div>
            <div>
              <p className="font-medium text-gray-900">{call.phone}</p>
              <p className="text-sm text-gray-500">{call.customerName}</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-gray-500">{call.duration}</span>
            <OutcomeBadge outcome={call.outcome} />
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
              {call.transcript}
            </pre>
          </div>
        </div>
      )}
    </div>
  );
}

export default function CallsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Calls</h1>
        <p className="text-gray-500 mt-1">View all incoming calls and transcripts</p>
      </div>

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
          {calls.map((call) => (
            <CallRow key={call.id} call={call} />
          ))}
        </div>
      </div>
    </div>
  );
}
