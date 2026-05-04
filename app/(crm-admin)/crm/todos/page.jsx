// app/(crm-admin)/crm/todos/page.jsx
// Full Todos Management Page

'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import Link from 'next/link';
import {
  CheckCircle,
  Circle,
  Plus,
  Clock,
  Calendar,
  Trash2,
  Edit3,
  X,
  AlertCircle,
  ArrowUp,
  ArrowDown,
  Minus,
  Filter,
  Users,
  FolderKanban,
  FileText,
  UserPlus
} from 'lucide-react';

export default function TodosPage() {
  const [todos, setTodos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState('bruno');
  const [statusFilter, setStatusFilter] = useState('active'); // 'active', 'all', 'completed'
  const [priorityFilter, setPriorityFilter] = useState('all');

  // New todo form
  const [showNewTodo, setShowNewTodo] = useState(false);
  const [newTodo, setNewTodo] = useState({
    title: '',
    description: '',
    due_date: '',
    priority: 'normal'
  });

  // Edit modal
  const [editingTodo, setEditingTodo] = useState(null);
  const [editForm, setEditForm] = useState({});

  useEffect(() => {
    loadCurrentUser();
  }, []);

  useEffect(() => {
    if (currentUser) {
      loadTodos();
    }
  }, [currentUser, statusFilter, priorityFilter]);

  const loadCurrentUser = async () => {
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
            const name = settings.profile.name.toLowerCase();
            if (name.includes('petar')) {
              setCurrentUser('petar');
            } else {
              setCurrentUser('bruno');
            }
            return;
          }
        }
      }
    } catch (error) {
      console.error('Error loading user:', error);
    }
  };

  const loadTodos = async () => {
    setLoading(true);
    try {
      let query = supabase
        .from('crm_todos')
        .select('*')
        .eq('assigned_to', currentUser)
        .order('priority', { ascending: false })
        .order('due_date', { ascending: true, nullsFirst: false })
        .order('created_at', { ascending: false });

      if (statusFilter === 'active') {
        query = query.neq('status', 'completed');
      } else if (statusFilter === 'completed') {
        query = query.eq('status', 'completed');
      }

      if (priorityFilter !== 'all') {
        query = query.eq('priority', priorityFilter);
      }

      const { data, error } = await query;
      if (error) throw error;
      setTodos(data || []);
    } catch (error) {
      console.error('Error loading todos:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddTodo = async (e) => {
    e.preventDefault();
    if (!newTodo.title.trim()) return;

    try {
      const { error } = await supabase.from('crm_todos').insert({
        title: newTodo.title.trim(),
        description: newTodo.description.trim() || null,
        due_date: newTodo.due_date || null,
        priority: newTodo.priority,
        assigned_to: currentUser,
        created_by: currentUser,
        status: 'pending'
      });

      if (!error) {
        setNewTodo({ title: '', description: '', due_date: '', priority: 'normal' });
        setShowNewTodo(false);
        loadTodos();
      }
    } catch (error) {
      console.error('Error adding todo:', error);
    }
  };

  const handleToggleStatus = async (todo) => {
    const newStatus = todo.status === 'completed' ? 'pending' : 'completed';
    try {
      await supabase
        .from('crm_todos')
        .update({
          status: newStatus,
          completed_at: newStatus === 'completed' ? new Date().toISOString() : null
        })
        .eq('id', todo.id);
      loadTodos();
    } catch (error) {
      console.error('Error updating todo:', error);
    }
  };

  const handleDelete = async (todoId) => {
    if (!confirm('Delete this todo?')) return;
    try {
      await supabase.from('crm_todos').delete().eq('id', todoId);
      loadTodos();
    } catch (error) {
      console.error('Error deleting todo:', error);
    }
  };

  const handleEditSave = async (e) => {
    e.preventDefault();
    try {
      await supabase
        .from('crm_todos')
        .update({
          title: editForm.title,
          description: editForm.description || null,
          due_date: editForm.due_date || null,
          priority: editForm.priority,
          status: editForm.status
        })
        .eq('id', editingTodo.id);
      setEditingTodo(null);
      loadTodos();
    } catch (error) {
      console.error('Error updating todo:', error);
    }
  };

  const openEditModal = (todo) => {
    setEditingTodo(todo);
    setEditForm({
      title: todo.title,
      description: todo.description || '',
      due_date: todo.due_date || '',
      priority: todo.priority,
      status: todo.status
    });
  };

  const getPriorityIcon = (priority) => {
    switch (priority) {
      case 'urgent': return <AlertCircle size={14} className="text-red-400" />;
      case 'high': return <ArrowUp size={14} className="text-orange-400" />;
      case 'normal': return <Minus size={14} className="text-blue-400" />;
      case 'low': return <ArrowDown size={14} className="text-gray-400" />;
      default: return null;
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'urgent': return 'text-red-400 bg-red-400/10 border-red-400/20';
      case 'high': return 'text-orange-400 bg-orange-400/10 border-orange-400/20';
      case 'normal': return 'text-blue-400 bg-blue-400/10 border-blue-400/20';
      case 'low': return 'text-gray-400 bg-gray-400/10 border-gray-400/20';
      default: return 'text-gray-400 bg-gray-400/10 border-gray-400/20';
    }
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return null;
    const date = new Date(dateStr);
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    if (date.toDateString() === today.toDateString()) return 'Today';
    if (date.toDateString() === tomorrow.toDateString()) return 'Tomorrow';

    const isPast = date < today && date.toDateString() !== today.toDateString();
    const formatted = date.toLocaleDateString('hr-HR', { day: 'numeric', month: 'short' });
    return { text: formatted, isPast };
  };

  const getRelatedLink = (todo) => {
    if (!todo.related_to_type || !todo.related_to_id) return null;
    const routes = {
      client: `/crm/clients/${todo.related_to_id}`,
      project: `/crm/projects/${todo.related_to_id}`,
      lead: `/crm/leads/${todo.related_to_id}`,
      quote: `/crm/quotes/${todo.related_to_id}`
    };
    const icons = {
      client: Users,
      project: FolderKanban,
      lead: UserPlus,
      quote: FileText
    };
    const Icon = icons[todo.related_to_type];
    return { href: routes[todo.related_to_type], Icon, type: todo.related_to_type };
  };

  const activeTodosCount = todos.filter(t => t.status !== 'completed').length;

  return (
    <div className="animate-fadeIn">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div>
          <h1 className="text-4xl font-black bg-gradient-to-r from-[#00FF94] to-[#00CC76] bg-clip-text text-transparent mb-2">
            Todos
          </h1>
          <p className="text-gray-400">
            {statusFilter === 'completed'
              ? `${todos.length} completed tasks`
              : `${activeTodosCount} active tasks`}
          </p>
        </div>
        <button
          onClick={() => setShowNewTodo(true)}
          className="inline-flex items-center gap-2 px-6 py-3 bg-[#00FF94] text-black rounded-xl font-bold hover:shadow-lg hover:shadow-[#00FF94]/30 hover:-translate-y-0.5 transition-all"
        >
          <Plus size={20} />
          Add Todo
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3 mb-6">
        <div className="flex gap-2">
          {[
            { value: 'active', label: 'Active' },
            { value: 'all', label: 'All' },
            { value: 'completed', label: 'Completed' }
          ].map((btn) => (
            <button
              key={btn.value}
              onClick={() => setStatusFilter(btn.value)}
              className={`px-4 py-2 rounded-lg border-2 font-semibold transition-all ${
                statusFilter === btn.value
                  ? 'bg-[#00FF94] text-black border-[#00FF94]'
                  : 'bg-[#1a1a1a] text-gray-400 border-[#2A2A2A] hover:border-[#00FF94] hover:text-[#00FF94]'
              }`}
            >
              {btn.label}
            </button>
          ))}
        </div>

        <div className="h-8 w-px bg-[#2A2A2A] hidden sm:block" />

        <div className="flex gap-2">
          <button
            onClick={() => setPriorityFilter('all')}
            className={`inline-flex items-center gap-1.5 px-3 py-2 rounded-lg border-2 font-semibold transition-all ${
              priorityFilter === 'all'
                ? 'bg-[#2A2A2A] text-white border-[#3A3A3A]'
                : 'bg-[#1a1a1a] text-gray-500 border-[#2A2A2A] hover:text-white'
            }`}
          >
            <Filter size={14} />
            All
          </button>
          {['urgent', 'high', 'normal', 'low'].map((p) => (
            <button
              key={p}
              onClick={() => setPriorityFilter(p)}
              className={`inline-flex items-center gap-1.5 px-3 py-2 rounded-lg border-2 font-semibold capitalize transition-all ${
                priorityFilter === p
                  ? getPriorityColor(p) + ' border-current'
                  : 'bg-[#1a1a1a] text-gray-500 border-[#2A2A2A] hover:text-white'
              }`}
            >
              {getPriorityIcon(p)}
              {p}
            </button>
          ))}
        </div>
      </div>

      {/* New Todo Form */}
      {showNewTodo && (
        <div className="bg-[#1a1a1a] border border-[#2A2A2A] rounded-2xl p-6 mb-6">
          <form onSubmit={handleAddTodo}>
            <div className="flex items-start gap-4 mb-4">
              <div className="flex-1">
                <input
                  type="text"
                  value={newTodo.title}
                  onChange={(e) => setNewTodo({ ...newTodo, title: e.target.value })}
                  placeholder="What needs to be done?"
                  className="w-full px-4 py-3 bg-[#0f0f0f] border border-[#2A2A2A] rounded-xl text-white placeholder-gray-500 focus:border-[#00FF94] focus:outline-none text-lg"
                  autoFocus
                />
              </div>
              <button
                type="button"
                onClick={() => setShowNewTodo(false)}
                className="p-3 text-gray-500 hover:text-white transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            <textarea
              value={newTodo.description}
              onChange={(e) => setNewTodo({ ...newTodo, description: e.target.value })}
              placeholder="Add description (optional)"
              rows={2}
              className="w-full px-4 py-3 bg-[#0f0f0f] border border-[#2A2A2A] rounded-xl text-white placeholder-gray-500 focus:border-[#00FF94] focus:outline-none mb-4 resize-none"
            />

            <div className="flex flex-wrap gap-4 items-center">
              <div className="flex items-center gap-2">
                <Calendar size={16} className="text-gray-500" />
                <input
                  type="date"
                  value={newTodo.due_date}
                  onChange={(e) => setNewTodo({ ...newTodo, due_date: e.target.value })}
                  className="px-3 py-2 bg-[#0f0f0f] border border-[#2A2A2A] rounded-lg text-white focus:border-[#00FF94] focus:outline-none"
                />
              </div>

              <select
                value={newTodo.priority}
                onChange={(e) => setNewTodo({ ...newTodo, priority: e.target.value })}
                className="px-3 py-2 bg-[#0f0f0f] border border-[#2A2A2A] rounded-lg text-white focus:border-[#00FF94] focus:outline-none"
              >
                <option value="low">Low Priority</option>
                <option value="normal">Normal Priority</option>
                <option value="high">High Priority</option>
                <option value="urgent">Urgent</option>
              </select>

              <div className="flex-1" />

              <button
                type="submit"
                className="px-6 py-2.5 bg-[#00FF94] text-black font-bold rounded-xl hover:bg-[#00CC76] transition-colors"
              >
                Add Todo
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Todos List */}
      {loading ? (
        <div className="flex items-center justify-center py-20">
          <div className="text-2xl text-[#00FF94]">Loading todos...</div>
        </div>
      ) : todos.length === 0 ? (
        <div className="bg-[#1a1a1a] border-2 border-dashed border-[#2A2A2A] rounded-2xl p-20 text-center">
          <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-[#00FF94]/10 flex items-center justify-center">
            <CheckCircle size={40} className="text-[#00FF94]" />
          </div>
          <h2 className="text-2xl font-bold mb-3">
            {statusFilter === 'completed' ? 'No completed todos' : 'All caught up!'}
          </h2>
          <p className="text-gray-400 text-lg mb-8">
            {statusFilter === 'completed'
              ? 'Complete some tasks to see them here.'
              : 'Add a todo to get started.'}
          </p>
          {statusFilter !== 'completed' && (
            <button
              onClick={() => setShowNewTodo(true)}
              className="inline-flex items-center gap-2 px-7 py-3.5 bg-[#00FF94] text-black rounded-xl font-bold hover:shadow-lg hover:shadow-[#00FF94]/30 hover:-translate-y-0.5 transition-all"
            >
              <Plus size={20} />
              Add First Todo
            </button>
          )}
        </div>
      ) : (
        <div className="space-y-3">
          {todos.map((todo) => {
            const dateInfo = formatDate(todo.due_date);
            const relatedLink = getRelatedLink(todo);

            return (
              <div
                key={todo.id}
                className={`group bg-[#1a1a1a] border border-[#2A2A2A] rounded-xl p-4 hover:border-[#3A3A3A] transition-all ${
                  todo.status === 'completed' ? 'opacity-60' : ''
                }`}
              >
                <div className="flex items-start gap-4">
                  {/* Checkbox */}
                  <button
                    onClick={() => handleToggleStatus(todo)}
                    className={`mt-0.5 w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all flex-shrink-0 ${
                      todo.status === 'completed'
                        ? 'bg-[#00FF94] border-[#00FF94]'
                        : 'border-gray-600 hover:border-[#00FF94] hover:bg-[#00FF94]/10'
                    }`}
                  >
                    {todo.status === 'completed' && (
                      <CheckCircle size={14} className="text-black" />
                    )}
                  </button>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1 min-w-0">
                        <h3 className={`font-semibold text-white mb-1 ${
                          todo.status === 'completed' ? 'line-through text-gray-500' : ''
                        }`}>
                          {todo.title}
                        </h3>
                        {todo.description && (
                          <p className="text-sm text-gray-500 line-clamp-2">{todo.description}</p>
                        )}
                      </div>

                      {/* Priority Badge */}
                      <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-medium border ${getPriorityColor(todo.priority)}`}>
                        {getPriorityIcon(todo.priority)}
                        <span className="capitalize">{todo.priority}</span>
                      </span>
                    </div>

                    {/* Meta Row */}
                    <div className="flex items-center gap-4 mt-3">
                      {dateInfo && (
                        <span className={`inline-flex items-center gap-1.5 text-xs ${
                          typeof dateInfo === 'object' && dateInfo.isPast ? 'text-red-400' : 'text-gray-500'
                        }`}>
                          <Clock size={12} />
                          {typeof dateInfo === 'string' ? dateInfo : dateInfo.text}
                        </span>
                      )}

                      {relatedLink && (
                        <Link
                          href={relatedLink.href}
                          className="inline-flex items-center gap-1.5 text-xs text-gray-500 hover:text-[#00FF94] transition-colors"
                        >
                          <relatedLink.Icon size={12} />
                          <span className="capitalize">{relatedLink.type}</span>
                        </Link>
                      )}

                      {todo.status === 'in_progress' && (
                        <span className="inline-flex items-center gap-1.5 text-xs text-yellow-400">
                          <Circle size={8} className="fill-current" />
                          In Progress
                        </span>
                      )}

                      <div className="flex-1" />

                      {/* Actions */}
                      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={() => openEditModal(todo)}
                          className="p-2 text-gray-500 hover:text-white hover:bg-[#2A2A2A] rounded-lg transition-colors"
                          title="Edit"
                        >
                          <Edit3 size={14} />
                        </button>
                        <button
                          onClick={() => handleDelete(todo.id)}
                          className="p-2 text-gray-500 hover:text-red-400 hover:bg-red-400/10 rounded-lg transition-colors"
                          title="Delete"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Edit Modal */}
      {editingTodo && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-[#1a1a1a] border border-[#2A2A2A] rounded-2xl p-6 w-full max-w-lg">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold">Edit Todo</h2>
              <button
                onClick={() => setEditingTodo(null)}
                className="p-2 text-gray-500 hover:text-white transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleEditSave}>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">Title</label>
                  <input
                    type="text"
                    value={editForm.title}
                    onChange={(e) => setEditForm({ ...editForm, title: e.target.value })}
                    className="w-full px-4 py-3 bg-[#0f0f0f] border border-[#2A2A2A] rounded-xl text-white focus:border-[#00FF94] focus:outline-none"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">Description</label>
                  <textarea
                    value={editForm.description}
                    onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
                    rows={3}
                    className="w-full px-4 py-3 bg-[#0f0f0f] border border-[#2A2A2A] rounded-xl text-white focus:border-[#00FF94] focus:outline-none resize-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2">Due Date</label>
                    <input
                      type="date"
                      value={editForm.due_date}
                      onChange={(e) => setEditForm({ ...editForm, due_date: e.target.value })}
                      className="w-full px-4 py-3 bg-[#0f0f0f] border border-[#2A2A2A] rounded-xl text-white focus:border-[#00FF94] focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2">Priority</label>
                    <select
                      value={editForm.priority}
                      onChange={(e) => setEditForm({ ...editForm, priority: e.target.value })}
                      className="w-full px-4 py-3 bg-[#0f0f0f] border border-[#2A2A2A] rounded-xl text-white focus:border-[#00FF94] focus:outline-none"
                    >
                      <option value="low">Low</option>
                      <option value="normal">Normal</option>
                      <option value="high">High</option>
                      <option value="urgent">Urgent</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">Status</label>
                  <select
                    value={editForm.status}
                    onChange={(e) => setEditForm({ ...editForm, status: e.target.value })}
                    className="w-full px-4 py-3 bg-[#0f0f0f] border border-[#2A2A2A] rounded-xl text-white focus:border-[#00FF94] focus:outline-none"
                  >
                    <option value="pending">Pending</option>
                    <option value="in_progress">In Progress</option>
                    <option value="completed">Completed</option>
                  </select>
                </div>
              </div>

              <div className="flex gap-3 mt-6">
                <button
                  type="button"
                  onClick={() => setEditingTodo(null)}
                  className="flex-1 px-4 py-3 bg-[#2A2A2A] text-white rounded-xl font-semibold hover:bg-[#3A3A3A] transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-3 bg-[#00FF94] text-black rounded-xl font-bold hover:bg-[#00CC76] transition-colors"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
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
        .line-clamp-2 {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
      `}</style>
    </div>
  );
}
