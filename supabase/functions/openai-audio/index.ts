import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // 1. Manejo de CORS pre-flight
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const openAiApiKey = Deno.env.get('OPENAI_API_KEY')
    if (!openAiApiKey) {
      return new Response(
        JSON.stringify({ error: 'La variable de entorno OPENAI_API_KEY no está configurada.' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    const url = new URL(req.url)
    const action = url.searchParams.get('action')

    // RUTA: TEXT TO SPEECH (TTS)
    if (action === 'tts') {
      const { text, voice = 'nova', speed = 1.0 } = await req.json()

      if (!text) {
        return new Response(
          JSON.stringify({ error: 'Falta el texto para la síntesis de voz.' }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
      }

      const response = await fetch('https://api.openai.com/v1/audio/speech', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${openAiApiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'tts-1',
          input: text,
          voice: voice,
          speed: speed,
        }),
      })

      if (!response.ok) {
        const errorDetails = await response.text()
        return new Response(errorDetails, {
          status: response.status,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        })
      }

      const audioBlob = await response.blob()
      return new Response(audioBlob, {
        headers: {
          ...corsHeaders,
          'Content-Type': 'audio/mpeg',
        },
      })
    }

    // RUTA: SPEECH TO TEXT (STT) - WHISPER
    if (action === 'stt') {
      const formData = await req.formData()
      const file = formData.get('file') as File

      if (!file) {
        return new Response(
          JSON.stringify({ error: 'No se ha provisto el archivo de audio (.webm/.wav).' }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
      }

      const openAiFormData = new FormData()
      openAiFormData.append('file', file)
      openAiFormData.append('model', 'whisper-1')
      openAiFormData.append('language', 'en')

      const response = await fetch('https://api.openai.com/v1/audio/transcriptions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${openAiApiKey}`,
        },
        body: openAiFormData,
      })

      if (!response.ok) {
        const errorDetails = await response.text()
        return new Response(errorDetails, {
          status: response.status,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        })
      }

      const data = await response.json()
      return new Response(JSON.stringify(data), {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    // Si la acción no es válida
    return new Response(
      JSON.stringify({ error: 'Acción no válida. Usa ?action=tts o ?action=stt.' }),
      { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )

  } catch (error: any) {
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})
