import React from 'react';
import { CropInfo, SoilReading } from '../types/soil';
import {
  CheckCircle2,
  AlertTriangle,
  RotateCcw,
  ArrowRight,
  ArrowLeft,
  Sparkles,
  Bot,
  Info,
} from 'lucide-react';
import { playSound } from '../utils/audio';

interface Props {
  selectedCrop: CropInfo;
  readings: SoilReading;
  onGetFertilizerAdvice: () => void;
  onRetestSoil: () => void;
  onBack: () => void;
  soundEnabled: boolean;
}

export const Screen06Results: React.FC<Props> = ({
  selectedCrop,
  readings,
  onGetFertilizerAdvice,
  onRetestSoil,
  onBack,
  soundEnabled,
}) => {
  const handleGetAdvice = () => {
    if (soundEnabled) playSound.click();
    onGetFertilizerAdvice();
  };

  const handleRetest = () => {
    if (soundEnabled) playSound.click();
    onRetestSoil();
  };

  const handleBack = () => {
    if (soundEnabled) playSound.click();
    onBack();
  };

  // Storyboard table parameters:
  const PARAM_ROWS = [
    {
      param: 'pH',
      result: readings.ph.toFixed(1),
      unit: '',
      status: 'Acidic',
      statusType: 'alert',
      notes: 'Optimal for maize is 5.8–7.0. Acidity limits nutrient solubility.',
    },
    {
      param: 'Nitrogen',
      result: readings.nitrogen,
      unit: 'mg/kg',
      status: 'Needs assessment',
      statusType: 'warning',
      notes: 'Target 60–90 mg/kg. Insufficient for full vegetative canopy.',
    },
    {
      param: 'Phosphorus',
      result: readings.phosphorus,
      unit: 'mg/kg',
      status: 'Needs assessment',
      statusType: 'warning',
      notes: 'Target 20–35 mg/kg. Essential for early root vigor and seed yield.',
    },
    {
      param: 'Potassium',
      result: readings.potassium,
      unit: 'mg/kg',
      status: 'Needs assessment',
      statusType: 'warning',
      notes: 'Target 100–160 mg/kg. Moderate reserve; needs replenishment.',
    },
    {
      param: 'Moisture',
      result: readings.moisture,
      unit: '%',
      status: 'Measured',
      statusType: 'optimal',
      notes: 'Optimal field capacity for nutrient dissolution (25–35%).',
    },
    {
      param: 'Temperature',
      result: readings.temperature,
      unit: '°C',
      status: 'Measured',
      statusType: 'optimal',
      notes: 'Ideal range for rhizosphere biological activity and germination.',
    },
    {
      param: 'EC',
      result: readings.ec.toFixed(2),
      unit: 'mS/cm',
      status: 'Measured',
      statusType: 'optimal',
      notes: 'Safe non-saline threshold. Low salinity stress.',
    },
  ];

  return (
    <div className="flex flex-col min-h-[580px] h-full justify-between p-6 sm:p-8 bg-stone-900 text-stone-100 select-none">
      <div>
        {/* Header */}
        <div className="pb-4 border-b border-stone-800 flex flex-wrap items-center justify-between gap-3">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Your Soil Analysis Results
            </h1>
            <div className="flex items-center gap-2 mt-1 text-xs">
              <span className="text-stone-300">Selected crop: <strong className="text-white font-semibold">{selectedCrop.name}</strong></span>
              <span className="text-stone-600">·</span>
              <span className="text-emerald-400 font-mono flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" />
                Test status: Completed
              </span>
            </div>
          </div>

          <div className="bg-stone-800/90 border border-stone-700 rounded-lg px-3 py-1.5 font-mono text-xs text-stone-300">
            Plot: North Field #04
          </div>
        </div>

        {/* Soil Parameters Table (Exactly as in Storyboard specification) */}
        <div className="mt-5 overflow-hidden rounded-xl border border-stone-800 bg-stone-950/90 shadow-md">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-stone-900 text-stone-400 font-mono text-[11px] uppercase border-b border-stone-800">
                <tr>
                  <th className="px-4 py-3">Parameter</th>
                  <th className="px-4 py-3 text-right">Result</th>
                  <th className="px-4 py-3 text-center">Status</th>
                  <th className="px-4 py-3 hidden md:table-cell">Agronomic Note</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-800/80">
                {PARAM_ROWS.map((row, idx) => (
                  <tr key={idx} className="hover:bg-stone-900/40 transition-colors">
                    <td className="px-4 py-3 font-semibold text-white">
                      {row.param}
                    </td>
                    <td className="px-4 py-3 text-right font-mono font-bold text-white tabular-nums text-sm">
                      {row.result} <span className="text-xs font-normal text-stone-400">{row.unit}</span>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded text-[11px] font-semibold font-mono ${
                          row.statusType === 'alert'
                            ? 'bg-rose-950/70 text-rose-300 border border-rose-800/60'
                            : row.statusType === 'warning'
                            ? 'bg-amber-950/70 text-amber-300 border border-amber-800/60'
                            : 'bg-emerald-950/70 text-emerald-300 border border-emerald-800/60'
                        }`}
                      >
                        {row.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-stone-400 text-xs hidden md:table-cell">
                      {row.notes}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* AI Assessment Box (Exact prompt text from Storyboard) */}
        <div className="mt-5 rounded-2xl bg-stone-800/90 border border-emerald-500/30 p-5 shadow-lg shadow-black/40">
          <div className="flex items-center gap-2 text-xs font-mono font-bold uppercase tracking-wider text-emerald-400 mb-2">
            <Bot className="w-4 h-4 text-emerald-400" />
            <span>AI Assessment</span>
          </div>
          <p className="text-sm text-stone-100 font-medium leading-relaxed">
            &ldquo;Your soil requires further nutrient assessment before fertilizer application. Soil acidity should also be considered for maize cultivation.&rdquo;
          </p>
          <div className="mt-3 pt-3 border-t border-stone-700/80 flex flex-wrap items-center justify-between gap-2 text-xs text-stone-400">
            <span className="flex items-center gap-1.5 text-amber-300">
              <AlertTriangle className="w-3.5 h-3.5" />
              Acidity alert: pH 5.5 is below ideal 5.8 threshold
            </span>
            <span className="font-mono text-[11px]">Validated Soil Agronomy Engine</span>
          </div>
        </div>
      </div>

      {/* Screen 06 Action Buttons */}
      <div className="mt-6 pt-4 border-t border-stone-800 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <button
            onClick={handleBack}
            className="h-14 px-5 bg-stone-800 hover:bg-stone-700 active:scale-[0.99] text-stone-300 hover:text-white font-semibold text-sm rounded-xl border border-stone-700 flex items-center gap-2 transition-all touch-press cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4 text-stone-400" />
            <span>BACK</span>
          </button>

          <button
            onClick={handleRetest}
            className="h-14 px-5 bg-stone-800 hover:bg-stone-700 active:scale-[0.99] text-stone-200 font-semibold text-sm rounded-xl border border-stone-700 flex items-center gap-2 transition-all touch-press cursor-pointer"
          >
            <RotateCcw className="w-4 h-4 text-amber-400" />
            <span>RETEST SOIL</span>
          </button>
        </div>

        <button
          onClick={handleGetAdvice}
          className="h-14 flex-1 sm:max-w-md bg-emerald-600 hover:bg-emerald-500 active:scale-[0.99] text-white font-bold text-base rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-emerald-950/40 transition-all touch-press cursor-pointer"
        >
          <Sparkles className="w-5 h-5 text-emerald-200" />
          <span>GET FERTILIZER ADVICE</span>
          <ArrowRight className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};
