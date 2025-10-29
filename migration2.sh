# 서버에서 실행
cd /work/icm-musix

# 1. 현재 상태 완전히 초기화
docker-compose down -v

# 2. 볼륨 삭제 (데이터베이스 완전 초기화)
docker volume rm icm-musix_supabase-db-data 2>/dev/null || true
docker volume rm icm-musix_supabase-storage-data 2>/dev/null || true

# 3. 최신 코드 받기 (로컬과 동기화)
git pull

# 4. 처음부터 다시 시작
docker-compose up -d

# 5. 로그 모니터링
docker-compose logs -f supabase-db supabase-rest supabase-kong