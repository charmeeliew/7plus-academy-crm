'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Button } from '../ui/button'
import { 
  Users, 
  UserPlus, 
  FileText, 
  TrendingUp, 
  MessageSquare, 
  BookOpen, 
  Plane, 
  Award, 
  Menu, 
  X, 
  Home, 
  Table, 
  User, 
  Settings,
  LogOut,
  UserCheck,
  ClipboardList,
  Users2
} from 'lucide-react'

export default function DashboardLayout({ children }) {
  const [currentUser, setCurrentUser] = useState(null)
  const router = useRouter()

  useEffect(() => {
    const user = localStorage.getItem('user')
    if (user) {
      setCurrentUser(JSON.parse(user))
    }
  }, [])

  const handleLogout = () => {
    localStorage.removeItem('authToken')
    localStorage.removeItem('user')
    router.push('/login')
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Dashboard Header */}
      <header className="bg-white shadow-sm border-b fixed top-0 left-0 right-0 z-50">
        <div className="flex items-center justify-between px-6 py-4">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <Award className="w-5 h-5 text-white" />
              </div>
              <h1 className="text-xl font-bold text-gray-900">7+ Academy CRM</h1>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            {currentUser && (
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <UserCheck className="w-4 h-4" />
                <span>{currentUser.name}</span>
              </div>
            )}
            <Link href="/tasks">
              <Button variant="outline" size="sm">
                <ClipboardList className="w-4 h-4 mr-2" />
                My Tasks
              </Button>
            </Link>
            <Link href="/form">
              <Button size="sm">
                <UserPlus className="w-4 h-4 mr-2" />
                Add Student
              </Button>
            </Link>
            <Button variant="outline" size="sm" onClick={handleLogout}>
              <LogOut className="w-4 h-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>
      </header>

      <div className="flex pt-16">
        {/* Sidebar Navigation */}
        <aside className="w-64 bg-white shadow-sm min-h-screen fixed left-0 top-16 z-40">
          <nav className="p-4">
            <div className="space-y-2">
              <Link href="/dashboard" className="flex items-center space-x-3 px-3 py-2 text-gray-700 bg-blue-50 rounded-lg">
                <Home className="w-5 h-5" />
                <span className="font-medium">Dashboard</span>
              </Link>
              <Link href="/students/table" className="flex items-center space-x-3 px-3 py-2 text-gray-600 hover:bg-gray-50 rounded-lg">
                <Table className="w-5 h-5" />
                <span>Students Data Table</span>
              </Link>
              <Link href="/students/overview" className="flex items-center space-x-3 px-3 py-2 text-gray-600 hover:bg-gray-50 rounded-lg">
                <User className="w-5 h-5" />
                <span>Students Overview</span>
              </Link>
              <Link href="/schools" className="flex items-center space-x-3 px-3 py-2 text-gray-600 hover:bg-gray-50 rounded-lg">
                <BookOpen className="w-5 h-5" />
                <span>Schools Database</span>
              </Link>
              {currentUser?.role === 'admin' && (
                <>
                  <Link href="/admin/assign-tasks" className="flex items-center space-x-3 px-3 py-2 text-gray-600 hover:bg-gray-50 rounded-lg">
                    <Users2 className="w-5 h-5" />
                    <span>Assign Tasks</span>
                  </Link>
                  <Link href="/admin/users" className="flex items-center space-x-3 px-3 py-2 text-gray-600 hover:bg-gray-50 rounded-lg">
                    <Users className="w-5 h-5" />
                    <span>User Management</span>
                  </Link>
                </>
              )}
            </div>
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 ml-64 p-6 md:p-8">
          {children}
        </main>
      </div>
    </div>
  )
} 