import React, { useState } from 'react';
import { CropInfo } from '../types/soil';
import { CheckCircle2, ArrowRight, ArrowLeft, Disc, AlertCircle } from 'lucide-react';
import { playSound } from '../utils/audio';

interface Props {
  selectedCrop: CropInfo;
  onStartMeasurement: () => void;
  onBack: () => void;
  soundEnabled: boolean;
  samplingDepthCm?: number;
}

const SENSORS = [
  { id: 'ph', name: '1. pH Sensor', status: 'Ready', tech: 'ISFET Solid-State Glass Electrode' },
  { id: 'npk', name: '2. NPK Sensor', status: 'Ready', tech: 'Optical / Ion-Selective Spectrometry' },
  { id: 'moisture', name: '3. Moisture Sensor', status: 'Ready', tech: 'FDR Frequency Domain Reflectometry' },
  { id: 'temperature', name: '4. Temperature Sensor', status: 'Ready', tech: 'PT1000 High-Precision Thermistor' },
  { id: 'ec', name: '5. EC Sensor', status: 'Ready', tech: '4-Electrode Platinum Conductivity Cell' },
];

export const Screen04SensorPrep: React.FC<Props> = ({
  selectedCrop,
  onStartMeasurement,
  onBack,
  soundEnabled,
  samplingDepthCm = 18,
}) => {
  const [isInserted, setIsInserted] = useState<boolean>(true); // Default to probe connected/inserted
  const [depth, setDepth] = useState<number>(samplingDepthCm);

  const handleStart = () => {
    if (soundEnabled) {
      playSound.sensorPulse();
    }
    onStartMeasurement();
  };

  const handleBack = () => {
    if (soundEnabled) playSound.click();
    onBack();
  };

  const toggleProbe = () => {
    if (soundEnabled) playSound.click();
    setIsInserted(!isInserted);
  };

  return (
    <div className="flex flex-col min-h-[580px] h-full justify-between p-6 sm:p-8 bg-stone-900 text-stone-100 select-none">
      <div>
        {/* Header */}
        <div className="pb-4 border-b border-stone-800 flex flex-wrap items-center justify-between gap-3">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Prepare Your Soil Test
            </h1>
            <p className="text-stone-300 text-sm mt-0.5">
              Insert the soil probes into the soil at the recommended sampling depth.
            </p>
          </div>
          <div className="text-xs font-mono text-emerald-400 bg-emerald-950/70 border border-emerald-800/50 px-3 py-1 rounded-md">
            Target Crop: <strong className="text-white">{selectedCrop.name}</strong>
          </div>
        </div>

        {/* Content Split: Sensor Checklist on left, Interactive Probe Guide on right */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mt-6">
          {/* Sensor Checklist (Storyboard list 1 to 5) */}
          <div className="lg:col-span-7 space-y-3">
            <h2 className="text-xs font-mono uppercase tracking-wider text-stone-400">
              Sensor Diagnostic Checklist
            </h2>
            <div className="space-y-2.5">
              {SENSORS.map((sensor) => (
                <div
                  key={sensor.id}
                  className="bg-stone-800/80 border border-stone-700/80 rounded-xl p-3.5 flex items-center justify-between"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-emerald-950/70 border border-emerald-700/50 flex items-center justify-center text-emerald-400">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-white">{sensor.name}</h4>
                      <p className="text-[11px] text-stone-400 font-mono">{sensor.tech}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-xs font-semibold text-emerald-400 bg-emerald-950/80 border border-emerald-800/50 px-2.5 py-1 rounded-md">
                      Ready
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Physical Probe Guidance Card */}
          <div className="lg:col-span-5 bg-stone-950 border border-stone-800 rounded-2xl p-5 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between border-b border-stone-800 pb-3">
                <span className="text-xs font-mono text-stone-400 uppercase tracking-wider">
                  Probe Insertion Guidance
                </span>
                <span className="text-xs font-mono text-emerald-400 font-semibold">
                  Rec: 15–20 cm Depth
                </span>
              </div>

              {/* Probe Graphic Illustration */}
              <div className="my-5 flex flex-col items-center">
                <div className="w-full bg-stone-900 border border-stone-800 rounded-xl p-4 text-center relative overflow-hidden">
                  <div className="text-xs font-mono text-stone-400 mb-2">
                    {isInserted ? (
                      <span className="text-emerald-400 font-semibold flex items-center justify-center gap-1.5">
                        <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                        Soil Connection Established ({depth} cm)
                      </span>
                    ) : (
                      <span className="text-amber-400 font-semibold flex items-center justify-center gap-1.5">
                        <AlertCircle className="w-4 h-4 text-amber-400" />
                        Waiting for soil connection...
                      </span>
                    )}
                  </div>

                  {/* Visual Probes */}
                  <div className="flex justify-center items-end gap-3 h-28 my-2">
                    {[1, 2, 3, 4, 5].map((i) => (
                      <div key={i} className="flex flex-col items-center">
                        <div
                          className={`w-3 rounded-t-sm transition-all duration-300 ${
                            isInserted
                              ? 'bg-gradient-to-b from-stone-400 via-stone-300 to-emerald-400 shadow-sm shadow-emerald-500/20'
                              : 'bg-stone-600'
                          }`}
                          style={{ height: isInserted ? '88px' : '65px' }}
                        />
                        <div className="w-4 h-1.5 bg-stone-500 rounded-full mt-0.5"></div>
                      </div>
                    ))}
                  </div>

                  {/* Soil layer */}
                  <div className="w-full bg-stone-800 border-t-2 border-amber-900/80 py-1 text-[11px] text-stone-400 font-mono">
                    Topsoil Horizon A (Root Zone)
                  </div>
                </div>

                <div className="mt-3 flex items-center gap-3 w-full">
                  <button
                    onClick={toggleProbe}
                    className="flex-1 py-2 text-xs font-mono rounded-lg border border-stone-700 bg-stone-900 hover:bg-stone-800 text-stone-300 transition-colors cursor-pointer"
                  >
                    {isInserted ? 'Simulate Unplug / Re-insert' : 'Insert Probes in Soil'}
                  </button>
                </div>
              </div>

              {/* Status Box */}
              <div className="bg-stone-900/90 border border-stone-800 rounded-lg p-3 text-xs text-stone-300 space-y-1">
                <p className="font-semibold text-white">Instructions for accurate reading:</p>
                <ul className="list-disc list-inside text-stone-400 space-y-0.5 text-[11px]">
                  <li>Clear plant debris and dry stones from sampling spot.</li>
                  <li>Press device vertically until probe shoulders touch soil.</li>
                  <li>Avoid air pockets; compact moist soil gently around pins.</li>
                </ul>
              </div>
            </div>

            {/* Depth indication */}
            <div className="mt-4 pt-3 border-t border-stone-800/80 flex items-center justify-between text-xs font-mono text-stone-400">
              <span>Sampling Depth</span>
              <span className="text-white font-bold">{depth} cm</span>
            </div>
          </div>
        </div>
      </div>

      {/* Screen 04 Action Buttons */}
      <div className="mt-6 pt-4 border-t border-stone-800 flex items-center justify-between gap-3">
        <button
          onClick={handleBack}
          className="h-14 px-6 bg-stone-800 hover:bg-stone-700 active:scale-[0.99] text-stone-200 font-semibold text-sm rounded-xl border border-stone-700 flex items-center gap-2 transition-all touch-press cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4 text-stone-400" />
          <span>BACK</span>
        </button>

        <button
          onClick={handleStart}
          className="h-14 flex-1 max-w-md bg-emerald-600 hover:bg-emerald-500 active:scale-[0.99] text-white font-bold text-base rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-emerald-950/40 transition-all touch-press cursor-pointer"
        >
          <Disc className="w-5 h-5 text-emerald-200" />
          <span>START MEASUREMENT</span>
          <ArrowRight className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};
