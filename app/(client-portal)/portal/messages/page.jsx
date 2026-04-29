'use client';

import { useEffect, useState, useRef } from 'react';
import { getPortalUser } from '@/lib/portalAuth';
import { supabase } from '@/lib/supabase';
import {
  MessageSquare,
  Send,
  Paperclip,
  Loader2,
  CheckCheck,
} from 'lucide-react';

export default function MessagesPage() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [sending, setSending] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    loadMessages();
  }, []);

  useEffect(() => {
    // Scroll to bottom when messages change
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const loadMessages = async () => {
    const currentUser = await getPortalUser();
    setUser(currentUser);

    if (!currentUser?.client_id) {
      setLoading(false);
      return;
    }

    const { data, error } = await supabase
      .from('portal_messages')
      .select('*')
      .eq('client_id', currentUser.client_id)
      .order('created_at', { ascending: true });

    if (error) {
      console.error('Error loading messages:', error);
    } else {
      setMessages(data || []);

      // Mark unread messages as read
      const unreadIds = (data || [])
        .filter((m) => m.sender_type === 'admin' && !m.read_at)
        .map((m) => m.id);

      if (unreadIds.length > 0) {
        await supabase
          .from('portal_messages')
          .update({ read_at: new Date().toISOString() })
          .in('id', unreadIds);
      }
    }

    setLoading(false);
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || sending) return;

    setSending(true);

    const { data, error } = await supabase
      .from('portal_messages')
      .insert({
        client_id: user.client_id,
        sender_type: 'client',
        sender_id: user.id,
        sender_name: user.name,
        message: newMessage.trim(),
      })
      .select()
      .single();

    if (error) {
      console.error('Error sending message:', error);
      alert('Greška pri slanju poruke. Pokušajte ponovo.');
    } else {
      setMessages([...messages, data]);
      setNewMessage('');
    }

    setSending(false);
  };

  const formatTime = (dateStr) => {
    const date = new Date(dateStr);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (date.toDateString() === today.toDateString()) {
      return date.toLocaleTimeString('hr-HR', { hour: '2-digit', minute: '2-digit' });
    } else if (date.toDateString() === yesterday.toDateString()) {
      return `Jučer ${date.toLocaleTimeString('hr-HR', { hour: '2-digit', minute: '2-digit' })}`;
    }

    return date.toLocaleDateString('hr-HR', {
      day: 'numeric',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const groupMessagesByDate = () => {
    const groups = [];
    let currentDate = null;

    messages.forEach((message) => {
      const messageDate = new Date(message.created_at).toDateString();
      if (messageDate !== currentDate) {
        currentDate = messageDate;
        groups.push({ type: 'date', date: message.created_at });
      }
      groups.push({ type: 'message', data: message });
    });

    return groups;
  };

  const formatDateLabel = (dateStr) => {
    const date = new Date(dateStr);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (date.toDateString() === today.toDateString()) {
      return 'Danas';
    } else if (date.toDateString() === yesterday.toDateString()) {
      return 'Jučer';
    }

    return date.toLocaleDateString('hr-HR', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
    });
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', padding: '60px 0' }}>
        <div style={{ color: '#6B7280' }}>Učitavanje...</div>
      </div>
    );
  }

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      height: 'calc(100vh - 200px)',
      minHeight: '500px',
    }}>
      {/* Header */}
      <div style={{ marginBottom: '20px' }}>
        <h1 style={{
          fontSize: '1.75rem',
          fontWeight: '800',
          color: '#111827',
          marginBottom: '4px',
        }}>
          Poruke
        </h1>
        <p style={{ color: '#6B7280', fontSize: '0.95rem' }}>
          Komunicirajte direktno s Ninefold timom
        </p>
      </div>

      {/* Messages Container */}
      <div style={{
        flex: 1,
        background: '#fff',
        borderRadius: '16px',
        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.04)',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
      }}>
        {/* Messages List */}
        <div style={{
          flex: 1,
          overflowY: 'auto',
          padding: '24px',
          display: 'flex',
          flexDirection: 'column',
          gap: '16px',
        }}>
          {messages.length === 0 ? (
            <div style={{
              flex: 1,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '40px 20px',
              textAlign: 'center',
            }}>
              <div style={{
                width: '80px',
                height: '80px',
                borderRadius: '50%',
                background: 'linear-gradient(135deg, rgba(0, 255, 148, 0.15) 0%, rgba(0, 204, 118, 0.15) 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '20px',
              }}>
                <MessageSquare size={36} style={{ color: '#00cc76' }} />
              </div>
              <h3 style={{
                fontSize: '1.1rem',
                fontWeight: '700',
                color: '#111827',
                marginBottom: '8px',
              }}>
                Započnite razgovor
              </h3>
              <p style={{
                color: '#6B7280',
                fontSize: '0.9rem',
                maxWidth: '300px',
              }}>
                Pošaljite nam poruku i odgovorit ćemo vam što prije
              </p>
            </div>
          ) : (
            <>
              {groupMessagesByDate().map((item, index) => {
                if (item.type === 'date') {
                  return (
                    <div
                      key={`date-${index}`}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '12px',
                        padding: '8px 0',
                      }}
                    >
                      <div style={{ flex: 1, height: '1px', background: '#E5E7EB' }} />
                      <span style={{
                        fontSize: '0.75rem',
                        fontWeight: '600',
                        color: '#9CA3AF',
                        textTransform: 'capitalize',
                      }}>
                        {formatDateLabel(item.date)}
                      </span>
                      <div style={{ flex: 1, height: '1px', background: '#E5E7EB' }} />
                    </div>
                  );
                }

                const message = item.data;
                const isClient = message.sender_type === 'client';

                return (
                  <div
                    key={message.id}
                    style={{
                      display: 'flex',
                      justifyContent: isClient ? 'flex-end' : 'flex-start',
                    }}
                  >
                    <div style={{
                      maxWidth: '70%',
                      minWidth: '120px',
                    }}>
                      {!isClient && (
                        <div style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '8px',
                          marginBottom: '6px',
                        }}>
                          <div style={{
                            width: '28px',
                            height: '28px',
                            borderRadius: '50%',
                            background: 'linear-gradient(135deg, #00ff94 0%, #00cc76 100%)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: '0.75rem',
                            fontWeight: '700',
                            color: '#000',
                          }}>
                            {message.sender_name?.charAt(0)?.toUpperCase() || 'N'}
                          </div>
                          <span style={{
                            fontSize: '0.8rem',
                            fontWeight: '600',
                            color: '#374151',
                          }}>
                            {message.sender_name}
                          </span>
                        </div>
                      )}

                      <div style={{
                        padding: '14px 18px',
                        borderRadius: isClient ? '18px 18px 4px 18px' : '18px 18px 18px 4px',
                        background: isClient
                          ? 'linear-gradient(135deg, #00ff94 0%, #00cc76 100%)'
                          : '#F3F4F6',
                        color: isClient ? '#000' : '#111827',
                      }}>
                        <p style={{
                          fontSize: '0.95rem',
                          lineHeight: '1.5',
                          whiteSpace: 'pre-wrap',
                          wordBreak: 'break-word',
                        }}>
                          {message.message}
                        </p>
                      </div>

                      <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: isClient ? 'flex-end' : 'flex-start',
                        gap: '6px',
                        marginTop: '6px',
                        paddingLeft: isClient ? 0 : '8px',
                        paddingRight: isClient ? '8px' : 0,
                      }}>
                        <span style={{
                          fontSize: '0.7rem',
                          color: '#9CA3AF',
                        }}>
                          {formatTime(message.created_at)}
                        </span>
                        {isClient && (
                          <CheckCheck size={14} style={{
                            color: message.read_at ? '#00cc76' : '#9CA3AF',
                          }} />
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
              <div ref={messagesEndRef} />
            </>
          )}
        </div>

        {/* Input */}
        <form
          onSubmit={handleSendMessage}
          style={{
            padding: '16px 24px',
            borderTop: '1px solid #E5E7EB',
            background: '#F9FAFB',
          }}
        >
          <div style={{
            display: 'flex',
            alignItems: 'flex-end',
            gap: '12px',
          }}>
            <div style={{
              flex: 1,
              position: 'relative',
            }}>
              <textarea
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="Napišite poruku..."
                rows={1}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleSendMessage(e);
                  }
                }}
                style={{
                  width: '100%',
                  padding: '14px 16px',
                  border: '2px solid #E5E7EB',
                  borderRadius: '12px',
                  fontSize: '0.95rem',
                  outline: 'none',
                  resize: 'none',
                  minHeight: '50px',
                  maxHeight: '150px',
                  lineHeight: '1.4',
                  transition: 'border-color 0.2s ease',
                  background: '#fff',
                }}
                onFocus={(e) => e.target.style.borderColor = '#00ff94'}
                onBlur={(e) => e.target.style.borderColor = '#E5E7EB'}
              />
            </div>

            <button
              type="submit"
              disabled={!newMessage.trim() || sending}
              style={{
                width: '50px',
                height: '50px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: newMessage.trim() && !sending
                  ? 'linear-gradient(135deg, #00ff94 0%, #00cc76 100%)'
                  : '#E5E7EB',
                color: newMessage.trim() && !sending ? '#000' : '#9CA3AF',
                border: 'none',
                borderRadius: '12px',
                cursor: newMessage.trim() && !sending ? 'pointer' : 'not-allowed',
                transition: 'all 0.2s ease',
                flexShrink: 0,
              }}
            >
              {sending ? (
                <Loader2 size={20} className="animate-spin" />
              ) : (
                <Send size={20} />
              )}
            </button>
          </div>

          <p style={{
            fontSize: '0.75rem',
            color: '#9CA3AF',
            marginTop: '8px',
          }}>
            Pritisnite Enter za slanje ili Shift+Enter za novi red
          </p>
        </form>
      </div>

      <style jsx>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .animate-spin {
          animation: spin 1s linear infinite;
        }
      `}</style>
    </div>
  );
}
