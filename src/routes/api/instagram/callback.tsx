import { createFileRoute, redirect, isRedirect } from '@tanstack/react-router'
import { createServerFn } from '@tanstack/react-start'
import { createClient } from '@supabase/supabase-js'

const exchangeInstagramToken = createServerFn({ method: 'GET' })
  .validator((d: { code: string; state: string }) => d)
  .handler(async ({ data }) => {
    const supabase = createClient(
      process.env.VITE_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY! // service role — nunca expor no frontend
    )

    // 1. Troca o code pelo access_token
    const tokenRes = await fetch('https://api.instagram.com/oauth/access_token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        client_id: process.env.INSTAGRAM_APP_ID!,
        client_secret: process.env.INSTAGRAM_APP_SECRET!,
        grant_type: 'authorization_code',
        redirect_uri: `${process.env.VITE_APP_URL}/api/instagram/callback`,
        code: data.code,
      }),
    })

    const tokenData = await tokenRes.json()

    if (tokenData.error_type || tokenData.error) {
      console.error('Erro ao trocar token:', tokenData)
      throw new Error('token_exchange_failed')
    }

    // 2. Busca dados do usuário Instagram
    const meRes = await fetch(
      `https://graph.instagram.com/me?fields=id,username&access_token=${tokenData.access_token}`
    )
    const meData = await meRes.json()
    
    if (meData.error) {
      console.error('Erro ao buscar perfil:', meData)
      throw new Error('profile_fetch_failed')
    }

    // 3. Salva no Supabase
    await supabase.from('integracoes').upsert({
      user_id: data.state,
      plataforma: 'instagram',
      access_token: tokenData.access_token,
      instagram_business_id: meData.id,
      instagram_username: meData.username,
      token_type: tokenData.token_type,
      expires_in: tokenData.expires_in,
      connected_at: new Date().toISOString(),
    }, { onConflict: 'user_id' })

    return true
  })

export const Route = createFileRoute('/api/instagram/callback')({
  loader: async ({ request }) => {
    const url = new URL(request.url)
    const code = url.searchParams.get('code')
    const state = url.searchParams.get('state')
    const error = url.searchParams.get('error')

    if (error) {
      throw redirect({ to: '/', search: { error: 'instagram_denied' } as any })
    }

    if (!code || !state) {
      throw redirect({ to: '/', search: { error: 'missing_params' } as any })
    }

    try {
      await exchangeInstagramToken({ data: { code, state } })
      throw redirect({ to: '/', search: { success: 'instagram_connected' } as any })
    } catch (e) {
      if (isRedirect(e)) {
        throw e
      }
      console.error('Erro no callback do instagram:', e)
      throw redirect({ to: '/', search: { error: 'token_exchange' } as any })
    }
  },
  component: () => (
    <div className="flex min-h-screen w-full flex-col items-center justify-center bg-background">
      <p className="text-lg font-medium text-foreground">Processando autenticação do Instagram...</p>
    </div>
  ),
})
