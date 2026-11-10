import React, { useState } from 'react';
import { CropInfo, SoilReading, FertilizerRecommendation } from '../types/soil';
import {
  Sparkles,
  BookOpen,
  BookmarkCheck,
  ArrowLeft,
  ArrowRight,
  ShieldAlert,
  Sprout,
  Calendar,
  Layers,
  Scale,
  CheckCircle,
} from 'lucide-react';
import { playSound } from '../utils/audio';

interface Props {
  selectedCrop: CropInfo;
  readings: SoilReading;
  recommendation: FertilizerRecommendation;
  onViewApplicationGuide: () => void;
  onSaveRecommendation: () => void;
  onBack: () => void;
  soundEnabled: boolean;
}

export const Screen07Fertilizer: React.FC<Props> = ({
  selectedCrop,
  readings,
  recommendation,
  onViewApplicationGuide,
  onSaveRecommendation,
  onBack,
  soundEnabled,
}) => {
  const [unitMode, setUnitMode] = useState<'ha' | 'acre' | 'quarter'>('ha');

  const unitFactor = unitMode === 'ha' ? 1 : unitMode === 'acre' ? 0.4047 : 0.101;
  const unitLabel = unitMode === 'ha' ? 'kg/ha' : unitMode === 'acre' ? 'kg/acre' : 'kg (0.25 acre)';

  const formatRate = (ratePerHa: number) => {
    return Math.round(ratePerHa * unitFactor);
  };

  const handleSave = () => {
    if (soundEnabled) playSound.success();
    onSaveRecommendation();
  };

  const handleGuide = () => {
    if (soundEnabled) playSound.click();
    onViewApplicationGuide();
  };

  const handleBack = () => {
    if (soundEnabled) playSound.click();
    onBack();
  };

  return (
    <div className="flex flex-col min-h-[580px] h-full justify-between p-6 sm:p-8 bg-stone-900 text-stone-100 select-none">
      <div>
        {/* Header */}
        <div className="pb-4 border-b border-stone-800 flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight flex items-center gap-2.5">
              <Sparkles className="w-6 h-6 text-emerald-400" />
              Fertilizer Recommendations
            </h1>
            <div className="flex items-center gap-2 mt-1 text-xs">
              <span className="text-stone-300">Selected crop: <strong className="text-white font-semibold">{selectedCrop.name}</strong></span>
              <span className="text-stone-600">·</span>
              <span className="text-emerald-400 font-mono">Analysis: AI-Based Soil Assessment</span>
            </div>
          </div>

          {/* Unit Toggle */}
          <div className="flex items-center bg-stone-950 p-1 rounded-lg border border-stone-800 text-xs">
            <span className="px-2 text-[11px] font-mono text-stone-400 hidden sm:inline">Units:</span>
            <button
              onClick={() => setUnitMode('ha')}
              className={`px-2.5 py-1 rounded font-medium transition-colors cursor-pointer ${
                unitMode === 'ha' ? 'bg-emerald-600 text-white font-semibold' : 'text-stone-400 hover:text-white'
              }`}
            >
              Per Hectare
            </button>
            <button
              onClick={() => setUnitMode('acre')}
              className={`px-2.5 py-1 rounded font-medium transition-colors cursor-pointer ${
                unitMode === 'acre' ? 'bg-emerald-600 text-white font-semibold' : 'text-stone-400 hover:text-white'
              }`}
            >
              Per Acre
            </button>
            <button
              onClick={() => setUnitMode('quarter')}
              className={`px-2.5 py-1 rounded font-medium transition-colors cursor-pointer ${
                unitMode === 'quarter' ? 'bg-emerald-600 text-white font-semibold' : 'text-stone-400 hover:text-white'
              }`}
            >
              0.25 Acre Plot
            </button>
          </div>
        </div>

        {/* 4 Storyboard Recommendation Sections */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mt-5">
          {/* Section 1: Soil condition – Review soil acidity */}
          <div className="bg-stone-950 border border-stone-800 rounded-xl p-4 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between pb-2 border-b border-stone-800">
                <span className="text-xs font-mono font-bold text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
                  <ShieldAlert className="w-3.5 h-3.5" />
                  1. Soil Condition (Acidity Review)
                </span>
                <span className="text-xs font-mono text-stone-400">pH {readings.ph.toFixed(1)} Acidic</span>
              </div>
              <p className="text-xs text-stone-300 mt-2.5 leading-relaxed">
                Soil pH of {readings.ph.toFixed(1)} is moderately acidic for maize cultivation (optimal is 5.8–7.0). Acidity fixes phosphorus into insoluble compounds and reduces microbial nitrogen release.
              </p>
              
              {/* Lime recommendation */}
              <div className="mt-3 p-3 rounded-lg bg-amber-950/40 border border-amber-800/50 text-xs">
                <div className="flex items-center justify-between font-semibold text-amber-300">
                  <span>Soil Improvement: Agricultural Lime</span>
                  <span className="font-mono text-sm">{formatRate(recommendation.limeRateKgHa)} {unitLabel}</span>
                </div>
                <p className="text-[11px] text-stone-300 mt-1">
                  {recommendation.limeAdvice}
                </p>
              </div>
            </div>
          </div>

          {/* Section 2: Nutrient requirements */}
          <div className="bg-stone-950 border border-stone-800 rounded-xl p-4 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between pb-2 border-b border-stone-800">
                <span className="text-xs font-mono font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-1.5">
                  <Scale className="w-3.5 h-3.5" />
                  2. Nutrient Requirements
                </span>
                <span className="text-xs font-mono text-stone-400">NPK Target Gaps</span>
              </div>
              <p className="text-xs text-stone-300 mt-2.5 leading-relaxed">
                Identified major deficits in Nitrogen and Phosphorus. Maize requires high early phosphorus for root volume, followed by heavy nitrogen demand during stem elongation.
              </p>

              <div className="grid grid-cols-3 gap-2 mt-3 text-center">
                <div className="bg-stone-900 border border-stone-800 p-2 rounded-lg">
                  <span className="text-[10px] font-mono text-stone-400 uppercase block">Nitrogen (N)</span>
                  <span className="text-xs font-bold text-rose-400 block mt-0.5">Deficit: -35</span>
                  <span className="text-[10px] text-stone-400">Current: 35 mg/kg</span>
                </div>
                <div className="bg-stone-900 border border-stone-800 p-2 rounded-lg">
                  <span className="text-[10px] font-mono text-stone-400 uppercase block">Phosphorus (P)</span>
                  <span className="text-xs font-bold text-rose-400 block mt-0.5">Deficit: -13</span>
                  <span className="text-[10px] text-stone-400">Current: 12 mg/kg</span>
                </div>
                <div className="bg-stone-900 border border-stone-800 p-2 rounded-lg">
                  <span className="text-[10px] font-mono text-stone-400 uppercase block">Potassium (K)</span>
                  <span className="text-xs font-bold text-amber-400 block mt-0.5">Deficit: -25</span>
                  <span className="text-[10px] text-stone-400">Current: 85 mg/kg</span>
                </div>
              </div>
            </div>
          </div>

          {/* Section 3 & 4: Fertilizer selection & Application guidance */}
          <div className="lg:col-span-2 bg-stone-950 border border-stone-800 rounded-xl p-4">
            <div className="flex items-center justify-between pb-2 border-b border-stone-800">
              <span className="text-xs font-mono font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-1.5">
                <Layers className="w-3.5 h-3.5" />
                3. Fertilizer Selection & 4. Application Guidance
              </span>
              <span className="text-xs font-mono text-stone-400">Calculated Agronomic Doses</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-3">
              {/* Basal Fertilizer Card */}
              <div className="bg-stone-900/90 border border-stone-800 rounded-xl p-3.5 flex flex-col justify-between">
                <div>
                  <div className="flex items-start justify-between">
                    <div>
                      <span className="text-[10px] font-mono uppercase bg-emerald-950/80 text-emerald-300 border border-emerald-800/50 px-2 py-0.5 rounded">
                        Basal Planting Stage
                      </span>
                      <h4 className="text-base font-bold text-white mt-1.5">
                        {recommendation.basalFertilizer.product}
                      </h4>
                    </div>
                    <div className="text-right">
                      <span className="text-lg font-mono font-extrabold text-emerald-400">
                        {formatRate(recommendation.basalFertilizer.rateKgHa)}
                      </span>
                      <span className="text-xs font-mono text-stone-400 block">{unitLabel}</span>
                    </div>
                  </div>
                  <p className="text-xs text-stone-300 mt-2">
                    {recommendation.basalFertilizer.formula}
                  </p>
                </div>
                <div className="mt-3 pt-2 border-t border-stone-800 text-[11px] text-stone-400">
                  <strong className="text-stone-300">Method:</strong> {recommendation.basalFertilizer.method}
                </div>
              </div>

              {/* Top Dressing 1 Card */}
              <div className="bg-stone-900/90 border border-stone-800 rounded-xl p-3.5 flex flex-col justify-between">
                <div>
                  <div className="flex items-start justify-between">
                    <div>
                      <span className="text-[10px] font-mono uppercase bg-blue-950/80 text-blue-300 border border-blue-800/50 px-2 py-0.5 rounded">
                        Top Dressing 1 (Knee-High)
                      </span>
                      <h4 className="text-base font-bold text-white mt-1.5">
                        {recommendation.topDressing1.product}
                      </h4>
                    </div>
                    <div className="text-right">
                      <span className="text-lg font-mono font-extrabold text-blue-400">
                        {formatRate(recommendation.topDressing1.rateKgHa)}
                      </span>
                      <span className="text-xs font-mono text-stone-400 block">{unitLabel}</span>
                    </div>
                  </div>
                  <p className="text-xs text-stone-300 mt-2">
                    {recommendation.topDressing1.formula}
                  </p>
                </div>
                <div className="mt-3 pt-2 border-t border-stone-800 text-[11px] text-stone-400">
                  <strong className="text-stone-300">Timing:</strong> {recommendation.topDressing1.timing}
                </div>
              </div>
            </div>

            {/* Organic Matter & Soil Biology Note */}
            <div className="mt-3 p-3 rounded-lg bg-stone-900/60 border border-stone-800 text-xs text-stone-300 flex items-start gap-2.5">
              <Sprout className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              <div>
                <strong className="text-white">Organic Improvement Advice:</strong> {recommendation.organicMatterAdvice}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Screen 07 Action Buttons */}
      <div className="mt-6 pt-4 border-t border-stone-800 flex flex-wrap items-center justify-between gap-3">
        <button
          onClick={handleBack}
          className="h-14 px-5 bg-stone-800 hover:bg-stone-700 active:scale-[0.99] text-stone-300 hover:text-white font-semibold text-sm rounded-xl border border-stone-700 flex items-center gap-2 transition-all touch-press cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4 text-stone-400" />
          <span>BACK</span>
        </button>

        <div className="flex items-center gap-3 flex-1 sm:justify-end">
          <button
            onClick={handleGuide}
            className="h-14 px-5 bg-stone-800 hover:bg-stone-700 active:scale-[0.99] text-stone-200 font-semibold text-sm rounded-xl border border-stone-700 flex items-center gap-2 transition-all touch-press cursor-pointer"
          >
            <BookOpen className="w-4 h-4 text-emerald-400" />
            <span>VIEW APPLICATION GUIDE</span>
          </button>

          <button
            onClick={handleSave}
            className="h-14 flex-1 sm:flex-initial sm:px-8 bg-emerald-600 hover:bg-emerald-500 active:scale-[0.99] text-white font-bold text-base rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-emerald-950/40 transition-all touch-press cursor-pointer"
          >
            <BookmarkCheck className="w-5 h-5 text-emerald-200" />
            <span>SAVE RECOMMENDATION</span>
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
};
