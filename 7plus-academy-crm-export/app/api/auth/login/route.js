import { NextResponse } from 'next/server'

// Mock user database - in production, this would be a real database
const users = [
  {
    id: 1,
    username: 'admin',
    password: 'password123',
    name: 'Admin User',
    role: 'admin',
    email: 'admin@7plusacademy.com'
  },
  {
    id: 2,
    username: 'staff_a',
    password: 'staff123',
    name: 'Staff A - Early Stages',
    role: 'staff',
    email: 'staffa@7plusacademy.com',
    assignedStages: ['consultation', 'engagement', 'data_collection', 'data_enhancement']
  },
  {
    id: 3,
    username: 'staff_b',
    password: 'staff123',
    name: 'Staff B - Application Process',
    role: 'staff',
    email: 'staffb@7plusacademy.com',
    assignedStages: ['exam_preparation', 'file_application', 'entrance_exam', 'offer_rejection', 'student_contract']
  },
  {
    id: 4,
    username: 'staff_c',
    password: 'staff123',
    name: 'Staff C - Immigration Process',
    role: 'staff',
    email: 'staffc@7plusacademy.com',
    assignedStages: ['stp_application', 'travel_arrangement', 'landing', 'stp_collection', 'ltvp_application', 'ltvp_collection']
  }
]

export async function POST(request) {
  try {
    const { username, password } = await request.json()

    // Find user
    const user = users.find(u => u.username === username && u.password === password)

    if (!user) {
      return NextResponse.json(
        { message: 'Invalid username or password' },
        { status: 401 }
      )
    }

    // Create a simple token (in production, use JWT)
    const token = Buffer.from(`${user.id}:${user.username}:${Date.now()}`).toString('base64')

    // Return user data without password
    const { password: _, ...userWithoutPassword } = user

    return NextResponse.json({
      token,
      user: userWithoutPassword,
      message: 'Login successful'
    })

  } catch (error) {
    console.error('Login error:', error)
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    )
  }
} 