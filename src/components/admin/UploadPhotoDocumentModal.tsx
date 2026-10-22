import React, { useState } from 'react';
import { useStudio } from '../../context/StudioContext';
import {
  X,
  Upload,
  FileText,
  Image as ImageIcon,
  CheckCircle2,
  FolderOpen,
  Link as LinkIcon,
  Shield,
  FileCheck,
  AlertCircle,
} from 'lucide-react';
import { DocumentCategory } from '../../types';

interface UploadPhotoDocumentModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialClientId?: string;
  initialShootId?: string;
}

export const UploadPhotoDocumentModal: React.FC<UploadPhotoDocumentModalProps> = ({
  isOpen,
  onClose,
  initialClientId,
  initialShootId,
}) => {
  if (!isOpen) return null;

  const { clients, shoots, addPhoto, addDocument } = useStudio();

  const [activeType, setActiveType] = useState<'photo' | 'document'>('photo');
  const [selectedClientId, setSelectedClientId] = useState(
    initialClientId || clients[0]?.id || ''
  );
  const [selectedShootId, setSelectedShootId] = useState(initialShootId || '');

  // Photo form states
  const [photoTitle, setPhotoTitle] = useState('');
  const [photoCategory, setPhotoCategory] = useState('Portraits & Highlights');
  const [photoUrl, setPhotoUrl] = useState('');
  const [selectedPhotoFile, setSelectedPhotoFile] = useState<File | null>(null);
  const [isPhotoUploading, setIsPhotoUploading] = useState(false);

  const [photoResolution, setPhotoResolution] = useState('100MP Hasselblad RAW (8K)');
  const [photoNotes, setPhotoNotes] = useState('');

  // Document form states
  const [docTitle, setDocTitle] = useState('');
  const [docCategory, setDocCategory] = useState<DocumentCategory>('Contract & Agreement');
  const [fileName, setFileName] = useState('');
  const [fileSize, setFileSize] = useState('2.4 MB');
  const [fileType, setFileType] = useState('PDF Document');
  const [docUrl, setDocUrl] = useState('');
  const [docNotes, setDocNotes] = useState('');

  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  // Client shoots
  const clientShoots = shoots.filter((s) => s.clientId === selectedClientId);

  const handleLocalFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (activeType === 'photo') {
      const localUrl = URL.createObjectURL(file);
      setSelectedPhotoFile(file);
      setPhotoUrl(localUrl);
      if (!photoTitle) setPhotoTitle(file.name.replace(/\.[^/.]+$/, ''));
      setPhotoResolution(`${(file.size / (1024 * 1024)).toFixed(1)} MB · High-Res`);
    } else {
      setFileName(file.name);
      setFileSize(`${(file.size / (1024 * 1024)).toFixed(1)} MB`);
      setFileType(file.type || 'PDF Document');
      if (!docTitle) setDocTitle(file.name.replace(/\.[^/.]+$/, ''));
      setDocUrl(URL.createObjectURL(file));
    }
  };

  const handlePhotoSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    if (!selectedPhotoFile && !photoUrl.trim()) {
      setErrorMsg('Please select a photo file or provide an image URL.');
      return;
    }

    setIsPhotoUploading(true);

    try {
      let permanentPhotoUrl = photoUrl.trim();

      if (selectedPhotoFile) {
        const token = localStorage.getItem('aurastudio_auth_token');
        if (!token) {
          throw new Error('Admin session not found. Please log in again.');
        }

        const formData = new FormData();
        formData.append('image', selectedPhotoFile);

        const response = await fetch(
          `${import.meta.env.VITE_API_URL || 'http://localhost:5001'}/api/gallery/upload`,
          {
            method: 'POST',
            headers: { Authorization: `Bearer ${token}` },
            body: formData,
          }
        );

        const result = await response.json().catch(() => ({}));
        if (!response.ok) {
          throw new Error(result.message || `Photo upload failed (${response.status}).`);
        }
        if (!result.url) {
          throw new Error('Cloudinary did not return a permanent photo URL.');
        }

        permanentPhotoUrl = result.url;
      }

      const shootIdToUse = selectedShootId || clientShoots[0]?.id || 'sht-1';

      addPhoto({
        shootId: shootIdToUse,
        title: photoTitle.trim() || 'Studio Deliverable Photo',
        category: photoCategory,
        url: permanentPhotoUrl,
        resolution: photoResolution,
        isSelectedForAlbum: false,
        isFavorite: false,
        clientNotes: photoNotes.trim() || undefined,
      });

      setPhotoUrl(permanentPhotoUrl);
      setSelectedPhotoFile(null);
      setSuccessMsg('Photo uploaded and added to the client gallery.');
      setTimeout(() => onClose(), 1500);
    } catch (error) {
      setErrorMsg(
        error instanceof Error ? error.message : 'Could not upload the photo.'
      );
    } finally {
      setIsPhotoUploading(false);
    }
  };

  const handleDocumentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    if (!docTitle.trim()) {
      setErrorMsg('Please enter a document title.');
      return;
    }

    addDocument({
      clientId: selectedClientId,
      shootId: selectedShootId || undefined,
      title: docTitle.trim(),
      fileName: fileName.trim() || `${docTitle.trim().toLowerCase().replace(/\s+/g, '_')}.pdf`,
      fileSize: fileSize.trim() || '1.8 MB',
      fileType: fileType.trim() || 'PDF Document',
      category: docCategory,
      downloadUrl: docUrl.trim() || undefined,
      notes: docNotes.trim() || undefined,
    });

    setSuccessMsg('Document file successfully uploaded to client records!');
    setTimeout(() => {
      onClose();
    }, 1500);
  };

  const selectedClient = clients.find((c) => c.id === selectedClientId);

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-neutral-950/85 backdrop-blur-md flex items-center justify-center p-4">
      <div className="relative w-full max-w-xl bg-neutral-900 border border-neutral-800 rounded-2xl shadow-2xl overflow-hidden p-6 space-y-5 animate-in fade-in-50 zoom-in-95">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-neutral-800">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400">
              <Upload className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white tracking-tight">
                Upload Photo &amp; Document Files
              </h3>
              <p className="text-[11px] text-neutral-400">
                Directly deliver client photos, proofing files, contracts &amp; drive manifests
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

        {/* Client & Shoot Selector */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-3 bg-neutral-950 rounded-xl border border-neutral-800/80">
          <div>
            <label className="block text-[11px] font-medium text-neutral-400 mb-1">
              Deliver To Client
            </label>
            <select
              value={selectedClientId}
              onChange={(e) => {
                setSelectedClientId(e.target.value);
                setSelectedShootId('');
              }}
              className="w-full bg-neutral-900 border border-neutral-700 rounded-lg px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-amber-500"
            >
              {clients.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name} ({c.clientCode})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-[11px] font-medium text-neutral-400 mb-1">
              Associate Shoot Project
            </label>
            <select
              value={selectedShootId}
              onChange={(e) => setSelectedShootId(e.target.value)}
              className="w-full bg-neutral-900 border border-neutral-700 rounded-lg px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-amber-500"
            >
              <option value="">General Client Deliverables</option>
              {clientShoots.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.title} ({s.type})
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Type Toggle: Photo vs Document */}
        <div className="grid grid-cols-2 gap-2 p-1 bg-neutral-950 rounded-xl border border-neutral-800">
          <button
            type="button"
            onClick={() => {
              setActiveType('photo');
              setErrorMsg('');
              setSuccessMsg('');
            }}
            className={`py-2 px-3 text-xs font-semibold rounded-lg flex items-center justify-center gap-1.5 transition-all ${
              activeType === 'photo'
                ? 'bg-amber-500 text-neutral-950 shadow-sm'
                : 'text-neutral-400 hover:text-white'
            }`}
          >
            <ImageIcon className="w-3.5 h-3.5" />
            <span>Upload Photo Proof</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setActiveType('document');
              setErrorMsg('');
              setSuccessMsg('');
            }}
            className={`py-2 px-3 text-xs font-semibold rounded-lg flex items-center justify-center gap-1.5 transition-all ${
              activeType === 'document'
                ? 'bg-amber-500 text-neutral-950 shadow-sm'
                : 'text-neutral-400 hover:text-white'
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            <span>Upload Document / Contract</span>
          </button>
        </div>

        {/* Status Messages */}
        {errorMsg && (
          <div className="p-3 bg-rose-500/10 border border-rose-500/30 rounded-xl text-rose-400 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {successMsg && (
          <div className="p-3 bg-emerald-500/10 border border-emerald-500/30 rounded-xl text-emerald-400 text-xs flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>{successMsg}</span>
          </div>
        )}

        {/* PHOTO FORM */}
        {activeType === 'photo' && (
          <form onSubmit={handlePhotoSubmit} className="space-y-3.5">
            <div>
              <label className="block text-xs font-medium text-neutral-300 mb-1">
                Choose Local Photo File
              </label>
              <input
                type="file"
                accept="image/*"
                onChange={handleLocalFileChange}
                className="w-full text-xs text-neutral-400 file:mr-3 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-amber-500 file:text-neutral-950 hover:file:bg-amber-400 cursor-pointer"
              />
            </div>

            {photoUrl && (
              <div className="p-2 bg-neutral-950 rounded-xl border border-neutral-800 flex items-center gap-3">
                <img
                  src={photoUrl}
                  alt="Preview"
                  className="w-14 h-14 object-cover rounded-lg border border-neutral-700 shrink-0"
                />
                <div className="text-xs text-neutral-300 truncate">
                  <span className="font-semibold text-white block">Preview Selected</span>
                  <span className="text-[11px] text-neutral-400">{photoResolution}</span>
                </div>
              </div>
            )}

            <div>
              <label className="block text-xs font-medium text-neutral-300 mb-1">
                Or Photo Image URL / Cloud CDN
              </label>
              <input
                type="url"
                placeholder="https://images.unsplash.com/... or cloud drive url"
                value={photoUrl}
                onChange={(e) => {
                  setPhotoUrl(e.target.value);
                  setSelectedPhotoFile(null);
                }}
                className="w-full bg-neutral-950 border border-neutral-700 rounded-xl px-3 py-2 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-amber-500"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-neutral-300 mb-1">
                  Photo Title
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Royal Palace Portrait #04"
                  value={photoTitle}
                  onChange={(e) => setPhotoTitle(e.target.value)}
                  className="w-full bg-neutral-950 border border-neutral-700 rounded-xl px-3 py-2 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-neutral-300 mb-1">
                  Category Tag
                </label>
                <select
                  value={photoCategory}
                  onChange={(e) => setPhotoCategory(e.target.value)}
                  className="w-full bg-neutral-950 border border-neutral-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
                >
                  <option>Portraits &amp; Highlights</option>
                  <option>Royal Wedding Rituals</option>
                  <option>Couture &amp; Fashion Editorial</option>
                  <option>Cinema 4K Film Stills</option>
                  <option>Drone Aerial Perspectives</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-neutral-300 mb-1">
                Client Proofing Notes (Optional)
              </label>
              <input
                type="text"
                placeholder="e.g. Color corrected. Ready for Italian album selection."
                value={photoNotes}
                onChange={(e) => setPhotoNotes(e.target.value)}
                className="w-full bg-neutral-950 border border-neutral-700 rounded-xl px-3 py-2 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-amber-500"
              />
            </div>

            <div className="pt-2 flex items-center gap-2">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 py-2.5 bg-neutral-800 hover:bg-neutral-700 text-neutral-300 text-xs font-semibold rounded-xl transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isPhotoUploading}
                className="flex-1 py-2.5 disabled:opacity-50 bg-amber-500 hover:bg-amber-400 text-neutral-950 text-xs font-bold rounded-xl transition-colors shadow-md shadow-amber-500/10 flex items-center justify-center gap-1.5"
              >
                <Upload className="w-3.5 h-3.5" />
                <span>{isPhotoUploading ? 'Uploading Photo...' : 'Deliver Photo to Client'}</span>
              </button>
            </div>
          </form>
        )}

        {/* DOCUMENT FORM */}
        {activeType === 'document' && (
          <form onSubmit={handleDocumentSubmit} className="space-y-3.5">
            <div>
              <label className="block text-xs font-medium text-neutral-300 mb-1">
                Select Document File (PDF, DOCX, ZIP, Manifest)
              </label>
              <input
                type="file"
                onChange={handleLocalFileChange}
                className="w-full text-xs text-neutral-400 file:mr-3 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-amber-500 file:text-neutral-950 hover:file:bg-amber-400 cursor-pointer"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-neutral-300 mb-1">
                  Document Title
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Countersigned Wedding Contract"
                  value={docTitle}
                  onChange={(e) => setDocTitle(e.target.value)}
                  className="w-full bg-neutral-950 border border-neutral-700 rounded-xl px-3 py-2 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-neutral-300 mb-1">
                  Document Classification
                </label>
                <select
                  value={docCategory}
                  onChange={(e) => setDocCategory(e.target.value as DocumentCategory)}
                  className="w-full bg-neutral-950 border border-neutral-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
                >
                  <option value="Contract & Agreement">Contract &amp; Agreement</option>
                  <option value="Model Release">Model Release</option>
                  <option value="Creative Brief & Moodboard">Creative Brief &amp; Moodboard</option>
                  <option value="Delivery Receipt">Delivery Receipt</option>
                  <option value="High-Res Drive Link">High-Res Drive Link</option>
                  <option value="Print & Album Specifications">Print &amp; Album Specifications</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-neutral-300 mb-1">
                  File Name
                </label>
                <input
                  type="text"
                  placeholder="Contract_Signed.pdf"
                  value={fileName}
                  onChange={(e) => setFileName(e.target.value)}
                  className="w-full bg-neutral-950 border border-neutral-700 rounded-xl px-3 py-2 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-amber-500 font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-neutral-300 mb-1">
                  File Size / Format
                </label>
                <input
                  type="text"
                  placeholder="e.g. 3.4 MB PDF"
                  value={fileSize}
                  onChange={(e) => setFileSize(e.target.value)}
                  className="w-full bg-neutral-950 border border-neutral-700 rounded-xl px-3 py-2 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-amber-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-neutral-300 mb-1">
                Google Drive or Download Link (Optional)
              </label>
              <div className="relative">
                <LinkIcon className="w-3.5 h-3.5 text-neutral-500 absolute left-3 top-3" />
                <input
                  type="text"
                  placeholder="https://drive.google.com/drive/folders/..."
                  value={docUrl}
                  onChange={(e) => setDocUrl(e.target.value)}
                  className="w-full bg-neutral-950 border border-neutral-700 rounded-xl pl-8 pr-3 py-2 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-amber-500 font-mono"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-neutral-300 mb-1">
                Client Notes / Instructions
              </label>
              <input
                type="text"
                placeholder="e.g. Please review section 4 regarding album delivery timelines."
                value={docNotes}
                onChange={(e) => setDocNotes(e.target.value)}
                className="w-full bg-neutral-950 border border-neutral-700 rounded-xl px-3 py-2 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-amber-500"
              />
            </div>

            <div className="pt-2 flex items-center gap-2">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 py-2.5 bg-neutral-800 hover:bg-neutral-700 text-neutral-300 text-xs font-semibold rounded-xl transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex-1 py-2.5 bg-amber-500 hover:bg-amber-400 text-neutral-950 text-xs font-bold rounded-xl transition-colors shadow-md shadow-amber-500/10 flex items-center justify-center gap-1.5"
              >
                <FileCheck className="w-3.5 h-3.5" />
                <span>Deliver Document to Client</span>
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
