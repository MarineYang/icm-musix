-- Create artists table
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

-- Create artist_images table (for multiple images per artist)
CREATE TABLE IF NOT EXISTS artist_images (
  id BIGSERIAL PRIMARY KEY,
  artist_id VARCHAR(100) NOT NULL REFERENCES artists(id) ON DELETE CASCADE,
  image_url TEXT NOT NULL,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create artist_videos table (for artist's music videos)
CREATE TABLE IF NOT EXISTS artist_videos (
  id BIGSERIAL PRIMARY KEY,
  artist_id VARCHAR(100) NOT NULL REFERENCES artists(id) ON DELETE CASCADE,
  video_id VARCHAR(255) NOT NULL,
  title VARCHAR(500) NOT NULL,
  thumbnail_url TEXT,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_artists_display_order ON artists(display_order);
CREATE INDEX IF NOT EXISTS idx_artists_is_active ON artists(is_active);
CREATE INDEX IF NOT EXISTS idx_artist_images_artist_id ON artist_images(artist_id);
CREATE INDEX IF NOT EXISTS idx_artist_images_display_order ON artist_images(display_order);
CREATE INDEX IF NOT EXISTS idx_artist_videos_artist_id ON artist_videos(artist_id);
CREATE INDEX IF NOT EXISTS idx_artist_videos_display_order ON artist_videos(display_order);

-- Enable Row Level Security (RLS)
ALTER TABLE artists ENABLE ROW LEVEL SECURITY;
ALTER TABLE artist_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE artist_videos ENABLE ROW LEVEL SECURITY;

-- Create policies for public read access
CREATE POLICY "Allow public read access to artists"
  ON artists
  FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Allow public read access to artist_images"
  ON artist_images
  FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Allow public read access to artist_videos"
  ON artist_videos
  FOR SELECT
  TO public
  USING (true);

-- Create policies for public insert access
CREATE POLICY "Allow public insert access to artists"
  ON artists
  FOR INSERT
  TO public
  WITH CHECK (true);

CREATE POLICY "Allow public insert access to artist_images"
  ON artist_images
  FOR INSERT
  TO public
  WITH CHECK (true);

CREATE POLICY "Allow public insert access to artist_videos"
  ON artist_videos
  FOR INSERT
  TO public
  WITH CHECK (true);

-- Create policies for public update access
CREATE POLICY "Allow public update access to artists"
  ON artists
  FOR UPDATE
  TO public
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Allow public update access to artist_images"
  ON artist_images
  FOR UPDATE
  TO public
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Allow public update access to artist_videos"
  ON artist_videos
  FOR UPDATE
  TO public
  USING (true)
  WITH CHECK (true);

-- Create policies for public delete access
CREATE POLICY "Allow public delete access to artists"
  ON artists
  FOR DELETE
  TO public
  USING (true);

CREATE POLICY "Allow public delete access to artist_images"
  ON artist_images
  FOR DELETE
  TO public
  USING (true);

CREATE POLICY "Allow public delete access to artist_videos"
  ON artist_videos
  FOR DELETE
  TO public
  USING (true);

-- Insert sample artists data
INSERT INTO artists (id, name, description, profile_image, youtube_url, instagram_url, facebook_url, twitter_url, display_order, is_active) VALUES
  ('psy', 'PSY', 'Go Crazy or Go Home', '/workspace/uploads/image (4).png', 'https://youtube.com/@psy', 'https://instagram.com/42psy42', 'https://facebook.com/officialpsy', 'https://twitter.com/psy_oppa', 1, true),
  ('crush', 'CRUSH', 'R&B Soul Master', '/workspace/uploads/image (4).png', 'https://youtube.com/@crush', 'https://instagram.com/crush9244', 'https://facebook.com/crush9244', 'https://twitter.com/crush9244', 2, true),
  ('bignaughty', 'BIG Naughty', 'Hip-hop Rising Star', '/workspace/uploads/image (4).png', 'https://youtube.com/@bignaughty', 'https://instagram.com/bignaughty', 'https://facebook.com/bignaughty', NULL, 3, true),
  ('ph1', 'pH-1', 'Korean-American Rapper', '/workspace/uploads/image (4).png', 'https://youtube.com/@ph1official', 'https://instagram.com/ph1boyyy', NULL, 'https://twitter.com/ph1boyyy', 4, true);

-- Insert artist images
INSERT INTO artist_images (artist_id, image_url, display_order) VALUES
  ('psy', '/workspace/uploads/image (4).png', 1),
  ('psy', '/workspace/uploads/image (5).png', 2),
  ('psy', '/workspace/uploads/image (4).png', 3),
  ('crush', '/workspace/uploads/image (4).png', 1),
  ('crush', '/workspace/uploads/image (5).png', 2),
  ('crush', '/workspace/uploads/image (4).png', 3),
  ('bignaughty', '/workspace/uploads/image (4).png', 1),
  ('bignaughty', '/workspace/uploads/image (5).png', 2),
  ('bignaughty', '/workspace/uploads/image (4).png', 3),
  ('ph1', '/workspace/uploads/image (4).png', 1),
  ('ph1', '/workspace/uploads/image (5).png', 2),
  ('ph1', '/workspace/uploads/image (4).png', 3);

-- Insert artist videos for PSY
INSERT INTO artist_videos (artist_id, video_id, title, thumbnail_url, display_order) VALUES
  ('psy', '9bZkp7q19f0', 'PSY - GANGNAM STYLE(강남스타일) M/V', 'https://img.youtube.com/vi/9bZkp7q19f0/maxresdefault.jpg', 1),
  ('psy', 'ASO_ypdHDuk', 'PSY - GENTLEMAN M/V', 'https://img.youtube.com/vi/ASO_ypdHDuk/maxresdefault.jpg', 2),
  ('psy', 'HkMNOlYcpHg', 'PSY - DADDY(feat. CL of 2NE1) M/V', 'https://img.youtube.com/vi/HkMNOlYcpHg/maxresdefault.jpg', 3),
  ('psy', 'CH1XGdu-hzQ', 'PSY - New Face M/V', 'https://img.youtube.com/vi/CH1XGdu-hzQ/maxresdefault.jpg', 4),
  ('psy', 'CH1XGdu-hzQ', 'PSY - New Face M/V', 'https://img.youtube.com/vi/CH1XGdu-hzQ/maxresdefault.jpg', 5),
  ('psy', 'CH1XGdu-hzQ', 'PSY - New Face M/V', 'https://img.youtube.com/vi/CH1XGdu-hzQ/maxresdefault.jpg', 6);

-- Insert artist videos for CRUSH
INSERT INTO artist_videos (artist_id, video_id, title, thumbnail_url, display_order) VALUES
  ('crush', 'dQw4w9WgXcQ', 'Crush - ''Beautiful'' Official MV', 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=600&h=400&fit=crop', 1),
  ('crush', 'dQw4w9WgXcQ', 'Crush - ''Rush Hour'' Official MV', 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=600&h=400&fit=crop', 2),
  ('crush', 'dQw4w9WgXcQ', 'Crush - ''NAPPA'' Official MV', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&h=400&fit=crop', 3),
  ('crush', 'dQw4w9WgXcQ', 'Crush - ''Lay Your Head On Me'' Official MV', 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=600&h=400&fit=crop', 4);

-- Insert artist videos for BIG Naughty
INSERT INTO artist_videos (artist_id, video_id, title, thumbnail_url, display_order) VALUES
  ('bignaughty', 'dQw4w9WgXcQ', 'BIG Naughty - ''Joker'' Official MV', 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=600&h=400&fit=crop', 1),
  ('bignaughty', 'dQw4w9WgXcQ', 'BIG Naughty - ''Vancouver 2'' Official MV', 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=600&h=400&fit=crop', 2),
  ('bignaughty', 'dQw4w9WgXcQ', 'BIG Naughty - ''Bucket List'' Official MV', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&h=400&fit=crop', 3);

-- Insert artist videos for pH-1
INSERT INTO artist_videos (artist_id, video_id, title, thumbnail_url, display_order) VALUES
  ('ph1', 'dQw4w9WgXcQ', 'pH-1 - ''NERDY LOVE'' Official MV', 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=600&h=400&fit=crop', 1),
  ('ph1', 'dQw4w9WgXcQ', 'pH-1 - ''PACKITUP!'' Official MV', 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=600&h=400&fit=crop', 2),
  ('ph1', 'dQw4w9WgXcQ', 'pH-1 - ''HATE YOU'' Official MV', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&h=400&fit=crop', 3);

