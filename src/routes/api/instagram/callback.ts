import { createAPIFileRoute } from '@tanstack/react-start/api'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.VITE_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY! // service role — nunca expor no frontend
)

export const Route = createAPIFileRoute('/api/instagram/callback')({
  GET: async ({ request }) => {
    const url = new URL(request.url)
    const code = url.searchParams.get('code')
    const state = url.searchParams.get('state') // user_id do Supabase
    const error = url.searchParams.get('error')

    if (error) {
      return Response.redirect(`${process.env.VITE_APP_URL}/settings?error=instagram_denied`)
    }

    if (!code || !state) {
      return Response.redirect(`${process.env.VITE_APP_URL}/settings?error=missing_params`)
    }

    // 1. Troca o code pelo access_token
    const tokenRes = await fetch('https://api.instagram.com/oauth/access_token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        client_id: process.env.INSTAGRAM_APP_ID!,
        client_secret: process.env.INSTAGRAM_APP_SECRET!,
        grant_type: 'authorization_code',
        redirect_uri: `${process.env.VITE_APP_URL}/api/instagram/callback`,
        code,
      }),
    })

    const tokenData = await tokenRes.json()

    if (tokenData.error_type) {
      return Response.redirect(`${process.env.VITE_APP_URL}/settings?error=token_exchange`)
    }

    // 2. Busca dados do usuário Instagram
    const meRes = await fetch(
      `https://graph.instagram.com/me?fields=user_id,username&access_token=${tokenData.access_token}`
    )
    const meData = await meRes.json()

    // 3. Salva no Supabase
    await supabase.from('integracoes').upsert({
      user_id: state,
      plataforma: 'instagram',
      access_token: tokenData.access_token,
      instagram_business_id: meData.user_id,
      instagram_username: meData.username,
      token_type: tokenData.token_type,
      expires_in: tokenData.expires_in,
      connected_at: new Date().toISOString(),
    }, { onConflict: 'user_id' })

    // 4. Redireciona de volta pro app
    return Response.redirect(`${process.env.VITE_APP_URL}/settings?success=instagram_connected`)
  },
})