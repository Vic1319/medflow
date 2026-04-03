import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

// Endpoint one-time pentru creare useri demo
// Apelează: GET http://localhost:3000/api/seed
// SAU pe Vercel: https://domeniu.vercel.app/api/seed

const DEMO_USERS = [
  { email: 'admin@medflow.ro',      password: 'Admin123!',   role: 'admin',   doctor_id: null, patient_id: null },
  { email: 'ionescu@medflow.ro',    password: 'Doctor123!',  role: 'doctor',  doctor_id: 1,    patient_id: null },
  { email: 'popa@medflow.ro',       password: 'Doctor123!',  role: 'doctor',  doctor_id: 2,    patient_id: null },
  { email: 'vasilescu@medflow.ro',  password: 'Doctor123!',  role: 'doctor',  doctor_id: 3,    patient_id: null },
  { email: 'marinescu@medflow.ro',  password: 'Doctor123!',  role: 'doctor',  doctor_id: 4,    patient_id: null },
  { email: 'popescu.m@email.ro',    password: 'Pacient123!', role: 'patient', doctor_id: null, patient_id: 101 },
  { email: 'dumitrescu.i@email.ro', password: 'Pacient123!', role: 'patient', doctor_id: null, patient_id: 102 },
  { email: 'ionescu.c@email.ro',    password: 'Pacient123!', role: 'patient', doctor_id: null, patient_id: 103 },
]

export async function GET() {
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY
  if (!serviceKey || serviceKey.includes('pune_aici')) {
    return NextResponse.json({ error: 'SUPABASE_SERVICE_ROLE_KEY lipsește din .env.local' }, { status: 500 })
  }

  const admin = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, serviceKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  })

  const results = []

  for (const u of DEMO_USERS) {
    // Creează userul în Supabase Auth (pre-confirmat, fără email)
    const { data, error } = await admin.auth.admin.createUser({
      email: u.email,
      password: u.password,
      email_confirm: true,
    })

    if (error) {
      results.push({ email: u.email, status: 'skip', reason: error.message })
      continue
    }

    const userId = data.user.id

    // Inserează profilul
    const { error: profErr } = await admin.from('profiles').upsert({
      id: userId,
      role: u.role,
      doctor_id: u.doctor_id,
      patient_id: u.patient_id,
    })

    results.push({
      email: u.email,
      status: profErr ? 'user_ok_profile_err' : 'ok',
      reason: profErr?.message,
    })
  }

  return NextResponse.json({ results })
}
