document.getElementById('generateBtn').addEventListener('click', async () => {
    const videoUrl = document.getElementById('videoUrl').value.trim();
    const redirectUrl = document.getElementById('redirectUrl').value.trim();
    
    // Validar que sea .mp4
    if (!videoUrl.endsWith('.mp4')) {
        alert("¡La URL del video debe terminar en .mp4!");
        return;
    }
    
    try {
        const response = await fetch('/.netlify/functions/api', {
            method: 'POST',
            body: JSON.stringify({ videoUrl, redirectUrl })
        });
        
        const data = await response.json();
        const generatedUrl = `https://n4k.netlify.app/${data.id}`;
        
        // Mostrar resultado
        document.getElementById('generatedUrl').value = generatedUrl;
        document.getElementById('result').style.display = 'block';
        
        // Botón copiar
        document.getElementById('copyBtn').addEventListener('click', () => {
            navigator.clipboard.writeText(generatedUrl);
            alert("¡URL copiada!");
        });
    } catch (error) {
        alert("Error al generar URL: " + error.message);
    }
});
