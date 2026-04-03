-- ============================================================
-- MedFlow — Creare useri demo în Supabase Auth
-- Rulează DUPĂ schema.sql în SQL Editor
-- ============================================================
-- Parole demo:
--   admin@medflow.ro       → Admin123!
--   ionescu@medflow.ro     → Doctor123!
--   popa@medflow.ro        → Doctor123!
--   vasilescu@medflow.ro   → Doctor123!
--   marinescu@medflow.ro   → Doctor123!
--   popescu.m@email.ro     → Pacient123!
--   dumitrescu.i@email.ro  → Pacient123!
--   ionescu.c@email.ro     → Pacient123!
-- ============================================================

do $$
declare
  uid_admin      uuid := gen_random_uuid();
  uid_ionescu    uuid := gen_random_uuid();
  uid_popa       uuid := gen_random_uuid();
  uid_vasilescu  uuid := gen_random_uuid();
  uid_marinescu  uuid := gen_random_uuid();
  uid_popescu    uuid := gen_random_uuid();
  uid_dumitrescu uuid := gen_random_uuid();
  uid_ionescu_c  uuid := gen_random_uuid();
begin

  -- ── Inserează în auth.users ────────────────────────────
  insert into auth.users
    (id, instance_id, email, encrypted_password, email_confirmed_at,
     created_at, updated_at, role, aud,
     raw_app_meta_data, raw_user_meta_data, is_super_admin)
  values
    (uid_admin,      '00000000-0000-0000-0000-000000000000', 'admin@medflow.ro',
     crypt('Admin123!',    gen_salt('bf')), now(), now(), now(), 'authenticated', 'authenticated',
     '{"provider":"email","providers":["email"]}', '{"role":"admin"}', false),

    (uid_ionescu,    '00000000-0000-0000-0000-000000000000', 'ionescu@medflow.ro',
     crypt('Doctor123!',   gen_salt('bf')), now(), now(), now(), 'authenticated', 'authenticated',
     '{"provider":"email","providers":["email"]}', '{"role":"doctor"}', false),

    (uid_popa,       '00000000-0000-0000-0000-000000000000', 'popa@medflow.ro',
     crypt('Doctor123!',   gen_salt('bf')), now(), now(), now(), 'authenticated', 'authenticated',
     '{"provider":"email","providers":["email"]}', '{"role":"doctor"}', false),

    (uid_vasilescu,  '00000000-0000-0000-0000-000000000000', 'vasilescu@medflow.ro',
     crypt('Doctor123!',   gen_salt('bf')), now(), now(), now(), 'authenticated', 'authenticated',
     '{"provider":"email","providers":["email"]}', '{"role":"doctor"}', false),

    (uid_marinescu,  '00000000-0000-0000-0000-000000000000', 'marinescu@medflow.ro',
     crypt('Doctor123!',   gen_salt('bf')), now(), now(), now(), 'authenticated', 'authenticated',
     '{"provider":"email","providers":["email"]}', '{"role":"doctor"}', false),

    (uid_popescu,    '00000000-0000-0000-0000-000000000000', 'popescu.m@email.ro',
     crypt('Pacient123!',  gen_salt('bf')), now(), now(), now(), 'authenticated', 'authenticated',
     '{"provider":"email","providers":["email"]}', '{"role":"patient"}', false),

    (uid_dumitrescu, '00000000-0000-0000-0000-000000000000', 'dumitrescu.i@email.ro',
     crypt('Pacient123!',  gen_salt('bf')), now(), now(), now(), 'authenticated', 'authenticated',
     '{"provider":"email","providers":["email"]}', '{"role":"patient"}', false),

    (uid_ionescu_c,  '00000000-0000-0000-0000-000000000000', 'ionescu.c@email.ro',
     crypt('Pacient123!',  gen_salt('bf')), now(), now(), now(), 'authenticated', 'authenticated',
     '{"provider":"email","providers":["email"]}', '{"role":"patient"}', false)

  on conflict (email) do nothing;

  -- ── Inserează în profiles ──────────────────────────────
  insert into profiles (id, role, doctor_id, patient_id) values
    (uid_admin,      'admin',   null, null),
    (uid_ionescu,    'doctor',  1,    null),
    (uid_popa,       'doctor',  2,    null),
    (uid_vasilescu,  'doctor',  3,    null),
    (uid_marinescu,  'doctor',  4,    null),
    (uid_popescu,    'patient', null, 101),
    (uid_dumitrescu, 'patient', null, 102),
    (uid_ionescu_c,  'patient', null, 103)
  on conflict (id) do nothing;

end $$;
