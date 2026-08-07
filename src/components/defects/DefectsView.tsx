import React, { useState } from 'react';
import { useAMMS } from '../../context/AMMSContext';
import { Defect, DefectSeverity } from '../../types';
import { AIDiagnosticModal } from '../common/AIDiagnosticModal';
import { AlertOctagon, Sparkles, Bot, Plus, CheckCircle2, Search, Filter, Wrench } from 'lucide-react';

export const DefectsView: React.FC = () => {
  const { defects, addDefect, updateDefect, searchQuery, setQuickActionModal } = useAMMS();
  const [selectedAIDefect, setSelectedAIDefect] = useState<Defect | null>(null);

  const filteredDefects = defects.filter(d =>
    d.defectNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
    d.aircraftTailNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
    d.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    d.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="p-6 space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-black text-slate-900 dark:text-white flex items-center gap-2">
            <AlertOctagon className="w-6 h-6 text-amber-500" /> Defect Reporting & ATA Troubleshooting
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Log pilot & line technician defects, perform root cause analysis with Gemini AI diagnostics.
          </p>
        </div>

        <button
          onClick={() => setQuickActionModal('open')}
          className="px-4 py-2 text-xs font-bold text-white bg-amber-600 hover:bg-amber-500 rounded-xl shadow-md transition flex items-center gap-2"
        >
          <Plus className="w-4 h-4" /> Report New Defect
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredDefects.map((def) => (
          <div
            key={def.id}
            className="p-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm space-y-3"
          >
            <div className="flex items-center justify-between">
              <span className="font-mono font-bold text-xs text-blue-600 dark:text-blue-400">{def.defectNumber}</span>
              <span
                className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase ${
                  def.severity === 'Critical'
                    ? 'bg-rose-500 text-white'
                    : def.severity === 'High'
                    ? 'bg-amber-500 text-slate-900'
                    : 'bg-slate-100 text-slate-700'
                }`}
              >
                {def.severity} Severity
              </span>
            </div>

            <div>
              <div className="text-xs text-slate-400 font-bold uppercase">{def.category} • Aircraft {def.aircraftTailNumber}</div>
              <h3 className="font-bold text-slate-900 dark:text-white text-sm mt-0.5">{def.title}</h3>
              <p className="text-xs text-slate-600 dark:text-slate-300 mt-1">{def.description}</p>
            </div>

            {def.rootCause && (
              <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl text-xs space-y-1">
                <div><strong>Root Cause:</strong> {def.rootCause}</div>
                {def.correctiveAction && <div><strong>Action:</strong> {def.correctiveAction}</div>}
              </div>
            )}

            <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
              <button
                onClick={() => setSelectedAIDefect(def)}
                className="px-3 py-1.5 text-xs font-bold text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 rounded-xl transition flex items-center gap-1.5 shadow-sm"
              >
                <Bot className="w-3.5 h-3.5" /> Gemini Smart AI Diagnose
              </button>

              <button
                onClick={() => updateDefect(def.id, { status: def.status === 'Closed' ? 'Reported' : 'Closed' })}
                className="text-xs font-bold text-slate-500 hover:text-slate-900 dark:hover:text-white"
              >
                Status: <strong>{def.status}</strong>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* AI Diagnostic Modal */}
      {selectedAIDefect && (
        <AIDiagnosticModal
          isOpen={!!selectedAIDefect}
          onClose={() => setSelectedAIDefect(null)}
          defectTitle={selectedAIDefect.title}
          description={selectedAIDefect.description}
          aircraftModel={selectedAIDefect.aircraftTailNumber}
          ataCategory={selectedAIDefect.category}
        />
      )}
    </div>
  );
};
