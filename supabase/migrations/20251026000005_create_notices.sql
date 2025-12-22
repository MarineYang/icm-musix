-- Notice 테이블 생성 (기존 데이터에 영향 없음)
CREATE TABLE IF NOT EXISTS notices (
  id SERIAL PRIMARY KEY,
  title VARCHAR(500) NOT NULL,
  content TEXT NOT NULL,
  is_pinned BOOLEAN DEFAULT FALSE,
  is_active BOOLEAN DEFAULT TRUE,
  view_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 인덱스 생성
CREATE INDEX IF NOT EXISTS idx_notices_is_active ON notices(is_active);
CREATE INDEX IF NOT EXISTS idx_notices_is_pinned ON notices(is_pinned);
CREATE INDEX IF NOT EXISTS idx_notices_created_at ON notices(created_at DESC);

-- RLS 정책 설정
ALTER TABLE notices ENABLE ROW LEVEL SECURITY;

-- 모든 사용자가 활성화된 공지사항 읽기 가능
CREATE POLICY "Anyone can read active notices" ON notices
  FOR SELECT USING (is_active = true);

-- anon 역할도 읽기 가능하도록 설정
CREATE POLICY "Anon can read notices" ON notices
  FOR SELECT TO anon USING (true);

-- 인증된 사용자는 모든 작업 가능 (admin용)
CREATE POLICY "Authenticated users can do everything" ON notices
  FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- 서비스 역할은 모든 작업 가능
CREATE POLICY "Service role can do everything" ON notices
  FOR ALL TO service_role USING (true) WITH CHECK (true);

-- updated_at 자동 업데이트 트리거
CREATE OR REPLACE FUNCTION update_notices_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_notices_updated_at
  BEFORE UPDATE ON notices
  FOR EACH ROW
  EXECUTE FUNCTION update_notices_updated_at();

-- 샘플 데이터 (선택사항)
-- INSERT INTO notices (title, content, is_pinned, is_active) VALUES
-- ('ICM 공식 웹사이트 오픈', '안녕하세요, ICM 공식 웹사이트가 오픈되었습니다. 많은 관심 부탁드립니다.', true, true);
