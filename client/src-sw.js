importScripts('https://storage.googleapis.com/workbox-cdn/releases/6.0.2/workbox-sw.js');

workbox.setConfig({ modulePathPrefix: "workbox-v6.0.2/" });


// workbox.routing.registerRoute(
//     new RegExp('http://localhost:4000/(.*)'),
//     workbox.strategies.cacheFirst()
// );


const precacheManifest = [injectionPoint];

workbox.precaching.precacheAndRoute(precacheManifest);