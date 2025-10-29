# 마이그레이션 파일 직접 실행
docker exec -i icm-supabase-db psql -U postgres -d icm_db < supabase/migrations/20251026000001_create_artists.sql

# 테이블 확인
docker exec -i icm-supabase-db psql -U postgres -d icm_db -c "\dt"

# artist_images 테이블 확인
docker exec -i icm-supabase-db psql -U postgres -d icm_db -c "\d artist_images"