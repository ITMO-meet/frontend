/* public/sw.js */
/* global clients */

self.addEventListener('install', event => {
    console.log('[SW] Installed');
    self.skipWaiting();
});

self.addEventListener('activate', event => {
    console.log('[SW] Activated');
    event.waitUntil(clients.claim());
});

self.addEventListener('push', event => {
    console.log('[SW] Push event received');
    let data = {};
    if (event.data) {
        try {
            data = event.data.json();
            console.log('[SW] Push data:', data);
        } catch (error) {
            console.error('[SW] Error parsing push data:', error);
        }
    } else {
        console.log('[SW] No push data received.');
    }
    const title = data.title || 'Новое сообщение';
    const options = {
        body: data.body || 'У вас новое сообщение.',
        icon: data.icon || '/logo192.png',
        badge: data.badge || '/badge.png',
        data: data
    };

    event.waitUntil(
        Promise.all([
            self.registration.showNotification(title, options),
            clients.matchAll({ includeUncontrolled: true, type: 'window' }).then(clientList => {
                console.log('[SW] Sending message to clients');
                for (const client of clientList) {
                    client.postMessage(data);
                }
            })
        ])
    );
});

self.addEventListener('notificationclick', event => {
    event.notification.close();
    event.waitUntil(
        clients.matchAll({ type: 'window', includeUncontrolled: true }).then(clientList => {
            for (const client of clientList) {
                if (client.url && 'focus' in client) {
                    return client.focus();
                }
            }
            if (clients.openWindow) {
                const urlToOpen = event.notification.data.chatUrl || '/';
                return clients.openWindow(urlToOpen);
            }
        })
    );
});
