import { NextResponse } from 'next/server'
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { prisma } from '@/lib/prisma'

export async function GET() {
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

    const preference = await prisma.travelPreference.findFirst({
      where: { userId: dbUser.id },
      orderBy: { updatedAt: 'desc' },
    })

    return NextResponse.json(preference)
  } catch (error) {
    console.error('Error fetching preferences:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(request: Request) {
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

    const body = await request.json()

    const preference = await prisma.travelPreference.create({
      data: {
        userId: dbUser.id,
        origin: body.origin,
        destination: body.destination,
        startDate: body.startDate ? new Date(body.startDate) : null,
        endDate: body.endDate ? new Date(body.endDate) : null,
        flexibleStartDate: body.flexibleStartDate ? new Date(body.flexibleStartDate) : null,
        flexibleEndDate: body.flexibleEndDate ? new Date(body.flexibleEndDate) : null,
        flexibleDays: body.flexibleDays || [],
        flexibleMonths: body.flexibleMonths || [],
        cabinClass: body.cabinClass,
      },
    })

    return NextResponse.json(preference)
  } catch (error) {
    console.error('Error creating preference:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function PUT(request: Request) {
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

    const body = await request.json()

    const existing = await prisma.travelPreference.findFirst({
      where: { userId: dbUser.id },
    })

    if (existing) {
      const preference = await prisma.travelPreference.update({
        where: { id: existing.id },
        data: {
          origin: body.origin,
          destination: body.destination,
          startDate: body.startDate ? new Date(body.startDate) : null,
          endDate: body.endDate ? new Date(body.endDate) : null,
          flexibleStartDate: body.flexibleStartDate ? new Date(body.flexibleStartDate) : null,
          flexibleEndDate: body.flexibleEndDate ? new Date(body.flexibleEndDate) : null,
          flexibleDays: body.flexibleDays || [],
          flexibleMonths: body.flexibleMonths || [],
          cabinClass: body.cabinClass,
        },
      })

      return NextResponse.json(preference)
    } else {
      return POST(request)
    }
  } catch (error) {
    console.error('Error updating preference:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

