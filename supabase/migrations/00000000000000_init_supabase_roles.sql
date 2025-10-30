-- ============================================
-- 경량화된 Supabase 초기 설정
-- ============================================

-- 1. 필수 역할(Role) 생성
DO $$
BEGIN
  -- anon 역할 (익명 사용자)
  IF NOT EXISTS (SELECT FROM pg_roles WHERE rolname = 'anon') THEN
    CREATE ROLE anon NOLOGIN NOINHERIT;
  END IF;

  -- service_role 역할 (서비스 계정)
  IF NOT EXISTS (SELECT FROM pg_roles WHERE rolname = 'service_role') THEN
    CREATE ROLE service_role NOLOGIN NOINHERIT BYPASSRLS;
  END IF;

  -- authenticator 사용자 (PostgREST용)
  IF NOT EXISTS (SELECT FROM pg_roles WHERE rolname = 'authenticator') THEN
    CREATE USER authenticator WITH PASSWORD 'icm1234!!' NOINHERIT;
  END IF;

  -- supabase_storage_admin 사용자 (Storage용)
  IF NOT EXISTS (SELECT FROM pg_roles WHERE rolname = 'supabase_storage_admin') THEN
    CREATE USER supabase_storage_admin WITH PASSWORD 'icm1234!!';
  END IF;
END
$$;

-- 2. 역할 권한 부여
GRANT anon, service_role TO authenticator;
GRANT ALL PRIVILEGES ON DATABASE icm_db TO supabase_storage_admin;

-- 3. Public 스키마 권한 설정
GRANT USAGE ON SCHEMA public TO anon, service_role;
GRANT ALL ON SCHEMA public TO supabase_storage_admin;

-- 4. 기본 테이블 권한
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO anon, service_role;
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO anon, service_role;

-- 5. Storage 스키마 생성
CREATE SCHEMA IF NOT EXISTS storage;
GRANT ALL ON SCHEMA storage TO supabase_storage_admin;
GRANT USAGE ON SCHEMA storage TO anon, service_role;

-- 6. Extensions 설치
CREATE EXTENSION IF NOT EXISTS "uuid-ossp" SCHEMA public;
CREATE EXTENSION IF NOT EXISTS "pgcrypto" SCHEMA public;

-- 7. 기본 권한 설정
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON TABLES TO anon, service_role;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON SEQUENCES TO anon, service_role;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT EXECUTE ON FUNCTIONS TO anon, service_role;

-- 완료 메시지
DO $$
BEGIN
  RAISE NOTICE '✅ 경량화된 Supabase 초기 설정 완료!';
  RAISE NOTICE '   - 역할: anon, service_role';
  RAISE NOTICE '   - 사용자: authenticator, supabase_storage_admin';
  RAISE NOTICE '   - 스키마: public, storage';
END
$$;
