import type { NextConfig } from "next";

const reactPdfBrowserEntry =
  "./node_modules/@react-pdf/renderer/lib/react-pdf.browser.js";

const nextConfig: NextConfig = {
  turbopack: {
    resolveAlias: {
      "@react-pdf/renderer": reactPdfBrowserEntry,
    },
  },
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.resolve.alias = {
        ...config.resolve.alias,
        "@react-pdf/renderer": require.resolve(
          "@react-pdf/renderer/lib/react-pdf.browser.js",
        ),
      };
    }
    return config;
  },
  async redirects() {
    return [
      {
        source: "/featured-work",
        destination: "/work",
        permanent: true,
      },
      {
        source: "/featured-work/:path*",
        destination: "/work/:path*",
        permanent: true,
      },
      {
        source: "/website-inspirations",
        destination: "/inspiration",
        permanent: true,
      },
      {
        source: "/templates",
        destination: "/inspiration",
        permanent: true,
      },
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
        source: "/template/demo/leave-a-spark",
        destination: "/template/demo/spark-frame",
        permanent: true,
      },
      {
        source: "/template/demo/leave-a-spark/:path*",
        destination: "/template/demo/spark-frame/:path*",
        permanent: true,
      },
      {
        source: "/template/demo/sparkframe",
        destination: "/template/demo/spark-frame",
        permanent: true,
      },
      {
        source: "/template/demo/sparkframe/:path*",
        destination: "/template/demo/spark-frame/:path*",
        permanent: true,
      },
      {
        source: "/template/demo/valley-interlocking",
        destination: "/template/demo/hardscape-landscaping",
        permanent: true,
      },
      {
        source: "/template/demo/valley-interlocking/:path*",
        destination: "/template/demo/hardscape-landscaping/:path*",
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
