import React from 'react';
import { Heart, Github, Mail, Book, Star } from 'lucide-react';

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Logo and Description */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center space-x-2 mb-4">
              <Book className="h-8 w-8 text-blue-600 dark:text-blue-400" />
              <span className="text-2xl font-bold text-blue-700 dark:text-white">
                MangaReader
              </span>
            </div>
            <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">
              Discover and read your favorite manga online. Access thousands of manga titles 
              with our beautiful, user-friendly interface. Enjoy reading with dark mode, 
              mobile-friendly design, and seamless navigation.
            </p>
            <div className="flex items-center mt-3 text-sm text-gray-500 dark:text-gray-400">
              <span>Made with</span>
              <Heart className="h-4 w-4 text-red-500 mx-1" />
              <span>for manga lovers</span>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-sm font-semibold text-gray-900 dark:text-white uppercase tracking-wider mb-4">
              Browse
            </h3>
            <ul className="space-y-2">
              <li>
                <a
                  href="/"
                  className="text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors text-sm"
                >
                  Home
                </a>
              </li>
              <li>
                <a
                  href="/newest"
                  className="text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors text-sm"
                >
                  Newest Manga
                </a>
              </li>
              <li>
                <a
                  href="/updated"
                  className="text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors text-sm"
                >
                  Recently Updated
                </a>
              </li>
              <li>
                <span className="text-gray-600 dark:text-gray-400 text-sm flex items-center">
                  <Star className="h-3 w-3 mr-1 text-yellow-500" />
                  Popular Manga
                </span>
              </li>
            </ul>
          </div>

          {/* About & Legal */}
          <div>
            <h3 className="text-sm font-semibold text-gray-900 dark:text-white uppercase tracking-wider mb-4">
              Information
            </h3>
            <ul className="space-y-2">
              <li>
                <a
                  href="https://api.mangadex.org"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors text-sm"
                >
                  MangaDex API
                </a>
              </li>
              <li>
                <span className="text-gray-600 dark:text-gray-400 text-sm">
                  React & TypeScript
                </span>
              </li>
              <li>
                <span className="text-gray-600 dark:text-gray-400 text-sm">
                  TailwindCSS Design
                </span>
              </li>
              <li>
                <span className="text-gray-600 dark:text-gray-400 text-sm">
                  Open Source
                </span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
          <div className="flex flex-col sm:flex-row justify-between items-center">
            {/* Copyright */}
            <div className="text-gray-500 dark:text-gray-400 text-sm">
              © {currentYear} MangaReader. Built for educational purposes.
            </div>

            {/* Social Links */}
            <div className="flex items-center space-x-4 mt-4 sm:mt-0">
              <a
                href="https://github.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                aria-label="GitHub"
              >
                <Github className="h-5 w-5" />
              </a>
              <a
                href="mailto:contact@example.com"
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                aria-label="Email"
              >
                <Mail className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Disclaimer */}
          <div className="mt-4 text-xs text-gray-400 dark:text-gray-500 text-center sm:text-left">
            <p>
              All manga content is provided by MangaDex API. This site does not host any manga files. 
              All rights belong to their respective owners.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;