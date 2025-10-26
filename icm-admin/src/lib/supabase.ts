import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'http://127.0.0.1:22000';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'placeholder-key';

// Check if Supabase is properly configured
const isSupabaseConfigured = 
  supabaseUrl !== 'http://127.0.0.1:22000' && 
  supabaseAnonKey !== 'placeholder-key' &&
  supabaseUrl.includes('supabase.co');

if (!isSupabaseConfigured) {
  console.warn('⚠️ Supabase is not configured. Please set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in .env file');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
export { isSupabaseConfigured };