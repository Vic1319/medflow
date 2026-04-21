'use client'
import { useState, useEffect, useCallback } from 'react'
import { supabase } from '@/lib/supabase'
import { T, age, fmt, fmtS, mapDoctor, mapPatient, mapAppt, mapMsg, mapRx, mapService, mapDelReq, mapMedRecord, mapAnalysis, PSTATUS, ASTATUS } from '@/lib/theme'
import { Ic, Tag, Av, Empty, FF, FG, StatBox, Header, BNav, QRModal, useIsMobile } from '@/components/ui'
import HistoryReport from '@/components/HistoryReport'
import ScheduleEditor from '@/components/ScheduleEditor'
import MedicalRecordForm from '@/components/MedicalRecordForm'

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
  const [editSvc, setEditSvc] = useState(null)
  const [editSvcForm, setEditSvcForm] = useState({ name: '', desc: '', price: '', duration: '', docIds: [] })
  const [showSvcQR, setShowSvcQR] = useState(false)
  const [editScheduleDoc, setEditScheduleDoc] = useState(null)
  const [assignDocPat, setAssignDocPat] = useState(null)
  const [medRecords, setMedRecords] = useState([])
  const [analyses, setAnalyses] = useState([])
  const [openRecord, setOpenRecord] = useState(null)
  const [docServicesDid, setDocServicesDid] = useState(null)
  const [docModal, setDocModal] = useState(null)
  const [loading, setLoading] = useState(true)

  const fetchAll = useCallback(async () => {
    const [docsRes, patsRes, apptsRes, msgsRes, rxsRes, svcsRes, reqsRes, recRes, analRes] = await Promise.all([
      supabase.from('doctors').select('*'),
      supabase.from('patients').select('*'),
      supabase.from('appointments').select('*'),
      supabase.from('messages').select('*'),
      supabase.from('prescriptions').select('*'),
      supabase.from('services').select('*'),
      supabase.from('delete_requests').select('*'),
      supabase.from('medical_records').select('*'),
      supabase.from('analyses').select('*'),
    ])
    setDocs((docsRes.data || []).map(mapDoctor))
    setPats((patsRes.data || []).map(mapPatient))
    setAppts((apptsRes.data || []).map(mapAppt))
    setMsgs((msgsRes.data || []).map(mapMsg))
    setRxs((rxsRes.data || []).map(mapRx))
    setSvcs((svcsRes.data || []).map(mapService))
    setDelReqs((reqsRes.data || []).map(mapDelReq))
    setMedRecords((recRes.data || []).map(mapMedRecord))
    setAnalyses((analRes.data || []).map(mapAnalysis))
    setLoading(false)
  }, [])

  useEffect(() => { fetchAll() }, [fetchAll])

  if (loading) return <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Ic n="act" s={24} c={T.blue} /></div>

  const pendingReqs = delReqs.filter(r => r.status === 'pending').length
  const nav = [
    { id: 'dashboard', l: 'Panou', ic: 'home', badge: 0 },
    { id: 'patients', l: 'Pacienți', ic: 'users', badge: 0 },
    { id: 'doctors', l: 'Medici', ic: 'steth', badge: 0 },
    { id: 'services', l: 'Servicii', ic: 'svc', badge: 0 },
    { id: 'analyses', l: 'Analize', ic: 'bar', badge: 0 },
    { id: 'requests', l: 'Cereri', ic: 'bell', badge: pendingReqs },
  ]

  if (viewPatId) {
    const vPat = pats.find(p => p.id === viewPatId)
    if (!vPat) return null
    return (
      <div style={{ minHeight: '100vh', background: T.bg }}>
        <Header name="Admin Clinică" variant="orange" role="admin" onLogout={onLogout} mob={mob} />
        <div style={{ background: T.surface, borderBottom: `1px solid ${T.border}`, padding: '8px 16px', display: 'flex', gap: 8, overflowX: 'auto', position: 'sticky', top: 57, zIndex: 30 }}>
          {[{ id: 'appointments', l: 'Programări', ic: 'cal' }, { id: 'records', l: 'Fișe medicale', ic: 'clip' }].map(item => (
            <button key={item.id} className="chip" style={{ display: 'flex', alignItems: 'center', gap: 5, flexShrink: 0 }} onClick={() => { setViewPatId(null); setPage(item.id) }}>
              <Ic n={item.ic} s={12} c={T.inkMid} /> {item.l}
            </button>
          ))}
        </div>
        <main style={{ padding: mob ? '16px 16px 80px' : '24px 28px', maxWidth: 1000, margin: '0 auto' }}>
          <HistoryReport title={`Raport complet — ${vPat.name}`} patient={vPat} doctorFilter={null} allAppts={appts} allRx={rxs} allMsgs={msgs} allDocs={docs} allMedRecords={medRecords} mob={mob} onBack={() => setViewPatId(null)} onOpenRecord={(appt) => setOpenRecord({ record: medRecords.find(r => r.appointmentId === appt.id) || null, appt })} />
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
        {[{ label: 'Pacienți', value: pats.length, icon: 'users', color: T.blue, bg: '#EFF6FF', p: 'patients' },
          { label: 'Medici', value: docs.length, icon: 'steth', color: T.purple, bg: T.purpleBg, p: 'doctors' },
          { label: 'Programări', value: appts.length, icon: 'cal', color: T.cyan, bg: T.cyanDim, p: 'appointments' },
          { label: 'Servicii', value: svcs.length, icon: 'svc', color: T.success, bg: T.successBg, p: 'services' }].map((s, i) => (
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
                <div style={{ flex: 1, minWidth: 0, overflow: 'hidden' }}>
                  <div style={{ fontWeight: 600, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{p.name} <span style={{ fontWeight: 400, color: T.inkFaint, fontSize: 12 }}>({p.email})</span></div>
                  <div style={{ fontSize: 12, color: T.inkLight, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{age(p.dob)} ani · {p.doctor} · {pDocs} medici</div>
                </div>
                <Tag v={PSTATUS[p.status] || 'default'} dot>{p.status}</Tag>
                <button className="btn-g" style={{ padding: '6px 8px', flexShrink: 0 }} onClick={e => { e.stopPropagation(); setAssignDocPat(p) }}><Ic n="steth" s={13} /></button>
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
    const toggleDoc = async (d, e) => {
      e.stopPropagation()
      await supabase.from('doctors').update({ is_active: !d.on }).eq('id', d.id)
      showToast(d.on ? 'Dezactivat' : 'Activat'); await fetchAll()
    }
    const deleteDoc = async (id, e) => {
      e.stopPropagation()
      await supabase.from('doctors').delete().eq('id', id)
      showToast('Medic șters', 'info'); await fetchAll()
    }
    return (
      <div className="fade-up">
        <div style={{ fontSize: 13, color: T.inkLight, marginBottom: 10 }}>Apasă pe un medic pentru detalii și statistici complete:</div>
        <div style={{ display: 'grid', gridTemplateColumns: mob ? '1fr' : '1fr 1fr', gap: 12 }}>
          {docs.map(d => (
            <div key={d.id} className="card" style={{ padding: 0, overflow: 'hidden', cursor: 'pointer' }} onClick={() => setDocModal(d.id)}>
              <div style={{ height: 4, background: d.on ? `linear-gradient(90deg,${T.blue},${T.cyan})` : T.border }} />
              <div style={{ padding: 16 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
                  <Av name={d.name} size={48} variant={d.av} url={d.avatar_url} />
                  <div style={{ flex: 1, overflow: 'hidden' }}>
                    <div style={{ fontWeight: 700, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{d.name}</div>
                    <div style={{ fontSize: 12, color: T.inkMid, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{d.spec} · {d.exp}</div>
                    <div style={{ fontSize: 11, color: T.inkFaint, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{d.email}</div>
                  </div>
                  <Tag v={d.on ? 'green' : 'default'} dot>{d.on ? 'Activ' : 'Inactiv'}</Tag>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 6, marginBottom: 12 }}>
                  {[['Pacienți', pats.filter(p => p.doctor === d.name).length, T.blue], ['Prog.', appts.filter(a => a.doctorId === d.id).length, T.cyan], ['Fișe', medRecords.filter(r => r.doctorId === d.id).length, T.purple], ['Analize', analyses.filter(a => a.doctorId === d.id).length, T.warning]].map(([k, v, c]) => (
                    <div key={k} style={{ background: T.surfaceAlt, border: `1px solid ${T.border}`, borderRadius: T.r8, padding: '8px 4px', textAlign: 'center' }}>
                      <div style={{ fontSize: 18, fontWeight: 800, color: c }}>{v}</div>
                      <div style={{ fontSize: 9, color: T.inkFaint, marginTop: 1 }}>{k}</div>
                    </div>
                  ))}
                </div>
                <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }} onClick={e => e.stopPropagation()}>
                  <button className="btn-g" style={{ flex: 1, justifyContent: 'center', fontSize: 12, minWidth: 'calc(50% - 3px)' }} onClick={e => { e.stopPropagation(); setEditScheduleDoc(d) }}><Ic n="cal" s={13} /> Program</button>
                  <button className="btn-g" style={{ flex: 1, justifyContent: 'center', fontSize: 12, minWidth: 'calc(50% - 3px)' }} onClick={e => { e.stopPropagation(); setDocServicesDid(d.id) }}><Ic n="svc" s={13} /> Servicii {(d.services || []).length > 0 ? `(${(d.services || []).length})` : ''}</button>
                  <button className="btn-g" style={{ flex: 1, justifyContent: 'center', fontSize: 12 }} onClick={e => toggleDoc(d, e)}>{d.on ? 'Dezactivează' : 'Activează'}</button>
                  <button className="btn-d" style={{ padding: '8px 10px' }} onClick={e => deleteDoc(d.id, e)}><Ic n="trash" s={13} /></button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  const DocModal = () => {
    const d = docs.find(x => x.id === docModal)
    if (!d) return null
    const dAppts = appts.filter(a => a.doctorId === d.id)
    const dPats = pats.filter(p => p.doctor === d.name)
    const dFinished = dAppts.filter(a => a.status === 'Finalizată').length
    const dPending = dAppts.filter(a => a.status === 'În așteptare').length
    const dCancelled = dAppts.filter(a => a.status === 'Anulată').length
    const dRecords = medRecords.filter(r => r.doctorId === d.id)
    const dAnalyses = analyses.filter(a => a.doctorId === d.id)
    const dSvcs = svcs.filter(s => (d.services || []).includes(s.id))
    const total = dAppts.length
    const recentAppts = [...dAppts].sort((a, b) => (b.date || '').localeCompare(a.date || '')).slice(0, 6)
    const revenue = dAppts.filter(a => a.status === 'Finalizată').reduce((sum, a) => {
      const svc = svcs.find(s => s.id === a.serviceId)
      const num = parseFloat((svc?.price || '').replace(/[^0-9.]/g, ''))
      return sum + (isNaN(num) ? 0 : num)
    }, 0)
    return (
      <div className="ovl" onClick={e => e.target === e.currentTarget && setDocModal(null)}>
        <div className="modal" style={{ padding: 0, maxHeight: '88vh', overflowY: 'auto', maxWidth: 540 }}>
          <div style={{ height: 4, background: d.on ? `linear-gradient(90deg,${T.blue},${T.cyan})` : T.border, flexShrink: 0 }} />
          <div style={{ padding: 24 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 20 }}>
              <div style={{ display: 'flex', gap: 14, alignItems: 'center', flex: 1, minWidth: 0 }}>
                <Av name={d.name} size={64} variant={d.av} url={d.avatar_url} />
                <div style={{ overflow: 'hidden' }}>
                  <div style={{ fontWeight: 800, fontSize: 18, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{d.name}</div>
                  <div style={{ fontSize: 13, color: T.inkMid }}>{d.spec}</div>
                  <div style={{ fontSize: 12, color: T.inkFaint }}>{d.exp}</div>
                  <div style={{ fontSize: 11, color: T.inkFaint, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{d.email}</div>
                </div>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6, alignItems: 'flex-end', flexShrink: 0, marginLeft: 12 }}>
                <Tag v={d.on ? 'green' : 'default'} dot>{d.on ? 'Activ' : 'Inactiv'}</Tag>
                <button className="btn-g" style={{ padding: '5px 8px' }} onClick={() => setDocModal(null)}><Ic n="x" s={15} /></button>
              </div>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 8, marginBottom: 16 }}>
              {[['Pacienți', dPats.length, T.blue], ['Programări', total, T.cyan], ['Fișe', dRecords.length, T.purple], ['Analize', dAnalyses.length, T.warning]].map(([k, v, c]) => (
                <div key={k} style={{ background: T.surfaceAlt, border: `1px solid ${T.border}`, borderRadius: T.r8, padding: '10px 6px', textAlign: 'center' }}>
                  <div style={{ fontSize: 22, fontWeight: 800, color: c }}>{v}</div>
                  <div style={{ fontSize: 10, color: T.inkFaint, marginTop: 2 }}>{k}</div>
                </div>
              ))}
            </div>
            {revenue > 0 && (
              <div style={{ background: 'linear-gradient(135deg,#1E3A5F,#1E5F8F)', borderRadius: T.r12, padding: '14px 18px', marginBottom: 14, display: 'flex', alignItems: 'center', gap: 12 }}>
                <Ic n="star" s={22} c="#FFD700" />
                <div>
                  <div style={{ fontSize: 11, color: 'rgba(255,255,255,.7)' }}>Venituri estimate (finalizate)</div>
                  <div style={{ fontSize: 22, fontWeight: 800, color: '#FFD700' }}>{revenue.toLocaleString()} RON</div>
                </div>
              </div>
            )}
            {total > 0 && (
              <div className="card" style={{ padding: 14, marginBottom: 12 }}>
                <div style={{ fontWeight: 700, marginBottom: 10, fontSize: 13 }}>Statistici programări</div>
                <div style={{ height: 10, borderRadius: 5, background: T.border, overflow: 'hidden', display: 'flex', marginBottom: 10 }}>
                  {dFinished > 0 && <div style={{ width: `${(dFinished/total)*100}%`, background: T.success }} />}
                  {dPending > 0 && <div style={{ width: `${(dPending/total)*100}%`, background: T.warning }} />}
                  {dCancelled > 0 && <div style={{ width: `${(dCancelled/total)*100}%`, background: T.danger }} />}
                </div>
                <div style={{ display: 'flex', gap: 16 }}>
                  {[['Finalizate', dFinished, T.success], ['Așteptare', dPending, T.warning], ['Anulate', dCancelled, T.danger]].map(([l, v, c]) => (
                    <div key={l} style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                      <div style={{ width: 8, height: 8, borderRadius: '50%', background: c, flexShrink: 0 }} />
                      <span style={{ fontSize: 12, color: T.inkMid }}>{l}: <strong style={{ color: c }}>{v}</strong></span>
                    </div>
                  ))}
                </div>
              </div>
            )}
            {dRecords.length > 0 && (
              <div className="card" style={{ padding: 14, marginBottom: 12 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                  <span style={{ fontWeight: 700, fontSize: 13 }}>Fișe medicale</span>
                  <span style={{ fontSize: 12, color: T.inkFaint }}>{dRecords.filter(r => r.status === 'completed').length} / {dRecords.length} completate</span>
                </div>
                <div className="pbar"><div className="pfill" style={{ width: `${(dRecords.filter(r => r.status === 'completed').length / dRecords.length) * 100}%`, background: T.purple }} /></div>
              </div>
            )}
            {recentAppts.length > 0 && (
              <div style={{ marginBottom: 14 }}>
                <div style={{ fontWeight: 700, marginBottom: 8, fontSize: 13 }}>Programări recente</div>
                {recentAppts.map((a, i) => (
                  <div key={a.id} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '8px 0', borderBottom: i < recentAppts.length - 1 ? `1px solid ${T.border}` : 'none' }}>
                    <div style={{ fontSize: 11, color: T.inkFaint, minWidth: 65, flexShrink: 0 }}>{fmt(a.date)} {a.time}</div>
                    <div style={{ flex: 1, fontSize: 13, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{a.patient}</div>
                    <Tag v={ASTATUS[a.status] || 'default'} dot>{a.status}</Tag>
                  </div>
                ))}
              </div>
            )}
            {dSvcs.length > 0 && (
              <div style={{ marginBottom: 16 }}>
                <div style={{ fontWeight: 700, marginBottom: 8, fontSize: 13 }}>Servicii oferite</div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                  {dSvcs.map(s => <span key={s.id} className="chip">{s.name} · {s.price}</span>)}
                </div>
              </div>
            )}
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              <button className="btn-g" style={{ flex: 1, justifyContent: 'center' }} onClick={() => { setEditScheduleDoc(d); setDocModal(null) }}><Ic n="cal" s={13} /> Program</button>
              <button className="btn-g" style={{ flex: 1, justifyContent: 'center' }} onClick={() => { setDocServicesDid(d.id); setDocModal(null) }}><Ic n="svc" s={13} /> Servicii</button>
              <button className="btn-g" style={{ flex: 1, justifyContent: 'center' }} onClick={async () => { await supabase.from('doctors').update({ is_active: !d.on }).eq('id', d.id); showToast(d.on ? 'Dezactivat' : 'Activat'); await fetchAll() }}>{d.on ? 'Dezactivează' : 'Activează'}</button>
              <button className="btn-d" style={{ padding: '8px 12px' }} onClick={async () => { await supabase.from('doctors').delete().eq('id', d.id); showToast('Medic șters', 'info'); await fetchAll(); setDocModal(null) }}><Ic n="trash" s={13} /></button>
            </div>
          </div>
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
              <div style={{ flex: 1, overflow: 'hidden' }}>
                <div style={{ fontWeight: 600, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{a.patient}</div>
                <div style={{ fontSize: 12, color: T.inkLight, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{a.doctor} · {a.type}</div>
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
    const openEdit = (s) => {
      const sd = docs.filter(d => d.services?.includes(s.id)).map(d => d.id)
      setEditSvc(s); setEditSvcForm({ name: s.name, desc: s.desc || '', price: s.price || '', duration: s.duration || '', docIds: sd })
    }
    const saveEdit = async () => {
      await supabase.from('services').update({ name: editSvcForm.name, description: editSvcForm.desc, price: editSvcForm.price, duration: editSvcForm.duration }).eq('id', editSvc.id)
      for (const d of docs) {
        const hasSvc = d.services?.includes(editSvc.id)
        const shouldHave = editSvcForm.docIds.includes(d.id)
        if (hasSvc && !shouldHave) await supabase.from('doctors').update({ services: d.services.filter(x => x !== editSvc.id) }).eq('id', d.id)
        if (!hasSvc && shouldHave) await supabase.from('doctors').update({ services: [...(d.services || []), editSvc.id] }).eq('id', d.id)
      }
      setEditSvc(null); showToast('Salvat!'); await fetchAll()
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
                <button className="btn-g" style={{ padding: '8px 10px' }} onClick={() => openEdit(s)}><Ic n="edit" s={13} /></button>
                <button className="btn-d" style={{ padding: '8px 10px' }} onClick={() => deleteSvc(s.id)}><Ic n="trash" s={13} /></button>
              </div>
            </div>
          )
        })}
        {editSvc && (
          <div className="ovl" onClick={e => e.target === e.currentTarget && setEditSvc(null)}>
            <div className="modal" style={{ padding: 24 }}>
              <div style={{ fontWeight: 700, fontSize: 17, marginBottom: 16 }}>Editează — {editSvc.name}</div>
              <FG mob={mob}>
                <FF label="Denumire" required><input className="inp" value={editSvcForm.name} onChange={e => setEditSvcForm(f => ({ ...f, name: e.target.value }))} /></FF>
                <FF label="Preț"><input className="inp" placeholder="150 RON" value={editSvcForm.price} onChange={e => setEditSvcForm(f => ({ ...f, price: e.target.value }))} /></FF>
                <FF label="Durată"><input className="inp" placeholder="30 min" value={editSvcForm.duration} onChange={e => setEditSvcForm(f => ({ ...f, duration: e.target.value }))} /></FF>
                <div style={{ gridColumn: '1/-1' }}><FF label="Descriere"><textarea className="inp" rows={2} value={editSvcForm.desc} onChange={e => setEditSvcForm(f => ({ ...f, desc: e.target.value }))} /></FF></div>
                <div style={{ gridColumn: '1/-1' }}>
                  <FF label="Medici">
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginTop: 4 }}>
                      {docs.map(d => {
                        const sel = editSvcForm.docIds.includes(d.id)
                        return <button key={d.id} className={`chip ${sel ? 'on' : ''}`} onClick={() => setEditSvcForm(f => ({ ...f, docIds: sel ? f.docIds.filter(x => x !== d.id) : [...f.docIds, d.id] }))}>{d.name.replace('Dr. ', '')}</button>
                      })}
                    </div>
                  </FF>
                </div>
              </FG>
              <div style={{ display: 'flex', gap: 10, marginTop: 16 }}>
                <button className="btn-g" onClick={() => setEditSvc(null)}>Anulează</button>
                <button className="btn-p" onClick={saveEdit} style={{ flex: 1 }} disabled={!editSvcForm.name}>Salvează</button>
              </div>
            </div>
          </div>
        )}
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

  const AllRecords = () => {
    const [qPat, setQPat] = useState('')
    const [fDoc, setFDoc] = useState('all')
    const [fStatus, setFStatus] = useState('all')
    const [fDateFrom, setFDateFrom] = useState('')
    const [fDateTo, setFDateTo] = useState('')
    const docNames = [...new Set(medRecords.map(r => r.doctorName).filter(Boolean))]
    const filtered = medRecords.filter(r => {
      if (qPat && !r.patientName?.toLowerCase().includes(qPat.toLowerCase())) return false
      if (fDoc !== 'all' && r.doctorName !== fDoc) return false
      if (fStatus !== 'all' && r.status !== fStatus) return false
      if (fDateFrom && r.created_at && r.created_at.slice(0,10) < fDateFrom) return false
      if (fDateTo && r.created_at && r.created_at.slice(0,10) > fDateTo) return false
      return true
    }).sort((a, b) => (b.created_at || '').localeCompare(a.created_at || ''))

    return (
      <div className="fade-up">
        <div className="card" style={{ padding: 14, marginBottom: 14 }}>
          <div className="sb" style={{ marginBottom: 10 }}>
            <Ic n="srch" s={14} c={T.inkFaint} />
            <input placeholder="Caută pacient..." value={qPat} onChange={e => setQPat(e.target.value)} />
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: mob ? '1fr 1fr' : 'repeat(4,1fr)', gap: 8 }}>
            <FF label="Medic">
              <select className="sel" value={fDoc} onChange={e => setFDoc(e.target.value)}>
                <option value="all">Toți medicii</option>
                {docNames.map(d => <option key={d} value={d}>{d}</option>)}
              </select>
            </FF>
            <FF label="Status">
              <select className="sel" value={fStatus} onChange={e => setFStatus(e.target.value)}>
                <option value="all">Toate</option>
                <option value="completed">Finalizate</option>
                <option value="draft">Draft</option>
              </select>
            </FF>
            <FF label="De la"><input className="inp" type="date" value={fDateFrom} onChange={e => setFDateFrom(e.target.value)} /></FF>
            <FF label="Până la"><input className="inp" type="date" value={fDateTo} onChange={e => setFDateTo(e.target.value)} /></FF>
          </div>
          <div style={{ fontSize: 12, color: T.inkLight, marginTop: 8 }}>{filtered.length} fișe găsite din {medRecords.length} total</div>
        </div>
        {filtered.length === 0 ? <div className="card"><Empty icon="clip" title="Nicio fișă" desc="" /></div> : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {filtered.map(r => (
              <div key={r.id} className="card" style={{ padding: 14, borderLeft: `3px solid ${r.status === 'completed' ? T.success : T.warning}` }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8 }}>
                  <Av name={r.patientName} size={36} variant="blue" />
                  <div style={{ flex: 1, minWidth: 0, overflow: 'hidden' }}>
                    <div style={{ fontWeight: 700, fontSize: 14, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{r.patientName}</div>
                    <div style={{ fontSize: 12, color: T.inkMid, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{r.doctorName} · {r.created_at ? new Date(r.created_at).toLocaleDateString('ro-RO') : '—'}</div>
                  </div>
                  <Tag v={r.status === 'completed' ? 'green' : 'yellow'} dot>{r.status === 'completed' ? 'Finalizată' : 'Draft'}</Tag>
                </div>
                <button className="btn-g" style={{ width: '100%', justifyContent: 'center', fontSize: 13 }} onClick={() => setOpenRecord({ record: r, appt: appts.find(a => a.id === r.appointmentId) || { id: r.appointmentId, patient: r.patientName, doctor: r.doctorName, patientId: r.patientId, doctorId: r.doctorId } })}>
                  <Ic n="eye" s={14} /> Deschide fișa
                </button>
              </div>
            ))}
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

  const AssignDocModal = ({ pat, onClose }) => {
    const [selDoc, setSelDoc] = useState(docs.find(d => d.name === pat.doctor)?.id || docs[0]?.id || '')
    const save = async () => {
      const d = docs.find(x => x.id === Number(selDoc))
      if (!d) return
      await supabase.from('patients').update({ doctor_name: d.name }).eq('id', pat.id)
      showToast('Medic curant actualizat!'); await fetchAll(); onClose()
    }
    return (
      <div className="ovl" onClick={e => e.target === e.currentTarget && onClose()}>
        <div className="modal" style={{ padding: 24, maxWidth: 380 }}>
          <div style={{ fontWeight: 700, fontSize: 17, marginBottom: 6 }}>Alocare medic curant</div>
          <div style={{ fontSize: 13, color: T.inkMid, marginBottom: 16 }}>Pacient: <strong>{pat.name}</strong></div>
          <FF label="Medic curant">
            <select className="sel" value={selDoc} onChange={e => setSelDoc(e.target.value)}>
              {docs.filter(d => d.on).map(d => <option key={d.id} value={d.id}>{d.name} — {d.spec}</option>)}
            </select>
          </FF>
          <div style={{ display: 'flex', gap: 10, marginTop: 16 }}>
            <button className="btn-g" onClick={onClose}>Anulează</button>
            <button className="btn-p" style={{ flex: 1 }} onClick={save}>Salvează</button>
          </div>
        </div>
      </div>
    )
  }

  const ASTATS_C = { 'Normal': 'green', 'Anormal': 'red', 'În așteptare': 'yellow' }
  const AllAnalyses = () => {
    const [flt, setFlt] = useState('all')
    const list = flt === 'all' ? analyses : analyses.filter(a => a.status === flt)
    return (
      <div className="fade-up">
        <div style={{ display: 'flex', gap: 6, marginBottom: 14, flexWrap: 'wrap' }}>
          {['all', 'Normal', 'Anormal', 'În așteptare'].map(v => (
            <button key={v} className={`chip ${flt === v ? 'on' : ''}`} onClick={() => setFlt(v)}>{v === 'all' ? 'Toate' : v}</button>
          ))}
        </div>
        {list.length === 0 ? <div className="card"><Empty icon="bar" title="Nicio analiză" desc="" /></div> : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {[...list].sort((a,b) => b.date?.localeCompare(a.date)).map(a => (
              <div key={a.id} className="card" style={{ padding: 16, borderLeft: `4px solid ${a.status === 'Normal' ? T.success : a.status === 'Anormal' ? T.danger : T.warning}` }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 }}>
                  <div style={{ overflow: 'hidden', flex: 1 }}>
                    <div style={{ fontWeight: 700, fontSize: 15, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{a.type}</div>
                    <div style={{ fontSize: 12, color: T.inkMid, marginTop: 2, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{a.patientName} · {a.doctorName} · {fmt(a.date)}</div>
                  </div>
                  <Tag v={ASTATS_C[a.status] || 'default'} dot>{a.status}</Tag>
                </div>
                {a.results && <div style={{ fontSize: 13, color: T.ink, background: T.surfaceAlt, borderRadius: T.r8, padding: '8px 12px', border: `1px solid ${T.border}` }}>{a.results}</div>}
              </div>
            ))}
          </div>
        )}
      </div>
    )
  }

  const StatsPage = () => {
    const [period, setPeriod] = useState('luna')
    const now = new Date()
    const today = now.toISOString().slice(0, 10)
    const weekStart = new Date(now - 7 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10)
    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1).toISOString().slice(0, 10)
    const yearStart = `${now.getFullYear()}-01-01`
    const filtered = period === 'azi' ? appts.filter(a => a.date === today)
      : period === 'saptamana' ? appts.filter(a => a.date >= weekStart)
      : period === 'luna' ? appts.filter(a => a.date >= monthStart)
      : period === 'an' ? appts.filter(a => a.date >= yearStart)
      : appts
    const total = filtered.length
    const finished = filtered.filter(a => a.status === 'Finalizată').length
    const pending = filtered.filter(a => a.status === 'În așteptare').length
    const cancelled = filtered.filter(a => a.status === 'Anulată').length
    const rate = total > 0 ? Math.round((finished / total) * 100) : 0
    const revenue = filtered.filter(a => a.status === 'Finalizată').reduce((sum, a) => {
      const svc = svcs.find(s => s.id === a.serviceId)
      const num = parseFloat((svc?.price || '').replace(/[^0-9.]/g, ''))
      return sum + (isNaN(num) ? 0 : num)
    }, 0)
    const activePats = [...new Set(filtered.map(a => a.patientId))].length
    const docStats = docs.map(d => {
      const da = filtered.filter(a => a.doctorId === d.id)
      const fin = da.filter(a => a.status === 'Finalizată').length
      const rev = da.filter(a => a.status === 'Finalizată').reduce((sum, a) => {
        const svc = svcs.find(s => s.id === a.serviceId)
        const num = parseFloat((svc?.price || '').replace(/[^0-9.]/g, ''))
        return sum + (isNaN(num) ? 0 : num)
      }, 0)
      return { ...d, total: da.length, finished: fin, revenue: rev }
    }).sort((a, b) => b.total - a.total)
    const svcStats = svcs.map(s => ({ ...s, count: filtered.filter(a => a.serviceId === s.id).length })).filter(s => s.count > 0).sort((a, b) => b.count - a.count)
    const topDoc = docStats.find(d => d.total > 0)
    return (
      <div className="fade-up" style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
        <div style={{ display: 'flex', gap: 6, overflowX: 'auto', paddingBottom: 4 }}>
          {[['azi', 'Azi'], ['saptamana', '7 zile'], ['luna', 'Luna aceasta'], ['an', 'Anul acesta'], ['total', 'Total']].map(([v, l]) => (
            <button key={v} className={`chip ${period === v ? 'on' : ''}`} onClick={() => setPeriod(v)} style={{ flexShrink: 0 }}>{l}</button>
          ))}
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: mob ? '1fr 1fr' : 'repeat(4,1fr)', gap: mob ? 10 : 14 }}>
          {[
            { l: 'Programări totale', v: total, c: T.cyan, ic: 'cal' },
            { l: 'Finalizate', v: finished, c: T.success, ic: 'chk' },
            { l: 'Rată finalizare', v: `${rate}%`, c: T.blue, ic: 'bar' },
            { l: 'Venituri estimate', v: revenue > 0 ? `${revenue.toLocaleString()} RON` : '—', c: T.purple, ic: 'star' },
          ].map(s => (
            <div key={s.l} className="card" style={{ padding: mob ? 14 : 18 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
                <Ic n={s.ic} s={16} c={s.c} />
                <span style={{ fontSize: 11, color: T.inkMid }}>{s.l}</span>
              </div>
              <div style={{ fontSize: mob ? 24 : 30, fontWeight: 800, color: s.c, lineHeight: 1 }}>{s.v}</div>
            </div>
          ))}
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: mob ? '1fr 1fr' : 'repeat(4,1fr)', gap: mob ? 10 : 14 }}>
          {[
            { l: 'În așteptare', v: pending, c: T.warning },
            { l: 'Anulate', v: cancelled, c: T.danger },
            { l: 'Pacienți activi', v: activePats, c: T.blue },
            { l: 'Total pacienți clinic', v: pats.length, c: T.inkMid },
          ].map(s => (
            <div key={s.l} className="card" style={{ padding: 14, display: 'flex', alignItems: 'center', gap: 12 }}>
              <div style={{ width: 40, height: 40, borderRadius: T.r8, background: T.surfaceAlt, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <span style={{ fontSize: 20, fontWeight: 800, color: s.c }}>{s.v}</span>
              </div>
              <span style={{ fontSize: 12, color: T.inkMid }}>{s.l}</span>
            </div>
          ))}
        </div>
        <div className="card" style={{ padding: mob ? 16 : 20 }}>
          <div style={{ fontWeight: 700, marginBottom: 12 }}>Detalii status programări</div>
          {[['Finalizate (intrări)', finished, T.success], ['În așteptare', pending, T.warning], ['Anulate (ieșiri)', cancelled, T.danger]].map(([l, v, c]) => (
            <div key={l} style={{ marginBottom: 12 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                <span style={{ fontSize: 13, color: T.inkMid }}>{l}</span>
                <span style={{ fontSize: 13, fontWeight: 700 }}>{v} <span style={{ fontWeight: 400, color: T.inkFaint }}>({total > 0 ? Math.round((v / total) * 100) : 0}%)</span></span>
              </div>
              <div className="pbar"><div className="pfill" style={{ width: `${total > 0 ? (v / total) * 100 : 0}%`, background: c }} /></div>
            </div>
          ))}
        </div>
        {docStats.filter(d => d.total > 0).length > 0 && (
          <div className="card" style={{ padding: mob ? 16 : 20 }}>
            <div style={{ fontWeight: 700, marginBottom: 14 }}>Performanță medici</div>
            {docStats.filter(d => d.total > 0).map(d => (
              <div key={d.id} style={{ marginBottom: 14 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6 }}>
                  <Av name={d.name} size={30} variant={d.av} />
                  <div style={{ flex: 1, overflow: 'hidden' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 3 }}>
                      <span style={{ fontSize: 13, fontWeight: 600, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{d.name}</span>
                      <div style={{ display: 'flex', gap: 10, flexShrink: 0, marginLeft: 8 }}>
                        <span style={{ fontSize: 12, fontWeight: 700, color: T.cyan }}>{d.total} prog.</span>
                        {d.revenue > 0 && <span style={{ fontSize: 12, fontWeight: 700, color: T.purple }}>{d.revenue.toLocaleString()} RON</span>}
                      </div>
                    </div>
                    <div style={{ height: 6, borderRadius: 3, background: T.border, overflow: 'hidden', display: 'flex' }}>
                      {d.finished > 0 && <div style={{ width: `${(d.finished / Math.max(d.total, 1)) * 100}%`, background: T.success }} />}
                      {(d.total - d.finished) > 0 && <div style={{ width: `${((d.total - d.finished) / Math.max(d.total, 1)) * 100}%`, background: T.warning }} />}
                    </div>
                    <div style={{ fontSize: 10, color: T.inkFaint, marginTop: 3 }}>{d.finished} finalizate · {d.total > 0 ? Math.round((d.finished / d.total) * 100) : 0}% rată succes</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
        {svcStats.length > 0 && (
          <div className="card" style={{ padding: mob ? 16 : 20 }}>
            <div style={{ fontWeight: 700, marginBottom: 14 }}>Servicii utilizate</div>
            {svcStats.map((s, i) => (
              <div key={s.id} style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
                <div style={{ width: 26, height: 26, borderRadius: T.r8, background: i === 0 ? '#FEF3C7' : T.surfaceAlt, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 800, color: i === 0 ? '#92400E' : T.inkFaint, flexShrink: 0 }}>{i + 1}</div>
                <div style={{ flex: 1, overflow: 'hidden' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                    <span style={{ fontSize: 13, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{s.name}</span>
                    <span style={{ fontSize: 13, fontWeight: 700, color: T.cyan, flexShrink: 0, marginLeft: 8 }}>{s.count}×</span>
                  </div>
                  <div style={{ height: 4, borderRadius: 2, background: T.border, overflow: 'hidden' }}>
                    <div style={{ width: `${(s.count / svcStats[0].count) * 100}%`, background: T.cyan }} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
        <div className="card" style={{ padding: mob ? 16 : 20 }}>
          <div style={{ fontWeight: 700, marginBottom: 12 }}>Sumar clinică</div>
          <div style={{ display: 'grid', gridTemplateColumns: mob ? '1fr 1fr' : 'repeat(3,1fr)', gap: 10 }}>
            {[
              { l: 'Total medici', v: docs.length, sub: `${docs.filter(d => d.on).length} activi`, c: T.blue },
              { l: 'Total servicii', v: svcs.length, sub: `${svcs.filter(s => s.active).length} active`, c: T.cyan },
              { l: 'Fișe medicale', v: medRecords.length, sub: `${medRecords.filter(r => r.status === 'completed').length} completate`, c: T.purple },
              { l: 'Analize', v: analyses.length, sub: `${analyses.filter(a => a.status === 'Anormal').length} anormale`, c: T.warning },
              { l: 'Medic top', v: topDoc?.name?.replace('Dr. ', '') || '—', sub: topDoc ? `${topDoc.total} programări` : '', c: T.success },
              { l: 'Total programări', v: appts.length, sub: `${appts.filter(a => a.status === 'Finalizată').length} finalizate total`, c: T.inkMid },
            ].map(s => (
              <div key={s.l} style={{ background: T.surfaceAlt, border: `1px solid ${T.border}`, borderRadius: T.r8, padding: 12 }}>
                <div style={{ fontSize: 11, color: T.inkFaint, marginBottom: 4 }}>{s.l}</div>
                <div style={{ fontSize: 16, fontWeight: 800, color: s.c, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{s.v}</div>
                {s.sub && <div style={{ fontSize: 10, color: T.inkFaint, marginTop: 2 }}>{s.sub}</div>}
              </div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  const DocServicesModal = () => {
    const d = docs.find(x => x.id === docServicesDid)
    if (!d) return null
    const toggleSvc = async (svcId) => {
      const cur = d.services || []
      const has = cur.includes(svcId)
      const next = has ? cur.filter(x => x !== svcId) : [...cur, svcId]
      await supabase.from('doctors').update({ services: next }).eq('id', d.id)
      showToast(has ? 'Serviciu eliminat' : 'Serviciu adăugat'); await fetchAll()
    }
    const activeSvcs = svcs.filter(s => s.active)
    return (
      <div className="ovl" onClick={e => e.target === e.currentTarget && setDocServicesDid(null)}>
        <div className="modal" style={{ padding: 24 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
            <div>
              <div style={{ fontWeight: 700, fontSize: 17 }}>Servicii — {d.name}</div>
              <div style={{ fontSize: 12, color: T.inkMid, marginTop: 2 }}>{(d.services || []).length} servicii active</div>
            </div>
            <button className="btn-g" style={{ padding: 6 }} onClick={() => setDocServicesDid(null)}><Ic n="x" s={15} /></button>
          </div>
          {activeSvcs.length === 0 ? (
            <div className="card"><Empty icon="svc" title="Niciun serviciu" desc="Adaugă servicii din secțiunea Servicii" /></div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {activeSvcs.map(s => {
                const has = (d.services || []).includes(s.id)
                return (
                  <div key={s.id} className="card" style={{ padding: 12, border: `1.5px solid ${has ? T.blue : T.border}`, transition: 'border-color .15s' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                      <div style={{ width: 38, height: 38, borderRadius: T.r8, background: has ? '#EFF6FF' : T.surfaceAlt, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, transition: 'background .15s' }}>
                        <Ic n="svc" s={17} c={has ? T.blue : T.inkFaint} />
                      </div>
                      <div style={{ flex: 1, overflow: 'hidden' }}>
                        <div style={{ fontWeight: 600, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{s.name}</div>
                        <div style={{ fontSize: 12, color: T.inkMid }}>{s.price} · {s.duration}</div>
                      </div>
                      <button className={has ? 'btn-d' : 'btn-s'} style={{ padding: '7px 12px', fontSize: 12, flexShrink: 0 }} onClick={() => toggleSvc(s.id)}>
                        {has ? 'Elimină' : 'Adaugă'}
                      </button>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </div>
    )
  }

  const titles = {
    dashboard: 'Panou Administrare', patients: `Pacienți (${pats.length})`,
    doctors: `Medici (${docs.length})`, appointments: `Programări (${appts.length})`,
    records: `Fișe medicale (${medRecords.length})`, analyses: `Analize (${analyses.length})`,
    services: `Servicii (${svcs.length})`, requests: 'Cereri ștergere', stats: 'Statistici & Rapoarte',
  }
  const content = { dashboard: <Dash />, patients: <AllPat />, doctors: <AllDoc />, appointments: <AllAppt />, records: <AllRecords />, analyses: <AllAnalyses />, services: <SvcsAdm />, requests: <Reqs />, stats: <StatsPage /> }

  return (
    <div style={{ minHeight: '100vh', background: T.bg }}>
      <Header name="Admin Clinică" variant="orange" role="admin" onLogout={onLogout} mob={mob} />
      <div style={{ background: T.surface, borderBottom: `1px solid ${T.border}`, padding: '8px 16px', display: 'flex', gap: 8, overflowX: 'auto', position: 'sticky', top: 57, zIndex: 30, WebkitOverflowScrolling: 'touch' }}>
        {[{ id: 'appointments', l: 'Programări', ic: 'cal' }, { id: 'records', l: 'Fișe medicale', ic: 'clip' }, { id: 'stats', l: 'Statistici', ic: 'bar' }].map(item => (
          <button key={item.id} className={`chip ${page === item.id ? 'on' : ''}`} style={{ display: 'flex', alignItems: 'center', gap: 5, flexShrink: 0 }} onClick={() => setPage(item.id)}>
            <Ic n={item.ic} s={12} c={page === item.id ? '#fff' : T.inkMid} /> {item.l}
          </button>
        ))}
      </div>
      <main style={{ padding: mob ? '16px 16px 80px' : '24px 28px', maxWidth: 1000, margin: '0 auto' }}>
        <h1 style={{ fontSize: mob ? 20 : 22, fontWeight: 800, marginBottom: 16 }}>{titles[page]}</h1>
        {content[page]}
      </main>
      <BNav items={nav} active={page} set={setPage} />
      {showSvcQR && <QRModal onClose={() => setShowSvcQR(false)} title="Programare — Servicii" linkText="services" />}
      {editScheduleDoc && <ScheduleEditor doc={editScheduleDoc} onClose={() => setEditScheduleDoc(null)} onSaved={() => { fetchAll(); showToast('Program salvat!') }} />}
      {assignDocPat && <AssignDocModal pat={assignDocPat} onClose={() => setAssignDocPat(null)} />}
      {openRecord && <MedicalRecordForm record={openRecord.record} appt={openRecord.appt} onClose={() => setOpenRecord(null)} onSaved={fetchAll} />}
      {docModal && <DocModal />}
      {docServicesDid && <DocServicesModal />}
    </div>
  )
}
