-- Create storage bucket for TTS cache if it doesn't exist
INSERT INTO storage.buckets (id, name, public)
VALUES ('tts-cache', 'tts-cache', true)
ON CONFLICT (id) DO NOTHING;

-- Allow public read access to tts-cache objects
CREATE POLICY "TTS Cache public read"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'tts-cache');
