import { createClient } from '@supabase/supabase-js'

// Vite에서는 import.meta.env를 사용하여 .env 파일을 읽습니다
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'http://127.0.0.1:54321'
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0'
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

export type InstagramAccount = {
  id: number
  handle: string
  platform: string
  image_url: string | null
  account_url: string | null
  is_active: boolean
  display_order: number
  created_at: string
  updated_at: string
}

export type YoutubeVideo = {
  id: number
  video_id: string
  title: string
  thumbnail_url: string | null
  display_order: number
  is_active: boolean
  created_at: string
  updated_at: string
}

export type Artist = {
  id: string
  name: string
  description: string | null
  profile_image: string | null
  youtube_url: string | null
  instagram_url: string | null
  facebook_url: string | null
  twitter_url: string | null
  display_order: number
  is_active: boolean
  created_at: string
  updated_at: string
}

export type ArtistImage = {
  id: number
  artist_id: string
  image_url: string
  display_order: number
  created_at: string
}

export type ArtistVideo = {
  id: number
  artist_id: string
  video_id: string
  title: string
  thumbnail_url: string | null
  display_order: number
  created_at: string
}

export type Admin = {
  uid: string
  id: string
  password: string
  token: string | null
  expires_at: string | null
  created_at: string
}

export type SocialLink = {
  id: number
  platform: 'instagram' | 'youtube'| 'twitter' | 'facebook' | 'tiktok' | 'website'
  url: string
  is_active: boolean
  display_order: number
  created_at: string
  updated_at: string
}

export type Notice = {
  id: number
  title: string
  content: string
  is_pinned: boolean
  is_active: boolean
  view_count: number
  created_at: string
  updated_at: string
}