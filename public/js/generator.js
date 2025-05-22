document.getElementById('generateBtn').addEventListener('click', async () => {
    const videoUrl = document.getElementById('videoUrl').value.trim();
    const redirectUrl = document.getElementById('redirectUrl').value.trim();

    if (!videoUrl.endsWith('.mp4')) {
        alert("¡La URL del video debe terminar en .mp4!");
        return;
    }

    try {
        const response = await fetch('/.netlify/functions/api', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ videoUrl, redirectUrl })
        });

        const data = await response.json(); // Parsear la respuesta como JSON

        if (!response.ok) {
            throw new Error(data.error || "Error al generar URL");
        }

        const generatedUrl = `https://n4k.netl
