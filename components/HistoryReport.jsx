'use client'
import { useState } from 'react'
import { T, age, fmt, fmtS, PSTATUS, ASTATUS } from '@/lib/theme'
import { Ic, Tag, Av, Div, Empty } from '@/components/ui'

export default function HistoryReport({ title, patient, doctorFilter, allAppts, allRx, allMsgs, allDocs, mob, onBack }) {
  const pAppts = allAppts.filter(a => a.patientId === patient.id && (doctorFilter ? a.doctorId === doctorFilter : true)).sort((a, b) => b.date.localeCompare(a.date))
  const pRx = allRx.filter(r => r.patientId === patient.id && (doctorFilter ? r.doctorId === doctorFilter : true)).sort((a, b) => b.date.localeCompare(a.date))
  const pMsgs = allMsgs.filter(m => ((m.fromRole === 'patient' && m.fromId === patient.id) || (m.toRole === 'patient' && m.toId === patient.id)) && (doctorFilter ? ((m.fromRole === 'doctor' && m.fromId === doctorFilter) || (m.toRole === 'doctor' && m.toId === doctorFilter)) : true)).sort((a, b) => b.id - a.id)

  const docIds = [...new Set(allAppts.filter(a => a.patientId === patient.id).map(a => a.doctorId))]
  const visitedDocs = docIds.map(id => allDocs.find(d => d.id === id)).filter(Boolean)
  const totalAppts = allAppts.filter(a => a.patientId === patient.id).length
  const finalized = allAppts.filter(a => a.patientId === patient.id && a.status === 'Finalizată').length
  const cancelled = allAppts.filter(a => a.patientId === patient.id && a.status === 'Anulată').length
  const activeRx = allRx.filter(r => r.patientId === patient.id && r.status === 'Activă').length
  const firstAppt = allAppts.filter(a => a.patientId === patient.id).sort((a, b) => a.date.localeCompare(b.date))[0]

  const [tab, setTab] = useState('overview')

  return (
    <div className="fade-up">
      <button className="btn-g" onClick={onBack} style={{ marginBottom: 14 }}><Ic n="left" s={14} /> Înapoi</button>
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
        <div style={{ display: 'grid', gridTemplateColumns: mob ? '1fr 1fr' : 'repeat(4,1fr)', gap: 10, marginTop: 14 }}>
          {[['cal', 'Total vizite', totalAppts], ['chk', 'Finalizate', finalized], ['file', 'Rețete active', activeRx], ['steth', 'Medici', visitedDocs.length]].map(([ic, lb, vl]) => (
            <div key={lb} style={{ background: T.surfaceAlt, borderRadius: T.r12, padding: '10px 12px', border: `1px solid ${T.border}`, textAlign: 'center' }}>
              <Ic n={ic} s={14} c={T.blue} />
              <div style={{ fontSize: 18, fontWeight: 800, marginTop: 4 }}>{vl}</div>
              <div style={{ fontSize: 10, color: T.inkFaint }}>{lb}</div>
            </div>
          ))}
        </div>
      </div>

      <div style={{ display: 'flex', gap: 6, marginBottom: 14, overflowX: 'auto', paddingBottom: 4 }}>
        {[['overview', 'Sumar'], ['appointments', 'Programări'], ['prescriptions', 'Rețete'], ['messages', 'Mesaje'], ['doctors', 'Medici']].map(([id, l]) => (
          <button key={id} className={`chip ${tab === id ? 'on' : ''}`} onClick={() => setTab(id)}>{l}</button>
        ))}
      </div>

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
          <div className="card" style={{ padding: 16 }}>
            <div style={{ fontWeight: 700, marginBottom: 10 }}>Rata completării</div>
            {[{ l: 'Confirmate', v: allAppts.filter(a => a.patientId === patient.id && a.status === 'Confirmată').length, c: T.success }, { l: 'Finalizate', v: finalized, c: T.blue }, { l: 'Anulate', v: cancelled, c: T.danger }].map(item => (
              <div key={item.l} style={{ marginBottom: 10 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}><span style={{ fontSize: 13, color: T.inkMid }}>{item.l}</span><span style={{ fontSize: 13, fontWeight: 700 }}>{item.v}/{totalAppts || 1}</span></div>
                <div className="pbar"><div className="pfill" style={{ width: `${(item.v / Math.max(totalAppts, 1)) * 100}%`, background: item.c }} /></div>
              </div>
            ))}
          </div>
        </div>
      )}

      {tab === 'appointments' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {pAppts.length === 0 ? <div className="card"><Empty icon="cal" title="Nicio programare" desc="" /></div> : pAppts.map(a => (
            <div key={a.id} className="card" style={{ padding: 14 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
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
            </div>
          ))}
        </div>
      )}

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

      {tab === 'doctors' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {visitedDocs.length === 0 ? <div className="card"><Empty icon="steth" title="Niciun medic" desc="" /></div> : visitedDocs.map(d => {
            const dAppts = allAppts.filter(a => a.patientId === patient.id && a.doctorId === d.id)
            const dRx = allRx.filter(r => r.patientId === patient.id && r.doctorId === d.id)
            return (
              <div key={d.id} className="card" style={{ padding: 16 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 10 }}>
                  <Av name={d.name} size={44} variant={d.av || 'blue'} />
                  <div style={{ flex: 1 }}><div style={{ fontWeight: 700, fontSize: 14 }}>{d.name}</div><div style={{ fontSize: 12, color: T.inkMid }}>{d.spec}</div></div>
                  {d.name === patient.doctor && <Tag v="cyan" dot>Curant</Tag>}
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 8 }}>
                  {[['Vizite', dAppts.length, T.blue], ['Finalizate', dAppts.filter(a => a.status === 'Finalizată').length, T.success], ['Rețete', dRx.length, T.purple]].map(([l, v, c]) => (
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
