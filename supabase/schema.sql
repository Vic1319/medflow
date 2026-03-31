-- ============================================================
-- MedFlow — Supabase Schema + Seed Data
-- Rulează acest fișier în Supabase SQL Editor (Settings > SQL)
--
-- IMPORTANT: Înainte de a rula, dezactivează Email Confirmation:
--   Supabase Dashboard → Authentication → Email → Confirm email: OFF
-- ============================================================

-- ─── TABELE ───────────────────────────────────────────────

create table if not exists doctors (
  id             serial primary key,
  name           text not null,
  spec           text default '',
  exp            text default '0 ani',
  patients_count int  default 0,
  today_count    int  default 0,
  is_active      boolean default true,
  email          text unique not null,
  avatar_variant text default 'blue',
  phone          text default '',
  schedule       jsonb default '{}',
  bio            text default '',
  services       integer[] default '{}',
  created_at     timestamptz default now()
);

create table if not exists patients (
  id           serial primary key,
  name         text not null,
  dob          date,
  parent       text default '',
  phone        text default '',
  doctor_name  text default '',
  blood_group  text default 'A+',
  allergies    text default 'Niciuna',
  last_visit   date,
  status       text default 'Sănătos',
  notes        text default '',
  email        text unique not null,
  created_at   timestamptz default now()
);

-- Leagă utilizatorii Supabase Auth de roluri în aplicație
create table if not exists profiles (
  id         uuid references auth.users on delete cascade primary key,
  role       text not null check (role in ('admin', 'doctor', 'patient')),
  doctor_id  int references doctors(id) on delete set null,
  patient_id int references patients(id) on delete set null
);

create table if not exists appointments (
  id           serial primary key,
  patient_name text not null,
  patient_id   int references patients(id) on delete cascade,
  doctor_name  text not null,
  doctor_id    int references doctors(id) on delete cascade,
  date         date not null,
  time         text default '09:00',
  type         text default 'Consultație',
  status       text default 'În așteptare',
  room         text default 'Sala 1',
  service_id   int,
  created_at   timestamptz default now()
);

create table if not exists messages (
  id        serial primary key,
  from_name text not null,
  from_role text not null,
  from_id   int  not null,
  to_name   text not null,
  to_role   text not null,
  to_id     int  not null,
  text      text not null,
  date      date default current_date,
  is_read   boolean default false,
  created_at timestamptz default now()
);

create table if not exists prescriptions (
  id           serial primary key,
  patient_id   int references patients(id) on delete cascade,
  doctor_id    int references doctors(id) on delete cascade,
  patient_name text not null,
  doctor_name  text not null,
  date         date default current_date,
  medicines    text not null,
  diagnosis    text not null,
  status       text default 'Activă',
  created_at   timestamptz default now()
);

create table if not exists services (
  id          serial primary key,
  name        text not null,
  description text default '',
  price       text default '',
  duration    text default '',
  is_active   boolean default true,
  created_at  timestamptz default now()
);

create table if not exists delete_requests (
  id           serial primary key,
  doctor_name  text not null,
  doctor_id    int references doctors(id) on delete cascade,
  patient_name text not null,
  patient_id   int references patients(id) on delete cascade,
  status       text default 'pending',
  created_at   timestamptz default now()
);

-- ─── ROW LEVEL SECURITY ───────────────────────────────────

alter table doctors        enable row level security;
alter table patients       enable row level security;
alter table profiles       enable row level security;
alter table appointments   enable row level security;
alter table messages       enable row level security;
alter table prescriptions  enable row level security;
alter table services       enable row level security;
alter table delete_requests enable row level security;

-- Permite utilizatorilor autentificați să citească/scrie tot
-- (restrânge în producție cu politici per-rol)
create policy "auth_all_doctors"       on doctors        for all to authenticated using (true) with check (true);
create policy "auth_all_patients"      on patients       for all to authenticated using (true) with check (true);
create policy "auth_own_profile"       on profiles       for all to authenticated using (auth.uid() = id) with check (auth.uid() = id);
create policy "auth_all_appointments"  on appointments   for all to authenticated using (true) with check (true);
create policy "auth_all_messages"      on messages       for all to authenticated using (true) with check (true);
create policy "auth_all_prescriptions" on prescriptions  for all to authenticated using (true) with check (true);
create policy "auth_all_services"      on services       for all to authenticated using (true) with check (true);
create policy "auth_all_delete_reqs"   on delete_requests for all to authenticated using (true) with check (true);

-- Permite citire publică pentru servicii și medici (pagina de booking)
create policy "public_read_services" on services for select using (true);
create policy "public_read_doctors"  on doctors  for select using (true);

-- ─── DATE SEED ────────────────────────────────────────────

insert into doctors (id, name, spec, exp, patients_count, today_count, is_active, email, avatar_variant, phone, schedule, bio, services)
values
  (1, 'Dr. Ionescu Alexandra', 'Pediatrie generală',   '12 ani', 148, 6, true,  'ionescu@medflow.ro',   'cyan',   '0722 100 001', '{"Luni":"08-16","Marți":"08-16","Miercuri":"08-14","Joi":"08-16","Vineri":"08-12","Sâmbătă":"Liber","Duminică":"Liber"}', 'Specialist pediatrie.',   '{1,2,3}'),
  (2, 'Dr. Popa Gheorghe',      'Neonatologie',         '8 ani',  112, 4, true,  'popa@medflow.ro',      'blue',   '0722 100 002', '{"Luni":"09-17","Marți":"09-17","Miercuri":"09-17","Joi":"09-15","Vineri":"09-17","Sâmbătă":"Liber","Duminică":"Liber"}', 'Specialist neonatologie.','{1,2,4}'),
  (3, 'Dr. Vasilescu Ioana',    'Cardiologie pediatrică','15 ani', 93, 3, false, 'vasilescu@medflow.ro', 'purple', '0722 100 003', '{"Luni":"10-18","Marți":"10-18","Miercuri":"Liber","Joi":"10-18","Vineri":"10-16","Sâmbătă":"Liber","Duminică":"Liber"}', 'Specialist cardiologie.', '{1,5}'),
  (4, 'Dr. Marinescu Radu',     'Neurologie pediatrică','10 ani',  76, 5, true,  'marinescu@medflow.ro', 'green',  '0722 100 004', '{"Luni":"07-15","Marți":"07-15","Miercuri":"07-15","Joi":"07-15","Vineri":"07-13","Sâmbătă":"09-13","Duminică":"Liber"}', 'Specialist neurologie.',  '{1,6}')
on conflict (id) do nothing;

insert into patients (id, name, dob, parent, phone, doctor_name, blood_group, allergies, last_visit, status, notes, email)
values
  (101, 'Popescu Andrei',   '2018-03-12', 'Popescu Maria',    '0722 111 222', 'Dr. Ionescu Alexandra', 'B+', 'Polen',      '2024-11-20', 'Sănătos',      'Control anual. Vaccinuri la zi. Dezvoltare normală.',                         'popescu.m@email.ro'),
  (102, 'Dumitrescu Elena', '2020-07-04', 'Dumitrescu Ion',   '0733 222 333', 'Dr. Popa Gheorghe',     'A+', 'Niciuna',    '2024-12-01', 'În tratament', 'Otită medie. Tratament antibiotic în curs.',                                 'dumitrescu.i@email.ro'),
  (103, 'Ionescu Mihai',    '2016-11-22', 'Ionescu Cristina', '0744 333 444', 'Dr. Ionescu Alexandra', 'O-', 'Penicilină', '2024-10-15', 'Sănătos',      'Alergie severă penicilină. Necesită alternativă antibiotică.', 'ionescu.c@email.ro')
on conflict (id) do nothing;

-- Resetează secvențele după insert cu ID-uri fixe
select setval('doctors_id_seq',  (select max(id) from doctors));
select setval('patients_id_seq', (select max(id) from patients));

insert into services (id, name, description, price, duration, is_active)
values
  (1, 'Consultație pediatru',      'Consultație generală',      '150 RON', '30 min', true),
  (2, 'Control periodic',          'Control de rutină',         '120 RON', '20 min', true),
  (3, 'Vaccinare',                 'Administrare vaccinuri',    '80 RON',  '15 min', true),
  (4, 'Consultație neonatologie',  'Evaluare nou-născuți',      '200 RON', '40 min', true),
  (5, 'Ecografie cardiacă',        'Ecocardiografie pediatrică','350 RON', '45 min', true),
  (6, 'Evaluare neurologică',      'Neurologie pediatrică',     '250 RON', '40 min', true)
on conflict (id) do nothing;

insert into appointments (id, patient_name, patient_id, doctor_name, doctor_id, date, time, type, status, room, service_id)
values
  (1, 'Popescu Andrei',   101, 'Dr. Ionescu Alexandra', 1, '2025-01-15', '09:00', 'Control',     'Finalizată',    'Sala 1', 2),
  (2, 'Dumitrescu Elena', 102, 'Dr. Popa Gheorghe',     2, '2025-01-15', '10:30', 'Consultație', 'Finalizată',    'Sala 2', 1),
  (3, 'Ionescu Mihai',    103, 'Dr. Ionescu Alexandra', 1, '2025-01-16', '08:30', 'Vaccinare',   'Confirmată',    'Sala 1', 3),
  (4, 'Popescu Andrei',   101, 'Dr. Popa Gheorghe',     2, '2024-11-20', '11:00', 'Consultație', 'Finalizată',    'Sala 2', 1),
  (5, 'Popescu Andrei',   101, 'Dr. Ionescu Alexandra', 1, '2024-10-05', '09:00', 'Vaccinare',   'Finalizată',    'Sala 1', 3),
  (6, 'Popescu Andrei',   101, 'Dr. Vasilescu Ioana',   3, '2024-08-12', '14:00', 'Consultație', 'Finalizată',    'Sala 3', 5),
  (7, 'Ionescu Mihai',    103, 'Dr. Marinescu Radu',    4, '2024-09-10', '10:00', 'Consultație', 'Finalizată',    'Sala 2', 6),
  (8, 'Dumitrescu Elena', 102, 'Dr. Popa Gheorghe',     2, '2025-01-20', '09:00', 'Control',     'În așteptare', 'Sala 2', 2)
on conflict (id) do nothing;

insert into messages (id, from_name, from_role, from_id, to_name, to_role, to_id, text, date, is_read)
values
  (1, 'Dr. Ionescu Alexandra', 'doctor',  1,   'Popescu Andrei',       'patient', 101, 'Rezultatele analizelor sunt bune. Vitamina D în parametri normali acum.', '2025-01-14', false),
  (2, 'Popescu Maria',         'patient', 101, 'Dr. Ionescu Alexandra','doctor',  1,   'Mulțumim frumos! Ne vedem la control.',                                   '2025-01-14', true),
  (3, 'Dr. Popa Gheorghe',     'doctor',  2,   'Dumitrescu Elena',     'patient', 102, 'Continuați tratamentul. Ne vedem la reevaluare.',                         '2025-01-13', false),
  (4, 'Dr. Popa Gheorghe',     'doctor',  2,   'Popescu Andrei',       'patient', 101, 'Consult OK. Totul în regulă.',                                            '2024-11-20', true)
on conflict (id) do nothing;

insert into prescriptions (id, patient_id, doctor_id, patient_name, doctor_name, date, medicines, diagnosis, status)
values
  (1, 101, 1, 'Popescu Andrei',   'Dr. Ionescu Alexandra', '2025-01-10', 'Vitamina D 1000UI — 1/zi',              'Deficit vitamina D',     'Activă'),
  (2, 102, 2, 'Dumitrescu Elena', 'Dr. Popa Gheorghe',     '2025-01-05', 'Amoxicilină 250mg — 3x/zi, 7 zile',    'Otită medie acută',      'Activă'),
  (3, 101, 2, 'Popescu Andrei',   'Dr. Popa Gheorghe',     '2024-11-20', 'Paracetamol 250mg — la nevoie',         'Febră virală',           'Expirată'),
  (4, 103, 4, 'Ionescu Mihai',    'Dr. Marinescu Radu',    '2024-09-10', 'Evaluare EEG — programată',             'Screening neurologic',   'Expirată')
on conflict (id) do nothing;

-- ─── CUM SĂ CREEZI CONTUL ADMIN ───────────────────────────
-- 1. Mergi la Supabase Dashboard → Authentication → Users → Add user
-- 2. Email: admin@medflow.ro  /  Parolă: alege una
-- 3. Rulează SQL-ul de mai jos (înlocuiește UUID-ul cu cel real):
--
-- insert into profiles (id, role)
-- values ('<UUID-din-auth-users>', 'admin');
--
-- ─── CUM SĂ TESTEZI CU CONTURI DEMO ──────────────────────
-- 1. Deschide aplicația → selectează rolul dorit
-- 2. Click "Creează cont" → folosește emailul din seed:
--    Doctor:  ionescu@medflow.ro  (se leagă automat la Dr. Ionescu)
--    Pacient: popescu.m@email.ro  (se leagă automat la Popescu Andrei)
-- 3. Parola poate fi orice (min 6 caractere)
