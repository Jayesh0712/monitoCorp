// src/app/layout.tsx
import './globals.css'
import { Inter } from 'next/font/google'
import Providers from './provider'
import MainLayout from '../components/Layout/MainLayout'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'MonitoCorp SRE Dashboard',
  description: 'Real-time monitoring of microservices',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Providers>
          <MainLayout>
            {children}
          </MainLayout>
        </Providers>
      </body>
    </html>
  )
}
