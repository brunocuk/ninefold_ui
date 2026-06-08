'use client';

import { useEffect, useState, useRef } from 'react';
import { supabase } from '@/lib/supabase';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  ArrowLeft,
  Edit,
  Trash2,
  Save,
  X,
  Calendar,
  Euro,
  Download,
  FileText,
  Upload,
  File,
  Loader2,
  Building2,
} from 'lucide-react';
import { useToast } from '@/components/Toast';

const STATUS_OPTIONS = [
  { id: 'unpaid', label: 'Neplaćeno', bg: '#FEF3C7', color: '#D97706' },
  { id: 'paid', label: 'Plaćeno', bg: '#D1FAE5', color: '#059669' },
  { id: 'overdue', label: 'Dospjelo', bg: '#FEE2E2', color: '#DC2626' },
];

export default function InvoiceDetailPage() {
  const params = useParams();
  const router = useRouter();
  const toast = useToast();
  const fileInputRef = useRef(null);
  const [invoice, setInvoice] = useState(null);
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [formData, setFormData] = useState({});
  const [newFile, setNewFile] = useState(null);
  const [dragActive, setDragActive] = useState(false);

  useEffect(() => {
    loadData();
  }, [params.id]);

  const loadData = async () => {
    try {
      const [invoiceRes, clientsRes] = await Promise.all([
        supabase
          .from('invoices')
          .select('*, clients(id, name, company)')
          .eq('id', params.id)
          .single(),
        supabase.from('clients').select('id, name, company').order('name'),
      ]);

      if (invoiceRes.error) throw invoiceRes.error;
      setInvoice(invoiceRes.data);
      setFormData(invoiceRes.data);
      setClients(clientsRes.data || []);
    } catch (error) {
      console.error('Error loading invoice:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = async () => {
    const { data, error } = await supabase.storage
      .from('invoices')
      .createSignedUrl(invoice.file_path, 3600);

    if (error) {
      toast.error('Greška pri preuzimanju datoteke');
      return;
    }

    window.open(data.signedUrl, '_blank');
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile && droppedFile.type === 'application/pdf') {
      setNewFile(droppedFile);
    }
  };

  const handleFileSelect = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile && selectedFile.type === 'application/pdf') {
      setNewFile(selectedFile);
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    setSaving(true);

    try {
      let filePath = invoice.file_path;
      let fileName = invoice.file_name;
      let fileSize = invoice.file_size;

      // Upload new file if provided
      if (newFile) {
        setUploading(true);

        const fileExt = newFile.name.split('.').pop();
        const newFilePath = `${formData.client_id}/${formData.invoice_number.replace(/[^a-zA-Z0-9-]/g, '_')}.${fileExt}`;

        // Delete old file if path changed
        if (newFilePath !== invoice.file_path) {
          await supabase.storage.from('invoices').remove([invoice.file_path]);
        }

        const { error: uploadError } = await supabase.storage
          .from('invoices')
          .upload(newFilePath, newFile, {
            cacheControl: '3600',
            upsert: true,
          });

        if (uploadError) {
          toast.error('Greška pri učitavanju datoteke');
          setSaving(false);
          setUploading(false);
          return;
        }

        filePath = newFilePath;
        fileName = newFile.name;
        fileSize = newFile.size;
        setUploading(false);
      }

      // Update invoice record
      const { error } = await supabase
        .from('invoices')
        .update({
          client_id: formData.client_id,
          invoice_number: formData.invoice_number,
          amount: Number(formData.amount),
          issue_date: formData.issue_date,
          due_date: formData.due_date || null,
          status: formData.status,
          file_path: filePath,
          file_name: fileName,
          file_size: fileSize,
          notes: formData.notes || null,
        })
        .eq('id', params.id);

      if (error) throw error;

      setInvoice({ ...formData, file_path: filePath, file_name: fileName, file_size: fileSize });
      setEditing(false);
      setNewFile(null);
      toast.success('Faktura ažurirana');
    } catch (error) {
      console.error('Error updating invoice:', error);
      toast.error('Greška pri ažuriranju fakture');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm('Jeste li sigurni da želite obrisati ovu fakturu? Ova radnja se ne može poništiti.')) {
      return;
    }

    try {
      // Delete file from storage
      await supabase.storage.from('invoices').remove([invoice.file_path]);

      // Delete invoice record
      const { error } = await supabase.from('invoices').delete().eq('id', params.id);

      if (error) throw error;
      router.push('/crm/invoices');
    } catch (error) {
      console.error('Error deleting invoice:', error);
      toast.error('Greška pri brisanju fakture');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-2xl text-[#00FF94]">Učitavanje...</div>
      </div>
    );
  }

  if (!invoice) {
    return (
      <div className="text-center py-12">
        <h1 className="text-2xl font-bold text-white mb-4">Faktura nije pronađena</h1>
        <Link href="/crm/invoices" className="text-[#00FF94] hover:underline">
          Natrag na fakture
        </Link>
      </div>
    );
  }

  const status = STATUS_OPTIONS.find((s) => s.id === invoice.status) || STATUS_OPTIONS[0];
  const clientName = invoice.clients?.company || invoice.clients?.name || 'Nepoznat klijent';

  return (
    <div className="max-w-4xl animate-fadeIn">
      {/* Header */}
      <Link
        href="/crm/invoices"
        className="inline-flex items-center gap-2 text-gray-400 hover:text-[#00FF94] mb-6 transition-colors"
      >
        <ArrowLeft size={16} />
        Natrag na fakture
      </Link>

      <div className="flex items-start justify-between mb-8">
        <div>
          <h1 className="text-4xl font-black text-white mb-2">{invoice.invoice_number}</h1>
          <div className="flex items-center gap-3">
            <span
              className="px-3 py-1.5 rounded-lg text-sm font-semibold"
              style={{ background: status.bg, color: status.color }}
            >
              {status.label}
            </span>
            <span className="text-gray-400">{clientName}</span>
          </div>
        </div>

        <div className="flex gap-3">
          {!editing && (
            <>
              <button
                onClick={handleDownload}
                className="inline-flex items-center gap-2 px-4 py-2.5 bg-[#2A2A2A] text-white rounded-xl font-semibold hover:bg-[#3A3A3A] transition-all"
              >
                <Download size={18} />
                Preuzmi PDF
              </button>
              <button
                onClick={() => setEditing(true)}
                className="inline-flex items-center gap-2 px-4 py-2.5 bg-[#00FF94] text-black rounded-xl font-semibold hover:shadow-lg hover:shadow-[#00FF94]/30 transition-all"
              >
                <Edit size={18} />
                Uredi
              </button>
            </>
          )}
        </div>
      </div>

      {editing ? (
        /* Edit Form */
        <form onSubmit={handleUpdate}>
          <div className="bg-[#1a1a1a] border border-[#2A2A2A] rounded-2xl p-8 space-y-6">
            {/* Client Selection */}
            <div>
              <label className="block text-sm font-semibold text-gray-400 mb-2">
                Klijent *
              </label>
              <select
                value={formData.client_id}
                onChange={(e) => setFormData({ ...formData, client_id: e.target.value })}
                required
                className="w-full px-4 py-3 bg-[#0a0a0a] border border-[#2A2A2A] rounded-xl text-white focus:border-[#00FF94] focus:outline-none"
              >
                {clients.map((client) => (
                  <option key={client.id} value={client.id}>
                    {client.company || client.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Invoice Number & Amount */}
            <div className="grid grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-gray-400 mb-2">
                  <FileText size={14} className="inline mr-2" />
                  Broj fakture *
                </label>
                <input
                  type="text"
                  value={formData.invoice_number}
                  onChange={(e) => setFormData({ ...formData, invoice_number: e.target.value })}
                  required
                  className="w-full px-4 py-3 bg-[#0a0a0a] border border-[#2A2A2A] rounded-xl text-white focus:border-[#00FF94] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-400 mb-2">
                  <Euro size={14} className="inline mr-2" />
                  Iznos (EUR) *
                </label>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  value={formData.amount}
                  onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                  required
                  className="w-full px-4 py-3 bg-[#0a0a0a] border border-[#2A2A2A] rounded-xl text-white focus:border-[#00FF94] focus:outline-none"
                />
              </div>
            </div>

            {/* Dates */}
            <div className="grid grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-gray-400 mb-2">
                  <Calendar size={14} className="inline mr-2" />
                  Datum izdavanja *
                </label>
                <input
                  type="date"
                  value={formData.issue_date}
                  onChange={(e) => setFormData({ ...formData, issue_date: e.target.value })}
                  required
                  className="w-full px-4 py-3 bg-[#0a0a0a] border border-[#2A2A2A] rounded-xl text-white focus:border-[#00FF94] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-400 mb-2">
                  <Calendar size={14} className="inline mr-2" />
                  Datum dospijeća
                </label>
                <input
                  type="date"
                  value={formData.due_date || ''}
                  onChange={(e) => setFormData({ ...formData, due_date: e.target.value })}
                  className="w-full px-4 py-3 bg-[#0a0a0a] border border-[#2A2A2A] rounded-xl text-white focus:border-[#00FF94] focus:outline-none"
                />
              </div>
            </div>

            {/* Status */}
            <div>
              <label className="block text-sm font-semibold text-gray-400 mb-2">
                Status
              </label>
              <div className="flex gap-3">
                {STATUS_OPTIONS.map((s) => (
                  <button
                    key={s.id}
                    type="button"
                    onClick={() => setFormData({ ...formData, status: s.id })}
                    className={`flex-1 px-4 py-3 rounded-xl text-sm font-semibold transition-all ${
                      formData.status === s.id
                        ? ''
                        : 'bg-[#0a0a0a] border border-[#2A2A2A] text-gray-400 hover:border-[#3A3A3A]'
                    }`}
                    style={formData.status === s.id ? { background: s.bg, color: s.color } : {}}
                  >
                    {s.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Current File & New File Upload */}
            <div>
              <label className="block text-sm font-semibold text-gray-400 mb-2">
                <Upload size={14} className="inline mr-2" />
                PDF fakture
              </label>

              {/* Current file */}
              <div className="flex items-center gap-4 p-4 bg-[#0a0a0a] border border-[#2A2A2A] rounded-xl mb-3">
                <div className="w-12 h-12 rounded-lg bg-red-500/10 flex items-center justify-center">
                  <File size={24} className="text-red-500" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-white font-medium truncate">{invoice.file_name}</p>
                  <p className="text-sm text-gray-400">
                    {invoice.file_size ? `${(invoice.file_size / 1024).toFixed(1)} KB` : 'Veličina nepoznata'}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={handleDownload}
                  className="px-4 py-2 text-sm text-[#00FF94] hover:underline"
                >
                  Preuzmi
                </button>
              </div>

              {/* New file upload */}
              {!newFile ? (
                <div
                  className={`relative border-2 border-dashed rounded-xl p-6 text-center transition-all ${
                    dragActive
                      ? 'border-[#00FF94] bg-[#00FF94]/5'
                      : 'border-[#2A2A2A] hover:border-[#3A3A3A]'
                  }`}
                  onDragEnter={handleDrag}
                  onDragLeave={handleDrag}
                  onDragOver={handleDrag}
                  onDrop={handleDrop}
                >
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept=".pdf,application/pdf"
                    onChange={handleFileSelect}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  />
                  <p className="text-gray-400 text-sm">
                    Zamijeni PDF: povuci i ispusti ili <span className="text-[#00FF94]">klikni za odabir</span>
                  </p>
                </div>
              ) : (
                <div className="flex items-center gap-4 p-4 bg-[#00FF94]/5 border border-[#00FF94]/20 rounded-xl">
                  <div className="w-12 h-12 rounded-lg bg-[#00FF94]/10 flex items-center justify-center">
                    <File size={24} className="text-[#00FF94]" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-white font-medium truncate">{newFile.name}</p>
                    <p className="text-sm text-[#00FF94]">Nova datoteka za učitavanje</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setNewFile(null)}
                    className="p-2 text-gray-400 hover:text-red-500 transition-colors"
                  >
                    <X size={20} />
                  </button>
                </div>
              )}
            </div>

            {/* Notes */}
            <div>
              <label className="block text-sm font-semibold text-gray-400 mb-2">
                Napomene
              </label>
              <textarea
                value={formData.notes || ''}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                rows={3}
                className="w-full px-4 py-3 bg-[#0a0a0a] border border-[#2A2A2A] rounded-xl text-white focus:border-[#00FF94] focus:outline-none resize-none"
              />
            </div>

            {/* Actions */}
            <div className="flex gap-3 pt-6 border-t border-[#2A2A2A]">
              <button
                type="submit"
                disabled={saving}
                className="flex-1 inline-flex items-center justify-center gap-2 px-6 py-3 bg-[#00FF94] text-black rounded-xl font-bold hover:shadow-lg hover:shadow-[#00FF94]/30 transition-all disabled:opacity-50"
              >
                {saving ? (
                  <>
                    <Loader2 size={18} className="animate-spin" />
                    {uploading ? 'Učitavanje...' : 'Spremanje...'}
                  </>
                ) : (
                  <>
                    <Save size={18} />
                    Spremi promjene
                  </>
                )}
              </button>
              <button
                type="button"
                onClick={() => {
                  setEditing(false);
                  setFormData(invoice);
                  setNewFile(null);
                }}
                className="px-6 py-3 bg-[#2A2A2A] text-white rounded-xl font-bold hover:bg-[#3A3A3A] transition-all"
              >
                Odustani
              </button>
              <button
                type="button"
                onClick={handleDelete}
                className="px-6 py-3 bg-red-500/10 text-red-500 rounded-xl font-bold hover:bg-red-500/20 transition-all"
              >
                <Trash2 size={18} />
              </button>
            </div>
          </div>
        </form>
      ) : (
        /* View Mode */
        <div className="grid gap-6">
          {/* Main Info Card */}
          <div className="bg-[#1a1a1a] border border-[#2A2A2A] rounded-2xl p-8">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              <div>
                <div className="text-sm text-gray-400 mb-1">Iznos</div>
                <div className="text-3xl font-bold text-white">
                  €{Number(invoice.amount).toLocaleString()}
                </div>
              </div>

              <div>
                <div className="text-sm text-gray-400 mb-1">Datum izdavanja</div>
                <div className="text-lg font-semibold text-white">
                  {new Date(invoice.issue_date).toLocaleDateString('hr-HR')}
                </div>
              </div>

              <div>
                <div className="text-sm text-gray-400 mb-1">Datum dospijeća</div>
                <div className={`text-lg font-semibold ${invoice.status === 'overdue' ? 'text-red-500' : 'text-white'}`}>
                  {invoice.due_date
                    ? new Date(invoice.due_date).toLocaleDateString('hr-HR')
                    : '-'}
                </div>
              </div>

              <div>
                <div className="text-sm text-gray-400 mb-1">Status</div>
                <span
                  className="inline-block px-3 py-1.5 rounded-lg text-sm font-semibold"
                  style={{ background: status.bg, color: status.color }}
                >
                  {status.label}
                </span>
              </div>
            </div>
          </div>

          {/* Client Card */}
          <div className="bg-[#1a1a1a] border border-[#2A2A2A] rounded-2xl p-6">
            <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
              <Building2 size={20} className="text-[#00FF94]" />
              Klijent
            </h3>
            <Link
              href={`/crm/clients/${invoice.client_id}`}
              className="text-[#00FF94] hover:underline font-semibold"
            >
              {clientName}
            </Link>
          </div>

          {/* File Card */}
          <div className="bg-[#1a1a1a] border border-[#2A2A2A] rounded-2xl p-6">
            <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
              <FileText size={20} className="text-[#00FF94]" />
              Datoteka
            </h3>
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-lg bg-red-500/10 flex items-center justify-center">
                <File size={24} className="text-red-500" />
              </div>
              <div className="flex-1">
                <p className="text-white font-medium">{invoice.file_name}</p>
                <p className="text-sm text-gray-400">
                  {invoice.file_size ? `${(invoice.file_size / 1024).toFixed(1)} KB` : ''}
                </p>
              </div>
              <button
                onClick={handleDownload}
                className="inline-flex items-center gap-2 px-4 py-2.5 bg-[#2A2A2A] text-white rounded-xl font-semibold hover:bg-[#3A3A3A] transition-all"
              >
                <Download size={18} />
                Preuzmi
              </button>
            </div>
          </div>

          {/* Notes Card */}
          {invoice.notes && (
            <div className="bg-[#1a1a1a] border border-[#2A2A2A] rounded-2xl p-6">
              <h3 className="text-lg font-bold text-white mb-4">Napomene</h3>
              <p className="text-gray-300 whitespace-pre-wrap">{invoice.notes}</p>
            </div>
          )}

          {/* Delete Button */}
          <div className="flex justify-end pt-4">
            <button
              onClick={handleDelete}
              className="inline-flex items-center gap-2 px-4 py-2.5 bg-red-500/10 text-red-500 rounded-xl font-semibold hover:bg-red-500/20 transition-all"
            >
              <Trash2 size={18} />
              Obriši fakturu
            </button>
          </div>
        </div>
      )}

      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeIn {
          animation: fadeIn 0.5s ease-out;
        }
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .animate-spin {
          animation: spin 1s linear infinite;
        }
      `}</style>
    </div>
  );
}
