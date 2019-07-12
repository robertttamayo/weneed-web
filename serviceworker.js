self.addEventListener('install', function(event) {
    self.skipWaiting();
    console.log('Install Complete', event);
});

self.addEventListener('activate', function(event) {
    console.log('Activation Successful', event);
});

self.addEventListener('push', function(event) {
    console.log('Push Detected', event);
});
