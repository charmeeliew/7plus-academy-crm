'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "../../../components/ui/card"
import { Button } from "../../../components/ui/button"
import { Input } from "../../../components/ui/input"
import { Badge } from "../../../components/ui/badge"
import { 
  User, 
  Mail, 
  Shield, 
  Plus, 
  Edit, 
  Trash2, 
  Eye, 
  EyeOff,
  AlertCircle,
  CheckCircle,
  Users,
  Settings
} from "lucide-react"
import DashboardLayout from "../../../components/layout/DashboardLayout"

export default function UsersManagementPage() {
  const [currentUser, setCurrentUser] = useState(null)
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [showAddForm, setShowAddForm] = useState(false)
  const [editingUser, setEditingUser] = useState(null)
  const [showPassword, setShowPassword] = useState(false)
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    name: '',
    email: '',
    role: 'staff',
    assignedStages: []
  })

  useEffect(() => {
    const user = localStorage.getItem('user')
    if (user) {
      const userData = JSON.parse(user)
      setCurrentUser(userData)
      
      // Only allow admin access
      if (userData.role !== 'admin') {
        window.location.href = '/dashboard'
        return
      }
    }
    fetchUsers()
  }, [])

  const fetchUsers = async () => {
    try {
      // For now, we'll use the mock users from the login API
      // In a real implementation, you would fetch from a users API
      const mockUsers = [
        {
          id: 1,
          username: 'admin',
          name: 'Admin User',
          email: 'admin@7plusacademy.com',
          role: 'admin'
        },
        {
          id: 2,
          username: 'staff_a',
          name: 'Staff A - Early Stages',
          email: 'staffa@7plusacademy.com',
          role: 'staff',
          assignedStages: ['consultation', 'engagement', 'data_collection', 'data_enhancement']
        },
        {
          id: 3,
          username: 'staff_b',
          name: 'Staff B - Application Process',
          email: 'staffb@7plusacademy.com',
          role: 'staff',
          assignedStages: ['exam_preparation', 'file_application', 'entrance_exam', 'offer_rejection', 'student_contract']
        },
        {
          id: 4,
          username: 'staff_c',
          name: 'Staff C - Immigration Process',
          email: 'staffc@7plusacademy.com',
          role: 'staff',
          assignedStages: ['stp_application', 'travel_arrangement', 'landing', 'stp_collection', 'ltvp_application', 'ltvp_collection']
        }
      ]
      setUsers(mockUsers)
    } catch (error) {
      console.error('Error fetching users:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleAddUser = async (e) => {
    e.preventDefault()
    
    if (!formData.username || !formData.password || !formData.name || !formData.email) {
      alert('Please fill in all required fields')
      return
    }

    try {
      // Check if username already exists
      const existingUser = users.find(user => user.username === formData.username)
      if (existingUser) {
        alert('Username already exists')
        return
      }

      const newUser = {
        id: Date.now(),
        username: formData.username,
        password: formData.password, // In real app, this would be hashed
        name: formData.name,
        email: formData.email,
        role: formData.role,
        assignedStages: formData.assignedStages
      }

      setUsers([...users, newUser])
      setShowAddForm(false)
      setFormData({
        username: '',
        password: '',
        name: '',
        email: '',
        role: 'staff',
        assignedStages: []
      })
      
      alert('User added successfully')
    } catch (error) {
      console.error('Error adding user:', error)
      alert('Error adding user')
    }
  }

  const handleEditUser = async (e) => {
    e.preventDefault()
    
    if (!editingUser.name || !editingUser.email) {
      alert('Please fill in all required fields')
      return
    }

    try {
      const updatedUsers = users.map(user => 
        user.id === editingUser.id ? editingUser : user
      )
      
      setUsers(updatedUsers)
      setEditingUser(null)
      
      alert('User updated successfully')
    } catch (error) {
      console.error('Error updating user:', error)
      alert('Error updating user')
    }
  }

  const handleDeleteUser = async (userId) => {
    if (!confirm('Are you sure you want to delete this user?')) {
      return
    }

    try {
      const updatedUsers = users.filter(user => user.id !== userId)
      setUsers(updatedUsers)
      
      alert('User deleted successfully')
    } catch (error) {
      console.error('Error deleting user:', error)
      alert('Error deleting user')
    }
  }

  const getRoleColor = (role) => {
    const colors = {
      'admin': 'bg-red-100 text-red-800',
      'staff': 'bg-blue-100 text-blue-800'
    }
    return colors[role] || 'bg-gray-100 text-gray-800'
  }

  const getStageLabels = (stages) => {
    const stageLabels = {
      consultation: "Consultation",
      engagement: "Engagement",
      data_collection: "Data Collection",
      data_enhancement: "Data Enhancement",
      exam_preparation: "Exam Preparation",
      file_application: "File Application",
      entrance_exam: "Entrance Exam",
      offer_rejection: "Offer/Rejection",
      student_contract: "Student Contract",
      stp_application: "STP Application",
      travel_arrangement: "Travel Arrangement",
      landing: "Landing",
      stp_collection: "STP Collection",
      ltvp_application: "LTVP Application",
      ltvp_collection: "LTVP Collection"
    }
    return stages.map(stage => stageLabels[stage] || stage)
  }

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading users...</p>
          </div>
        </div>
      </DashboardLayout>
    )
  }

  if (currentUser?.role !== 'admin') {
    return (
      <DashboardLayout>
        <div className="text-center py-12">
          <AlertCircle className="w-12 h-12 text-red-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Access Denied</h3>
          <p className="text-gray-600">Only administrators can access this page.</p>
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">User Management</h1>
            <p className="text-gray-600">
              Manage system users and their permissions
            </p>
          </div>
          <Button onClick={() => setShowAddForm(true)}>
            <Plus className="w-4 h-4 mr-2" />
            Add User
          </Button>
        </div>

        {/* Users List */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {users.map((user) => (
            <Card key={user.id} className="hover:shadow-lg transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">{user.name}</CardTitle>
                  <Badge className={getRoleColor(user.role)}>
                    {user.role}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center space-x-2 text-sm">
                  <User className="w-4 h-4 text-gray-400" />
                  <span className="text-gray-600">@{user.username}</span>
                </div>
                <div className="flex items-center space-x-2 text-sm">
                  <Mail className="w-4 h-4 text-gray-400" />
                  <span className="text-gray-600">{user.email}</span>
                </div>
                {user.assignedStages && user.assignedStages.length > 0 && (
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2 text-sm">
                      <Shield className="w-4 h-4 text-gray-400" />
                      <span className="text-gray-600 font-medium">Assigned Stages:</span>
                    </div>
                    <div className="flex flex-wrap gap-1">
                      {getStageLabels(user.assignedStages).map((stage, index) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          {stage}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
                
                <div className="pt-2 border-t flex space-x-2">
                  <Button 
                    size="sm" 
                    variant="outline"
                    onClick={() => setEditingUser(user)}
                  >
                    <Edit className="w-4 h-4 mr-1" />
                    Edit
                  </Button>
                  {user.id !== currentUser.id && (
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => handleDeleteUser(user.id)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="w-4 h-4 mr-1" />
                      Delete
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Add User Modal */}
        {showAddForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-md">
              <h2 className="text-xl font-bold mb-4">Add New User</h2>
              <form onSubmit={handleAddUser} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Username *</label>
                  <Input
                    type="text"
                    value={formData.username}
                    onChange={(e) => setFormData({...formData, username: e.target.value})}
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Password *</label>
                  <div className="relative">
                    <Input
                      type={showPassword ? 'text' : 'password'}
                      value={formData.password}
                      onChange={(e) => setFormData({...formData, password: e.target.value})}
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Full Name *</label>
                  <Input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email *</label>
                  <Input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Role *</label>
                  <select
                    value={formData.role}
                    onChange={(e) => setFormData({...formData, role: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  >
                    <option value="staff">Staff</option>
                    <option value="admin">Admin</option>
                  </select>
                </div>
                
                <div className="flex space-x-2">
                  <Button type="submit" className="flex-1">
                    Add User
                  </Button>
                  <Button 
                    type="button" 
                    variant="outline"
                    onClick={() => setShowAddForm(false)}
                  >
                    Cancel
                  </Button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Edit User Modal */}
        {editingUser && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-md">
              <h2 className="text-xl font-bold mb-4">Edit User</h2>
              <form onSubmit={handleEditUser} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Username</label>
                  <Input
                    type="text"
                    value={editingUser.username}
                    disabled
                    className="bg-gray-100"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Full Name *</label>
                  <Input
                    type="text"
                    value={editingUser.name}
                    onChange={(e) => setEditingUser({...editingUser, name: e.target.value})}
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email *</label>
                  <Input
                    type="email"
                    value={editingUser.email}
                    onChange={(e) => setEditingUser({...editingUser, email: e.target.value})}
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Role *</label>
                  <select
                    value={editingUser.role}
                    onChange={(e) => setEditingUser({...editingUser, role: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  >
                    <option value="staff">Staff</option>
                    <option value="admin">Admin</option>
                  </select>
                </div>
                
                <div className="flex space-x-2">
                  <Button type="submit" className="flex-1">
                    Update User
                  </Button>
                  <Button 
                    type="button" 
                    variant="outline"
                    onClick={() => setEditingUser(null)}
                  >
                    Cancel
                  </Button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  )
} 