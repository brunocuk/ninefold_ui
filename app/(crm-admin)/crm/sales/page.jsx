// app/(crm-admin)/crm/sales/page.jsx
// Sales team overview: salespeople, their pipeline, and commission management.

'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import Link from 'next/link';
import {
  Handshake,
  Plus,
  Key,
  Copy,
  Check,
  Loader2,
  X,
  Wallet,
  CheckCircle,
  Users,
  FileText,
} from 'lucide-react';
import { useToast } from '@/components/Toast';
import { createSalesUser, generatePassword, updateSalesUserPassword, setSalesUserActive } from '@/lib/salesAuth';

const EMPTY_FORM = { name: '', email: '', phone: '', commission: 20 };

export default function SalesTeamPage() {
  const toast = useToast();

  const [salesUsers, setSalesUsers] = useState([]);
  const [leads, setLeads] = useState([]);
  const [quotes, setQuotes] = useState([]);
  const [commissions, setCommissions] = useState([]);
  const [loading, setLoading] = useState(true);

  const [showAdd, setShowAdd] = useState(false);
  const [form, setForm] = useState(EMPTY_FORM);
  const [creating, setCreating] = useState(false);
  const [newUserPassword, setNewUserPassword] = useState('');
  const [copiedPassword, setCopiedPassword] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const [usersRes, leadsRes, quotesRes, commRes] = await Promise.all([
        supabase.from('sales_users').select('*').order('created_at', { ascending: true }),
        supabase.from('leads').select('id, status, sales_user_id').not('sales_user_id', 'is', null),
        supabase
          .from('quotes')
          .select('id, reference, client_name, status, payment_received, pricing, sales_user_id, created_at')
          .not('sales_user_id', 'is', null)
          .order('created_at', { ascending: false }),
        supabase
          .from('sales_commissions')
          .select('*, quote:quotes(id, reference, client_name), sales_user:sales_users(id, name)')
          .order('created_at', { ascending: false }),
      ]);

      setSalesUsers(usersRes.data || []);
      setLeads(leadsRes.data || []);
      setQuotes(quotesRes.data || []);
      setCommissions(commRes.data || []);
    } catch (error) {
      console.error('Error loading sales data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    setCreating(true);

    const password = generatePassword();
    const { data, error } = await createSalesUser({
      email: form.email,
      password,
      name: form.name,
      phone: form.phone || null,
      commission_rate: Number(form.commission) / 100,
    });

    if (error) {
      toast.error(error.message);
    } else {
      setNewUserPassword(password);
      setSalesUsers([...salesUsers, data]);
      setForm(EMPTY_FORM);
      setShowAdd(false);
      toast.success('Prodavač kreiran!');
    }

    setCreating(false);
  };

  const handleResetPassword = async (userId) => {
    const newPassword = generatePassword();
    const { error } = await updateSalesUserPassword(userId, newPassword);

    if (error) {
      toast.error(error.message);
    } else {
      setNewUserPassword(newPassword);
      toast.success('Lozinka resetirana!');
    }
  };

  const handleToggleActive = async (user) => {
    const { error } = await setSalesUserActive(user.id, !user.active);
    if (error) {
      toast.error(error.message);
    } else {
      setSalesUsers(salesUsers.map((u) => (u.id === user.id ? { ...u, active: !u.active } : u)));
      toast.success(user.active ? 'Račun deaktiviran' : 'Račun aktiviran');
    }
  };

  const handleCommissionRateChange = async (user, percent) => {
    const rate = Math.min(Math.max(Number(percent), 0), 100) / 100;
    const { error } = await supabase
      .from('sales_users')
      .update({ commission_rate: rate, updated_at: new Date().toISOString() })
      .eq('id', user.id);

    if (error) {
      toast.error('Greška pri spremanju provizije');
    } else {
      setSalesUsers(salesUsers.map((u) => (u.id === user.id ? { ...u, commission_rate: rate } : u)));
      toast.success(`Provizija postavljena na ${Math.round(rate * 100)}%`);
    }
  };

  const handleMarkPaid = async (commission) => {
    const paid_at = new Date().toISOString();
    const { error } = await supabase
      .from('sales_commissions')
      .update({ status: 'paid', paid_at })
      .eq('id', commission.id);

    if (error) {
      toast.error('Greška pri označavanju isplate');
    } else {
      setCommissions(commissions.map((c) => (c.id === commission.id ? { ...c, status: 'paid', paid_at } : c)));
      toast.success('Provizija označena kao isplaćena');
    }
  };

  const handleMarkFinalPayment = async (quote) => {
    if (!confirm(`Označiti da je klijent platio ostatak za ${quote.reference}? Ovo dodaje proviziju prodavaču.`)) return;

    const user = salesUsers.find((u) => u.id === quote.sales_user_id);
    const rate = Number(user?.commission_rate ?? 0.2);
    const total = quote.pricing?.total || 0;
    const depositRate = quote.pricing?.depositRate ?? 0.5;
    const baseAmount = Math.round(total * (1 - depositRate) * 100) / 100;

    const { data, error } = await supabase
      .from('sales_commissions')
      .insert({
        sales_user_id: quote.sales_user_id,
        quote_id: quote.id,
        kind: 'final',
        base_amount: baseAmount,
        rate,
        amount: Math.round(baseAmount * rate * 100) / 100,
      })
      .select('*, quote:quotes(id, reference, client_name), sales_user:sales_users(id, name)')
      .single();

    if (error) {
      toast.error('Greška pri dodavanju provizije');
    } else {
      setCommissions([data, ...commissions]);
      toast.success('Konačna uplata zabilježena, provizija dodana');
    }
  };

  const copyPassword = () => {
    navigator.clipboard.writeText(newUserPassword);
    setCopiedPassword(true);
    setTimeout(() => setCopiedPassword(false), 2000);
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('hr-HR', { style: 'currency', currency: 'EUR' }).format(amount || 0);
  };

  const payableTotal = commissions.filter((c) => c.status === 'payable').reduce((s, c) => s + Number(c.amount), 0);
  const paidTotal = commissions.filter((c) => c.status === 'paid').reduce((s, c) => s + Number(c.amount), 0);

  // Accepted & deposit-paid quotes that don't yet have a 'final' commission row
  const awaitingFinal = quotes.filter(
    (q) => q.payment_received && !commissions.some((c) => c.quote_id === q.id && c.kind === 'final')
  );

  const statsForUser = (userId) => {
    const userLeads = leads.filter((l) => l.sales_user_id === userId);
    const userQuotes = quotes.filter((q) => q.sales_user_id === userId);
    const sent = userQuotes.filter((q) => q.status !== 'draft').length;
    const paid = userQuotes.filter((q) => q.payment_received).length;
    return {
      leads: userLeads.length,
      activeLeads: userLeads.filter((l) => !['won', 'lost'].includes(l.status)).length,
      quotes: userQuotes.length,
      sent,
      paid,
      revenue: userQuotes.filter((q) => q.payment_received).reduce((s, q) => s + (q.pricing?.total || 0), 0),
    };
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="text-2xl text-[#00FF94]">Loading sales team...</div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div>
          <h1 className="text-4xl font-black bg-gradient-to-r from-[#00FF94] to-[#00CC76] bg-clip-text text-transparent mb-2">
            Sales Team
          </h1>
          <p className="text-gray-400">Prodavači, njihov pipeline i provizije</p>
        </div>
        <button
          onClick={() => setShowAdd(!showAdd)}
          className="inline-flex items-center gap-2 px-6 py-3 bg-[#00FF94] text-black rounded-xl font-bold hover:shadow-lg hover:shadow-[#00FF94]/30 transition-all"
        >
          {showAdd ? <X size={18} /> : <Plus size={18} />}
          {showAdd ? 'Odustani' : 'Dodaj prodavača'}
        </button>
      </div>

      {/* New user password panel */}
      {newUserPassword && (
        <div className="bg-[#00FF94]/10 border border-[#00FF94]/30 rounded-2xl p-5 mb-6">
          <p className="text-sm text-gray-300 mb-2">
            Nova lozinka (prikazuje se samo sada, pošalji je prodavaču):
          </p>
          <div className="flex items-center gap-3">
            <code className="bg-[#0a0a0a] text-[#00FF94] px-4 py-2.5 rounded-lg font-mono text-lg">
              {newUserPassword}
            </code>
            <button
              onClick={copyPassword}
              className="inline-flex items-center gap-1.5 px-4 py-2.5 bg-[#2A2A2A] text-white rounded-lg text-sm font-semibold hover:bg-[#3A3A3A] transition-all"
            >
              {copiedPassword ? <Check size={15} className="text-[#00FF94]" /> : <Copy size={15} />}
              {copiedPassword ? 'Kopirano' : 'Kopiraj'}
            </button>
            <button
              onClick={() => setNewUserPassword('')}
              className="text-gray-500 hover:text-white transition-colors"
            >
              <X size={18} />
            </button>
          </div>
          <p className="text-xs text-gray-500 mt-2">Login: ninefold.eu/sales/login</p>
        </div>
      )}

      {/* Add form */}
      {showAdd && (
        <form onSubmit={handleCreate} className="bg-[#1a1a1a] border border-[#2A2A2A] rounded-2xl p-6 mb-6">
          <h2 className="text-lg font-bold mb-4">Novi prodavač</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <input
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              placeholder="Ime i prezime *"
              required
              className="bg-[#2A2A2A] text-white p-3 rounded-lg border border-[#3A3A3A] focus:border-[#00FF94] outline-none text-sm"
            />
            <input
              type="email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              placeholder="Email *"
              required
              className="bg-[#2A2A2A] text-white p-3 rounded-lg border border-[#3A3A3A] focus:border-[#00FF94] outline-none text-sm"
            />
            <input
              value={form.phone}
              onChange={(e) => setForm({ ...form, phone: e.target.value })}
              placeholder="Telefon"
              className="bg-[#2A2A2A] text-white p-3 rounded-lg border border-[#3A3A3A] focus:border-[#00FF94] outline-none text-sm"
            />
            <div className="flex items-center gap-3">
              <input
                type="number"
                min="0"
                max="100"
                value={form.commission}
                onChange={(e) => setForm({ ...form, commission: e.target.value })}
                className="w-24 bg-[#2A2A2A] text-white p-3 rounded-lg border border-[#3A3A3A] focus:border-[#00FF94] outline-none text-sm"
              />
              <span className="text-sm text-gray-400">% provizije</span>
            </div>
          </div>
          <button
            type="submit"
            disabled={creating}
            className="mt-4 inline-flex items-center gap-2 px-6 py-3 bg-[#00FF94] text-black rounded-xl font-bold hover:shadow-lg hover:shadow-[#00FF94]/30 transition-all disabled:opacity-50"
          >
            {creating ? <Loader2 size={18} className="animate-spin" /> : <Plus size={18} />}
            Kreiraj račun
          </button>
        </form>
      )}

      {/* Commission totals */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        <div className="bg-[#1a1a1a] border border-[#2A2A2A] rounded-2xl p-5">
          <div className="text-xs text-gray-500 uppercase tracking-wider mb-2">Provizije za isplatu</div>
          <div className="text-2xl font-black text-amber-400 flex items-center gap-2">
            <Wallet size={20} />
            {formatCurrency(payableTotal)}
          </div>
        </div>
        <div className="bg-[#1a1a1a] border border-[#2A2A2A] rounded-2xl p-5">
          <div className="text-xs text-gray-500 uppercase tracking-wider mb-2">Isplaćeno ukupno</div>
          <div className="text-2xl font-black text-[#00FF94] flex items-center gap-2">
            <CheckCircle size={20} />
            {formatCurrency(paidTotal)}
          </div>
        </div>
        <div className="bg-[#1a1a1a] border border-[#2A2A2A] rounded-2xl p-5">
          <div className="text-xs text-gray-500 uppercase tracking-wider mb-2">Naplaćeno preko prodaje</div>
          <div className="text-2xl font-black text-white flex items-center gap-2">
            <FileText size={20} />
            {formatCurrency(quotes.filter((q) => q.payment_received).reduce((s, q) => s + (q.pricing?.total || 0), 0))}
          </div>
        </div>
      </div>

      {/* Sales users */}
      <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
        <Handshake size={20} className="text-[#00FF94]" />
        Prodavači
      </h2>

      {salesUsers.length === 0 ? (
        <div className="bg-[#1a1a1a] border-2 border-dashed border-[#2A2A2A] rounded-2xl p-12 text-center mb-8">
          <p className="text-gray-400">Još nema prodavača. Dodaj prvog (Karlo čeka).</p>
        </div>
      ) : (
        <div className="grid gap-4 mb-8">
          {salesUsers.map((user) => {
            const stats = statsForUser(user.id);
            return (
              <div key={user.id} className="bg-[#1a1a1a] border border-[#2A2A2A] rounded-2xl p-6">
                <div className="flex flex-col lg:flex-row justify-between gap-5">
                  <div>
                    <div className="flex items-center gap-3 mb-1">
                      <h3 className="text-xl font-bold text-white">{user.name}</h3>
                      <span
                        className={`px-2.5 py-1 rounded-full text-xs font-semibold ${
                          user.active ? 'bg-[#00FF94]/20 text-[#00FF94]' : 'bg-red-500/20 text-red-400'
                        }`}
                      >
                        {user.active ? 'Aktivan' : 'Deaktiviran'}
                      </span>
                    </div>
                    <p className="text-sm text-gray-400">
                      {user.email}
                      {user.phone ? ` · ${user.phone}` : ''}
                      {user.last_login_at ? ` · zadnji login ${new Date(user.last_login_at).toLocaleDateString('hr-HR')}` : ' · nikad se nije logirao'}
                    </p>

                    <div className="flex items-center gap-2 mt-4">
                      <span className="text-xs text-gray-500 uppercase tracking-wider">Provizija:</span>
                      <input
                        type="number"
                        min="0"
                        max="100"
                        defaultValue={Math.round(Number(user.commission_rate) * 100)}
                        onBlur={(e) => {
                          const val = Number(e.target.value);
                          if (val !== Math.round(Number(user.commission_rate) * 100)) {
                            handleCommissionRateChange(user, val);
                          }
                        }}
                        className="w-16 bg-[#2A2A2A] text-white p-1.5 rounded-lg border border-[#3A3A3A] focus:border-[#00FF94] outline-none text-sm text-center"
                      />
                      <span className="text-sm text-gray-400">%</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 sm:grid-cols-6 gap-3 items-center">
                    {[
                      { label: 'Leadovi', value: stats.leads },
                      { label: 'Aktivni', value: stats.activeLeads },
                      { label: 'Ponude', value: stats.quotes },
                      { label: 'Poslane', value: stats.sent },
                      { label: 'Plaćene', value: stats.paid },
                      { label: 'Naplaćeno', value: formatCurrency(stats.revenue), green: true },
                    ].map((s) => (
                      <div key={s.label} className="bg-[#0a0a0a] rounded-lg p-3 text-center">
                        <div className="text-[10px] text-gray-500 uppercase tracking-wider mb-1">{s.label}</div>
                        <div className={`text-sm font-black ${s.green ? 'text-[#00FF94]' : 'text-white'}`}>{s.value}</div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex flex-wrap gap-2 mt-5 pt-4 border-t border-[#2A2A2A]">
                  <button
                    onClick={() => handleResetPassword(user.id)}
                    className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#2A2A2A] text-white rounded-lg text-xs font-semibold hover:bg-[#3A3A3A] transition-all"
                  >
                    <Key size={13} />
                    Resetiraj lozinku
                  </button>
                  <button
                    onClick={() => handleToggleActive(user)}
                    className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-semibold transition-all ${
                      user.active
                        ? 'bg-red-500/10 text-red-400 hover:bg-red-500/20'
                        : 'bg-[#00FF94]/10 text-[#00FF94] hover:bg-[#00FF94]/20'
                    }`}
                  >
                    {user.active ? 'Deaktiviraj' : 'Aktiviraj'}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Awaiting final payment */}
      {awaitingFinal.length > 0 && (
        <>
          <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
            <FileText size={20} className="text-amber-400" />
            Čeka konačnu uplatu
          </h2>
          <div className="grid gap-3 mb-8">
            {awaitingFinal.map((q) => {
              const user = salesUsers.find((u) => u.id === q.sales_user_id);
              const depositRate = q.pricing?.depositRate ?? 0.5;
              const remaining = (q.pricing?.total || 0) * (1 - depositRate);
              return (
                <div key={q.id} className="bg-[#1a1a1a] border border-[#2A2A2A] rounded-2xl p-5 flex flex-col sm:flex-row justify-between sm:items-center gap-4">
                  <div>
                    <Link href={`/crm/quotes/${q.id}`} className="font-bold text-white hover:text-[#00FF94] transition-colors">
                      {q.reference} · {q.client_name}
                    </Link>
                    <p className="text-sm text-gray-400">
                      Predujam plaćen · ostatak {formatCurrency(remaining)} · prodavač: {user?.name || '?'}
                    </p>
                  </div>
                  <button
                    onClick={() => handleMarkFinalPayment(q)}
                    className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#00FF94] text-black rounded-xl text-sm font-bold hover:shadow-lg hover:shadow-[#00FF94]/30 transition-all"
                  >
                    <CheckCircle size={15} />
                    Označi konačnu uplatu
                  </button>
                </div>
              );
            })}
          </div>
        </>
      )}

      {/* Commissions */}
      <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
        <Wallet size={20} className="text-[#00FF94]" />
        Provizije
      </h2>

      {commissions.length === 0 ? (
        <div className="bg-[#1a1a1a] border-2 border-dashed border-[#2A2A2A] rounded-2xl p-12 text-center">
          <p className="text-gray-400">Još nema provizija. Pojave se automatski kad klijent plati predujam.</p>
        </div>
      ) : (
        <div className="grid gap-3">
          {commissions.map((c) => (
            <div key={c.id} className="bg-[#1a1a1a] border border-[#2A2A2A] rounded-2xl p-5 flex flex-col sm:flex-row justify-between sm:items-center gap-4">
              <div>
                <p className="font-bold text-white">
                  {c.sales_user?.name || '?'} · {c.quote?.reference || 'Ponuda'} · {c.quote?.client_name || ''}
                </p>
                <p className="text-sm text-gray-400">
                  {c.kind === 'deposit' ? 'Predujam' : 'Ostatak'} · {formatCurrency(c.base_amount)} × {Math.round(Number(c.rate) * 100)}%
                  {' · '}{new Date(c.created_at).toLocaleDateString('hr-HR')}
                </p>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-lg font-black text-white">{formatCurrency(c.amount)}</span>
                {c.status === 'paid' ? (
                  <span className="px-3 py-1.5 rounded-full text-xs font-semibold bg-[#2A2A2A] text-gray-300">
                    Isplaćeno {c.paid_at ? new Date(c.paid_at).toLocaleDateString('hr-HR') : ''}
                  </span>
                ) : (
                  <button
                    onClick={() => handleMarkPaid(c)}
                    className="inline-flex items-center gap-1.5 px-4 py-2 bg-amber-500/10 text-amber-400 rounded-lg text-xs font-semibold hover:bg-amber-500/20 transition-all"
                  >
                    <CheckCircle size={13} />
                    Označi isplaćeno
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
