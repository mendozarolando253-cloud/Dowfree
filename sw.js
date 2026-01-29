// ============================================
// Service Worker para Video Downloader Pro
// Optimizado para GitHub Pages y iPhone
// ============================================

const CACHE_NAME = 'video-downloader-v2.0';
const CACHE_FILES = [
  './',
  './index.html',
  './manifest.json',
  './script.js',
  './icon-192.png',
  './icon-512.png'
];

// Instalación del Service Worker
self.addEventListener('install', event => {
  console.log('[Service Worker] Instalando...');
  
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('[Service Worker] Cacheando archivos esenciales');
        return cache.addAll(CACHE_FILES);
      })
      .then(() => {
        console.log('[Service Worker] Instalación completada');
        return self.skipWaiting();
      })
      .catch(error => {
        console.error('[Service Worker] Error en instalación:', error);
      })
  );
});

// Activación y limpieza de caches antiguas
self.addEventListener('activate', event => {
  console.log('[Service Worker] Activando...');
  
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheName !== CACHE_NAME) {
            console.log('[Service Worker] Eliminando cache antigua:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
    .then(() => {
      console.log('[Service Worker] Activación completada');
      return self.clients.claim();
    })
  );
});

// Estrategia: Cache First para recursos estáticos
self.addEventListener('fetch', event => {
  // Excluir anuncios y píxeles de tracking
  if (event.request.url.includes('monetag') || 
      event.request.url.includes('adnetwork') ||
      event.request.url.includes('doubleclick') ||
      event.request.url.includes('analytics')) {
    return;
  }
  
  // Para archivos HTML, usa Network First
  if (event.request.headers.get('accept').includes('text/html')) {
    event.respondWith(
      fetch(event.request)
        .then(response => {
          // Verificar que la respuesta sea válida
          if (!response || response.status !== 200 || response.type !== 'basic') {
            return response;
          }
          
          // Clonar la respuesta para cachear
          const responseToCache = response.clone();
          
          caches.open(CACHE_NAME)
            .then(cache => {
              cache.put(event.request, responseToCache);
            });
          
          return response;
        })
        .catch(() => {
          // Si falla la red, intentar servir desde cache
          return caches.match(event.request)
            .then(cachedResponse => {
              if (cachedResponse) {
                return cachedResponse;
              }
              // Si no hay en cache, servir la página offline
              return caches.match('./index.html');
            });
        })
    );
    return;
  }
  
  // Para otros recursos (CSS, JS, imágenes), usa Cache First
  event.respondWith(
    caches.match(event.request)
      .then(cachedResponse => {
        if (cachedResponse) {
          return cachedResponse;
        }
        
        return fetch(event.request)
          .then(response => {
            // No cachear respuestas no exitosas
            if (!response || response.status !== 200 || response.type !== 'basic') {
              return response;
            }
            
            const responseToCache = response.clone();
            
            caches.open(CACHE_NAME)
              .then(cache => {
                cache.put(event.request, responseToCache);
              });
            
            return response;
          })
          .catch(error => {
            console.error('[Service Worker] Error fetching:', error);
          });
      })
  );
});

// Manejar mensajes desde la aplicación
self.addEventListener('message', event => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});

// Manejo de notificaciones push
self.addEventListener('push', event => {
  const options = {
    body: event.data.text(),
    icon: './icon-192.png',
    badge: './icon-192.png',
    vibrate: [100, 50, 100],
    data: {
      dateOfArrival: Date.now(),
      primaryKey: '2'
    },
    actions: [
      {
        action: 'explore',
        title: 'Abrir app',
        icon: './icon-192.png'
      }
    ]
  };
  
  event.waitUntil(
    self.registration.showNotification('Video Downloader Pro', options)
  );
});

// Manejo de clics en notificaciones
self.addEventListener('notificationclick', event => {
  console.log('[Service Worker] Notificación clickeada');
  
  event.notification.close();
  
  event.waitUntil(
    clients.matchAll({type: 'window', includeUncontrolled: true})
      .then(clientList => {
        // Buscar si ya hay una ventana abierta
        for (const client of clientList) {
          if (client.url === './index.html' && 'focus' in client) {
            return client.focus();
          }
        }
        // Si no hay ventana abierta, abrir una nueva
        if (clients.openWindow) {
          return clients.openWindow('./index.html');
        }
      })
  );
});

// Manejo de sincronización en segundo plano
self.addEventListener('sync', event => {
  if (event.tag === 'sync-downloads') {
    console.log('[Service Worker] Sincronización en segundo plano');
    // Aquí podrías sincronizar datos cuando haya conexión
  }
});