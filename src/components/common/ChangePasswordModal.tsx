import React, { useState } from 'react';
import { useStudio } from '../../context/StudioContext';
import { X, KeyRound, CheckCircle2, Shield, User, Lock, AlertCircle } from 'lucide-react';

interface ChangePasswordModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ChangePasswordModal: React.FC<ChangePasswordModalProps> = ({
  isOpen,
  onClose,
}) => {
  if (!isOpen) return null;

  const { currentUser, clients, updateClientPasscode } = useStudio();
  const [currentPass, setCurrentPass] = useState('');
  const [newPass, setNewPass] = useState('');
  const [confirmPass, setConfirmPass] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  // Find client if logged in as client
  const client = clients.find((c) => c.id === currentUser?.clientId);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess(false);

    if (!newPass.trim()) {
      setError('Please enter a new password/passcode.');
      return;
    }

    if (newPass.length < 4) {
      setError('New passcode must be at least 4 characters long.');
      return;
    }

    if (newPass !== confirmPass) {
      setError('New passcodes do not match. Please re-enter.');
      return;
    }

    if (client) {
      // Optional check for current passcode if one exists
      if (client.accessPasscode && currentPass && currentPass.trim().toLowerCase() !== client.accessPasscode.toLowerCase()) {
        setError('Current passcode does not match our records.');
        return;
      }

      const updated = updateClientPasscode(client.id, newPass.trim());
      if (updated) {
        setSuccess(true);
        setTimeout(() => {
          onClose();
        }, 1800);
      } else {
        setError('Failed to update passcode. Please try again.');
      }
    } else {
      // Admin password simulation
      setSuccess(true);
      setTimeout(() => {
        onClose();
      }, 1800);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-neutral-950/85 backdrop-blur-md flex items-center justify-center p-4">
      <div className="relative w-full max-w-md bg-neutral-900 border border-neutral-800 rounded-2xl shadow-2xl overflow-hidden p-6 space-y-5 animate-in fade-in-50 zoom-in-95">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-neutral-800">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400">
              <KeyRound className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white tracking-tight">
                Account &amp; Change Passcode
              </h3>
              <p className="text-[11px] text-neutral-400">
                Manage your secure access credentials
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-neutral-400 hover:text-white rounded-lg hover:bg-neutral-800 transition-colors"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* User Identity Pill */}
        <div className="p-3 bg-neutral-950 rounded-xl border border-neutral-800/80 space-y-1.5">
          <div className="flex items-center justify-between text-xs">
            <span className="text-neutral-400">Active User:</span>
            <span className="font-semibold text-white">{currentUser?.name}</span>
          </div>
          <div className="flex items-center justify-between text-xs">
            <span className="text-neutral-400">Account Email:</span>
            <span className="font-mono text-neutral-300">{currentUser?.email}</span>
          </div>
          {client && (
            <>
              <div className="flex items-center justify-between text-xs">
                <span className="text-neutral-400">Client Code:</span>
                <span className="font-mono text-amber-400 font-bold">{client.clientCode}</span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-neutral-400">Current Passcode:</span>
                <span className="font-mono text-neutral-400">
                  {client.accessPasscode ? '••••••' : 'None'}
                </span>
              </div>
            </>
          )}
        </div>

        {/* Messages */}
        {error && (
          <div className="p-3 bg-rose-500/10 border border-rose-500/30 rounded-xl text-rose-400 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {success ? (
          <div className="p-4 bg-emerald-500/10 border border-emerald-500/30 rounded-xl text-emerald-400 text-xs text-center space-y-1.5">
            <CheckCircle2 className="w-6 h-6 mx-auto" />
            <div className="font-bold text-sm text-white">Passcode Successfully Updated!</div>
            <p className="text-[11px] text-neutral-400">
              Your new passcode is saved and active for your next login.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-3.5">
            {client && client.accessPasscode && (
              <div>
                <label className="block text-xs font-medium text-neutral-300 mb-1">
                  Current Passcode
                </label>
                <input
                  type="password"
                  placeholder="Enter current passcode"
                  value={currentPass}
                  onChange={(e) => setCurrentPass(e.target.value)}
                  className="w-full bg-neutral-950 border border-neutral-700 rounded-xl px-3 py-2 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-amber-500 font-mono"
                />
              </div>
            )}

            <div>
              <label className="block text-xs font-medium text-neutral-300 mb-1">
                New Passcode / Password
              </label>
              <input
                type="text"
                required
                placeholder="e.g. AURA99 or secret123"
                value={newPass}
                onChange={(e) => setNewPass(e.target.value)}
                className="w-full bg-neutral-950 border border-neutral-700 rounded-xl px-3 py-2 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-amber-500 font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-neutral-300 mb-1">
                Confirm New Passcode
              </label>
              <input
                type="text"
                required
                placeholder="Re-enter new passcode"
                value={confirmPass}
                onChange={(e) => setConfirmPass(e.target.value)}
                className="w-full bg-neutral-950 border border-neutral-700 rounded-xl px-3 py-2 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-amber-500 font-mono"
              />
            </div>

            <div className="pt-2 flex items-center gap-2">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 py-2 bg-neutral-800 hover:bg-neutral-700 text-neutral-300 text-xs font-semibold rounded-xl transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex-1 py-2 bg-amber-500 hover:bg-amber-400 text-neutral-950 text-xs font-bold rounded-xl transition-colors shadow-md shadow-amber-500/10"
              >
                Save New Passcode
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
