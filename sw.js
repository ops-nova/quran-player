const CACHE_NAME = 'quran-player-v3'; // আপনি যখনই কোডে বড় কোনো পরিবর্তন করবেন, এই v3 কে v4 বা v5 করে দেবেন।
const urlsToCache = [
  '/',
  '/index.html',
  '/manifest.json',
  '/icon.jpg'
];

// ১. ফাইলগুলো ক্যাশ (Save) করা
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Opened cache');
        return cache.addAll(urlsToCache);
      })
      .then(() => self.skipWaiting()) // নতুন আপডেট থাকলে সাথে সাথে এক্টিভেট করবে
  );
});

// ২. পুরনো বা ফালতু ক্যাশ ডিলিট করা (যাতে স্টোরেজ জ্যাম না হয়)
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheName !== CACHE_NAME) {
            console.log('Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => self.clients.claim()) // সব ওপেন থাকা পেজকে নতুন আপডেটে নিয়ে যাবে
  );
});

// ৩. ইন্টারনেট না থাকলে ক্যাশ থেকে ফাইল দেখানো (Offline Support)
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        // ক্যাশ করা ফাইল থাকলে সেটি দেবে, না থাকলে ইন্টারনেট থেকে আনবে
        return response || fetch(event.request);
      })
  );
});
