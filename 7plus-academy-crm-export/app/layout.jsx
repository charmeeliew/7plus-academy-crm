import './globals.css'

export const metadata = {
  title: 'Student Management Agency',
  description: 'A comprehensive student management system',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-gray-50">
        {children}
      </body>
    </html>
  )
} 