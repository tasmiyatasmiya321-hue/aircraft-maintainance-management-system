import React from 'react';
import { useAMMS } from '../../context/AMMSContext';
import { Truck, Star, Phone, Mail, FileText, ShoppingCart } from 'lucide-react';

export const SuppliersView: React.FC = () => {
  const { suppliers, purchaseOrders } = useAMMS();

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-xl font-black text-slate-900 dark:text-white flex items-center gap-2">
          <Truck className="w-6 h-6 text-indigo-600" /> Suppliers & Purchase Management
        </h1>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
          Approved aviation OEM vendors, parts procurement, and Purchase Order tracking.
        </p>
      </div>

      {/* Suppliers Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {suppliers.map((sup) => (
          <div key={sup.id} className="p-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-400 uppercase">{sup.country}</span>
              <div className="flex items-center gap-1 text-xs font-bold text-amber-500">
                <Star className="w-3.5 h-3.5 fill-amber-500" /> {sup.rating}
              </div>
            </div>

            <h3 className="font-bold text-slate-900 dark:text-white text-base">{sup.companyName}</h3>
            <div className="text-xs text-slate-500">{sup.category}</div>

            <div className="pt-2 border-t border-slate-100 dark:border-slate-800 text-xs space-y-1 text-slate-600 dark:text-slate-300">
              <div className="flex items-center gap-2"><Mail className="w-3.5 h-3.5 text-slate-400" /> {sup.email}</div>
              <div className="flex items-center gap-2"><Phone className="w-3.5 h-3.5 text-slate-400" /> {sup.phone}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Active Purchase Orders Table */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm space-y-3">
        <h3 className="font-bold text-slate-900 dark:text-white text-sm flex items-center gap-2">
          <ShoppingCart className="w-4 h-4 text-blue-600" /> Active Purchase Orders (POs)
        </h3>
        <table className="w-full text-left text-xs">
          <thead>
            <tr className="border-b text-slate-400 uppercase font-semibold">
              <th className="py-2.5 px-3">PO #</th>
              <th className="py-2.5 px-3">Supplier</th>
              <th className="py-2.5 px-3">Date</th>
              <th className="py-2.5 px-3">Amount</th>
              <th className="py-2.5 px-3">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y font-medium">
            {purchaseOrders.map((po) => (
              <tr key={po.id}>
                <td className="py-2.5 px-3 font-mono font-bold text-blue-600">{po.poNumber}</td>
                <td className="py-2.5 px-3 font-bold text-slate-900 dark:text-white">{po.supplierName}</td>
                <td className="py-2.5 px-3 text-slate-500">{po.createdDate}</td>
                <td className="py-2.5 px-3 font-mono font-bold">${po.totalAmountUSD.toLocaleString()}</td>
                <td className="py-2.5 px-3 font-bold text-blue-600">{po.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
