docker-compose down -v
docker volume prune -f

# 환경변수 확인
cat .env

# 처음부터 시작 (로컬과 동일)
docker-compose up -d

# 30초 대기
sleep 30

# 로그 확인
docker-compose logs --tail=50 supabase-rest