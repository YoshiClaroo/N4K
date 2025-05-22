const { createClient } = require('@supabase/supabase-js');

// Configuración (usa variables de entorno en producción)
const supabaseUrl = 'https://dmprrlqhmrrwzqlsezbg.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRtcHJybHFobXJyd3pxbHNlemJnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDc4ODAzNDEsImV4cCI6MjA2MzQ1NjM0MX0.Uol0S3a8o_VRuTbvZMn4kuk2dDp-pj_7tgU-lOsigxM';

const supabase = createClient(supabaseUrl, supabaseKey);

exports.handler = async (event) => {
  // 1. Validación del método HTTP
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Solo se permiten solicitudes POST' }),
      headers: { 'Content-Type': 'application/json' }
    };
  }

  try {
    // 2. Parseo y validación de datos
    const { videoUrl, redirectUrl = '' } = JSON.parse(event.body);
    
    if (!videoUrl || typeof videoUrl !== 'string' || !videoUrl.endsWith('.mp4')) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'Se requiere una URL válida terminada en .mp4' }),
        headers: { 'Content-Type': 'application/json' }
      };
    }

    // 3. Generación de ID
    const id = Math.random().toString(36).substring(2, 9); // Ej: "abc1234"

    // 4. Inserción en Supabase (versión mejorada)
    const { data, error } = await supabase
      .from('urls')
      .insert([{
        id,
        video_url: videoUrl,
        redirect_url: redirectUrl
      }])
      .select('id'); // Solicita explícitamente el campo id de vuelta

    // 5. Manejo de errores de Supabase
    if (error) {
      console.error('Error de Supabase:', error);
      throw new Error('Error al guardar en la base de datos');
    }

    // 6. Verificación de datos devueltos
    if (!data || !Array.isArray(data) || !data[0]?.id) {
      throw new Error('La base de datos no devolvió un ID válido');
    }

    // 7. Respuesta exitosa
    return {
      statusCode: 200,
      body: JSON.stringify({ id: data[0].id }),
      headers: { 'Content-Type': 'application/json' }
    };

  } catch (error) {
    // 8. Manejo centralizado de errores
    console.error('Error completo:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ 
        error: 'Error al procesar la solicitud',
        details: error.message 
      }),
      headers: { 'Content-Type': 'application/json' }
    };
  }
};
