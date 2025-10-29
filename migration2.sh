#!/bin/bash
set -e

echo "🔧 PostgreSQL 재시작 및 초기화..."

# 1. 모든 Supabase 서비스 중지
docker-compose stop

echo "⏳ 서비스 종료 대기..."
sleep 3

# 2. PostgreSQL만 먼저 시작
echo "🔄 PostgreSQL 시작 중..."
docker-compose up -d supabase-db

echo "⏳ PostgreSQL 초기화 대기 (15초)..."
sleep 15

# 3. 연결 테스트
echo "🔍 PostgreSQL 연결 테스트..."
docker exec icm-supabase-db psql -U postgres -d icm_db -c "SELECT 1;" || echo "연결 실패!"

echo "✅ PostgreSQL 준비 완료"

# 4. 나머지 서비스 시작 (순서대로)
echo "🔄 Kong 시작 중..."
docker-compose up -d supabase-kong

echo "⏳ Kong 초기화 대기 (5초)..."
sleep 5

echo "🔄 PostgREST 시작 중..."
docker-compose up -d supabase-rest

echo "⏳ PostgREST 초기화 대기 (5초)..."
sleep 5

echo "🔄 나머지 서비스 시작 중..."
docker-compose up -d

echo "⏳ 모든 서비스 초기화 대기 (10초)..."
sleep 10

# 5. 서비스 상태 확인
echo ""
echo "📊 서비스 상태:"
docker-compose ps | grep -E "supabase-db|supabase-rest|supabase-kong"

# 6. PostgREST 로그 확인
echo ""
echo "📋 PostgREST 로그:"
docker-compose logs --tail=30 supabase-rest

# 7. Kong 연결 테스트
echo ""
echo "🔍 Kong 연결 테스트:"
curl -s http://127.0.0.1:54321/ | head -5 || echo "Kong 연결 실패!"

echo ""
echo "✅ 완료! 브라우저에서 확인하세요: https://welcome2icm.com"