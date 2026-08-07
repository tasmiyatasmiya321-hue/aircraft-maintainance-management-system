import React, { useState } from 'react';
import { useAMMS } from '../../context/AMMSContext';
import { InventoryItem } from '../../types';
import { QRCodeModal } from '../common/QRCodeModal';
import { Package, Search, Filter, Plus, QrCode, AlertTriangle, ArrowUpRight, CheckCircle2, DollarSign, X } from 'lucide-react';

export const InventoryView: React.FC = () => {
  const { inventory, addInventoryItem, updateInventoryItem, issuePartToWorkOrder, workOrders, searchQuery } = useAMMS();
  const [qrItem, setQrItem] = useState<InventoryItem | null>(null);
  const [issueItem, setIssueItem] = useState<InventoryItem | null>(null);
  const [issueQty, setIssueQty] = useState(1);
  const [selectedWOId, setSelectedWOId] = useState('');

  const filtered = inventory.filter(i =>
    i.partName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    i.partNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
    i.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
    i.locationRack.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleIssueSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!issueItem || !selectedWOId) return;
    issuePartToWorkOrder(issueItem.id, Number(issueQty), selectedWOId);
    setIssueItem(null);
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-black text-slate-900 dark:text-white flex items-center gap-2">
            <Package className="w-6 h-6 text-emerald-600" /> Spare Parts & Inventory Control
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Track turbine blades, hydraulic seals, avionics modules, rack/shelf bin locations, and barcode tags.
          </p>
        </div>
      </div>

      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm overflow-hidden">
        <table className="w-full text-left text-xs">
          <thead>
            <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-400 uppercase tracking-wider font-semibold bg-slate-50 dark:bg-slate-800/50">
              <th className="py-3 px-4">Part P/N</th>
              <th className="py-3 px-4">Part Name</th>
              <th className="py-3 px-4">Category</th>
              <th className="py-3 px-4">Location</th>
              <th className="py-3 px-4">Stock Qty</th>
              <th className="py-3 px-4">Unit Price</th>
              <th className="py-3 px-4">Status</th>
              <th className="py-3 px-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 font-medium">
            {filtered.map((item) => (
              <tr key={item.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition">
                <td className="py-3 px-4 font-mono font-bold text-blue-600 dark:text-blue-400">{item.partNumber}</td>
                <td className="py-3 px-4 font-bold text-slate-900 dark:text-white">{item.partName}</td>
                <td className="py-3 px-4 text-slate-500">{item.category}</td>
                <td className="py-3 px-4 text-slate-600 font-mono">{item.locationRack} / {item.locationShelf}</td>
                <td className="py-3 px-4 font-mono font-bold">
                  {item.stockQuantity} <span className="text-[10px] text-slate-400">(Min {item.minStockThreshold})</span>
                </td>
                <td className="py-3 px-4 font-mono font-bold text-slate-900 dark:text-white">${item.unitPriceUSD.toLocaleString()}</td>
                <td className="py-3 px-4">
                  <span
                    className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      item.status === 'In Stock'
                        ? 'bg-emerald-500/20 text-emerald-600 dark:text-emerald-400'
                        : 'bg-rose-500/20 text-rose-600 dark:text-rose-400'
                    }`}
                  >
                    {item.status}
                  </span>
                </td>
                <td className="py-3 px-4 text-right">
                  <div className="flex items-center justify-end gap-2">
                    <button
                      onClick={() => setIssueItem(item)}
                      className="px-2.5 py-1 text-[11px] font-bold text-white bg-blue-600 hover:bg-blue-500 rounded"
                    >
                      Issue Part
                    </button>
                    <button onClick={() => setQrItem(item)} className="p-1 text-slate-400 hover:text-slate-800 dark:hover:text-white">
                      <QrCode className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* QR Code Asset Tag Modal */}
      {qrItem && (
        <QRCodeModal
          isOpen={!!qrItem}
          onClose={() => setQrItem(null)}
          title={`Part Barcode Tag: ${qrItem.partNumber}`}
          codeValue={qrItem.partNumber}
          subtitle={`${qrItem.partName} • ${qrItem.locationRack}`}
          type="inventory"
        />
      )}

      {/* Issue Part Modal */}
      {issueItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl max-w-md w-full p-6 space-y-4">
            <div className="flex justify-between items-center border-b pb-3 dark:border-slate-800">
              <h3 className="font-bold text-sm text-slate-900 dark:text-white">Issue Spare Part to Work Order</h3>
              <button onClick={() => setIssueItem(null)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleIssueSubmit} className="space-y-3 text-xs">
              <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded-xl">
                <div className="font-bold text-slate-900 dark:text-white">{issueItem.partName}</div>
                <div className="text-slate-500">P/N: {issueItem.partNumber} • Stock Available: {issueItem.stockQuantity}</div>
              </div>

              <div>
                <label className="block font-semibold mb-1">Target Work Order *</label>
                <select
                  required
                  value={selectedWOId}
                  onChange={(e) => setSelectedWOId(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border dark:border-slate-700 bg-white dark:bg-slate-800"
                >
                  <option value="">Select Active Work Order...</option>
                  {workOrders.filter(w => w.status !== 'Closed').map(w => (
                    <option key={w.id} value={w.workOrderNumber}>{w.workOrderNumber} - {w.aircraftTailNumber} ({w.title})</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-semibold mb-1">Quantity to Issue *</label>
                <input
                  type="number"
                  min={1}
                  max={issueItem.stockQuantity}
                  value={issueQty}
                  onChange={(e) => setIssueQty(Number(e.target.value))}
                  className="w-full px-3 py-2 rounded-lg border dark:border-slate-700 bg-white dark:bg-slate-800"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setIssueItem(null)}
                  className="px-4 py-2 font-semibold text-slate-600 dark:text-slate-400"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 font-semibold text-white bg-blue-600 hover:bg-blue-500 rounded-lg"
                >
                  Confirm Issue
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
