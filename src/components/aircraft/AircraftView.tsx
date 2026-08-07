import React, { useState } from 'react';
import { useAMMS } from '../../context/AMMSContext';
import { Aircraft, AircraftStatus } from '../../types';
import { QRCodeModal } from '../common/QRCodeModal';
import {
  Plane,
  Search,
  Filter,
  Plus,
  QrCode,
  Clock,
  Gauge,
  Calendar,
  AlertTriangle,
  MoreVertical,
  ChevronRight,
  ShieldAlert,
  Wrench,
  Trash2,
  Edit,
  MapPin,
  X
} from 'lucide-react';

export const AircraftView: React.FC = () => {
  const { aircraft, addAircraft, updateAircraft, deleteAircraft, searchQuery } = useAMMS();
  const [statusFilter, setStatusFilter] = useState<string>('All');
  const [typeFilter, setTypeFilter] = useState<string>('All');
  
  // Modals
  const [selectedAircraft, setSelectedAircraft] = useState<Aircraft | null>(null);
  const [qrModalAircraft, setQrModalAircraft] = useState<Aircraft | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editAircraft, setEditAircraft] = useState<Aircraft | null>(null);

  // Form states
  const [tail, setTail] = useState('');
  const [reg, setReg] = useState('');
  const [name, setName] = useState('');
  const [model, setModel] = useState('');
  const [type, setType] = useState<any>('Commercial Airline');
  const [manufacturer, setManufacturer] = useState('Boeing');
  const [airport, setAirport] = useState('JFK - New York');
  const [hangar, setHangar] = useState('Hangar Alpha-01');
  const [status, setStatus] = useState<AircraftStatus>('Available');
  const [engineHours, setEngineHours] = useState(12000);
  const [flightHours, setFlightHours] = useState(15000);
  const [flightCycles, setFlightCycles] = useState(5500);

  const filteredAircraft = aircraft.filter((ac) => {
    const matchesSearch =
      ac.tailNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ac.model.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ac.operator.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ac.currentAirport.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus = statusFilter === 'All' || ac.status === statusFilter;
    const matchesType = typeFilter === 'All' || ac.type === typeFilter;

    return matchesSearch && matchesStatus && matchesType;
  });

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!tail || !model) return;

    if (editAircraft) {
      updateAircraft(editAircraft.id, {
        tailNumber: tail,
        registrationNumber: reg || tail,
        name,
        model,
        type,
        manufacturer,
        currentAirport: airport,
        hangar,
        status,
        engineHours: Number(engineHours),
        flightHours: Number(flightHours),
        flightCycles: Number(flightCycles)
      });
      setEditAircraft(null);
    } else {
      addAircraft({
        registrationNumber: reg || tail,
        tailNumber: tail,
        name: name || 'Aero Flagship',
        model,
        type,
        manufacturer,
        serialNumber: `${Math.floor(10000 + Math.random() * 90000)}`,
        mfgYear: 2021,
        operator: 'Global Aviation Fleet',
        currentAirport: airport,
        hangar,
        status,
        engineType: 'Turbofan GE/CFM',
        engineHours: Number(engineHours),
        flightHours: Number(flightHours),
        flightCycles: Number(flightCycles),
        landingCycles: Number(flightCycles) - 5,
        weightMaxTakeoffKg: 79000,
        fuelCapacityLiters: 26000,
        passengerCapacity: 180,
        lastMaintenanceDate: new Date().toISOString().slice(0, 10),
        nextMaintenanceDate: new Date(Date.now() + 86400000 * 30).toISOString().slice(0, 10),
        registrationExpiry: '2029-12-31',
        warrantyExpiry: '2027-12-31',
        photoUrl: 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?auto=format&fit=crop&w=800&q=80'
      });
    }

    setShowAddForm(false);
    resetForm();
  };

  const startEdit = (ac: Aircraft) => {
    setEditAircraft(ac);
    setTail(ac.tailNumber);
    setReg(ac.registrationNumber);
    setName(ac.name);
    setModel(ac.model);
    setType(ac.type);
    setManufacturer(ac.manufacturer);
    setAirport(ac.currentAirport);
    setHangar(ac.hangar);
    setStatus(ac.status);
    setEngineHours(ac.engineHours);
    setFlightHours(ac.flightHours);
    setFlightCycles(ac.flightCycles);
    setShowAddForm(true);
  };

  const resetForm = () => {
    setTail('');
    setReg('');
    setName('');
    setModel('');
    setEditAircraft(null);
  };

  return (
    <div className="p-6 space-y-6">
      {/* Top Header & Actions */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-black text-slate-900 dark:text-white flex items-center gap-2">
            <Plane className="w-6 h-6 text-blue-600" /> Aircraft Fleet Management
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Real-time tracking of tail registrations, flight hours, engine cycles, and hangar locations.
          </p>
        </div>

        <button
          onClick={() => {
            resetForm();
            setShowAddForm(true);
          }}
          className="px-4 py-2 text-xs font-bold text-white bg-blue-600 hover:bg-blue-500 rounded-xl shadow-md transition flex items-center gap-2"
        >
          <Plus className="w-4 h-4" /> Register New Aircraft
        </button>
      </div>

      {/* Filters Bar */}
      <div className="flex flex-wrap items-center gap-3 p-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm text-xs font-medium">
        <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400">
          <Filter className="w-4 h-4" /> Filter Status:
        </div>
        {['All', 'Available', 'In Maintenance', 'Grounded (AOG)', 'Inspection Due'].map((s) => (
          <button
            key={s}
            onClick={() => setStatusFilter(s)}
            className={`px-3 py-1.5 rounded-xl transition ${
              statusFilter === s
                ? 'bg-blue-600 text-white font-bold'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
            }`}
          >
            {s}
          </button>
        ))}

        <div className="ml-auto flex items-center gap-2">
          <span className="text-slate-400">Type:</span>
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
          >
            <option value="All">All Categories</option>
            <option value="Commercial Airline">Commercial Airline</option>
            <option value="Cargo">Cargo</option>
            <option value="Military">Military</option>
            <option value="Business Jet">Business Jet</option>
          </select>
        </div>
      </div>

      {/* Fleet Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredAircraft.map((ac) => (
          <div
            key={ac.id}
            className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm hover:shadow-md transition overflow-hidden flex flex-col group"
          >
            {/* Image & Status Badge Header */}
            <div className="relative h-44 bg-slate-800 overflow-hidden">
              <img
                src={ac.photoUrl}
                alt={ac.model}
                className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent" />

              {/* Status Badge */}
              <div className="absolute top-3 left-3">
                <span
                  className={`px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-wider shadow-md ${
                    ac.status === 'Available'
                      ? 'bg-emerald-500 text-white'
                      : ac.status === 'In Maintenance'
                      ? 'bg-blue-600 text-white'
                      : ac.status === 'Grounded (AOG)'
                      ? 'bg-rose-600 text-white animate-pulse'
                      : 'bg-amber-500 text-slate-900'
                  }`}
                >
                  {ac.status}
                </span>
              </div>

              {/* QR Code Action */}
              <button
                onClick={() => setQrModalAircraft(ac)}
                className="absolute top-3 right-3 p-2 bg-slate-900/80 hover:bg-slate-900 text-white rounded-xl backdrop-blur-sm transition"
                title="View QR Code Asset Tag"
              >
                <QrCode className="w-4 h-4" />
              </button>

              {/* Tail & Model Overlay */}
              <div className="absolute bottom-3 left-3 right-3 text-white">
                <div className="text-xl font-black font-mono tracking-wider">{ac.tailNumber}</div>
                <div className="text-xs text-slate-300 font-semibold">{ac.model} • {ac.name}</div>
              </div>
            </div>

            {/* Spec Details Body */}
            <div className="p-5 flex-1 space-y-4">
              <div className="grid grid-cols-2 gap-3 text-xs bg-slate-50 dark:bg-slate-800/60 p-3 rounded-xl border border-slate-100 dark:border-slate-800">
                <div>
                  <div className="text-[10px] text-slate-400 font-bold uppercase">Flight Hours</div>
                  <div className="font-mono font-bold text-slate-900 dark:text-white flex items-center gap-1 mt-0.5">
                    <Clock className="w-3.5 h-3.5 text-blue-500" />
                    {ac.flightHours.toLocaleString()} hrs
                  </div>
                </div>
                <div>
                  <div className="text-[10px] text-slate-400 font-bold uppercase">Engine Cycles</div>
                  <div className="font-mono font-bold text-slate-900 dark:text-white flex items-center gap-1 mt-0.5">
                    <Gauge className="w-3.5 h-3.5 text-indigo-500" />
                    {ac.flightCycles.toLocaleString()} FC
                  </div>
                </div>
              </div>

              <div className="space-y-1.5 text-xs text-slate-600 dark:text-slate-300">
                <div className="flex items-center gap-2">
                  <MapPin className="w-3.5 h-3.5 text-slate-400" />
                  <span>Location: <strong>{ac.currentAirport}</strong> ({ac.hangar})</span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="w-3.5 h-3.5 text-slate-400" />
                  <span>Next Maintenance: <strong>{ac.nextMaintenanceDate}</strong></span>
                </div>
              </div>
            </div>

            {/* Footer Actions */}
            <div className="p-3 bg-slate-50 dark:bg-slate-800/40 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
              <button
                onClick={() => setSelectedAircraft(ac)}
                className="text-xs font-bold text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1"
              >
                Inspect Maintenance Log <ChevronRight className="w-3.5 h-3.5" />
              </button>

              <div className="flex items-center gap-1">
                <button
                  onClick={() => startEdit(ac)}
                  className="p-1.5 text-slate-400 hover:text-blue-600 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-700 transition"
                >
                  <Edit className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => deleteAircraft(ac.id)}
                  className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-rose-50 dark:hover:bg-rose-950/30 transition"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Aircraft Detail Modal */}
      {selectedAircraft && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden flex flex-col">
            <div className="flex items-center justify-between p-5 border-b border-slate-100 dark:border-slate-800 bg-slate-900 text-white">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-blue-600 text-white font-mono font-bold text-base">
                  {selectedAircraft.tailNumber}
                </div>
                <div>
                  <h3 className="font-bold text-base">{selectedAircraft.model} ({selectedAircraft.name})</h3>
                  <p className="text-xs text-slate-300">Serial #{selectedAircraft.serialNumber} • Operator: {selectedAircraft.operator}</p>
                </div>
              </div>
              <button onClick={() => setSelectedAircraft(null)} className="p-1 text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 overflow-y-auto space-y-6 text-xs">
              <div className="grid grid-cols-3 gap-3 p-4 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200 dark:border-slate-700 text-center">
                <div>
                  <div className="text-slate-400 uppercase font-bold text-[10px]">Total Flight Hours</div>
                  <div className="text-base font-mono font-black text-slate-900 dark:text-white">{selectedAircraft.flightHours.toLocaleString()}</div>
                </div>
                <div>
                  <div className="text-slate-400 uppercase font-bold text-[10px]">Flight Cycles</div>
                  <div className="text-base font-mono font-black text-slate-900 dark:text-white">{selectedAircraft.flightCycles.toLocaleString()}</div>
                </div>
                <div>
                  <div className="text-slate-400 uppercase font-bold text-[10px]">Engine Hours ({selectedAircraft.engineType})</div>
                  <div className="text-base font-mono font-black text-slate-900 dark:text-white">{selectedAircraft.engineHours.toLocaleString()}</div>
                </div>
              </div>

              <div className="space-y-2">
                <h4 className="font-bold text-slate-900 dark:text-white uppercase tracking-wider text-[11px]">System Specifications</h4>
                <div className="grid grid-cols-2 gap-2 text-slate-700 dark:text-slate-300">
                  <div className="p-2.5 bg-slate-50 dark:bg-slate-800/40 rounded-lg">Max Takeoff Weight: <strong>{selectedAircraft.weightMaxTakeoffKg.toLocaleString()} kg</strong></div>
                  <div className="p-2.5 bg-slate-50 dark:bg-slate-800/40 rounded-lg">Fuel Capacity: <strong>{selectedAircraft.fuelCapacityLiters.toLocaleString()} L</strong></div>
                  <div className="p-2.5 bg-slate-50 dark:bg-slate-800/40 rounded-lg">Passenger Capacity: <strong>{selectedAircraft.passengerCapacity} seats</strong></div>
                  <div className="p-2.5 bg-slate-50 dark:bg-slate-800/40 rounded-lg">Airport / Hangar: <strong>{selectedAircraft.currentAirport} ({selectedAircraft.hangar})</strong></div>
                </div>
              </div>
            </div>

            <div className="p-4 border-t border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 flex justify-end">
              <button
                onClick={() => setSelectedAircraft(null)}
                className="px-4 py-2 text-xs font-semibold text-slate-700 dark:text-slate-300 bg-slate-200 dark:bg-slate-700 rounded-lg"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* QR Code Asset Tag Modal */}
      {qrModalAircraft && (
        <QRCodeModal
          isOpen={!!qrModalAircraft}
          onClose={() => setQrModalAircraft(null)}
          title={`Aircraft QR Tag: ${qrModalAircraft.tailNumber}`}
          codeValue={qrModalAircraft.tailNumber}
          subtitle={`${qrModalAircraft.model} • ${qrModalAircraft.currentAirport}`}
          type="aircraft"
        />
      )}

      {/* Add / Edit Aircraft Modal */}
      {showAddForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl max-w-lg w-full p-6 space-y-4">
            <div className="flex justify-between items-center border-b pb-3 dark:border-slate-800">
              <h3 className="font-bold text-base text-slate-900 dark:text-white">
                {editAircraft ? 'Edit Aircraft Specifications' : 'Register Aircraft in Fleet'}
              </h3>
              <button onClick={() => setShowAddForm(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateSubmit} className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Tail Number *</label>
                  <input
                    type="text"
                    required
                    value={tail}
                    onChange={(e) => setTail(e.target.value)}
                    placeholder="e.g. N738GA"
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-mono"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Model *</label>
                  <input
                    type="text"
                    required
                    value={model}
                    onChange={(e) => setModel(e.target.value)}
                    placeholder="e.g. Boeing 737-800"
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Status</label>
                  <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                  >
                    <option value="Available">Available</option>
                    <option value="In Maintenance">In Maintenance</option>
                    <option value="Grounded (AOG)">Grounded (AOG)</option>
                    <option value="Inspection Due">Inspection Due</option>
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Current Airport</label>
                  <input
                    type="text"
                    value={airport}
                    onChange={(e) => setAirport(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowAddForm(false)}
                  className="px-4 py-2 font-semibold text-slate-600 dark:text-slate-400 hover:bg-slate-100 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 font-semibold text-white bg-blue-600 hover:bg-blue-500 rounded-lg shadow-sm"
                >
                  Save Aircraft
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
