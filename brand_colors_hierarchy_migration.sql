-- Tabela de Pastas de Cores
CREATE TABLE IF NOT EXISTS brand_color_folders (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) DEFAULT auth.uid(),
  name VARCHAR(255) NOT NULL,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Habilitar RLS para brand_color_folders
ALTER TABLE brand_color_folders ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Usuários podem gerenciar suas pastas" ON brand_color_folders;
CREATE POLICY "Usuários podem gerenciar suas pastas"
  ON brand_color_folders FOR ALL
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Adicionando colunas de hierarquia na tabela existente brand_colors
ALTER TABLE brand_colors 
ADD COLUMN IF NOT EXISTS folder_id UUID REFERENCES brand_color_folders(id) ON DELETE CASCADE,
ADD COLUMN IF NOT EXISTS sort_order INTEGER DEFAULT 0;
