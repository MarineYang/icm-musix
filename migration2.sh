cd /work/icm-musix

# 1. Storage 관련 마이그레이션 파일 임시 이동
mv ./supabase/migrations/20251026000003_1_create_storage_schema.sql ./supabase/
mv ./supabase/migrations/20251026000004_create_storage_bucket.sql ./supabase/

# 2. 모든 컨테이너 중지 및 볼륨 삭제
docker-compose down -v

# 3. Storage 없이 먼저 시작
docker-compose up -d supabase-db supabase-auth supabase-rest supabase-kong supabase-meta supabase-studio supabase-realtime frontend

# 4. 30초 대기
sleep 30

# 5. 수동으로 Storage 스키마 생성
docker exec -i icm-supabase-db psql -U postgres -d icm_db <<'EOSQL'
-- Storage 테이블 생성
CREATE TABLE IF NOT EXISTS storage.buckets (
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

CREATE TABLE IF NOT EXISTS storage.objects (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    bucket_id text REFERENCES storage.buckets(id),
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
CREATE INDEX IF NOT EXISTS idx_objects_bucket_id ON storage.objects(bucket_id);

-- 권한
GRANT ALL ON storage.buckets TO supabase_storage_admin;
GRANT ALL ON storage.objects TO supabase_storage_admin;

-- RLS
ALTER TABLE storage.buckets ENABLE ROW LEVEL SECURITY;
ALTER TABLE storage.objects ENABLE ROW LEVEL SECURITY;

\echo '✅ Storage 스키마 생성 완료'
EOSQL

# 6. Storage 시작
docker-compose up -d supabase-storage supabase-imgproxy

# 7. 로그 확인
docker-compose logs -f supabase-storage