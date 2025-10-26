-- Create storage bucket for post images
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'post-images',
  'post-images',
  true,
  5242880, -- 5MB limit
  ARRAY['image/jpeg', 'image/png', 'image/gif', 'image/webp']
)
ON CONFLICT (id) DO NOTHING;

-- Create storage policies for post-images bucket
CREATE POLICY "Allow public read access to post images"
  ON storage.objects
  FOR SELECT
  TO public
  USING (bucket_id = 'post-images');

CREATE POLICY "Allow public upload access to post images"
  ON storage.objects
  FOR INSERT
  TO public
  WITH CHECK (bucket_id = 'post-images' AND (storage.foldername(name))[1] = 'uploads');

CREATE POLICY "Allow public delete access to post images"
  ON storage.objects
  FOR DELETE
  TO public
  USING (bucket_id = 'post-images');

CREATE POLICY "Allow public update access to post images"
  ON storage.objects
  FOR UPDATE
  TO public
  USING (bucket_id = 'post-images')
  WITH CHECK (bucket_id = 'post-images');

