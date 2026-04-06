'use client'
import { useState } from 'react'
import { T, age, fmt, fmtS, ASTATUS } from '@/lib/theme'
import { Ic, Tag, Av, Div, Empty } from '@/components/ui'

export default function HistoryReport({ title, patient, doctorFilter, allAppts, allRx, allMsgs, allDocs, allMedRecords = [], mob, onBack, onOpenRecord }) {
  const pid = Number(patient.id)
  const pAppts = allAppts.filter(a => Number(a.patientId) === pid && (doctorFilter ? Number(a.doctorId) === Number(doctorFilter) : true)).sort((a, b) => b.date.localeCompare(a.date))
  const pRx = allRx.filter(r => Number(r.patientId) === pid && (doctorFilter ? Number(r.doctorId) === Number(doctorFilter) : true)).sort((a, b) => b.date.localeCompare(a.date))
  const pMsgs = allMsgs.filter(m => ((m.fromRole === 'patient' && Number(m.fromId) === pid) || (m.toRole === 'patient' && Number(m.toId) === pid)) && (doctorFilter ? ((m.fromRole === 'doctor' && Number(m.fromId) === Number(doctorFilter)) || (m.toRole === 'doctor' && Number(m.toId) === Number(doctorFilter))) : true)).sort((a, b) => b.id - a.id)
  const pRecords = allMedRecords.filter(r => Number(r.patientId) === Number(patient.id) && (doctorFilter ? Number(r.doctorId) === Number(doctorFilter) : true)).sort((a, b) => b.id - a.id)

  const docIds = [...new Set(allAppts.filter(a => a.patientId === patient.id).map(a => a.doctorId))]
  const visitedDocs = docIds.map(id => allDocs.find(d => d.id === id)).filter(Boolean)
  const totalAppts = allAppts.filter(a => a.patientId === patient.id).length
  const finalized = allAppts.filter(a => a.patientId === patient.id && a.status === 'Finalizată').length
  const cancelled = allAppts.filter(a => a.patientId === patient.id && a.status === 'Anulată').length
  const activeRx = allRx.filter(r => r.patientId === patient.id && r.status === 'Activă').length
  const firstAppt = allAppts.filter(a => a.patientId === patient.id).sort((a, b) => a.date.localeCompare(b.date))[0]
  const completedRecords = pRecords.filter(r => r.status === 'completed').length

  const [tab, setTab] = useState('overview')

  const tabs = [
    ['overview', 'Sumar'],
    ['appointments', `Programări (${pAppts.length})`],
    ['records', `Fișe (${completedRecords}/${pRecords.length})`],
    ['prescriptions', `Rețete (${pRx.length})`],
    ['messages', 'Mesaje'],
    ['doctors', 'Medici'],
  ]

  return (
    <div className="fade-up">
      <button className="btn-g" onClick={onBack} style={{ marginBottom: 14 }}><Ic n="left" s={14} /> Înapoi</button>

      {/* Header pacient */}
      <div className="card" style={{ padding: mob ? 16 : 24, marginBottom: 14 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 14 }}>
          <Av name={patient.name} size={mob ? 50 : 64} variant="green" />
          <div>
            <div style={{ fontSize: mob ? 18 : 22, fontWeight: 800 }}>{patient.name}</div>
            <div style={{ fontSize: 13, color: T.inkMid }}>{age(patient.dob)} ani · Grupa {patient.group} · {patient.doctor}</div>
            <div style={{ display: 'flex', gap: 6, marginTop: 6, flexWrap: 'wrap' }}>
              <Tag v={{ 'Sănătos': 'green', 'În tratament': 'yellow', 'Control periodic': 'blue', 'Urgență': 'red' }[patient.status] || 'default'} dot>{patient.status}</Tag>
              {patient.allergies && patient.allergies !== 'Niciuna' && <Tag v="red" dot>⚠ {patient.allergies}</Tag>}
            </div>
          </div>
        </div>
        <Div />
        <div style={{ display: 'grid', gridTemplateColumns: mob ? '1fr 1fr' : 'repeat(5,1fr)', gap: 10, marginTop: 14 }}>
          {[['cal', 'Vizite', totalAppts], ['chk', 'Finalizate', finalized], ['file', 'Rețete active', activeRx], ['clip', 'Fișe completate', completedRecords], ['steth', 'Medici', visitedDocs.length]].map(([ic, lb, vl]) => (
            <div key={lb} style={{ background: T.surfaceAlt, borderRadius: T.r12, padding: '10px 12px', border: `1px solid ${T.border}`, textAlign: 'center' }}>
              <Ic n={ic} s={14} c={T.blue} />
              <div style={{ fontSize: 18, fontWeight: 800, marginTop: 4 }}>{vl}</div>
              <div style={{ fontSize: 10, color: T.inkFaint }}>{lb}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: 6, marginBottom: 14, overflowX: 'auto', paddingBottom: 4 }}>
        {tabs.map(([id, l]) => (
          <button key={id} className={`chip ${tab === id ? 'on' : ''}`} onClick={() => setTab(id)}>{l}</button>
        ))}
      </div>

      {/* SUMAR */}
      {tab === 'overview' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <div className="card" style={{ padding: 16 }}>
            <div style={{ fontWeight: 700, marginBottom: 10 }}>Informații generale</div>
            <div style={{ display: 'grid', gridTemplateColumns: mob ? '1fr' : '1fr 1fr', gap: 10 }}>
              {[['users', 'Părinte/Tutore', patient.parent], ['ph', 'Telefon', patient.phone], ['mail', 'Email', patient.email], ['cal', 'Data nașterii', fmt(patient.dob)], ['steth', 'Medic curant', patient.doctor], ['clock', 'Pacient din', firstAppt ? fmt(firstAppt.date) : '—'], ['heart', 'Alergii', patient.allergies || 'Niciuna'], ['file', 'Total rețete', allRx.filter(r => r.patientId === patient.id).length]].map(([ic, lb, vl]) => (
                <div key={lb} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '8px 0', borderBottom: `1px solid ${T.border}` }}>
                  <Ic n={ic} s={14} c={T.blue} />
                  <div><div style={{ fontSize: 10, fontWeight: 700, color: T.inkFaint, textTransform: 'uppercase' }}>{lb}</div><div style={{ fontSize: 13, fontWeight: 600 }}>{vl || '—'}</div></div>
                </div>
              ))}
            </div>
          </div>
          {patient.notes && <div className="card" style={{ padding: 16 }}><div style={{ fontWeight: 700, marginBottom: 8 }}>Observații medicale</div><div style={{ fontSize: 14, color: T.inkMid, background: T.surfaceAlt, borderRadius: T.r12, padding: 12, border: `1px solid ${T.border}`, lineHeight: 1.7 }}>{patient.notes}</div></div>}

          {/* Ultimul diagnostic din fișe */}
          {pRecords.filter(r => r.status === 'completed' && r.diagnostic).length > 0 && (
            <div className="card" style={{ padding: 16, borderLeft: `4px solid ${T.blue}` }}>
              <div style={{ fontWeight: 700, marginBottom: 10 }}>Ultimele diagnostice</div>
              {pRecords.filter(r => r.status === 'completed' && r.diagnostic).slice(0, 3).map(r => {
                const appt = allAppts.find(a => a.id === r.appointmentId)
                return (
                  <div key={r.id} style={{ marginBottom: 8, paddingBottom: 8, borderBottom: `1px solid ${T.border}` }}>
                    <div style={{ fontSize: 13, fontWeight: 700, color: T.ink }}>{r.diagnostic}</div>
                    <div style={{ fontSize: 12, color: T.inkLight }}>{appt ? fmt(appt.date) : ''} · {r.doctorName}</div>
                  </div>
                )
              })}
            </div>
          )}

          <div className="card" style={{ padding: 16 }}>
            <div style={{ fontWeight: 700, marginBottom: 10 }}>Rata completării</div>
            {[{ l: 'Confirmate', v: allAppts.filter(a => a.patientId === patient.id && a.status === 'Confirmată').length, c: T.success },
              { l: 'Finalizate', v: finalized, c: T.blue },
              { l: 'Anulate', v: cancelled, c: T.danger }].map(item => (
              <div key={item.l} style={{ marginBottom: 10 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}><span style={{ fontSize: 13, color: T.inkMid }}>{item.l}</span><span style={{ fontSize: 13, fontWeight: 700 }}>{item.v}/{totalAppts || 1}</span></div>
                <div className="pbar"><div className="pfill" style={{ width: `${(item.v / Math.max(totalAppts, 1)) * 100}%`, background: item.c }} /></div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* PROGRAMĂRI */}
      {tab === 'appointments' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {pAppts.length === 0 ? <div className="card"><Empty icon="cal" title="Nicio programare" desc="" /></div> : pAppts.map(a => {
            const rec = allMedRecords.find(r => r.appointmentId === a.id)
            return (
              <div key={a.id} className="card" style={{ padding: 14 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: onOpenRecord ? 10 : 0 }}>
                  <div style={{ background: `linear-gradient(135deg,${T.blue},${T.cyan})`, borderRadius: T.r8, padding: '6px 10px', textAlign: 'center', minWidth: 48 }}>
                    <div style={{ fontSize: 13, fontWeight: 700, color: '#fff' }}>{a.time}</div>
                    <div style={{ fontSize: 9, color: 'rgba(255,255,255,.7)' }}>{fmtS(a.date)}</div>
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 600, fontSize: 13 }}>{a.type}</div>
                    <div style={{ fontSize: 12, color: T.inkLight }}>{a.doctor} · {a.room}</div>
                  </div>
                  <Tag v={ASTATUS[a.status] || 'default'} dot>{a.status}</Tag>
                </div>
                {onOpenRecord && (
                  <button className="btn-g" style={{ width: '100%', justifyContent: 'center', fontSize: 12, marginTop: 4, borderColor: rec?.status === 'completed' ? T.success : T.border, color: rec?.status === 'completed' ? T.success : T.inkMid }} onClick={() => onOpenRecord(a)}>
                    <Ic n="clip" s={13} c={rec?.status === 'completed' ? T.success : T.inkFaint} />
                    {rec?.status === 'completed' ? 'Fișă completată — Vezi' : rec?.status === 'draft' ? 'Continuă fișa' : 'Completează fișa de control'}
                  </button>
                )}
              </div>
            )
          })}
        </div>
      )}

      {/* FIȘE DE CONTROL */}
      {tab === 'records' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {pRecords.length === 0 ? <div className="card"><Empty icon="clip" title="Nicio fișă" desc="" /></div> : pRecords.map(r => {
            const appt = allAppts.find(a => a.id === r.appointmentId)
            return (
              <div key={r.id} className="card" style={{ padding: 16, borderLeft: `4px solid ${r.status === 'completed' ? T.success : r.status === 'draft' ? T.warning : T.border}` }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 10 }}>
                  <div>
                    <div style={{ fontWeight: 700 }}>{appt ? fmt(appt.date) : '—'} · {appt?.time}</div>
                    <div style={{ fontSize: 12, color: T.inkLight }}>{r.doctorName}</div>
                  </div>
                  <Tag v={r.status === 'completed' ? 'green' : r.status === 'draft' ? 'yellow' : 'default'} dot>
                    {r.status === 'completed' ? 'Completată' : r.status === 'draft' ? 'Ciornă' : 'Nouă'}
                  </Tag>
                </div>
                {r.diagnostic && (
                  <div style={{ background: T.surfaceAlt, borderRadius: T.r8, padding: '8px 12px', marginBottom: 8 }}>
                    <div style={{ fontSize: 11, fontWeight: 700, color: T.inkFaint, textTransform: 'uppercase', marginBottom: 3 }}>Diagnostic</div>
                    <div style={{ fontSize: 13, fontWeight: 600, color: T.ink }}>{r.diagnostic}</div>
                  </div>
                )}
                {r.recomandari && (
                  <div style={{ background: T.surfaceAlt, borderRadius: T.r8, padding: '8px 12px', marginBottom: 8 }}>
                    <div style={{ fontSize: 11, fontWeight: 700, color: T.inkFaint, textTransform: 'uppercase', marginBottom: 3 }}>Recomandări</div>
                    <div style={{ fontSize: 13, color: T.inkMid }}>{r.recomandari}</div>
                  </div>
                )}
                {r.acuze && <div style={{ fontSize: 12, color: T.inkLight }}><strong>Acuze:</strong> {r.acuze.slice(0, 100)}{r.acuze.length > 100 ? '...' : ''}</div>}
                {/* Semne vitale dacă sunt completate */}
                {(r.temperatura || r.ta || r.fcc || r.spo2) && (
                  <div style={{ display: 'flex', gap: 8, marginTop: 8, flexWrap: 'wrap' }}>
                    {r.temperatura && <span style={{ fontSize: 12, background: T.dangerBg, color: T.danger, borderRadius: T.r8, padding: '2px 8px', fontWeight: 600 }}>t° {r.temperatura}</span>}
                    {r.ta && <span style={{ fontSize: 12, background: '#EFF6FF', color: T.blue, borderRadius: T.r8, padding: '2px 8px', fontWeight: 600 }}>TA {r.ta}</span>}
                    {r.fcc && <span style={{ fontSize: 12, background: T.purpleBg, color: T.purple, borderRadius: T.r8, padding: '2px 8px', fontWeight: 600 }}>FCC {r.fcc}</span>}
                    {r.spo2 && <span style={{ fontSize: 12, background: T.successBg, color: T.success, borderRadius: T.r8, padding: '2px 8px', fontWeight: 600 }}>SpO2 {r.spo2}%</span>}
                  </div>
                )}
                {onOpenRecord && appt && (
                  <button className="btn-g" style={{ width: '100%', justifyContent: 'center', fontSize: 12, marginTop: 10 }} onClick={() => onOpenRecord(appt)}>
                    <Ic n="edit" s={13} /> {r.status === 'completed' ? 'Vizualizează' : 'Completează'}
                  </button>
                )}
              </div>
            )
          })}
        </div>
      )}

      {/* REȚETE */}
      {tab === 'prescriptions' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {pRx.length === 0 ? <div className="card"><Empty icon="file" title="Nicio rețetă" desc="" /></div> : pRx.map(r => (
            <div key={r.id} className="card" style={{ padding: 16 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                <span style={{ fontWeight: 700 }}>{r.diagnosis}</span>
                <Tag v={r.status === 'Activă' ? 'green' : 'default'}>{r.status}</Tag>
              </div>
              <div style={{ fontSize: 14, color: T.blue, fontWeight: 600 }}>{r.medicines}</div>
              <div style={{ fontSize: 12, color: T.inkFaint, marginTop: 4 }}>{r.doctorName} · {fmt(r.date)}</div>
            </div>
          ))}
        </div>
      )}

      {/* MESAJE */}
      {tab === 'messages' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {pMsgs.length === 0 ? <div className="card"><Empty icon="msg" title="Nicio conversație" desc="" /></div> : pMsgs.map(m => (
            <div key={m.id} className="card" style={{ padding: 12 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                <Av name={m.from} size={24} variant={m.fromRole === 'doctor' ? 'blue' : 'green'} />
                <span style={{ fontWeight: 600, fontSize: 13 }}>{m.from}</span>
                <span style={{ fontSize: 11, color: T.inkFaint, marginLeft: 'auto' }}>{fmt(m.date)}</span>
              </div>
              <div style={{ fontSize: 14, color: T.inkMid, paddingLeft: 32 }}>{m.text}</div>
            </div>
          ))}
        </div>
      )}

      {/* MEDICI */}
      {tab === 'doctors' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {visitedDocs.length === 0 ? <div className="card"><Empty icon="steth" title="Niciun medic" desc="" /></div> : visitedDocs.map(d => {
            const dAppts = allAppts.filter(a => a.patientId === patient.id && a.doctorId === d.id)
            const dRx = allRx.filter(r => r.patientId === patient.id && r.doctorId === d.id)
            const dRecs = allMedRecords.filter(r => r.patientId === patient.id && r.doctorId === d.id && r.status === 'completed')
            return (
              <div key={d.id} className="card" style={{ padding: 16 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 10 }}>
                  <Av name={d.name} size={44} variant={d.av || 'blue'} />
                  <div style={{ flex: 1 }}><div style={{ fontWeight: 700, fontSize: 14 }}>{d.name}</div><div style={{ fontSize: 12, color: T.inkMid }}>{d.spec}</div></div>
                  {d.name === patient.doctor && <Tag v="cyan" dot>Curant</Tag>}
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 8 }}>
                  {[['Vizite', dAppts.length, T.blue], ['Finalizate', dAppts.filter(a => a.status === 'Finalizată').length, T.success], ['Rețete', dRx.length, T.purple], ['Fișe', dRecs.length, T.cyan]].map(([l, v, c]) => (
                    <div key={l} style={{ background: T.surfaceAlt, borderRadius: T.r8, padding: 8, textAlign: 'center', border: `1px solid ${T.border}` }}>
                      <div style={{ fontSize: 16, fontWeight: 800, color: c }}>{v}</div>
                      <div style={{ fontSize: 10, color: T.inkFaint }}>{l}</div>
                    </div>
                  ))}
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
