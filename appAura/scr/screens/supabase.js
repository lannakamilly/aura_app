import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = 'https://uxogiqmgjfmpxoypkway.supabase.co' // substitua pelo seu URL do projeto
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InV4b2dpcW1namZtcHhveXBrd2F5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjI3OTEzODQsImV4cCI6MjA3ODM2NzM4NH0.tiwfW2fGy1WXnSTXSxAb7Ag6Yf2-zUhRcnYq6adR5Ts' // copie a "anon public key" do Supabase → Project Settings → API

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY)
