import React from 'react';
import { useAMMS } from '../../context/AMMSContext';
import { BrainCircuit, TrendingUp, Zap, AlertTriangle, ShieldCheck, Activity } from 'lucide-react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, LineChart, Line } from 'recharts';

export const AnalyticsView: React.FC = () => {
  const mtbfData = [
    { month: 'Jan', mtbfHours: 420, mttrHours: 5.2 },
    { month: 'Feb', mtbfHours: 480, mttrHours: 4.8 },
    { month: 'Mar', mtbfHours: 510, mttrHours: 4.5 },
    { month: 'Apr', mtbfHours: 490, mttrHours: 4.2 },
    { month: 'May', mtbfHours: 560, mttrHours: 3.9 },
    { month: 'Jun', mtbfHours: 620, mttrHours: 3.6 },
  ];

  const ataFailureDistribution = [
    { name: 'ATA 29 Hydraulics', defects: 14 },
    { name: 'ATA 71 Powerplant', defects: 11 },
    { name: 'ATA 32 Landing Gear', defects: 8 },
    { name: 'ATA 24 Electrical', defects: 7 },
    { name: 'ATA 34 Avionics', defects: 5 },
  ];

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-xl font-black text-slate-900 dark:text-white flex items-center gap-2">
          <BrainCircuit className="w-6 h-6 text-blue-600" /> AI Predictive Analytics & MTBF Engine
        </h1>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
          Mean Time Between Failures (MTBF), Mean Time To Repair (MTTR), and AI predictive component wear models.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* MTBF vs MTTR Chart */}
        <div className="p-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm">
          <h3 className="font-bold text-slate-900 dark:text-white text-sm mb-1">MTBF (Flight Hours) & MTTR Trend</h3>
          <p className="text-xs text-slate-500 mb-4">Higher MTBF and lower MTTR indicate superior maintenance efficiency.</p>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={mtbfData}>
                <XAxis dataKey="month" stroke="#94a3b8" fontSize={11} />
                <YAxis stroke="#94a3b8" fontSize={11} />
                <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderRadius: '12px', color: '#fff' }} />
                <Line type="monotone" dataKey="mtbfHours" stroke="#3b82f6" strokeWidth={3} name="MTBF (hrs)" />
                <Line type="monotone" dataKey="mttrHours" stroke="#10b981" strokeWidth={3} name="MTTR (hrs)" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* ATA System Defect Distribution */}
        <div className="p-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm">
          <h3 className="font-bold text-slate-900 dark:text-white text-sm mb-1">Defects by ATA System Category</h3>
          <p className="text-xs text-slate-500 mb-4">Highlights high-wear aircraft subsystems requiring preventive overhaul.</p>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={ataFailureDistribution} layout="vertical">
                <XAxis type="number" stroke="#94a3b8" fontSize={11} />
                <YAxis type="category" dataKey="name" stroke="#94a3b8" fontSize={10} width={130} />
                <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderRadius: '12px', color: '#fff' }} />
                <Bar dataKey="defects" fill="#6366f1" radius={[0, 8, 8, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};
