'use client';

import { Building2, Clock, MapPin, Calendar, Bell, CheckCircle } from 'lucide-react';

export default function SettingsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Settings</h1>
        <p className="text-gray-500 mt-1">Manage your business settings</p>
      </div>

      {/* Business Info */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
        <div className="flex items-center gap-3 mb-6">
          <Building2 className="text-blue-600" size={24} />
          <h2 className="text-xl font-bold text-gray-900">Business Information</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Business Name</label>
            <input
              type="text"
              defaultValue="Clean Pro Window Washing"
              className="w-full px-4 py-3 border border-gray-200 rounded-lg text-lg"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
            <input
              type="text"
              defaultValue="+1 (845) 209-2401"
              className="w-full px-4 py-3 border border-gray-200 rounded-lg text-lg"
              disabled
            />
          </div>
        </div>
      </div>

      {/* Business Hours */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
        <div className="flex items-center gap-3 mb-6">
          <Clock className="text-blue-600" size={24} />
          <h2 className="text-xl font-bold text-gray-900">Business Hours</h2>
        </div>
        <div className="space-y-4">
          {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'].map((day) => (
            <div key={day} className="flex items-center justify-between py-2">
              <span className="text-gray-700 font-medium w-32">{day}</span>
              <div className="flex items-center gap-2">
                <input type="time" defaultValue="08:00" className="px-3 py-2 border border-gray-200 rounded-lg" />
                <span className="text-gray-500">to</span>
                <input type="time" defaultValue="18:00" className="px-3 py-2 border border-gray-200 rounded-lg" />
              </div>
            </div>
          ))}
          <div className="flex items-center justify-between py-2">
            <span className="text-gray-700 font-medium w-32">Sunday</span>
            <span className="text-gray-500">Closed</span>
          </div>
        </div>
      </div>

      {/* Service Area */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
        <div className="flex items-center gap-3 mb-6">
          <MapPin className="text-blue-600" size={24} />
          <h2 className="text-xl font-bold text-gray-900">Service Area</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Base Location</label>
            <input
              type="text"
              defaultValue="Poughkeepsie, NY"
              className="w-full px-4 py-3 border border-gray-200 rounded-lg text-lg"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Service Radius</label>
            <select className="w-full px-4 py-3 border border-gray-200 rounded-lg text-lg">
              <option>30 miles</option>
              <option>20 miles</option>
              <option>40 miles</option>
              <option>50 miles</option>
            </select>
          </div>
        </div>
      </div>

      {/* Calendar Connection */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
        <div className="flex items-center gap-3 mb-6">
          <Calendar className="text-blue-600" size={24} />
          <h2 className="text-xl font-bold text-gray-900">Calendar Connection</h2>
        </div>
        <div className="flex items-center justify-between p-4 bg-green-50 rounded-xl">
          <div className="flex items-center gap-3">
            <CheckCircle className="text-green-600" size={24} />
            <div>
              <p className="font-medium text-gray-900">Google Calendar Connected</p>
              <p className="text-sm text-gray-500">cleanprowindows@gmail.com</p>
            </div>
          </div>
          <button className="px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors">
            Disconnect
          </button>
        </div>
      </div>

      {/* Save Button */}
      <div className="flex justify-end">
        <button className="px-8 py-3 bg-blue-600 text-white text-lg font-semibold rounded-xl hover:bg-blue-700 transition-colors">
          Save Changes
        </button>
      </div>
    </div>
  );
}
