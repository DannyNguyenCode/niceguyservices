import type { NextConfig } from "next";

const chromiumTraceIncludes = [
  "./node_modules/@sparticuz/chromium/**",
  "./node_modules/playwright-core/**",
];

/** Playwright resolves browsers.json via dynamic require; NFT misses it without an explicit include. */
const playwrightCoreMinimalTraceIncludes = [
  "./node_modules/playwright-core/browsers.json",
  "./node_modules/playwright-core/package.json",
];

const playwrightServerRoutes = {
  "/dashboard/websites/[id]": chromiumTraceIncludes,
  "/dashboard/websites/new": chromiumTraceIncludes,
  "/api/admin/websites/[id]/crawl": chromiumTraceIncludes,
  "/api/admin/websites/[id]/audits": chromiumTraceIncludes,
} as const;

const nextConfig: NextConfig = {
  poweredByHeader: false,
  serverExternalPackages: ["playwright-core", "@sparticuz/chromium", "@react-pdf/renderer"],
  outputFileTracingIncludes: {
    "/*": [
      "./src/services/crawl-browser-extract.js",
      ...playwrightCoreMinimalTraceIncludes,
    ],
    ...playwrightServerRoutes,
  },
  // Client workbook PDF uses the browser build; server audit PDF uses the
  // default Node entry (renderToBuffer). Alias only on the client webpack bundle.
  // Empty turbopack config acknowledges Next 16 default Turbopack + webpack coexistence.
  turbopack: {},
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
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
        ],
      },
    ];
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
        hostname: "res.cloudinary.com",
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
