// ============================================
// Video Downloader Pro - Script Principal
// 100% Funcional para iPhone
// ============================================

// 🔥 MONETAG DIRECT LINK - PEGA AQUÍ TU DIRECT LINK 🔥
const MONETAG_DIRECT_LINK = 'https://example.monetag.com/direct-link';

let adRefreshInterval;
let adRefreshCount = 0;
let deferredPrompt = null;

// Inicializar la aplicación
document.addEventListener('DOMContentLoaded', function() {
    console.log('Video Downloader Pro inicializando...');
    
    // Referencias a elementos DOM
    const downloadBtn = document.getElementById('downloadBtn');
    const videoUrlInput = document.getElementById('videoUrl');
    const pasteBtn = document.getElementById('pasteBtn');
    const loadingSpinner = document.getElementById('loadingSpinner');
    const resultDiv = document.getElementById('result');
    const progressBar = document.getElementById('progressBar');
    const installPWA = document.getElementById('installPWA');
    const installBtn = document.getElementById('installBtn');
    
    // Iniciar auto-refresh de anuncios
    startAdAutoRefresh();
    
    // Configurar ejemplos de URLs
    setupUrlExamples();
    
    // ============================================
    // FUNCIÓN DE PEGADO AUTOMÁTICO
    // ============================================
    pasteBtn.addEventListener('click', async function() {
        try {
            const text = await navigator.clipboard.readText();
            if (text && (text.includes('http://') || text.includes('https://'))) {
                videoUrlInput.value = text;
                showNotification('¡URL pegada correctamente!', 'success');
            } else {
                showNotification('No se encontró un enlace válido en el portapapeles', 'error');
            }
        } catch (error) {
            console.error('Error al pegar:', error);
            showNotification('No se pudo acceder al portapapeles', 'error');
        }
    });
    
    // ============================================
    // FUNCIÓN DE DESCARGA REAL
    // ============================================
    downloadBtn.addEventListener('click', async function() {
        const url = videoUrlInput.value.trim();
        
        // Validar URL
        if (!url || !isValidUrl(url)) {
            showNotification('Por favor, pega un enlace válido', 'error');
            videoUrlInput.focus();
            return;
        }
        
        // Mostrar spinner de carga
        downloadBtn.disabled = true;
        loadingSpinner.classList.remove('hidden');
        resultDiv.classList.add('hidden');
        
        // Animar barra de progreso
        animateProgressBar();
        
        console.log('Iniciando descarga para URL:', url);
        
        // Esperar 3 segundos para maximizar tiempo en pantalla
        setTimeout(() => {
            // 🔥 PASO 1: Abrir Direct Link de Monetag en nueva pestaña
            openMonetagDirectLink();
            
            // 🔥 PASO 2: Redirigir a savefrom.net para descarga real
            setTimeout(() => {
                const saveFromUrl = `https://en.savefrom.net/#url=${encodeURIComponent(url)}`;
                console.log('Redirigiendo a:', saveFromUrl);
                window.location.href = saveFromUrl;
            }, 100);
            
            // Mostrar resultado (por si el usuario cancela la redirección)
            loadingSpinner.classList.add('hidden');
            resultDiv.classList.remove('hidden');
            downloadBtn.disabled = false;
            
            // Registrar conversión
            logConversion('download_started', url);
            
        }, 3000); // 3 segundos de retención
    });
    
    // ============================================
    // FUNCIÓN DE AUTO-REFRESH DE ANUNCIOS
    // ============================================
    function startAdAutoRefresh() {
        // Refrescar inmediatamente
        refreshAdBanner();
        refreshAdBannerBottom();
        
        // Configurar intervalo para refrescar cada 30 segundos
        adRefreshInterval = setInterval(() => {
            adRefreshCount++;
            console.log(`Refrescando anuncios (#${adRefreshCount})`);
            
            refreshAdBanner();
            refreshAdBannerBottom();
            
            // Registrar refresco para analytics
            if (adRefreshCount % 5 === 0) {
                logConversion('ad_refresh_batch', adRefreshCount);
            }
            
        }, 30000); // 30 segundos
        
        console.log('Auto-refresh de anuncios iniciado (30s)');
    }
    
    function refreshAdBanner() {
        const adBanner = document.getElementById('ad-banner');
        if (!adBanner) return;
        
        // Limpiar y mostrar placeholder
        adBanner.innerHTML = `
            <div class="text-center">
                <div class="spinner mx-auto mb-3"></div>
                <p class="text-gray-400 text-sm">Actualizando anuncio...</p>
                <p class="text-xs text-gray-500 mt-1">Refresco #${adRefreshCount + 1}</p>
            </div>
        `;
        
        // Simular carga de anuncio
        setTimeout(() => {
            adBanner.innerHTML = `
                <div class="text-center">
                    <div class="w-12 h-12 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-3">
                        <svg class="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path>
                        </svg>
                    </div>
                    <p class="text-gray-300 text-sm">Anuncio optimizado</p>
                    <p class="text-xs text-gray-500 mt-1">Se actualizará en 30 segundos</p>
                </div>
            `;
        }, 800);
    }
    
    function refreshAdBannerBottom() {
        const adBannerBottom = document.getElementById('ad-banner-bottom');
        if (!adBannerBottom) return;
        
        // Similar lógica para el banner inferior
        setTimeout(() => {
            adBannerBottom.innerHTML = `
                <div class="text-center">
                    <p class="text-gray-300 text-sm">Espacio publicitario</p>
                    <p class="text-xs text-gray-500 mt-1">Anuncio seguro y relevante</p>
                </div>
            `;
        }, 1200);
    }
    
    // ============================================
    // FUNCIONES DE APOYO
    // ============================================
    function setupUrlExamples() {
        const examples = [
            'https://www.tiktok.com/@example/video/123456789',
            'https://www.instagram.com/reel/ABC123DEF456/',
            'https://www.youtube.com/shorts/XYZ789ABC012',
            'https://www.facebook.com/watch/?v=123456789012345'
        ];
        
        let currentExample = 0;
        
        // Rotar ejemplos cada 8 segundos
        setInterval(() => {
            if (!videoUrlInput.value) {
                videoUrlInput.placeholder = examples[currentExample];
                currentExample = (currentExample + 1) % examples.length;
            }
        }, 8000);
    }
    
    function animateProgressBar() {
        let progress = 0;
        const interval = setInterval(() => {
            progress += 1;
            progressBar.style.width = `${progress}%`;
            
            if (progress >= 100) {
                clearInterval(interval);
            }
        }, 30); // 3 segundos total
    }
    
    function openMonetagDirectLink() {
        // 🔥 ABRE EL DIRECT LINK DE MONETAG EN NUEVA PESTAÑA
        const monetagWindow = window.open(MONETAG_DIRECT_LINK, '_blank');
        
        if (monetagWindow) {
            console.log('Monetag Direct Link abierto en nueva pestaña');
            
            // Cerrar la ventana después de 5 segundos (opcional)
            setTimeout(() => {
                try {
                    monetagWindow.close();
                } catch (e) {
                    // Algunos navegadores no permiten cerrar ventanas que no abriste
                }
            }, 5000);
        }
    }
    
    function isValidUrl(string) {
        try {
            const url = new URL(string);
            return url.protocol === 'http:' || url.protocol === 'https:';
        } catch (_) {
            return false;
        }
    }
    
    function showNotification(message, type = 'info') {
        // Crear notificación toast
        const toast = document.createElement('div');
        toast.className = `fixed top-4 left-1/2 transform -translate-x-1/2 z-50 px-6 py-3 rounded-xl shadow-xl transition-all duration-300 ${
            type === 'success' ? 'bg-green-900/90 text-green-100' :
            type === 'error' ? 'bg-red-900/90 text-red-100' :
            'bg-slate-900/90 text-slate-100'
        }`;
        toast.textContent = message;
        toast.style.backdropFilter = 'blur(10px)';
        
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
    
    function logConversion(event, data = '') {
        // Registrar evento para analytics
        console.log(`[Conversion] ${event}: ${data}`);
        
        // Aquí puedes agregar píxeles de conversión
        const conversionPixel = new Image();
        conversionPixel.src = `https://tracking.example.com/conversion?event=${encodeURIComponent(event)}&data=${encodeURIComponent(data)}&ref=${encodeURIComponent(document.referrer)}`;
        conversionPixel.style.display = 'none';
        document.body.appendChild(conversionPixel);
    }
    
    // ============================================
    // PWA INSTALLATION HANDLER
    // ============================================
    window.addEventListener('beforeinstallprompt', (e) => {
        e.preventDefault();
        deferredPrompt = e;
        
        // Mostrar botón de instalación después de 10 segundos
        setTimeout(() => {
            if (deferredPrompt && !isRunningStandalone()) {
                installPWA.classList.remove('hidden');
            }
        }, 10000);
    });
    
    installBtn.addEventListener('click', async () => {
        if (!deferredPrompt) return;
        
        deferredPrompt.prompt();
        const { outcome } = await deferredPrompt.userChoice;
        
        if (outcome === 'accepted') {
            console.log('PWA instalada por el usuario');
            installPWA.classList.add('hidden');
            showNotification('¡App instalada correctamente!', 'success');
        }
        
        deferredPrompt = null;
    });
    
    window.addEventListener('appinstalled', () => {
        console.log('PWA instalada');
        installPWA.classList.add('hidden');
        deferredPrompt = null;
        logConversion('pwa_installed');
    });
    
    function isRunningStandalone() {
        return window.matchMedia('(display-mode: standalone)').matches || 
               window.navigator.standalone === true;
    }
    
    // ============================================
    // OFFLINE DETECTION
    // ============================================
    window.addEventListener('online', () => {
        showNotification('Conectado a internet', 'success');
        // Reiniciar auto-refresh si estaba pausado
        if (!adRefreshInterval) {
            startAdAutoRefresh();
        }
    });
    
    window.addEventListener('offline', () => {
        showNotification('Estás sin conexión', 'error');
        // Pausar auto-refresh
        if (adRefreshInterval) {
            clearInterval(adRefreshInterval);
            adRefreshInterval = null;
        }
    });
    
    // ============================================
    // REGISTRAR SERVICE WORKER
    // ============================================
    if ('serviceWorker' in navigator) {
        window.addEventListener('load', () => {
            navigator.serviceWorker.register('./sw.js')
                .then(registration => {
                    console.log('Service Worker registrado:', registration.scope);
                    
                    // Verificar actualizaciones
                    registration.addEventListener('updatefound', () => {
                        const newWorker = registration.installing;
                        console.log('Nueva versión del Service Worker encontrada');
                        
                        newWorker.addEventListener('statechange', () => {
                            if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                                showNotification('¡Nueva versión disponible! Recarga para actualizar.', 'info');
                            }
                        });
                    });
                })
                .catch(error => {
                    console.error('Error registrando Service Worker:', error);
                });
        });
    }
    
    // Registrar visita inicial
    setTimeout(() => {
        logConversion('page_loaded', window.location.href);
    }, 2000);
    
    console.log('Video Downloader Pro inicializado correctamente');
});

// Manejar eventos de visibilidad
document.addEventListener('visibilitychange', function() {
    if (document.hidden) {
        console.log('Página oculta - Pausando anuncios');
        if (adRefreshInterval) {
            clearInterval(adRefreshInterval);
            adRefreshInterval = null;
        }
    } else {
        console.log('Página visible - Reanudando anuncios');
        if (!adRefreshInterval) {
            startAdAutoRefresh();
        }
    }
});

// Manejar errores globales
window.addEventListener('error', function(e) {
    console.error('Error global:', e.error);
    logConversion('error_occurred', e.error.message);
});