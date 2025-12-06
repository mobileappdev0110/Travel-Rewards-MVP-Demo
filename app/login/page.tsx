'use client'

import { useState, useEffect, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { isDemoMode, enableDemoMode } from '@/lib/demo-mode'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

function LoginForm() {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  const router = useRouter()
  const searchParams = useSearchParams()
  const inviteToken = searchParams.get('invite')
  const isDemo = isDemoMode()

  useEffect(() => {
    // In demo mode, auto-login
    if (isDemo) {
      router.push('/dashboard')
      return
    }

    // Check if user is already logged in
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session && inviteToken) {
        // User is logged in and has invite token, redirect to accept
        router.push(`/invite/${inviteToken}`)
      } else if (session) {
        router.push('/dashboard')
      }
    })
  }, [inviteToken, router, isDemo])

  const handleDemoLogin = () => {
    enableDemoMode()
    router.push('/dashboard')
  }

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setMessage('')

    const redirectTo = inviteToken
      ? `${window.location.origin}/api/auth/callback?invite=${inviteToken}`
      : `${window.location.origin}/api/auth/callback`

    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: redirectTo,
      },
    })

    if (error) {
      setMessage(error.message)
      setLoading(false)
    } else {
      setMessage('Check your email for the magic link!')
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Welcome to GateReady</CardTitle>
          <CardDescription>
            Sign in with your email to get started
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            {message && (
              <p className={`text-sm ${message.includes('Check') ? 'text-green-600' : 'text-red-600'}`}>
                {message}
              </p>
            )}
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? 'Sending...' : 'Send Magic Link'}
            </Button>
          </form>
          <div className="mt-4 pt-4 border-t">
            <p className="text-sm text-muted-foreground text-center mb-2">
              Want to see a demo?
            </p>
            <Button 
              type="button" 
              variant="outline" 
              className="w-full" 
              onClick={handleDemoLogin}
            >
              Enter Demo Mode
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default function LoginPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <p>Loading...</p>
      </div>
    }>
      <LoginForm />
    </Suspense>
  )
}

