import React, { useState } from 'react';
import { useStudio } from '../../context/StudioContext';
import { Client, Shoot, Invoice } from '../../types';
import {
  Users,
  Search,
  Plus,
  Phone,
  Mail,
  MapPin,
  KeyRound,
  ExternalLink,
  Edit,
  Trash2,
  Camera,
  FileText,
  DollarSign,
  X,
  Check,
  Eye,
  LogIn,
  Upload,
} from 'lucide-react';

interface ClientsManagerProps {
  onSelectClientForPortal: (client: Client) => void;
  onOpenNewShootForClient: (clientId: string) => void;
  onOpenNewInvoiceForClient: (clientId: string) => void;
  onViewInvoice: (invoice: Invoice) => void;
  onOpenUploadModal?: (clientId: string) => void;
  isOpenAddDirectly?: boolean;
  onCloseAddDirectly?: () => void;
}

export const ClientsManager: React.FC<ClientsManagerProps> = ({
  onSelectClientForPortal,
  onOpenNewShootForClient,
  onOpenNewInvoiceForClient,
  onViewInvoice,
  onOpenUploadModal,
  isOpenAddDirectly,
  onCloseAddDirectly,
}) => {
  const { clients, shoots, invoices, photos, documents, addClient, updateClient, deleteClient } = useStudio();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingClient, setEditingClient] = useState<Client | null>(null);
  const [clientPhotoFile, setClientPhotoFile] = useState<File | null>(null);
  const [clientPhotoUrl, setClientPhotoUrl] = useState('');
  const [isUploadingClientPhoto, setIsUploadingClientPhoto] = useState(false);


  React.useEffect(() => {
    if (isOpenAddDirectly) {
      handleOpenAdd();
      if (onCloseAddDirectly) onCloseAddDirectly();
    }
  }, [isOpenAddDirectly]);

  // Form states
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    alternatePhone: '',
    city: '',
    address: '',
    notes: '',
    clientCode: '',
    accessPasscode: '',
  });

  const filteredClients = clients.filter(
    (c) =>
      c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.clientCode.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.city.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.phone.includes(searchQuery)
  );

  const handleOpenAdd = () => {
    const randomCode = `CLT-2026-${Math.floor(100 + Math.random() * 900)}`;
    const randomPass = `AURA${Math.floor(10 + Math.random() * 90)}`;
    setFormData({
      name: '',
      email: '',
      phone: '',
      alternatePhone: '',
      city: '',
      address: '',
      notes: '',
      clientCode: randomCode,
      accessPasscode: randomPass,
    });
    setEditingClient(null);
    setClientPhotoFile(null);
    setClientPhotoUrl('');
    setIsAddModalOpen(true);
  };

  const handleOpenEdit = (client: Client, e: React.MouseEvent) => {
    e.stopPropagation();
    setFormData({
      name: client.name,
      email: client.email,
      phone: client.phone,
      alternatePhone: client.alternatePhone || '',
      city: client.city,
      address: client.address || '',
      notes: client.notes || '',
      clientCode: client.clientCode,
      accessPasscode: client.accessPasscode,
    });
    setEditingClient(client);
    setClientPhotoFile(null);
    setClientPhotoUrl(client.avatar || '');
    setIsAddModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.email.trim() || !formData.phone.trim()) return;

    setIsUploadingClientPhoto(true);
    try {
      let avatar = clientPhotoUrl.trim();

      if (clientPhotoFile) {
        const token = localStorage.getItem('aurastudio_auth_token');
        if (!token) throw new Error('Please log in again before uploading the client photo.');

        const body = new FormData();
        body.append('image', clientPhotoFile);

        const response = await fetch(
          `${import.meta.env.VITE_API_URL || 'http://localhost:5001'}/api/gallery/upload`,
          {
            method: 'POST',
            headers: { Authorization: `Bearer ${token}` },
            body,
          }
        );

        const result = await response.json().catch(() => ({}));
        if (!response.ok) {
          throw new Error(result.message || `Photo upload failed (${response.status}).`);
        }
        if (!result.url) throw new Error('Upload succeeded but no image URL was returned.');
        avatar = result.url;
      }

      const clientData = { ...formData, avatar: avatar || undefined };

      if (editingClient) {
        updateClient(editingClient.id, clientData);
        if (selectedClient?.id === editingClient.id) {
          setSelectedClient({ ...editingClient, ...clientData });
        }
      } else {
        addClient(clientData);
      }

      setIsAddModalOpen(false);
      setClientPhotoFile(null);
    } catch (error) {
      alert(error instanceof Error ? error.message : 'Could not save client photo.');
    } finally {
      setIsUploadingClientPhoto(false);
    }
  };

  const handleDelete = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (confirm('Are you sure you want to delete this client and all their shoots and records?')) {
      deleteClient(id);
      if (selectedClient?.id === id) {
        setSelectedClient(null);
      }
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-neutral-800">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-white flex items-center gap-2">
            <Users className="w-5 h-5 text-amber-500" />
            <span>Client Database &amp; Master Directory</span>
          </h1>
          <p className="text-xs text-neutral-400 mt-1">
            Official client records, access credentials, and client-wise projects history.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-2.5 w-3.5 h-3.5 text-neutral-500" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by client name, code, phone, city..."
              className="bg-neutral-900 border border-neutral-800 rounded-lg pl-9 pr-4 py-1.5 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-amber-500 w-64"
            />
          </div>

          <button
            onClick={() => onOpenUploadModal?.(selectedClient?.id || clients[0]?.id || '')}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-neutral-800 hover:bg-neutral-700 text-amber-400 text-xs font-semibold rounded-lg border border-neutral-700 transition-colors whitespace-nowrap"
          >
            <Upload className="w-3.5 h-3.5" />
            <span>Upload Photo / Document</span>
          </button>

          <button
            onClick={handleOpenAdd}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-amber-500 hover:bg-amber-400 text-neutral-950 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add New Client</span>
          </button>
        </div>
      </div>

      {/* Main Layout: Client List on Left, Client Profile on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Client Cards List */}
        <div className={`${selectedClient ? 'lg:col-span-5' : 'lg:col-span-12'} space-y-3`}>
          <div className="flex items-center justify-between text-xs text-neutral-400 px-1">
            <span>Showing {filteredClients.length} clients</span>
            <span className="text-[11px] text-neutral-500">Click any card to inspect full records</span>
          </div>

          <div className="grid grid-cols-1 gap-3">
            {filteredClients.map((client) => {
              const clientShoots = shoots.filter((s) => s.clientId === client.id);
              const clientInvoices = invoices.filter((i) => i.clientId === client.id);
              const billed = clientInvoices.reduce((sum, inv) => sum + inv.totalAmount, 0);
              const paid = clientInvoices.reduce((sum, inv) => sum + inv.paidAmount, 0);
              const balance = billed - paid;
              const isSelected = selectedClient?.id === client.id;

              return (
                <div
                  key={client.id}
                  onClick={() => setSelectedClient(client)}
                  className={`p-4 rounded-xl border transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-neutral-800/90 border-amber-500/80 shadow-lg'
                      : 'bg-neutral-900/60 border-neutral-800 hover:border-neutral-700 hover:bg-neutral-800/40'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-white text-sm">{client.name}</span>
                        <span className="text-[11px] font-mono text-amber-400 bg-amber-500/10 px-1.5 py-0.5 rounded border border-amber-500/20">
                          {client.clientCode}
                        </span>
                      </div>
                      <div className="flex items-center gap-3 text-xs text-neutral-400 mt-1">
                        <span className="flex items-center gap-1">
                          <Phone className="w-3 h-3 text-neutral-500" />
                          {client.phone}
                        </span>
                        <span>·</span>
                        <span className="flex items-center gap-1">
                          <MapPin className="w-3 h-3 text-neutral-500" />
                          {client.city}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-1">
                      <button
                        onClick={(e) => handleOpenEdit(client, e)}
                        className="p-1.5 text-neutral-400 hover:text-white rounded hover:bg-neutral-700 transition-colors"
                        title="Edit Client"
                      >
                        <Edit className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={(e) => handleDelete(client.id, e)}
                        className="p-1.5 text-neutral-400 hover:text-rose-400 rounded hover:bg-neutral-700 transition-colors"
                        title="Delete Client"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  {/* Financial & Shoot Summary */}
                  <div className="mt-3 pt-3 border-t border-neutral-800/70 grid grid-cols-3 gap-2 text-xs">
                    <div>
                      <span className="text-[10px] text-neutral-500 block uppercase">Shoots</span>
                      <span className="font-semibold text-neutral-200 font-mono tabular-nums">
                        {clientShoots.length} Booked
                      </span>
                    </div>
                    <div>
                      <span className="text-[10px] text-neutral-500 block uppercase">Paid</span>
                      <span className="font-semibold text-emerald-400 font-mono tabular-nums">
                        ₹{paid.toLocaleString('en-IN')}
                      </span>
                    </div>
                    <div>
                      <span className="text-[10px] text-neutral-500 block uppercase">Balance</span>
                      <span className="font-semibold text-amber-400 font-mono tabular-nums">
                        ₹{balance.toLocaleString('en-IN')}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Selected Client Detailed Records View */}
        {selectedClient && (
          <div className="lg:col-span-7 space-y-4">
            <div className="p-6 rounded-xl bg-neutral-900 border border-neutral-800 space-y-6">
              {/* Header */}
              <div className="flex items-start justify-between pb-4 border-b border-neutral-800">
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-lg font-bold text-white">{selectedClient.name}</h2>
                    <span className="text-xs font-mono text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">
                      {selectedClient.clientCode}
                    </span>
                  </div>
                  <div className="text-xs text-neutral-400 mt-1 flex flex-wrap items-center gap-3">
                    <span>{selectedClient.email}</span>
                    <span>·</span>
                    <span>{selectedClient.phone}</span>
                    <span>·</span>
                    <span>{selectedClient.city}</span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => onOpenUploadModal?.(selectedClient.id)}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-amber-500 hover:bg-amber-400 text-neutral-950 text-xs font-bold rounded-lg transition-colors shadow-sm shadow-amber-500/10"
                    title="Upload photos or document files for this client"
                  >
                    <Upload className="w-3.5 h-3.5" />
                    <span>Upload Files</span>
                  </button>

                  {/* Simulate Log In as Client */}
                  <button
                    onClick={() => onSelectClientForPortal(selectedClient)}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-neutral-800 hover:bg-neutral-700 text-amber-400 hover:text-amber-300 text-xs font-semibold rounded-lg border border-neutral-700 transition-colors"
                    title="Open this client's portal ID"
                  >
                    <LogIn className="w-3.5 h-3.5" />
                    <span>Access Client ID Portal</span>
                  </button>

                  <button
                    onClick={() => setSelectedClient(null)}
                    className="p-1.5 text-neutral-400 hover:text-white rounded hover:bg-neutral-800 transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Passcode & Official Access Details */}
              <div className="p-3.5 rounded-lg bg-neutral-950/80 border border-neutral-800/80 flex items-center justify-between text-xs">
                <div className="flex items-center gap-3">
                  <KeyRound className="w-4 h-4 text-amber-400" />
                  <div>
                    <span className="text-neutral-400 block text-[11px]">Client Portal Access Passcode:</span>
                    <span className="font-mono font-bold text-white tracking-wider text-sm">
                      {selectedClient.accessPasscode}
                    </span>
                  </div>
                </div>
                <div className="text-[11px] text-neutral-500 max-w-xs text-right">
                  Client can log into their private gallery using this passcode or email.
                </div>
              </div>

              {/* Client Notes */}
              {selectedClient.notes && (
                <div className="p-3 rounded-lg bg-neutral-950/40 border border-neutral-800 text-xs text-neutral-300">
                  <span className="font-semibold text-neutral-400 block mb-1">Studio Work Order Notes:</span>
                  {selectedClient.notes}
                </div>
              )}

              {/* Section 1: Shoots Assigned to THIS Client */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-sm font-semibold text-white">
                    <Camera className="w-4 h-4 text-amber-400" />
                    <span>Assigned Productions &amp; Shoots</span>
                  </div>
                  <button
                    onClick={() => onOpenNewShootForClient(selectedClient.id)}
                    className="text-xs text-amber-400 hover:text-amber-300 flex items-center gap-1 font-medium"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Book Shoot for Client</span>
                  </button>
                </div>

                <div className="space-y-2">
                  {shoots
                    .filter((s) => s.clientId === selectedClient.id)
                    .map((shoot) => (
                      <div
                        key={shoot.id}
                        className="p-3 rounded-lg bg-neutral-950 border border-neutral-800 flex items-start justify-between gap-3 text-xs"
                      >
                        <div>
                          <div className="font-semibold text-white">{shoot.title}</div>
                          <div className="text-neutral-400 text-[11px] mt-0.5">
                            {shoot.packageTitle} · <span className="font-mono">{shoot.eventDate}</span>
                          </div>
                          <div className="text-neutral-500 text-[11px] mt-0.5">
                            Venue: {shoot.venue} · Lead: {shoot.leadPhotographer}
                          </div>
                          {shoot.masterDriveLink && (
                            <a
                              href={shoot.masterDriveLink}
                              target="_blank"
                              rel="noreferrer"
                              className="inline-flex items-center gap-1 text-[11px] text-amber-400 hover:underline mt-1"
                            >
                              <ExternalLink className="w-3 h-3" />
                              <span>Google Drive / Cloud Folder</span>
                            </a>
                          )}
                        </div>

                        <div className="text-right shrink-0">
                          <span className="inline-block px-2 py-0.5 rounded text-[10px] font-medium border border-neutral-700 bg-neutral-900 text-neutral-300">
                            {shoot.status.replace('_', ' ')}
                          </span>
                          <div className="mt-1 font-mono tabular-nums text-neutral-300">
                            Total: ₹{shoot.totalAmount.toLocaleString('en-IN')}
                          </div>
                        </div>
                      </div>
                    ))}
                </div>
              </div>

              {/* Section 2: Invoices for THIS Client */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-sm font-semibold text-white">
                    <FileText className="w-4 h-4 text-amber-400" />
                    <span>Client Invoices &amp; Billing History</span>
                  </div>
                  <button
                    onClick={() => onOpenNewInvoiceForClient(selectedClient.id)}
                    className="text-xs text-amber-400 hover:text-amber-300 flex items-center gap-1 font-medium"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Create Invoice</span>
                  </button>
                </div>

                <div className="space-y-2">
                  {invoices
                    .filter((i) => i.clientId === selectedClient.id)
                    .map((inv) => (
                      <div
                        key={inv.id}
                        className="p-3 rounded-lg bg-neutral-950 border border-neutral-800 flex items-center justify-between text-xs"
                      >
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-mono font-semibold text-white">{inv.invoiceNumber}</span>
                            <span
                              className={`text-[10px] px-1.5 py-0.2 rounded font-medium ${
                                inv.status === 'Paid'
                                  ? 'text-emerald-400 bg-emerald-950/60'
                                  : 'text-amber-400 bg-amber-950/60'
                              }`}
                            >
                              {inv.status}
                            </span>
                          </div>
                          <div className="text-neutral-500 text-[11px] mt-0.5">
                            Issued: {inv.issueDate} · Due: {inv.dueDate}
                          </div>
                        </div>

                        <div className="flex items-center gap-4">
                          <div className="text-right font-mono tabular-nums">
                            <div className="text-white font-medium">₹{inv.totalAmount.toLocaleString('en-IN')}</div>
                            <div className="text-[11px] text-emerald-400">
                              Paid: ₹{inv.paidAmount.toLocaleString('en-IN')}
                            </div>
                          </div>
                          <button
                            onClick={() => onViewInvoice(inv)}
                            className="px-2.5 py-1 text-xs text-neutral-300 hover:text-white bg-neutral-800 hover:bg-neutral-700 rounded transition-colors"
                          >
                            Print Invoice
                          </button>
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Add / Edit Client Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 bg-neutral-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="relative w-full max-w-lg bg-neutral-900 border border-neutral-800 rounded-xl shadow-2xl overflow-hidden">
            <div className="flex items-center justify-between px-6 py-4 border-b border-neutral-800">
              <h2 className="text-sm font-semibold text-white">
                {editingClient ? 'Edit Client Details' : 'Register New Studio Client'}
              </h2>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="p-1 text-neutral-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-neutral-300 mb-1">
                    Client Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g. Rahul & Neha Kapoor"
                    className="w-full bg-neutral-950 border border-neutral-700 rounded-lg px-3 py-2 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-neutral-300 mb-1">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="e.g. rahul.kapoor@example.com"
                    className="w-full bg-neutral-950 border border-neutral-700 rounded-lg px-3 py-2 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-neutral-300 mb-1">
                    Primary Phone Number *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="+91 98765 00000"
                    className="w-full bg-neutral-950 border border-neutral-700 rounded-lg px-3 py-2 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-neutral-300 mb-1">
                    City / Destination *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.city}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                    placeholder="e.g. Mumbai / Goa / Jaipur"
                    className="w-full bg-neutral-950 border border-neutral-700 rounded-lg px-3 py-2 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-neutral-300 mb-1">
                    Client Code ID (Official)
                  </label>
                  <input
                    type="text"
                    value={formData.clientCode}
                    onChange={(e) => setFormData({ ...formData, clientCode: e.target.value })}
                    className="w-full bg-neutral-950 border border-neutral-700 rounded-lg px-3 py-2 text-xs text-amber-400 font-mono focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-neutral-300 mb-1">
                    Portal Access Passcode
                  </label>
                  <input
                    type="text"
                    value={formData.accessPasscode}
                    onChange={(e) => setFormData({ ...formData, accessPasscode: e.target.value })}
                    className="w-full bg-neutral-950 border border-neutral-700 rounded-lg px-3 py-2 text-xs text-amber-400 font-mono focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-neutral-300 mb-1">
                  Studio Work Order Notes &amp; Preferences
                </label>
                <textarea
                  rows={3}
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  placeholder="e.g. Deliverable requirements, album paper preference, event dates..."
                  className="w-full bg-neutral-950 border border-neutral-700 rounded-lg px-3 py-2 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-amber-500"
                />
              </div>

              <div className="rounded-lg border border-neutral-800 bg-neutral-950 p-3 space-y-2">
                <label className="block text-xs font-medium text-neutral-300">
                  Client Profile Photo
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setClientPhotoFile(e.target.files?.[0] || null)}
                  className="block w-full text-xs text-neutral-300 file:mr-3 file:rounded-md file:border-0 file:bg-amber-500 file:px-3 file:py-2 file:text-xs file:font-semibold file:text-neutral-950"
                />
                {clientPhotoFile && (
                  <p className="text-xs text-amber-400">Selected: {clientPhotoFile.name}</p>
                )}
                <input
                  type="url"
                  value={clientPhotoUrl}
                  onChange={(e) => {
                    setClientPhotoUrl(e.target.value);
                    setClientPhotoFile(null);
                  }}
                  placeholder="Or paste an image URL (https://...)"
                  className="w-full bg-neutral-900 border border-neutral-700 rounded-lg px-3 py-2 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-amber-500"
                />
                <p className="text-[10px] text-neutral-500">
                  Local photos upload to Cloudinary and remain available after refresh.
                </p>
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-neutral-800">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 text-xs text-neutral-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isUploadingClientPhoto}
                  className="px-4 py-2 bg-amber-500 hover:bg-amber-400 disabled:opacity-50 text-neutral-950 text-xs font-semibold rounded-lg transition-colors"
                >
                  {isUploadingClientPhoto ? 'Uploading Photo...' : editingClient ? 'Save Changes' : 'Register Client'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
