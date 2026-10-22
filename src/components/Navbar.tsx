import React, { useState } from 'react';
import { useStudio } from '../context/StudioContext';
import { Camera, LogOut, UserCheck, Shield, ChevronDown, Menu, X, LogIn, KeyRound } from 'lucide-react';
import { ChangePasswordModal } from './common/ChangePasswordModal';

export type NavigationTab =
  | 'home'
  | 'dashboard'
  | 'clients'
  | 'shoots'
  | 'invoices'
  | 'calendar'
  | 'facilities'
  | 'client-portal';

interface NavbarProps {
  currentTab: NavigationTab;
  onSelectTab: (tab: NavigationTab) => void;
  onOpenAuthModal: () => void;
  onLogout: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentTab,
  onSelectTab,
  onOpenAuthModal,
  onLogout,
}) => {
  const { currentUser, logout, clients } = useStudio();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isChangePasswordOpen, setIsChangePasswordOpen] = useState(false);

  const isAdmin = currentUser?.role === 'ADMIN';
  const isClient = currentUser?.role === 'CLIENT';
  const isGuest = !currentUser;

  // Matched client data for passcode display
  const currentClient = clients.find((c) => c.id === currentUser?.clientId);

  const handleTabClick = (tab: NavigationTab) => {
    onSelectTab(tab);
    setMobileMenuOpen(false);
  };

  return (
    <>
      <header className="sticky top-0 z-40 w-full border-b border-neutral-800/80 bg-neutral-950/95 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          
          {/* Left: Brand Logo & Wordmark */}
          <button
            onClick={() => handleTabClick('home')}
            className="text-lg font-bold tracking-tight text-white hover:text-amber-400 transition-colors flex items-center gap-2"
          >
            <div className="w-8 h-8 rounded-lg bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400 shadow-sm shadow-amber-500/10">
              <Camera className="w-4 h-4" />
            </div>
            <span className="tracking-tight">A-S Studio</span>
          </button>

          {/* Center: Strict Role-Based Navigation Links */}
          <nav className="hidden lg:flex items-center gap-6 text-sm font-medium">
            {/* 1. Public Visitor (Unauthenticated): ONLY Home shown */}
            {isGuest && (
              <button
                onClick={() => handleTabClick('home')}
                className="text-amber-400 font-bold border-b-2 border-amber-500 pb-0.5 whitespace-nowrap"
              >
                Home
              </button>
            )}

            {/* 2. Client Login: ONLY My Proofing Gallery */}
            {isClient && (
              <>
                <button
                  onClick={() => handleTabClick('client-portal')}
                  className={`transition-colors whitespace-nowrap ${
                    currentTab === 'client-portal'
                      ? 'text-amber-400 font-bold border-b-2 border-amber-500 pb-0.5'
                      : 'text-neutral-400 hover:text-white'
                  }`}
                >
                  My Proofing Gallery
                </button>
              </>
            )}

            {/* 3. Admin Login: Full Studio Management Suite */}
            {isAdmin && (
              <>
                <button
                  onClick={() => handleTabClick('home')}
                  className={`transition-colors whitespace-nowrap ${
                    currentTab === 'home'
                      ? 'text-amber-400 font-bold border-b-2 border-amber-500 pb-0.5'
                      : 'text-neutral-400 hover:text-white'
                  }`}
                >
                  Home
                </button>
                <button
                  onClick={() => handleTabClick('dashboard')}
                  className={`transition-colors whitespace-nowrap ${
                    currentTab === 'dashboard'
                      ? 'text-amber-400 font-bold border-b-2 border-amber-500 pb-0.5'
                      : 'text-neutral-400 hover:text-white'
                  }`}
                >
                  Studio Operations
                </button>
                <button
                  onClick={() => handleTabClick('clients')}
                  className={`transition-colors whitespace-nowrap ${
                    currentTab === 'clients'
                      ? 'text-amber-400 font-bold border-b-2 border-amber-500 pb-0.5'
                      : 'text-neutral-400 hover:text-white'
                  }`}
                >
                  Clients
                </button>
                <button
                  onClick={() => handleTabClick('shoots')}
                  className={`transition-colors whitespace-nowrap ${
                    currentTab === 'shoots'
                      ? 'text-amber-400 font-bold border-b-2 border-amber-500 pb-0.5'
                      : 'text-neutral-400 hover:text-white'
                  }`}
                >
                  Shoots &amp; Proofs
                </button>
                <button
                  onClick={() => handleTabClick('invoices')}
                  className={`transition-colors whitespace-nowrap ${
                    currentTab === 'invoices'
                      ? 'text-amber-400 font-bold border-b-2 border-amber-500 pb-0.5'
                      : 'text-neutral-400 hover:text-white'
                  }`}
                >
                  Invoices
                </button>
                <button
                  onClick={() => handleTabClick('calendar')}
                  className={`transition-colors whitespace-nowrap ${
                    currentTab === 'calendar'
                      ? 'text-amber-400 font-bold border-b-2 border-amber-500 pb-0.5'
                      : 'text-neutral-400 hover:text-white'
                  }`}
                >
                  Schedule
                </button>
                <button
                  onClick={() => handleTabClick('facilities')}
                  className={`transition-colors whitespace-nowrap ${
                    currentTab === 'facilities'
                      ? 'text-amber-400 font-bold border-b-2 border-amber-500 pb-0.5'
                      : 'text-neutral-400 hover:text-white'
                  }`}
                >
                  Stages &amp; Gear
                </button>
              </>
            )}
          </nav>

          {/* Right Side Top Corner: User Login ID & Change Password / Sign In */}
          <div className="flex items-center gap-2 sm:gap-3">
            {currentUser ? (
              <div className="flex items-center gap-2 sm:gap-3">
                
                {/* User Login ID Pill with Change Password Trigger */}
                <div className="flex items-center bg-neutral-900 border border-neutral-700/80 rounded-xl p-1 shadow-sm">
                  <div className="flex items-center gap-2 px-2 py-1 text-xs text-neutral-200">
                    <div className="w-5 h-5 rounded-full bg-amber-500/20 text-amber-400 flex items-center justify-center font-bold text-[10px]">
                      {isAdmin ? <Shield className="w-3 h-3" /> : <UserCheck className="w-3 h-3" />}
                    </div>
                    <div className="flex flex-col text-left">
                      <span className="font-semibold text-white leading-tight max-w-[120px] truncate">
                        {currentUser.name}
                      </span>
                      <span className="text-[10px] font-mono text-amber-400/90 leading-tight">
                        {currentClient ? currentClient.clientCode : 'DIRECTOR ID'}
                      </span>
                    </div>
                  </div>

                  {/* Change Password Feature Button */}
                  <button
                    onClick={() => setIsChangePasswordOpen(true)}
                    className="ml-1 p-1.5 text-neutral-400 hover:text-amber-400 hover:bg-neutral-800 rounded-lg transition-colors flex items-center gap-1 text-[11px]"
                    title="Change Passcode / Password"
                  >
                    <KeyRound className="w-3.5 h-3.5" />
                    <span className="hidden sm:inline font-medium">Change Pass</span>
                  </button>
                </div>

                {/* Log Out */}
                <button
                  onClick={onLogout}
                  className="p-2 text-neutral-400 hover:text-rose-400 rounded-xl hover:bg-neutral-900 border border-transparent hover:border-neutral-800 transition-colors"
                  title="Sign Out"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              /* Public Visitor: Top Right Corner Login Button */
              <button
                onClick={onOpenAuthModal}
                className="px-4 py-2 text-xs font-bold text-neutral-950 bg-amber-500 hover:bg-amber-400 rounded-xl transition-all shadow-md shadow-amber-500/20 flex items-center gap-1.5"
              >
                <LogIn className="w-3.5 h-3.5" />
                <span>Client &amp; Staff Login</span>
              </button>
            )}

            {/* Mobile Menu Hamburger */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 text-neutral-400 hover:text-white rounded-lg hover:bg-neutral-900 transition-colors"
              aria-label="Toggle Navigation Menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Drawer Menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden border-b border-neutral-800 bg-neutral-950 px-4 pt-3 pb-5 space-y-2 text-sm animate-in slide-in-from-top-2">
            <button
              onClick={() => handleTabClick('home')}
              className={`w-full text-left px-3 py-2 rounded-lg text-xs font-medium ${
                currentTab === 'home' ? 'bg-amber-500 text-neutral-950 font-bold' : 'text-neutral-300 hover:bg-neutral-900'
              }`}
            >
              Home
            </button>

            {isClient && (
              <button
                onClick={() => handleTabClick('client-portal')}
                className={`w-full text-left px-3 py-2 rounded-lg text-xs font-medium ${
                  currentTab === 'client-portal' ? 'bg-amber-500 text-neutral-950 font-bold' : 'text-neutral-300 hover:bg-neutral-900'
                }`}
              >
                My Proofing Gallery
              </button>
            )}

            {isAdmin && (
              <>
                <button
                  onClick={() => handleTabClick('dashboard')}
                  className={`w-full text-left px-3 py-2 rounded-lg text-xs font-medium ${
                    currentTab === 'dashboard' ? 'bg-amber-500 text-neutral-950 font-bold' : 'text-neutral-300 hover:bg-neutral-900'
                  }`}
                >
                  Studio Operations
                </button>
                <button
                  onClick={() => handleTabClick('clients')}
                  className={`w-full text-left px-3 py-2 rounded-lg text-xs font-medium ${
                    currentTab === 'clients' ? 'bg-amber-500 text-neutral-950 font-bold' : 'text-neutral-300 hover:bg-neutral-900'
                  }`}
                >
                  Clients
                </button>
                <button
                  onClick={() => handleTabClick('shoots')}
                  className={`w-full text-left px-3 py-2 rounded-lg text-xs font-medium ${
                    currentTab === 'shoots' ? 'bg-amber-500 text-neutral-950 font-bold' : 'text-neutral-300 hover:bg-neutral-900'
                  }`}
                >
                  Shoots &amp; Proofs
                </button>
                <button
                  onClick={() => handleTabClick('invoices')}
                  className={`w-full text-left px-3 py-2 rounded-lg text-xs font-medium ${
                    currentTab === 'invoices' ? 'bg-amber-500 text-neutral-950 font-bold' : 'text-neutral-300 hover:bg-neutral-900'
                  }`}
                >
                  Invoices
                </button>
                <button
                  onClick={() => handleTabClick('calendar')}
                  className={`w-full text-left px-3 py-2 rounded-lg text-xs font-medium ${
                    currentTab === 'calendar' ? 'bg-amber-500 text-neutral-950 font-bold' : 'text-neutral-300 hover:bg-neutral-900'
                  }`}
                >
                  Schedule
                </button>
                <button
                  onClick={() => handleTabClick('facilities')}
                  className={`w-full text-left px-3 py-2 rounded-lg text-xs font-medium ${
                    currentTab === 'facilities' ? 'bg-amber-500 text-neutral-950 font-bold' : 'text-neutral-300 hover:bg-neutral-900'
                  }`}
                >
                  Stages &amp; Gear
                </button>
              </>
            )}

            {currentUser && (
              <div className="pt-2 border-t border-neutral-800 space-y-1.5">
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    setIsChangePasswordOpen(true);
                  }}
                  className="w-full py-2 px-3 text-left text-xs text-amber-400 bg-neutral-900 rounded-lg flex items-center gap-2"
                >
                  <KeyRound className="w-3.5 h-3.5" />
                  <span>Change My Password / Passcode</span>
                </button>
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    onLogout();
                  }}
                  className="w-full py-2 px-3 text-left text-xs text-rose-400 bg-neutral-900 rounded-lg flex items-center gap-2"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>Sign Out</span>
                </button>
              </div>
            )}

            {isGuest && (
              <div className="pt-2 border-t border-neutral-800">
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    onOpenAuthModal();
                  }}
                  className="w-full py-2 text-center text-xs font-bold rounded-lg bg-amber-500 text-neutral-950 flex items-center justify-center gap-1.5"
                >
                  <LogIn className="w-3.5 h-3.5" />
                  <span>Client &amp; Staff Login</span>
                </button>
              </div>
            )}
          </div>
        )}
      </header>

      {/* Change Password Modal */}
      <ChangePasswordModal
        isOpen={isChangePasswordOpen}
        onClose={() => setIsChangePasswordOpen(false)}
      />
    </>
  );
};
