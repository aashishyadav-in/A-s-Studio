import React, { useState } from 'react';
import { useStudio } from '../../context/StudioContext';
import { Shoot, Photo, Invoice } from '../../types';
import { PhotoLightbox } from '../common/PhotoLightbox';
import { OfficialInvoiceModal } from '../common/OfficialInvoiceModal';
import {
  Camera,
  FolderDown,
  Video,
  ExternalLink,
  CheckCircle2,
  Heart,
  Check,
  FileText,
  Printer,
  Sparkles,
  MessageSquare,
  Clock,
  Phone,
  Mail,
  Send,
  Download,
  AlertCircle,
} from 'lucide-react';

export const ClientPortal: React.FC = () => {
  const { currentUser, clients, shoots, photos, invoices, studioConfig, togglePhotoSelection, togglePhotoFavorite } = useStudio();
  const [activeTab, setActiveTab] = useState<'shoots' | 'proofing' | 'billing' | 'support'>('proofing');
  const [selectedShootId, setSelectedShootId] = useState<string>('');
  const [photoFilter, setPhotoFilter] = useState<'all' | 'selected' | 'favorites'>('all');
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIdx, setLightboxIdx] = useState(0);
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);
  const [clientRequestText, setClientRequestText] = useState('');
  const [requestSent, setRequestSent] = useState(false);
  const [selectionSubmitted, setSelectionSubmitted] = useState(false);

  // Match only the logged-in client; never fall back to another client's data.
  const client = currentUser?.clientId
    ? clients.find((c) => c.id === currentUser.clientId)
    : undefined;
  const clientShoots = shoots && client ? shoots.filter((s) => s.clientId === client.id) : [];
  const currentShoot =
    clientShoots.find((s) => s.id === selectedShootId) ||
    clientShoots[0];
  const clientInvoices = invoices && client ? invoices.filter((i) => i.clientId === client.id) : [];
  if (!client) {
    return (
      <div className="max-w-6xl mx-auto rounded-2xl border border-neutral-800 bg-neutral-900/60 p-8 text-center">
        <h2 className="text-xl font-semibold text-white">Client account not linked</h2>
        <p className="mt-2 text-sm text-neutral-400">
          Your login is not linked to a client profile. Please contact the studio administrator.
        </p>
      </div>
    );
  }

  // Shoot photos
  const shootPhotos = currentShoot ? photos.filter((p) => p.shootId === currentShoot.id) : [];
  const selectedCount = shootPhotos.filter((p) => p.isSelectedForAlbum).length;
  const albumQuota = 80;

  const filteredPhotos = shootPhotos.filter((p) => {
    if (photoFilter === 'selected') return p.isSelectedForAlbum;
    if (photoFilter === 'favorites') return p.isFavorite;
    return true;
  });

  const handleOpenLightbox = (index: number) => {
    setLightboxIdx(index);
    setLightboxOpen(true);
  };

  const handleSendRequest = (e: React.FormEvent) => {
    e.preventDefault();
    if (!clientRequestText) return;
    setRequestSent(true);
    setTimeout(() => {
      setClientRequestText('');
      setRequestSent(false);
    }, 4000);
  };

  const handleSubmitAlbumSelection = () => {
    setSelectionSubmitted(true);
    setTimeout(() => setSelectionSubmitted(false), 5000);
  };

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      {/* Client Welcome Banner */}
      <div className="relative rounded-2xl overflow-hidden border border-neutral-800 bg-neutral-900/60 p-6 sm:p-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono text-amber-400 mb-2">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Client Access Portal · ID: {client.clientCode}</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
              Welcome, {client.name}
            </h1>
            <p className="text-xs sm:text-sm text-neutral-400 mt-1 max-w-xl">
              Access your studio productions, download high-resolution media, shortlist album proofs, and view official billing receipts.
            </p>
          </div>

          {/* Quick Stats Pill */}
          <div className="flex items-center gap-4 bg-neutral-950/80 border border-neutral-800 rounded-xl p-4 shrink-0">
            <div className="text-center px-2">
              <div className="text-xl font-bold text-white font-mono">{clientShoots.length}</div>
              <div className="text-[10px] text-neutral-400 uppercase mt-0.5">Productions</div>
            </div>
            <div className="h-8 w-px bg-neutral-800" />
            <div className="text-center px-2">
              <div className="text-xl font-bold text-amber-400 font-mono">{selectedCount}</div>
              <div className="text-[10px] text-neutral-400 uppercase mt-0.5">Album Selected</div>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center gap-2 mt-8 pt-4 border-t border-neutral-800 overflow-x-auto">
          <button
            onClick={() => setActiveTab('shoots')}
            className={`px-4 py-2 text-xs font-medium rounded-lg transition-colors whitespace-nowrap flex items-center gap-2 ${
              activeTab === 'shoots'
                ? 'bg-amber-500 text-neutral-950 font-semibold shadow-md'
                : 'text-neutral-400 hover:text-white bg-neutral-950/50 hover:bg-neutral-800'
            }`}
          >
            <Camera className="w-4 h-4" />
            <span>My Shoots &amp; Cloud Downloads</span>
          </button>

          <button
            onClick={() => setActiveTab('proofing')}
            className={`px-4 py-2 text-xs font-medium rounded-lg transition-colors whitespace-nowrap flex items-center gap-2 ${
              activeTab === 'proofing'
                ? 'bg-amber-500 text-neutral-950 font-semibold shadow-md'
                : 'text-neutral-400 hover:text-white bg-neutral-950/50 hover:bg-neutral-800'
            }`}
          >
            <Sparkles className="w-4 h-4" />
            <span>Photo Proofing &amp; Album Selection</span>
          </button>

          <button
            onClick={() => setActiveTab('billing')}
            className={`px-4 py-2 text-xs font-medium rounded-lg transition-colors whitespace-nowrap flex items-center gap-2 ${
              activeTab === 'billing'
                ? 'bg-amber-500 text-neutral-950 font-semibold shadow-md'
                : 'text-neutral-400 hover:text-white bg-neutral-950/50 hover:bg-neutral-800'
            }`}
          >
            <FileText className="w-4 h-4" />
            <span>Invoices &amp; Official Receipts</span>
          </button>

          <button
            onClick={() => setActiveTab('support')}
            className={`px-4 py-2 text-xs font-medium rounded-lg transition-colors whitespace-nowrap flex items-center gap-2 ${
              activeTab === 'support'
                ? 'bg-amber-500 text-neutral-950 font-semibold shadow-md'
                : 'text-neutral-400 hover:text-white bg-neutral-950/50 hover:bg-neutral-800'
            }`}
          >
            <Phone className="w-4 h-4" />
            <span>Studio Desk &amp; Requests</span>
          </button>
        </div>
      </div>

      {/* Tab 1: My Shoots & Deliverables */}
      {activeTab === 'shoots' && (
        <div className="space-y-6">
          <div className="text-xs text-neutral-400">
            Select a shoot below to view deliverables and access cloud download links:
          </div>

          <div className="space-y-6">
            {clientShoots.map((shoot) => (
              <div
                key={shoot.id}
                className="rounded-2xl border border-neutral-800 bg-neutral-900/60 overflow-hidden"
              >
                <div className="grid grid-cols-1 md:grid-cols-3">
                  {/* Shoot Cover Image */}
                  <div className="relative h-56 md:h-full bg-neutral-950">
                    <img
                      src={shoot.coverImage}
                      alt={shoot.title}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-neutral-950/30 to-transparent" />
                    <div className="absolute bottom-4 left-4">
                      <span className="px-2.5 py-1 rounded text-xs font-semibold bg-amber-500 text-neutral-950">
                        {shoot.type}
                      </span>
                    </div>
                  </div>

                  {/* Shoot Details & Status */}
                  <div className="p-6 md:col-span-2 space-y-6 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between gap-2">
                        <h2 className="text-lg font-bold text-white">{shoot.title}</h2>
                        <span className="px-2.5 py-1 rounded text-xs font-medium bg-neutral-800 text-neutral-300 border border-neutral-700">
                          Status: {shoot.status.replace('_', ' ')}
                        </span>
                      </div>

                      <div className="text-xs text-neutral-400 mt-1">
                        Package: <span className="text-neutral-200 font-medium">{shoot.packageTitle}</span>
                      </div>

                      <div className="grid grid-cols-2 gap-4 text-xs text-neutral-400 mt-4 pt-4 border-t border-neutral-800">
                        <div>
                          <span className="text-[11px] text-neutral-500 block uppercase">Event Date</span>
                          <span className="text-white font-mono">{shoot.eventDate}</span>
                        </div>
                        <div>
                          <span className="text-[11px] text-neutral-500 block uppercase">Venue</span>
                          <span className="text-white">{shoot.venue}</span>
                        </div>
                        <div>
                          <span className="text-[11px] text-neutral-500 block uppercase">Lead Cinematographer</span>
                          <span className="text-white">{shoot.leadPhotographer}</span>
                        </div>
                        <div>
                          <span className="text-[11px] text-neutral-500 block uppercase">Payment Status</span>
                          <span className={shoot.balanceDue > 0 ? 'text-amber-400 font-mono' : 'text-emerald-400'}>
                            {shoot.balanceDue > 0 ? `₹${shoot.balanceDue.toLocaleString('en-IN')} Due` : 'Fully Settled'}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Deliverables Action Row */}
                    <div className="p-4 rounded-xl bg-neutral-950 border border-neutral-800 space-y-3">
                      <div className="text-xs font-semibold text-neutral-300 uppercase tracking-wider">
                        Official Cloud Deliverables:
                      </div>

                      <div className="flex flex-wrap items-center gap-3">
                        {shoot.masterDriveLink ? (
                          <a
                            href={shoot.masterDriveLink}
                            target="_blank"
                            rel="noreferrer"
                            className="flex items-center gap-2 px-4 py-2 bg-amber-500 hover:bg-amber-400 text-neutral-950 font-semibold text-xs rounded-lg transition-colors shadow-sm"
                          >
                            <FolderDown className="w-4 h-4" />
                            <span>Download Full Drive (High-Res)</span>
                            <ExternalLink className="w-3 h-3" />
                          </a>
                        ) : (
                          <span className="text-xs text-neutral-500 italic">Cloud link being processed</span>
                        )}

                        {shoot.teaserVideoLink && (
                          <a
                            href={shoot.teaserVideoLink}
                            target="_blank"
                            rel="noreferrer"
                            className="flex items-center gap-2 px-3.5 py-2 bg-neutral-800 hover:bg-neutral-700 text-white font-medium text-xs rounded-lg border border-neutral-700 transition-colors"
                          >
                            <Video className="w-4 h-4 text-amber-400" />
                            <span>Watch 4K Teaser Reel</span>
                          </a>
                        )}

                        <button
                          onClick={() => {
                            setSelectedShootId(shoot.id);
                            setActiveTab('proofing');
                          }}
                          className="flex items-center gap-2 px-3.5 py-2 bg-neutral-800 hover:bg-neutral-700 text-amber-400 font-medium text-xs rounded-lg border border-neutral-700 transition-colors"
                        >
                          <Sparkles className="w-4 h-4" />
                          <span>Select Photos for Album →</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 2: Photo Proofing & Album Selection */}
      {activeTab === 'proofing' && (
        <div className="space-y-6">
          {/* Shoot Selector & Progress */}
          <div className="p-6 rounded-2xl bg-neutral-900/60 border border-neutral-800 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xs text-neutral-400">Selecting for Shoot:</span>
                <select
                  value={currentShoot?.id}
                  onChange={(e) => setSelectedShootId(e.target.value)}
                  className="bg-neutral-950 border border-neutral-700 rounded-lg px-2.5 py-1 text-xs text-amber-400 font-semibold focus:outline-none focus:border-amber-500"
                >
                  {clientShoots.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.title}
                    </option>
                  ))}
                </select>
              </div>
              <h2 className="text-base font-bold text-white">Album Selection &amp; Print Proofing</h2>
              <p className="text-xs text-neutral-400 mt-0.5">
                Click on the checkmark to select photos for your handcrafted Italian velvet heirloom album.
              </p>
            </div>

            {/* Album Selection Counter & Submit */}
            <div className="space-y-2 min-w-[240px]">
              <div className="flex items-center justify-between text-xs">
                <span className="text-neutral-300 font-medium">Selected for Album:</span>
                <span className="font-mono text-amber-400 font-bold">
                  {selectedCount} / {albumQuota} Photos
                </span>
              </div>
              <div className="w-full h-2 bg-neutral-950 rounded-full overflow-hidden border border-neutral-800">
                <div
                  className="h-full bg-amber-500 rounded-full transition-all duration-300"
                  style={{ width: `${Math.min(100, (selectedCount / albumQuota) * 100)}%` }}
                />
              </div>
              <button
                onClick={handleSubmitAlbumSelection}
                className="w-full py-2 px-3 bg-amber-500 hover:bg-amber-400 text-neutral-950 font-semibold text-xs rounded-lg transition-colors flex items-center justify-center gap-1.5"
              >
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Submit Album Selection to Studio</span>
              </button>
            </div>
          </div>

          {selectionSubmitted && (
            <div className="p-4 rounded-xl bg-emerald-950/50 border border-emerald-800/80 text-xs text-emerald-300 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>
                Selection confirmed! Your {selectedCount} shortlisted photos have been sent to our album design team.
              </span>
            </div>
          )}

          {/* Filter Pills */}
          <div className="flex items-center justify-between gap-4 flex-wrap">
            <div className="flex items-center gap-2 text-xs">
              <button
                onClick={() => setPhotoFilter('all')}
                className={`px-3 py-1.5 rounded-lg transition-colors ${
                  photoFilter === 'all'
                    ? 'bg-neutral-800 text-white font-medium shadow-sm'
                    : 'text-neutral-400 hover:text-white'
                }`}
              >
                All Photos ({shootPhotos.length})
              </button>
              <button
                onClick={() => setPhotoFilter('selected')}
                className={`px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1.5 ${
                  photoFilter === 'selected'
                    ? 'bg-amber-500 text-neutral-950 font-semibold'
                    : 'text-neutral-400 hover:text-white'
                }`}
              >
                <Check className="w-3.5 h-3.5" />
                <span>Selected for Album ({selectedCount})</span>
              </button>
              <button
                onClick={() => setPhotoFilter('favorites')}
                className={`px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1.5 ${
                  photoFilter === 'favorites'
                    ? 'bg-rose-500 text-white font-medium'
                    : 'text-neutral-400 hover:text-white'
                }`}
              >
                <Heart className="w-3.5 h-3.5" />
                <span>Favorites</span>
              </button>
            </div>

            <span className="text-xs text-neutral-500">
              Tip: Click any photo to inspect full resolution and add editing notes
            </span>
          </div>

          {/* Photos Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {filteredPhotos.map((photo, idx) => (
              <div
                key={photo.id}
                className={`relative rounded-xl overflow-hidden border transition-all group bg-neutral-950 aspect-square flex flex-col justify-between ${
                  photo.isSelectedForAlbum
                    ? 'border-amber-500 shadow-md shadow-amber-500/10 ring-1 ring-amber-500'
                    : 'border-neutral-800 hover:border-neutral-700'
                }`}
              >
                {/* Image */}
                <div
                  onClick={() => handleOpenLightbox(idx)}
                  className="w-full h-full cursor-pointer relative"
                >
                  <img
                    src={photo.url}
                    alt={photo.title}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-neutral-950/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>

                {/* Top Action Overlay */}
                <div className="absolute top-2.5 left-2.5 right-2.5 flex items-center justify-between">
                  {/* Select for Album Button */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      togglePhotoSelection(photo.id);
                    }}
                    className={`px-2 py-1 rounded-md text-[11px] font-semibold flex items-center gap-1 shadow-md transition-all ${
                      photo.isSelectedForAlbum
                        ? 'bg-amber-500 text-neutral-950 ring-2 ring-amber-400'
                        : 'bg-neutral-900/80 hover:bg-neutral-800 text-neutral-200 backdrop-blur-sm border border-neutral-700/60'
                    }`}
                  >
                    <Check className={`w-3.5 h-3.5 ${photo.isSelectedForAlbum ? 'stroke-[3]' : ''}`} />
                    <span>{photo.isSelectedForAlbum ? 'Selected' : 'Select'}</span>
                  </button>

                  {/* Favorite Button */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      togglePhotoFavorite(photo.id);
                    }}
                    className={`p-1.5 rounded-full transition-colors backdrop-blur-sm ${
                      photo.isFavorite
                        ? 'bg-rose-500 text-white'
                        : 'bg-neutral-900/80 hover:bg-neutral-800 text-neutral-300 border border-neutral-700/60'
                    }`}
                  >
                    <Heart className={`w-3.5 h-3.5 ${photo.isFavorite ? 'fill-white' : ''}`} />
                  </button>
                </div>

                {/* Bottom Title & Notes */}
                <div
                  onClick={() => handleOpenLightbox(idx)}
                  className="absolute bottom-2 left-2 right-2 text-left cursor-pointer"
                >
                  <div className="text-[11px] font-medium text-white truncate drop-shadow">
                    {photo.title || 'Studio Shot'}
                  </div>
                  {photo.clientNotes && (
                    <div className="text-[10px] text-amber-300 font-medium truncate drop-shadow flex items-center gap-1">
                      <MessageSquare className="w-3 h-3 shrink-0" />
                      <span>{photo.clientNotes}</span>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 3: Invoices & Receipts */}
      {activeTab === 'billing' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between pb-2 border-b border-neutral-800">
            <div>
              <h2 className="text-base font-bold text-white">Your Official Invoices &amp; Receipts</h2>
              <p className="text-xs text-neutral-400 mt-0.5">
                Download verified tax invoices and track payment milestones.
              </p>
            </div>
          </div>

          <div className="space-y-4">
            {clientInvoices.map((inv) => {
              const shoot = shoots.find((s) => s.id === inv.shootId);
              const balanceDue = inv.totalAmount - inv.paidAmount;

              return (
                <div
                  key={inv.id}
                  className="p-6 rounded-2xl bg-neutral-900/60 border border-neutral-800 flex flex-col md:flex-row items-start md:items-center justify-between gap-6"
                >
                  <div className="space-y-2">
                    <div className="flex items-center gap-3">
                      <span className="font-mono text-base font-bold text-amber-400">
                        {inv.invoiceNumber}
                      </span>
                      <span
                        className={`text-xs px-2.5 py-0.5 rounded font-medium ${
                          inv.status === 'Paid'
                            ? 'bg-emerald-950/80 text-emerald-400 border border-emerald-800/60'
                            : 'bg-amber-950/80 text-amber-400 border border-amber-800/60'
                        }`}
                      >
                        {inv.status}
                      </span>
                    </div>

                    <div className="text-xs text-neutral-300 font-medium">
                      Project: {shoot?.title || 'Studio Production Session'}
                    </div>

                    <div className="text-xs text-neutral-500 font-mono">
                      Issue Date: {inv.issueDate} · Due Date: {inv.dueDate}
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6 self-stretch md:self-auto justify-between border-t md:border-t-0 pt-4 md:pt-0 border-neutral-800">
                    <div className="text-left md:text-right font-mono text-xs space-y-1">
                      <div className="text-neutral-400">
                        Total Amount: <span className="text-white font-bold">₹{inv.totalAmount.toLocaleString('en-IN')}</span>
                      </div>
                      <div className="text-emerald-400">
                        Amount Paid: <span className="font-semibold">₹{inv.paidAmount.toLocaleString('en-IN')}</span>
                      </div>
                      {balanceDue > 0 && (
                        <div className="text-amber-400 font-semibold">
                          Balance Due: ₹{balanceDue.toLocaleString('en-IN')}
                        </div>
                      )}
                    </div>

                    <button
                      onClick={() => setSelectedInvoice(inv)}
                      className="flex items-center gap-2 px-4 py-2 bg-neutral-800 hover:bg-neutral-700 text-white font-medium text-xs rounded-lg border border-neutral-700 transition-colors whitespace-nowrap"
                    >
                      <Printer className="w-3.5 h-3.5 text-amber-400" />
                      <span>Print Official Invoice</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Payment Guidance Box */}
          <div className="p-5 rounded-xl bg-neutral-950 border border-neutral-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-xs">
            <div>
              <div className="font-semibold text-white">Payment Methods &amp; Studio Bank Account</div>
              <div className="text-neutral-400 text-[11px] mt-0.5">
                Bank: {studioConfig.bankDetails.bankName} · A/C: {studioConfig.bankDetails.accountNumber} · IFSC: {studioConfig.bankDetails.ifscCode} · UPI: {studioConfig.bankDetails.upiId}
              </div>
            </div>
            <span className="text-neutral-500 text-[11px]">Official Tax Invoice GSTIN: {studioConfig.gstNumber}</span>
          </div>
        </div>
      )}

      {/* Tab 4: Studio Support & Custom Notes */}
      {activeTab === 'support' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="p-6 rounded-2xl bg-neutral-900/60 border border-neutral-800 space-y-4">
            <h2 className="text-base font-bold text-white">Official Studio Contacts</h2>
            <div className="space-y-3 text-xs text-neutral-300">
              <div className="p-3 rounded-lg bg-neutral-950 border border-neutral-800">
                <span className="text-[11px] text-neutral-500 block">Lead Creative Director</span>
                <span className="font-semibold text-white text-sm">{studioConfig.ownerName}</span>
                <div className="text-neutral-400 mt-1">{studioConfig.phone}</div>
              </div>

              <div className="p-3 rounded-lg bg-neutral-950 border border-neutral-800">
                <span className="text-[11px] text-neutral-500 block">Studio Atelier &amp; Lounge Address</span>
                <div className="text-neutral-300 mt-1">{studioConfig.address}</div>
              </div>

              <div className="p-3 rounded-lg bg-neutral-950 border border-neutral-800">
                <span className="text-[11px] text-neutral-500 block">Official Support Email</span>
                <div className="text-amber-400 font-mono mt-1">{studioConfig.email}</div>
              </div>
            </div>
          </div>

          <div className="p-6 rounded-2xl bg-neutral-900/60 border border-neutral-800 space-y-4">
            <h2 className="text-base font-bold text-white">Send Request or Retouching Note</h2>
            <p className="text-xs text-neutral-400">
              Have a special request, timeline update, or album cover preference? Message the studio directly:
            </p>

            <form onSubmit={handleSendRequest} className="space-y-4 text-xs">
              <textarea
                rows={5}
                required
                value={clientRequestText}
                onChange={(e) => setClientRequestText(e.target.value)}
                placeholder="Write your note here... (e.g. Please deliver the vertical reels before Saturday, or check photo #12 for skin tones)"
                className="w-full bg-neutral-950 border border-neutral-700 rounded-lg p-3 text-white placeholder-neutral-500 focus:outline-none focus:border-amber-500"
              />

              <button
                type="submit"
                className="w-full py-2.5 px-4 bg-amber-500 hover:bg-amber-400 text-neutral-950 font-semibold rounded-lg transition-colors flex items-center justify-center gap-2"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Send to Studio Team</span>
              </button>

              {requestSent && (
                <div className="p-3 rounded-lg bg-emerald-950/60 border border-emerald-800/80 text-emerald-300 text-xs flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Request received! The studio director will review and update your project.</span>
                </div>
              )}
            </form>
          </div>
        </div>
      )}

      {/* Lightbox for high-res photo inspection */}
      <PhotoLightbox
        photos={shootPhotos}
        currentIndex={lightboxIdx}
        isOpen={lightboxOpen}
        onClose={() => setLightboxOpen(false)}
        onNavigate={(idx) => setLightboxIdx(idx)}
        isClientView={true}
      />

      {/* Official Invoice Modal */}
      {selectedInvoice && (
        <OfficialInvoiceModal
          invoice={selectedInvoice}
          client={client}
          shoot={shoots.find((s) => s.id === selectedInvoice.shootId)}
          studioConfig={studioConfig}
          isOpen={true}
          onClose={() => setSelectedInvoice(null)}
        />
      )}
    </div>
  );
};
