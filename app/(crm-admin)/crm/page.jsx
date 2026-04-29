// app/(crm-admin)/crm/page.jsx
// CRM Dashboard with Tailwind CSS

'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { getUser } from '@/lib/auth';
import Link from 'next/link';
import {
  UserPlus,
  Sparkles,
  CheckCircle,
  Sun,
  Moon,
  Sunrise,
  Calendar,
  Plus,
  Check,
  MessageSquare,
  Image,
  CalendarClock,
  ChevronRight
} from 'lucide-react';

export default function CRMDashboard() {
  const [loading, setLoading] = useState(true);
  const [userName, setUserName] = useState('');
  const [currentUser, setCurrentUser] = useState('bruno'); // 'bruno' or 'petar'
  const [currentTime, setCurrentTime] = useState(new Date());
  const [hasData, setHasData] = useState(true); // For empty state check

  // Dashboard sections
  const [todos, setTodos] = useState([]);
  const [changeRequests, setChangeRequests] = useState([]);
  const [contentItems, setContentItems] = useState([]);
  const [deadlines, setDeadlines] = useState([]);
  const [newTodoTitle, setNewTodoTitle] = useState('');
  const [showTodoInput, setShowTodoInput] = useState(false);

  useEffect(() => {
    loadUserName();
    loadDashboardData();
    checkHasData();

    // Update time every minute
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000);

    // Listen for settings changes (e.g., name update from settings page)
    const handleSettingsChanged = (e) => {
      if (e.detail?.profile?.name) {
        setUserName(e.detail.profile.name);
        // Also update currentUser based on name
        const name = e.detail.profile.name.toLowerCase();
        if (name.includes('petar')) {
          setCurrentUser('petar');
        } else {
          setCurrentUser('bruno');
        }
        loadDashboardData();
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
            // Determine current user (bruno or petar) for todos
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
      console.error('Error loading settings:', error);
    }

    // Fallback to user metadata or email
    const user = await getUser();
    if (user) {
      const name = user.user_metadata?.name || user.email?.split('@')[0] || 'there';
      setUserName(name);
      // Determine current user
      if (name.toLowerCase().includes('petar')) {
        setCurrentUser('petar');
      }
    }
  };

  const loadDashboardData = async () => {
    try {
      // Load todos for current user
      const { data: todosData } = await supabase
        .from('crm_todos')
        .select('*')
        .eq('assigned_to', currentUser)
        .neq('status', 'completed')
        .order('priority', { ascending: false })
        .order('due_date', { ascending: true })
        .limit(5);
      setTodos(todosData || []);

      // Load recent change requests from client portal
      const { data: requestsData } = await supabase
        .from('website_change_requests')
        .select('*, clients(name, company)')
        .in('status', ['submitted', 'in_review'])
        .order('created_at', { ascending: false })
        .limit(5);
      setChangeRequests(requestsData || []);

      // Load content items needing action
      const { data: contentData } = await supabase
        .from('content_items')
        .select('*, clients(name, company)')
        .in('status', ['pending', 'revision_requested'])
        .order('scheduled_date', { ascending: true })
        .limit(5);
      setContentItems(contentData || []);

      // Load upcoming deadlines (projects, milestones, recurring)
      const today = new Date().toISOString().split('T')[0];
      const nextWeek = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];

      const { data: milestonesData } = await supabase
        .from('project_milestones')
        .select('*, projects(name)')
        .gte('due_date', today)
        .lte('due_date', nextWeek)
        .eq('status', 'pending')
        .order('due_date', { ascending: true })
        .limit(5);

      setDeadlines(milestonesData || []);
    } catch (error) {
      console.error('Error loading dashboard data:', error);
    }
  };

  // Reload dashboard data when currentUser changes
  useEffect(() => {
    if (currentUser) {
      loadDashboardData();
    }
  }, [currentUser]);

  const handleAddTodo = async (e) => {
    e.preventDefault();
    if (!newTodoTitle.trim()) return;

    try {
      const { error } = await supabase.from('crm_todos').insert({
        title: newTodoTitle.trim(),
        assigned_to: currentUser,
        created_by: currentUser,
        priority: 'normal',
        status: 'pending'
      });

      if (!error) {
        setNewTodoTitle('');
        setShowTodoInput(false);
        loadDashboardData();
      }
    } catch (error) {
      console.error('Error adding todo:', error);
    }
  };

  const handleCompleteTodo = async (todoId) => {
    try {
      await supabase
        .from('crm_todos')
        .update({ status: 'completed', completed_at: new Date().toISOString() })
        .eq('id', todoId);
      loadDashboardData();
    } catch (error) {
      console.error('Error completing todo:', error);
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'urgent': return 'text-red-400 bg-red-400/10';
      case 'high': return 'text-orange-400 bg-orange-400/10';
      case 'normal': return 'text-blue-400 bg-blue-400/10';
      case 'low': return 'text-gray-400 bg-gray-400/10';
      default: return 'text-gray-400 bg-gray-400/10';
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'submitted': return { color: 'bg-yellow-400/10 text-yellow-400', label: 'New' };
      case 'in_review': return { color: 'bg-blue-400/10 text-blue-400', label: 'In Review' };
      case 'revision_requested': return { color: 'bg-orange-400/10 text-orange-400', label: 'Revision' };
      case 'pending': return { color: 'bg-purple-400/10 text-purple-400', label: 'Pending' };
      default: return { color: 'bg-gray-400/10 text-gray-400', label: status };
    }
  };

  const formatRelativeDate = (dateStr) => {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    if (date.toDateString() === today.toDateString()) return 'Today';
    if (date.toDateString() === tomorrow.toDateString()) return 'Tomorrow';

    return date.toLocaleDateString('hr-HR', { day: 'numeric', month: 'short' });
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

  const checkHasData = async () => {
    try {
      const [leadsRes, clientsRes] = await Promise.all([
        supabase.from('leads').select('id').limit(1),
        supabase.from('clients').select('id').limit(1)
      ]);
      const hasLeads = (leadsRes.data || []).length > 0;
      const hasClients = (clientsRes.data || []).length > 0;
      setHasData(hasLeads || hasClients);
      setLoading(false);
    } catch (error) {
      console.error('Error checking data:', error);
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

      {!hasData ? (
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
          {/* Dashboard Sections Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

            {/* Personal Todos */}
            <div className="bg-[#1a1a1a] border border-[#2A2A2A] rounded-2xl p-6">
              <div className="flex items-center justify-between mb-5">
                <h2 className="text-lg font-bold flex items-center gap-2">
                  <CheckCircle size={20} className="text-[#00FF94]" />
                  My Todos
                </h2>
                <button
                  onClick={() => setShowTodoInput(!showTodoInput)}
                  className="w-8 h-8 rounded-lg bg-[#00FF94]/10 flex items-center justify-center text-[#00FF94] hover:bg-[#00FF94]/20 transition-colors"
                >
                  <Plus size={18} />
                </button>
              </div>

              {showTodoInput && (
                <form onSubmit={handleAddTodo} className="mb-4">
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={newTodoTitle}
                      onChange={(e) => setNewTodoTitle(e.target.value)}
                      placeholder="What needs to be done?"
                      className="flex-1 px-4 py-2.5 bg-[#0f0f0f] border border-[#2A2A2A] rounded-xl text-white placeholder-gray-500 focus:border-[#00FF94] focus:outline-none"
                      autoFocus
                    />
                    <button
                      type="submit"
                      className="px-4 py-2.5 bg-[#00FF94] text-black font-semibold rounded-xl hover:bg-[#00CC76] transition-colors"
                    >
                      Add
                    </button>
                  </div>
                </form>
              )}

              <div className="space-y-2">
                {todos.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    <CheckCircle size={32} className="mx-auto mb-2 opacity-50" />
                    <p>All caught up!</p>
                  </div>
                ) : (
                  todos.map((todo) => (
                    <div
                      key={todo.id}
                      className="group flex items-center gap-3 p-3 rounded-xl hover:bg-[#0f0f0f] transition-colors"
                    >
                      <button
                        onClick={() => handleCompleteTodo(todo.id)}
                        className="w-5 h-5 rounded-full border-2 border-gray-600 flex items-center justify-center hover:border-[#00FF94] hover:bg-[#00FF94]/10 transition-colors"
                      >
                        <Check size={12} className="text-transparent group-hover:text-[#00FF94]" />
                      </button>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">{todo.title}</p>
                        {todo.due_date && (
                          <p className="text-xs text-gray-500">{formatRelativeDate(todo.due_date)}</p>
                        )}
                      </div>
                      {todo.priority !== 'normal' && (
                        <span className={`px-2 py-0.5 rounded text-xs font-medium capitalize ${getPriorityColor(todo.priority)}`}>
                          {todo.priority}
                        </span>
                      )}
                    </div>
                  ))
                )}
              </div>

              {todos.length > 0 && (
                <Link
                  href="/crm/todos"
                  className="mt-4 flex items-center justify-center gap-1 text-sm text-gray-500 hover:text-[#00FF94] transition-colors"
                >
                  View all <ChevronRight size={14} />
                </Link>
              )}
            </div>

            {/* Client Portal Requests */}
            <div className="bg-[#1a1a1a] border border-[#2A2A2A] rounded-2xl p-6">
              <div className="flex items-center justify-between mb-5">
                <h2 className="text-lg font-bold flex items-center gap-2">
                  <MessageSquare size={20} className="text-purple-400" />
                  Client Requests
                </h2>
                <Link
                  href="/crm/change-requests"
                  className="text-sm text-gray-500 hover:text-[#00FF94] transition-colors"
                >
                  View all
                </Link>
              </div>

              <div className="space-y-2">
                {changeRequests.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    <MessageSquare size={32} className="mx-auto mb-2 opacity-50" />
                    <p>No pending requests</p>
                  </div>
                ) : (
                  changeRequests.map((request) => {
                    const badge = getStatusBadge(request.status);
                    return (
                      <Link
                        key={request.id}
                        href={`/crm/change-requests/${request.id}`}
                        className="block p-3 rounded-xl hover:bg-[#0f0f0f] transition-colors"
                      >
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium truncate">{request.title}</p>
                            <p className="text-xs text-gray-500 truncate">
                              {request.clients?.company || request.clients?.name || 'Unknown client'}
                            </p>
                          </div>
                          <span className={`px-2 py-0.5 rounded text-xs font-medium ${badge.color}`}>
                            {badge.label}
                          </span>
                        </div>
                      </Link>
                    );
                  })
                )}
              </div>
            </div>

            {/* Content Needing Action */}
            <div className="bg-[#1a1a1a] border border-[#2A2A2A] rounded-2xl p-6">
              <div className="flex items-center justify-between mb-5">
                <h2 className="text-lg font-bold flex items-center gap-2">
                  <Image size={20} className="text-blue-400" />
                  Content to Review
                </h2>
                <Link
                  href="/crm/content"
                  className="text-sm text-gray-500 hover:text-[#00FF94] transition-colors"
                >
                  View all
                </Link>
              </div>

              <div className="space-y-2">
                {contentItems.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    <Image size={32} className="mx-auto mb-2 opacity-50" />
                    <p>No content pending</p>
                  </div>
                ) : (
                  contentItems.map((item) => {
                    const badge = getStatusBadge(item.status);
                    return (
                      <Link
                        key={item.id}
                        href={`/crm/content/${item.id}`}
                        className="block p-3 rounded-xl hover:bg-[#0f0f0f] transition-colors"
                      >
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium truncate capitalize">
                              {item.platform} {item.content_type}
                            </p>
                            <p className="text-xs text-gray-500">
                              {item.clients?.company || item.clients?.name} • {formatRelativeDate(item.scheduled_date)}
                            </p>
                          </div>
                          <span className={`px-2 py-0.5 rounded text-xs font-medium ${badge.color}`}>
                            {badge.label}
                          </span>
                        </div>
                      </Link>
                    );
                  })
                )}
              </div>
            </div>

            {/* Upcoming Deadlines */}
            <div className="bg-[#1a1a1a] border border-[#2A2A2A] rounded-2xl p-6">
              <div className="flex items-center justify-between mb-5">
                <h2 className="text-lg font-bold flex items-center gap-2">
                  <CalendarClock size={20} className="text-orange-400" />
                  Upcoming Deadlines
                </h2>
                <Link
                  href="/crm/calendar"
                  className="text-sm text-gray-500 hover:text-[#00FF94] transition-colors"
                >
                  Calendar
                </Link>
              </div>

              <div className="space-y-2">
                {deadlines.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    <CalendarClock size={32} className="mx-auto mb-2 opacity-50" />
                    <p>No deadlines this week</p>
                  </div>
                ) : (
                  deadlines.map((deadline) => (
                    <div
                      key={deadline.id}
                      className="p-3 rounded-xl hover:bg-[#0f0f0f] transition-colors"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium truncate">{deadline.title}</p>
                          <p className="text-xs text-gray-500 truncate">
                            {deadline.projects?.name || 'Project'}
                          </p>
                        </div>
                        <span className="text-xs font-medium text-orange-400">
                          {formatRelativeDate(deadline.due_date)}
                        </span>
                      </div>
                    </div>
                  ))
                )}
              </div>
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