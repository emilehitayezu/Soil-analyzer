import React from 'react';
import { DeviceSettings } from '../utils/storage';
import { X, Cpu, Battery, CheckCircle2, ShieldAlert, Wrench, RefreshCw } from 'lucide-react';
import { playSound } from '../utils/audio';

interface Props {
  settings: DeviceSettings;
  onClose: () => void;
  soundEnabled: boolean;
}

const PROBES = [
  { name: 'pH ISFET Electrode', health: '100%', calDate: 'Today (Auto-Zeroed)', status: 'Optimal', sn: 'PH-4882-SN' },
  { name: 'Optical NPK Spectrometer', health: '98%', calDate: 'Nov 08, 2026', status: 'Optimal', sn: 'NPK-9921-OPT' },
  { name: 'FDR Soil Moisture Waveguide', health: '99%', calDate: 'Nov 05, 2026', status: 'Optimal', sn: 'FDR-3110-MOI' },
  { name: 'PT1000 Temperature Core', health: '100%', calDate: 'Factory Calibrated', status: 'Optimal', sn: 'TMP-7724-PT' },
  { name: 'Platinum 4-Pin EC Electrode', health: '97%', calDate: 'Nov 07, 2026', status: 'Optimal', sn: 'EC-0041-PL' },
];

export const DeviceStatusModal: React.FC<Props> = ({ settings, onClose, soundEnabled }) => {
  const handleRecalibrate = () => {
    if (soundEnabled) playSound.sensorPulse();
    alert('Simulated Sensor Array Quick-Calibration Succeeded! All 5 probes zero-referenced.');
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-stone-900 border border-stone-800 rounded-2xl w-full max-w-xl max-h-[85vh] overflow-y-auto flex flex-col shadow-2xl">
        {/* Header */}
        <div className="p-4 border-b border-stone-800 flex items-center justify-between sticky top-0 bg-stone-900 z-10">
          <div>
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <Cpu className="w-5 h-5 text-blue-400" />
              <span>Device Diagnostic Telemetry</span>
            </h2>
            <p className="text-xs text-stone-400">
              Hardware health, probe calibration, and battery management
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg bg-stone-800 hover:bg-stone-700 text-stone-400 hover:text-white cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 space-y-4">
          {/* Top Battery & Power Strip */}
          <div className="grid grid-cols-3 gap-3 font-mono text-xs">
            <div className="bg-stone-950 p-3 rounded-xl border border-stone-800">
              <span className="text-stone-400 text-[10px] uppercase block">Battery Level</span>
              <span className="text-lg font-bold text-emerald-400 flex items-center gap-1.5 mt-0.5">
                <Battery className="w-4 h-4 text-emerald-400" />
                {settings.batteryLevel}%
              </span>
              <span className="text-[10px] text-stone-500">LiFePO4 8,000mAh</span>
            </div>
            <div className="bg-stone-950 p-3 rounded-xl border border-stone-800">
              <span className="text-stone-400 text-[10px] uppercase block">Runtime Remaining</span>
              <span className="text-lg font-bold text-white mt-0.5 block">18.5 hrs</span>
              <span className="text-[10px] text-stone-500">Continuous sampling</span>
            </div>
            <div className="bg-stone-950 p-3 rounded-xl border border-stone-800">
              <span className="text-stone-400 text-[10px] uppercase block">Firmware</span>
              <span className="text-lg font-bold text-blue-400 mt-0.5 block">v3.4.1</span>
              <span className="text-[10px] text-stone-500">SoilOS Embedded</span>
            </div>
          </div>

          {/* Sensor Probes Table */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-stone-400">
                Connected Multi-Parameter Probes
              </h3>
              <button
                onClick={handleRecalibrate}
                className="text-[11px] font-mono text-emerald-400 hover:underline flex items-center gap-1 cursor-pointer"
              >
                <RefreshCw className="w-3 h-3" />
                Zero-Calibrate Array
              </button>
            </div>

            <div className="rounded-xl border border-stone-800 bg-stone-950 overflow-hidden divide-y divide-stone-800 text-xs">
              {PROBES.map((p, idx) => (
                <div key={idx} className="p-3 flex items-center justify-between">
                  <div>
                    <h4 className="font-bold text-white">{p.name}</h4>
                    <p className="text-[11px] text-stone-400 font-mono">
                      S/N: {p.sn} · Last Cal: {p.calDate}
                    </p>
                  </div>
                  <div className="text-right">
                    <span className="inline-flex items-center gap-1 text-[11px] font-mono text-emerald-400 font-bold bg-emerald-950/70 border border-emerald-800/40 px-2 py-0.5 rounded">
                      <CheckCircle2 className="w-3 h-3" />
                      {p.status} ({p.health})
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Environmental Enclosure Rating */}
          <div className="p-3 rounded-xl bg-stone-950 border border-stone-800 flex items-center justify-between text-xs text-stone-300">
            <div>
              <p className="font-semibold text-white">Chassis Protection Rating: IP67 Weatherproof</p>
              <p className="text-[11px] text-stone-400">Shock-resistant rubber bumper, sunlight-readable high-nit display</p>
            </div>
            <div className="w-8 h-8 rounded-lg bg-stone-900 border border-stone-700 flex items-center justify-center font-mono text-xs font-bold text-amber-400">
              IP67
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-stone-800 bg-stone-900 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 bg-stone-800 hover:bg-stone-700 text-stone-200 text-xs font-semibold rounded-xl transition-colors cursor-pointer"
          >
            Close Diagnostics
          </button>
        </div>
      </div>
    </div>
  );
};
