import React, { useState } from 'react';
import { useAMMS } from '../../context/AMMSContext';
import { FileText, Download, Eye, Tag, UploadCloud, Folder, Plus, CheckCircle2, Search } from 'lucide-react';

export const DocumentsView: React.FC = () => {
  const { documents, addDocument, searchQuery } = useAMMS();
  const [dragActive, setDragActive] = useState(false);
  const [selectedDoc, setSelectedDoc] = useState<any | null>(null);

  const filtered = documents.filter(d =>
    d.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    d.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
    d.tags.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const handleSimulatedUpload = () => {
    addDocument({
      title: 'Airbus A320neo Engine Nacelle Manual AMM Ch 71-00',
      category: 'Aircraft Manual',
      fileType: 'PDF',
      fileSize: '8.4 MB',
      uploadedBy: 'Active Line Engineer',
      uploadDate: new Date().toISOString().slice(0, 10),
      version: 'v2.1',
      relatedAircraftTail: 'N320NE',
      tags: ['A320neo', 'Nacelle', 'AMM']
    });
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-black text-slate-900 dark:text-white flex items-center gap-2">
            <FileText className="w-6 h-6 text-blue-600" /> Compliance & Manuals Library
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Store Aircraft Maintenance Manuals (AMM), Airworthiness Certificates, Schematics, and Invoices.
          </p>
        </div>

        <button
          onClick={handleSimulatedUpload}
          className="px-4 py-2 text-xs font-bold text-white bg-blue-600 hover:bg-blue-500 rounded-xl shadow-md transition flex items-center gap-2"
        >
          <UploadCloud className="w-4 h-4" /> Upload Document
        </button>
      </div>

      {/* Drag and Drop Zone */}
      <div
        onDragOver={(e) => { e.preventDefault(); setDragActive(true); }}
        onDragLeave={() => setDragActive(false)}
        onDrop={(e) => { e.preventDefault(); setDragActive(false); handleSimulatedUpload(); }}
        className={`p-8 border-2 border-dashed rounded-2xl text-center transition ${
          dragActive
            ? 'border-blue-500 bg-blue-50/50 dark:bg-blue-950/20'
            : 'border-slate-300 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/40'
        }`}
      >
        <UploadCloud className="w-10 h-10 text-blue-500 mx-auto mb-2" />
        <h3 className="text-sm font-bold text-slate-900 dark:text-white">Drag & drop technical documents here</h3>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Supports AMM PDFs, CAD schematics, XLS maintenance logs, and Airworthiness certs</p>
      </div>

      {/* Document Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {filtered.map((doc) => (
          <div key={doc.id} className="p-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm space-y-3 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="px-2 py-0.5 text-[10px] font-mono font-bold bg-blue-50 dark:bg-blue-950 text-blue-600 rounded">
                  {doc.fileType} • {doc.fileSize}
                </span>
                <span className="text-[10px] font-bold text-slate-400">{doc.version}</span>
              </div>

              <h3 className="font-bold text-slate-900 dark:text-white text-sm leading-snug">{doc.title}</h3>
              <div className="text-xs text-slate-500 mt-1">Category: {doc.category}</div>
            </div>

            <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
              <div className="flex gap-1">
                {doc.tags.map((t, i) => (
                  <span key={i} className="px-2 py-0.5 text-[10px] bg-slate-100 dark:bg-slate-800 text-slate-600 rounded">
                    #{t}
                  </span>
                ))}
              </div>

              <button
                onClick={() => setSelectedDoc(doc)}
                className="p-1.5 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-950/50 rounded-lg transition"
              >
                <Eye className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
