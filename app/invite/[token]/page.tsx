'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/app/providers'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { format } from 'date-fns'
import Link from 'next/link'

interface InviteData {
  origin?: string | null
  destination?: string | null
  startDate?: string | null
  endDate?: string | null
  flexibleStartDate?: string | null
  flexibleEndDate?: string | null
  flexibleDays?: string[]
  flexibleMonths?: number[]
  cabinClass?: string | null
  isUsed: boolean
}

export default function InviteViewPage({ params }: { params: { token: string } }) {
  const { user, loading } = useAuth()
  const router = useRouter()
  const [inviteData, setInviteData] = useState<InviteData | null>(null)
  const [loadingInvite, setLoadingInvite] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    fetchInvite()
  }, [params.token])

  const fetchInvite = async () => {
    try {
      const response = await fetch(`/api/invites/${params.token}`)
      if (response.ok) {
        const data = await response.json()
        setInviteData(data)
      } else {
        setError('Invite not found or has expired')
      }
    } catch (error) {
      console.error('Error fetching invite:', error)
      setError('Error loading invite')
    } finally {
      setLoadingInvite(false)
    }
  }

  const handleAccept = () => {
    if (user) {
      // User is logged in, import the travel preferences
      importTravelPreferences()
    } else {
      // User needs to sign up, redirect to login with token
      router.push(`/login?invite=${params.token}`)
    }
  }

  const importTravelPreferences = async () => {
    try {
      const response = await fetch(`/api/invites/${params.token}/accept`, {
        method: 'POST',
      })

      if (response.ok) {
        router.push('/dashboard?imported=true')
      }
    } catch (error) {
      console.error('Error accepting invite:', error)
    }
  }

  if (loadingInvite) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Loading...</p>
      </div>
    )
  }

  if (error || !inviteData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>Invite Not Found</CardTitle>
            <CardDescription>{error || 'This invite link is invalid or has expired.'}</CardDescription>
          </CardHeader>
          <CardContent>
            <Link href="/">
              <Button className="w-full">Go Home</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (inviteData.isUsed) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>Invite Already Used</CardTitle>
            <CardDescription>This invite link has already been used.</CardDescription>
          </CardHeader>
          <CardContent>
            <Link href="/">
              <Button className="w-full">Go Home</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    )
  }

  const hasSpecificDates = inviteData.startDate || inviteData.endDate
  const hasFlexibleDates = inviteData.flexibleStartDate || inviteData.flexibleEndDate

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <Card className="w-full max-w-2xl">
        <CardHeader>
          <CardTitle>You're Invited!</CardTitle>
          <CardDescription>
            Your travel companion has invited you to join their trip.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            {inviteData.origin && inviteData.destination && (
              <div>
                <p className="text-sm text-muted-foreground">Route</p>
                <p className="text-lg font-semibold">
                  {inviteData.origin} → {inviteData.destination}
                </p>
              </div>
            )}

            {hasSpecificDates && (
              <div>
                <p className="text-sm text-muted-foreground">Travel Dates</p>
                <p className="text-lg font-semibold">
                  {inviteData.startDate && format(new Date(inviteData.startDate), 'PPP')}
                  {inviteData.endDate && ` - ${format(new Date(inviteData.endDate), 'PPP')}`}
                </p>
              </div>
            )}

            {hasFlexibleDates && (
              <div>
                <p className="text-sm text-muted-foreground">Flexible Dates</p>
                <p className="text-lg font-semibold">
                  {inviteData.flexibleStartDate && format(new Date(inviteData.flexibleStartDate), 'PPP')}
                  {inviteData.flexibleEndDate && ` - ${format(new Date(inviteData.flexibleEndDate), 'PPP')}`}
                </p>
                {inviteData.flexibleDays && inviteData.flexibleDays.length > 0 && (
                  <p className="text-sm text-muted-foreground mt-1">
                    Preferred days: {inviteData.flexibleDays.join(', ')}
                  </p>
                )}
                {inviteData.flexibleMonths && inviteData.flexibleMonths.length > 0 && (
                  <p className="text-sm text-muted-foreground">
                    Preferred months: {inviteData.flexibleMonths.map(m => {
                      const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
                      return months[m - 1]
                    }).join(', ')}
                  </p>
                )}
              </div>
            )}

            {inviteData.cabinClass && (
              <div>
                <p className="text-sm text-muted-foreground">Cabin Class</p>
                <p className="text-lg font-semibold capitalize">{inviteData.cabinClass}</p>
              </div>
            )}
          </div>

          <div className="pt-4 border-t">
            <Button onClick={handleAccept} className="w-full" size="lg">
              {user ? 'Accept & Import Travel Dates' : 'Sign Up to Accept Invite'}
            </Button>
            {user && (
              <p className="text-sm text-muted-foreground mt-2 text-center">
                Your travel preferences will be automatically updated with these details.
              </p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

