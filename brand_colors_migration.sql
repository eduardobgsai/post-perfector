-- Criação da tabela brand_colors para o Mídia Kit
CREATE TABLE IF NOT EXISTS brand_colors (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) DEFAULT auth.uid(),
  hex VARCHAR(7) NOT NULL, -- Ex: #FF5733
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Habilitar Row Level Security (RLS)
ALTER TABLE brand_colors ENABLE ROW LEVEL SECURITY;

-- Políticas de Segurança (apenas o dono pode ler/inserir/atualizar/deletar)
DROP POLICY IF EXISTS "Usuários podem ver suas próprias cores" ON brand_colors;
CREATE POLICY "Usuários podem ver suas próprias cores"
  ON brand_colors FOR SELECT
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Usuários podem inserir suas próprias cores" ON brand_colors;
CREATE POLICY "Usuários podem inserir suas próprias cores"
  ON brand_colors FOR INSERT
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Usuários podem atualizar suas próprias cores" ON brand_colors;
CREATE POLICY "Usuários podem atualizar suas próprias cores"
  ON brand_colors FOR UPDATE
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Usuários podem deletar suas próprias cores" ON brand_colors;
CREATE POLICY "Usuários podem deletar suas próprias cores"
  ON brand_colors FOR DELETE
  USING (auth.uid() = user_id);
