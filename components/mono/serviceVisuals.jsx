'use client'

// Service card illustrations: pure CSS mini-mockups shared by the homepage,
// the /usluge overview and the service detail pages.

import { FG, BODY, MUTED, SIGNAL, MONO } from '@/components/mono/kit'

// ----- Service card illustrations -----

function WebVisual() {
  return (
    <div className="flex h-full items-center justify-center px-6">
      <div className="w-full max-w-[230px] overflow-hidden rounded-lg" style={{ border: '1px solid rgba(255,255,255,0.09)', background: '#151514' }}>
        <div className="flex gap-1.5 px-3 py-2" style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
          <span className="h-1.5 w-1.5 rounded-full" style={{ background: 'rgba(255,255,255,0.15)' }} />
          <span className="h-1.5 w-1.5 rounded-full" style={{ background: 'rgba(255,255,255,0.15)' }} />
          <span className="h-1.5 w-1.5 rounded-full" style={{ background: 'rgba(255,255,255,0.15)' }} />
        </div>
        <div className="flex gap-2 p-3">
          <div className="h-16 flex-1 rounded" style={{ background: 'rgba(255,255,255,0.06)' }} />
          <div className="flex w-14 flex-col gap-1.5">
            <div className="h-2.5 rounded" style={{ background: 'rgba(255,255,255,0.09)' }} />
            <div className="h-2.5 w-4/5 rounded" style={{ background: 'rgba(255,255,255,0.06)' }} />
            <div className="mt-auto h-5 rounded" style={{ background: 'rgba(255,255,255,0.12)' }} />
          </div>
        </div>
      </div>
    </div>
  )
}

function VideoVisual() {
  const clips = [
    ['34%', 0.14],
    ['22%', 0.09],
    ['30%', 0.12],
  ]
  return (
    <div className="flex h-full flex-col items-center justify-center gap-4 px-8">
      <div className="flex h-10 w-10 items-center justify-center rounded-full" style={{ background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.1)' }}>
        <span
          style={{
            width: 0,
            height: 0,
            marginLeft: 3,
            borderTop: '6px solid transparent',
            borderBottom: '6px solid transparent',
            borderLeft: `10px solid ${BODY}`,
          }}
        />
      </div>
      <div className="relative w-full max-w-[230px]">
        <div className="flex gap-1">
          {clips.map(([w, o], i) => (
            <div key={i} className="h-3 rounded-sm" style={{ width: w, background: `rgba(255,255,255,${o})` }} />
          ))}
        </div>
        <div className="mt-1.5 flex gap-1">
          <div className="h-3 rounded-sm" style={{ width: '55%', background: 'rgba(255,255,255,0.07)' }} />
          <div className="h-3 rounded-sm" style={{ width: '28%', background: 'rgba(255,255,255,0.1)' }} />
        </div>
        <div className="absolute -top-1.5 bottom-0" style={{ left: '42%', width: 1.5, background: 'rgba(255,255,255,0.55)' }} />
      </div>
    </div>
  )
}

function FotoVisual() {
  const bracket = { position: 'absolute', width: 18, height: 18, borderColor: 'rgba(255,255,255,0.3)' }
  return (
    <div className="relative flex h-full items-center justify-center">
      <span style={{ ...bracket, top: 26, left: 34, borderTop: '1.5px solid', borderLeft: '1.5px solid' }} />
      <span style={{ ...bracket, top: 26, right: 34, borderTop: '1.5px solid', borderRight: '1.5px solid' }} />
      <span style={{ ...bracket, bottom: 40, left: 34, borderBottom: '1.5px solid', borderLeft: '1.5px solid' }} />
      <span style={{ ...bracket, bottom: 40, right: 34, borderBottom: '1.5px solid', borderRight: '1.5px solid' }} />
      <span className="flex h-11 w-11 items-center justify-center rounded-full" style={{ border: '1px solid rgba(255,255,255,0.25)' }}>
        <span className="h-1.5 w-1.5 rounded-full" style={{ background: SIGNAL }} />
      </span>
      <p className="absolute bottom-4 text-[10px]" style={{ fontFamily: MONO, letterSpacing: '0.12em', color: MUTED }}>
        f/1.8 · 1/250 · ISO 100
      </p>
    </div>
  )
}

function BrandVisual() {
  const swatches = ['#F2F2F2', '#8E8E8E', '#3A3A38', '#00FF94']
  return (
    <div className="flex h-full items-center justify-center gap-7">
      <span className="text-6xl font-medium" style={{ color: FG, letterSpacing: '-0.03em' }}>Aa</span>
      <div className="flex flex-col gap-1.5">
        {swatches.map((c) => (
          <span key={c} className="h-4 w-16 rounded-sm" style={{ background: c, opacity: c === '#00FF94' ? 0.75 : 1 }} />
        ))}
      </div>
    </div>
  )
}

function SocialVisual() {
  return (
    <div className="relative flex h-full items-center justify-center">
      <div className="w-[190px] rounded-xl p-3" style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)' }}>
        <div className="flex items-center gap-2">
          <span className="h-6 w-6 rounded-full" style={{ background: 'rgba(255,255,255,0.12)' }} />
          <div className="flex flex-col gap-1">
            <span className="h-1.5 w-20 rounded" style={{ background: 'rgba(255,255,255,0.12)' }} />
            <span className="h-1.5 w-12 rounded" style={{ background: 'rgba(255,255,255,0.07)' }} />
          </div>
        </div>
        <div className="mt-2.5 h-14 rounded-lg" style={{ background: 'rgba(255,255,255,0.07)' }} />
      </div>
      <span className="absolute rounded-full px-2.5 py-1 text-[10px]" style={{ top: 24, right: 40, background: '#1A1A19', border: '1px solid rgba(255,255,255,0.1)', color: BODY }}>
        ♥ 1.2k
      </span>
      <span className="absolute rounded-full px-2.5 py-1 text-[10px]" style={{ bottom: 22, left: 42, background: '#1A1A19', border: '1px solid rgba(255,255,255,0.1)', color: BODY }}>
        ↗ 214 dijeljenja
      </span>
    </div>
  )
}

function StudioVisual() {
  const bars = [5, 11, 7, 15, 9, 18, 12, 22, 14, 10, 17, 8, 13, 6, 10, 4]
  return (
    <div className="flex h-full flex-col items-center justify-center gap-4">
      <div className="flex h-12 items-end gap-[3px]">
        {bars.map((h, i) => (
          <span key={i} className="w-[3px] rounded-full" style={{ height: h * 2, background: `rgba(255,255,255,${0.18 + (h / 22) * 0.3})` }} />
        ))}
      </div>
      <p className="flex items-center gap-2 text-[10px] uppercase" style={{ fontFamily: MONO, letterSpacing: '0.16em', color: MUTED }}>
        <span className="inline-block h-1.5 w-1.5 rounded-full" style={{ background: SIGNAL }} />
        REC · 00:42
      </p>
    </div>
  )
}

export const SERVICE_VISUALS = {
  web: <WebVisual />,
  video: <VideoVisual />,
  foto: <FotoVisual />,
  brand: <BrandVisual />,
  social: <SocialVisual />,
  studio: <StudioVisual />,
}
