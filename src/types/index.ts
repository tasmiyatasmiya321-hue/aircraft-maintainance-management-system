export type UserRole = 
  | 'Administrator'
  | 'Maintenance Manager'
  | 'Engineer'
  | 'Technician'
  | 'Quality Inspector'
  | 'Store Manager'
  | 'Viewer';

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  department: string;
  licenseNumber?: string;
  licenseExpiry?: string;
  avatarUrl?: string;
  phone?: string;
  status: 'Active' | 'On Leave' | 'Inactive';
}

export type AircraftStatus = 'Available' | 'In Maintenance' | 'Grounded (AOG)' | 'Inspection Due';
export type AircraftType = 'Commercial Airline' | 'Cargo' | 'Military' | 'Business Jet' | 'Helicopter' | 'Trainer';

export interface Aircraft {
  id: string;
  registrationNumber: string; // e.g. N737AA
  tailNumber: string;         // e.g. N737
  name: string;               // e.g. SkyKing One
  model: string;              // e.g. Boeing 737-800
  type: AircraftType;
  manufacturer: string;       // e.g. Boeing
  serialNumber: string;
  mfgYear: number;
  operator: string;           // e.g. Global Airways
  currentAirport: string;     // e.g. JFK / New York
  hangar: string;             // e.g. Hangar 4B
  status: AircraftStatus;
  engineType: string;
  engineHours: number;
  flightHours: number;
  flightCycles: number;
  landingCycles: number;
  weightMaxTakeoffKg: number;
  fuelCapacityLiters: number;
  passengerCapacity: number;
  lastMaintenanceDate: string;
  nextMaintenanceDate: string;
  registrationExpiry: string;
  warrantyExpiry: string;
  photoUrl: string;
}

export type WorkOrderPriority = 'Low' | 'Medium' | 'High' | 'Critical (AOG)';
export type WorkOrderStatus = 'Open' | 'Assigned' | 'In Progress' | 'Waiting Parts' | 'Waiting Inspection' | 'Completed' | 'Closed' | 'Cancelled';
export type MaintenanceCategory = 'Preventive' | 'Corrective' | 'Predictive' | 'Scheduled' | 'Emergency';

export interface WorkOrder {
  id: string;
  workOrderNumber: string;    // e.g. WO-2026-0891
  aircraftId: string;
  aircraftTailNumber: string;
  aircraftModel: string;
  type: MaintenanceCategory;
  priority: WorkOrderPriority;
  title: string;
  description: string;
  assignedEngineerId?: string;
  assignedEngineerName?: string;
  assignedTechnicianName?: string;
  department: string;
  estimatedHours: number;
  actualHours: number;
  laborCost: number;
  materialCost: number;
  status: WorkOrderStatus;
  createdBy: string;
  createdDate: string;
  dueDate: string;
  completedDate?: string;
  remarks?: string;
  digitalSignature?: string;
  signedBy?: string;
  signedAt?: string;
  requiredParts?: { partId: string; partName: string; quantity: number }[];
}

export type InspectionType = 'Daily Check' | 'Weekly Check' | 'A-Check (Monthly)' | 'C-Check (Annual)' | 'Pre-Flight' | 'Post-Flight' | 'Heavy Maintenance' | 'Quality Audit';
export type InspectionStatus = 'Scheduled' | 'In Progress' | 'Passed' | 'Rejected' | 'Requires Attention';

export interface InspectionCheckitem {
  id: string;
  task: string;
  category: string;
  passed: boolean | null; // null if unchecked
  notes?: string;
}

export interface Inspection {
  id: string;
  inspectionNumber: string;   // e.g. INS-2026-442
  aircraftId: string;
  aircraftTailNumber: string;
  type: InspectionType;
  inspectorId: string;
  inspectorName: string;
  date: string;
  status: InspectionStatus;
  scorePercentage: number;
  checklists: InspectionCheckitem[];
  remarks?: string;
  digitalSignature?: string;
}

export type DefectSeverity = 'Low' | 'Medium' | 'High' | 'Critical';
export type DefectStatus = 'Reported' | 'Assigned' | 'Repairing' | 'Inspection' | 'Closed';
export type ATACategory = 'ATA 21 Air Conditioning' | 'ATA 24 Electrical' | 'ATA 27 Flight Controls' | 'ATA 29 Hydraulics' | 'ATA 32 Landing Gear' | 'ATA 34 Navigation/Avionics' | 'ATA 49 APU' | 'ATA 71 Powerplant / Engine' | 'ATA 52 Doors & Cabin';

export interface Defect {
  id: string;
  defectNumber: string;       // e.g. DEF-8812
  aircraftId: string;
  aircraftTailNumber: string;
  severity: DefectSeverity;
  category: ATACategory;
  title: string;
  description: string;
  rootCause?: string;
  correctiveAction?: string;
  reportedBy: string;
  reportedDate: string;
  assignedEngineerName?: string;
  status: DefectStatus;
  resolvedDate?: string;
}

export interface InventoryItem {
  id: string;
  partNumber: string;         // e.g. P-88219-X
  partName: string;
  manufacturer: string;
  category: 'Avionics' | 'Engine Components' | 'Hydraulics' | 'Hardware & Fasteners' | 'Landing Gear' | 'Electrical' | 'Cabin Interior' | 'Filters & Oils';
  stockQuantity: number;
  minStockThreshold: number;
  maxStockThreshold: number;
  locationRack: string;        // e.g. Rack A-12
  locationShelf: string;       // e.g. Shelf 03
  unitPriceUSD: number;
  supplierName: string;
  barcode: string;
  batchNumber: string;
  expiryDate?: string;
  status: 'In Stock' | 'Low Stock' | 'Out of Stock';
}

export interface Supplier {
  id: string;
  companyName: string;
  contactPerson: string;
  email: string;
  phone: string;
  country: string;
  rating: number; // 1-5
  category: string;
  activeOrdersCount: number;
  taxId: string;
}

export interface PurchaseOrder {
  id: string;
  poNumber: string;           // e.g. PO-9012
  supplierId: string;
  supplierName: string;
  createdDate: string;
  expectedDelivery: string;
  totalAmountUSD: number;
  status: 'Draft' | 'Pending Approval' | 'Approved' | 'Shipped' | 'Received' | 'Cancelled';
  items: { partName: string; quantity: number; unitPrice: number }[];
}

export interface Employee {
  id: string;
  employeeCode: string;
  name: string;
  email: string;
  phone: string;
  role: UserRole;
  department: string;
  licenseNumber: string;
  licenseExpiry: string;
  skills: string[];
  status: 'Available' | 'On Duty' | 'On Leave';
  assignedTasksCount: number;
  hireDate: string;
}

export interface DocumentItem {
  id: string;
  title: string;
  category: 'Aircraft Manual' | 'Compliance Certificate' | 'Inspection Report' | 'Work Order Record' | 'Purchase Order' | 'Engineering Bulletin';
  fileType: 'PDF' | 'DOCX' | 'XLSX' | 'PNG' | 'CAD';
  fileSize: string;
  uploadedBy: string;
  uploadDate: string;
  version: string;
  relatedAircraftTail?: string;
  tags: string[];
}

export interface AuditLog {
  id: string;
  timestamp: string;
  userEmail: string;
  userName: string;
  action: string;
  module: 'Aircraft' | 'Work Orders' | 'Defects' | 'Inspections' | 'Inventory' | 'Employees' | 'Documents' | 'System';
  details: string;
}

export interface SystemNotification {
  id: string;
  title: string;
  message: string;
  type: 'alert' | 'warning' | 'info' | 'success';
  timestamp: string;
  read: boolean;
  linkModule?: string;
}
