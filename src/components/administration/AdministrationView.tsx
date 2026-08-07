import React, { useState } from 'react';
import { useAMMS } from '../../context/AMMSContext';
import { Settings, Shield, Database, ScrollText, CheckCircle2, RotateCcw, Download, Save } from 'lucide-react';

export const AdministrationView: React.FC = () => {
  const { auditLogs, resetSystemData } = useAMMS();
  const [activeTab, setActiveTab] = useState<'matrix' | 'logs' | 'backup'>('matrix');

  const permissions = [
    { module: 'Fleet Aircraft', admin: true, manager: true, eng: false, tech: false, inspector: false, store: false },
    { module: 'Work Orders Create/Assign', admin: true, manager: true, eng: true, tech: false, inspector: false, store: false },
    { module: 'Work Orders Execute', admin: true, manager: true, eng: true, tech: true, inspector: false, store: false },
    { module: 'Quality Inspection Release', admin: true, manager: true, eng: false, tech: false, inspector: true, store: false },
    { module: 'Inventory & Parts Issue', admin: true, manager: true, eng: false, tech: false, inspector: false, store: true },
  ];

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-xl font-black text-slate-900 dark:text-white flex items-center gap-2">
          <Settings className="w-6 h-6 text-slate-700 dark:text-slate-200" /> Administration & Audit Trail
        </h1>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
          Role-based access matrix, system security logs, database backup, and environment controls.
        </p>
      </div>

      <div className="flex border-b border-slate-200 dark:border-slate-800 gap-4 text-xs font-bold">
        <button
          onClick={() => setActiveTab('matrix')}
          className={`pb-3 transition ${activeTab === 'matrix' ? 'border-b-2 border-blue-600 text-blue-600' : 'text-slate-500'}`}
        >
          Role Permissions Matrix
        </button>
        <button
          onClick={() => setActiveTab('logs')}
          className={`pb-3 transition ${activeTab === 'logs' ? 'border-b-2 border-blue-600 text-blue-600' : 'text-slate-500'}`}
        >
          Audit Activity Logs ({auditLogs.length})
        </button>
        <button
          onClick={() => setActiveTab('backup')}
          className={`pb-3 transition ${activeTab === 'backup' ? 'border-b-2 border-blue-600 text-blue-600' : 'text-slate-500'}`}
        >
          Database Backup & Restore
        </button>
      </div>

      {activeTab === 'matrix' && (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b text-slate-400 uppercase font-semibold">
                <th className="py-2.5 px-3">Module Action</th>
                <th className="py-2.5 px-3 text-center">Admin</th>
                <th className="py-2.5 px-3 text-center">Maint Manager</th>
                <th className="py-2.5 px-3 text-center">Engineer</th>
                <th className="py-2.5 px-3 text-center">Technician</th>
                <th className="py-2.5 px-3 text-center">Inspector</th>
                <th className="py-2.5 px-3 text-center">Store Manager</th>
              </tr>
            </thead>
            <tbody className="divide-y font-medium">
              {permissions.map((p, i) => (
                <tr key={i}>
                  <td className="py-3 px-3 font-bold text-slate-900 dark:text-white">{p.module}</td>
                  <td className="py-3 px-3 text-center font-bold text-emerald-600">✓</td>
                  <td className="py-3 px-3 text-center font-bold text-emerald-600">✓</td>
                  <td className="py-3 px-3 text-center font-bold">{p.eng ? '✓' : '-'}</td>
                  <td className="py-3 px-3 text-center font-bold">{p.tech ? '✓' : '-'}</td>
                  <td className="py-3 px-3 text-center font-bold">{p.inspector ? '✓' : '-'}</td>
                  <td className="py-3 px-3 text-center font-bold">{p.store ? '✓' : '-'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {activeTab === 'logs' && (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm space-y-2">
          {auditLogs.map((log) => (
            <div key={log.id} className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl text-xs flex justify-between items-center">
              <div>
                <span className="font-bold text-slate-900 dark:text-white">{log.action}</span>
                <span className="text-slate-500 ml-2">by {log.userName}</span>
                <div className="text-[11px] text-slate-400 mt-0.5">{log.details}</div>
              </div>
              <span className="font-mono text-[10px] text-slate-400">{log.timestamp}</span>
            </div>
          ))}
        </div>
      )}

      {activeTab === 'backup' && (
        <div className="p-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl space-y-4">
          <h3 className="font-bold text-slate-900 dark:text-white text-sm">System Database Controls</h3>
          <p className="text-xs text-slate-500">Restore default aviation dataset or download current state as JSON.</p>
          <div className="flex gap-3">
            <button
              onClick={resetSystemData}
              className="px-4 py-2 text-xs font-bold text-white bg-rose-600 hover:bg-rose-500 rounded-xl transition flex items-center gap-2"
            >
              <RotateCcw className="w-4 h-4" /> Reset Local Database to Defaults
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
