import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import ErrorBoundary from './components/ErrorBoundary';
import Footer from './components/Footer';
import Homepage from './pages/Homepage';
import NewestPage from './pages/NewestPage';
import UpdatedPage from './pages/UpdatedPage';
import PopularPage from './pages/PopularPage';
import MangaDetails from './pages/MangaDetails';
import ChapterReader from './pages/ChapterReader';
import { ThemeProvider } from './hooks/useTheme';

function App() {
  return (
    <ThemeProvider>
      <Router>
        <ErrorBoundary>
          <div className="min-h-screen flex flex-col bg-white dark:bg-gray-900 transition-colors duration-200">
            <Navbar />
            <main className="flex-1">
              <Routes>
                <Route path="/" element={<Homepage />} />
                <Route path="/newest" element={<NewestPage />} />
                <Route path="/updated" element={<UpdatedPage />} />
                <Route path="/popular" element={<PopularPage />} />
                <Route path="/manga/:id" element={<MangaDetails />} />
                <Route path="/chapter/:id" element={<ChapterReader />} />
              </Routes>
            </main>
            <Footer />
          </div>
        </ErrorBoundary>
      </Router>
    </ThemeProvider>
  );
}

export default App;
