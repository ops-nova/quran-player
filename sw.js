const CACHE_NAME = 'quran-player-v3'; // আপডেট করলে শুধু এটি বদলাবেন
const OFFLINE_AUDIO_CACHE = 'quran-offline-cache'; // এটি কখনোই ডিলিট হবে না

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
      .then(cache => cache.addAll(urlsToCache))
      .then(() => self.skipWaiting())
  );
});

// ২. পুরনো ক্যাশ মুছে ফেলা কিন্তু অডিও ক্যাশ রাখা
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          // যদি ক্যাশটি বর্তমান ভার্সন না হয় এবং এটি অডিও ক্যাশও না হয়, তবেই ডিলিট করো
          if (cacheName !== CACHE_NAME && cacheName !== OFFLINE_AUDIO_CACHE) {
            console.log('Deleting old app cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

// ৩. অফলাইন সাপোর্ট
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        // প্রথমে ক্যাশে খোঁজো (অ্যাপ ফাইল বা অডিও ফাইল)
        if (response) return response;
        
        // না থাকলে নেট থেকে আনো
        return fetch(event.request);
      })
  );
});
