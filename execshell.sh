# 1. 모든 컨테이너와 볼륨 삭제
docker-compose down -v

# 2. 재시작 (수정된 마이그레이션 자동 실행)
docker-compose up -d

# 3. 로그 확인
docker-compose logs -f supabase-storage

# 4. 테이블 확인
docker-compose exec -T supabase-db psql -U postgres -d icm_db -c "\dt public.*"

# 5. Storage 버킷 확인
docker-compose exec -T supabase-db psql -U postgres -d icm_db -c "SELECT * FROM storage.buckets;"