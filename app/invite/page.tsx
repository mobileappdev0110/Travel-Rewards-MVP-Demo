'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '../providers'
import { Navbar } from '@/components/navbar'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Copy, Check } from 'lucide-react'

export default function InvitePage() {
  const { user, loading } = useAuth()
  const router = useRouter()
  const [inviteLink, setInviteLink] = useState('')
  const [copied, setCopied] = useState(false)
  const [loadingInvite, setLoadingInvite] = useState(false)

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login')
    }
  }, [user, loading, router])

  const generateInvite = async () => {
    setLoadingInvite(true)
    try {
      const response = await fetch('/api/invites', {
        method: 'POST',
      })

      if (response.ok) {
        const data = await response.json()
        const link = `${window.location.origin}/invite/${data.token}`
        setInviteLink(link)
      }
    } catch (error) {
      console.error('Error generating invite:', error)
    } finally {
      setLoadingInvite(false)
    }
  }

  const copyToClipboard = () => {
    navigator.clipboard.writeText(inviteLink)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="min-h-screen">
      <Navbar />
      <div className="container mx-auto px-4 py-8 max-w-2xl">
        <h1 className="text-3xl font-bold mb-6">Invite a +1</h1>

        <Card>
          <CardHeader>
            <CardTitle>Generate Invite Link</CardTitle>
            <CardDescription>
              Share this link with your travel companion. They'll see your trip details and can join you!
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {!inviteLink ? (
              <Button onClick={generateInvite} disabled={loadingInvite} className="w-full">
                {loadingInvite ? 'Generating...' : 'Generate Invite Link'}
              </Button>
            ) : (
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>Your Invite Link</Label>
                  <div className="flex gap-2">
                    <Input value={inviteLink} readOnly />
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={copyToClipboard}
                    >
                      {copied ? (
                        <Check className="h-4 w-4" />
                      ) : (
                        <Copy className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                </div>
                <Button onClick={generateInvite} variant="outline" className="w-full">
                  Generate New Link
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

