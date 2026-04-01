/** @type {import('next').NextConfig} */
const nextConfig = {
  serverExternalPackages: ['puppeteer-core', '@sparticuz/chromium'],
  async redirects() {
    return [
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