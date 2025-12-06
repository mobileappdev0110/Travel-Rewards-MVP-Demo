'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { useAuth } from '@/app/providers'
import { disableDemoMode } from '@/lib/demo-mode'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'

export function Navbar() {
  const { user, isDemo } = useAuth()
  const router = useRouter()

  const handleSignOut = async () => {
    if (isDemo) {
      disableDemoMode()
      router.push('/')
      window.location.reload()
    } else {
      await supabase.auth.signOut()
      router.push('/')
    }
  }

  return (
    <>
      {isDemo && (
        <div className="bg-yellow-100 border-b border-yellow-300 text-center py-2">
          <p className="text-sm text-yellow-800">
            🎭 <strong>Demo Mode</strong> - All data is stored locally in your browser
          </p>
        </div>
      )}
      <nav className="border-b">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <Link href="/dashboard" className="text-2xl font-bold">
            GateReady
            {isDemo && <Badge variant="outline" className="ml-2">Demo</Badge>}
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
    </>
  )
}

