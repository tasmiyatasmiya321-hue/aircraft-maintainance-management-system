import React, { useState } from 'react';
import { useAMMS } from '../../context/AMMSContext';
import { Employee } from '../../types';
import { Users, Shield, Award, Calendar, Phone, Mail, Plus, CheckCircle2, AlertTriangle, X } from 'lucide-react';

export const EmployeesView: React.FC = () => {
  const { employees, addEmployee, searchQuery } = useAMMS();
  const [showModal, setShowModal] = useState(false);
  const [name, setName] = useState('');
  const [role, setRole] = useState<any>('Engineer');
  const [department, setDepartment] = useState('Powerplant Engine MRO');
  const [license, setLicense] = useState('FAA-A&P-90123');

  const filtered = employees.filter(e =>
    e.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    e.role.toLowerCase().includes(searchQuery.toLowerCase()) ||
    e.department.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name) return;
    addEmployee({
      name,
      email: `${name.toLowerCase().replace(/\s+/g, '.')}@amms-aviation.com`,
      phone: '+1 (555) 019-8821',
      role,
      department,
      licenseNumber: license,
      licenseExpiry: '2029-12-31',
      skills: ['A&P Certified', 'B737-800', 'A320neo'],
      status: 'Available',
      assignedTasksCount: 0,
      hireDate: new Date().toISOString().slice(0, 10)
    });
    setShowModal(false);
    setName('');
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-black text-slate-900 dark:text-white flex items-center gap-2">
            <Users className="w-6 h-6 text-purple-600" /> Engineers & Staff Roster
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Manage A&P certified technicians, quality inspectors, department assignments, and license expiry alerts.
          </p>
        </div>

        <button
          onClick={() => setShowModal(true)}
          className="px-4 py-2 text-xs font-bold text-white bg-purple-600 hover:bg-purple-500 rounded-xl shadow-md transition flex items-center gap-2"
        >
          <Plus className="w-4 h-4" /> Add Staff Member
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.map((emp) => (
          <div key={emp.id} className="p-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm space-y-3">
            <div className="flex items-center justify-between">
              <span className="font-mono font-bold text-xs text-purple-600 dark:text-purple-400">{emp.employeeCode}</span>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase bg-purple-50 text-purple-700 dark:bg-purple-950/50 dark:text-purple-300">
                {emp.role}
              </span>
            </div>

            <div>
              <h3 className="font-bold text-slate-900 dark:text-white text-base">{emp.name}</h3>
              <div className="text-xs text-slate-500">{emp.department}</div>
            </div>

            <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl text-xs space-y-1">
              <div className="flex items-center gap-1.5 font-mono font-bold text-slate-800 dark:text-slate-200">
                <Award className="w-3.5 h-3.5 text-amber-500" /> License: {emp.licenseNumber}
              </div>
              <div className="text-slate-500">Expiry: {emp.licenseExpiry}</div>
            </div>

            <div className="flex flex-wrap gap-1 pt-1">
              {emp.skills.map((s, idx) => (
                <span key={idx} className="px-2 py-0.5 text-[10px] bg-slate-100 dark:bg-slate-800 rounded text-slate-600 dark:text-slate-300">
                  {s}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl max-w-md w-full p-6 space-y-4">
            <div className="flex justify-between items-center border-b pb-3 dark:border-slate-800">
              <h3 className="font-bold text-sm text-slate-900 dark:text-white">Register Staff Personnel</h3>
              <button onClick={() => setShowModal(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold mb-1">Full Name *</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Robert Vance"
                  className="w-full px-3 py-2 rounded-lg border dark:border-slate-700 bg-white dark:bg-slate-800"
                />
              </div>

              <div>
                <label className="block font-semibold mb-1">Role *</label>
                <select
                  value={role}
                  onChange={(e) => setRole(e.target.value as any)}
                  className="w-full px-3 py-2 rounded-lg border dark:border-slate-700 bg-white dark:bg-slate-800"
                >
                  <option value="Engineer">Engineer</option>
                  <option value="Technician">Technician</option>
                  <option value="Quality Inspector">Quality Inspector</option>
                  <option value="Store Manager">Store Manager</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold mb-1">FAA / EASA License Number</label>
                <input
                  type="text"
                  value={license}
                  onChange={(e) => setLicense(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border dark:border-slate-700 bg-white dark:bg-slate-800 font-mono"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 font-semibold text-slate-600 dark:text-slate-400"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 font-semibold text-white bg-purple-600 hover:bg-purple-500 rounded-lg"
                >
                  Save Personnel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
