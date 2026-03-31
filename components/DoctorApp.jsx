'use client'
import { useState, useEffect, useCallback } from 'react'
import { supabase } from '@/lib/supabase'
import { T, age, fmt, fmtS, mapDoctor, mapPatient, mapAppt, mapMsg, mapRx, PSTATUS, ASTATUS, ATYPE } from '@/lib/theme'
import { Ic, Tag, Av, Empty, FF, FG, StatBox, Header, BNav, QRModal, useIsMobile } from '@/components/ui'
import HistoryReport from '@/components/HistoryReport'

export default function DoctorApp({ profile, onLogout, showToast }) {
  const mob = useIsMobile()
  const [doc, setDoc] = useState(null)
  const [pats, setPats] = useState([])
  const [appts, setAppts] = useState([])
  const [msgs, setMsgs] = useState([])
  const [rxs, setRxs] = useState([])
  const [page, setPage] = useState('dashboard')
  const [showQR, setShowQR] = useState(false)
  const [viewPatId, setViewPatId] = useState(null)
  const [loading, setLoading] = useState(true)

  const fetchAll = useCallback(async () => {
    const did = profile.doctor_id
    const [docRes, apptsRes, msgsRes, rxsRes] = await Promise.all([
      supabase.from('doctors').select('*').eq('id', did).single(),
      supabase.from('appointments').select('*').eq('doctor_id', did),
      supabase.from('messages').select('*').or(`and(from_role.eq.doctor,from_id.eq.${did}),and(to_role.eq.doctor,to_id.eq.${did})`),
      supabase.from('prescriptions').select('*').eq('doctor_id', did),
    ])
    const docData = docRes.data ? mapDoctor(docRes.data) : null
    setDoc(docData)
    const mappedAppts = (apptsRes.data || []).map(mapAppt)
    setAppts(mappedAppts)
    setMsgs((msgsRes.data || []).map(mapMsg))
    setRxs((rxsRes.data || []).map(mapRx))
    // fetch patients who had appointments with this doctor
    const patIds = [...new Set(mappedAppts.map(a => a.patientId))].filter(Boolean)
    if (patIds.length > 0) {
      const { data: patsData } = await supabase.from('patients').select('*').in('id', patIds)
      setPats((patsData || []).map(mapPatient))
    } else setPats([])
    setLoading(false)
  }, [profile.doctor_id])

  useEffect(() => { fetchAll() }, [fetchAll])

  if (loading || !doc) return <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Ic n="act" s={24} c={T.blue} /></div>

  const unread = msgs.filter(m => !m.read && m.toRole === 'doctor').length
  const myPat = pats.filter(p => p.doctor === doc.name)
  const nav = [
    { id: 'dashboard', l: 'Acasă', ic: 'home', badge: 0 },
    { id: 'patients', l: 'Pacienți', ic: 'users', badge: 0 },
    { id: 'appointments', l: 'Programări', ic: 'cal', badge: 0 },
    { id: 'messages', l: 'Mesaje', ic: 'msg', badge: unread },
    { id: 'prescriptions', l: 'Rețete', ic: 'file', badge: 0 },
  ]

  if (viewPatId) {
    const vPat = pats.find(p => p.id === viewPatId)
    if (!vPat) return null
    return (
      <div style={{ minHeight: '100vh', background: T.bg }}>
        <Header name={doc.name} variant={doc.av} role="doctor" onLogout={onLogout} mob={mob} />
        <main style={{ padding: mob ? '16px 16px 80px' : '24px 28px', maxWidth: 900, margin: '0 auto' }}>
          <HistoryReport title={`Istoric — ${vPat.name}`} patient={vPat} doctorFilter={doc.id} allAppts={appts} allRx={rxs} allMsgs={msgs} allDocs={[doc]} mob={mob} onBack={() => setViewPatId(null)} />
        </main>
        <BNav items={nav} active={page} set={p => { setViewPatId(null); setPage(p) }} />
      </div>
    )
  }

  const Dash = () => (
    <div className="fade-up" style={{ display: 'flex', flexDirection: 'column', gap: mob ? 14 : 20 }}>
      <div className="card" style={{ padding: mob ? 16 : 24, background: `linear-gradient(135deg,${T.blue},${T.blueDark})`, color: '#fff', border: 'none' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <Av name={doc.name} size={mob ? 50 : 64} variant={doc.av} />
          <div>
            <div style={{ fontSize: mob ? 18 : 22, fontWeight: 800 }}>Bun venit, {doc.name.replace('Dr. ', '')}</div>
            <div style={{ fontSize: 13, opacity: .8, marginTop: 3 }}>{doc.spec} · {doc.exp}</div>
          </div>
        </div>
      </div>
      <div style={{ display: 'flex', gap: 8 }}>
        <button className="btn-g" style={{ flex: 1, justifyContent: 'center' }} onClick={() => setShowQR(true)}><Ic n="qr" s={14} /> Link & QR</button>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: mob ? '1fr 1fr' : 'repeat(4,1fr)', gap: mob ? 10 : 16 }}>
        {[{ l: 'Pacienți', v: pats.length, ic: 'users', c: T.blue, bg: '#EFF6FF', p: 'patients' },
          { l: 'Programări', v: appts.length, ic: 'cal', c: T.cyan, bg: T.cyanDim, p: 'appointments' },
          { l: 'Așteptare', v: appts.filter(a => a.status === 'În așteptare').length, ic: 'clock', c: T.warning, bg: T.warningBg, p: 'appointments' },
          { l: 'Mesaje', v: unread, ic: 'msg', c: T.purple, bg: T.purpleBg, p: 'messages' }].map((s, i) => (
          <StatBox key={i} {...s} onClick={() => setPage(s.p)} />
        ))}
      </div>
    </div>
  )

  const Pat = () => {
    const [q, setQ] = useState('')
    const list = pats.filter(p => !q || p.name.toLowerCase().includes(q.toLowerCase()))
    return (
      <div className="fade-up">
        <div className="sb" style={{ marginBottom: 14 }}><Ic n="srch" s={14} c={T.inkFaint} /><input placeholder="Caută..." value={q} onChange={e => setQ(e.target.value)} /></div>
        <div style={{ fontSize: 13, color: T.inkLight, marginBottom: 10 }}>Apasă pe un pacient pentru istoricul complet:</div>
        {list.length === 0 ? <div className="card"><Empty icon="users" title="Niciun pacient" desc="" /></div> : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {list.map(p => {
              const pa = appts.filter(a => a.patientId === p.id)
              return (
                <div key={p.id} className="card" style={{ padding: 16, cursor: 'pointer' }} onClick={() => setViewPatId(p.id)}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <Av name={p.name} size={42} variant="green" />
                    <div style={{ flex: 1 }}>
                      <div style={{ fontWeight: 600 }}>{p.name}</div>
                      <div style={{ fontSize: 12, color: T.inkLight }}>{age(p.dob)} ani · {pa.length} vizite · {pa.filter(a => a.status === 'Finalizată').length} finalizate</div>
                    </div>
                    <Tag v={PSTATUS[p.status] || 'default'} dot>{p.status}</Tag>
                    <Ic n="eye" s={16} c={T.blue} />
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    )
  }

  const Appts = () => {
    const [flt, setFlt] = useState('all')
    const list = [...appts].filter(a => flt === 'all' || a.status === flt).sort((a, b) => b.date.localeCompare(a.date))
    const updateStatus = async (id, status) => {
      await supabase.from('appointments').update({ status }).eq('id', id)
      showToast(status === 'Anulată' ? 'Anulată' : 'Finalizată', status === 'Anulată' ? 'info' : 'success')
      await fetchAll()
    }
    return (
      <div className="fade-up">
        <div style={{ display: 'flex', gap: 6, marginBottom: 14, overflowX: 'auto', paddingBottom: 4 }}>
          {['all', ...Object.keys(ASTATUS)].map(s => <button key={s} className={`chip ${flt === s ? 'on' : ''}`} onClick={() => setFlt(s)}>{s === 'all' ? 'Toate' : s}</button>)}
        </div>
        {list.length === 0 ? <div className="card"><Empty icon="cal" title="Nimic" desc="" /></div> : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {list.map(a => (
              <div key={a.id} className="card" style={{ padding: 16 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
                  <div style={{ background: `linear-gradient(135deg,${T.blue},${T.cyan})`, borderRadius: T.r8, padding: '7px 10px', textAlign: 'center' }}>
                    <div style={{ fontSize: 14, fontWeight: 700, color: '#fff' }}>{a.time}</div>
                    <div style={{ fontSize: 10, color: 'rgba(255,255,255,.7)' }}>{fmtS(a.date)}</div>
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 600 }}>{a.patient}</div>
                    <div style={{ fontSize: 12, color: T.inkLight }}>{a.type}</div>
                  </div>
                  <Tag v={ATYPE[a.type] || 'blue'} dot>{a.type}</Tag>
                </div>
                <div style={{ display: 'flex', gap: 8 }}>
                  {a.status !== 'Anulată' && a.status !== 'Finalizată' && (
                    <button className="btn-d" style={{ flex: 1, justifyContent: 'center' }} onClick={() => updateStatus(a.id, 'Anulată')}>Anulează</button>
                  )}
                  {a.status === 'Confirmată' && (
                    <button className="btn-s" style={{ flex: 1, justifyContent: 'center' }} onClick={() => updateStatus(a.id, 'Finalizată')}>Finalizează</button>
                  )}
                  {a.status === 'În așteptare' && (
                    <button className="btn-s" style={{ flex: 1, justifyContent: 'center' }} onClick={() => updateStatus(a.id, 'Confirmată')}>Confirmă</button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    )
  }

  const MsgsD = () => {
    const [nm, setNm] = useState('')
    const [selP, setSelP] = useState(myPat[0]?.id || pats[0]?.id || null)
    const conv = msgs.filter(m => (m.fromRole === 'doctor' && m.fromId === doc.id && m.toId === selP) || (m.toRole === 'doctor' && m.toId === doc.id && m.fromId === selP)).sort((a, b) => a.id - b.id)
    const patList = pats.length > 0 ? pats : myPat
    const send = async () => {
      if (!nm.trim() || !selP) return
      const p = pats.find(x => x.id === selP)
      await supabase.from('messages').insert({
        from_name: doc.name, from_role: 'doctor', from_id: doc.id,
        to_name: p?.name || '', to_role: 'patient', to_id: selP,
        text: nm, date: new Date().toISOString().slice(0, 10), is_read: false,
      })
      setNm(''); showToast('Trimis'); await fetchAll()
    }
    return (
      <div className="fade-up">
        <FF label="Pacient">
          <select className="sel" value={selP || ''} onChange={e => setSelP(Number(e.target.value))}>
            {patList.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
          </select>
        </FF>
        <div className="card" style={{ marginTop: 14, minHeight: 300, display: 'flex', flexDirection: 'column' }}>
          <div style={{ flex: 1, padding: 16, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 10 }}>
            {conv.length === 0 ? <Empty icon="msg" title="Niciun mesaj" desc="" /> : conv.map(m => (
              <div key={m.id} style={{ display: 'flex', justifyContent: m.fromRole === 'doctor' && m.fromId === doc.id ? 'flex-end' : 'flex-start' }}>
                <div style={{ maxWidth: '75%', padding: '10px 14px', borderRadius: T.r12, background: m.fromRole === 'doctor' && m.fromId === doc.id ? `linear-gradient(135deg,${T.blue},${T.blueDark})` : T.surfaceAlt, color: m.fromRole === 'doctor' && m.fromId === doc.id ? '#fff' : T.ink, fontSize: 14, lineHeight: 1.5 }}>
                  {m.text}<div style={{ fontSize: 10, marginTop: 4, opacity: .6 }}>{fmt(m.date)}</div>
                </div>
              </div>
            ))}
          </div>
          <div style={{ borderTop: `1px solid ${T.border}`, padding: 12, display: 'flex', gap: 8 }}>
            <input className="inp" placeholder="Scrie..." value={nm} onChange={e => setNm(e.target.value)} onKeyDown={e => e.key === 'Enter' && send()} style={{ flex: 1 }} />
            <button className="btn-p" onClick={send} disabled={!nm.trim()}><Ic n="msg" s={14} c="#fff" /></button>
          </div>
        </div>
      </div>
    )
  }

  const RxD = () => {
    const [show, setShow] = useState(false)
    const [form, setForm] = useState({ patientId: pats[0]?.id || 0, diagnosis: '', medicines: '' })
    const add = async () => {
      if (!form.diagnosis || !form.medicines) return
      const p = pats.find(x => x.id === form.patientId)
      await supabase.from('prescriptions').insert({
        patient_id: form.patientId, doctor_id: doc.id,
        patient_name: p?.name || '', doctor_name: doc.name,
        date: new Date().toISOString().slice(0, 10),
        medicines: form.medicines, diagnosis: form.diagnosis, status: 'Activă',
      })
      setShow(false)
      setForm({ patientId: pats[0]?.id || 0, diagnosis: '', medicines: '' })
      showToast('Rețetă emisă'); await fetchAll()
    }
    return (
      <div className="fade-up">
        <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 14 }}>
          <button className="btn-p" onClick={() => setShow(true)}><Ic n="plus" s={15} c="#fff" /> Rețetă</button>
        </div>
        {show && (
          <div className="ovl" onClick={e => e.target === e.currentTarget && setShow(false)}>
            <div className="modal" style={{ padding: 24 }}>
              <div style={{ fontWeight: 700, fontSize: 17, marginBottom: 16 }}>Rețetă nouă</div>
              <FG mob={mob}>
                <FF label="Pacient" required>
                  <select className="sel" value={form.patientId} onChange={e => setForm(f => ({ ...f, patientId: Number(e.target.value) }))}>
                    {pats.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                  </select>
                </FF>
                <FF label="Diagnostic" required><input className="inp" value={form.diagnosis} onChange={e => setForm(f => ({ ...f, diagnosis: e.target.value }))} /></FF>
                <div style={{ gridColumn: '1/-1' }}>
                  <FF label="Medicamente" required><textarea className="inp" rows={3} value={form.medicines} onChange={e => setForm(f => ({ ...f, medicines: e.target.value }))} /></FF>
                </div>
              </FG>
              <div style={{ display: 'flex', gap: 10, marginTop: 16 }}>
                <button className="btn-g" onClick={() => setShow(false)}>Anulează</button>
                <button className="btn-p" onClick={add} style={{ flex: 1 }} disabled={!form.diagnosis || !form.medicines}>Emite</button>
              </div>
            </div>
          </div>
        )}
        {rxs.length === 0 ? <div className="card"><Empty icon="file" title="Nicio rețetă" desc="" /></div> : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {rxs.map(r => (
              <div key={r.id} className="card" style={{ padding: 16 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                  <span style={{ fontWeight: 700 }}>{r.patientName}</span>
                  <Tag v={r.status === 'Activă' ? 'green' : 'default'}>{r.status}</Tag>
                </div>
                <div style={{ fontSize: 14, fontWeight: 600, color: T.blue }}>{r.diagnosis}</div>
                <div style={{ fontSize: 13, color: T.inkMid, marginTop: 4 }}>{r.medicines}</div>
              </div>
            ))}
          </div>
        )}
      </div>
    )
  }

  const titles = { dashboard: 'Cabinet Medical', patients: 'Pacienții Mei', appointments: 'Programări', messages: 'Mesaje', prescriptions: 'Rețete' }
  const content = { dashboard: <Dash />, patients: <Pat />, appointments: <Appts />, messages: <MsgsD />, prescriptions: <RxD /> }

  return (
    <div style={{ minHeight: '100vh', background: T.bg }}>
      <Header name={doc.name} variant={doc.av} role="doctor" onLogout={onLogout} mob={mob} />
      <main style={{ padding: mob ? '16px 16px 80px' : '24px 28px', maxWidth: 900, margin: '0 auto' }}>
        <h1 style={{ fontSize: mob ? 20 : 22, fontWeight: 800, marginBottom: 16 }}>{titles[page]}</h1>
        {content[page]}
      </main>
      <BNav items={nav} active={page} set={setPage} />
      {showQR && <QRModal onClose={() => setShowQR(false)} title={`Programare — ${doc.name}`} linkText={`doctor/${doc.id}`} />}
    </div>
  )
}
