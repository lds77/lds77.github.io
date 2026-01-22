const CACHE_NAME = 'family-messenger-v1';
const urlsToCache = [
    './index.html',
    './styles.css',
    './app.js',
    './manifest.json'
];

// 설치 이벤트
self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then((cache) => {
                console.log('캐시 열림');
                return cache.addAll(urlsToCache);
            })
    );
});

// 활성화 이벤트
self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames.map((cacheName) => {
                    if (cacheName !== CACHE_NAME) {
                        console.log('오래된 캐시 삭제:', cacheName);
                        return caches.delete(cacheName);
                    }
                })
            );
        })
    );
});

// Fetch 이벤트
self.addEventListener('fetch', (event) => {
    event.respondWith(
        caches.match(event.request)
            .then((response) => {
                // 캐시에서 찾으면 반환, 없으면 네트워크 요청
                if (response) {
                    return response;
                }

                return fetch(event.request).then(
                    (response) => {
                        // 유효하지 않은 응답 확인
                        if (!response || response.status !== 200 || response.type !== 'basic') {
                            return response;
                        }

                        // 응답 복사
                        const responseToCache = response.clone();

                        caches.open(CACHE_NAME)
                            .then((cache) => {
                                cache.put(event.request, responseToCache);
                            });

                        return response;
                    }
                );
            })
            .catch(() => {
                // 오프라인일 때 기본 페이지 반환
                return caches.match('./index.html');
            })
    );
});

// 푸시 알림 (선택사항)
self.addEventListener('push', (event) => {
    const options = {
        body: event.data ? event.data.text() : '새 메시지가 도착했습니다.',
        icon: 'icons/icon-192x192.png',
        badge: 'icons/icon-72x72.png',
        vibrate: [200, 100, 200]
    };

    event.waitUntil(
        self.registration.showNotification('가족 메신저', options)
    );
});

// 알림 클릭 이벤트
self.addEventListener('notificationclick', (event) => {
    event.notification.close();

    event.waitUntil(
        clients.openWindow('./')
    );
});
