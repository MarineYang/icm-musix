-- Create posts table
CREATE TABLE IF NOT EXISTS posts (
  id BIGSERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  author VARCHAR(100) NOT NULL,
  password VARCHAR(255) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  view_count INTEGER DEFAULT 0,
  like_count INTEGER DEFAULT 0
);

-- Create comments table
CREATE TABLE IF NOT EXISTS comments (
  id BIGSERIAL PRIMARY KEY,
  post_id BIGINT NOT NULL REFERENCES posts(id) ON DELETE CASCADE,
  author VARCHAR(100) NOT NULL,
  password VARCHAR(255) NOT NULL,
  content TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create file attachments table
CREATE TABLE IF NOT EXISTS file_attachments (
  id BIGSERIAL PRIMARY KEY,
  post_id BIGINT NOT NULL REFERENCES posts(id) ON DELETE CASCADE,
  filename VARCHAR(255) NOT NULL,
  file_url TEXT NOT NULL,
  file_size BIGINT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_posts_created_at ON posts(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_posts_author ON posts(author);
CREATE INDEX IF NOT EXISTS idx_posts_title ON posts USING gin(to_tsvector('english', title));
CREATE INDEX IF NOT EXISTS idx_posts_content ON posts USING gin(to_tsvector('english', content));
CREATE INDEX IF NOT EXISTS idx_comments_post_id ON comments(post_id);
CREATE INDEX IF NOT EXISTS idx_file_attachments_post_id ON file_attachments(post_id);

-- Create function to automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create function to increment view count
CREATE OR REPLACE FUNCTION increment_view_count(post_id BIGINT)
RETURNS void AS $$
BEGIN
  UPDATE posts
  SET view_count = view_count + 1
  WHERE id = post_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for posts table
CREATE TRIGGER update_posts_updated_at
  BEFORE UPDATE ON posts
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Enable Row Level Security (RLS)
ALTER TABLE posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE file_attachments ENABLE ROW LEVEL SECURITY;

-- Create policies for public read access
CREATE POLICY "Allow public read access to posts"
  ON posts
  FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Allow public read access to comments"
  ON comments
  FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Allow public read access to file attachments"
  ON file_attachments
  FOR SELECT
  TO public
  USING (true);

-- Create policies for public insert access (allow anyone to create posts/comments)
CREATE POLICY "Allow public insert access to posts"
  ON posts
  FOR INSERT
  TO public
  WITH CHECK (true);

CREATE POLICY "Allow public insert access to comments"
  ON comments
  FOR INSERT
  TO public
  WITH CHECK (true);

CREATE POLICY "Allow public insert access to file attachments"
  ON file_attachments
  FOR INSERT
  TO public
  WITH CHECK (true);

-- Create policies for update (authenticated users only or password match)
-- Note: For password-based updates, you'll need to implement this in your application logic
CREATE POLICY "Allow public update access to posts"
  ON posts
  FOR UPDATE
  TO public
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Allow public update access to comments"
  ON comments
  FOR UPDATE
  TO public
  USING (true)
  WITH CHECK (true);

-- Create policies for delete (authenticated users only or password match)
CREATE POLICY "Allow public delete access to posts"
  ON posts
  FOR DELETE
  TO public
  USING (true);

CREATE POLICY "Allow public delete access to comments"
  ON comments
  FOR DELETE
  TO public
  USING (true);

CREATE POLICY "Allow public delete access to file attachments"
  ON file_attachments
  FOR DELETE
  TO public
  USING (true);

-- Insert some sample data for testing
INSERT INTO posts (title, content, author, password, view_count, like_count) VALUES
  ('Welcome to ICM CLOUD', 'This is the first post on ICM CLOUD. Share your music and connect with other artists!', 'Admin', 'password123', 100, 25),
  ('My First Track', 'Check out my latest track! I''ve been working on this for months.', 'Producer1', 'mypass', 45, 12),
  ('Looking for Collaboration', 'Anyone interested in collaborating on a hip-hop track?', 'Rapper_Jay', 'secure123', 30, 8),
  ('New Beat Drop', 'Just dropped a new beat. Let me know what you think!', 'BeatMaker', 'beat2024', 67, 15),
  ('Mixing Tips', 'Here are some mixing tips I''ve learned over the years...', 'Engineer_Mike', 'audio123', 89, 22);

