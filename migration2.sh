cd /work/icm-musix

# Storage 중지
docker-compose stop supabase-storage

# 테이블 소유자 변경
docker exec -i icm-supabase-db psql -U postgres -d icm_db <<'EOSQL'
-- Storage 스키마 소유자 변경
ALTER SCHEMA storage OWNER TO supabase_storage_admin;

-- 테이블 소유자 변경
ALTER TABLE storage.buckets OWNER TO supabase_storage_admin;
ALTER TABLE storage.objects OWNER TO supabase_storage_admin;

-- 시퀀스 소유자 변경 (있다면)
DO $$
DECLARE
    r RECORD;
BEGIN
    FOR r IN SELECT schemaname, sequencename 
             FROM pg_sequences 
             WHERE schemaname = 'storage'
    LOOP
        EXECUTE 'ALTER SEQUENCE storage.' || quote_ident(r.sequencename) || 
                ' OWNER TO supabase_storage_admin';
    END LOOP;
END $$;

-- 함수 소유자 변경 (있다면)
DO $$
DECLARE
    r RECORD;
BEGIN
    FOR r IN SELECT proname, oidvectortypes(proargtypes) as args
             FROM pg_proc p
             JOIN pg_namespace n ON p.pronamespace = n.oid
             WHERE n.nspname = 'storage'
    LOOP
        EXECUTE 'ALTER FUNCTION storage.' || quote_ident(r.proname) || 
                '(' || r.args || ') OWNER TO supabase_storage_admin';
    END LOOP;
END $$;

-- 확인
\dt storage.*

\echo '✅ Storage 소유자 변경 완료!'
EOSQL

# Storage 재시작
docker-compose up -d supabase-storage

# 로그 확인 (20초)
timeout 20 docker-compose logs -f supabase-storage || true

# 상태 확인
docker-compose ps | grep storage