import React from 'react';
import { Battery, WifiOff, Wifi, MapPin, Volume2, VolumeX, ShieldCheck } from 'lucide-react';
import { DeviceSettings } from '../utils/storage';
import { playSound } from '../utils/audio';

interface Props {
  settings: DeviceSettings;
  onUpdateSettings: (newSettings: DeviceSettings) => void;
  statusLabel?: string;
}

export const DeviceStatusBar: React.FC<Props> = ({ settings, onUpdateSettings, statusLabel = 'Device Ready' }) => {
  const toggleOnline = () => {
    if (settings.soundEnabled) playSound.click();
    onUpdateSettings({
      ...settings,
      isOnline: !settings.isOnline,
    });
  };

  const toggleSound = () => {
    const next = !settings.soundEnabled;
    if (next) playSound.click();
    onUpdateSettings({
      ...settings,
      soundEnabled: next,
    });
  };

  return (
    <div className="bg-stone-900 border-b border-stone-800 text-stone-300 px-4 py-2 text-xs flex flex-wrap items-center justify-between gap-3 select-none">
      {/* Brand & Device Tag */}
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-1.5 font-bold tracking-wider text-emerald-400">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
          <span className="font-mono text-sm uppercase">SMART SOIL</span>
        </div>
        <span className="text-stone-600 hidden sm:inline">|</span>
        <div className="flex items-center gap-1 text-stone-400 font-mono text-[11px]">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
          <span>{statusLabel}</span>
        </div>
      </div>

      {/* Field Location */}
      <div className="hidden md:flex items-center gap-1.5 text-stone-400 text-[11px] truncate max-w-xs">
        <MapPin className="w-3.5 h-3.5 text-stone-500 shrink-0" />
        <span className="truncate">{settings.fieldLocationName}</span>
      </div>

      {/* Telemetry Status Controls */}
      <div className="flex items-center gap-3">
        {/* Sound toggle */}
        <button
          onClick={toggleSound}
          title={settings.soundEnabled ? 'Sound enabled' : 'Sound muted'}
          className="p-1 rounded text-stone-400 hover:text-stone-200 transition-colors"
        >
          {settings.soundEnabled ? <Volume2 className="w-3.5 h-3.5" /> : <VolumeX className="w-3.5 h-3.5 text-stone-600" />}
        </button>

        {/* Connectivity status toggle (Interactive simulation of Online vs Offline) */}
        <button
          onClick={toggleOnline}
          className={`flex items-center gap-1.5 px-2.5 py-0.5 rounded text-[11px] font-medium border transition-colors ${
            settings.isOnline
              ? 'bg-emerald-950/80 border-emerald-700/60 text-emerald-300 hover:bg-emerald-900/60'
              : 'bg-stone-800 border-stone-700 text-amber-300 hover:bg-stone-700/70'
          }`}
          title="Click to toggle between Offline Field Mode and Online Cloud Sync"
        >
          {settings.isOnline ? (
            <>
              <Wifi className="w-3 h-3 text-emerald-400" />
              <span>Online Mode</span>
            </>
          ) : (
            <>
              <WifiOff className="w-3 h-3 text-amber-400" />
              <span>Offline Mode</span>
            </>
          )}
        </button>

        {/* Battery Indicator (95% default) */}
        <div className="flex items-center gap-1.5 font-mono text-[11px] text-stone-300 bg-stone-800/80 px-2 py-0.5 rounded border border-stone-700">
          <Battery className="w-3.5 h-3.5 text-emerald-400" />
          <span>{settings.batteryLevel}%</span>
        </div>
      </div>
    </div>
  );
};
