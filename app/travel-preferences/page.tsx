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
import { Calendar } from '@/components/ui/calendar'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { format } from 'date-fns'
import { CalendarIcon } from 'lucide-react'
import { cn } from '@/lib/utils'

interface TravelPreference {
  id: string
  origin?: string | null
  destination?: string | null
  startDate?: Date | null
  endDate?: Date | null
  flexibleStartDate?: Date | null
  flexibleEndDate?: Date | null
  flexibleDays?: string[]
  flexibleMonths?: number[]
  cabinClass?: string | null
}

export default function TravelPreferencesPage() {
  const { user, loading, isDemo } = useAuth()
  const router = useRouter()
  const [preferences, setPreferences] = useState<TravelPreference | null>(null)
  const [loadingPrefs, setLoadingPrefs] = useState(true)
  const [isFlexible, setIsFlexible] = useState(false)
  const [formData, setFormData] = useState({
    origin: '',
    destination: '',
    startDate: undefined as Date | undefined,
    endDate: undefined as Date | undefined,
    flexibleStartDate: undefined as Date | undefined,
    flexibleEndDate: undefined as Date | undefined,
    flexibleDays: [] as string[],
    flexibleMonths: [] as number[],
    cabinClass: '',
  })

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login')
    }
  }, [user, loading, router])

  useEffect(() => {
    if (user) {
      if (isDemo) {
        loadDemoPreferences()
      } else {
        fetchPreferences()
      }
    }
  }, [user, isDemo])

  const loadDemoPreferences = () => {
    const stored = localStorage.getItem('demo_travel_preferences')
    if (stored) {
      const data = JSON.parse(stored)
      setPreferences(data)
      setFormData({
        origin: data.origin || '',
        destination: data.destination || '',
        startDate: data.startDate ? new Date(data.startDate) : undefined,
        endDate: data.endDate ? new Date(data.endDate) : undefined,
        flexibleStartDate: data.flexibleStartDate ? new Date(data.flexibleStartDate) : undefined,
        flexibleEndDate: data.flexibleEndDate ? new Date(data.flexibleEndDate) : undefined,
        flexibleDays: data.flexibleDays || [],
        flexibleMonths: data.flexibleMonths || [],
        cabinClass: data.cabinClass || '',
      })
      setIsFlexible(!!data.flexibleStartDate)
    }
    setLoadingPrefs(false)
  }

  const saveDemoPreferences = (data: any) => {
    localStorage.setItem('demo_travel_preferences', JSON.stringify(data))
    setPreferences(data)
  }

  const fetchPreferences = async () => {
    try {
      const response = await fetch('/api/travel-preferences')
      if (response.ok) {
        const data = await response.json()
        if (data) {
          setPreferences(data)
          setFormData({
            origin: data.origin || '',
            destination: data.destination || '',
            startDate: data.startDate ? new Date(data.startDate) : undefined,
            endDate: data.endDate ? new Date(data.endDate) : undefined,
            flexibleStartDate: data.flexibleStartDate ? new Date(data.flexibleStartDate) : undefined,
            flexibleEndDate: data.flexibleEndDate ? new Date(data.flexibleEndDate) : undefined,
            flexibleDays: data.flexibleDays || [],
            flexibleMonths: data.flexibleMonths || [],
            cabinClass: data.cabinClass || '',
          })
          setIsFlexible(!!data.flexibleStartDate)
        }
      }
    } catch (error) {
      console.error('Error fetching preferences:', error)
    } finally {
      setLoadingPrefs(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    const payload = {
      origin: formData.origin || null,
      destination: formData.destination || null,
      startDate: isFlexible ? null : formData.startDate?.toISOString() || null,
      endDate: isFlexible ? null : formData.endDate?.toISOString() || null,
      flexibleStartDate: isFlexible ? formData.flexibleStartDate?.toISOString() || null : null,
      flexibleEndDate: isFlexible ? formData.flexibleEndDate?.toISOString() || null : null,
      flexibleDays: isFlexible ? formData.flexibleDays : [],
      flexibleMonths: isFlexible ? formData.flexibleMonths : [],
      cabinClass: formData.cabinClass || null,
    }

    if (isDemo) {
      // Demo mode: save to localStorage
      saveDemoPreferences(payload)
      alert('Travel preferences saved!')
      return
    }

    try {
      const response = await fetch('/api/travel-preferences', {
        method: preferences ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })

      if (response.ok) {
        await fetchPreferences()
        alert('Travel preferences saved!')
      }
    } catch (error) {
      console.error('Error saving preferences:', error)
    }
  }

  const toggleFlexibleDay = (day: string) => {
    setFormData({
      ...formData,
      flexibleDays: formData.flexibleDays.includes(day)
        ? formData.flexibleDays.filter(d => d !== day)
        : [...formData.flexibleDays, day],
    })
  }

  const toggleFlexibleMonth = (month: number) => {
    setFormData({
      ...formData,
      flexibleMonths: formData.flexibleMonths.includes(month)
        ? formData.flexibleMonths.filter(m => m !== month)
        : [...formData.flexibleMonths, month],
    })
  }

  if (loading || loadingPrefs) {
    return (
      <div className="min-h-screen">
        <Navbar />
        <div className="container mx-auto px-4 py-8">
          <p>Loading...</p>
        </div>
      </div>
    )
  }

  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday', 'weekend', 'weekday']
  const months = [
    { value: 1, label: 'January' },
    { value: 2, label: 'February' },
    { value: 3, label: 'March' },
    { value: 4, label: 'April' },
    { value: 5, label: 'May' },
    { value: 6, label: 'June' },
    { value: 7, label: 'July' },
    { value: 8, label: 'August' },
    { value: 9, label: 'September' },
    { value: 10, label: 'October' },
    { value: 11, label: 'November' },
    { value: 12, label: 'December' },
  ]

  return (
    <div className="min-h-screen">
      <Navbar />
      <div className="container mx-auto px-4 py-8 max-w-2xl">
        <h1 className="text-3xl font-bold mb-6">Travel Preferences</h1>

        <Card>
          <CardHeader>
            <CardTitle>Set Your Travel Dates</CardTitle>
            <CardDescription>
              Choose specific dates or flexible date ranges
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="origin">Origin (optional)</Label>
                <Input
                  id="origin"
                  value={formData.origin}
                  onChange={(e) => setFormData({ ...formData, origin: e.target.value })}
                  placeholder="e.g., NYC"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="destination">Destination (optional)</Label>
                <Input
                  id="destination"
                  value={formData.destination}
                  onChange={(e) => setFormData({ ...formData, destination: e.target.value })}
                  placeholder="e.g., Paris"
                />
              </div>

              <div className="space-y-2">
                <Label>Date Type</Label>
                <div className="flex gap-4">
                  <Button
                    type="button"
                    variant={!isFlexible ? 'default' : 'outline'}
                    onClick={() => setIsFlexible(false)}
                  >
                    Specific Dates
                  </Button>
                  <Button
                    type="button"
                    variant={isFlexible ? 'default' : 'outline'}
                    onClick={() => setIsFlexible(true)}
                  >
                    Flexible Dates
                  </Button>
                </div>
              </div>

              {!isFlexible ? (
                <>
                  <div className="space-y-2">
                    <Label>Start Date</Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className={cn(
                            "w-full justify-start text-left font-normal",
                            !formData.startDate && "text-muted-foreground"
                          )}
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {formData.startDate ? format(formData.startDate, "PPP") : "Pick a date"}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0">
                        <Calendar
                          mode="single"
                          selected={formData.startDate}
                          onSelect={(date) => setFormData({ ...formData, startDate: date })}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                  </div>

                  <div className="space-y-2">
                    <Label>End Date</Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className={cn(
                            "w-full justify-start text-left font-normal",
                            !formData.endDate && "text-muted-foreground"
                          )}
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {formData.endDate ? format(formData.endDate, "PPP") : "Pick a date"}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0">
                        <Calendar
                          mode="single"
                          selected={formData.endDate}
                          onSelect={(date) => setFormData({ ...formData, endDate: date })}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                  </div>
                </>
              ) : (
                <>
                  <div className="space-y-2">
                    <Label>Flexible Start Date</Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className={cn(
                            "w-full justify-start text-left font-normal",
                            !formData.flexibleStartDate && "text-muted-foreground"
                          )}
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {formData.flexibleStartDate ? format(formData.flexibleStartDate, "PPP") : "Pick a date"}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0">
                        <Calendar
                          mode="single"
                          selected={formData.flexibleStartDate}
                          onSelect={(date) => setFormData({ ...formData, flexibleStartDate: date })}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                  </div>

                  <div className="space-y-2">
                    <Label>Flexible End Date</Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className={cn(
                            "w-full justify-start text-left font-normal",
                            !formData.flexibleEndDate && "text-muted-foreground"
                          )}
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {formData.flexibleEndDate ? format(formData.flexibleEndDate, "PPP") : "Pick a date"}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0">
                        <Calendar
                          mode="single"
                          selected={formData.flexibleEndDate}
                          onSelect={(date) => setFormData({ ...formData, flexibleEndDate: date })}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                  </div>

                  <div className="space-y-2">
                    <Label>Preferred Days</Label>
                    <div className="flex flex-wrap gap-2">
                      {days.map((day) => (
                        <Button
                          key={day}
                          type="button"
                          variant={formData.flexibleDays.includes(day) ? 'default' : 'outline'}
                          size="sm"
                          onClick={() => toggleFlexibleDay(day)}
                        >
                          {day}
                        </Button>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>Preferred Months</Label>
                    <div className="flex flex-wrap gap-2">
                      {months.map((month) => (
                        <Button
                          key={month.value}
                          type="button"
                          variant={formData.flexibleMonths.includes(month.value) ? 'default' : 'outline'}
                          size="sm"
                          onClick={() => toggleFlexibleMonth(month.value)}
                        >
                          {month.label}
                        </Button>
                      ))}
                    </div>
                  </div>
                </>
              )}

              <div className="space-y-2">
                <Label htmlFor="cabinClass">Cabin Class (optional)</Label>
                <Select
                  value={formData.cabinClass}
                  onValueChange={(value) => setFormData({ ...formData, cabinClass: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select cabin class" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="economy">Economy</SelectItem>
                    <SelectItem value="business">Business</SelectItem>
                    <SelectItem value="first">First</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Button type="submit" className="w-full">Save Preferences</Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

