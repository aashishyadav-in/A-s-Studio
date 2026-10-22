import React, { useState } from 'react';
import { useStudio } from '../../context/StudioContext';
import { InvoiceItem } from '../../types';
import { X, Plus, Trash2 } from 'lucide-react';

interface NewInvoiceModalProps {
  initialClientId?: string;
  isOpen: boolean;
  onClose: () => void;
}

export const NewInvoiceModal: React.FC<NewInvoiceModalProps> = ({
  initialClientId,
  isOpen,
  onClose,
}) => {
  if (!isOpen) return null;

  const { clients, shoots, addInvoice } = useStudio();

  const [clientId, setClientId] = useState(initialClientId || (clients[0]?.id || ''));
  const [shootId, setShootId] = useState('');
  const [invoiceNumber, setInvoiceNumber] = useState(`INV-2026-0${Math.floor(50 + Math.random() * 50)}`);
  const [issueDate, setIssueDate] = useState(new Date().toISOString().split('T')[0]);
  const [dueDate, setDueDate] = useState('2026-05-30');
  const [taxRate, setTaxRate] = useState<number>(18);
  const [discount, setDiscount] = useState<number>(0);
  const [paidAmount, setPaidAmount] = useState<number>(50000);
  const [paymentMethod, setPaymentMethod] = useState('UPI / Bank Transfer');
  const [notes, setNotes] = useState('Advance received. Final balance payable upon deliverable handoff.');

  const [items, setItems] = useState<InvoiceItem[]>([
    {
      id: 'itm-1',
      description: 'Master Candid Photography & Cinematic 4K Film Coverage',
      quantity: 1,
      unitPrice: 150000,
      total: 150000,
    },
    {
      id: 'itm-2',
      description: 'Handcrafted Italian Velvet 40-Page Flush Mount Album (14x20)',
      quantity: 1,
      unitPrice: 35000,
      total: 35000,
    },
  ]);

  const clientShoots = shoots.filter((s) => s.clientId === clientId);

  const subtotal = items.reduce((sum, item) => sum + item.total, 0);
  const taxAmount = (subtotal * taxRate) / 100;
  const totalAmount = Math.max(0, subtotal + taxAmount - discount);

  const handleAddItem = () => {
    setItems([
      ...items,
      {
        id: `itm-${Date.now()}`,
        description: 'Drone Aerial 4K Cinematography',
        quantity: 1,
        unitPrice: 25000,
        total: 25000,
      },
    ]);
  };

  const handleRemoveItem = (idx: number) => {
    setItems(items.filter((_, i) => i !== idx));
  };

  const handleItemChange = (idx: number, field: keyof InvoiceItem, value: any) => {
    const updated = [...items];
    const target = { ...updated[idx], [field]: value };
    if (field === 'quantity' || field === 'unitPrice') {
      target.total = Number(target.quantity) * Number(target.unitPrice);
    }
    updated[idx] = target;
    setItems(updated);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!clientId || items.length === 0) return;

    const status = paidAmount >= totalAmount ? 'Paid' : paidAmount > 0 ? 'Partial' : 'Unpaid';

    addInvoice({
      invoiceNumber,
      clientId,
      shootId: shootId || undefined,
      issueDate,
      dueDate,
      items,
      subtotal,
      taxRate,
      taxAmount,
      discount,
      totalAmount,
      paidAmount,
      status,
      paymentMethod,
      notes,
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-neutral-950/85 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="relative w-full max-w-2xl bg-neutral-900 border border-neutral-800 rounded-xl shadow-2xl overflow-hidden my-6">
        <div className="flex items-center justify-between px-6 py-4 border-b border-neutral-800">
          <h2 className="text-sm font-semibold text-white">Create Official Studio Tax Invoice</h2>
          <button onClick={onClose} className="p-1 text-neutral-400 hover:text-white">
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5 text-xs">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-neutral-300 font-medium mb-1">Select Client *</label>
              <select
                value={clientId}
                onChange={(e) => {
                  setClientId(e.target.value);
                  setShootId('');
                }}
                className="w-full bg-neutral-950 border border-neutral-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-amber-500"
              >
                {clients.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name} ({c.clientCode})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-neutral-300 font-medium mb-1">Link to Shoot (Optional)</label>
              <select
                value={shootId}
                onChange={(e) => setShootId(e.target.value)}
                className="w-full bg-neutral-950 border border-neutral-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-amber-500"
              >
                <option value="">-- General Production / Standalone --</option>
                {clientShoots.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.title} ({s.eventDate})
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block text-neutral-300 font-medium mb-1">Invoice Number *</label>
              <input
                type="text"
                required
                value={invoiceNumber}
                onChange={(e) => setInvoiceNumber(e.target.value)}
                className="w-full bg-neutral-950 border border-neutral-700 rounded-lg px-3 py-2 text-amber-400 font-mono focus:outline-none focus:border-amber-500"
              />
            </div>

            <div>
              <label className="block text-neutral-300 font-medium mb-1">Issue Date *</label>
              <input
                type="date"
                required
                value={issueDate}
                onChange={(e) => setIssueDate(e.target.value)}
                className="w-full bg-neutral-950 border border-neutral-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-amber-500"
              />
            </div>

            <div>
              <label className="block text-neutral-300 font-medium mb-1">Due Date *</label>
              <input
                type="date"
                required
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                className="w-full bg-neutral-950 border border-neutral-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-amber-500"
              />
            </div>
          </div>

          {/* Line items table */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-neutral-300 font-medium">Deliverables &amp; Service Line Items</label>
              <button
                type="button"
                onClick={handleAddItem}
                className="text-amber-400 hover:text-amber-300 flex items-center gap-1 font-medium"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Item</span>
              </button>
            </div>

            <div className="space-y-2">
              {items.map((item, idx) => (
                <div key={item.id} className="flex items-center gap-2">
                  <input
                    type="text"
                    required
                    value={item.description}
                    onChange={(e) => handleItemChange(idx, 'description', e.target.value)}
                    placeholder="Description of service/album"
                    className="flex-1 bg-neutral-950 border border-neutral-700 rounded-lg px-3 py-1.5 text-white"
                  />
                  <input
                    type="number"
                    min={1}
                    value={item.quantity}
                    onChange={(e) => handleItemChange(idx, 'quantity', Number(e.target.value))}
                    className="w-16 bg-neutral-950 border border-neutral-700 rounded-lg px-2 py-1.5 text-center text-white font-mono"
                  />
                  <input
                    type="number"
                    min={0}
                    value={item.unitPrice}
                    onChange={(e) => handleItemChange(idx, 'unitPrice', Number(e.target.value))}
                    className="w-28 bg-neutral-950 border border-neutral-700 rounded-lg px-2 py-1.5 text-right text-white font-mono"
                  />
                  <span className="w-24 text-right font-mono font-medium text-white tabular-nums">
                    ₹{item.total.toLocaleString('en-IN')}
                  </span>
                  {items.length > 1 && (
                    <button
                      type="button"
                      onClick={() => handleRemoveItem(idx)}
                      className="p-1.5 text-neutral-500 hover:text-rose-400"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Tax, Discount, Advance */}
          <div className="p-4 rounded-xl bg-neutral-950 border border-neutral-800 grid grid-cols-3 gap-3">
            <div>
              <label className="block text-neutral-400 text-[11px] mb-1">GST Tax Rate (%)</label>
              <input
                type="number"
                min={0}
                value={taxRate}
                onChange={(e) => setTaxRate(Number(e.target.value))}
                className="w-full bg-neutral-900 border border-neutral-700 rounded px-2.5 py-1.5 text-white font-mono"
              />
            </div>

            <div>
              <label className="block text-neutral-400 text-[11px] mb-1">Discount (₹)</label>
              <input
                type="number"
                min={0}
                value={discount}
                onChange={(e) => setDiscount(Number(e.target.value))}
                className="w-full bg-neutral-900 border border-neutral-700 rounded px-2.5 py-1.5 text-white font-mono"
              />
            </div>

            <div>
              <label className="block text-neutral-400 text-[11px] mb-1">Advance Received (₹)</label>
              <input
                type="number"
                min={0}
                value={paidAmount}
                onChange={(e) => setPaidAmount(Number(e.target.value))}
                className="w-full bg-neutral-900 border border-neutral-700 rounded px-2.5 py-1.5 text-emerald-400 font-mono"
              />
            </div>
          </div>

          {/* Summary Box */}
          <div className="p-3 rounded-lg bg-neutral-950 border border-neutral-800 text-xs font-mono flex items-center justify-between">
            <span className="text-neutral-400">Total Calculation:</span>
            <div className="flex items-center gap-4">
              <span>Sub: ₹{subtotal.toLocaleString('en-IN')}</span>
              <span>GST: ₹{taxAmount.toLocaleString('en-IN')}</span>
              <span className="text-white font-bold">Total: ₹{totalAmount.toLocaleString('en-IN')}</span>
            </div>
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
              Generate Official Invoice
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
