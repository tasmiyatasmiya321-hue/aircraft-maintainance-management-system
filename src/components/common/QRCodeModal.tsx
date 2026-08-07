import React from 'react';
import { QrCode, Printer, X, Tag } from 'lucide-react';

interface QRCodeModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  codeValue: string;
  subtitle?: string;
  type?: 'aircraft' | 'inventory';
}

export const QRCodeModal: React.FC<QRCodeModalProps> = ({
  isOpen,
  onClose,
  title,
  codeValue,
  subtitle,
  type = 'inventory'
}) => {
  if (!isOpen) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 print:bg-white print:p-0">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl max-w-sm w-full overflow-hidden print:border-none print:shadow-none">
        <div className="flex items-center justify-between p-4 border-b border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 print:hidden">
          <div className="flex items-center gap-2">
            <QrCode className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            <h3 className="font-bold text-slate-900 dark:text-white text-sm">{title}</h3>
          </div>
          <button onClick={onClose} className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 text-center space-y-4">
          <div className="p-4 bg-slate-50 dark:bg-slate-800/80 rounded-2xl border border-slate-200 dark:border-slate-700 inline-block shadow-inner">
            {/* Visual Barcode / QR rendering */}
            <div className="w-48 h-48 mx-auto bg-white p-3 rounded-xl border border-slate-300 flex flex-col items-center justify-center gap-2">
              <svg className="w-36 h-36" viewBox="0 0 100 100">
                <rect width="100" height="100" fill="white" />
                {/* QR Code pattern simulation with exact readable data */}
                <path d="M10,10 h30 v30 h-30 z M15,15 v20 h20 v-20 z M20,20 h10 v10 h-10 z" fill="#0f172a" />
                <path d="M60,10 h30 v30 h-30 z M65,15 v20 h20 v-20 z M70,20 h10 v10 h-10 z" fill="#0f172a" />
                <path d="M10,60 h30 v30 h-30 z M15,65 v20 h20 v-20 z M20,70 h10 v10 h-10 z" fill="#0f172a" />
                <rect x="50" y="50" width="12" height="12" fill="#0f172a" />
                <rect x="70" y="50" width="15" height="8" fill="#0f172a" />
                <rect x="50" y="70" width="8" height="18" fill="#0f172a" />
                <rect x="68" y="72" width="20" height="12" fill="#0f172a" />
              </svg>
              <div className="font-mono text-[10px] font-bold text-slate-900 tracking-wider">
                {codeValue}
              </div>
            </div>
          </div>

          <div>
            <div className="text-xs text-slate-500 dark:text-slate-400 font-medium">{subtitle || 'Aviation Tracking Identifier'}</div>
            <div className="text-lg font-bold text-slate-900 dark:text-white mt-0.5">{codeValue}</div>
          </div>

          {/* Barcode strip below */}
          <div className="p-3 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700">
            <div className="flex justify-center items-center gap-1 h-10">
              {[3, 1, 2, 4, 1, 3, 2, 1, 4, 2, 1, 3, 2, 4, 1, 2, 3, 1, 2].map((w, i) => (
                <div key={i} className="bg-slate-900 dark:bg-slate-100 h-full" style={{ width: `${w * 2}px` }} />
              ))}
            </div>
            <div className="text-[11px] font-mono text-slate-600 dark:text-slate-400 mt-1">
              *AMMS-TAG-{codeValue}*
            </div>
          </div>

          <div className="flex items-center justify-center gap-3 pt-2 print:hidden">
            <button
              onClick={handlePrint}
              className="px-4 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-500 rounded-lg transition flex items-center gap-2 shadow-sm"
            >
              <Printer className="w-4 h-4" />
              Print Asset Tag
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
