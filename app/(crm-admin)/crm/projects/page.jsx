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
  Package
} from 'lucide-react';

export default function ProjectsPage() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    loadProjects();
  }, [filter]);

  const loadProjects = async () => {
    setLoading(true);
    try {
      let query = supabase
        .from('projects')
        .select(`
          *,
          clients (
            name,
            company
          )
        `)
        .order('created_at', { ascending: false });

      if (filter !== 'all') {
        query = query.eq('status', filter);
      }

      const { data, error } = await query;
      if (error) throw error;
      setProjects(data || []);
    } catch (error) {
      console.error('Error loading projects:', error);
    } finally {
      setLoading(false);
    }
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
    { value: 'all', label: 'All', count: projects.length },
    { value: 'planning', label: 'Planning', icon: Clipboard },
    { value: 'design', label: 'Design', icon: Palette },
    { value: 'development', label: 'Development', icon: Code },
    { value: 'testing', label: 'Testing', icon: TestTube },
    { value: 'deployed', label: 'Deployed', icon: Rocket }
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
          {projects.map((project) => (
            <Link
              key={project.id}
              href={`/crm/projects/${project.id}`}
              className="block group bg-[#1a1a1a] border border-[#2A2A2A] rounded-2xl p-6 hover:border-[#00FF94] hover:shadow-xl hover:shadow-[#00FF94]/10 hover:translate-x-1 transition-all duration-300"
            >
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
                {getStatusBadge(project.status)}
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
          ))}
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