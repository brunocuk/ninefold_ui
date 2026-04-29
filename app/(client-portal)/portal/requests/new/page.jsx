'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { getPortalUser } from '@/lib/portalAuth';
import { supabase } from '@/lib/supabase';
import Link from 'next/link';
import {
  ArrowLeft,
  FileEdit,
  Link as LinkIcon,
  AlertCircle,
  Upload,
  X,
  Loader2,
  CheckCircle2,
} from 'lucide-react';

const PRIORITY_OPTIONS = [
  { value: 'low', label: 'Nisko', description: 'Može čekati, nije hitno' },
  { value: 'normal', label: 'Normalno', description: 'Standardna obrada' },
  { value: 'high', label: 'Visoko', description: 'Poželjno što prije' },
  { value: 'urgent', label: 'Hitno', description: 'Treba odmah' },
];

export default function NewRequestPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    page_url: '',
    priority: 'normal',
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const user = await getPortalUser();
    if (!user?.client_id) {
      setError('Niste prijavljeni. Molimo prijavite se ponovo.');
      setLoading(false);
      return;
    }

    // Validate
    if (!formData.title.trim()) {
      setError('Molimo unesite naslov zahtjeva.');
      setLoading(false);
      return;
    }

    if (!formData.description.trim()) {
      setError('Molimo opišite što treba promijeniti.');
      setLoading(false);
      return;
    }

    const { error: insertError } = await supabase
      .from('website_change_requests')
      .insert({
        client_id: user.client_id,
        submitted_by: user.id,
        title: formData.title.trim(),
        description: formData.description.trim(),
        page_url: formData.page_url.trim() || null,
        priority: formData.priority,
        status: 'submitted',
      });

    if (insertError) {
      console.error('Error submitting request:', insertError);
      setError('Greška pri slanju zahtjeva. Pokušajte ponovo.');
      setLoading(false);
      return;
    }

    setSuccess(true);
    setTimeout(() => {
      router.push('/portal/requests');
    }, 2000);
  };

  if (success) {
    return (
      <div style={{
        maxWidth: '500px',
        margin: '60px auto',
        textAlign: 'center',
      }}>
        <div style={{
          width: '80px',
          height: '80px',
          margin: '0 auto 24px',
          borderRadius: '50%',
          background: '#D1FAE5',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}>
          <CheckCircle2 size={40} style={{ color: '#059669' }} />
        </div>
        <h2 style={{
          fontSize: '1.5rem',
          fontWeight: '700',
          color: '#111827',
          marginBottom: '8px',
        }}>
          Zahtjev poslan!
        </h2>
        <p style={{
          color: '#6B7280',
          fontSize: '0.95rem',
          marginBottom: '24px',
        }}>
          Primili smo vaš zahtjev i javit ćemo vam se čim ga pregledamo.
        </p>
        <Link href="/portal/requests" style={{
          color: '#00cc76',
          fontWeight: '600',
          textDecoration: 'none',
        }}>
          ← Natrag na zahtjeve
        </Link>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: '700px' }}>
      {/* Header */}
      <div style={{ marginBottom: '32px' }}>
        <Link
          href="/portal/requests"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            color: '#6B7280',
            textDecoration: 'none',
            fontSize: '0.9rem',
            fontWeight: '500',
            marginBottom: '16px',
          }}
        >
          <ArrowLeft size={18} />
          Natrag na zahtjeve
        </Link>

        <h1 style={{
          fontSize: '1.75rem',
          fontWeight: '800',
          color: '#111827',
          marginBottom: '8px',
        }}>
          Novi zahtjev za izmjenu
        </h1>
        <p style={{ color: '#6B7280', fontSize: '0.95rem' }}>
          Opišite što trebate promijeniti na vašoj stranici
        </p>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit}>
        <div style={{
          background: '#fff',
          borderRadius: '16px',
          padding: '32px',
          boxShadow: '0 2px 8px rgba(0, 0, 0, 0.04)',
        }}>
          {error && (
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              padding: '14px 16px',
              background: '#FEF2F2',
              border: '1px solid #FECACA',
              borderRadius: '12px',
              marginBottom: '24px',
              color: '#DC2626',
              fontSize: '0.9rem',
            }}>
              <AlertCircle size={18} />
              {error}
            </div>
          )}

          {/* Title */}
          <div style={{ marginBottom: '24px' }}>
            <label style={{
              display: 'block',
              fontSize: '0.9rem',
              fontWeight: '600',
              color: '#374151',
              marginBottom: '8px',
            }}>
              Naslov zahtjeva *
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="Npr. Promijeniti tekst na naslovnici"
              required
              style={{
                width: '100%',
                padding: '14px 16px',
                border: '2px solid #E5E7EB',
                borderRadius: '12px',
                fontSize: '1rem',
                outline: 'none',
                transition: 'border-color 0.2s ease',
              }}
              onFocus={(e) => e.target.style.borderColor = '#00ff94'}
              onBlur={(e) => e.target.style.borderColor = '#E5E7EB'}
            />
          </div>

          {/* Description */}
          <div style={{ marginBottom: '24px' }}>
            <label style={{
              display: 'block',
              fontSize: '0.9rem',
              fontWeight: '600',
              color: '#374151',
              marginBottom: '8px',
            }}>
              Opis izmjene *
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Detaljno opišite što treba promijeniti..."
              required
              rows={6}
              style={{
                width: '100%',
                padding: '14px 16px',
                border: '2px solid #E5E7EB',
                borderRadius: '12px',
                fontSize: '1rem',
                outline: 'none',
                resize: 'vertical',
                lineHeight: '1.5',
                transition: 'border-color 0.2s ease',
              }}
              onFocus={(e) => e.target.style.borderColor = '#00ff94'}
              onBlur={(e) => e.target.style.borderColor = '#E5E7EB'}
            />
            <p style={{
              fontSize: '0.8rem',
              color: '#9CA3AF',
              marginTop: '8px',
            }}>
              Što više detalja date, to ćemo brže obraditi vaš zahtjev
            </p>
          </div>

          {/* Page URL */}
          <div style={{ marginBottom: '24px' }}>
            <label style={{
              display: 'block',
              fontSize: '0.9rem',
              fontWeight: '600',
              color: '#374151',
              marginBottom: '8px',
            }}>
              Link na stranicu (opcionalno)
            </label>
            <div style={{ position: 'relative' }}>
              <LinkIcon size={18} style={{
                position: 'absolute',
                left: '14px',
                top: '50%',
                transform: 'translateY(-50%)',
                color: '#9CA3AF',
              }} />
              <input
                type="url"
                value={formData.page_url}
                onChange={(e) => setFormData({ ...formData, page_url: e.target.value })}
                placeholder="https://vasastranica.hr/o-nama"
                style={{
                  width: '100%',
                  padding: '14px 14px 14px 44px',
                  border: '2px solid #E5E7EB',
                  borderRadius: '12px',
                  fontSize: '1rem',
                  outline: 'none',
                  transition: 'border-color 0.2s ease',
                }}
                onFocus={(e) => e.target.style.borderColor = '#00ff94'}
                onBlur={(e) => e.target.style.borderColor = '#E5E7EB'}
              />
            </div>
          </div>

          {/* Priority */}
          <div style={{ marginBottom: '32px' }}>
            <label style={{
              display: 'block',
              fontSize: '0.9rem',
              fontWeight: '600',
              color: '#374151',
              marginBottom: '12px',
            }}>
              Prioritet
            </label>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
              gap: '10px',
            }}>
              {PRIORITY_OPTIONS.map((option) => (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => setFormData({ ...formData, priority: option.value })}
                  style={{
                    padding: '14px',
                    background: formData.priority === option.value ? '#F0FDF4' : '#F9FAFB',
                    border: `2px solid ${formData.priority === option.value ? '#00ff94' : '#E5E7EB'}`,
                    borderRadius: '12px',
                    cursor: 'pointer',
                    textAlign: 'left',
                    transition: 'all 0.2s ease',
                  }}
                >
                  <div style={{
                    fontSize: '0.9rem',
                    fontWeight: '600',
                    color: formData.priority === option.value ? '#059669' : '#374151',
                    marginBottom: '4px',
                  }}>
                    {option.label}
                  </div>
                  <div style={{
                    fontSize: '0.75rem',
                    color: '#9CA3AF',
                  }}>
                    {option.description}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Submit */}
          <div style={{
            display: 'flex',
            gap: '12px',
            paddingTop: '16px',
            borderTop: '1px solid #F3F4F6',
          }}>
            <Link href="/portal/requests" style={{
              flex: 1,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '14px',
              background: '#F3F4F6',
              color: '#374151',
              border: 'none',
              borderRadius: '12px',
              fontSize: '0.95rem',
              fontWeight: '600',
              textDecoration: 'none',
              cursor: 'pointer',
            }}>
              Odustani
            </Link>
            <button
              type="submit"
              disabled={loading}
              style={{
                flex: 2,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                padding: '14px',
                background: loading
                  ? '#9CA3AF'
                  : 'linear-gradient(135deg, #00ff94 0%, #00cc76 100%)',
                color: '#000',
                border: 'none',
                borderRadius: '12px',
                fontSize: '0.95rem',
                fontWeight: '700',
                cursor: loading ? 'not-allowed' : 'pointer',
                boxShadow: loading ? 'none' : '0 4px 14px rgba(0, 255, 148, 0.3)',
              }}
            >
              {loading ? (
                <>
                  <Loader2 size={18} className="animate-spin" />
                  Slanje...
                </>
              ) : (
                <>
                  <FileEdit size={18} />
                  Pošalji zahtjev
                </>
              )}
            </button>
          </div>
        </div>
      </form>

      <style jsx>{`
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
