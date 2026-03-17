/* project card data for file pages */

/* FORMAT FOR DATA 
- name (project name)
- type (routes to what format the overlay will be in)
- description (short description for project cards)
- timeframe (time the project took place)
- tools (tools used during the project)
- longdesc (longer description for overlay view)
- keywords (ARRAY: decorative categorical elements)
- imgsrc (still thumbnail image for project cards)
- hoversrc (GIF that appears once hovered over, 
ALSO the "hero img" people see when they click into the project)
- halfsrc (the half-img in the overlay project info section)
- imgseries (ARRAY OF SRCs: the series of images that appear 
after everything else in the overlay view)
*/

export const designProjects = [
  {
    name: 'Cloverknots', type: 'cloverknots',
    description: 'A sustainable hand-made fashion company.',
    timeframe: 'Jan 2026 - March 2026',
    tools: 'Figma, Adobe Photoshop, Adobe Illustrator, Risograph Printer',
    longdesc: 'Built full branding for a sustainability-focused fashion company, from logo to branding guidelines to website frontend, combining a warm handmade feel with professional style: Cloverknots\' unique design language.',
    keywords: ['UI/UX', 'Branding'], imgsrc: '/cloverknots/thumbnail.webp', hoveredsrc: '/cloverknots/home.gif',
    halfsrc: '/cloverknots/half.webp', imgseries: ['/cloverknots/clover-1.webp', '/cloverknots/clover-2.webp',
      '/cloverknots/clover-3.webp', '/cloverknots/home.gif', '/cloverknots/knot.gif', '/cloverknots/clothes.gif',
      '/cloverknots/scarf.webp', '/cloverknots/clover-4.webp', '/cloverknots/clover-5.webp', '/cloverknots/clover-6.webp',
      '/cloverknots/clover-7.webp'
    ]
  },

  {
    name: 'Watchtower 72', type: 'watchtower',
    description: 'Indie game about a spaceship crew\'s last days in space.',
    timeframe: 'June 2024 - Present',
    tools: 'Python, Adobe Photoshop, Audacity',
    longdesc: 'I am one of the 2 devs working on Watchtower 72, with my roles being: illustrator, concept artist, gameplay programmer, and UI designer. I wanted to convey a retro space aesthetic through both the character designs and the UI.',
    keywords: ['Game Dev', 'Concept Art', 'UI/UX'], imgsrc: '/watchtower/thumbnail.webp', hoveredsrc: '/watchtower/hover.gif',
    halfsrc: '/watchtower/chiasma-logo.png', imgseries: ['watchtower/watch-1.webp', 'watchtower/watch-2.webp',
      'watchtower/watch-3.webp', 'watchtower/watch-4.webp', 'watchtower/watch-5.webp', 'watchtower/watch-6.webp',
      'watchtower/watch-7.webp', 'watchtower/watch-8.webp', 'watchtower/watch-9.webp', 'watchtower/watch-10.webp',
      'watchtower/watch-11.webp', 'watchtower/watch-12.webp'
    ]
  },

  {
    name: 'Quantum AI Institute', type: 'quantum',
    description: 'Community of leaders shaping the future of AI.',
    timeframe: 'June 2025 - Present',
    tools: 'Figma, Google Slides',
    longdesc: 'I produced and designed decks shown to investors/partners, leading to real conversions. Designed social media and outreach assets, event banners, and branding guidelines.',
    keywords: ['Professional', 'Product Design'], imgsrc: '/qai/thumbnail.webp', hoveredsrc: '/qai/hover.gif',
    halfsrc: '/qai/half.webp', imgseries: ['/qai/qai-1.webp', '/qai/qai-3.webp', '/qai/qai-4.webp',
      '/qai/qai-5.webp', '/qai/qai-6.webp', '/qai/qai-7.webp', '/qai/qai-8.webp', '/qai/qai-9.webp'
    ]
  },

  {
    name: 'Second Time Founders', type: 'normal',
    description: 'A quickly-growing community of experienced founders.',
    timeframe: 'May 2025 - Sept 2025',
    tools: 'Notion, Google Sheets, Paradigm',
    longdesc: 'Conducted research, interviewed 5+ founders, and organized >600 entries of data to create the 2TF Notion Founder Directory, which was shipped out to the Second Time Founder community. Some information censored for member confidentiality.',
    keywords: ['Professional', 'Product Design'], imgsrc: '/2tf/thumbnail.webp', hoveredsrc: '/2tf/hover.gif',
    halfsrc: '/2tf/half.webp', imgseries: ['/2tf/2tf-1.webp', '/2tf/2tf-2.webp', '/2tf/2tf-3.webp', '/2tf/2tf-4.webp',
      '/2tf/2tf-5.webp', '/2tf/2tf-6.webp', '/2tf/2tf-7.webp'
    ]
  }
]

export const artProjects = [
  {
    name: 'Book Illustrations', type: 'normal',
    description: 'Covers/internal layouts completed for various book projects.',
    timeframe: 'Mar 2022 - Aug 2025',
    tools: 'Adobe Photoshop, Adobe InDesign',
    longdesc: 'Book projects include: my highschool yearbook cover and various internal illustrations, the cover and internal layout for my poetry book, and the cover for my highschool\'s annual literary anthology.',
    keywords: ['Illustration', 'Graphic Design'], imgsrc: '/book/thumbnail.webp', hoveredsrc: '/book/hover.gif',
    halfsrc: '/book/half.webp', imgseries: ['/book/book-1.webp', '/book/book-2.webp', '/book/book-3.webp',
      '/book/book-4.webp', '/book/book-5.webp'
    ]
  },

  {
    name: 'Graphic Design Projects', type: 'normal',
    description: 'Compilation of freelance and personal graphic design projects.',
    timeframe: 'Jan 2026 - Present',
    tools: 'Figma, Linocut Print, Risograph Print',
    longdesc: 'I just design posters for fun sometimes. Mostly because I need more room decor. Also includes a project for a client who needed graphics for their league team.',
    keywords: ['Graphic Design'], imgsrc: '/graphics/thumbnail.webp', hoveredsrc: '/graphics/hover.gif',
    halfsrc: '/graphics/half.webp', imgseries: ['/graphics/graphics-1.webp', '/graphics/graphics-2.webp',
      '/graphics/graphics-3.webp']
  },

  {
    name: '3D Models', type: 'models',
    description: 'Models that I created in Blender!',
    timeframe: 'Sept 2025 - Jan 2026',
    tools: 'Blender, ProCreate (for concepting)',
    longdesc: 'Rotate the models around by clicking and dragging! Scroll in and out with the middle mouse button. The image with the 2 frogs was created for Stanford\'s computer graphics class. It was chosen to be displayed on the class website\'s best work showcase out of >200 entries. View here: https://web.stanford.edu/class/cs148/showcase.html',
    keywords: ['3D Modeling'], imgsrc: '/models/thumbnail.webp', hoveredsrc: '/models/hover.gif',
    halfsrc: '/models/half.webp', imgseries: ['./models/cs124.webp']
  },

  {
    name: 'Life Drawings', type: 'normal',
    description: 'I like drawing people on my ipad :)',
    timeframe: 'May 2025 - Present',
    tools: 'ProCreate',
    longdesc: 'These are the favorite drawings I\'ve done so far while drawing my friends/random people I see as I go about life.',
    keywords: ['Illustration'], imgsrc: 'sketches/thumbnail.webp', hoveredsrc: 'sketches/hover.gif',
    halfsrc: '/sketches/half.webp', imgseries: ['/sketches/sketches-1.webp', '/sketches/sketches-2.webp',
      '/sketches/sketches-3.webp', '/sketches/sketches-4.webp', '/sketches/sketches-5.webp',
      '/sketches/sketches-6.webp', '/sketches/sketches-7.webp']
  },
]