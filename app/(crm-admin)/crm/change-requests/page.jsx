'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import Link from 'next/link';
import {
  FileEdit,
  Search,
  Clock,
  CheckCircle2,
  AlertCircle,
  Eye,
  ExternalLink,
  Calendar,
  MessageSquare,
  X,
  Save,
  Loader2,
} from 'lucide-react';

const STATUS_CONFIG = {
  submitted: { bg: 'bg-yellow-500/10', text: 'text-yellow-500', label: 'Poslano' },
  in_review: { bg: 'bg-blue-500/10', text: 'text-blue-500', label: 'Na pregledu' },
  in_progress: { bg: 'bg-indigo-500/10', text: 'text-indigo-500', label: 'U obradi' },
  completed: { bg: 'bg-green-500/10', text: 'text-green-500', label: 'Završeno' },
  declined: { bg: 'bg-red-500/10', text: 'text-red-500', label: 'Odbijeno' },
};

const PRIORITY_CONFIG = {
  low: { bg: 'bg-gray-500/10', text: 'text-gray-400', label: 'Nisko' },
  normal: { bg: 'bg-blue-500/10', text: 'text-blue-400', label: 'Normalno' },
  high: { bg: 'bg-yellow-500/10', text: 'text-yellow-400', label: 'Visoko' },
  urgent: { bg: 'bg-red-500/10', text: 'text-red-400', label: 'Hitno' },
};

export default function ChangeRequestsPage() {
  const [loading, setLoading] = useState(true);
  const [requests, setRequests] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterPriority, setFilterPriority] = useState('all');
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [adminNotes, setAdminNotes] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    loadRequests();
  }, []);

  const loadRequests = async () => {
    const { data, error } = await supabase
      .from('website_change_requests')
      .select(`
        *,
        client:clients(id, name, company),
        submitted_by_user:portal_users(id, name, email)
      `)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error loading requests:', error);
    } else {
      setRequests(data || []);
    }

    setLoading(false);
  };

  const handleStatusChange = async (id, newStatus) => {
    const updates = {
      status: newStatus,
      ...(newStatus === 'completed' && { completed_at: new Date().toISOString() }),
    };

    const { error } = await supabase
      .from('website_change_requests')
      .update(updates)
      .eq('id', id);

    if (error) {
      console.error('Error updating status:', error);
    } else {
      setRequests(requests.map((r) => r.id === id ? { ...r, ...updates } : r));
    }
  };

  const handleSaveNotes = async () => {
    if (!selectedRequest) return;
    setSaving(true);

    const { error } = await supabase
      .from('website_change_requests')
      .update({ admin_notes: adminNotes })
      .eq('id', selectedRequest.id);

    if (error) {
      console.error('Error saving notes:', error);
    } else {
      setRequests(requests.map((r) =>
        r.id === selectedRequest.id ? { ...r, admin_notes: adminNotes } : r
      ));
      setSelectedRequest(null);
    }

    setSaving(false);
  };

  const filteredRequests = requests.filter((req) => {
    if (filterStatus !== 'all' && req.status !== filterStatus) return false;
    if (filterPriority !== 'all' && req.priority !== filterPriority) return false;
    if (searchTerm && !req.title.toLowerCase().includes(searchTerm.toLowerCase())) return false;
    return true;
  });

  const openCount = requests.filter((r) => ['submitted', 'in_review', 'in_progress'].includes(r.status)).length;

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-2xl text-[#00FF94]">Učitavanje...</div>
      </div>
    );
  }

  return (
    <div className="animate-fadeIn">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-black text-white mb-2">Zahtjevi klijenata</h1>
        <p className="text-gray-400">Upravljajte zahtjevima za izmjene od klijenata</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
        <div className="bg-[#1a1a1a] border border-[#2A2A2A] rounded-2xl p-5">
          <div className="text-3xl font-black text-white mb-1">{requests.length}</div>
          <div className="text-sm text-gray-400">Ukupno</div>
        </div>
        <div className="bg-[#1a1a1a] border border-[#2A2A2A] rounded-2xl p-5">
          <div className="text-3xl font-black text-yellow-500 mb-1">{openCount}</div>
          <div className="text-sm text-gray-400">Otvoreno</div>
        </div>
        <div className="bg-[#1a1a1a] border border-[#2A2A2A] rounded-2xl p-5">
          <div className="text-3xl font-black text-green-500 mb-1">
            {requests.filter((r) => r.status === 'completed').length}
          </div>
          <div className="text-sm text-gray-400">Završeno</div>
        </div>
        <div className="bg-[#1a1a1a] border border-[#2A2A2A] rounded-2xl p-5">
          <div className="text-3xl font-black text-red-500 mb-1">
            {requests.filter((r) => r.priority === 'urgent').length}
          </div>
          <div className="text-sm text-gray-400">Hitno</div>
        </div>
        <div className="bg-[#1a1a1a] border border-[#2A2A2A] rounded-2xl p-5">
          <div className="text-3xl font-black text-indigo-500 mb-1">
            {requests.filter((r) => r.status === 'in_progress').length}
          </div>
          <div className="text-sm text-gray-400">U obradi</div>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-4 mb-6">
        <div className="relative flex-1 min-w-[250px] max-w-md">
          <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Pretraži zahtjeve..."
            className="w-full pl-11 pr-4 py-3 bg-[#1a1a1a] border border-[#2A2A2A] rounded-xl text-white focus:border-[#00FF94] focus:outline-none"
          />
        </div>

        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="px-4 py-3 bg-[#1a1a1a] border border-[#2A2A2A] rounded-xl text-white focus:border-[#00FF94] focus:outline-none"
        >
          <option value="all">Svi statusi</option>
          <option value="submitted">Poslano</option>
          <option value="in_review">Na pregledu</option>
          <option value="in_progress">U obradi</option>
          <option value="completed">Završeno</option>
          <option value="declined">Odbijeno</option>
        </select>

        <select
          value={filterPriority}
          onChange={(e) => setFilterPriority(e.target.value)}
          className="px-4 py-3 bg-[#1a1a1a] border border-[#2A2A2A] rounded-xl text-white focus:border-[#00FF94] focus:outline-none"
        >
          <option value="all">Svi prioriteti</option>
          <option value="urgent">Hitno</option>
          <option value="high">Visoko</option>
          <option value="normal">Normalno</option>
          <option value="low">Nisko</option>
        </select>
      </div>

      {/* Requests List */}
      {filteredRequests.length === 0 ? (
        <div className="bg-[#1a1a1a] border border-[#2A2A2A] rounded-2xl p-12 text-center">
          <FileEdit size={48} className="mx-auto mb-4 text-gray-600" />
          <h3 className="text-xl font-bold text-white mb-2">Nema zahtjeva</h3>
          <p className="text-gray-400">Zahtjevi klijenata će se pojaviti ovdje</p>
        </div>
      ) : (
        <div className="bg-[#1a1a1a] border border-[#2A2A2A] rounded-2xl overflow-hidden">
          {filteredRequests.map((request, index) => {
            const status = STATUS_CONFIG[request.status] || STATUS_CONFIG.submitted;
            const priority = PRIORITY_CONFIG[request.priority] || PRIORITY_CONFIG.normal;

            return (
              <div
                key={request.id}
                className={`p-5 hover:bg-[#222] transition-colors ${
                  index < filteredRequests.length - 1 ? 'border-b border-[#2A2A2A]' : ''
                }`}
              >
                <div className="flex items-start gap-4">
                  {/* Icon */}
                  <div className={`w-12 h-12 rounded-xl ${status.bg} flex items-center justify-center flex-shrink-0`}>
                    <FileEdit size={22} className={status.text} />
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 mb-2 flex-wrap">
                      <h3 className="text-lg font-semibold text-white">{request.title}</h3>
                      <span className={`px-2.5 py-1 rounded-lg text-xs font-semibold ${priority.bg} ${priority.text}`}>
                        {priority.label}
                      </span>
                    </div>

                    <p className="text-gray-400 text-sm mb-3 line-clamp-2">
                      {request.description}
                    </p>

                    <div className="flex items-center gap-4 flex-wrap text-sm text-gray-500">
                      <span className={`px-2.5 py-1 rounded-lg text-xs font-semibold ${status.bg} ${status.text}`}>
                        {status.label}
                      </span>
                      <span className="flex items-center gap-1">
                        <Calendar size={14} />
                        {new Date(request.created_at).toLocaleDateString('hr-HR')}
                      </span>
                      <span>{request.client?.company || request.client?.name || 'N/A'}</span>
                      {request.page_url && (
                        <a
                          href={request.page_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-1 text-[#00FF94] hover:underline"
                        >
                          <ExternalLink size={14} />
                          Stranica
                        </a>
                      )}
                    </div>

                    {/* Admin Notes Preview */}
                    {request.admin_notes && (
                      <div className="mt-3 p-3 bg-[#00FF94]/5 border-l-2 border-[#00FF94] rounded-r-lg">
                        <div className="text-xs text-[#00FF94] font-semibold mb-1">Vaša bilješka:</div>
                        <p className="text-sm text-gray-300">{request.admin_notes}</p>
                      </div>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="flex flex-col gap-2 flex-shrink-0">
                    <select
                      value={request.status}
                      onChange={(e) => handleStatusChange(request.id, e.target.value)}
                      className="px-3 py-2 bg-[#0a0a0a] border border-[#2A2A2A] rounded-lg text-sm text-white cursor-pointer focus:border-[#00FF94] focus:outline-none"
                    >
                      <option value="submitted">Poslano</option>
                      <option value="in_review">Na pregledu</option>
                      <option value="in_progress">U obradi</option>
                      <option value="completed">Završeno</option>
                      <option value="declined">Odbijeno</option>
                    </select>

                    <button
                      onClick={() => {
                        setSelectedRequest(request);
                        setAdminNotes(request.admin_notes || '');
                      }}
                      className="px-3 py-2 bg-[#2A2A2A] text-white rounded-lg text-sm hover:bg-[#3A3A3A] transition-colors flex items-center gap-1.5 justify-center"
                    >
                      <MessageSquare size={14} />
                      Bilješka
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Notes Modal */}
      {selectedRequest && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-[#1a1a1a] border border-[#2A2A2A] rounded-2xl p-6 w-full max-w-lg">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold text-white">Bilješka za klijenta</h3>
              <button
                onClick={() => setSelectedRequest(null)}
                className="p-2 text-gray-400 hover:text-white hover:bg-[#2A2A2A] rounded-lg"
              >
                <X size={20} />
              </button>
            </div>

            <div className="mb-2 text-sm text-gray-400">
              Zahtjev: <span className="text-white">{selectedRequest.title}</span>
            </div>

            <textarea
              value={adminNotes}
              onChange={(e) => setAdminNotes(e.target.value)}
              placeholder="Napišite odgovor ili bilješku za klijenta..."
              rows={5}
              className="w-full px-4 py-3 bg-[#0a0a0a] border border-[#2A2A2A] rounded-xl text-white focus:border-[#00FF94] focus:outline-none resize-none mb-4"
            />

            <div className="flex gap-3">
              <button
                onClick={handleSaveNotes}
                disabled={saving}
                className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-3 bg-[#00FF94] text-black rounded-xl font-bold hover:shadow-lg transition-all disabled:opacity-50"
              >
                {saving ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}
                {saving ? 'Spremanje...' : 'Spremi'}
              </button>
              <button
                onClick={() => setSelectedRequest(null)}
                className="px-4 py-3 bg-[#2A2A2A] text-white rounded-xl font-bold hover:bg-[#3A3A3A] transition-all"
              >
                Odustani
              </button>
            </div>
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
        .line-clamp-2 {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
      `}</style>
    </div>
  );
}
