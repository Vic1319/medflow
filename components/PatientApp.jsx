'use client'
import { useState, useEffect, useCallback } from 'react'
import { supabase } from '@/lib/supabase'
import { T, age, fmt, fmtS, mapDoctor, mapPatient, mapAppt, mapMsg, mapRx, mapService, generateSlots, ASTATUS } from '@/lib/theme'
import { Ic, Tag, Av, Empty, FF, FG, Header, BNav, useIsMobile } from '@/components/ui'
import HistoryReport from '@/components/HistoryReport'

export default function PatientApp({ profile, onLogout, showToast }) {
  const mob = useIsMobile()
  const [pat, setPat] = useState(null)
  const [appts, setAppts] = useState([])
  const [rxs, setRxs] = useState([])
  const [msgs, setMsgs] = useState([])
  const [docs, setDocs] = useState([])
  const [svcs, setSvcs] = useState([])
  const [page, setPage] = useState('dashboard')
  const [showBook, setShowBook] = useState(false)
  const [viewDocId, setViewDocId] = useState(null)
  const [loading, setLoading] = useState(true)

  const fetchAll = useCallback(async () => {
    const pid = profile.patient_id
    const [patRes, apptsRes, rxsRes, msgsRes, docsRes, svcsRes] = await Promise.all([
      supabase.from('patients').select('*').eq('id', pid).single(),
      supabase.from('appointments').select('*').eq('patient_id', pid),
      supabase.from('prescriptions').select('*').eq('patient_id', pid),
      supabase.from('messages').select('*').or(`and(from_role.eq.patient,from_id.eq.${pid}),and(to_role.eq.patient,to_id.eq.${pid})`),
      supabase.from('doctors').select('*').eq('is_active', true),
      supabase.from('services').select('*').eq('is_active', true),
    ])
    if (patRes.data) setPat(mapPatient(patRes.data))
    setAppts((apptsRes.data || []).map(mapAppt))
    setRxs((rxsRes.data || []).map(mapRx))
    setMsgs((msgsRes.data || []).map(mapMsg))
    setDocs((docsRes.data || []).map(mapDoctor))
    setSvcs((svcsRes.data || []).map(mapService))
    setLoading(false)
  }, [profile.patient_id])

  useEffect(() => { fetchAll() }, [fetchAll])

  function BookingModal({ onClose, preDocId, preServiceId }) {
    const [selSvc, setSelSvc] = useState(preServiceId || svcs[0]?.id || 0)
    const [selDoc, setSelDoc] = useState(preDocId || docs[0]?.id || 0)
    const [date, setDate] = useState('')
    const [selSlot, setSelSlot] = useState('')
    const [busySlots, setBusySlots] = useState([])
    const [loadingSlots, setLoadingSlots] = useState(false)

    // Toți doctorii activi — fără filtru pe servicii pentru a include și doctorii noi
    const avDocs = docs.filter(d => d.on)

    useEffect(() => {
      if (!preDocId && avDocs.length > 0 && !avDocs.find(d => d.id === selDoc)) setSelDoc(avDocs[0].id)
    }, [])

    // Când se schimbă doctorul sau data, fetch sloturi ocupate
    useEffect(() => {
      if (!selDoc || !date) { setBusySlots([]); setSelSlot(''); return }
      setLoadingSlots(true)
      supabase.from('appointments').select('time').eq('doctor_id', selDoc).eq('date', date).neq('status', 'Anulată')
        .then(({ data }) => {
          setBusySlots((data || []).map(a => a.time))
          setSelSlot('')
          setLoadingSlots(false)
        })
    }, [selDoc, date])

    const docData = docs.find(d => d.id === selDoc)
    const dayName = date ? ['Duminică','Luni','Marți','Miercuri','Joi','Vineri','Sâmbătă'][new Date(date + 'T12:00').getDay()] : null
    const scheduleStr = dayName && docData?.schedule?.[dayName]
    const allSlots = generateSlots(scheduleStr)
    const freeSlots = allSlots.filter(s => !busySlots.includes(s))

    const book = async () => {
      if (!date || !selDoc || !selSlot) return
      const doc = docs.find(d => d.id === selDoc)
      const svc = svcs.find(s => s.id === selSvc)
      const { error } = await supabase.from('appointments').insert({
        patient_name: pat.name, patient_id: pat.id,
        doctor_name: doc.name, doctor_id: doc.id,
        date, time: selSlot,
        type: svc?.name || 'Consultație',
        status: 'În așteptare', room: 'Sala 1',
        service_id: selSvc || null,
      })
      if (!error) {
        showToast('Programare creată!')
        await fetchAll()
        onClose()
      } else showToast('Eroare la programare', 'error')
    }

    const today = new Date().toISOString().slice(0, 10)

    return (
      <div className="ovl" onClick={e => e.target === e.currentTarget && onClose()}>
        <div className="modal" style={{ padding: 24 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
            <span style={{ fontWeight: 700, fontSize: 17 }}>Programare nouă</span>
            <button className="btn-g" style={{ padding: 6 }} onClick={onClose}><Ic n="x" s={15} /></button>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            {!preServiceId && svcs.length > 0 && (
              <FF label="Serviciu">
                <select className="sel" value={selSvc} onChange={e => setSelSvc(Number(e.target.value))}>
                  <option value={0}>— Selectează serviciu —</option>
                  {svcs.map(s => <option key={s.id} value={s.id}>{s.name} — {s.price}</option>)}
                </select>
              </FF>
            )}
            {!preDocId && (
              <FF label="Medic" required>
                <select className="sel" value={selDoc} onChange={e => setSelDoc(Number(e.target.value))}>
                  {avDocs.length === 0 ? <option>Niciun medic disponibil</option> : avDocs.map(d => <option key={d.id} value={d.id}>{d.name} — {d.spec}</option>)}
                </select>
              </FF>
            )}
            <FF label="Data" required>
              <input className="inp" type="date" min={today} value={date} onChange={e => setDate(e.target.value)} />
            </FF>

            {date && selDoc && (
              <FF label="Interval orar" required>
                {loadingSlots ? (
                  <div style={{ fontSize: 13, color: T.inkLight, padding: 10 }}>Se verifică disponibilitatea...</div>
                ) : allSlots.length === 0 ? (
                  <div style={{ fontSize: 13, color: T.warning, padding: 10, background: T.warningBg, borderRadius: T.r8 }}>
                    Medicul nu lucrează în această zi. Alege altă dată.
                  </div>
                ) : freeSlots.length === 0 ? (
                  <div style={{ fontSize: 13, color: T.danger, padding: 10, background: T.dangerBg, borderRadius: T.r8 }}>
                    Toate intervalele sunt ocupate. Alege altă dată.
                  </div>
                ) : (
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                    {allSlots.map(slot => {
                      const busy = busySlots.includes(slot)
                      const selected = selSlot === slot
                      return (
                        <button key={slot} onClick={() => !busy && setSelSlot(slot)} style={{
                          padding: '6px 12px', borderRadius: T.r8, fontSize: 13, fontWeight: 600, cursor: busy ? 'not-allowed' : 'pointer', border: '1.5px solid',
                          borderColor: busy ? T.border : selected ? T.blue : T.border,
                          background: busy ? T.surfaceAlt : selected ? '#EFF6FF' : T.surface,
                          color: busy ? T.inkFaint : selected ? T.blue : T.inkMid,
                          textDecoration: busy ? 'line-through' : 'none',
                          opacity: busy ? 0.5 : 1,
                        }}>{slot}</button>
                      )
                    })}
                  </div>
                )}
              </FF>
            )}
          </div>

          <button className="btn-p" style={{ width: '100%', justifyContent: 'center', marginTop: 16, padding: 14, background: `linear-gradient(135deg,${T.success},#047857)` }} onClick={book} disabled={!date || !selDoc || !selSlot}>
            Confirmă programarea {selSlot && `— ${selSlot}`}
          </button>
        </div>
      </div>
    )
  }

  if (loading || !pat) return <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Ic n="act" s={24} c={T.blue} /></div>

  const myDocIds = [...new Set(appts.map(a => a.doctorId))]
  const myDocs = myDocIds.map(id => docs.find(d => d.id === id)).filter(Boolean)
  const unread = msgs.filter(m => !m.read && m.toRole === 'patient').length
  const nav = [
    { id: 'dashboard', l: 'Acasă', ic: 'home', badge: 0 },
    { id: 'appointments', l: 'Programări', ic: 'cal', badge: 0 },
    { id: 'services', l: 'Servicii', ic: 'svc', badge: 0 },
    { id: 'doctors', l: 'Medici', ic: 'steth', badge: 0 },
    { id: 'messages', l: 'Mesaje', ic: 'msg', badge: unread },
  ]

  if (viewDocId) {
    const vDoc = docs.find(d => d.id === viewDocId)
    if (!vDoc) return null
    return (
      <div style={{ minHeight: '100vh', background: T.bg }}>
        <Header name={pat.name} variant="green" role="patient" onLogout={onLogout} mob={mob} />
        <main style={{ padding: mob ? '16px 16px 80px' : '24px 28px', maxWidth: 700, margin: '0 auto' }}>
          <HistoryReport title={`Istoric cu ${vDoc.name}`} patient={pat} doctorFilter={vDoc.id} allAppts={appts} allRx={rxs} allMsgs={msgs} allDocs={docs} mob={mob} onBack={() => setViewDocId(null)} />
        </main>
        <BNav items={nav} active={page} set={p => { setViewDocId(null); setPage(p) }} />
        {showBook && <BookingModal onClose={() => setShowBook(false)} preDocId={typeof showBook === 'object' ? showBook.docId : null} preServiceId={typeof showBook === 'object' ? showBook.svcId : null} />}
      </div>
    )
  }

  const Dash = () => (
    <div className="fade-up" style={{ display: 'flex', flexDirection: 'column', gap: mob ? 14 : 20 }}>
      <div className="card" style={{ padding: mob ? 16 : 24, background: `linear-gradient(135deg,${T.success},#047857)`, color: '#fff', border: 'none' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <Av name={pat.name} size={mob ? 50 : 64} variant="green" />
          <div>
            <div style={{ fontSize: mob ? 18 : 22, fontWeight: 800 }}>Bun venit, {pat.name.split(' ')[0]}</div>
            <div style={{ fontSize: 13, opacity: .8, marginTop: 3 }}>{pat.name}{pat.dob ? ` · ${age(pat.dob)} ani` : ''}</div>
          </div>
        </div>
      </div>
      <button className="btn-p" style={{ width: '100%', justifyContent: 'center', padding: 14, background: `linear-gradient(135deg,${T.success},#047857)` }} onClick={() => setShowBook(true)}>
        <Ic n="cal" s={16} c="#fff" /> Programează-te
      </button>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
        {[{ l: 'Programări', v: appts.length, ic: 'cal', c: T.cyan, bg: T.cyanDim, p: 'appointments' },
          { l: 'Rețete active', v: rxs.filter(r => r.status === 'Activă').length, ic: 'file', c: T.purple, bg: T.purpleBg, p: null },
          { l: 'Medici vizitați', v: myDocs.length, ic: 'steth', c: T.blue, bg: '#EFF6FF', p: 'doctors' },
          { l: 'Servicii', v: svcs.length, ic: 'svc', c: T.success, bg: T.successBg, p: 'services' }].map((s, i) => (
          <div key={i} className="card" style={{ padding: 14, borderTop: `4px solid ${s.c}`, cursor: s.p ? 'pointer' : 'default' }} onClick={() => s.p && setPage(s.p)}>
            <div style={{ width: 34, height: 34, borderRadius: T.r12, background: s.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 6 }}><Ic n={s.ic} s={16} c={s.c} /></div>
            <div style={{ fontSize: 22, fontWeight: 800 }}>{s.v}</div>
            <div style={{ fontSize: 11, color: T.inkLight }}>{s.l}</div>
          </div>
        ))}
      </div>
    </div>
  )

  const Appts = () => (
    <div className="fade-up">
      <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 14 }}>
        <button className="btn-p" style={{ background: `linear-gradient(135deg,${T.success},#047857)` }} onClick={() => setShowBook(true)}><Ic n="plus" s={15} c="#fff" /> Programare</button>
      </div>
      {appts.length === 0 ? <div className="card"><Empty icon="cal" title="Nicio programare" desc="" /></div> : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {[...appts].sort((a, b) => b.date.localeCompare(a.date)).map(a => (
            <div key={a.id} className="card" style={{ padding: 14 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <div style={{ background: `linear-gradient(135deg,${T.success},#047857)`, borderRadius: T.r8, padding: '6px 10px', textAlign: 'center' }}>
                  <div style={{ fontSize: 13, fontWeight: 700, color: '#fff' }}>{a.time}</div>
                  <div style={{ fontSize: 9, color: 'rgba(255,255,255,.7)' }}>{fmtS(a.date)}</div>
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 600, fontSize: 13 }}>{a.type}</div>
                  <div style={{ fontSize: 12, color: T.inkLight }}>{a.doctor}</div>
                </div>
                <Tag v={ASTATUS[a.status] || 'default'} dot>{a.status}</Tag>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )

  const Svcs = () => (
    <div className="fade-up">
      {svcs.length === 0 ? <div className="card"><Empty icon="svc" title="Niciun serviciu" desc="" /></div> : svcs.map(s => {
        const sd = docs.filter(d => d.on && d.services?.includes(s.id))
        return (
          <div key={s.id} className="card" style={{ padding: 16, marginBottom: 10 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
              <span style={{ fontWeight: 700, fontSize: 15 }}>{s.name}</span>
              <Tag v="blue">{s.price}</Tag>
            </div>
            <div style={{ fontSize: 13, color: T.inkMid, marginBottom: 8 }}>{s.desc} · {s.duration}</div>
            <div style={{ fontSize: 12, color: T.inkLight, marginBottom: 8 }}>Medici: {sd.length === 0 ? 'Toți medicii disponibili' : sd.map(d => d.name).join(', ')}</div>
            <button className="btn-p" style={{ width: '100%', justifyContent: 'center', fontSize: 13, padding: 10, background: `linear-gradient(135deg,${T.success},#047857)` }} onClick={() => setShowBook({ svcId: s.id })}>
              <Ic n="cal" s={14} c="#fff" /> Programează
            </button>
          </div>
        )
      })}
    </div>
  )

  const Doctors = () => (
    <div className="fade-up">
      <div style={{ fontSize: 14, color: T.inkMid, marginBottom: 14 }}>Medicii la care ai fost — apasă pentru istoricul complet:</div>
      {myDocs.length === 0 ? <div className="card"><Empty icon="steth" title="Niciun medic" desc="" /></div> : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {myDocs.map(d => {
            const da = appts.filter(a => a.doctorId === d.id)
            return (
              <div key={d.id} className="card" style={{ padding: 16, cursor: 'pointer' }} onClick={() => setViewDocId(d.id)}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <Av name={d.name} size={48} variant={d.av || 'blue'} />
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 700 }}>{d.name}</div>
                    <div style={{ fontSize: 12, color: T.inkMid }}>{d.spec}</div>
                    <div style={{ fontSize: 12, color: T.inkLight, marginTop: 2 }}>{da.length} vizite · {da.filter(a => a.status === 'Finalizată').length} finalizate</div>
                  </div>
                  {d.name === pat.doctor && <Tag v="cyan" dot>Curant</Tag>}
                  <Ic n="eye" s={16} c={T.blue} />
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )

  const Messages = () => {
    const [nm, setNm] = useState('')
    const myDoc = docs.find(d => d.name === pat.doctor)
    const conv = [...msgs].sort((a, b) => a.id - b.id)
    const send = async () => {
      if (!nm.trim() || !myDoc) return
      await supabase.from('messages').insert({
        from_name: pat.name, from_role: 'patient', from_id: pat.id,
        to_name: myDoc.name, to_role: 'doctor', to_id: myDoc.id,
        text: nm, date: new Date().toISOString().slice(0, 10), is_read: false,
      })
      setNm(''); showToast('Trimis'); await fetchAll()
    }
    return (
      <div className="fade-up">
        <div style={{ fontSize: 13, color: T.inkLight, marginBottom: 10 }}>Cu: <strong>{myDoc?.name || '—'}</strong></div>
        <div className="card" style={{ minHeight: 300, display: 'flex', flexDirection: 'column' }}>
          <div style={{ flex: 1, padding: 16, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 10 }}>
            {conv.length === 0 ? <Empty icon="msg" title="Niciun mesaj" desc="" /> : conv.map(m => (
              <div key={m.id} style={{ display: 'flex', justifyContent: m.fromRole === 'patient' && m.fromId === pat.id ? 'flex-end' : 'flex-start' }}>
                <div style={{ maxWidth: '75%', padding: '10px 14px', borderRadius: T.r12, background: m.fromRole === 'patient' && m.fromId === pat.id ? `linear-gradient(135deg,${T.success},#047857)` : T.surfaceAlt, color: m.fromRole === 'patient' && m.fromId === pat.id ? '#fff' : T.ink, fontSize: 14, lineHeight: 1.5 }}>
                  {m.text}<div style={{ fontSize: 10, marginTop: 4, opacity: .6 }}>{fmt(m.date)}</div>
                </div>
              </div>
            ))}
          </div>
          <div style={{ borderTop: `1px solid ${T.border}`, padding: 12, display: 'flex', gap: 8 }}>
            <input className="inp" placeholder="Scrie..." value={nm} onChange={e => setNm(e.target.value)} onKeyDown={e => e.key === 'Enter' && send()} style={{ flex: 1 }} />
            <button className="btn-p" style={{ background: `linear-gradient(135deg,${T.success},#047857)` }} onClick={send} disabled={!nm.trim()}><Ic n="msg" s={14} c="#fff" /></button>
          </div>
        </div>
      </div>
    )
  }

  const titles = { dashboard: 'Cabinetul Meu', appointments: 'Programări', services: 'Servicii', doctors: 'Medicii Mei', messages: 'Mesaje' }
  const content = { dashboard: <Dash />, appointments: <Appts />, services: <Svcs />, doctors: <Doctors />, messages: <Messages /> }

  return (
    <div style={{ minHeight: '100vh', background: T.bg }}>
      <Header name={pat.name} variant="green" role="patient" onLogout={onLogout} mob={mob} />
      <main style={{ padding: mob ? '16px 16px 80px' : '24px 28px', maxWidth: 700, margin: '0 auto' }}>
        <h1 style={{ fontSize: mob ? 20 : 22, fontWeight: 800, marginBottom: 16 }}>{titles[page]}</h1>
        {content[page]}
      </main>
      <BNav items={nav} active={page} set={setPage} />
      {showBook && <BookingModal onClose={() => setShowBook(false)} preDocId={typeof showBook === 'object' ? showBook.docId : null} preServiceId={typeof showBook === 'object' ? showBook.svcId : null} />}
    </div>
  )
}
