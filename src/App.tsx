/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { StudioProvider, useStudio } from './context/StudioContext';
import { Navbar, NavigationTab } from './components/Navbar';
import { AuthModal } from './components/AuthModal';
import { StudioHomePage } from './components/home/StudioHomePage';
import { AdminDashboard } from './components/admin/AdminDashboard';
import { ClientsManager } from './components/admin/ClientsManager';
import { ShootsManager } from './components/admin/ShootsManager';
import { InvoiceManager } from './components/admin/InvoiceManager';
import { BookingCalendar } from './components/admin/BookingCalendar';
import { StudioFacilitiesManager } from './components/admin/StudioFacilitiesManager';
import { ClientPortal } from './components/client/ClientPortal';
import { NewShootModal } from './components/admin/NewShootModal';
import { NewInvoiceModal } from './components/admin/NewInvoiceModal';
import { UploadPhotoDocumentModal } from './components/admin/UploadPhotoDocumentModal';
import { OfficialInvoiceModal } from './components/common/OfficialInvoiceModal';
import { Client, Invoice } from './types';
import {
  Shield,
  Users,
  RefreshCw,
  Camera,
  ArrowUp,
  MapPin,
  Phone,
  Sparkles,
  CheckCircle2,
  Home,
  LogIn,
} from 'lucide-react';

function StudioApp() {
  const {
    currentUser,
    loginAsUser,
    logout,
    clients,
    shoots,
    invoices,
    studioConfig,
    resetToDefaultData,
  } = useStudio();

  // Start directly on the high-impact Studio Home Page (Meghan Maloney inspired)
  const [currentTab, setCurrentTab] = useState<NavigationTab>('home');
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isNewShootModalOpen, setIsNewShootModalOpen] = useState(false);
  const [isNewInvoiceModalOpen, setIsNewInvoiceModalOpen] = useState(false);
  const [isOpenAddClientDirectly, setIsOpenAddClientDirectly] = useState(false);
  const [targetClientId, setTargetClientId] = useState<string | undefined>(undefined);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [uploadClientId, setUploadClientId] = useState<string | undefined>(undefined);
  const [viewingInvoice, setViewingInvoice] = useState<Invoice | null>(null);

  const isAdmin = currentUser?.role === 'ADMIN';

  const handleLogout = () => {
    logout();
    localStorage.removeItem('aurastudio_auth_token');
    setIsAuthModalOpen(false);
    setIsNewShootModalOpen(false);
    setIsNewInvoiceModalOpen(false);
    setIsOpenAddClientDirectly(false);
    setTargetClientId(undefined);
    setViewingInvoice(null);
    setCurrentTab('home');
    window.scrollTo({ top: 0, behavior: 'auto' });
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleTabSwitch = (tab: NavigationTab) => {
    // Clients can access only their own portal, never the public Home page.
    if (currentUser?.role === 'CLIENT') {
      setCurrentTab('client-portal');
      scrollToTop();
      return;
    }

    if (tab === 'home') {
      setCurrentTab('home');
      scrollToTop();
      return;
    }

    if (!currentUser) {
      setIsAuthModalOpen(true);
      return;
    }

    setCurrentTab(tab);
    scrollToTop();
  };

  // Handle client selection from admin to preview their portal
  const handleSelectClientForPortal = (client: Client) => {
    loginAsUser({
      id: `usr-${client.id}`,
      name: client.name,
      email: client.email,
      role: 'CLIENT',
      clientId: client.id,
      avatar: client.avatar,
      phone: client.phone,
    });
    handleTabSwitch('client-portal');
  };

  const handleOpenNewShootForClient = (clientId: string) => {
    setTargetClientId(clientId);
    setIsNewShootModalOpen(true);
  };

  const handleOpenNewInvoiceForClient = (clientId: string) => {
    setTargetClientId(clientId);
    setIsNewInvoiceModalOpen(true);
  };

  const handleOpenNewClientModal = () => {
    setCurrentTab('clients');
    setIsOpenAddClientDirectly(true);
    scrollToTop();
  };

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100 flex flex-col font-sans selection:bg-amber-500 selection:text-neutral-950">
      {/* Top Bar Header with Right-Side Top-Corner Login */}
      <Navbar
        currentTab={currentTab}
        onSelectTab={handleTabSwitch}
        onOpenAuthModal={() => setIsAuthModalOpen(true)}
        onLogout={handleLogout}
      />

      {/* Role & Quick Status Bar - Rendered only when authenticated */}
      {currentUser && (
        <div className="border-b border-neutral-800/80 bg-neutral-900/40 px-4 py-2 text-xs">
          <div className="max-w-7xl mx-auto flex items-center justify-between flex-wrap gap-2">
            <div className="flex items-center gap-2">
              <button
                onClick={() => handleTabSwitch('home')}
                className={`inline-flex items-center gap-1 px-2 py-0.5 rounded font-medium transition-colors ${
                  currentTab === 'home'
                    ? 'bg-amber-500 text-neutral-950 font-bold'
                    : 'text-neutral-400 hover:text-white'
                }`}
              >
                <Home className="w-3 h-3" />
                <span>Studio Homepage</span>
              </button>

              <span className="text-neutral-600">|</span>

              <span className="text-neutral-400">Current Mode:</span>
              {isAdmin ? (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded font-medium bg-amber-500/10 text-amber-400 border border-amber-500/20">
                  <Shield className="w-3 h-3" />
                  <span>A-S Studio Director / Admin</span>
                </span>
              ) : (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded font-medium bg-sky-500/10 text-sky-400 border border-sky-500/20">
                  <Users className="w-3 h-3" />
                  <span>Client View ({currentUser?.name})</span>
                </span>
              )}
            </div>

            <div className="flex items-center gap-3 text-neutral-400">
              <button
                onClick={() => {
                  if (confirm('Reset studio records to initial default demo data?')) {
                    resetToDefaultData();
                  }
                }}
                className="hover:text-white flex items-center gap-1 text-[11px] transition-colors"
                title="Reset data to initial state"
              >
                <RefreshCw className="w-3 h-3" />
                <span>Reset Demo Data</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Main Viewport Content */}
      <main className={`flex-1 w-full mx-auto py-8 ${
        currentTab === 'home'
          ? 'max-w-none min-w-0 px-0 overflow-x-clip'
          : 'max-w-7xl px-4 sm:px-6 lg:px-8'
      }`}>
        {currentTab === 'home' && (
          <StudioHomePage
            onOpenAuthModal={() => setIsAuthModalOpen(true)}
            onNavigateToShoots={() => handleTabSwitch('shoots')}
            onNavigateToFacilities={() => handleTabSwitch('facilities')}
            onNavigateToClientPortal={() => handleTabSwitch('client-portal')}
            onNavigateToAdminDashboard={() => handleTabSwitch('dashboard')}
          />
        )}

        {currentTab === 'dashboard' && (
          <AdminDashboard
            onNavigate={(tab) => handleTabSwitch(tab as any)}
            onOpenNewClientModal={handleOpenNewClientModal}
            onOpenNewShootModal={() => {
              setTargetClientId(undefined);
              setIsNewShootModalOpen(true);
            }}
            onOpenNewInvoiceModal={() => {
              setTargetClientId(undefined);
              setIsNewInvoiceModalOpen(true);
            }}
          />
        )}

        {currentTab === 'clients' && (
          <ClientsManager
            onSelectClientForPortal={handleSelectClientForPortal}
            onOpenUploadModal={(clientId) => {
              setUploadClientId(clientId || undefined);
              setIsUploadModalOpen(true);
            }}
            onOpenNewShootForClient={handleOpenNewShootForClient}
            onOpenNewInvoiceForClient={handleOpenNewInvoiceForClient}
            onViewInvoice={(inv) => setViewingInvoice(inv)}
            isOpenAddDirectly={isOpenAddClientDirectly}
            onCloseAddDirectly={() => setIsOpenAddClientDirectly(false)}
          />
        )}

        {currentTab === 'shoots' && (
          <ShootsManager
            initialClientId={targetClientId}
            onOpenNewShoot={() => {
              setTargetClientId(undefined);
              setIsNewShootModalOpen(true);
            }}
          />
        )}

        {currentTab === 'invoices' && (
          <InvoiceManager
            initialClientId={targetClientId}
            onOpenCreateInvoice={() => {
              setTargetClientId(undefined);
              setIsNewInvoiceModalOpen(true);
            }}
          />
        )}

        {currentTab === 'calendar' && <BookingCalendar />}

        {currentTab === 'facilities' && <StudioFacilitiesManager />}

        {currentTab === 'client-portal' && <ClientPortal />}
      </main>

      {/* Professional Studio Bottom Footer (Multi-Zone) */}
      <footer className="border-t border-neutral-800 bg-neutral-950 text-neutral-400 text-xs">
        {/* Upper Footer: 4-Column Directory */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 border-b border-neutral-800/80">
          {/* Column 1: Studio Identity & Address */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-white font-bold text-sm tracking-tight">
              <div className="w-6 h-6 rounded bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400">
                <Camera className="w-3.5 h-3.5" />
              </div>
              <span>{studioConfig.studioName}</span>
            </div>
            <p className="text-[11px] text-neutral-400 leading-relaxed">
              {studioConfig.tagline}
            </p>
            <div className="text-[11px] text-neutral-500 space-y-1 font-mono pt-1">
              <div>GSTIN: {studioConfig.gstNumber}</div>
              <div className="font-sans flex items-start gap-1">
                <MapPin className="w-3.5 h-3.5 text-neutral-400 shrink-0 mt-0.5" />
                <span>{studioConfig.address}</span>
              </div>
              <div className="font-sans flex items-center gap-1 text-neutral-300">
                <Phone className="w-3.5 h-3.5 text-neutral-400 shrink-0" />
                <span>{studioConfig.phone}</span>
              </div>
            </div>
          </div>

          {/* Column 2: Studio Operations */}
          <div className="space-y-3">
            <div className="text-white font-semibold text-xs uppercase tracking-wider">
              Studio Operations
            </div>
            <ul className="space-y-2 text-[11px]">
              <li>
                <button
                  onClick={() => handleTabSwitch('home')}
                  className="hover:text-amber-400 transition-colors text-left"
                >
                  Homepage &amp; Showcase
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleTabSwitch('dashboard')}
                  className="hover:text-amber-400 transition-colors text-left"
                >
                  Operations Dashboard
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleTabSwitch('clients')}
                  className="hover:text-amber-400 transition-colors text-left"
                >
                  Client Records &amp; Directory
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleTabSwitch('shoots')}
                  className="hover:text-amber-400 transition-colors text-left"
                >
                  Shoots, Proofs &amp; Selections
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleTabSwitch('invoices')}
                  className="hover:text-amber-400 transition-colors text-left"
                >
                  Invoicing &amp; Payment Ledger
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleTabSwitch('facilities')}
                  className="hover:text-amber-400 transition-colors text-left"
                >
                  Soundstages &amp; Gear Inventory
                </button>
              </li>
            </ul>
          </div>

          {/* Column 3: Client Portal & Fast Access */}
          <div className="space-y-3">
            <div className="text-white font-semibold text-xs uppercase tracking-wider">
              Client Portal Access
            </div>
            <ul className="space-y-2 text-[11px]">
              <li>
                <button
                  onClick={() => handleTabSwitch('client-portal')}
                  className="hover:text-amber-400 transition-colors text-left"
                >
                  Client Gallery &amp; Cloud Downloads
                </button>
              </li>
              <li>
                <button
                  onClick={() => setIsAuthModalOpen(true)}
                  className="hover:text-amber-400 transition-colors text-left"
                >
                  Client Sign In (Passcode / Email)
                </button>
              </li>
              <li className="pt-2 text-neutral-500">
                <span className="block font-medium text-neutral-400 mb-1">Demo Client Portals:</span>
                <div className="space-y-1">
                  {clients.slice(0, 3).map((c) => (
                    <button
                      key={c.id}
                      onClick={() => handleSelectClientForPortal(c)}
                      className="block text-amber-400/90 hover:underline text-left text-[11px]"
                    >
                      → {c.name} ({c.clientCode})
                    </button>
                  ))}
                </div>
              </li>
            </ul>
          </div>

          {/* Column 4: Production Standards & Deliverables */}
          <div className="space-y-3">
            <div className="text-white font-semibold text-xs uppercase tracking-wider flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              <span>Production Standards</span>
            </div>
            <p className="text-[11px] text-neutral-400 leading-relaxed">
              Every production is executed on Sony FX6 Cinema line, Hasselblad 100MP medium-format, and licensed DGCA 8K aerial platforms.
            </p>
            <div className="space-y-1.5 text-[11px] text-neutral-300 pt-1">
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span>4K ProRes 422 Cinema Master Delivery</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span>Handcrafted Italian Velvet Heirloom Albums</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span>12-Month Cloud Drive Backup Included</span>
              </div>
            </div>
          </div>
        </div>

        {/* Lower Footer: Status Bar & Scroll to Top */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px] text-neutral-500">
          <div className="flex items-center gap-2 flex-wrap text-center sm:text-left">
            <span className="text-neutral-400 font-medium">© {new Date().getFullYear()} {studioConfig.studioName}.</span>
            <span>All rights reserved.</span>
            <span className="hidden sm:inline">·</span>
            <span className="text-neutral-400">Cinematic Production &amp; Client Deliverables Platform</span>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1 text-emerald-400 text-[10px]">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              <span>A-S Studio Server Online</span>
            </div>

            <button
              onClick={scrollToTop}
              className="flex items-center gap-1 text-neutral-400 hover:text-white px-2 py-1 rounded bg-neutral-900 border border-neutral-800 transition-colors"
              title="Scroll to top of page"
            >
              <span>Back to Top</span>
              <ArrowUp className="w-3 h-3" />
            </button>
          </div>
        </div>
      </footer>

      {/* Auth Modal (Login Page with Photo Shooting Demo Picture & Clear UI) */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        onSuccess={(role) => {
          if (role === 'ADMIN') {
            handleTabSwitch('dashboard');
          } else {
            handleTabSwitch('client-portal');
          }
        }}
      />

      {/* Book New Shoot Modal */}
      <NewShootModal
        initialClientId={targetClientId}
        isOpen={isNewShootModalOpen}
        onClose={() => {
          setIsNewShootModalOpen(false);
          setTargetClientId(undefined);
        }}
      />

      {/* Create New Invoice Modal */}
      <NewInvoiceModal
        initialClientId={targetClientId}
        isOpen={isNewInvoiceModalOpen}
        onClose={() => {
          setIsNewInvoiceModalOpen(false);
          setTargetClientId(undefined);
        }}
      />

      {/* Upload Photo / Document Modal */}
      <UploadPhotoDocumentModal
        isOpen={isUploadModalOpen}
        initialClientId={uploadClientId}
        onClose={() => {
          setIsUploadModalOpen(false);
          setUploadClientId(undefined);
        }}
      />

      {/* View Printable Invoice Modal */}
      {viewingInvoice && (
        <OfficialInvoiceModal
          invoice={viewingInvoice}
          client={clients.find((c) => c.id === viewingInvoice.clientId)}
          shoot={shoots.find((s) => s.id === viewingInvoice.shootId)}
          studioConfig={studioConfig}
          isOpen={true}
          onClose={() => setViewingInvoice(null)}
        />
      )}
    </div>
  );
}

export default function App() {
  return (
    <StudioProvider>
      <StudioApp />
    </StudioProvider>
  );
}
