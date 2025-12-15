// data/projects.js

export const projects = [
  {
    id: 1,
    slug: 'desknco-premium-office-spaces',
    title: 'Desk&Co Premium Office Spaces',
    tagline: 'Modern serviced offices and business club in Zagreb',
    category: 'Web Design & Development',
    client: 'Desk&Co',
    year: '2025',
    duration: '8-10 weeks',
    
    featured: true,
    linkToSite: "https://desknco.com",
    thumbnail: '/images/project/desknco.webp',
    heroVideo: '/images/project/desknco-vid.mp4',
    color: '#00FF94',
    
    description: 'A comprehensive digital presence for Zagreb\'s newest premium serviced office provider, featuring integrated booking systems for flexible office spaces, meeting rooms, virtual offices, and business club memberships.',
    challenge: 'As a brand-new company entering the competitive serviced office market in Zagreb, Desk&Co needed to establish instant credibility and make it effortless for potential clients to understand their offerings and book spaces. They required a complete digital foundation from zero - website, brand positioning, booking infrastructure, and content strategy.',
    solution: 'We built a fully custom React application from the ground up, integrating OfficeRnD for seamless office and meeting room bookings with Stripe payment processing, Calendly for office tour scheduling, and comprehensive SEO strategy. The site showcases their premium spaces through professional photography and videography, with carefully crafted copy that positions them as Zagreb\'s go-to destination for flexible workspace solutions.',
    
    results: [
      { metric: '97/100', label: 'Lighthouse Performance' },
      { metric: '0.5s', label: 'First Contentful Paint' },
      { metric: '1.0s', label: 'Largest Contentful Paint' },
      { metric: '100%', label: 'Launch on Schedule' },
    ],
    
    services: ['Web Design', 'Web Development', 'Brand Positioning', 'SEO Strategy', 'Copywriting', 'Photography & Video'],
    technologies: ['React', 'HTML', 'CSS', 'OfficeRnD', 'Stripe', 'Calendly'],

    lighthouse: {
      performance: 97,
      accessibility: 100,
      bestPractices: 100,
      seo: 100
    },
    
    sections: [
      {
        type: 'text',
        title: 'Project Overview',
        content: 'Desk&Co came to us as a completely new entrant in Zagreb\'s serviced office market. Starting from scratch, we needed to create not just a website, but a complete digital ecosystem that would establish credibility, showcase their premium spaces, and make booking seamless. The project required building integrated systems for multiple service types - from flexible office spaces to meeting room bookings and virtual office packages.'
      },
      {
        type: 'two-column',
        left: {
          title: 'Technical Scope',
          items: [
            'Custom React application architecture',
            'OfficeRnD integration for space bookings',
            'Stripe payment processing implementation',
            'Calendly integration for tour scheduling',
            'Professional photography and videography',
            'Performance optimization (97/100 Lighthouse)'
          ]
        },
        right: {
          title: 'Content & Strategy',
          items: [
            'Complete copywriting for all pages',
            'SEO strategy and implementation',
            'Brand positioning and messaging',
            'Service offering structure',
            'Multi-location content strategy',
            'Conversion-focused user journeys'
          ]
        }
      },
      {
        type: 'text',
        title: 'Technical Implementation',
        content: 'Built as a custom React application, the site features seamless iframe integration with OfficeRnD for real-time office and meeting room availability and booking. We connected Stripe to their OfficeRnD platform for secure payment processing, while Calendly powers the tour booking system. Despite the multiple third-party integrations, we maintained exceptional performance with a 97 Lighthouse score, 0.5s First Contentful Paint, and 1.0s Largest Contentful Paint.'
      },
      {
        type: 'text',
        title: 'Full-Service Delivery',
        content: 'Beyond development, we handled every aspect of their digital launch - from strategic SEO implementation to professional photography and videography of their spaces. All copywriting was crafted to position Desk&Co as a premium choice in Zagreb\'s business community, emphasizing flexibility, professionalism, and modern workspace solutions. The result is a cohesive digital presence that supports their business club, virtual office, and serviced office offerings.'
      },
    ],
    
    testimonial: {
      quote: "Working with NineFold was exceptional from start to finish. They took our vision for a modern business space in Zagreb and created a digital presence that perfectly captures what we offer. The integrated booking system works flawlessly, and the site showcases our spaces beautifully. Everything was delivered on time and exactly as promised.",
      author: "Mirko Koren",
      role: "Co-Founder",
      company: "Desk&Co",
      image: "/testimonials/mirko-koren.jpg"
    },
    
    relatedProjects: [2, 3, 4],
  },
  
  {
    id: 2,
    slug: 'theofficecompany-corporate-website',
    title: 'The Office Company Corporate Platform',
    tagline: 'Serviced office consulting and management expertise',
    category: 'Web Design & Development',
    client: 'The Office Company',
    year: '2024',
    duration: '6 weeks',
    
    featured: true,
    linkToSite: "https://theofficecompany.eu",
    thumbnail: '/images/project/toctoc.webp',
    heroVideo: '/images/project/toc-vid.mp4',
    color: '#00CC78',
    
    description: 'A comprehensive corporate website for a leading serviced office consulting and management company. Built to showcase their 10+ years of expertise helping landlords and businesses maximize office space potential across Croatia and Slovenia, with expansion plans across the region.',
    challenge: 'The Office Company had no digital presence despite over a decade of success in serviced office management, interior design, and consulting. As they positioned for regional expansion and the projected 25-30% growth in serviced offices by 2030, they needed a professional platform that could establish credibility, showcase their comprehensive services, and support their ambitious growth strategy.',
    solution: 'We created a custom React-powered website from the ground up, architected for future scalability including planned CMS integration and e-commerce expansion. The site clearly communicates their three core service pillars - consulting, management, and design - while positioning them as the trusted partner for landlords looking to enter the serviced office market. Built with future-ready architecture to support their upcoming furniture e-commerce platform.',
    
    results: [
      { metric: '10+', label: 'Years of Expertise Showcased' },
      { metric: '3', label: 'Service Pillars Featured' },
      { metric: '6 weeks', label: 'From Zero to Launch' },
      { metric: '2030', label: 'Vision: Regional Leadership' },
    ],
    
    services: ['Web Design', 'Web Development', 'Copywriting', 'SEO Strategy', 'Blog Content Creation'],
    technologies: ['React', 'HTML', 'CSS', 'Framer Motion'],

    lighthouse: {
      performance: 59,
      accessibility: 90,
      bestPractices: 96,
      seo: 100
    },
    
    sections: [
      {
        type: 'text',
        title: 'Project Overview',
        content: 'The Office Company came to us with over 10 years of proven success in serviced office management, interior design, and consulting - but no digital presence to show for it. Operating across Croatia and Slovenia with ambitious plans for regional expansion, they needed a website that could establish their authority, communicate their comprehensive service offering, and support their vision to become the region\'s leading serviced office partner by 2030.'
      },
      {
        type: 'two-column',
        left: {
          title: 'Technical Foundation',
          items: [
            'Custom React application from scratch',
            'Framer Motion for smooth animations',
            'Future-ready architecture for CMS integration',
            'Prepared for e-commerce expansion',
            'Contact form implementation',
            'SEO-optimized structure (100/100)'
          ]
        },
        right: {
          title: 'Content & Strategy',
          items: [
            'Complete website copywriting',
            'Three service pillar positioning',
            'Blog content creation and strategy',
            'Market trend integration (2030 vision)',
            'Open-book collaboration messaging',
            'Regional expansion narrative'
          ]
        }
      },
      {
        type: 'text',
        title: 'Building from Zero',
        content: 'In just 6 weeks, we took The Office Company from having no digital presence to launching a comprehensive corporate platform. The website clearly articulates their three core services: Serviced Office Consulting for workspace strategy optimization, Serviced Office Management for operational excellence, and Office Design & Furniture for transformative workspace solutions. Each service is positioned to appeal to their target audience - landlords and businesses looking to maximize office space potential.'
      },
      {
        type: 'text',
        title: 'Strategic Positioning',
        content: 'The site leverages their impressive track record while positioning them for the future. We highlighted the industry projection that 25-30% of all office space will be serviced by 2030 (up from 5% today), establishing The Office Company as the partner of choice for landlords wanting to capture this momentum. The content strategy emphasizes their unique open-book collaboration approach with landlords, their 10+ years of expertise, and their proven ability to enhance profitability and improve business models.'
      },
      {
        type: 'text',
        title: 'Future-Ready Architecture',
        content: 'While delivering a complete solution in 6 weeks, we built the website with scalability in mind. The architecture is prepared for upcoming CMS integration to support their blog content strategy and future e-commerce platform where they\'ll sell office furniture directly. This forward-thinking approach ensures The Office Company can continue expanding their digital capabilities as they grow their regional presence across Croatia, Slovenia, and beyond.'
      },
    ],
    
    testimonial: {
      quote: "NineFold took our decade of industry experience and created a digital presence that truly represents who we are. All of our wishes when creating our digital platforms, after analysis, NineFold transformed into meaningful communication and offered the right solution and the right representation of our values. Their presence during the project realization gave us insight into every step of the creation of our websites.",
      author: "Leonardo Zovko",
      role: "CEO",
      company: "The Office Company",
      image: "/testimonials/leonardo-zovko.jpg"
    },
    
    relatedProjects: [1, 3, 4],
  },
  
  {
    id: 3,
    slug: 'elitprojekt-construction-platform',
    title: 'Elit Projekt Construction Platform',
    tagline: 'Showcasing quality residential development across Croatia',
    category: 'Web Design & Development',
    client: 'Elit Projekt',
    year: '2025',
    duration: '2 months',
    
    featured: true,
    linkToSite: "https://elitprojekt.com",
    thumbnail: '/images/project/elitProjekt.webp',
    heroVideo: '/images/project/elitProjekt-vid.mp4',
    color: '#4F46E5',
    
    description: 'A complete website redesign and CMS implementation for a Croatian residential construction company specializing in quality developments across Zagreb and the Adriatic coast. Built to showcase active and planned construction projects with dynamic project pages and integrated inquiry system.',
    challenge: 'Elit Projekt\'s outdated website was slow, difficult to update, and generated minimal inquiries despite their strong portfolio of residential projects across Croatia. They needed a modern platform that could effectively showcase their active construction projects, upcoming developments, and their commitment to quality - from concept to completion - while making it easy for potential buyers to inquire about specific properties.',
    solution: 'We completely redesigned and rebuilt their digital presence with a custom React application powered by Strapi CMS. The new platform features dynamic project showcases for both active and planned constructions, detailed building specifications, neighborhood information, and direct inquiry forms for each project. The CMS allows their team to easily manage projects, respond to inquiries, and update construction progress without technical knowledge.',
    
    results: [
      { metric: '100+', label: 'Inquiries in 2 Months' },
      { metric: '1.5k', label: 'Monthly Sessions' },
      { metric: '35.6%', label: 'Bounce Rate' },
      { metric: '1:23', label: 'Average Engagement Time' },
    ],
    
    services: ['Web Design', 'Web Development', 'CMS Implementation', 'SEO Strategy', 'Copywriting', 'Virtual Tours (Upcoming)'],
    technologies: ['React', 'HTML', 'CSS', 'Strapi CMS', 'Framer Motion'],

    lighthouse: {
      performance: 79,
      accessibility: 82,
      bestPractices: 96,
      seo: 92
    },
    
    sections: [
      {
        type: 'text',
        title: 'Project Overview',
        content: 'Elit Projekt specializes in building and selling quality residential properties across Croatia, with focus on Zagreb and the Adriatic coast. Their philosophy is simple: create spaces that are functional, aesthetically harmonious, and built for long-term value. Despite their strong portfolio and commitment to quality, their outdated website wasn\'t generating inquiries and was difficult to maintain. They needed a complete digital transformation.'
      },
      {
        type: 'two-column',
        left: {
          title: 'Previous Challenges',
          items: [
            'Slow, outdated website performance',
            'Minimal inquiries through website forms',
            'Difficult content updates requiring developer',
            'Poor showcase of active projects',
            'No system for upcoming developments',
            'Limited mobile experience'
          ]
        },
        right: {
          title: 'New Capabilities',
          items: [
            'Fast, modern React application',
            '100+ inquiries in first 2 months',
            'Easy CMS for non-technical updates',
            'Dynamic project showcases',
            'Planned construction previews',
            'Responsive design across all devices'
          ]
        }
      },
      {
        type: 'text',
        title: 'Technical Implementation',
        content: 'We rebuilt the entire website from the ground up using React for the frontend and Strapi as a headless CMS. This architecture gives Elit Projekt complete control over their content - they can add new projects, update construction progress, manage inquiries, and modify building specifications without any technical assistance. Each project has a dedicated page with detailed information including location, size, features, construction timeline, and direct inquiry forms. Framer Motion animations provide smooth, professional interactions throughout the user journey.'
      },
      {
        type: 'text',
        title: 'Content Strategy & SEO',
        content: 'We developed a comprehensive content strategy that positions Elit Projekt as quality-focused builders who guide projects from concept to completion. The copywriting emphasizes their collaboration with experienced architects, use of modern materials and technologies for energy efficiency, and individual approach to each buyer. SEO optimization and strategic content structure have contributed to strong engagement metrics - 1.5k monthly sessions, 35.6% bounce rate, and average engagement time of 1 minute 23 seconds.'
      },
      {
        type: 'text',
        title: 'Results & Future Development',
        content: 'The impact was immediate and measurable. Where their old website generated almost no inquiries, the new platform has received over 100 property inquiries in just the first two months. The modern design and intuitive navigation have dramatically improved user engagement. Looking ahead, we\'re developing virtual tour capabilities that will allow potential buyers to explore properties remotely, further enhancing their ability to showcase developments across Croatia\'s diverse locations.'
      },
    ],
    
    testimonial: {
      quote: "The transformation of our website exceeded our expectations. We went from barely receiving any inquiries online to getting over 100 in just two months. The new platform perfectly showcases our projects and makes it incredibly easy for us to manage everything ourselves. NineFold understood our business and delivered exactly what we needed.",
      author: "Božidar Jurišić",
      role: "Owner",
      company: "Elit Projekt",
      image: "/testimonials/bozidar-jurisic.jpg"
    },
    
    relatedProjects: [1, 2, 3],
  },

  {
    id: 4,
    slug: 'di-plan-engineering-website',
    title: 'DI Plan Multidisciplinary Studio',
    tagline: 'Architecture, structural engineering, and energy efficiency under one roof',
    category: 'Web Design & Development',
    client: 'DI Plan',
    year: '2025',
    duration: '8 weeks',
    
    featured: true,
    linkToSite: "https://di-plan.hr",
    thumbnail: '/images/project/diplan.webp',
    heroVideo: '/images/project/diplan-vid.mp4',
    color: '#00E5FF',
    
    description: 'A complete website redesign for a Zagreb-based multidisciplinary studio specializing in architectural design, structural engineering, supervision, and energy-efficient renovation of multi-residential buildings. Part of DOMinvest Grupa, with 30+ professionals delivering comprehensive solutions across Croatia.',
    challenge: 'DI Plan needed a complete digital transformation on a hard deadline - September 1st, 2025 - to coincide with major PR initiatives. Their existing website didn\'t reflect their multidisciplinary expertise or their position within the larger DOMinvest Grupa. They needed a modern, multilingual platform that could showcase their integrated approach while being easy for their team to manage and update independently.',
    solution: 'We delivered a comprehensive redesign in exactly 8 weeks, building a custom React application with Strapi CMS supporting three languages (Croatian, German, English). The new platform clearly communicates their unique value proposition - architecture, structural engineering, supervision, and energy efficiency all under one roof - while giving their team complete control over content, blog management, and on-page SEO through an intuitive CMS interface.',
    
    results: [
      { metric: '09.01', label: 'Launch Date Met' },
      { metric: '7.4k', label: 'Monthly Events' },
      { metric: '49s', label: 'Average Engagement' },
      { metric: '3', label: 'Languages Supported' },
    ],
    
    services: ['Web Design', 'Web Development', 'CMS Implementation', 'Multilingual Setup', 'On-Site SEO', 'Content Strategy'],
    technologies: ['React', 'HTML', 'CSS', 'Strapi CMS', 'Framer Motion'],

    lighthouse: {
      performance: 68,
      accessibility: 79,
      bestPractices: 69,
      seo: 92
    },
    
    sections: [
      {
        type: 'text',
        title: 'Project Overview',
        content: 'DI Plan is more than an architectural studio - they\'re a multidisciplinary team connecting architecture, structural engineering, expert supervision, and energy efficiency. With 30+ professionals as part of the larger DOMinvest Grupa, they guide every project from initial concepts and consultation to realization and completion. They needed a website redesign that could reflect this comprehensive approach while meeting a hard launch deadline of September 1st, 2025, to align with major PR campaigns.'
      },
      {
        type: 'two-column',
        left: {
          title: 'Project Requirements',
          items: [
            'Hard deadline: September 1st, 2025',
            'Complete website redesign',
            'Multilingual support (HR, DE, EN)',
            'Easy content management for team',
            'Blog platform for thought leadership',
            'SEO optimization and control'
          ]
        },
        right: {
          title: 'Delivered Solutions',
          items: [
            'Launched exactly on schedule',
            'Modern React-powered platform',
            'Full multilingual implementation',
            'Intuitive Strapi CMS',
            'Self-managed blog system',
            'Page-level SEO meta editing'
          ]
        }
      },
      {
        type: 'text',
        title: 'Meeting the Deadline',
        content: 'The September 1st deadline wasn\'t negotiable - DI Plan had significant PR initiatives launching that day and the new website had to be live. We completed the entire redesign, development, CMS implementation, and multilingual setup in exactly 8 weeks. This required precise project management, clear milestones, and close collaboration with their team to ensure content was ready and everyone was trained on the CMS before launch day.'
      },
      {
        type: 'text',
        title: 'Multidisciplinary Positioning',
        content: 'The website architecture clearly communicates DI Plan\'s unique advantage: architects, structural engineers, and supervisory engineers all under one roof. This integrated approach gives clients fewer concerns, lower costs, and greater security because every project is managed coordinately and responsibly. We created distinct service sections for conceptual solutions, main projects, expert supervision, and energy renovation of multi-residential buildings, while emphasizing their work across all of Croatia.'
      },
      {
        type: 'text',
        title: 'Content Control & SEO',
        content: 'A critical requirement was empowering DI Plan\'s team to manage their own content and SEO without developer assistance. We implemented Strapi CMS with custom fields allowing them to edit meta titles, descriptions, and other SEO elements on every page. They can publish blog posts, update project portfolios, and refine their messaging independently. This autonomy has enabled them to run their own analytics, search console monitoring, and content strategy - with organic search already driving the majority of their traffic (772 users from Google organic in recent analytics).'
      },
      {
        type: 'text',
        title: 'International Reach',
        content: 'Supporting three languages (Croatian, German, and English) positions DI Plan for opportunities beyond Croatia\'s borders. The multilingual implementation maintains consistent messaging and SEO optimization across all language versions, reflecting their capability to work with international clients and their connection to the broader DOMinvest Grupa network.'
      },
    ],
    
    testimonial: {
      quote: "",
      author: "",
      role: "",
      company: "",
      image: ""
    },
    
    relatedProjects: [3, 1, 2],
  },

  {
    id: 5,
    slug: 'pizzeria-14-restaurant-website',
    title: 'Pizzeria 14 (Četrnajstica)',
    tagline: 'Where love for simple ingredients becomes perfect pizza',
    category: 'Restaurant & Hospitality',
    client: 'Pizzeria 14',
    year: '2025',
    duration: '4 weeks',
    
    featured: false,
    linkToSite: "https://14.hr",
    thumbnail: '/images/project/pizzeria14.webp',
    heroVideo: '/images/project/pizzeria14-vid.mp4',
    color: '#FF6B6B',
    
    description: 'A complete digital launch for Zagreb\'s newest authentic pizzeria specializing in handmade dough, wood-fired oven pizzas, and warm neighborhood atmosphere. Located in Knežija, offering delivery, takeaway, and a welcoming space for gathering over Italy\'s authentic flavors.',
    challenge: 'Pizzeria 14 was opening their doors for the first time and needed a complete digital presence from zero. As a new restaurant in a competitive Zagreb market, they required a website that could immediately establish their authentic, handmade approach while making it easy for customers to explore the menu, book tables, and understand what makes their wood-fired pizzas special.',
    solution: 'We delivered a full-service digital launch in just 4 weeks, building a custom React website with integrated table booking through Dish app, complete menu presentation, custom videography for the hero section, and professional food photography. Beyond the website, we set up their Google My Business profile and analytics infrastructure to track performance from day one. The site captures their philosophy: "Come because you love pizza, stay because you love people."',
    
    results: [
      { metric: '99/100', label: 'Lighthouse Performance' },
      { metric: '4 weeks', label: 'From Zero to Launch' },
      { metric: '100%', label: 'Digital Infrastructure Ready' },
      { metric: 'Knežija', label: 'Zagreb Location Established' },
    ],
    
    services: ['Web Design', 'Web Development', 'SEO Strategy', 'Copywriting', 'Videography', 'Photography', 'Google Analytics Setup', 'Google My Business Setup'],
    technologies: ['React', 'HTML', 'CSS', 'Dish App Integration'],

    lighthouse: {
      performance: 99,
      accessibility: 100,
      bestPractices: 100,
      seo: 100
    },
    
    sections: [
      {
        type: 'text',
        title: 'Project Overview',
        content: 'Pizzeria 14 represents authentic Italian pizza-making in Zagreb\'s Knežija neighborhood. Their philosophy is beautifully simple: good pizza doesn\'t need much - just quality flour, fresh ingredients, and hands that know what they\'re doing. Each pizza is handmade with carefully selected ingredients, homemade dough, and tomato sauce, baked in a wood-fired oven for that authentic taste of Italy. As they prepared to open their doors, they needed a complete digital foundation to welcome customers and establish their presence.'
      },
      {
        type: 'two-column',
        left: {
          title: 'Launch Requirements',
          items: [
            'Complete website from scratch',
            'Brand new business with no digital presence',
            'Full menu presentation needed',
            'Table booking system integration',
            'Professional food photography',
            'Custom video content for hero section'
          ]
        },
        right: {
          title: 'Delivered Solutions',
          items: [
            'Custom React website in 4 weeks',
            'Complete digital infrastructure setup',
            'Interactive menu with full descriptions',
            'Dish app table booking integration',
            'Professional food & space photography',
            'Custom-crafted hero video'
          ]
        }
      },
      {
        type: 'text',
        title: 'Full-Service Digital Launch',
        content: 'We handled every aspect of Pizzeria 14\'s digital presence. Beyond building the website, we created all copywriting to capture their warm, authentic voice ("Come because you love pizza, stay because you love people"). We conducted professional photography sessions of their pizzas and space, and produced custom video content for an engaging hero section that immediately immerses visitors in the pizzeria\'s atmosphere. The menu presentation showcases each pizza with detailed descriptions, helping customers understand the quality and care in every dish.'
      },
      {
        type: 'text',
        title: 'Technical Excellence',
        content: 'Built with React, the website delivers exceptional performance with perfect 99/100 Lighthouse scores across all metrics. We integrated Dish app for seamless table booking, allowing customers to reserve their spot at this cozy neighborhood pizzeria. The site works flawlessly across all devices, ensuring whether customers are browsing from home planning their visit or on mobile looking for quick delivery, the experience is smooth and inviting.'
      },
      {
        type: 'text',
        title: 'Digital Foundation & Analytics',
        content: 'Beyond the website, we established Pizzeria 14\'s complete digital infrastructure. Google My Business setup ensures they appear correctly on Google Maps and search results with accurate hours, location (Kalinovica 2, Knežija), and the ability to collect reviews. Google Analytics implementation provides insights into visitor behavior from day one. SEO optimization positions them for local searches around "best pizza in Zagreb," "wood-fired pizza," and "pizza delivery Knežija." This foundation supports both their delivery and takeaway service as well as their welcoming dine-in atmosphere.'
      },
    ],
    
    testimonial: {
      quote: "NineFold brought our vision to life in just four weeks. They captured everything we wanted to communicate - our love for authentic, handmade pizza and the warm, welcoming atmosphere we\'re creating. The website beautifully showcases our menu, the table booking works perfectly, and the photography and video really represent what we\'re about. It was the perfect digital launch for our pizzeria.",
      author: "Sandra Attias",
      role: "Co-Owner",
      company: "Pizzeria 14",
      image: "/testimonials/ljupka-gojic-mikic.jpg"
    },
    
    relatedProjects: [1, 3, 4],
  },

  {
    id: 6,
    slug: 'radijona-tattoo-studio',
    title: 'Radijona Tattoo Studio',
    tagline: 'Where serious art meets laid-back vibes',
    category: 'Creative & Lifestyle',
    client: 'Radijona Tattoo',
    year: '2024',
    duration: '6 weeks',
    
    featured: false,
    linkToSite: "https://radijonatattoo.hr/",
    thumbnail: '/images/project/radijona.webp',
    heroVideo: '/images/project/radvid.mp4',
    color: '#9D4EDD',
    
    description: 'A bold, personality-driven website for a Zagreb-based tattoo studio with 6+ years of experience. Featuring custom video introductions for each artist, portfolio galleries, and a playful tone that captures the studio\'s unique atmosphere where serious artistry meets a relaxed, friendly vibe.',
    challenge: 'Radijona Tattoo Studio needed a digital presence that could capture what makes them special - exceptional tattoo artistry delivered in a fun, welcoming atmosphere. With multiple artists each bringing their own style and personality, they needed a platform that could showcase individual portfolios while maintaining cohesive studio branding. The website had to communicate their experience and professionalism without losing the playful, approachable energy that defines their Sesvete location.',
    solution: 'We created a vibrant React-powered website that brings the studio\'s personality to life through custom videography - each artist has a cool, funky video introduction that lets potential clients get to know them before booking. The site features comprehensive portfolio galleries showcasing the team\'s diverse styles, contact forms for inquiries, and architecture ready for future booking system integration. All content was crafted to reflect their authentic voice: "Welcome to our tattoo studio - where your ideas become masterpieces and the atmosphere is always top-notch!"',
    
    results: [
      { metric: '100/100', label: 'Perfect Lighthouse Score' },
      { metric: '6+', label: 'Years of Experience Highlighted' },
      { metric: 'Custom', label: 'Artist Video Intros' },
      { metric: 'Sesvete', label: 'Zagreb Location Featured' },
    ],
    
    services: ['Web Design', 'Web Development', 'Videography', 'SEO Strategy', 'Copywriting'],
    technologies: ['React', 'HTML', 'CSS', 'Framer Motion'],

    lighthouse: {
      performance: 100,
      accessibility: 100,
      bestPractices: 100,
      seo: 100
    },
    
    sections: [
      {
        type: 'text',
        title: 'Project Overview',
        content: 'Radijona Tattoo Studio brings 6+ years of experience to Zagreb\'s Sesvete neighborhood, combining serious artistic skill with a fun, laid-back atmosphere. Their philosophy is simple: tattooing isn\'t just a process, it\'s an experience. From the moment you walk in, you know you\'re in the right place. But how do you communicate that unique vibe online? We needed to create a website that showcased their artistic excellence while capturing the studio\'s playful personality and the individual character of each artist.'
      },
      {
        type: 'two-column',
        left: {
          title: 'Studio Characteristics',
          items: [
            'Multiple artists with distinct styles',
            'Fun, friendly atmosphere',
            '6+ years of professional experience',
            'Sesvete, Zagreb location',
            'From subtle to epic tattoos',
            'Full attention to every client'
          ]
        },
        right: {
          title: 'Website Features',
          items: [
            'Custom video intro for each artist',
            'Comprehensive portfolio galleries',
            'Personality-driven copywriting',
            'Contact form for inquiries',
            'Future-ready booking integration',
            'Perfect 100/100 performance scores'
          ]
        }
      },
      {
        type: 'text',
        title: 'Bringing Artists to Life',
        content: 'The standout feature of Radijona\'s website is the custom videography we created for each artist. Rather than static bios, visitors are greeted with cool, funky video introductions that let each artist\'s personality shine through. These videos help potential clients connect with the artists before ever stepping into the studio, making it easier to choose the right match for their tattoo vision. Whether you want something small and subtle or big and epic, you can get a feel for who you\'ll be working with.'
      },
      {
        type: 'text',
        title: 'Capturing the Studio Voice',
        content: 'The copywriting throughout the site reflects Radijona\'s authentic voice - playful but professional. "Our tattoo masters aren\'t just professionals - they literally paint and work wonders with a needle, although they are a bit weird." This tone runs throughout the site, from the cheeky "Our crazy but totally serious story" section to reassurances that visiting feels like "having coffee with friends, except you\'ll leave with an awesome tattoo and no hangover (maybe)." The content communicates that while they take their art seriously, they don\'t take themselves too seriously.'
      },
      {
        type: 'text',
        title: 'Technical Excellence & Future Growth',
        content: 'Built with React and enhanced with Framer Motion animations, the website delivers flawless performance with perfect 100/100 Lighthouse scores across all metrics. The architecture is designed with future growth in mind - prepared for upcoming booking system integration, educational content about tattoo aftercare, and potential expansion of artist portfolios. The site works beautifully across all devices, ensuring whether clients are browsing late-night tattoo inspiration on mobile or researching artists from desktop, the experience is smooth and engaging.'
      },
    ],
    
    testimonial: {
      quote: "NineFold perfectly captured what makes our studio special. The custom videos for each artist are brilliant - clients love getting to know us before they come in. The website has the right balance of showcasing our professional work while keeping that fun, relaxed vibe that defines us. It\'s exactly what we needed to represent Radijona online.",
      author: "Tomislav Majić",
      role: "Co-Owner",
      company: "Radijona Tattoo Studio",
      image: "/testimonials/tomislav-majic.jpg"
    },
    
    relatedProjects: [5, 1, 3],
  },

  {
    id: 7,
    slug: 'otkup-auta-car-buying',
    title: 'Otkup Auta Hrvatska',
    tagline: 'Fast payment and best prices for car buying across Croatia',
    category: 'Automotive & Services',
    client: 'Otkup Auta',
    year: '2024',
    duration: '6 weeks',
    
    featured: false,
    linkToSite: "https://otkup-auta.com",
    thumbnail: '/images/project/otkup.webp',
    heroVideo: '/images/project/otkup-vid.mp4',
    color: '#00D4FF',
    
    description: 'A streamlined car buying website for a Zagreb-based company offering fast vehicle purchases across Croatia. Features an intuitive car valuation form with flexible submission options (WhatsApp or email), clear process explanation, and lead management setup to efficiently handle inquiries for all car makes and models.',
    challenge: 'Otkup Auta needed a digital presence to generate qualified leads for their car buying service. Operating in a competitive market where trust and speed are crucial, they required a website that could quickly capture seller information, communicate their fast payment promise and fair pricing, and make it as easy as possible for potential sellers to get in touch - whether through traditional email or popular messaging platforms like WhatsApp.',
    solution: 'We built a clean, conversion-focused React website centered around an intuitive car valuation form. Sellers can quickly input their vehicle details and choose whether to submit via email or WhatsApp - meeting them on their preferred communication channel. The site clearly explains the straightforward process: submit car details, receive fair valuation, get immediate payment on-site. Combined with SEO optimization and lead management setup, the platform efficiently converts visitors into qualified car selling inquiries.',
    
    results: [
      { metric: '97/100', label: 'Lighthouse Performance' },
      { metric: 'More', label: 'Qualified Leads' },
      { metric: '2', label: 'Contact Channels' },
      { metric: 'Croatia', label: 'Nationwide Coverage' },
    ],
    
    services: ['Web Design', 'Web Development', 'Copywriting', 'SEO Strategy', 'Lead Management Setup'],
    technologies: ['React', 'HTML', 'CSS'],

    lighthouse: {
      performance: 97,
      accessibility: 94,
      bestPractices: 100,
      seo: 100
    },
    
    sections: [
      {
        type: 'text',
        title: 'Project Overview',
        content: 'Otkup Auta Hrvatska operates a straightforward car buying service across Croatia - they purchase all makes and models of vehicles, offering fair prices and immediate on-site payment. Based in Zagreb, they needed a website that could generate qualified leads by making it incredibly easy for car sellers to submit their vehicle information and get valuations. The key challenge was creating a platform that builds trust and removes friction from the initial contact process.'
      },
      {
        type: 'two-column',
        left: {
          title: 'Business Model',
          items: [
            'Fast car purchases across Croatia',
            'All makes and models accepted',
            'Fair pricing and immediate payment',
            'On-site cash payment',
            'Zagreb-based operation',
            'Simple, transparent process'
          ]
        },
        right: {
          title: 'Website Features',
          items: [
            'Intuitive car valuation form',
            'WhatsApp or email submission',
            'Clear process explanation',
            'Lead management infrastructure',
            'SEO-optimized for local searches',
            'Mobile-friendly experience'
          ]
        }
      },
      {
        type: 'text',
        title: 'Conversion-Focused Design',
        content: 'The website is built around one primary goal: converting visitors into qualified car selling leads. The car valuation form is prominently featured and deliberately simple - asking for essential vehicle information without overwhelming sellers with unnecessary fields. What sets it apart is the flexibility in submission: sellers can choose to send their information via email for a traditional approach, or instantly via WhatsApp for immediate, conversational follow-up. This dual-channel approach has proven effective in generating more and better quality inquiries.'
      },
      {
        type: 'text',
        title: 'Building Trust Through Clarity',
        content: 'For car sellers considering where to sell their vehicle, trust is everything. The copywriting throughout the site emphasizes Otkup Auta\'s key differentiators: "Fast payment and best prices" and "Fair pricing with on-site payment." The process is clearly explained - submit details, receive valuation, get immediate payment. No hidden steps, no complicated procedures. This transparency, combined with professional presentation, helps overcome the natural hesitation sellers might feel when considering online car buying services.'
      },
      {
        type: 'text',
        title: 'Technical Implementation & Lead Management',
        content: 'Built with React for smooth performance and user experience, the website achieves strong Lighthouse scores (97/94/100/100). Beyond the frontend, we implemented lead management infrastructure to help Otkup Auta efficiently track and follow up with inquiries. SEO optimization targets local and national searches for car buying services in Croatia, ensuring potential sellers can easily find them when searching for quick car sale options. The mobile-responsive design is crucial, as many users search for car buying services while on-the-go or directly from their vehicle.'
      },
    ],
    
    testimonial: {
      quote: "The new website has made a real difference in our business. We're getting more inquiries than before, and the quality of leads has improved significantly. The WhatsApp option is particularly popular - people appreciate being able to reach out instantly. Everything is straightforward and professional, which is exactly what we needed to build trust with potential sellers.",
      author: "Ivan Marković",
      role: "Owner",
      company: "Otkup Auta Hrvatska",
      image: "/testimonials/ivan-markovic.jpg"
    },
    
    relatedProjects: [3, 5, 6],
  },

  {
    id: 8,
    slug: 'tophill-vacation-rental',
    title: 'Top Hill Vacation Rental',
    tagline: 'Modern retreat with panoramic Medvednica views',
    category: 'Hospitality & Vacation Rentals',
    client: 'Top Hill',
    year: '2024',
    duration: '4 weeks',
    
    featured: false,
    linkToSite: "https://tophillzagreb.com",
    thumbnail: '/images/project/top-hill.png',
    heroImage: '/images/project/top-hill.png',
    color: '#FF6B6B',
    
    description: 'A clean, visual showcase website for a brand-new 2024 vacation rental house in Zagreb. Featuring panoramic views of Medvednica and Sljeme, the property offers privacy, comfort, and premium amenities including sauna and jacuzzi - perfect for families, couples, or friends seeking a peaceful getaway.',
    challenge: 'Top Hill was launching as a completely new vacation rental property in 2024 and needed an online presence to attract direct bookings and supplement their Booking.com listings. As a brand-new house, they had no established reputation or reviews yet. The website needed to showcase the property\'s stunning location, modern amenities, and unique selling points - panoramic mountain views, sauna, and jacuzzi - while building trust with potential guests.',
    solution: 'We created a visually-driven React website focused on showcasing the property through extensive photo galleries highlighting the modern interior, panoramic Medvednica views, and premium amenities. The site includes detailed amenity listings, guest reviews integration, and clear information about the property\'s ideal location - surrounded by greenery yet well-connected to Zagreb\'s attractions. SEO optimization positions the site for searches around Zagreb vacation rentals, Medvednica accommodation, and luxury house rentals.',
    
    results: [
      { metric: '97/100', label: 'Lighthouse Performance' },
      { metric: '2024', label: 'Brand New Property Launch' },
      { metric: 'Sauna', label: '& Jacuzzi Featured' },
      { metric: 'Medvednica', label: 'Panoramic Views' },
    ],
    
    services: ['Web Design', 'Web Development', 'SEO Strategy', 'Copywriting'],
    technologies: ['React', 'HTML', 'CSS'],

    lighthouse: {
      performance: 97,
      accessibility: 97,
      bestPractices: 100,
      seo: 95
    },
    
    sections: [
      {
        type: 'text',
        title: 'Project Overview',
        content: 'Top Hill is a completely new house from 2024, nestled in greenery with panoramic views of Medvednica and Sljeme. It\'s ideal for family vacations, couples, or friends looking for a retreat that combines privacy, comfort, and excellent connectivity to Zagreb\'s attractions. With premium amenities like a sauna and jacuzzi, the property needed a website that could effectively showcase these features and attract both direct bookings and complement their presence on booking platforms.'
      },
      {
        type: 'two-column',
        left: {
          title: 'Property Features',
          items: [
            'Brand new 2024 construction',
            'Panoramic Medvednica & Sljeme views',
            'Surrounded by greenery',
            'Sauna and jacuzzi amenities',
            'Privacy and comfort focus',
            'Well-connected to Zagreb attractions'
          ]
        },
        right: {
          title: 'Website Features',
          items: [
            'Extensive photo galleries',
            'Detailed amenity listings',
            'Guest reviews showcase',
            'Location and area information',
            'SEO-optimized for local searches',
            'Mobile-responsive design'
          ]
        }
      },
      {
        type: 'text',
        title: 'Visual-First Design',
        content: 'For a vacation rental, the property sells itself - the website just needs to showcase it effectively. We built the site around extensive photo galleries that highlight Top Hill\'s strongest selling points: the modern, fresh interior of the brand-new 2024 construction, the stunning panoramic views of Medvednica mountain and Sljeme, and the premium amenities including the sauna and jacuzzi. The visual-first approach lets potential guests immediately understand the quality and appeal of the property.'
      },
      {
        type: 'text',
        title: 'Positioning & Target Audience',
        content: 'The copywriting positions Top Hill as ideal for multiple guest types - families seeking a peaceful retreat, couples wanting a romantic getaway, or groups of friends looking for a comfortable base to explore Zagreb. The content emphasizes the unique combination of privacy and greenery while maintaining excellent connectivity to city amenities. This positioning appeals to both domestic Croatian travelers and international tourists seeking an alternative to standard hotel accommodations in Zagreb.'
      },
      {
        type: 'text',
        title: 'SEO & Discovery Strategy',
        content: 'With strong Lighthouse SEO scores (95/100), the website is optimized for searches around Zagreb vacation rentals, Medvednica accommodation, house rentals with sauna, and luxury Zagreb stays. The content strategy highlights unique features that potential guests might search for - panoramic mountain views, modern vacation house, premium amenities. This SEO foundation supports both direct booking inquiries and reinforces Top Hill\'s presence alongside their Booking.com listing, giving potential guests multiple discovery paths.'
      },
    ],
    
    testimonial: {
      quote: "NineFold created exactly what we needed to launch Top Hill. The website beautifully showcases our new property and highlights what makes it special - the panoramic Medvednica views, the modern amenities, the peaceful location. It gives potential guests a clear picture of what they can expect, and the professional presentation builds confidence in booking with us.",
      author: "Matej Zirdum",
      role: "Owner",
      company: "Top Hill",
      image: "/testimonials/matej-zirdum.jpg"
    },
    
    relatedProjects: [5, 6, 1],
  },

  // {
  //   id: 9,
  //   slug: 'marlog-transport-logistics',
  //   title: 'Mar-Log Transport & Logistics',
  //   tagline: 'Over 10 years of reliable transport across Croatia and EU',
  //   category: 'Logistics & Transport',
  //   client: 'Mar-Log',
  //   year: '2024',
  //   duration: '7 weeks',
    
  //   featured: false,
  //   linkToSite: "",
  //   thumbnail: '/projects/marlog-thumb.jpg',
  //   heroImage: '/projects/marlog-hero.jpg',
  //   color: '#00CC78',
    
  //   description: 'A professional website for an established Croatian transport and logistics company with 10+ years of experience. Showcasing their comprehensive services including express van deliveries across Croatia and EU, fleet of 4 modern vans, 2 tandems and 1 truck, plus 400m² secure storage facility. Built to communicate reliability, speed, and client-focused flexibility.',
  //   challenge: 'Mar-Log had over a decade of experience and a solid reputation in Croatian transport and logistics, but lacked a professional digital presence to match their service quality. With a team of 8 dedicated employees, diverse fleet, and 400m² warehouse, they needed a website that could effectively communicate their capabilities - from small urgent shipments to large logistics operations - while emphasizing their core strengths: speed, reliability, and complete adaptability to client needs.',
  //   solution: 'We created a straightforward, professional React website that clearly presents Mar-Log\'s comprehensive service offering. The site showcases their fleet capabilities (4 vans, 2 tandems, 1 truck), highlights their specialty in express van deliveries within Croatia and EU, explains their 400m² storage facility, and emphasizes their 10+ years of experience. Contact forms make it easy for potential clients to reach out for quotes and bookings. SEO optimization targets searches for Croatian transport services, EU delivery, and logistics solutions.',
    
  //   results: [
  //     { metric: '10+', label: 'Years Experience Highlighted' },
  //     { metric: '400m²', label: 'Storage Facility Featured' },
  //     { metric: 'HR + EU', label: 'Service Area Coverage' },
  //     { metric: '100/100', label: 'Performance & Best Practices' },
  //   ],
    
  //   services: ['Web Design', 'Web Development', 'SEO Strategy', 'Copywriting'],
  //   technologies: ['React', 'HTML', 'CSS'],

  //   lighthouse: {
  //     performance: 100,
  //     accessibility: 85,
  //     bestPractices: 100,
  //     seo: 92
  //   },
    
  //   sections: [
  //     {
  //       type: 'text',
  //       title: 'Project Overview',
  //       content: 'Mar-Log is a Croatian transport and logistics company with over 10 years of experience organizing safe and timely cargo delivery. Their team of 8 experienced and dedicated employees ensures cargo arrives on time, undamaged, and stress-free. Despite their strong operational track record and comprehensive service offering, they lacked a professional website to represent their business and communicate their capabilities to potential clients across Croatia and the EU.'
  //     },
  //     {
  //       type: 'two-column',
  //       left: {
  //         title: 'Company Capabilities',
  //         items: [
  //           '10+ years of transport experience',
  //           'Team of 8 dedicated professionals',
  //           'Fleet: 4 vans, 2 tandems, 1 truck',
  //           'Express van delivery specialty',
  //           '400m² secure storage facility',
  //           'Croatia and EU coverage'
  //         ]
  //       },
  //       right: {
  //         title: 'Website Features',
  //         items: [
  //           'Professional service presentation',
  //           'Fleet and facility showcase',
  //           'Contact forms for inquiries',
  //           'Clear service area explanation',
  //           'SEO optimization for discovery',
  //           'Mobile-responsive design'
  //         ]
  //       }
  //     },
  //     {
  //       type: 'text',
  //       title: 'Comprehensive Service Offering',
  //       content: 'The website clearly communicates Mar-Log\'s ability to handle diverse transport needs. Their fleet of 4 modern vans, 2 tandems, and 1 truck covers everything from small urgent shipments to large logistics operations. They\'re particularly known for express van deliveries within Croatia and the EU - flexible, fast, and completely adapted to specific client requirements, because in logistics, every minute matters. Beyond transport, the 400m² organized warehouse provides secure storage where cargo can temporarily stay before distribution or pickup.'
  //     },
  //     {
  //       type: 'text',
  //       title: 'Client-Focused Positioning',
  //       content: 'The copywriting emphasizes Mar-Log\'s core mission: provide fast and reliable transport with a high level of professionalism and complete adaptation to client needs. Whether clients need urgent delivery or a long-term logistics partner, Mar-Log positions themselves as the solution. The content highlights their flexibility and understanding that logistics isn\'t one-size-fits-all - each client has unique requirements, and their 10+ years of experience has taught them how to meet those needs efficiently.'
  //     },
  //     {
  //       type: 'text',
  //       title: 'Professional Digital Foundation',
  //       content: 'Built with React and achieving perfect 100/100 scores for both Performance and Best Practices on Lighthouse, the website provides a fast, reliable user experience that mirrors Mar-Log\'s service standards. SEO strategy targets searches for Croatian transport companies, EU delivery services, express van delivery, and logistics storage solutions. The straightforward contact forms make it easy for businesses to reach out for quotes and discuss their transport needs, whether for one-time shipments or ongoing partnerships.'
  //     },
  //   ],
    
  //   testimonial: {
  //     quote: "After 10 years in business, we finally have a website that properly represents what we do. NineFold created a professional platform that clearly explains our services - from our express van deliveries to our storage facility. It gives potential clients confidence in our capabilities and makes it easy for them to get in touch. The site reflects the quality and reliability we bring to every transport job.",
  //     author: "Marko Tomić",
  //     role: "Owner",
  //     company: "Mar-Log",
  //     image: "/testimonials/marko-tomic.jpg"
  //   },
    
  //   relatedProjects: [3, 8],
  // },
];

// Helper functions
export const getProjectBySlug = (slug) => {
  return projects.find(project => project.slug === slug);
};

export const getFeaturedProjects = () => {
  return projects.filter(project => project.featured);
};

export const getProjectsByCategory = (category) => {
  return projects.filter(project => project.category === category);
};

export const getRelatedProjects = (currentProjectId, relatedIds) => {
  return projects.filter(project => 
    relatedIds.includes(project.id) && project.id !== currentProjectId
  );
};

export const getAllCategories = () => {
  const categories = [...new Set(projects.map(project => project.category))];
  return categories;
};