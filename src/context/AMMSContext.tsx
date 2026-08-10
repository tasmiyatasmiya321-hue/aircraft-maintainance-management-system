import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  Aircraft,
  WorkOrder,
  Inspection,
  Defect,
  InventoryItem,
  Supplier,
  PurchaseOrder,
  Employee,
  DocumentItem,
  AuditLog,
  SystemNotification
} from '../types';
import {
  INITIAL_AIRCRAFT,
  INITIAL_WORK_ORDERS,
  INITIAL_DEFECTS,
  INITIAL_INSPECTIONS,
  INITIAL_INVENTORY,
  INITIAL_SUPPLIERS,
  INITIAL_PURCHASE_ORDERS,
  INITIAL_EMPLOYEES,
  INITIAL_DOCUMENTS,
  INITIAL_AUDIT_LOGS,
  INITIAL_NOTIFICATIONS
} from '../data/mockData';

interface AMMSContextType {
  aircraft: Aircraft[];
  workOrders: WorkOrder[];
  defects: Defect[];
  inspections: Inspection[];
  inventory: InventoryItem[];
  suppliers: Supplier[];
  purchaseOrders: PurchaseOrder[];
  employees: Employee[];
  documents: DocumentItem[];
  auditLogs: AuditLog[];
  notifications: SystemNotification[];
  
  // UI & Global state
  darkMode: boolean;
  toggleDarkMode: () => void;
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  activeModule: string;
  setActiveModule: (module: string) => void;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  
  // Quick Actions & Modals
  quickActionModal: string | null;
  setQuickActionModal: (modalName: string | null) => void;
  
  // CRUD Actions
  addAircraft: (item: Omit<Aircraft, 'id'>) => void;
  updateAircraft: (id: string, updated: Partial<Aircraft>) => void;
  deleteAircraft: (id: string) => void;
  
  addWorkOrder: (item: Omit<WorkOrder, 'id' | 'workOrderNumber' | 'createdDate'>) => void;
  updateWorkOrder: (id: string, updated: Partial<WorkOrder>) => void;
  deleteWorkOrder: (id: string) => void;
  
  addDefect: (item: Omit<Defect, 'id' | 'defectNumber' | 'reportedDate'>) => void;
  updateDefect: (id: string, updated: Partial<Defect>) => void;
  
  addInspection: (item: Omit<Inspection, 'id' | 'inspectionNumber'>) => void;
  updateInspection: (id: string, updated: Partial<Inspection>) => void;
  
  addInventoryItem: (item: Omit<InventoryItem, 'id'>) => void;
  updateInventoryItem: (id: string, updated: Partial<InventoryItem>) => void;
  issuePartToWorkOrder: (partId: string, quantity: number, workOrderId: string) => void;
  
  addPurchaseOrder: (item: Omit<PurchaseOrder, 'id' | 'poNumber'>) => void;
  updatePurchaseOrder: (id: string, updated: Partial<PurchaseOrder>) => void;
  
  addEmployee: (item: Omit<Employee, 'id' | 'employeeCode'>) => void;
  updateEmployee: (id: string, updated: Partial<Employee>) => void;
  
  addDocument: (item: Omit<DocumentItem, 'id'>) => void;
  
  markNotificationRead: (id: string) => void;
  clearAllNotifications: () => void;
  
  // System Reset
  resetSystemData: () => void;
}

const AMMSContext = createContext<AMMSContextType | undefined>(undefined);

export const AMMSProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [darkMode, setDarkMode] = useState<boolean>(() => {
    return localStorage.getItem('amms_theme') === 'dark';
  });

  const [activeModule, setActiveModule] = useState<string>('dashboard');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [quickActionModal, setQuickActionModal] = useState<string | null>(null);

  // Storage getters/setters with fallbacks
  const [aircraft, setAircraft] = useState<Aircraft[]>(() => {
    const s = localStorage.getItem('amms_aircraft');
    return s ? JSON.parse(s) : INITIAL_AIRCRAFT;
  });

  const [workOrders, setWorkOrders] = useState<WorkOrder[]>(() => {
    const s = localStorage.getItem('amms_work_orders');
    return s ? JSON.parse(s) : INITIAL_WORK_ORDERS;
  });

  const [defects, setDefects] = useState<Defect[]>(() => {
    const s = localStorage.getItem('amms_defects');
    return s ? JSON.parse(s) : INITIAL_DEFECTS;
  });

  const [inspections, setInspections] = useState<Inspection[]>(() => {
    const s = localStorage.getItem('amms_inspections');
    return s ? JSON.parse(s) : INITIAL_INSPECTIONS;
  });

  const [inventory, setInventory] = useState<InventoryItem[]>(() => {
    const s = localStorage.getItem('amms_inventory');
    return s ? JSON.parse(s) : INITIAL_INVENTORY;
  });

  const [suppliers] = useState<Supplier[]>(INITIAL_SUPPLIERS);

  const [purchaseOrders, setPurchaseOrders] = useState<PurchaseOrder[]>(() => {
    const s = localStorage.getItem('amms_purchase_orders');
    return s ? JSON.parse(s) : INITIAL_PURCHASE_ORDERS;
  });

  const [employees, setEmployees] = useState<Employee[]>(() => {
    const s = localStorage.getItem('amms_employees');
    return s ? JSON.parse(s) : INITIAL_EMPLOYEES;
  });

  const [documents, setDocuments] = useState<DocumentItem[]>(() => {
    const s = localStorage.getItem('amms_documents');
    return s ? JSON.parse(s) : INITIAL_DOCUMENTS;
  });

  const [auditLogs, setAuditLogs] = useState<AuditLog[]>(() => {
    const s = localStorage.getItem('amms_audit_logs');
    return s ? JSON.parse(s) : INITIAL_AUDIT_LOGS;
  });

  const [notifications, setNotifications] = useState<SystemNotification[]>(() => {
    const s = localStorage.getItem('amms_notifications');
    return s ? JSON.parse(s) : INITIAL_NOTIFICATIONS;
  });

  // Persist to localStorage
  useEffect(() => {
    localStorage.setItem('amms_aircraft', JSON.stringify(aircraft));
  }, [aircraft]);

  useEffect(() => {
    localStorage.setItem('amms_work_orders', JSON.stringify(workOrders));
  }, [workOrders]);

  useEffect(() => {
    localStorage.setItem('amms_defects', JSON.stringify(defects));
  }, [defects]);

  useEffect(() => {
    localStorage.setItem('amms_inspections', JSON.stringify(inspections));
  }, [inspections]);

  useEffect(() => {
    localStorage.setItem('amms_inventory', JSON.stringify(inventory));
  }, [inventory]);

  useEffect(() => {
    localStorage.setItem('amms_purchase_orders', JSON.stringify(purchaseOrders));
  }, [purchaseOrders]);

  useEffect(() => {
    localStorage.setItem('amms_employees', JSON.stringify(employees));
  }, [employees]);

  useEffect(() => {
    localStorage.setItem('amms_documents', JSON.stringify(documents));
  }, [documents]);

  useEffect(() => {
    localStorage.setItem('amms_audit_logs', JSON.stringify(auditLogs));
  }, [auditLogs]);

  useEffect(() => {
    localStorage.setItem('amms_notifications', JSON.stringify(notifications));
  }, [notifications]);

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('amms_theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('amms_theme', 'light');
    }
  }, [darkMode]);

  const toggleDarkMode = () => setDarkMode(!darkMode);

  const logAction = (module: AuditLog['module'], action: string, details: string) => {
    let userName = 'Active System User';
    let userEmail = 'operator@amms-aviation.com';
    let userRole = 'OPERATOR';

    try {
      const activeSessionRaw = localStorage.getItem('amms_active_session');
      if (activeSessionRaw) {
        const sessionData = JSON.parse(activeSessionRaw);
        if (sessionData && sessionData.user) {
          userName = sessionData.user.name || userName;
          userEmail = sessionData.user.email || userEmail;
          userRole = sessionData.user.role || userRole;
        }
      }
    } catch (e) {
      // Fallback
    }

    const newLog: AuditLog = {
      id: `log-${Date.now()}`,
      timestamp: new Date().toISOString().replace('T', ' ').slice(0, 19),
      userEmail,
      userName,
      userRole,
      action,
      module,
      details
    };
    setAuditLogs(prev => [newLog, ...prev]);
  };

  const notify = (title: string, message: string, type: SystemNotification['type'], linkModule?: string) => {
    const newNotif: SystemNotification = {
      id: `notif-${Date.now()}`,
      title,
      message,
      type,
      timestamp: 'Just now',
      read: false,
      linkModule
    };
    setNotifications(prev => [newNotif, ...prev]);
  };

  // Aircraft Handlers
  const addAircraft = (item: Omit<Aircraft, 'id'>) => {
    const newAc: Aircraft = {
      ...item,
      id: `ac-${Date.now()}`
    };
    setAircraft(prev => [newAc, ...prev]);
    logAction('Aircraft', `Added Aircraft ${item.tailNumber}`, `${item.model} assigned to ${item.currentAirport}`);
    notify('New Aircraft Added', `Aircraft ${item.tailNumber} (${item.model}) registered into fleet.`, 'info', 'aircraft');
  };

  const updateAircraft = (id: string, updated: Partial<Aircraft>) => {
    setAircraft(prev => prev.map(ac => ac.id === id ? { ...ac, ...updated } : ac));
    logAction('Aircraft', `Updated Aircraft Details`, `Aircraft ID: ${id}`);
  };

  const deleteAircraft = (id: string) => {
    const target = aircraft.find(a => a.id === id);
    setAircraft(prev => prev.filter(ac => ac.id !== id));
    logAction('Aircraft', `Deleted Aircraft`, `Tail: ${target?.tailNumber || id}`);
  };

  // Work Order Handlers
  const addWorkOrder = (item: Omit<WorkOrder, 'id' | 'workOrderNumber' | 'createdDate'>) => {
    const woNum = `WO-2026-${Math.floor(1000 + Math.random() * 9000)}`;
    const newWO: WorkOrder = {
      ...item,
      id: `wo-${Date.now()}`,
      workOrderNumber: woNum,
      createdDate: new Date().toISOString().replace('T', ' ').slice(0, 16)
    };
    setWorkOrders(prev => [newWO, ...prev]);
    logAction('Work Orders', `Created Work Order ${woNum}`, `${item.title} for ${item.aircraftTailNumber}`);
    
    if (item.priority === 'Critical (AOG)') {
      notify('CRITICAL AOG WORK ORDER', `${item.aircraftTailNumber} is AOG! ${item.title}`, 'alert', 'workorders');
    } else {
      notify('Work Order Issued', `Work Order ${woNum} created for ${item.aircraftTailNumber}`, 'info', 'workorders');
    }
  };

  const updateWorkOrder = (id: string, updated: Partial<WorkOrder>) => {
    setWorkOrders(prev => prev.map(wo => {
      if (wo.id === id) {
        const merged = { ...wo, ...updated };
        if (updated.status === 'Completed' && !wo.completedDate) {
          merged.completedDate = new Date().toISOString().replace('T', ' ').slice(0, 16);
        }
        return merged;
      }
      return wo;
    }));
    logAction('Work Orders', `Updated Work Order ${id}`, `Status updated.`);
  };

  const deleteWorkOrder = (id: string) => {
    setWorkOrders(prev => prev.filter(w => w.id !== id));
    logAction('Work Orders', `Deleted Work Order`, `WO ID: ${id}`);
  };

  // Defects
  const addDefect = (item: Omit<Defect, 'id' | 'defectNumber' | 'reportedDate'>) => {
    const defNum = `DEF-2026-${Math.floor(100 + Math.random() * 900)}`;
    const newDef: Defect = {
      ...item,
      id: `def-${Date.now()}`,
      defectNumber: defNum,
      reportedDate: new Date().toISOString().replace('T', ' ').slice(0, 16)
    };
    setDefects(prev => [newDef, ...prev]);
    logAction('Defects', `Reported Defect ${defNum}`, `${item.title} on ${item.aircraftTailNumber}`);
    notify('New Defect Reported', `${item.severity} severity defect ${defNum} logged for ${item.aircraftTailNumber}`, item.severity === 'Critical' ? 'alert' : 'warning', 'defects');
  };

  const updateDefect = (id: string, updated: Partial<Defect>) => {
    setDefects(prev => prev.map(d => d.id === id ? { ...d, ...updated } : d));
    logAction('Defects', `Updated Defect ${id}`, `Status: ${updated.status}`);
  };

  // Inspections
  const addInspection = (item: Omit<Inspection, 'id' | 'inspectionNumber'>) => {
    const insNum = `INS-2026-${Math.floor(1000 + Math.random() * 9000)}`;
    const newIns: Inspection = {
      ...item,
      id: `ins-${Date.now()}`,
      inspectionNumber: insNum
    };
    setInspections(prev => [newIns, ...prev]);
    logAction('Inspections', `Scheduled Inspection ${insNum}`, `${item.type} for ${item.aircraftTailNumber}`);
  };

  const updateInspection = (id: string, updated: Partial<Inspection>) => {
    setInspections(prev => prev.map(i => i.id === id ? { ...i, ...updated } : i));
    logAction('Inspections', `Updated Inspection ${id}`, `Status: ${updated.status}`);
  };

  // Inventory
  const addInventoryItem = (item: Omit<InventoryItem, 'id'>) => {
    const newInv: InventoryItem = {
      ...item,
      id: `inv-${Date.now()}`
    };
    setInventory(prev => [newInv, ...prev]);
    logAction('Inventory', `Added Part ${item.partNumber}`, `${item.partName} quantity ${item.stockQuantity}`);
  };

  const updateInventoryItem = (id: string, updated: Partial<InventoryItem>) => {
    setInventory(prev => prev.map(i => {
      if (i.id === id) {
        const qty = updated.stockQuantity !== undefined ? updated.stockQuantity : i.stockQuantity;
        const minThreshold = updated.minStockThreshold !== undefined ? updated.minStockThreshold : i.minStockThreshold;
        let status: InventoryItem['status'] = 'In Stock';
        if (qty === 0) status = 'Out of Stock';
        else if (qty <= minThreshold) status = 'Low Stock';

        return { ...i, ...updated, status };
      }
      return i;
    }));
  };

  const issuePartToWorkOrder = (partId: string, quantity: number, workOrderId: string) => {
    const targetPart = inventory.find(p => p.id === partId);
    if (!targetPart || targetPart.stockQuantity < quantity) return;

    updateInventoryItem(partId, { stockQuantity: targetPart.stockQuantity - quantity });
    logAction('Inventory', `Issued Part ${targetPart.partNumber}`, `Issued ${quantity} units to WO ${workOrderId}`);
    notify('Spare Part Issued', `${quantity}x ${targetPart.partName} issued to Work Order ${workOrderId}`, 'info', 'inventory');
  };

  // Purchase
  const addPurchaseOrder = (item: Omit<PurchaseOrder, 'id' | 'poNumber'>) => {
    const poNum = `PO-2026-${Math.floor(1000 + Math.random() * 9000)}`;
    const newPO: PurchaseOrder = {
      ...item,
      id: `po-${Date.now()}`,
      poNumber: poNum
    };
    setPurchaseOrders(prev => [newPO, ...prev]);
    logAction('Inventory', `Created Purchase Order ${poNum}`, `Supplier: ${item.supplierName}`);
  };

  const updatePurchaseOrder = (id: string, updated: Partial<PurchaseOrder>) => {
    setPurchaseOrders(prev => prev.map(p => p.id === id ? { ...p, ...updated } : p));
  };

  // Employees
  const addEmployee = (item: Omit<Employee, 'id' | 'employeeCode'>) => {
    const code = `${item.role.slice(0, 3).toUpperCase()}-${Math.floor(100 + Math.random() * 900)}`;
    const newEmp: Employee = {
      ...item,
      id: `emp-${Date.now()}`,
      employeeCode: code
    };
    setEmployees(prev => [newEmp, ...prev]);
    logAction('Employees', `Added Employee ${item.name}`, `Role: ${item.role}`);
  };

  const updateEmployee = (id: string, updated: Partial<Employee>) => {
    setEmployees(prev => prev.map(e => e.id === id ? { ...e, ...updated } : e));
  };

  // Documents
  const addDocument = (item: Omit<DocumentItem, 'id'>) => {
    const newDoc: DocumentItem = {
      ...item,
      id: `doc-${Date.now()}`
    };
    setDocuments(prev => [newDoc, ...prev]);
    logAction('Documents', `Uploaded Document ${item.title}`, `Category: ${item.category}`);
  };

  // Notifications
  const markNotificationRead = (id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  };

  const clearAllNotifications = () => {
    setNotifications([]);
  };

  const resetSystemData = () => {
    localStorage.removeItem('amms_aircraft');
    localStorage.removeItem('amms_work_orders');
    localStorage.removeItem('amms_defects');
    localStorage.removeItem('amms_inspections');
    localStorage.removeItem('amms_inventory');
    localStorage.removeItem('amms_purchase_orders');
    localStorage.removeItem('amms_employees');
    localStorage.removeItem('amms_documents');
    localStorage.removeItem('amms_audit_logs');
    localStorage.removeItem('amms_notifications');

    setAircraft(INITIAL_AIRCRAFT);
    setWorkOrders(INITIAL_WORK_ORDERS);
    setDefects(INITIAL_DEFECTS);
    setInspections(INITIAL_INSPECTIONS);
    setInventory(INITIAL_INVENTORY);
    setPurchaseOrders(INITIAL_PURCHASE_ORDERS);
    setEmployees(INITIAL_EMPLOYEES);
    setDocuments(INITIAL_DOCUMENTS);
    setAuditLogs(INITIAL_AUDIT_LOGS);
    setNotifications(INITIAL_NOTIFICATIONS);

    notify('System Data Reset', 'Restored initial sample aviation database.', 'success');
  };

  return (
    <AMMSContext.Provider
      value={{
        aircraft,
        workOrders,
        defects,
        inspections,
        inventory,
        suppliers,
        purchaseOrders,
        employees,
        documents,
        auditLogs,
        notifications,
        darkMode,
        toggleDarkMode,
        searchQuery,
        setSearchQuery,
        activeModule,
        setActiveModule,
        activeTab: activeModule,
        setActiveTab: setActiveModule,
        quickActionModal,
        setQuickActionModal,
        addAircraft,
        updateAircraft,
        deleteAircraft,
        addWorkOrder,
        updateWorkOrder,
        deleteWorkOrder,
        addDefect,
        updateDefect,
        addInspection,
        updateInspection,
        addInventoryItem,
        updateInventoryItem,
        issuePartToWorkOrder,
        addPurchaseOrder,
        updatePurchaseOrder,
        addEmployee,
        updateEmployee,
        addDocument,
        markNotificationRead,
        clearAllNotifications,
        resetSystemData
      }}
    >
      {children}
    </AMMSContext.Provider>
  );
};

export const useAMMS = () => {
  const context = useContext(AMMSContext);
  if (!context) {
    throw new Error('useAMMS must be used within an AMMSProvider');
  }
  return context;
};
