import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { ForgotPasswordModal } from './ForgotPasswordModal';
import {
  Plane,
  Lock,
  User,
  Eye,
  EyeOff,
  ShieldCheck,
  AlertCircle,
  Key,
  Check,
  Sparkles,
  ArrowRight,
  Shield
} from 'lucide-react';

export const LoginPage: React.FC = () => {
  const { login } = useAuth();
  
  const rememberedUsername = localStorage.getItem('amms_remembered_username') || '';

  const [userIdOrEmail, setUserIdOrEmail] = useState(rememberedUsername || 'admin');
  const [password, setPassword] = useState(rememberedUsername ? '' : 'Admin@123');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [showForgotModal, setShowForgotModal] = useState(false);

  const [selectedDemoRole, setSelectedDemoRole] = useState<string>('admin');

  // Demo accounts array for presentation ease
  const demoAccounts = [
    { roleLabel: 'ADMIN', userId: 'admin', pass: 'Admin@123', color: 'bg-purple-500/10 text-purple-400 border-purple-500/30' },
    { roleLabel: 'MAINTENANCE ENGINEER', userId: 'engineer', pass: 'Engineer@123', color: 'bg-blue-500/10 text-blue-400 border-blue-500/30' },
    { roleLabel: 'INSPECTOR', userId: 'inspector', pass: 'Inspector@123', color: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30' },
    { roleLabel: 'TECHNICIAN', userId: 'technician', pass: 'Technician@123', color: 'bg-amber-500/10 text-amber-400 border-amber-500/30' },
    { roleLabel: 'VIEWER', userId: 'viewer', pass: 'Viewer@123', color: 'bg-slate-500/10 text-slate-400 border-slate-500/30' },
  ];

  const handleSelectDemo = (userId: string, pass: string) => {
    setUserIdOrEmail(userId);
    setPassword(pass);
    setSelectedDemoRole(userId);
    setErrorMsg(null);
  };

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (!userIdOrEmail.trim() || !password) {
      setErrorMsg('Please enter both User ID/Email and Password.');
      return;
    }

    setLoading(true);
    try {
      const result = await login(userIdOrEmail, password, rememberMe);
      if (!result.success) {
        setErrorMsg(result.message || 'Authentication failed. Please verify credentials.');
      }
    } catch (err) {
      setErrorMsg('An error occurred during authentication. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#020617] text-slate-100 flex flex-col justify-between relative overflow-hidden font-sans selection:bg-blue-500 selection:text-white">
      {/* Aviation Radial Backdrop Effects */}
      <div className="absolute -top-40 -left-40 w-96 h-96 bg-blue-600/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-indigo-600/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-sky-500/5 rounded-full blur-[120px] pointer-events-none" />

      {/* Top Portal Banner */}
      <header className="p-6 max-w-7xl w-full mx-auto flex items-center justify-between z-10">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-sky-400 text-white shadow-xl shadow-blue-500/20">
            <Plane className="w-6 h-6 fill-white" />
          </div>
          <div>
            <div className="font-black text-lg text-white tracking-wider flex items-center gap-2">
              AMMS <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-400 border border-blue-500/30">MRO ENTERPRISE</span>
            </div>
            <div className="text-[11px] text-slate-400 font-mono">FAA Part 145 & EASA Part M Certified Portal</div>
          </div>
        </div>

        <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-900/80 border border-slate-800 text-slate-400 text-xs">
          <Shield className="w-3.5 h-3.5 text-blue-400" />
          <span>Session Encrypted (256-bit SHA)</span>
        </div>
      </header>

      {/* Main Login Center Card */}
      <main className="flex-1 flex items-center justify-center px-4 py-8 z-10">
        <div className="w-full max-w-md bg-[#0f172a]/80 backdrop-blur-xl border border-slate-800/90 rounded-3xl p-7 sm:p-8 shadow-2xl space-y-6">
          
          {/* Title Header */}
          <div className="text-center space-y-2">
            <div className="inline-flex p-3 rounded-2xl bg-blue-500/10 border border-blue-500/20 text-blue-400 mb-1">
              <Lock className="w-6 h-6" />
            </div>
            <h1 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight">
              Aircraft Maintenance Management System
            </h1>
            <p className="text-xs text-slate-400 font-medium">
              Secure Maintenance Management Portal
            </p>
          </div>

          {/* Error Banner */}
          {errorMsg && (
            <div className="p-3.5 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-start gap-3 animate-fade-in">
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-400 mt-0.5" />
              <span className="leading-relaxed">{errorMsg}</span>
            </div>
          )}

          {/* Login Form */}
          <form onSubmit={handleLoginSubmit} className="space-y-4">
            {/* User ID / Email */}
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1.5">
                User ID / Email Address
              </label>
              <div className="relative">
                <User className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
                <input
                  type="text"
                  value={userIdOrEmail}
                  onChange={(e) => setUserIdOrEmail(e.target.value)}
                  placeholder="Enter User ID or Email"
                  className="w-full pl-10 pr-4 py-2.5 text-xs rounded-xl bg-slate-900/90 border border-slate-700/80 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition"
                  required
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1.5">
                Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter Account Password"
                  className="w-full pl-10 pr-10 py-2.5 text-xs rounded-xl bg-slate-900/90 border border-slate-700/80 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white p-1"
                  title={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Remember Me & Forgot Password */}
            <div className="flex items-center justify-between text-xs pt-1">
              <label className="flex items-center gap-2 cursor-pointer text-slate-400 hover:text-slate-200">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="rounded border-slate-700 bg-slate-900 text-blue-600 focus:ring-blue-500"
                />
                <span>Remember Me</span>
              </label>

              <button
                type="button"
                onClick={() => setShowForgotModal(true)}
                className="text-blue-400 hover:text-blue-300 font-semibold hover:underline"
              >
                Forgot Password?
              </button>
            </div>

            {/* Submit Login Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 px-4 text-xs font-bold text-white bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-600 hover:from-blue-500 hover:to-indigo-500 rounded-xl shadow-lg shadow-blue-500/25 transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Authenticating Credentials...</span>
                </>
              ) : (
                <>
                  <span>Login to AMMS Portal</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Quick Demo Accounts Selection Bar */}
          <div className="pt-2 border-t border-slate-800/80 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-extrabold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                Demo Credentials (Click to Auto-fill)
              </span>
              <span className="text-[10px] text-slate-500 font-mono">College Presentation Mode</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {demoAccounts.map((acc) => {
                const isSelected = selectedDemoRole === acc.userId;
                return (
                  <button
                    key={acc.userId}
                    type="button"
                    onClick={() => handleSelectDemo(acc.userId, acc.pass)}
                    className={`p-2.5 rounded-xl border text-left text-xs transition flex items-center justify-between group ${
                      isSelected
                        ? 'bg-blue-600/20 border-blue-500 text-white font-bold ring-1 ring-blue-500/50'
                        : 'bg-slate-900/60 hover:bg-slate-800/80 border-slate-800 text-slate-300'
                    }`}
                  >
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className={`px-1.5 py-0.5 text-[9px] font-black rounded-md ${acc.color}`}>
                          {acc.roleLabel}
                        </span>
                      </div>
                      <div className="text-[11px] font-mono text-slate-400 mt-1">
                        ID: <span className="text-slate-200 font-bold">{acc.userId}</span> • Password: <span className="text-slate-200">{acc.pass}</span>
                      </div>
                    </div>
                    {isSelected && <Check className="w-4 h-4 text-blue-400 shrink-0 ml-2" />}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </main>

      {/* Footer Credentials Note */}
      <footer className="p-4 text-center text-xs text-slate-500 z-10 border-t border-slate-900 bg-[#020617]/80">
        <p>Aircraft Maintenance Management System (AMMS) • Role-Based Security Portal</p>
      </footer>

      {/* Forgot Password Modal */}
      {showForgotModal && (
        <ForgotPasswordModal
          isOpen={showForgotModal}
          onClose={() => setShowForgotModal(false)}
          defaultIdentifier={userIdOrEmail}
        />
      )}
    </div>
  );
};
