import React, { useState } from 'react';
import { useAMMS } from '../../context/AMMSContext';
import { WorkOrder, WorkOrderStatus, WorkOrderPriority } from '../../types';
import { DigitalSignatureModal } from '../common/DigitalSignatureModal';
import { PrintExportModal } from '../common/PrintExportModal';
import {
  Wrench,
  Search,
  Filter,
  Plus,
  LayoutGrid,
  List,
  Clock,
  DollarSign,
  UserCheck,
  Printer,
  CheckCircle2,
  AlertTriangle,
  FileSignature,
  Package,
  X,
  ChevronRight,
  MoreVertical,
  Trash2
} from 'lucide-react';

export const WorkOrdersView: React.FC = () => {
  const {
    workOrders,
    aircraft,
    employees,
    inventory,
    addWorkOrder,
    updateWorkOrder,
    deleteWorkOrder,
    issuePartToWorkOrder,
    searchQuery
  } = useAMMS();

  const [viewMode, setViewMode] = useState<'table' | 'kanban'>('kanban');
  const [priorityFilter, setPriorityFilter] = useState<string>('All');
  const [statusFilter, setStatusFilter] = useState<string>('All');

  // Modals
  const [signingWO, setSigningWO] = useState<WorkOrder | null>(null);
  const [printingWO, setPrintingWO] = useState<WorkOrder | null>(null);
  const [showNewWOModal, setShowNewWOModal] = useState<boolean>(false);
  const [selectedWO, setSelectedWO] = useState<WorkOrder | null>(null);

  // Form states
  const [tailNumber, setTailNumber] = useState('');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState<WorkOrderPriority>('Medium');
  const [category, setCategory] = useState<any>('Preventive');
  const [engineerId, setEngineerId] = useState('');
  const [estHours, setEstHours] = useState(6);
  const [laborCost, setLaborCost] = useState(900);
  const [materialCost, setMaterialCost] = useState(450);

  const filteredWorkOrders = workOrders.filter((wo) => {
    const matchesSearch =
      wo.workOrderNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      wo.aircraftTailNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      wo.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (wo.assignedEngineerName && wo.assignedEngineerName.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesPriority = priorityFilter === 'All' || wo.priority === priorityFilter;
    const matchesStatus = statusFilter === 'All' || wo.status === statusFilter;

    return matchesSearch && matchesPriority && matchesStatus;
  });

  const kanbanColumns: WorkOrderStatus[] = [
    'Open',
    'Assigned',
    'In Progress',
    'Waiting Parts',
    'Waiting Inspection',
    'Completed'
  ];

  const handleCreateWO = (e: React.FormEvent) => {
    e.preventDefault();
    const ac = aircraft.find(a => a.tailNumber === tailNumber) || aircraft[0];
    const eng = employees.find(e => e.id === engineerId);

    addWorkOrder({
      aircraftId: ac ? ac.id : 'ac-1',
      aircraftTailNumber: ac ? ac.tailNumber : 'N738GA',
      aircraftModel: ac ? ac.model : 'Boeing 737-800',
      type: category,
      priority,
      title,
      description,
      assignedEngineerId: eng?.id,
      assignedEngineerName: eng?.name || 'Unassigned',
      assignedTechnicianName: 'Line Technician Team',
      department: 'Fleet Line Maintenance',
      estimatedHours: Number(estHours),
      actualHours: 0,
      laborCost: Number(laborCost),
      materialCost: Number(materialCost),
      status: eng ? 'Assigned' : 'Open',
      createdBy: 'Line Maintenance Dispatch',
      dueDate: new Date(Date.now() + 86400000 * 3).toISOString().slice(0, 10)
    });

    setShowNewWOModal(false);
    resetForm();
  };

  const resetForm = () => {
    setTailNumber('');
    setTitle('');
    setDescription('');
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-black text-slate-900 dark:text-white flex items-center gap-2">
            <Wrench className="w-6 h-6 text-blue-600" /> Work Order Management
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Create, assign, track labor costs, issue spare parts, and digitally sign airworthiness releases.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {/* View Mode Toggle */}
          <div className="p-1 bg-slate-100 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 flex items-center gap-1">
            <button
              onClick={() => setViewMode('kanban')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 ${
                viewMode === 'kanban'
                  ? 'bg-white dark:bg-slate-900 text-blue-600 dark:text-blue-400 shadow-sm'
                  : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <LayoutGrid className="w-3.5 h-3.5" /> Kanban Board
            </button>
            <button
              onClick={() => setViewMode('table')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 ${
                viewMode === 'table'
                  ? 'bg-white dark:bg-slate-900 text-blue-600 dark:text-blue-400 shadow-sm'
                  : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <List className="w-3.5 h-3.5" /> Table View
            </button>
          </div>

          <button
            onClick={() => setShowNewWOModal(true)}
            className="px-4 py-2 text-xs font-bold text-white bg-blue-600 hover:bg-blue-500 rounded-xl shadow-md transition flex items-center gap-2"
          >
            <Plus className="w-4 h-4" /> New Work Order
          </button>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="flex flex-wrap items-center gap-3 p-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm text-xs font-medium">
        <span className="text-slate-400 font-bold flex items-center gap-1">
          <Filter className="w-3.5 h-3.5" /> Priority:
        </span>
        {['All', 'Critical (AOG)', 'High', 'Medium', 'Low'].map((p) => (
          <button
            key={p}
            onClick={() => setPriorityFilter(p)}
            className={`px-2.5 py-1 rounded-xl transition ${
              priorityFilter === p
                ? 'bg-blue-600 text-white font-bold'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
            }`}
          >
            {p}
          </button>
        ))}
      </div>

      {/* KANBAN BOARD VIEW */}
      {viewMode === 'kanban' && (
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4 overflow-x-auto pb-4">
          {kanbanColumns.map((colStatus) => {
            const colWOs = filteredWorkOrders.filter((w) => w.status === colStatus);
            return (
              <div
                key={colStatus}
                className="bg-slate-100/70 dark:bg-slate-900/60 border border-slate-200/80 dark:border-slate-800/80 rounded-2xl p-3 flex flex-col min-h-[500px]"
              >
                {/* Column Header */}
                <div className="flex items-center justify-between pb-2.5 border-b border-slate-200 dark:border-slate-800 mb-3">
                  <span className="text-xs font-black text-slate-800 dark:text-slate-200 uppercase tracking-wider">
                    {colStatus}
                  </span>
                  <span className="px-2 py-0.5 rounded-full bg-slate-200 dark:bg-slate-800 text-[10px] font-bold text-slate-600 dark:text-slate-400">
                    {colWOs.length}
                  </span>
                </div>

                {/* Cards Container */}
                <div className="space-y-3 flex-1 overflow-y-auto custom-scrollbar">
                  {colWOs.map((wo) => (
                    <div
                      key={wo.id}
                      className="p-3.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700/80 rounded-xl shadow-sm hover:shadow-md transition space-y-2.5"
                    >
                      {/* Priority Tag & WO # */}
                      <div className="flex items-center justify-between">
                        <span className="font-mono font-bold text-[11px] text-blue-600 dark:text-blue-400">
                          {wo.workOrderNumber}
                        </span>
                        <span
                          className={`px-2 py-0.5 rounded text-[9px] font-extrabold uppercase ${
                            wo.priority === 'Critical (AOG)'
                              ? 'bg-rose-500/20 text-rose-600 dark:text-rose-400 border border-rose-500/30'
                              : wo.priority === 'High'
                              ? 'bg-amber-500/20 text-amber-600 dark:text-amber-400'
                              : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300'
                          }`}
                        >
                          {wo.priority}
                        </span>
                      </div>

                      {/* Tail & Title */}
                      <div>
                        <div className="text-xs font-black text-slate-900 dark:text-white">
                          {wo.aircraftTailNumber} ({wo.aircraftModel})
                        </div>
                        <div className="text-xs text-slate-700 dark:text-slate-300 font-medium line-clamp-2 mt-0.5">
                          {wo.title}
                        </div>
                      </div>

                      {/* Assigned & Hours */}
                      <div className="flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400 pt-1 border-t border-slate-100 dark:border-slate-700/60">
                        <span className="truncate max-w-[110px] font-medium">
                          👤 {wo.assignedEngineerName || 'Unassigned'}
                        </span>
                        <span className="font-mono">⏱ {wo.estimatedHours}h</span>
                      </div>

                      {/* Actions */}
                      <div className="flex items-center justify-between pt-1">
                        <button
                          onClick={() => setSelectedWO(wo)}
                          className="text-[11px] font-bold text-blue-600 dark:text-blue-400 hover:underline"
                        >
                          View Details
                        </button>

                        <div className="flex items-center gap-1">
                          {/* Sign off button if waiting inspection or completed */}
                          <button
                            onClick={() => setSigningWO(wo)}
                            title="Digital Airworthiness Release Sign-off"
                            className="p-1 text-slate-400 hover:text-emerald-600 dark:hover:text-emerald-400"
                          >
                            <FileSignature className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => setPrintingWO(wo)}
                            title="Print Work Order Sheet"
                            className="p-1 text-slate-400 hover:text-blue-600"
                          >
                            <Printer className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* TABLE VIEW */}
      {viewMode === 'table' && (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm overflow-hidden">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-400 uppercase tracking-wider font-semibold bg-slate-50 dark:bg-slate-800/50">
                <th className="py-3 px-4">WO #</th>
                <th className="py-3 px-4">Aircraft</th>
                <th className="py-3 px-4">Title</th>
                <th className="py-3 px-4">Type</th>
                <th className="py-3 px-4">Priority</th>
                <th className="py-3 px-4">Assigned Engineer</th>
                <th className="py-3 px-4">Labor Cost</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 font-medium">
              {filteredWorkOrders.map((wo) => (
                <tr key={wo.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition">
                  <td className="py-3 px-4 font-mono font-bold text-blue-600 dark:text-blue-400">{wo.workOrderNumber}</td>
                  <td className="py-3 px-4 font-bold text-slate-900 dark:text-white">{wo.aircraftTailNumber}</td>
                  <td className="py-3 px-4 text-slate-800 dark:text-slate-200">{wo.title}</td>
                  <td className="py-3 px-4 text-slate-500">{wo.type}</td>
                  <td className="py-3 px-4">
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        wo.priority === 'Critical (AOG)'
                          ? 'bg-rose-500/20 text-rose-600 dark:text-rose-400'
                          : wo.priority === 'High'
                          ? 'bg-amber-500/20 text-amber-600 dark:text-amber-400'
                          : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
                      }`}
                    >
                      {wo.priority}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-slate-600 dark:text-slate-400">{wo.assignedEngineerName || 'Unassigned'}</td>
                  <td className="py-3 px-4 font-mono font-bold text-slate-900 dark:text-white">${wo.laborCost + wo.materialCost}</td>
                  <td className="py-3 px-4">
                    <select
                      value={wo.status}
                      onChange={(e) => updateWorkOrder(wo.id, { status: e.target.value as WorkOrderStatus })}
                      className="px-2 py-1 rounded bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-xs font-bold"
                    >
                      <option value="Open">Open</option>
                      <option value="Assigned">Assigned</option>
                      <option value="In Progress">In Progress</option>
                      <option value="Waiting Parts">Waiting Parts</option>
                      <option value="Waiting Inspection">Waiting Inspection</option>
                      <option value="Completed">Completed</option>
                    </select>
                  </td>
                  <td className="py-3 px-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button onClick={() => setSigningWO(wo)} className="p-1 text-slate-400 hover:text-emerald-500">
                        <FileSignature className="w-4 h-4" />
                      </button>
                      <button onClick={() => setPrintingWO(wo)} className="p-1 text-slate-400 hover:text-blue-500">
                        <Printer className="w-4 h-4" />
                      </button>
                      <button onClick={() => deleteWorkOrder(wo.id)} className="p-1 text-slate-400 hover:text-rose-500">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Digital Signature Modal */}
      {signingWO && (
        <DigitalSignatureModal
          isOpen={!!signingWO}
          onClose={() => setSigningWO(null)}
          title={`Airworthiness Release Sign-off: ${signingWO.workOrderNumber}`}
          subtitle={`Aircraft ${signingWO.aircraftTailNumber} • ${signingWO.title}`}
          onSign={(signerName, notes) => {
            updateWorkOrder(signingWO.id, {
              status: 'Completed',
              signedBy: signerName,
              signedAt: new Date().toISOString().replace('T', ' ').slice(0, 16),
              remarks: notes
            });
          }}
        />
      )}

      {/* Print PDF Sheet Modal */}
      {printingWO && (
        <PrintExportModal
          isOpen={!!printingWO}
          onClose={() => setPrintingWO(null)}
          title={`Work Order Document: ${printingWO.workOrderNumber}`}
          documentData={printingWO}
          documentType="WorkOrder"
        />
      )}

      {/* Create Work Order Modal */}
      {showNewWOModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl max-w-lg w-full p-6 space-y-4">
            <div className="flex justify-between items-center border-b pb-3 dark:border-slate-800">
              <h3 className="font-bold text-base text-slate-900 dark:text-white">Issue Maintenance Work Order</h3>
              <button onClick={() => setShowNewWOModal(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateWO} className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Select Aircraft *</label>
                <select
                  required
                  value={tailNumber}
                  onChange={(e) => setTailNumber(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                >
                  <option value="">Select Aircraft Tail...</option>
                  {aircraft.map(a => (
                    <option key={a.id} value={a.tailNumber}>{a.tailNumber} - {a.model}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Work Order Title *</label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Engine 1 Borescope & Combustor Inspection"
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Priority</label>
                  <select
                    value={priority}
                    onChange={(e) => setPriority(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                  >
                    <option value="Low">Low</option>
                    <option value="Medium">Medium</option>
                    <option value="High">High</option>
                    <option value="Critical (AOG)">Critical (AOG)</option>
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Assign Lead Engineer</label>
                  <select
                    value={engineerId}
                    onChange={(e) => setEngineerId(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                  >
                    <option value="">Unassigned</option>
                    {employees.filter(emp => emp.role === 'Engineer').map(eng => (
                      <option key={eng.id} value={eng.id}>{eng.name} ({eng.department})</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Task Scope & Manual References</label>
                <textarea
                  rows={3}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Enter detailed maintenance instructions or AMM chapter references..."
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowNewWOModal(false)}
                  className="px-4 py-2 font-semibold text-slate-600 dark:text-slate-400 hover:bg-slate-100 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 font-semibold text-white bg-blue-600 hover:bg-blue-500 rounded-lg shadow-sm"
                >
                  Issue Work Order
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
