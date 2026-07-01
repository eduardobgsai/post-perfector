import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { useEffect, useRef } from 'react';
import { supabase } from '@/lib/supabase';
import { AnimatedIcon } from '@/components/AnimatedIcon';
import { toast } from 'sonner';

export const Route = createFileRoute('/callback')({
  component: IntegracaoCallback,
});

function IntegracaoCallback() {
  const navigate = useNavigate();
  const hasProcessed = useRef(false);

  useEffect(() => {
    // Verificar imediatamente se há erros na URL (retornados pelo OAuth)
    const hash = window.location.hash;
    const search = window.location.search;
    if (hash.includes('error=') || search.includes('error=')) {
      const params = new URLSearchParams(hash.includes('error=') ? hash.substring(1) : search);
      const errorDesc = params.get('error_description') || params.get('error');
      toast.error("Erro na autorização do Facebook: " + errorDesc?.replace(/\+/g, ' '));
      navigate({ to: '/' });
      return;
    }

    const processAuth = async (session: any) => {
      if (hasProcessed.current) return;

      const metaToken = session?.provider_token;
      const userId = session?.user?.id;

      if (metaToken && userId) {
        hasProcessed.current = true;


        // Buscar o Instagram Business ID vinculado às páginas do usuário
        let instagramBusinessId = null;
        try {
          const fbRes = await fetch(`https://graph.facebook.com/v19.0/me/accounts?fields=instagram_business_account&access_token=${metaToken}`);
          const fbData = await fbRes.json();

          if (fbData.error) {
            toast.error("Erro da API do Facebook: " + fbData.error.message);
            console.error("Facebook API Error:", fbData.error);
          } else if (fbData.data && fbData.data.length > 0) {
            // Verifica quantas páginas foram retornadas
            const pagesWithIg = fbData.data.filter((page: any) => page.instagram_business_account?.id);

            if (pagesWithIg.length > 0) {
              instagramBusinessId = pagesWithIg[0].instagram_business_account.id;
            } else {
              toast.warning(`O Facebook retornou ${fbData.data.length} página(s), mas nenhuma tem uma conta do Instagram Business vinculada.`);
              console.log("Páginas retornadas:", fbData.data);
            }
          } else {
            toast.warning("O Facebook não retornou nenhuma página. Verifique se você concedeu as permissões corretas ou se possui uma página.");
          }
        } catch (err) {
          console.error("Erro ao buscar Instagram Business ID no Facebook:", err);
          toast.error("Erro de conexão ao buscar dados do Instagram.");
        }

        // Guardar o token e o ID na nossa tabela
        const { error } = await supabase
          .from('integracoes')
          .upsert(
            {
              user_id: userId,
              plataforma: 'instagram',
              access_token: metaToken,
              refresh_token: session?.provider_refresh_token,
              ...(instagramBusinessId ? { instagram_business_id: instagramBusinessId } : {})
            },
            { onConflict: 'user_id' }
          );

        if (!error) {
          toast.success("Conta vinculada com sucesso!");
        } else {
          console.error("Erro ao salvar token:", error);
          toast.error("Erro ao salvar token: " + error.message);
        }
        navigate({ to: '/' });
      }
    };

    // 1. Ouvir mudanças (o supabase parseia a URL assincronamente)
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (session && session.provider_token) {
        processAuth(session);
      }
    });

    // 2. Fallback: verificar se já está na sessão
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session && session.provider_token) {
        processAuth(session);
      }
    });

    // 3. Fallback de segurança: redirecionar após 3s mesmo se falhar para não prender o usuário
    const timer = setTimeout(() => {
      if (!hasProcessed.current) {
        navigate({ to: '/' });
      }
    }, 3000);

    return () => {
      subscription.unsubscribe();
      clearTimeout(timer);
    };
  }, [navigate]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background">
      <AnimatedIcon name="loader" className="h-8 w-8 animate-spin text-primary mb-4" />
      <p className="text-lg font-medium text-foreground/80">Processando sua conexão com o Facebook...</p>
    </div>
  );
}
