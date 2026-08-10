import React from 'react';
import { useAMMS } from '../../context/AMMSContext';
import {
  LayoutDashboard,
  Plane,
  Wrench,
  ClipboardList,
  ShieldCheck,
  AlertOctagon,
  Package,
  Truck,
  Users,
  FileText,
  Calendar,
  BarChart3,
  BrainCircuit,
  Settings,
  ChevronRight,
  Shield,
  ScrollText
} from 'lucide-react';

interface SidebarProps {
  collapsed?: boolean;
  setCollapsed?: (c: boolean) => void;
  isOpen?: boolean;
  onClose?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ collapsed: propCollapsed, setCollapsed: propSetCollapsed, isOpen, onClose }) => {
  const [internalCollapsed, setInternalCollapsed] = React.useState(false);
  const isCollapsed = propCollapsed !== undefined ? propCollapsed : internalCollapsed;
  const toggleCollapse = () => {
    if (propSetCollapsed) {
      propSetCollapsed(!isCollapsed);
    } else {
      setInternalCollapsed(!isCollapsed);
    }
  };

  const { activeTab, setActiveTab, activeModule, setActiveModule, workOrders, aircraft, inventory, defects } = useAMMS();
  const currentTab = activeTab || activeModule;
  const handleTabChange = (id: string) => {
    if (setActiveTab) setActiveTab(id);
    if (setActiveModule) setActiveModule(id);
    if (onClose) onClose();
  };

  const openWorkOrdersCount = workOrders.filter(w => w.status !== 'Completed' && w.status !== 'Closed').length;
  const groundedAircraftCount = aircraft.filter(a => a.status === 'Grounded (AOG)').length;
  const lowStockCount = inventory.filter(i => i.status === 'Low Stock' || i.status === 'Out of Stock').length;
  const openDefectsCount = defects.filter(d => d.status !== 'Closed').length;

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'aircraft', label: 'Aircraft Fleet', icon: Plane, badge: groundedAircraftCount > 0 ? `${groundedAircraftCount} AOG` : undefined, badgeColor: 'bg-rose-500/20 text-rose-400 border border-rose-500/30' },
    { id: 'maintenance', label: 'Maintenance Plans', icon: Wrench },
    { id: 'workorders', label: 'Work Orders', icon: ClipboardList, badge: openWorkOrdersCount > 0 ? `${openWorkOrdersCount}` : undefined, badgeColor: 'bg-blue-500/20 text-blue-400 border border-blue-500/30' },
    { id: 'inspections', label: 'Inspections', icon: ShieldCheck },
    { id: 'defects', label: 'Defects', icon: AlertOctagon, badge: openDefectsCount > 0 ? `${openDefectsCount}` : undefined, badgeColor: 'bg-amber-500/20 text-amber-400 border border-amber-500/30' },
    { id: 'inventory', label: 'Inventory & Parts', icon: Package, badge: lowStockCount > 0 ? `${lowStockCount} Alert` : undefined, badgeColor: 'bg-rose-500/20 text-rose-400 border border-rose-500/30' },
    { id: 'suppliers', label: 'Suppliers & POs', icon: Truck },
    { id: 'employees', label: 'Staff & Roster', icon: Users },
    { id: 'users', label: 'User Management', icon: Shield, badge: 'ADMIN', badgeColor: 'bg-purple-500/20 text-purple-400 border border-purple-500/30' },
    { id: 'audit', label: 'Audit Logs', icon: ScrollText },
    { id: 'documents', label: 'Document Library', icon: FileText },
    { id: 'calendar', label: 'Schedule Calendar', icon: Calendar },
    { id: 'reports', label: 'Reports & Audits', icon: BarChart3 },
    { id: 'analytics', label: 'AI Analytics', icon: BrainCircuit },
    { id: 'administration', label: 'Administration', icon: Settings },
  ];

  return (
    <>
      {/* Mobile Backdrop Overlay */}
      {isOpen && (
        <div
          onClick={onClose}
          className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-40 md:hidden"
        />
      )}

      <aside
        className={`fixed md:static inset-y-0 left-0 z-50 flex flex-col h-screen bg-[#0f172a]/95 backdrop-blur-md text-slate-300 border-r border-slate-800/80 transition-all duration-300 select-none ${
          isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        } ${isCollapsed ? 'w-16' : 'w-64'}`}
      >
        {/* Brand Branding Header */}
        <div className="h-16 flex items-center justify-between px-4 border-b border-slate-800/80 bg-slate-950/40">
          {!isCollapsed && (
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-sky-400 text-white shadow-lg shadow-blue-500/20">
                <Plane className="w-5 h-5 fill-white" />
              </div>
              <div>
                <div className="font-extrabold text-sm text-white tracking-wider flex items-center gap-1.5">
                  AMMS <span className="text-[10px] uppercase px-1.5 py-0.5 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20">MRO</span>
                </div>
                <div className="text-[10px] text-slate-400 font-mono tracking-tight">AIRBUS / SKYWISE COMPLIANT</div>
              </div>
            </div>
          )}
          {isCollapsed && (
            <div className="mx-auto p-2 rounded-xl bg-blue-600 text-white">
              <Plane className="w-5 h-5" />
            </div>
          )}
        </div>

        {/* Navigation List */}
        <div className="flex-1 overflow-y-auto py-3 px-2 space-y-1 custom-scrollbar">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleTabChange(item.id)}
                title={isCollapsed ? item.label : undefined}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition-all duration-200 group ${
                  isActive
                    ? 'bg-blue-600/15 text-blue-400 border border-blue-500/30 backdrop-blur-sm shadow-sm font-bold'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon className={`w-4 h-4 shrink-0 transition-transform ${isActive ? 'text-blue-400 scale-110' : 'text-slate-400 group-hover:text-slate-200'}`} />
                  {!isCollapsed && <span>{item.label}</span>}
                </div>

                {!isCollapsed && item.badge && (
                  <span className={`px-2 py-0.5 text-[10px] font-extrabold rounded-full ${item.badgeColor}`}>
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Footer Collapse Switch */}
        <div className="p-3 border-t border-slate-800/80 bg-slate-950/40">
          <button
            onClick={toggleCollapse}
            className="w-full flex items-center justify-center p-2 rounded-xl bg-slate-800/40 hover:bg-slate-800 text-slate-400 hover:text-white transition"
          >
            <ChevronRight className={`w-4 h-4 transition-transform duration-300 ${isCollapsed ? '' : 'rotate-180'}`} />
          </button>
        </div>
      </aside>
    </>
  );
};
