# N4K URL Generator

Generador de URLs para videos .mp4 con redirección inteligente.

## Características
- Genera URLs cortas (ej: `n4k.netlify.app/d73j2`)
- Valida que la URL del video sea .mp4
- Redirección opcional al hacer clic/finalizar video
- Base de datos en MongoDB Atlas
- Despliegue automático en Netlify

## Configuración
1. **MongoDB Atlas**:
   - Crea un cluster gratuito y obtén tu `connection string`.
   - Crea una colección llamada `urls`.

2. **Variables de entorno** (Netlify):
   - `MONGODB_URI`: Tu connection string de Atlas.

3. **Netlify Functions**:
   - Las funciones están en `netlify/functions/api.js`.

## Estructura de archivos
