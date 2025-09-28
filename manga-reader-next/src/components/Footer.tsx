import Link from 'next/link';

export default function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="mt-8 border-t border-gray-200 dark:border-gray-700 bg-white/70 dark:bg-gray-900/50 backdrop-blur">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 text-sm">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="text-gray-600 dark:text-gray-400">
            <p className="font-medium text-gray-900 dark:text-white">MangaReader</p>
            <p className="mt-1">Built with Next.js + Tailwind CSS.</p>
            <p className="mt-1">Manga metadata and images courtesy of <a href="https://mangadex.org" target="_blank" rel="noreferrer" className="text-blue-600 dark:text-blue-400 hover:underline">MangaDex</a>.</p>
            <p className="mt-1 text-xs">This site is a reader client. No copyrighted content is hosted here.</p>
          </div>
          <nav className="flex flex-wrap items-center gap-4 text-gray-600 dark:text-gray-300">
            <Link href="/" className="hover:text-blue-600 dark:hover:text-blue-400">Home</Link>
            <Link href="/newest" className="hover:text-blue-600 dark:hover:text-blue-400">Newest</Link>
            <Link href="/updated" className="hover:text-blue-600 dark:hover:text-blue-400">Updated</Link>
            <Link href="/popular" className="hover:text-blue-600 dark:hover:text-blue-400">Popular</Link>
          </nav>
        </div>
        <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700 text-gray-500 dark:text-gray-400 text-center">
          © {year} MangaReader — All rights reserved.
        </div>
      </div>
    </footer>
  );
}
