-- ============================================
-- YouTube Videos 스키마 (홈페이지용)
-- ============================================

CREATE TABLE IF NOT EXISTS youtube_videos (
  id BIGSERIAL PRIMARY KEY,
  video_id VARCHAR(255) NOT NULL,
  title VARCHAR(500) NOT NULL,
  thumbnail_url TEXT,
  display_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 인덱스
CREATE INDEX IF NOT EXISTS idx_youtube_videos_display_order ON youtube_videos(display_order);
CREATE INDEX IF NOT EXISTS idx_youtube_videos_is_active ON youtube_videos(is_active);

-- 샘플 데이터
INSERT INTO youtube_videos (video_id, title, thumbnail_url, display_order, is_active) VALUES
  ('jWQx2f-CErU', 'Latest Music Video', 'https://img.youtube.com/vi/jWQx2f-CErU/maxresdefault.jpg', 1, true),
  ('dQw4w9WgXcQ', 'Music Video 2', 'https://img.youtube.com/vi/dQw4w9WgXcQ/maxresdefault.jpg', 2, true),
  ('L_jWHffIx5E', 'Music Video 3', 'https://img.youtube.com/vi/L_jWHffIx5E/maxresdefault.jpg', 3, true),
  ('kJQP7kiw5Fk', 'Music Video 4', 'https://img.youtube.com/vi/kJQP7kiw5Fk/maxresdefault.jpg', 4, true)
ON CONFLICT DO NOTHING;
