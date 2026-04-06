import './globals.css'

export const metadata = { title: 'MedFlow', description: 'Cabinet Medical — Platformă Digitală' }

export default function RootLayout({ children }) {
  return (
    <html lang="ro">
      <body>{children}</body>
    </html>
  )
}
