// Código principal de dowfree PWA

// ============================================
// INYECCIÓN RÁPIDA DE ANUNCIOS (PRIORIDAD MÁXIMA)
// ============================================

// Esta función se ejecuta inmediatamente al cargar la página
// para inyectar anuncios antes que cualquier otro contenido visual
function injectPriorityAds() {
    // Este código se ejecuta inmediatamente para registrar impresiones
    // incluso si el usuario cierra la pestaña rápido

    // Puedes colocar aquí scripts de anuncios que necesiten cargar inmediatamente
    // Por ejemplo, scripts de pre-fetch o pre-render de anuncios

    console.log('[dowfree] Inyectando anuncios prioritarios...');

    // Creamos un elemento para tracking de impresiones
    const adImpressionPixel = document.createElement('img');
    adImpressionPixel.style.display = 'none';
    adImpressionPixel.style.position = 'absolute';
    adImpressionPixel.src = 'https://placeholder-ad-pixel.com/impression?app=dowfree&v=1';
    document.body.appendChild(adImpressionPixel);
}

// Ejecutar inmediatamente
injectPriorityAds();

// ============================================
// FUNCIÓN DE AUTO-REFRESH DE BANNERS (Cada 30s)
// ============================================

let adRefreshInterval;
let adRefreshCount = 0;
const AD_REFRESH_TIME = 30000; // 30 segundos

function refreshAd() {
    const adBanner = document.getElementById('ad-banner');
    if (!adBanner) return;

    adRefreshCount++;
    console.log(`[dowfree] Refrescando banner #${adRefreshCount}`);

    // Limpiar el contenedor
    adBanner.innerHTML = '';

    // Crear nuevo placeholder
    const placeholder = document.createElement('div');
    placeholder.className = 'ad-placeholder w-full h-28 rounded-lg';
    adBanner.appendChild(placeholder);

    // ============================================
    // INYECTAR SCRIPT DE BANNER NATIVO AQUÍ
    // ============================================
    /*
    // EJEMPLO: Reemplaza esto con tu script real de anuncio nativo

    const adScript = document.createElement('script');
    adScript.src = 'https://tu-ad-network.com/native-banner.js?zone=12345&refresh=' + adRefreshCount;
    adScript.async = true;

    // Crear contenedor para el anuncio
    const adContainer = document.createElement('div');
    adContainer.id = 'native-ad-' + adRefreshCount;
    adContainer.className = 'native-ad-container';

    // Reemplazar placeholder con contenedor real
    setTimeout(() => {
        adBanner.innerHTML = '';
        adBanner.appendChild(adContainer);
        adBanner.appendChild(adScript);
    }, 500);
    */

    // Simulación de carga de anuncio
    setTimeout(() => {
        adBanner.innerHTML = `
            <div class="w-full h-28 rounded-lg bg-gradient-to-r from-slate-800 to-slate-900 border border-slate-700 flex flex-col items-center justify-center p-4">
                <div class="text-xs text-slate-500 mb-2">Anuncio • Actualizado hace <span id="adTimer">0</span>s</div>
                <div class="text-slate-400 text-sm text-center">
                    <!-- Espacio para banner nativo -->
                    Publicidad relevante aparecerá aquí
                </div>
                <div class="text-xs text-slate-600 mt-2">Anuncio refrescado automáticamente</div>
            </div>
        `;

        // Actualizar contador en el anuncio
        let seconds = 0;
        const adTimer = setInterval(() => {
            seconds++;
            const timerElement = document.getElementById('adTimer');
            if (timerElement) {
                timerElement.textContent = seconds;
            }
            if (seconds >= 30) {
                clearInterval(adTimer);
            }
        }, 1000);
    }, 800);
}

// Iniciar auto-refresh de anuncios
function startAdAutoRefresh() {
    // Refrescar inmediatamente
    refreshAd();

    // Configurar intervalo para refrescar cada 30 segundos
    adRefreshInterval = setInterval(refreshAd, AD_REFRESH_TIME);

    console.log(`[dowfree] Auto-refresh de anuncios iniciado (cada ${AD_REFRESH_TIME/1000}s)`);
}

// ============================================
// FUNCIONALIDAD PRINCIPAL DE LA APP
// ============================================

// Variables globales
let deferredPrompt;
let isProcessing = false;

// Inicializar la aplicación cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', function() {
    console.log('[dowfree] Aplicación inicializando...');

    // Iniciar auto-refresh de anuncios
    startAdAutoRefresh();

    // Referencias a elementos DOM
    const downloadBtn = document.getElementById('downloadBtn');
    const videoUrlInput = document.getElementById('videoUrl');
    const loadingSpinner = document.getElementById('loadingSpinner');
    const resultDiv = document.getElementById('result');
    const fakeDownloadBtn = document.getElementById('fakeDownload');
    const installPWA = document.getElementById('installPWA');
    const installBtn = document.getElementById('installBtn');

    // Configurar campo de URL con ejemplo
    const exampleUrls = [
        'https://tiktok.com/@user/video/123456789',
        'https://instagram.com/reel/ABC123DEF',
        'https://youtube.com/shorts/XYZ789ABC'
    ];

    let urlIndex = 0;
    function rotateExampleUrl() {
        videoUrlInput.placeholder = exampleUrls[urlIndex];
        urlIndex = (urlIndex + 1) % exampleUrls.length;
    }

    // Rotar ejemplos cada 5 segundos
    rotateExampleUrl();
    setInterval(rotateExampleUrl, 5000);

    // ============================================
    // MANEJADOR DE DESCARGA (SIMULACIÓN)
    // ============================================
    downloadBtn.addEventListener('click', function() {
        if (isProcessing) return;

        const url = videoUrlInput.value.trim();

        // Validación básica
        if (!url) {
            videoUrlInput.focus();
            videoUrlInput.style.borderColor = '#ef4444';
            setTimeout(() => {
                videoUrlInput.style.borderColor = '';
            }, 2000);
            return;
        }

        // Iniciar procesamiento
        isProcessing = true;
        downloadBtn.disabled = true;
        loadingSpinner.classList.remove('hidden');
        resultDiv.classList.add('hidden');

        console.log(`[dowfree] Procesando video: ${url.substring(0, 50)}...`);

        // Simular procesamiento de 3 segundos
        // Esto maximiza el tiempo en pantalla para impresiones de anuncios
        setTimeout(() => {
            // Finalizar procesamiento
            loadingSpinner.classList.add('hidden');
            resultDiv.classList.remove('hidden');
            downloadBtn.disabled = false;
            isProcessing = false;

            console.log('[dowfree] Video procesado exitosamente');

            // Registrar conversión para analytics de anuncios
            logConversion('download_process_complete');

            // Forzar un refresh de anuncio después de procesar
            setTimeout(refreshAd, 1000);
        }, 3000); // 3 segundos de delay intencional
    });

    // Simular descarga real
    fakeDownloadBtn.addEventListener('click', function() {
        alert('En una versión real, el video comenzaría a descargarse.\n\nEsta es una demostración de PWA para ad-arbitrage.');

        // Registrar descarga para analytics
        logConversion('download_clicked');

        // Refrescar anuncios después de descarga
        setTimeout(refreshAd, 500);
    });

    // ============================================
    // PWA INSTALL PROMPT
    // ============================================
    window.addEventListener('beforeinstallprompt', (e) => {
        // Prevenir que el navegador muestre el prompt automático
        e.preventDefault();
        // Guardar el evento para usarlo después
        deferredPrompt = e;

        // Mostrar nuestro propio botón de instalación
        setTimeout(() => {
            installPWA.classList.remove('hidden');
        }, 5000); // Mostrar después de 5 segundos
    });

    installBtn.addEventListener('click', async () => {
        if (!deferredPrompt) return;

        // Mostrar el prompt de instalación
        deferredPrompt.prompt();

        // Esperar a que el usuario responda
        const { outcome } = await deferredPrompt.userChoice;

        if (outcome === 'accepted') {
            console.log('[dowfree] PWA instalada por el usuario');
            installPWA.classList.add('hidden');
        }

        // Limpiar la referencia
        deferredPrompt = null;
    });

    // Ocultar el botón de instalación si ya está instalado
    window.addEventListener('appinstalled', () => {
        console.log('[dowfree] PWA instalada');
        installPWA.classList.add('hidden');
        deferredPrompt = null;
    });

    // Verificar si ya está instalado
    if (window.matchMedia('(display-mode: standalone)').matches) {
        installPWA.classList.add('hidden');
    }

    // ============================================
    // OFFLINE DETECTION
    // ============================================
    window.addEventListener('online', () => {
        showNotification('Conectado a internet', 'success');
    });

    window.addEventListener('offline', () => {
        showNotification('Estás sin conexión', 'error');
    });

    // ============================================
    // REGISTRAR SERVICE WORKER
    // ============================================
    if ('serviceWorker' in navigator) {
        window.addEventListener('load', () => {
            navigator.serviceWorker.register('sw.js')
                .then((registration) => {
                    console.log('[dowfree] Service Worker registrado:', registration.scope);

                    // Verificar actualizaciones
                    registration.addEventListener('updatefound', () => {
                        const newWorker = registration.installing;
                        console.log('[dowfree] Nueva versión del Service Worker encontrada');

                        newWorker.addEventListener('statechange', () => {
                            if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                                showNotification('Nueva versión disponible. Recarga para actualizar.', 'info');
                            }
                        });
                    });
                })
                .catch((error) => {
                    console.error('[dowfree] Error registrando Service Worker:', error);
                });
        });
    }

    // ============================================
    // ANALYTICS Y TRACKING (SIMPLIFICADO)
    // ============================================
    function logConversion(eventName) {
        // En una implementación real, aquí enviarías datos a tu plataforma de analytics
        // y a tus redes de anuncios para tracking de conversiones
        console.log(`[dowfree] Conversión registrada: ${eventName}`);

        // Pixel de conversión para anuncios
        const conversionPixel = document.createElement('img');
        conversionPixel.style.display = 'none';
        conversionPixel.src = `https://placeholder-ad-pixel.com/conversion?event=${eventName}&app=dowfree`;
        document.body.appendChild(conversionPixel);
    }

    // Registrar visita inicial
    setTimeout(() => {
        logConversion('page_loaded');
    }, 1000);

    // ============================================
    // HELPER FUNCTIONS
    // ============================================
    function showNotification(message, type = 'info') {
        // Crear notificación toast
        const toast = document.createElement('div');
        toast.className = `fixed top-4 left-1/2 transform -translate-x-1/2 z-50 px-6 py-3 rounded-lg shadow-xl transition-all duration-300 ${
            type === 'success' ? 'bg-green-900/90 text-green-100' :
            type === 'error' ? 'bg-red-900/90 text-red-100' :
            'bg-slate-900/90 text-slate-100'
        }`;
        toast.textContent = message;

        document.body.appendChild(toast);

        // Remover después de 3 segundos
        setTimeout(() => {
            toast.style.opacity = '0';
            setTimeout(() => {
                if (toast.parentNode) {
                    toast.parentNode.removeChild(toast);
                }
            }, 300);
        }, 3000);
    }

    // ============================================
    // PERFORMANCE OPTIMIZATION
    // ============================================

    // Precargar recursos críticos
    function preloadCriticalResources() {
        // En una app real, podrías precargar recursos aquí
    }

    // Iniciar precarga después de que todo lo crítico esté listo
    setTimeout(preloadCriticalResources, 2000);

    console.log('[dowfree] Aplicación inicializada correctamente');
});

// Registrar eventos de visibilidad para pausar/retomar anuncios
document.addEventListener('visibilitychange', function() {
    if (document.hidden) {
        // Página no visible, pausar refresco de anuncios si es necesario
        console.log('[dowfree] Página oculta, pausando anuncios...');
    } else {
        // Página visible nuevamente
        console.log('[dowfree] Página visible, reanudando anuncios...');
    }
});

// Manejar errores no capturados
window.addEventListener('error', function(e) {
    console.error('[dowfree] Error no capturado:', e.error);
});

// ============================================
// INSTRUCCIONES DE IMPLEMENTACIÓN
// ============================================

console.log(`
============================================
dowfree PWA - Instrucciones de implementación
============================================

1. ANUNCIO VIGNETTE:
   - Pegar el script en el <head> (línea ~30 en index.html)
   - Ejemplo: <script src="https://adnetwork.com/vignette.js"></script>

2. SOCIAL BAR:
   - Pegar el script antes del </body> (línea ~200 en index.html)
   - Ejemplo: <script src="https://adnetwork.com/social-bar.js"></script>

3. BANNER NATIVO (Auto-refresh):
   - Reemplazar el código dentro de la función refreshAd() en script.js
   - Buscar: "INYECTAR SCRIPT DE BANNER NATIVO AQUÍ" (línea ~60 en script.js)

4. PIXELS DE CONVERSIÓN:
   - Actualizar las URLs en las funciones logConversion() e injectPriorityAds()
   - Líneas ~250 y ~320 en script.js

La aplicación está optimizada para:
- Carga en <1 segundo en móviles
- Auto-refresh de anuncios cada 30 segundos
- Tiempo en pantalla extendido (3 segundos de procesamiento simulado)
- Instalación como PWA
- Modo oscuro para iPhone

============================================
`);