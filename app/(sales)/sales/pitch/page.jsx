'use client';

// Sales pitch one-pager: packages + add-ons, printable (Karlo saves as PDF via print).

import { SALES_PACKAGES, SALES_ADDONS, formatEur } from '@/lib/salesPackages';
import {
  Panel, SectionLabel,
  FG, BODY, MUTED, LINE, SIGNAL, MONO, ghostBtn,
} from '../ui';
import { Printer, Check } from 'lucide-react';

export default function SalesPitchPage() {
  const addons = Object.values(SALES_ADDONS);

  return (
    <div className="pitch-root flex flex-col gap-8">
      <style jsx global>{`
        @media print {
          body { background: #fff !important; }
          .pitch-root { color: #111 !important; }
          .pitch-no-print { display: none !important; }
          .pitch-panel {
            background: #fff !important;
            border: 1px solid #ddd !important;
            break-inside: avoid;
          }
          .pitch-root h1, .pitch-root h2, .pitch-root p, .pitch-root li,
          .pitch-root td, .pitch-root th, .pitch-root span {
            color: #111 !important;
          }
          .pitch-root .pitch-muted { color: #555 !important; }
          .pitch-root .pitch-signal { color: #00A05D !important; }
        }
      `}</style>

      <div className="pitch-no-print flex flex-wrap items-end justify-between gap-4">
        <div>
          <SectionLabel>Prezentacija</SectionLabel>
          <h1 className="mt-3 text-3xl font-medium" style={{ letterSpacing: '-0.02em' }}>
            Ponuda paketa
          </h1>
          <p className="mt-1" style={{ color: MUTED }}>
            Pokaži klijentu na sastanku ili isprintaj / spremi kao PDF.
          </p>
        </div>
        <button
          onClick={() => window.print()}
          className="flex items-center gap-2 px-6 py-3 text-sm transition-colors hover:bg-white/10"
          style={ghostBtn}
        >
          <Printer size={15} />
          Ispiši / Spremi PDF
        </button>
      </div>

      {/* Print header */}
      <div className="hidden print:block">
        <p className="text-2xl font-semibold">Ninefold</p>
        <p className="pitch-muted mt-1 text-sm">Izrada web stranica · ninefold.eu · hello@ninefold.eu</p>
      </div>

      {/* Intro */}
      <Panel className="pitch-panel p-6">
        <h2 className="text-xl font-medium" style={{ color: FG }}>
          Web stranica koja radi za tebe.
        </h2>
        <p className="pitch-muted mt-2 max-w-2xl" style={{ color: BODY }}>
          Radimo web stranice koje izgledaju profesionalno i dovode klijente. Tri paketa, jasne
          cijene, bez skrivenih troškova. Plaća se 50% predujma, ostatak kad je stranica gotova.
        </p>
      </Panel>

      {/* Packages */}
      <div className="grid gap-4 lg:grid-cols-3">
        {Object.values(SALES_PACKAGES).map((p) => (
          <Panel key={p.id} className="pitch-panel flex flex-col p-6">
            <p className="text-[11px] uppercase pitch-muted" style={{ fontFamily: MONO, letterSpacing: '0.14em', color: MUTED }}>
              Paket
            </p>
            <h2 className="mt-1 text-xl font-medium" style={{ color: FG }}>{p.name}</h2>
            <p className="mt-2 text-3xl font-medium" style={{ color: FG }}>{formatEur(p.price)}</p>
            <p className="pitch-muted mt-1 text-[12px]" style={{ fontFamily: MONO, color: MUTED }}>
              Rok izrade: {p.duration}
            </p>
            <p className="pitch-muted mt-3 text-sm" style={{ color: MUTED }}>{p.tagline}</p>
            <ul className="mt-5 flex flex-col gap-2">
              {p.features.map((f) => (
                <li key={f} className="flex items-start gap-2 text-[13px]" style={{ color: BODY }}>
                  <Check size={14} className="pitch-signal mt-0.5 shrink-0" style={{ color: SIGNAL }} />
                  {f}
                </li>
              ))}
            </ul>
          </Panel>
        ))}
      </div>

      {/* Add-ons */}
      <Panel className="pitch-panel p-6">
        <h2 className="text-xl font-medium" style={{ color: FG }}>Dodaci</h2>
        <p className="pitch-muted mt-1 text-sm" style={{ color: MUTED }}>
          Mogu se dodati na bilo koji paket.
        </p>
        <div className="mt-5 grid gap-x-8 gap-y-3 sm:grid-cols-2">
          {addons.map((a) => (
            <div key={a.id} className="flex items-baseline justify-between gap-4 border-b pb-2.5" style={{ borderColor: LINE }}>
              <div>
                <p className="text-sm" style={{ color: FG }}>{a.name}</p>
                <p className="pitch-muted text-[12px]" style={{ color: MUTED }}>{a.description}</p>
              </div>
              <p className="shrink-0 text-sm" style={{ fontFamily: MONO, color: BODY }}>
                {formatEur(a.price)}{a.recurring ? '/mj' : ''}
              </p>
            </div>
          ))}
        </div>
      </Panel>

      {/* Footer */}
      <Panel className="pitch-panel p-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h2 className="text-lg font-medium" style={{ color: FG }}>Kako krećemo?</h2>
            <p className="pitch-muted mt-1 max-w-xl text-sm" style={{ color: BODY }}>
              Dogovorimo kratki poziv, izaberemo paket, pošaljemo ponudu s linkom za plaćanje.
              Čim legne predujam, krećemo s izradom.
            </p>
          </div>
          <div className="text-right text-sm">
            <p style={{ color: FG }}>ninefold.eu</p>
            <p className="pitch-muted" style={{ color: MUTED }}>hello@ninefold.eu</p>
          </div>
        </div>
      </Panel>
    </div>
  );
}
