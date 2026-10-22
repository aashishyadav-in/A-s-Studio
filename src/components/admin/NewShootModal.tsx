import React, { useState } from 'react';
import { useStudio } from '../../context/StudioContext';
import { ShootType, ShootStatus } from '../../types';
import { X } from 'lucide-react';
import weddingCover from '../../assets/images/wedding_shoot_cover_1791184279985.jpg';
import fashionCover from '../../assets/images/fashion_studio_cover_1791184291442.jpg';
import portraitCover from '../../assets/images/portrait_session_cover_1791184304014.jpg';
import heroBanner from '../../assets/images/studio_hero_banner_1791184265566.jpg';

interface NewShootModalProps {
  initialClientId?: string;
  isOpen: boolean;
  onClose: () => void;
}

export const NewShootModal: React.FC<NewShootModalProps> = ({
  initialClientId,
  isOpen,
  onClose,
}) => {
  if (!isOpen) return null;

  const { clients, addShoot } = useStudio();

  const [clientId, setClientId] = useState(initialClientId || (clients[0]?.id || ''));
  const [title, setTitle] = useState('');
  const [type, setType] = useState<ShootType>('Wedding');
  const [eventDate, setEventDate] = useState('2026-05-15');
  const [venue, setVenue] = useState('');
  const [leadPhotographer, setLeadPhotographer] = useState('Vikramaditya Roy');
  const [crewString, setCrewString] = useState('Sameer Joshi (Cinematographer), Karan Seth (Drone)');
  const [packageTitle, setPackageTitle] = useState('Imperial Royal 3-Day Wedding Heritage Package');
  const [totalAmount, setTotalAmount] = useState<number>(250000);
  const [advancePaid, setAdvancePaid] = useState<number>(100000);
  const [masterDriveLink, setMasterDriveLink] = useState('https://drive.google.com/drive/folders/sample-studio-link');
  const [teaserVideoLink, setTeaserVideoLink] = useState('');
  const [notes, setNotes] = useState('');

  const getCoverForType = (t: ShootType) => {
    switch (t) {
      case 'Wedding':
      case 'Pre-Wedding':
        return weddingCover;
      case 'Fashion':
      case 'Commercial':
        return fashionCover;
      case 'Portrait':
      default:
        return portraitCover;
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !venue || !clientId) return;

    const balanceDue = Math.max(0, totalAmount - advancePaid);
    const crewMembers = crewString.split(',').map((c) => c.trim()).filter(Boolean);

    addShoot({
      clientId,
      title,
      type,
      eventDate,
      venue,
      leadPhotographer,
      crewMembers,
      status: 'Booked',
      packageTitle,
      totalAmount,
      advancePaid,
      balanceDue,
      masterDriveLink,
      teaserVideoLink,
      notes,
      coverImage: getCoverForType(type),
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-neutral-950/85 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="relative w-full max-w-xl bg-neutral-900 border border-neutral-800 rounded-xl shadow-2xl overflow-hidden my-6">
        <div className="flex items-center justify-between px-6 py-4 border-b border-neutral-800">
          <h2 className="text-sm font-semibold text-white">Book New Shoot / Production Project</h2>
          <button onClick={onClose} className="p-1 text-neutral-400 hover:text-white">
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs">
          <div>
            <label className="block text-neutral-300 font-medium mb-1">Select Client *</label>
            <select
              value={clientId}
              onChange={(e) => setClientId(e.target.value)}
              className="w-full bg-neutral-950 border border-neutral-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-amber-500"
            >
              {clients.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name} ({c.clientCode}) · {c.city}
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-neutral-300 font-medium mb-1">Project / Shoot Title *</label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Aditi & Rohan Sangeet & Reception"
                className="w-full bg-neutral-950 border border-neutral-700 rounded-lg px-3 py-2 text-white placeholder-neutral-500 focus:outline-none focus:border-amber-500"
              />
            </div>

            <div>
              <label className="block text-neutral-300 font-medium mb-1">Shoot Category *</label>
              <select
                value={type}
                onChange={(e) => setType(e.target.value as ShootType)}
                className="w-full bg-neutral-950 border border-neutral-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-amber-500"
              >
                <option value="Wedding">Wedding Heritage</option>
                <option value="Pre-Wedding">Pre-Wedding Cinematic</option>
                <option value="Fashion">Fashion &amp; Lookbook</option>
                <option value="Commercial">Commercial &amp; Brand</option>
                <option value="Portrait">Signature Portrait</option>
                <option value="Event">Corporate / Gala Event</option>
                <option value="Maternity & Baby">Maternity &amp; Baby</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-neutral-300 font-medium mb-1">Event Date *</label>
              <input
                type="date"
                required
                value={eventDate}
                onChange={(e) => setEventDate(e.target.value)}
                className="w-full bg-neutral-950 border border-neutral-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-amber-500"
              />
            </div>

            <div>
              <label className="block text-neutral-300 font-medium mb-1">Venue / City Location *</label>
              <input
                type="text"
                required
                value={venue}
                onChange={(e) => setVenue(e.target.value)}
                placeholder="e.g. Taj Lake Palace, Udaipur"
                className="w-full bg-neutral-950 border border-neutral-700 rounded-lg px-3 py-2 text-white placeholder-neutral-500 focus:outline-none focus:border-amber-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-neutral-300 font-medium mb-1">Lead Photographer / Director</label>
              <input
                type="text"
                value={leadPhotographer}
                onChange={(e) => setLeadPhotographer(e.target.value)}
                className="w-full bg-neutral-950 border border-neutral-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-amber-500"
              />
            </div>

            <div>
              <label className="block text-neutral-300 font-medium mb-1">Package Name</label>
              <input
                type="text"
                value={packageTitle}
                onChange={(e) => setPackageTitle(e.target.value)}
                className="w-full bg-neutral-950 border border-neutral-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-amber-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-neutral-300 font-medium mb-1">Total Agreed Value (₹) *</label>
              <input
                type="number"
                min={0}
                value={totalAmount}
                onChange={(e) => setTotalAmount(Number(e.target.value))}
                className="w-full bg-neutral-950 border border-neutral-700 rounded-lg px-3 py-2 text-white font-mono focus:outline-none focus:border-amber-500"
              />
            </div>

            <div>
              <label className="block text-neutral-300 font-medium mb-1">Advance Received (₹)</label>
              <input
                type="number"
                min={0}
                value={advancePaid}
                onChange={(e) => setAdvancePaid(Number(e.target.value))}
                className="w-full bg-neutral-950 border border-neutral-700 rounded-lg px-3 py-2 text-white font-mono focus:outline-none focus:border-amber-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-neutral-300 font-medium mb-1">Master Google Drive / Cloud Link</label>
            <input
              type="text"
              value={masterDriveLink}
              onChange={(e) => setMasterDriveLink(e.target.value)}
              placeholder="https://drive.google.com/..."
              className="w-full bg-neutral-950 border border-neutral-700 rounded-lg px-3 py-2 text-white placeholder-neutral-500 font-mono text-[11px] focus:outline-none focus:border-amber-500"
            />
          </div>

          <div>
            <label className="block text-neutral-300 font-medium mb-1">Crew &amp; Gear Notes</label>
            <textarea
              rows={2}
              value={crewString}
              onChange={(e) => setCrewString(e.target.value)}
              placeholder="e.g. 2 Photographers, 1 Drone, Gimbal unit..."
              className="w-full bg-neutral-950 border border-neutral-700 rounded-lg px-3 py-2 text-white placeholder-neutral-500 focus:outline-none focus:border-amber-500"
            />
          </div>

          <div className="flex items-center justify-end gap-3 pt-3 border-t border-neutral-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs text-neutral-400 hover:text-white"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-neutral-950 font-semibold rounded-lg transition-colors"
            >
              Confirm Shoot Booking
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
