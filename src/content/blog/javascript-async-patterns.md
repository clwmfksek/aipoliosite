---
title: 'JavaScript 비동기 프로그래밍 완벽 가이드: Promise부터 최신 패턴까지'
description: 'JavaScript의 비동기 처리 방법과 최신 패턴들을 실전 예제와 함께 알아봅니다'
excerpt: '콜백 헬부터 최신 async/await, 그리고 고급 패턴까지 JavaScript 비동기 프로그래밍의 모든 것을 체계적으로 다룹니다.'
date: 2024-11-01
updated: 2024-11-10
author: 'Portfolio Owner'
category: 'development'
tags: ['javascript', 'async', 'promise', 'async-await', 'performance', 'patterns']
image: './images/js-async-hero.jpg'
imageAlt: 'JavaScript asynchronous programming flow visualization'
draft: false
featured: true
published: true
readTime: 20
seo:
  title: 'JavaScript 비동기 프로그래밍 완벽 가이드 - Promise, async/await 마스터하기'
  description: 'JavaScript 비동기 처리의 모든 것: 콜백부터 최신 패턴까지 실전 예제로 배우는 완벽 가이드'
  noIndex: false
social:
  twitter: 'javascript_async_programming_guide'
  linkedin: 'mastering-javascript-asynchronous-patterns'
---

# JavaScript 비동기 프로그래밍 완벽 가이드: Promise부터 최신 패턴까지

JavaScript의 비동기 프로그래밍은 현대 웹 개발의 핵심입니다. 사용자 경험을 해치지 않으면서도 복잡한 작업을 처리하는 방법을 체계적으로 알아보겠습니다.

## 🎯 비동기 프로그래밍이 필요한 이유

JavaScript는 단일 스레드 언어입니다. 하지만 웹 애플리케이션에서는:

- API 호출
- 파일 읽기/쓰기
- 타이머 설정
- DOM 이벤트 처리
- 데이터베이스 쿼리

등의 작업이 동시에 일어나야 합니다. 이를 위해 비동기 처리가 필수적입니다.

## 📈 비동기 처리의 진화

### 1. 콜백 함수 (Callbacks)

```javascript
// 전통적인 콜백 방식
function loadUser(userId, callback) {
  setTimeout(() => {
    const user = { id: userId, name: `User ${userId}` };
    callback(null, user);
  }, 1000);
}

function loadPosts(userId, callback) {
  setTimeout(() => {
    const posts = [
      { id: 1, title: 'Post 1', userId },
      { id: 2, title: 'Post 2', userId },
    ];
    callback(null, posts);
  }, 800);
}

// 콜백 헬 (Callback Hell)
loadUser(1, (userErr, user) => {
  if (userErr) {
    console.error('사용자 로드 실패:', userErr);
    return;
  }

  loadPosts(user.id, (postsErr, posts) => {
    if (postsErr) {
      console.error('포스트 로드 실패:', postsErr);
      return;
    }

    posts.forEach(post => {
      loadComments(post.id, (commentsErr, comments) => {
        if (commentsErr) {
          console.error('댓글 로드 실패:', commentsErr);
          return;
        }

        // 더 깊은 중첩...
        console.log('댓글:', comments);
      });
    });
  });
});
```

### 2. Promise 패턴

```javascript
// Promise로 개선
function loadUser(userId) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (userId > 0) {
        resolve({ id: userId, name: `User ${userId}` });
      } else {
        reject(new Error('잘못된 사용자 ID'));
      }
    }, 1000);
  });
}

function loadPosts(userId) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const posts = [
        { id: 1, title: 'Post 1', userId },
        { id: 2, title: 'Post 2', userId },
      ];
      resolve(posts);
    }, 800);
  });
}

function loadComments(postId) {
  return new Promise(resolve => {
    setTimeout(() => {
      const comments = [
        { id: 1, text: 'Great post!', postId },
        { id: 2, text: 'Thanks for sharing', postId },
      ];
      resolve(comments);
    }, 500);
  });
}

// Promise 체이닝
loadUser(1)
  .then(user => {
    console.log('사용자 로드됨:', user);
    return loadPosts(user.id);
  })
  .then(posts => {
    console.log('포스트 로드됨:', posts);
    // 모든 포스트의 댓글을 병렬로 로드
    return Promise.all(posts.map(post => loadComments(post.id)));
  })
  .then(commentsArrays => {
    console.log('모든 댓글 로드됨:', commentsArrays);
  })
  .catch(error => {
    console.error('오류 발생:', error);
  });
```

### 3. Async/Await (ES2017)

```javascript
// 동기 코드처럼 읽히는 비동기 코드
async function loadUserData(userId) {
  try {
    // 순차적 실행
    const user = await loadUser(userId);
    console.log('사용자 로드됨:', user);

    const posts = await loadPosts(user.id);
    console.log('포스트 로드됨:', posts);

    // 병렬 실행
    const commentsArrays = await Promise.all(posts.map(post => loadComments(post.id)));
    console.log('모든 댓글 로드됨:', commentsArrays);

    return {
      user,
      posts,
      comments: commentsArrays.flat(),
    };
  } catch (error) {
    console.error('오류 발생:', error);
    throw error;
  }
}

// 사용법
(async () => {
  const userData = await loadUserData(1);
  console.log('완성된 데이터:', userData);
})();
```

## 🔄 고급 비동기 패턴

### 1. 병렬 vs 순차 실행

```javascript
// 순차 실행 (느림)
async function sequentialExecution() {
  console.time('순차 실행');

  const user1 = await loadUser(1); // 1초 대기
  const user2 = await loadUser(2); // 추가 1초 대기
  const user3 = await loadUser(3); // 추가 1초 대기

  console.timeEnd('순차 실행'); // ~3초
  return [user1, user2, user3];
}

// 병렬 실행 (빠름)
async function parallelExecution() {
  console.time('병렬 실행');

  const [user1, user2, user3] = await Promise.all([loadUser(1), loadUser(2), loadUser(3)]);

  console.timeEnd('병렬 실행'); // ~1초
  return [user1, user2, user3];
}

// 제한된 동시 실행
async function limitedParallelExecution(userIds, concurrency = 2) {
  const results = [];

  for (let i = 0; i < userIds.length; i += concurrency) {
    const batch = userIds.slice(i, i + concurrency);
    const batchResults = await Promise.all(batch.map(id => loadUser(id)));
    results.push(...batchResults);
  }

  return results;
}
```

### 2. 오류 처리 패턴

```javascript
// 개별 오류 처리
async function handleIndividualErrors() {
  const results = await Promise.allSettled([
    loadUser(1),
    loadUser(-1), // 오류 발생
    loadUser(3),
  ]);

  results.forEach((result, index) => {
    if (result.status === 'fulfilled') {
      console.log(`사용자 ${index + 1}:`, result.value);
    } else {
      console.error(`사용자 ${index + 1} 오류:`, result.reason);
    }
  });
}

// 재시도 로직
async function withRetry(asyncFn, maxRetries = 3, delay = 1000) {
  let lastError;

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      return await asyncFn();
    } catch (error) {
      lastError = error;

      if (attempt === maxRetries) {
        throw new Error(`${maxRetries}번 시도 후 실패: ${error.message}`);
      }

      console.log(`시도 ${attempt} 실패, ${delay}ms 후 재시도...`);
      await new Promise(resolve => setTimeout(resolve, delay));

      // 지수 백오프
      delay *= 2;
    }
  }
}

// 타임아웃 처리
function withTimeout(promise, timeoutMs) {
  const timeout = new Promise((_, reject) =>
    setTimeout(() => reject(new Error('시간 초과')), timeoutMs)
  );

  return Promise.race([promise, timeout]);
}

// 사용 예시
async function robustApiCall() {
  try {
    const result = await withTimeout(
      withRetry(() => loadUser(1), 3, 1000),
      5000
    );
    return result;
  } catch (error) {
    console.error('최종 실패:', error);
    throw error;
  }
}
```

### 3. 스트림 처리

```javascript
// 비동기 이터레이터
async function* generateUsers(count) {
  for (let i = 1; i <= count; i++) {
    // 실제로는 API 호출이나 DB 쿼리
    yield await loadUser(i);
  }
}

// 비동기 이터레이터 사용
async function processUsersStream() {
  for await (const user of generateUsers(5)) {
    console.log('처리 중인 사용자:', user);

    // 각 사용자를 개별적으로 처리
    await processUser(user);
  }
}

// 청크 단위 처리
async function processInChunks(items, chunkSize, processor) {
  const results = [];

  for (let i = 0; i < items.length; i += chunkSize) {
    const chunk = items.slice(i, i + chunkSize);
    const chunkResults = await Promise.all(chunk.map(item => processor(item)));
    results.push(...chunkResults);

    // 다음 청크 처리 전 잠시 대기 (API 레이트 리밋 고려)
    if (i + chunkSize < items.length) {
      await new Promise(resolve => setTimeout(resolve, 100));
    }
  }

  return results;
}
```

### 4. 캐싱과 메모이제이션

```javascript
// 비동기 메모이제이션
function asyncMemoize(fn, keyFn = (...args) => JSON.stringify(args)) {
  const cache = new Map();

  return async function (...args) {
    const key = keyFn(...args);

    if (cache.has(key)) {
      return cache.get(key);
    }

    try {
      const result = await fn(...args);
      cache.set(key, result);
      return result;
    } catch (error) {
      // 오류는 캐시하지 않음
      throw error;
    }
  };
}

// TTL(Time To Live) 캐시
function createTTLCache(ttl = 5 * 60 * 1000) {
  // 5분 기본값
  const cache = new Map();

  return {
    async get(key, factory) {
      const cached = cache.get(key);

      if (cached && Date.now() - cached.timestamp < ttl) {
        return cached.value;
      }

      const value = await factory();
      cache.set(key, {
        value,
        timestamp: Date.now(),
      });

      return value;
    },

    clear() {
      cache.clear();
    },

    delete(key) {
      cache.delete(key);
    },
  };
}

// 사용 예시
const userCache = createTTLCache(10 * 60 * 1000); // 10분 캐시

async function getCachedUser(userId) {
  return userCache.get(`user:${userId}`, () => loadUser(userId));
}
```

## 🎪 실전 패턴과 활용 사례

### 1. API 클라이언트 구현

```javascript
class ApiClient {
  constructor(baseURL, options = {}) {
    this.baseURL = baseURL;
    this.defaultOptions = {
      timeout: 10000,
      retries: 3,
      retryDelay: 1000,
      ...options,
    };
  }

  async request(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;
    const requestOptions = {
      ...this.defaultOptions,
      ...options,
    };

    return this.executeWithRetry(
      () => this.executeWithTimeout(fetch(url, requestOptions), requestOptions.timeout),
      requestOptions.retries,
      requestOptions.retryDelay
    );
  }

  async executeWithTimeout(promise, timeout) {
    const timeoutPromise = new Promise((_, reject) =>
      setTimeout(() => reject(new Error('Request timeout')), timeout)
    );

    const response = await Promise.race([promise, timeoutPromise]);

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    return response.json();
  }

  async executeWithRetry(asyncFn, maxRetries, delay) {
    let lastError;

    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        return await asyncFn();
      } catch (error) {
        lastError = error;

        if (attempt === maxRetries || !this.shouldRetry(error)) {
          break;
        }

        await this.delay(delay * Math.pow(2, attempt - 1)); // 지수 백오프
      }
    }

    throw lastError;
  }

  shouldRetry(error) {
    // 네트워크 오류나 5xx 서버 오류만 재시도
    return (
      error.message.includes('timeout') ||
      error.message.includes('500') ||
      error.message.includes('502') ||
      error.message.includes('503')
    );
  }

  delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  // 편의 메서드들
  async get(endpoint, params = {}) {
    const query = new URLSearchParams(params).toString();
    const url = query ? `${endpoint}?${query}` : endpoint;
    return this.request(url, { method: 'GET' });
  }

  async post(endpoint, data) {
    return this.request(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
  }

  async put(endpoint, data) {
    return this.request(endpoint, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
  }

  async delete(endpoint) {
    return this.request(endpoint, { method: 'DELETE' });
  }
}

// 사용 예시
const api = new ApiClient('https://api.example.com');

async function getUserWithPosts(userId) {
  try {
    const [user, posts] = await Promise.all([
      api.get(`/users/${userId}`),
      api.get(`/users/${userId}/posts`),
    ]);

    return { user, posts };
  } catch (error) {
    console.error('데이터 로드 실패:', error);
    throw error;
  }
}
```

### 2. 워커 풀 패턴

```javascript
class WorkerPool {
  constructor(workerScript, poolSize = navigator.hardwareConcurrency || 4) {
    this.workerScript = workerScript;
    this.poolSize = poolSize;
    this.workers = [];
    this.taskQueue = [];
    this.busyWorkers = new Set();

    this.initializeWorkers();
  }

  initializeWorkers() {
    for (let i = 0; i < this.poolSize; i++) {
      const worker = new Worker(this.workerScript);
      this.workers.push({
        id: i,
        worker,
        busy: false,
      });
    }
  }

  async execute(data, transferable = []) {
    return new Promise((resolve, reject) => {
      const task = { data, transferable, resolve, reject };

      const availableWorker = this.getAvailableWorker();
      if (availableWorker) {
        this.runTask(availableWorker, task);
      } else {
        this.taskQueue.push(task);
      }
    });
  }

  getAvailableWorker() {
    return this.workers.find(w => !w.busy);
  }

  runTask(workerInfo, task) {
    workerInfo.busy = true;
    this.busyWorkers.add(workerInfo.id);

    const messageHandler = event => {
      workerInfo.worker.removeEventListener('message', messageHandler);
      workerInfo.worker.removeEventListener('error', errorHandler);

      workerInfo.busy = false;
      this.busyWorkers.delete(workerInfo.id);

      task.resolve(event.data);
      this.processNextTask();
    };

    const errorHandler = error => {
      workerInfo.worker.removeEventListener('message', messageHandler);
      workerInfo.worker.removeEventListener('error', errorHandler);

      workerInfo.busy = false;
      this.busyWorkers.delete(workerInfo.id);

      task.reject(error);
      this.processNextTask();
    };

    workerInfo.worker.addEventListener('message', messageHandler);
    workerInfo.worker.addEventListener('error', errorHandler);

    workerInfo.worker.postMessage(task.data, task.transferable);
  }

  processNextTask() {
    if (this.taskQueue.length > 0) {
      const nextTask = this.taskQueue.shift();
      const availableWorker = this.getAvailableWorker();

      if (availableWorker) {
        this.runTask(availableWorker, nextTask);
      }
    }
  }

  async terminate() {
    await Promise.all(this.workers.map(({ worker }) => worker.terminate()));
  }
}

// worker.js 파일
self.addEventListener('message', async event => {
  const { type, data } = event.data;

  try {
    let result;

    switch (type) {
      case 'heavy-calculation':
        result = await performHeavyCalculation(data);
        break;
      case 'image-processing':
        result = await processImage(data);
        break;
      default:
        throw new Error(`알 수 없는 작업 타입: ${type}`);
    }

    self.postMessage({ success: true, result });
  } catch (error) {
    self.postMessage({ success: false, error: error.message });
  }
});

// 사용 예시
const workerPool = new WorkerPool('/worker.js', 4);

async function processLargeDataset(dataset) {
  const chunks = chunkArray(dataset, 1000);

  const results = await Promise.all(
    chunks.map(chunk =>
      workerPool.execute({
        type: 'heavy-calculation',
        data: chunk,
      })
    )
  );

  return results.flat();
}
```

### 3. 이벤트 기반 아키텍처

```javascript
class EventEmitter {
  constructor() {
    this.events = new Map();
  }

  on(event, listener) {
    if (!this.events.has(event)) {
      this.events.set(event, []);
    }
    this.events.get(event).push(listener);

    // 구독 해제 함수 반환
    return () => this.off(event, listener);
  }

  off(event, listener) {
    if (!this.events.has(event)) return;

    const listeners = this.events.get(event);
    const index = listeners.indexOf(listener);
    if (index > -1) {
      listeners.splice(index, 1);
    }
  }

  emit(event, ...args) {
    if (!this.events.has(event)) return;

    const listeners = this.events.get(event).slice();
    listeners.forEach(listener => {
      try {
        listener(...args);
      } catch (error) {
        console.error('이벤트 리스너 오류:', error);
      }
    });
  }

  async emitAsync(event, ...args) {
    if (!this.events.has(event)) return [];

    const listeners = this.events.get(event).slice();
    return Promise.all(
      listeners.map(async listener => {
        try {
          return await listener(...args);
        } catch (error) {
          console.error('비동기 이벤트 리스너 오류:', error);
          throw error;
        }
      })
    );
  }

  once(event, listener) {
    const onceWrapper = (...args) => {
      this.off(event, onceWrapper);
      listener(...args);
    };
    this.on(event, onceWrapper);
  }
}

// 데이터 스토어 예시
class DataStore extends EventEmitter {
  constructor() {
    super();
    this.data = new Map();
    this.loading = new Set();
  }

  async get(key) {
    if (this.data.has(key)) {
      return this.data.get(key);
    }

    if (this.loading.has(key)) {
      // 이미 로딩 중이면 완료될 때까지 대기
      return new Promise(resolve => {
        this.once(`loaded:${key}`, resolve);
      });
    }

    return this.load(key);
  }

  async load(key) {
    this.loading.add(key);
    this.emit('loading:start', key);

    try {
      // 실제 데이터 로딩 로직
      const data = await this.fetchData(key);

      this.data.set(key, data);
      this.loading.delete(key);

      this.emit('loading:complete', key, data);
      this.emit(`loaded:${key}`, data);

      return data;
    } catch (error) {
      this.loading.delete(key);
      this.emit('loading:error', key, error);
      throw error;
    }
  }

  async fetchData(key) {
    // 실제 API 호출이나 데이터베이스 쿼리
    return new Promise(resolve => {
      setTimeout(() => {
        resolve({ id: key, data: `Data for ${key}` });
      }, Math.random() * 1000);
    });
  }

  set(key, value) {
    this.data.set(key, value);
    this.emit('data:update', key, value);
  }

  delete(key) {
    const deleted = this.data.delete(key);
    if (deleted) {
      this.emit('data:delete', key);
    }
    return deleted;
  }
}

// 사용 예시
const store = new DataStore();

// 로딩 상태 모니터링
store.on('loading:start', key => {
  console.log(`${key} 로딩 시작`);
});

store.on('loading:complete', (key, data) => {
  console.log(`${key} 로딩 완료:`, data);
});

// 동시에 같은 데이터 요청 시 중복 로딩 방지
async function demonstrateCaching() {
  const promises = [
    store.get('user1'),
    store.get('user1'), // 중복 요청
    store.get('user1'), // 중복 요청
  ];

  const results = await Promise.all(promises);
  console.log('모든 결과가 동일함:', results);
}
```

## 🚀 성능 최적화 팁

### 1. 적절한 패턴 선택

```javascript
// ❌ 불필요한 순차 실행
async function inefficient() {
  const user = await getUser();
  const settings = await getSettings(); // user와 무관함
  const preferences = await getPreferences(); // 위 둘과 무관함

  return { user, settings, preferences };
}

// ✅ 적절한 병렬 실행
async function efficient() {
  const [user, settings, preferences] = await Promise.all([
    getUser(),
    getSettings(),
    getPreferences(),
  ]);

  return { user, settings, preferences };
}

// ✅ 의존성이 있는 경우 적절한 조합
async function smartExecution() {
  const user = await getUser();

  // user 정보가 필요한 것들을 병렬로
  const [posts, friends, notifications] = await Promise.all([
    getUserPosts(user.id),
    getUserFriends(user.id),
    getUserNotifications(user.id),
  ]);

  return { user, posts, friends, notifications };
}
```

### 2. 메모리 누수 방지

```javascript
// ❌ 메모리 누수 위험
class LeakyAsyncHandler {
  constructor() {
    this.abortController = new AbortController();
    this.cache = new Map();
  }

  async fetchData(url) {
    const response = await fetch(url, {
      signal: this.abortController.signal,
    });
    return response.json();
  }
}

// ✅ 적절한 정리
class ProperAsyncHandler {
  constructor() {
    this.abortController = new AbortController();
    this.cache = new Map();
    this.timers = new Set();
  }

  async fetchData(url) {
    // 캐시 확인
    if (this.cache.has(url)) {
      return this.cache.get(url);
    }

    try {
      const response = await fetch(url, {
        signal: this.abortController.signal,
      });
      const data = await response.json();

      // TTL 캐시
      this.cache.set(url, data);
      const timer = setTimeout(
        () => {
          this.cache.delete(url);
          this.timers.delete(timer);
        },
        5 * 60 * 1000
      ); // 5분

      this.timers.add(timer);

      return data;
    } catch (error) {
      if (error.name === 'AbortError') {
        console.log('요청이 취소됨');
        return null;
      }
      throw error;
    }
  }

  destroy() {
    // 진행 중인 요청 취소
    this.abortController.abort();

    // 타이머 정리
    this.timers.forEach(timer => clearTimeout(timer));
    this.timers.clear();

    // 캐시 정리
    this.cache.clear();
  }
}
```

## 📊 성능 모니터링

```javascript
class AsyncPerformanceMonitor {
  constructor() {
    this.metrics = new Map();
  }

  async measure(name, asyncFn) {
    const startTime = performance.now();
    const startMemory = performance.memory?.usedJSHeapSize || 0;

    try {
      const result = await asyncFn();
      const endTime = performance.now();
      const endMemory = performance.memory?.usedJSHeapSize || 0;

      this.recordMetric(name, {
        duration: endTime - startTime,
        memoryDelta: endMemory - startMemory,
        success: true,
      });

      return result;
    } catch (error) {
      const endTime = performance.now();

      this.recordMetric(name, {
        duration: endTime - startTime,
        success: false,
        error: error.message,
      });

      throw error;
    }
  }

  recordMetric(name, metric) {
    if (!this.metrics.has(name)) {
      this.metrics.set(name, []);
    }

    this.metrics.get(name).push({
      ...metric,
      timestamp: Date.now(),
    });
  }

  getStats(name) {
    const metrics = this.metrics.get(name) || [];
    if (metrics.length === 0) return null;

    const durations = metrics.map(m => m.duration);
    const successRate = metrics.filter(m => m.success).length / metrics.length;

    return {
      count: metrics.length,
      avgDuration: durations.reduce((a, b) => a + b, 0) / durations.length,
      minDuration: Math.min(...durations),
      maxDuration: Math.max(...durations),
      successRate: successRate * 100,
      recentMetrics: metrics.slice(-10),
    };
  }

  generateReport() {
    const report = {};

    this.metrics.forEach((_, name) => {
      report[name] = this.getStats(name);
    });

    return report;
  }
}

// 사용 예시
const monitor = new AsyncPerformanceMonitor();

async function monitoredApiCall() {
  return monitor.measure('api-call', async () => {
    const response = await fetch('/api/data');
    return response.json();
  });
}

// 정기적인 성능 리포트
setInterval(() => {
  console.log('성능 리포트:', monitor.generateReport());
}, 60000); // 1분마다
```

## 🎯 결론

JavaScript 비동기 프로그래밍의 핵심 원칙들:

- **적절한 패턴 선택**: 상황에 맞는 Promise, async/await 활용
- **병렬 처리 최적화**: 불필요한 순차 실행 제거
- **오류 처리**: 견고한 예외 처리와 재시도 로직
- **리소스 관리**: 메모리 누수 방지와 적절한 정리
- **성능 모니터링**: 지속적인 성능 측정과 개선

현대 웹 개발에서 비동기 처리는 선택이 아닌 필수입니다. 올바른 패턴을 사용하여 사용자 경험을 향상시키고, 애플리케이션의 성능과 안정성을 확보하세요! 🚀

## 📚 참고 자료

- [MDN Promise 가이드](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise)
- [JavaScript.info 비동기 프로그래밍](https://javascript.info/async)
- [Node.js Async Patterns](https://nodejs.org/en/docs/guides/blocking-vs-non-blocking/)
- [Web APIs 성능 가이드](https://web.dev/performance/)
