# Digital Life Archive — Personal Biography & Living Memoir

A premium, production-ready Digital Life Archive and interactive autobiography web application designed as a living digital book of one person's life—documenting origins, childhood, family lineage, education, sensory memories, pivotal trials, career craft, personal growth, and long-term future horizons.

Engineered to be **100% self-contained and statically deployable to Cloudflare Pages & Cloudflare Workers** with zero backend or database hosting dependencies required for the demo, while maintaining clean architecture for future full-stack extensions.

---

## 1. Cloudflare Pages & Workers Deployment

### Quick Deploy to Cloudflare Pages
1. Connect your GitHub repository to **Cloudflare Pages**.
2. Set the build settings:
   - **Framework Preset**: `Vite`
   - **Build Command**: `npm run build`
   - **Build Output Directory**: `dist`
   - **Root Directory**: `/`
3. Click **Save and Deploy**.
4. The site will be live instantly across Cloudflare's global edge network.

### Cloudflare Assets & SPA Routing
- **Output Directory**: `dist/`
- **SPA Redirection**: `public/_redirects` maps `/* -> /index.html 200` automatically.
- **Static Assets**: All photographs and images are served directly from `/images/*` in `dist/images/`.
- **Search Engine Optimization**: `robots.txt` and `sitemap.xml` are packaged into the root of `dist/`.

---

## 2. Architecture & Directory Layout

```
digital-life-archive/
│
├── dist/                       # Production build output for Cloudflare Pages/Workers
│   ├── index.html              # Core single-page entry point with full metadata
│   ├── assets/                 # Bundled CSS and JavaScript chunks
│   ├── images/                 # Optimized photographic plates
│   ├── _redirects              # Cloudflare SPA route handler
│   ├── robots.txt              # Search engine crawling rules
│   └── sitemap.xml             # XML sitemap
│
├── public/                     # Static assets copied into dist during build
│   ├── images/                 # Archival photographic plates
│   ├── _redirects              # Cloudflare routing rule
│   ├── robots.txt              # Static robots.txt
│   └── sitemap.xml             # Static sitemap.xml
│
├── src/
│   ├── App.tsx                 # Core application controller with all 13 interactive sections
│   ├── main.tsx                # React entry point
│   ├── index.css               # Editorial design system (Archival Warm Paper, zero-pill)
│   └── data/
│       └── archiveData.ts      # Structured archive records with client demo placeholders
│
├── index.html                  # HTML entry point with preconnect Google Fonts & OpenGraph
├── package.json                # Dependencies and build scripts
├── tsconfig.json               # TypeScript strict configuration
├── vite.config.ts              # Vite configuration
└── README.md                   # This manual
```

---

## 3. Implemented Chapters & Interactive Features

1. **Frontispiece (Home)**:
   - Real profile photo placeholder with chapter caption
   - Editorial typography and curatorial quote
   - Sequential Life Horizons visual roadmap (*Childhood → Education → Challenges → Growth → Present → Future*)
   - Quick excerpt anchors into featured timeline events, memories, and photos

2. **My Story**:
   - 10-chapter long-form autobiographical monograph
   - Editorial drop caps, reading time indicator, and chapter anchor rail

3. **Childhood & Origins**:
   - Village homestead archival plate
   - Early interests, important places, family environment, and lessons learned

4. **Family & Lineage**:
   - Profiles of parents, grandparents, and siblings with photo placeholders
   - Cherished memories and generational tenets

5. **Education Journey**:
   - Sequential academic stages from Primary School to Advanced Mastery
   - Institution details, field of focus, intellectual reflection, and distinctions

6. **Life Timeline**:
   - Interactive category filtering (*All, Childhood, Education, Family, Achievement, Challenge, Career, Growth, Present*)
   - Alternating desktop spine and responsive single-column mobile view

7. **Photo Archive & Gallery**:
   - Responsive plate grid with category filtering
   - Fullscreen modal lightbox with keyboard navigation (`ArrowLeft`, `ArrowRight`, `Escape`)
   - Captions, year stamps, and accession counters

8. **Memories & Inward Reflections**:
   - Evocative memoir vignettes with pull quotes and sensory settings

9. **Achievements, Honors & Milestones**:
   - Academic, competition, professional, and personal endurance records

10. **Professional Journey & Craft**:
    - Guiding craft doctrine: durability over novelty
    - Epochs of vocational practice and synthesized knowledge capabilities

11. **Personal Growth**:
    - Philosophical reflections: *Who I Was, Who I Am, What I Learned, How I Changed, Where I Am Going*

12. **Future Goals & Horizons**:
    - Multi-decadal aspirations across creative authorship, scholarship endowment, and homestead stewardship

13. **Contact & Archival Transmissions**:
    - Self-contained working form with client-side validation
    - Saves transmissions into browser storage with instant success alert
    - Displays locally preserved transmissions list for testing and verification

14. **Curatorial Controls**:
    - **Reading Room Toggle**: Switch between Parchment and Dark Reading Room modes (persisted in `localStorage`)
    - **Atmospheric Room Tone**: Synthesizes a subtle 110Hz/165Hz room tone using the native Web Audio API (zero external audio files)
    - **Reading Progress Bar**: Dynamic scroll progress line at top of viewport

---

## 4. Local Development

```bash
# 1. Install dependencies
npm install

# 2. Start the local Vite development server
npm run dev

# 3. Build for production (Cloudflare output in dist/)
npm run build

# 4. Preview the production build locally
npm run preview
```

---

## 5. Deployment Verification Checklist

- [x] `npm install` runs cleanly without missing packages
- [x] `npm run build` generates `dist/` with `index.html`, `assets/`, `images/`, `_redirects`
- [x] Zero external backend or Python server requirement for Cloudflare deployment
- [x] All 13 navigation buttons functional on desktop and mobile drawer
- [x] Interactive lightbox opens, navigates with arrow keys, and closes cleanly
- [x] Timeline filters events dynamically
- [x] Contact form submits and saves transmission with visual success feedback
- [x] No console errors or broken asset references
- [x] Fully responsive across viewports from 360px to 1440px+
