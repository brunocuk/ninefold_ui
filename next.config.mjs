/** @type {import('next').NextConfig} */
const nextConfig = {
  serverExternalPackages: ['puppeteer-core', '@sparticuz/chromium'],
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'pphvvkeajoonusbgrajd.supabase.co',
        pathname: '/storage/v1/object/public/**',
      },
    ],
  },
  async redirects() {
    const oldBlogSlugs = [
      'ai-development-tools-practical-guide',
      'color-psychology-branding',
      'design-systems-modern-teams',
      'ecommerce-conversion-optimization-2025',
      'minimalist-design-principles',
      'optimize-website-speed-2026',
      'scaling-saas-practical-lessons',
      'serverless-architecture-practical-guide',
      'web-accessibility-essentials',
      'web-design-trends-2026',
      'web-design-trends-boost-engagement-2026',
      'web-performance-optimization-guide',
      'web-design-trends-shaping-2026',
    ]
    return [
      ...oldBlogSlugs.map((slug) => ({
        source: `/blog/${slug}`,
        destination: '/blog',
        permanent: true,
      })),
      {
        source: '/services',
        destination: '/usluge',
        permanent: true,
      },
      {
        source: '/services/web-design',
        destination: '/usluge/web-digitalno',
        permanent: true,
      },
      {
        source: '/services/web-development',
        destination: '/usluge/web-digitalno',
        permanent: true,
      },
      {
        source: '/services/e-commerce',
        destination: '/usluge/web-digitalno',
        permanent: true,
      },
      {
        source: '/services/web-applications',
        destination: '/usluge/web-digitalno',
        permanent: true,
      },
      {
        source: '/services/search-engine-optimization',
        destination: '/usluge/web-digitalno',
        permanent: true,
      },
      {
        source: '/services/content-creation',
        destination: '/usluge/sadrzaj-drustvene-mreze',
        permanent: true,
      },
      {
        source: '/services/:path*',
        destination: '/usluge',
        permanent: true,
      },
    ];
  },
};

export default nextConfig;