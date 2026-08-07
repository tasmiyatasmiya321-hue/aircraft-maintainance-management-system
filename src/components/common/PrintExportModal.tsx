import React from 'react';
import { Printer, Download, X, Plane, FileText, CheckCircle, ShieldCheck } from 'lucide-react';

interface PrintExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  documentData: any;
  documentType: 'WorkOrder' | 'Inspection' | 'FleetReport' | 'InventoryReport';
}

export const PrintExportModal: React.FC<PrintExportModalProps> = ({
  isOpen,
  onClose,
  title,
  documentData,
  documentType
}) => {
  if (!isOpen || !documentData) return null;

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadCSV = () => {
    const keys = Object.keys(documentData);
    const csvContent = "data:text/csv;charset=utf-8," 
      + keys.join(",") + "\n"
      + keys.map(k => `"${documentData[k] || ''}"`).join(",");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `${title.replace(/\s+/g, '_')}_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/70 backdrop-blur-sm p-4 print:p-0 print:bg-white print:fixed print:inset-0">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-hidden flex flex-col print:border-none print:shadow-none print:max-w-none print:w-full print:h-full print:bg-white text-slate-900">
        
        {/* Header - Hidden on Print */}
        <div className="flex items-center justify-between p-4 border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 print:hidden">
          <div className="flex items-center gap-2">
            <FileText className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            <h3 className="font-bold text-slate-900 dark:text-white text-base">{title}</h3>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handleDownloadCSV}
              className="px-3 py-1.5 text-xs font-semibold text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-lg transition flex items-center gap-1.5"
            >
              <Download className="w-3.5 h-3.5" />
              Export CSV
            </button>
            <button
              onClick={handlePrint}
              className="px-3 py-1.5 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-500 rounded-lg transition flex items-center gap-1.5 shadow-sm"
            >
              <Printer className="w-3.5 h-3.5" />
              Print PDF
            </button>
            <button onClick={onClose} className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 ml-2">
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Official Printable Sheet Container */}
        <div className="p-8 overflow-y-auto space-y-6 bg-white text-slate-900 print:p-8">
          {/* Company & Regulatory Header */}
          <div className="flex justify-between items-start border-b-2 border-slate-900 pb-4">
            <div>
              <div className="flex items-center gap-2 font-black text-xl text-slate-900 tracking-wider">
                <Plane className="w-6 h-6 text-blue-800 fill-blue-800" />
                SKYWISE AMMS ENTERPRISE
              </div>
              <div className="text-xs text-slate-600 font-medium mt-0.5">
                Aircraft Maintenance Management & Airworthiness Organization
              </div>
              <div className="text-[11px] text-slate-500 font-mono">
                FAA Part 145 Cert # AMMS-MRO-881920 • EASA Part-145 # 0092-A
              </div>
            </div>
            <div className="text-right">
              <div className="inline-block px-3 py-1 bg-slate-900 text-white font-mono font-bold text-sm uppercase tracking-widest rounded">
                OFFICIAL RECORD
              </div>
              <div className="text-xs text-slate-600 font-mono mt-1">
                Ref: {documentData.workOrderNumber || documentData.inspectionNumber || documentData.registrationNumber || 'AMMS-DOC-2026'}
              </div>
              <div className="text-[11px] text-slate-500">
                Date: {new Date().toLocaleDateString()}
              </div>
            </div>
          </div>

          {/* Render based on Document Type */}
          {documentType === 'WorkOrder' && (
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4 p-4 bg-slate-50 rounded-xl border border-slate-200">
                <div>
                  <div className="text-xs font-bold text-slate-500 uppercase">AIRCRAFT TAIL / MODEL</div>
                  <div className="text-base font-extrabold text-slate-900">{documentData.aircraftTailNumber} ({documentData.aircraftModel})</div>
                </div>
                <div>
                  <div className="text-xs font-bold text-slate-500 uppercase">WORK ORDER NUMBER</div>
                  <div className="text-base font-mono font-bold text-slate-900">{documentData.workOrderNumber}</div>
                </div>
                <div>
                  <div className="text-xs font-bold text-slate-500 uppercase">CATEGORY / PRIORITY</div>
                  <div className="text-sm font-bold text-slate-900">{documentData.type} • {documentData.priority}</div>
                </div>
                <div>
                  <div className="text-xs font-bold text-slate-500 uppercase">DEPARTMENT</div>
                  <div className="text-sm font-semibold text-slate-900">{documentData.department}</div>
                </div>
              </div>

              <div>
                <h4 className="font-bold text-sm text-slate-900 border-b border-slate-300 pb-1 mb-2">MAINTENANCE TASK DESCRIPTION</h4>
                <div className="text-sm text-slate-800 font-medium">{documentData.title}</div>
                <p className="text-xs text-slate-600 mt-1">{documentData.description}</p>
              </div>

              <div className="grid grid-cols-3 gap-4 border-t border-slate-200 pt-3 text-xs">
                <div>
                  <span className="font-bold text-slate-600">Assigned Engineer:</span> {documentData.assignedEngineerName || 'Unassigned'}
                </div>
                <div>
                  <span className="font-bold text-slate-600">Est. Hours:</span> {documentData.estimatedHours} hrs
                </div>
                <div>
                  <span className="font-bold text-slate-600">Status:</span> {documentData.status}
                </div>
              </div>

              {/* Signatures Block */}
              <div className="pt-8 border-t-2 border-slate-300 grid grid-cols-2 gap-8">
                <div className="border-t border-slate-400 pt-2 text-center">
                  <div className="font-semibold text-xs text-slate-800">{documentData.assignedEngineerName || 'Lead Technician'}</div>
                  <div className="text-[10px] text-slate-500 uppercase">Engineering Authorization Signature</div>
                </div>
                <div className="border-t border-slate-400 pt-2 text-center">
                  <div className="font-semibold text-xs text-slate-800">{documentData.signedBy || 'Quality Airworthiness Inspector'}</div>
                  <div className="text-[10px] text-slate-500 uppercase">Inspector Sign-off & Release to Service</div>
                </div>
              </div>
            </div>
          )}

          {documentType === 'Inspection' && (
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4 p-4 bg-slate-50 rounded-xl border border-slate-200">
                <div>
                  <div className="text-xs font-bold text-slate-500 uppercase">INSPECTION TYPE</div>
                  <div className="text-base font-extrabold text-slate-900">{documentData.type}</div>
                </div>
                <div>
                  <div className="text-xs font-bold text-slate-500 uppercase">AIRCRAFT TAIL</div>
                  <div className="text-base font-bold text-slate-900">{documentData.aircraftTailNumber}</div>
                </div>
              </div>

              <div>
                <h4 className="font-bold text-sm text-slate-900 border-b border-slate-300 pb-1 mb-2">INSPECTION AUDIT CHECKLIST</h4>
                <table className="w-full text-xs text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-100 border-b border-slate-300 text-slate-700">
                      <th className="p-2 font-bold">Category</th>
                      <th className="p-2 font-bold">Check Task</th>
                      <th className="p-2 font-bold text-center">Result</th>
                    </tr>
                  </thead>
                  <tbody>
                    {documentData.checklists?.map((item: any, idx: number) => (
                      <tr key={idx} className="border-b border-slate-200">
                        <td className="p-2 font-medium">{item.category}</td>
                        <td className="p-2">{item.task}</td>
                        <td className="p-2 text-center font-bold">
                          {item.passed ? (
                            <span className="text-emerald-700">PASS</span>
                          ) : (
                            <span className="text-rose-700">FAIL / ATTENTION</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="p-4 bg-emerald-50 border border-emerald-300 rounded-xl flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <ShieldCheck className="w-6 h-6 text-emerald-700" />
                  <div>
                    <div className="font-bold text-xs text-emerald-900">QUALITY INSPECTOR CERTIFICATION</div>
                    <div className="text-xs text-emerald-800">Inspector: {documentData.inspectorName}</div>
                  </div>
                </div>
                <div className="text-xs font-mono font-bold text-emerald-900">
                  PASSED SCORE: {documentData.scorePercentage || 100}%
                </div>
              </div>
            </div>
          )}

          {/* Standard Footer Stamp */}
          <div className="pt-6 border-t border-slate-200 text-center text-[10px] text-slate-500">
            AMMS Enterprise System Generated Document • Security Signature Hash: {Math.random().toString(36).substring(2, 15).toUpperCase()}
          </div>
        </div>
      </div>
    </div>
  );
};
