// app/(crm-admin)/crm/projects/page.jsx
// Projects List with Tailwind CSS

'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import Link from 'next/link';
import {
  FolderKanban,
  Building2,
  DollarSign,
  Calendar,
  Plus,
  Clipboard,
  Palette,
  Code,
  TestTube,
  Rocket,
  CheckCircle,
  Package,
  TrendingUp,
  BadgeCheck
} from 'lucide-react';

export default function ProjectsPage() {
  const [projects, setProjects] = useState([]);
  const [allProjects, setAllProjects] = useState([]); // For stats calculation
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    loadProjects();
  }, [filter]);

  const loadProjects = async () => {
    setLoading(true);
    try {
      // Always fetch all projects for stats
      const { data: allData, error: allError } = await supabase
        .from('projects')
        .select(`
          *,
          clients (
            name,
            company
          )
        `)
        .order('created_at', { ascending: false });

      if (allError) throw allError;
      setAllProjects(allData || []);

      // Apply filter for display
      let filtered = allData || [];
      if (filter === 'finished') {
        filtered = filtered.filter(p => p.status === 'completed' || p.progress >= 100);
      } else if (filter !== 'all') {
        filtered = filtered.filter(p => p.status === filter);
      }

      setProjects(filtered);
    } catch (error) {
      console.error('Error loading projects:', error);
    } finally {
      setLoading(false);
    }
  };

  // Check if project is finished
  const isFinished = (project) => project.status === 'completed' || project.progress >= 100;

  // Calculate stats from all projects
  const stats = {
    totalRemaining: allProjects
      .filter(p => !isFinished(p))
      .reduce((sum, p) => sum + (p.total_value - (p.paid_amount || 0)), 0),
    activeProjects: allProjects.filter(p => !isFinished(p)).length,
    totalValue: allProjects.reduce((sum, p) => sum + (p.total_value || 0), 0),
    fullyPaid: allProjects.filter(p => (p.paid_amount || 0) >= p.total_value && p.total_value > 0).length,
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('hr-HR', {
      style: 'currency',
      currency: 'EUR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const statusConfig = {
    planning: { bg: 'bg-blue-500', text: 'Planning', icon: Clipboard },
    design: { bg: 'bg-purple-500', text: 'Design', icon: Palette },
    development: { bg: 'bg-amber-500', text: 'Development', icon: Code },
    testing: { bg: 'bg-cyan-500', text: 'Testing', icon: TestTube },
    deployed: { bg: 'bg-[#00FF94] text-black', text: 'Deployed', icon: Rocket },
    completed: { bg: 'bg-green-500', text: 'Completed', icon: CheckCircle }
  };

  const getStatusBadge = (status) => {
    const config = statusConfig[status] || statusConfig.planning;
    const Icon = config.icon;
    
    return (
      <span className={`inline-flex items-center gap-1.5 ${config.bg} text-white px-3 py-1.5 rounded-full text-xs font-bold`}>
        <Icon size={12} />
        {config.text}
      </span>
    );
  };

  const getProgressColor = (progress) => {
    if (progress >= 80) return '#00FF94';
    if (progress >= 50) return '#f59e0b';
    return '#3b82f6';
  };

  const filterButtons = [
    { value: 'all', label: 'All', count: allProjects.length },
    { value: 'planning', label: 'Planning', icon: Clipboard },
    { value: 'design', label: 'Design', icon: Palette },
    { value: 'development', label: 'Development', icon: Code },
    { value: 'testing', label: 'Testing', icon: TestTube },
    { value: 'deployed', label: 'Deployed', icon: Rocket },
    { value: 'finished', label: 'Finished', icon: CheckCircle }
  ];

  return (
    <div className="animate-fadeIn">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div>
          <h1 className="text-4xl font-black bg-gradient-to-r from-[#00FF94] to-[#00CC76] bg-clip-text text-transparent mb-2">
            Projects
          </h1>
          <p className="text-gray-400">Track active work and deliverables</p>
        </div>
        <Link
          href="/crm/projects/new"
          className="inline-flex items-center gap-2 px-6 py-3 bg-[#00FF94] text-black rounded-xl font-bold hover:shadow-lg hover:shadow-[#00FF94]/30 hover:-translate-y-0.5 transition-all"
        >
          <Plus size={20} />
          New Project
        </Link>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="bg-[#1a1a1a] border border-[#2A2A2A] rounded-xl p-5 hover:border-[#00FF94] transition-colors">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-lg bg-amber-500/10 flex items-center justify-center">
              <DollarSign size={20} className="text-amber-500" />
            </div>
            <span className="text-xs text-gray-500 uppercase tracking-wider">Total Remaining</span>
          </div>
          <div className="text-2xl font-black text-white">{formatCurrency(stats.totalRemaining)}</div>
        </div>

        <div className="bg-[#1a1a1a] border border-[#2A2A2A] rounded-xl p-5 hover:border-[#00FF94] transition-colors">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-lg bg-blue-500/10 flex items-center justify-center">
              <TrendingUp size={20} className="text-blue-500" />
            </div>
            <span className="text-xs text-gray-500 uppercase tracking-wider">Active Projects</span>
          </div>
          <div className="text-2xl font-black text-white">{stats.activeProjects}</div>
        </div>

        <div className="bg-[#1a1a1a] border border-[#2A2A2A] rounded-xl p-5 hover:border-[#00FF94] transition-colors">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-lg bg-[#00FF94]/10 flex items-center justify-center">
              <DollarSign size={20} className="text-[#00FF94]" />
            </div>
            <span className="text-xs text-gray-500 uppercase tracking-wider">Total Value</span>
          </div>
          <div className="text-2xl font-black text-[#00FF94]">{formatCurrency(stats.totalValue)}</div>
        </div>

        <div className="bg-[#1a1a1a] border border-[#2A2A2A] rounded-xl p-5 hover:border-[#00FF94] transition-colors">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-lg bg-green-500/10 flex items-center justify-center">
              <BadgeCheck size={20} className="text-green-500" />
            </div>
            <span className="text-xs text-gray-500 uppercase tracking-wider">Fully Paid</span>
          </div>
          <div className="text-2xl font-black text-white">{stats.fullyPaid}</div>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3 mb-8">
        {filterButtons.map((btn) => {
          const Icon = btn.icon;
          return (
            <button
              key={btn.value}
              onClick={() => setFilter(btn.value)}
              className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-lg border-2 font-semibold transition-all ${
                filter === btn.value
                  ? 'bg-[#00FF94] text-black border-[#00FF94]'
                  : 'bg-[#1a1a1a] text-gray-400 border-[#2A2A2A] hover:border-[#00FF94] hover:text-[#00FF94]'
              }`}
            >
              {Icon && <Icon size={16} />}
              {btn.label}
              {btn.value === 'all' && ` (${btn.count})`}
            </button>
          );
        })}
      </div>

      {/* Content */}
      {loading ? (
        <div className="flex items-center justify-center py-20">
          <div className="text-2xl text-[#00FF94]">Loading projects...</div>
        </div>
      ) : projects.length === 0 ? (
        <div className="bg-[#1a1a1a] border-2 border-dashed border-[#2A2A2A] rounded-2xl p-20 text-center">
          <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-[#00FF94]/10 flex items-center justify-center">
            <FolderKanban size={40} className="text-[#00FF94]" />
          </div>
          <h2 className="text-2xl font-bold mb-3">No projects yet</h2>
          <p className="text-gray-400 text-lg mb-8">
            {filter === 'all'
              ? 'Start tracking your first project.'
              : `No projects in "${filter}" status.`}
          </p>
          {filter === 'all' && (
            <Link
              href="/crm/projects/new"
              className="inline-flex items-center gap-2 px-7 py-3.5 bg-[#00FF94] text-black rounded-xl font-bold hover:shadow-lg hover:shadow-[#00FF94]/30 hover:-translate-y-0.5 transition-all"
            >
              <Plus size={20} />
              Create First Project
            </Link>
          )}
        </div>
      ) : (
        <div className="grid gap-5">
          {projects.map((project) => {
            const finished = isFinished(project);
            return (
            <Link
              key={project.id}
              href={`/crm/projects/${project.id}`}
              className={`block group bg-[#1a1a1a] border border-[#2A2A2A] rounded-2xl p-6 hover:border-[#00FF94] hover:shadow-xl hover:shadow-[#00FF94]/10 hover:translate-x-1 transition-all duration-300 relative ${finished ? 'opacity-60 grayscale-[30%]' : ''}`}
            >
              {/* Finished Badge */}
              {finished && (
                <div className="absolute top-4 right-4 bg-green-500/20 text-green-400 text-xs font-semibold px-2 py-1 rounded-full flex items-center gap-1">
                  <CheckCircle size={12} />
                  Finished
                </div>
              )}
              {/* Header */}
              <div className="flex flex-col sm:flex-row justify-between items-start gap-4 mb-5">
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-white mb-2">{project.name}</h3>
                  {project.clients && (
                    <div className="flex items-center gap-2 text-[#00FF94] font-semibold mb-3">
                      <Building2 size={16} />
                      {project.clients.company || project.clients.name}
                    </div>
                  )}
                  <div className="flex flex-wrap gap-3 text-sm text-gray-400">
                    {project.project_type && (
                      <span className="inline-flex items-center gap-1.5">
                        <Package size={14} className="text-[#00FF94]" />
                        {project.project_type}
                      </span>
                    )}
                    {project.deadline && (
                      <span className="inline-flex items-center gap-1.5">
                        <Calendar size={14} className="text-[#00FF94]" />
                        Due {new Date(project.deadline).toLocaleDateString()}
                      </span>
                    )}
                  </div>
                </div>
                {!finished && getStatusBadge(project.status)}
              </div>

              {/* Details */}
              <div className="grid grid-cols-3 gap-4 mb-5">
                <div className="bg-[#0a0a0a] rounded-lg p-4">
                  <div className="text-xs text-gray-500 uppercase tracking-wider mb-2">
                    Total Value
                  </div>
                  <div className="text-lg font-black text-[#00FF94] flex items-center gap-1">
                    <DollarSign size={16} />
                    €{project.total_value.toLocaleString()}
                  </div>
                </div>
                <div className="bg-[#0a0a0a] rounded-lg p-4">
                  <div className="text-xs text-gray-500 uppercase tracking-wider mb-2">
                    Paid
                  </div>
                  <div className="text-lg font-black text-[#00FF94] flex items-center gap-1">
                    <DollarSign size={16} />
                    €{(project.paid_amount || 0).toLocaleString()}
                  </div>
                </div>
                <div className="bg-[#0a0a0a] rounded-lg p-4">
                  <div className="text-xs text-gray-500 uppercase tracking-wider mb-2">
                    Remaining
                  </div>
                  <div className="text-lg font-black text-[#00FF94] flex items-center gap-1">
                    <DollarSign size={16} />
                    €{(project.total_value - (project.paid_amount || 0)).toLocaleString()}
                  </div>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="mb-4">
                <div className="bg-[#0a0a0a] rounded-lg h-2.5 overflow-hidden">
                  <div 
                    className="h-full transition-all duration-300 rounded-lg"
                    style={{
                      width: `${project.progress}%`,
                      backgroundColor: getProgressColor(project.progress)
                    }}
                  />
                </div>
                <div className="text-xs text-gray-500 text-right mt-2">
                  {project.progress}% complete
                </div>
              </div>

              {/* Description */}
              {project.description && (
                <p className="text-gray-400 text-sm leading-relaxed">
                  {project.description.length > 120
                    ? project.description.substring(0, 120) + '...'
                    : project.description}
                </p>
              )}
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