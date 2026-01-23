// app/(crm-admin)/crm/projects/[id]/page.jsx
// Project Detail Page with Tailwind CSS

'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { 
  ArrowLeft,
  Edit,
  Trash2,
  Save,
  X,
  Building2,
  DollarSign,
  Calendar,
  ExternalLink,
  Github,
  Globe,
  Rocket,
  Package,
  TrendingUp
} from 'lucide-react';
import { useToast } from '@/components/Toast';

export default function ProjectDetailPage() {
  const params = useParams();
  const router = useRouter();
  const toast = useToast();
  const [project, setProject] = useState(null);
  const [client, setClient] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({});

  useEffect(() => {
    loadProject();
  }, [params.id]);

  const loadProject = async () => {
    try {
      const { data: projectData, error: projectError } = await supabase
        .from('projects')
        .select('*, clients(*)')
        .eq('id', params.id)
        .single();

      if (projectError) throw projectError;

      setProject(projectData);
      setClient(projectData.clients);
      setFormData(projectData);
    } catch (error) {
      console.error('Error loading project:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    setSaving(true);

    try {
      const updateData = {
        ...formData,
        total_value: parseFloat(formData.total_value),
        paid_amount: parseFloat(formData.paid_amount || 0),
        progress: parseInt(formData.progress)
      };

      const { error } = await supabase
        .from('projects')
        .update(updateData)
        .eq('id', params.id);

      if (error) throw error;

      setProject(updateData);
      setEditing(false);
      await loadProject();
    } catch (error) {
      console.error('Error updating project:', error);
      toast.error('Error updating project. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this project? This action cannot be undone.')) {
      return;
    }

    try {
      const { error } = await supabase
        .from('projects')
        .delete()
        .eq('id', params.id);

      if (error) throw error;
      router.push('/crm/projects');
    } catch (error) {
      console.error('Error deleting project:', error);
      toast.error('Error deleting project. Please try again.');
    }
  };

  const getProgressColor = (progress) => {
    if (progress >= 80) return '#00FF94';
    if (progress >= 50) return '#f59e0b';
    return '#3b82f6';
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-2xl text-[#00FF94]">Loading project...</div>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="text-center py-20">
        <h2 className="text-2xl font-bold mb-4">Project not found</h2>
        <Link href="/crm/projects" className="text-[#00FF94] hover:underline">
          ← Back to Projects
        </Link>
      </div>
    );
  }

  const remainingAmount = project.total_value - (project.paid_amount || 0);
  const paymentProgress = ((project.paid_amount || 0) / project.total_value) * 100;

  const statusColors = {
    planning: 'bg-blue-500',
    design: 'bg-purple-500',
    development: 'bg-amber-500',
    testing: 'bg-cyan-500',
    deployed: 'bg-[#00FF94] text-black',
    completed: 'bg-green-500'
  };

  return (
    <div className="max-w-6xl animate-fadeIn">
      {/* Breadcrumb */}
      <Link 
        href="/crm/projects" 
        className="inline-flex items-center gap-2 text-gray-400 hover:text-[#00FF94] mb-6 transition-colors"
      >
        <ArrowLeft size={16} />
        Back to Projects
      </Link>

      {/* Header */}
      <div className="flex flex-col lg:flex-row justify-between items-start gap-6 mb-8">
        <div className="flex-1">
          <h1 className="text-4xl font-black text-white mb-4">{project.name}</h1>
          {client && (
            <Link 
              href={`/crm/clients/${client.id}`}
              className="inline-flex items-center gap-2 text-[#00FF94] font-bold text-lg hover:underline"
            >
              <Building2 size={20} />
              {client.company || client.name}
            </Link>
          )}
        </div>
        <span className={`${statusColors[project.status] || 'bg-blue-500'} text-white px-4 py-2 rounded-full text-sm font-bold`}>
          {project.status}
        </span>
      </div>

      {/* Actions */}
      <div className="flex flex-wrap gap-3 mb-8">
        {!editing && (
          <>
            <button
              onClick={() => setEditing(true)}
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#00FF94] text-black rounded-xl font-bold hover:shadow-lg hover:shadow-[#00FF94]/30 hover:-translate-y-0.5 transition-all"
            >
              <Edit size={18} />
              Edit
            </button>
            {project.staging_url && (
              <a
                href={project.staging_url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#2A2A2A] text-white rounded-xl font-bold hover:bg-[#3A3A3A] transition-all"
              >
                <Globe size={18} />
                View Staging
              </a>
            )}
            {project.production_url && (
              <a
                href={project.production_url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#2A2A2A] text-white rounded-xl font-bold hover:bg-[#3A3A3A] transition-all"
              >
                <Rocket size={18} />
                View Live
              </a>
            )}
            <button
              onClick={handleDelete}
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-red-500 text-white rounded-xl font-bold hover:bg-red-600 transition-all"
            >
              <Trash2 size={18} />
              Delete
            </button>
          </>
        )}
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
        <div className="bg-[#1a1a1a] border border-[#2A2A2A] rounded-2xl p-6 text-center">
          <div className="text-xs text-gray-500 uppercase tracking-wider mb-3">Total Value</div>
          <div className="text-3xl font-black text-[#00FF94]">
            €{project.total_value.toLocaleString()}
          </div>
        </div>
        <div className="bg-[#1a1a1a] border border-[#2A2A2A] rounded-2xl p-6 text-center">
          <div className="text-xs text-gray-500 uppercase tracking-wider mb-3">Paid</div>
          <div className="text-3xl font-black text-[#00FF94]">
            €{(project.paid_amount || 0).toLocaleString()}
          </div>
          <div className="text-xs text-gray-500 mt-2">{paymentProgress.toFixed(0)}% received</div>
        </div>
        <div className="bg-[#1a1a1a] border border-[#2A2A2A] rounded-2xl p-6 text-center">
          <div className="text-xs text-gray-500 uppercase tracking-wider mb-3">Remaining</div>
          <div className="text-3xl font-black text-[#00FF94]">
            €{remainingAmount.toLocaleString()}
          </div>
        </div>
        {project.deadline && (
          <div className="bg-[#1a1a1a] border border-[#2A2A2A] rounded-2xl p-6 text-center">
            <div className="text-xs text-gray-500 uppercase tracking-wider mb-3">Deadline</div>
            <div className="text-lg font-black text-[#00FF94]">
              {new Date(project.deadline).toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
                year: 'numeric'
              })}
            </div>
          </div>
        )}
      </div>

      {/* Progress */}
      <div className="bg-[#1a1a1a] border border-[#2A2A2A] rounded-2xl p-6 mb-8">
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center gap-2 font-bold text-white">
            <TrendingUp size={20} className="text-[#00FF94]" />
            Project Progress
          </div>
          <div className="text-2xl font-black text-[#00FF94]">{project.progress}%</div>
        </div>
        <div className="bg-[#0a0a0a] rounded-xl h-3 overflow-hidden">
          <div 
            className="h-full transition-all duration-300 rounded-xl"
            style={{
              width: `${project.progress}%`,
              backgroundColor: getProgressColor(project.progress)
            }}
          />
        </div>
      </div>

      {/* Content */}
      {editing ? (
        <form onSubmit={handleUpdate}>
          <div className="bg-[#1a1a1a] border border-[#2A2A2A] rounded-2xl p-8">
            <h3 className="text-2xl font-bold mb-6 pb-4 border-b border-[#2A2A2A]">
              Edit Project
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <label className="block text-sm font-semibold text-gray-400 mb-2">Project Name *</label>
                <input
                  type="text"
                  value={formData.name || ''}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  required
                  className="w-full px-4 py-3 bg-[#0a0a0a] border border-[#2A2A2A] rounded-xl text-white focus:border-[#00FF94] focus:outline-none transition-colors"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-400 mb-2">Project Type</label>
                <select
                  value={formData.project_type || ''}
                  onChange={(e) => setFormData({...formData, project_type: e.target.value})}
                  className="w-full px-4 py-3 bg-[#0a0a0a] border border-[#2A2A2A] rounded-xl text-white focus:border-[#00FF94] focus:outline-none transition-colors"
                >
                  <option value="">Select...</option>
                  <option value="website">Website</option>
                  <option value="web-app">Web Application</option>
                  <option value="e-commerce">E-commerce</option>
                  <option value="redesign">Redesign</option>
                  <option value="maintenance">Maintenance</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-400 mb-2">Status</label>
                <select
                  value={formData.status || 'planning'}
                  onChange={(e) => setFormData({...formData, status: e.target.value})}
                  className="w-full px-4 py-3 bg-[#0a0a0a] border border-[#2A2A2A] rounded-xl text-white focus:border-[#00FF94] focus:outline-none transition-colors"
                >
                  <option value="planning">Planning</option>
                  <option value="design">Design</option>
                  <option value="development">Development</option>
                  <option value="testing">Testing</option>
                  <option value="deployed">Deployed</option>
                  <option value="completed">Completed</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-400 mb-2">Progress (%)</label>
                <input
                  type="number"
                  value={formData.progress || 0}
                  onChange={(e) => setFormData({...formData, progress: e.target.value})}
                  min="0"
                  max="100"
                  className="w-full px-4 py-3 bg-[#0a0a0a] border border-[#2A2A2A] rounded-xl text-white focus:border-[#00FF94] focus:outline-none transition-colors"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-400 mb-2">Total Value (€) *</label>
                <input
                  type="number"
                  value={formData.total_value || ''}
                  onChange={(e) => setFormData({...formData, total_value: e.target.value})}
                  step="0.01"
                  required
                  className="w-full px-4 py-3 bg-[#0a0a0a] border border-[#2A2A2A] rounded-xl text-white focus:border-[#00FF94] focus:outline-none transition-colors"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-400 mb-2">Paid Amount (€)</label>
                <input
                  type="number"
                  value={formData.paid_amount || 0}
                  onChange={(e) => setFormData({...formData, paid_amount: e.target.value})}
                  step="0.01"
                  className="w-full px-4 py-3 bg-[#0a0a0a] border border-[#2A2A2A] rounded-xl text-white focus:border-[#00FF94] focus:outline-none transition-colors"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-400 mb-2">Start Date</label>
                <input
                  type="date"
                  value={formData.start_date || ''}
                  onChange={(e) => setFormData({...formData, start_date: e.target.value})}
                  className="w-full px-4 py-3 bg-[#0a0a0a] border border-[#2A2A2A] rounded-xl text-white focus:border-[#00FF94] focus:outline-none transition-colors"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-400 mb-2">Deadline</label>
                <input
                  type="date"
                  value={formData.deadline || ''}
                  onChange={(e) => setFormData({...formData, deadline: e.target.value})}
                  className="w-full px-4 py-3 bg-[#0a0a0a] border border-[#2A2A2A] rounded-xl text-white focus:border-[#00FF94] focus:outline-none transition-colors"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-400 mb-2">Repository URL</label>
                <input
                  type="url"
                  value={formData.repo_url || ''}
                  onChange={(e) => setFormData({...formData, repo_url: e.target.value})}
                  className="w-full px-4 py-3 bg-[#0a0a0a] border border-[#2A2A2A] rounded-xl text-white focus:border-[#00FF94] focus:outline-none transition-colors"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-400 mb-2">Staging URL</label>
                <input
                  type="url"
                  value={formData.staging_url || ''}
                  onChange={(e) => setFormData({...formData, staging_url: e.target.value})}
                  className="w-full px-4 py-3 bg-[#0a0a0a] border border-[#2A2A2A] rounded-xl text-white focus:border-[#00FF94] focus:outline-none transition-colors"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-400 mb-2">Production URL</label>
                <input
                  type="url"
                  value={formData.production_url || ''}
                  onChange={(e) => setFormData({...formData, production_url: e.target.value})}
                  className="w-full px-4 py-3 bg-[#0a0a0a] border border-[#2A2A2A] rounded-xl text-white focus:border-[#00FF94] focus:outline-none transition-colors"
                />
              </div>
            </div>

            <div className="mb-6">
              <label className="block text-sm font-semibold text-gray-400 mb-2">Description</label>
              <textarea
                value={formData.description || ''}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
                rows={4}
                className="w-full px-4 py-3 bg-[#0a0a0a] border border-[#2A2A2A] rounded-xl text-white focus:border-[#00FF94] focus:outline-none transition-colors resize-none"
              />
            </div>

            <div className="mb-6">
              <label className="block text-sm font-semibold text-gray-400 mb-2">Notes</label>
              <textarea
                value={formData.notes || ''}
                onChange={(e) => setFormData({...formData, notes: e.target.value})}
                rows={4}
                className="w-full px-4 py-3 bg-[#0a0a0a] border border-[#2A2A2A] rounded-xl text-white focus:border-[#00FF94] focus:outline-none transition-colors resize-none"
              />
            </div>

            <div className="flex gap-3 pt-6 border-t border-[#2A2A2A]">
              <button
                type="submit"
                disabled={saving}
                className="inline-flex items-center gap-2 px-6 py-3 bg-[#00FF94] text-black rounded-xl font-bold hover:shadow-lg hover:shadow-[#00FF94]/30 hover:-translate-y-0.5 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Save size={18} />
                {saving ? 'Saving...' : 'Save Changes'}
              </button>
              <button
                type="button"
                onClick={() => {
                  setEditing(false);
                  setFormData(project);
                }}
                className="inline-flex items-center gap-2 px-6 py-3 bg-[#2A2A2A] text-white rounded-xl font-bold hover:bg-[#3A3A3A] transition-all"
              >
                <X size={18} />
                Cancel
              </button>
            </div>
          </div>
        </form>
      ) : (
        <div className="space-y-6">
          {/* Project Details */}
          <div className="bg-[#1a1a1a] border border-[#2A2A2A] rounded-2xl p-8">
            <h3 className="text-2xl font-bold mb-6 pb-4 border-b border-[#2A2A2A]">
              Project Details
            </h3>
            {project.description && (
              <p className="text-gray-400 leading-relaxed mb-6">
                {project.description}
              </p>
            )}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
              {project.project_type && (
                <div className="bg-[#0a0a0a] rounded-xl p-5">
                  <div className="text-xs text-gray-500 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                    <Package size={12} />
                    Type
                  </div>
                  <div className="text-sm font-bold text-[#00FF94]">{project.project_type}</div>
                </div>
              )}
              {project.start_date && (
                <div className="bg-[#0a0a0a] rounded-xl p-5">
                  <div className="text-xs text-gray-500 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                    <Calendar size={12} />
                    Start Date
                  </div>
                  <div className="text-sm font-bold text-[#00FF94]">
                    {new Date(project.start_date).toLocaleDateString()}
                  </div>
                </div>
              )}
              <div className="bg-[#0a0a0a] rounded-xl p-5">
                <div className="text-xs text-gray-500 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                  <Calendar size={12} />
                  Created
                </div>
                <div className="text-sm font-bold text-[#00FF94]">
                  {new Date(project.created_at).toLocaleDateString()}
                </div>
              </div>
            </div>
          </div>

          {/* Technical Links */}
          {(project.repo_url || project.staging_url || project.production_url) && (
            <div className="bg-[#1a1a1a] border border-[#2A2A2A] rounded-2xl p-8">
              <h3 className="text-2xl font-bold mb-6 pb-4 border-b border-[#2A2A2A]">
                Technical Links
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                {project.repo_url && (
                  <div className="bg-[#0a0a0a] rounded-xl p-5">
                    <div className="text-xs text-gray-500 uppercase tracking-wider mb-3 flex items-center gap-1.5">
                      <Github size={12} />
                      Repository
                    </div>
                    <a 
                      href={project.repo_url} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 text-[#00FF94] hover:underline font-semibold"
                    >
                      View on GitHub
                      <ExternalLink size={14} />
                    </a>
                  </div>
                )}
                {project.staging_url && (
                  <div className="bg-[#0a0a0a] rounded-xl p-5">
                    <div className="text-xs text-gray-500 uppercase tracking-wider mb-3 flex items-center gap-1.5">
                      <Globe size={12} />
                      Staging
                    </div>
                    <a 
                      href={project.staging_url} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 text-[#00FF94] hover:underline font-semibold"
                    >
                      Open Staging
                      <ExternalLink size={14} />
                    </a>
                  </div>
                )}
                {project.production_url && (
                  <div className="bg-[#0a0a0a] rounded-xl p-5">
                    <div className="text-xs text-gray-500 uppercase tracking-wider mb-3 flex items-center gap-1.5">
                      <Rocket size={12} />
                      Production
                    </div>
                    <a 
                      href={project.production_url} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 text-[#00FF94] hover:underline font-semibold"
                    >
                      Open Live Site
                      <ExternalLink size={14} />
                    </a>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Notes */}
          {project.notes && (
            <div className="bg-[#1a1a1a] border border-[#2A2A2A] rounded-2xl p-8">
              <h3 className="text-2xl font-bold mb-6 pb-4 border-b border-[#2A2A2A]">
                Internal Notes
              </h3>
              <p className="text-gray-400 leading-relaxed whitespace-pre-wrap">
                {project.notes}
              </p>
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
      `}</style>
    </div>
  );
}