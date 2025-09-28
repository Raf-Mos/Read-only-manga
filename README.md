# 📚 MangaReader - Next.js Web Application

A modern, high-performance manga reading web application built with Next.js, TypeScript, and Tailwind CSS. Browse thousands of manga titles from MangaDex with a beautiful, responsive interface optimized for both desktop and mobile reading.

🌐 **Live Demo**: [https://read-only-manga.vercel.app](https://read-only-manga.vercel.app)

![Next.js](https://img.shields.io/badge/Next.js-14-000000?style=for-the-badge&logo=nextdotjs&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-5.4-3178C6?style=for-the-badge&logo=typescript&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white)
![Vercel](https://img.shields.io/badge/Deployed_on-Vercel-000000?style=for-the-badge&logo=vercel&logoColor=white)

## ✨ Features

### 📖 Reading Experience
- **Full-Featured Chapter Reader** - Immersive reading with keyboard navigation (arrow keys, spacebar)
- **Multiple Reading Modes** - Fit-to-width, original size, and responsive scaling
- **Dark/Light Theme** - Toggle between themes with persistent preference storage
- **Mobile Optimized** - Touch-friendly controls and responsive design

### 🔍 Discovery & Browsing
- **Popular Manga** - Browse trending and highly-rated series
- **Latest Updates** - Stay current with recently updated chapters
- **Newest Releases** - Discover fresh manga as they're added
- **Advanced Search** - Find manga by title with real-time results
- **Detailed Info Pages** - Complete manga information with authors, artists, tags, and descriptions

### 🚀 Technical Excellence
- **Serverless Architecture** - No backend required, runs entirely on edge functions
- **Image Optimization** - Smart loading with fallbacks and CDN caching
- **CORS-Free API** - Seamless MangaDex integration through proxy layer
- **Type Safety** - Full TypeScript coverage for reliable development
- **Performance First** - Optimized bundle size and loading speeds

---

## 🚀 Quick Start

### Prerequisites
- **Node.js** 18.0 or higher
- **npm** (comes with Node.js)
- **Git** for version control

### Installation & Setup

1. **Clone the repository**
```bash
git clone https://github.com/yourusername/read-only-manga.git
cd read-only-manga
```

2. **Navigate to the app directory**
```bash
cd manga-reader-next
```

3. **Install dependencies**
```bash
npm install
```

4. **Start development server**
```bash
npm run dev
```

5. **Open in browser**
Visit [http://localhost:3000](http://localhost:3000) to see the application

### Development Commands

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server with hot reload |
| `npm run build` | Create optimized production build |
| `npm run start` | Start production server (after build) |
| `npm run lint` | Run ESLint and TypeScript checks |

---

## 🏗️ Project Architecture

### Technology Stack
- **Frontend**: Next.js 14 (Pages Router) + React 18
- **Styling**: Tailwind CSS with custom components
- **Language**: TypeScript for type safety
- **Icons**: Lucide React icon library
- **HTTP Client**: Axios for API communications
- **Deployment**: Vercel serverless functions

### Project Structure

```
manga-reader-next/
├── 📁 pages/                     # Next.js Pages & API Routes
│   ├── index.tsx                 # Homepage (Popular manga)
│   ├── newest.tsx                # Newest manga listings
│   ├── updated.tsx               # Recently updated manga
│   ├── popular.tsx               # Popular manga with pagination
│   ├── manga/[id].tsx           # Individual manga details
│   ├── chapter/[id].tsx         # Chapter reading interface
│   ├── api/
│   │   ├── mangadex/[...path].ts    # MangaDex API proxy
│   │   └── image-proxy.ts           # Cover image proxy
│   ├── _app.tsx                 # Global app configuration
│   └── _document.tsx            # HTML document structure
├── 📁 src/
│   ├── components/              # Reusable React Components
│   │   ├── ChapterReader.tsx    # Full chapter reading UI
│   │   ├── MangaDetails.tsx     # Manga information display
│   │   ├── Navbar.tsx           # Global navigation header
│   │   ├── Footer.tsx           # Site footer
│   │   ├── SmartImage.tsx       # Optimized image component
│   │   ├── Carousel.tsx         # Horizontal manga carousel
│   │   ├── MangaCard.tsx        # Manga preview cards
│   │   ├── MangaGrid.tsx        # Grid layout for manga
│   │   ├── Pagination.tsx       # Page navigation controls
│   │   ├── Loading.tsx          # Loading state components
│   │   ├── ErrorBoundary.tsx    # Error handling wrapper
│   │   └── ViewToggle.tsx       # List/grid view switcher
│   ├── services/
│   │   └── mangadex.ts          # MangaDex API client & utilities
│   ├── hooks/
│   │   └── useTheme.tsx        # Dark/light mode hook
│   ├── types/
│   │   └── index.ts            # TypeScript type definitions
│   └── config/
│       └── api.ts              # API configuration
├── 📁 public/
│   ├── favicon.svg             # Custom book icon
│   └── sw.js                   # Service worker (self-unregistering)
├── styles/globals.css          # Global Tailwind styles
├── tailwind.config.js          # Tailwind configuration
├── next.config.js             # Next.js configuration
├── tsconfig.json              # TypeScript configuration
└── package.json               # Dependencies & scripts
```

### API Architecture

**Proxy Layer Design**
- `pages/api/mangadex/[...path].ts` - Forwards all API requests to MangaDex with proper headers
- `pages/api/image-proxy.ts` - Streams cover images with valid Referer headers to bypass hotlinking protection
- **Benefits**: Eliminates CORS issues, allows header manipulation, enables caching strategies

**Data Flow**
```
Browser → Next.js API Routes → MangaDex API → Response Processing → Client
```

---

## 🚀 Deployment

### Vercel (Recommended)

**One-Click Deploy:**
[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/yourusername/read-only-manga)

**Manual Deployment:**

1. **Connect Repository**
   - Import your GitHub repo in Vercel dashboard
   - Set **Root Directory** to `manga-reader-next`
   - Framework preset: **Next.js** (auto-detected)

2. **Build Configuration**
   ```
   Build Command: npm run build
   Output Directory: .next
   Install Command: npm install
   ```

3. **Environment Variables**
   - No required environment variables for basic functionality
   - Optional: Custom API endpoints or feature flags

4. **Deploy**
   - Push to main branch triggers automatic deployment
   - Custom domains supported with automatic HTTPS

### Alternative Platforms

| Platform | Status | Notes |
|----------|--------|-------|
| **Netlify** | ✅ Supported | Requires `@netlify/plugin-nextjs` |
| **Vercel** | ✅ Recommended | Native Next.js support |
| **Railway** | ✅ Supported | Docker deployment available |
| **Render** | ✅ Supported | Static site + functions |
| **Static Export** | ❌ Not Compatible | Requires serverless functions |

---

## 🔧 Configuration

### Environment Variables

Create `.env.local` in the `manga-reader-next/` directory:

```env
# Optional: Custom API proxy endpoint
NEXT_PUBLIC_MANGADEX_PROXY=/api/mangadex/

# Optional: Enable debug logging
NODE_ENV=development

# Optional: Custom app title
NEXT_PUBLIC_APP_TITLE=MangaReader
```

### Customization Options

**Theme Configuration** (`tailwind.config.js`):
```javascript
module.exports = {
  theme: {
    extend: {
      colors: {
        // Add custom brand colors
        primary: '#your-color',
        secondary: '#your-color',
      }
    }
  }
}
```

**API Configuration** (`src/config/api.ts`):
```typescript
export const API_CONFIG = {
  timeout: 30000,
  retries: 3,
  baseURL: process.env.NEXT_PUBLIC_MANGADEX_PROXY || '/api/mangadex/'
}
```

---

## 🧪 Development & Testing

### Code Quality

**Linting & Type Checking:**
```bash
npm run lint          # ESLint + TypeScript checks
npm run build         # Production build verification
```

**Testing Checklist:**
- [ ] All pages load without errors
- [ ] Theme toggle works in all browsers
- [ ] Mobile responsive design
- [ ] Chapter reader keyboard navigation
- [ ] Image loading with fallbacks
- [ ] API proxy functionality

### Browser Compatibility

| Browser | Status | Version |
|---------|--------|---------|
| **Chrome** | ✅ Full Support | 90+ |
| **Firefox** | ✅ Full Support | 88+ |
| **Safari** | ✅ Full Support | 14+ |
| **Edge** | ✅ Full Support | 90+ |
| **Mobile Safari** | ✅ Full Support | iOS 14+ |
| **Chrome Mobile** | ✅ Full Support | Android 8+ |

### Performance Optimization

**Built-in Optimizations:**
- **Automatic Code Splitting** - Pages load only required JavaScript
- **Image Optimization** - Smart loading with WebP support where available
- **CDN Caching** - Static assets cached globally
- **Bundle Analysis** - Run `npx @next/bundle-analyzer` after build

**Performance Monitoring:**
```bash
# Lighthouse audit
npx lighthouse http://localhost:3000 --view

# Bundle size analysis
npm run build
npx @next/bundle-analyzer
```

---

## 🔍 Troubleshooting

### Common Issues

**🖼️ Cover images show MangaDex placeholder**
```
Issue: "You can read this at MANGADEX" placeholder images
Cause: MangaDex hotlink protection blocking direct image requests
Solution: All cover URLs automatically routed through /api/image-proxy
Action: Hard refresh browser cache or wait for CDN refresh (24h TTL)
```

**🌐 CORS errors when accessing MangaDex API**
```
Issue: Cross-origin request blocked errors in browser console
Cause: Direct API calls from browser to api.mangadex.org
Solution: All API calls automatically use /api/mangadex/ proxy
Action: Ensure using mangadexService methods, not direct fetch calls
```

**⚡ Service worker 404 errors**
```
Issue: GET /sw.js 404 errors in development console
Cause: Legacy service worker registration from previous versions
Solution: Minimal sw.js file that self-unregisters
Action: Clear browser cache or ignore (doesn't affect functionality)
```

**🎨 Hydration warnings in console**
```
Issue: React hydration mismatch warnings
Cause: Theme icons rendering before client hydration complete
Solution: Icons render after useEffect to prevent SSR/CSR mismatch
Action: Warnings are harmless but can be reduced by clearing cache
```

**🐌 Slow initial page load**
```
Issue: First page load takes several seconds
Cause: Serverless function cold start on first request
Solution: Functions warm up after first use
Action: Subsequent requests are fast; consider upgrading Vercel plan
```

### Debug Mode

Enable debug logging:
```bash
# Set environment variable
NODE_ENV=development npm run dev

# Or create .env.local with:
# NODE_ENV=development
```

### Getting Help

- 🐛 **Bug Reports**: Open issue with reproduction steps and browser info
- 💡 **Feature Requests**: Describe use case and expected behavior
- 📚 **Documentation**: Check this README and inline code comments
- 🔧 **Technical Issues**: Include error messages, browser, and OS details

---

## 📊 Features in Detail

### Chapter Reader
- **Navigation**: Arrow keys (←/→), spacebar, mouse wheel
- **Zoom Controls**: Fit-to-width toggle, original size option  
- **Progress**: Current page indicator and chapter navigation
- **Keyboard Shortcuts**: H (help), F (fit toggle), Esc (exit)
- **Mobile**: Touch gestures, swipe navigation

### Manga Discovery
- **Browse Pages**: Popular, newest, recently updated with pagination
- **Search**: Real-time search with debounced API calls
- **Details Page**: Full manga info, chapter list, related series
- **Responsive Grid**: Adaptive layouts for all screen sizes

### Image Handling
- **Smart Loading**: Progressive loading with placeholders
- **Fallback System**: Multiple image format attempts (JPG, PNG, WebP)
- **CDN Optimization**: Aggressive caching with stale-while-revalidate
- **Proxy Protection**: Bypasses MangaDex hotlink restrictions

---

## 🤝 Contributing

Contributions are welcome! Please read our contributing guidelines before submitting PRs.

### Development Workflow

1. **Fork & Clone**
   ```bash
   git clone https://github.com/yourusername/read-only-manga.git
   cd read-only-manga/manga-reader-next
   ```

2. **Create Feature Branch**
   ```bash
   git checkout -b feature/amazing-new-feature
   ```

3. **Development**
   ```bash
   npm install
   npm run dev
   # Make your changes
   ```

4. **Test & Lint**
   ```bash
   npm run lint
   npm run build
   ```

5. **Submit PR**
   ```bash
   git add .
   git commit -m "Add amazing new feature"
   git push origin feature/amazing-new-feature
   # Create PR on GitHub
   ```

### Code Style

- **TypeScript**: Strict mode enabled, full type coverage required
- **ESLint**: Extended from Next.js recommended rules
- **Prettier**: Consistent code formatting (if configured)
- **Components**: Functional components with hooks preferred
- **File Names**: PascalCase for components, camelCase for utilities

---

## 📄 License & Legal

### License
**MIT License** - See [LICENSE](LICENSE) file for details. You are free to use, modify, and distribute this project for personal or commercial purposes.

### Data Attribution
- **Content Source**: All manga data provided by [MangaDex](https://mangadex.org/)
- **Respect Creators**: Please support original manga creators and publishers
- **API Usage**: Complies with MangaDex API terms of service
- **Images**: Cover images and manga pages remain property of respective copyright holders

### Technologies
Built with love using:
- [Next.js](https://nextjs.org/) - React framework
- [TypeScript](https://www.typescriptlang.org/) - Type safety
- [Tailwind CSS](https://tailwindcss.com/) - Utility-first CSS
- [Vercel](https://vercel.com/) - Deployment platform
- [MangaDex API](https://api.mangadex.org/docs/) - Data source

---

## 🌟 Support

If you find this project helpful, please consider:

⭐ **Starring the repository** to help others discover it

🐛 **Reporting bugs** to help improve the experience  

💡 **Suggesting features** to make it even better

🤝 **Contributing code** to join the development

📢 **Sharing with others** who might find it useful

---

**Made with ❤️ by developers, for manga readers**

*Last updated: September 2025*