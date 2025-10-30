# 각 마이그레이션 파일 수동 실행
docker-compose exec supabase-db psql -U postgres -d icm_db < ./supabase/migrations/00000000000000_init_supabase_roles.sql
docker-compose exec supabase-db psql -U postgres -d icm_db < ./supabase/migrations/20251025_create_posts_schema.sql
docker-compose exec supabase-db psql -U postgres -d icm_db < ./supabase/migrations/20251025999999_create_instagram_accounts.sql
docker-compose exec supabase-db psql -U postgres -d icm_db < ./supabase/migrations/20251026000000_create_youtube_videos.sql
docker-compose exec supabase-db psql -U postgres -d icm_db < ./supabase/migrations/20251026000001_create_artists.sql
docker-compose exec supabase-db psql -U postgres -d icm_db < ./supabase/migrations/20251026000002_create_admin_schema.sql
docker-compose exec supabase-db psql -U postgres -d icm_db < ./supabase/migrations/20251026000003_create_social_links_schema.sql
docker-compose exec supabase-db psql -U postgres -d icm_db < ./supabase/migrations/20251026000004_create_storage_bucket.sql