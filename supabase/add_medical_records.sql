-- ============================================================
-- MedFlow — Migrare: Fișe de control + Disponibilitate
-- Rulează în Supabase SQL Editor pe baza existentă
-- ============================================================

create table if not exists medical_records (
  id                    serial primary key,
  appointment_id        int references appointments(id) on delete cascade unique,
  patient_id            int references patients(id) on delete cascade,
  doctor_id             int references doctors(id) on delete cascade,
  patient_name          text default '',
  doctor_name           text default '',
  -- Semne vitale
  masa                  text default '',
  fr                    text default '',
  spo2                  text default '',
  inaltime              text default '',
  pc                    text default '',
  temperatura           text default '',
  fcc                   text default '',
  ta                    text default '',
  pt                    text default '',
  -- Anamneză
  acuze                 text default '',
  anamneza_bolii        text default '',
  anamneza_alergologica text default '',
  anamneza_vietii       text default '',
  anamneza_morbiditatii text default '',
  -- Date obiective
  date_obiective        text default '',
  sistem_nervos         text default '',
  sistem_osteoarticular text default '',
  -- Diagnostic & tratament
  diagnostic            text default '',
  recomandari           text default '',
  tratament_stationar   text default '',
  -- Status
  status                text default 'pending',
  completed_at          timestamptz,
  created_at            timestamptz default now()
);

alter table medical_records enable row level security;
create policy "auth_all_medical_records" on medical_records for all to authenticated using (true) with check (true);

-- Crează fișe de control pentru programările existente
insert into medical_records (appointment_id, patient_id, doctor_id, patient_name, doctor_name)
select id, patient_id, doctor_id, patient_name, doctor_name
from appointments
on conflict (appointment_id) do nothing;
