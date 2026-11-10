import React from 'react';
import { DeviceSettings } from '../utils/storage';
import { Sprout, Settings, ArrowRight, Battery, WifiOff, CheckCircle2 } from 'lucide-react';
import { playSound } from '../utils/audio';

interface Props {
  settings: DeviceSettings;
  onStartAnalysis: () => void;
  onOpenSettings: () => void;
}

export const Screen01Welcome: React.FC<Props> = ({
  settings,
  onStartAnalysis,
  onOpenSettings,
}) => {
  const handleStart = () => {
    if (settings.soundEnabled) playSound.click();
    onStartAnalysis();
  };

  const handleSettings = () => {
    if (settings.soundEnabled) playSound.click();
    onOpenSettings();
  };

  return (
    <div className="flex flex-col min-h-[580px] h-full justify-between p-6 sm:p-8 bg-stone-900 text-stone-100 select-none">
      {/* Top Brand & Diagnostic Status Block */}
      <div>
        <div className="flex items-center justify-between pb-4 border-b border-stone-800">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-emerald-600/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400">
              <Sprout className="w-6 h-6 text-emerald-400" />
            </div>
            <div>
              <h1 className="text-xl font-extrabold tracking-tight text-white flex items-center gap-2">
                SMART SOIL
              </h1>
              <p className="text-xs font-semibold tracking-wider text-emerald-400 uppercase">
                Grow Smarter
              </p>
            </div>
          </div>

          {/* Quick Hardware Status */}
          <div className="flex items-center gap-3 text-xs font-mono text-stone-400">
            <span className="flex items-center gap-1.5 bg-stone-800/90 border border-stone-700 px-2.5 py-1 rounded">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
              <span>Device Ready</span>
            </span>
          </div>
        </div>

        {/* Hero Visual & Headline */}
        <div className="mt-6 grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
          <div className="md:col-span-7 space-y-4">
            <div className="inline-flex items-center gap-2 text-xs font-mono text-emerald-400 bg-emerald-950/60 border border-emerald-800/50 px-3 py-1 rounded-full">
              <span>● SYSTEM INITIALIZED</span>
              <span className="text-stone-500">·</span>
              <span>PORTABLE IOT ANALYZER</span>
            </div>

            <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight leading-tight">
              Welcome to <span className="text-emerald-400">Smart Soil</span>
            </h2>

            <p className="text-stone-300 text-base leading-relaxed max-w-lg">
              Your portable soil analysis and fertilizer recommendation assistant. Test NPK, pH, moisture, and electrical conductivity directly in the field—online or completely offline.
            </p>

            {/* Device Telemetry Badges */}
            <div className="grid grid-cols-3 gap-2.5 pt-2 max-w-md">
              <div className="bg-stone-800/80 border border-stone-700/80 rounded-lg p-2.5 text-center">
                <span className="block text-[10px] uppercase font-mono text-stone-400">Status</span>
                <span className="text-xs font-semibold text-emerald-400 flex items-center justify-center gap-1 mt-0.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                  Device Ready
                </span>
              </div>
              <div className="bg-stone-800/80 border border-stone-700/80 rounded-lg p-2.5 text-center">
                <span className="block text-[10px] uppercase font-mono text-stone-400">Network</span>
                <span className="text-xs font-semibold text-amber-300 flex items-center justify-center gap-1 mt-0.5">
                  <WifiOff className="w-3 h-3 text-amber-400" />
                  {settings.isOnline ? 'Online' : 'Offline Mode'}
                </span>
              </div>
              <div className="bg-stone-800/80 border border-stone-700/80 rounded-lg p-2.5 text-center">
                <span className="block text-[10px] uppercase font-mono text-stone-400">Battery</span>
                <span className="text-xs font-semibold text-emerald-400 font-mono flex items-center justify-center gap-1 mt-0.5">
                  <Battery className="w-3 h-3 text-emerald-400" />
                  {settings.batteryLevel}%
                </span>
              </div>
            </div>
          </div>

          {/* Device Picture / Visual Graphic */}
          <div className="md:col-span-5 flex justify-center">
            <div className="relative group w-full max-w-sm rounded-2xl overflow-hidden border border-stone-700/80 bg-stone-950 shadow-xl shadow-black/50">
              <img
                src="/src/assets/images/smart_soil_analyzer_device_1794320147487.jpg"
                alt="Smart Soil Handheld Analyzer Device with Multi-Parameter Probes"
                className="w-full h-52 sm:h-56 object-cover object-center brightness-95 group-hover:scale-105 transition-transform duration-500"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-stone-950 via-stone-950/20 to-transparent pointer-events-none" />
              <div className="absolute bottom-3 left-3 right-3 text-left">
                <p className="text-xs font-semibold text-white">Agri-Probe Multi-Sensor Array</p>
                <p className="text-[11px] text-stone-300">pH · Nitrogen · Phosphorus · Potassium · EC · Moisture</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Screen 01 Action Buttons (Touchscreen Tap Targets >= 48px) */}
      <div className="mt-8 pt-4 border-t border-stone-800 flex flex-col sm:flex-row items-center gap-3">
        <button
          onClick={handleStart}
          className="w-full sm:flex-1 h-14 bg-emerald-600 hover:bg-emerald-500 active:scale-[0.99] text-white font-bold text-base rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-emerald-900/30 transition-all touch-press cursor-pointer"
        >
          <span>START ANALYSIS</span>
          <ArrowRight className="w-5 h-5" />
        </button>

        <button
          onClick={handleSettings}
          className="w-full sm:w-auto px-6 h-14 bg-stone-800 hover:bg-stone-700 active:scale-[0.99] text-stone-200 font-semibold text-sm rounded-xl border border-stone-700 flex items-center justify-center gap-2 transition-all touch-press cursor-pointer"
        >
          <Settings className="w-4 h-4 text-stone-400" />
          <span>SETTINGS</span>
        </button>
      </div>
    </div>
  );
};
