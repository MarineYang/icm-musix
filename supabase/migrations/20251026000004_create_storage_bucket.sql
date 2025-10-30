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

-- Storage 정책: 누구나 읽기 가능
CREATE POLICY IF NOT EXISTS "Public read access"
  ON storage.objects
  FOR SELECT
  TO public
  USING (bucket_id = 'post-images');

-- Storage 정책: 누구나 업로드 가능
CREATE POLICY IF NOT EXISTS "Public upload access"
  ON storage.objects
  FOR INSERT
  TO public
  WITH CHECK (bucket_id = 'post-images');

-- Storage 정책: 누구나 삭제 가능
CREATE POLICY IF NOT EXISTS "Public delete access"
  ON storage.objects
  FOR DELETE
  TO public
  USING (bucket_id = 'post-images');

-- Storage 정책: 누구나 업데이트 가능
CREATE POLICY IF NOT EXISTS "Public update access"
  ON storage.objects
  FOR UPDATE
  TO public
  USING (bucket_id = 'post-images')
  WITH CHECK (bucket_id = 'post-images');
