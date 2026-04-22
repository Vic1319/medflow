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
    const initials = patient.name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase()
    const avatarColors = ['#16a34a','#2563eb','#9333ea','#0891b2','#ea580c','#dc2626']
    const avatarColor = avatarColors[patient.name.charCodeAt(0) % avatarColors.length]
    const avatar = `<svg width="100" height="100" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg"><circle cx="50" cy="50" r="50" fill="${avatarColor}"/><text x="50" y="50" text-anchor="middle" dominant-baseline="central" fill="white" font-size="36" font-weight="700" font-family="-apple-system,BlinkMacSystemFont,sans-serif">${initials}</text></svg>`
    const avatarB64 = `data:image/svg+xml;base64,${btoa(unescape(encodeURIComponent(avatar)))}`
    const statusColor = {'Sănătos':'#16a34a','În tratament':'#d97706','Control periodic':'#2563eb','Urgență':'#dc2626'}[patient.status] || '#6b7280'
    const badge = (txt, bg, clr) => `<span style="display:inline-block;padding:3px 10px;border-radius:99px;font-size:11px;font-weight:700;background:${bg};color:${clr}">${txt}</span>`
    const sectionTitle = (txt, color='#1e40af') => `<div style="display:flex;align-items:center;gap:8px;margin:22px 0 12px"><div style="width:4px;height:20px;background:${color};border-radius:2px"></div><span style="font-size:15px;font-weight:800;color:#111">${txt}</span></div>`
    const infoRow = (label, value) => value ? `<tr><td style="padding:7px 12px;font-size:11px;font-weight:700;color:#6b7280;text-transform:uppercase;width:38%;border-bottom:1px solid #f1f5f9">${label}</td><td style="padding:7px 12px;font-size:13px;font-weight:600;color:#111;border-bottom:1px solid #f1f5f9">${value}</td></tr>` : ''

    const html = `<!DOCTYPE html><html lang="ro"><head><meta charset="utf-8">
<title>Dosar Medical — ${patient.name}</title>
<style>
  *{box-sizing:border-box;margin:0;padding:0}
  body{font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Helvetica,sans-serif;background:#fff;color:#111;font-size:13px;line-height:1.5}
  .page{max-width:800px;margin:0 auto;padding:0}
  .header{background:linear-gradient(135deg,#1e3a8a 0%,#1d4ed8 50%,#0891b2 100%);padding:28px 36px;color:#fff;display:flex;justify-content:space-between;align-items:center}
  .header-logo{display:flex;align-items:center;gap:10px}
  .header-logo-icon{width:36px;height:36px;background:rgba(255,255,255,.2);border-radius:8px;display:flex;align-items:center;justify-content:center}
  .header-title{font-size:22px;font-weight:800;letter-spacing:-.5px}
  .header-sub{font-size:12px;opacity:.75;margin-top:2px}
  .header-date{text-align:right;font-size:11px;opacity:.7}
  .body{display:flex;gap:0;min-height:600px}
  .sidebar{width:220px;flex-shrink:0;background:#f8faff;border-right:1px solid #e2e8f0;padding:28px 20px}
  .main{flex:1;padding:24px 28px;background:#fff}
  .avatar-wrap{text-align:center;margin-bottom:16px}
  .avatar-wrap img{width:90px;height:90px;border-radius:50%;border:4px solid #fff;box-shadow:0 4px 16px rgba(0,0,0,.15)}
  .patient-name{font-size:17px;font-weight:800;text-align:center;margin-bottom:4px;line-height:1.2}
  .patient-sub{font-size:12px;color:#6b7280;text-align:center;margin-bottom:10px}
  .sidebar-section{margin-top:18px}
  .sidebar-section-title{font-size:9px;font-weight:800;color:#94a3b8;text-transform:uppercase;letter-spacing:.8px;margin-bottom:8px}
  .sidebar-row{display:flex;flex-direction:column;margin-bottom:9px}
  .sidebar-row .sl{font-size:9px;color:#94a3b8;text-transform:uppercase;font-weight:700;margin-bottom:1px}
  .sidebar-row .sv{font-size:12px;font-weight:600;color:#1e293b;word-break:break-word}
  .stats-grid{display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-bottom:20px}
  .stat-box{background:#f8faff;border:1px solid #e2e8f0;border-radius:10px;padding:12px 8px;text-align:center}
  .stat-num{font-size:26px;font-weight:800;line-height:1}
  .stat-lbl{font-size:10px;color:#64748b;margin-top:3px}
  table{width:100%;border-collapse:collapse}
  .rec-card{background:#f8faff;border:1px solid #e2e8f0;border-left:4px solid #16a34a;border-radius:8px;padding:14px;margin-bottom:10px}
  .rec-field{background:#fff;border:1px solid #e2e8f0;border-radius:6px;padding:9px 12px;margin-top:8px}
  .rec-field-lbl{font-size:9px;font-weight:800;color:#94a3b8;text-transform:uppercase;margin-bottom:3px}
  .vital-badge{display:inline-block;padding:3px 10px;border-radius:99px;font-size:11px;font-weight:700;margin:2px}
  .appt-row{display:flex;gap:12px;align-items:center;padding:10px 0;border-bottom:1px solid #f1f5f9}
  .appt-row:last-child{border-bottom:none}
  .appt-pill{background:linear-gradient(135deg,#1d4ed8,#0891b2);border-radius:8px;padding:8px 12px;text-align:center;color:#fff;min-width:58px;flex-shrink:0}
  .appt-pill .at{font-size:13px;font-weight:800}
  .appt-pill .ad{font-size:9px;opacity:.8;margin-top:1px}
  .rx-card{background:#fafafa;border:1px solid #e2e8f0;border-radius:8px;padding:12px;margin-bottom:8px;display:flex;justify-content:space-between;align-items:flex-start;gap:12px}
  .doc-row{display:flex;align-items:center;gap:12px;padding:10px 0;border-bottom:1px solid #f1f5f9}
  .doc-row:last-child{border-bottom:none}
  .doc-av{width:36px;height:36px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:13px;font-weight:800;color:#fff;flex-shrink:0}
  .footer{background:#f8faff;border-top:2px solid #e2e8f0;padding:14px 36px;display:flex;justify-content:space-between;align-items:center}
  .footer-left{font-size:11px;color:#64748b}
  .footer-right{font-size:10px;color:#94a3b8;text-align:right}
  @media print{.page{max-width:100%}@page{margin:.8cm;size:A4}body{-webkit-print-color-adjust:exact;print-color-adjust:exact}}
</style></head><body>
<div class="page">

<div class="header">
  <div class="header-logo">
    <div class="header-logo-icon">
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2.5"><path d="M12 2L2 7l10 5 10-5-10-5z"/><path d="M2 17l10 5 10-5"/><path d="M2 12l10 5 10-5"/></svg>
    </div>
    <div>
      <div class="header-title">MedFlow</div>
      <div class="header-sub">Dosar Medical — Document Confidențial</div>
    </div>
  </div>
  <div class="header-date">
    <div style="font-size:13px;font-weight:700">Nr. pacient #${patient.id}</div>
    <div style="margin-top:3px">Generat: ${new Date().toLocaleDateString('ro-RO',{day:'2-digit',month:'long',year:'numeric'})}</div>
    <div style="margin-top:2px">${new Date().toLocaleTimeString('ro-RO',{hour:'2-digit',minute:'2-digit'})}</div>
  </div>
</div>

<div class="body">
  <div class="sidebar">
    <div class="avatar-wrap">
      <img src="${avatarB64}" alt="${patient.name}" />
    </div>
    <div class="patient-name">${patient.name}</div>
    <div class="patient-sub">${age(patient.dob)} ani · Gr. ${patient.group || '—'}</div>
    <div style="text-align:center;margin-bottom:6px">${badge(patient.status, statusColor+'22', statusColor)}</div>
    ${patient.allergies && patient.allergies !== 'Niciuna' ? `<div style="background:#fef2f2;border:1px solid #fecaca;border-radius:8px;padding:8px 10px;text-align:center;margin-top:8px"><div style="font-size:9px;font-weight:800;color:#dc2626;text-transform:uppercase;margin-bottom:2px">⚠ Alergii</div><div style="font-size:11px;font-weight:700;color:#dc2626">${patient.allergies}</div></div>` : ''}

    <div class="sidebar-section">
      <div class="sidebar-section-title">Date personale</div>
      ${patient.dob ? `<div class="sidebar-row"><span class="sl">Data nașterii</span><span class="sv">${fmt(patient.dob)}</span></div>` : ''}
      ${patient.phone ? `<div class="sidebar-row"><span class="sl">Telefon</span><span class="sv">${patient.phone}</span></div>` : ''}
      ${patient.email ? `<div class="sidebar-row"><span class="sl">Email</span><span class="sv" style="font-size:11px">${patient.email}</span></div>` : ''}
      ${patient.parent ? `<div class="sidebar-row"><span class="sl">Tutore</span><span class="sv">${patient.parent}</span></div>` : ''}
    </div>

    <div class="sidebar-section">
      <div class="sidebar-section-title">Informații medicale</div>
      <div class="sidebar-row"><span class="sl">Grup sanguin</span><span class="sv">${patient.group || '—'}</span></div>
      <div class="sidebar-row"><span class="sl">Medic curant</span><span class="sv">${patient.doctor || '—'}</span></div>
      <div class="sidebar-row"><span class="sl">Pacient din</span><span class="sv">${firstAppt ? fmt(firstAppt.date) : '—'}</span></div>
    </div>
  </div>

  <div class="main">
    ${sectionTitle('Sumar activitate')}
    <div class="stats-grid">
      <div class="stat-box"><div class="stat-num" style="color:#1d4ed8">${totalAppts}</div><div class="stat-lbl">Vizite totale</div></div>
      <div class="stat-box"><div class="stat-num" style="color:#16a34a">${finalized}</div><div class="stat-lbl">Finalizate</div></div>
      <div class="stat-box"><div class="stat-num" style="color:#9333ea">${pRx.length}</div><div class="stat-lbl">Rețete emise</div></div>
      <div class="stat-box"><div class="stat-num" style="color:#0891b2">${completedRecords}</div><div class="stat-lbl">Fișe completate</div></div>
    </div>

    ${patient.notes ? `<div style="background:#fffbeb;border:1px solid #fde68a;border-radius:8px;padding:12px 14px;margin-bottom:16px"><div style="font-size:9px;font-weight:800;color:#92400e;text-transform:uppercase;margin-bottom:5px">Observații medicale</div><div style="font-size:12px;color:#78350f;line-height:1.6">${patient.notes}</div></div>` : ''}

    ${pRecords.filter(r => r.status === 'completed').length > 0 ? `
    ${sectionTitle('Fișe medicale', '#16a34a')}
    ${pRecords.filter(r => r.status === 'completed').map(r => {
      const appt = allAppts.find(a => a.id === r.appointmentId)
      return `<div class="rec-card">
      <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:8px">
        <div style="font-size:13px;font-weight:700">${appt ? fmt(appt.date) : '—'}${appt?.time ? ' · ' + appt.time : ''}</div>
        <div style="font-size:11px;color:#64748b;font-weight:600">${r.doctorName || ''}</div>
      </div>
      ${r.diagnostic ? `<div class="rec-field"><div class="rec-field-lbl">Diagnostic</div><div style="font-size:13px;font-weight:700;color:#1e293b">${r.diagnostic}</div></div>` : ''}
      ${r.recomandari ? `<div class="rec-field"><div class="rec-field-lbl">Recomandări</div><div style="font-size:12px;color:#374151">${r.recomandari}</div></div>` : ''}
      ${r.acuze ? `<div class="rec-field"><div class="rec-field-lbl">Acuze</div><div style="font-size:12px;color:#374151">${r.acuze}</div></div>` : ''}
      ${(r.temperatura || r.ta || r.fcc || r.spo2) ? `<div style="margin-top:10px">
        ${r.temperatura ? `<span class="vital-badge" style="background:#fee2e2;color:#991b1b">t° ${r.temperatura}</span>` : ''}
        ${r.ta ? `<span class="vital-badge" style="background:#dbeafe;color:#1e40af">TA ${r.ta}</span>` : ''}
        ${r.fcc ? `<span class="vital-badge" style="background:#f3e8ff;color:#7e22ce">FCC ${r.fcc}</span>` : ''}
        ${r.spo2 ? `<span class="vital-badge" style="background:#dcfce7;color:#166534">SpO2 ${r.spo2}%</span>` : ''}
      </div>` : ''}
    </div>`}).join('')}` : ''}

    ${pAppts.length > 0 ? `
    ${sectionTitle('Istoricul programărilor', '#0891b2')}
    <div style="background:#f8faff;border:1px solid #e2e8f0;border-radius:10px;padding:4px 14px">
    ${pAppts.map(a => {
      const bc = a.status==='Finalizată'?['#dbeafe','#1e40af']:a.status==='Anulată'?['#fee2e2','#991b1b']:a.status==='Confirmată'?['#dcfce7','#166534']:['#fef3c7','#92400e']
      return `<div class="appt-row">
      <div class="appt-pill"><div class="at">${a.time}</div><div class="ad">${fmt(a.date)}</div></div>
      <div style="flex:1">
        <div style="font-size:13px;font-weight:700">${a.type||'Consultație'}</div>
        <div style="font-size:11px;color:#64748b;margin-top:2px">${a.doctor}${a.room?' · '+a.room:''}</div>
      </div>
      ${badge(a.status, bc[0], bc[1])}
    </div>`}).join('')}
    </div>` : ''}

    ${pRx.length > 0 ? `
    ${sectionTitle('Rețete medicale', '#9333ea')}
    ${pRx.map(r => `<div class="rx-card">
      <div style="flex:1">
        <div style="font-size:13px;font-weight:800;margin-bottom:4px">${r.diagnosis||'—'}</div>
        <div style="font-size:13px;font-weight:600;color:#1d4ed8;margin-bottom:4px">${r.medicines||'—'}</div>
        <div style="font-size:11px;color:#94a3b8">${r.doctorName} · ${fmt(r.date)}</div>
      </div>
      ${badge(r.status, r.status==='Activă'?'#dcfce7':'#f1f5f9', r.status==='Activă'?'#166534':'#475569')}
    </div>`).join('')}` : ''}

    ${visitedDocs.length > 0 ? `
    ${sectionTitle('Medici consultați', '#7c3aed')}
    <div style="background:#f8faff;border:1px solid #e2e8f0;border-radius:10px;padding:4px 14px">
    ${visitedDocs.map(d => {
      const dA = allAppts.filter(a => a.patientId===patient.id && a.doctorId===d.id)
      const dR = allRx.filter(r => r.patientId===patient.id && r.doctorId===d.id)
      const dInit = d.name.split(' ').map(w=>w[0]).join('').slice(0,2).toUpperCase()
      return `<div class="doc-row">
      <div class="doc-av" style="background:#1d4ed8">${dInit}</div>
      <div style="flex:1">
        <div style="font-size:13px;font-weight:700">${d.name}${d.name===patient.doctor?' '+badge('Curant','#dbeafe','#1e40af'):''}</div>
        <div style="font-size:11px;color:#64748b">${d.spec||''}</div>
      </div>
      <div style="display:flex;gap:12px;text-align:center">
        <div><div style="font-size:16px;font-weight:800;color:#1d4ed8">${dA.length}</div><div style="font-size:9px;color:#94a3b8">vizite</div></div>
        <div><div style="font-size:16px;font-weight:800;color:#16a34a">${dA.filter(a=>a.status==='Finalizată').length}</div><div style="font-size:9px;color:#94a3b8">final.</div></div>
        <div><div style="font-size:16px;font-weight:800;color:#9333ea">${dR.length}</div><div style="font-size:9px;color:#94a3b8">rețete</div></div>
      </div>
    </div>`}).join('')}
    </div>` : ''}
  </div>
</div>

<div class="footer">
  <div class="footer-left">
    <strong>MedFlow</strong> · Sistem de management medical · Document generat automat
  </div>
  <div class="footer-right">
    ⚠ Confidențial — Uz medical intern<br/>
    ${new Date().toLocaleString('ro-RO')}
  </div>
</div>

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
    }, 400)
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
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6,1fr)', gap: 8, marginTop: 14 }}>
          {[
            ['cal', 'Vizite', totalAppts, '1 / span 2'],
            ['chk', 'Finalizate', finalized, '3 / span 2'],
            ['file', 'Rețete', activeRx, '5 / span 2'],
            ['clip', 'Fișe completate', completedRecords, '2 / span 2'],
            ['steth', 'Medici consultați', visitedDocs.length, '4 / span 2'],
          ].map(([ic, lb, vl, col]) => (
            <div key={lb} style={{ gridColumn: col, background: T.surfaceAlt, borderRadius: T.r12, padding: '10px 8px', border: `1px solid ${T.border}`, textAlign: 'center' }}>
              <Ic n={ic} s={15} c={T.blue} />
              <div style={{ fontSize: 20, fontWeight: 800, marginTop: 4, lineHeight: 1 }}>{vl}</div>
              <div style={{ fontSize: 10, color: T.inkFaint, marginTop: 4 }}>{lb}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: 6, marginBottom: 14, overflowX: 'auto', paddingBottom: 4, WebkitOverflowScrolling: 'touch' }}>
        {tabs.map(([id, l]) => (
          <button key={id} className={`chip ${tab === id ? 'on' : ''}`} onClick={() => setTab(id)} style={{ flexShrink: 0, whiteSpace: 'nowrap' }}>{l}</button>
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
