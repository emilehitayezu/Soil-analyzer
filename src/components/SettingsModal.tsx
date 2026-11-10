import React, { useState } from 'react';
import { DeviceSettings } from '../utils/storage';
import { X, Settings, Wifi, WifiOff, MapPin, Volume2, Save, Battery } from 'lucide-react';
import { playSound } from '../utils/audio';

interface Props {
  settings: DeviceSettings;
  onSaveSettings: (settings: DeviceSettings) => void;
  onClose: () => void;
}

export const SettingsModal: React.FC<Props> = ({ settings, onSaveSettings, onClose }) => {
  const [form, setForm] = useState<DeviceSettings>({ ...settings });

  const handleSave = () => {
    if (form.soundEnabled) playSound.click();
    onSaveSettings(form);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-stone-900 border border-stone-800 rounded-2xl w-full max-w-lg max-h-[85vh] overflow-y-auto flex flex-col shadow-2xl">
        {/* Header */}
        <div className="p-4 border-b border-stone-800 flex items-center justify-between sticky top-0 bg-stone-900 z-10">
          <div>
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <Settings className="w-5 h-5 text-emerald-400" />
              <span>Smart Soil Device Settings</span>
            </h2>
            <p className="text-xs text-stone-400">
              Field location, network mode, and hardware parameters
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg bg-stone-800 hover:bg-stone-700 text-stone-400 hover:text-white cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content Form */}
        <div className="p-5 space-y-4 text-xs">
          {/* Network Mode */}
          <div className="bg-stone-950 p-3.5 rounded-xl border border-stone-800 space-y-2">
            <label className="font-semibold text-white block">Connectivity Operation Mode</label>
            <p className="text-stone-400 text-[11px]">
              Smart Soil operates 100% offline in remote fields. When set to Online, results sync automatically to the cloud platform.
            </p>
            <div className="grid grid-cols-2 gap-2 mt-2">
              <button
                type="button"
                onClick={() => setForm({ ...form, isOnline: false })}
                className={`p-2.5 rounded-lg border text-left flex items-center gap-2 transition-colors cursor-pointer ${
                  !form.isOnline
                    ? 'bg-amber-950/60 border-amber-500/80 text-amber-200'
                    : 'bg-stone-900 border-stone-800 text-stone-400 hover:text-white'
                }`}
              >
                <WifiOff className="w-4 h-4 text-amber-400 shrink-0" />
                <div>
                  <span className="font-bold block">Offline Mode</span>
                  <span className="text-[10px] text-stone-400">Default field mode</span>
                </div>
              </button>

              <button
                type="button"
                onClick={() => setForm({ ...form, isOnline: true })}
                className={`p-2.5 rounded-lg border text-left flex items-center gap-2 transition-colors cursor-pointer ${
                  form.isOnline
                    ? 'bg-emerald-950/60 border-emerald-500/80 text-emerald-200'
                    : 'bg-stone-900 border-stone-800 text-stone-400 hover:text-white'
                }`}
              >
                <Wifi className="w-4 h-4 text-emerald-400 shrink-0" />
                <div>
                  <span className="font-bold block">Online Mode</span>
                  <span className="text-[10px] text-stone-400">Cloud synchronizing</span>
                </div>
              </button>
            </div>
          </div>

          {/* Farm Plot Details */}
          <div className="bg-stone-950 p-3.5 rounded-xl border border-stone-800 space-y-3">
            <div>
              <label className="font-semibold text-white block mb-1">Active Farm Field Name</label>
              <input
                type="text"
                value={form.fieldLocationName}
                onChange={(e) => setForm({ ...form, fieldLocationName: e.target.value })}
                className="w-full bg-stone-900 border border-stone-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
              />
            </div>

            <div>
              <label className="font-semibold text-white block mb-1">GPS Coordinates (Auto-Tagged)</label>
              <input
                type="text"
                value={form.fieldGpsCoords}
                onChange={(e) => setForm({ ...form, fieldGpsCoords: e.target.value })}
                className="w-full bg-stone-900 border border-stone-800 rounded-lg px-3 py-2 text-xs font-mono text-stone-300 focus:outline-none focus:border-emerald-500"
              />
            </div>
          </div>

          {/* Battery & Sound settings */}
          <div className="bg-stone-950 p-3.5 rounded-xl border border-stone-800 space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <span className="font-semibold text-white block">Audible Hardware Feedback</span>
                <span className="text-[11px] text-stone-400">Synthesized clicks and sensor tones</span>
              </div>
              <input
                type="checkbox"
                checked={form.soundEnabled}
                onChange={(e) => setForm({ ...form, soundEnabled: e.target.checked })}
                className="w-4 h-4 accent-emerald-500 cursor-pointer"
              />
            </div>

            <div className="pt-2 border-t border-stone-800 flex items-center justify-between">
              <div>
                <span className="font-semibold text-white block">Battery Level Simulation</span>
                <span className="text-[11px] text-stone-400">Prototype value: 95%</span>
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="range"
                  min="20"
                  max="100"
                  value={form.batteryLevel}
                  onChange={(e) => setForm({ ...form, batteryLevel: Number(e.target.value) })}
                  className="w-24 accent-emerald-500"
                />
                <span className="font-mono text-white text-xs w-9 text-right">{form.batteryLevel}%</span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-stone-800 bg-stone-900 flex justify-end gap-2">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-stone-800 hover:bg-stone-700 text-stone-300 text-xs font-medium rounded-xl transition-colors cursor-pointer"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="px-6 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs rounded-xl flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <Save className="w-3.5 h-3.5" />
            <span>Save Settings</span>
          </button>
        </div>
      </div>
    </div>
  );
};
