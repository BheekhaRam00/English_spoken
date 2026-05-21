/** @type {import('next').NextConfig} */

const nextConfig = {
  reactStrictMode: true,

  poweredByHeader: false,

  compress: true,

  productionBrowserSourceMaps:
    false,

  eslint: {
    ignoreDuringBuilds: false
  },

  typescript: {
    ignoreBuildErrors: false
  },

  images: {
    unoptimized: true
  },

  experimental: {
    optimizePackageImports: [
      "lucide-react",
      "framer-motion"
    ]
  },

  async headers() {
    return [
      {
        source: "/(.*)",

        headers: [
          {
            key:
              "X-Frame-Options",

            value:
              "SAMEORIGIN"
          },

          {
            key:
              "X-Content-Type-Options",

            value:
              "nosniff"
          },

          {
            key:
              "Referrer-Policy",

            value:
              "origin-when-cross-origin"
          },

          {
            key:
              "Permissions-Policy",

            value:
              "camera=(), microphone=(self), geolocation=()"
          },

          {
            key:
              "Cross-Origin-Opener-Policy",

            value:
              "same-origin"
          }
        ]
      }
    ];
  },

  webpack(config) {
    config.resolve.fallback = {
      ...config.resolve
        .fallback,

      fs: false,

      net: false,

      tls: false
    };

    return config;
  }
};

module.exports =
  nextConfig;
