import React from 'react';
import { useStudio } from '../../context/StudioContext';
import {
  Users,
  Camera,
  FileText,
  DollarSign,
  Plus,
  ArrowUpRight,
  Download,
  Calendar,
  Sparkles,
  Database,
  ExternalLink,
  Building2,
} from 'lucide-react';

interface AdminDashboardProps {
  onNavigate: (tab: 'clients' | 'shoots' | 'invoices' | 'calendar' | 'facilities') => void;
  onOpenNewClientModal: () => void;
  onOpenNewShootModal: () => void;
  onOpenNewInvoiceModal: () => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  onNavigate,
  onOpenNewClientModal,
  onOpenNewShootModal,
  onOpenNewInvoiceModal,
}) => {
  const { clients, shoots, invoices, photos, stages, equipment } = useStudio();

  // Financial Metrics
  const totalBilled = invoices.reduce((sum, inv) => sum + inv.totalAmount, 0);
  const totalReceived = invoices.reduce((sum, inv) => sum + inv.paidAmount, 0);
  const totalPending = totalBilled - totalReceived;

  const activeShoots = shoots.filter((s) => s.status !== 'Completed');
  const selectedPhotos = photos.filter((p) => p.isSelectedForAlbum);

  const getClientName = (clientId: string) => {
    return clients.find((c) => c.id === clientId)?.name || 'Unknown Client';
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Proofing':
        return 'text-amber-400 border-amber-800/60 bg-amber-950/40';
      case 'Editing':
        return 'text-sky-400 border-sky-800/60 bg-sky-950/40';
      case 'Completed':
        return 'text-emerald-400 border-emerald-800/60 bg-emerald-950/40';
      case 'Booked':
        return 'text-indigo-400 border-indigo-800/60 bg-indigo-950/40';
      default:
        return 'text-neutral-400 border-neutral-700 bg-neutral-900';
    }
  };

  return (
    <div className="space-y-8">
      {/* Top Banner / Welcome */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-neutral-800">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-amber-400 uppercase tracking-wider mb-1">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Studio Production ERP &amp; Database</span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-white">
            Studio Operations &amp; Client Overview
          </h1>
          <p className="text-sm text-neutral-400 mt-1">
            Monitor client-wise photo shoots, album proofing selections, work orders, and billing.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center flex-wrap gap-2.5">
          <button
            onClick={onOpenNewClientModal}
            className="flex items-center gap-1.5 px-3 py-2 bg-amber-500 hover:bg-amber-400 text-neutral-950 text-xs font-semibold rounded-lg transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>Add New Client</span>
          </button>

          <button
            onClick={onOpenNewShootModal}
            className="flex items-center gap-1.5 px-3 py-2 bg-neutral-800 hover:bg-neutral-700 text-white text-xs font-medium rounded-lg border border-neutral-700 transition-colors"
          >
            <Camera className="w-3.5 h-3.5 text-amber-400" />
            <span>Book Shoot</span>
          </button>

          <button
            onClick={onOpenNewInvoiceModal}
            className="flex items-center gap-1.5 px-3 py-2 bg-neutral-800 hover:bg-neutral-700 text-white text-xs font-medium rounded-lg border border-neutral-700 transition-colors"
          >
            <FileText className="w-3.5 h-3.5 text-amber-400" />
            <span>New Invoice</span>
          </button>
        </div>
      </div>

      {/* Metric Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Clients */}
        <div
          onClick={() => onNavigate('clients')}
          className="p-5 rounded-xl bg-neutral-900/70 border border-neutral-800 hover:border-neutral-700 transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between text-neutral-400 mb-3">
            <span className="text-xs font-medium uppercase tracking-wider">Registered Clients</span>
            <Users className="w-4 h-4 text-amber-400 group-hover:translate-x-0.5 transition-transform" />
          </div>
          <div className="text-2xl font-bold text-white font-mono tabular-nums">
            {clients.length}
          </div>
          <div className="text-xs text-neutral-400 mt-2 flex items-center justify-between">
            <span>Client-wise profiles</span>
            <span className="text-amber-400 text-[11px] group-hover:underline">View All →</span>
          </div>
        </div>

        {/* Active Shoots */}
        <div
          onClick={() => onNavigate('shoots')}
          className="p-5 rounded-xl bg-neutral-900/70 border border-neutral-800 hover:border-neutral-700 transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between text-neutral-400 mb-3">
            <span className="text-xs font-medium uppercase tracking-wider">Active Productions</span>
            <Camera className="w-4 h-4 text-amber-400 group-hover:translate-x-0.5 transition-transform" />
          </div>
          <div className="text-2xl font-bold text-white font-mono tabular-nums">
            {activeShoots.length}
          </div>
          <div className="text-xs text-neutral-400 mt-2 flex items-center justify-between">
            <span>{shoots.length} total projects booked</span>
            <span className="text-amber-400 text-[11px] group-hover:underline">Manage →</span>
          </div>
        </div>

        {/* Total Payments Collected */}
        <div
          onClick={() => onNavigate('invoices')}
          className="p-5 rounded-xl bg-neutral-900/70 border border-neutral-800 hover:border-neutral-700 transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between text-neutral-400 mb-3">
            <span className="text-xs font-medium uppercase tracking-wider">Revenue Collected</span>
            <DollarSign className="w-4 h-4 text-emerald-400 group-hover:translate-x-0.5 transition-transform" />
          </div>
          <div className="text-2xl font-bold text-emerald-400 font-mono tabular-nums">
            ₹{totalReceived.toLocaleString('en-IN')}
          </div>
          <div className="text-xs text-neutral-400 mt-2 flex items-center justify-between">
            <span>From {invoices.length} invoices</span>
            <span className="text-amber-400 text-[11px] group-hover:underline">Ledger →</span>
          </div>
        </div>

        {/* Pending Receivables */}
        <div
          onClick={() => onNavigate('invoices')}
          className="p-5 rounded-xl bg-neutral-900/70 border border-neutral-800 hover:border-neutral-700 transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between text-neutral-400 mb-3">
            <span className="text-xs font-medium uppercase tracking-wider">Balance Due</span>
            <ArrowUpRight className="w-4 h-4 text-amber-400 group-hover:translate-x-0.5 transition-transform" />
          </div>
          <div className="text-2xl font-bold text-amber-400 font-mono tabular-nums">
            ₹{totalPending.toLocaleString('en-IN')}
          </div>
          <div className="text-xs text-neutral-400 mt-2 flex items-center justify-between">
            <span>Pending completion/albums</span>
            <span className="text-amber-400 text-[11px] group-hover:underline">Follow Up →</span>
          </div>
        </div>
      </div>

      {/* Studio Facilities & Gear Quick Bar */}
      <div className="p-4 rounded-xl bg-neutral-900/60 border border-neutral-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 shrink-0">
            <Building2 className="w-4 h-4" />
          </div>
          <div>
            <div className="font-semibold text-white">Studio Soundstages &amp; Equipment Infrastructure</div>
            <div className="text-neutral-400 text-[11px] mt-0.5">
              {stages.length} Production Stages/Cyc Bays · {equipment.length} Cinema Camera &amp; Lighting Packages · {stages.filter(s => s.status === 'Available').length} Stage Currently Open
            </div>
          </div>
        </div>

        <button
          onClick={() => onNavigate('facilities')}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-neutral-800 hover:bg-neutral-700 text-amber-400 hover:text-amber-300 text-xs font-medium rounded-lg border border-neutral-700 transition-colors whitespace-nowrap self-start sm:self-auto"
        >
          <span>Inspect Stages &amp; Gear</span>
          <ArrowUpRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Main Grid: Client-Wise Shoots Table + Client Proofing Activities */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Recent Client Shoots */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Camera className="w-4 h-4 text-amber-400" />
              <h2 className="text-sm font-semibold text-white">Client-Wise Shoot Projects</h2>
            </div>
            <button
              onClick={() => onNavigate('shoots')}
              className="text-xs text-amber-400 hover:text-amber-300 font-medium"
            >
              View Full Table →
            </button>
          </div>

          <div className="border border-neutral-800 rounded-xl overflow-hidden bg-neutral-900/50">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-neutral-950/80 text-neutral-400 border-b border-neutral-800">
                  <tr>
                    <th className="py-3 px-4 font-medium">Client &amp; Project</th>
                    <th className="py-3 px-3 font-medium">Type</th>
                    <th className="py-3 px-3 font-medium">Event Date</th>
                    <th className="py-3 px-3 font-medium">Status</th>
                    <th className="py-3 px-4 font-medium text-right">Balance Due</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-800 text-neutral-300">
                  {shoots.map((shoot) => {
                    const client = clients.find((c) => c.id === shoot.clientId);
                    return (
                      <tr
                        key={shoot.id}
                        onClick={() => onNavigate('shoots')}
                        className="hover:bg-neutral-800/40 cursor-pointer transition-colors"
                      >
                        <td className="py-3.5 px-4">
                          <div className="font-medium text-white">{shoot.title}</div>
                          <div className="text-[11px] text-neutral-500 font-mono mt-0.5">
                            Client: {client?.name} ({client?.clientCode})
                          </div>
                        </td>
                        <td className="py-3.5 px-3">
                          <span className="text-neutral-300">{shoot.type}</span>
                        </td>
                        <td className="py-3.5 px-3 font-mono tabular-nums text-neutral-400">
                          {shoot.eventDate}
                        </td>
                        <td className="py-3.5 px-3">
                          <span
                            className={`inline-block px-2 py-0.5 rounded text-[10px] font-medium border ${getStatusBadge(
                              shoot.status
                            )}`}
                          >
                            {shoot.status.replace('_', ' ')}
                          </span>
                        </td>
                        <td className="py-3.5 px-4 text-right font-mono tabular-nums">
                          {shoot.balanceDue > 0 ? (
                            <span className="text-amber-400 font-medium">
                              ₹{shoot.balanceDue.toLocaleString('en-IN')}
                            </span>
                          ) : (
                            <span className="text-emerald-400">Cleared</span>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Right Column: Client Proofing & Selection Status */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-400" />
              <h2 className="text-sm font-semibold text-white">Live Client Selections</h2>
            </div>
            <span className="text-xs text-neutral-400 font-mono tabular-nums">
              {selectedPhotos.length} shortlisted
            </span>
          </div>

          <div className="border border-neutral-800 rounded-xl bg-neutral-900/50 p-4 space-y-3">
            <div className="text-xs text-neutral-400 pb-2 border-b border-neutral-800">
              Photos marked by clients for final album printing:
            </div>

            {selectedPhotos.slice(0, 4).map((photo) => {
              const shoot = shoots.find((s) => s.id === photo.shootId);
              const client = clients.find((c) => c.id === shoot?.clientId);

              return (
                <div
                  key={photo.id}
                  className="flex items-start gap-3 p-2.5 rounded-lg bg-neutral-950/60 border border-neutral-800/80"
                >
                  <img
                    src={photo.url}
                    alt={photo.title}
                    referrerPolicy="no-referrer"
                    className="w-12 h-12 object-cover rounded border border-neutral-800 shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="text-xs font-medium text-white truncate">
                      {photo.title || 'Untitled Photo'}
                    </div>
                    <div className="text-[11px] text-neutral-400 truncate mt-0.5">
                      {client?.name} · {shoot?.type}
                    </div>
                    {photo.clientNotes ? (
                      <div className="text-[11px] text-amber-300/90 italic truncate mt-1">
                        "{photo.clientNotes}"
                      </div>
                    ) : (
                      <div className="text-[10px] text-emerald-400 mt-1">✓ Shortlisted for Album</div>
                    )}
                  </div>
                </div>
              );
            })}

            <div className="pt-2">
              <button
                onClick={() => onNavigate('shoots')}
                className="w-full py-2 px-3 bg-neutral-950 hover:bg-neutral-800 border border-neutral-800 rounded-lg text-xs text-neutral-300 flex items-center justify-between transition-colors"
              >
                <span className="text-amber-400 font-medium">Manage Shoots &amp; Proofs</span>
                <span className="text-[11px] text-neutral-500">Open Proofing Hub →</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
