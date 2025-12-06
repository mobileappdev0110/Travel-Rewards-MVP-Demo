import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(
  request: Request,
  { params }: { params: { token: string } }
) {
  try {
    const invite = await prisma.invite.findUnique({
      where: { token: params.token },
      select: {
        origin: true,
        destination: true,
        startDate: true,
        endDate: true,
        flexibleStartDate: true,
        flexibleEndDate: true,
        flexibleDays: true,
        flexibleMonths: true,
        cabinClass: true,
        isUsed: true,
      },
    })

    if (!invite) {
      return NextResponse.json({ error: 'Invite not found' }, { status: 404 })
    }

    return NextResponse.json(invite)
  } catch (error) {
    console.error('Error fetching invite:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

