'use client';

import { Building2, Clock, MapPin, Calendar, CheckCircle } from 'lucide-react';

export default function SettingsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-[22px] font-bold text-[#1a2e3b]">Settings</h1>
        <p className="text-[13px] text-[#94a7b8] mt-1">Manage your business settings</p>
      </div>

      {/* Business Info */}
      <div className="bg-white rounded-xl border border-[#e5e0da] p-6">
        <div className="flex items-center gap-2.5 mb-5">
          <Building2 className="text-[#e8930c]" size={20} />
          <h2 className="text-[15px] font-bold text-[#1a2e3b]">Business Information</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div>
            <label className="block text-[13px] font-semibold text-[#5a7184] mb-1.5">Business Name</label>
            <input type="text" defaultValue="Clean Pro Window Washing"
              className="w-full px-4 py-3 border border-[#e5e0da] rounded-xl text-[15px] text-[#1a2e3b] focus:outline-none focus:ring-2 focus:ring-[#e8930c] focus:border-transparent" />
          </div>
          <div>
            <label className="block text-[13px] font-semibold text-[#5a7184] mb-1.5">Phone Number</label>
            <input type="text" defaultValue="+1 (845) 209-2401"
              className="w-full px-4 py-3 border border-[#e5e0da] rounded-xl text-[15px] text-[#94a7b8] bg-[#faf9f7]" disabled />
          </div>
        </div>
      </div>

      {/* Business Hours */}
      <div className="bg-white rounded-xl border border-[#e5e0da] p-6">
        <div className="flex items-center gap-2.5 mb-5">
          <Clock className="text-[#e8930c]" size={20} />
          <h2 className="text-[15px] font-bold text-[#1a2e3b]">Business Hours</h2>
        </div>
        <div className="space-y-3">
          {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'].map((day) => (
            <div key={day} className="flex items-center justify-between py-1.5">
              <span className="text-[14px] text-[#1a2e3b] font-medium w-28">{day}</span>
              <div className="flex items-center gap-2">
                <input type="time" defaultValue="08:00" className="px-3 py-2 border border-[#e5e0da] rounded-lg text-[13px] text-[#1a2e3b]" />
                <span className="text-[13px] text-[#94a7b8]">to</span>
                <input type="time" defaultValue="18:00" className="px-3 py-2 border border-[#e5e0da] rounded-lg text-[13px] text-[#1a2e3b]" />
              </div>
            </div>
          ))}
          <div className="flex items-center justify-between py-1.5">
            <span className="text-[14px] text-[#1a2e3b] font-medium w-28">Sunday</span>
            <span className="text-[13px] text-[#94a7b8]">Closed</span>
          </div>
        </div>
      </div>

      {/* Service Area */}
      <div className="bg-white rounded-xl border border-[#e5e0da] p-6">
        <div className="flex items-center gap-2.5 mb-5">
          <MapPin className="text-[#e8930c]" size={20} />
          <h2 className="text-[15px] font-bold text-[#1a2e3b]">Service Area</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div>
            <label className="block text-[13px] font-semibold text-[#5a7184] mb-1.5">Base Location</label>
            <input type="text" defaultValue="Poughkeepsie, NY"
              className="w-full px-4 py-3 border border-[#e5e0da] rounded-xl text-[15px] text-[#1a2e3b] focus:outline-none focus:ring-2 focus:ring-[#e8930c] focus:border-transparent" />
          </div>
          <div>
            <label className="block text-[13px] font-semibold text-[#5a7184] mb-1.5">Service Radius</label>
            <select className="w-full px-4 py-3 border border-[#e5e0da] rounded-xl text-[15px] text-[#1a2e3b] bg-white focus:outline-none focus:ring-2 focus:ring-[#e8930c]">
              <option>30 miles</option><option>20 miles</option><option>40 miles</option><option>50 miles</option>
            </select>
          </div>
        </div>
      </div>

      {/* Calendar */}
      <div className="bg-white rounded-xl border border-[#e5e0da] p-6">
        <div className="flex items-center gap-2.5 mb-5">
          <Calendar className="text-[#e8930c]" size={20} />
          <h2 className="text-[15px] font-bold text-[#1a2e3b]">Calendar Connection</h2>
        </div>
        <div className="flex items-center justify-between p-4 bg-[#eef9f0] rounded-xl">
          <div className="flex items-center gap-3">
            <CheckCircle className="text-[#059669]" size={20} />
            <div>
              <p className="text-[14px] font-semibold text-[#1a2e3b]">Google Calendar Connected</p>
              <p className="text-[12px] text-[#5a7184]">cleanprowindows@gmail.com</p>
            </div>
          </div>
          <button className="px-3 py-1.5 text-[13px] text-[#dc2626] hover:bg-[#fef2f2] rounded-lg transition-colors">Disconnect</button>
        </div>
      </div>

      {/* Save */}
      <div className="flex justify-end">
        <button className="px-6 py-3 bg-[#e8930c] text-white text-[14px] font-bold rounded-xl hover:bg-[#d17f00] transition-colors shadow-[0_2px_8px_rgba(232,147,12,0.25)]">
          Save Changes
        </button>
      </div>
    </div>
  );
}
