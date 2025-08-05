import { getSchools } from '../../../data/schools.js'

export async function GET() {
  try {
    const schools = getSchools()
    return Response.json(schools)
  } catch (error) {
    return Response.json({ error: 'Failed to fetch schools' }, { status: 500 })
  }
} 