
# 1. PostgreSQL에서 authenticator 사용자 비밀번호 재설정
docker exec -it icm-supabase-db psql -U postgres -d icm_db -c "ALTER USER authenticator WITH PASSWORD 'icm1234!@';"

# 2. 연결 테스트
docker exec -it icm-supabase-db psql -U authenticator -d icm_db -c "SELECT 1;"

# 3. PostgREST 재시작
docker-compose restart supabase-rest

# 4. 로그 확인 (에러가 사라져야 함)
docker-compose logs -f supabase-rest