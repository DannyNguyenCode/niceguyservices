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
        source: "/resources/how-seo-helps-local-businesses",
        destination: "/resources/seo-basics-for-local-businesses",
        permanent: true,
      },
      {
        source: "/resources/how-to-start-seo-for-your-website",
        destination: "/resources/seo-basics-for-local-businesses",
        permanent: true,
      },
      {
        source: "/resources/why-fast-websites-rank-better",
        destination: "/resources",
        permanent: true,
      },
      {
        source: "/resources/understanding-custom-vs-template-websites",
        destination: "/resources/custom-vs-template-websites",
        permanent: true,
      },
      {
        source: "/template",
        destination: "/resources/custom-vs-template-websites",
        permanent: true,
      },
      {
        source: "/template/:path*",
        destination: "/resources/custom-vs-template-websites",
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
