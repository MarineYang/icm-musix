-- ============================================
-- PostgreSQL 인증 설정 (pg_hba.conf)
-- Docker 네트워크 환경에서 TCP 연결 허용
-- ============================================

-- pg_hba.conf 설정을 위한 함수 생성
CREATE OR REPLACE FUNCTION configure_pg_hba()
RETURNS void
LANGUAGE plpgsql
AS $$
BEGIN
  -- pg_hba.conf에 TCP 연결 허용 규칙 추가
  -- 이 함수는 PostgreSQL이 시작된 후 수동으로 실행해야 합니다
  RAISE NOTICE '⚠️ pg_hba.conf 수동 설정이 필요합니다!';
  RAISE NOTICE 'Docker 컨테이너에서 다음 명령어를 실행하세요:';
  RAISE NOTICE 'echo "host all authenticator all md5" >> /var/lib/postgresql/data/pg_hba.conf';
  RAISE NOTICE 'echo "host all supabase_auth_admin all md5" >> /var/lib/postgresql/data/pg_hba.conf';
  RAISE NOTICE 'echo "host all supabase_storage_admin all md5" >> /var/lib/postgresql/data/pg_hba.conf';
  RAISE NOTICE 'echo "host all supabase_admin all md5" >> /var/lib/postgresql/data/pg_hba.conf';
  RAISE NOTICE 'pg_ctl reload';
END;
$$;

-- 완료 메시지
DO $$
BEGIN
  RAISE NOTICE '✅ PostgreSQL 인증 설정 준비 완료!';
  RAISE NOTICE '⚠️  주의: Supabase 서비스가 제대로 작동하려면 pg_hba.conf를 수동으로 수정해야 합니다.';
END
$$;

