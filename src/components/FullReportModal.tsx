import React from 'react';
import { SoilTestRecord } from '../types/soil';
import { X, Printer, Download, CheckCircle2, ShieldCheck, MapPin, Calendar, Sprout } from 'lucide-react';

interface Props {
  record: SoilTestRecord;
  onClose: () => void;
}

export const FullReportModal: React.FC<Props> = ({ record, onClose }) => {
  const handlePrint = () => {
    window.print();
  };

  const handleDownload = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(record, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `${record.testCode}_Soil_Analysis_Report.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-stone-900 border border-stone-800 rounded-2xl w-full max-w-3xl max-h-[92vh] overflow-y-auto flex flex-col shadow-2xl">
        {/* Modal Top Bar */}
        <div className="p-4 border-b border-stone-800 flex items-center justify-between sticky top-0 bg-stone-900 z-10 print:hidden">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
            <span className="font-bold text-white text-base">Smart Soil Health Certificate</span>
            <span className="text-xs font-mono text-stone-400">· {record.testCode}</span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="px-3 py-1.5 rounded-lg bg-stone-800 hover:bg-stone-700 text-stone-300 hover:text-white text-xs font-medium flex items-center gap-1.5 cursor-pointer"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print Card</span>
            </button>
            <button
              onClick={handleDownload}
              className="px-3 py-1.5 rounded-lg bg-stone-800 hover:bg-stone-700 text-stone-300 hover:text-white text-xs font-medium flex items-center gap-1.5 cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export JSON</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg bg-stone-800 hover:bg-stone-700 text-stone-400 hover:text-white cursor-pointer ml-1"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Printable Soil Card Certificate */}
        <div className="p-6 space-y-6 text-stone-200 print:bg-white print:text-black">
          {/* Header Block */}
          <div className="border-b border-stone-800 pb-5">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <div className="flex items-center gap-2 text-emerald-400 font-extrabold text-xl tracking-tight">
                  <Sprout className="w-6 h-6" />
                  <span>SMART SOIL DIAGNOSTICS</span>
                </div>
                <p className="text-xs text-stone-400 mt-0.5">
                  Official Portable IoT Soil Analysis & Agronomic Prescription
                </p>
              </div>
              <div className="text-right font-mono text-xs text-stone-400">
                <p className="text-white font-bold">{record.testCode}</p>
                <p>Date: {record.date} at {record.time}</p>
                <p>Status: {record.syncStatus === 'synced' ? 'Synchronized to Cloud' : 'Local Verified Record'}</p>
              </div>
            </div>

            {/* Field & Location Details */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-4 pt-4 border-t border-stone-800/80 font-mono text-xs">
              <div>
                <span className="text-stone-400 text-[10px] uppercase block">Plot Location</span>
                <span className="font-semibold text-white">{record.fieldName}</span>
              </div>
              <div>
                <span className="text-stone-400 text-[10px] uppercase block">GPS Coordinates</span>
                <span className="font-semibold text-white">{record.location.coords}</span>
              </div>
              <div>
                <span className="text-stone-400 text-[10px] uppercase block">Target Crop</span>
                <span className="font-semibold text-emerald-400">{record.crop.name}</span>
              </div>
              <div>
                <span className="text-stone-400 text-[10px] uppercase block">Sampling Depth</span>
                <span className="font-semibold text-white">18 cm (Topsoil)</span>
              </div>
            </div>
          </div>

          {/* Measured Soil Metrics Grid */}
          <div>
            <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-stone-400 mb-3">
              Lab-Calibrated Field Soil Readings
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="bg-stone-950 p-3.5 rounded-xl border border-stone-800">
                <span className="text-[10px] font-mono text-stone-400 uppercase">Soil Acidity (pH)</span>
                <div className="text-xl font-bold font-mono text-rose-400 mt-1">{record.readings.ph.toFixed(1)}</div>
                <span className="text-[11px] text-rose-400/90 font-medium">Acidic (Optimal: 5.8–7.0)</span>
              </div>
              <div className="bg-stone-950 p-3.5 rounded-xl border border-stone-800">
                <span className="text-[10px] font-mono text-stone-400 uppercase">Nitrogen (N)</span>
                <div className="text-xl font-bold font-mono text-amber-400 mt-1">{record.readings.nitrogen} <span className="text-xs font-normal text-stone-400">mg/kg</span></div>
                <span className="text-[11px] text-amber-400/90 font-medium">Deficient (Target: 60–90)</span>
              </div>
              <div className="bg-stone-950 p-3.5 rounded-xl border border-stone-800">
                <span className="text-[10px] font-mono text-stone-400 uppercase">Phosphorus (P)</span>
                <div className="text-xl font-bold font-mono text-amber-400 mt-1">{record.readings.phosphorus} <span className="text-xs font-normal text-stone-400">mg/kg</span></div>
                <span className="text-[11px] text-amber-400/90 font-medium">Deficient (Target: 20–35)</span>
              </div>
              <div className="bg-stone-950 p-3.5 rounded-xl border border-stone-800">
                <span className="text-[10px] font-mono text-stone-400 uppercase">Potassium (K)</span>
                <div className="text-xl font-bold font-mono text-emerald-400 mt-1">{record.readings.potassium} <span className="text-xs font-normal text-stone-400">mg/kg</span></div>
                <span className="text-[11px] text-emerald-400/90 font-medium">Moderate (Target: 100–160)</span>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3 mt-3 font-mono text-xs">
              <div className="bg-stone-950 p-2.5 rounded-xl border border-stone-800 flex justify-between">
                <span className="text-stone-400">Moisture:</span>
                <span className="font-bold text-white">{record.readings.moisture}% (Optimal)</span>
              </div>
              <div className="bg-stone-950 p-2.5 rounded-xl border border-stone-800 flex justify-between">
                <span className="text-stone-400">Temperature:</span>
                <span className="font-bold text-white">{record.readings.temperature}°C (Ideal)</span>
              </div>
              <div className="bg-stone-950 p-2.5 rounded-xl border border-stone-800 flex justify-between">
                <span className="text-stone-400">Conductivity (EC):</span>
                <span className="font-bold text-white">{record.readings.ec.toFixed(2)} mS/cm</span>
              </div>
            </div>
          </div>

          {/* AI Agronomic Assessment */}
          <div className="p-4 rounded-xl bg-stone-950 border border-stone-800">
            <h4 className="text-xs font-mono font-bold uppercase text-emerald-400 mb-1">
              AI Diagnostic Assessment
            </h4>
            <p className="text-xs text-stone-300 leading-relaxed">
              {record.assessment}
            </p>
          </div>

          {/* Fertilizer Prescription Table */}
          <div>
            <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-stone-400 mb-3">
              Crop-Specific Fertilizer Prescription
            </h3>
            <div className="overflow-x-auto rounded-xl border border-stone-800 bg-stone-950">
              <table className="w-full text-left text-xs">
                <thead className="bg-stone-900 text-stone-400 font-mono text-[11px] uppercase border-b border-stone-800">
                  <tr>
                    <th className="px-4 py-2.5">Application Stage</th>
                    <th className="px-4 py-2.5">Product</th>
                    <th className="px-4 py-2.5 text-right">Dosage / Hectare</th>
                    <th className="px-4 py-2.5">Method</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-800">
                  {record.recommendation.limeRequired && (
                    <tr className="bg-amber-950/20">
                      <td className="px-4 py-2.5 font-medium text-amber-300">Soil Conditioning</td>
                      <td className="px-4 py-2.5 font-bold text-white">Agricultural Lime</td>
                      <td className="px-4 py-2.5 text-right font-mono font-bold text-amber-300">{record.recommendation.limeRateKgHa.toLocaleString()} kg/ha</td>
                      <td className="px-4 py-2.5 text-stone-300 text-[11px]">Broadcast & harrow 3-4 weeks prior to planting</td>
                    </tr>
                  )}
                  <tr>
                    <td className="px-4 py-2.5 font-medium text-emerald-400">Basal (At Planting)</td>
                    <td className="px-4 py-2.5 font-bold text-white">{record.recommendation.basalFertilizer.product}</td>
                    <td className="px-4 py-2.5 text-right font-mono font-bold text-emerald-400">{record.recommendation.basalFertilizer.rateKgHa} kg/ha</td>
                    <td className="px-4 py-2.5 text-stone-300 text-[11px]">{record.recommendation.basalFertilizer.method}</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-2.5 font-medium text-blue-400">1st Top Dressing (V4-V6)</td>
                    <td className="px-4 py-2.5 font-bold text-white">{record.recommendation.topDressing1.product}</td>
                    <td className="px-4 py-2.5 text-right font-mono font-bold text-blue-400">{record.recommendation.topDressing1.rateKgHa} kg/ha</td>
                    <td className="px-4 py-2.5 text-stone-300 text-[11px]">{record.recommendation.topDressing1.method}</td>
                  </tr>
                  {record.recommendation.topDressing2 && (
                    <tr>
                      <td className="px-4 py-2.5 font-medium text-purple-400">2nd Top Dressing (Pre-Tassel)</td>
                      <td className="px-4 py-2.5 font-bold text-white">{record.recommendation.topDressing2.product}</td>
                      <td className="px-4 py-2.5 text-right font-mono font-bold text-purple-400">{record.recommendation.topDressing2.rateKgHa} kg/ha</td>
                      <td className="px-4 py-2.5 text-stone-300 text-[11px]">{record.recommendation.topDressing2.method}</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-4 border-t border-stone-800 bg-stone-900 flex justify-end print:hidden">
          <button
            onClick={onClose}
            className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs rounded-xl transition-colors cursor-pointer"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
