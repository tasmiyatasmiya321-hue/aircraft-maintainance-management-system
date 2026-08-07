import React from 'react';
import { useAMMS } from '../../context/AMMSContext';
import {
  Plane,
  Wrench,
  AlertOctagon,
  CheckCircle2,
  Clock,
  Package,
  TrendingUp,
  DollarSign,
  AlertTriangle,
  ArrowUpRight,
  ShieldAlert,
  BarChart2,
  Users
} from 'lucide-react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  PieChart,
  Pie,
  Cell
} from 'recharts';

export const DashboardOverview: React.FC = () => {
  const { aircraft, workOrders, defects, inventory, employees, setActiveModule, setQuickActionModal } = useAMMS();

  // Statistics
  const totalAircraft = aircraft.length;
  const inMaintenanceCount = aircraft.filter(a => a.status === 'In Maintenance').length;
  const availableCount = aircraft.filter(a => a.status === 'Available').length;
  const groundedCount = aircraft.filter(a => a.status === 'Grounded (AOG)').length;

  const openWOs = workOrders.filter(w => w.status !== 'Completed' && w.status !== 'Closed');
  const completedWOs = workOrders.filter(w => w.status === 'Completed' || w.status === 'Closed');
  const criticalWOs = workOrders.filter(w => w.priority === 'Critical (AOG)');

  const lowStockCount = inventory.filter(i => i.status === 'Low Stock' || i.status === 'Out of Stock').length;
  const totalInventoryValue = inventory.reduce((sum, item) => sum + (item.stockQuantity * item.unitPriceUSD), 0);

  // Charts data
  const monthlyCostData = [
    { month: 'Mar', cost: 124000, hours: 320 },
    { month: 'Apr', cost: 189000, hours: 410 },
    { month: 'May', cost: 142000, hours: 350 },
    { month: 'Jun', cost: 210000, hours: 480 },
    { month: 'Jul', cost: 175000, hours: 390 },
    { month: 'Aug', cost: 238000, hours: 520 },
  ];

  const aircraftStatusPieData = [
    { name: 'Available', value: availableCount, color: '#10b981' },
    { name: 'In Maintenance', value: inMaintenanceCount, color: '#3b82f6' },
    { name: 'Grounded (AOG)', value: groundedCount, color: '#f43f5e' },
    { name: 'Inspection Due', value: aircraft.filter(a => a.status === 'Inspection Due').length, color: '#f59e0b' },
  ];

  const woStatusData = [
    { status: 'Open', count: workOrders.filter(w => w.status === 'Open').length },
    { status: 'In Progress', count: workOrders.filter(w => w.status === 'In Progress').length },
    { status: 'Waiting Parts', count: workOrders.filter(w => w.status === 'Waiting Parts').length },
    { status: 'Waiting Inspection', count: workOrders.filter(w => w.status === 'Waiting Inspection').length },
    { status: 'Completed', count: completedWOs.length },
  ];

  return (
    <div className="p-6 space-y-6">
      {/* Top Welcome Banner */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-slate-900 via-blue-950 to-indigo-900 text-white shadow-xl relative overflow-hidden">
        <div className="absolute -right-10 -bottom-10 opacity-10 pointer-events-none">
          <Plane className="w-80 h-80 text-white" />
        </div>
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-blue-500/20 text-blue-300 border border-blue-400/30 uppercase tracking-widest">
                System Status: ALL SYSTEMS OPERATIONAL
              </span>
              <span className="text-xs text-slate-300 font-mono">
                • {new Date().toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
              </span>
            </div>
            <h1 className="text-2xl font-black text-white mt-1">Aircraft Maintenance Command Dashboard</h1>
            <p className="text-xs text-slate-300 max-w-xl mt-1">
              Real-time airworthiness monitor for fleet operations, open work orders, AOG emergency alerts, and inventory thresholds.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setQuickActionModal('open')}
              className="px-4 py-2 text-xs font-bold text-slate-900 bg-white hover:bg-slate-100 rounded-xl shadow-lg transition flex items-center gap-2"
            >
              <Wrench className="w-4 h-4 text-blue-600" /> Issue Work Order
            </button>
            <button
              onClick={() => setActiveModule('reports')}
              className="px-4 py-2 text-xs font-bold text-white bg-blue-600/60 hover:bg-blue-600 rounded-xl border border-blue-400/30 transition flex items-center gap-2"
            >
              <BarChart2 className="w-4 h-4" /> Export Report
            </button>
          </div>
        </div>
      </div>

      {/* Grounded AOG Alert Banner if active */}
      {groundedCount > 0 && (
        <div className="p-4 bg-rose-500/10 border-2 border-rose-500/30 rounded-2xl flex items-center justify-between text-rose-900 dark:text-rose-200">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-rose-500 text-white animate-bounce">
              <ShieldAlert className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-bold text-sm">CRITICAL AOG GROUNDED AIRCRAFT DETECTED ({groundedCount})</h3>
              <p className="text-xs opacity-90">
                {aircraft.filter(a => a.status === 'Grounded (AOG)').map(a => `${a.tailNumber} (${a.model})`).join(', ')} require immediate engineer dispatch.
              </p>
            </div>
          </div>
          <button
            onClick={() => setActiveModule('workorders')}
            className="px-3.5 py-2 text-xs font-bold text-white bg-rose-600 hover:bg-rose-500 rounded-xl shadow transition shrink-0"
          >
            View AOG Jobs
          </button>
        </div>
      )}

      {/* KPI Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Fleet */}
        <div
          onClick={() => setActiveModule('aircraft')}
          className="p-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm hover:shadow-md transition cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Fleet Readiness</span>
            <div className="p-2 rounded-xl bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400 group-hover:scale-110 transition">
              <Plane className="w-5 h-5" />
            </div>
          </div>
          <div className="text-2xl font-black text-slate-900 dark:text-white mt-2">{availableCount} / {totalAircraft}</div>
          <div className="text-xs text-emerald-600 dark:text-emerald-400 font-semibold mt-1 flex items-center gap-1">
            <ArrowUpRight className="w-3.5 h-3.5" />
            {Math.round((availableCount / totalAircraft) * 100)}% Airworthy
          </div>
        </div>

        {/* Open Work Orders */}
        <div
          onClick={() => setActiveModule('workorders')}
          className="p-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm hover:shadow-md transition cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Active Work Orders</span>
            <div className="p-2 rounded-xl bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400 group-hover:scale-110 transition">
              <Wrench className="w-5 h-5" />
            </div>
          </div>
          <div className="text-2xl font-black text-slate-900 dark:text-white mt-2">{openWOs.length}</div>
          <div className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            {criticalWOs.length} Critical AOG • {completedWOs.length} Completed
          </div>
        </div>

        {/* Open Defects */}
        <div
          onClick={() => setActiveModule('defects')}
          className="p-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm hover:shadow-md transition cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Reported Defects</span>
            <div className="p-2 rounded-xl bg-amber-50 dark:bg-amber-950/50 text-amber-600 dark:text-amber-400 group-hover:scale-110 transition">
              <AlertOctagon className="w-5 h-5" />
            </div>
          </div>
          <div className="text-2xl font-black text-slate-900 dark:text-white mt-2">{defects.filter(d => d.status !== 'Closed').length}</div>
          <div className="text-xs text-amber-600 dark:text-amber-400 font-medium mt-1">
            ATA System Categorized
          </div>
        </div>

        {/* Inventory Value & Alerts */}
        <div
          onClick={() => setActiveModule('inventory')}
          className="p-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm hover:shadow-md transition cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Inventory Value</span>
            <div className="p-2 rounded-xl bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400 group-hover:scale-110 transition">
              <Package className="w-5 h-5" />
            </div>
          </div>
          <div className="text-2xl font-black text-slate-900 dark:text-white mt-2">
            ${(totalInventoryValue / 1000).toFixed(0)}k USD
          </div>
          <div className="text-xs text-rose-500 font-bold mt-1">
            {lowStockCount} Items Low Stock
          </div>
        </div>
      </div>

      {/* Analytics Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Monthly Cost & Hours Area Chart */}
        <div className="lg:col-span-2 p-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-bold text-slate-900 dark:text-white text-base">Monthly Maintenance Expenditure ($ USD)</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">Direct parts & technician labor costs over time</p>
            </div>
            <span className="text-xs font-mono font-bold text-emerald-600 bg-emerald-50 dark:bg-emerald-950/40 px-2.5 py-1 rounded-lg">
              Est. MTTR: 4.8 hrs
            </span>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={monthlyCostData}>
                <defs>
                  <linearGradient id="costGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="month" stroke="#94a3b8" fontSize={11} tickLine={false} />
                <YAxis stroke="#94a3b8" fontSize={11} tickLine={false} tickFormatter={(v) => `$${v / 1000}k`} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px', color: '#fff' }}
                  formatter={(value: any) => [`$${value.toLocaleString()}`, 'Maintenance Cost']}
                />
                <Area type="monotone" dataKey="cost" stroke="#3b82f6" strokeWidth={3} fillOpacity={1} fill="url(#costGrad)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Aircraft Status Donut Pie */}
        <div className="p-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm flex flex-col justify-between">
          <div>
            <h3 className="font-bold text-slate-900 dark:text-white text-base">Fleet Operational Status</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">Current active disposition</p>
          </div>

          <div className="h-48 w-full my-2">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={aircraftStatusPieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={75}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {aircraftStatusPieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderRadius: '8px', color: '#fff' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="grid grid-cols-2 gap-2 text-xs">
            {aircraftStatusPieData.map((item) => (
              <div key={item.name} className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }} />
                <span className="text-slate-600 dark:text-slate-300">{item.name}: <strong>{item.value}</strong></span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Active Work Orders Table Preview */}
      <div className="p-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="font-bold text-slate-900 dark:text-white text-base">Active Work Order Queue</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">High priority maintenance tasks assigned to engineers</p>
          </div>
          <button
            onClick={() => setActiveModule('workorders')}
            className="text-xs font-bold text-blue-600 hover:underline"
          >
            View All Work Orders →
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-400 uppercase tracking-wider font-semibold">
                <th className="py-2.5 px-3">WO #</th>
                <th className="py-2.5 px-3">Aircraft</th>
                <th className="py-2.5 px-3">Title</th>
                <th className="py-2.5 px-3">Priority</th>
                <th className="py-2.5 px-3">Assigned Engineer</th>
                <th className="py-2.5 px-3">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 font-medium">
              {openWOs.slice(0, 5).map((wo) => (
                <tr key={wo.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition">
                  <td className="py-3 px-3 font-mono font-bold text-blue-600 dark:text-blue-400">{wo.workOrderNumber}</td>
                  <td className="py-3 px-3 font-bold text-slate-900 dark:text-white">{wo.aircraftTailNumber}</td>
                  <td className="py-3 px-3 text-slate-800 dark:text-slate-200">{wo.title}</td>
                  <td className="py-3 px-3">
                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        wo.priority === 'Critical (AOG)'
                          ? 'bg-rose-500/20 text-rose-600 dark:text-rose-400 border border-rose-500/30'
                          : wo.priority === 'High'
                          ? 'bg-amber-500/20 text-amber-600 dark:text-amber-400'
                          : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
                      }`}
                    >
                      {wo.priority}
                    </span>
                  </td>
                  <td className="py-3 px-3 text-slate-600 dark:text-slate-400">{wo.assignedEngineerName || 'Unassigned'}</td>
                  <td className="py-3 px-3">
                    <span className="px-2 py-0.5 bg-blue-50 dark:bg-blue-950 text-blue-600 dark:text-blue-400 rounded-md font-bold">
                      {wo.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
