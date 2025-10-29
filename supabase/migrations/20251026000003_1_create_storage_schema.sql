-- ============================================
-- Supabase Storage 초기 스키마 생성
-- ============================================

-- Storage 기본 테이블 생성 (Supabase Storage API가 필요로 하는 테이블)

-- 1. storage.buckets 테이블
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

-- 2. storage.objects 테이블
CREATE TABLE IF NOT EXISTS storage.objects (
    id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
    bucket_id text REFERENCES storage.buckets(id),
    name text NOT NULL,
    owner uuid,
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now(),
    last_accessed_at timestamptz DEFAULT now(),
    metadata jsonb,
    path_tokens text[] GENERATED ALWAYS AS (string_to_array(name, '/')) STORED,
    version text,
    UNIQUE(bucket_id, name)
);

-- 3. 인덱스 생성
CREATE INDEX IF NOT EXISTS idx_objects_bucket_id ON storage.objects(bucket_id);
CREATE INDEX IF NOT EXISTS idx_objects_name ON storage.objects(name);
CREATE INDEX IF NOT EXISTS idx_buckets_name ON storage.buckets(name);

-- 4. RLS 활성화
ALTER TABLE storage.buckets ENABLE ROW LEVEL SECURITY;
ALTER TABLE storage.objects ENABLE ROW LEVEL SECURITY;

-- 5. 기본 권한 설정
GRANT ALL ON storage.buckets TO supabase_storage_admin;
GRANT ALL ON storage.objects TO supabase_storage_admin;
GRANT SELECT ON storage.buckets TO authenticated, anon;
GRANT SELECT ON storage.objects TO authenticated, anon;

-- 완료 메시지
DO $$
BEGIN
  RAISE NOTICE '✅ Storage 스키마 및 테이블이 생성되었습니다!';
END
$$;

