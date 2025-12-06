import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url)
  const code = requestUrl.searchParams.get('code')
  const inviteToken = requestUrl.searchParams.get('invite')

  if (code) {
    const supabase = createRouteHandlerClient({ cookies })
    await supabase.auth.exchangeCodeForSession(code)
    
    // Create or update user in our database
    const { data: { user } } = await supabase.auth.getUser()
    if (user) {
      const { prisma } = await import('@/lib/prisma')
      await prisma.user.upsert({
        where: { supabaseId: user.id },
        update: { email: user.email! },
        create: {
          supabaseId: user.id,
          email: user.email!,
        },
      })

      // If there's an invite token, redirect to accept it
      if (inviteToken) {
        return NextResponse.redirect(`${requestUrl.origin}/invite/${inviteToken}`)
      }
    }
  }

  return NextResponse.redirect(requestUrl.origin)
}

