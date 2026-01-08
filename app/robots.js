export default function robots() {
    const baseUrl = 'https://www.ninefold.eu' // Replace with your actual domain
  
    return {
      rules: {
        userAgent: '*',
        allow: '/',
        disallow: ['/api/', '/admin/'], // Add any paths you want to block from search engines
      },
      sitemap: `${baseUrl}/sitemap.xml`,
    }
  }