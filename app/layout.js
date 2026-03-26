import './globals.css'

export const metadata = {
  title: 'Nice Try — Quantum-Resistant Wallet',
  description: 'Account Abstraction + HD key rotation. One key per transaction.',
  icons: { icon: '/logo.svg' },
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="bg-[#171622] text-gray-100 min-h-screen">{children}</body>
    </html>
  )
}
