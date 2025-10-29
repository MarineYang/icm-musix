#!/bin/bash

echo "=== Storage 문제 해결 스크립트 ==="

# 1. Storage만 중지
echo "[1/5] Stopping Storage..."
docker-compose stop supabase-storage supabase-imgproxy

# 2. Storage 스키마가 있는지 확인하고 테이블 생성
echo "[2/5] Creating Storage tables..."
docker exec -i icm-supabase-db psql -U postgres -d icm_db <<'EOSQL'
-- Storage 테이블 삭제 후 재생성
DROP TABLE IF EXISTS storage.objects CASCADE;
DROP TABLE IF EXISTS storage.buckets CASCADE;

-- Buckets 테이블
CREATE TABLE storage.buckets (
    id text PRIMARY KEY,
    name text NOT NULL UNIQUE,
    owner uuid,
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now(),
    public boolean DEFAULT false,
    avif_autodetection boolean DEFAULT false,
    file_size_limit bigint,
    allowed_mime_types text[]
);

-- Objects 테이블 (pathtoken 컬럼 제외)
CREATE TABLE storage.objects (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    bucket_id text REFERENCES storage.buckets(id) ON DELETE CASCADE,
    name text NOT NULL,
    owner uuid,
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now(),
    last_accessed_at timestamptz DEFAULT now(),
    metadata jsonb,
    version text,
    UNIQUE(bucket_id, name)
);

-- 인덱스
CREATE INDEX idx_objects_bucket_id ON storage.objects(bucket_id);
CREATE INDEX idx_objects_name ON storage.objects(name);

-- 권한
GRANT ALL ON storage.buckets TO supabase_storage_admin, postgres;
GRANT ALL ON storage.objects TO supabase_storage_admin, postgres;
GRANT SELECT ON storage.buckets TO authenticated, anon;
GRANT SELECT ON storage.objects TO authenticated, anon;

-- RLS
ALTER TABLE storage.buckets ENABLE ROW LEVEL SECURITY;
ALTER TABLE storage.objects ENABLE ROW LEVEL SECURITY;

-- 기본 버킷 생성
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'post-images',
  'post-images',
  true,
  5242880,
  ARRAY['image/jpeg', 'image/png', 'image/gif', 'image/webp']
)
ON CONFLICT (id) DO NOTHING;

\echo '✅ Storage 테이블 생성 완료!'
EOSQL

if [ $? -ne 0 ]; then
    echo "❌ 테이블 생성 실패!"
    exit 1
fi

# 3. Storage 컨테이너 재시작
echo "[3/5] Starting Storage..."
docker-compose up -d supabase-storage supabase-imgproxy

# 4. 10초 대기
echo "[4/5] Waiting 10 seconds..."
sleep 10

# 5. 상태 확인
echo "[5/5] Checking status..."
docker-compose ps | grep storage

echo ""
echo "=== Storage Logs (last 30 lines) ==="
docker-compose logs --tail=30 supabase-storage

echo ""
echo "🎉 완료! Storage가 정상 작동하는지 로그를 확인하세요."

