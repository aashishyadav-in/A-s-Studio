import React, { useState } from 'react';
import { useStudio } from '../context/StudioContext';
import { X, Shield, Users, Mail, KeyRound, ArrowRight, Camera, Sparkles } from 'lucide-react';
import { fashionCover, weddingCover, portraitCover } from '../data/initialData';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (role: 'ADMIN' | 'CLIENT') => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
}) => {
 

  const { login, clients, loginAsUser } = useStudio();
  const [activeTab, setActiveTab] = useState<'client' | 'admin'>('client');
  const [identifier, setIdentifier] = useState('');
  const [adminPassword, setAdminPassword] = useState('');
  const [passcode, setPasscode] = useState('');
  const [error, setError] = useState('');
  const [demoPicIndex, setDemoPicIndex] = useState(0);

  const demoPhotos = [
    {
      img: fashionCover,
      title: 'Studio Fashion Editorial',
      location: 'Stage 01 Infinity Cyclorama',
    },
    {
      img: weddingCover,
      title: 'Royal Heritage Wedding Shoot',
      location: 'The Leela Palace, Udaipur',
    },
    {
      img: portraitCover,
      title: 'Natural Light Portrait Atelier',
      location: 'Daylight Loft Stage 02',
    },
  ];
   if (!isOpen) return null;
const handleAdminLogin = async (e: React.FormEvent) => {
  e.preventDefault();
  setError('');

  if (!identifier.trim() || !adminPassword) {
    setError('Please enter your email and password.');
    return;
  }

  try {
    const response = await fetch(
      `${import.meta.env.VITE_API_URL || 'http://localhost:5001'}/api/auth/login`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          identifier: identifier.trim(),
          passcode: adminPassword,
        }),
      }
    );

    const data = await response.json();

    if (!response.ok) {
      setError(data.message || 'Invalid email or password.');
      return;
    }

    if (!data.token || data.user?.role !== 'ADMIN') {
      setError('Unexpected response from the server.');
      return;
    }

    localStorage.setItem('aurastudio_auth_token', data.token);
    loginAsUser(data.user);
    onSuccess('ADMIN');
    onClose();
  } catch {
    setError('Cannot connect to the backend. Check that the server is running.');
  }
};
 

  const handleClientLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!identifier.trim() || !passcode) {
      setError('Please enter your email/client code and passcode.');
      return;
    }

    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL || 'http://localhost:5001'}/api/auth/login`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            identifier: identifier.trim(),
            passcode,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        setError(data.message || 'Invalid client credentials.');
        return;
      }

      if (!data.token || data.user?.role !== 'CLIENT' || !data.user?.clientId) {
        setError('Unexpected response from the server.');
        return;
      }

      localStorage.setItem('aurastudio_auth_token', data.token);
      loginAsUser(data.user);
      onSuccess('CLIENT');
      onClose();
    } catch {
      setError('Cannot connect to the backend. Check that the server is running.');
    }
  };

  const handleQuickClientSelect = (clientEmail: string) => {
    const success = login(clientEmail);

    if (success) {
      onSuccess('CLIENT');
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-neutral-950/85 backdrop-blur-md flex items-center justify-center p-4">
      <div className="relative w-full max-w-4xl bg-neutral-900 border border-neutral-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col md:flex-row">
        
        {/* Left Side: Photo Shooting Demo Picture & Atmosphere */}
        <div className="md:w-5/12 relative min-h-[220px] md:min-h-[500px] bg-neutral-950 flex flex-col justify-between p-6 overflow-hidden">
          <img
            src={demoPhotos[demoPicIndex].img}
            alt={demoPhotos[demoPicIndex].title}
            referrerPolicy="no-referrer"
            className="absolute inset-0 w-full h-full object-cover opacity-60 transition-opacity duration-700"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-neutral-950/40 to-neutral-950/30" />

          {/* Top Wordmark */}
          <div className="relative z-10 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400">
                <Camera className="w-4 h-4" />
              </div>
              <span className="font-bold text-base text-white tracking-tight">A-S Studio</span>
            </div>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-black/60 text-amber-400 border border-amber-500/30">
              Live Atelier
            </span>
          </div>

          {/* Bottom Photo Shooting Demo Badge & Switcher */}
          <div className="relative z-10 space-y-3">
            <div className="bg-neutral-900/80 backdrop-blur-md border border-neutral-700/60 p-3 rounded-xl">
              <div className="flex items-center gap-1.5 text-amber-400 text-[11px] font-semibold">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Shoot Demonstration</span>
              </div>
              <div className="text-white font-semibold text-xs mt-0.5">
                {demoPhotos[demoPicIndex].title}
              </div>
              <div className="text-[11px] text-neutral-400 mt-0.5 font-mono">
                {demoPhotos[demoPicIndex].location}
              </div>
            </div>

            {/* Thumbnail switcher */}
            <div className="flex items-center gap-2">
              {demoPhotos.map((item, idx) => (
                <button
                  key={idx}
                  onClick={() => setDemoPicIndex(idx)}
                  className={`h-1.5 rounded-full transition-all ${
                    demoPicIndex === idx ? 'w-6 bg-amber-500' : 'w-2 bg-neutral-700 hover:bg-neutral-500'
                  }`}
                  aria-label={`Show ${item.title}`}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Right Side: Clean, Simple Login UI */}
        <div className="md:w-7/12 p-6 sm:p-8 flex flex-col justify-between space-y-6">
          <div className="space-y-5">
            {/* Header */}
            <div className="flex items-center justify-between pb-3 border-b border-neutral-800">
              <div>
                <h2 className="text-lg font-bold text-white tracking-tight">
                  Welcome to A-S Studio
                </h2>
                <p className="text-xs text-neutral-400 mt-0.5">
                  Sign in to view your photo shoot gallery or manage studio operations.
                </p>
              </div>
              <button
                onClick={onClose}
                className="p-1.5 text-neutral-400 hover:text-white rounded-lg hover:bg-neutral-800 transition-colors"
                aria-label="Close"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Clean Tab Switcher */}
            <div className="grid grid-cols-2 gap-2 p-1 bg-neutral-950 rounded-xl border border-neutral-800">
              <button
                onClick={() => {
                  setActiveTab('client');
                  setError('');
                }}
                className={`py-2 px-3 text-xs font-semibold rounded-lg flex items-center justify-center gap-1.5 transition-all ${
                  activeTab === 'client'
                    ? 'bg-amber-500 text-neutral-950 shadow-sm'
                    : 'text-neutral-400 hover:text-white'
                }`}
              >
                <Users className="w-3.5 h-3.5" />
                <span>Client Portal Access</span>
              </button>

              <button
                onClick={() => {
                  setActiveTab('admin');
                  setError('');
                }}
                className={`py-2 px-3 text-xs font-semibold rounded-lg flex items-center justify-center gap-1.5 transition-all ${
                  activeTab === 'admin'
                    ? 'bg-amber-500 text-neutral-950 shadow-sm'
                    : 'text-neutral-400 hover:text-white'
                }`}
              >
                <Shield className="w-3.5 h-3.5" />
                <span>Studio Admin</span>
              </button>
            </div>

            {error && (
              <div className="p-3 bg-rose-500/10 border border-rose-500/30 rounded-xl text-rose-400 text-xs">
                {error}
              </div>
            )}

            {/* Client Portal Tab */}
            {activeTab === 'client' && (
              <form onSubmit={handleClientLogin} className="space-y-4">
                <div>
                  <label className="block text-xs font-medium text-neutral-300 mb-1.5">
                    Client Email or Shoot Access Code
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-neutral-500 absolute left-3 top-3" />
                    <input
                      type="text"
                      placeholder="e.g. priya.sharma@example.com or CLT-2026-081"
                      value={identifier}
                      onChange={(e) => setIdentifier(e.target.value)}
                      className="w-full bg-neutral-950 border border-neutral-700 rounded-xl pl-9 pr-3 py-2.5 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-amber-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-neutral-300 mb-1.5">
                    Private Passcode (Optional for direct email)
                  </label>
                  <div className="relative">
                    <KeyRound className="w-4 h-4 text-neutral-500 absolute left-3 top-3" />
                    <input
                      type="password"
                      placeholder="e.g. AURA81"
                      value={passcode}
                      onChange={(e) => setPasscode(e.target.value)}
                      className="w-full bg-neutral-950 border border-neutral-700 rounded-xl pl-9 pr-3 py-2.5 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-amber-500 font-mono"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full py-2.5 bg-amber-500 hover:bg-amber-400 text-neutral-950 text-xs font-bold rounded-xl transition-colors flex items-center justify-center gap-1.5"
                >
                  <span>Open My Client Portal</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </form>
            )}

            {/* Studio Admin Tab */}
            {activeTab === 'admin' && (
              <form onSubmit={handleAdminLogin} className="space-y-4">
              <div>
  <label className="block text-xs font-medium text-neutral-300 mb-1.5">
    Studio Director Email
  </label>
  <div className="relative">
    <Mail className="w-4 h-4 text-neutral-500 absolute left-3 top-3" />
    <input
      type="email"
      placeholder="admin@as-studio.com"
      value={identifier}
      onChange={(e) => setIdentifier(e.target.value)}
      required
      className="w-full bg-neutral-950 border border-neutral-700 rounded-xl pl-9 pr-3 py-2.5 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-amber-500"
    />
  </div>
</div>

<div>
  <label className="block text-xs font-medium text-neutral-300 mb-1.5">
    Admin Password
  </label>
  <div className="relative">
    <KeyRound className="w-4 h-4 text-neutral-500 absolute left-3 top-3" />
    <input
      type="password"
      autoComplete="current-password"
      placeholder="Enter your admin password"
      value={adminPassword}
      onChange={(e) => setAdminPassword(e.target.value)}
      required
      className="w-full bg-neutral-950 border border-neutral-700 rounded-xl pl-9 pr-3 py-2.5 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-amber-500"
    />
  </div>
</div>

                <div className="space-y-2 pt-1">
                  <button
                    type="submit"
                    className="w-full py-2.5 bg-amber-500 hover:bg-amber-400 text-neutral-950 text-xs font-bold rounded-xl transition-colors flex items-center justify-center gap-1.5"
                  >
                    <span>Sign In to Admin Dashboard</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>

                  
                </div>
              </form>
            )}
          </div>

          {/* Simple Bottom Security Note */}
          <div className="text-[11px] text-neutral-400 text-center border-t border-neutral-800/80 pt-3">
            A-S Studio Secure Client Delivery &amp; Management Portal
          </div>
        </div>
      </div>
    </div>
  );
};
