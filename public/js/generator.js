document.getElementById('generateBtn').addEventListener('click', async () => {
    const videoUrl = document.getElementById('videoUrl').value.trim();
    const redirectUrl = document.getElementById('redirectUrl').value.trim();

    if (!videoUrl.endsWith('.mp4')) {
        alert("¡La URL debe terminar en .mp4!");
        return;
    }

    try {
        const response = await fetch('/.netlify/functions/api', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ videoUrl, redirectUrl })
        });

        const data = await response.json();

        // Verifica si la respuesta incluye el ID
        if (!data.id) {
            throw new Error("No se recibió un ID válido");
        }

        const generatedUrl = `https://n4k.netlify.app/${data.id}`;
        document.getElementById('generatedUrl').value = generatedUrl;
        document.getElementById('result').style.display = 'block';

        document.getElementById('copyBtn').addEventListener('click', () => {
            navigator.clipboard.writeText(generatedUrl);
            alert("¡URL copiada!");
        });

    } catch (error) {
        alert(`Error: ${error.message}`);
        console.error("Detalles del error:", error);
    }
});
