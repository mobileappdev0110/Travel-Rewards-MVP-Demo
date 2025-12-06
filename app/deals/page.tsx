'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '../providers'
import { Navbar } from '@/components/navbar'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { ExternalLink, Star } from 'lucide-react'
import { format } from 'date-fns'

interface Deal {
  id: string
  airlineName: string
  origin: string
  destination: string
  date: string
  cabinClass: string
  pointCost: number
  cashCost: number
  isBestMatch: boolean
  bookingUrl: string
}

export default function DealsPage() {
  const { user, loading } = useAuth()
  const router = useRouter()
  const [deals, setDeals] = useState<Deal[]>([])
  const [loadingDeals, setLoadingDeals] = useState(true)

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login')
    }
  }, [user, loading, router])

  useEffect(() => {
    if (user) {
      fetchDeals()
    }
  }, [user])

  const fetchDeals = async () => {
    try {
      const response = await fetch('/api/deals')
      if (response.ok) {
        const data = await response.json()
        setDeals(data)
      }
    } catch (error) {
      console.error('Error fetching deals:', error)
    } finally {
      setLoadingDeals(false)
    }
  }

  if (loading || loadingDeals) {
    return (
      <div className="min-h-screen">
        <Navbar />
        <div className="container mx-auto px-4 py-8">
          <p>Loading...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen">
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">Matched Deals</h1>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {deals.map((deal) => (
            <Card key={deal.id} className={deal.isBestMatch ? 'border-primary border-2' : ''}>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <CardTitle className="text-xl">{deal.airlineName}</CardTitle>
                  {deal.isBestMatch && (
                    <Badge variant="default" className="flex items-center gap-1">
                      <Star className="h-3 w-3" />
                      Best Match
                    </Badge>
                  )}
                </div>
                <CardDescription>
                  {deal.origin} → {deal.destination}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <p className="text-sm text-muted-foreground">Date</p>
                  <p className="font-medium">{format(new Date(deal.date), 'PPP')}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Cabin Class</p>
                  <p className="font-medium capitalize">{deal.cabinClass}</p>
                </div>
                <div className="flex justify-between items-center pt-4 border-t">
                  <div>
                    <p className="text-sm text-muted-foreground">Point Cost</p>
                    <p className="font-bold text-lg">{deal.pointCost.toLocaleString()}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-muted-foreground">Cash Cost</p>
                    <p className="font-bold text-lg">${deal.cashCost.toFixed(2)}</p>
                  </div>
                </div>
                <Button
                  className="w-full"
                  onClick={() => window.open(deal.bookingUrl, '_blank')}
                >
                  <ExternalLink className="mr-2 h-4 w-4" />
                  Book Now
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {deals.length === 0 && (
          <Card>
            <CardContent className="py-12 text-center">
              <p className="text-muted-foreground">No deals available at the moment.</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}

