document.getElementById('generateBtn').addEventListener('click', async function() {
  const elements = {
    btn: this,
    videoInput: document.getElementById('videoUrl'),
    redirectInput: document.getElementById('redirectUrl'),
    resultDiv: document.getElementById('result'),
    loading: document.getElementById('loading'),
    generatedUrl: document.getElementById('generatedUrl'),
    copyBtn: document.getElementById('copyBtn')
  };

  // 1. Reset y validación UI
  resetUI(elements);
  if (!validateInputs(elements)) return;

  try {
    // 2. Llamada a la API
    const response = await callApi(elements);
    
    // 3. Procesar respuesta
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Error en el servidor');
    }

    const { id } = await response.json();
    if (!id) throw new Error('La respuesta no contiene un ID válido');

    // 4. Mostrar resultado
    showResult(elements, id);
    
  } catch (error) {
    handleError(error, elements);
  } finally {
    finalizeUI(elements);
  }
});

// Funciones auxiliares
function resetUI({ btn, resultDiv, loading }) {
  btn.disabled = true;
  btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Generando...';
  resultDiv.style.display = 'none';
  loading.style.display = 'block';
}

function validateInputs({ videoInput }) {
  const url = videoInput.value.trim();
  if (!url.match(/\.mp4($|\?)/i)) {
    alert('❌ La URL debe terminar en .mp4');
    videoInput.focus();
    return false;
  }
  return true;
}

async function callApi({ videoInput, redirectInput }) {
  return fetch('/.netlify/functions/api', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ 
      videoUrl: videoInput.value.trim(),
      redirectUrl: redirectInput.value.trim() || ''
    })
  });
}

function showResult(elements, id) {
  const fullUrl = `https://n4k.netlify.app/${id}`;
  elements.generatedUrl.value = fullUrl;
  elements.resultDiv.style.display = 'block';
  
  elements.copyBtn.onclick = () => {
    navigator.clipboard.writeText(fullUrl)
      .then(() => alert('✅ URL copiada!'))
      .catch(() => alert('❌ Error al copiar'));
  };
}

function handleError(error, { videoInput }) {
  console.error('Error:', error);
  videoInput.focus();
  alert(`Error: ${error.message}`);
}

function finalizeUI({ btn, loading }) {
  btn.innerHTML = '<i class="fas fa-link"></i> Generar URL';
  btn.disabled = false;
  loading.style.display = 'none';
  }
