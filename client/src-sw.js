importScripts('https://storage.googleapis.com/workbox-cdn/releases/6.0.2/workbox-sw.js');
import { registerRoute } from 'workbox-routing';
import { CacheFirst, StaleWhileRevalidate } from 'workbox-strategies';
import { CacheableResponsePlugin } from 'workbox-cacheable-response';

workbox.setConfig({ modulePathPrefix: "workbox-v6.0.2/" });
workbox.core.skipWaiting()
workbox.core.clientsClaim()

registerRoute(
    ({ url }) => url.origin === 'https://wassimmalleh.com' &&
        url.pathname.startsWith('/api/'),
    new StaleWhileRevalidate({
        cacheName: 'response-cache',
        plugins: [
            new CacheableResponsePlugin({
                statuses: [0, 201],
            })
        ]
    })
);

const precacheManifest = [injectionPoint];

workbox.precaching.precacheAndRoute(precacheManifest);