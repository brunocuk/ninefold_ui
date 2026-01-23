// app/(crm-admin)/crm/settings/page.jsx
// CRM Settings Page

'use client';

import { useEffect, useState, useRef } from 'react';
import { getUser } from '@/lib/auth';
import { supabase, getAuthenticatedClient } from '@/lib/supabase';
import {
  User,
  Building2,
  Bell,
  Shield,
  Palette,
  Save,
  Check,
  AlertCircle,
  Mail,
  Phone,
  MapPin,
  Globe,
  CreditCard,
  Upload,
  Camera,
  X
} from 'lucide-react';

// 5 fun avatar presets using Robohash (robots, monsters, heads)
const PRESET_AVATARS = [
  { id: 'robot', type: 'url', url: 'https://robohash.org/ninefold?set=set1&size=200x200&bgset=bg2' },
  { id: 'monster', type: 'url', url: 'https://robohash.org/coder?set=set2&size=200x200&bgset=bg2' },
  { id: 'head', type: 'url', url: 'https://robohash.org/hacker?set=set3&size=200x200&bgset=bg2' },
  { id: 'kitten', type: 'url', url: 'https://robohash.org/dev?set=set4&size=200x200&bgset=bg2' },
  { id: 'alien', type: 'url', url: 'https://robohash.org/ninja?set=set1&size=200x200&bgset=bg1' },
];

export default function SettingsPage() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [activeTab, setActiveTab] = useState('profile');
  const fileInputRef = useRef(null);

  const [avatar, setAvatar] = useState({
    type: 'preset', // 'preset' or 'custom'
    presetId: 'robot',
    customUrl: null,
    storagePath: null // Supabase storage path
  });
  const [uploading, setUploading] = useState(false);

  const [profile, setProfile] = useState({
    name: '',
    email: '',
    phone: ''
  });

  const [company, setCompany] = useState({
    name: 'PROGMATIQ, VL. BRUNO ČUKIĆ',
    address: 'Glavna 12, 10360 Sesvete, Croatia',
    email: 'hello@ninefold.eu',
    phone: '+385913333447',
    website: 'www.ninefold.eu',
    oib: '50299147291'
  });

  const [notifications, setNotifications] = useState({
    emailNewLead: true,
    emailQuoteViewed: true,
    emailPaymentReceived: true,
    emailWeeklyReport: false
  });

  useEffect(() => {
    loadUser();
  }, []);

  const loadUser = async () => {
    const currentUser = await getUser();
    if (currentUser) {
      setUser(currentUser);

      // Load settings via API route (bypasses RLS issues)
      try {
        const tokenData = localStorage.getItem('supabase.auth.token');
        const parsed = tokenData ? JSON.parse(tokenData) : null;
        const accessToken = parsed?.access_token;

        if (accessToken) {
          const response = await fetch('/api/settings', {
            headers: {
              'Authorization': `Bearer ${accessToken}`
            }
          });

          if (response.ok) {
            const { data: settings } = await response.json();
            if (settings) {
              if (settings.profile) setProfile(settings.profile);
              if (settings.company) setCompany(settings.company);
              if (settings.notifications) setNotifications(settings.notifications);
              if (settings.avatar) setAvatar(settings.avatar);
            } else {
              // Set defaults from user metadata
              setProfile({
                name: currentUser.user_metadata?.name || 'Admin',
                email: currentUser.email || '',
                phone: currentUser.user_metadata?.phone || ''
              });
            }
          }
        }
      } catch (error) {
        console.error('Error loading settings:', error);
        // Set defaults from user metadata on error
        setProfile({
          name: currentUser.user_metadata?.name || 'Admin',
          email: currentUser.email || '',
          phone: currentUser.user_metadata?.phone || ''
        });
      }
    }

    setLoading(false);
  };

  const handleAvatarUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      alert('Please select an image file');
      return;
    }

    // Validate file size (max 2MB)
    if (file.size > 2 * 1024 * 1024) {
      alert('Image must be less than 2MB');
      return;
    }

    setUploading(true);

    try {
      const authClient = getAuthenticatedClient();
      const userId = user?.id || 'default';
      const fileExt = file.name.split('.').pop();
      const fileName = `${userId}-${Date.now()}.${fileExt}`;
      const filePath = `avatars/${fileName}`;

      // Delete old avatar if exists
      if (avatar.storagePath) {
        await authClient.storage.from('avatars').remove([avatar.storagePath]);
      }

      // Upload new avatar
      const { data, error } = await authClient.storage
        .from('avatars')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: true
        });

      if (error) {
        console.error('Upload error:', error);
        alert('Failed to upload avatar. Make sure the "avatars" bucket exists in Supabase and has proper permissions.');
        setUploading(false);
        return;
      }

      // Get public URL
      const { data: urlData } = authClient.storage
        .from('avatars')
        .getPublicUrl(filePath);

      const newAvatar = {
        type: 'custom',
        presetId: null,
        customUrl: urlData.publicUrl,
        storagePath: filePath
      };

      setAvatar(newAvatar);
      // Dispatch for immediate visual update in layout
      window.dispatchEvent(new CustomEvent('avatar-changed', { detail: newAvatar }));

    } catch (error) {
      console.error('Error uploading avatar:', error);
      alert('Failed to upload avatar');
    } finally {
      setUploading(false);
    }
  };

  const selectPresetAvatar = async (presetId) => {
    // Delete custom avatar from storage if switching to preset
    if (avatar.storagePath) {
      try {
        const authClient = getAuthenticatedClient();
        await authClient.storage.from('avatars').remove([avatar.storagePath]);
      } catch (error) {
        console.error('Error deleting avatar from storage:', error);
      }
    }

    const newAvatar = {
      type: 'preset',
      presetId,
      customUrl: null,
      storagePath: null
    };
    setAvatar(newAvatar);
    // Dispatch for immediate visual update in layout
    window.dispatchEvent(new CustomEvent('avatar-changed', { detail: newAvatar }));
  };

  const removeCustomAvatar = async () => {
    // Delete from Supabase storage if exists
    if (avatar.storagePath) {
      try {
        const authClient = getAuthenticatedClient();
        await authClient.storage.from('avatars').remove([avatar.storagePath]);
      } catch (error) {
        console.error('Error deleting avatar from storage:', error);
      }
    }

    const newAvatar = {
      type: 'preset',
      presetId: 'robot',
      customUrl: null,
      storagePath: null
    };
    setAvatar(newAvatar);
    // Dispatch for immediate visual update in layout
    window.dispatchEvent(new CustomEvent('avatar-changed', { detail: newAvatar }));
  };

  const getAvatarStyle = (avatarData = avatar) => {
    if (avatarData.type === 'custom' && avatarData.customUrl) {
      return {
        backgroundImage: `url(${avatarData.customUrl})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center'
      };
    }

    const preset = PRESET_AVATARS.find(p => p.id === avatarData.presetId) || PRESET_AVATARS[0];
    return {
      backgroundImage: `url(${preset.url})`,
      backgroundSize: 'cover',
      backgroundPosition: 'center'
    };
  };


  const handleSave = async () => {
    if (!user) {
      alert('No user logged in');
      return;
    }

    setSaving(true);

    try {
      const tokenData = localStorage.getItem('supabase.auth.token');
      const parsed = tokenData ? JSON.parse(tokenData) : null;
      const accessToken = parsed?.access_token;

      if (!accessToken) {
        throw new Error('No access token found. Please log in again.');
      }

      const response = await fetch('/api/settings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}`
        },
        body: JSON.stringify({
          profile,
          company,
          notifications,
          avatar
        })
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Failed to save settings');
      }

      console.log('Settings saved successfully:', result.data);

      // Dispatch event so other components can react to changes
      window.dispatchEvent(new CustomEvent('settings-changed', {
        detail: { profile, avatar }
      }));

      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (error) {
      console.error('Error saving settings:', error);
      alert(`Failed to save: ${error.message || 'Unknown error'}`);
    } finally {
      setSaving(false);
    }
  };

  const tabs = [
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'company', label: 'Company', icon: Building2 },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'security', label: 'Security', icon: Shield }
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-xl text-[#00FF94]">Loading settings...</div>
      </div>
    );
  }

  return (
    <div className="animate-fadeIn">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Settings</h1>
        <p className="text-gray-400">Manage your account and preferences</p>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-8 border-b border-[#1a1a1a] pb-4 overflow-x-auto">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-lg font-medium text-sm transition-all whitespace-nowrap ${
                activeTab === tab.id
                  ? 'bg-[#00FF94] text-black'
                  : 'bg-[#1a1a1a] text-gray-400 hover:bg-[#252525] hover:text-white'
              }`}
            >
              <Icon size={18} />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Content */}
      <div className="max-w-2xl">
        {/* Profile Tab */}
        {activeTab === 'profile' && (
          <div className="space-y-6">
            {/* Avatar Section */}
            <div className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl p-6">
              <h2 className="text-lg font-semibold mb-6 flex items-center gap-2">
                <Camera size={20} className="text-[#00FF94]" />
                Profile Picture
              </h2>

              <div className="flex flex-col sm:flex-row items-start gap-6">
                {/* Current Avatar */}
                <div className="relative">
                  <div
                    className="w-24 h-24 rounded-2xl shadow-lg overflow-hidden"
                    style={getAvatarStyle()}
                  />
                  {avatar.type === 'custom' && (
                    <button
                      onClick={removeCustomAvatar}
                      className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 rounded-full flex items-center justify-center text-white hover:bg-red-600 transition-colors"
                      title="Remove custom avatar"
                    >
                      <X size={14} />
                    </button>
                  )}
                </div>

                <div className="flex-1">
                  {/* Avatar Presets */}
                  <label className="block text-sm font-medium text-gray-400 mb-3">
                    Choose an avatar
                  </label>
                  <div className="flex flex-wrap gap-3 mb-5">
                    {PRESET_AVATARS.map((preset) => (
                      <button
                        key={preset.id}
                        onClick={() => selectPresetAvatar(preset.id)}
                        className={`w-14 h-14 rounded-xl overflow-hidden transition-all hover:scale-110 ${
                          avatar.type === 'preset' && avatar.presetId === preset.id
                            ? 'ring-2 ring-[#00FF94] ring-offset-2 ring-offset-[#1a1a1a]'
                            : 'ring-1 ring-[#2a2a2a]'
                        }`}
                        title={preset.id}
                      >
                        <img
                          src={preset.url}
                          alt={preset.id}
                          className="w-full h-full object-cover"
                        />
                      </button>
                    ))}
                  </div>

                  {/* Upload Button */}
                  <label className="block text-sm font-medium text-gray-400 mb-3">
                    Or upload your own
                  </label>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleAvatarUpload}
                    className="hidden"
                  />
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    disabled={uploading}
                    className="flex items-center gap-2 px-4 py-2.5 bg-[#0a0a0a] border border-[#2a2a2a] rounded-lg text-gray-300 hover:border-[#00FF94] hover:text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {uploading ? (
                      <>
                        <div className="w-4 h-4 border-2 border-gray-500 border-t-[#00FF94] rounded-full animate-spin" />
                        Uploading...
                      </>
                    ) : (
                      <>
                        <Upload size={18} />
                        Upload Image
                      </>
                    )}
                  </button>
                  <p className="text-xs text-gray-500 mt-2">
                    JPG, PNG or GIF. Max 2MB. Stored in Supabase.
                  </p>
                </div>
              </div>
            </div>

            {/* Profile Information */}
            <div className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl p-6">
              <h2 className="text-lg font-semibold mb-6 flex items-center gap-2">
                <User size={20} className="text-[#00FF94]" />
                Profile Information
              </h2>

              <div className="space-y-5">
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">
                    Full Name
                  </label>
                  <input
                    type="text"
                    value={profile.name}
                    onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                    className="w-full px-4 py-3 bg-[#0a0a0a] border border-[#2a2a2a] rounded-lg text-white focus:border-[#00FF94] focus:outline-none transition-colors"
                    placeholder="Your name"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">
                    Email Address
                  </label>
                  <input
                    type="email"
                    value={profile.email}
                    onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                    className="w-full px-4 py-3 bg-[#0a0a0a] border border-[#2a2a2a] rounded-lg text-white focus:border-[#00FF94] focus:outline-none transition-colors"
                    placeholder="your@email.com"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    value={profile.phone}
                    onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                    className="w-full px-4 py-3 bg-[#0a0a0a] border border-[#2a2a2a] rounded-lg text-white focus:border-[#00FF94] focus:outline-none transition-colors"
                    placeholder="+385 91 123 4567"
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Company Tab */}
        {activeTab === 'company' && (
          <div className="space-y-6">
            <div className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl p-6">
              <h2 className="text-lg font-semibold mb-6 flex items-center gap-2">
                <Building2 size={20} className="text-[#00FF94]" />
                Company Information
              </h2>
              <p className="text-gray-400 text-sm mb-6">
                This information appears on your quotes and invoices.
              </p>

              <div className="space-y-5">
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">
                    <Building2 size={14} className="inline mr-2" />
                    Company Name
                  </label>
                  <input
                    type="text"
                    value={company.name}
                    onChange={(e) => setCompany({ ...company, name: e.target.value })}
                    className="w-full px-4 py-3 bg-[#0a0a0a] border border-[#2a2a2a] rounded-lg text-white focus:border-[#00FF94] focus:outline-none transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">
                    <MapPin size={14} className="inline mr-2" />
                    Address
                  </label>
                  <input
                    type="text"
                    value={company.address}
                    onChange={(e) => setCompany({ ...company, address: e.target.value })}
                    className="w-full px-4 py-3 bg-[#0a0a0a] border border-[#2a2a2a] rounded-lg text-white focus:border-[#00FF94] focus:outline-none transition-colors"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2">
                      <Mail size={14} className="inline mr-2" />
                      Email
                    </label>
                    <input
                      type="email"
                      value={company.email}
                      onChange={(e) => setCompany({ ...company, email: e.target.value })}
                      className="w-full px-4 py-3 bg-[#0a0a0a] border border-[#2a2a2a] rounded-lg text-white focus:border-[#00FF94] focus:outline-none transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2">
                      <Phone size={14} className="inline mr-2" />
                      Phone
                    </label>
                    <input
                      type="tel"
                      value={company.phone}
                      onChange={(e) => setCompany({ ...company, phone: e.target.value })}
                      className="w-full px-4 py-3 bg-[#0a0a0a] border border-[#2a2a2a] rounded-lg text-white focus:border-[#00FF94] focus:outline-none transition-colors"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2">
                      <Globe size={14} className="inline mr-2" />
                      Website
                    </label>
                    <input
                      type="text"
                      value={company.website}
                      onChange={(e) => setCompany({ ...company, website: e.target.value })}
                      className="w-full px-4 py-3 bg-[#0a0a0a] border border-[#2a2a2a] rounded-lg text-white focus:border-[#00FF94] focus:outline-none transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2">
                      <CreditCard size={14} className="inline mr-2" />
                      OIB (Tax ID)
                    </label>
                    <input
                      type="text"
                      value={company.oib}
                      onChange={(e) => setCompany({ ...company, oib: e.target.value })}
                      className="w-full px-4 py-3 bg-[#0a0a0a] border border-[#2a2a2a] rounded-lg text-white focus:border-[#00FF94] focus:outline-none transition-colors"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Notifications Tab */}
        {activeTab === 'notifications' && (
          <div className="space-y-6">
            <div className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl p-6">
              <h2 className="text-lg font-semibold mb-6 flex items-center gap-2">
                <Bell size={20} className="text-[#00FF94]" />
                Email Notifications
              </h2>

              <div className="space-y-4">
                {[
                  { key: 'emailNewLead', label: 'New lead received', desc: 'Get notified when a new lead comes in' },
                  { key: 'emailQuoteViewed', label: 'Quote viewed', desc: 'Get notified when a client views your quote' },
                  { key: 'emailPaymentReceived', label: 'Payment received', desc: 'Get notified when a payment is completed' },
                  { key: 'emailWeeklyReport', label: 'Weekly report', desc: 'Receive a weekly summary of your CRM activity' }
                ].map((item) => (
                  <div
                    key={item.key}
                    className="flex items-center justify-between p-4 bg-[#0a0a0a] border border-[#2a2a2a] rounded-lg"
                  >
                    <div>
                      <div className="font-medium text-white">{item.label}</div>
                      <div className="text-sm text-gray-500">{item.desc}</div>
                    </div>
                    <button
                      onClick={() => setNotifications({ ...notifications, [item.key]: !notifications[item.key] })}
                      className={`relative w-12 h-7 rounded-full transition-colors ${
                        notifications[item.key] ? 'bg-[#00FF94]' : 'bg-[#2a2a2a]'
                      }`}
                    >
                      <span
                        className={`absolute top-1 w-5 h-5 bg-white rounded-full transition-transform ${
                          notifications[item.key] ? 'left-6' : 'left-1'
                        }`}
                      />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Security Tab */}
        {activeTab === 'security' && (
          <div className="space-y-6">
            <div className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl p-6">
              <h2 className="text-lg font-semibold mb-6 flex items-center gap-2">
                <Shield size={20} className="text-[#00FF94]" />
                Change Password
              </h2>

              <div className="space-y-5">
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">
                    Current Password
                  </label>
                  <input
                    type="password"
                    className="w-full px-4 py-3 bg-[#0a0a0a] border border-[#2a2a2a] rounded-lg text-white focus:border-[#00FF94] focus:outline-none transition-colors"
                    placeholder="Enter current password"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">
                    New Password
                  </label>
                  <input
                    type="password"
                    className="w-full px-4 py-3 bg-[#0a0a0a] border border-[#2a2a2a] rounded-lg text-white focus:border-[#00FF94] focus:outline-none transition-colors"
                    placeholder="Enter new password"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">
                    Confirm New Password
                  </label>
                  <input
                    type="password"
                    className="w-full px-4 py-3 bg-[#0a0a0a] border border-[#2a2a2a] rounded-lg text-white focus:border-[#00FF94] focus:outline-none transition-colors"
                    placeholder="Confirm new password"
                  />
                </div>
              </div>
            </div>

            <div className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl p-6">
              <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <AlertCircle size={20} className="text-red-500" />
                Danger Zone
              </h2>
              <p className="text-gray-400 text-sm mb-4">
                Once you delete your account, there is no going back. Please be certain.
              </p>
              <button className="px-4 py-2.5 bg-red-500/10 border border-red-500/20 text-red-500 rounded-lg font-medium hover:bg-red-500/20 transition-colors">
                Delete Account
              </button>
            </div>
          </div>
        )}

        {/* Save Button */}
        <div className="mt-8 flex items-center gap-4">
          <button
            onClick={handleSave}
            disabled={saving}
            className="flex items-center gap-2 px-6 py-3 bg-[#00FF94] text-black rounded-lg font-semibold hover:bg-[#00dd82] transition-colors disabled:opacity-50"
          >
            {saving ? (
              <>
                <div className="w-5 h-5 border-2 border-black/30 border-t-black rounded-full animate-spin" />
                Saving...
              </>
            ) : saved ? (
              <>
                <Check size={20} />
                Saved!
              </>
            ) : (
              <>
                <Save size={20} />
                Save Changes
              </>
            )}
          </button>

          {saved && (
            <span className="text-[#00FF94] text-sm animate-fadeIn">
              Your changes have been saved successfully.
            </span>
          )}
        </div>
      </div>

      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out;
        }
      `}</style>
    </div>
  );
}
