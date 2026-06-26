-- PASSO 1: Adicionar a coluna user_id na tabela pai (com default para não quebrar inserts pelo App)
ALTER TABLE generated_posts ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES auth.users(id) DEFAULT auth.uid();

-- PASSO 2: (IMPORTANTE) Neste momento, crie o seu usuário na tela de Login/Cadastro da aplicação.
-- Após criar a conta (ex: dev@postperfector.com), copie o ID gerado na tabela auth.users.
-- O comando abaixo associa todos os posts antigos a esse usuário:
-- ATENÇÃO: Substitua 'COLOQUE-SEU-USER-ID-AQUI' pelo ID real que você acabou de criar!
UPDATE generated_posts SET user_id = '71333e59-6b6b-4ea9-a248-36ebe5355db3' WHERE user_id IS NULL;


ALTER TABLE generated_posts ALTER COLUMN user_id SET NOT NULL;

-- PASSO 4: Habilitar e configurar RLS (Segurança) em generated_posts
ALTER TABLE generated_posts ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Permitir inserts anônimos" ON generated_posts;
DROP POLICY IF EXISTS "Permitir select público" ON generated_posts;
DROP POLICY IF EXISTS "Permitir leitura de generated_posts" ON generated_posts;
DROP POLICY IF EXISTS "Permitir update em generated_posts" ON generated_posts;
DROP POLICY IF EXISTS "Permitir delete em generated_posts" ON generated_posts;

CREATE POLICY "Usuários podem ver apenas seus próprios posts"
    ON generated_posts FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Usuários podem inserir seus próprios posts"
    ON generated_posts FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Usuários podem atualizar seus próprios posts"
    ON generated_posts FOR UPDATE
    USING (auth.uid() = user_id);

CREATE POLICY "Usuários podem deletar seus próprios posts"
    ON generated_posts FOR DELETE
    USING (auth.uid() = user_id);


-- PASSO 5: Habilitar RLS em post_agendamentos
ALTER TABLE post_agendamentos ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Permitir leitura de post_agendamentos" ON post_agendamentos;
DROP POLICY IF EXISTS "Permitir insert em post_agendamentos" ON post_agendamentos;
DROP POLICY IF EXISTS "Permitir update em post_agendamentos" ON post_agendamentos;
DROP POLICY IF EXISTS "Permitir delete em post_agendamentos" ON post_agendamentos;

CREATE POLICY "Acesso apenas aos agendamentos dos próprios posts"
    ON post_agendamentos FOR ALL
    USING (
        EXISTS (
            SELECT 1 FROM generated_posts 
            WHERE generated_posts.id = post_agendamentos.post_id 
            AND generated_posts.user_id = auth.uid()
        )
    );

-- PASSO 6: Habilitar RLS em post_carrossel_midias
ALTER TABLE post_carrossel_midias ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Permitir tudo em post_carrossel_midias" ON post_carrossel_midias;

CREATE POLICY "Acesso apenas às mídias dos próprios posts"
    ON post_carrossel_midias FOR ALL
    USING (
        EXISTS (
            SELECT 1 FROM generated_posts 
            WHERE generated_posts.id = post_carrossel_midias.post_id 
            AND generated_posts.user_id = auth.uid()
        )
    );
