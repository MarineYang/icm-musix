#!/bin/bash
# 각 마이그레이션 파일 수동 실행

echo "🚀 마이그레이션 시작..."

docker-compose exec -T supabase-db psql -U postgres -d icm_db < ./supabase/migrations/00000000000000_init_supabase_roles.sql
echo "✅ 1/8 init_supabase_roles 완료"

docker-compose exec -T supabase-db psql -U postgres -d icm_db < ./supabase/migrations/20251025_create_posts_schema.sql
echo "✅ 2/8 create_posts_schema 완료"

docker-compose exec -T supabase-db psql -U postgres -d icm_db < ./supabase/migrations/20251025999999_create_instagram_accounts.sql
echo "✅ 3/8 create_instagram_accounts 완료"

docker-compose exec -T supabase-db psql -U postgres -d icm_db < ./supabase/migrations/20251026000000_create_youtube_videos.sql
echo "✅ 4/8 create_youtube_videos 완료"

docker-compose exec -T supabase-db psql -U postgres -d icm_db < ./supabase/migrations/20251026000001_create_artists.sql
echo "✅ 5/8 create_artists 완료"

docker-compose exec -T supabase-db psql -U postgres -d icm_db < ./supabase/migrations/20251026000002_create_admin_schema.sql
echo "✅ 6/8 create_admin_schema 완료"

docker-compose exec -T supabase-db psql -U postgres -d icm_db < ./supabase/migrations/20251026000003_create_social_links_schema.sql
echo "✅ 7/8 create_social_links_schema 완료"

docker-compose exec -T supabase-db psql -U postgres -d icm_db < ./supabase/migrations/20251026000004_create_storage_bucket.sql
echo "✅ 8/8 create_storage_bucket 완료"

echo ""
echo "🎉 마이그레이션 완료! 테이블 확인 중..."
docker-compose exec -T supabase-db psql -U postgres -d icm_db -c "\dt public.*"

echo ""
echo "✅ 모든 마이그레이션이 성공적으로 완료되었습니다!"