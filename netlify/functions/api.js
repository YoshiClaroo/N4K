const { createClient } = require('@supabase/supabase-js');

// Configuración con tus credenciales
const supabaseUrl = 'https://dmprrlqhmrrwzqlsezbg.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRtcHJybHFobXJyd3pxbHNlemJnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDc4ODAzNDEsImV4cCI6MjA2MzQ1NjM0MX0.Uol0S3a8o_VRuTbvZMn4kuk2dDp-pj_7tgU-lOsigxM';

const supabase = createClient(supabaseUrl, supabaseKey);

exports.handler = async (event) => {
  console.log('Evento recibido:', JSON.stringify(event, null, 2));

  try {
    // 1. Validación del método
    if (event.httpMethod !== 'POST') {
      throw { status: 405, message: 'Método no permitido' };
    }

    // 2. Parseo del cuerpo
    const { videoUrl, redirectUrl = '' } = JSON.parse(event.body);
    console.log('Datos recibidos:', { videoUrl, redirectUrl });

    // 3. Validación de datos
    if (!videoUrl?.match(/\.mp4($|\?)/i)) {
      throw { status: 400, message: 'La URL debe ser un archivo .mp4 válido' };
    }

    // 4. Generación de ID
    const id = generateId();
    console.log('ID generado:', id);

    // 5. Inserción en Supabase (con verificación)
    const { data, error } = await supabase
      .from('urls')
      .insert([{
        id,
        video_url: videoUrl,
        redirect_url: redirectUrl
      }])
      .select('id, video_url')  // Solicita datos de retorno
      .single();  // Espera un solo registro

    console.log('Respuesta de Supabase:', { data, error });

    if (error || !data?.id) {
      throw { 
        status: 500, 
        message: error?.message || 'No se recibió ID de Supabase'
      };
    }

    // 6. Respuesta exitosa
    return {
      statusCode: 200,
      body: JSON.stringify({ id: data.id }),
      headers: { 
        'Content-Type': 'application/json',
        'Cache-Control': 'no-cache'
      }
    };

  } catch (error) {
    console.error('Error capturado:', error);
    return {
      statusCode: error.status || 500,
      body: JSON.stringify({
        error: error.message || 'Error interno del servidor',
        details: process.env.NODE_ENV === 'development' ? error.stack : undefined
      }),
      headers: { 'Content-Type': 'application/json' }
    };
  }
};

// Función mejorada para generar IDs
function generateId() {
  return Date.now().toString(36) + Math.random().toString(36).substring(2, 8);
}
