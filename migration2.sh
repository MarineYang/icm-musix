cd /work/icm-musix

# 1. 모든 마이그레이션 실행
for file in supabase/migrations/*.sql; do
  echo "Running $file..."
  docker exec -i icm-supabase-db psql -U postgres -d icm_db < "$file" 2>&1 | grep -v "already exists\|does not exist"
done

# 2. 테이블 확인
docker exec -i icm-supabase-db psql -U postgres -d icm_db -c "\dt"

# 3. 잘못된 이미지 경로 모두 삭제
docker exec -i icm-supabase-db psql -U postgres -d icm_db <<'EOSQL'
DELETE FROM artist_images WHERE image_url LIKE '/workspace/%';
SELECT COUNT(*) as "Remaining Images" FROM artist_images;
EOSQL

# 4. Storage 버킷 생성
docker exec -i icm-supabase-db psql -U postgres -d icm_db <<'EOSQL'
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES ('post-images', 'post-images', true, 52428800, ARRAY['image/jpeg', 'image/png', 'image/gif', 'image/webp'])
ON CONFLICT (id) DO UPDATE SET public = true;
EOSQL

# 5. 프론트엔드 완전 재빌드
git pull
docker-compose stop frontend
docker-compose rm -f frontend  
docker-compose build --no-cache frontend
docker-compose up -d frontend

# 6. 로그 확인
docker-compose logs -f frontend