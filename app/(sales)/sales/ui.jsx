'use client';

// Shared UI bits for the sales module: Mono tokens, status maps, small components.

import { BG, PANEL, FG, BODY, MUTED, LINE, SIGNAL, MONO, SANS } from '@/components/mono/kit';

export { BG, PANEL, FG, BODY, MUTED, LINE, SIGNAL, MONO, SANS };

export const LEAD_STATUSES = {
  new: { label: 'Novo', color: '#60A5FA' },
  contacted: { label: 'Kontaktiran', color: '#C084FC' },
  qualified: { label: 'Kvalificiran', color: SIGNAL },
  'proposal-sent': { label: 'Ponuda poslana', color: '#FBBF24' },
  won: { label: 'Dobiven', color: '#34D399' },
  lost: { label: 'Izgubljen', color: '#F87171' },
};

export const QUOTE_STATUSES = {
  draft: { label: 'Nacrt', color: MUTED },
  sent: { label: 'Poslano', color: '#60A5FA' },
  viewed: { label: 'Pogledano', color: '#C084FC' },
  accepted: { label: 'Prihvaćeno', color: SIGNAL },
  rejected: { label: 'Odbijeno', color: '#F87171' },
};

export function Panel({ children, className = '', style = {} }) {
  return (
    <div
      className={`rounded-2xl ${className}`}
      style={{ background: PANEL, border: `1px solid ${LINE}`, ...style }}
    >
      {children}
    </div>
  );
}

export function SectionLabel({ children }) {
  return (
    <p
      className="flex items-center gap-2 text-[11px] uppercase"
      style={{ fontFamily: MONO, letterSpacing: '0.14em', color: MUTED }}
    >
      <span className="inline-block h-1.5 w-1.5 rounded-full" style={{ background: SIGNAL }} />
      {children}
    </p>
  );
}

export function StatusPill({ map, value }) {
  const s = map[value] || { label: value, color: MUTED };
  return (
    <span
      className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-medium"
      style={{ background: 'rgba(255,255,255,0.06)', border: `1px solid ${LINE}`, color: s.color }}
    >
      <span className="inline-block h-1.5 w-1.5 rounded-full" style={{ background: s.color }} />
      {s.label}
    </span>
  );
}

export const primaryBtn = {
  background: FG,
  color: BG,
  borderRadius: 999,
  fontWeight: 500,
};

export const ghostBtn = {
  background: 'rgba(255,255,255,0.06)',
  color: FG,
  border: `1px solid ${LINE}`,
  borderRadius: 999,
  fontWeight: 500,
};

export const inputStyle = {
  background: 'rgba(255,255,255,0.04)',
  border: `1px solid ${LINE}`,
  color: FG,
};

export function timeAgo(dateStr) {
  if (!dateStr) return null;
  const diffMs = Date.now() - new Date(dateStr).getTime();
  const days = Math.floor(diffMs / (24 * 60 * 60 * 1000));
  if (days <= 0) return 'danas';
  if (days === 1) return 'jučer';
  return `prije ${days} dana`;
}

export function formatDate(dateStr) {
  if (!dateStr) return '';
  return new Date(dateStr).toLocaleDateString('hr-HR');
}
