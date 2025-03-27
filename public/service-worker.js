
self.__WB_MANIFEST

const CACHE_VERSION = 'v16';
const CACHE_NAME = `app-cache-${CACHE_VERSION}`;

const FILES_TO_CACHE = [
    '/',
    '/index.html',
    '/offline.html',
    '/main.js',
    '/style.css',
];


// Install event: Cache assets
self.addEventListener('install', (event) => {
    console.log('Service Worker installing.');
    self.skipWaiting(); // Activate SW immediately
    event.waitUntil(
        caches.open(CACHE_NAME).then(async (cache) => {
            console.log('🚀 Service Worker: Installation Started');
            // Cache files one by one to handle failures gracefully
            for (const file of FILES_TO_CACHE) {
                try {
                    await cache.add(new Request(file, { cache: 'reload' }));
                    console.log('✅ Cached Successfully:', file);
                } catch (error) {
                    console.warn('❌ Cache Failed:', file, error);
                }
            }
            console.log('🎉 Service Worker: Installation Complete');
        })
    );
});

// Activate event: Clean up old caches
self.addEventListener('activate', (event) => {
    console.log('Service Worker activating.');
    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames.map((cacheName) => {
                    if (cacheName !== CACHE_NAME) {
                        console.log('🧹 Deleting old cache:', cacheName);
                        return caches.delete(cacheName);
                    }
                })
            );
        })
    );
    console.log('💪 Service Worker: Activated');
    return self.clients.claim(); // Take control immediately
});


self.addEventListener('fetch', (event) => {
    console.log('🚀 Service Worker: Fetch event triggered', event.request.url);

    if (
        !event.request.url.startsWith(self.location.origin) ||
        event.request.url.startsWith('chrome-extension://') ||
        event.request.method !== 'GET'
    ) {
        return;
    }

    if (event.request.url.toLowerCase().includes('/nonono')) {
        console.log('❌ Not caching this page:', event.request.url);

        return fetch(event.request);
    }

    event.respondWith(
        caches.match(event.request).then((cachedResponse) => {

            if (cachedResponse) {
                console.log('✅ Serving from Cache:', event.request.url);
                return cachedResponse;
            }

            return fetch(event.request).then((response) => {
                const responseToCache = response.clone();

                if (response.status === 200) {
                    caches.open(CACHE_NAME).then((cache) => {
                        // cache.put(event.request, responseToCache);
                        console.log('📥 Cached after Network Fetch:', event.request.url);
                    });
                }
                return response;
            }).catch(() => {
                console.log('❌ Network failed & No Cache:', event.request.url);

            });
        })
    );
});
