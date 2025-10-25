-- 소셜 미디어 링크 설정 테이블 생성
CREATE TABLE IF NOT EXISTS public.social_links (
  id SERIAL PRIMARY KEY,
  platform VARCHAR(50) NOT NULL CHECK (platform IN ('instagram', 'youtube', 'twitter', 'facebook', 'tiktok')),
  url VARCHAR(500) NOT NULL,
  is_active BOOLEAN DEFAULT true,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 인덱스 생성
CREATE INDEX IF NOT EXISTS idx_social_links_platform ON public.social_links(platform);
CREATE INDEX IF NOT EXISTS idx_social_links_display_order ON public.social_links(display_order);
CREATE INDEX IF NOT EXISTS idx_social_links_is_active ON public.social_links(is_active);

-- updated_at 자동 업데이트 트리거
CREATE OR REPLACE FUNCTION update_social_links_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_social_links_updated_at
  BEFORE UPDATE ON public.social_links
  FOR EACH ROW
  EXECUTE FUNCTION update_social_links_updated_at();

-- 기본 소셜 미디어 링크 삽입
INSERT INTO public.social_links (platform, url, is_active, display_order)
VALUES 
  ('instagram', 'https://instagram.com/icmmusix', true, 1),
  ('youtube', 'https://youtube.com/@icmmusix', true, 2),
  ('twitter', 'https://twitter.com/icmmusix', true, 3)
ON CONFLICT DO NOTHING;

-- 코멘트 추가
COMMENT ON TABLE public.social_links IS 'SocialSidebar에 표시될 소셜 미디어 링크 설정';

