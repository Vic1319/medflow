'use client'
import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { T } from '@/lib/theme'
import { Ic, Tag, FF, FG, useIsMobile } from '@/components/ui'

export default function AuthScreen({ showToast }) {
  const mob = useIsMobile()
  const [phase, setPhase] = useState(0) // 0=splash mare, 1=shrink+fade, 2=gata
  const [mode, setMode] = useState('login') // 'login' | 'admin' | 'register'
  const [role, setRole] = useState(null)    // 'doctor' | 'patient'
  const [email, setEmail] = useState('')
  const [pw, setPw] = useState('')
  const [err, setErr] = useState('')
  const [loading, setLoading] = useState(false)

  // Register fields
  const [rName, setRName] = useState('')
  const [rEmail, setREmail] = useState('')
  const [rPw, setRPw] = useState('')
  const [rRole, setRRole] = useState('patient')
  const [rPhone, setRPhone] = useState('')
  const [rSpec, setRSpec] = useState('')
  const [rChild, setRChild] = useState('')
  const [rDob, setRDob] = useState('')
  const [rDoc, setRDoc] = useState('')
  const [rGroup, setRGroup] = useState('A+')
  const [doctors, setDoctors] = useState([])

  useEffect(() => {
    const t1 = setTimeout(() => setPhase(1), 1000)
    const t2 = setTimeout(() => setPhase(2), 1600)
    return () => { clearTimeout(t1); clearTimeout(t2) }
  }, [])

  useEffect(() => {
    supabase.from('doctors').select('id, name').eq('is_active', true).then(({ data }) => {
      if (data?.length) { setDoctors(data); setRDoc(data[0].name) }
    })
  }, [])

  const tryLogin = async () => {
    setErr(''); setLoading(true)
    const { error } = await supabase.auth.signInWithPassword({ email, password: pw })
    setLoading(false)
    if (error) setErr('Credențiale incorecte!')
  }

  const tryReg = async () => {
    setErr('')
    if (!rName || !rEmail || !rPw) { setErr('Completează câmpurile obligatorii!'); return }
    if (rRole === 'patient' && (!rChild || !rDob)) { setErr('Completează datele copilului!'); return }
    if (rRole === 'doctor' && !rSpec) { setErr('Completează specializarea!'); return }
    setLoading(true)

    const meta = rRole === 'doctor'
      ? { role: 'doctor', name: rName, spec: rSpec, phone: rPhone }
      : { role: 'patient', name: rName, child_name: rChild, dob: rDob, phone: rPhone, doctor_name: rDoc, blood_group: rGroup }

    const { data, error } = await supabase.auth.signUp({
      email: rEmail, password: rPw,
      options: { data: meta },
    })
    setLoading(false)
    if (error) { setErr(error.message); return }
    if (!data.session) {
      setErr('Verifică emailul și confirmă contul înainte de a te autentifica.')
      return
    }
    showToast('Cont creat cu succes!')
  }

  const splash = (
    <div style={{ position: 'fixed', inset: 0, background: 'linear-gradient(160deg,#EEF6FF 0%,#F8FBFF 50%,#E8F4FD 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 300, opacity: phase >= 1 ? 0 : 1, pointerEvents: phase >= 2 ? 'none' : 'all', transition: 'opacity .55s ease' }}>
      <div style={{ transform: phase >= 1 ? 'scale(.5)' : 'scale(1)', transition: 'transform .55s cubic-bezier(.34,1.2,.64,1)', animation: phase === 0 ? 'splashIn .7s cubic-bezier(.34,1.56,.64,1) both' : 'none' }}>
        <img src="/logo.webp" alt="MedFlow" style={{ height: 130 }} />
      </div>
    </div>
  )
  const bgS = { minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'linear-gradient(160deg,#EEF6FF 0%,#F8FBFF 50%,#E8F4FD 100%)', padding: 20, position: 'relative' }
  const admBtn = (
    <button onClick={() => { setMode('admin'); setErr('') }} style={{ position: 'absolute', top: 16, right: 16, background: 'rgba(0,60,120,.07)', border: `1px solid ${T.border}`, borderRadius: T.r8, color: T.inkMid, padding: '6px 14px', fontSize: 11, fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 5 }}>
      <Ic n="shld" s={12} c={T.inkMid} /> Admin
    </button>
  )
  const back = (fn) => (
    <button onClick={fn} style={{ background: 'rgba(0,60,120,.07)', border: `1px solid ${T.border}`, borderRadius: T.r8, color: T.inkMid, padding: '8px 16px', fontSize: 13, fontWeight: 600, cursor: 'pointer', marginBottom: 12, display: 'inline-flex', alignItems: 'center', gap: 6 }}>
      <Ic n="left" s={14} c={T.inkMid} /> Înapoi
    </button>
  )

  // Role selection
  if (mode === 'login' && !role) return (
    <div style={bgS}>{splash}{admBtn}
      <div style={{ maxWidth: 520, width: '100%', textAlign: 'center', opacity: phase >= 1 ? 1 : 0, transition: 'opacity .5s .15s ease' }}>
        <img src="/logo.webp" alt="MedFlow" style={{ height: mob ? 52 : 68, marginBottom: 20 }} />
        <p style={{ color: T.inkMid, fontSize: 15, marginBottom: 32 }}>Clinică Pediatrică — Cabinet Digital</p>
        <div style={{ display: 'grid', gridTemplateColumns: mob ? '1fr' : '1fr 1fr', gap: 16 }}>
          <div className="lcard card" onClick={() => setRole('doctor')} style={{ padding: mob ? 24 : 32 }}>
            <div style={{ width: 56, height: 56, borderRadius: T.r16, background: `linear-gradient(135deg,${T.cyan},${T.blue})`, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 14px' }}><Ic n="steth" s={26} c="#fff" /></div>
            <div style={{ fontSize: 18, fontWeight: 800, marginBottom: 6 }}>Medic</div>
            <div style={{ fontSize: 13, color: T.inkLight }}>Cabinet medical</div>
          </div>
          <div className="lcard card" onClick={() => setRole('patient')} style={{ padding: mob ? 24 : 32 }}>
            <div style={{ width: 56, height: 56, borderRadius: T.r16, background: `linear-gradient(135deg,${T.success},#047857)`, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 14px' }}><Ic n="user" s={26} c="#fff" /></div>
            <div style={{ fontSize: 18, fontWeight: 800, marginBottom: 6 }}>Pacient</div>
            <div style={{ fontSize: 13, color: T.inkLight }}>Fișa ta medicală</div>
          </div>
        </div>
      </div>
    </div>
  )

  // Admin login
  if (mode === 'admin') return (
    <div style={bgS}>
      <div className="fade-up" style={{ maxWidth: 400, width: '100%' }}>
        <div style={{ textAlign: 'center', marginBottom: 24 }}>
          {back(() => { setMode('login'); setRole(null); setErr('') })}
          <div style={{ width: 48, height: 48, borderRadius: T.r12, background: 'linear-gradient(135deg,#EA580C,#9A3412)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 12px' }}><Ic n="shld" s={22} c="#fff" /></div>
          <h2 style={{ color: T.navy, fontSize: 22, fontWeight: 800 }}>Administrator</h2>
        </div>
        <div className="card" style={{ padding: mob ? 20 : 28 }}>
          <FF label="Email" required><input className="inp" type="email" value={email} onChange={e => { setEmail(e.target.value); setErr('') }} /></FF>
          <div style={{ height: 12 }} />
          <FF label="Parolă" required><input className="inp" type="password" value={pw} onChange={e => { setPw(e.target.value); setErr('') }} onKeyDown={e => e.key === 'Enter' && tryLogin()} /></FF>
          {err && <div style={{ color: T.danger, fontSize: 13, fontWeight: 600, marginTop: 10 }}>{err}</div>}
          <div style={{ fontSize: 11, color: T.inkFaint, marginTop: 8 }}>Demo: admin@medflow.ro / (parola setată la înregistrare)</div>
          <button className="btn-p" style={{ width: '100%', justifyContent: 'center', marginTop: 16, padding: 14, background: 'linear-gradient(135deg,#EA580C,#9A3412)' }} onClick={tryLogin} disabled={!email || !pw || loading}>
            <Ic n="lock" s={15} c="#fff" /> {loading ? 'Se procesează...' : 'Autentificare'}
          </button>
        </div>
      </div>
    </div>
  )

  // Register
  if (mode === 'register') return (
    <div style={bgS}>
      <div className="fade-up" style={{ maxWidth: 480, width: '100%' }}>
        <div style={{ textAlign: 'center', marginBottom: 20 }}>
          {back(() => { setMode('login'); setErr('') })}
          <h2 style={{ color: T.navy, fontSize: 22, fontWeight: 800 }}>Cont nou</h2>
        </div>
        <div className="card" style={{ padding: mob ? 20 : 28 }}>
          <FF label="Tip cont">
            <div style={{ display: 'flex', gap: 8 }}>
              {[['patient', 'Pacient'], ['doctor', 'Medic']].map(([v, l]) => (
                <button key={v} className={`chip ${rRole === v ? 'on' : ''}`} onClick={() => setRRole(v)} style={{ flex: 1, justifyContent: 'center', padding: 10 }}>{l}</button>
              ))}
            </div>
          </FF>
          <div style={{ height: 10 }} />
          <FG mob={mob}>
            <FF label={rRole === 'doctor' ? 'Nume complet' : 'Numele tău (părinte)'} required><input className="inp" value={rName} onChange={e => setRName(e.target.value)} /></FF>
            <FF label="Email" required><input className="inp" type="email" value={rEmail} onChange={e => setREmail(e.target.value)} /></FF>
            <FF label="Parolă" required><input className="inp" type="password" value={rPw} onChange={e => setRPw(e.target.value)} /></FF>
            <FF label="Telefon"><input className="inp" type="tel" value={rPhone} onChange={e => setRPhone(e.target.value)} /></FF>
            {rRole === 'doctor' && <FF label="Specializare" required><input className="inp" value={rSpec} onChange={e => setRSpec(e.target.value)} /></FF>}
            {rRole === 'patient' && <>
              <FF label="Prenume copil" required><input className="inp" value={rChild} onChange={e => setRChild(e.target.value)} /></FF>
              <FF label="Data nașterii" required><input className="inp" type="date" value={rDob} onChange={e => setRDob(e.target.value)} /></FF>
              <FF label="Medic curant">
                <select className="sel" value={rDoc} onChange={e => setRDoc(e.target.value)}>
                  {doctors.map(d => <option key={d.id} value={d.name}>{d.name}</option>)}
                </select>
              </FF>
              <FF label="Grupă sanguină">
                <select className="sel" value={rGroup} onChange={e => setRGroup(e.target.value)}>
                  {['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'].map(g => <option key={g}>{g}</option>)}
                </select>
              </FF>
            </>}
          </FG>
          {err && <div style={{ color: T.danger, fontSize: 13, fontWeight: 600, marginTop: 10 }}>{err}</div>}
          <button className="btn-p" style={{ width: '100%', justifyContent: 'center', marginTop: 16, padding: 14 }} onClick={tryReg} disabled={loading}>
            <Ic n="plus" s={15} c="#fff" /> {loading ? 'Se procesează...' : 'Creează cont'}
          </button>
        </div>
      </div>
    </div>
  )

  // Doctor / Patient login
  return (
    <div style={bgS}>{admBtn}
      <div className="fade-up" style={{ maxWidth: 420, width: '100%' }}>
        <div style={{ textAlign: 'center', marginBottom: 24 }}>
          {back(() => { setRole(null); setErr('') })}
          <h2 style={{ color: T.navy, fontSize: 22, fontWeight: 800 }}>Autentificare {role === 'doctor' ? 'Medic' : 'Pacient'}</h2>
        </div>
        <div className="card" style={{ padding: mob ? 20 : 28 }}>
          <FF label="Email" required><input className="inp" type="email" value={email} onChange={e => { setEmail(e.target.value); setErr('') }} /></FF>
          <div style={{ height: 12 }} />
          <FF label="Parolă" required><input className="inp" type="password" value={pw} onChange={e => { setPw(e.target.value); setErr('') }} onKeyDown={e => e.key === 'Enter' && tryLogin()} /></FF>
          {err && <div style={{ color: T.danger, fontSize: 13, fontWeight: 600, marginTop: 10 }}>{err}</div>}
          <div style={{ fontSize: 11, color: T.inkFaint, marginTop: 8 }}>
            {role === 'doctor' ? 'Demo: înregistrează-te cu ionescu@medflow.ro' : 'Demo: înregistrează-te cu popescu.m@email.ro'}
          </div>
          <button className="btn-p" style={{ width: '100%', justifyContent: 'center', marginTop: 16, padding: 14, background: role === 'patient' ? `linear-gradient(135deg,${T.success},#047857)` : undefined }} onClick={tryLogin} disabled={!email || !pw || loading}>
            <Ic n="lock" s={15} c="#fff" /> {loading ? 'Se procesează...' : 'Intră'}
          </button>
          <div style={{ textAlign: 'center', marginTop: 16 }}>
            <span style={{ fontSize: 13, color: T.inkLight }}>Nu ai cont? </span>
            <button onClick={() => { setMode('register'); setRRole(role); setErr('') }} style={{ background: 'none', border: 'none', color: role === 'doctor' ? T.blue : T.success, fontSize: 13, fontWeight: 700, cursor: 'pointer', textDecoration: 'underline' }}>Creează cont</button>
          </div>
        </div>
      </div>
    </div>
  )
}
