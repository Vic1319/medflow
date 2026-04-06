export const T = {
  cyan: '#00B4D8', cyanDim: '#CAF0F8', blue: '#0077B6', blueDark: '#023E8A',
  navy: '#03045E', bg: '#F0F7FF', surface: '#FFFFFF', surfaceAlt: '#F8FBFF',
  border: '#DDEEFF', borderMid: '#B8D4EE', success: '#059669', successBg: '#ECFDF5',
  warning: '#D97706', warningBg: '#FFFBEB', danger: '#DC2626', dangerBg: '#FEF2F2',
  purple: '#7C3AED', purpleBg: '#F5F3FF', ink: '#0A1628', inkMid: '#3D5A80',
  inkLight: '#7A93B0', inkFaint: '#A8C0D6', r8: '8px', r12: '12px', r16: '16px',
  r24: '24px', rFull: '9999px', shadowSm: '0 1px 3px rgba(0,100,200,0.08)',
  shadowLg: '0 12px 40px rgba(0,100,200,0.14)',
}

export const age = (dob) => {
  try {
    const b = new Date(dob), n = new Date()
    let a = n.getFullYear() - b.getFullYear()
    if (n.getMonth() < b.getMonth() || (n.getMonth() === b.getMonth() && n.getDate() < b.getDate())) a--
    return a
  } catch { return 0 }
}

export const fmt = (d) => {
  try { return new Date((d.length === 10 ? d + 'T12:00:00' : d)).toLocaleDateString('ro-RO', { day: '2-digit', month: 'short', year: 'numeric' }) }
  catch { return d }
}

export const fmtS = (d) => {
  try { return new Date(d + 'T12:00:00').toLocaleDateString('ro-RO', { day: '2-digit', month: 'short' }) }
  catch { return d }
}

// DB → UI field mappers
export const mapDoctor = (d) => ({ ...d, on: d.is_active ?? d.on, av: d.avatar_variant ?? d.av, patients: d.patients_count ?? d.patients, today: d.today_count ?? d.today })
export const mapPatient = (p) => ({ ...p, group: p.blood_group ?? p.group, lastVisit: p.last_visit ?? p.lastVisit, doctor: p.doctor_name ?? p.doctor })
export const mapAppt = (a) => ({ ...a, patient: a.patient_name ?? a.patient, patientId: a.patient_id ?? a.patientId, doctor: a.doctor_name ?? a.doctor, doctorId: a.doctor_id ?? a.doctorId, serviceId: a.service_id ?? a.serviceId })
export const mapMsg = (m) => ({ ...m, from: m.from_name ?? m.from, fromRole: m.from_role ?? m.fromRole, fromId: m.from_id ?? m.fromId, to: m.to_name ?? m.to, toRole: m.to_role ?? m.toRole, toId: m.to_id ?? m.toId, read: m.is_read ?? m.read })
export const mapRx = (r) => ({ ...r, patientId: r.patient_id ?? r.patientId, doctorId: r.doctor_id ?? r.doctorId, patientName: r.patient_name ?? r.patientName, doctorName: r.doctor_name ?? r.doctorName })
export const mapService = (s) => ({ ...s, desc: s.description ?? s.desc, active: s.is_active ?? s.active })
export const mapDelReq = (r) => ({ ...r, doctorName: r.doctor_name ?? r.doctorName, doctorId: r.doctor_id ?? r.doctorId, patientName: r.patient_name ?? r.patientName, patientId: r.patient_id ?? r.patientId })
export const mapMedRecord = (r) => ({ ...r, patientId: r.patient_id ?? r.patientId, doctorId: r.doctor_id ?? r.doctorId, appointmentId: r.appointment_id ?? r.appointmentId, patientName: r.patient_name ?? r.patientName, doctorName: r.doctor_name ?? r.doctorName })
export const mapAnalysis = (a) => ({ ...a, patientId: a.patient_id ?? a.patientId, doctorId: a.doctor_id ?? a.doctorId, patientName: a.patient_name ?? a.patientName, doctorName: a.doctor_name ?? a.doctorName, fileUrl: a.file_url ?? a.fileUrl })

// Generează sloturi orare pentru o zi (la fiecare 30 min)
export const generateSlots = (scheduleStr) => {
  const slots = []
  if (!scheduleStr || scheduleStr === 'Liber') return slots
  const [start, end] = scheduleStr.split('-').map(s => parseInt(s))
  if (isNaN(start) || isNaN(end)) return slots
  for (let h = start; h < end; h++) { slots.push(`${String(h).padStart(2,'0')}:00`); slots.push(`${String(h).padStart(2,'0')}:30`) }
  return slots
}

export const PSTATUS = { 'Sănătos': 'green', 'În tratament': 'yellow', 'Control periodic': 'blue', 'Urgență': 'red' }
export const ASTATUS = { 'Confirmată': 'green', 'În așteptare': 'yellow', 'Anulată': 'red', 'Finalizată': 'cyan' }
export const ATYPE = { 'Consultație': 'blue', 'Control': 'cyan', 'Vaccinare': 'green', 'Urgență': 'red' }
