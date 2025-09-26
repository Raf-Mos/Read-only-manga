import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Homepage from './pages/Homepage';
import NewestPage from './pages/NewestPage';
import UpdatedPage from './pages/UpdatedPage';
import MangaDetails from './pages/MangaDetails';
import ChapterReader from './pages/ChapterReader';
import { ThemeProvider } from './hooks/useTheme';

function App() {
  return (
    <ThemeProvider>
      <Router>
        <div className="min-h-screen bg-white dark:bg-gray-900 transition-colors duration-200">
          <Navbar />
          <Routes>
            <Route path="/" element={<Homepage />} />
            <Route path="/newest" element={<NewestPage />} />
            <Route path="/updated" element={<UpdatedPage />} />
            <Route path="/manga/:id" element={<MangaDetails />} />
            <Route path="/chapter/:id" element={<ChapterReader />} />
          </Routes>
        </div>
      </Router>
    </ThemeProvider>
  );
}

export default App;
