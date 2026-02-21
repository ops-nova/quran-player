const CACHE_NAME = 'quran-player-v2'; // আগের ভার্সন থেকে এক বাড়িয়ে দিন (যেমন v4 থাকলে v5)

// যে ফাইলগুলো অফলাইনে দেখাবে
const urlsToCache = [
  './',
  './index.html',
  './manifest.json',
  './icon.jpg'
];

// ১. ফাইলগুলো ক্যাশ করা
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Caching files...');
        return cache.addAll(urlsToCache);
      })
      .then(() => self.skipWaiting())
  );
});

// ২. পুরনো ক্যাশ মুছে ফেলা
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheName !== CACHE_NAME) {
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

// ৩. অফলাইন সাপোর্ট (নেটওয়ার্ক না থাকলে ক্যাশ থেকে আনা)
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        // যদি ক্যাশে ফাইল থাকে তবে সেটি দাও, নাহলে নেট থেকে আনো
        return response || fetch(event.request).catch(() => {
          // যদি নেটও না থাকে এবং ফাইলটিও ক্যাশে না থাকে (যেমন অডিও ফাইল)
          return caches.match('./index.html');
        });
      })
  );
});
