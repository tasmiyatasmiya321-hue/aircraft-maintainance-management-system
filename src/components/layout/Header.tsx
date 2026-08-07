import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useAMMS } from '../../context/AMMSContext';
import {
  Search,
  Plus,
  Bell,
  Sun,
  Moon,
  Shield,
  User,
  ChevronDown,
  LogOut,
  Sparkles,
  Plane,
  X,
  Check,
  RotateCcw
} from 'lucide-react';
import { UserRole } from '../../types';

interface HeaderProps {
  onOpenSidebar?: () => void;
  onOpenAuth?: () => void;
  onOpenAuthModal?: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onOpenSidebar, onOpenAuth, onOpenAuthModal }) => {
  const handleAuthClick = onOpenAuth || onOpenAuthModal || (() => {});
  const { currentUser, activeRole, switchRole, logout } = useAuth();
  const {
    darkMode,
    toggleDarkMode,
    searchQuery,
    setSearchQuery,
    setQuickActionModal,
    notifications,
    markNotificationRead,
    clearAllNotifications,
    resetSystemData
  } = useAMMS();

  const [showRoleDropdown, setShowRoleDropdown] = useState(false);
  const [showUserDropdown, setShowUserDropdown] = useState(false);
  const [showNotifDropdown, setShowNotifDropdown] = useState(false);

  const unreadNotifs = notifications.filter(n => !n.read);

  const rolesList: UserRole[] = [
    'Administrator',
    'Maintenance Manager',
    'Engineer',
    'Technician',
    'Quality Inspector',
    'Store Manager',
    'Viewer'
  ];

  return (
    <header className="sticky top-0 z-40 w-full h-16 bg-[#0f172a]/50 dark:bg-[#0f172a]/60 backdrop-blur-md border-b border-slate-800/80 px-4 flex items-center justify-between transition-colors">
      {/* Left Mobile Toggle & Search Bar */}
      <div className="flex items-center gap-3 flex-1 max-w-xl">
        {onOpenSidebar && (
          <button
            onClick={onOpenSidebar}
            className="md:hidden p-2 text-slate-400 hover:text-white bg-slate-800/60 rounded-lg backdrop-blur-sm"
          >
            <Plane className="w-4 h-4" />
          </button>
        )}
        <div className="relative w-full">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search Tail #, Work Order, ATA Defect, Part P/N, Staff..."
            className="w-full pl-9 pr-8 py-2 text-xs rounded-full bg-slate-800/50 border border-slate-700/80 text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-blue-500 transition"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-2">
        {/* Quick Action Button */}
        <button
          onClick={() => setQuickActionModal('open')}
          className="px-3 py-1.5 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-500 rounded-xl shadow-sm transition flex items-center gap-1.5"
        >
          <Plus className="w-4 h-4" />
          <span className="hidden sm:inline">Quick Entry</span>
        </button>

        {/* Role Switcher Pill */}
        <div className="relative">
          <button
            onClick={() => setShowRoleDropdown(!showRoleDropdown)}
            className="px-3 py-1.5 text-xs font-semibold text-slate-700 dark:text-slate-200 bg-slate-100 dark:bg-slate-800/90 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-xl border border-slate-200 dark:border-slate-700 transition flex items-center gap-1.5"
          >
            <Shield className="w-3.5 h-3.5 text-blue-500" />
            <span className="hidden md:inline">{activeRole}</span>
            <ChevronDown className="w-3 h-3 text-slate-400" />
          </button>

          {showRoleDropdown && (
            <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-xl p-1.5 z-50">
              <div className="px-3 py-2 text-[10px] uppercase font-bold text-slate-400 border-b border-slate-100 dark:border-slate-800">
                Switch Operational Role
              </div>
              {rolesList.map(role => (
                <button
                  key={role}
                  onClick={() => {
                    switchRole(role);
                    setShowRoleDropdown(false);
                  }}
                  className={`w-full text-left px-3 py-2 text-xs rounded-lg flex items-center justify-between transition ${activeRole === role ? 'bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400 font-bold' : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'}`}
                >
                  <span>{role}</span>
                  {activeRole === role && <Check className="w-3.5 h-3.5 text-blue-500" />}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* System Reset Data Demo Helper */}
        <button
          onClick={resetSystemData}
          title="Reset Aviation Sample Data"
          className="p-2 text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition"
        >
          <RotateCcw className="w-4 h-4" />
        </button>

        {/* Notifications */}
        <div className="relative">
          <button
            onClick={() => setShowNotifDropdown(!showNotifDropdown)}
            className="relative p-2 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition"
          >
            <Bell className="w-4 h-4" />
            {unreadNotifs.length > 0 && (
              <span className="absolute top-1 right-1 w-2 h-2 bg-rose-500 rounded-full ring-2 ring-white dark:ring-slate-900 animate-pulse" />
            )}
          </button>

          {showNotifDropdown && (
            <div className="absolute right-0 mt-2 w-80 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl p-4 z-50 max-h-96 overflow-y-auto">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
                <div className="font-bold text-xs text-slate-900 dark:text-white flex items-center gap-1.5">
                  <Bell className="w-3.5 h-3.5 text-blue-500" />
                  Fleet Alerts ({unreadNotifs.length})
                </div>
                {notifications.length > 0 && (
                  <button onClick={clearAllNotifications} className="text-[10px] text-blue-500 hover:underline">
                    Clear all
                  </button>
                )}
              </div>

              <div className="mt-3 space-y-2">
                {notifications.length === 0 ? (
                  <div className="text-center py-6 text-xs text-slate-400">No active alerts</div>
                ) : (
                  notifications.map(n => (
                    <div
                      key={n.id}
                      onClick={() => markNotificationRead(n.id)}
                      className={`p-2.5 rounded-xl border text-xs cursor-pointer transition ${n.read ? 'bg-slate-50 dark:bg-slate-800/40 border-slate-100 dark:border-slate-800/60 opacity-60' : 'bg-blue-50/50 dark:bg-blue-950/20 border-blue-200 dark:border-blue-800/50'}`}
                    >
                      <div className="font-bold text-slate-900 dark:text-white flex items-center justify-between">
                        <span>{n.title}</span>
                        <span className="text-[10px] text-slate-400 font-normal">{n.timestamp}</span>
                      </div>
                      <p className="text-slate-600 dark:text-slate-300 text-[11px] mt-0.5">{n.message}</p>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

        {/* Dark Mode Toggle */}
        <button
          onClick={toggleDarkMode}
          className="p-2 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition"
        >
          {darkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-600" />}
        </button>

        {/* User Profile Menu */}
        <div className="relative pl-1 border-l border-slate-200 dark:border-slate-800">
          <button
            onClick={() => setShowUserDropdown(!showUserDropdown)}
            className="flex items-center gap-2 p-1 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition"
          >
            <img
              src={currentUser.avatarUrl}
              alt={currentUser.name}
              className="w-8 h-8 rounded-xl object-cover ring-2 ring-blue-500/30"
            />
            <div className="text-left hidden lg:block">
              <div className="text-xs font-bold text-slate-900 dark:text-white leading-tight">{currentUser.name}</div>
              <div className="text-[10px] text-slate-500 dark:text-slate-400">{currentUser.role}</div>
            </div>
          </button>

          {showUserDropdown && (
            <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl p-2 z-50">
              <div className="p-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl mb-1">
                <div className="font-bold text-xs text-slate-900 dark:text-white">{currentUser.name}</div>
                <div className="text-[11px] text-slate-500 dark:text-slate-400 truncate">{currentUser.email}</div>
                <div className="text-[10px] font-mono text-blue-600 dark:text-blue-400 mt-1">
                  License: {currentUser.licenseNumber || 'FAA-AMMS-PASS'}
                </div>
              </div>

              <button
                onClick={() => {
                  setShowUserDropdown(false);
                  handleAuthClick();
                }}
                className="w-full text-left px-3 py-2 text-xs font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg flex items-center gap-2 transition"
              >
                <User className="w-3.5 h-3.5" /> Manage Profile & Credentials
              </button>

              <button
                onClick={() => {
                  setShowUserDropdown(false);
                  logout();
                }}
                className="w-full text-left px-3 py-2 text-xs font-medium text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/30 rounded-lg flex items-center gap-2 transition mt-1"
              >
                <LogOut className="w-3.5 h-3.5" /> Sign Out
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
