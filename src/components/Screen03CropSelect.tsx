import React from 'react';
import { CropInfo } from '../types/soil';
import { CROPS_CATALOG } from '../utils/agronomy';
import { Check, ArrowRight, ArrowLeft, Leaf, ShieldAlert } from 'lucide-react';
import { playSound } from '../utils/audio';

interface Props {
  selectedCrop: CropInfo;
  onSelectCrop: (crop: CropInfo) => void;
  onContinue: () => void;
  onBack: () => void;
  soundEnabled: boolean;
}

export const Screen03CropSelect: React.FC<Props> = ({
  selectedCrop,
  onSelectCrop,
  onContinue,
  onBack,
  soundEnabled,
}) => {
  const handleCropClick = (crop: CropInfo) => {
    if (soundEnabled) playSound.click();
    onSelectCrop(crop);
  };

  const handleContinue = () => {
    if (soundEnabled) playSound.click();
    onContinue();
  };

  const handleBack = () => {
    if (soundEnabled) playSound.click();
    onBack();
  };

  return (
    <div className="flex flex-col min-h-[580px] h-full justify-between p-6 sm:p-8 bg-stone-900 text-stone-100 select-none">
      <div>
        {/* Header */}
        <div className="pb-4 border-b border-stone-800 flex flex-wrap items-center justify-between gap-3">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Select Your Crop
            </h1>
            <p className="text-stone-300 text-sm mt-0.5">
              Which crop do you want to cultivate?
            </p>
          </div>
          <div className="text-xs font-mono text-emerald-400 bg-emerald-950/70 border border-emerald-800/50 px-3 py-1 rounded-md">
            Selected: <strong className="font-semibold text-white">{selectedCrop.name}</strong>
          </div>
        </div>

        {/* Crops Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5 mt-5">
          {CROPS_CATALOG.map((crop, index) => {
            const isSelected = crop.id === selectedCrop.id;
            return (
              <div
                key={crop.id}
                onClick={() => handleCropClick(crop)}
                className={`relative rounded-xl p-4 cursor-pointer transition-all border text-left touch-press ${
                  isSelected
                    ? 'bg-emerald-950/50 border-emerald-500 shadow-md shadow-emerald-950/40 ring-1 ring-emerald-500/50'
                    : 'bg-stone-800/80 hover:bg-stone-800 border-stone-700/80 hover:border-stone-600'
                }`}
              >
                {/* Number & Checkmark */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-semibold text-stone-400">
                      {(index + 1).toString().padStart(2, '0')}.
                    </span>
                    <span className="text-xs px-2 py-0.5 rounded bg-stone-900/80 text-stone-300 border border-stone-700 font-mono">
                      {crop.category}
                    </span>
                  </div>
                  {isSelected ? (
                    <div className="w-6 h-6 rounded-full bg-emerald-500 flex items-center justify-center text-white">
                      <Check className="w-3.5 h-3.5 stroke-[3]" />
                    </div>
                  ) : (
                    <div className="w-6 h-6 rounded-full border border-stone-600" />
                  )}
                </div>

                {/* Crop Name */}
                <h3 className={`text-base font-bold mt-2.5 ${isSelected ? 'text-emerald-300' : 'text-white'}`}>
                  {crop.name}
                </h3>
                <p className="text-[11px] italic text-stone-400 font-mono">
                  {crop.scientificName}
                </p>

                {/* Agronomic specs */}
                <div className="mt-3 pt-2.5 border-t border-stone-700/60 flex items-center justify-between text-[11px] font-mono text-stone-300">
                  <span>pH {crop.idealPh[0]}–{crop.idealPh[1]}</span>
                  <span>{crop.durationDays}</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Selected Crop Summary Highlight (Maize scenario spotlight) */}
        {selectedCrop.id === 'maize' && (
          <div className="mt-4 p-4 rounded-xl bg-stone-950 border border-stone-800 flex flex-col md:flex-row items-center gap-4">
            <img
              src="/src/assets/images/maize_field_soil_1794320147267.jpg"
              alt="Maize Crop Soil"
              className="w-full md:w-36 h-24 object-cover rounded-lg border border-stone-800 shrink-0"
              referrerPolicy="no-referrer"
            />
            <div className="flex-1 text-left space-y-1">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider">
                  Primary Storyboard Scenario
                </span>
                <span className="text-stone-500 text-xs">·</span>
                <span className="text-xs text-stone-300 font-mono">Target: 60–90 mg/kg N, 20–35 mg/kg P</span>
              </div>
              <p className="text-xs text-stone-300 leading-relaxed">
                Maize requires optimal root aeration and neutral-to-slightly-acidic soil (pH 5.8–7.0). If soil is acidic (e.g. pH 5.5), agricultural lime is critical to unlock phosphorus.
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Screen 03 Action Buttons */}
      <div className="mt-6 pt-4 border-t border-stone-800 flex items-center justify-between gap-3">
        <button
          onClick={handleBack}
          className="h-14 px-6 bg-stone-800 hover:bg-stone-700 active:scale-[0.99] text-stone-200 font-semibold text-sm rounded-xl border border-stone-700 flex items-center gap-2 transition-all touch-press cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4 text-stone-400" />
          <span>BACK</span>
        </button>

        <button
          onClick={handleContinue}
          className="h-14 flex-1 max-w-md bg-emerald-600 hover:bg-emerald-500 active:scale-[0.99] text-white font-bold text-base rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-emerald-950/40 transition-all touch-press cursor-pointer"
        >
          <span>CONTINUE</span>
          <ArrowRight className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};
