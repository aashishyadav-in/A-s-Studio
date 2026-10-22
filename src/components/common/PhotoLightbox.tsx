import React, { useState } from 'react';
import { Photo } from '../../types';
import { useStudio } from '../../context/StudioContext';
import { X, Check, Heart, MessageSquare, ChevronLeft, ChevronRight, Download } from 'lucide-react';

interface PhotoLightboxProps {
  photos: Photo[];
  currentIndex: number;
  isOpen: boolean;
  onClose: () => void;
  onNavigate: (index: number) => void;
  isClientView?: boolean;
}

export const PhotoLightbox: React.FC<PhotoLightboxProps> = ({
  photos,
  currentIndex,
  isOpen,
  onClose,
  onNavigate,
  isClientView = false,
}) => {
  if (!isOpen || !photos[currentIndex]) return null;

  const currentPhoto = photos[currentIndex];
  const { togglePhotoSelection, togglePhotoFavorite, updatePhotoNotes } = useStudio();
  const [editingNotes, setEditingNotes] = useState(false);
  const [notesText, setNotesText] = useState(currentPhoto.clientNotes || '');

  const handleNext = () => {
    if (currentIndex < photos.length - 1) {
      onNavigate(currentIndex + 1);
      setNotesText(photos[currentIndex + 1]?.clientNotes || '');
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      onNavigate(currentIndex - 1);
      setNotesText(photos[currentIndex - 1]?.clientNotes || '');
    }
  };

  const handleSaveNotes = () => {
    updatePhotoNotes(currentPhoto.id, notesText);
    setEditingNotes(false);
  };

  return (
    <div className="fixed inset-0 z-50 bg-neutral-950/95 backdrop-blur-md flex flex-col">
      {/* Top Header */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-neutral-800 text-sm text-neutral-300">
        <div className="flex items-center gap-3">
          <span className="font-medium text-white">{currentPhoto.title || `Photo #${currentIndex + 1}`}</span>
          <span className="text-neutral-500">·</span>
          <span className="text-xs text-neutral-400 font-mono tabular-nums">
            {currentIndex + 1} / {photos.length}
          </span>
          {currentPhoto.resolution && (
            <>
              <span className="text-neutral-500">·</span>
              <span className="text-xs text-neutral-400 font-mono">{currentPhoto.resolution}</span>
            </>
          )}
        </div>

        <div className="flex items-center gap-3">
          {/* Favorite Toggle */}
          <button
            onClick={() => togglePhotoFavorite(currentPhoto.id)}
            className={`p-2 rounded-lg transition-colors flex items-center gap-1.5 text-xs font-medium ${
              currentPhoto.isFavorite
                ? 'bg-rose-950/50 text-rose-400 border border-rose-800/60'
                : 'bg-neutral-900 text-neutral-400 hover:text-white border border-neutral-800'
            }`}
            title="Mark as Favorite"
          >
            <Heart className={`w-4 h-4 ${currentPhoto.isFavorite ? 'fill-rose-400' : ''}`} />
            <span>{currentPhoto.isFavorite ? 'Favorited' : 'Favorite'}</span>
          </button>

          {/* Album Selection Button */}
          <button
            onClick={() => togglePhotoSelection(currentPhoto.id)}
            className={`px-3 py-2 rounded-lg transition-colors flex items-center gap-1.5 text-xs font-medium ${
              currentPhoto.isSelectedForAlbum
                ? 'bg-amber-500 text-neutral-950 font-semibold'
                : 'bg-neutral-900 text-neutral-300 hover:text-white border border-neutral-800'
            }`}
          >
            <Check className={`w-4 h-4 ${currentPhoto.isSelectedForAlbum ? 'stroke-[2.5]' : ''}`} />
            <span>{currentPhoto.isSelectedForAlbum ? 'Selected for Album' : 'Select for Album'}</span>
          </button>

          {/* Download Simulated Preview */}
          <a
            href={currentPhoto.url}
            download={`AuraStudio_${currentPhoto.id}.jpg`}
            className="p-2 rounded-lg bg-neutral-900 hover:bg-neutral-800 text-neutral-300 hover:text-white border border-neutral-800 transition-colors"
            title="Download Preview"
          >
            <Download className="w-4 h-4" />
          </a>

          {/* Close */}
          <button
            onClick={onClose}
            className="p-2 rounded-lg bg-neutral-900 hover:bg-neutral-800 text-neutral-400 hover:text-white border border-neutral-800 transition-colors ml-2"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Main Image Stage */}
      <div className="flex-1 relative flex items-center justify-center p-4 overflow-hidden">
        {/* Navigation Arrows */}
        {currentIndex > 0 && (
          <button
            onClick={handlePrev}
            className="absolute left-6 top-1/2 -translate-y-1/2 z-10 p-3 rounded-full bg-neutral-900/80 hover:bg-neutral-800 text-white border border-neutral-700/60 transition-colors"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
        )}

        {currentIndex < photos.length - 1 && (
          <button
            onClick={handleNext}
            className="absolute right-6 top-1/2 -translate-y-1/2 z-10 p-3 rounded-full bg-neutral-900/80 hover:bg-neutral-800 text-white border border-neutral-700/60 transition-colors"
          >
            <ChevronRight className="w-6 h-6" />
          </button>
        )}

        <img
          src={currentPhoto.url}
          alt={currentPhoto.title}
          referrerPolicy="no-referrer"
          className="max-h-[75vh] max-w-[85vw] object-contain rounded-md shadow-2xl select-none"
        />
      </div>

      {/* Bottom Bar: Client Notes & Selection Status */}
      <div className="px-6 py-3 border-t border-neutral-800 bg-neutral-900/80 flex items-center justify-between text-xs text-neutral-400">
        <div className="flex-1 max-w-2xl flex items-center gap-3">
          <MessageSquare className="w-4 h-4 text-amber-400 shrink-0" />
          {editingNotes ? (
            <div className="flex items-center gap-2 w-full">
              <input
                type="text"
                value={notesText}
                onChange={(e) => setNotesText(e.target.value)}
                placeholder="e.g. Centerfold spread, retouch lighting, natural skin..."
                className="flex-1 bg-neutral-950 border border-neutral-700 rounded px-2.5 py-1 text-xs text-white focus:outline-none focus:border-amber-500"
                autoFocus
              />
              <button
                onClick={handleSaveNotes}
                className="px-2.5 py-1 bg-amber-500 text-neutral-950 font-medium rounded hover:bg-amber-400 transition-colors"
              >
                Save
              </button>
              <button
                onClick={() => setEditingNotes(false)}
                className="px-2 py-1 text-neutral-400 hover:text-white"
              >
                Cancel
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <span className="text-neutral-300">
                {currentPhoto.clientNotes ? (
                  <span className="text-amber-200/90 font-medium">"{currentPhoto.clientNotes}"</span>
                ) : (
                  <span className="text-neutral-500 italic">No notes added for album design yet</span>
                )}
              </span>
              <button
                onClick={() => {
                  setNotesText(currentPhoto.clientNotes || '');
                  setEditingNotes(true);
                }}
                className="text-amber-400 hover:underline text-[11px] ml-1"
              >
                {currentPhoto.clientNotes ? 'Edit Note' : '+ Add Note for Studio'}
              </button>
            </div>
          )}
        </div>

        <div className="text-right text-[11px] text-neutral-500 font-mono">
          Category: <span className="text-neutral-300">{currentPhoto.category || 'General'}</span>
        </div>
      </div>
    </div>
  );
};
