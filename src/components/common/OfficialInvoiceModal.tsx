import React from 'react';
import { Invoice, Client, Shoot, StudioConfig } from '../../types';
import { X, Printer, Download, CheckCircle2, AlertCircle } from 'lucide-react';

interface OfficialInvoiceModalProps {
  invoice: Invoice;
  client?: Client;
  shoot?: Shoot;
  studioConfig: StudioConfig;
  isOpen: boolean;
  onClose: () => void;
}

export const OfficialInvoiceModal: React.FC<OfficialInvoiceModalProps> = ({
  invoice,
  client,
  shoot,
  studioConfig,
  isOpen,
  onClose,
}) => {
  if (!isOpen) return null;

  const handlePrint = () => {
    window.print();
  };

  const balanceDue = invoice.totalAmount - invoice.paidAmount;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-neutral-950/85 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="relative w-full max-w-3xl bg-neutral-900 border border-neutral-800 rounded-xl shadow-2xl overflow-hidden print:m-0 print:border-none print:shadow-none print:bg-white print:text-neutral-900">
        {/* Modal Controls (Hidden in Print) */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-neutral-800 bg-neutral-950/50 print:hidden">
          <div className="flex items-center gap-2">
            <span className="text-sm font-semibold text-white">Official Tax Invoice</span>
            <span className="text-xs text-neutral-500 font-mono">{invoice.invoiceNumber}</span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-neutral-800 hover:bg-neutral-700 text-neutral-200 text-xs font-medium rounded-lg transition-colors"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print / Save as PDF</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 text-neutral-400 hover:text-white rounded-lg hover:bg-neutral-800 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Printable Invoice Body */}
        <div className="p-8 space-y-8 bg-neutral-900 print:bg-white print:text-black">
          {/* Header */}
          <div className="flex items-start justify-between border-b border-neutral-800 print:border-neutral-300 pb-6">
            <div>
              <h1 className="text-xl font-bold tracking-tight text-white print:text-black">
                {studioConfig.studioName}
              </h1>
              <p className="text-xs text-neutral-400 print:text-neutral-600 mt-1 max-w-sm">
                {studioConfig.tagline}
              </p>
              <div className="text-[11px] text-neutral-500 print:text-neutral-500 mt-2 space-y-0.5 font-mono">
                <div>GSTIN: {studioConfig.gstNumber}</div>
                <div>{studioConfig.address}</div>
                <div>Email: {studioConfig.email} · Phone: {studioConfig.phone}</div>
              </div>
            </div>

            <div className="text-right">
              <div className="inline-block px-3 py-1 rounded bg-neutral-800 print:bg-neutral-100 text-xs font-mono font-medium text-amber-400 print:text-neutral-900 mb-2">
                TAX INVOICE
              </div>
              <div className="text-sm font-bold text-white print:text-black font-mono">
                {invoice.invoiceNumber}
              </div>
              <div className="text-xs text-neutral-400 print:text-neutral-600 mt-1">
                Date: <span className="font-mono">{invoice.issueDate}</span>
              </div>
              <div className="text-xs text-neutral-400 print:text-neutral-600">
                Due Date: <span className="font-mono">{invoice.dueDate}</span>
              </div>
            </div>
          </div>

          {/* Billed To / Shoot Information */}
          <div className="grid grid-cols-2 gap-6 text-xs">
            <div className="bg-neutral-950/50 print:bg-neutral-50 p-4 rounded-lg border border-neutral-800 print:border-neutral-200">
              <div className="text-[10px] font-semibold uppercase tracking-wider text-neutral-500 mb-2">
                Billed To (Client Details)
              </div>
              <div className="font-semibold text-white print:text-black text-sm">
                {client?.name || 'Valued Studio Client'}
              </div>
              <div className="text-neutral-400 print:text-neutral-700 mt-1 font-mono text-[11px]">
                Client ID: {client?.clientCode || 'N/A'}
              </div>
              <div className="text-neutral-400 print:text-neutral-700 mt-0.5">
                Phone: {client?.phone || 'N/A'}
              </div>
              <div className="text-neutral-400 print:text-neutral-700 mt-0.5">
                Email: {client?.email || 'N/A'}
              </div>
              {client?.city && (
                <div className="text-neutral-400 print:text-neutral-700 mt-0.5">
                  Location: {client.city}
                </div>
              )}
            </div>

            <div className="bg-neutral-950/50 print:bg-neutral-50 p-4 rounded-lg border border-neutral-800 print:border-neutral-200">
              <div className="text-[10px] font-semibold uppercase tracking-wider text-neutral-500 mb-2">
                Production / Project Scope
              </div>
              <div className="font-semibold text-white print:text-black text-sm">
                {shoot?.title || 'Studio Production Session'}
              </div>
              <div className="text-neutral-400 print:text-neutral-700 mt-1 text-[11px]">
                Package: {shoot?.packageTitle || 'Custom Studio Package'}
              </div>
              {shoot?.eventDate && (
                <div className="text-neutral-400 print:text-neutral-700 mt-0.5 font-mono text-[11px]">
                  Date: {shoot.eventDate}
                </div>
              )}
              {shoot?.venue && (
                <div className="text-neutral-400 print:text-neutral-700 mt-0.5">
                  Venue: {shoot.venue}
                </div>
              )}
            </div>
          </div>

          {/* Line Items Table */}
          <div className="border border-neutral-800 print:border-neutral-200 rounded-lg overflow-hidden">
            <table className="w-full text-left text-xs">
              <thead className="bg-neutral-950/80 print:bg-neutral-100 text-neutral-400 print:text-neutral-700 border-b border-neutral-800 print:border-neutral-200">
                <tr>
                  <th className="py-2.5 px-4 font-medium">Description</th>
                  <th className="py-2.5 px-3 font-medium text-center">Qty</th>
                  <th className="py-2.5 px-4 font-medium text-right">Unit Price (₹)</th>
                  <th className="py-2.5 px-4 font-medium text-right">Total (₹)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-800 print:divide-neutral-200 text-neutral-300 print:text-neutral-800">
                {invoice.items.map((item, idx) => (
                  <tr key={idx} className="hover:bg-neutral-800/20 print:hover:bg-transparent">
                    <td className="py-3 px-4 text-white print:text-black font-medium">
                      {item.description}
                    </td>
                    <td className="py-3 px-3 text-center font-mono tabular-nums">
                      {item.quantity}
                    </td>
                    <td className="py-3 px-4 text-right font-mono tabular-nums">
                      ₹{item.unitPrice.toLocaleString('en-IN')}
                    </td>
                    <td className="py-3 px-4 text-right font-mono tabular-nums font-semibold text-white print:text-black">
                      ₹{item.total.toLocaleString('en-IN')}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Financial Calculation Summary */}
          <div className="grid grid-cols-2 gap-8 pt-2">
            {/* Payment & Bank Details */}
            <div className="text-xs space-y-3">
              <div className="p-3 rounded-lg border border-neutral-800 print:border-neutral-200 bg-neutral-950/40 print:bg-neutral-50 text-[11px]">
                <div className="font-semibold text-white print:text-black mb-1.5">
                  Official Bank Transfer Details
                </div>
                <div className="text-neutral-400 print:text-neutral-700 font-mono space-y-0.5">
                  <div>Bank: {studioConfig.bankDetails.bankName}</div>
                  <div>A/C Name: {studioConfig.bankDetails.accountName}</div>
                  <div>A/C No: {studioConfig.bankDetails.accountNumber}</div>
                  <div>IFSC Code: {studioConfig.bankDetails.ifscCode}</div>
                  <div>UPI VPA: {studioConfig.bankDetails.upiId}</div>
                </div>
              </div>

              {invoice.notes && (
                <div className="text-neutral-400 print:text-neutral-600 text-[11px]">
                  <span className="font-medium text-neutral-300 print:text-black">Notes: </span>
                  {invoice.notes}
                </div>
              )}
            </div>

            {/* Totals */}
            <div className="space-y-2 text-xs font-mono">
              <div className="flex justify-between text-neutral-400 print:text-neutral-700">
                <span>Subtotal:</span>
                <span className="tabular-nums">₹{invoice.subtotal.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between text-neutral-400 print:text-neutral-700">
                <span>GST ({invoice.taxRate}%):</span>
                <span className="tabular-nums">₹{invoice.taxAmount.toLocaleString('en-IN')}</span>
              </div>
              {invoice.discount > 0 && (
                <div className="flex justify-between text-emerald-400 print:text-emerald-700">
                  <span>Special Discount:</span>
                  <span className="tabular-nums">-₹{invoice.discount.toLocaleString('en-IN')}</span>
                </div>
              )}
              <div className="border-t border-neutral-800 print:border-neutral-300 pt-2 flex justify-between font-bold text-white print:text-black text-sm">
                <span>Total Invoice Value:</span>
                <span className="tabular-nums">₹{invoice.totalAmount.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between text-emerald-400 print:text-emerald-700">
                <span>Total Received / Advance:</span>
                <span className="tabular-nums">₹{invoice.paidAmount.toLocaleString('en-IN')}</span>
              </div>
              <div className="border-t border-dashed border-neutral-800 print:border-neutral-300 pt-2 flex justify-between font-bold text-amber-400 print:text-amber-800 text-sm">
                <span>Net Balance Due:</span>
                <span className="tabular-nums">₹{balanceDue.toLocaleString('en-IN')}</span>
              </div>
            </div>
          </div>

          {/* Footer Signature */}
          <div className="pt-6 border-t border-neutral-800 print:border-neutral-300 flex items-center justify-between text-[11px] text-neutral-500">
            <div>
              Thank you for trusting {studioConfig.studioName}! This is a computer generated invoice.
            </div>
            <div className="text-right">
              <div className="text-neutral-300 print:text-black font-semibold">
                For {studioConfig.studioName}
              </div>
              <div className="mt-8 border-t border-neutral-700 print:border-black pt-1">
                Authorized Signatory
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
