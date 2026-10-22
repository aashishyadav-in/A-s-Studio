import React, { useState } from 'react';
import { useStudio } from '../../context/StudioContext';
import { StudioStage, StudioEquipment } from '../../types';
import {
  Building2,
  Camera,
  Layers,
  Zap,
  CheckCircle2,
  Clock,
  Wrench,
  FileCheck,
  Printer,
  Shield,
  Sparkles,
  ArrowRight,
  Filter,
} from 'lucide-react';

export const StudioFacilitiesManager: React.FC = () => {
  const { stages, equipment, studioConfig, updateStageStatus, updateEquipmentStatus } = useStudio();
  const [activeTab, setActiveTab] = useState<'stages' | 'equipment' | 'rates'>('stages');
  const [equipCategory, setEquipCategory] = useState<string>('all');
  const [showQuotationModal, setShowQuotationModal] = useState(false);

  const filteredEquipment = equipment.filter((eq) => {
    if (equipCategory !== 'all' && eq.category !== equipCategory) return false;
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-neutral-800">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-amber-400 mb-1">
            <Building2 className="w-3.5 h-3.5" />
            <span>Studio Atelier &amp; Production Infrastructure</span>
          </div>
          <h1 className="text-xl font-bold tracking-tight text-white">
            Studio Stages, Equipment Vault &amp; Rate Cards
          </h1>
          <p className="text-xs text-neutral-400 mt-1">
            Manage physical soundstages, cycloramas, medium-format &amp; cinema camera gear, and official rate cards.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowQuotationModal(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-neutral-800 hover:bg-neutral-700 text-white text-xs font-medium rounded-lg border border-neutral-700 transition-colors"
          >
            <FileCheck className="w-3.5 h-3.5 text-amber-400" />
            <span>Official Studio Rate Card &amp; Terms</span>
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-neutral-800 pb-3">
        <button
          onClick={() => setActiveTab('stages')}
          className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors flex items-center gap-1.5 ${
            activeTab === 'stages'
              ? 'bg-amber-500 text-neutral-950 font-semibold'
              : 'text-neutral-400 hover:text-white bg-neutral-900 border border-neutral-800'
          }`}
        >
          <Building2 className="w-3.5 h-3.5" />
          <span>Production Stages &amp; Cycloramas ({stages.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('equipment')}
          className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors flex items-center gap-1.5 ${
            activeTab === 'equipment'
              ? 'bg-amber-500 text-neutral-950 font-semibold'
              : 'text-neutral-400 hover:text-white bg-neutral-900 border border-neutral-800'
          }`}
        >
          <Camera className="w-3.5 h-3.5" />
          <span>Cinema &amp; Stills Gear Vault ({equipment.length})</span>
        </button>
      </div>

      {/* Stages View */}
      {activeTab === 'stages' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {stages.map((stage) => (
            <div
              key={stage.id}
              className="rounded-2xl border border-neutral-800 bg-neutral-900/60 overflow-hidden flex flex-col justify-between"
            >
              <div>
                <div className="relative h-48 w-full bg-neutral-950 overflow-hidden">
                  <img
                    src={stage.image}
                    alt={stage.name}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-neutral-950/20 to-transparent" />
                  <div className="absolute top-3 right-3">
                    <select
                      value={stage.status}
                      onChange={(e) => updateStageStatus(stage.id, e.target.value as any)}
                      className={`text-[10px] font-semibold px-2 py-1 rounded border focus:outline-none ${
                        stage.status === 'Available'
                          ? 'bg-emerald-950/80 text-emerald-400 border-emerald-700'
                          : stage.status === 'In Production'
                          ? 'bg-amber-950/80 text-amber-400 border-amber-700'
                          : 'bg-indigo-950/80 text-indigo-400 border-indigo-700'
                      }`}
                    >
                      <option value="Available">Available</option>
                      <option value="In Production">In Production</option>
                      <option value="Reserved">Reserved</option>
                    </select>
                  </div>
                  <div className="absolute bottom-3 left-3 right-3">
                    <h3 className="text-white font-bold text-sm">{stage.name}</h3>
                    <div className="text-[11px] text-neutral-300 font-mono mt-0.5">
                      {stage.dimensions} · {stage.ceilingHeight}
                    </div>
                  </div>
                </div>

                <div className="p-5 space-y-4 text-xs">
                  <p className="text-neutral-400 leading-relaxed">{stage.description}</p>

                  <div className="space-y-1.5 pt-2 border-t border-neutral-800">
                    <span className="text-[10px] text-neutral-500 uppercase font-semibold">Included Specifications:</span>
                    <div className="grid grid-cols-2 gap-2 text-[11px] text-neutral-300">
                      {stage.features.map((feat, i) => (
                        <div key={i} className="flex items-center gap-1.5">
                          <CheckCircle2 className="w-3 h-3 text-amber-500 shrink-0" />
                          <span className="truncate">{feat}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5 text-[11px] text-neutral-400">
                    <Zap className="w-3.5 h-3.5 text-amber-400" />
                    <span>Power: {stage.power}</span>
                  </div>
                </div>
              </div>

              <div className="p-4 bg-neutral-950/70 border-t border-neutral-800 flex items-center justify-between text-xs font-mono">
                <div>
                  <span className="text-neutral-500 block text-[10px]">Hourly / Full Day</span>
                  <span className="text-white font-semibold">₹{stage.hourlyRate.toLocaleString('en-IN')}/hr</span>
                </div>
                <div className="text-right">
                  <span className="text-neutral-500 block text-[10px]">10-Hour Shift</span>
                  <span className="text-amber-400 font-bold">₹{stage.dayRate.toLocaleString('en-IN')}/day</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Equipment View */}
      {activeTab === 'equipment' && (
        <div className="space-y-4">
          {/* Category Filter */}
          <div className="flex items-center gap-2 flex-wrap text-xs">
            <span className="text-neutral-500">Filter Gear:</span>
            {['all', 'Cameras', 'Lenses', 'Lighting', 'Drones & Gimbals'].map((cat) => (
              <button
                key={cat}
                onClick={() => setEquipCategory(cat)}
                className={`px-3 py-1 rounded-lg transition-colors ${
                  equipCategory === cat
                    ? 'bg-neutral-800 text-white font-medium'
                    : 'text-neutral-400 hover:text-white bg-neutral-950 border border-neutral-800'
                }`}
              >
                {cat === 'all' ? 'All Inventory' : cat}
              </button>
            ))}
          </div>

          <div className="border border-neutral-800 rounded-xl overflow-hidden bg-neutral-900/50">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-neutral-950/80 text-neutral-400 border-b border-neutral-800">
                  <tr>
                    <th className="py-3 px-4 font-medium">Equipment Name &amp; Spec</th>
                    <th className="py-3 px-3 font-medium">Category</th>
                    <th className="py-3 px-3 font-medium">Serial No.</th>
                    <th className="py-3 px-3 font-medium text-right">Daily Rental (₹)</th>
                    <th className="py-3 px-3 font-medium text-center">Status</th>
                    <th className="py-3 px-4 font-medium text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-800 text-neutral-300">
                  {filteredEquipment.map((eq) => (
                    <tr key={eq.id} className="hover:bg-neutral-800/30 transition-colors">
                      <td className="py-3 px-4">
                        <div className="font-semibold text-white">{eq.name}</div>
                        <div className="text-[11px] text-neutral-500">{eq.notes}</div>
                      </td>
                      <td className="py-3 px-3">
                        <span className="text-neutral-300">{eq.category}</span>
                      </td>
                      <td className="py-3 px-3 font-mono text-neutral-400 text-[11px]">
                        {eq.serialNumber}
                      </td>
                      <td className="py-3 px-3 text-right font-mono tabular-nums text-amber-400 font-medium">
                        ₹{eq.dailyRate.toLocaleString('en-IN')}/day
                      </td>
                      <td className="py-3 px-3 text-center">
                        <span
                          className={`inline-block px-2 py-0.5 rounded text-[10px] font-medium border ${
                            eq.status === 'In Vault'
                              ? 'bg-emerald-950/60 text-emerald-400 border-emerald-800/50'
                              : eq.status === 'Assigned on Shoot'
                              ? 'bg-amber-950/60 text-amber-400 border-amber-800/50'
                              : 'bg-rose-950/60 text-rose-400 border-rose-800/50'
                          }`}
                        >
                          {eq.status}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-right">
                        <select
                          value={eq.status}
                          onChange={(e) => updateEquipmentStatus(eq.id, e.target.value as any)}
                          className="bg-neutral-950 border border-neutral-700 rounded px-2 py-1 text-[11px] text-white focus:outline-none focus:border-amber-500"
                        >
                          <option value="In Vault">Mark: In Vault</option>
                          <option value="Assigned on Shoot">Mark: On Shoot</option>
                          <option value="Maintenance">Mark: Maintenance</option>
                        </select>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Official Studio Rate Card & Terms Modal */}
      {showQuotationModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-neutral-950/85 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="relative w-full max-w-2xl bg-neutral-900 border border-neutral-800 rounded-xl shadow-2xl p-6 space-y-6">
            <div className="flex items-center justify-between pb-3 border-b border-neutral-800">
              <div>
                <h3 className="text-base font-bold text-white">Official Studio Terms &amp; Standard Work Order</h3>
                <span className="text-xs text-neutral-400">{studioConfig.studioName}</span>
              </div>
              <button
                onClick={() => setShowQuotationModal(false)}
                className="text-neutral-400 hover:text-white px-2 py-1 rounded"
              >
                ✕
              </button>
            </div>

            <div className="space-y-4 text-xs text-neutral-300 leading-relaxed max-h-[60vh] overflow-y-auto pr-2">
              <div className="p-3 rounded-lg bg-neutral-950 border border-neutral-800 space-y-1.5">
                <div className="font-semibold text-white flex items-center gap-1.5">
                  <Shield className="w-3.5 h-3.5 text-amber-500" />
                  <span>1. Payment Milestones &amp; Booking Confirmation</span>
                </div>
                <p className="text-neutral-400 text-[11px]">
                  • 50% advance deposit confirms official lock of studio calendar date and director team.<br />
                  • 30% payable on production shoot wrap.<br />
                  • 20% balance payable upon client proofing approval and prior to dispatch of physical heirloom flush mount albums.
                </p>
              </div>

              <div className="p-3 rounded-lg bg-neutral-950 border border-neutral-800 space-y-1.5">
                <div className="font-semibold text-white flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                  <span>2. Deliverables &amp; Archival Retention Policy</span>
                </div>
                <p className="text-neutral-400 text-[11px]">
                  • High-Resolution Master TIFF &amp; JPEG files delivered via secure cloud drive valid for 12 months.<br />
                  • RAW sensor cinema files preserved in studio cold vault for 60 days post delivery.<br />
                  • Printed heirloom albums hand-bound in Italian velvet with 40-page layflat flush mount binding.
                </p>
              </div>

              <div className="p-3 rounded-lg bg-neutral-950 border border-neutral-800 space-y-1.5">
                <div className="font-semibold text-white flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-amber-500" />
                  <span>3. Operating Hours &amp; Logistics</span>
                </div>
                <p className="text-neutral-400 text-[11px]">
                  • Studio Operating Hours: {studioConfig.operatingHours}<br />
                  • All shoots equipped with licensed DGCA drone coverage and Profoto continuous/strobe lighting packages.
                </p>
              </div>
            </div>

            <div className="flex items-center justify-between pt-3 border-t border-neutral-800">
              <button
                onClick={() => window.print()}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-neutral-800 hover:bg-neutral-700 text-neutral-200 text-xs rounded transition-colors"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>Print Terms of Service</span>
              </button>

              <button
                onClick={() => setShowQuotationModal(false)}
                className="px-4 py-1.5 bg-amber-500 text-neutral-950 text-xs font-semibold rounded hover:bg-amber-400 transition-colors"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
