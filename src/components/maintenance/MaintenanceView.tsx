import React, { useState } from 'react';
import { useAMMS } from '../../context/AMMSContext';
import { Wrench, Calendar, Clock, CheckSquare, Zap, Shield, Sparkles, Plus, CheckCircle2 } from 'lucide-react';

export const MaintenanceView: React.FC = () => {
  const { aircraft, workOrders, setQuickActionModal } = useAMMS();
  const [activeTab, setActiveTab] = useState<'plans' | 'templates' | 'calendar'>('plans');

  const maintenancePlans = [
    {
      id: 'plan-1',
      title: 'A-Check Routine Service (250 Flight Hours)',
      type: 'Preventive',
      interval: 'Every 250 Flight Hours / 30 Days',
      description: 'Filter replacements, liquid water drain, emergency battery test, engine oil sampling, landing gear lube.',
      applicableFleet: 'Boeing 737-800, Airbus A320neo',
      estDurationHours: 12,
      lastExecuted: '2026-07-15'
    },
    {
      id: 'plan-2',
      title: 'C-Check Heavy Airworthiness Overhaul',
      type: 'Scheduled',
      interval: 'Every 24 Months / 6,000 Flight Hours',
      description: 'Complete structural skin X-ray inspection, cabin strip-down, engine removal & test cell run, hydraulic actuator seal replace.',
      applicableFleet: 'All Fleet Aircraft',
      estDurationHours: 120,
      lastExecuted: '2025-08-01'
    },
    {
      id: 'plan-3',
      title: 'Predictive Turbine Blade Vibration Wear Analysis',
      type: 'Predictive',
      interval: 'Continuous IoT Sensor Telemetry',
      description: 'Uses engine acoustic frequency sensors and AI wear models to predict turbine blade erosion before failure.',
      applicableFleet: 'CFM LEAP-1A, CFM56-7B Engines',
      estDurationHours: 4,
      lastExecuted: '2026-08-04'
    }
  ];

  return (
    <div className="p-6 space-y-6">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-black text-slate-900 dark:text-white flex items-center gap-2">
            <Wrench className="w-6 h-6 text-blue-600" /> Maintenance Management & Plans
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Manage Preventive, Corrective, and Predictive maintenance schedules, templates, and recurring checklists.
          </p>
        </div>

        <button
          onClick={() => setQuickActionModal('open')}
          className="px-4 py-2 text-xs font-bold text-white bg-blue-600 hover:bg-blue-500 rounded-xl shadow-md transition flex items-center gap-2"
        >
          <Plus className="w-4 h-4" /> Schedule Maintenance Plan
        </button>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-slate-200 dark:border-slate-800 gap-4 text-xs font-bold">
        <button
          onClick={() => setActiveTab('plans')}
          className={`pb-3 transition flex items-center gap-2 border-b-2 ${
            activeTab === 'plans'
              ? 'border-blue-600 text-blue-600 dark:text-blue-400'
              : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
          }`}
        >
          <Shield className="w-4 h-4" /> Maintenance Programs ({maintenancePlans.length})
        </button>
        <button
          onClick={() => setActiveTab('templates')}
          className={`pb-3 transition flex items-center gap-2 border-b-2 ${
            activeTab === 'templates'
              ? 'border-blue-600 text-blue-600 dark:text-blue-400'
              : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
          }`}
        >
          <CheckSquare className="w-4 h-4" /> Inspection Checklists & Templates
        </button>
      </div>

      {/* Plans Tab */}
      {activeTab === 'plans' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {maintenancePlans.map((plan) => (
            <div
              key={plan.id}
              className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm space-y-3 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase bg-blue-50 dark:bg-blue-950 text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-800">
                    {plan.type}
                  </span>
                  <span className="text-[11px] font-mono text-slate-400 flex items-center gap-1">
                    <Clock className="w-3 h-3" /> {plan.estDurationHours}h
                  </span>
                </div>

                <h3 className="font-bold text-slate-900 dark:text-white text-sm">{plan.title}</h3>
                <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">{plan.description}</p>
              </div>

              <div className="pt-3 border-t border-slate-100 dark:border-slate-800 space-y-1.5 text-xs">
                <div className="text-slate-500">Interval: <strong className="text-slate-900 dark:text-white">{plan.interval}</strong></div>
                <div className="text-slate-500">Fleet: <strong className="text-slate-900 dark:text-white">{plan.applicableFleet}</strong></div>
              </div>

              <button
                onClick={() => setQuickActionModal('open')}
                className="w-full py-2 text-xs font-bold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/50 hover:bg-blue-100 dark:hover:bg-blue-900/50 rounded-xl transition flex items-center justify-center gap-1.5"
              >
                <Zap className="w-3.5 h-3.5" /> Execute Program Now
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Templates Tab */}
      {activeTab === 'templates' && (
        <div className="p-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl space-y-4">
          <h3 className="font-bold text-slate-900 dark:text-white text-sm">Pre-Approved FAA / EASA Task Checklists</h3>
          <div className="space-y-3">
            {[
              { name: 'Engine CFM56 500-Cycle Borescope Checklist', steps: 12, dept: 'Powerplant Engine MRO' },
              { name: 'A320neo Main Gear Hydraulic Pressure Leak Check', steps: 8, dept: 'Hydraulics & Flight Controls' },
              { name: 'FMS Navigation Display Hardware BITE Test', steps: 6, dept: 'Avionics & Radar' },
            ].map((t, idx) => (
              <div key={idx} className="p-4 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200 dark:border-slate-700 flex items-center justify-between text-xs">
                <div>
                  <div className="font-bold text-slate-900 dark:text-white">{t.name}</div>
                  <div className="text-slate-500">{t.dept} • {t.steps} Inspection Points</div>
                </div>
                <button className="px-3 py-1.5 bg-white dark:bg-slate-700 border rounded-lg font-semibold hover:bg-slate-100">
                  Use Template
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
