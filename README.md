# 📚 MangaReader - React Web Application

A modern, responsive manga reader web application built with React, TypeScript, and TailwindCSS. Browse, search, and read manga using the MangaDex API with a beautiful, user-friendly interface.

![MangaReader](https://img.shields.io/badge/React-18.2.0-blue.svg)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue.svg)
![TailwindCSS](https://img.shields.io/badge/TailwindCSS-3.0-blue.svg)
![License](https://img.shields.io/badge/License-MIT-green.svg)

## ✨ Features

### 🎯 Core Features
- **Browse Popular Manga**: Discover trending and most-followed manga
- **Latest Releases**: Stay updated with newest and recently updated manga
- **Advanced Search**: Find manga by title with real-time search
- **Chapter Reader**: Read manga chapters with smooth navigation
- **Responsive Design**: Perfect experience on desktop, tablet, and mobile
- **Dark Mode**: Toggle between light and dark themes

### 🎨 User Interface
- **Modern Design**: Clean, intuitive interface with smooth animations
- **Grid & List Views**: Switch between different viewing modes
- **Pagination**: Navigate through large manga collections efficiently
- **Image Carousel**: Beautiful carousel for popular manga showcase
- **Smart Image Loading**: Fallback mechanisms for better image reliability

### 📖 Reading Experience
- **Chapter Navigation**: Easy prev/next chapter navigation
- **Zoom Controls**: Zoom in/out functionality for better reading
- **Keyboard Support**: Use arrow keys and spacebar for navigation
- **Scroll to Top**: Automatic scroll to top when changing pages
- **Loading States**: Smooth loading indicators throughout the app

## 🚀 Getting Started

### Prerequisites
- Node.js (version 16 or higher)
- npm or yarn package manager

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/raf-mos/Read-only-manga.git
   cd Read-only-manga/manga-reader
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   ```

3. **Start the development server**
   ```bash
   npm start
   # or
   yarn start
   ```

4. **Open your browser**
   Navigate to `http://localhost:3000` to view the application.

## 🛠️ Built With

### Frontend Technologies
- **React 18.2** - Modern JavaScript library for building user interfaces
- **TypeScript** - Type-safe JavaScript for better development experience
- **React Router DOM** - Client-side routing for single-page application
- **TailwindCSS** - Utility-first CSS framework for rapid UI development
- **Axios** - HTTP client for API requests
- **Lucide React** - Beautiful, customizable icons

### API & Data
- **MangaDX API** - Comprehensive manga database and image serving
- **CORS Proxy** - Handle cross-origin requests in development

## 📁 Project Structure

```
manga-reader/
├── public/
│   ├── index.html
│   └── favicon.ico
├── src/
│   ├── components/          # Reusable UI components
│   │   ├── Navbar.tsx
│   │   ├── Footer.tsx
│   │   ├── Carousel.tsx
│   │   ├── MangaCard.tsx
│   │   ├── MangaGrid.tsx
│   │   ├── Pagination.tsx
│   │   ├── Loading.tsx
│   │   └── SmartImage.tsx
│   ├── pages/              # Page components
│   │   ├── Homepage.tsx
│   │   ├── NewestPage.tsx
│   │   ├── UpdatedPage.tsx
│   │   ├── PopularPage.tsx
│   │   ├── MangaDetails.tsx
│   │   └── ChapterReader.tsx
│   ├── services/           # API services
│   │   └── mangadx.ts
│   ├── types/              # TypeScript type definitions
│   │   └── index.ts
│   ├── hooks/              # Custom React hooks
│   │   └── useTheme.tsx
│   ├── App.tsx
│   ├── index.tsx
│   └── index.css
├── package.json
└── README.md
```

## 🎮 Usage Guide

### Navigation
- **Homepage**: Browse popular and recently updated manga
- **Newest**: Discover the latest manga releases
- **Updated**: Find recently updated manga chapters
- **Popular**: Explore most-followed manga on MangaDx
- **Search**: Use the search bar to find specific manga

### Reading Manga
1. Click on any manga card to view details
2. Browse available chapters
3. Click on a chapter to start reading
4. Use navigation controls or keyboard shortcuts:
   - **Arrow Keys**: Navigate between pages
   - **Spacebar**: Next page
   - **Zoom Controls**: Adjust image size

### Customization
- **Theme Toggle**: Switch between light and dark modes
- **View Toggle**: Change between grid and list layouts
- **Responsive**: Automatically adapts to your screen size

## 🔧 Configuration

### Environment Variables
Create a `.env` file in the root directory:
```env
REACT_APP_API_BASE_URL=https://api.mangadex.org
REACT_APP_IMAGE_PROXY_URL=https://uploads.mangadex.org
```

### Customizing Theme
Edit `src/index.css` to modify the color scheme:
```css
:root {
  --primary-color: #2563eb;    /* Blue theme */
  --secondary-color: #1e40af;  /* Darker blue */
  /* Add your custom colors */
}
```

## 📱 Responsive Breakpoints

- **Mobile**: < 768px
- **Tablet**: 768px - 1024px  
- **Desktop**: > 1024px
- **Large Desktop**: > 1280px

## 🚀 Deployment

### Vercel (Recommended)
1. Push your code to GitHub
2. Connect your repository to Vercel
3. Deploy with automatic builds

### Netlify
1. Build the project: `npm run build`
2. Upload the `build` folder to Netlify
3. Configure redirects for React Router

### Manual Deployment
```bash
npm run build
# Upload the contents of the 'build' folder to your hosting provider
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit your changes: `git commit -m 'Add amazing feature'`
4. Push to the branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **MangaDX API** - For providing comprehensive manga data
- **React Team** - For the amazing React framework
- **TailwindCSS** - For the utility-first CSS framework
- **Lucide Icons** - For beautiful, customizable icons

## 📞 Support

If you encounter any issues or have questions:
- Create an issue on GitHub
- Check the [MangaDx API Documentation](https://api.mangadx.org/docs/)

## 🔮 Future Enhancements

- [ ] User authentication and favorites
- [ ] Reading progress tracking
- [ ] Offline reading capability  
- [ ] Advanced filtering options
- [ ] Reading recommendations
- [ ] Multi-language support
- [ ] Reading statistics

---

**Made with ❤️ for manga lovers**
