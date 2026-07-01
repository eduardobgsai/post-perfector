-- 1. Corrige o limite de uma integração por usuário
-- Se no futuro você quiser que o usuário conecte o LinkedIn também, a restrição "unique" no user_id vai bloquear.
-- Mudamos para garantir que ele só tenha 1 integração POR plataforma.
ALTER TABLE integracoes DROP CONSTRAINT IF EXISTS integracoes_user_id_key;
ALTER TABLE integracoes ADD CONSTRAINT integracoes_user_id_plataforma_key UNIQUE (user_id, plataforma);

-- 2. Recria a view para incluir os dados da integração
DROP VIEW IF EXISTS v_posts_para_publicar;

CREATE OR REPLACE VIEW v_posts_para_publicar AS
SELECT 
    p.id AS post_id,
    p.user_id,
    p.caption,
    p.generated_media,
    p.format,
    p.status,
    p.proporcao,
    p.media_type,
    a.data_publicacao,
    -- Puxa os dados da integração do usuário (assumindo instagram por padrão por enquanto)
    i.id AS integracao_id,
    i.plataforma,
    i.access_token,
    i.instagram_business_id
FROM generated_posts p
LEFT JOIN post_agendamentos a ON p.id = a.post_id
-- Junta com a tabela de integrações baseada no dono do post
LEFT JOIN integracoes i ON p.user_id = i.user_id AND i.plataforma = 'instagram'
WHERE 
    (p.status = 'Aprovada' AND p.agendada = true AND a.data_publicacao <= now())
    OR 
    p.status = 'Publicar Agora';

ALTER VIEW v_posts_para_publicar OWNER TO postgres;

-- 3. SEGURANÇA: Protege os tokens contra o frontend
-- Revogamos o acesso dos usuários normais à view, para que ninguém consiga ver os tokens pela API pública do Supabase.
REVOKE ALL ON v_posts_para_publicar FROM anon, authenticated;
-- Garantimos acesso apenas para a 'service_role' (a chave secreta que só seu backend/Edge Function conhece)
GRANT SELECT ON v_posts_para_publicar TO service_role;
