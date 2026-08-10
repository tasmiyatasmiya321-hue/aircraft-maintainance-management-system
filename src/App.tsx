import React, { useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { AMMSProvider, useAMMS } from './context/AMMSContext';
import { LoginPage } from './components/auth/LoginPage';
import { Header } from './components/layout/Header';
import { Sidebar } from './components/layout/Sidebar';
import { Breadcrumb } from './components/layout/Breadcrumb';
import { DashboardOverview } from './components/dashboard/DashboardOverview';
import { AircraftView } from './components/aircraft/AircraftView';
import { WorkOrdersView } from './components/workorders/WorkOrdersView';
import { MaintenanceView } from './components/maintenance/MaintenanceView';
import { InspectionsView } from './components/inspections/InspectionsView';
import { DefectsView } from './components/defects/DefectsView';
import { InventoryView } from './components/inventory/InventoryView';
import { SuppliersView } from './components/suppliers/SuppliersView';
import { EmployeesView } from './components/employees/EmployeesView';
import { UserManagementView } from './components/users/UserManagementView';
import { AuditLogsView } from './components/audit/AuditLogsView';
import { DocumentsView } from './components/documents/DocumentsView';
import { CalendarView } from './components/calendar/CalendarView';
import { ReportsView } from './components/reports/ReportsView';
import { AnalyticsView } from './components/analytics/AnalyticsView';
import { AdministrationView } from './components/administration/AdministrationView';
import { QuickActionModal } from './components/common/QuickActionModal';
import { AuthModal } from './components/auth/AuthModal';

const AMMSMainContent: React.FC = () => {
  const { isAuthenticated } = useAuth();
  const { activeTab, activeModule, quickActionModal } = useAMMS();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [authModalOpen, setAuthModalOpen] = useState(false);

  if (!isAuthenticated) {
    return <LoginPage />;
  }

  const currentTab = activeTab || activeModule || 'dashboard';

  const renderActiveView = () => {
    switch (currentTab) {
      case 'dashboard':
        return <DashboardOverview />;
      case 'aircraft':
        return <AircraftView />;
      case 'workorders':
        return <WorkOrdersView />;
      case 'maintenance':
        return <MaintenanceView />;
      case 'inspections':
        return <InspectionsView />;
      case 'defects':
        return <DefectsView />;
      case 'inventory':
        return <InventoryView />;
      case 'suppliers':
        return <SuppliersView />;
      case 'employees':
        return <EmployeesView />;
      case 'users':
        return <UserManagementView />;
      case 'audit':
        return <AuditLogsView />;
      case 'documents':
        return <DocumentsView />;
      case 'calendar':
        return <CalendarView />;
      case 'reports':
        return <ReportsView />;
      case 'analytics':
        return <AnalyticsView />;
      case 'administration':
        return <AdministrationView />;
      default:
        return <DashboardOverview />;
    }
  };

  return (
    <div className="min-h-screen bg-[#020617] text-slate-100 flex flex-col font-sans transition-colors duration-200">
      {/* Top Enterprise Header */}
      <Header
        onOpenSidebar={() => setSidebarOpen(true)}
        onOpenAuth={() => setAuthModalOpen(true)}
      />

      <div className="flex-1 flex overflow-hidden">
        {/* Responsive Navigation Sidebar */}
        <Sidebar
          isOpen={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
        />

        {/* Main Content Area */}
        <main className="flex-1 flex flex-col min-w-0 overflow-y-auto custom-scrollbar">
          {/* Breadcrumb Header Bar */}
          <Breadcrumb />

          {/* Active View Container */}
          <div className="flex-1">
            {renderActiveView()}
          </div>
        </main>
      </div>

      {/* Central Quick Action Modal */}
      {quickActionModal && <QuickActionModal />}

      {/* User Profile / Auth Credentials Modal */}
      {authModalOpen && (
        <AuthModal
          isOpen={authModalOpen}
          onClose={() => setAuthModalOpen(false)}
        />
      )}
    </div>
  );
};

export default function App() {
  return (
    <AuthProvider>
      <AMMSProvider>
        <AMMSMainContent />
      </AMMSProvider>
    </AuthProvider>
  );
}
