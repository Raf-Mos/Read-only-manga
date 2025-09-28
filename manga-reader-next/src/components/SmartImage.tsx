import { useEffect, useState } from 'react';

export default function SmartImage({
  src,
  alt,
  className = '',
  fallbackSrcs = [],
  placeholder = 'https://via.placeholder.com/300x400/1F2937/9CA3AF?text=No+Cover',
}: {
  src: string | null;
  alt: string;
  className?: string;
  fallbackSrcs?: string[];
  placeholder?: string;
}) {
  const [currentSrc, setCurrentSrc] = useState<string | null>(src);
  const [currentFallbackIndex, setCurrentFallbackIndex] = useState(-1);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    setCurrentSrc(src);
    setCurrentFallbackIndex(-1);
    setHasError(false);
  }, [src]);

  const handleError = () => {
    if (currentFallbackIndex + 1 < fallbackSrcs.length) {
      const nextIndex = currentFallbackIndex + 1;
      setCurrentFallbackIndex(nextIndex);
      setCurrentSrc(fallbackSrcs[nextIndex]);
    } else {
      setCurrentSrc(placeholder);
      setHasError(true);
    }
  };

  if (!currentSrc) {
    return (
      <div className={`bg-gradient-to-br from-gray-200 to-gray-300 dark:from-gray-600 dark:to-gray-700 flex items-center justify-center ${className}`}>
        <span className="text-gray-500 dark:text-gray-400 text-sm">No Image</span>
      </div>
    );
  }

  return (
    <img
      src={currentSrc}
      alt={alt}
      className={hasError ? `${className} object-contain bg-gray-800 dark:bg-gray-700` : className}
      onError={handleError}
      loading="lazy"
    />
  );
}
