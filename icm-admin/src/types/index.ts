export interface Post {
  id: number;
  title: string;
  content: string;
  author: string;
  password: string;
  created_at: string;
  updated_at: string;
  view_count: number;
  like_count: number;
}

export interface Comment {
  id: number;
  post_id: number;
  author: string;
  password: string;
  content: string;
  created_at: string;
}

export interface FileAttachment {
  id: number;
  post_id: number;
  filename: string;
  file_url: string;
  file_size: number;
  created_at: string;
}

export interface InstagramAccount {
  id: number;
  handle: string;
  platform: string;
  image_url: string;
  account_url: string;
  is_active: boolean;
  display_order: number;
  created_at: string;
  updated_at: string;
}

export interface YoutubeVideo {
  id: number;
  video_id: string;
  title: string;
  thumbnail_url: string;
  display_order: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface Artist {
  id: string;
  name: string;
  description: string;
  profile_image?: string;
  youtube_url?: string;
  instagram_url?: string;
  facebook_url?: string;
  twitter_url?: string;
  display_order: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface ArtistImage {
  id: number;
  artist_id: string;
  image_url: string;
  display_order: number;
  created_at: string;
}

export interface ArtistVideo {
  id: number;
  artist_id: string;
  video_id: string;
  title: string;
  thumbnail_url: string;
  display_order: number;
  created_at: string;
}

export interface SocialLink {
  id: number;
  platform: 'instagram' | 'youtube' | 'twitter' | 'facebook' | 'tiktok' | 'website';
  url: string;
  is_active: boolean;
  display_order: number;
  created_at: string;
  updated_at: string;
}