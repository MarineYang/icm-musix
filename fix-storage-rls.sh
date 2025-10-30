#!/bin/bash
# Storage RLS 완전 비활성화 스크립트

echo "🔧 Storage RLS 비활성화 시작..."

docker-compose exec -T supabase-db psql -U postgres -d icm_db << 'EOF'

-- 1. 모든 기존 정책 삭제
DO $$ 
DECLARE
    r RECORD;
BEGIN
    FOR r IN (SELECT policyname FROM pg_policies WHERE schemaname = 'storage') LOOP
        EXECUTE 'DROP POLICY IF EXISTS "' || r.policyname || '" ON storage.objects CASCADE';
        EXECUTE 'DROP POLICY IF EXISTS "' || r.policyname || '" ON storage.buckets CASCADE';
    END LOOP;
END $$;

-- 2. RLS 완전 비활성화
ALTER TABLE IF EXISTS storage.objects DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS storage.buckets DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS storage.migrations DISABLE ROW LEVEL SECURITY;

-- 3. 모든 권한 부여
GRANT ALL ON ALL TABLES IN SCHEMA storage TO anon;
GRANT ALL ON ALL TABLES IN SCHEMA storage TO authenticated;
GRANT ALL ON ALL TABLES IN SCHEMA storage TO service_role;
GRANT ALL ON ALL TABLES IN SCHEMA storage TO supabase_storage_admin;

GRANT ALL ON ALL SEQUENCES IN SCHEMA storage TO anon;
GRANT ALL ON ALL SEQUENCES IN SCHEMA storage TO authenticated;
GRANT ALL ON ALL SEQUENCES IN SCHEMA storage TO service_role;
GRANT ALL ON ALL SEQUENCES IN SCHEMA storage TO supabase_storage_admin;

-- 4. 기본 권한 설정
ALTER DEFAULT PRIVILEGES IN SCHEMA storage GRANT ALL ON TABLES TO anon, authenticated, service_role, supabase_storage_admin;
ALTER DEFAULT PRIVILEGES IN SCHEMA storage GRANT ALL ON SEQUENCES TO anon, authenticated, service_role, supabase_storage_admin;

-- 5. 버킷이 public인지 확인
UPDATE storage.buckets SET public = true WHERE id = 'post-images';

-- 6. 확인
SELECT 
    schemaname, 
    tablename, 
    CASE WHEN rowsecurity THEN 'ENABLED ❌' ELSE 'DISABLED ✅' END as rls_status
FROM pg_tables 
WHERE schemaname = 'storage';

SELECT id, name, public FROM storage.buckets;

EOF

echo ""
echo "✅ Storage RLS 비활성화 완료!"
echo ""
echo "🔄 Storage 컨테이너 재시작 중..."
docker-compose restart supabase-storage

echo ""
echo "⏳ 5초 대기..."
sleep 5

echo ""
echo "📋 Storage 로그 확인:"
docker-compose logs --tail=20 supabase-storage

echo ""
echo "🎉 완료! 이제 업로드를 다시 시도해보세요!"

