import './globals.css'
import { Inter } from 'next/font/google'
import Header from '../components/Header';

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'Melgo Travel | Your Journey Starts Here',
  description: 'Explore the world with Melgo Travel. We offer the best tour packages, hotel bookings, and spiritual journeys to Makkah and Madinah.',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Header />
        {children}
      </body>
    </html>
  )
}
