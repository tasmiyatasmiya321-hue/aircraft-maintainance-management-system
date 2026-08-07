import React, { useState } from 'react';
import { useAMMS } from '../../context/AMMSContext';
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight, Clock, Wrench, ShieldCheck, Plus } from 'lucide-react';

export const CalendarView: React.FC = () => {
  const { workOrders, inspections, setQuickActionModal } = useAMMS();
  const [currentMonth, setCurrentMonth] = useState('August 2026');

  const daysInMonth = Array.from({ length: 31 }, (_, i) => i + 1);

  return (
    <div className="p-6 space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-black text-slate-900 dark:text-white flex items-center gap-2">
            <CalendarIcon className="w-6 h-6 text-indigo-600" /> Maintenance & Roster Calendar
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Scheduled A-Checks, C-Checks, AOG emergency downtime, and engineer shifts.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button className="p-2 border rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800">
            <ChevronLeft className="w-4 h-4" />
          </button>
          <span className="text-sm font-bold text-slate-900 dark:text-white font-mono px-3">{currentMonth}</span>
          <button className="p-2 border rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800">
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Calendar Month Grid */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 shadow-sm overflow-x-auto">
        <div className="grid grid-cols-7 gap-2 min-w-[700px] text-center font-bold text-xs text-slate-400 border-b pb-2 mb-2">
          <div>Sun</div><div>Mon</div><div>Tue</div><div>Wed</div><div>Thu</div><div>Fri</div><div>Sat</div>
        </div>

        <div className="grid grid-cols-7 gap-2 min-w-[700px]">
          {daysInMonth.map((day) => {
            const dayWO = workOrders.filter(w => w.createdDate.includes(`2026-08-0${day}`) || w.createdDate.includes(`2026-08-${day}`));
            return (
              <div
                key={day}
                className={`p-2 min-h-[90px] border border-slate-100 dark:border-slate-800 rounded-xl transition ${
                  day === 6 ? 'bg-blue-50/50 dark:bg-blue-950/20 border-blue-300 dark:border-blue-700' : 'bg-slate-50/50 dark:bg-slate-800/40'
                }`}
              >
                <div className="text-xs font-bold text-slate-900 dark:text-white text-right mb-1">{day}</div>
                {dayWO.map((w) => (
                  <div key={w.id} className="p-1 mb-1 bg-blue-600 text-white text-[9px] font-bold rounded truncate">
                    {w.aircraftTailNumber}: {w.title}
                  </div>
                ))}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
