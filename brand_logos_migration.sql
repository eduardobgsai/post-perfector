-- Criação do Bucket de Storage
INSERT INTO storage.buckets (id, name, public) VALUES ('logos', 'logos', true) ON CONFLICT (id) DO NOTHING;

-- Políticas do Bucket
DROP POLICY IF EXISTS "Public Access" ON storage.objects;
CREATE POLICY "Public Access" ON storage.objects FOR SELECT USING (bucket_id = 'logos');

DROP POLICY IF EXISTS "User can upload" ON storage.objects;
CREATE POLICY "User can upload" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'logos' AND auth.uid() = owner);

DROP POLICY IF EXISTS "User can update" ON storage.objects;
CREATE POLICY "User can update" ON storage.objects FOR UPDATE USING (bucket_id = 'logos' AND auth.uid() = owner);

DROP POLICY IF EXISTS "User can delete" ON storage.objects;
CREATE POLICY "User can delete" ON storage.objects FOR DELETE USING (bucket_id = 'logos' AND auth.uid() = owner);

-- Criação da tabela brand_logos
CREATE TABLE IF NOT EXISTS brand_logos (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) DEFAULT auth.uid(),
  name VARCHAR(255) NOT NULL,
  url TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Habilitar Row Level Security (RLS)
ALTER TABLE brand_logos ENABLE ROW LEVEL SECURITY;

-- Políticas de Segurança (apenas o dono pode ler/inserir/atualizar/deletar)
DROP POLICY IF EXISTS "Usuários podem ver seus próprios logos" ON brand_logos;
CREATE POLICY "Usuários podem ver seus próprios logos"
  ON brand_logos FOR SELECT
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Usuários podem inserir seus próprios logos" ON brand_logos;
CREATE POLICY "Usuários podem inserir seus próprios logos"
  ON brand_logos FOR INSERT
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Usuários podem atualizar seus próprios logos" ON brand_logos;
CREATE POLICY "Usuários podem atualizar seus próprios logos"
  ON brand_logos FOR UPDATE
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Usuários podem deletar seus próprios logos" ON brand_logos;
CREATE POLICY "Usuários podem deletar seus próprios logos"
  ON brand_logos FOR DELETE
  USING (auth.uid() = user_id);
