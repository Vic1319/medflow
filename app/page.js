'use client'
import { useState, useEffect, useCallback } from 'react'
import { supabase } from '@/lib/supabase'
import { mapDoctor, mapPatient } from '@/lib/theme'
import { T } from '@/lib/theme'
import { GS, Toast } from '@/components/ui'
import AuthScreen from '@/components/AuthScreen'
import PatientApp from '@/components/PatientApp'
import DoctorApp from '@/components/DoctorApp'
import AdminApp from '@/components/AdminApp'

export default function Home() {
  const [session, setSession] = useState(null)
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)
  const [toastD, setToastD] = useState(null)
  const showToast = useCallback((msg, type = 'success') => setToastD({ msg, type, k: Date.now() }), [])

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
      if (session) fetchOrCreateProfile(session.user)
      else setLoading(false)
    })
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      setSession(session)
      if (session) {
        await fetchOrCreateProfile(session.user)
      } else {
        setProfile(null)
        setLoading(false)
      }
    })
    return () => subscription.unsubscribe()
  }, [])

  const fetchOrCreateProfile = async (user) => {
    // Try to get existing profile
    let { data: prof } = await supabase.from('profiles').select('*').eq('id', user.id).single()

    if (!prof) {
      // Auto-link by email or use metadata from registration
      const meta = user.user_metadata || {}
      const role = meta.role

      if (user.email === 'admin@medflow.ro' || role === 'admin') {
        const { data } = await supabase.from('profiles').insert({ id: user.id, role: 'admin' }).select().single()
        prof = data
      } else if (role === 'doctor') {
        // Check if email exists in doctors table (seed data link)
        const { data: existingDoc } = await supabase.from('doctors').select('id').eq('email', user.email).single()
        let doctorId = existingDoc?.id
        if (!doctorId && meta.name) {
          const { data: newDoc } = await supabase.from('doctors').insert({
            name: meta.name, spec: meta.spec || '', exp: '0 ani', patients_count: 0, today_count: 0,
            is_active: true, email: user.email, avatar_variant: ['blue', 'cyan', 'purple', 'green'][Math.floor(Math.random() * 4)],
            phone: meta.phone || '', schedule: {}, bio: '', services: [],
          }).select().single()
          doctorId = newDoc?.id
        }
        if (doctorId) {
          const { data } = await supabase.from('profiles').insert({ id: user.id, role: 'doctor', doctor_id: doctorId }).select().single()
          prof = data
        }
      } else if (role === 'patient') {
        const { data: existingPat } = await supabase.from('patients').select('id').eq('email', user.email).single()
        let patientId = existingPat?.id
        if (!patientId && meta.child_name) {
          const { data: newPat } = await supabase.from('patients').insert({
            name: meta.child_name, dob: meta.dob, parent: meta.name, phone: meta.phone || '',
            doctor_name: meta.doctor_name || '', blood_group: meta.blood_group || 'A+',
            allergies: 'Niciuna', last_visit: new Date().toISOString().slice(0, 10),
            status: 'Sănătos', notes: '', email: user.email,
          }).select().single()
          patientId = newPat?.id
        }
        if (patientId) {
          const { data } = await supabase.from('profiles').insert({ id: user.id, role: 'patient', patient_id: patientId }).select().single()
          prof = data
        }
      }
    }

    setProfile(prof)
    setLoading(false)
  }

  const handleLogout = async () => {
    await supabase.auth.signOut()
    showToast('Deconectat', 'info')
  }

  if (loading) {
    return (
      <>
        <GS />
        <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: `linear-gradient(135deg,${T.navy} 0%,${T.blueDark} 40%,${T.blue} 100%)` }}>
          <img src="/logo.webp" alt="MedFlow" style={{ height: 90, animation: 'splashIn .8s cubic-bezier(.34,1.56,.64,1) both' }} />
          <p style={{ color: 'rgba(255,255,255,.65)', fontSize: 15, marginTop: 14, animation: 'splashSub .6s .35s both' }}>Clinică Pediatrică — Cabinet Digital</p>
          <div style={{ display: 'flex', gap: 7, marginTop: 36, animation: 'splashSub .6s .6s both' }}>
            {[0, .18, .36].map((d, i) => (
              <span key={i} style={{ width: 9, height: 9, borderRadius: '50%', background: 'rgba(255,255,255,.7)', display: 'inline-block', animation: `dot 1.3s ${d}s infinite ease-in-out` }} />
            ))}
          </div>
        </div>
      </>
    )
  }

  return (
    <>
      <GS />
      {!session
        ? <AuthScreen showToast={showToast} />
        : profile?.role === 'admin'
          ? <AdminApp profile={profile} onLogout={handleLogout} showToast={showToast} />
          : profile?.role === 'doctor'
            ? <DoctorApp profile={profile} onLogout={handleLogout} showToast={showToast} />
            : profile?.role === 'patient'
              ? <PatientApp profile={profile} onLogout={handleLogout} showToast={showToast} />
              : <div style={{ padding: 40, textAlign: 'center' }}>
                  <p>Contul tău nu are un rol asociat. Contactează administratorul.</p>
                  <button className="btn-g" style={{ marginTop: 16 }} onClick={handleLogout}>Deconectare</button>
                </div>
      }
      {toastD && <Toast key={toastD.k} msg={toastD.msg} type={toastD.type} onClose={() => setToastD(null)} />}
    </>
  )
}
