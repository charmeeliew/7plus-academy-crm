import { getStudents } from '../../../data/students.js'
import { NextResponse } from 'next/server'

export async function GET() {
  try {
    const students = getStudents()
    return NextResponse.json(students)
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch students' },
      { status: 500 }
    )
  }
}

export async function POST(request) {
  try {
    const body = await request.json()
    
    // Log the received data (for development purposes)
    console.log('New student application received:', body)
    
    // In a real application, you would save this to a database
    // For now, we'll just return a success response
    
    return NextResponse.json(
      { 
        message: 'Student application submitted successfully',
        studentId: Date.now() // Generate a temporary ID
      },
      { status: 201 }
    )
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to submit student application' },
      { status: 500 }
    )
  }
} 