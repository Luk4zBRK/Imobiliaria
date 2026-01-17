-- Create storage bucket for property images
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'property-images', 
  'property-images', 
  true,
  5242880, -- 5MB limit
  ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif']
);

-- Allow public read access to property images
CREATE POLICY "Public can view property images"
ON storage.objects FOR SELECT
USING (bucket_id = 'property-images');

-- Admins and editors can upload property images
CREATE POLICY "Admins and editors can upload property images"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'property-images' 
  AND public.is_admin_or_editor(auth.uid())
);

-- Admins and editors can update property images
CREATE POLICY "Admins and editors can update property images"
ON storage.objects FOR UPDATE
USING (
  bucket_id = 'property-images' 
  AND public.is_admin_or_editor(auth.uid())
);

-- Admins and editors can delete property images
CREATE POLICY "Admins and editors can delete property images"
ON storage.objects FOR DELETE
USING (
  bucket_id = 'property-images' 
  AND public.is_admin_or_editor(auth.uid())
);