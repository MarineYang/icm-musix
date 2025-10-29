#!/bin/bash
set -e

echo "🔧 Supabase 완전 재시작..."

cd /work/icm-musix

# 1. 현재 상태 완전히 초기화
echo "📦 컨테이너 중지 및 볼륨 삭제..."
docker-compose down -v

# 2. 볼륨 삭제 (데이터베이스 완전 초기화)
docker volume rm icm-musix_supabase-db-data 2>/dev/null || true
docker volume rm icm-musix_supabase-storage-data 2>/dev/null || true

# 3. 최신 코드 받기 (로컬과 동기화)
echo "📥 Git Pull..."
git pull

# 4. pg_hba.conf 파일 권한 설정
chmod 644 pg_hba.conf

# 5. 처음부터 다시 시작
echo "🚀 Docker Compose 시작..."
docker-compose up -d

echo "⏳ 초기화 대기 (30초)..."
sleep 30

# 6. 서비스 상태 확인
echo ""
echo "📊 서비스 상태:"
docker-compose ps

# 7. PostgREST 로그 확인
echo ""
echo "📋 PostgREST 로그:"
docker-compose logs --tail=30 supabase-rest

echo ""
echo "✅ 완료! 로그에서 'Database connection error'가 없으면 성공입니다!"
echo "🌐 브라우저: https://welcome2icm.com"