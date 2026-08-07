import React, { createContext, useContext, useState, useEffect } from 'react';
import { UserRole, UserProfile } from '../types';

interface AuthContextType {
  currentUser: UserProfile;
  activeRole: UserRole;
  switchRole: (role: UserRole) => void;
  updateProfile: (updated: Partial<UserProfile>) => void;
  login: (email: string, role?: UserRole) => boolean;
  logout: () => void;
  isAuthenticated: boolean;
  canManageAircraft: boolean;
  canCreateWorkOrders: boolean;
  canApproveMaintenance: boolean;
  canManageInventory: boolean;
  canManageEmployees: boolean;
  canAccessAdmin: boolean;
}

const DEFAULT_USER: UserProfile = {
  id: 'usr-admin-1',
  name: 'Alex Mercer',
  email: 'a.mercer@skywise-amms.com',
  role: 'Administrator',
  department: 'Fleet Operations & Airworthiness',
  licenseNumber: 'FAA-AMMS-001',
  licenseExpiry: '2030-12-31',
  avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
  phone: '+1 (800) 555-AMMS',
  status: 'Active'
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<UserProfile>(() => {
    const saved = localStorage.getItem('amms_current_user');
    return saved ? JSON.parse(saved) : DEFAULT_USER;
  });

  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(true);

  useEffect(() => {
    localStorage.setItem('amms_current_user', JSON.stringify(currentUser));
  }, [currentUser]);

  const activeRole = currentUser.role;

  const switchRole = (newRole: UserRole) => {
    setCurrentUser(prev => ({
      ...prev,
      role: newRole
    }));
  };

  const updateProfile = (updated: Partial<UserProfile>) => {
    setCurrentUser(prev => ({
      ...prev,
      ...updated
    }));
  };

  const login = (email: string, role: UserRole = 'Administrator') => {
    setCurrentUser({
      ...DEFAULT_USER,
      email,
      role
    });
    setIsAuthenticated(true);
    return true;
  };

  const logout = () => {
    setIsAuthenticated(false);
  };

  // Role permissions checks
  const canAccessAdmin = activeRole === 'Administrator';
  const canManageAircraft = activeRole === 'Administrator' || activeRole === 'Maintenance Manager';
  const canCreateWorkOrders = activeRole === 'Administrator' || activeRole === 'Maintenance Manager' || activeRole === 'Engineer';
  const canApproveMaintenance = activeRole === 'Administrator' || activeRole === 'Maintenance Manager' || activeRole === 'Quality Inspector';
  const canManageInventory = activeRole === 'Administrator' || activeRole === 'Maintenance Manager' || activeRole === 'Store Manager';
  const canManageEmployees = activeRole === 'Administrator' || activeRole === 'Maintenance Manager';

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        activeRole,
        switchRole,
        updateProfile,
        login,
        logout,
        isAuthenticated,
        canManageAircraft,
        canCreateWorkOrders,
        canApproveMaintenance,
        canManageInventory,
        canManageEmployees,
        canAccessAdmin
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
