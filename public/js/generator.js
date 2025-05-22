document.getElementById('generateBtn').addEventListener('click', async function() {
  const btn = this;
  const videoInput = document.getElementById('videoUrl');
  const redirectInput = document.getElementById('redirectUrl');
  const resultDiv = document.getElementById('result');
  const loadingIndicator = document.getElementById('loading');
  const generatedUrlInput = document.getElementById('generatedUrl');
  const copyBtn = document.getElementById('copyBtn');

  // 1. Validación inicial
  const videoUrl = videoInput.value.trim();
  const redirectUrl = redirectInput.value.trim() || '';

  if (!videoUrl.endsWith('.mp4')) {
    alert('❌ La URL debe terminar en .mp4');
    videoInput.focus();
    return;
  }

  // 2. Estado de carga
  btn.disabled = true;
  btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Generando...';
  resultDiv.style.display = 'none';
  loadingIndicator.style.display = 'block';

  try {
    // 3. Llamada a la API
    const response = await fetch('/.netlify/functions/api', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
        videoUrl, 
        redirectUrl 
      })
    });

    // 4. Manejo de la respuesta
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Error en el servidor');
    }

    const { id } = await response.json();

    if (!id) {
      throw new Error('No se recibió un ID válido');
    }

    // 5. Mostrar resultado
    const fullUrl = `https://n4k.netlify.app/${id}`;
    generatedUrlInput.value = fullUrl;
    resultDiv.style.display = 'block';

    // 6. Configurar botón de copiar
    copyBtn.onclick = function() {
      navigator.clipboard.writeText(fullUrl)
        .then(() => alert('✅ URL copiada!'))
        .catch(() => alert('❌ No se pudo copiar'));
    };

  } catch (error) {
    // 7. Manejo de errores
    console.error('Error en generación:', error);
    alert(`Error: ${error.message}`);
    
  } finally {
    // 8. Restaurar UI
    btn.innerHTML = '<i class="fas fa-link"></i> Generar URL';
    btn.disabled = false;
    loadingIndicator.style.display = 'none';
  }
});
