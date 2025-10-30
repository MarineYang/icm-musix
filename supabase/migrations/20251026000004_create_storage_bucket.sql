-- ============================================
-- Storage Bucket 설정 (이미지 업로드)
-- ============================================

-- Storage 버킷 생성
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'post-images',
  'post-images',
  true,
  10485760, -- 10MB
  ARRAY['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp']
)
ON CONFLICT (id) DO NOTHING;

-- RLS 비활성화 (완전 개방)
ALTER TABLE storage.objects DISABLE ROW LEVEL SECURITY;
ALTER TABLE storage.buckets DISABLE ROW LEVEL SECURITY;

-- Storage 스키마 권한 부여
GRANT ALL ON ALL TABLES IN SCHEMA storage TO anon, authenticated, service_role;
GRANT ALL ON ALL SEQUENCES IN SCHEMA storage TO anon, authenticated, service_role;

-- 기본 권한 설정
ALTER DEFAULT PRIVILEGES IN SCHEMA storage GRANT ALL ON TABLES TO anon, authenticated, service_role;
ALTER DEFAULT PRIVILEGES IN SCHEMA storage GRANT ALL ON SEQUENCES TO anon, authenticated, service_role;
