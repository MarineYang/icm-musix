docker-compose down -v
docker volume rm icm-musix_supabase-db-data icm-musix_supabase-storage-data 2>/dev/null || true

docker-compose up -d

docker-compose logs --tail=30 supabase-rest