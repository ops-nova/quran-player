const CACHE_NAME = 'quran-player-v1'; // যখনই ইন্ডেক্স ফাইলে বড় বদল করবেন, এটি v11, v12 করবেন।
const OFFLINE_AUDIO_CACHE = 'quran-offline-cache'; // এটি কখনোই ডিলিট হবে না।

const urlsToCache = [
  './',
  './index.html',
  './manifest.json',
  './icon.jpg'
];

// ইনস্টল ইভেন্ট
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(urlsToCache))
      .then(() => self.skipWaiting())
  );
});

// এক্টিভেট ইভেন্ট - পুরনো ক্যাশ মোছা কিন্তু সুরা ক্যাশ রাখা
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          // যদি ক্যাশটি বর্তমান ভার্সন না হয় এবং এটি সুরার ক্যাশও না হয়, তবেই ডিলিট করো
          if (cacheName !== CACHE_NAME && cacheName !== OFFLINE_AUDIO_CACHE) {
            console.log('Deleting old app cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

// ফেচ ইভেন্ট - অফলাইন সাপোর্ট
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        // যদি ক্যাশে (অ্যাপ বা সুরা) থাকে তবে দাও, নাহলে নেট থেকে আনো
        return response || fetch(event.request);
      })
  );
});
