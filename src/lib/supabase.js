import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = 'https://qwvykgutfyjikceililu.supabase.co'
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InF3dnlrZ3V0ZnlqaWtjZWlsaWx1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDY1MTU1MDUsImV4cCI6MjA2MjA5MTUwNX0.AnCC-JbspBiswSJCu3XJeAyFZC6aWsx65d0XFsx_Oog'

export default createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    persistSession: true,
    autoRefreshToken: true
  }
})