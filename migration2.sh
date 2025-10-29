#!/bin/bash
set -e

# 1. 모든 컨테이너 중지
echo "⏹️  컨테이너 중지..."
docker-compose down

# 2. 볼륨 완전 삭제 (DB 데이터 삭제)
echo "🗑️  DB 볼륨 삭제 (완전 초기화)..."
docker volume rm icm-musix_supabase-db-data -f 2>/dev/null || true
docker volume rm icm-musix_supabase-storage-data -f 2>/dev/null || true


# 4. pg_hba.conf 권한 설정
chmod 644 pg_hba.conf
chmod +x supabase/migrations/00000000000002_apply_pg_hba.sh

# 5. PostgreSQL 먼저 시작 (마이그레이션 실행)
echo "🔄 PostgreSQL 시작 중 (마이그레이션 자동 실행)..."
docker-compose up -d supabase-db

echo "⏳ PostgreSQL 초기화 및 마이그레이션 대기 (25초)..."
sleep 25

# 5-1. pg_hba.conf 수동 적용
echo "🔧 pg_hba.conf 적용 중..."
docker exec icm-supabase-db bash -c "cp /tmp/pg_hba.conf /var/lib/postgresql/data/pg_hba.conf && chmod 600 /var/lib/postgresql/data/pg_hba.conf && chown postgres:postgres /var/lib/postgresql/data/pg_hba.conf"

# 5-2. PostgreSQL 설정 리로드
docker exec icm-supabase-db su - postgres -c "pg_ctl reload -D /var/lib/postgresql/data" || true

echo "⏳ 설정 적용 대기 (5초)..."
sleep 5

# 6. PostgreSQL 로그 확인
echo "📋 PostgreSQL 마이그레이션 로그:"
docker-compose logs supabase-db | tail -30

# 7. DB 연결 테스트
echo ""
echo "🔍 DB 연결 테스트..."
docker exec icm-supabase-db psql -U postgres -d icm_db -c "SELECT 1;" && echo "✅ DB 연결 성공!" || echo "❌ DB 연결 실패!"

# 8. pg_hba.conf 확인
echo ""
echo "📋 pg_hba.conf 마운트 확인:"
docker exec icm-supabase-db cat /var/lib/postgresql/data/pg_hba.conf | grep -A 3 "Docker 네트워크"

# 9. 나머지 서비스 시작
echo ""
echo "🚀 나머지 Supabase 서비스 시작..."
docker-compose up -d

echo "⏳ 모든 서비스 초기화 대기 (15초)..."
sleep 15

# 10. 서비스 상태 확인
echo ""
echo "📊 서비스 상태:"
docker-compose ps

# 11. PostgREST 로그 확인
echo ""
echo "📋 PostgREST 로그 (최근 20줄):"
docker-compose logs --tail=20 supabase-rest

echo ""
echo "✅ 완료!"
echo "   - 로그에 'Database connection error' 없으면 성공!"
echo "   - 브라우저: https://welcome2icm.com (Ctrl+Shift+R 새로고침)"