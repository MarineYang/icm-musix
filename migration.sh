cd /work/icm-musix

# 1. 모든 컨테이너 중지
docker-compose down

# 2. storage 마이그레이션 파일을 임시로 다른 곳으로 이동
mv supabase/migrations/20251026000004_create_storage_bucket.sql supabase/20251026000004_create_storage_bucket.sql.backup

# 3. 다시 시작 (Storage 테이블이 자동으로 생성됨)
docker-compose up -d

# 4. Storage가 정상적으로 실행될 때까지 대기 (약 30초)
sleep 30
docker-compose ps

# 5. Storage가 Up 상태면, 백업한 SQL을 직접 실행
docker exec -it icm-supabase-db psql -U postgres -d icm_db -f /docker-entrypoint-initdb.d/../20251026000004_create_storage_bucket.sql.backup

# 또는 수동으로 SQL 실행
docker exec -it icm-supabase-db psql -U postgres -d icm_db << 'EOF'
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'post-images',
  'post-images',
  true,
  5242880,
  ARRAY['image/jpeg', 'image/png', 'image/gif', 'image/webp']
)
ON CONFLICT (id) DO NOTHING;

CREATE POLICY IF NOT EXISTS "Allow public read access to post images"
  ON storage.objects FOR SELECT TO public
  USING (bucket_id = 'post-images');

CREATE POLICY IF NOT EXISTS "Allow public upload access to post images"
  ON storage.objects FOR INSERT TO public
  WITH CHECK (bucket_id = 'post-images' AND (storage.foldername(name))[1] = 'uploads');

CREATE POLICY IF NOT EXISTS "Allow public delete access to post images"
  ON storage.objects FOR DELETE TO public
  USING (bucket_id = 'post-images');

CREATE POLICY IF NOT EXISTS "Allow public update access to post images"
  ON storage.objects FOR UPDATE TO public
  USING (bucket_id = 'post-images')
  WITH CHECK (bucket_id = 'post-images');
EOF

# 6. 로그 확인
docker-compose logs -f icm-supabase-storage