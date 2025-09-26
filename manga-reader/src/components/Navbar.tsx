import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, Moon, Sun, Book, Menu, X } from 'lucide-react';
import { useTheme } from '../hooks/useTheme';

const Navbar: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { isDarkMode, toggleDarkMode } = useTheme();
  const navigate = useNavigate();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/?search=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  return (
    <nav className="bg-gradient-to-r from-white to-blue-50 dark:from-gray-800 dark:to-gray-800 shadow-lg border-b-2 border-blue-200 dark:border-gray-700">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo and Navigation */}
          <div className="flex items-center space-x-8">
            <Link 
              to="/" 
              className="flex items-center space-x-2 text-xl font-bold text-blue-700 dark:text-white hover:text-blue-800 dark:hover:text-blue-400 transition-colors"
            >
              <Book className="h-6 w-6 text-blue-600 dark:text-white" />
              <span>MangaReader</span>
            </Link>

            {/* Navigation Links */}
            <div className="hidden md:flex items-center space-x-6">
              <Link
                to="/newest"
                className="text-blue-600 dark:text-white hover:text-blue-800 dark:hover:text-blue-400 transition-colors font-semibold"
              >
                Newest
              </Link>
              <Link
                to="/updated"
                className="text-blue-600 dark:text-white hover:text-blue-800 dark:hover:text-blue-400 transition-colors font-semibold"
              >
                Updated
              </Link>
            </div>
          </div>

          {/* Search Bar */}
          <form onSubmit={handleSearch} className="flex-1 max-w-lg mx-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search manga..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border-2 border-blue-200 dark:border-gray-600 rounded-lg bg-blue-50 dark:bg-gray-700 text-gray-900 dark:text-white placeholder-blue-400 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-400 focus:bg-white transition-all"
              />
            </div>
          </form>

          {/* Right side buttons */}
          <div className="flex items-center space-x-2">
            {/* Dark Mode Toggle */}
            <button
              onClick={toggleDarkMode}
              className="p-2 rounded-lg bg-blue-100 dark:bg-gray-700 text-blue-600 dark:text-gray-300 hover:bg-blue-200 dark:hover:bg-gray-600 transition-colors"
              aria-label="Toggle dark mode"
            >
              {isDarkMode ? (
                <Sun className="h-5 w-5" />
              ) : (
                <Moon className="h-5 w-5" />
              )}
            </button>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-lg bg-blue-100 dark:bg-gray-700 text-blue-600 dark:text-gray-300 hover:bg-blue-200 dark:hover:bg-gray-600 transition-colors"
              aria-label="Toggle mobile menu"
            >
              {mobileMenuOpen ? (
                <X className="h-5 w-5" />
              ) : (
                <Menu className="h-5 w-5" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t-2 border-blue-200 dark:border-gray-700 bg-blue-50 dark:bg-gray-800">
            <div className="px-2 pt-2 pb-3 space-y-1">
              <Link
                to="/newest"
                className="block px-3 py-2 text-blue-600 dark:text-white hover:text-blue-800 dark:hover:text-blue-400 hover:bg-blue-100 dark:hover:bg-gray-700 rounded-md transition-colors font-semibold"
                onClick={() => setMobileMenuOpen(false)}
              >
                Newest
              </Link>
              <Link
                to="/updated"
                className="block px-3 py-2 text-blue-600 dark:text-white hover:text-blue-800 dark:hover:text-blue-400 hover:bg-blue-100 dark:hover:bg-gray-700 rounded-md transition-colors font-semibold"
                onClick={() => setMobileMenuOpen(false)}
              >
                Updated
              </Link>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;