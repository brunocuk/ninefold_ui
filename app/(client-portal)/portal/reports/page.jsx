'use client';

import { useEffect, useState } from 'react';
import { getPortalUser } from '@/lib/portalAuth';
import { supabase } from '@/lib/supabase';
import Link from 'next/link';
import {
  FileBarChart,
  ExternalLink,
  Download,
  Calendar,
  TrendingUp,
  Share2,
  Wrench,
} from 'lucide-react';

export default function ReportsPage() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [maintenanceReports, setMaintenanceReports] = useState([]);
  const [socialReports, setSocialReports] = useState([]);
  const [activeTab, setActiveTab] = useState('all');

  useEffect(() => {
    loadReports();
  }, []);

  const loadReports = async () => {
    const currentUser = await getPortalUser();
    setUser(currentUser);

    if (!currentUser?.client_id) {
      setLoading(false);
      return;
    }

    // Get client's contracts first
    const { data: contracts } = await supabase
      .from('recurring_contracts')
      .select('id')
      .eq('client_id', currentUser.client_id);

    const contractIds = contracts?.map((c) => c.id) || [];

    if (contractIds.length > 0) {
      // Fetch maintenance reports
      const { data: maintenanceData } = await supabase
        .from('maintenance_reports')
        .select('*')
        .in('contract_id', contractIds)
        .eq('status', 'sent')
        .order('report_year', { ascending: false })
        .order('report_month', { ascending: false });

      setMaintenanceReports(maintenanceData || []);

      // Fetch social media reports
      const { data: socialData } = await supabase
        .from('social_media_reports')
        .select('*')
        .in('contract_id', contractIds)
        .eq('status', 'sent')
        .order('report_year', { ascending: false })
        .order('report_month', { ascending: false });

      setSocialReports(socialData || []);
    }

    setLoading(false);
  };

  const getMonthName = (month) => {
    const months = [
      'Siječanj', 'Veljača', 'Ožujak', 'Travanj', 'Svibanj', 'Lipanj',
      'Srpanj', 'Kolovoz', 'Rujan', 'Listopad', 'Studeni', 'Prosinac'
    ];
    return months[month - 1];
  };

  const allReports = [
    ...maintenanceReports.map((r) => ({ ...r, type: 'maintenance' })),
    ...socialReports.map((r) => ({ ...r, type: 'social' })),
  ].sort((a, b) => {
    if (a.report_year !== b.report_year) return b.report_year - a.report_year;
    return b.report_month - a.report_month;
  });

  const filteredReports = activeTab === 'all'
    ? allReports
    : allReports.filter((r) => r.type === activeTab);

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', padding: '60px 0' }}>
        <div style={{ color: '#6B7280' }}>Učitavanje...</div>
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
          color: '#111827',
          marginBottom: '4px',
        }}>
          Izvještaji
        </h1>
        <p style={{ color: '#6B7280', fontSize: '0.95rem' }}>
          Pregledajte mjesečne izvještaje o održavanju i društvenim mrežama
        </p>
      </div>

      {/* Tabs */}
      <div style={{
        display: 'flex',
        gap: '8px',
        marginBottom: '24px',
        background: '#fff',
        padding: '6px',
        borderRadius: '12px',
        width: 'fit-content',
        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.04)',
      }}>
        {[
          { id: 'all', label: 'Svi', icon: FileBarChart },
          { id: 'maintenance', label: 'Održavanje', icon: Wrench },
          { id: 'social', label: 'Društvene mreže', icon: Share2 },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '10px 16px',
              background: activeTab === tab.id ? 'linear-gradient(135deg, #00ff94 0%, #00cc76 100%)' : 'transparent',
              color: activeTab === tab.id ? '#000' : '#6B7280',
              border: 'none',
              borderRadius: '8px',
              fontSize: '0.9rem',
              fontWeight: '600',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
            }}
          >
            <tab.icon size={18} />
            {tab.label}
          </button>
        ))}
      </div>

      {/* Reports List */}
      {filteredReports.length === 0 ? (
        <div style={{
          background: '#fff',
          borderRadius: '16px',
          padding: '60px 20px',
          textAlign: 'center',
          boxShadow: '0 2px 8px rgba(0, 0, 0, 0.04)',
        }}>
          <FileBarChart size={48} style={{ color: '#D1D5DB', marginBottom: '16px' }} />
          <h3 style={{
            fontSize: '1.1rem',
            fontWeight: '700',
            color: '#111827',
            marginBottom: '8px',
          }}>
            Nema izvještaja
          </h3>
          <p style={{ color: '#6B7280', fontSize: '0.9rem' }}>
            Mjesečni izvještaji će se pojaviti ovdje
          </p>
        </div>
      ) : (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
          gap: '16px',
        }}>
          {filteredReports.map((report) => {
            const isMaintenance = report.type === 'maintenance';
            const previewUrl = isMaintenance
              ? `/report/${report.id}`
              : `/social-report/${report.id}`;
            const pdfUrl = isMaintenance
              ? `/api/maintenance-reports/${report.id}/pdf`
              : `/api/social-media-reports/${report.id}/pdf`;

            return (
              <div
                key={report.id}
                style={{
                  background: '#fff',
                  borderRadius: '16px',
                  padding: '24px',
                  boxShadow: '0 2px 8px rgba(0, 0, 0, 0.04)',
                  transition: 'all 0.2s ease',
                  border: '2px solid transparent',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = '#00ff94';
                  e.currentTarget.style.transform = 'translateY(-2px)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = 'transparent';
                  e.currentTarget.style.transform = 'translateY(0)';
                }}
              >
                {/* Header */}
                <div style={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  justifyContent: 'space-between',
                  marginBottom: '16px',
                }}>
                  <div style={{
                    width: '48px',
                    height: '48px',
                    borderRadius: '12px',
                    background: isMaintenance ? '#DBEAFE' : '#FCE7F3',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}>
                    {isMaintenance ? (
                      <Wrench size={24} style={{ color: '#2563EB' }} />
                    ) : (
                      <Share2 size={24} style={{ color: '#DB2777' }} />
                    )}
                  </div>
                  <span style={{
                    padding: '6px 12px',
                    background: isMaintenance ? '#DBEAFE' : '#FCE7F3',
                    color: isMaintenance ? '#2563EB' : '#DB2777',
                    borderRadius: '20px',
                    fontSize: '0.75rem',
                    fontWeight: '600',
                  }}>
                    {isMaintenance ? 'Održavanje' : 'Social'}
                  </span>
                </div>

                {/* Title */}
                <h3 style={{
                  fontSize: '1.2rem',
                  fontWeight: '700',
                  color: '#111827',
                  marginBottom: '8px',
                }}>
                  {getMonthName(report.report_month)} {report.report_year}
                </h3>

                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  fontSize: '0.85rem',
                  color: '#9CA3AF',
                  marginBottom: '20px',
                }}>
                  <Calendar size={16} />
                  {report.sent_at && new Date(report.sent_at).toLocaleDateString('hr-HR')}
                </div>

                {/* Stats preview */}
                {!isMaintenance && report.total_reach && (
                  <div style={{
                    display: 'flex',
                    gap: '16px',
                    marginBottom: '20px',
                    padding: '12px',
                    background: '#F9FAFB',
                    borderRadius: '10px',
                  }}>
                    <div>
                      <div style={{ fontSize: '1.1rem', fontWeight: '700', color: '#111827' }}>
                        {report.total_reach?.toLocaleString() || 0}
                      </div>
                      <div style={{ fontSize: '0.75rem', color: '#6B7280' }}>Doseg</div>
                    </div>
                    <div>
                      <div style={{ fontSize: '1.1rem', fontWeight: '700', color: '#111827' }}>
                        {report.total_engagement?.toLocaleString() || 0}
                      </div>
                      <div style={{ fontSize: '0.75rem', color: '#6B7280' }}>Interakcije</div>
                    </div>
                  </div>
                )}

                {/* Actions */}
                <div style={{
                  display: 'flex',
                  gap: '10px',
                }}>
                  <Link
                    href={previewUrl}
                    target="_blank"
                    style={{
                      flex: 1,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '6px',
                      padding: '12px',
                      background: 'linear-gradient(135deg, #00ff94 0%, #00cc76 100%)',
                      color: '#000',
                      borderRadius: '10px',
                      fontSize: '0.9rem',
                      fontWeight: '600',
                      textDecoration: 'none',
                    }}
                  >
                    <ExternalLink size={16} />
                    Pregledaj
                  </Link>
                  <a
                    href={pdfUrl}
                    target="_blank"
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      width: '48px',
                      background: '#F3F4F6',
                      color: '#374151',
                      borderRadius: '10px',
                      textDecoration: 'none',
                    }}
                  >
                    <Download size={18} />
                  </a>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
