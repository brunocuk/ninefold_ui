// app/(crm-admin)/crm/page.jsx
// CRM Dashboard with Tailwind CSS

'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { getUser } from '@/lib/auth';
import Link from 'next/link';
import {
  UserPlus,
  Users,
  FileText,
  FolderKanban,
  TrendingUp,
  DollarSign,
  Edit,
  Building2,
  ArrowUpRight,
  Sparkles,
  CheckCircle,
  Clock,
  Zap,
  Sun,
  Moon,
  Sunrise,
  Calendar
} from 'lucide-react';

export default function CRMDashboard() {
  const [stats, setStats] = useState({
    leads: { total: 0, new: 0, qualified: 0 },
    clients: { total: 0, active: 0 },
    quotes: { total: 0, pending: 0, accepted: 0 },
    projects: { total: 0, active: 0 },
    revenue: { total: 0, thisMonth: 0 }
  });
  const [loading, setLoading] = useState(true);
  const [userName, setUserName] = useState('');
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    loadStats();
    loadUserName();

    // Update time every minute
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000);

    // Listen for settings changes (e.g., name update from settings page)
    const handleSettingsChanged = (e) => {
      if (e.detail?.profile?.name) {
        setUserName(e.detail.profile.name);
      }
    };

    window.addEventListener('settings-changed', handleSettingsChanged);

    return () => {
      clearInterval(timer);
      window.removeEventListener('settings-changed', handleSettingsChanged);
    };
  }, []);

  const loadUserName = async () => {
    // First try to get from settings via API
    try {
      const tokenData = localStorage.getItem('supabase.auth.token');
      const parsed = tokenData ? JSON.parse(tokenData) : null;
      const accessToken = parsed?.access_token;

      if (accessToken) {
        const response = await fetch('/api/settings', {
          headers: { 'Authorization': `Bearer ${accessToken}` }
        });

        if (response.ok) {
          const { data: settings } = await response.json();
          if (settings?.profile?.name) {
            setUserName(settings.profile.name);
            return;
          }
        }
      }
    } catch (error) {
      console.error('Error loading settings:', error);
    }

    // Fallback to user metadata or email
    const user = await getUser();
    if (user) {
      const name = user.user_metadata?.name || user.email?.split('@')[0] || 'there';
      setUserName(name);
    }
  };

  const getGreeting = () => {
    const hour = currentTime.getHours();
    if (hour >= 5 && hour < 12) return { text: 'Good morning', icon: Sunrise };
    if (hour >= 12 && hour < 17) return { text: 'Good afternoon', icon: Sun };
    if (hour >= 17 && hour < 21) return { text: 'Good evening', icon: Sun };
    return { text: 'Good night', icon: Moon };
  };

  const formatDate = () => {
    return currentTime.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const loadStats = async () => {
    try {
      const [leadsRes, clientsRes, quotesRes, projectsRes] = await Promise.all([
        supabase.from('leads').select('status'),
        supabase.from('clients').select('status, lifetime_value'),
        supabase.from('quotes').select('status, pricing'),
        supabase.from('projects').select('status, total_value, created_at')
      ]);

      const leads = leadsRes.data || [];
      const clients = clientsRes.data || [];
      const quotes = quotesRes.data || [];
      const projects = projectsRes.data || [];

      const leadsNew = leads.filter(l => l.status === 'new').length;
      const leadsQualified = leads.filter(l => l.status === 'qualified').length;
      const clientsActive = clients.filter(c => c.status === 'active').length;
      const quotesPending = quotes.filter(q => ['sent', 'viewed'].includes(q.status)).length;
      const quotesAccepted = quotes.filter(q => q.status === 'accepted').length;
      const projectsActive = projects.filter(p => 
        ['planning', 'design', 'development', 'testing'].includes(p.status)
      ).length;

      const totalRevenue = clients.reduce((sum, c) => 
        sum + (parseFloat(c.lifetime_value) || 0), 0
      );

      const thisMonth = new Date();
      thisMonth.setDate(1);
      const monthlyRevenue = projects
        .filter(p => new Date(p.created_at) >= thisMonth)
        .reduce((sum, p) => sum + parseFloat(p.total_value || 0), 0);

      setStats({
        leads: { total: leads.length, new: leadsNew, qualified: leadsQualified },
        clients: { total: clients.length, active: clientsActive },
        quotes: { total: quotes.length, pending: quotesPending, accepted: quotesAccepted },
        projects: { total: projects.length, active: projectsActive },
        revenue: { total: totalRevenue, thisMonth: monthlyRevenue }
      });

      setLoading(false);
    } catch (error) {
      console.error('Error loading stats:', error);
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-2xl text-[#00FF94]">Loading dashboard...</div>
      </div>
    );
  }

  const statCards = [
    {
      label: 'Leads',
      value: stats.leads.total,
      icon: UserPlus,
      href: '/crm/leads',
      meta: [
        { label: 'New', value: stats.leads.new, icon: Sparkles },
        { label: 'Qualified', value: stats.leads.qualified, icon: CheckCircle }
      ]
    },
    {
      label: 'Clients',
      value: stats.clients.total,
      icon: Users,
      href: '/crm/clients',
      meta: [
        { label: 'Active', value: stats.clients.active, icon: CheckCircle }
      ]
    },
    {
      label: 'Quotes',
      value: stats.quotes.total,
      icon: FileText,
      href: '/crm/quotes',
      meta: [
        { label: 'Pending', value: stats.quotes.pending, icon: Clock },
        { label: 'Accepted', value: stats.quotes.accepted, icon: CheckCircle }
      ]
    },
    {
      label: 'Projects',
      value: stats.projects.total,
      icon: FolderKanban,
      href: '/crm/projects',
      meta: [
        { label: 'Active', value: stats.projects.active, icon: Zap }
      ]
    },
    {
      label: 'Total Revenue',
      value: `€${stats.revenue.total.toLocaleString()}`,
      icon: DollarSign,
      href: '/crm/analytics',
      meta: [
        { label: 'This month', value: `€${stats.revenue.thisMonth.toLocaleString()}`, icon: TrendingUp }
      ]
    }
  ];

  const quickActions = [
    { label: 'Add Lead', icon: UserPlus, href: '/crm/leads/new', color: 'bg-[#00FF94]' },
    { label: 'Create Quote', icon: Edit, href: '/crm/quotes/new', color: 'bg-blue-500' },
    { label: 'New Project', icon: FolderKanban, href: '/crm/projects/new', color: 'bg-purple-500' },
    { label: 'Add Client', icon: Building2, href: '/crm/clients/new', color: 'bg-amber-500' }
  ];

  const greeting = getGreeting();
  const GreetingIcon = greeting.icon;

  return (
    <div className="animate-fadeIn">
      {/* Personalized Header */}
      <div className="mb-10">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-400/20 to-orange-500/20 flex items-center justify-center">
            <GreetingIcon size={20} className="text-amber-400" />
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <Calendar size={14} />
            <span>{formatDate()}</span>
          </div>
        </div>
        <h1 className="text-4xl font-black mb-2">
          <span className="text-white">{greeting.text}, </span>
          <span className="bg-gradient-to-r from-[#00FF94] to-[#00CC76] bg-clip-text text-transparent">
            {userName || 'there'}
          </span>
        </h1>
        <p className="text-gray-400">Here's your business overview for today.</p>
      </div>

      {stats.leads.total === 0 && stats.clients.total === 0 ? (
        /* Empty State */
        <div className="bg-[#1a1a1a] border-2 border-dashed border-[#2A2A2A] rounded-2xl p-20 text-center">
          <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-[#00FF94]/10 flex items-center justify-center">
            <Sparkles size={40} className="text-[#00FF94]" />
          </div>
          <h3 className="text-2xl font-bold mb-3">Welcome to NineFold CRM!</h3>
          <p className="text-gray-400 text-lg mb-8">Get started by adding your first lead or client.</p>
          <div className="flex gap-3 justify-center">
            <Link 
              href="/crm/leads/new" 
              className="px-7 py-3.5 bg-[#00FF94] text-[#0F0F0F] rounded-xl font-bold hover:shadow-lg hover:shadow-[#00FF94]/30 hover:-translate-y-0.5 transition-all"
            >
              Add First Lead
            </Link>
            <Link 
              href="/crm/clients/new" 
              className="px-7 py-3.5 bg-[#2A2A2A] text-white rounded-xl font-bold hover:bg-[#3A3A3A] transition-all"
            >
              Add Client
            </Link>
          </div>
        </div>
      ) : (
        <>
          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6 mb-12">
            {statCards.map((card, index) => {
              const Icon = card.icon;
              return (
                <Link 
                  href={card.href} 
                  key={index}
                  className="group relative bg-[#1a1a1a] border border-[#2A2A2A] rounded-2xl p-7 hover:border-[#00FF94] hover:shadow-xl hover:shadow-[#00FF94]/10 hover:-translate-y-1 transition-all duration-300"
                >
                  
                  {/* Header */}
                  <div className="flex items-center justify-between mb-5">
                    <div className="w-12 h-12 rounded-xl bg-[#00FF94]/10 flex items-center justify-center text-[#00FF94]">
                      <Icon size={24} />
                    </div>
                    <ArrowUpRight 
                      size={20} 
                      className="text-gray-600 group-hover:text-[#00FF94] group-hover:translate-x-1 group-hover:-translate-y-1 transition-all" 
                    />
                  </div>

                  {/* Label */}
                  <div className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-3">
                    {card.label}
                  </div>

                  {/* Value */}
                  <div className="text-4xl font-black text-white mb-4">
                    {card.value}
                  </div>

                  {/* Meta */}
                  <div className="flex flex-wrap gap-4 text-sm text-gray-500">
                    {card.meta.map((item, i) => {
                      const MetaIcon = item.icon;
                      return (
                        <div key={i} className="flex items-center gap-1.5">
                          <MetaIcon size={14} className="text-[#00FF94]" />
                          <span>{item.value} {item.label}</span>
                        </div>
                      );
                    })}
                  </div>
                </Link>
              );
            })}
          </div>

          {/* Quick Actions */}
          <div className="mt-12">
            <h2 className="text-2xl font-bold mb-6">Quick Actions</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
              {quickActions.map((action, index) => {
                const Icon = action.icon;
                return (
                  <Link 
                    href={action.href} 
                    key={index}
                    className="group bg-[#1a1a1a] border border-[#2A2A2A] rounded-2xl p-8 flex flex-col items-center gap-4 hover:border-[#00FF94] hover:shadow-xl hover:shadow-[#00FF94]/10 hover:-translate-y-1 transition-all duration-300"
                  >
                    <div className={`w-16 h-16 rounded-2xl bg-[#00FF94]/10 flex items-center justify-center group-hover:scale-110 transition-transform`}>
                      <Icon size={28} className="text-[#00FF94]" />
                    </div>
                    <div className="font-semibold text-center">{action.label}</div>
                  </Link>
                );
              })}
            </div>
          </div>
        </>
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