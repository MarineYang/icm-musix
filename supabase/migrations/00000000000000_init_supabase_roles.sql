-- ============================================
-- Supabase 초기 설정 - 필수 사용자 및 역할 생성
-- ============================================

-- 1. 필수 역할(Role) 생성
DO $$
BEGIN
  -- anon 역할 생성
  IF NOT EXISTS (SELECT FROM pg_roles WHERE rolname = 'anon') THEN
    CREATE ROLE anon NOLOGIN NOINHERIT;
  END IF;

  -- authenticated 역할 생성
  IF NOT EXISTS (SELECT FROM pg_roles WHERE rolname = 'authenticated') THEN
    CREATE ROLE authenticated NOLOGIN NOINHERIT;
  END IF;

  -- service_role 역할 생성
  IF NOT EXISTS (SELECT FROM pg_roles WHERE rolname = 'service_role') THEN
    CREATE ROLE service_role NOLOGIN NOINHERIT BYPASSRLS;
  END IF;

  -- authenticator 사용자 생성 (PostgREST용)
  IF NOT EXISTS (SELECT FROM pg_roles WHERE rolname = 'authenticator') THEN
    CREATE USER authenticator WITH PASSWORD 'icm1234!!' NOINHERIT;
  END IF;

  -- supabase_auth_admin 사용자 생성 (GoTrue/Auth용)
  IF NOT EXISTS (SELECT FROM pg_roles WHERE rolname = 'supabase_auth_admin') THEN
    CREATE USER supabase_auth_admin WITH PASSWORD 'icm1234!!' CREATEDB CREATEROLE;
  END IF;

  -- supabase_storage_admin 사용자 생성 (Storage용)
  IF NOT EXISTS (SELECT FROM pg_roles WHERE rolname = 'supabase_storage_admin') THEN
    CREATE USER supabase_storage_admin WITH PASSWORD 'icm1234!!';
  END IF;

  -- supabase_admin 사용자 생성 (Realtime/Meta용)
  IF NOT EXISTS (SELECT FROM pg_roles WHERE rolname = 'supabase_admin') THEN
    CREATE USER supabase_admin WITH PASSWORD 'icm1234!!' CREATEDB CREATEROLE;
  END IF;
END
$$;

-- 2. 역할 권한 부여
GRANT anon, authenticated, service_role TO authenticator;
GRANT ALL PRIVILEGES ON DATABASE icm_db TO supabase_auth_admin;
GRANT ALL PRIVILEGES ON DATABASE icm_db TO supabase_storage_admin;
GRANT ALL PRIVILEGES ON DATABASE icm_db TO supabase_admin;

-- 3. 스키마 권한 설정
GRANT USAGE ON SCHEMA public TO anon, authenticated, service_role;
GRANT ALL ON SCHEMA public TO supabase_auth_admin, supabase_storage_admin, supabase_admin;

-- 4. 기본 테이블 권한
GRANT SELECT ON ALL TABLES IN SCHEMA public TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA public TO authenticated;
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO service_role;

-- 5. 시퀀스 권한
GRANT USAGE ON ALL SEQUENCES IN SCHEMA public TO anon, authenticated, service_role;
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO supabase_auth_admin, supabase_storage_admin;

-- 6. Auth 스키마 생성
CREATE SCHEMA IF NOT EXISTS auth;
GRANT ALL ON SCHEMA auth TO supabase_auth_admin;
GRANT USAGE ON SCHEMA auth TO authenticated, service_role;

-- 7. Storage 스키마 생성
CREATE SCHEMA IF NOT EXISTS storage;
GRANT ALL ON SCHEMA storage TO supabase_storage_admin;
GRANT USAGE ON SCHEMA storage TO authenticated, service_role, anon;

-- 8. Realtime 스키마 생성
CREATE SCHEMA IF NOT EXISTS _realtime;
CREATE SCHEMA IF NOT EXISTS realtime;
GRANT ALL ON SCHEMA _realtime TO supabase_admin;
GRANT ALL ON SCHEMA realtime TO supabase_admin;
GRANT USAGE ON SCHEMA realtime TO authenticated, service_role;

-- 9. Extensions 설치
CREATE EXTENSION IF NOT EXISTS "uuid-ossp" SCHEMA public;
CREATE EXTENSION IF NOT EXISTS "pgcrypto" SCHEMA public;
CREATE EXTENSION IF NOT EXISTS "pgjwt" SCHEMA public;

-- 10. 기본 함수 권한
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT EXECUTE ON FUNCTIONS TO anon, authenticated, service_role;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT SELECT ON TABLES TO anon;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON TABLES TO authenticated, service_role;

-- 완료 메시지
DO $$
BEGIN
  RAISE NOTICE '✅ Supabase 초기 설정이 완료되었습니다!';
  RAISE NOTICE '   - 필수 역할: anon, authenticated, service_role';
  RAISE NOTICE '   - 관리자: authenticator, supabase_auth_admin, supabase_storage_admin, supabase_admin';
  RAISE NOTICE '   - 스키마: auth, storage, realtime, _realtime';
END
$$;

