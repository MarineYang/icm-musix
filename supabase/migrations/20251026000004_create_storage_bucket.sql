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

-- RLS 활성화
ALTER TABLE storage.objects ENABLE ROW LEVEL SECURITY;
ALTER TABLE storage.buckets ENABLE ROW LEVEL SECURITY;

-- Storage 버킷 정책: 모두 읽기 가능
CREATE POLICY IF NOT EXISTS "Bucket public read"
  ON storage.buckets
  FOR SELECT
  USING (true);

-- Storage 정책: 모두 읽기 가능
CREATE POLICY IF NOT EXISTS "Public read access"
  ON storage.objects
  FOR SELECT
  USING (bucket_id = 'post-images');

-- Storage 정책: 모두 업로드 가능 (anon, authenticated, service_role)
CREATE POLICY IF NOT EXISTS "Public upload access"
  ON storage.objects
  FOR INSERT
  WITH CHECK (bucket_id = 'post-images');

-- Storage 정책: 모두 업데이트 가능
CREATE POLICY IF NOT EXISTS "Public update access"
  ON storage.objects
  FOR UPDATE
  USING (bucket_id = 'post-images')
  WITH CHECK (bucket_id = 'post-images');

-- Storage 정책: 모두 삭제 가능
CREATE POLICY IF NOT EXISTS "Public delete access"
  ON storage.objects
  FOR DELETE
  USING (bucket_id = 'post-images');
