import React from 'react';
import { CropInfo, FertilizerRecommendation } from '../types/soil';
import { X, CheckCircle2, AlertTriangle, ShieldCheck, Calendar, Droplets } from 'lucide-react';

interface Props {
  crop: CropInfo;
  recommendation: FertilizerRecommendation;
  onClose: () => void;
}

export const ApplicationGuideModal: React.FC<Props> = ({ crop, recommendation, onClose }) => {
  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-stone-900 border border-stone-800 rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto flex flex-col shadow-2xl">
        {/* Modal Header */}
        <div className="p-5 border-b border-stone-800 flex items-center justify-between sticky top-0 bg-stone-900 z-10">
          <div>
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <BookOpenIcon className="w-5 h-5 text-emerald-400" />
              Agronomic Fertilizer Application Guide
            </h2>
            <p className="text-xs text-stone-400 font-mono mt-0.5">
              Crop: {crop.name} · Scientific Field Protocol
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg bg-stone-800 hover:bg-stone-700 text-stone-400 hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-5 text-stone-200 text-sm">
          {/* Phase 1: Pre-Planting / Acidity Neutralization */}
          {recommendation.limeRequired && (
            <div className="p-4 rounded-xl bg-amber-950/30 border border-amber-800/50 space-y-2">
              <div className="flex items-center gap-2 text-amber-300 font-bold text-sm">
                <AlertTriangle className="w-4 h-4 text-amber-400" />
                <span>Phase 0: Soil Acidity Neutralization (Agricultural Lime)</span>
              </div>
              <p className="text-xs text-stone-300 leading-relaxed">
                {recommendation.limeAdvice}
              </p>
              <div className="text-[11px] font-mono text-amber-200/80 bg-amber-950/60 p-2 rounded border border-amber-900/60">
                Rule: Never apply chemical nitrogen fertilizer on the exact same day as un-reacted lime. Allow at least 2–3 weeks of soil moisture incubation.
              </div>
            </div>
          )}

          {/* Phase 2: Basal Application */}
          <div className="p-4 rounded-xl bg-stone-950 border border-stone-800 space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-bold text-emerald-400 text-sm flex items-center gap-2">
                <Calendar className="w-4 h-4 text-emerald-400" />
                Phase 1: Planting Time (Basal Application)
              </span>
              <span className="text-xs font-mono text-white bg-stone-800 px-2.5 py-0.5 rounded">
                {recommendation.basalFertilizer.product}
              </span>
            </div>
            <p className="text-xs text-stone-300 leading-relaxed">
              <strong>Method:</strong> {recommendation.basalFertilizer.method}
            </p>
            <p className="text-xs text-stone-400">
              {recommendation.basalFertilizer.formula}
            </p>
          </div>

          {/* Phase 3: Top Dressing 1 */}
          <div className="p-4 rounded-xl bg-stone-950 border border-stone-800 space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-bold text-blue-400 text-sm flex items-center gap-2">
                <Calendar className="w-4 h-4 text-blue-400" />
                Phase 2: Knee-High Stage (1st Top Dressing)
              </span>
              <span className="text-xs font-mono text-white bg-stone-800 px-2.5 py-0.5 rounded">
                {recommendation.topDressing1.product}
              </span>
            </div>
            <p className="text-xs text-stone-300 leading-relaxed">
              <strong>Timing:</strong> {recommendation.topDressing1.timing}
            </p>
            <p className="text-xs text-stone-300">
              <strong>Application Method:</strong> {recommendation.topDressing1.method}
            </p>
          </div>

          {/* Phase 4: Top Dressing 2 (if maize) */}
          {recommendation.topDressing2 && (
            <div className="p-4 rounded-xl bg-stone-950 border border-stone-800 space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-bold text-purple-400 text-sm flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-purple-400" />
                  Phase 3: Pre-Tasseling Stage (2nd Top Dressing)
                </span>
                <span className="text-xs font-mono text-white bg-stone-800 px-2.5 py-0.5 rounded">
                  {recommendation.topDressing2.product}
                </span>
              </div>
              <p className="text-xs text-stone-300 leading-relaxed">
                <strong>Timing:</strong> {recommendation.topDressing2.timing}
              </p>
              <p className="text-xs text-stone-300">
                <strong>Application Method:</strong> {recommendation.topDressing2.method}
              </p>
            </div>
          )}

          {/* Safety & Best Practices */}
          <div className="p-4 rounded-xl bg-stone-950 border border-stone-800 space-y-2">
            <div className="flex items-center gap-2 text-stone-300 font-bold text-xs uppercase tracking-wider font-mono">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>Safety & Storage Best Practices</span>
            </div>
            <ul className="space-y-1.5 text-xs text-stone-400">
              {recommendation.safetyPrecautions.map((item, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0 mt-0.5" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-4 border-t border-stone-800 bg-stone-900 flex justify-end">
          <button
            onClick={onClose}
            className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs rounded-xl transition-colors cursor-pointer"
          >
            Close Guide
          </button>
        </div>
      </div>
    </div>
  );
};

function BookOpenIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} {...props}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
    </svg>
  );
}
