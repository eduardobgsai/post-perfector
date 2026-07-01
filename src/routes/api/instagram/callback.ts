import { createAPIFileRoute } from '@tanstack/react-start/api'

export const Route = createAPIFileRoute('/api/instagram/callback')({
  GET: async ({ request }) => {
    try {
      const url = new URL(request.url)
      const code = url.searchParams.get('code')
      const error = url.searchParams.get('error')
      const errorReason = url.searchParams.get('error_reason')

      if (error) {
        return new Response(JSON.stringify({ error, errorReason }), {
          status: 400,
          headers: { 'Content-Type': 'application/json' },
        })
      }

      if (!code) {
        return new Response(JSON.stringify({ error: 'No code provided' }), {
          status: 400,
          headers: { 'Content-Type': 'application/json' },
        })
      }

      // Aqui você pode adicionar a lógica para trocar o código por um token de acesso
      // usando a API do Instagram, ex:
      // const tokenResponse = await fetch('https://api.instagram.com/oauth/access_token', { ... })

      return new Response(JSON.stringify({ message: 'Callback recebido com sucesso', code }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      })
    } catch (err) {
      console.error('Erro no callback do Instagram:', err)
      return new Response(JSON.stringify({ error: 'Erro interno do servidor' }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      })
    }
  },
  POST: async ({ request }) => {
    // Caso o Instagram envie callbacks via POST (ex: webhooks de atualização)
    return new Response(JSON.stringify({ message: 'POST recebido' }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    })
  }
})
