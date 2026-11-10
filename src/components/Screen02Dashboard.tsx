import React from 'react';
import { DeviceSettings } from '../utils/storage';
import { SoilTestRecord, CropInfo } from '../types/soil';
import {
  Activity,
  History,
  Layers,
  Cpu,
  PlusCircle,
  ChevronRight,
  Battery,
  WifiOff,
  CheckCircle2,
  Clock,
  Sparkles,
} from 'lucide-react';
import { playSound } from '../utils/audio';

interface Props {
  settings: DeviceSettings;
  records: SoilTestRecord[];
  selectedCrop: CropInfo;
  onNewSoilTest: () => void;
  onOpenPreviousResults: () => void;
  onOpenCropSelection: () => void;
  onOpenDeviceStatus: () => void;
}

export const Screen02Dashboard: React.FC<Props> = ({
  settings,
  records,
  selectedCrop,
  onNewSoilTest,
  onOpenPreviousResults,
  onOpenCropSelection,
  onOpenDeviceStatus,
}) => {
  const latestRecord = records[0];
  const pendingCount = records.filter((r) => r.syncStatus === 'pending').length;

  const handleAction = (action: () => void) => {
    if (settings.soundEnabled) playSound.click();
    action();
  };

  return (
    <div className="flex flex-col min-h-[580px] h-full justify-between p-6 sm:p-8 bg-stone-900 text-stone-100 select-none">
      {/* Top Header & Greeting */}
      <div>
        <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-stone-800">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Smart Soil Dashboard
            </h1>
            <p className="text-emerald-400 font-medium text-sm mt-0.5">
              Welcome, Farmer!
            </p>
          </div>

          {/* Device Live Status Strip */}
          <div className="flex flex-wrap items-center gap-2 font-mono text-xs">
            <span className="flex items-center gap-1.5 bg-stone-800 border border-stone-700 px-3 py-1.5 rounded-lg text-emerald-400">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>All Sensors Ready</span>
            </span>
            <span className="flex items-center gap-1.5 bg-stone-800 border border-stone-700 px-3 py-1.5 rounded-lg text-amber-300">
              <WifiOff className="w-3.5 h-3.5" />
              <span>{settings.isOnline ? 'Online' : 'Offline Mode'}</span>
            </span>
            <span className="flex items-center gap-1.5 bg-stone-800 border border-stone-700 px-3 py-1.5 rounded-lg text-stone-300">
              <Battery className="w-3.5 h-3.5 text-emerald-400" />
              <span>{settings.batteryLevel}%</span>
            </span>
          </div>
        </div>

        {/* 4 Main Information Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6">
          {/* Card 1: Soil Analysis */}
          <div
            onClick={() => handleAction(onNewSoilTest)}
            className="group relative bg-stone-800/80 hover:bg-stone-800 border border-stone-700/80 hover:border-emerald-500/50 rounded-2xl p-5 cursor-pointer transition-all shadow-md hover:shadow-emerald-950/20 touch-press"
          >
            <div className="flex items-start justify-between">
              <div className="w-11 h-11 rounded-xl bg-emerald-950/80 border border-emerald-700/60 flex items-center justify-center text-emerald-400 group-hover:scale-105 transition-transform">
                <Activity className="w-6 h-6" />
              </div>
              <span className="text-[11px] font-mono text-emerald-400 bg-emerald-950/60 px-2.5 py-0.5 rounded-md border border-emerald-800/40">
                Primary Action
              </span>
            </div>
            <h3 className="text-lg font-bold text-white mt-4 group-hover:text-emerald-300 transition-colors">
              1. Soil Analysis
            </h3>
            <p className="text-stone-300 text-xs mt-1 leading-relaxed">
              Start a new soil test. Insert probe to measure pH, NPK, moisture, temperature, and conductivity.
            </p>
            <div className="mt-4 flex items-center gap-1 text-xs font-semibold text-emerald-400">
              <span>Start Soil Test Now</span>
              <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

          {/* Card 2: Previous Results */}
          <div
            onClick={() => handleAction(onOpenPreviousResults)}
            className="group relative bg-stone-800/80 hover:bg-stone-800 border border-stone-700/80 hover:border-stone-600 rounded-2xl p-5 cursor-pointer transition-all shadow-md touch-press"
          >
            <div className="flex items-start justify-between">
              <div className="w-11 h-11 rounded-xl bg-stone-900 border border-stone-700 flex items-center justify-center text-amber-400 group-hover:scale-105 transition-transform">
                <History className="w-6 h-6" />
              </div>
              <span className="text-[11px] font-mono text-stone-300 bg-stone-900 px-2 py-0.5 rounded border border-stone-700">
                {records.length} Saved {pendingCount > 0 ? `· ${pendingCount} pending sync` : ''}
              </span>
            </div>
            <h3 className="text-lg font-bold text-white mt-4 group-hover:text-amber-200 transition-colors">
              2. Previous Results
            </h3>
            <p className="text-stone-300 text-xs mt-1 leading-relaxed">
              View saved soil tests and historical fertilizer advice across your farm plots.
            </p>
            <div className="mt-4 flex items-center justify-between text-xs font-mono text-stone-400">
              <span className="truncate">
                {latestRecord ? `Latest: ${latestRecord.crop.name} (${latestRecord.date})` : 'No tests yet'}
              </span>
              <ChevronRight className="w-4 h-4 text-stone-500 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

          {/* Card 3: Crop Selection */}
          <div
            onClick={() => handleAction(onOpenCropSelection)}
            className="group relative bg-stone-800/80 hover:bg-stone-800 border border-stone-700/80 hover:border-stone-600 rounded-2xl p-5 cursor-pointer transition-all shadow-md touch-press"
          >
            <div className="flex items-start justify-between">
              <div className="w-11 h-11 rounded-xl bg-stone-900 border border-stone-700 flex items-center justify-center text-emerald-400 group-hover:scale-105 transition-transform">
                <Layers className="w-6 h-6" />
              </div>
              <span className="text-[11px] font-mono text-emerald-300 bg-emerald-950/70 px-2 py-0.5 rounded border border-emerald-800/40">
                Current: {selectedCrop.name.split(' ')[0]}
              </span>
            </div>
            <h3 className="text-lg font-bold text-white mt-4 group-hover:text-emerald-300 transition-colors">
              3. Crop Selection
            </h3>
            <p className="text-stone-300 text-xs mt-1 leading-relaxed">
              Select the crop to cultivate (Maize, Beans, Potatoes, Tomatoes, Rice) to tune nutrient thresholds.
            </p>
            <div className="mt-4 flex items-center justify-between text-xs font-semibold text-emerald-400">
              <span>Change Selected Crop</span>
              <ChevronRight className="w-4 h-4 text-stone-500 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

          {/* Card 4: Device Status */}
          <div
            onClick={() => handleAction(onOpenDeviceStatus)}
            className="group relative bg-stone-800/80 hover:bg-stone-800 border border-stone-700/80 hover:border-stone-600 rounded-2xl p-5 cursor-pointer transition-all shadow-md touch-press"
          >
            <div className="flex items-start justify-between">
              <div className="w-11 h-11 rounded-xl bg-stone-900 border border-stone-700 flex items-center justify-center text-blue-400 group-hover:scale-105 transition-transform">
                <Cpu className="w-6 h-6" />
              </div>
              <span className="text-[11px] font-mono text-blue-300 bg-blue-950/70 px-2 py-0.5 rounded border border-blue-800/40">
                5/5 Probes Active
              </span>
            </div>
            <h3 className="text-lg font-bold text-white mt-4 group-hover:text-blue-300 transition-colors">
              4. Device Status
            </h3>
            <p className="text-stone-300 text-xs mt-1 leading-relaxed">
              Check sensor health, electrode calibration offsets, battery level, and firmware telemetry.
            </p>
            <div className="mt-4 flex items-center justify-between text-xs font-semibold text-blue-400">
              <span>View Hardware Diagnostics</span>
              <ChevronRight className="w-4 h-4 text-stone-500 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>
        </div>
      </div>

      {/* Screen 02 Action Buttons */}
      <div className="mt-8 pt-4 border-t border-stone-800 grid grid-cols-1 sm:grid-cols-3 gap-3">
        <button
          onClick={() => handleAction(onNewSoilTest)}
          className="h-14 sm:col-span-1 bg-emerald-600 hover:bg-emerald-500 active:scale-[0.99] text-white font-bold text-sm rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-emerald-950/40 transition-all touch-press cursor-pointer"
        >
          <PlusCircle className="w-5 h-5" />
          <span>NEW SOIL TEST</span>
        </button>

        <button
          onClick={() => handleAction(onOpenPreviousResults)}
          className="h-14 bg-stone-800 hover:bg-stone-700 active:scale-[0.99] text-stone-200 font-semibold text-sm rounded-xl border border-stone-700 flex items-center justify-center gap-2 transition-all touch-press cursor-pointer"
        >
          <History className="w-4 h-4 text-amber-400" />
          <span>PREVIOUS RESULTS</span>
        </button>

        <button
          onClick={() => handleAction(onOpenDeviceStatus)}
          className="h-14 bg-stone-800 hover:bg-stone-700 active:scale-[0.99] text-stone-200 font-semibold text-sm rounded-xl border border-stone-700 flex items-center justify-center gap-2 transition-all touch-press cursor-pointer"
        >
          <Cpu className="w-4 h-4 text-blue-400" />
          <span>DEVICE STATUS</span>
        </button>
      </div>
    </div>
  );
};
