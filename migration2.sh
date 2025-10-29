#!/bin/bash
set -euo pipefail

echo "🚨 경고: 이 스크립트는 Supabase 데이터베이스와 스토리지를 완전히 초기화합니다."
echo "계속하려면 5초 안에 Ctrl + C 를 누르세요..."
sleep 5

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$ROOT_DIR"

echo "📦 Docker Compose 버전 확인"
docker-compose version

echo "⏹️  모든 컨테이너 중지 및 삭제"
docker-compose down -v || true

echo "🗑️  남은 볼륨 정리"
docker volume rm icm-musix_supabase-db-data icm-musix_supabase-storage-data 2>/dev/null || true

echo "🔄 PostgreSQL부터 기동"
docker-compose up -d supabase-db

echo "⏳ PostgreSQL 준비 대기..."
until docker exec icm-supabase-db pg_isready -U postgres >/dev/null 2>&1; do
  sleep 2
done
# 초기화 후 약간 더 대기
sleep 5

echo "🛠️  pg_hba.conf 를 md5 모드로 재설정"
docker exec icm-supabase-db bash -c "cat <<'EOF' > /var/lib/postgresql/data/pg_hba.conf
# TYPE  DATABASE        USER                       ADDRESS              METHOD

# Unix 소켓은 peer 유지
local   all             all                                             peer

# loopback → md5
host    all             all                       127.0.0.1/32         md5
host    all             all                       ::1/128              md5

# Docker 네트워크 전체 md5
host    all             all                       0.0.0.0/0            md5

# Supabase 필수 계정 명시
host    icm_db          authenticator             0.0.0.0/0            md5
host    icm_db          supabase_auth_admin       0.0.0.0/0            md5
host    icm_db          supabase_storage_admin    0.0.0.0/0            md5
host    icm_db          supabase_admin            0.0.0.0/0            md5
host    icm_db          postgres                  0.0.0.0/0            md5

# replication (필요 시)
host    replication     all                       0.0.0.0/0            md5
host    replication     all                       ::1/128              md5
EOF
chown postgres:postgres /var/lib/postgresql/data/pg_hba.conf
chmod 600 /var/lib/postgresql/data/pg_hba.conf
"

echo "📡 PostgreSQL 설정 리로드"
docker exec icm-supabase-db su - postgres -c "pg_ctl reload -D /var/lib/postgresql/data"

echo "🚀 나머지 Supabase 서비스 시작"
docker-compose up -d

echo "⏳ 서비스 안정화 대기 (20초)..."
sleep 20

echo "📊 컨테이너 상태"
docker-compose ps

echo "📋 PostgREST 로그"
docker-compose logs --tail=20 supabase-rest

echo "🔍 Kong 헬스체크"
if curl -sSf http://127.0.0.1:54321/ >/dev/null; then
  echo "✅ Kong 정상 응답"
else
  echo "❌ Kong 확인 필요"
fi

echo "🎉 초기화 완료! 브라우저에서 https://welcome2icm.com 을 Ctrl+Shift+R 로 새로고침하세요."