// app/crm/projects/[id]/page.jsx
// Project Detail Page - View and manage project

'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';

export default function ProjectDetailPage() {
  const params = useParams();
  const router = useRouter();
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
      await loadProject(); // Reload to get updated data
    } catch (error) {
      console.error('Error updating project:', error);
      alert('Error updating project. Please try again.');
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
      alert('Error deleting project. Please try again.');
    }
  };

  const getProgressColor = (progress) => {
    if (progress >= 80) return '#00FF94';
    if (progress >= 50) return '#f59e0b';
    return '#3b82f6';
  };

  if (loading) {
    return (
      <div style={{textAlign: 'center', padding: '100px 0'}}>
        <div style={{fontSize: '1.5rem', color: '#00FF94'}}>Loading project...</div>
      </div>
    );
  }

  if (!project) {
    return (
      <div style={{textAlign: 'center', padding: '100px 0'}}>
        <h2 style={{color: 'white'}}>Project not found</h2>
        <Link href="/crm/projects" style={{color: '#00FF94'}}>← Back to Projects</Link>
      </div>
    );
  }

  const remainingAmount = project.total_value - (project.paid_amount || 0);
  const paymentProgress = ((project.paid_amount || 0) / project.total_value) * 100;

  return (
    <>
      <style jsx>{`
        .project-detail {
          max-width: 1200px;
          animation: fadeIn 0.5s ease-out;
        }

        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }

        .breadcrumb {
          color: #888;
          font-size: 0.9rem;
          margin-bottom: 20px;
        }

        .breadcrumb a {
          color: #00FF94;
          text-decoration: none;
        }

        .header {
          display: flex;
          justify-content: space-between;
          align-items: start;
          margin-bottom: 30px;
        }

        h1 {
          font-size: 2.5rem;
          font-weight: 900;
          color: white;
          margin-bottom: 10px;
        }

        .client-link {
          font-size: 1.1rem;
          color: #00FF94;
          font-weight: 600;
          margin-bottom: 10px;
          text-decoration: none;
          display: inline-block;
        }

        .client-link:hover {
          text-decoration: underline;
        }

        .status-badge {
          padding: 8px 16px;
          border-radius: 12px;
          font-weight: 700;
          font-size: 0.9rem;
        }

        .actions {
          display: flex;
          gap: 10px;
          flex-wrap: wrap;
        }

        .btn {
          padding: 10px 20px;
          border-radius: 8px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s;
          text-decoration: none;
          display: inline-block;
          border: none;
          font-size: 0.95rem;
        }

        .btn-primary {
          background: #00FF94;
          color: #000;
        }

        .btn-secondary {
          background: #333;
          color: white;
        }

        .btn-danger {
          background: #ef4444;
          color: white;
        }

        .btn:hover {
          transform: translateY(-2px);
        }

        .stats-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 15px;
          margin: 30px 0;
        }

        .stat-card {
          background: #1a1a1a;
          border: 1px solid #333;
          border-radius: 12px;
          padding: 20px;
        }

        .stat-label {
          font-size: 0.8rem;
          color: #666;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          margin-bottom: 8px;
        }

        .stat-value {
          font-size: 2rem;
          font-weight: 900;
          color: #00FF94;
        }

        .stat-meta {
          font-size: 0.85rem;
          color: #888;
          margin-top: 5px;
        }

        .progress-section {
          background: #1a1a1a;
          border: 1px solid #333;
          border-radius: 12px;
          padding: 25px;
          margin: 20px 0;
        }

        .progress-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 15px;
        }

        .progress-title {
          font-size: 1rem;
          font-weight: 700;
          color: white;
        }

        .progress-value {
          font-size: 1.5rem;
          font-weight: 900;
          color: #00FF94;
        }

        .progress-bar {
          background: #0a0a0a;
          border-radius: 8px;
          height: 12px;
          overflow: hidden;
        }

        .progress-fill {
          height: 100%;
          transition: width 0.3s;
          border-radius: 8px;
        }

        .content-grid {
          display: grid;
          gap: 20px;
        }

        .card {
          background: #1a1a1a;
          border: 1px solid #333;
          border-radius: 12px;
          padding: 25px;
        }

        .card-title {
          font-size: 1.2rem;
          font-weight: 700;
          color: white;
          margin-bottom: 20px;
          padding-bottom: 15px;
          border-bottom: 2px solid #333;
        }

        .info-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 20px;
        }

        .info-item {
          background: #0a0a0a;
          padding: 15px;
          border-radius: 8px;
        }

        .info-label {
          font-size: 0.8rem;
          color: #666;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          margin-bottom: 5px;
        }

        .info-value {
          font-size: 1.1rem;
          font-weight: 600;
          color: #00FF94;
          word-break: break-all;
        }

        .link-value {
          color: #00FF94;
          text-decoration: none;
          font-size: 1rem;
        }

        .link-value:hover {
          text-decoration: underline;
        }

        .form-group {
          margin-bottom: 20px;
        }

        label {
          display: block;
          margin-bottom: 8px;
          color: #aaa;
          font-weight: 600;
          font-size: 0.9rem;
        }

        input, select, textarea {
          width: 100%;
          padding: 12px 15px;
          background: #0a0a0a;
          border: 1px solid #333;
          border-radius: 8px;
          color: white;
          font-size: 1rem;
          font-family: inherit;
        }

        input:focus, select:focus, textarea:focus {
          outline: none;
          border-color: #00FF94;
        }

        textarea {
          min-height: 100px;
          resize: vertical;
        }
      `}</style>

      <div className="project-detail">
        <div className="breadcrumb">
          <Link href="/crm/projects">← Back to Projects</Link>
        </div>

        <div className="header">
          <div>
            <h1>{project.name}</h1>
            {client && (
              <Link href={`/crm/clients/${client.id}`} className="client-link">
                🏢 {client.company || client.name}
              </Link>
            )}
          </div>
          <span 
            className="status-badge"
            style={{
              background: project.status === 'deployed' ? '#00FF94' :
                         project.status === 'completed' ? '#10b981' :
                         project.status === 'development' ? '#f59e0b' : '#3b82f6',
              color: ['deployed'].includes(project.status) ? '#000' : '#fff'
            }}
          >
            {project.status}
          </span>
        </div>

        <div className="actions">
          {!editing && (
            <>
              <button onClick={() => setEditing(true)} className="btn btn-primary">
                ✏️ Edit
              </button>
              {project.staging_url && (
                <a href={project.staging_url} target="_blank" className="btn btn-secondary">
                  🔗 View Staging
                </a>
              )}
              {project.production_url && (
                <a href={project.production_url} target="_blank" className="btn btn-secondary">
                  🚀 View Live
                </a>
              )}
              <button onClick={handleDelete} className="btn btn-danger">
                🗑️ Delete
              </button>
            </>
          )}
        </div>

        {/* Stats */}
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-label">Total Value</div>
            <div className="stat-value">€{project.total_value.toLocaleString()}</div>
          </div>
          <div className="stat-card">
            <div className="stat-label">Paid</div>
            <div className="stat-value">€{(project.paid_amount || 0).toLocaleString()}</div>
            <div className="stat-meta">{paymentProgress.toFixed(0)}% received</div>
          </div>
          <div className="stat-card">
            <div className="stat-label">Remaining</div>
            <div className="stat-value">€{remainingAmount.toLocaleString()}</div>
          </div>
          {project.deadline && (
            <div className="stat-card">
              <div className="stat-label">Deadline</div>
              <div className="stat-value" style={{fontSize: '1.3rem'}}>
                {new Date(project.deadline).toLocaleDateString('en-US', {
                  month: 'short',
                  day: 'numeric',
                  year: 'numeric'
                })}
              </div>
            </div>
          )}
        </div>

        {/* Progress Bar */}
        <div className="progress-section">
          <div className="progress-header">
            <div className="progress-title">Project Progress</div>
            <div className="progress-value">{project.progress}%</div>
          </div>
          <div className="progress-bar">
            <div 
              className="progress-fill"
              style={{
                width: `${project.progress}%`,
                background: getProgressColor(project.progress)
              }}
            />
          </div>
        </div>

        {editing ? (
          <form onSubmit={handleUpdate}>
            <div className="card">
              <h3 className="card-title">Edit Project</h3>
              <div className="info-grid">
                <div className="form-group">
                  <label>Project Name</label>
                  <input
                    type="text"
                    value={formData.name || ''}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Project Type</label>
                  <select
                    value={formData.project_type || ''}
                    onChange={(e) => setFormData({...formData, project_type: e.target.value})}
                  >
                    <option value="">Select...</option>
                    <option value="website">Website</option>
                    <option value="web-app">Web Application</option>
                    <option value="e-commerce">E-commerce</option>
                    <option value="redesign">Redesign</option>
                    <option value="maintenance">Maintenance</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Status</label>
                  <select
                    value={formData.status || 'planning'}
                    onChange={(e) => setFormData({...formData, status: e.target.value})}
                  >
                    <option value="planning">Planning</option>
                    <option value="design">Design</option>
                    <option value="development">Development</option>
                    <option value="testing">Testing</option>
                    <option value="deployed">Deployed</option>
                    <option value="completed">Completed</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Progress (%)</label>
                  <input
                    type="number"
                    value={formData.progress || 0}
                    onChange={(e) => setFormData({...formData, progress: e.target.value})}
                    min="0"
                    max="100"
                  />
                </div>
                <div className="form-group">
                  <label>Total Value (€)</label>
                  <input
                    type="number"
                    value={formData.total_value || ''}
                    onChange={(e) => setFormData({...formData, total_value: e.target.value})}
                    step="0.01"
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Paid Amount (€)</label>
                  <input
                    type="number"
                    value={formData.paid_amount || 0}
                    onChange={(e) => setFormData({...formData, paid_amount: e.target.value})}
                    step="0.01"
                  />
                </div>
                <div className="form-group">
                  <label>Start Date</label>
                  <input
                    type="date"
                    value={formData.start_date || ''}
                    onChange={(e) => setFormData({...formData, start_date: e.target.value})}
                  />
                </div>
                <div className="form-group">
                  <label>Deadline</label>
                  <input
                    type="date"
                    value={formData.deadline || ''}
                    onChange={(e) => setFormData({...formData, deadline: e.target.value})}
                  />
                </div>
                <div className="form-group">
                  <label>Repository URL</label>
                  <input
                    type="url"
                    value={formData.repo_url || ''}
                    onChange={(e) => setFormData({...formData, repo_url: e.target.value})}
                  />
                </div>
                <div className="form-group">
                  <label>Staging URL</label>
                  <input
                    type="url"
                    value={formData.staging_url || ''}
                    onChange={(e) => setFormData({...formData, staging_url: e.target.value})}
                  />
                </div>
                <div className="form-group">
                  <label>Production URL</label>
                  <input
                    type="url"
                    value={formData.production_url || ''}
                    onChange={(e) => setFormData({...formData, production_url: e.target.value})}
                  />
                </div>
              </div>
              <div className="form-group" style={{marginTop: '20px'}}>
                <label>Description</label>
                <textarea
                  value={formData.description || ''}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                />
              </div>
              <div className="form-group">
                <label>Notes</label>
                <textarea
                  value={formData.notes || ''}
                  onChange={(e) => setFormData({...formData, notes: e.target.value})}
                />
              </div>
              <div style={{display: 'flex', gap: '10px', marginTop: '30px'}}>
                <button type="submit" className="btn btn-primary" disabled={saving}>
                  {saving ? 'Saving...' : 'Save Changes'}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setEditing(false);
                    setFormData(project);
                  }}
                  className="btn btn-secondary"
                >
                  Cancel
                </button>
              </div>
            </div>
          </form>
        ) : (
          <div className="content-grid">
            {/* Project Details */}
            <div className="card">
              <h3 className="card-title">Project Details</h3>
              {project.description && (
                <p style={{color: '#aaa', lineHeight: '1.8', marginBottom: '20px'}}>
                  {project.description}
                </p>
              )}
              <div className="info-grid">
                {project.project_type && (
                  <div className="info-item">
                    <div className="info-label">Type</div>
                    <div className="info-value">{project.project_type}</div>
                  </div>
                )}
                {project.start_date && (
                  <div className="info-item">
                    <div className="info-label">Start Date</div>
                    <div className="info-value">
                      {new Date(project.start_date).toLocaleDateString()}
                    </div>
                  </div>
                )}
                <div className="info-item">
                  <div className="info-label">Created</div>
                  <div className="info-value">
                    {new Date(project.created_at).toLocaleDateString()}
                  </div>
                </div>
              </div>
            </div>

            {/* Technical Links */}
            {(project.repo_url || project.staging_url || project.production_url) && (
              <div className="card">
                <h3 className="card-title">Technical Links</h3>
                <div className="info-grid">
                  {project.repo_url && (
                    <div className="info-item">
                      <div className="info-label">Repository</div>
                      <a href={project.repo_url} target="_blank" className="link-value">
                        View on GitHub →
                      </a>
                    </div>
                  )}
                  {project.staging_url && (
                    <div className="info-item">
                      <div className="info-label">Staging</div>
                      <a href={project.staging_url} target="_blank" className="link-value">
                        Open Staging →
                      </a>
                    </div>
                  )}
                  {project.production_url && (
                    <div className="info-item">
                      <div className="info-label">Production</div>
                      <a href={project.production_url} target="_blank" className="link-value">
                        Open Live Site →
                      </a>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Notes */}
            {project.notes && (
              <div className="card">
                <h3 className="card-title">Internal Notes</h3>
                <p style={{color: '#aaa', lineHeight: '1.8', whiteSpace: 'pre-wrap'}}>
                  {project.notes}
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </>
  );
}