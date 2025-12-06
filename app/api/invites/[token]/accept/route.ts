import { NextResponse } from 'next/server'
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { prisma } from '@/lib/prisma'

export async function POST(
  request: Request,
  { params }: { params: { token: string } }
) {
  try {
    const supabase = createRouteHandlerClient({ cookies })
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const dbUser = await prisma.user.findUnique({
      where: { supabaseId: user.id },
    })

    if (!dbUser) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    const invite = await prisma.invite.findUnique({
      where: { token: params.token },
    })

    if (!invite) {
      return NextResponse.json({ error: 'Invite not found' }, { status: 404 })
    }

    if (invite.isUsed) {
      return NextResponse.json({ error: 'Invite already used' }, { status: 400 })
    }

    // Update invite to mark as used
    await prisma.invite.update({
      where: { id: invite.id },
      data: {
        isUsed: true,
        usedAt: new Date(),
        inviteeId: dbUser.id,
      },
    })

    // Create or update travel preferences with invite data
    const existing = await prisma.travelPreference.findFirst({
      where: { userId: dbUser.id },
    })

    if (existing) {
      await prisma.travelPreference.update({
        where: { id: existing.id },
        data: {
          origin: invite.origin || existing.origin,
          destination: invite.destination || existing.destination,
          startDate: invite.startDate || existing.startDate,
          endDate: invite.endDate || existing.endDate,
          flexibleStartDate: invite.flexibleStartDate || existing.flexibleStartDate,
          flexibleEndDate: invite.flexibleEndDate || existing.flexibleEndDate,
          flexibleDays: invite.flexibleDays.length > 0 ? invite.flexibleDays : existing.flexibleDays,
          flexibleMonths: invite.flexibleMonths.length > 0 ? invite.flexibleMonths : existing.flexibleMonths,
          cabinClass: invite.cabinClass || existing.cabinClass,
        },
      })
    } else {
      await prisma.travelPreference.create({
        data: {
          userId: dbUser.id,
          origin: invite.origin,
          destination: invite.destination,
          startDate: invite.startDate,
          endDate: invite.endDate,
          flexibleStartDate: invite.flexibleStartDate,
          flexibleEndDate: invite.flexibleEndDate,
          flexibleDays: invite.flexibleDays,
          flexibleMonths: invite.flexibleMonths,
          cabinClass: invite.cabinClass,
        },
      })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error accepting invite:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

