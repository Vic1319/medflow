# MedFlow — Claude Code Instructions

## Stack
Next.js 15 + React 19 + Supabase (PostgreSQL + Auth). UI medical ro-RO. Fără TypeScript.

## Structura fișierelor
```
app/
  layout.js          ← server component, root HTML
  page.js            ← 'use client', auth + role routing
  globals.css        ← minimal reset
components/
  ui.jsx             ← toate primitivele UI: Ic, GS, Tag, Av, Toast, FF, FG, Header, BNav, QRCode, QRModal, StatBox, Empty, Div, useIsMobile
  HistoryReport.jsx  ← vizualizare istoricul unui pacient
  AuthScreen.jsx     ← login/register cu Supabase Auth
  PatientApp.jsx     ← dashboard pacient
  DoctorApp.jsx      ← dashboard medic
  AdminApp.jsx       ← panou administrare
lib/
  supabase.js        ← createClient singleton
  theme.js           ← T (culori/raze), age/fmt/fmtS, mappers DB→UI, PSTATUS/ASTATUS/ATYPE
supabase/
  schema.sql         ← schema + seed data + instrucțiuni setup
.env.local           ← NEXT_PUBLIC_SUPABASE_URL + NEXT_PUBLIC_SUPABASE_ANON_KEY
```

## REGULI CRITICE

### Nu citi fișierele în întregime fără nevoie
- Caută cu **Grep** funcția/secțiunea, apoi citește cu **offset+limit**
- `components/ui.jsx` ~300 linii, `components/AdminApp.jsx` ~250 linii
- Restul componentelor sunt sub 200 linii

### Nu crea fișiere noi fără aprobare explicită
Toate componentele au fișiere dedicate deja. Nu crea helpers sau abstracții extra.

### Nu instala pachete noi fără aprobare
Dependențe: `next`, `react`, `react-dom`, `@supabase/supabase-js`. Zero UI libraries.

### Nu adăuga comentarii, docstrings sau tipuri
Codul e intenționat dens. Nu adăuga JSDoc, PropTypes sau TypeScript.

---

## Arhitectura datelor

### Tabel DB → câmpuri UI (via mappers din lib/theme.js)
| Tabel DB         | Câmpuri speciale                                                      |
|------------------|-----------------------------------------------------------------------|
| `doctors`        | `is_active`→`on`, `avatar_variant`→`av`, `patients_count`→`patients` |
| `patients`       | `blood_group`→`group`, `last_visit`→`lastVisit`, `doctor_name`→`doctor` |
| `appointments`   | `patient_name`→`patient`, `patient_id`→`patientId`, `doctor_name`→`doctor`, `doctor_id`→`doctorId`, `service_id`→`serviceId` |
| `messages`       | `from_name`→`from`, `from_role`→`fromRole`, `from_id`→`fromId`, `to_*` similar, `is_read`→`read` |
| `prescriptions`  | `patient_id`→`patientId`, `doctor_id`→`doctorId`, `patient_name`→`patientName`, `doctor_name`→`doctorName` |
| `services`       | `description`→`desc`, `is_active`→`active`                           |

### Roluri și profiles
- `profiles` (id=uuid din auth.users, role, doctor_id, patient_id)
- `app/page.js` → `fetchOrCreateProfile()` → auto-leagă email la record existent în doctors/patients

### Auth flow
1. `supabase.auth.signInWithPassword` / `signUp`
2. `onAuthStateChange` în `app/page.js` apelează `fetchOrCreateProfile`
3. `profiles.role` → render PatientApp / DoctorApp / AdminApp

---

## Theme (T) — culori cheie
```
T.cyan, T.blue, T.blueDark, T.navy — blue palette
T.success, T.warning, T.danger     — status colors
T.bg, T.surface, T.border          — layout
T.ink, T.inkMid, T.inkLight        — text
T.r8, T.r12, T.r16, T.r24, T.rFull — border radius
```

## Clase CSS (definite în GS din components/ui.jsx)
`.btn-p .btn-g .btn-d .btn-s` | `.inp .sel` | `.card .tag .dot` | `.ovl .modal` | `.sb` | `.pbar .pfill` | `.av .bnav .chip .lcard .toggle .fade-up`

## Componente UI exportate din components/ui.jsx
`useIsMobile` `GS` `Ic` `Tag` `Av` `Div` `Empty` `Toast` `FF` `FG` `StatBox` `Header` `BNav` `QRCode` `QRModal`

### Ic — iconițe disponibile
`home users cal steth bar srch plus trash left x chk alrt bell cfg eye ph shld clip edit clock save file lock logout user msg star link qr svc heart mail menu info dl act`

---

## Pattern data fetching (în fiecare role app)
```js
const fetchAll = useCallback(async () => {
  const { data } = await supabase.from('table').select('*').eq('col', val)
  setState((data || []).map(mapperFn))
}, [dep])
useEffect(() => { fetchAll() }, [fetchAll])
```

## Pattern mutații
```js
await supabase.from('table').insert({snake_case_fields})
// sau
await supabase.from('table').update({field}).eq('id', id)
// sau
await supabase.from('table').delete().eq('id', id)
// întotdeauna urmat de:
showToast('Mesaj succes')
await fetchAll()
```

## Comenzi
```bash
npm install   # după clonare
npm run dev   # dev server http://localhost:3000
npm run build # build producție
```

## Ce NU face Claude fără aprobare
- Nu rescrie componente întregi pentru refactorizare
- Nu muta cod între fișiere
- Nu adăuga librării externe
- Nu schimba sistemul de stiluri (nu Tailwind, nu CSS Modules)
- Nu crea fișiere `.md` de documentație extra
- Nu face push pe Git
