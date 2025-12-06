'use client'

import { createContext, useContext, useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { isDemoMode, getDemoUser } from '@/lib/demo-mode'
import type { User } from '@supabase/supabase-js'

type AuthContextType = {
  user: User | null
  loading: boolean
  isDemo: boolean
}

const AuthContext = createContext<AuthContextType>({ user: null, loading: true, isDemo: false })

export function Providers({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [isDemo, setIsDemo] = useState(false)

  useEffect(() => {
    // Check for demo mode first
    if (isDemoMode()) {
      setIsDemo(true)
      // Create a mock user object that matches Supabase User type
      const demoUser = getDemoUser()
      setUser({
        id: demoUser.id,
        email: demoUser.email,
        user_metadata: { name: demoUser.name },
        app_metadata: {},
        aud: 'authenticated',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        phone: undefined,
        confirmed_at: new Date().toISOString(),
        email_confirmed_at: new Date().toISOString(),
        phone_confirmed_at: undefined,
        last_sign_in_at: new Date().toISOString(),
        role: 'authenticated',
        identities: [],
      } as User)
      setLoading(false)
      return
    }

    // Check if we're in a browser environment and Supabase is configured
    if (typeof window === 'undefined') {
      setLoading(false)
      return
    }

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    if (!supabaseUrl || supabaseUrl.includes('xxxxxxxxxxxxx') || supabaseUrl.includes('placeholder')) {
      setLoading(false)
      return
    }

    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null)
      setLoading(false)
    }).catch(() => {
      setLoading(false)
    })

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
      setLoading(false)
    })

    return () => subscription.unsubscribe()
  }, [])

  return (
    <AuthContext.Provider value={{ user, loading, isDemo }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)

