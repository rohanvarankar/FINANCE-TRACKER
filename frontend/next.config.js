const withPWA = require("next-pwa")({
  dest: "public",
  register: true,
  skipWaiting: true,
  clientsClaim: true, // 🔥 take control immediately

  // 🔥 Disable aggressive caching for dynamic content
  runtimeCaching: [
    {
      urlPattern: /^https?.*/, // all API + pages
      handler: "NetworkFirst", // always try fresh network first
      options: {
        cacheName: "network-cache",
        expiration: {
          maxEntries: 50,
          maxAgeSeconds: 60 * 60, // 1 hour
        },
      },
    },
  ],

  // 🔥 Important for dev
  disable: process.env.NODE_ENV === "development",
});

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,

  // Required for Next 16
  turbopack: {},
};

module.exports = withPWA(nextConfig);
