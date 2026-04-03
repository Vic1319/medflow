'use client'
import { useState, useEffect, useCallback } from 'react'
import { supabase } from '@/lib/supabase'
import { T, age, fmtS, mapDoctor, mapPatient, mapAppt, mapMsg, mapRx, mapService, mapDelReq, PSTATUS, ASTATUS } from '@/lib/theme'
import { Ic, Tag, Av, Empty, FF, FG, StatBox, Header, BNav, QRModal, useIsMobile } from '@/components/ui'
import HistoryReport from '@/components/HistoryReport'
import ScheduleEditor from '@/components/ScheduleEditor'

export default function AdminApp({ profile, onLogout, showToast }) {
  const mob = useIsMobile()
  const [docs, setDocs] = useState([])
  const [pats, setPats] = useState([])
  const [appts, setAppts] = useState([])
  const [msgs, setMsgs] = useState([])
  const [rxs, setRxs] = useState([])
  const [svcs, setSvcs] = useState([])
  const [delReqs, setDelReqs] = useState([])
  const [page, setPage] = useState('dashboard')
  const [viewPatId, setViewPatId] = useState(null)
  const [showAddSvc, setShowAddSvc] = useState(false)
  const [svcForm, setSvcForm] = useState({ name: '', desc: '', price: '', duration: '', docIds: [] })
  const [showSvcQR, setShowSvcQR] = useState(false)
  const [editScheduleDoc, setEditScheduleDoc] = useState(null)
  const [loading, setLoading] = useState(true)

  const fetchAll = useCallback(async () => {
    const [docsRes, patsRes, apptsRes, msgsRes, rxsRes, svcsRes, reqsRes] = await Promise.all([
      supabase.from('doctors').select('*'),
      supabase.from('patients').select('*'),
      supabase.from('appointments').select('*'),
      supabase.from('messages').select('*'),
      supabase.from('prescriptions').select('*'),
      supabase.from('services').select('*'),
      supabase.from('delete_requests').select('*'),
    ])
    setDocs((docsRes.data || []).map(mapDoctor))
    setPats((patsRes.data || []).map(mapPatient))
    setAppts((apptsRes.data || []).map(mapAppt))
    setMsgs((msgsRes.data || []).map(mapMsg))
    setRxs((rxsRes.data || []).map(mapRx))
    setSvcs((svcsRes.data || []).map(mapService))
    setDelReqs((reqsRes.data || []).map(mapDelReq))
    setLoading(false)
  }, [])

  useEffect(() => { fetchAll() }, [fetchAll])

  if (loading) return <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Ic n="act" s={24} c={T.blue} /></div>

  const pendingReqs = delReqs.filter(r => r.status === 'pending').length
  const nav = [
    { id: 'dashboard', l: 'Panou', ic: 'home', badge: 0 },
    { id: 'patients', l: 'Pacienți', ic: 'users', badge: 0 },
    { id: 'doctors', l: 'Medici', ic: 'steth', badge: 0 },
    { id: 'appointments', l: 'Programări', ic: 'cal', badge: 0 },
    { id: 'services', l: 'Servicii', ic: 'svc', badge: 0 },
    { id: 'requests', l: 'Cereri', ic: 'bell', badge: pendingReqs },
  ]

  if (viewPatId) {
    const vPat = pats.find(p => p.id === viewPatId)
    if (!vPat) return null
    return (
      <div style={{ minHeight: '100vh', background: T.bg }}>
        <Header name="Admin Clinică" variant="orange" role="admin" onLogout={onLogout} mob={mob} />
        <main style={{ padding: mob ? '16px 16px 80px' : '24px 28px', maxWidth: 1000, margin: '0 auto' }}>
          <HistoryReport title={`Raport complet — ${vPat.name}`} patient={vPat} doctorFilter={null} allAppts={appts} allRx={rxs} allMsgs={msgs} allDocs={docs} mob={mob} onBack={() => setViewPatId(null)} />
        </main>
        <BNav items={nav} active={page} set={p => { setViewPatId(null); setPage(p) }} />
      </div>
    )
  }

  const Dash = () => (
    <div className="fade-up" style={{ display: 'flex', flexDirection: 'column', gap: mob ? 14 : 20 }}>
      <div className="card" style={{ padding: mob ? 16 : 24, background: 'linear-gradient(135deg,#EA580C,#9A3412)', color: '#fff', border: 'none' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <Av name="Admin" size={mob ? 50 : 64} variant="orange" />
          <div>
            <div style={{ fontSize: mob ? 18 : 22, fontWeight: 800 }}>Panou Administrator</div>
            <div style={{ fontSize: 13, opacity: .8, marginTop: 3 }}>{pats.length} pacienți · {docs.length} medici · {svcs.length} servicii</div>
          </div>
        </div>
      </div>
      {pendingReqs > 0 && (
        <div className="card" style={{ padding: 16, borderLeft: `4px solid ${T.warning}`, cursor: 'pointer' }} onClick={() => setPage('requests')}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}><Ic n="bell" s={16} c={T.warning} /><span style={{ fontWeight: 700, color: T.warning }}>{pendingReqs} cereri în așteptare</span></div>
        </div>
      )}
      <div style={{ display: 'grid', gridTemplateColumns: mob ? '1fr 1fr' : 'repeat(4,1fr)', gap: mob ? 10 : 16 }}>
        {[{ l: 'Pacienți', v: pats.length, ic: 'users', c: T.blue, bg: '#EFF6FF', p: 'patients' },
          { l: 'Medici', v: docs.length, ic: 'steth', c: T.purple, bg: T.purpleBg, p: 'doctors' },
          { l: 'Programări', v: appts.length, ic: 'cal', c: T.cyan, bg: T.cyanDim, p: 'appointments' },
          { l: 'Servicii', v: svcs.length, ic: 'svc', c: T.success, bg: T.successBg, p: 'services' }].map((s, i) => (
          <StatBox key={i} {...s} onClick={() => setPage(s.p)} />
        ))}
      </div>
      <div className="card" style={{ padding: mob ? 16 : 24 }}>
        <div style={{ fontWeight: 700, marginBottom: 14 }}>Raport rapid</div>
        {[{ l: 'Programări finalizate', v: appts.filter(a => a.status === 'Finalizată').length, c: T.success },
          { l: 'Programări în așteptare', v: appts.filter(a => a.status === 'În așteptare').length, c: T.warning },
          { l: 'Programări anulate', v: appts.filter(a => a.status === 'Anulată').length, c: T.danger }].map(item => (
          <div key={item.l} style={{ marginBottom: 10 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}><span style={{ fontSize: 13, color: T.inkMid }}>{item.l}</span><span style={{ fontSize: 13, fontWeight: 700 }}>{item.v}/{appts.length}</span></div>
            <div className="pbar"><div className="pfill" style={{ width: `${(item.v / Math.max(appts.length, 1)) * 100}%`, background: item.c }} /></div>
          </div>
        ))}
      </div>
    </div>
  )

  const AllPat = () => {
    const [q, setQ] = useState('')
    const list = pats.filter(p => !q || p.name.toLowerCase().includes(q.toLowerCase()) || p.email?.toLowerCase().includes(q.toLowerCase()))
    const deletePat = async (id, e) => {
      e.stopPropagation()
      await supabase.from('patients').delete().eq('id', id)
      showToast('Pacient șters', 'info'); await fetchAll()
    }
    return (
      <div className="fade-up">
        <div className="sb" style={{ marginBottom: 14 }}><Ic n="srch" s={14} c={T.inkFaint} /><input placeholder="Caută pacient..." value={q} onChange={e => setQ(e.target.value)} /></div>
        <div style={{ fontSize: 13, color: T.inkLight, marginBottom: 10 }}>Apasă pe un pacient pentru raportul complet:</div>
        {list.map(p => {
          const pDocs = [...new Set(appts.filter(a => a.patientId === p.id).map(a => a.doctorId))].length
          return (
            <div key={p.id} className="card" style={{ padding: 14, marginBottom: 8, cursor: 'pointer' }} onClick={() => setViewPatId(p.id)}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <Av name={p.name} size={40} variant="green" />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontWeight: 600 }}>{p.name} <span style={{ fontWeight: 400, color: T.inkFaint, fontSize: 12 }}>({p.email})</span></div>
                  <div style={{ fontSize: 12, color: T.inkLight }}>{age(p.dob)} ani · {p.doctor} · {pDocs} medici</div>
                </div>
                <Tag v={PSTATUS[p.status] || 'default'} dot>{p.status}</Tag>
                <Ic n="eye" s={16} c={T.blue} />
                <button className="btn-d" style={{ padding: '6px 8px' }} onClick={e => deletePat(p.id, e)}><Ic n="trash" s={13} /></button>
              </div>
            </div>
          )
        })}
      </div>
    )
  }

  const AllDoc = () => {
    const toggleDoc = async (d) => {
      await supabase.from('doctors').update({ is_active: !d.on }).eq('id', d.id)
      showToast(d.on ? 'Dezactivat' : 'Activat'); await fetchAll()
    }
    const deleteDoc = async (id) => {
      await supabase.from('doctors').delete().eq('id', id)
      showToast('Medic șters', 'info'); await fetchAll()
    }
    return (
      <div className="fade-up">
        <div style={{ display: 'grid', gridTemplateColumns: mob ? '1fr' : '1fr 1fr', gap: 12 }}>
          {docs.map(d => {
            const dPats = pats.filter(p => p.doctor === d.name).length
            const dAppts = appts.filter(a => a.doctorId === d.id).length
            return (
              <div key={d.id} className="card" style={{ padding: 0, overflow: 'hidden' }}>
                <div style={{ height: 4, background: d.on ? `linear-gradient(90deg,${T.blue},${T.cyan})` : T.border }} />
                <div style={{ padding: 16 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
                    <Av name={d.name} size={48} variant={d.av} />
                    <div style={{ flex: 1 }}>
                      <div style={{ fontWeight: 700 }}>{d.name}</div>
                      <div style={{ fontSize: 12, color: T.inkMid }}>{d.spec} · {d.email}</div>
                    </div>
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 8, marginBottom: 12 }}>
                    {[['Pac.', dPats, T.blue], ['Prog.', dAppts, T.cyan], ['Exp.', d.exp, T.purple]].map(([k, v, c]) => (
                      <div key={k} style={{ background: T.surfaceAlt, border: `1px solid ${T.border}`, borderRadius: T.r8, padding: 8, textAlign: 'center' }}>
                        <div style={{ fontSize: 15, fontWeight: 800, color: c }}>{v}</div>
                        <div style={{ fontSize: 10, color: T.inkFaint }}>{k}</div>
                      </div>
                    ))}
                  </div>
                  <div style={{ display: 'flex', gap: 6 }}>
                    <button className="btn-g" style={{ flex: 1, justifyContent: 'center', fontSize: 12 }} onClick={() => setEditScheduleDoc(d)}><Ic n="cal" s={13} /> Program</button>
                    <button className="btn-g" style={{ flex: 1, justifyContent: 'center', fontSize: 12 }} onClick={() => toggleDoc(d)}>{d.on ? 'Dezactivează' : 'Activează'}</button>
                    <button className="btn-d" style={{ padding: '8px 10px' }} onClick={() => deleteDoc(d.id)}><Ic n="trash" s={13} /></button>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    )
  }

  const AllAppt = () => {
    const [flt, setFlt] = useState('all')
    const list = appts.filter(a => flt === 'all' || a.status === flt)
    const updateStatus = async (id, status) => {
      await supabase.from('appointments').update({ status }).eq('id', id)
      showToast('Actualizat'); await fetchAll()
    }
    const deleteAppt = async (id) => {
      await supabase.from('appointments').delete().eq('id', id)
      showToast('Șters', 'info'); await fetchAll()
    }
    return (
      <div className="fade-up">
        <div style={{ display: 'flex', gap: 6, marginBottom: 14, overflowX: 'auto', paddingBottom: 4 }}>
          {['all', ...Object.keys(ASTATUS)].map(s => <button key={s} className={`chip ${flt === s ? 'on' : ''}`} onClick={() => setFlt(s)}>{s === 'all' ? 'Toate' : s}</button>)}
        </div>
        {list.map(a => (
          <div key={a.id} className="card" style={{ padding: 14, marginBottom: 8 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
              <div style={{ background: 'linear-gradient(135deg,#EA580C,#9A3412)', borderRadius: T.r8, padding: '6px 10px', textAlign: 'center' }}>
                <div style={{ fontSize: 13, fontWeight: 700, color: '#fff' }}>{a.time}</div>
                <div style={{ fontSize: 9, color: 'rgba(255,255,255,.7)' }}>{fmtS(a.date)}</div>
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 600 }}>{a.patient}</div>
                <div style={{ fontSize: 12, color: T.inkLight }}>{a.doctor} · {a.type}</div>
              </div>
              <Tag v={ASTATUS[a.status] || 'default'} dot>{a.status}</Tag>
            </div>
            <div style={{ display: 'flex', gap: 8 }}>
              <select value={a.status} onChange={e => updateStatus(a.id, e.target.value)} style={{ flex: 1, border: `1.5px solid ${T.border}`, background: T.surface, borderRadius: T.r8, padding: 8, fontSize: 14, fontWeight: 700, outline: 'none' }}>
                {Object.keys(ASTATUS).map(s => <option key={s}>{s}</option>)}
              </select>
              <button className="btn-d" style={{ padding: '8px 10px' }} onClick={() => deleteAppt(a.id)}><Ic n="trash" s={13} /></button>
            </div>
          </div>
        ))}
      </div>
    )
  }

  const SvcsAdm = () => {
    const addSvc = async () => {
      if (!svcForm.name) return
      const { data: newSvc } = await supabase.from('services').insert({ name: svcForm.name, description: svcForm.desc, price: svcForm.price, duration: svcForm.duration, is_active: true }).select().single()
      if (newSvc && svcForm.docIds.length > 0) {
        for (const docId of svcForm.docIds) {
          const d = docs.find(x => x.id === docId)
          if (d) await supabase.from('doctors').update({ services: [...(d.services || []), newSvc.id] }).eq('id', docId)
        }
      }
      setShowAddSvc(false); setSvcForm({ name: '', desc: '', price: '', duration: '', docIds: [] })
      showToast('Adăugat!'); await fetchAll()
    }
    const toggleSvc = async (s) => {
      await supabase.from('services').update({ is_active: !s.active }).eq('id', s.id)
      showToast(s.active ? 'Dezactivat' : 'Activat'); await fetchAll()
    }
    const deleteSvc = async (id) => {
      await supabase.from('services').delete().eq('id', id)
      showToast('Șters', 'info'); await fetchAll()
    }
    return (
      <div className="fade-up">
        <div style={{ display: 'flex', gap: 8, marginBottom: 14, justifyContent: 'space-between' }}>
          <button className="btn-g" onClick={() => setShowSvcQR(true)}><Ic n="qr" s={14} /> QR Servicii</button>
          <button className="btn-p" onClick={() => setShowAddSvc(true)}><Ic n="plus" s={15} c="#fff" /> Serviciu nou</button>
        </div>
        {svcs.map(s => {
          const sd = docs.filter(d => d.services?.includes(s.id))
          return (
            <div key={s.id} className="card" style={{ padding: 16, marginBottom: 10 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                <span style={{ fontWeight: 700 }}>{s.name}</span>
                <div style={{ display: 'flex', gap: 6 }}>
                  <Tag v={s.active ? 'green' : 'default'}>{s.active ? 'Activ' : 'Inactiv'}</Tag>
                  <Tag v="blue">{s.price}</Tag>
                </div>
              </div>
              <div style={{ fontSize: 13, color: T.inkMid, marginBottom: 6 }}>{s.desc} · {s.duration}</div>
              <div style={{ fontSize: 12, color: T.inkLight, marginBottom: 8 }}>Medici: {sd.length === 0 ? '—' : sd.map(d => d.name).join(', ')}</div>
              <div style={{ display: 'flex', gap: 6 }}>
                <button className="btn-g" style={{ flex: 1, justifyContent: 'center', fontSize: 12 }} onClick={() => toggleSvc(s)}>{s.active ? 'Dezactivează' : 'Activează'}</button>
                <button className="btn-d" style={{ padding: '8px 10px' }} onClick={() => deleteSvc(s.id)}><Ic n="trash" s={13} /></button>
              </div>
            </div>
          )
        })}
        {showAddSvc && (
          <div className="ovl" onClick={e => e.target === e.currentTarget && setShowAddSvc(false)}>
            <div className="modal" style={{ padding: 24 }}>
              <div style={{ fontWeight: 700, fontSize: 17, marginBottom: 16 }}>Serviciu nou</div>
              <FG mob={mob}>
                <FF label="Denumire" required><input className="inp" value={svcForm.name} onChange={e => setSvcForm(f => ({ ...f, name: e.target.value }))} /></FF>
                <FF label="Preț"><input className="inp" placeholder="150 RON" value={svcForm.price} onChange={e => setSvcForm(f => ({ ...f, price: e.target.value }))} /></FF>
                <FF label="Durată"><input className="inp" placeholder="30 min" value={svcForm.duration} onChange={e => setSvcForm(f => ({ ...f, duration: e.target.value }))} /></FF>
                <div style={{ gridColumn: '1/-1' }}><FF label="Descriere"><textarea className="inp" rows={2} value={svcForm.desc} onChange={e => setSvcForm(f => ({ ...f, desc: e.target.value }))} /></FF></div>
                <div style={{ gridColumn: '1/-1' }}>
                  <FF label="Medici">
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginTop: 4 }}>
                      {docs.map(d => {
                        const sel = svcForm.docIds.includes(d.id)
                        return <button key={d.id} className={`chip ${sel ? 'on' : ''}`} onClick={() => setSvcForm(f => ({ ...f, docIds: sel ? f.docIds.filter(x => x !== d.id) : [...f.docIds, d.id] }))}>{d.name.replace('Dr. ', '')}</button>
                      })}
                    </div>
                  </FF>
                </div>
              </FG>
              <div style={{ display: 'flex', gap: 10, marginTop: 16 }}>
                <button className="btn-g" onClick={() => setShowAddSvc(false)}>Anulează</button>
                <button className="btn-p" onClick={addSvc} style={{ flex: 1 }} disabled={!svcForm.name}>Adaugă</button>
              </div>
            </div>
          </div>
        )}
      </div>
    )
  }

  const Reqs = () => {
    const approveReq = async (r) => {
      await supabase.from('patients').delete().eq('id', r.patientId)
      await supabase.from('delete_requests').update({ status: 'approved' }).eq('id', r.id)
      showToast('Aprobată'); await fetchAll()
    }
    const rejectReq = async (id) => {
      await supabase.from('delete_requests').update({ status: 'rejected' }).eq('id', id)
      showToast('Respinsă', 'info'); await fetchAll()
    }
    return (
      <div className="fade-up">
        {delReqs.length === 0 ? <div className="card"><Empty icon="bell" title="Nicio cerere" desc="" /></div> : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {delReqs.map(r => (
              <div key={r.id} className="card" style={{ padding: 16 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
                  <Av name={r.doctorName} size={36} variant="blue" />
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 600 }}>{r.doctorName}</div>
                    <div style={{ fontSize: 12, color: T.inkLight }}>Ștergere: <strong>{r.patientName}</strong></div>
                  </div>
                  <Tag v={r.status === 'pending' ? 'yellow' : r.status === 'approved' ? 'green' : 'red'} dot>
                    {r.status === 'pending' ? 'Așteptare' : r.status === 'approved' ? 'Aprobată' : 'Respinsă'}
                  </Tag>
                </div>
                {r.status === 'pending' && (
                  <div style={{ display: 'flex', gap: 8 }}>
                    <button className="btn-s" style={{ flex: 1, justifyContent: 'center' }} onClick={() => approveReq(r)}>Aprobă</button>
                    <button className="btn-d" style={{ flex: 1, justifyContent: 'center' }} onClick={() => rejectReq(r.id)}>Respinge</button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    )
  }

  const titles = {
    dashboard: 'Panou Administrare', patients: `Pacienți (${pats.length})`,
    doctors: `Medici (${docs.length})`, appointments: `Programări (${appts.length})`,
    services: `Servicii (${svcs.length})`, requests: 'Cereri ștergere',
  }
  const content = { dashboard: <Dash />, patients: <AllPat />, doctors: <AllDoc />, appointments: <AllAppt />, services: <SvcsAdm />, requests: <Reqs /> }

  return (
    <div style={{ minHeight: '100vh', background: T.bg }}>
      <Header name="Admin Clinică" variant="orange" role="admin" onLogout={onLogout} mob={mob} />
      <main style={{ padding: mob ? '16px 16px 80px' : '24px 28px', maxWidth: 1000, margin: '0 auto' }}>
        <h1 style={{ fontSize: mob ? 20 : 22, fontWeight: 800, marginBottom: 16 }}>{titles[page]}</h1>
        {content[page]}
      </main>
      <BNav items={nav} active={page} set={setPage} />
      {showSvcQR && <QRModal onClose={() => setShowSvcQR(false)} title="Programare — Servicii" linkText="services" />}
      {editScheduleDoc && <ScheduleEditor doc={editScheduleDoc} onClose={() => setEditScheduleDoc(null)} onSaved={() => { fetchAll(); showToast('Program salvat!') }} />}
    </div>
  )
}
