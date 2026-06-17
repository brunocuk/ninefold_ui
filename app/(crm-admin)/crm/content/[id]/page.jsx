'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import Link from 'next/link';
import {
  ArrowLeft,
  Edit,
  Trash2,
  Save,
  X,
  Calendar,
  Clock,
  Image,
  Plus,
  Loader2,
  ExternalLink,
  MessageSquare,
  CheckCircle2,
  AlertCircle,
} from 'lucide-react';

const PLATFORMS = [
  { id: 'instagram', label: 'Instagram', color: '#E4405F', bg: 'bg-pink-500/10', text: 'text-pink-500' },
  { id: 'facebook', label: 'Facebook', color: '#1877F2', bg: 'bg-blue-500/10', text: 'text-blue-500' },
  { id: 'linkedin', label: 'LinkedIn', color: '#0A66C2', bg: 'bg-indigo-500/10', text: 'text-indigo-500' },
  { id: 'tiktok', label: 'TikTok', color: '#000000', bg: 'bg-gray-500/10', text: 'text-gray-400' },
];

const CONTENT_TYPES = [
  { id: 'post', label: 'Post' },
  { id: 'story', label: 'Story' },
  { id: 'reel', label: 'Reel' },
  { id: 'carousel', label: 'Carousel' },
];

const STATUS_CONFIG = {
  pending: { bg: 'bg-yellow-500/10', text: 'text-yellow-500', label: 'Čeka odobrenje', icon: Clock },
  approved: { bg: 'bg-green-500/10', text: 'text-green-500', label: 'Odobreno', icon: CheckCircle2 },
  revision_requested: { bg: 'bg-red-500/10', text: 'text-red-500', label: 'Treba izmjene', icon: AlertCircle },
  published: { bg: 'bg-indigo-500/10', text: 'text-indigo-500', label: 'Objavljeno', icon: CheckCircle2 },
};

// Helper to parse and transform media URLs
const parseMediaUrl = (url) => {
  if (!url) return null;

  // Google Drive file link
  const driveFileMatch = url.match(/drive\.google\.com\/file\/d\/([a-zA-Z0-9_-]+)/);
  if (driveFileMatch) {
    return {
      type: 'drive',
      id: driveFileMatch[1],
      imageUrl: `https://drive.google.com/uc?export=view&id=${driveFileMatch[1]}`,
      embedUrl: `https://drive.google.com/file/d/${driveFileMatch[1]}/preview`,
    };
  }

  // Google Drive open link
  const driveOpenMatch = url.match(/drive\.google\.com\/open\?id=([a-zA-Z0-9_-]+)/);
  if (driveOpenMatch) {
    return {
      type: 'drive',
      id: driveOpenMatch[1],
      imageUrl: `https://drive.google.com/uc?export=view&id=${driveOpenMatch[1]}`,
      embedUrl: `https://drive.google.com/file/d/${driveOpenMatch[1]}/preview`,
    };
  }

  // YouTube
  const youtubeMatch = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([a-zA-Z0-9_-]+)/);
  if (youtubeMatch) {
    return {
      type: 'youtube',
      id: youtubeMatch[1],
      embedUrl: `https://www.youtube.com/embed/${youtubeMatch[1]}`,
      thumbnailUrl: `https://img.youtube.com/vi/${youtubeMatch[1]}/mqdefault.jpg`,
    };
  }

  // Vimeo
  const vimeoMatch = url.match(/vimeo\.com\/(\d+)/);
  if (vimeoMatch) {
    return {
      type: 'vimeo',
      id: vimeoMatch[1],
      embedUrl: `https://player.vimeo.com/video/${vimeoMatch[1]}`,
    };
  }

  // Direct URL
  return {
    type: 'direct',
    imageUrl: url,
  };
};

export default function ContentDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [content, setContent] = useState(null);
  const [client, setClient] = useState(null);
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({});
  const [newHashtag, setNewHashtag] = useState('');
  const [newMediaUrl, setNewMediaUrl] = useState('');

  useEffect(() => {
    loadContentData();
  }, [params.id]);

  const loadContentData = async () => {
    try {
      // Load content with client info
      const { data: contentData, error: contentError } = await supabase
        .from('content_items')
        .select(`
          *,
          client:clients(id, name, company)
        `)
        .eq('id', params.id)
        .single();

      if (contentError) throw contentError;
      setContent(contentData);
      setClient(contentData.client);
      // Support both platforms array and legacy platform field
      const platforms = contentData.platforms?.length > 0
        ? contentData.platforms
        : (contentData.platform ? [contentData.platform] : ['instagram']);
      setFormData({
        ...contentData,
        platforms,
        hashtags: contentData.hashtags || [],
        media_urls: contentData.media_urls || [],
      });

      // Load all clients for edit dropdown
      const { data: clientsData } = await supabase
        .from('clients')
        .select('id, name, company')
        .eq('status', 'active')
        .order('name');
      setClients(clientsData || []);

    } catch (error) {
      console.error('Error loading content:', error);
    } finally {
      setLoading(false);
    }
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

  const handleUpdate = async (e) => {
    e.preventDefault();
    setSaving(true);

    try {
      if (formData.platforms.length === 0) {
        alert('Molimo odaberite barem jednu platformu');
        setSaving(false);
        return;
      }

      const { error } = await supabase
        .from('content_items')
        .update({
          client_id: formData.client_id,
          platforms: formData.platforms,
          platform: formData.platforms[0], // Keep for backwards compatibility
          content_type: formData.content_type,
          scheduled_date: formData.scheduled_date,
          scheduled_time: formData.scheduled_time || null,
          caption: formData.caption || null,
          hashtags: formData.hashtags,
          media_urls: formData.media_urls,
          status: formData.status,
        })
        .eq('id', params.id);

      if (error) throw error;

      // Reload to get updated client info
      await loadContentData();
      setEditing(false);
    } catch (error) {
      console.error('Error updating content:', error);
      alert('Greška pri spremanju. Pokušajte ponovo.');
    } finally {
      setSaving(false);
    }
  };

  const handleStatusChange = async (newStatus) => {
    const { error } = await supabase
      .from('content_items')
      .update({ status: newStatus })
      .eq('id', params.id);

    if (error) {
      console.error('Error updating status:', error);
    } else {
      setContent({ ...content, status: newStatus });
      setFormData({ ...formData, status: newStatus });
    }
  };

  const handleDelete = async () => {
    if (!confirm('Jeste li sigurni da želite obrisati ovaj sadržaj?')) return;

    try {
      const { error } = await supabase
        .from('content_items')
        .delete()
        .eq('id', params.id);

      if (error) throw error;
      router.push('/crm/content');
    } catch (error) {
      console.error('Error deleting content:', error);
      alert('Greška pri brisanju.');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-2xl text-[#00FF94]">Učitavanje...</div>
      </div>
    );
  }

  if (!content) {
    return (
      <div className="text-center py-20">
        <h2 className="text-2xl font-bold mb-4">Sadržaj nije pronađen</h2>
        <Link href="/crm/content" className="text-[#00FF94] hover:underline">
          ← Natrag na sadržaj
        </Link>
      </div>
    );
  }

  // Support both platforms array and legacy platform field
  const contentPlatforms = content.platforms?.length > 0
    ? content.platforms
    : (content.platform ? [content.platform] : ['instagram']);
  const status = STATUS_CONFIG[content.status] || STATUS_CONFIG.pending;
  const StatusIcon = status.icon;

  return (
    <div className="max-w-5xl animate-fadeIn">
      {/* Breadcrumb */}
      <Link
        href="/crm/content"
        className="inline-flex items-center gap-2 text-gray-400 hover:text-[#00FF94] mb-6 transition-colors"
      >
        <ArrowLeft size={16} />
        Natrag na sadržaj
      </Link>

      {/* Header */}
      <div className="flex flex-col lg:flex-row justify-between items-start gap-6 mb-8">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-3 flex-wrap">
            {contentPlatforms.map((p) => {
              const pConfig = PLATFORMS.find((pl) => pl.id === p) || PLATFORMS[0];
              return (
                <span key={p} className={`px-3 py-1.5 rounded-lg text-sm font-bold ${pConfig.bg} ${pConfig.text}`}>
                  {pConfig.label}
                </span>
              );
            })}
            <span className="text-gray-400 capitalize">{content.content_type}</span>
          </div>
          <h1 className="text-3xl font-black text-white mb-2">
            {content.caption?.slice(0, 50) || 'Sadržaj bez opisa'}
            {content.caption?.length > 50 && '...'}
          </h1>
          {client && (
            <Link
              href={`/crm/clients/${client.id}`}
              className="text-[#00FF94] hover:underline font-semibold"
            >
              {client.company || client.name}
            </Link>
          )}
        </div>

        <div className={`flex items-center gap-2 px-4 py-2 rounded-xl font-bold ${status.bg} ${status.text}`}>
          <StatusIcon size={18} />
          {status.label}
        </div>
      </div>

      {/* Actions */}
      <div className="flex flex-wrap gap-3 mb-8">
        {!editing && (
          <>
            <button
              onClick={() => setEditing(true)}
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#00FF94] text-black rounded-xl font-bold hover:shadow-lg hover:shadow-[#00FF94]/30 transition-all"
            >
              <Edit size={18} />
              Uredi
            </button>
            <select
              value={content.status}
              onChange={(e) => handleStatusChange(e.target.value)}
              className="px-4 py-2.5 bg-[#2A2A2A] text-white rounded-xl font-bold cursor-pointer border border-[#3A3A3A] hover:border-[#00FF94] transition-colors"
            >
              <option value="pending">Čeka odobrenje</option>
              <option value="approved">Odobreno</option>
              <option value="revision_requested">Treba izmjene</option>
              <option value="published">Objavljeno</option>
            </select>
            <button
              onClick={handleDelete}
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-red-500 text-white rounded-xl font-bold hover:bg-red-600 transition-all"
            >
              <Trash2 size={18} />
              Obriši
            </button>
          </>
        )}
      </div>

      {editing ? (
        /* Edit Form */
        <form onSubmit={handleUpdate}>
          <div className="bg-[#1a1a1a] border border-[#2A2A2A] rounded-2xl p-8">
            <h3 className="text-2xl font-bold mb-6 pb-4 border-b border-[#2A2A2A]">
              Uredi sadržaj
            </h3>

            {/* Client Selection */}
            <div className="mb-6">
              <label className="block text-sm font-semibold text-gray-400 mb-2">Klijent *</label>
              <select
                value={formData.client_id}
                onChange={(e) => setFormData({ ...formData, client_id: e.target.value })}
                required
                className="w-full px-4 py-3 bg-[#0a0a0a] border border-[#2A2A2A] rounded-xl text-white focus:border-[#00FF94] focus:outline-none"
              >
                <option value="">Odaberi klijenta...</option>
                {clients.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.company || c.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Platform & Type */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <label className="block text-sm font-semibold text-gray-400 mb-2">
                  Platforme * <span className="text-xs text-gray-500 font-normal">(možeš odabrati više)</span>
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {PLATFORMS.map((p) => {
                    const isSelected = formData.platforms?.includes(p.id);
                    return (
                      <button
                        key={p.id}
                        type="button"
                        onClick={() => {
                          const currentPlatforms = formData.platforms || [];
                          const newPlatforms = isSelected
                            ? currentPlatforms.filter((pl) => pl !== p.id)
                            : [...currentPlatforms, p.id];
                          setFormData({ ...formData, platforms: newPlatforms });
                        }}
                        className={`px-4 py-3 rounded-xl text-sm font-semibold transition-all ${
                          isSelected
                            ? 'bg-[#00FF94] text-black'
                            : 'bg-[#0a0a0a] border border-[#2A2A2A] text-gray-400 hover:border-[#00FF94]'
                        }`}
                      >
                        {p.label}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-400 mb-2">Tip sadržaja *</label>
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
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
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
                  value={formData.scheduled_time || ''}
                  onChange={(e) => setFormData({ ...formData, scheduled_time: e.target.value })}
                  className="w-full px-4 py-3 bg-[#0a0a0a] border border-[#2A2A2A] rounded-xl text-white focus:border-[#00FF94] focus:outline-none"
                />
              </div>
            </div>

            {/* Caption */}
            <div className="mb-6">
              <label className="block text-sm font-semibold text-gray-400 mb-2">Tekst objave</label>
              <textarea
                value={formData.caption || ''}
                onChange={(e) => setFormData({ ...formData, caption: e.target.value })}
                rows={5}
                placeholder="Napišite tekst koji će pratiti objavu..."
                className="w-full px-4 py-3 bg-[#0a0a0a] border border-[#2A2A2A] rounded-xl text-white focus:border-[#00FF94] focus:outline-none resize-none"
              />
            </div>

            {/* Hashtags */}
            <div className="mb-6">
              <label className="block text-sm font-semibold text-gray-400 mb-2">Hashtagovi</label>
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
              {formData.hashtags?.length > 0 && (
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
            <div className="mb-6">
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
                  placeholder="Zalijepi link..."
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
              {formData.media_urls?.length > 0 && (
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {formData.media_urls.map((url, i) => {
                    const media = parseMediaUrl(url);
                    return (
                      <div key={i} className="relative group">
                        <div className="aspect-video bg-[#0a0a0a] rounded-xl overflow-hidden">
                          {media?.type === 'drive' && (
                            <iframe
                              src={media.embedUrl}
                              className="w-full h-full"
                              allow="autoplay"
                              frameBorder="0"
                            />
                          )}
                          {media?.type === 'youtube' && (
                            <img
                              src={media.thumbnailUrl}
                              alt=""
                              className="w-full h-full object-cover"
                            />
                          )}
                          {media?.type === 'vimeo' && (
                            <iframe
                              src={media.embedUrl}
                              className="w-full h-full"
                              frameBorder="0"
                            />
                          )}
                          {media?.type === 'direct' && (
                            <img
                              src={media.imageUrl}
                              alt=""
                              className="w-full h-full object-cover"
                              onError={(e) => (e.target.src = 'https://via.placeholder.com/300x200?text=Error')}
                            />
                          )}
                        </div>
                        <button
                          type="button"
                          onClick={() => handleRemoveMedia(url)}
                          className="absolute top-2 right-2 p-1.5 bg-red-500 text-white rounded-lg opacity-0 group-hover:opacity-100 transition-opacity"
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
                className="inline-flex items-center gap-2 px-6 py-3 bg-[#00FF94] text-black rounded-xl font-bold hover:shadow-lg hover:shadow-[#00FF94]/30 transition-all disabled:opacity-50"
              >
                {saving ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}
                {saving ? 'Spremanje...' : 'Spremi promjene'}
              </button>
              <button
                type="button"
                onClick={() => {
                  setEditing(false);
                  const platforms = content.platforms?.length > 0
                    ? content.platforms
                    : (content.platform ? [content.platform] : ['instagram']);
                  setFormData({
                    ...content,
                    platforms,
                    hashtags: content.hashtags || [],
                    media_urls: content.media_urls || [],
                  });
                }}
                className="inline-flex items-center gap-2 px-6 py-3 bg-[#2A2A2A] text-white rounded-xl font-bold hover:bg-[#3A3A3A] transition-all"
              >
                <X size={18} />
                Odustani
              </button>
            </div>
          </div>
        </form>
      ) : (
        /* View Mode */
        <div className="space-y-6">
          {/* Schedule Info */}
          <div className="bg-[#1a1a1a] border border-[#2A2A2A] rounded-2xl p-8">
            <h3 className="text-2xl font-bold mb-6 pb-4 border-b border-[#2A2A2A]">Detalji objave</h3>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">
              <div className="bg-[#0a0a0a] rounded-xl p-5">
                <div className="text-xs text-gray-500 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                  <Calendar size={12} />
                  Datum
                </div>
                <div className="text-sm font-bold text-[#00FF94]">
                  {new Date(content.scheduled_date).toLocaleDateString('hr-HR', {
                    weekday: 'short',
                    day: 'numeric',
                    month: 'short',
                    year: 'numeric',
                  })}
                </div>
              </div>
              {content.scheduled_time && (
                <div className="bg-[#0a0a0a] rounded-xl p-5">
                  <div className="text-xs text-gray-500 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                    <Clock size={12} />
                    Vrijeme
                  </div>
                  <div className="text-sm font-bold text-[#00FF94]">
                    {content.scheduled_time.slice(0, 5)}
                  </div>
                </div>
              )}
              <div className="bg-[#0a0a0a] rounded-xl p-5">
                <div className="text-xs text-gray-500 uppercase tracking-wider mb-2">
                  {contentPlatforms.length > 1 ? 'Platforme' : 'Platforma'}
                </div>
                <div className="flex flex-wrap gap-1">
                  {contentPlatforms.map((p) => {
                    const pConfig = PLATFORMS.find((pl) => pl.id === p) || PLATFORMS[0];
                    return (
                      <span key={p} className={`text-sm font-bold ${pConfig.text}`}>
                        {pConfig.label}{contentPlatforms.indexOf(p) < contentPlatforms.length - 1 ? ',' : ''}
                      </span>
                    );
                  })}
                </div>
              </div>
              <div className="bg-[#0a0a0a] rounded-xl p-5">
                <div className="text-xs text-gray-500 uppercase tracking-wider mb-2">Tip</div>
                <div className="text-sm font-bold text-white capitalize">{content.content_type}</div>
              </div>
            </div>
          </div>

          {/* Caption */}
          {content.caption && (
            <div className="bg-[#1a1a1a] border border-[#2A2A2A] rounded-2xl p-8">
              <h3 className="text-2xl font-bold mb-6 pb-4 border-b border-[#2A2A2A]">Tekst objave</h3>
              <p className="text-gray-300 leading-relaxed whitespace-pre-wrap">{content.caption}</p>
              {content.hashtags?.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-4 pt-4 border-t border-[#2A2A2A]">
                  {content.hashtags.map((tag, i) => (
                    <span
                      key={i}
                      className="px-3 py-1.5 bg-[#00FF94]/10 text-[#00FF94] rounded-lg text-sm font-semibold"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Media */}
          {content.media_urls?.length > 0 && (
            <div className="bg-[#1a1a1a] border border-[#2A2A2A] rounded-2xl p-8">
              <h3 className="text-2xl font-bold mb-6 pb-4 border-b border-[#2A2A2A]">
                Mediji ({content.media_urls.length})
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {content.media_urls.map((url, i) => {
                  const media = parseMediaUrl(url);
                  return (
                    <div key={i} className="relative aspect-video bg-[#0a0a0a] rounded-xl overflow-hidden">
                      {media?.type === 'drive' && (
                        <iframe
                          src={media.embedUrl}
                          className="w-full h-full"
                          allow="autoplay"
                          frameBorder="0"
                        />
                      )}
                      {media?.type === 'youtube' && (
                        <iframe
                          src={media.embedUrl}
                          className="w-full h-full"
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                          allowFullScreen
                        />
                      )}
                      {media?.type === 'vimeo' && (
                        <iframe
                          src={media.embedUrl}
                          className="w-full h-full"
                          allow="autoplay; fullscreen"
                          allowFullScreen
                        />
                      )}
                      {media?.type === 'direct' && (
                        <img
                          src={media.imageUrl}
                          alt=""
                          className="w-full h-full object-cover"
                        />
                      )}
                      <a
                        href={url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="absolute bottom-2 right-2 px-3 py-1.5 bg-black/70 text-white text-xs rounded-lg flex items-center gap-1 hover:bg-black transition-colors"
                      >
                        Otvori <ExternalLink size={12} />
                      </a>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Client Feedback */}
          {content.client_feedback && (
            <div className={`rounded-2xl p-8 ${
              content.status === 'revision_requested'
                ? 'bg-red-500/5 border border-red-500/20'
                : 'bg-green-500/5 border border-green-500/20'
            }`}>
              <h3 className="text-2xl font-bold mb-4 flex items-center gap-3">
                <MessageSquare size={24} className={content.status === 'revision_requested' ? 'text-red-500' : 'text-green-500'} />
                Feedback od klijenta
              </h3>
              <p className="text-gray-300 leading-relaxed">{content.client_feedback}</p>
            </div>
          )}

          {/* Approval Info */}
          {content.status === 'approved' && content.approved_at && (
            <div className="bg-green-500/5 border border-green-500/20 rounded-2xl p-6 text-center">
              <CheckCircle2 size={32} className="mx-auto text-green-500 mb-2" />
              <div className="text-green-500 font-bold">
                Odobreno {new Date(content.approved_at).toLocaleDateString('hr-HR')}
              </div>
            </div>
          )}
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
