'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import Link from 'next/link';
import {
  Plus,
  Search,
  Calendar,
  Clock,
  CheckCircle2,
  AlertCircle,
  Eye,
  Filter,
  MoreVertical,
  Trash2,
  Edit,
} from 'lucide-react';

const PLATFORM_CONFIG = {
  instagram: { bg: 'bg-pink-500/10', text: 'text-pink-500', label: 'Instagram' },
  facebook: { bg: 'bg-blue-500/10', text: 'text-blue-500', label: 'Facebook' },
  linkedin: { bg: 'bg-indigo-500/10', text: 'text-indigo-500', label: 'LinkedIn' },
  tiktok: { bg: 'bg-gray-500/10', text: 'text-gray-400', label: 'TikTok' },
};

const STATUS_CONFIG = {
  pending: { bg: 'bg-yellow-500/10', text: 'text-yellow-500', label: 'Čeka odobrenje' },
  approved: { bg: 'bg-green-500/10', text: 'text-green-500', label: 'Odobreno' },
  revision_requested: { bg: 'bg-red-500/10', text: 'text-red-500', label: 'Treba izmjene' },
  published: { bg: 'bg-indigo-500/10', text: 'text-indigo-500', label: 'Objavljeno' },
};

// Helper to get thumbnail URL from various sources
const getThumbnailUrl = (url) => {
  if (!url) return null;

  // Google Drive
  const driveFileMatch = url.match(/drive\.google\.com\/file\/d\/([a-zA-Z0-9_-]+)/);
  if (driveFileMatch) {
    return `https://drive.google.com/uc?export=view&id=${driveFileMatch[1]}`;
  }
  const driveOpenMatch = url.match(/drive\.google\.com\/open\?id=([a-zA-Z0-9_-]+)/);
  if (driveOpenMatch) {
    return `https://drive.google.com/uc?export=view&id=${driveOpenMatch[1]}`;
  }

  // YouTube
  const youtubeMatch = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([a-zA-Z0-9_-]+)/);
  if (youtubeMatch) {
    return `https://img.youtube.com/vi/${youtubeMatch[1]}/mqdefault.jpg`;
  }

  // Direct URL (fallback)
  return url;
};

export default function ContentManagementPage() {
  const [loading, setLoading] = useState(true);
  const [content, setContent] = useState([]);
  const [clients, setClients] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterClient, setFilterClient] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterPlatform, setFilterPlatform] = useState('all');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    // Load content with client info
    const { data: contentData, error: contentError } = await supabase
      .from('content_items')
      .select(`
        *,
        client:clients(id, name, company)
      `)
      .order('scheduled_date', { ascending: false });

    if (contentError) {
      console.error('Error loading content:', contentError);
    } else {
      setContent(contentData || []);
    }

    // Load clients for filter
    const { data: clientsData } = await supabase
      .from('clients')
      .select('id, name, company')
      .order('name');

    setClients(clientsData || []);
    setLoading(false);
  };

  const handleDelete = async (id) => {
    if (!confirm('Jeste li sigurni da želite obrisati ovaj sadržaj?')) return;

    const { error } = await supabase
      .from('content_items')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting:', error);
      alert('Greška pri brisanju');
    } else {
      setContent(content.filter((c) => c.id !== id));
    }
  };

  const handleStatusChange = async (id, newStatus) => {
    const { error } = await supabase
      .from('content_items')
      .update({ status: newStatus })
      .eq('id', id);

    if (error) {
      console.error('Error updating status:', error);
    } else {
      setContent(content.map((c) => c.id === id ? { ...c, status: newStatus } : c));
    }
  };

  const filteredContent = content.filter((item) => {
    if (filterClient !== 'all' && item.client_id !== filterClient) return false;
    if (filterStatus !== 'all' && item.status !== filterStatus) return false;
    if (filterPlatform !== 'all' && item.platform !== filterPlatform) return false;
    if (searchTerm && !item.caption?.toLowerCase().includes(searchTerm.toLowerCase())) return false;
    return true;
  });

  const pendingCount = content.filter((c) => c.status === 'pending').length;
  const revisionCount = content.filter((c) => c.status === 'revision_requested').length;

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
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 mb-8">
        <div>
          <h1 className="text-4xl font-black text-white mb-2">Sadržaj za odobrenje</h1>
          <p className="text-gray-400">Upravljajte sadržajem za društvene mreže</p>
        </div>

        <Link
          href="/crm/content/new"
          className="inline-flex items-center gap-2 px-5 py-3 bg-[#00FF94] text-black rounded-xl font-bold hover:shadow-lg hover:shadow-[#00FF94]/30 transition-all"
        >
          <Plus size={20} />
          Novi sadržaj
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="bg-[#1a1a1a] border border-[#2A2A2A] rounded-2xl p-5">
          <div className="text-3xl font-black text-white mb-1">{content.length}</div>
          <div className="text-sm text-gray-400">Ukupno</div>
        </div>
        <div className="bg-[#1a1a1a] border border-[#2A2A2A] rounded-2xl p-5">
          <div className="text-3xl font-black text-yellow-500 mb-1">{pendingCount}</div>
          <div className="text-sm text-gray-400">Čeka odobrenje</div>
        </div>
        <div className="bg-[#1a1a1a] border border-[#2A2A2A] rounded-2xl p-5">
          <div className="text-3xl font-black text-red-500 mb-1">{revisionCount}</div>
          <div className="text-sm text-gray-400">Treba izmjene</div>
        </div>
        <div className="bg-[#1a1a1a] border border-[#2A2A2A] rounded-2xl p-5">
          <div className="text-3xl font-black text-green-500 mb-1">
            {content.filter((c) => c.status === 'approved').length}
          </div>
          <div className="text-sm text-gray-400">Odobreno</div>
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
            placeholder="Pretraži sadržaj..."
            className="w-full pl-11 pr-4 py-3 bg-[#1a1a1a] border border-[#2A2A2A] rounded-xl text-white focus:border-[#00FF94] focus:outline-none"
          />
        </div>

        <select
          value={filterClient}
          onChange={(e) => setFilterClient(e.target.value)}
          className="px-4 py-3 bg-[#1a1a1a] border border-[#2A2A2A] rounded-xl text-white focus:border-[#00FF94] focus:outline-none"
        >
          <option value="all">Svi klijenti</option>
          {clients.map((client) => (
            <option key={client.id} value={client.id}>
              {client.company || client.name}
            </option>
          ))}
        </select>

        <select
          value={filterPlatform}
          onChange={(e) => setFilterPlatform(e.target.value)}
          className="px-4 py-3 bg-[#1a1a1a] border border-[#2A2A2A] rounded-xl text-white focus:border-[#00FF94] focus:outline-none"
        >
          <option value="all">Sve platforme</option>
          <option value="instagram">Instagram</option>
          <option value="facebook">Facebook</option>
          <option value="linkedin">LinkedIn</option>
          <option value="tiktok">TikTok</option>
        </select>

        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="px-4 py-3 bg-[#1a1a1a] border border-[#2A2A2A] rounded-xl text-white focus:border-[#00FF94] focus:outline-none"
        >
          <option value="all">Svi statusi</option>
          <option value="pending">Čeka odobrenje</option>
          <option value="approved">Odobreno</option>
          <option value="revision_requested">Treba izmjene</option>
          <option value="published">Objavljeno</option>
        </select>
      </div>

      {/* Content List */}
      {filteredContent.length === 0 ? (
        <div className="bg-[#1a1a1a] border border-[#2A2A2A] rounded-2xl p-12 text-center">
          <Calendar size={48} className="mx-auto mb-4 text-gray-600" />
          <h3 className="text-xl font-bold text-white mb-2">Nema sadržaja</h3>
          <p className="text-gray-400 mb-6">Kreirajte novi sadržaj za vaše klijente</p>
          <Link
            href="/crm/content/new"
            className="inline-flex items-center gap-2 px-5 py-3 bg-[#00FF94] text-black rounded-xl font-bold"
          >
            <Plus size={18} />
            Kreiraj sadržaj
          </Link>
        </div>
      ) : (
        <div className="bg-[#1a1a1a] border border-[#2A2A2A] rounded-2xl overflow-hidden">
          {filteredContent.map((item, index) => {
            const platform = PLATFORM_CONFIG[item.platform] || PLATFORM_CONFIG.instagram;
            const status = STATUS_CONFIG[item.status] || STATUS_CONFIG.pending;

            return (
              <Link
                key={item.id}
                href={`/crm/content/${item.id}`}
                className={`flex items-center gap-5 p-5 hover:bg-[#222] transition-colors ${
                  index < filteredContent.length - 1 ? 'border-b border-[#2A2A2A]' : ''
                }`}
              >
                {/* Thumbnail */}
                {item.media_urls?.[0] ? (
                  <div className="w-16 h-16 rounded-lg overflow-hidden flex-shrink-0 bg-[#2A2A2A]">
                    <img
                      src={getThumbnailUrl(item.media_urls[0])}
                      alt=""
                      className="w-full h-full object-cover"
                      onError={(e) => e.target.style.display = 'none'}
                    />
                  </div>
                ) : (
                  <div className={`w-16 h-16 rounded-lg ${platform.bg} flex items-center justify-center flex-shrink-0`}>
                    <span className={`text-lg font-bold ${platform.text}`}>
                      {platform.label.slice(0, 2)}
                    </span>
                  </div>
                )}

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 mb-2">
                    <span className={`px-2.5 py-1 rounded-lg text-xs font-semibold ${platform.bg} ${platform.text}`}>
                      {platform.label}
                    </span>
                    <span className="text-sm text-gray-500 capitalize">{item.content_type}</span>
                  </div>
                  <div className="text-white font-semibold mb-1 truncate">
                    {item.caption?.slice(0, 60) || 'Bez opisa'}
                    {item.caption?.length > 60 && '...'}
                  </div>
                  <div className="flex items-center gap-4 text-sm text-gray-500">
                    <span className="flex items-center gap-1">
                      <Calendar size={14} />
                      {new Date(item.scheduled_date).toLocaleDateString('hr-HR')}
                    </span>
                    <span>{item.client?.company || item.client?.name || 'N/A'}</span>
                  </div>
                </div>

                {/* Status */}
                <div className={`px-3 py-1.5 rounded-lg text-sm font-semibold ${status.bg} ${status.text} flex-shrink-0`}>
                  {status.label}
                </div>

                {/* Client Feedback */}
                {item.client_feedback && (
                  <div className="max-w-[200px] text-sm text-gray-400 italic truncate flex-shrink-0">
                    "{item.client_feedback.slice(0, 50)}{item.client_feedback.length > 50 && '...'}"
                  </div>
                )}

                {/* Actions */}
                <div className="flex items-center gap-2 flex-shrink-0" onClick={(e) => e.preventDefault()}>
                  <select
                    value={item.status}
                    onChange={(e) => {
                      e.preventDefault();
                      handleStatusChange(item.id, e.target.value);
                    }}
                    onClick={(e) => e.preventDefault()}
                    className="px-3 py-2 bg-[#0a0a0a] border border-[#2A2A2A] rounded-lg text-sm text-white cursor-pointer"
                  >
                    <option value="pending">Čeka</option>
                    <option value="approved">Odobreno</option>
                    <option value="revision_requested">Treba izmjene</option>
                    <option value="published">Objavljeno</option>
                  </select>

                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      handleDelete(item.id);
                    }}
                    className="p-2 text-gray-500 hover:text-red-500 hover:bg-red-500/10 rounded-lg transition-colors"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </Link>
            );
          })}
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
      `}</style>
    </div>
  );
}
