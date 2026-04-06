'use client'
import { useState, useEffect } from 'react'
import { T } from '@/lib/theme'

export function useIsMobile(bp = 768) {
  const [m, setM] = useState(() => typeof window !== 'undefined' ? window.innerWidth < bp : false)
  useEffect(() => {
    const h = () => setM(window.innerWidth < bp)
    window.addEventListener('resize', h)
    return () => window.removeEventListener('resize', h)
  }, [bp])
  return m
}

export function GS() {
  return (
    <style>{`
@import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');
*,*::before,*::after{box-sizing:border-box;margin:0;padding:0}body{font-family:'Plus Jakarta Sans',system-ui,sans-serif;background:${T.bg};color:${T.ink};overflow-x:hidden}input,select,textarea,button{font-family:inherit;font-size:16px}::-webkit-scrollbar{width:5px}::-webkit-scrollbar-thumb{background:${T.borderMid};border-radius:3px}
@keyframes fadeUp{from{opacity:0;transform:translateY(12px)}to{opacity:1;transform:translateY(0)}}.fade-up{animation:fadeUp .35s ease both}
.btn-p{background:linear-gradient(135deg,${T.blue},${T.blueDark});color:#fff;border:none;border-radius:${T.r8};padding:10px 18px;font-size:14px;font-weight:700;display:inline-flex;align-items:center;gap:6px;cursor:pointer;transition:all .18s;box-shadow:0 2px 8px rgba(0,119,182,.3);white-space:nowrap}.btn-p:active{transform:scale(.97)}.btn-p:disabled{opacity:.5;cursor:not-allowed}
.btn-g{background:${T.surface};color:${T.inkMid};border:1.5px solid ${T.border};border-radius:${T.r8};padding:9px 16px;font-size:14px;font-weight:600;display:inline-flex;align-items:center;gap:6px;cursor:pointer;white-space:nowrap;transition:all .15s}.btn-g:hover{border-color:${T.cyan};color:${T.blue}}
.btn-d{background:${T.dangerBg};color:${T.danger};border:1.5px solid #FECACA;border-radius:${T.r8};padding:9px 14px;font-size:13px;font-weight:700;display:inline-flex;align-items:center;gap:6px;cursor:pointer}
.btn-s{background:${T.successBg};color:${T.success};border:1.5px solid #A7F3D0;border-radius:${T.r8};padding:9px 14px;font-size:13px;font-weight:700;display:inline-flex;align-items:center;gap:6px;cursor:pointer}
.inp{width:100%;padding:11px 13px;background:${T.surface};border:1.5px solid ${T.border};border-radius:${T.r8};font-size:16px;color:${T.ink};outline:none;transition:border-color .15s}.inp:focus{border-color:${T.cyan};box-shadow:0 0 0 3px rgba(0,180,216,.12)}.inp::placeholder{color:${T.inkFaint}}
.sel{width:100%;padding:11px 36px 11px 13px;background:${T.surface} url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%237A93B0' stroke-width='2'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E") no-repeat right 12px center;border:1.5px solid ${T.border};border-radius:${T.r8};font-size:16px;color:${T.ink};outline:none;appearance:none}
.card{background:${T.surface};border:1px solid ${T.border};border-radius:${T.r16};box-shadow:${T.shadowSm}}
.tag{display:inline-flex;align-items:center;gap:4px;padding:3px 10px;border-radius:${T.rFull};font-size:12px;font-weight:700;white-space:nowrap}.dot{width:6px;height:6px;border-radius:50%;flex-shrink:0}
.ovl{position:fixed;inset:0;background:rgba(3,4,94,.45);backdrop-filter:blur(4px);z-index:100;display:flex;align-items:center;justify-content:center;animation:fadeUp .15s ease}.modal{background:${T.surface};border-radius:${T.r24};box-shadow:${T.shadowLg};width:600px;max-width:95vw;max-height:90vh;overflow-y:auto}
@media(max-width:767px){.modal{width:100%;max-width:100%;max-height:95vh;border-radius:${T.r24} ${T.r24} 0 0;margin-top:auto}.ovl{align-items:flex-end}}
.sb{display:flex;align-items:center;gap:10px;background:${T.surface};border:1.5px solid ${T.border};border-radius:${T.rFull};padding:10px 16px}.sb:focus-within{border-color:${T.cyan}}.sb input{border:none;outline:none;background:transparent;font-size:16px;color:${T.ink};flex:1;min-width:0}.sb input::placeholder{color:${T.inkFaint}}
.pbar{height:6px;border-radius:3px;background:${T.border};overflow:hidden}.pfill{height:100%;border-radius:3px;transition:width .6s ease}
.av{border-radius:50%;display:flex;align-items:center;justify-content:center;font-weight:800;flex-shrink:0}
.bnav{position:fixed;bottom:0;left:0;right:0;background:linear-gradient(135deg,${T.blueDark},${T.blue});border-top:none;display:flex;z-index:50;padding:4px 0;padding-bottom:max(4px,env(safe-area-inset-bottom))}.bnav button{flex:1;display:flex;flex-direction:column;align-items:center;gap:3px;border:none;background:none;padding:8px 2px;font-size:10px;font-weight:600;color:rgba(255,255,255,.6);cursor:pointer;position:relative}.bnav button.on{color:#fff}.bnav button.on::before{content:'';position:absolute;top:0;left:25%;right:25%;height:2.5px;background:linear-gradient(90deg,${T.cyan},#fff);border-radius:0 0 2px 2px}
.chip{padding:6px 14px;border-radius:${T.rFull};border:1.5px solid ${T.border};background:${T.surface};color:${T.inkMid};font-size:12px;font-weight:600;cursor:pointer;white-space:nowrap;transition:all .15s}.chip.on{border-color:${T.blue};background:#EFF6FF;color:${T.blue}}
.lcard{transition:all .2s;cursor:pointer;border:2px solid transparent}.lcard:hover{border-color:${T.cyan};transform:translateY(-2px);box-shadow:0 4px 16px rgba(0,100,200,.1)}
.toggle{position:relative;width:44px;height:24px;border-radius:12px;border:none;cursor:pointer;transition:background .2s;padding:0}.toggle .knob{position:absolute;top:2px;width:20px;height:20px;border-radius:50%;background:#fff;box-shadow:0 1px 3px rgba(0,0,0,.2);transition:left .2s}.toggle.on{background:${T.success}}.toggle.on .knob{left:22px}.toggle.off{background:${T.borderMid}}.toggle.off .knob{left:2px}
    `}</style>
  )
}

const icPaths = {
  home: <><rect x="3" y="9" width="18" height="13" rx="2"/><polyline points="3 9 12 2 21 9"/></>,
  users: <><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></>,
  cal: <><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></>,
  steth: <><path d="M4.8 2.3A.3.3 0 1 0 5 2H4a2 2 0 0 0-2 2v5a6 6 0 0 0 6 6v0a6 6 0 0 0 6-6V4a2 2 0 0 0-2-2h-1a.2.2 0 1 0 .3.3"/><path d="M8 15v1a6 6 0 0 0 6 6v0a6 6 0 0 0 6-6v-4"/><circle cx="20" cy="10" r="2"/></>,
  bar: <><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></>,
  srch: <><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></>,
  plus: <><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></>,
  trash: <><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></>,
  left: <><line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/></>,
  x: <><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></>,
  chk: <><polyline points="20 6 9 17 4 12"/></>,
  alrt: <><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></>,
  bell: <><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></>,
  cfg: <><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/></>,
  eye: <><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></>,
  ph: <><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 5.32 13.5 19.79 19.79 0 0 1 2.25 4.84 2 2 0 0 1 3.6 2.18h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 9.91a16 16 0 0 0 6.13 6.13l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7a2 2 0 0 1 1.72 2z"/></>,
  shld: <><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></>,
  clip: <><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"/><rect x="8" y="2" width="8" height="4" rx="1"/></>,
  edit: <><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.12 2.12 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></>,
  clock: <><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></>,
  save: <><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/><polyline points="17 21 17 13 7 13 7 21"/><polyline points="7 3 7 8 15 8"/></>,
  file: <><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></>,
  lock: <><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></>,
  logout: <><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></>,
  user: <><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></>,
  msg: <><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></>,
  star: <><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></>,
  link: <><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/></>,
  qr: <><rect x="2" y="2" width="8" height="8" rx="1"/><rect x="14" y="2" width="8" height="8" rx="1"/><rect x="2" y="14" width="8" height="8" rx="1"/><rect x="14" y="14" width="4" height="4"/><rect x="20" y="14" width="2" height="2"/><rect x="14" y="20" width="2" height="2"/><rect x="20" y="20" width="2" height="2"/></>,
  svc: <><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="16"/><line x1="8" y1="12" x2="16" y2="12"/></>,
  heart: <><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78L12 21.23l8.84-8.84a5.5 5.5 0 0 0 0-7.78z"/></>,
  mail: <><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22 6 12 13 2 6"/></>,
  menu: <><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="18" x2="21" y2="18"/></>,
  info: <><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></>,
  dl: <><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></>,
  act: <><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></>,
}

export function Ic({ n, s = 16, c = 'currentColor' }) {
  return (
    <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      {icPaths[n]}
    </svg>
  )
}

export function Tag({ children, v = 'default', dot = false }) {
  const m = {
    default: { bg: T.border, c: T.inkMid, d: T.inkLight },
    green: { bg: T.successBg, c: T.success, d: T.success },
    yellow: { bg: T.warningBg, c: T.warning, d: T.warning },
    red: { bg: T.dangerBg, c: T.danger, d: T.danger },
    blue: { bg: '#EFF6FF', c: T.blue, d: T.blue },
    cyan: { bg: T.cyanDim, c: '#0077A8', d: T.cyan },
    purple: { bg: T.purpleBg, c: T.purple, d: T.purple },
    orange: { bg: '#FFF7ED', c: '#EA580C', d: '#EA580C' },
  }
  const s = m[v] || m.default
  return <span className="tag" style={{ background: s.bg, color: s.c }}>{dot && <span className="dot" style={{ background: s.d }} />}{children}</span>
}

export function Av({ name = '', size = 36, variant = 'blue' }) {
  const ini = name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()
  const p = { blue: { f: T.blue, t: T.blueDark }, cyan: { f: T.cyan, t: T.blue }, purple: { f: '#7C3AED', t: '#4C1D95' }, green: { f: '#059669', t: '#065F46' }, orange: { f: '#EA580C', t: '#9A3412' } }
  const q = p[variant] || p.blue
  return <div className="av" style={{ width: size, height: size, fontSize: size * 0.34, background: `linear-gradient(135deg,${q.f},${q.t})`, color: '#fff' }}>{ini}</div>
}

export function Div() { return <div style={{ height: 1, background: T.border }} /> }

export function Empty({ icon, title, desc }) {
  return (
    <div style={{ textAlign: 'center', padding: '40px 20px' }}>
      <div style={{ width: 48, height: 48, borderRadius: T.r16, background: `linear-gradient(135deg,${T.cyanDim},${T.border})`, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 12px' }}>
        <Ic n={icon} s={20} c={T.blue} />
      </div>
      <div style={{ fontWeight: 700, fontSize: 15, marginBottom: 5 }}>{title}</div>
      <div style={{ fontSize: 13, color: T.inkLight }}>{desc}</div>
    </div>
  )
}

export function Toast({ msg, type = 'success', onClose }) {
  const mob = useIsMobile()
  useEffect(() => { const t = setTimeout(onClose, 3200); return () => clearTimeout(t) }, [])
  const c = { success: { bg: T.success, ic: 'chk' }, error: { bg: T.danger, ic: 'x' }, info: { bg: T.blue, ic: 'bell' }, warning: { bg: T.warning, ic: 'alrt' } }[type] || { bg: T.blue, ic: 'bell' }
  return (
    <div style={{ position: 'fixed', bottom: mob ? 72 : 28, left: mob ? 12 : 'auto', right: mob ? 12 : 28, zIndex: 200, background: c.bg, color: '#fff', borderRadius: T.r12, padding: '12px 16px', display: 'flex', alignItems: 'center', gap: 10, boxShadow: T.shadowLg, animation: 'fadeUp .3s ease', fontSize: 14, fontWeight: 600 }}>
      <Ic n={c.ic} s={15} c="#fff" /><span style={{ flex: 1 }}>{msg}</span>
      <button onClick={onClose} style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,.7)', cursor: 'pointer' }}><Ic n="x" s={13} c="rgba(255,255,255,.7)" /></button>
    </div>
  )
}

export function FF({ label, required, children }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
      <label style={{ fontSize: 12, fontWeight: 700, color: T.inkMid, letterSpacing: '.04em', textTransform: 'uppercase' }}>{label}{required && <span style={{ color: T.danger }}>*</span>}</label>
      {children}
    </div>
  )
}

export function FG({ children, mob }) {
  return <div style={{ display: 'grid', gridTemplateColumns: mob ? '1fr' : '1fr 1fr', gap: 14 }}>{children}</div>
}

export function StatBox({ label, value, icon, color, bg, onClick }) {
  return (
    <div className="card" style={{ padding: 14, borderTop: `4px solid ${color}`, cursor: onClick ? 'pointer' : 'default' }} onClick={onClick}>
      <div style={{ width: 34, height: 34, borderRadius: T.r12, background: bg, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 6 }}><Ic n={icon} s={16} c={color} /></div>
      <div style={{ fontSize: 22, fontWeight: 800 }}>{value}</div>
      <div style={{ fontSize: 11, color: T.inkLight }}>{label}</div>
    </div>
  )
}

export function Header({ name, variant, role, onLogout, mob }) {
  const bg = role === 'admin' ? 'linear-gradient(135deg,#EA580C,#9A3412)' : role === 'doctor' ? `linear-gradient(135deg,${T.cyan},${T.navy})` : `linear-gradient(135deg,${T.success},#047857)`
  return (
    <header style={{ background: T.surface, borderBottom: `1px solid ${T.border}`, padding: '12px 20px', display: 'flex', alignItems: 'center', gap: 10, position: 'sticky', top: 0, zIndex: 40 }}>
      <div style={{ width: 32, height: 32, borderRadius: T.r8, background: bg, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="9" stroke="rgba(255,255,255,.5)" strokeWidth="1.5"/><path d="M12 7v5l3 3" stroke="#fff" strokeWidth="2" strokeLinecap="round"/></svg>
      </div>
      <span style={{ fontWeight: 800, fontSize: 15, color: T.navy }}>MedFlow</span>
      <Tag v={role === 'admin' ? 'orange' : role === 'doctor' ? 'blue' : 'green'}>{role === 'admin' ? 'Admin' : role === 'doctor' ? 'Medic' : 'Pacient'}</Tag>
      <div style={{ flex: 1 }} />
      <Av name={name} size={28} variant={variant} />
      {!mob && <span style={{ fontSize: 13, fontWeight: 600, color: T.inkMid }}>{name.replace('Dr. ', '')}</span>}
      <button className="btn-g" style={{ padding: '6px 10px' }} onClick={onLogout}><Ic n="logout" s={14} /></button>
    </header>
  )
}

export function BNav({ items, active, set }) {
  return (
    <nav className="bnav">
      {items.map(i => (
        <button key={i.id} className={active === i.id ? 'on' : ''} onClick={() => set(i.id)}>
          <Ic n={i.ic} s={20} c={active === i.id ? '#fff' : 'rgba(255,255,255,.55)'} />
          <span>{i.l}</span>
          {i.badge > 0 && <span style={{ position: 'absolute', top: 4, right: '30%', width: 8, height: 8, borderRadius: '50%', background: T.danger }} />}
        </button>
      ))}
    </nav>
  )
}

export function QRCode({ text, size = 160 }) {
  const hash = text.split('').reduce((a, c) => ((a << 5) - a) + c.charCodeAt(0) | 0, 0)
  const bits = []
  for (let i = 0; i < 441; i++) bits.push(((hash * ((i + 1) * 7)) % 100) > 38)
  const g = 21, cs = size / g
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} style={{ borderRadius: T.r8 }}>
      <rect width={size} height={size} fill="white" />
      {bits.map((b, i) => b ? <rect key={i} x={(i % g) * cs} y={Math.floor(i / g) * cs} width={cs} height={cs} fill={T.navy} rx={cs * 0.15} /> : null)}
      {[[0, 0], [0, (g - 7) * cs], [(g - 7) * cs, 0]].map(([x, y], i) => (
        <g key={`m${i}`}>
          <rect x={x} y={y} width={7 * cs} height={7 * cs} fill={T.navy} rx={cs * 0.5} />
          <rect x={x + cs} y={y + cs} width={5 * cs} height={5 * cs} fill="white" rx={cs * 0.3} />
          <rect x={x + 2 * cs} y={y + 2 * cs} width={3 * cs} height={3 * cs} fill={T.blue} rx={cs * 0.4} />
        </g>
      ))}
    </svg>
  )
}

export function QRModal({ onClose, title, linkText }) {
  const url = `https://medflow.ro/book/${linkText}`
  const [cp, setCp] = useState(false)
  return (
    <div className="ovl" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="modal" style={{ padding: 28, textAlign: 'center' }}>
        <div style={{ fontWeight: 700, fontSize: 17, marginBottom: 16 }}>{title}</div>
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 16 }}><QRCode text={url} size={180} /></div>
        <div style={{ display: 'flex', gap: 8, background: T.surfaceAlt, border: `1px solid ${T.border}`, borderRadius: T.r8, padding: '10px 12px', alignItems: 'center', marginBottom: 16 }}>
          <Ic n="link" s={14} c={T.inkFaint} />
          <span style={{ flex: 1, fontSize: 13, color: T.inkMid, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{url}</span>
          <button className="btn-g" style={{ padding: '4px 12px', fontSize: 12 }} onClick={() => { try { navigator.clipboard.writeText(url) } catch { } setCp(true); setTimeout(() => setCp(false), 2000) }}>{cp ? 'Copiat!' : 'Copiază'}</button>
        </div>
        <button className="btn-g" onClick={onClose} style={{ width: '100%', justifyContent: 'center' }}>Închide</button>
      </div>
    </div>
  )
}
