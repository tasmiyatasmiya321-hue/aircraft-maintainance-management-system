import React, { useState } from 'react';
import { useAMMS } from '../../context/AMMSContext';
import { Wrench, AlertTriangle, Package, Plane, UserPlus, X, PlusCircle } from 'lucide-react';

export const QuickActionModal: React.FC = () => {
  const { quickActionModal, setQuickActionModal, aircraft, addWorkOrder, addDefect, addInventoryItem, addAircraft, addEmployee } = useAMMS();
  const [actionType, setActionType] = useState<'workorder' | 'defect' | 'inventory' | 'aircraft' | 'employee'>('workorder');

  // Form states
  const [tail, setTail] = useState('');
  const [title, setTitle] = useState('');
  const [desc, setDesc] = useState('');
  const [priority, setPriority] = useState<any>('Medium');
  const [severity, setSeverity] = useState<any>('Medium');
  const [category, setCategory] = useState<any>('ATA 29 Hydraulics');
  const [model, setModel] = useState('');
  const [partName, setPartName] = useState('');
  const [partNum, setPartNum] = useState('');
  const [qty, setQty] = useState(10);
  const [price, setPrice] = useState(250);
  const [empName, setEmpName] = useState('');
  const [empRole, setEmpRole] = useState<any>('Engineer');

  if (!quickActionModal) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const selectedAc = aircraft.find(a => a.tailNumber === tail) || aircraft[0];

    if (actionType === 'workorder') {
      addWorkOrder({
        aircraftId: selectedAc.id,
        aircraftTailNumber: selectedAc.tailNumber,
        aircraftModel: selectedAc.model,
        type: 'Preventive',
        priority,
        title,
        description: desc,
        department: 'General Line Maintenance',
        estimatedHours: 4,
        actualHours: 0,
        laborCost: 500,
        materialCost: 200,
        status: 'Open',
        createdBy: 'Quick Action User',
        dueDate: new Date(Date.now() + 86400000 * 2).toISOString().slice(0, 10)
      });
    } else if (actionType === 'defect') {
      addDefect({
        aircraftId: selectedAc.id,
        aircraftTailNumber: selectedAc.tailNumber,
        severity,
        category,
        title,
        description: desc,
        reportedBy: 'Active Operator',
        status: 'Reported'
      });
    } else if (actionType === 'inventory') {
      addInventoryItem({
        partNumber: partNum || `P-${Math.floor(10000+Math.random()*90000)}`,
        partName,
        manufacturer: 'Aero Parts Direct',
        category: 'Hardware & Fasteners',
        stockQuantity: Number(qty),
        minStockThreshold: 5,
        maxStockThreshold: 50,
        locationRack: 'Rack A-01',
        locationShelf: 'Shelf 01',
        unitPriceUSD: Number(price),
        supplierName: 'Aero Parts Direct',
        barcode: `${Math.floor(100000000000+Math.random()*900000000000)}`,
        batchNumber: `BATCH-${Date.now().toString().slice(-4)}`,
        status: Number(qty) > 5 ? 'In Stock' : 'Low Stock'
      });
    } else if (actionType === 'aircraft') {
      addAircraft({
        registrationNumber: tail || 'N737GA',
        tailNumber: tail || 'N737GA',
        name: title || 'Aero Flagship',
        model: model || 'Boeing 737-800',
        type: 'Commercial Airline',
        manufacturer: model.includes('Airbus') ? 'Airbus' : 'Boeing',
        serialNumber: `${Math.floor(10000 + Math.random() * 90000)}`,
        mfgYear: 2022,
        operator: 'Global Aviation',
        currentAirport: 'JFK - New York',
        hangar: 'Hangar Alpha-01',
        status: 'Available',
        engineType: 'CFM56',
        engineHours: 1200,
        flightHours: 1500,
        flightCycles: 600,
        landingCycles: 598,
        weightMaxTakeoffKg: 79000,
        fuelCapacityLiters: 26000,
        passengerCapacity: 180,
        lastMaintenanceDate: new Date().toISOString().slice(0, 10),
        nextMaintenanceDate: new Date(Date.now() + 86400000 * 30).toISOString().slice(0, 10),
        registrationExpiry: '2029-12-31',
        warrantyExpiry: '2027-12-31',
        photoUrl: 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?auto=format&fit=crop&w=800&q=80'
      });
    } else if (actionType === 'employee') {
      addEmployee({
        name: empName,
        email: `${empName.toLowerCase().replace(/\s+/g, '.')}@amms-aviation.com`,
        phone: '+1 (555) 019-2831',
        role: empRole,
        department: 'Line Maintenance',
        licenseNumber: `FAA-A&P-${Math.floor(100000+Math.random()*900000)}`,
        licenseExpiry: '2029-06-30',
        skills: ['A&P License', 'Avionics', 'Line Maintenance'],
        status: 'Available',
        assignedTasksCount: 0,
        hireDate: new Date().toISOString().slice(0, 10)
      });
    }

    setQuickActionModal(null);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl max-w-lg w-full overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-blue-600 text-white shadow-sm">
              <PlusCircle className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 dark:text-white text-base">AMMS Quick Entry</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">Fast action logger for aviation operations</p>
            </div>
          </div>
          <button onClick={() => setQuickActionModal(null)} className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Module Selector Tabs */}
        <div className="flex border-b border-slate-200 dark:border-slate-800 p-2 bg-slate-100/60 dark:bg-slate-800/40 gap-1 overflow-x-auto text-xs font-semibold">
          <button
            onClick={() => setActionType('workorder')}
            className={`px-3 py-2 rounded-lg flex items-center gap-1.5 transition ${actionType === 'workorder' ? 'bg-white dark:bg-slate-800 text-blue-600 dark:text-blue-400 shadow-sm' : 'text-slate-600 dark:text-slate-400'}`}
          >
            <Wrench className="w-3.5 h-3.5" /> Work Order
          </button>
          <button
            onClick={() => setActionType('defect')}
            className={`px-3 py-2 rounded-lg flex items-center gap-1.5 transition ${actionType === 'defect' ? 'bg-white dark:bg-slate-800 text-amber-600 dark:text-amber-400 shadow-sm' : 'text-slate-600 dark:text-slate-400'}`}
          >
            <AlertTriangle className="w-3.5 h-3.5" /> Defect
          </button>
          <button
            onClick={() => setActionType('inventory')}
            className={`px-3 py-2 rounded-lg flex items-center gap-1.5 transition ${actionType === 'inventory' ? 'bg-white dark:bg-slate-800 text-emerald-600 dark:text-emerald-400 shadow-sm' : 'text-slate-600 dark:text-slate-400'}`}
          >
            <Package className="w-3.5 h-3.5" /> Spare Part
          </button>
          <button
            onClick={() => setActionType('aircraft')}
            className={`px-3 py-2 rounded-lg flex items-center gap-1.5 transition ${actionType === 'aircraft' ? 'bg-white dark:bg-slate-800 text-indigo-600 dark:text-indigo-400 shadow-sm' : 'text-slate-600 dark:text-slate-400'}`}
          >
            <Plane className="w-3.5 h-3.5" /> Aircraft
          </button>
          <button
            onClick={() => setActionType('employee')}
            className={`px-3 py-2 rounded-lg flex items-center gap-1.5 transition ${actionType === 'employee' ? 'bg-white dark:bg-slate-800 text-purple-600 dark:text-purple-400 shadow-sm' : 'text-slate-600 dark:text-slate-400'}`}
          >
            <UserPlus className="w-3.5 h-3.5" /> Staff
          </button>
        </div>

        {/* Dynamic Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {actionType === 'workorder' && (
            <>
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Target Aircraft *</label>
                <select
                  value={tail}
                  onChange={(e) => setTail(e.target.value)}
                  className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                >
                  <option value="">Select Aircraft...</option>
                  {aircraft.map(a => (
                    <option key={a.id} value={a.tailNumber}>{a.tailNumber} - {a.model}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Work Order Title *</label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Engine 2 Borescope Inspection"
                  className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Priority</label>
                  <select
                    value={priority}
                    onChange={(e) => setPriority(e.target.value)}
                    className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                  >
                    <option value="Low">Low</option>
                    <option value="Medium">Medium</option>
                    <option value="High">High</option>
                    <option value="Critical (AOG)">Critical (AOG)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Description</label>
                <textarea
                  rows={2}
                  value={desc}
                  onChange={(e) => setDesc(e.target.value)}
                  placeholder="Describe tasks, required tools, or findings..."
                  className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                />
              </div>
            </>
          )}

          {actionType === 'defect' && (
            <>
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Target Aircraft *</label>
                <select
                  value={tail}
                  onChange={(e) => setTail(e.target.value)}
                  className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                >
                  <option value="">Select Aircraft...</option>
                  {aircraft.map(a => (
                    <option key={a.id} value={a.tailNumber}>{a.tailNumber} - {a.model}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Defect Summary *</label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Flight controls hydraulic line drip"
                  className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Severity</label>
                  <select
                    value={severity}
                    onChange={(e) => setSeverity(e.target.value)}
                    className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                  >
                    <option value="Low">Low</option>
                    <option value="Medium">Medium</option>
                    <option value="High">High</option>
                    <option value="Critical">Critical</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">ATA Category</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                  >
                    <option value="ATA 21 Air Conditioning">ATA 21 Air Conditioning</option>
                    <option value="ATA 24 Electrical">ATA 24 Electrical</option>
                    <option value="ATA 27 Flight Controls">ATA 27 Flight Controls</option>
                    <option value="ATA 29 Hydraulics">ATA 29 Hydraulics</option>
                    <option value="ATA 32 Landing Gear">ATA 32 Landing Gear</option>
                    <option value="ATA 71 Powerplant / Engine">ATA 71 Powerplant / Engine</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Observed Details</label>
                <textarea
                  rows={2}
                  value={desc}
                  onChange={(e) => setDesc(e.target.value)}
                  placeholder="Pilot report or technician observation notes..."
                  className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                />
              </div>
            </>
          )}

          {actionType === 'inventory' && (
            <>
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Part Name *</label>
                <input
                  type="text"
                  required
                  value={partName}
                  onChange={(e) => setPartName(e.target.value)}
                  placeholder="e.g. Turbine Fuel Metering Valve"
                  className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Part Number</label>
                  <input
                    type="text"
                    value={partNum}
                    onChange={(e) => setPartNum(e.target.value)}
                    placeholder="e.g. P-88120"
                    className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Stock Qty</label>
                  <input
                    type="number"
                    min="1"
                    value={qty}
                    onChange={(e) => setQty(Number(e.target.value))}
                    className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                  />
                </div>
              </div>
            </>
          )}

          {actionType === 'aircraft' && (
            <>
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Tail Registration Number *</label>
                <input
                  type="text"
                  required
                  value={tail}
                  onChange={(e) => setTail(e.target.value)}
                  placeholder="e.g. N882GA"
                  className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-mono"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Aircraft Model *</label>
                <input
                  type="text"
                  required
                  value={model}
                  onChange={(e) => setModel(e.target.value)}
                  placeholder="e.g. Airbus A321neo or Boeing 787"
                  className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                />
              </div>
            </>
          )}

          {actionType === 'employee' && (
            <>
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Staff Full Name *</label>
                <input
                  type="text"
                  required
                  value={empName}
                  onChange={(e) => setEmpName(e.target.value)}
                  placeholder="e.g. Capt. James Miller"
                  className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Role</label>
                <select
                  value={empRole}
                  onChange={(e) => setEmpRole(e.target.value)}
                  className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                >
                  <option value="Engineer">Engineer</option>
                  <option value="Technician">Technician</option>
                  <option value="Quality Inspector">Quality Inspector</option>
                  <option value="Store Manager">Store Manager</option>
                </select>
              </div>
            </>
          )}

          <div className="flex justify-end gap-2 pt-3 border-t border-slate-100 dark:border-slate-800">
            <button
              type="button"
              onClick={() => setQuickActionModal(null)}
              className="px-4 py-2 text-xs font-semibold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-500 rounded-lg transition shadow-sm"
            >
              Create Record
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
