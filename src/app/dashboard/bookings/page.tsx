'use client';

import { MapPin, Clock, ChevronLeft, ChevronRight } from 'lucide-react';
import { useState, useEffect, useMemo } from 'react';
import { getBookings, Booking } from '@/lib/api';

function StatusBadge({ status }: { status: string }) {
  const config: Record<string, { bg: string; text: string; label: string }> = {
    confirmed: { bg: 'bg-[#eef9f0]', text: 'text-[#059669]', label: 'Confirmed' },
    pending: { bg: 'bg-[#fef8f0]', text: 'text-[#d97706]', label: 'Pending' },
    cancelled: { bg: 'bg-[#fef2f2]', text: 'text-[#dc2626]', label: 'Cancelled' },
    completed: { bg: 'bg-[#f4f3f1]', text: 'text-[#5a7184]', label: 'Completed' },
  };
  const c = config[status] || { bg: 'bg-[#f4f3f1]', text: 'text-[#5a7184]', label: status };
  return <span className={`px-2.5 py-1 rounded-full text-[12px] font-semibold ${c.bg} ${c.text}`}>{c.label}</span>;
}

function formatTime(timeStr: string): string {
  if (!timeStr) return '';
  const [hours, minutes] = timeStr.split(':').map(Number);
  const ampm = hours >= 12 ? 'PM' : 'AM';
  const hour12 = hours % 12 || 12;
  return `${hour12}:${minutes.toString().padStart(2, '0')} ${ampm}`;
}

function isSameDay(d1: Date, d2: Date) {
  return d1.getFullYear() === d2.getFullYear() && d1.getMonth() === d2.getMonth() && d1.getDate() === d2.getDate();
}

/* ===== Mini Calendar Component ===== */
function MiniCalendar({ bookings, selectedDate, onSelectDate }: {
  bookings: Booking[];
  selectedDate: Date | null;
  onSelectDate: (date: Date) => void;
}) {
  const [viewMonth, setViewMonth] = useState(() => new Date());
  const today = new Date();

  // Dates that have bookings
  const bookedDates = useMemo(() => {
    const set = new Set<string>();
    bookings.forEach(b => {
      const d = new Date(b.scheduledDate);
      set.add(`${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`);
    });
    return set;
  }, [bookings]);

  const year = viewMonth.getFullYear();
  const month = viewMonth.getMonth();
  const firstDay = new Date(year, month, 1).getDay(); // 0=Sun
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const monthLabel = viewMonth.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });

  const days: (number | null)[] = [];
  for (let i = 0; i < firstDay; i++) days.push(null);
  for (let d = 1; d <= daysInMonth; d++) days.push(d);

  const prevMonth = () => setViewMonth(new Date(year, month - 1, 1));
  const nextMonth = () => setViewMonth(new Date(year, month + 1, 1));

  return (
    <div className="bg-white rounded-xl border border-[#e5e0da] p-5">
      {/* Month navigation */}
      <div className="flex items-center justify-between mb-4">
        <button onClick={prevMonth} className="p-1.5 rounded-lg hover:bg-[#f4f3f1] text-[#5a7184] cursor-pointer border-none bg-transparent">
          <ChevronLeft size={16} />
        </button>
        <span className="text-[14px] font-bold text-[#1a2e3b]">{monthLabel}</span>
        <button onClick={nextMonth} className="p-1.5 rounded-lg hover:bg-[#f4f3f1] text-[#5a7184] cursor-pointer border-none bg-transparent">
          <ChevronRight size={16} />
        </button>
      </div>
      {/* Weekday headers */}
      <div className="grid grid-cols-7 gap-0 mb-1">
        {['Su','Mo','Tu','We','Th','Fr','Sa'].map(d => (
          <div key={d} className="text-center text-[11px] font-semibold text-[#94a7b8] py-1">{d}</div>
        ))}
      </div>
      {/* Day cells */}
      <div className="grid grid-cols-7 gap-0">
        {days.map((day, i) => {
          if (day === null) return <div key={`e-${i}`} className="py-1.5" />;
          const cellDate = new Date(year, month, day);
          const isToday = isSameDay(cellDate, today);
          const hasBooking = bookedDates.has(`${year}-${month}-${day}`);
          const isSelected = selectedDate && isSameDay(cellDate, selectedDate);
          const isPast = cellDate < new Date(today.getFullYear(), today.getMonth(), today.getDate());
          return (
            <button key={day} onClick={() => onSelectDate(cellDate)}
              className={`relative py-1.5 text-center text-[13px] rounded-lg cursor-pointer border-none transition-colors
                ${isSelected ? 'bg-[#e8930c] text-white font-bold' : isToday ? 'bg-[#fef8f0] text-[#e8930c] font-bold' : isPast ? 'text-[#ccc] bg-transparent' : 'text-[#1a2e3b] bg-transparent hover:bg-[#f4f3f1]'}
              `}>
              {day}
              {hasBooking && !isSelected && (
                <span className="absolute bottom-0.5 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-[#e8930c]" />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}

/* ===== Main Bookings Page ===== */
export default function BookingsPage() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [isLive, setIsLive] = useState(false);
  const [calendarConnected, setCalendarConnected] = useState(true); // assume true to avoid flash
  const [calendarAuthUrl, setCalendarAuthUrl] = useState<string | null>(null);

  // Demo bookings for new accounts
  const now = new Date();
  const tmrw = new Date(now); tmrw.setDate(tmrw.getDate() + 1);
  const dayAfter = new Date(now); dayAfter.setDate(dayAfter.getDate() + 2);
  const day3 = new Date(now); day3.setDate(day3.getDate() + 4);
  const day4 = new Date(now); day4.setDate(day4.getDate() + 5);
  const pastDay = new Date(now); pastDay.setDate(pastDay.getDate() - 1);

  const demoBookings: Booking[] = [
    { id: 'd1', customer: { firstName: 'Test Caller' } as any, scheduledTime: '09:00', scheduledDate: tmrw.toISOString(), serviceAddress: '12 Market St, Poughkeepsie', status: 'confirmed', stories: 2, propertyType: 'Residential', estimatedPrice: 280 } as any,
    { id: 'd2', customer: { firstName: 'Test Caller' } as any, scheduledTime: '11:30', scheduledDate: tmrw.toISOString(), serviceAddress: '45 Oak St, Newburgh', status: 'confirmed', stories: 1, propertyType: 'Residential', estimatedPrice: 150 } as any,
    { id: 'd3', customer: { firstName: 'Test Caller' } as any, scheduledTime: '09:30', scheduledDate: dayAfter.toISOString(), serviceAddress: '8 River Rd, Kingston', status: 'confirmed', stories: 3, propertyType: 'Residential', estimatedPrice: 420 } as any,
    { id: 'd4', customer: { firstName: 'Test Caller' } as any, scheduledTime: '14:00', scheduledDate: day3.toISOString(), serviceAddress: '22 Elm Ave, New Paltz', status: 'pending', stories: 2, propertyType: 'Commercial', estimatedPrice: 350 } as any,
    { id: 'd5', customer: { firstName: 'Test Caller' } as any, scheduledTime: '10:00', scheduledDate: day4.toISOString(), serviceAddress: '6 Main St, Rhinebeck', status: 'confirmed', stories: 1, propertyType: 'Residential', estimatedPrice: 180 } as any,
    { id: 'd6', customer: { firstName: 'Test Caller' } as any, scheduledTime: '08:30', scheduledDate: pastDay.toISOString(), serviceAddress: '99 Bridge St, Highland', status: 'completed', stories: 2, propertyType: 'Residential', estimatedPrice: 310 } as any,
  ];

  useEffect(() => {
    async function load() {
      try {
        setLoading(true);
        const data = await getBookings();
        setBookings(data);
        try { 
          const { getProvisionStatus } = await import('@/lib/api'); 
          const s = await getProvisionStatus(); 
          setIsLive(s.isLive || false);
          setCalendarConnected(s.checklist?.calendarConnected || false);
          if (s.calendarAuthUrl) setCalendarAuthUrl(s.calendarAuthUrl);
        } catch {}
      } catch (err) { console.error(err); }
      finally { setLoading(false); }
    }
    load();
  }, []);

  const isDemo = !isLive && bookings.length === 0 && !loading;
  const allBookings = bookings.length > 0 ? bookings : (isDemo ? demoBookings : []);

  // Filter by selected date
  const filteredBookings = useMemo(() => {
    if (!selectedDate) return allBookings;
    return allBookings.filter(b => isSameDay(new Date(b.scheduledDate), selectedDate));
  }, [allBookings, selectedDate]);

  // Sort: upcoming first, then past
  const sortedBookings = useMemo(() => {
    return [...filteredBookings].sort((a, b) => {
      const da = new Date(a.scheduledDate + 'T' + (a.scheduledTime || '00:00'));
      const db = new Date(b.scheduledDate + 'T' + (b.scheduledTime || '00:00'));
      return da.getTime() - db.getTime();
    });
  }, [filteredBookings]);

  // Group by date for the list
  const grouped = useMemo(() => {
    const groups: { label: string; date: Date; bookings: Booking[] }[] = [];
    const map = new Map<string, Booking[]>();
    sortedBookings.forEach(b => {
      const key = new Date(b.scheduledDate).toDateString();
      if (!map.has(key)) map.set(key, []);
      map.get(key)!.push(b);
    });
    const today = new Date();
    const tomorrow = new Date(today); tomorrow.setDate(tomorrow.getDate() + 1);
    map.forEach((bks, key) => {
      const d = new Date(key);
      let label: string;
      if (isSameDay(d, today)) label = 'Today';
      else if (isSameDay(d, tomorrow)) label = 'Tomorrow';
      else label = d.toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' });
      groups.push({ label, date: d, bookings: bks });
    });
    return groups.sort((a, b) => a.date.getTime() - b.date.getTime());
  }, [sortedBookings]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-[22px] font-bold text-[#1a2e3b]">Bookings</h1>
        <p className="text-[13px] text-[#94a7b8] mt-1">
          {allBookings.length} booking{allBookings.length !== 1 ? 's' : ''}
          {selectedDate && ` · Showing ${selectedDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}`}
        </p>
      </div>

      {/* Calendar Connect Banner */}
      {!calendarConnected && (
        <div className="bg-[#eff6ff] border border-[#3b82f6] rounded-xl px-5 py-4 flex items-center justify-between gap-4">
          <div>
            <p className="text-[14px] font-semibold text-[#1e40af]">Connect Google Calendar to enable bookings</p>
            <p className="text-[12px] text-[#3b82f6] mt-0.5">Your AI receptionist needs calendar access to check availability and book appointments. Takes 30 seconds.</p>
          </div>
          {calendarAuthUrl ? (
            <a href={calendarAuthUrl} className="bg-[#3b82f6] text-white px-5 py-2.5 rounded-lg text-[13px] font-bold hover:bg-[#2563eb] transition-colors whitespace-nowrap no-underline">
              Connect Calendar
            </a>
          ) : (
            <span className="text-[12px] text-[#94a7b8]">Set up your AI agent first</span>
          )}
        </div>
      )}

      {isDemo && (
        <div className="bg-[#fef8f0] border border-[#f0dcc0] rounded-xl px-4 py-3">
          <p className="text-[13px] text-[#92640a]">
            <span className="font-semibold">Sample data</span> — your bookings will appear here once your AI starts taking calls.
          </p>
        </div>
      )}

      {/* Calendar + upcoming summary */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Calendar */}
        <div className="lg:col-span-1">
          <MiniCalendar bookings={allBookings} selectedDate={selectedDate} onSelectDate={(d) => {
            if (selectedDate && isSameDay(d, selectedDate)) setSelectedDate(null);
            else setSelectedDate(d);
          }} />
          {selectedDate && (
            <button onClick={() => setSelectedDate(null)}
              className="mt-2 w-full text-[12px] text-[#94a7b8] hover:text-[#5a7184] bg-transparent border-none cursor-pointer py-1">
              Clear filter · show all
            </button>
          )}
        </div>

        {/* Booking list */}
        <div className="lg:col-span-2">
          {loading ? (
            <div className="bg-white rounded-xl border border-[#e5e0da] p-10 text-center">
              <div className="w-5 h-5 border-2 border-[#1a2e3b] border-t-transparent rounded-full animate-spin mx-auto" />
            </div>
          ) : grouped.length === 0 ? (
            <div className="bg-white rounded-xl border border-[#e5e0da] p-10 text-center">
              <p className="text-sm text-[#94a7b8]">{selectedDate ? 'No bookings on this date' : 'No bookings yet'}</p>
            </div>
          ) : (
            <div className="space-y-4">
              {grouped.map(group => (
                <div key={group.label}>
                  <h3 className="text-[12px] font-bold text-[#94a7b8] uppercase tracking-wider mb-2 px-1">{group.label}</h3>
                  <div className="bg-white rounded-xl border border-[#e5e0da] overflow-hidden">
                    {group.bookings.map((b, i) => {
                      const isPast = new Date(b.scheduledDate) < new Date(new Date().toDateString());
                      return (
                        <div key={b.id} className={`px-5 py-4 flex items-center justify-between gap-4 ${i < group.bookings.length - 1 ? 'border-b border-[#f0eeeb]' : ''} ${isPast ? 'opacity-60' : ''}`}>
                          <div className="flex items-center gap-4 min-w-0">
                            <div className="w-[60px] shrink-0">
                              <span className="text-[15px] font-bold text-[#1a2e3b] tabular-nums">{formatTime(b.scheduledTime)}</span>
                            </div>
                            <div className="min-w-0">
                              <p className="text-[14px] font-semibold text-[#1a2e3b] truncate">{b.customer?.firstName || 'Customer'}</p>
                              <div className="flex items-center gap-1 mt-0.5">
                                <MapPin size={11} className="text-[#b8c4ce] shrink-0" />
                                <p className="text-[12px] text-[#94a7b8] truncate">{b.serviceAddress || 'No address'}</p>
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center gap-3 shrink-0">
                            {(b as any).estimatedPrice && (
                              <span className="text-[13px] font-semibold text-[#1a2e3b]">${(b as any).estimatedPrice}</span>
                            )}
                            <StatusBadge status={b.status} />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
