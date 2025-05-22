document.getElementById('generateBtn').addEventListener('click', async () => {
    const videoUrl = document.getElementById('videoUrl').value.trim();
    const redirectUrl = document.getElementById('redirectUrl').value.trim() || '';
    const resultDiv = document.getElementById('result');
    const generatedUrlInput = document.getElementById('generatedUrl');
    const copyBtn = document.getElementById('copyBtn');

    // Reset UI
    resultDiv.style.display = 'none';
    generatedUrlInput.value = '';
    copyBtn.onclick = null;

    // Validación .mp4
    if (!videoUrl.endsWith('.mp4')) {
        alert("❌ La URL debe terminar en .mp4");
        return;
    }

    try {
        // Muestra loader (opcional)
        document.getElementById('generateBtn').innerHTML = '<i class="fas fa-spinner fa-spin"></i> Generando...';

        const response = await fetch('/.netlify/functions/api', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ videoUrl, redirectUrl })
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.error || "Error en el servidor");
        }

        if (!data.id) {
            throw new Error("No se recibió un ID válido");
        }

        // Construye y muestra la URL
        const generatedUrl = `https://n4k.netlify.app/${data.id}`;
        generatedUrlInput.value = generatedUrl;
        resultDiv.style.display = 'block';

        // Configura el botón de copiar
        copyBtn.onclick = () => {
            navigator.clipboard.writeText(generatedUrl)
                .then(() => alert('✅ URL copiada al portapapeles'))
                .catch(() => alert('❌ Error al copiar'));
        };

    } catch (error) {
        console.error("Error completo:", error);
        alert(`⚠️ ${error.message}`);
    } finally {
        // Restaura el botón
        document.getElementById('generateBtn').innerHTML = '<i class="fas fa-link"></i> Generar URL';
    }
});
