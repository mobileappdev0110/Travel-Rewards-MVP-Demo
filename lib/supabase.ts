import { createClient } from '@supabase/supabase-js'

// Get env vars - use valid placeholder format during build
// The client will be re-initialized at runtime with real values
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://xxxxxxxxxxxxx.supabase.co'
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRlbXAiLCJyb2xlIjoiYW5vbiIsImlhdCI6MTY0NTk5OTk5OSwiZXhwIjoxOTYxNTc1OTk5fQ.temp'

// Create client with placeholder values for build-time
// Will use real values at runtime when env vars are available
export const supabase = createClient(supabaseUrl, supabaseAnonKey)

