const { createClient } = require('@supabase/supabase-js')

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_KEY
)

exports.handler = async (event) => {
  // Validación básica
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Método no permitido' })
    }
  }

  try {
    const { videoUrl, redirectUrl = '' } = JSON.parse(event.body)
    
    // Validación estricta .mp4
    if (!videoUrl?.endsWith('.mp4')) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'URL debe ser .mp4' })
      }
    }

    // Genera ID único
    const id = Math.random().toString(36).substring(2, 9)

    // Inserta en Supabase (versión mejorada)
    const { data, error } = await supabase
      .from('urls')
      .insert({
        id,
        video_url: videoUrl,
        redirect_url: redirectUrl
      })
      .select('id')  // ← ¡CRUCIAL! Solicita específicamente el ID de vuelta

    if (error) {
      console.error('Error Supabase:', error)
      throw new Error('Error en base de datos')
    }

    if (!data || !data[0]?.id) {
      throw new Error('No se recibió ID de Supabase')
    }

    return {
      statusCode: 200,
      body: JSON.stringify({ id: data[0].id })
    }

  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ 
        error: 'Error al generar URL',
        details: error.message 
      })
    }
  }
        }
