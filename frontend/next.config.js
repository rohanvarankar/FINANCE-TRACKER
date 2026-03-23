const withPWA = require("next-pwa")({
  dest: "public",
  register: true,
  skipWaiting: true,
  disable: process.env.NODE_ENV === "development",
});

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,

  // ✅ REQUIRED for Next 16
  turbopack: {},  // <-- THIS FIXES ERROR
};

module.exports = withPWA(nextConfig);