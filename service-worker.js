self.addEventListener('push', function(event) {
    const data = event.data.json();

    const options = {
        body: data.body,
        icon: 'icons/icon-192x192.png',
    };

    event.waitUntil(
        self.registration.showNotification(data.title, options)
    );
});
self.addEventListener('install', function(event) {
    event.waitUntil(
        caches.open('v1').then(function(cache) {
            return cache.addAll([
                '/',
                '/index.html',
                '/app.js',
                '/capa.jpg',
                'https://maxcdn.bootstrapcdn.com/bootstrap/4.5.2/css/bootstrap.min.css',
                'https://cdn.jsdelivr.net/npm/sweetalert2@11/dist/sweetalert2.min.css'
            ]).catch(function(error) {
                console.error('Falha ao adicionar ao cache:', error);
            });
        })
    );
});
