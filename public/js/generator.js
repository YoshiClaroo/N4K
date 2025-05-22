document.getElementById('generateBtn').addEventListener('click', async () => {
  const btn = document.getElementById('generateBtn')
  const resultDiv = document.getElementById('result')
  const videoUrl = document.getElementById('videoUrl').value.trim()
  const redirectUrl = document.getElementById('redirectUrl').value.trim() || ''

  // Reset UI
  btn.disabled = true
  btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Generando...'
  resultDiv.style.display = 'none'

  try {
    // Validación frontend
    if (!videoUrl.endsWith('.mp4')) {
      throw new Error('La URL debe terminar en .mp4')
    }

    const response = await fetch('/.netlify/functions/api', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ videoUrl, redirectUrl })
    })

    const data = await response.json()

    if (!response.ok) {
      throw new Error(data.error || 'Error desconocido')
    }

    if (!data.id) {
      throw new Error('La API no devolvió un ID válido')
    }

    // Muestra resultado
    const generatedUrl = `https://n4k.netlify.app/${data.id}`
    document.getElementById('generatedUrl').value = generatedUrl
    resultDiv.style.display = 'block'

    // Configura copiado
    document.getElementById('copyBtn').onclick = () => {
      navigator.clipboard.writeText(generatedUrl)
        .then(() => alert('URL copiada!'))
        .catch(() => alert('Error al copiar'))
    }

  } catch (error) {
    console.error('Error completo:', error)
    alert(`Error: ${error.message}`)
  } finally {
    btn.innerHTML = '<i class="fas fa-link"></i> Generar URL'
    btn.disabled = false
  }
})
