import React, { useState, useEffect } from 'react';
import { CropInfo, SoilReading } from '../types/soil';
import { DEFAULT_PROTOTYPE_READINGS } from '../utils/agronomy';
import { X, CheckCircle, ArrowRight, Loader2, Gauge } from 'lucide-react';
import { playSound } from '../utils/audio';

interface Props {
  selectedCrop: CropInfo;
  onComplete: (readings: SoilReading) => void;
  onCancel: () => void;
  soundEnabled: boolean;
}

export const Screen05Measurement: React.FC<Props> = ({
  selectedCrop,
  onComplete,
  onCancel,
  soundEnabled,
}) => {
  const [progress, setProgress] = useState<number>(15);
  const [statusText, setStatusText] = useState<string>('Collecting sensor data...');
  const [liveReadings, setLiveReadings] = useState<SoilReading>({
    ph: 5.1,
    nitrogen: 28,
    phosphorus: 9,
    potassium: 74,
    moisture: 24,
    temperature: 21,
    ec: 0.28,
  });

  // Simulated live telemetry acquisition
  useEffect(() => {
    let tick = 0;
    const interval = setInterval(() => {
      tick++;
      if (soundEnabled && tick % 3 === 0) {
        playSound.sensorPulse();
      }

      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setStatusText('Measurement & Validation Complete');
          if (soundEnabled) playSound.success();
          return 100;
        }

        const next = Math.min(100, prev + 12);

        // Update status text based on progress
        if (next < 45) {
          setStatusText('Collecting sensor data...');
        } else if (next < 85) {
          setStatusText('Stabilizing electrode potentials (75%)...');
        } else if (next < 100) {
          setStatusText('Validating soil matrix & temperature compensation...');
        } else {
          setStatusText('Measurement & Validation Complete');
        }

        // Interpolate readings towards target prototype values
        const ratio = Math.min(1, next / 100);
        setLiveReadings({
          ph: Number((5.1 + (DEFAULT_PROTOTYPE_READINGS.ph - 5.1) * ratio + (next < 95 ? (Math.random() * 0.1 - 0.05) : 0)).toFixed(1)),
          nitrogen: Math.round(28 + (DEFAULT_PROTOTYPE_READINGS.nitrogen - 28) * ratio + (next < 95 ? (Math.random() * 2 - 1) : 0)),
          phosphorus: Math.round(9 + (DEFAULT_PROTOTYPE_READINGS.phosphorus - 9) * ratio + (next < 95 ? (Math.random() * 1.5 - 0.75) : 0)),
          potassium: Math.round(74 + (DEFAULT_PROTOTYPE_READINGS.potassium - 74) * ratio + (next < 95 ? (Math.random() * 3 - 1.5) : 0)),
          moisture: Math.round(24 + (DEFAULT_PROTOTYPE_READINGS.moisture - 24) * ratio),
          temperature: Math.round(21 + (DEFAULT_PROTOTYPE_READINGS.temperature - 21) * ratio),
          ec: Number((0.28 + (DEFAULT_PROTOTYPE_READINGS.ec - 0.28) * ratio).toFixed(2)),
        });

        return next;
      });
    }, 700);

    return () => clearInterval(interval);
  }, [soundEnabled]);

  const handleFinish = () => {
    if (soundEnabled) playSound.click();
    onComplete(DEFAULT_PROTOTYPE_READINGS);
  };

  const handleCancelClick = () => {
    if (soundEnabled) playSound.warning();
    onCancel();
  };

  const SENSOR_ROWS = [
    { label: 'Soil pH', val: liveReadings.ph.toFixed(1), unit: '', target: DEFAULT_PROTOTYPE_READINGS.ph.toFixed(1) },
    { label: 'Nitrogen (N)', val: liveReadings.nitrogen, unit: 'mg/kg', target: '35 mg/kg' },
    { label: 'Phosphorus (P)', val: liveReadings.phosphorus, unit: 'mg/kg', target: '12 mg/kg' },
    { label: 'Potassium (K)', val: liveReadings.potassium, unit: 'mg/kg', target: '85 mg/kg' },
    { label: 'Soil Moisture', val: liveReadings.moisture, unit: '%', target: '28%' },
    { label: 'Soil Temperature', val: liveReadings.temperature, unit: '°C', target: '22°C' },
    { label: 'Electrical Conductivity', val: liveReadings.ec.toFixed(2), unit: 'mS/cm', target: '0.35 mS/cm' },
  ];

  return (
    <div className="flex flex-col min-h-[580px] h-full justify-between p-6 sm:p-8 bg-stone-900 text-stone-100 select-none">
      <div>
        {/* Header */}
        <div className="pb-4 border-b border-stone-800 flex flex-wrap items-center justify-between gap-3">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight flex items-center gap-3">
              {progress < 100 ? (
                <Loader2 className="w-7 h-7 text-emerald-400 animate-spin" />
              ) : (
                <CheckCircle className="w-7 h-7 text-emerald-400" />
              )}
              Analysing Your Soil
            </h1>
            <p className="text-stone-300 text-sm mt-0.5">
              Please wait while the device collects soil measurements.
            </p>
          </div>
          <div className="text-xs font-mono text-emerald-400 bg-emerald-950/70 border border-emerald-800/50 px-3 py-1 rounded-md">
            Testing for: <strong className="text-white">{selectedCrop.name}</strong>
          </div>
        </div>

        {/* Progress Bar & Telemetry Status (Highlighting 75% milestone as per storyboard) */}
        <div className="mt-5 bg-stone-950 border border-stone-800 rounded-xl p-4">
          <div className="flex items-center justify-between text-xs font-mono mb-2">
            <span className="text-stone-300 flex items-center gap-2">
              <span className={`w-2 h-2 rounded-full ${progress < 100 ? 'bg-amber-400 animate-ping' : 'bg-emerald-400'}`}></span>
              Device Status: <span className="text-white font-semibold">{statusText}</span>
            </span>
            <span className="text-emerald-400 font-bold text-sm tabular-nums">
              {progress}%
            </span>
          </div>

          {/* Progress track */}
          <div className="w-full h-3 bg-stone-800 rounded-full overflow-hidden p-0.5">
            <div
              className="h-full bg-gradient-to-r from-emerald-600 to-emerald-400 rounded-full transition-all duration-500 ease-out"
              style={{ width: `${progress}%` }}
            />
          </div>

          <div className="flex justify-between items-center text-[10px] font-mono text-stone-400 mt-2">
            <span>Stage 1: Probe Sampling</span>
            <span className={progress >= 75 ? 'text-emerald-400 font-bold' : ''}>Stage 2: 75% Telemetry Lock</span>
            <span className={progress === 100 ? 'text-emerald-400 font-bold' : ''}>Stage 3: Validation</span>
          </div>
        </div>

        {/* Live Sensor Readings Table (Exact prototype values from storyboard) */}
        <div className="mt-5 overflow-hidden rounded-xl border border-stone-800 bg-stone-950/90 shadow-md">
          <div className="px-4 py-3 bg-stone-800/60 border-b border-stone-800 flex items-center justify-between">
            <span className="text-xs font-mono uppercase tracking-wider text-stone-300 font-bold flex items-center gap-2">
              <Gauge className="w-4 h-4 text-emerald-400" />
              Live Sensor Telemetry
            </span>
            <span className="text-[11px] font-mono text-emerald-400">
              {progress < 100 ? 'STREAMING REAL-TIME READINGS' : 'VALUES STABILIZED'}
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-stone-900 text-stone-400 font-mono text-[11px] uppercase border-b border-stone-800">
                <tr>
                  <th className="px-4 py-2.5">Sensor Channel</th>
                  <th className="px-4 py-2.5 text-right">Live Measurement</th>
                  <th className="px-4 py-2.5 text-right hidden sm:table-cell">Target Benchmark</th>
                  <th className="px-4 py-2.5 text-center">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-800/80">
                {SENSOR_ROWS.map((row, idx) => (
                  <tr key={idx} className="hover:bg-stone-900/50 transition-colors">
                    <td className="px-4 py-2.5 font-medium text-stone-200">
                      {row.label}
                    </td>
                    <td className="px-4 py-2.5 text-right font-mono font-bold text-white tabular-nums text-sm">
                      {row.val} <span className="text-xs font-normal text-stone-400">{row.unit}</span>
                    </td>
                    <td className="px-4 py-2.5 text-right font-mono text-stone-400 text-xs hidden sm:table-cell">
                      {row.target}
                    </td>
                    <td className="px-4 py-2.5 text-center">
                      <span className="inline-flex items-center gap-1 font-mono text-[10px] text-emerald-400 bg-emerald-950/60 border border-emerald-800/40 px-2 py-0.5 rounded">
                        {progress === 100 ? 'Locked' : 'Sampling'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Screen 05 Action Buttons */}
      <div className="mt-6 pt-4 border-t border-stone-800 flex items-center justify-between gap-3">
        <button
          onClick={handleCancelClick}
          className="h-14 px-6 bg-stone-800 hover:bg-stone-700 active:scale-[0.99] text-stone-300 hover:text-white font-semibold text-sm rounded-xl border border-stone-700 flex items-center gap-2 transition-all touch-press cursor-pointer"
        >
          <X className="w-4 h-4 text-rose-400" />
          <span>CANCEL TEST</span>
        </button>

        {progress === 100 ? (
          <button
            onClick={handleFinish}
            className="h-14 flex-1 max-w-md bg-emerald-600 hover:bg-emerald-500 active:scale-[0.99] text-white font-bold text-base rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-emerald-950/40 transition-all touch-press cursor-pointer"
          >
            <span>VIEW SOIL ANALYSIS RESULTS</span>
            <ArrowRight className="w-5 h-5" />
          </button>
        ) : (
          <button
            onClick={handleFinish}
            className="h-14 px-6 bg-stone-800/80 hover:bg-stone-800 text-emerald-400 font-mono text-xs rounded-xl border border-stone-700 flex items-center gap-2 transition-all cursor-pointer"
            title="Fast forward to completed 100% readings"
          >
            <span>Fast-Forward 100%</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        )}
      </div>
    </div>
  );
};
