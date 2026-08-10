import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { UserRole, UserProfile, AuditLog } from '../types';
import { hashPassword, verifyPassword } from '../utils/crypto';

// Pre-computed SHA-256 hashes for initial demo credentials
const DEMO_HASHES: Record<string, string> = {
  'Admin@123': '240be518fabd2724ddb6f04eeb1da5967448d7e831c08c8fa822809f74c720a9',
  'Engineer@123': '44a0eb5caeeb3dfdcdbd77ec9224b539cdd9fb9254d0263f350c33a2d216fe82',
  'Inspector@123': '48fdb0ae6eebfb332c94caef7aa92a39a82d02c8eb160ebfbdfedcc60ea9bca5',
  'Technician@123': '754c0bdae05a8b7596ad75e7a9e048123caee190a6f87453eb51ee4b77f88417',
  'Viewer@123': 'ed906ce3ecdd74ffb9a2be9f70cebe841a4574cc572b842900fa06a234057e05'
};

export const INITIAL_USERS: UserProfile[] = [
  {
    id: 'usr-1',
    userId: 'admin',
    name: 'Alex Mercer',
    email: 'admin@skywise-amms.com',
    role: 'ADMIN',
    department: 'Fleet Operations & Airworthiness',
    licenseNumber: 'FAA-AMMS-ADMIN-01',
    licenseExpiry: '2030-12-31',
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
    phone: '+1 (800) 555-ADMIN',
    status: 'Active',
    lastLogin: '2026-08-10 01:20',
    passwordHash: DEMO_HASHES['Admin@123']
  },
  {
    id: 'usr-2',
    userId: 'engineer',
    name: 'Marcus Vance',
    email: 'engineer@skywise-amms.com',
    role: 'MAINTENANCE ENGINEER',
    department: 'Powerplant & Structural Maintenance',
    licenseNumber: 'FAA-A&P-90210',
    licenseExpiry: '2028-09-15',
    avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80',
    phone: '+1 (800) 555-ENG1',
    status: 'Active',
    lastLogin: '2026-08-09 18:45',
    passwordHash: DEMO_HASHES['Engineer@123']
  },
  {
    id: 'usr-3',
    userId: 'inspector',
    name: 'Sarah Connor',
    email: 'inspector@skywise-amms.com',
    role: 'INSPECTOR',
    department: 'Quality Assurance & Compliance',
    licenseNumber: 'FAA-IA-77120',
    licenseExpiry: '2027-11-30',
    avatarUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=200&q=80',
    phone: '+1 (800) 555-INSP',
    status: 'Active',
    lastLogin: '2026-08-08 14:10',
    passwordHash: DEMO_HASHES['Inspector@123']
  },
  {
    id: 'usr-4',
    userId: 'technician',
    name: 'David Miller',
    email: 'technician@skywise-amms.com',
    role: 'TECHNICIAN',
    department: 'Line & Hangar Maintenance',
    licenseNumber: 'FAA-A&P-33219',
    licenseExpiry: '2028-04-20',
    avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80',
    phone: '+1 (800) 555-TECH',
    status: 'Active',
    lastLogin: '2026-08-09 11:05',
    passwordHash: DEMO_HASHES['Technician@123']
  },
  {
    id: 'usr-5',
    userId: 'viewer',
    name: 'Elena Rostova',
    email: 'viewer@skywise-amms.com',
    role: 'VIEWER',
    department: 'Executive Operations & Oversight',
    licenseNumber: 'AMMS-VIEW-001',
    licenseExpiry: '2030-01-01',
    avatarUrl: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=200&q=80',
    phone: '+1 (800) 555-VIEW',
    status: 'Active',
    lastLogin: '2026-08-07 09:30',
    passwordHash: DEMO_HASHES['Viewer@123']
  }
];

interface AuthContextType {
  currentUser: UserProfile | null;
  users: UserProfile[];
  isAuthenticated: boolean;
  activeRole: UserRole;
  login: (userIdOrEmail: string, password: string, rememberMe?: boolean) => Promise<{ success: boolean; message?: string }>;
  logout: () => void;
  forgotPassword: (userIdOrEmail: string, newPassword: string) => Promise<{ success: boolean; message: string }>;
  switchRole: (role: UserRole) => void;
  updateProfile: (updated: Partial<UserProfile>) => void;
  
  // User Management (Admin)
  addUser: (newUser: Omit<UserProfile, 'id'>, plainPassword?: string) => Promise<{ success: boolean; message: string }>;
  updateUser: (userId: string, updates: Partial<UserProfile>, newPlainPassword?: string) => Promise<boolean>;
  toggleUserStatus: (userId: string) => void;
  deleteUser: (userId: string) => void;
  
  // Role & Permission Helper Flags
  canManageUsers: boolean;
  canManageAircraft: boolean;
  canCreateWorkOrders: boolean;
  canManageWorkOrders: boolean;
  canUpdateWorkOrderTasks: boolean;
  canPerformInspections: boolean;
  canApproveInspections: boolean;
  canManageInventory: boolean;
  canManageEmployees: boolean;
  canAccessAdmin: boolean;
  isReadOnly: boolean;
  
  // Session Security
  sessionTimeoutWarning: boolean;
  renewSession: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Saved users in localStorage or initial dataset
  const [users, setUsers] = useState<UserProfile[]>(() => {
    const saved = localStorage.getItem('amms_registered_users');
    return saved ? JSON.parse(saved) : INITIAL_USERS;
  });

  // Current session user
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(() => {
    const session = localStorage.getItem('amms_active_session');
    if (session) {
      try {
        const parsed = JSON.parse(session);
        return parsed.user || null;
      } catch (e) {
        return null;
      }
    }
    return null;
  });

  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    return localStorage.getItem('amms_active_session') !== null;
  });

  const [sessionTimeoutWarning, setSessionTimeoutWarning] = useState<boolean>(false);

  // Sync users list to localStorage
  useEffect(() => {
    localStorage.setItem('amms_registered_users', JSON.stringify(users));
  }, [users]);

  // Sync active session user
  useEffect(() => {
    if (currentUser && isAuthenticated) {
      localStorage.setItem('amms_active_session', JSON.stringify({
        user: currentUser,
        loginTime: new Date().toISOString()
      }));
    } else {
      localStorage.removeItem('amms_active_session');
    }
  }, [currentUser, isAuthenticated]);

  // Record audit log entry in localStorage for system tracking
  const logAuditAction = useCallback((action: string, module: any, details: string, relatedRecord?: string) => {
    try {
      const existingLogsRaw = localStorage.getItem('amms_audit_logs');
      const existingLogs: AuditLog[] = existingLogsRaw ? JSON.parse(existingLogsRaw) : [];
      const newLog: AuditLog = {
        id: `log-${Date.now()}`,
        timestamp: new Date().toLocaleString(),
        userEmail: currentUser?.email || 'system@skywise-amms.com',
        userName: currentUser?.name || 'Anonymous User',
        userRole: currentUser?.role || 'SYSTEM',
        action,
        module,
        details,
        relatedRecord
      };
      const updatedLogs = [newLog, ...existingLogs];
      localStorage.setItem('amms_audit_logs', JSON.stringify(updatedLogs));
    } catch (e) {
      console.error('Audit log write error:', e);
    }
  }, [currentUser]);

  const activeRole: UserRole = currentUser?.role || 'VIEWER';

  // Login handler
  const login = async (userIdOrEmail: string, plainTextPassword: string, rememberMe: boolean = true) => {
    const cleanedInput = userIdOrEmail.trim().toLowerCase();
    
    // Find user by userId or email
    const foundUser = users.find(u => 
      u.userId.toLowerCase() === cleanedInput || 
      u.email.toLowerCase() === cleanedInput
    );

    if (!foundUser) {
      return { success: false, message: 'Invalid User ID or Password. Please check credentials.' };
    }

    if (foundUser.status === 'Inactive') {
      return { success: false, message: 'Account is deactivated. Please contact your System Administrator.' };
    }

    // Check password
    let isMatch = false;
    if (foundUser.passwordHash) {
      isMatch = await verifyPassword(plainTextPassword, foundUser.passwordHash);
      // Fallback check for plain matching if hash failed
      if (!isMatch && DEMO_HASHES[plainTextPassword]) {
        isMatch = DEMO_HASHES[plainTextPassword] === foundUser.passwordHash;
      }
    } else {
      // Demo fallback match for initial users if no hash defined
      isMatch = plainTextPassword.length > 0;
    }

    if (!isMatch) {
      return { success: false, message: 'Invalid Password. Please verify and try again.' };
    }

    const nowStr = new Date().toISOString().replace('T', ' ').substring(0, 16);
    const updatedUser: UserProfile = {
      ...foundUser,
      lastLogin: nowStr
    };

    // Update user's last login in list
    setUsers(prev => prev.map(u => u.id === foundUser.id ? updatedUser : u));
    setCurrentUser(updatedUser);
    setIsAuthenticated(true);
    setSessionTimeoutWarning(false);

    if (rememberMe) {
      localStorage.setItem('amms_remembered_username', foundUser.userId);
    } else {
      localStorage.removeItem('amms_remembered_username');
    }

    logAuditAction(
      `${updatedUser.name} logged in`,
      'Authentication',
      `User ${updatedUser.userId} (${updatedUser.role}) authenticated successfully.`
    );

    return { success: true };
  };

  // Logout handler
  const logout = () => {
    if (currentUser) {
      logAuditAction(
        `${currentUser.name} logged out`,
        'Authentication',
        `User ${currentUser.userId} session ended cleanly.`
      );
    }
    setCurrentUser(null);
    setIsAuthenticated(false);
    setSessionTimeoutWarning(false);
    localStorage.removeItem('amms_active_session');
  };

  // Forgot password flow
  const forgotPassword = async (userIdOrEmail: string, newPlainPassword: string) => {
    const cleanedInput = userIdOrEmail.trim().toLowerCase();
    const targetUser = users.find(u => 
      u.userId.toLowerCase() === cleanedInput || 
      u.email.toLowerCase() === cleanedInput
    );

    if (!targetUser) {
      return { success: false, message: 'User ID or Email not found in AMMS registry.' };
    }

    const newHash = await hashPassword(newPlainPassword);
    setUsers(prev => prev.map(u => u.id === targetUser.id ? { ...u, passwordHash: newHash } : u));

    logAuditAction(
      `Password reset for ${targetUser.userId}`,
      'Authentication',
      `Security password reset performed for ${targetUser.name} (${targetUser.email}).`
    );

    return { success: true, message: `Password reset successfully for account ${targetUser.name}. You can now log in.` };
  };

  const switchRole = (newRole: UserRole) => {
    if (!currentUser) return;
    const updated = { ...currentUser, role: newRole };
    setCurrentUser(updated);
    setUsers(prev => prev.map(u => u.id === currentUser.id ? updated : u));
  };

  const updateProfile = (updated: Partial<UserProfile>) => {
    if (!currentUser) return;
    const merged = { ...currentUser, ...updated };
    setCurrentUser(merged);
    setUsers(prev => prev.map(u => u.id === currentUser.id ? merged : u));
  };

  // Admin User Management functions
  const addUser = async (newUser: Omit<UserProfile, 'id'>, plainPassword = 'User@123') => {
    const exists = users.some(u => 
      u.userId.toLowerCase() === newUser.userId.toLowerCase() || 
      u.email.toLowerCase() === newUser.email.toLowerCase()
    );

    if (exists) {
      return { success: false, message: 'A user with this User ID or Email already exists.' };
    }

    const newHash = await hashPassword(plainPassword);
    const createdUser: UserProfile = {
      ...newUser,
      id: `usr-${Date.now()}`,
      status: newUser.status || 'Active',
      avatarUrl: newUser.avatarUrl || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80',
      passwordHash: newHash
    };

    setUsers(prev => [createdUser, ...prev]);

    logAuditAction(
      `Admin created user ${createdUser.name}`,
      'User Management',
      `New AMMS account created: ID ${createdUser.userId}, Role ${createdUser.role}, Dept ${createdUser.department}.`
    );

    return { success: true, message: `User ${createdUser.name} added successfully.` };
  };

  const updateUser = async (userId: string, updates: Partial<UserProfile>, newPlainPassword?: string) => {
    let updatedHash = updates.passwordHash;
    if (newPlainPassword) {
      updatedHash = await hashPassword(newPlainPassword);
    }

    let targetName = '';
    setUsers(prev => prev.map(u => {
      if (u.id === userId || u.userId === userId) {
        targetName = u.name;
        return {
          ...u,
          ...updates,
          passwordHash: updatedHash || u.passwordHash
        };
      }
      return u;
    }));

    if (currentUser && (currentUser.id === userId || currentUser.userId === userId)) {
      setCurrentUser(prev => prev ? { ...prev, ...updates, passwordHash: updatedHash || prev.passwordHash } : null);
    }

    logAuditAction(
      `Updated user account ${userId}`,
      'User Management',
      `Account details updated for ${targetName || userId}.`
    );

    return true;
  };

  const toggleUserStatus = (userId: string) => {
    setUsers(prev => prev.map(u => {
      if (u.id === userId || u.userId === userId) {
        const newStatus = u.status === 'Active' ? 'Inactive' : 'Active';
        logAuditAction(
          `User ${u.userId} status set to ${newStatus}`,
          'User Management',
          `Account status toggled for ${u.name}.`
        );
        return { ...u, status: newStatus };
      }
      return u;
    }));
  };

  const deleteUser = (userId: string) => {
    const target = users.find(u => u.id === userId || u.userId === userId);
    setUsers(prev => prev.filter(u => u.id !== userId && u.userId !== userId));
    if (target) {
      logAuditAction(
        `Deleted user ${target.userId}`,
        'User Management',
        `Account ${target.name} removed from AMMS registry.`
      );
    }
  };

  const renewSession = () => {
    setSessionTimeoutWarning(false);
  };

  // Explicit Role Permission Checks matching Prompt specifications
  const normalizedRole = (currentUser?.role || '').toUpperCase();
  const isAdmin = normalizedRole === 'ADMIN' || normalizedRole === 'ADMINISTRATOR';
  const isEngineer = normalizedRole === 'MAINTENANCE ENGINEER' || normalizedRole === 'ENGINEER' || normalizedRole === 'MAINTENANCE MANAGER';
  const isInspector = normalizedRole === 'INSPECTOR' || normalizedRole === 'QUALITY INSPECTOR';
  const isTechnician = normalizedRole === 'TECHNICIAN';
  const isViewer = normalizedRole === 'VIEWER';

  const canManageUsers = isAdmin;
  const canManageAircraft = isAdmin || isEngineer;
  const canCreateWorkOrders = isAdmin || isEngineer;
  const canManageWorkOrders = isAdmin || isEngineer;
  const canUpdateWorkOrderTasks = isAdmin || isEngineer || isTechnician;
  const canPerformInspections = isAdmin || isInspector;
  const canApproveInspections = isAdmin || isInspector;
  const canManageInventory = isAdmin || isEngineer;
  const canManageEmployees = isAdmin || isEngineer;
  const canAccessAdmin = isAdmin;
  const isReadOnly = isViewer;

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        users,
        isAuthenticated,
        activeRole,
        login,
        logout,
        forgotPassword,
        switchRole,
        updateProfile,
        addUser,
        updateUser,
        toggleUserStatus,
        deleteUser,
        canManageUsers,
        canManageAircraft,
        canCreateWorkOrders,
        canManageWorkOrders,
        canUpdateWorkOrderTasks,
        canPerformInspections,
        canApproveInspections,
        canManageInventory,
        canManageEmployees,
        canAccessAdmin,
        isReadOnly,
        sessionTimeoutWarning,
        renewSession
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
