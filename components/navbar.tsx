'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { useAuth } from '@/app/providers'
import { Button } from '@/components/ui/button'

export function Navbar() {
  const { user } = useAuth()
  const router = useRouter()

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    router.push('/')
  }

  return (
    <nav className="border-b">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <Link href="/dashboard" className="text-2xl font-bold">
          GateReady
        </Link>
        <div className="flex items-center gap-4">
          <Link href="/dashboard">
            <Button variant="ghost">Dashboard</Button>
          </Link>
          <Link href="/travel-preferences">
            <Button variant="ghost">Travel Preferences</Button>
          </Link>
          <Link href="/deals">
            <Button variant="ghost">Deals</Button>
          </Link>
          <Link href="/invite">
            <Button variant="ghost">Invite +1</Button>
          </Link>
          {user && (
            <Button variant="outline" onClick={handleSignOut}>
              Sign Out
            </Button>
          )}
        </div>
      </div>
    </nav>
  )
}

