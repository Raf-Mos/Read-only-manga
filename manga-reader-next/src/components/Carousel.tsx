import { useEffect, useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import type { Manga } from '@/types';
import MangaCardCarousel from '@/components/MangaCardCarousel';

export default function Carousel({ manga, title, icon }: { manga: Manga[]; title: string; icon?: React.ReactNode }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [itemsPerView, setItemsPerView] = useState(1);

  useEffect(() => {
    const updateItemsPerView = () => {
      if (window.innerWidth >= 1536) setItemsPerView(5);
      else if (window.innerWidth >= 1280) setItemsPerView(4);
      else if (window.innerWidth >= 1024) setItemsPerView(3);
      else if (window.innerWidth >= 768) setItemsPerView(2);
      else setItemsPerView(1);
    };
    updateItemsPerView();
    window.addEventListener('resize', updateItemsPerView);
    return () => window.removeEventListener('resize', updateItemsPerView);
  }, []);

  const safeLength = Array.isArray(manga) ? manga.length : 0;
  const maxIndex = Math.max(0, safeLength - itemsPerView);

  const nextSlide = () => setCurrentIndex((prev) => Math.min(prev + 1, maxIndex));
  const prevSlide = () => setCurrentIndex((prev) => Math.max(prev - 1, 0));
  const goToSlide = (index: number) => setCurrentIndex(Math.min(Math.max(0, index), maxIndex));

  if (safeLength === 0) return null;

  return (
    <section className="mb-12">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center">
          {icon}
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white ml-2">{title}</h2>
        </div>
        <div className="flex items-center space-x-2">
          <button onClick={prevSlide} disabled={currentIndex === 0} className={`p-2 rounded-full transition-colors ${currentIndex === 0 ? 'bg-gray-200 dark:bg-gray-700 text-gray-400 cursor-not-allowed' : 'bg-blue-600 text-white hover:bg-blue-700'}`} aria-label="Previous slide">
            <ChevronLeft className="h-5 w-5" />
          </button>
          <button onClick={nextSlide} disabled={currentIndex >= maxIndex} className={`p-2 rounded-full transition-colors ${currentIndex >= maxIndex ? 'bg-gray-200 dark:bg-gray-700 text-gray-400 cursor-not-allowed' : 'bg-blue-600 text-white hover:bg-blue-700'}`} aria-label="Next slide">
            <ChevronRight className="h-5 w-5" />
          </button>
        </div>
      </div>
      <div className="relative overflow-hidden">
        <div className="flex transition-transform duration-500 ease-in-out" style={{ transform: `translateX(-${currentIndex * (100 / itemsPerView)}%)` }}>
          {manga.map((mangaItem) => (
            <div key={mangaItem.id} className={`flex-shrink-0 px-2 ${itemsPerView === 1 ? 'w-full' : itemsPerView === 2 ? 'w-1/2' : itemsPerView === 3 ? 'w-1/3' : itemsPerView === 4 ? 'w-1/4' : 'w-1/5'}`}>
              <MangaCardCarousel manga={mangaItem} />
            </div>
          ))}
        </div>
      </div>
      {maxIndex > 0 && (
        <div className="flex justify-center mt-6 space-x-2">
          {Array.from({ length: maxIndex + 1 }, (_, index) => (
            <button key={index} onClick={() => goToSlide(index)} className={`w-2 h-2 rounded-full transition-colors ${index === currentIndex ? 'bg-blue-600' : 'bg-gray-300 dark:bg-gray-600 hover:bg-gray-400 dark:hover:bg-gray-500'}`} aria-label={`Go to slide ${index + 1}`} />
          ))}
        </div>
      )}
    </section>
  );
}
