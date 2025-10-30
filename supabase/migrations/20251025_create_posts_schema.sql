-- ============================================
-- Posts 스키마 생성 (ICM CLOUD 게시판)
-- ============================================

-- 1. Posts 테이블
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

-- 2. Comments 테이블
CREATE TABLE IF NOT EXISTS comments (
  id BIGSERIAL PRIMARY KEY,
  post_id BIGINT NOT NULL REFERENCES posts(id) ON DELETE CASCADE,
  author VARCHAR(100) NOT NULL,
  password VARCHAR(255) NOT NULL,
  content TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. File Attachments 테이블
CREATE TABLE IF NOT EXISTS file_attachments (
  id BIGSERIAL PRIMARY KEY,
  post_id BIGINT NOT NULL REFERENCES posts(id) ON DELETE CASCADE,
  filename VARCHAR(255) NOT NULL,
  file_url TEXT NOT NULL,
  file_size BIGINT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. 인덱스 생성
CREATE INDEX IF NOT EXISTS idx_posts_created_at ON posts(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_posts_author ON posts(author);
CREATE INDEX IF NOT EXISTS idx_comments_post_id ON comments(post_id);
CREATE INDEX IF NOT EXISTS idx_file_attachments_post_id ON file_attachments(post_id);

-- 5. 트리거 함수
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION increment_view_count(post_id BIGINT)
RETURNS void AS $$
BEGIN
  UPDATE posts SET view_count = view_count + 1 WHERE id = post_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 6. 트리거 생성
CREATE TRIGGER update_posts_updated_at
  BEFORE UPDATE ON posts
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- 7. 샘플 데이터
INSERT INTO posts (title, content, author, password, view_count, like_count) VALUES
  ('Welcome to ICM CLOUD', 'ICM CLOUD에 오신 것을 환영합니다! 음악과 이야기를 공유해보세요.', 'Admin', 'password123', 100, 25),
  ('My First Track', '몇 달 간 작업한 트랙입니다. 들어보세요!', 'Producer1', 'mypass', 45, 12),
  ('Looking for Collaboration', '힙합 트랙 콜라보 하실 분?', 'Rapper_Jay', 'secure123', 30, 8),
  ('New Beat Drop', '새로운 비트 드랍했습니다. 피드백 부탁드려요!', 'BeatMaker', 'beat2024', 67, 15),
  ('Mixing Tips', '믹싱 팁 공유합니다...', 'Engineer_Mike', 'audio123', 89, 22)
ON CONFLICT DO NOTHING;
