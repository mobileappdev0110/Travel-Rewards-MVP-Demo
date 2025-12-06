import { NextResponse } from 'next/server'
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { prisma } from '@/lib/prisma'
import { randomBytes } from 'crypto'

export async function POST() {
  try {
    const supabase = createRouteHandlerClient({ cookies })
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const dbUser = await prisma.user.findUnique({
      where: { supabaseId: user.id },
      include: {
        travelPreferences: {
          orderBy: { updatedAt: 'desc' },
          take: 1,
        },
      },
    })

    if (!dbUser) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    const preference = dbUser.travelPreferences[0]

    // Generate unique token
    const token = randomBytes(32).toString('hex')

    const invite = await prisma.invite.create({
      data: {
        token,
        inviterId: dbUser.id,
        origin: preference?.origin || null,
        destination: preference?.destination || null,
        startDate: preference?.startDate || null,
        endDate: preference?.endDate || null,
        flexibleStartDate: preference?.flexibleStartDate || null,
        flexibleEndDate: preference?.flexibleEndDate || null,
        flexibleDays: preference?.flexibleDays || [],
        flexibleMonths: preference?.flexibleMonths || [],
        cabinClass: preference?.cabinClass || null,
      },
    })

    return NextResponse.json({ token: invite.token })
  } catch (error) {
    console.error('Error creating invite:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

