// app/sitemap.js

export default function sitemap() {
    const baseUrl = 'https://ninefold.eu' // Replace with your actual domain
  
    // Static pages
    const routes = [
      '',
      '/about',
      '/services',
      '/work',
      '/contact',
      '/blog',
    ].map((route) => ({
      url: `${baseUrl}${route}`,
      lastModified: new Date().toISOString(),
      changeFrequency: 'monthly',
      priority: route === '' ? 1.0 : 0.8,
    }))
  
    // Service pages
    const services = [
      '/services/web-design',
      '/services/web-development',
      '/services/web-applications',
      '/services/e-commerce',
      '/services/search-engine-optimization',
      '/services/content-creation',
    ].map((route) => ({
      url: `${baseUrl}${route}`,
      lastModified: new Date().toISOString(),
      changeFrequency: 'monthly',
      priority: 0.7,
    }))
  
    // Add your work/project pages here when you have them
    const projects = [
       '/work/desknco-premium-office-spaces',
       '/work/theofficecompany-corporate-website',
       '/work/elitprojekt-construction-platform',
       '/work/di-plan-engineering-website',
       '/work/pizzeria-14-restaurant-website',
       '/work/radijona-tattoo-studio',
       '/work/otkup-auta-car-buying',
       '/work/tophill-vacation-rental'
    ].map((route) => ({
      url: `${baseUrl}${route}`,
      lastModified: new Date().toISOString(),
      changeFrequency: 'monthly',
      priority: 0.6,
    }))
  
    // Add your blog posts here when you have them
    const blogPosts = [
      '/blog/web-design-trends-shaping-2026',
      '/blog/ecommerce-conversion-optimization-2025',
      '/blog/ai-development-tools-practical-guide',
      '/blog/web-performance-optimization-guide',
      '/blog/minimalist-design-principles',
      '/blog/web-accessibility-essentials',
      '/blog/color-psychology-branding',
      '/blog/scaling-saas-practical-lessons',
      '/blog/design-systems-modern-teams',
      '/blog/serverless-architecture-practical-guide',
      '/blog/optimize-website-speed-2026'
    ].map((route) => ({
      url: `${baseUrl}${route}`,
      lastModified: new Date().toISOString(),
      changeFrequency: 'weekly',
      priority: 0.5,
    }))
  
    return [...routes, ...services, ...projects, ...blogPosts]
  }