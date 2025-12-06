// Demo mode - works without any backend connections
// Set NEXT_PUBLIC_DEMO_MODE=true to enable

export const isDemoMode = () => {
  if (typeof window === 'undefined') {
    return process.env.NEXT_PUBLIC_DEMO_MODE === 'true'
  }
  // Check localStorage for demo mode override
  return localStorage.getItem('demoMode') === 'true' || process.env.NEXT_PUBLIC_DEMO_MODE === 'true'
}

export const enableDemoMode = () => {
  if (typeof window !== 'undefined') {
    localStorage.setItem('demoMode', 'true')
  }
}

export const disableDemoMode = () => {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('demoMode')
  }
}

// Mock user for demo mode
export const getDemoUser = () => ({
  id: 'demo-user-id',
  email: 'demo@gateready.com',
  name: 'Demo User',
})

