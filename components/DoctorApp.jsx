'use client'
import { useState, useEffect, useCallback } from 'react'
import { supabase } from '@/lib/supabase'
import { T, age, fmt, fmtS, mapDoctor, mapPatient, mapAppt, mapMsg, mapRx, mapMedRecord, PSTATUS, ASTATUS, ATYPE } from '@/lib/theme'
import { Ic, Tag, Av, Empty, FF, FG, StatBox, Header, BNav, QRModal, useIsMobile } from '@/components/ui'
import HistoryReport from '@/components/HistoryReport'
import MedicalRecordForm from '@/components/MedicalRecordForm'
import ScheduleEditor from '@/components/ScheduleEditor'

export default function DoctorApp({ profile, onLogout, showToast }) {
  const mob = useIsMobile()
  const [doc, setDoc] = useState(null)
  const [pats, setPats] = useState([])
  const [appts, setAppts] = useState([])
  const [msgs, setMsgs] = useState([])
  const [rxs, setRxs] = useState([])
  const [medRecords, setMedRecords] = useState([])
  const [page, setPage] = useState('dashboard')
  const [showQR, setShowQR] = useState(false)
  const [showSchedule, setShowSchedule] = useState(false)
  const [viewPatId, setViewPatId] = useState(null)
  const [openRecord, setOpenRecord] = useState(null) // { appt, record|null }
  const [loading, setLoading] = useState(true)

  const fetchAll = useCallback(async () => {
    const did = profile.doctor_id
    const [docRes, apptsRes, msgsRes, rxsRes, recRes] = await Promise.all([
      supabase.from('doctors').select('*').eq('id', did).single(),
      supabase.from('appointments').select('*').eq('doctor_id', did),
      supabase.from('messages').select('*').or(`and(from_role.eq.doctor,from_id.eq.${did}),and(to_role.eq.doctor,to_id.eq.${did})`),
      supabase.from('prescriptions').select('*').eq('doctor_id', did),
      supabase.from('medical_records').select('*').eq('doctor_id', did),
    ])
    const docData = docRes.data ? mapDoctor(docRes.data) : null
    setDoc(docData)
    const mappedAppts = (apptsRes.data || []).map(mapAppt)
    setAppts(mappedAppts)
    setMsgs((msgsRes.data || []).map(mapMsg))
    setRxs((rxsRes.data || []).map(mapRx))
    setMedRecords((recRes.data || []).map(mapMedRecord))

    const patIds = [...new Set(mappedAppts.map(a => a.patientId))].filter(Boolean)
    if (patIds.length > 0) {
      const { data: patsData } = await supabase.from('patients').select('*').in('id', patIds)
      setPats((patsData || []).map(mapPatient))
    } else setPats([])
    setLoading(false)
  }, [profile.doctor_id])

  useEffect(() => { fetchAll() }, [fetchAll])

  // Auto-creare fișă de control la deschidere dacă nu există
  const openMedRecord = async (appt) => {
    let record = medRecords.find(r => r.appointmentId === appt.id)
    if (!record) {
      const { data } = await supabase.from('medical_records').insert({
        appointment_id: appt.id, patient_id: appt.patientId,
        doctor_id: appt.doctorId, patient_name: appt.patient, doctor_name: appt.doctor,
      }).select().single()
      if (data) { record = mapMedRecord(data); setMedRecords(r => [...r, record]) }
    }
    setOpenRecord({ appt, record })
  }

  if (loading || !doc) return <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Ic n="act" s={24} c={T.blue} /></div>

  const unread = msgs.filter(m => !m.read && m.toRole === 'doctor').length
  const myPat = pats.filter(p => p.doctor === doc.name)
  const pendingRecords = medRecords.filter(r => r.status !== 'completed').length
  const nav = [
    { id: 'dashboard', l: 'Acasă', ic: 'home', badge: 0 },
    { id: 'patients', l: 'Pacienți', ic: 'users', badge: 0 },
    { id: 'appointments', l: 'Programări', ic: 'cal', badge: 0 },
    { id: 'records', l: 'Fișe', ic: 'clip', badge: pendingRecords },
    { id: 'messages', l: 'Mesaje', ic: 'msg', badge: unread },
  ]

  if (viewPatId) {
    const vPat = pats.find(p => p.id === viewPatId)
    if (!vPat) return null
    return (
      <div style={{ minHeight: '100vh', background: T.bg }}>
        <Header name={doc.name} variant={doc.av} role="doctor" onLogout={onLogout} mob={mob} />
        <main style={{ padding: mob ? '16px 16px 80px' : '24px 28px', maxWidth: 900, margin: '0 auto' }}>
          <HistoryReport title={`Istoricul complet — ${vPat.name}`} patient={vPat} doctorFilter={doc.id} allAppts={appts} allRx={rxs} allMsgs={msgs} allDocs={[doc]} allMedRecords={medRecords} mob={mob} onBack={() => setViewPatId(null)} onOpenRecord={openMedRecord} />
        </main>
        <BNav items={nav} active={page} set={p => { setViewPatId(null); setPage(p) }} />
        {openRecord && <MedicalRecordForm record={openRecord.record} appt={openRecord.appt} onClose={() => setOpenRecord(null)} onSaved={fetchAll} />}
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
        <button className="btn-g" style={{ flex: 1, justifyContent: 'center' }} onClick={() => setShowSchedule(true)}><Ic n="cal" s={14} /> Program lucru</button>
        <button className="btn-p" style={{ flex: 1, justifyContent: 'center' }} onClick={() => setPage('records')}><Ic n="clip" s={14} c="#fff" /> Fișe de completat ({pendingRecords})</button>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: mob ? '1fr 1fr' : 'repeat(4,1fr)', gap: mob ? 10 : 16 }}>
        {[{ label: 'Pacienți', value: pats.length, icon: 'users', color: T.blue, bg: '#EFF6FF', p: 'patients' },
          { label: 'Programări', value: appts.length, icon: 'cal', color: T.cyan, bg: T.cyanDim, p: 'appointments' },
          { label: 'Fișe pending', value: pendingRecords, icon: 'clip', color: T.warning, bg: T.warningBg, p: 'records' },
          { label: 'Mesaje noi', value: unread, icon: 'msg', color: T.purple, bg: T.purpleBg, p: 'messages' }].map((s, i) => (
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
              const pRecs = medRecords.filter(r => r.patientId === p.id)
              const pPending = pRecs.filter(r => r.status !== 'completed').length
              return (
                <div key={p.id} className="card" style={{ padding: 16, cursor: 'pointer' }} onClick={() => setViewPatId(p.id)}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <Av name={p.name} size={42} variant="green" />
                    <div style={{ flex: 1 }}>
                      <div style={{ fontWeight: 600 }}>{p.name}</div>
                      <div style={{ fontSize: 12, color: T.inkLight }}>{age(p.dob)} ani · {pa.length} vizite · {pRecs.filter(r => r.status === 'completed').length} fișe completate</div>
                    </div>
                    <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
                      {pPending > 0 && <Tag v="yellow" dot>{pPending} pending</Tag>}
                      <Tag v={PSTATUS[p.status] || 'default'} dot>{p.status}</Tag>
                      <Ic n="eye" s={16} c={T.blue} />
                    </div>
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
      showToast(status === 'Anulată' ? 'Anulată' : status === 'Finalizată' ? 'Finalizată' : 'Confirmată', status === 'Anulată' ? 'info' : 'success')
      await fetchAll()
    }
    return (
      <div className="fade-up">
        <div style={{ display: 'flex', gap: 6, marginBottom: 14, overflowX: 'auto', paddingBottom: 4 }}>
          {['all', ...Object.keys(ASTATUS)].map(s => <button key={s} className={`chip ${flt === s ? 'on' : ''}`} onClick={() => setFlt(s)}>{s === 'all' ? 'Toate' : s}</button>)}
        </div>
        {list.length === 0 ? <div className="card"><Empty icon="cal" title="Nimic" desc="" /></div> : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {list.map(a => {
              const rec = medRecords.find(r => r.appointmentId === a.id)
              return (
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
                  <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                    {/* Buton fișă de control întotdeauna vizibil */}
                    <button className="btn-g" style={{ flex: 1, justifyContent: 'center', fontSize: 12, borderColor: rec?.status === 'completed' ? T.success : T.warning, color: rec?.status === 'completed' ? T.success : T.warning }} onClick={() => openMedRecord(a)}>
                      <Ic n="clip" s={13} c={rec?.status === 'completed' ? T.success : T.warning} />
                      {rec?.status === 'completed' ? 'Fișă completată' : rec?.status === 'draft' ? 'Continuă fișa' : 'Completează fișa'}
                    </button>
                    {a.status !== 'Anulată' && a.status !== 'Finalizată' && (
                      <button className="btn-d" style={{ padding: '8px 12px' }} onClick={() => updateStatus(a.id, 'Anulată')}>Anulează</button>
                    )}
                    {a.status === 'În așteptare' && (
                      <button className="btn-s" style={{ padding: '8px 12px' }} onClick={() => updateStatus(a.id, 'Confirmată')}>Confirmă</button>
                    )}
                    {a.status === 'Confirmată' && (
                      <button className="btn-s" style={{ padding: '8px 12px' }} onClick={() => updateStatus(a.id, 'Finalizată')}>Finalizează</button>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    )
  }

  const Records = () => {
    const [flt, setFlt] = useState('all')
    const list = medRecords.filter(r => flt === 'all' || r.status === flt)
    return (
      <div className="fade-up">
        <div style={{ display: 'flex', gap: 6, marginBottom: 14, overflowX: 'auto', paddingBottom: 4 }}>
          {[['all','Toate'],['pending','Noi'],['draft','Ciorne'],['completed','Completate']].map(([v,l]) => (
            <button key={v} className={`chip ${flt === v ? 'on' : ''}`} onClick={() => setFlt(v)}>{l}</button>
          ))}
        </div>
        {list.length === 0 ? <div className="card"><Empty icon="clip" title="Nicio fișă" desc="Fișele se creează automat la programări" /></div> : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {list.map(r => {
              const appt = appts.find(a => a.id === r.appointmentId)
              return (
                <div key={r.id} className="card" style={{ padding: 16 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 10 }}>
                    <div style={{ width: 40, height: 40, borderRadius: T.r12, background: r.status === 'completed' ? T.successBg : T.warningBg, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <Ic n="clip" s={18} c={r.status === 'completed' ? T.success : T.warning} />
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontWeight: 700 }}>{r.patientName}</div>
                      <div style={{ fontSize: 12, color: T.inkLight }}>{appt ? `${fmt(appt.date)} · ${appt.time}` : '—'}</div>
                      {r.diagnostic && <div style={{ fontSize: 12, color: T.blue, marginTop: 2 }}>Dx: {r.diagnostic.slice(0, 60)}{r.diagnostic.length > 60 ? '...' : ''}</div>}
                    </div>
                    <Tag v={r.status === 'completed' ? 'green' : r.status === 'draft' ? 'yellow' : 'default'} dot>
                      {r.status === 'completed' ? 'Completată' : r.status === 'draft' ? 'Ciornă' : 'Nouă'}
                    </Tag>
                  </div>
                  <button className="btn-p" style={{ width: '100%', justifyContent: 'center', fontSize: 13 }} onClick={() => setOpenRecord({ appt, record: r })}>
                    <Ic n="edit" s={13} c="#fff" /> {r.status === 'completed' ? 'Vizualizează / Editează' : 'Completează fișa'}
                  </button>
                </div>
              )
            })}
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

  const titles = { dashboard: 'Cabinet Medical', patients: 'Pacienții Mei', appointments: 'Programări', records: 'Fișe de control', messages: 'Mesaje' }
  const content = { dashboard: <Dash />, patients: <Pat />, appointments: <Appts />, records: <Records />, messages: <MsgsD /> }

  return (
    <div style={{ minHeight: '100vh', background: T.bg }}>
      <Header name={doc.name} variant={doc.av} role="doctor" onLogout={onLogout} mob={mob} />
      <main style={{ padding: mob ? '16px 16px 80px' : '24px 28px', maxWidth: 900, margin: '0 auto' }}>
        <h1 style={{ fontSize: mob ? 20 : 22, fontWeight: 800, marginBottom: 16 }}>{titles[page]}</h1>
        {content[page]}
      </main>
      <BNav items={nav} active={page} set={setPage} />
      {showQR && <QRModal onClose={() => setShowQR(false)} title={`Programare — ${doc.name}`} linkText={`doctor/${doc.id}`} />}
      {showSchedule && <ScheduleEditor doc={doc} onClose={() => setShowSchedule(false)} onSaved={() => { fetchAll(); showToast('Program salvat!') }} />}
      {openRecord && <MedicalRecordForm record={openRecord.record} appt={openRecord.appt} onClose={() => setOpenRecord(null)} onSaved={fetchAll} />}
    </div>
  )
}
