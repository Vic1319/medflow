'use client'
import { useState } from 'react'
import { supabase } from '@/lib/supabase'
import { T, fmt } from '@/lib/theme'
import { Ic, Tag, FF, useIsMobile } from '@/components/ui'

export default function MedicalRecordForm({ record, appt, onClose, onSaved }) {
  const mob = useIsMobile()
  const [form, setForm] = useState({
    masa: record?.masa || '',
    fr: record?.fr || '',
    spo2: record?.spo2 || '',
    inaltime: record?.inaltime || '',
    pc: record?.pc || '',
    temperatura: record?.temperatura || '',
    fcc: record?.fcc || '',
    ta: record?.ta || '',
    pt: record?.pt || '',
    acuze: record?.acuze || '',
    anamneza_bolii: record?.anamneza_bolii || '',
    anamneza_alergologica: record?.anamneza_alergologica || '',
    anamneza_vietii: record?.anamneza_vietii || '',
    anamneza_morbiditatii: record?.anamneza_morbiditatii || '',
    date_obiective: record?.date_obiective || '',
    sistem_nervos: record?.sistem_nervos || '',
    sistem_osteoarticular: record?.sistem_osteoarticular || '',
    diagnostic: record?.diagnostic || '',
    recomandari: record?.recomandari || '',
    tratament_stationar: record?.tratament_stationar || '',
  })
  const [saving, setSaving] = useState(false)

  const f = (k) => (e) => setForm(p => ({ ...p, [k]: e.target.value }))

  const save = async (finalize = false) => {
    setSaving(true)
    const payload = {
      ...form,
      status: finalize ? 'completed' : 'draft',
      completed_at: finalize ? new Date().toISOString() : null,
    }
    if (record?.id) {
      await supabase.from('medical_records').update(payload).eq('id', record.id)
    } else {
      await supabase.from('medical_records').insert({
        ...payload,
        appointment_id: appt.id,
        patient_id: appt.patientId,
        doctor_id: appt.doctorId,
        patient_name: appt.patient,
        doctor_name: appt.doctor,
      })
    }
    setSaving(false)
    onSaved()
    if (finalize) onClose()
  }

  const S = { fontSize: 12, fontWeight: 700, color: T.inkMid, letterSpacing: '.04em', textTransform: 'uppercase', marginBottom: 8, marginTop: 16, paddingBottom: 4, borderBottom: `2px solid ${T.border}` }
  const inp = { width: '100%', padding: '9px 12px', background: T.surface, border: `1.5px solid ${T.border}`, borderRadius: T.r8, fontSize: 14, color: T.ink, outline: 'none' }
  const ta = { ...inp, resize: 'vertical', minHeight: 70, fontFamily: 'inherit' }
  const grid2 = { display: 'grid', gridTemplateColumns: mob ? '1fr' : '1fr 1fr', gap: 10 }
  const grid4 = { display: 'grid', gridTemplateColumns: mob ? '1fr 1fr' : 'repeat(4,1fr)', gap: 8 }

  return (
    <div className="ovl" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="modal" style={{ padding: mob ? 16 : 24 }}>
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
          <div>
            <div style={{ fontWeight: 800, fontSize: 17 }}>Fișă de control</div>
            <div style={{ fontSize: 12, color: T.inkLight }}>{appt?.patient} · {appt?.date ? fmt(appt.date) : ''} {appt?.time}</div>
          </div>
          <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
            {record?.status === 'completed' && <Tag v="green" dot>Completată</Tag>}
            {record?.status === 'draft' && <Tag v="yellow" dot>Ciornă</Tag>}
            {(!record?.status || record?.status === 'pending') && <Tag v="default" dot>Nouă</Tag>}
            <button className="btn-g" style={{ padding: 6 }} onClick={onClose}><Ic n="x" s={15} /></button>
          </div>
        </div>

        {/* Semne vitale */}
        <div style={S}>Semne vitale</div>
        <div style={grid4}>
          {[['masa','Masă (kg)'],['fr','FR'],['spo2','SpO2 (%)'],['inaltime','Înălțime (cm)'],['pc','PC (cm)'],['temperatura','Temperatură'],['fcc','FCC'],['ta','TA'],['pt','PT']].map(([k,l]) => (
            <div key={k}>
              <div style={{ fontSize: 11, fontWeight: 700, color: T.inkFaint, textTransform: 'uppercase', marginBottom: 3 }}>{l}</div>
              <input style={inp} value={form[k]} onChange={f(k)} placeholder="—" />
            </div>
          ))}
        </div>

        {/* Anamneză */}
        <div style={S}>Anamneză</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          <FF label="Acuze"><textarea style={ta} value={form.acuze} onChange={f('acuze')} placeholder="Descrieți acuzele pacientului..." /></FF>
          <FF label="Anamneza bolii"><textarea style={ta} value={form.anamneza_bolii} onChange={f('anamneza_bolii')} /></FF>
          <div style={grid2}>
            <FF label="Anamneza alergologică"><textarea style={{ ...ta, minHeight: 50 }} value={form.anamneza_alergologica} onChange={f('anamneza_alergologica')} /></FF>
            <FF label="Anamneza vieții"><textarea style={{ ...ta, minHeight: 50 }} value={form.anamneza_vietii} onChange={f('anamneza_vietii')} /></FF>
          </div>
          <FF label="Anamneza morbidității"><textarea style={{ ...ta, minHeight: 50 }} value={form.anamneza_morbiditatii} onChange={f('anamneza_morbiditatii')} /></FF>
        </div>

        {/* Date obiective */}
        <div style={S}>Date obiective</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          <FF label="Examen obiectiv general"><textarea style={ta} value={form.date_obiective} onChange={f('date_obiective')} placeholder="Starea generală, tegumente, ganglioni, mucoase, respirație, cord, abdomen..." /></FF>
          <div style={grid2}>
            <FF label="Sistemul nervos"><textarea style={{ ...ta, minHeight: 50 }} value={form.sistem_nervos} onChange={f('sistem_nervos')} /></FF>
            <FF label="Sistemul osteoarticular"><textarea style={{ ...ta, minHeight: 50 }} value={form.sistem_osteoarticular} onChange={f('sistem_osteoarticular')} /></FF>
          </div>
        </div>

        {/* Diagnostic & tratament */}
        <div style={S}>Diagnostic & Recomandări</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          <FF label="Diagnostic" required><textarea style={{ ...ta, border: `1.5px solid ${T.blue}` }} value={form.diagnostic} onChange={f('diagnostic')} placeholder="Diagnosticul principal și secundar..." /></FF>
          <FF label="Recomandări"><textarea style={ta} value={form.recomandari} onChange={f('recomandari')} placeholder="Tratament, regim, revenire la control..." /></FF>
          <FF label="Tratament în staționar"><textarea style={{ ...ta, minHeight: 50 }} value={form.tratament_stationar} onChange={f('tratament_stationar')} /></FF>
        </div>

        {/* Butoane */}
        <div style={{ display: 'flex', gap: 10, marginTop: 20 }}>
          <button className="btn-g" onClick={() => save(false)} disabled={saving} style={{ flex: 1, justifyContent: 'center' }}>
            <Ic n="save" s={14} /> {saving ? 'Se salvează...' : 'Salvează ciornă'}
          </button>
          <button className="btn-p" onClick={() => save(true)} disabled={saving} style={{ flex: 1, justifyContent: 'center' }}>
            <Ic n="chk" s={14} c="#fff" /> {saving ? 'Se salvează...' : 'Finalizează fișa'}
          </button>
        </div>
      </div>
    </div>
  )
}
