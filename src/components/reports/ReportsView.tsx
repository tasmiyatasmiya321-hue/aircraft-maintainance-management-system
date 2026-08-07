import React, { useState } from 'react';
import { useAMMS } from '../../context/AMMSContext';
import { PrintExportModal } from '../common/PrintExportModal';
import { BarChart3, Download, Printer, FileSpreadsheet, CheckCircle2 } from 'lucide-react';

export const ReportsView: React.FC = () => {
  const { aircraft, workOrders, inventory } = useAMMS();
  const [exportModalType, setExportModalType] = useState<any | null>(null);

  const totalCost = workOrders.reduce((sum, w) => sum + w.laborCost + w.materialCost, 0);

  const handleExportCSV = () => {
    const csvData = "TailNumber,Model,Status,FlightHours,Cycles\n" +
      aircraft.map(a => `"${a.tailNumber}","${a.model}","${a.status}",${a.flightHours},${a.flightCycles}`).join("\n");
    const blob = new Blob([csvData], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `AMMS_Fleet_Report_${Date.now()}.csv`;
    a.click();
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-black text-slate-900 dark:text-white flex items-center gap-2">
            <BarChart3 className="w-6 h-6 text-blue-600" /> Executive Operational Reports
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Fleet Airworthiness Audit Reports, Cost Summaries, Downtime Logs, and CSV/PDF Exporters.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleExportCSV}
            className="px-4 py-2 text-xs font-bold text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:bg-slate-100 rounded-xl transition flex items-center gap-2"
          >
            <FileSpreadsheet className="w-4 h-4 text-emerald-600" /> Export All to CSV
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="p-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm space-y-3">
          <h3 className="font-bold text-slate-900 dark:text-white text-sm">Fleet Airworthiness Report</h3>
          <p className="text-xs text-slate-500">Summary of all {aircraft.length} aircraft, flight hours, and maintenance statuses.</p>
          <button
            onClick={() => setExportModalType('FleetReport')}
            className="w-full py-2 text-xs font-bold text-white bg-blue-600 hover:bg-blue-500 rounded-xl transition"
          >
            Generate Fleet PDF
          </button>
        </div>

        <div className="p-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm space-y-3">
          <h3 className="font-bold text-slate-900 dark:text-white text-sm">Maintenance Expenditure</h3>
          <p className="text-xs text-slate-500">Total YTD maintenance expenditure: <strong>${totalCost.toLocaleString()} USD</strong>.</p>
          <button
            onClick={handleExportCSV}
            className="w-full py-2 text-xs font-bold text-slate-700 dark:text-slate-200 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 rounded-xl transition"
          >
            Download Cost Sheet
          </button>
        </div>
      </div>

      {exportModalType && (
        <PrintExportModal
          isOpen={!!exportModalType}
          onClose={() => setExportModalType(null)}
          title="Airworthiness Fleet Readiness Report"
          documentData={aircraft[0]}
          documentType="WorkOrder"
        />
      )}
    </div>
  );
};
