'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

export default function AuthGuard({ children }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const checkAuth = () => {
      const token = localStorage.getItem('authToken')
      const user = localStorage.getItem('user')

      if (!token || !user) {
        router.push('/login')
        return
      }

      try {
        // Verify token (in production, this would be a server-side verification)
        const userData = JSON.parse(user)
        if (userData && userData.id) {
          setIsAuthenticated(true)
        } else {
          localStorage.removeItem('authToken')
          localStorage.removeItem('user')
          router.push('/login')
        }
      } catch (error) {
        localStorage.removeItem('authToken')
        localStorage.removeItem('user')
        router.push('/login')
      } finally {
        setIsLoading(false)
      }
    }

    checkAuth()
  }, [router])

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return null
  }

  return children
} 