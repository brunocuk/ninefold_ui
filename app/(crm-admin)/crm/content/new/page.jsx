'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import Link from 'next/link';
import {
  ArrowLeft,
  Save,
  Calendar,
  Clock,
  Image,
  Plus,
  X,
  Loader2,
} from 'lucide-react';

const PLATFORMS = [
  { id: 'instagram', label: 'Instagram', color: '#E4405F' },
  { id: 'facebook', label: 'Facebook', color: '#1877F2' },
  { id: 'linkedin', label: 'LinkedIn', color: '#0A66C2' },
  { id: 'tiktok', label: 'TikTok', color: '#000000' },
];

const CONTENT_TYPES = [
  { id: 'post', label: 'Post' },
  { id: 'story', label: 'Story' },
  { id: 'reel', label: 'Reel' },
  { id: 'carousel', label: 'Carousel' },
];

// Helper to parse and transform media URLs
const parseMediaUrl = (url) => {
  // Google Drive file link: https://drive.google.com/file/d/FILE_ID/view?usp=sharing
  const driveFileMatch = url.match(/drive\.google\.com\/file\/d\/([a-zA-Z0-9_-]+)/);
  if (driveFileMatch) {
    return {
      type: 'drive',
      id: driveFileMatch[1],
      imageUrl: `https://drive.google.com/uc?export=view&id=${driveFileMatch[1]}`,
      embedUrl: `https://drive.google.com/file/d/${driveFileMatch[1]}/preview`,
    };
  }

  // Google Drive open link: https://drive.google.com/open?id=FILE_ID
  const driveOpenMatch = url.match(/drive\.google\.com\/open\?id=([a-zA-Z0-9_-]+)/);
  if (driveOpenMatch) {
    return {
      type: 'drive',
      id: driveOpenMatch[1],
      imageUrl: `https://drive.google.com/uc?export=view&id=${driveOpenMatch[1]}`,
      embedUrl: `https://drive.google.com/file/d/${driveOpenMatch[1]}/preview`,
    };
  }

  // YouTube: https://www.youtube.com/watch?v=VIDEO_ID or https://youtu.be/VIDEO_ID
  const youtubeMatch = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([a-zA-Z0-9_-]+)/);
  if (youtubeMatch) {
    return {
      type: 'youtube',
      id: youtubeMatch[1],
      embedUrl: `https://www.youtube.com/embed/${youtubeMatch[1]}`,
      thumbnailUrl: `https://img.youtube.com/vi/${youtubeMatch[1]}/mqdefault.jpg`,
    };
  }

  // Vimeo: https://vimeo.com/VIDEO_ID
  const vimeoMatch = url.match(/vimeo\.com\/(\d+)/);
  if (vimeoMatch) {
    return {
      type: 'vimeo',
      id: vimeoMatch[1],
      embedUrl: `https://player.vimeo.com/video/${vimeoMatch[1]}`,
    };
  }

  // Direct image URL (fallback)
  return {
    type: 'direct',
    imageUrl: url,
  };
};

export default function NewContentPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [clients, setClients] = useState([]);
  const [contracts, setContracts] = useState([]);
  const [formData, setFormData] = useState({
    client_id: '',
    contract_id: '',
    platform: 'instagram',
    content_type: 'post',
    scheduled_date: new Date().toISOString().split('T')[0],
    scheduled_time: '12:00',
    caption: '',
    hashtags: [],
    media_urls: [],
  });
  const [newHashtag, setNewHashtag] = useState('');
  const [newMediaUrl, setNewMediaUrl] = useState('');

  useEffect(() => {
    loadClients();
  }, []);

  useEffect(() => {
    if (formData.client_id) {
      loadContracts(formData.client_id);
    }
  }, [formData.client_id]);

  const loadClients = async () => {
    const { data } = await supabase
      .from('clients')
      .select('id, name, company')
      .eq('status', 'active')
      .order('name');

    setClients(data || []);
    setLoading(false);
  };

  const loadContracts = async (clientId) => {
    const { data } = await supabase
      .from('recurring_contracts')
      .select('id, service_name')
      .eq('client_id', clientId)
      .eq('status', 'active');

    setContracts(data || []);
  };

  const handleAddHashtag = () => {
    const tag = newHashtag.trim().replace(/^#/, '');
    if (tag && !formData.hashtags.includes(tag)) {
      setFormData({ ...formData, hashtags: [...formData.hashtags, tag] });
      setNewHashtag('');
    }
  };

  const handleRemoveHashtag = (tag) => {
    setFormData({ ...formData, hashtags: formData.hashtags.filter((t) => t !== tag) });
  };

  const handleAddMedia = () => {
    const url = newMediaUrl.trim();
    if (url && !formData.media_urls.includes(url)) {
      setFormData({ ...formData, media_urls: [...formData.media_urls, url] });
      setNewMediaUrl('');
    }
  };

  const handleRemoveMedia = (url) => {
    setFormData({ ...formData, media_urls: formData.media_urls.filter((u) => u !== url) });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);

    if (!formData.client_id) {
      alert('Molimo odaberite klijenta');
      setSaving(false);
      return;
    }

    const { error } = await supabase
      .from('content_items')
      .insert({
        client_id: formData.client_id,
        contract_id: formData.contract_id || null,
        platform: formData.platform,
        content_type: formData.content_type,
        scheduled_date: formData.scheduled_date,
        scheduled_time: formData.scheduled_time || null,
        caption: formData.caption || null,
        hashtags: formData.hashtags,
        media_urls: formData.media_urls,
        status: 'pending',
      });

    if (error) {
      console.error('Error creating content:', error);
      alert('Greška pri kreiranju sadržaja');
    } else {
      router.push('/crm/content');
    }

    setSaving(false);
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
        href="/crm/content"
        className="inline-flex items-center gap-2 text-gray-400 hover:text-[#00FF94] mb-6 transition-colors"
      >
        <ArrowLeft size={16} />
        Natrag na sadržaj
      </Link>

      <h1 className="text-4xl font-black text-white mb-8">Novi sadržaj</h1>

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
              onChange={(e) => setFormData({ ...formData, client_id: e.target.value, contract_id: '' })}
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

          {/* Contract Selection */}
          {contracts.length > 0 && (
            <div>
              <label className="block text-sm font-semibold text-gray-400 mb-2">
                Ugovor (opcionalno)
              </label>
              <select
                value={formData.contract_id}
                onChange={(e) => setFormData({ ...formData, contract_id: e.target.value })}
                className="w-full px-4 py-3 bg-[#0a0a0a] border border-[#2A2A2A] rounded-xl text-white focus:border-[#00FF94] focus:outline-none"
              >
                <option value="">Bez ugovora</option>
                {contracts.map((contract) => (
                  <option key={contract.id} value={contract.id}>
                    {contract.service_name}
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Platform & Type */}
          <div className="grid grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-semibold text-gray-400 mb-2">
                Platforma *
              </label>
              <div className="grid grid-cols-2 gap-2">
                {PLATFORMS.map((platform) => (
                  <button
                    key={platform.id}
                    type="button"
                    onClick={() => setFormData({ ...formData, platform: platform.id })}
                    className={`px-4 py-3 rounded-xl text-sm font-semibold transition-all ${
                      formData.platform === platform.id
                        ? 'bg-[#00FF94] text-black'
                        : 'bg-[#0a0a0a] border border-[#2A2A2A] text-gray-400 hover:border-[#00FF94]'
                    }`}
                  >
                    {platform.label}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-400 mb-2">
                Tip sadržaja *
              </label>
              <div className="grid grid-cols-2 gap-2">
                {CONTENT_TYPES.map((type) => (
                  <button
                    key={type.id}
                    type="button"
                    onClick={() => setFormData({ ...formData, content_type: type.id })}
                    className={`px-4 py-3 rounded-xl text-sm font-semibold transition-all ${
                      formData.content_type === type.id
                        ? 'bg-[#00FF94] text-black'
                        : 'bg-[#0a0a0a] border border-[#2A2A2A] text-gray-400 hover:border-[#00FF94]'
                    }`}
                  >
                    {type.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Schedule */}
          <div className="grid grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-semibold text-gray-400 mb-2">
                <Calendar size={14} className="inline mr-2" />
                Datum *
              </label>
              <input
                type="date"
                value={formData.scheduled_date}
                onChange={(e) => setFormData({ ...formData, scheduled_date: e.target.value })}
                required
                className="w-full px-4 py-3 bg-[#0a0a0a] border border-[#2A2A2A] rounded-xl text-white focus:border-[#00FF94] focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-400 mb-2">
                <Clock size={14} className="inline mr-2" />
                Vrijeme
              </label>
              <input
                type="time"
                value={formData.scheduled_time}
                onChange={(e) => setFormData({ ...formData, scheduled_time: e.target.value })}
                className="w-full px-4 py-3 bg-[#0a0a0a] border border-[#2A2A2A] rounded-xl text-white focus:border-[#00FF94] focus:outline-none"
              />
            </div>
          </div>

          {/* Caption */}
          <div>
            <label className="block text-sm font-semibold text-gray-400 mb-2">
              Tekst objave
            </label>
            <textarea
              value={formData.caption}
              onChange={(e) => setFormData({ ...formData, caption: e.target.value })}
              rows={5}
              placeholder="Napišite tekst koji će pratiti objavu..."
              className="w-full px-4 py-3 bg-[#0a0a0a] border border-[#2A2A2A] rounded-xl text-white focus:border-[#00FF94] focus:outline-none resize-none"
            />
          </div>

          {/* Hashtags */}
          <div>
            <label className="block text-sm font-semibold text-gray-400 mb-2">
              Hashtagovi
            </label>
            <div className="flex gap-2 mb-3">
              <input
                type="text"
                value={newHashtag}
                onChange={(e) => setNewHashtag(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddHashtag())}
                placeholder="Dodaj hashtag..."
                className="flex-1 px-4 py-3 bg-[#0a0a0a] border border-[#2A2A2A] rounded-xl text-white focus:border-[#00FF94] focus:outline-none"
              />
              <button
                type="button"
                onClick={handleAddHashtag}
                className="px-4 py-3 bg-[#2A2A2A] text-white rounded-xl hover:bg-[#3A3A3A] transition-colors"
              >
                <Plus size={18} />
              </button>
            </div>
            {formData.hashtags.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {formData.hashtags.map((tag) => (
                  <span
                    key={tag}
                    className="inline-flex items-center gap-1 px-3 py-1.5 bg-[#00FF94]/10 text-[#00FF94] rounded-lg text-sm"
                  >
                    #{tag}
                    <button type="button" onClick={() => handleRemoveHashtag(tag)}>
                      <X size={14} />
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Media URLs */}
          <div>
            <label className="block text-sm font-semibold text-gray-400 mb-2">
              <Image size={14} className="inline mr-2" />
              Mediji
            </label>
            <p className="text-xs text-gray-500 mb-2">
              Google Drive, YouTube, Vimeo ili direktni URL slike
            </p>
            <div className="flex gap-2 mb-3">
              <input
                type="text"
                value={newMediaUrl}
                onChange={(e) => setNewMediaUrl(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddMedia())}
                placeholder="Zalijepi Google Drive, YouTube ili direktni link..."
                className="flex-1 px-4 py-3 bg-[#0a0a0a] border border-[#2A2A2A] rounded-xl text-white focus:border-[#00FF94] focus:outline-none"
              />
              <button
                type="button"
                onClick={handleAddMedia}
                className="px-4 py-3 bg-[#2A2A2A] text-white rounded-xl hover:bg-[#3A3A3A] transition-colors"
              >
                <Plus size={18} />
              </button>
            </div>
            {formData.media_urls.length > 0 && (
              <div className="grid grid-cols-2 gap-3">
                {formData.media_urls.map((url, i) => {
                  const media = parseMediaUrl(url);
                  return (
                    <div key={i} className="relative group">
                      {/* Google Drive - try as image first, show video player on error */}
                      {media.type === 'drive' && (
                        <div className="relative aspect-video bg-[#0a0a0a] rounded-xl overflow-hidden">
                          <img
                            src={media.imageUrl}
                            alt=""
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              // If image fails, it's probably a video - replace with iframe
                              e.target.style.display = 'none';
                              e.target.nextSibling.style.display = 'block';
                            }}
                          />
                          <iframe
                            src={media.embedUrl}
                            className="w-full h-full absolute inset-0 hidden"
                            allow="autoplay"
                            frameBorder="0"
                          />
                          <span className="absolute bottom-2 left-2 px-2 py-1 bg-black/70 text-white text-xs rounded">
                            Google Drive
                          </span>
                        </div>
                      )}

                      {/* YouTube */}
                      {media.type === 'youtube' && (
                        <div className="relative aspect-video bg-[#0a0a0a] rounded-xl overflow-hidden">
                          <img
                            src={media.thumbnailUrl}
                            alt=""
                            className="w-full h-full object-cover"
                          />
                          <div className="absolute inset-0 flex items-center justify-center">
                            <div className="w-12 h-12 bg-red-600 rounded-full flex items-center justify-center">
                              <div className="w-0 h-0 border-t-[8px] border-t-transparent border-l-[14px] border-l-white border-b-[8px] border-b-transparent ml-1" />
                            </div>
                          </div>
                          <span className="absolute bottom-2 left-2 px-2 py-1 bg-black/70 text-white text-xs rounded">
                            YouTube
                          </span>
                        </div>
                      )}

                      {/* Vimeo */}
                      {media.type === 'vimeo' && (
                        <div className="relative aspect-video bg-[#0a0a0a] rounded-xl overflow-hidden">
                          <iframe
                            src={media.embedUrl}
                            className="w-full h-full"
                            frameBorder="0"
                            allow="autoplay; fullscreen"
                          />
                          <span className="absolute bottom-2 left-2 px-2 py-1 bg-black/70 text-white text-xs rounded">
                            Vimeo
                          </span>
                        </div>
                      )}

                      {/* Direct URL (fallback) */}
                      {media.type === 'direct' && (
                        <div className="relative aspect-video bg-[#0a0a0a] rounded-xl overflow-hidden">
                          <img
                            src={media.imageUrl}
                            alt=""
                            className="w-full h-full object-cover"
                            onError={(e) => e.target.src = 'https://via.placeholder.com/300x200?text=Error'}
                          />
                        </div>
                      )}

                      {/* Remove button */}
                      <button
                        type="button"
                        onClick={() => handleRemoveMedia(url)}
                        className="absolute top-2 right-2 p-1.5 bg-red-500 text-white rounded-lg opacity-0 group-hover:opacity-100 transition-opacity z-10"
                      >
                        <X size={14} />
                      </button>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Submit */}
          <div className="flex gap-3 pt-6 border-t border-[#2A2A2A]">
            <button
              type="submit"
              disabled={saving}
              className="flex-1 inline-flex items-center justify-center gap-2 px-6 py-3 bg-[#00FF94] text-black rounded-xl font-bold hover:shadow-lg hover:shadow-[#00FF94]/30 transition-all disabled:opacity-50"
            >
              {saving ? (
                <Loader2 size={18} className="animate-spin" />
              ) : (
                <Save size={18} />
              )}
              {saving ? 'Spremanje...' : 'Spremi sadržaj'}
            </button>
            <Link
              href="/crm/content"
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
