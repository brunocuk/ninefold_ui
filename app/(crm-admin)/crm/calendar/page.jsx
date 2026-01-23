// app/(crm-admin)/crm/calendar/page.jsx
// Calendar & Scheduling System

'use client';

import { useEffect, useState, useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import { Calendar as BigCalendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { 
  Plus,
  X,
  Save,
  Calendar as CalendarIcon,
  Clock,
  User,
  Building2,
  FileText,
  AlertCircle,
  CheckCircle,
  Edit,
  Trash2
} from 'lucide-react';
import { useToast } from '@/components/Toast';

const localizer = momentLocalizer(moment);

export default function CalendarPage() {
  const toast = useToast();
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    start: new Date(),
    end: new Date(new Date().getTime() + 60 * 60 * 1000), // 1 hour later
    event_type: 'meeting',
    related_to: null,
    related_type: null,
    priority: 'medium',
    reminder_minutes: 60
  });
  
  const [clients, setClients] = useState([]);
  const [leads, setLeads] = useState([]);
  const [projects, setProjects] = useState([]);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      // Load calendar events
      const { data: eventsData, error: eventsError } = await supabase
        .from('calendar_events')
        .select('*')
        .order('start', { ascending: true });

      if (eventsError) throw eventsError;

      // Transform events for react-big-calendar
      const transformedEvents = eventsData?.map(event => ({
        ...event,
        start: new Date(event.start),
        end: new Date(event.end)
      })) || [];

      setEvents(transformedEvents);

      // Load clients, leads, and projects for linking
      const [clientsRes, leadsRes, projectsRes] = await Promise.all([
        supabase.from('clients').select('id, name, company').order('company'),
        supabase.from('leads').select('id, name, company').order('company'),
        supabase.from('projects').select('id, name').order('name')
      ]);

      setClients(clientsRes.data || []);
      setLeads(leadsRes.data || []);
      setProjects(projectsRes.data || []);
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectSlot = ({ start, end }) => {
    setSelectedEvent(null);
    setFormData({
      title: '',
      description: '',
      start,
      end,
      event_type: 'meeting',
      related_to: null,
      related_type: null,
      priority: 'medium',
      reminder_minutes: 60
    });
    setShowModal(true);
  };

  const handleSelectEvent = (event) => {
    setSelectedEvent(event);
    setFormData({
      title: event.title,
      description: event.description || '',
      start: event.start,
      end: event.end,
      event_type: event.event_type,
      related_to: event.related_to,
      related_type: event.related_type,
      priority: event.priority || 'medium',
      reminder_minutes: event.reminder_minutes || 60
    });
    setShowModal(true);
  };

  const handleSaveEvent = async () => {
    try {
      const eventData = {
        ...formData,
        start: formData.start.toISOString(),
        end: formData.end.toISOString()
      };

      if (selectedEvent) {
        // Update existing event
        const { error } = await supabase
          .from('calendar_events')
          .update(eventData)
          .eq('id', selectedEvent.id);

        if (error) throw error;
      } else {
        // Create new event
        const { error } = await supabase
          .from('calendar_events')
          .insert([eventData]);

        if (error) throw error;
      }

      await loadData();
      setShowModal(false);
      setSelectedEvent(null);
    } catch (error) {
      console.error('Error saving event:', error);
      toast.error('Error saving event. Please try again.');
    }
  };

  const handleDeleteEvent = async () => {
    if (!selectedEvent || !confirm('Are you sure you want to delete this event?')) {
      return;
    }

    try {
      const { error } = await supabase
        .from('calendar_events')
        .delete()
        .eq('id', selectedEvent.id);

      if (error) throw error;

      await loadData();
      setShowModal(false);
      setSelectedEvent(null);
    } catch (error) {
      console.error('Error deleting event:', error);
      toast.error('Error deleting event. Please try again.');
    }
  };

  const eventStyleGetter = (event) => {
    const colors = {
      meeting: { bg: '#3b82f6', border: '#2563eb' },
      deadline: { bg: '#ef4444', border: '#dc2626' },
      follow_up: { bg: '#f59e0b', border: '#d97706' },
      call: { bg: '#8b5cf6', border: '#7c3aed' },
      task: { bg: '#06b6d4', border: '#0891b2' },
      other: { bg: '#6b7280', border: '#4b5563' }
    };

    const color = colors[event.event_type] || colors.other;

    return {
      style: {
        backgroundColor: color.bg,
        borderLeft: `4px solid ${color.border}`,
        borderRadius: '6px',
        opacity: 0.9,
        color: 'white',
        border: 'none',
        display: 'block'
      }
    };
  };

  const eventTypes = [
    { value: 'meeting', label: 'Meeting', icon: User },
    { value: 'deadline', label: 'Deadline', icon: AlertCircle },
    { value: 'follow_up', label: 'Follow-up', icon: Clock },
    { value: 'call', label: 'Call', icon: CalendarIcon },
    { value: 'task', label: 'Task', icon: CheckCircle },
    { value: 'other', label: 'Other', icon: FileText }
  ];

  const priorities = [
    { value: 'low', label: 'Low', color: '#6b7280' },
    { value: 'medium', label: 'Medium', color: '#f59e0b' },
    { value: 'high', label: 'High', color: '#ef4444' }
  ];

  return (
    <div className="animate-fadeIn">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div>
          <h1 className="text-4xl font-black bg-gradient-to-r from-[#00FF94] to-[#00CC76] bg-clip-text text-transparent mb-2">
            Calendar
          </h1>
          <p className="text-gray-400">Manage deadlines and schedule follow-ups</p>
        </div>
        <button
          onClick={() => {
            setSelectedEvent(null);
            setFormData({
              title: '',
              description: '',
              start: new Date(),
              end: new Date(new Date().getTime() + 60 * 60 * 1000),
              event_type: 'meeting',
              related_to: null,
              related_type: null,
              priority: 'medium',
              reminder_minutes: 60
            });
            setShowModal(true);
          }}
          className="inline-flex items-center gap-2 px-6 py-3 bg-[#00FF94] text-black rounded-xl font-bold hover:shadow-lg hover:shadow-[#00FF94]/30 hover:-translate-y-0.5 transition-all"
        >
          <Plus size={20} />
          New Event
        </button>
      </div>

      {/* Calendar */}
      <div className="bg-[#1a1a1a] border border-[#2A2A2A] rounded-2xl p-6">
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="text-2xl text-[#00FF94]">Loading calendar...</div>
          </div>
        ) : (
          <div className="calendar-container" style={{ height: '700px' }}>
            <BigCalendar
              localizer={localizer}
              events={events}
              startAccessor="start"
              endAccessor="end"
              style={{ height: '100%' }}
              onSelectSlot={handleSelectSlot}
              onSelectEvent={handleSelectEvent}
              selectable
              eventPropGetter={eventStyleGetter}
              views={['month', 'week', 'day', 'agenda']}
              defaultView="month"
            />
          </div>
        )}
      </div>

      {/* Event Modal */}
      {showModal && (
        <div 
          className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 animate-fadeIn p-4"
          onClick={() => setShowModal(false)}
        >
          <div 
            className="bg-[#1a1a1a] border border-[#2A2A2A] rounded-2xl p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-2xl font-bold">
                {selectedEvent ? 'Edit Event' : 'New Event'}
              </h3>
              <button
                onClick={() => setShowModal(false)}
                className="text-gray-400 hover:text-white transition-colors"
              >
                <X size={24} />
              </button>
            </div>

            <div className="space-y-5">
              {/* Title */}
              <div>
                <label className="block text-sm font-semibold text-gray-400 mb-2">
                  Title *
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({...formData, title: e.target.value})}
                  className="w-full px-4 py-3 bg-[#0a0a0a] border border-[#2A2A2A] rounded-xl text-white focus:border-[#00FF94] focus:outline-none transition-colors"
                  placeholder="Event title"
                  required
                />
              </div>

              {/* Event Type */}
              <div>
                <label className="block text-sm font-semibold text-gray-400 mb-2">
                  Type
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {eventTypes.map((type) => {
                    const Icon = type.icon;
                    return (
                      <button
                        key={type.value}
                        onClick={() => setFormData({...formData, event_type: type.value})}
                        className={`flex items-center gap-2 px-3 py-2 rounded-lg border-2 font-semibold transition-all ${
                          formData.event_type === type.value
                            ? 'bg-[#00FF94] text-black border-[#00FF94]'
                            : 'bg-[#0a0a0a] text-gray-400 border-[#2A2A2A] hover:border-[#00FF94]'
                        }`}
                      >
                        <Icon size={16} />
                        <span className="text-sm">{type.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Date & Time */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-400 mb-2">
                    Start
                  </label>
                  <input
                    type="datetime-local"
                    value={moment(formData.start).format('YYYY-MM-DDTHH:mm')}
                    onChange={(e) => setFormData({...formData, start: new Date(e.target.value)})}
                    className="w-full px-4 py-3 bg-[#0a0a0a] border border-[#2A2A2A] rounded-xl text-white focus:border-[#00FF94] focus:outline-none transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-400 mb-2">
                    End
                  </label>
                  <input
                    type="datetime-local"
                    value={moment(formData.end).format('YYYY-MM-DDTHH:mm')}
                    onChange={(e) => setFormData({...formData, end: new Date(e.target.value)})}
                    className="w-full px-4 py-3 bg-[#0a0a0a] border border-[#2A2A2A] rounded-xl text-white focus:border-[#00FF94] focus:outline-none transition-colors"
                  />
                </div>
              </div>

              {/* Priority */}
              <div>
                <label className="block text-sm font-semibold text-gray-400 mb-2">
                  Priority
                </label>
                <div className="flex gap-2">
                  {priorities.map((priority) => (
                    <button
                      key={priority.value}
                      onClick={() => setFormData({...formData, priority: priority.value})}
                      className={`flex-1 px-4 py-2 rounded-lg border-2 font-semibold transition-all ${
                        formData.priority === priority.value
                          ? 'bg-[#00FF94] text-black border-[#00FF94]'
                          : 'bg-[#0a0a0a] text-gray-400 border-[#2A2A2A] hover:border-[#00FF94]'
                      }`}
                    >
                      {priority.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Related To */}
              <div>
                <label className="block text-sm font-semibold text-gray-400 mb-2">
                  Related To
                </label>
                <div className="grid grid-cols-2 gap-4">
                  <select
                    value={formData.related_type || ''}
                    onChange={(e) => setFormData({...formData, related_type: e.target.value, related_to: null})}
                    className="px-4 py-3 bg-[#0a0a0a] border border-[#2A2A2A] rounded-xl text-white focus:border-[#00FF94] focus:outline-none transition-colors"
                  >
                    <option value="">Select type...</option>
                    <option value="client">Client</option>
                    <option value="lead">Lead</option>
                    <option value="project">Project</option>
                  </select>
                  {formData.related_type && (
                    <select
                      value={formData.related_to || ''}
                      onChange={(e) => setFormData({...formData, related_to: e.target.value})}
                      className="px-4 py-3 bg-[#0a0a0a] border border-[#2A2A2A] rounded-xl text-white focus:border-[#00FF94] focus:outline-none transition-colors"
                    >
                      <option value="">Select {formData.related_type}...</option>
                      {formData.related_type === 'client' && clients.map(c => (
                        <option key={c.id} value={c.id}>{c.company || c.name}</option>
                      ))}
                      {formData.related_type === 'lead' && leads.map(l => (
                        <option key={l.id} value={l.id}>{l.company || l.name}</option>
                      ))}
                      {formData.related_type === 'project' && projects.map(p => (
                        <option key={p.id} value={p.id}>{p.name}</option>
                      ))}
                    </select>
                  )}
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-semibold text-gray-400 mb-2">
                  Description
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  rows={4}
                  className="w-full px-4 py-3 bg-[#0a0a0a] border border-[#2A2A2A] rounded-xl text-white focus:border-[#00FF94] focus:outline-none transition-colors resize-none"
                  placeholder="Event description..."
                />
              </div>

              {/* Reminder */}
              <div>
                <label className="block text-sm font-semibold text-gray-400 mb-2">
                  Reminder (minutes before)
                </label>
                <select
                  value={formData.reminder_minutes}
                  onChange={(e) => setFormData({...formData, reminder_minutes: parseInt(e.target.value)})}
                  className="w-full px-4 py-3 bg-[#0a0a0a] border border-[#2A2A2A] rounded-xl text-white focus:border-[#00FF94] focus:outline-none transition-colors"
                >
                  <option value={0}>No reminder</option>
                  <option value={15}>15 minutes</option>
                  <option value={30}>30 minutes</option>
                  <option value={60}>1 hour</option>
                  <option value={120}>2 hours</option>
                  <option value={1440}>1 day</option>
                  <option value={2880}>2 days</option>
                </select>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-3 mt-8 pt-6 border-t border-[#2A2A2A]">
              {selectedEvent && (
                <button
                  onClick={handleDeleteEvent}
                  className="inline-flex items-center gap-2 px-6 py-3 bg-red-500 text-white rounded-xl font-bold hover:bg-red-600 transition-all"
                >
                  <Trash2 size={18} />
                  Delete
                </button>
              )}
              <div className="flex-1" />
              <button
                onClick={() => setShowModal(false)}
                className="px-6 py-3 bg-[#2A2A2A] text-white rounded-xl font-bold hover:bg-[#3A3A3A] transition-all"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveEvent}
                disabled={!formData.title}
                className="inline-flex items-center gap-2 px-6 py-3 bg-[#00FF94] text-black rounded-xl font-bold hover:shadow-lg hover:shadow-[#00FF94]/30 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Save size={18} />
                {selectedEvent ? 'Update' : 'Create'}
              </button>
            </div>
          </div>
        </div>
      )}

      <style jsx global>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeIn {
          animation: fadeIn 0.5s ease-out;
        }

        /* Calendar Styling */
        .rbc-calendar {
          font-family: inherit;
          color: white;
        }
        .rbc-header {
          padding: 12px 6px;
          font-weight: 700;
          font-size: 0.9rem;
          color: #00FF94;
          border-bottom: 2px solid #2A2A2A !important;
        }
        .rbc-month-view, .rbc-time-view, .rbc-agenda-view {
          border: 1px solid #2A2A2A !important;
          border-radius: 12px;
          overflow: hidden;
        }
        .rbc-month-row, .rbc-day-bg, .rbc-time-content {
          border-color: #2A2A2A !important;
        }
        .rbc-day-bg {
          background: #0a0a0a;
        }
        .rbc-off-range-bg {
          background: #050505;
        }
        .rbc-today {
          background-color: rgba(0, 255, 148, 0.1) !important;
        }
        .rbc-toolbar {
          padding: 16px 20px;
          margin-bottom: 20px;
          background: #0a0a0a;
          border-radius: 12px;
          border: 1px solid #2A2A2A;
        }
        .rbc-toolbar button {
          color: white;
          background: #1a1a1a;
          border: 1px solid #2A2A2A;
          padding: 8px 16px;
          border-radius: 8px;
          font-weight: 600;
          transition: all 0.2s;
        }
        .rbc-toolbar button:hover {
          background: #2A2A2A;
          border-color: #00FF94;
        }
        .rbc-toolbar button.rbc-active {
          background: #00FF94;
          color: black;
          border-color: #00FF94;
        }
        .rbc-event {
          padding: 4px 8px;
          font-size: 0.85rem;
          font-weight: 600;
        }
        .rbc-event:focus {
          outline: 2px solid #00FF94;
        }
        .rbc-date-cell {
          padding: 6px;
          text-align: right;
          color: #888;
        }
        .rbc-date-cell.rbc-now {
          font-weight: 700;
          color: #00FF94;
        }
        .rbc-slot-selection {
          background-color: rgba(0, 255, 148, 0.2);
        }
      `}</style>
    </div>
  );
}