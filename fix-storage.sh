docker-compose exec -T supabase-db psql -U postgres -d icm_db << 'EOF'
-- RLS 비활성화
ALTER TABLE storage.objects DISABLE ROW LEVEL SECURITY;
ALTER TABLE storage.buckets DISABLE ROW LEVEL SECURITY;

-- 모든 정책 삭제
DROP POLICY IF EXISTS "Bucket public read" ON storage.buckets;
DROP POLICY IF EXISTS "Public read access" ON storage.objects;
DROP POLICY IF EXISTS "Public upload access" ON storage.objects;
DROP POLICY IF EXISTS "Public update access" ON storage.objects;
DROP POLICY IF EXISTS "Public delete access" ON storage.objects;

-- Storage 권한 부여
GRANT ALL ON ALL TABLES IN SCHEMA storage TO anon, authenticated, service_role;
GRANT ALL ON ALL SEQUENCES IN SCHEMA storage TO anon, authenticated, service_role;

-- 확인
SELECT relname, relrowsecurity FROM pg_class WHERE relnamespace = 'storage'::regnamespace;
EOF