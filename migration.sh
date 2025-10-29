#!/bin/bash

echo "=== ICM Musix Storage Migration Script ==="

cd /work/icm-musix || exit 1

# 1. 모든 컨테이너 중지
echo "[1/6] Stopping all containers..."
docker-compose down

# 2. storage 마이그레이션 파일을 임시로 다른 곳으로 이동
echo "[2/6] Moving storage migration file temporarily..."
if [ -f "./supabase/migrations/20251026000004_create_storage_bucket.sql" ]; then
    mv ./supabase/migrations/20251026000004_create_storage_bucket.sql ./supabase/20251026000004_create_storage_bucket.sql.backup
    echo "Migration file moved to backup"
else
    echo "Migration file already moved or not found"
fi

# 3. 다시 시작 (Storage 테이블이 자동으로 생성됨)
echo "[3/6] Starting containers..."
docker-compose up -d

# 4. Storage가 정상적으로 실행될 때까지 대기
echo "[4/6] Waiting for services to be ready (30 seconds)..."
sleep 30

echo "Container status:"
docker-compose ps

# 5. Storage 버킷 및 정책 생성
echo "[5/6] Creating storage bucket and policies..."
docker exec -i icm-supabase-db psql -U postgres -d icm_db <<'EOSQL'
-- Storage 버킷 생성
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'post-images',
  'post-images',
  true,
  5242880,
  ARRAY['image/jpeg', 'image/png', 'image/gif', 'image/webp']
)
ON CONFLICT (id) DO NOTHING;

-- 읽기 권한
DROP POLICY IF EXISTS "Allow public read access to post images" ON storage.objects;
CREATE POLICY "Allow public read access to post images"
  ON storage.objects FOR SELECT TO public
  USING (bucket_id = 'post-images');

-- 업로드 권한
DROP POLICY IF EXISTS "Allow public upload access to post images" ON storage.objects;
CREATE POLICY "Allow public upload access to post images"
  ON storage.objects FOR INSERT TO public
  WITH CHECK (bucket_id = 'post-images' AND (storage.foldername(name))[1] = 'uploads');

-- 삭제 권한
DROP POLICY IF EXISTS "Allow public delete access to post images" ON storage.objects;
CREATE POLICY "Allow public delete access to post images"
  ON storage.objects FOR DELETE TO public
  USING (bucket_id = 'post-images');

-- 업데이트 권한
DROP POLICY IF EXISTS "Allow public update access to post images" ON storage.objects;
CREATE POLICY "Allow public update access to post images"
  ON storage.objects FOR UPDATE TO public
  USING (bucket_id = 'post-images')
  WITH CHECK (bucket_id = 'post-images');

\echo '✅ Storage bucket and policies created successfully!'
EOSQL

if [ $? -eq 0 ]; then
    echo "✅ Storage migration completed successfully!"
else
    echo "❌ Storage migration failed!"
    exit 1
fi

# 6. 최종 상태 확인
echo "[6/6] Checking final status..."
echo ""
echo "=== Container Status ==="
docker-compose ps

echo ""
echo "=== Storage Logs (last 20 lines) ==="
docker-compose logs --tail=20 supabase-storage 2>/dev/null || echo "Storage service not found or not running"

echo ""
echo "=== Realtime Logs (last 20 lines) ==="
docker-compose logs --tail=20 supabase-realtime 2>/dev/null || echo "Realtime service not found or not running"

echo ""
echo "🎉 Migration script completed!"
echo "Check the logs above for any errors."
