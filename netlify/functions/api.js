const { createClient } = require('@supabase/supabase-js');

// Configuración con tus datos
const supabaseUrl = 'https://dmprrlqhmrrwzqlsezbg.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRtcHJybHFobXJyd3pxbHNlemJnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDc4ODAzNDEsImV4cCI6MjA2MzQ1NjM0MX0.Uol0S3a8o_VRuTbvZMn4kuk2dDp-pj_7tgU-lOsigxM';

const supabase = createClient(supabaseUrl, supabaseKey);

exports.handler = async (event) => {
  // Solo acepta POST
  if (event.httpMethod !== 'POST') {
    return { 
      statusCode: 405, 
      body: JSON.stringify({ error: 'Método no permitido' }) 
    };
  }

  try {
    const { videoUrl, redirectUrl = '' } = JSON.parse(event.body);
    
    // Validación .mp4
    if (!videoUrl.endsWith('.mp4')) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'La URL debe terminar en .mp4' })
      };
    }

    const id = Math.random().toString(36).substring(2, 7);

    // Inserta en Supabase
    const { error } = await supabase
      .from('urls')
      .insert({ 
        id,
        video_url: videoUrl,
        redirect_url: redirectUrl 
      });

    if (error) throw error;

    return {
      statusCode: 200,
      body: JSON.stringify({ id }),
      headers: { 'Content-Type': 'application/json' }
    };

  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ 
        error: 'Error al generar URL',
        details: error.message 
      })
    };
  }
};
