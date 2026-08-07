import React, { useState } from 'react';
import { useAMMS } from '../../context/AMMSContext';
import { Inspection, InspectionStatus } from '../../types';
import { DigitalSignatureModal } from '../common/DigitalSignatureModal';
import { PrintExportModal } from '../common/PrintExportModal';
import { ShieldCheck, Search, Filter, Plus, FileSignature, Printer, CheckCircle2, AlertTriangle, X } from 'lucide-react';

export const InspectionsView: React.FC = () => {
  const { inspections, updateInspection, searchQuery } = useAMMS();
  const [selectedInspection, setSelectedInspection] = useState<Inspection | null>(null);
  const [signingInspection, setSigningInspection] = useState<Inspection | null>(null);
  const [printingInspection, setPrintingInspection] = useState<Inspection | null>(null);

  const filtered = inspections.filter(i =>
    i.inspectionNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
    i.aircraftTailNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
    i.inspectorName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="p-6 space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-black text-slate-900 dark:text-white flex items-center gap-2">
            <ShieldCheck className="w-6 h-6 text-emerald-600" /> Quality & Airworthiness Inspections
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Conduct Daily, Pre-Flight, Annual C-Checks, and sign off compliance reports.
          </p>
        </div>
      </div>

      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm overflow-hidden">
        <table className="w-full text-left text-xs">
          <thead>
            <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-400 uppercase tracking-wider font-semibold bg-slate-50 dark:bg-slate-800/50">
              <th className="py-3 px-4">Inspection #</th>
              <th className="py-3 px-4">Aircraft</th>
              <th className="py-3 px-4">Type</th>
              <th className="py-3 px-4">Inspector</th>
              <th className="py-3 px-4">Date</th>
              <th className="py-3 px-4">Audit Score</th>
              <th className="py-3 px-4">Status</th>
              <th className="py-3 px-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 font-medium">
            {filtered.map((ins) => (
              <tr key={ins.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition">
                <td className="py-3 px-4 font-mono font-bold text-blue-600 dark:text-blue-400">{ins.inspectionNumber}</td>
                <td className="py-3 px-4 font-bold text-slate-900 dark:text-white">{ins.aircraftTailNumber}</td>
                <td className="py-3 px-4">{ins.type}</td>
                <td className="py-3 px-4 text-slate-600 dark:text-slate-400">{ins.inspectorName}</td>
                <td className="py-3 px-4 text-slate-500">{ins.date}</td>
                <td className="py-3 px-4 font-mono font-bold text-emerald-600">{ins.scorePercentage}%</td>
                <td className="py-3 px-4">
                  <span
                    className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      ins.status === 'Passed'
                        ? 'bg-emerald-500/20 text-emerald-600 dark:text-emerald-400'
                        : ins.status === 'In Progress'
                        ? 'bg-blue-500/20 text-blue-600'
                        : 'bg-rose-500/20 text-rose-600'
                    }`}
                  >
                    {ins.status}
                  </span>
                </td>
                <td className="py-3 px-4 text-right">
                  <div className="flex items-center justify-end gap-2">
                    <button
                      onClick={() => setSelectedInspection(ins)}
                      className="px-2.5 py-1 text-[11px] font-bold bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 rounded"
                    >
                      Checklist
                    </button>
                    <button onClick={() => setSigningInspection(ins)} className="p-1 text-slate-400 hover:text-emerald-500">
                      <FileSignature className="w-4 h-4" />
                    </button>
                    <button onClick={() => setPrintingInspection(ins)} className="p-1 text-slate-400 hover:text-blue-500">
                      <Printer className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Detail & Checklist Modal */}
      {selectedInspection && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl max-w-lg w-full p-6 space-y-4">
            <div className="flex justify-between items-center border-b pb-3 dark:border-slate-800">
              <div>
                <h3 className="font-bold text-sm text-slate-900 dark:text-white">Inspection Audit: {selectedInspection.inspectionNumber}</h3>
                <p className="text-xs text-slate-500">Aircraft {selectedInspection.aircraftTailNumber} • {selectedInspection.type}</p>
              </div>
              <button onClick={() => setSelectedInspection(null)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-2">
              {selectedInspection.checklists.map((chk, idx) => (
                <div key={chk.id} className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl flex items-center justify-between text-xs">
                  <div>
                    <div className="font-bold text-slate-900 dark:text-white">{chk.category}: {chk.task}</div>
                    {chk.notes && <div className="text-[11px] text-amber-600 mt-0.5">{chk.notes}</div>}
                  </div>
                  <button
                    onClick={() => {
                      const updatedChecklists = selectedInspection.checklists.map(c =>
                        c.id === chk.id ? { ...c, passed: !c.passed } : c
                      );
                      updateInspection(selectedInspection.id, { checklists: updatedChecklists });
                      setSelectedInspection({ ...selectedInspection, checklists: updatedChecklists });
                    }}
                    className={`px-2.5 py-1 rounded font-bold text-[10px] ${
                      chk.passed ? 'bg-emerald-500 text-white' : 'bg-rose-500 text-white'
                    }`}
                  >
                    {chk.passed ? 'PASS' : 'FAIL'}
                  </button>
                </div>
              ))}
            </div>

            <div className="flex justify-end pt-3 border-t dark:border-slate-800">
              <button
                onClick={() => setSelectedInspection(null)}
                className="px-4 py-2 font-semibold text-xs text-slate-600 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 rounded-lg"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Signature Modal */}
      {signingInspection && (
        <DigitalSignatureModal
          isOpen={!!signingInspection}
          onClose={() => setSigningInspection(null)}
          title={`Inspector Sign-off: ${signingInspection.inspectionNumber}`}
          subtitle={`Aircraft ${signingInspection.aircraftTailNumber}`}
          onSign={(signerName, notes) => {
            updateInspection(signingInspection.id, {
              status: 'Passed',
              digitalSignature: signerName,
              remarks: notes
            });
          }}
        />
      )}

      {/* Print Sheet */}
      {printingInspection && (
        <PrintExportModal
          isOpen={!!printingInspection}
          onClose={() => setPrintingInspection(null)}
          title={`Airworthiness Inspection Certificate: ${printingInspection.inspectionNumber}`}
          documentData={printingInspection}
          documentType="Inspection"
        />
      )}
    </div>
  );
};
