-- ============================================
-- Artists 스키마 (아티스트 프로필)
-- ============================================

-- 1. Artists 테이블
CREATE TABLE IF NOT EXISTS artists (
  id VARCHAR(100) PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  profile_image TEXT,
  youtube_url TEXT,
  instagram_url TEXT,
  facebook_url TEXT,
  twitter_url TEXT,
  display_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Artist Images 테이블
CREATE TABLE IF NOT EXISTS artist_images (
  id BIGSERIAL PRIMARY KEY,
  artist_id VARCHAR(100) NOT NULL REFERENCES artists(id) ON DELETE CASCADE,
  image_url TEXT NOT NULL,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. Artist Videos 테이블
CREATE TABLE IF NOT EXISTS artist_videos (
  id BIGSERIAL PRIMARY KEY,
  artist_id VARCHAR(100) NOT NULL REFERENCES artists(id) ON DELETE CASCADE,
  video_id VARCHAR(255) NOT NULL,
  title VARCHAR(500) NOT NULL,
  thumbnail_url TEXT,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. 인덱스
CREATE INDEX IF NOT EXISTS idx_artists_display_order ON artists(display_order);
CREATE INDEX IF NOT EXISTS idx_artists_is_active ON artists(is_active);
CREATE INDEX IF NOT EXISTS idx_artist_images_artist_id ON artist_images(artist_id);
CREATE INDEX IF NOT EXISTS idx_artist_videos_artist_id ON artist_videos(artist_id);

-- 5. 샘플 아티스트 데이터
INSERT INTO artists (id, name, description, profile_image, youtube_url, instagram_url, display_order, is_active) VALUES
  ('psy', 'PSY', 'Go Crazy or Go Home', '/workspace/uploads/image (4).png', 'https://youtube.com/@psy', 'https://instagram.com/42psy42', 1, true),
  ('crush', 'CRUSH', 'R&B Soul Master', '/workspace/uploads/image (4).png', 'https://youtube.com/@crush', 'https://instagram.com/crush9244', 2, true),
  ('bignaughty', 'BIG Naughty', 'Hip-hop Rising Star', '/workspace/uploads/image (4).png', 'https://youtube.com/@bignaughty', 'https://instagram.com/bignaughty', 3, true),
  ('ph1', 'pH-1', 'Korean-American Rapper', '/workspace/uploads/image (4).png', 'https://youtube.com/@ph1official', 'https://instagram.com/ph1boyyy', 4, true)
ON CONFLICT DO NOTHING;

-- 6. 아티스트 이미지
INSERT INTO artist_images (artist_id, image_url, display_order) VALUES
  ('psy', '/workspace/uploads/image (4).png', 1),
  ('psy', '/workspace/uploads/image (5).png', 2),
  ('crush', '/workspace/uploads/image (4).png', 1),
  ('crush', '/workspace/uploads/image (5).png', 2)
ON CONFLICT DO NOTHING;

-- 7. 아티스트 비디오
INSERT INTO artist_videos (artist_id, video_id, title, thumbnail_url, display_order) VALUES
  ('psy', '9bZkp7q19f0', 'PSY - GANGNAM STYLE M/V', 'https://img.youtube.com/vi/9bZkp7q19f0/maxresdefault.jpg', 1),
  ('psy', 'ASO_ypdHDuk', 'PSY - GENTLEMAN M/V', 'https://img.youtube.com/vi/ASO_ypdHDuk/maxresdefault.jpg', 2),
  ('psy', 'HkMNOlYcpHg', 'PSY - DADDY M/V', 'https://img.youtube.com/vi/HkMNOlYcpHg/maxresdefault.jpg', 3)
ON CONFLICT DO NOTHING;
