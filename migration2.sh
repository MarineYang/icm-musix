#!/bin/bash
set -e

echo "🔧 PostgreSQL pg_hba.conf 수정 중..."

# 1. pg_hba.conf 수정 - TCP 연결에 대해 md5 인증 허용
docker exec icm-supabase-db bash -c "cat >> /var/lib/postgresql/data/pg_hba.conf << 'EOF'

# Supabase 사용자들에 대한 TCP 연결 허용
host    icm_db          authenticator       0.0.0.0/0               md5
host    icm_db          supabase_auth_admin 0.0.0.0/0               md5
host    icm_db          supabase_storage_admin 0.0.0.0/0            md5
host    icm_db          supabase_admin      0.0.0.0/0               md5
EOF
"

echo "✅ pg_hba.conf 수정 완료"

# 2. PostgreSQL 재시작 (설정 적용)
echo "🔄 PostgreSQL 재시작 중..."
docker-compose restart supabase-db

echo "⏳ PostgreSQL 시작 대기 (10초)..."
sleep 10

# 3. PostgREST 재시작
echo "🔄 PostgREST 재시작 중..."
docker-compose restart supabase-rest

echo "⏳ PostgREST 시작 대기 (5초)..."
sleep 5

# 4. 로그 확인
echo "📋 PostgREST 로그:"
docker-compose logs --tail=20 supabase-rest

echo ""
echo "✅ 완료! 브라우저에서 확인하세요: https://welcome2icm.com"