'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from './providers'
import { isDemoMode, enableDemoMode } from '@/lib/demo-mode'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

export default function HomePage() {
  const { user, loading, isDemo } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!loading && user) {
      router.push('/dashboard')
    }
  }, [user, loading, router])

  const handleDemoMode = () => {
    enableDemoMode()
    window.location.reload()
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Loading...</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex flex-col">
      <nav className="border-b">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold">GateReady</h1>
          <Link href="/login">
            <Button variant="outline">Sign In</Button>
          </Link>
        </div>
      </nav>
      
      <main className="flex-1 flex items-center justify-center">
        <div className="text-center space-y-6">
          <h2 className="text-4xl font-bold">Track Your Travel Rewards</h2>
          <p className="text-xl text-muted-foreground max-w-2xl">
            Manage your loyalty balances, set travel dates, and discover the best redemption opportunities.
          </p>
          <div className="flex gap-4 justify-center">
            <Link href="/login">
              <Button size="lg">Get Started</Button>
            </Link>
            <Button size="lg" variant="outline" onClick={handleDemoMode}>
              View Demo
            </Button>
          </div>
        </div>
      </main>
    </div>
  )
}

