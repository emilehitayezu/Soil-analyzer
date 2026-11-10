import React from 'react';
import { ScreenId } from '../types/soil';
import { Smartphone, Monitor, ChevronRight, Info } from 'lucide-react';
import { playSound } from '../utils/audio';

interface Props {
  currentScreen: ScreenId;
  onSelectScreen: (screen: ScreenId) => void;
  isDeviceFrame: boolean;
  onToggleDeviceFrame: () => void;
  soundEnabled: boolean;
}

const SCREENS: { id: ScreenId; num: string; label: string }[] = [
  { id: 'welcome', num: '01', label: 'Welcome / Startup' },
  { id: 'dashboard', num: '02', label: 'Home Dashboard' },
  { id: 'crop_select', num: '03', label: 'Crop Selection' },
  { id: 'sensor_prep', num: '04', label: 'Sensor Preparation' },
  { id: 'measurement', num: '05', label: 'Soil Measurement' },
  { id: 'results', num: '06', label: 'Analysis Results' },
  { id: 'fertilizer', num: '07', label: 'AI Fertilizer' },
  { id: 'completion', num: '08', label: 'Save / Complete' },
];

export const StoryboardHeader: React.FC<Props> = ({
  currentScreen,
  onSelectScreen,
  isDeviceFrame,
  onToggleDeviceFrame,
  soundEnabled,
}) => {
  const currentIndex = SCREENS.findIndex((s) => s.id === currentScreen);

  const handleScreenChange = (id: ScreenId) => {
    if (soundEnabled) playSound.click();
    onSelectScreen(id);
  };

  return (
    <header className="bg-stone-950 text-white border-b border-stone-800 shrink-0">
      {/* Top Bar Contract: 3 zones */}
      <div className="max-w-7xl mx-auto px-4 py-2.5 flex items-center justify-between gap-6">
        {/* Zone 1: Brand wordmark */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-emerald-500 shadow-sm shadow-emerald-500/50"></span>
            <span className="font-bold tracking-tight text-white text-base">SMART SOIL</span>
          </div>
          <span className="text-stone-500 hidden sm:inline">·</span>
          <span className="text-xs text-stone-400 hidden sm:inline font-mono">Prototype Storyboard</span>
        </div>

        {/* Zone 2: Scenario prompt badge & current progress */}
        <div className="hidden lg:flex items-center gap-2 text-xs text-stone-300 bg-stone-900/90 border border-stone-800 px-3 py-1.5 rounded-lg">
          <Info className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
          <span>Scenario: <strong className="text-emerald-300 font-medium">Farmer growing Maize</strong> — soil condition & fertilizer</span>
        </div>

        {/* Zone 3: Device Frame toggle */}
        <div className="flex items-center gap-2">
          <button
            onClick={onToggleDeviceFrame}
            className="flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-md bg-stone-800 hover:bg-stone-700 text-stone-200 border border-stone-700 transition-colors"
            title="Toggle between handheld rugged analyzer frame and tablet monitor view"
          >
            {isDeviceFrame ? (
              <>
                <Monitor className="w-3.5 h-3.5 text-emerald-400" />
                <span className="hidden sm:inline">Full Screen View</span>
              </>
            ) : (
              <>
                <Smartphone className="w-3.5 h-3.5 text-emerald-400" />
                <span className="hidden sm:inline">Handheld Device Frame</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Storyboard 8-Step Navigation Ribbon */}
      <div className="border-t border-stone-800/80 bg-stone-900/60 overflow-x-auto scrollbar-thin">
        <div className="max-w-7xl mx-auto px-4 py-2 flex items-center gap-1 min-w-max">
          <span className="text-[11px] font-mono text-stone-400 uppercase tracking-wider mr-2 shrink-0">
            Storyboard:
          </span>
          {SCREENS.map((s, idx) => {
            const isActive = s.id === currentScreen;
            const isCompleted = idx < currentIndex;
            return (
              <React.Fragment key={s.id}>
                <button
                  onClick={() => handleScreenChange(s.id)}
                  className={`flex items-center gap-1.5 px-2.5 py-1 rounded text-xs transition-colors shrink-0 ${
                    isActive
                      ? 'bg-emerald-600 text-white font-semibold shadow-sm'
                      : isCompleted
                      ? 'bg-stone-800/80 text-stone-300 hover:bg-stone-700'
                      : 'text-stone-400 hover:bg-stone-800 hover:text-stone-200'
                  }`}
                >
                  <span className={`font-mono text-[10px] ${isActive ? 'text-emerald-100' : 'text-stone-500'}`}>
                    {s.num}
                  </span>
                  <span>{s.label}</span>
                </button>
                {idx < SCREENS.length - 1 && (
                  <ChevronRight className="w-3 h-3 text-stone-600 shrink-0" />
                )}
              </React.Fragment>
            );
          })}
        </div>
      </div>
    </header>
  );
};
