import React from 'react';
import { useAMMS } from '../../context/AMMSContext';
import { ChevronRight, Home } from 'lucide-react';

export const Breadcrumb: React.FC = () => {
  const { activeModule, setActiveModule } = useAMMS();

  const moduleNames: Record<string, string> = {
    dashboard: 'System Overview & KPIs',
    aircraft: 'Fleet Aircraft Management',
    maintenance: 'Preventive & Scheduled Maintenance',
    workorders: 'Work Order Operations',
    inspections: 'Quality & Airworthiness Inspections',
    defects: 'Aviation Defects & ATA Reporting',
    inventory: 'Spare Parts & Inventory Control',
    suppliers: 'Suppliers & Purchase Management',
    employees: 'Engineers & Staff Roster',
    documents: 'Compliance & Manuals Library',
    calendar: 'Maintenance & Roster Schedule',
    reports: 'Audit & Operational Reports',
    analytics: 'Predictive AI Analytics & MTBF',
    administration: 'System Settings & Audit Logs'
  };

  return (
    <div className="flex items-center gap-2 px-6 py-2.5 bg-[#0f172a]/30 backdrop-blur-sm border-b border-slate-800/60 text-xs text-slate-400">
      <button
        onClick={() => setActiveModule('dashboard')}
        className="flex items-center gap-1 hover:text-blue-400 transition"
      >
        <Home className="w-3.5 h-3.5" />
        <span>AMMS Control Center</span>
      </button>
      <ChevronRight className="w-3 h-3 text-slate-500" />
      <span className="font-bold text-white capitalize">
        {moduleNames[activeModule] || activeModule}
      </span>
    </div>
  );
};
