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

  const downloadPDF = () => {
    const row = (label, value) => value ? `<div class="row"><span class="lbl">${label}</span><span class="val">${value}</span></div>` : ''
    const bar = (v, max, color) => `<div style="height:8px;border-radius:4px;background:#e5e7eb;overflow:hidden;margin:3px 0 8px"><div style="height:100%;width:${max > 0 ? Math.round((v/max)*100) : 0}%;background:${color}"></div></div>`
    const html = `<!DOCTYPE html><html lang="ro"><head><meta charset="utf-8">
<title>Dosar Medical — ${patient.name}</title>
<style>
  *{box-sizing:border-box;margin:0;padding:0}
  body{font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;color:#111;padding:32px;font-size:13px;line-height:1.5}
  h1{font-size:22px;font-weight:800;margin-bottom:2px}
  .meta{color:#6b7280;font-size:12px;margin-bottom:24px}
  h2{font-size:14px;font-weight:700;margin:20px 0 10px;padding-bottom:5px;border-bottom:2px solid #e5e7eb;color:#1d4ed8}
  .grid-4{display:grid;grid-template-columns:repeat(4,1fr);gap:10px;margin-bottom:16px}
  .grid-2{display:grid;grid-template-columns:1fr 1fr;gap:10px;margin-bottom:16px}
  .box{border:1px solid #e5e7eb;border-radius:8px;padding:12px;text-align:center}
  .box .num{font-size:24px;font-weight:800;margin:4px 0 2px}
  .box .lbl2{font-size:10px;color:#9ca3af}
  .row{display:flex;justify-content:space-between;padding:6px 0;border-bottom:1px solid #f3f4f6}
  .row:last-child{border-bottom:none}
  .lbl{font-size:11px;color:#6b7280;text-transform:uppercase;font-weight:600}
  .val{font-size:13px;font-weight:600;text-align:right;max-width:60%}
  .appt{border:1px solid #e5e7eb;border-radius:8px;padding:12px;margin-bottom:8px;display:flex;gap:12px;align-items:flex-start}
  .appt-date{background:linear-gradient(135deg,#2563eb,#0891b2);border-radius:6px;padding:6px 10px;text-align:center;color:#fff;min-width:50px;flex-shrink:0}
  .appt-date .t{font-size:13px;font-weight:700}
  .appt-date .d{font-size:9px;opacity:.8}
  .badge{display:inline-block;padding:2px 8px;border-radius:99px;font-size:11px;font-weight:600;margin-left:8px}
  .badge-g{background:#dcfce7;color:#166534}
  .badge-y{background:#fef3c7;color:#92400e}
  .badge-r{background:#fee2e2;color:#991b1b}
  .badge-b{background:#dbeafe;color:#1e40af}
  .rec{border:1px solid #e5e7eb;border-left:4px solid #16a34a;border-radius:8px;padding:12px;margin-bottom:8px}
  .rec-field{background:#f9fafb;border-radius:6px;padding:8px 10px;margin-top:6px}
  .rec-field .fl{font-size:10px;color:#9ca3af;font-weight:700;text-transform:uppercase;margin-bottom:2px}
  .vital{display:inline-block;padding:3px 10px;border-radius:99px;font-size:12px;font-weight:600;margin:2px}
  .rx{border:1px solid #e5e7eb;border-radius:8px;padding:12px;margin-bottom:8px}
  .doc-card{border:1px solid #e5e7eb;border-radius:8px;padding:12px;margin-bottom:8px}
  @media print{body{padding:16px}@page{margin:1.2cm;size:A4}}
</style></head><body>
<h1>${patient.name}</h1>
<div class="meta">
  Dosar medical complet · ${age(patient.dob)} ani · Grupa sanguină: ${patient.group || '—'} · Medic curant: ${patient.doctor || '—'} · Generat: ${new Date().toLocaleString('ro-RO')}
</div>

<h2>Sumar</h2>
<div class="grid-4">
  <div class="box"><div class="num" style="color:#2563eb">${totalAppts}</div><div class="lbl2">Vizite totale</div></div>
  <div class="box"><div class="num" style="color:#16a34a">${finalized}</div><div class="lbl2">Finalizate</div></div>
  <div class="box"><div class="num" style="color:#9333ea">${pRx.length}</div><div class="lbl2">Rețete</div></div>
  <div class="box"><div class="num" style="color:#0891b2">${completedRecords}</div><div class="lbl2">Fișe completate</div></div>
</div>

<h2>Informații personale</h2>
${row('Telefon', patient.phone)}
${row('Email', patient.email)}
${row('Data nașterii', fmt(patient.dob))}
${row('Vârstă', age(patient.dob) + ' ani')}
${row('Grup sanguin', patient.group)}
${row('Alergii', patient.allergies || 'Niciuna')}
${row('Medic curant', patient.doctor)}
${row('Pacient din', firstAppt ? fmt(firstAppt.date) : '—')}
${patient.notes ? `<div style="margin-top:10px;background:#f9fafb;border-radius:8px;padding:12px;border:1px solid #e5e7eb"><div style="font-size:11px;font-weight:700;color:#9ca3af;text-transform:uppercase;margin-bottom:4px">Observații medicale</div><div style="font-size:13px;color:#374151">${patient.notes}</div></div>` : ''}

${pRecords.filter(r => r.status === 'completed' && r.diagnostic).length > 0 ? `
<h2>Fișe medicale (${completedRecords} completate din ${pRecords.length})</h2>
${pRecords.filter(r => r.status === 'completed').map(r => {
  const appt = allAppts.find(a => a.id === r.appointmentId)
  return `<div class="rec">
  <div style="display:flex;justify-content:space-between;margin-bottom:6px">
    <strong>${appt ? fmt(appt.date) : '—'}${appt?.time ? ' · ' + appt.time : ''}</strong>
    <span style="font-size:12px;color:#6b7280">${r.doctorName || ''}</span>
  </div>
  ${r.diagnostic ? `<div class="rec-field"><div class="fl">Diagnostic</div><div style="font-weight:700">${r.diagnostic}</div></div>` : ''}
  ${r.recomandari ? `<div class="rec-field"><div class="fl">Recomandări</div><div>${r.recomandari}</div></div>` : ''}
  ${r.acuze ? `<div class="rec-field"><div class="fl">Acuze</div><div>${r.acuze}</div></div>` : ''}
  ${(r.temperatura || r.ta || r.fcc || r.spo2) ? `<div style="margin-top:8px">
    ${r.temperatura ? `<span class="vital" style="background:#fee2e2;color:#991b1b">t° ${r.temperatura}</span>` : ''}
    ${r.ta ? `<span class="vital" style="background:#dbeafe;color:#1e40af">TA ${r.ta}</span>` : ''}
    ${r.fcc ? `<span class="vital" style="background:#f3e8ff;color:#7e22ce">FCC ${r.fcc}</span>` : ''}
    ${r.spo2 ? `<span class="vital" style="background:#dcfce7;color:#166534">SpO2 ${r.spo2}%</span>` : ''}
  </div>` : ''}
</div>`}).join('')}` : ''}

${pAppts.length > 0 ? `
<h2>Istoricul programărilor (${pAppts.length})</h2>
${pAppts.map(a => {
  const badgeClass = a.status === 'Finalizată' ? 'badge-b' : a.status === 'Anulată' ? 'badge-r' : a.status === 'Confirmată' ? 'badge-g' : 'badge-y'
  return `<div class="appt">
  <div class="appt-date"><div class="t">${a.time}</div><div class="d">${fmt(a.date)}</div></div>
  <div style="flex:1">
    <div style="font-weight:600">${a.type || 'Consultație'}</div>
    <div style="font-size:12px;color:#6b7280">${a.doctor} · ${a.room || ''}</div>
    <span class="badge ${badgeClass}">${a.status}</span>
  </div>
</div>`}).join('')}` : ''}

${pRx.length > 0 ? `
<h2>Rețete (${pRx.length})</h2>
${pRx.map(r => `<div class="rx">
  <div style="display:flex;justify-content:space-between;margin-bottom:4px">
    <strong>${r.diagnosis || '—'}</strong>
    <span class="badge ${r.status === 'Activă' ? 'badge-g' : 'badge-y'}">${r.status}</span>
  </div>
  <div style="color:#2563eb;font-weight:600;margin-bottom:4px">${r.medicines || '—'}</div>
  <div style="font-size:12px;color:#9ca3af">${r.doctorName} · ${fmt(r.date)}</div>
</div>`).join('')}` : ''}

${visitedDocs.length > 0 ? `
<h2>Medici consultați (${visitedDocs.length})</h2>
${visitedDocs.map(d => {
  const dA = allAppts.filter(a => a.patientId === patient.id && a.doctorId === d.id)
  const dR = allRx.filter(r => r.patientId === patient.id && r.doctorId === d.id)
  return `<div class="doc-card">
  <div style="display:flex;justify-content:space-between;margin-bottom:8px">
    <div><strong>${d.name}</strong>${d.name === patient.doctor ? ' <span class="badge badge-b">Curant</span>' : ''}<div style="font-size:12px;color:#6b7280">${d.spec || ''}</div></div>
  </div>
  <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:8px">
    <div class="box"><div class="num" style="color:#2563eb;font-size:18px">${dA.length}</div><div class="lbl2">Vizite</div></div>
    <div class="box"><div class="num" style="color:#16a34a;font-size:18px">${dA.filter(a => a.status === 'Finalizată').length}</div><div class="lbl2">Finalizate</div></div>
    <div class="box"><div class="num" style="color:#9333ea;font-size:18px">${dR.length}</div><div class="lbl2">Rețete</div></div>
  </div>
</div>`}).join('')}` : ''}

<div style="margin-top:32px;padding-top:12px;border-top:1px solid #e5e7eb;color:#9ca3af;font-size:11px">
  Document generat automat de MedFlow · ${new Date().toLocaleString('ro-RO')} · Confidențial — uz intern
</div>
</body></html>`
    const iframe = document.createElement('iframe')
    iframe.style.cssText = 'position:fixed;top:-9999px;left:-9999px;width:1px;height:1px;border:none'
    document.body.appendChild(iframe)
    iframe.contentDocument.write(html)
    iframe.contentDocument.close()
    setTimeout(() => {
      iframe.contentWindow.focus()
      iframe.contentWindow.print()
      setTimeout(() => document.body.removeChild(iframe), 2000)
    }, 300)
  }

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
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
        <button className="btn-g" onClick={onBack}><Ic n="left" s={14} /> Înapoi</button>
        <button className="btn-p" onClick={downloadPDF} style={{ gap: 6 }}><Ic n="dl" s={14} c="#fff" /> Descarcă PDF</button>
      </div>

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
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5,1fr)', gap: mob ? 5 : 10, marginTop: 14 }}>
          {[['cal', 'Vizite', totalAppts], ['chk', 'Final.', finalized], ['file', 'Rețete', activeRx], ['clip', 'Fișe', completedRecords], ['steth', 'Medici', visitedDocs.length]].map(([ic, lb, vl]) => (
            <div key={lb} style={{ background: T.surfaceAlt, borderRadius: T.r8, padding: mob ? '6px 2px' : '10px 12px', border: `1px solid ${T.border}`, textAlign: 'center', overflow: 'hidden', minWidth: 0 }}>
              <Ic n={ic} s={mob ? 11 : 14} c={T.blue} />
              <div style={{ fontSize: mob ? 14 : 18, fontWeight: 800, marginTop: 2, lineHeight: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{vl}</div>
              <div style={{ fontSize: mob ? 8 : 10, color: T.inkFaint, marginTop: 2, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', width: '100%' }}>{lb}</div>
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
                <div style={{ display: 'grid', gridTemplateColumns: mob ? '1fr 1fr' : 'repeat(4,1fr)', gap: 8 }}>
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
