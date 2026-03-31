import './globals.css'

export const metadata = { title: 'MedFlow', description: 'Clinică Pediatrică — Cabinet Digital' }

export default function RootLayout({ children }) {
  return (
    <html lang="ro">
      <body>{children}</body>
    </html>
  )
}
