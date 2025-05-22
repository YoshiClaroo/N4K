// Obtener ID de la URL (ej: n4k.netlify.app/d73j2 → "d73j2")
const id = window.location.pathname.split('/')[1];
let hasRedirected = false;

// Obtener datos de la API
fetch(`/.netlify/functions/api?id=${id}`)
    .then(response => response.json())
    .then(data => {
        if (!data.videoUrl) {
            window.location.href = "/404.html";
            return;
        }
        
        // Configurar video
        const player = document.getElementById('videoPlayer');
        player.src = data.videoUrl;
        
        // Redirigir al finalizar
        player.addEventListener('ended', () => {
            if (data.redirectUrl && !hasRedirected) {
                hasRedirected = true;
                window.open(data.redirectUrl, '_blank');
            }
        });
        
        // Redirigir al hacer clic en cualquier parte
        document.body.addEventListener('click', () => {
            if (data.redirectUrl && !hasRedirected) {
                hasRedirected = true;
                window.open(data.redirectUrl, '_blank');
            }
        });
    })
    .catch(() => window.location.href = "/404.html");
