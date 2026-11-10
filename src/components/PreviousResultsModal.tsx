import React, { useState } from 'react';
import { SoilTestRecord } from '../types/soil';
import { X, Search, FileText, Download, CheckCircle2, CloudUpload } from 'lucide-react';
import { playSound } from '../utils/audio';

interface Props {
  records: SoilTestRecord[];
  onSelectRecord: (record: SoilTestRecord) => void;
  onClose: () => void;
  soundEnabled: boolean;
}

export const PreviousResultsModal: React.FC<Props> = ({
  records,
  onSelectRecord,
  onClose,
  soundEnabled,
}) => {
  const [filterQuery, setFilterQuery] = useState('');

  const filtered = records.filter(
    (r) =>
      r.crop.name.toLowerCase().includes(filterQuery.toLowerCase()) ||
      r.testCode.toLowerCase().includes(filterQuery.toLowerCase()) ||
      r.fieldName.toLowerCase().includes(filterQuery.toLowerCase())
  );

  const handleSelect = (r: SoilTestRecord) => {
    if (soundEnabled) playSound.click();
    onSelectRecord(r);
  };

  const handleExportCSV = () => {
    const headers = ['Test Code', 'Date', 'Time', 'Crop', 'Plot', 'pH', 'N', 'P', 'K', 'Moisture', 'Temp', 'EC', 'Sync'];
    const rows = records.map((r) => [
      r.testCode,
      r.date,
      r.time,
      r.crop.name,
      r.fieldName,
      r.readings.ph,
      r.readings.nitrogen,
      r.readings.phosphorus,
      r.readings.potassium,
      r.readings.moisture,
      r.readings.temperature,
      r.readings.ec,
      r.syncStatus,
    ]);

    const csvContent =
      'data:text/csv;charset=utf-8,' +
      [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', 'Smart_Soil_Analysis_History.csv');
    document.body.appendChild(link);
    link.click();
    link.remove();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-stone-900 border border-stone-800 rounded-2xl w-full max-w-2xl max-h-[85vh] overflow-y-auto flex flex-col shadow-2xl">
        {/* Header */}
        <div className="p-4 border-b border-stone-800 flex items-center justify-between sticky top-0 bg-stone-900 z-10">
          <div>
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <span>Saved Soil Test Results</span>
              <span className="text-xs font-mono font-normal text-stone-400">({records.length} total)</span>
            </h2>
            <p className="text-xs text-stone-400">
              Browse previous tests stored in device flash memory
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handleExportCSV}
              className="px-3 py-1.5 rounded-lg bg-stone-800 hover:bg-stone-700 text-stone-300 hover:text-white text-xs font-mono flex items-center gap-1.5 cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export CSV</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg bg-stone-800 hover:bg-stone-700 text-stone-400 hover:text-white cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Search bar */}
        <div className="p-4 border-b border-stone-800 bg-stone-950">
          <div className="relative">
            <Search className="w-4 h-4 text-stone-500 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by crop, test code, or plot..."
              value={filterQuery}
              onChange={(e) => setFilterQuery(e.target.value)}
              className="w-full bg-stone-900 border border-stone-800 rounded-xl pl-9 pr-4 py-2 text-xs text-white placeholder-stone-500 focus:outline-none focus:border-emerald-500"
            />
          </div>
        </div>

        {/* Results List */}
        <div className="p-4 divide-y divide-stone-800 overflow-y-auto flex-1">
          {filtered.length === 0 ? (
            <div className="py-8 text-center text-xs text-stone-400">
              No matching soil tests found.
            </div>
          ) : (
            filtered.map((r) => (
              <div
                key={r.id}
                onClick={() => handleSelect(r)}
                className="py-3 px-3 hover:bg-stone-800/60 rounded-xl cursor-pointer transition-colors flex items-center justify-between gap-3 group"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-white text-sm group-hover:text-emerald-400 transition-colors">
                      {r.crop.name}
                    </span>
                    <span className="text-[10px] font-mono text-stone-400 bg-stone-800 px-2 py-0.5 rounded border border-stone-700">
                      {r.testCode}
                    </span>
                    {r.syncStatus === 'synced' ? (
                      <span className="text-[10px] font-mono text-emerald-400 flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3" />
                        Synced
                      </span>
                    ) : (
                      <span className="text-[10px] font-mono text-amber-300 flex items-center gap-1">
                        <CloudUpload className="w-3 h-3" />
                        Pending Sync
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-3 text-xs text-stone-400 mt-1">
                    <span>{r.fieldName}</span>
                    <span>·</span>
                    <span>{r.date} at {r.time}</span>
                  </div>
                  <div className="mt-1.5 flex items-center gap-2 text-[11px] font-mono text-stone-300">
                    <span>pH {r.readings.ph.toFixed(1)}</span>
                    <span className="text-stone-600">|</span>
                    <span>N: {r.readings.nitrogen}</span>
                    <span className="text-stone-600">|</span>
                    <span>P: {r.readings.phosphorus}</span>
                    <span className="text-stone-600">|</span>
                    <span>K: {r.readings.potassium}</span>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <span className="text-xs text-emerald-400 font-medium group-hover:underline">
                    View Card
                  </span>
                  <FileText className="w-4 h-4 text-stone-500 group-hover:text-emerald-400 transition-colors" />
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-stone-800 bg-stone-900 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 bg-stone-800 hover:bg-stone-700 text-stone-200 text-xs font-semibold rounded-xl transition-colors cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
