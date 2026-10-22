import React, { useState } from 'react';
import { useStudio } from '../../context/StudioContext';
import { Invoice, InvoiceItem, Client } from '../../types';
import { OfficialInvoiceModal } from '../common/OfficialInvoiceModal';
import {
  FileText,
  Plus,
  Printer,
  DollarSign,
  Search,
  CheckCircle2,
  Clock,
  Trash2,
  X,
  CreditCard,
} from 'lucide-react';

interface InvoiceManagerProps {
  initialClientId?: string;
  onOpenCreateInvoice: () => void;
}

export const InvoiceManager: React.FC<InvoiceManagerProps> = ({
  initialClientId,
  onOpenCreateInvoice,
}) => {
  const { invoices, clients, shoots, studioConfig, recordPayment } = useStudio();
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');

  // Payment Recording modal
  const [paymentModalInvoice, setPaymentModalInvoice] = useState<Invoice | null>(null);
  const [paymentAmount, setPaymentAmount] = useState<number>(0);
  const [paymentMethod, setPaymentMethod] = useState('UPI Transfer');

  const filteredInvoices = invoices.filter((inv) => {
    if (initialClientId && inv.clientId !== initialClientId) return false;
    if (filterStatus !== 'all' && inv.status !== filterStatus) return false;
    const client = clients.find((c) => c.id === inv.clientId);
    const matchesSearch =
      inv.invoiceNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      client?.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      client?.clientCode.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSearch;
  });

  const getClient = (clientId: string) => clients.find((c) => c.id === clientId);
  const getShoot = (shootId?: string) => shoots.find((s) => s.id === shootId);

  const handleRecordPaymentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!paymentModalInvoice || paymentAmount <= 0) return;
    recordPayment(paymentModalInvoice.id, paymentAmount, paymentMethod);
    setPaymentModalInvoice(null);
  };

  return (
    <div className="space-y-6">
      {/* Top Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-neutral-800">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-white flex items-center gap-2">
            <FileText className="w-5 h-5 text-amber-500" />
            <span>Studio Tax Invoices &amp; Billing Ledger</span>
          </h1>
          <p className="text-xs text-neutral-400 mt-1">
            Official GST-compliant tax invoices, payment milestones, receipts, and client balances.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-2.5 w-3.5 h-3.5 text-neutral-500" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search invoice #, client..."
              className="bg-neutral-900 border border-neutral-800 rounded-lg pl-9 pr-3 py-1.5 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-amber-500 w-52"
            />
          </div>

          <button
            onClick={onOpenCreateInvoice}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-amber-500 hover:bg-amber-400 text-neutral-950 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Create Invoice</span>
          </button>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-1 p-1 bg-neutral-900 border border-neutral-800 rounded-lg text-xs w-fit">
        {['all', 'Paid', 'Partial', 'Unpaid'].map((status) => (
          <button
            key={status}
            onClick={() => setFilterStatus(status)}
            className={`px-3 py-1.5 rounded transition-colors ${
              filterStatus === status
                ? 'bg-neutral-800 text-white font-medium shadow-sm'
                : 'text-neutral-400 hover:text-white'
            }`}
          >
            {status === 'all' ? 'All Invoices' : status}
          </button>
        ))}
      </div>

      {/* Invoices Table */}
      <div className="border border-neutral-800 rounded-xl overflow-hidden bg-neutral-900/50">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-neutral-950/80 text-neutral-400 border-b border-neutral-800">
              <tr>
                <th className="py-3 px-4 font-medium">Invoice #</th>
                <th className="py-3 px-4 font-medium">Client &amp; Shoot</th>
                <th className="py-3 px-3 font-medium">Issue Date</th>
                <th className="py-3 px-3 font-medium">Due Date</th>
                <th className="py-3 px-4 font-medium text-right">Total (₹)</th>
                <th className="py-3 px-4 font-medium text-right">Paid (₹)</th>
                <th className="py-3 px-3 font-medium text-center">Status</th>
                <th className="py-3 px-4 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-800 text-neutral-300">
              {filteredInvoices.map((inv) => {
                const client = getClient(inv.clientId);
                const shoot = getShoot(inv.shootId);
                const balanceDue = inv.totalAmount - inv.paidAmount;

                return (
                  <tr key={inv.id} className="hover:bg-neutral-800/30 transition-colors">
                    <td className="py-3 px-4 font-mono font-semibold text-amber-400">
                      {inv.invoiceNumber}
                    </td>
                    <td className="py-3 px-4">
                      <div className="font-medium text-white">{client?.name}</div>
                      <div className="text-[11px] text-neutral-500 truncate max-w-xs">
                        {shoot?.title || 'Studio Production Work'}
                      </div>
                    </td>
                    <td className="py-3 px-3 font-mono tabular-nums text-neutral-400">
                      {inv.issueDate}
                    </td>
                    <td className="py-3 px-3 font-mono tabular-nums text-neutral-400">
                      {inv.dueDate}
                    </td>
                    <td className="py-3 px-4 text-right font-mono tabular-nums font-semibold text-white">
                      ₹{inv.totalAmount.toLocaleString('en-IN')}
                    </td>
                    <td className="py-3 px-4 text-right font-mono tabular-nums text-emerald-400">
                      ₹{inv.paidAmount.toLocaleString('en-IN')}
                    </td>
                    <td className="py-3 px-3 text-center">
                      <span
                        className={`inline-block px-2 py-0.5 rounded text-[10px] font-medium ${
                          inv.status === 'Paid'
                            ? 'bg-emerald-950/60 text-emerald-400 border border-emerald-800/50'
                            : inv.status === 'Partial'
                            ? 'bg-amber-950/60 text-amber-400 border border-amber-800/50'
                            : 'bg-rose-950/60 text-rose-400 border border-rose-800/50'
                        }`}
                      >
                        {inv.status}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        {balanceDue > 0 && (
                          <button
                            onClick={() => {
                              setPaymentModalInvoice(inv);
                              setPaymentAmount(balanceDue);
                            }}
                            className="px-2 py-1 bg-amber-500/20 hover:bg-amber-500/30 text-amber-400 rounded text-[11px] font-medium transition-colors"
                          >
                            + Record Pay
                          </button>
                        )}
                        <button
                          onClick={() => setSelectedInvoice(inv)}
                          className="flex items-center gap-1 px-2.5 py-1 bg-neutral-800 hover:bg-neutral-700 text-neutral-200 rounded text-xs transition-colors"
                        >
                          <Printer className="w-3 h-3 text-neutral-400" />
                          <span>View / Print</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Record Payment Modal */}
      {paymentModalInvoice && (
        <div className="fixed inset-0 z-50 bg-neutral-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="relative w-full max-w-sm bg-neutral-900 border border-neutral-800 rounded-xl shadow-2xl p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-neutral-800">
              <div>
                <h3 className="text-sm font-semibold text-white">Record Client Payment</h3>
                <span className="text-[11px] font-mono text-neutral-400">
                  {paymentModalInvoice.invoiceNumber}
                </span>
              </div>
              <button
                onClick={() => setPaymentModalInvoice(null)}
                className="p-1 text-neutral-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleRecordPaymentSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block text-neutral-300 font-medium mb-1">
                  Payment Amount Received (₹) *
                </label>
                <input
                  type="number"
                  required
                  min={1}
                  value={paymentAmount}
                  onChange={(e) => setPaymentAmount(Number(e.target.value))}
                  className="w-full bg-neutral-950 border border-neutral-700 rounded-lg px-3 py-2 text-white font-mono focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block text-neutral-300 font-medium mb-1">
                  Payment Method *
                </label>
                <select
                  value={paymentMethod}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                  className="w-full bg-neutral-950 border border-neutral-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-amber-500"
                >
                  <option value="UPI (Google Pay / PhonePe)">UPI (Google Pay / PhonePe)</option>
                  <option value="Bank RTGS / NEFT">Bank RTGS / NEFT</option>
                  <option value="Cheque / Draft">Cheque / Demand Draft</option>
                  <option value="Cash / Studio Counter">Cash at Studio Counter</option>
                  <option value="Credit / Debit Card">Credit / Debit Card</option>
                </select>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-neutral-800">
                <button
                  type="button"
                  onClick={() => setPaymentModalInvoice(null)}
                  className="px-3 py-1.5 text-neutral-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-amber-500 hover:bg-amber-400 text-neutral-950 font-semibold rounded-lg transition-colors"
                >
                  Confirm Receipt
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Official Printable Invoice Modal */}
      {selectedInvoice && (
        <OfficialInvoiceModal
          invoice={selectedInvoice}
          client={getClient(selectedInvoice.clientId)}
          shoot={getShoot(selectedInvoice.shootId)}
          studioConfig={studioConfig}
          isOpen={true}
          onClose={() => setSelectedInvoice(null)}
        />
      )}
    </div>
  );
};
