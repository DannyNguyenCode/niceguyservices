import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      {
        source: "/resources/custom-websites-vs-templates",
        destination: "/resources",
        permanent: true,
      },
      {
        source: "/template/aurora-bistro",
        destination: "/template/demo/neopets-nonprofit",
        permanent: true,
      },
      {
        source: "/template/adoption-adventure",
        destination: "/template/demo/neopets-nonprofit",
        permanent: true,
      },
      {
        source: "/template/demo/adoption-adventure",
        destination: "/template/demo/neopets-nonprofit",
        permanent: true,
      },
      {
        source: "/template/mono-studio",
        destination: "/template",
        permanent: true,
      },
      {
        source: "/template/demo/mono-studio",
        destination: "/template",
        permanent: true,
      },
      {
        source: "/template/arcade-electrician",
        destination: "/template",
        permanent: true,
      },
      {
        source: "/template/arcade-electrician/:path*",
        destination: "/template",
        permanent: true,
      },
      {
        source: "/template/demo/arcade-electrician",
        destination: "/template",
        permanent: true,
      },
      {
        source: "/template/demo/arcade-electrician/:path*",
        destination: "/template",
        permanent: true,
      },
      {
        source: "/template/demo/arcade-trades",
        destination: "/template",
        permanent: true,
      },
      {
        source: "/template/demo/arcade-trades/:path*",
        destination: "/template",
        permanent: true,
      },
      {
        source: "/template/tmnt-construction",
        destination: "/template/demo/tmnt-trades",
        permanent: true,
      },
      {
        source: "/template/tmnt-construction/:path*",
        destination: "/template/demo/tmnt-trades/:path*",
        permanent: true,
      },
      {
        source: "/template/demo/tmnt-construction",
        destination: "/template/demo/tmnt-trades",
        permanent: true,
      },
      {
        source: "/template/demo/tmnt-construction/:path*",
        destination: "/template/demo/tmnt-trades/:path*",
        permanent: true,
      },
      {
        source: "/template/looneytoons-cafe",
        destination: "/template/demo/looneytunes-services",
        permanent: true,
      },
      {
        source: "/template/looneytoons-cafe/:path*",
        destination: "/template/demo/looneytunes-services/:path*",
        permanent: true,
      },
      {
        source: "/template/demo/looneytoons-cafe",
        destination: "/template/demo/looneytunes-services",
        permanent: true,
      },
      {
        source: "/template/demo/looneytoons-cafe/:path*",
        destination: "/template/demo/looneytunes-services/:path*",
        permanent: true,
      },
    ];
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "lh3.googleusercontent.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "images.unsplash.com",
        pathname: "/**",
      },
    ],
  },
};

export default nextConfig;
