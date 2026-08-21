'use client';

import { useEffect, useState } from 'react';
import { getPortalUser } from '@/lib/portalAuth';
import { supabase } from '@/lib/supabase';
import Link from 'next/link';
import {
  Receipt,
  ExternalLink,
  Download,
  Calendar,
  CheckCircle2,
  Clock,
  AlertCircle,
  Euro,
  FileText,
} from 'lucide-react';

const QUOTE_STATUS_CONFIG = {
  draft: { bg: '#151514', color: '#8E8E8E', label: 'Nacrt' },
  sent: { bg: '#14202E', color: '#60A5FA', label: 'Poslano' },
  viewed: { bg: '#191D33', color: '#818CF8', label: 'Pregledano' },
  accepted: { bg: '#10291D', color: '#34D399', label: 'Prihvaćeno' },
  paid: { bg: '#10291D', color: '#34D399', label: 'Plaćeno' },
  rejected: { bg: '#2C1515', color: '#F87171', label: 'Odbijeno' },
  expired: { bg: '#151514', color: '#8E8E8E', label: 'Isteklo' },
};

const INVOICE_STATUS_CONFIG = {
  unpaid: { bg: '#2A230F', color: '#FBBF24', label: 'Neplaćeno', icon: Clock },
  paid: { bg: '#10291D', color: '#34D399', label: 'Plaćeno', icon: CheckCircle2 },
  overdue: { bg: '#2C1515', color: '#F87171', label: 'Dospjelo', icon: AlertCircle },
};

export default function InvoicesPage() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quotes, setQuotes] = useState([]);
  const [invoices, setInvoices] = useState([]);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    const currentUser = await getPortalUser();
    setUser(currentUser);

    if (!currentUser?.client_id) {
      setLoading(false);
      return;
    }

    const [quotesRes, invoicesRes] = await Promise.all([
      supabase
        .from('quotes')
        .select('*')
        .eq('client_id', currentUser.client_id)
        .neq('status', 'draft')
        .order('created_at', { ascending: false }),
      supabase
        .from('invoices')
        .select('*')
        .eq('client_id', currentUser.client_id)
        .order('issue_date', { ascending: false }),
    ]);

    if (quotesRes.error) {
      console.error('Error loading quotes:', quotesRes.error);
    } else {
      setQuotes(quotesRes.data || []);
    }

    if (invoicesRes.error) {
      console.error('Error loading invoices:', invoicesRes.error);
    } else {
      setInvoices(invoicesRes.data || []);
    }

    setLoading(false);
  };

  const handleDownloadInvoice = async (invoice) => {
    const { data, error } = await supabase.storage
      .from('invoices')
      .createSignedUrl(invoice.file_path, 3600);

    if (error) {
      console.error('Error creating signed URL:', error);
      alert('Greška pri preuzimanju datoteke');
      return;
    }

    window.open(data.signedUrl, '_blank');
  };

  // Quote stats
  const totalPaid = quotes
    .filter((q) => q.status === 'paid')
    .reduce((sum, q) => sum + (q.pricing?.total || 0), 0);

  const pendingQuoteAmount = quotes
    .filter((q) => ['sent', 'viewed', 'accepted'].includes(q.status))
    .reduce((sum, q) => sum + (q.pricing?.total || 0), 0);

  // Invoice stats
  const unpaidInvoiceAmount = invoices
    .filter((inv) => inv.status === 'unpaid')
    .reduce((sum, inv) => sum + Number(inv.amount), 0);

  const overdueInvoiceAmount = invoices
    .filter((inv) => inv.status === 'overdue')
    .reduce((sum, inv) => sum + Number(inv.amount), 0);

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', padding: '60px 0' }}>
        <div style={{ color: '#8E8E8E' }}>Učitavanje...</div>
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <div style={{ marginBottom: '24px' }}>
        <h1 style={{
          fontSize: '1.75rem',
          fontWeight: '800',
          color: '#F2F2F2',
          marginBottom: '4px',
        }}>
          Ponude i fakture
        </h1>
        <p style={{ color: '#8E8E8E', fontSize: '0.95rem' }}>
          Pregledajte ponude, fakture i status plaćanja
        </p>
      </div>

      {/* Stats */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
        gap: '16px',
        marginBottom: '32px',
      }}>
        <div style={{
          background: '#0F0F0F',
          borderRadius: '16px',
          padding: '24px',
          boxShadow: '0 2px 8px rgba(0, 0, 0, 0.04)',
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            marginBottom: '16px',
          }}>
            <div style={{
              width: '48px',
              height: '48px',
              borderRadius: '12px',
              background: '#10291D',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}>
              <CheckCircle2 size={24} style={{ color: '#34D399' }} />
            </div>
          </div>
          <div style={{
            fontSize: '2rem',
            fontWeight: '800',
            color: '#34D399',
            marginBottom: '4px',
          }}>
            €{totalPaid.toLocaleString()}
          </div>
          <div style={{ fontSize: '0.9rem', color: '#8E8E8E' }}>
            Plaćene ponude
          </div>
        </div>

        <div style={{
          background: '#0F0F0F',
          borderRadius: '16px',
          padding: '24px',
          boxShadow: '0 2px 8px rgba(0, 0, 0, 0.04)',
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            marginBottom: '16px',
          }}>
            <div style={{
              width: '48px',
              height: '48px',
              borderRadius: '12px',
              background: '#2A230F',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}>
              <Clock size={24} style={{ color: '#FBBF24' }} />
            </div>
          </div>
          <div style={{
            fontSize: '2rem',
            fontWeight: '800',
            color: '#FBBF24',
            marginBottom: '4px',
          }}>
            €{unpaidInvoiceAmount.toLocaleString()}
          </div>
          <div style={{ fontSize: '0.9rem', color: '#8E8E8E' }}>
            Neplaćene fakture
          </div>
        </div>

        {overdueInvoiceAmount > 0 && (
          <div style={{
            background: '#0F0F0F',
            borderRadius: '16px',
            padding: '24px',
            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.04)',
          }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              marginBottom: '16px',
            }}>
              <div style={{
                width: '48px',
                height: '48px',
                borderRadius: '12px',
                background: '#2C1515',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}>
                <AlertCircle size={24} style={{ color: '#F87171' }} />
              </div>
            </div>
            <div style={{
              fontSize: '2rem',
              fontWeight: '800',
              color: '#F87171',
              marginBottom: '4px',
            }}>
              €{overdueInvoiceAmount.toLocaleString()}
            </div>
            <div style={{ fontSize: '0.9rem', color: '#8E8E8E' }}>
              Dospjele fakture
            </div>
          </div>
        )}

        <div style={{
          background: '#0F0F0F',
          borderRadius: '16px',
          padding: '24px',
          boxShadow: '0 2px 8px rgba(0, 0, 0, 0.04)',
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            marginBottom: '16px',
          }}>
            <div style={{
              width: '48px',
              height: '48px',
              borderRadius: '12px',
              background: '#191D33',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}>
              <Receipt size={24} style={{ color: '#818CF8' }} />
            </div>
          </div>
          <div style={{
            fontSize: '2rem',
            fontWeight: '800',
            color: '#818CF8',
            marginBottom: '4px',
          }}>
            {quotes.length + invoices.length}
          </div>
          <div style={{ fontSize: '0.9rem', color: '#8E8E8E' }}>
            Ukupno dokumenata
          </div>
        </div>
      </div>

      {/* Invoices Section */}
      <div style={{ marginBottom: '32px' }}>
        <h2 style={{
          fontSize: '1.25rem',
          fontWeight: '700',
          color: '#F2F2F2',
          marginBottom: '16px',
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
        }}>
          <FileText size={20} style={{ color: '#00cc76' }} />
          Fakture
        </h2>

        {invoices.length === 0 ? (
          <div style={{
            background: '#0F0F0F',
            borderRadius: '16px',
            padding: '48px 20px',
            textAlign: 'center',
            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.04)',
          }}>
            <FileText size={40} style={{ color: '#33332F', marginBottom: '12px' }} />
            <h3 style={{
              fontSize: '1rem',
              fontWeight: '600',
              color: '#F2F2F2',
              marginBottom: '6px',
            }}>
              Nema faktura
            </h3>
            <p style={{ color: '#8E8E8E', fontSize: '0.9rem' }}>
              Vaše fakture će se pojaviti ovdje
            </p>
          </div>
        ) : (
          <div style={{
            background: '#0F0F0F',
            borderRadius: '16px',
            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.04)',
            overflow: 'hidden',
          }}>
            {invoices.map((invoice, index) => {
              const status = INVOICE_STATUS_CONFIG[invoice.status] || INVOICE_STATUS_CONFIG.unpaid;
              const StatusIcon = status.icon;

              return (
                <div
                  key={invoice.id}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '16px',
                    padding: '20px 24px',
                    borderBottom: index < invoices.length - 1 ? '1px solid #151514' : 'none',
                    transition: 'background 0.2s ease',
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.background = '#111110'}
                  onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                >
                  {/* Icon */}
                  <div style={{
                    width: '48px',
                    height: '48px',
                    borderRadius: '12px',
                    background: status.bg,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                  }}>
                    <StatusIcon size={24} style={{ color: status.color }} />
                  </div>

                  {/* Content */}
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '10px',
                      marginBottom: '6px',
                    }}>
                      <h3 style={{
                        fontSize: '1rem',
                        fontWeight: '600',
                        color: '#F2F2F2',
                      }}>
                        {invoice.invoice_number}
                      </h3>
                    </div>

                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '16px',
                      flexWrap: 'wrap',
                    }}>
                      <span style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px',
                        padding: '4px 10px',
                        background: status.bg,
                        color: status.color,
                        borderRadius: '6px',
                        fontSize: '0.8rem',
                        fontWeight: '600',
                      }}>
                        {status.label}
                      </span>

                      <span style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '4px',
                        fontSize: '0.85rem',
                        color: '#8E8E8E',
                      }}>
                        <Calendar size={14} />
                        {new Date(invoice.issue_date).toLocaleDateString('hr-HR')}
                      </span>

                      {invoice.status !== 'paid' && invoice.due_date && (
                        <span style={{
                          fontSize: '0.85rem',
                          color: invoice.status === 'overdue' ? '#F87171' : '#8E8E8E',
                        }}>
                          Dospijeće: {new Date(invoice.due_date).toLocaleDateString('hr-HR')}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Price */}
                  <div style={{
                    textAlign: 'right',
                    flexShrink: 0,
                  }}>
                    <div style={{
                      fontSize: '1.25rem',
                      fontWeight: '800',
                      color: '#F2F2F2',
                    }}>
                      €{Number(invoice.amount).toLocaleString()}
                    </div>
                  </div>

                  {/* Download Action */}
                  <button
                    onClick={() => handleDownloadInvoice(invoice)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      width: '44px',
                      height: '44px',
                      background: '#151514',
                      color: '#C9C9C9',
                      borderRadius: '10px',
                      border: 'none',
                      cursor: 'pointer',
                      flexShrink: 0,
                      transition: 'all 0.2s ease',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = '#00ff94';
                      e.currentTarget.style.color = '#000';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = '#151514';
                      e.currentTarget.style.color = '#C9C9C9';
                    }}
                  >
                    <Download size={18} />
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Quotes Section */}
      <div>
        <h2 style={{
          fontSize: '1.25rem',
          fontWeight: '700',
          color: '#F2F2F2',
          marginBottom: '16px',
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
        }}>
          <Receipt size={20} style={{ color: '#00cc76' }} />
          Ponude
        </h2>

        {quotes.length === 0 ? (
          <div style={{
            background: '#0F0F0F',
            borderRadius: '16px',
            padding: '48px 20px',
            textAlign: 'center',
            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.04)',
          }}>
            <Receipt size={40} style={{ color: '#33332F', marginBottom: '12px' }} />
            <h3 style={{
              fontSize: '1rem',
              fontWeight: '600',
              color: '#F2F2F2',
              marginBottom: '6px',
            }}>
              Nema ponuda
            </h3>
            <p style={{ color: '#8E8E8E', fontSize: '0.9rem' }}>
              Vaše ponude će se pojaviti ovdje
            </p>
          </div>
        ) : (
          <div style={{
            background: '#0F0F0F',
            borderRadius: '16px',
            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.04)',
            overflow: 'hidden',
          }}>
            {quotes.map((quote, index) => {
              const status = QUOTE_STATUS_CONFIG[quote.status] || QUOTE_STATUS_CONFIG.sent;
              const previewUrl = `/ponuda/${quote.id}`;

              return (
                <div
                  key={quote.id}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '16px',
                    padding: '20px 24px',
                    borderBottom: index < quotes.length - 1 ? '1px solid #151514' : 'none',
                    transition: 'background 0.2s ease',
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.background = '#111110'}
                  onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                >
                  {/* Icon */}
                  <div style={{
                    width: '48px',
                    height: '48px',
                    borderRadius: '12px',
                    background: 'linear-gradient(135deg, rgba(0, 255, 148, 0.15) 0%, rgba(0, 204, 118, 0.15) 100%)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                  }}>
                    <Receipt size={24} style={{ color: '#00cc76' }} />
                  </div>

                  {/* Content */}
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '10px',
                      marginBottom: '6px',
                    }}>
                      <h3 style={{
                        fontSize: '1rem',
                        fontWeight: '600',
                        color: '#F2F2F2',
                      }}>
                        {quote.title || quote.reference || `Ponuda ${quote.id.slice(0, 8)}`}
                      </h3>
                    </div>

                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '16px',
                      flexWrap: 'wrap',
                    }}>
                      <span style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px',
                        padding: '4px 10px',
                        background: status.bg,
                        color: status.color,
                        borderRadius: '6px',
                        fontSize: '0.8rem',
                        fontWeight: '600',
                      }}>
                        {status.label}
                      </span>

                      <span style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '4px',
                        fontSize: '0.85rem',
                        color: '#8E8E8E',
                      }}>
                        <Calendar size={14} />
                        {new Date(quote.created_at).toLocaleDateString('hr-HR')}
                      </span>
                    </div>
                  </div>

                  {/* Price */}
                  <div style={{
                    textAlign: 'right',
                    flexShrink: 0,
                  }}>
                    <div style={{
                      fontSize: '1.25rem',
                      fontWeight: '800',
                      color: '#F2F2F2',
                      marginBottom: '4px',
                    }}>
                      €{(quote.pricing?.total || 0).toLocaleString()}
                    </div>
                    {quote.pricing?.monthly_total > 0 && (
                      <div style={{
                        fontSize: '0.8rem',
                        color: '#8E8E8E',
                      }}>
                        + €{quote.pricing.monthly_total}/mj
                      </div>
                    )}
                  </div>

                  {/* Action */}
                  <Link
                    href={previewUrl}
                    target="_blank"
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      width: '44px',
                      height: '44px',
                      background: '#151514',
                      color: '#C9C9C9',
                      borderRadius: '10px',
                      textDecoration: 'none',
                      flexShrink: 0,
                      transition: 'all 0.2s ease',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = '#00ff94';
                      e.currentTarget.style.color = '#000';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = '#151514';
                      e.currentTarget.style.color = '#C9C9C9';
                    }}
                  >
                    <ExternalLink size={18} />
                  </Link>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
