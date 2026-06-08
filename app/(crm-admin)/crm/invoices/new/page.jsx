'use client';

import { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import Link from 'next/link';
import {
  ArrowLeft,
  Save,
  Calendar,
  Euro,
  FileText,
  Upload,
  X,
  Loader2,
  File,
} from 'lucide-react';

const STATUS_OPTIONS = [
  { id: 'unpaid', label: 'Neplaćeno', bg: '#FEF3C7', color: '#D97706' },
  { id: 'paid', label: 'Plaćeno', bg: '#D1FAE5', color: '#059669' },
  { id: 'overdue', label: 'Dospjelo', bg: '#FEE2E2', color: '#DC2626' },
];

export default function NewInvoicePage() {
  const router = useRouter();
  const fileInputRef = useRef(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [clients, setClients] = useState([]);
  const [dragActive, setDragActive] = useState(false);
  const [formData, setFormData] = useState({
    client_id: '',
    invoice_number: '',
    amount: '',
    issue_date: new Date().toISOString().split('T')[0],
    due_date: '',
    status: 'unpaid',
    notes: '',
  });
  const [file, setFile] = useState(null);
  const [uploadError, setUploadError] = useState('');

  useEffect(() => {
    loadClients();
  }, []);

  const loadClients = async () => {
    const { data } = await supabase
      .from('clients')
      .select('id, name, company')
      .order('name');

    setClients(data || []);
    setLoading(false);
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
    setUploadError('');

    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile) {
      validateAndSetFile(droppedFile);
    }
  };

  const handleFileSelect = (e) => {
    setUploadError('');
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      validateAndSetFile(selectedFile);
    }
  };

  const validateAndSetFile = (selectedFile) => {
    // Check file type
    if (selectedFile.type !== 'application/pdf') {
      setUploadError('Samo PDF datoteke su dozvoljene');
      return;
    }

    // Check file size (max 10MB)
    if (selectedFile.size > 10 * 1024 * 1024) {
      setUploadError('Datoteka je prevelika (max 10MB)');
      return;
    }

    setFile(selectedFile);
  };

  const removeFile = () => {
    setFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setUploadError('');

    // Validation
    if (!formData.client_id) {
      alert('Molimo odaberite klijenta');
      setSaving(false);
      return;
    }

    if (!formData.invoice_number) {
      alert('Molimo unesite broj fakture');
      setSaving(false);
      return;
    }

    if (!formData.amount || Number(formData.amount) <= 0) {
      alert('Molimo unesite ispravan iznos');
      setSaving(false);
      return;
    }

    if (!file) {
      alert('Molimo učitajte PDF fakture');
      setSaving(false);
      return;
    }

    try {
      setUploading(true);

      // Generate file path: client_id/invoice_number.pdf
      const fileExt = file.name.split('.').pop();
      const filePath = `${formData.client_id}/${formData.invoice_number.replace(/[^a-zA-Z0-9-]/g, '_')}.${fileExt}`;

      // Upload file to Supabase Storage
      const { error: uploadError } = await supabase.storage
        .from('invoices')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: true,
        });

      if (uploadError) {
        console.error('Upload error:', uploadError);
        setUploadError('Greška pri učitavanju datoteke: ' + uploadError.message);
        setSaving(false);
        setUploading(false);
        return;
      }

      setUploading(false);

      // Create invoice record
      const { error: insertError } = await supabase
        .from('invoices')
        .insert({
          client_id: formData.client_id,
          invoice_number: formData.invoice_number,
          amount: Number(formData.amount),
          issue_date: formData.issue_date,
          due_date: formData.due_date || null,
          status: formData.status,
          file_path: filePath,
          file_name: file.name,
          file_size: file.size,
          notes: formData.notes || null,
        });

      if (insertError) {
        console.error('Insert error:', insertError);
        // Try to clean up uploaded file
        await supabase.storage.from('invoices').remove([filePath]);
        alert('Greška pri kreiranju fakture: ' + insertError.message);
        setSaving(false);
        return;
      }

      router.push('/crm/invoices');
    } catch (error) {
      console.error('Error:', error);
      alert('Greška pri kreiranju fakture');
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-2xl text-[#00FF94]">Učitavanje...</div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl animate-fadeIn">
      {/* Header */}
      <Link
        href="/crm/invoices"
        className="inline-flex items-center gap-2 text-gray-400 hover:text-[#00FF94] mb-6 transition-colors"
      >
        <ArrowLeft size={16} />
        Natrag na fakture
      </Link>

      <h1 className="text-4xl font-black text-white mb-8">Nova faktura</h1>

      {/* Form */}
      <form onSubmit={handleSubmit}>
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
              <option value="">Odaberi klijenta...</option>
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
                placeholder="NPR-2026-001"
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
                placeholder="1000.00"
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
                value={formData.due_date}
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
              {STATUS_OPTIONS.map((status) => (
                <button
                  key={status.id}
                  type="button"
                  onClick={() => setFormData({ ...formData, status: status.id })}
                  className={`flex-1 px-4 py-3 rounded-xl text-sm font-semibold transition-all ${
                    formData.status === status.id
                      ? ''
                      : 'bg-[#0a0a0a] border border-[#2A2A2A] text-gray-400 hover:border-[#3A3A3A]'
                  }`}
                  style={
                    formData.status === status.id
                      ? { background: status.bg, color: status.color }
                      : {}
                  }
                >
                  {status.label}
                </button>
              ))}
            </div>
          </div>

          {/* File Upload */}
          <div>
            <label className="block text-sm font-semibold text-gray-400 mb-2">
              <Upload size={14} className="inline mr-2" />
              PDF fakture *
            </label>

            {!file ? (
              <div
                className={`relative border-2 border-dashed rounded-xl p-8 text-center transition-all ${
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
                <Upload size={32} className="mx-auto mb-4 text-gray-500" />
                <p className="text-gray-400 mb-2">
                  Povuci i ispusti PDF ovdje ili{' '}
                  <span className="text-[#00FF94]">klikni za odabir</span>
                </p>
                <p className="text-sm text-gray-500">Max 10MB, samo PDF</p>
              </div>
            ) : (
              <div className="flex items-center gap-4 p-4 bg-[#0a0a0a] border border-[#2A2A2A] rounded-xl">
                <div className="w-12 h-12 rounded-lg bg-red-500/10 flex items-center justify-center">
                  <File size={24} className="text-red-500" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-white font-medium truncate">{file.name}</p>
                  <p className="text-sm text-gray-400">
                    {(file.size / 1024).toFixed(1)} KB
                  </p>
                </div>
                <button
                  type="button"
                  onClick={removeFile}
                  className="p-2 text-gray-400 hover:text-red-500 transition-colors"
                >
                  <X size={20} />
                </button>
              </div>
            )}

            {uploadError && (
              <p className="mt-2 text-sm text-red-500">{uploadError}</p>
            )}
          </div>

          {/* Notes */}
          <div>
            <label className="block text-sm font-semibold text-gray-400 mb-2">
              Napomene (opcionalno)
            </label>
            <textarea
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              rows={3}
              placeholder="Dodatne napomene o fakturi..."
              className="w-full px-4 py-3 bg-[#0a0a0a] border border-[#2A2A2A] rounded-xl text-white focus:border-[#00FF94] focus:outline-none resize-none"
            />
          </div>

          {/* Submit */}
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
                  Spremi fakturu
                </>
              )}
            </button>
            <Link
              href="/crm/invoices"
              className="px-6 py-3 bg-[#2A2A2A] text-white rounded-xl font-bold hover:bg-[#3A3A3A] transition-all"
            >
              Odustani
            </Link>
          </div>
        </div>
      </form>

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
