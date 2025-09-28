import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://akpeccoeafpxpwkmbbxh.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFrcGVjY29lYWZweHB3a21iYnhoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTkwNTY4NjYsImV4cCI6MjA3NDYzMjg2Nn0.XMhLETbwLup3a2Q_3UmEZ9urrEOG5GLym19oz7oBGkY'

// Supabase 클라이언트 생성 (옵션 설정 포함)
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
  },
})

export type Post = {
  id: number
  title: string
  content: string
  author: string
  password: string
  created_at: string
  updated_at: string
  view_count: number
  like_count: number
}

export type Comment = {
  id: number
  post_id: number
  author: string
  password: string
  content: string
  created_at: string
}

export type FileAttachment = {
  id: number
  post_id: number
  filename: string
  file_url: string
  file_size: number
  created_at: string
}