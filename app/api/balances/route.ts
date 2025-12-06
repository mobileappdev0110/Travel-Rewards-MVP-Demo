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

    const balances = await prisma.loyaltyBalance.findMany({
      where: { userId: dbUser.id },
      orderBy: { updatedAt: 'desc' },
    })

    return NextResponse.json(balances)
  } catch (error) {
    console.error('Error fetching balances:', error)
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
    const { type, programName, balance } = body

    const loyaltyBalance = await prisma.loyaltyBalance.create({
      data: {
        userId: dbUser.id,
        type,
        programName,
        balance,
      },
    })

    return NextResponse.json(loyaltyBalance)
  } catch (error) {
    console.error('Error creating balance:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

