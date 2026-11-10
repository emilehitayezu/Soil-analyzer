import React, { useState } from 'react';
import { SoilTestRecord } from '../types/soil';
import { DeviceSettings } from '../utils/storage';
import {
  CheckCircle,
  FileText,
  PlusCircle,
  Home,
  HardDrive,
  WifiOff,
  CloudUpload,
  RefreshCw,
  CheckCheck,
  Share2,
} from 'lucide-react';
import { playSound } from '../utils/audio';

interface Props {
  record: SoilTestRecord;
  settings: DeviceSettings;
  onViewFullReport: () => void;
  onNewSoilTest: () => void;
  onGoHome: () => void;
  onTriggerSync: () => void;
  soundEnabled: boolean;
}

export const Screen08Completion: React.FC<Props> = ({
  record,
  settings,
  onViewFullReport,
  onNewSoilTest,
  onGoHome,
  onTriggerSync,
  soundEnabled,
}) => {
  const [isSyncing, setIsSyncing] = useState<boolean>(false);
  const [synced, setSynced] = useState<boolean>(record.syncStatus === 'synced');

  const handleSyncSimulate = () => {
    if (soundEnabled) playSound.sensorPulse();
    setIsSyncing(true);
    setTimeout(() => {
      setIsSyncing(false);
      setSynced(true);
      if (soundEnabled) playSound.success();
      onTriggerSync();
    }, 1200);
  };

  const handleView = () => {
    if (soundEnabled) playSound.click();
    onViewFullReport();
  };

  const handleNewTest = () => {
    if (soundEnabled) playSound.click();
    onNewSoilTest();
  };

  const handleHome = () => {
    if (soundEnabled) playSound.click();
    onGoHome();
  };

  return (
    <div className="flex flex-col min-h-[580px] h-full justify-between p-6 sm:p-8 bg-stone-900 text-stone-100 select-none">
      <div>
        {/* Success Banner */}
        <div className="text-center py-4">
          <div className="w-16 h-16 rounded-2xl bg-emerald-950/80 border-2 border-emerald-500/80 flex items-center justify-center text-emerald-400 mx-auto shadow-xl shadow-emerald-950/40">
            <CheckCircle className="w-9 h-9 text-emerald-400" />
          </div>

          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight mt-4">
            Soil Analysis Completed!
          </h1>
          <p className="text-emerald-400 font-medium text-sm mt-1 max-w-lg mx-auto">
            Your soil analysis and fertilizer recommendation have been saved successfully.
          </p>
        </div>

        {/* Report Information Card (Storyboard Report Information Table) */}
        <div className="mt-5 max-w-2xl mx-auto bg-stone-950 border border-stone-800 rounded-2xl p-5 shadow-lg">
          <div className="flex items-center justify-between pb-3 border-b border-stone-800">
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-stone-300">
              Report Information & Record Metadata
            </span>
            <span className="text-xs font-mono text-emerald-400">{record.testCode}</span>
          </div>

          <div className="divide-y divide-stone-800/80 text-xs">
            <div className="py-2.5 flex items-center justify-between">
              <span className="text-stone-400">Selected crop:</span>
              <span className="font-bold text-white text-sm">{record.crop.name}</span>
            </div>

            <div className="py-2.5 flex items-center justify-between">
              <span className="text-stone-400">Soil test:</span>
              <span className="font-semibold text-emerald-400 flex items-center gap-1.5 font-mono">
                <CheckCircle className="w-3.5 h-3.5" />
                Completed
              </span>
            </div>

            <div className="py-2.5 flex items-center justify-between">
              <span className="text-stone-400">AI recommendation:</span>
              <span className="font-semibold text-emerald-400 flex items-center gap-1.5 font-mono">
                <CheckCircle className="w-3.5 h-3.5" />
                Generated
              </span>
            </div>

            <div className="py-2.5 flex items-center justify-between">
              <span className="text-stone-400">Storage status:</span>
              <span className="font-semibold text-stone-200 flex items-center gap-1.5 font-mono">
                <HardDrive className="w-3.5 h-3.5 text-blue-400" />
                Saved Locally (Encrypted Storage)
              </span>
            </div>

            <div className="py-2.5 flex items-center justify-between">
              <span className="text-stone-400">Connectivity:</span>
              <span className="font-semibold text-amber-300 flex items-center gap-1.5 font-mono">
                <WifiOff className="w-3.5 h-3.5" />
                {settings.isOnline ? 'Online Mode' : 'Offline Mode'}
              </span>
            </div>

            <div className="py-2.5 flex items-center justify-between">
              <span className="text-stone-400">Synchronization:</span>
              {synced ? (
                <span className="font-semibold text-emerald-400 flex items-center gap-1.5 font-mono">
                  <CheckCheck className="w-3.5 h-3.5" />
                  Synchronized with Central Web Platform
                </span>
              ) : (
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-amber-300 flex items-center gap-1.5 font-mono">
                    <CloudUpload className="w-3.5 h-3.5" />
                    Pending Internet Connection
                  </span>
                  <button
                    onClick={handleSyncSimulate}
                    disabled={isSyncing}
                    className="ml-2 text-[11px] font-mono bg-stone-800 hover:bg-stone-700 text-stone-200 px-2.5 py-1 rounded border border-stone-700 flex items-center gap-1 cursor-pointer"
                    title="Simulate connecting to network and synchronizing data"
                  >
                    {isSyncing ? (
                      <>
                        <RefreshCw className="w-3 h-3 animate-spin text-emerald-400" />
                        <span>Syncing...</span>
                      </>
                    ) : (
                      <span>Sync Now</span>
                    )}
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Storyboard Takeaway Note */}
        <div className="max-w-2xl mx-auto mt-4 p-3.5 rounded-xl bg-stone-900 border border-stone-800 text-xs text-stone-300 text-center leading-relaxed">
          <strong className="text-white">Final outcome:</strong> The farmer has successfully tested the soil and received crop-specific fertilizer advice without requiring internet connectivity. When internet becomes available, the device automatically synchronizes the saved results with the central web platform.
        </div>
      </div>

      {/* Screen 08 Action Buttons */}
      <div className="mt-6 pt-4 border-t border-stone-800 flex flex-col sm:flex-row items-center justify-between gap-3">
        <button
          onClick={handleHome}
          className="w-full sm:w-auto h-14 px-6 bg-stone-800 hover:bg-stone-700 active:scale-[0.99] text-stone-200 font-semibold text-sm rounded-xl border border-stone-700 flex items-center justify-center gap-2 transition-all touch-press cursor-pointer"
        >
          <Home className="w-4 h-4 text-stone-400" />
          <span>HOME</span>
        </button>

        <div className="w-full sm:w-auto flex flex-col sm:flex-row items-center gap-3 flex-1 sm:justify-end">
          <button
            onClick={handleNewTest}
            className="w-full sm:w-auto h-14 px-6 bg-stone-800 hover:bg-stone-700 active:scale-[0.99] text-stone-200 font-semibold text-sm rounded-xl border border-stone-700 flex items-center justify-center gap-2 transition-all touch-press cursor-pointer"
          >
            <PlusCircle className="w-4 h-4 text-emerald-400" />
            <span>NEW SOIL TEST</span>
          </button>

          <button
            onClick={handleView}
            className="w-full sm:w-auto h-14 px-8 bg-emerald-600 hover:bg-emerald-500 active:scale-[0.99] text-white font-bold text-base rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-emerald-950/40 transition-all touch-press cursor-pointer"
          >
            <FileText className="w-5 h-5 text-emerald-200" />
            <span>VIEW FULL REPORT</span>
          </button>
        </div>
      </div>
    </div>
  );
};
