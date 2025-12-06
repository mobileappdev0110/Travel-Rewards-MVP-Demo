'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '../providers'
import { Navbar } from '@/components/navbar'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Trash2, Plus } from 'lucide-react'

interface LoyaltyBalance {
  id: string
  type: string
  programName: string
  balance: number
  currency?: string | null
}

export default function DashboardPage() {
  const { user, loading } = useAuth()
  const router = useRouter()
  const [balances, setBalances] = useState<LoyaltyBalance[]>([])
  const [loadingBalances, setLoadingBalances] = useState(true)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [formData, setFormData] = useState({
    type: 'credit_card',
    programName: '',
    balance: '',
  })

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login')
    }
  }, [user, loading, router])

  useEffect(() => {
    if (user) {
      fetchBalances()
    }
  }, [user])

  const fetchBalances = async () => {
    try {
      const response = await fetch('/api/balances')
      if (response.ok) {
        const data = await response.json()
        setBalances(data)
      }
    } catch (error) {
      console.error('Error fetching balances:', error)
    } finally {
      setLoadingBalances(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const response = await fetch('/api/balances', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          balance: parseInt(formData.balance),
        }),
      })

      if (response.ok) {
        await fetchBalances()
        setIsDialogOpen(false)
        setFormData({ type: 'credit_card', programName: '', balance: '' })
      }
    } catch (error) {
      console.error('Error adding balance:', error)
    }
  }

  const handleDelete = async (id: string) => {
    try {
      const response = await fetch(`/api/balances/${id}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        await fetchBalances()
      }
    } catch (error) {
      console.error('Error deleting balance:', error)
    }
  }

  if (loading || loadingBalances) {
    return (
      <div className="min-h-screen">
        <Navbar />
        <div className="container mx-auto px-4 py-8">
          <p>Loading...</p>
        </div>
      </div>
    )
  }

  const creditCardPrograms = ['Chase', 'Amex', 'Citi', 'Capital One', 'Bilt', 'Other']
  const airlinePrograms = ['United', 'Delta', 'American Airlines', 'Southwest', 'JetBlue', 'Alaska', 'Other']

  return (
    <div className="min-h-screen">
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Add Balance
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add Loyalty Balance</DialogTitle>
                <DialogDescription>
                  Enter your loyalty program balance
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleSubmit}>
                <div className="space-y-4 py-4">
                  <div className="space-y-2">
                    <Label htmlFor="type">Type</Label>
                    <Select
                      value={formData.type}
                      onValueChange={(value) => setFormData({ ...formData, type: value })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="credit_card">Credit Card</SelectItem>
                        <SelectItem value="airline">Airline</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="programName">Program</Label>
                    <Select
                      value={formData.programName}
                      onValueChange={(value) => setFormData({ ...formData, programName: value })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select program" />
                      </SelectTrigger>
                      <SelectContent>
                        {(formData.type === 'credit_card' ? creditCardPrograms : airlinePrograms).map((program) => (
                          <SelectItem key={program} value={program}>
                            {program}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="balance">Balance (points/miles)</Label>
                    <Input
                      id="balance"
                      type="number"
                      value={formData.balance}
                      onChange={(e) => setFormData({ ...formData, balance: e.target.value })}
                      required
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button type="submit">Add</Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {balances.map((balance) => (
            <Card key={balance.id}>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-lg">{balance.programName}</CardTitle>
                    <CardDescription className="capitalize">{balance.type.replace('_', ' ')}</CardDescription>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleDelete(balance.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold">{balance.balance.toLocaleString()}</p>
                <p className="text-sm text-muted-foreground">points/miles</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {balances.length === 0 && (
          <Card>
            <CardContent className="py-12 text-center">
              <p className="text-muted-foreground">No loyalty balances yet. Add your first one above.</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}

