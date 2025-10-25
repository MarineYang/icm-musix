-- Create youtube_videos table for home page
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

-- Create index for better query performance
CREATE INDEX IF NOT EXISTS idx_youtube_videos_display_order ON youtube_videos(display_order);
CREATE INDEX IF NOT EXISTS idx_youtube_videos_is_active ON youtube_videos(is_active);

-- Enable Row Level Security (RLS)
ALTER TABLE youtube_videos ENABLE ROW LEVEL SECURITY;

-- Create policy for public read access
CREATE POLICY "Allow public read access to youtube_videos"
  ON youtube_videos
  FOR SELECT
  TO public
  USING (true);

-- Create policy for public insert access
CREATE POLICY "Allow public insert access to youtube_videos"
  ON youtube_videos
  FOR INSERT
  TO public
  WITH CHECK (true);

-- Create policy for public update access
CREATE POLICY "Allow public update access to youtube_videos"
  ON youtube_videos
  FOR UPDATE
  TO public
  USING (true)
  WITH CHECK (true);

-- Create policy for public delete access
CREATE POLICY "Allow public delete access to youtube_videos"
  ON youtube_videos
  FOR DELETE
  TO public
  USING (true);

-- Insert sample data for home page
INSERT INTO youtube_videos (video_id, title, thumbnail_url, display_order, is_active) VALUES
  ('jWQx2f-CErU', 'Latest Music Video', 'https://img.youtube.com/vi/jWQx2f-CErU/maxresdefault.jpg', 1, true),
  ('dQw4w9WgXcQ', 'Music Video 2', 'https://img.youtube.com/vi/dQw4w9WgXcQ/maxresdefault.jpg', 2, true),
  ('L_jWHffIx5E', 'Music Video 3', 'https://img.youtube.com/vi/L_jWHffIx5E/maxresdefault.jpg', 3, true),
  ('kJQP7kiw5Fk', 'Music Video 4', 'https://img.youtube.com/vi/kJQP7kiw5Fk/maxresdefault.jpg', 4, true);

