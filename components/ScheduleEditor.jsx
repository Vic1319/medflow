'use client'
import { useState } from 'react'
import { supabase } from '@/lib/supabase'
import { T } from '@/lib/theme'
import { Ic, Tag } from '@/components/ui'

const DAYS = ['Luni', 'Marți', 'Miercuri', 'Joi', 'Vineri', 'Sâmbătă', 'Duminică']
const HOURS = Array.from({ length: 13 }, (_, i) => String(i + 7).padStart(2, '0')) // 07-19

export default function ScheduleEditor({ doc, onClose, onSaved }) {
  const [schedule, setSchedule] = useState(() => {
    const s = {}
    DAYS.forEach(d => { s[d] = doc.schedule?.[d] || 'Liber' })
    return s
  })
  const [saving, setSaving] = useState(false)

  const setDay = (day, val) => setSchedule(s => ({ ...s, [day]: val }))
  const toggleFree = (day) => setSchedule(s => ({ ...s, [day]: s[day] === 'Liber' ? '08-16' : 'Liber' }))
  const setStart = (day, h) => {
    const cur = schedule[day]
    const end = cur !== 'Liber' ? cur.split('-')[1] : '16'
    const newEnd = parseInt(h) >= parseInt(end) ? String(parseInt(h) + 1).padStart(2, '0') : end
    setDay(day, `${h}-${newEnd}`)
  }
  const setEnd = (day, h) => {
    const cur = schedule[day]
    const start = cur !== 'Liber' ? cur.split('-')[0] : '08'
    if (parseInt(h) <= parseInt(start)) return
    setDay(day, `${start}-${h}`)
  }

  const save = async () => {
    setSaving(true)
    await supabase.from('doctors').update({ schedule }).eq('id', doc.id)
    setSaving(false)
    onSaved()
    onClose()
  }

  return (
    <div className="ovl" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="modal" style={{ padding: 24 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
          <div>
            <div style={{ fontWeight: 800, fontSize: 17 }}>Program de lucru</div>
            <div style={{ fontSize: 12, color: T.inkLight }}>{doc.name}</div>
          </div>
          <button className="btn-g" style={{ padding: 6 }} onClick={onClose}><Ic n="x" s={15} /></button>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {DAYS.map(day => {
            const val = schedule[day]
            const isFree = val === 'Liber'
            const start = !isFree ? val.split('-')[0] : '08'
            const end = !isFree ? val.split('-')[1] : '16'
            return (
              <div key={day} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 14px', background: isFree ? T.surfaceAlt : '#EFF6FF', borderRadius: T.r12, border: `1.5px solid ${isFree ? T.border : T.blue}` }}>
                {/* Ziua */}
                <div style={{ width: 72, fontWeight: 700, fontSize: 13, color: isFree ? T.inkFaint : T.ink }}>{day}</div>

                {/* Toggle liber/activ */}
                <button className={`toggle ${isFree ? 'off' : 'on'}`} onClick={() => toggleFree(day)}>
                  <span className="knob" />
                </button>

                {isFree ? (
                  <span style={{ fontSize: 13, color: T.inkFaint, fontStyle: 'italic' }}>Liber</span>
                ) : (
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, flex: 1 }}>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: 10, fontWeight: 700, color: T.inkFaint, textTransform: 'uppercase', marginBottom: 3 }}>De la</div>
                      <select value={start} onChange={e => setStart(day, e.target.value)} style={{ width: '100%', padding: '6px 10px', border: `1.5px solid ${T.border}`, borderRadius: T.r8, fontSize: 14, fontWeight: 600, outline: 'none', background: T.surface }}>
                        {HOURS.slice(0, -1).map(h => <option key={h} value={h}>{h}:00</option>)}
                      </select>
                    </div>
                    <div style={{ paddingTop: 16, color: T.inkFaint, fontWeight: 700 }}>—</div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: 10, fontWeight: 700, color: T.inkFaint, textTransform: 'uppercase', marginBottom: 3 }}>Până la</div>
                      <select value={end} onChange={e => setEnd(day, e.target.value)} style={{ width: '100%', padding: '6px 10px', border: `1.5px solid ${T.border}`, borderRadius: T.r8, fontSize: 14, fontWeight: 600, outline: 'none', background: T.surface }}>
                        {HOURS.slice(1).map(h => <option key={h} value={h} disabled={parseInt(h) <= parseInt(start)}>{h}:00</option>)}
                      </select>
                    </div>
                    <div style={{ paddingTop: 16 }}>
                      <Tag v="blue">{parseInt(end) - parseInt(start)}h</Tag>
                    </div>
                  </div>
                )}
              </div>
            )
          })}
        </div>

        {/* Sumar */}
        <div style={{ marginTop: 16, padding: '10px 14px', background: T.surfaceAlt, borderRadius: T.r12, border: `1px solid ${T.border}` }}>
          <div style={{ fontSize: 12, fontWeight: 700, color: T.inkMid, marginBottom: 6 }}>Sumar program</div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
            {DAYS.map(day => {
              const val = schedule[day]
              if (val === 'Liber') return null
              return <span key={day} style={{ fontSize: 12, background: '#EFF6FF', color: T.blue, borderRadius: T.r8, padding: '3px 10px', fontWeight: 600 }}>{day} {val}</span>
            })}
          </div>
        </div>

        <div style={{ display: 'flex', gap: 10, marginTop: 16 }}>
          <button className="btn-g" onClick={onClose} style={{ flex: 1, justifyContent: 'center' }}>Anulează</button>
          <button className="btn-p" onClick={save} disabled={saving} style={{ flex: 1, justifyContent: 'center' }}>
            <Ic n="save" s={14} c="#fff" /> {saving ? 'Se salvează...' : 'Salvează programul'}
          </button>
        </div>
      </div>
    </div>
  )
}
