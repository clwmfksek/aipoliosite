// 서비스 워커 버전 (업데이트 시 변경)
const CACHE_VERSION = 'v1.0.0';
const STATIC_CACHE = `static-cache-${CACHE_VERSION}`;
const DYNAMIC_CACHE = `dynamic-cache-${CACHE_VERSION}`;
const IMAGE_CACHE = `image-cache-${CACHE_VERSION}`;

// 캐시할 정적 자원들
const STATIC_ASSETS = [
  '/',
  '/favicon.svg',
  // CSS와 JS는 빌드 시 해시가 포함되므로 동적으로 캐시
];

// 캐시 전략별 URL 패턴
const CACHE_STRATEGIES = {
  // 정적 자원: Cache First
  static: [/\.(css|js|woff2?|ttf|eot)$/, /\/favicon\./],

  // 이미지: Cache First with fallback
  images: [/\.(jpg|jpeg|png|gif|webp|avif|svg)$/],

  // HTML: Network First
  html: [
    /\.html$/,
    /^(?!.*\.).*$/, // Extension이 없는 경로 (SPA 라우팅)
  ],

  // API: Network First with timeout
  api: [/\/api\//],
};

// 서비스 워커 설치
self.addEventListener('install', event => {
  console.log('서비스 워커 설치 중...');

  event.waitUntil(
    caches
      .open(STATIC_CACHE)
      .then(cache => {
        console.log('정적 자원 캐싱 중...');
        return cache.addAll(STATIC_ASSETS);
      })
      .then(() => {
        console.log('서비스 워커 설치 완료');
        // 새 버전 즉시 활성화
        return self.skipWaiting();
      })
      .catch(error => {
        console.error('서비스 워커 설치 실패:', error);
      })
  );
});

// 서비스 워커 활성화
self.addEventListener('activate', event => {
  console.log('서비스 워커 활성화 중...');

  event.waitUntil(
    Promise.all([
      // 이전 버전 캐시 정리
      caches.keys().then(cacheNames => {
        return Promise.all(
          cacheNames
            .filter(name => {
              return name.includes('cache') && !name.includes(CACHE_VERSION);
            })
            .map(name => {
              console.log('이전 캐시 삭제:', name);
              return caches.delete(name);
            })
        );
      }),

      // 모든 클라이언트에서 새 서비스 워커 활성화
      self.clients.claim(),
    ])
      .then(() => {
        console.log('서비스 워커 활성화 완료');
      })
      .catch(error => {
        console.error('서비스 워커 활성화 실패:', error);
      })
  );
});

// 네트워크 요청 가로채기
self.addEventListener('fetch', event => {
  const { request } = event;
  const url = new URL(request.url);

  // HTTPS 요청만 처리
  if (url.protocol !== 'https:' && url.hostname !== 'localhost') {
    return;
  }

  // 요청 유형에 따른 캐시 전략 적용
  if (isStaticAsset(request.url)) {
    event.respondWith(cacheFirstStrategy(request, STATIC_CACHE));
  } else if (isImage(request.url)) {
    event.respondWith(imageStrategy(request));
  } else if (isHTML(request.url)) {
    event.respondWith(networkFirstStrategy(request));
  } else if (isAPI(request.url)) {
    event.respondWith(networkFirstWithTimeoutStrategy(request));
  } else {
    // 기본 전략: Network First
    event.respondWith(networkFirstStrategy(request));
  }
});

// URL 패턴 검사 함수들
function isStaticAsset(url) {
  return CACHE_STRATEGIES.static.some(pattern => pattern.test(url));
}

function isImage(url) {
  return CACHE_STRATEGIES.images.some(pattern => pattern.test(url));
}

function isHTML(url) {
  return CACHE_STRATEGIES.html.some(pattern => pattern.test(url));
}

function isAPI(url) {
  return CACHE_STRATEGIES.api.some(pattern => pattern.test(url));
}

// 캐시 전략 구현

// Cache First: 캐시 우선, 없으면 네트워크
async function cacheFirstStrategy(request, cacheName) {
  try {
    const cache = await caches.open(cacheName);
    const cachedResponse = await cache.match(request);

    if (cachedResponse) {
      // 백그라운드에서 캐시 업데이트 (stale-while-revalidate)
      fetchAndCache(request, cacheName);
      return cachedResponse;
    }

    return await fetchAndCache(request, cacheName);
  } catch (error) {
    console.error('Cache First 전략 실패:', error);
    return new Response('네트워크 오류', { status: 503 });
  }
}

// 이미지 특화 전략: Cache First with WebP 변환
async function imageStrategy(request) {
  try {
    const cache = await caches.open(IMAGE_CACHE);
    const cachedResponse = await cache.match(request);

    if (cachedResponse) {
      return cachedResponse;
    }

    const response = await fetch(request);

    if (response.ok) {
      // 이미지만 캐시에 저장
      const contentType = response.headers.get('content-type');
      if (contentType && contentType.startsWith('image/')) {
        cache.put(request, response.clone());
      }
    }

    return response;
  } catch (error) {
    console.error('이미지 캐시 전략 실패:', error);
    // 기본 이미지 반환 (선택사항)
    return new Response('이미지를 불러올 수 없습니다', { status: 503 });
  }
}

// Network First: 네트워크 우선, 실패 시 캐시
async function networkFirstStrategy(request) {
  try {
    const response = await fetch(request);

    if (response.ok) {
      const cache = await caches.open(DYNAMIC_CACHE);
      cache.put(request, response.clone());
    }

    return response;
  } catch (error) {
    console.log('네트워크 요청 실패, 캐시에서 찾는 중...', request.url);

    const cache = await caches.open(DYNAMIC_CACHE);
    const cachedResponse = await cache.match(request);

    if (cachedResponse) {
      return cachedResponse;
    }

    // HTML 요청이고 캐시도 없으면 오프라인 페이지 반환
    if (request.headers.get('accept')?.includes('text/html')) {
      return new Response(
        `
        <!DOCTYPE html>
        <html>
        <head>
          <title>오프라인</title>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1">
          <style>
            body { font-family: system-ui, sans-serif; text-align: center; padding: 2rem; }
            .offline { max-width: 400px; margin: 0 auto; }
          </style>
        </head>
        <body>
          <div class="offline">
            <h1>오프라인입니다</h1>
            <p>인터넷 연결을 확인하고 다시 시도해주세요.</p>
            <button onclick="location.reload()">다시 시도</button>
          </div>
        </body>
        </html>
      `,
        {
          headers: { 'Content-Type': 'text/html' },
        }
      );
    }

    return new Response('오프라인 상태입니다', { status: 503 });
  }
}

// Network First with Timeout: 빠른 응답을 위한 타임아웃 설정
async function networkFirstWithTimeoutStrategy(request, timeout = 3000) {
  try {
    const response = await Promise.race([
      fetch(request),
      new Promise((_, reject) => setTimeout(() => reject(new Error('Timeout')), timeout)),
    ]);

    if (response.ok) {
      const cache = await caches.open(DYNAMIC_CACHE);
      cache.put(request, response.clone());
    }

    return response;
  } catch (error) {
    console.log('네트워크 타임아웃, 캐시에서 찾는 중...', request.url);

    const cache = await caches.open(DYNAMIC_CACHE);
    const cachedResponse = await cache.match(request);

    if (cachedResponse) {
      return cachedResponse;
    }

    return new Response('서비스를 일시적으로 사용할 수 없습니다', {
      status: 503,
      headers: { 'Content-Type': 'text/plain' },
    });
  }
}

// 보조 함수: 요청을 가져와서 캐시에 저장
async function fetchAndCache(request, cacheName) {
  const response = await fetch(request);

  if (response.ok) {
    const cache = await caches.open(cacheName);
    cache.put(request, response.clone());
  }

  return response;
}

// 캐시 크기 관리 (선택사항)
async function cleanupCache(cacheName, maxItems = 50) {
  const cache = await caches.open(cacheName);
  const keys = await cache.keys();

  if (keys.length > maxItems) {
    // 오래된 항목부터 삭제
    const itemsToDelete = keys.slice(0, keys.length - maxItems);
    await Promise.all(itemsToDelete.map(key => cache.delete(key)));
  }
}

// 주기적 캐시 정리 (10분마다)
setInterval(
  () => {
    cleanupCache(DYNAMIC_CACHE, 50);
    cleanupCache(IMAGE_CACHE, 100);
  },
  10 * 60 * 1000
);
