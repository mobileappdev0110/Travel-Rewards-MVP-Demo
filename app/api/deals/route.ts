import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// Mock deals data - in production, this would come from a real matching algorithm
const MOCK_DEALS = [
  {
    airlineName: 'United Airlines',
    origin: 'NYC',
    destination: 'Paris',
    date: new Date('2024-07-15'),
    cabinClass: 'business',
    pointCost: 80000,
    cashCost: 2500.00,
    isBestMatch: true,
    bookingUrl: 'https://united.com/book',
  },
  {
    airlineName: 'Delta',
    origin: 'NYC',
    destination: 'Paris',
    date: new Date('2024-07-20'),
    cabinClass: 'business',
    pointCost: 85000,
    cashCost: 2700.00,
    isBestMatch: false,
    bookingUrl: 'https://delta.com/book',
  },
  {
    airlineName: 'American Airlines',
    origin: 'NYC',
    destination: 'Tokyo',
    date: new Date('2024-08-10'),
    cabinClass: 'first',
    pointCost: 120000,
    cashCost: 4500.00,
    isBestMatch: false,
    bookingUrl: 'https://aa.com/book',
  },
  {
    airlineName: 'United Airlines',
    origin: 'LAX',
    destination: 'London',
    date: new Date('2024-09-05'),
    cabinClass: 'economy',
    pointCost: 35000,
    cashCost: 800.00,
    isBestMatch: true,
    bookingUrl: 'https://united.com/book',
  },
  {
    airlineName: 'JetBlue',
    origin: 'NYC',
    destination: 'Cancun',
    date: new Date('2024-07-25'),
    cabinClass: 'economy',
    pointCost: 25000,
    cashCost: 450.00,
    isBestMatch: false,
    bookingUrl: 'https://jetblue.com/book',
  },
  {
    airlineName: 'Southwest',
    origin: 'NYC',
    destination: 'Miami',
    date: new Date('2024-08-15'),
    cabinClass: 'economy',
    pointCost: 15000,
    cashCost: 300.00,
    isBestMatch: false,
    bookingUrl: 'https://southwest.com/book',
  },
]

export async function GET() {
  try {
    // Check if we have any deals in the database
    const existingDeals = await prisma.deal.findMany({
      take: 1,
    })

    // If no deals exist, seed with mock data
    if (existingDeals.length === 0) {
      await prisma.deal.createMany({
        data: MOCK_DEALS,
      })
    }

    const deals = await prisma.deal.findMany({
      orderBy: [
        { isBestMatch: 'desc' },
        { pointCost: 'asc' },
      ],
    })

    return NextResponse.json(deals)
  } catch (error) {
    console.error('Error fetching deals:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

