-- Create storage bucket for avatars if it doesn't exist
INSERT INTO storage.buckets (id, name, public)
VALUES ('avatars', 'avatars', true)
ON CONFLICT (id) DO NOTHING;

-- Enable RLS (already enabled on storage.objects, but policies are needed)

-- 1. Permite acceso de lectura público a todos los avatares
CREATE POLICY "Avatars public read"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'avatars');

-- 2. Permite a los usuarios autenticados subir su propia imagen
-- El nombre del archivo en la ruta debe ser {user_id}/{filename}
CREATE POLICY "Avatars insert matching folder name"
  ON storage.objects FOR INSERT
  WITH CHECK (
    bucket_id = 'avatars'
    AND auth.role() = 'authenticated'
    AND (storage.foldername(name))[1] = auth.uid()::text
  );

-- 3. Permite a los usuarios actualizar su propia imagen
CREATE POLICY "Avatars update matching folder name"
  ON storage.objects FOR UPDATE
  WITH CHECK (
    bucket_id = 'avatars'
    AND auth.role() = 'authenticated'
    AND (storage.foldername(name))[1] = auth.uid()::text
  );

-- 4. Permite a los usuarios eliminar su propia imagen
CREATE POLICY "Avatars delete matching folder name"
  ON storage.objects FOR DELETE
  USING (
    bucket_id = 'avatars'
    AND auth.role() = 'authenticated'
    AND (storage.foldername(name))[1] = auth.uid()::text
  );
