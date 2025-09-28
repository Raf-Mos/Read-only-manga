import axios, { AxiosError } from 'axios';
import { MangaResponse, Manga, ChapterResponse, ChapterImagesResponse } from '../types';

// Detect hosting platform
const isVercel = typeof window !== 'undefined' && (
  window.location.hostname.includes('vercel.app') ||
  window.location.hostname.includes('.vercel.app') ||
  process.env.REACT_APP_VERCEL === 'true'
);

const isHostinger = typeof window !== 'undefined' && (
  window.location.hostname.includes('.hostingerapp.com') ||
  process.env.REACT_APP_HOSTINGER === 'true'
);

// Enhanced URL configuration for different hosting platforms
const BASE_URL = (() => {
  if (process.env.NODE_ENV === 'development') {
    return 'https://api.mangadex.org';
  }
  
  // In production, use different strategies based on hosting platform
  if (isVercel) {
    return '/api/mangadex'; // Use Vercel serverless function
  }
  
  // For traditional hosting (like Hostinger), use direct API
  return 'https://api.mangadex.org';
})();

console.log('Environment:', process.env.NODE_ENV);
console.log('Is Vercel:', isVercel);
console.log('Is Hostinger:', isHostinger);
console.log('API Base URL:', BASE_URL);

// Create axios instance with default config
const api = axios.create({
  baseURL: BASE_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
  }
});

// Enhanced error handling with fallback mechanisms
const handleApiError = async (error: AxiosError, originalConfig: any, retryCount = 0): Promise<any> => {
  console.error('API Error:', error.message, error.config?.url);
  
  // If it's a CORS error and we're in production on traditional hosting
  if ((error.message.includes('CORS') || error.message.includes('Network Error')) && 
      retryCount < 2 && 
      process.env.NODE_ENV === 'production' && 
      !isVercel) {
    
    console.log(`CORS error detected, trying with CORS proxy (attempt ${retryCount + 1})...`);
    
    // Try with different CORS proxy services
    const corsProxies = [
      'https://api.allorigins.win/raw?url=',
      'https://thingproxy.freeboard.io/fetch/',
    ];
    
    if (retryCount < corsProxies.length) {
      const proxyUrl = corsProxies[retryCount];
      const originalUrl = originalConfig.url.startsWith('http') 
        ? originalConfig.url 
        : `https://api.mangadex.org${originalConfig.url}`;
      
      try {
        const response = await axios({
          ...originalConfig,
          baseURL: '',
          url: `${proxyUrl}${encodeURIComponent(originalUrl)}`,
          timeout: 45000,
          headers: {
            'Content-Type': 'application/json'
          }
        });
        console.log('CORS proxy request successful');
        return response;
      } catch (proxyError) {
        console.error(`CORS proxy ${proxyUrl} failed:`, proxyError);
        // Try next proxy
        return handleApiError(error, originalConfig, retryCount + 1);
      }
    }
  }
  
  // If all retry attempts failed, throw a user-friendly error
  const userMessage = error.message.includes('CORS') || error.message.includes('Network Error')
    ? 'Unable to connect to the manga API. This may be due to network restrictions on your hosting provider.'
    : `API request failed: ${error.message}`;
    
  throw new Error(userMessage);
};

// Add response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalConfig = error.config;
    if (!originalConfig._retry) {
      originalConfig._retry = true;
      return handleApiError(error, originalConfig);
    }
    return Promise.reject(error);
  }
);

export const mangadxService = {
  // Get popular manga (most followed)
  async getPopularManga(): Promise<Manga[]> {
    try {
      const response = await api.get<MangaResponse>('/manga', {
        params: {
          'order[followedCount]': 'desc',
          limit: 10,
          includes: ['cover_art', 'author', 'artist'],
          contentRating: ['safe', 'suggestive'],
        },
      });
      return response.data.data;
    } catch (error) {
      console.error('Error fetching popular manga:', error);
      throw new Error('Failed to fetch popular manga');
    }
  },

  // Get recently updated manga
  async getRecentlyUpdatedManga(): Promise<Manga[]> {
    try {
      const response = await api.get<MangaResponse>('/manga', {
        params: {
          'order[updatedAt]': 'desc',
          limit: 10,
          includes: ['cover_art', 'author', 'artist'],
          contentRating: ['safe', 'suggestive'],
        },
      });
      return response.data.data;
    } catch (error) {
      console.error('Error fetching recently updated manga:', error);
      throw new Error('Failed to fetch recently updated manga');
    }
  },

  // Get manga details by ID
  async getMangaById(id: string): Promise<Manga> {
    try {
      const response = await api.get<{ data: Manga }>(`/manga/${id}`, {
        params: {
          includes: ['cover_art', 'author', 'artist'],
        },
      });
      return response.data.data;
    } catch (error) {
      console.error('Error fetching manga details:', error);
      throw new Error('Failed to fetch manga details');
    }
  },

  // Get chapters for a manga
  async getMangaChapters(mangaId: string, offset: number = 0): Promise<ChapterResponse> {
    try {
      const response = await api.get<ChapterResponse>(`/manga/${mangaId}/feed`, {
        params: {
          limit: 100,
          offset,
          'order[chapter]': 'desc',
          translatedLanguage: ['en'],
          includes: ['scanlation_group'],
          contentRating: ['safe', 'suggestive', 'erotica'],
        },
      });
      
      const validChapters = response.data.data.filter(chapter => 
        chapter.attributes.pages > 0 && 
        !chapter.attributes.externalUrl
      );
      
      return {
        ...response.data,
        data: validChapters
      };
    } catch (error) {
      console.error('Error fetching manga chapters:', error);
      throw new Error('Failed to fetch manga chapters');
    }
  },

  // Get chapter images
  async getChapterImages(chapterId: string): Promise<ChapterImagesResponse> {
    try {
      const response = await api.get<ChapterImagesResponse>(`/at-home/server/${chapterId}`);
      return response.data;
    } catch (error: any) {
      console.error('Error fetching chapter images:', error);
      throw new Error(`Failed to fetch chapter images: ${error.message}`);
    }
  },

  // Search manga by title
  async searchManga(title: string): Promise<Manga[]> {
    try {
      const response = await api.get<MangaResponse>('/manga', {
        params: {
          title,
          limit: 20,
          includes: ['cover_art', 'author', 'artist'],
          contentRating: ['safe', 'suggestive'],
        },
      });
      return response.data.data;
    } catch (error) {
      console.error('Error searching manga:', error);
      throw new Error('Failed to search manga');
    }
  },

  // Get newest manga with pagination
  async getNewestManga(page: number = 1, limit: number = 10): Promise<MangaResponse> {
    try {
      const offset = (page - 1) * limit;
      const response = await api.get<MangaResponse>('/manga', {
        params: {
          'order[createdAt]': 'desc',
          limit,
          offset,
          includes: ['cover_art', 'author', 'artist'],
          contentRating: ['safe', 'suggestive']
        },
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching newest manga:', error);
      throw new Error('Failed to fetch newest manga');
    }
  },

  // Get recently updated manga with pagination
  async getUpdatedManga(page: number = 1, limit: number = 10): Promise<MangaResponse> {
    try {
      const offset = (page - 1) * limit;
      const response = await api.get<MangaResponse>('/manga', {
        params: {
          'order[updatedAt]': 'desc',
          limit,
          offset,
          includes: ['cover_art', 'author', 'artist'],
          contentRating: ['safe', 'suggestive'],
        },
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching updated manga:', error);
      throw new Error('Failed to fetch updated manga');
    }
  },

  // Get popular manga with pagination
  async getPopularMangaPaginated(page: number = 1, limit: number = 10): Promise<MangaResponse> {
    try {
      const offset = (page - 1) * limit;
      const response = await api.get<MangaResponse>('/manga', {
        params: {
          'order[followedCount]': 'desc',
          limit,
          offset,
          includes: ['cover_art', 'author', 'artist'],
          contentRating: ['safe', 'suggestive'],
        },
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching popular manga:', error);
      throw new Error('Failed to fetch popular manga');
    }
  },

  // Get cover image URL
  getCoverImageUrl(mangaId: string, fileName: string, size: 'small' | 'medium' | 'large' = 'medium'): string {
    const sizeMap = {
      small: '256',
      medium: '512', 
      large: '1024'
    };
    return `https://uploads.mangadex.org/covers/${mangaId}/${fileName}.${sizeMap[size]}.jpg`;
  },

  // Get cover image URL with fallback
  getCoverImageUrlWithFallback(mangaId: string, fileName: string, size: 'small' | 'medium' | 'large' = 'medium'): string[] {
    const sizeMap = {
      small: '256',
      medium: '512', 
      large: '1024'
    };
    const baseUrl = `https://uploads.mangadex.org/covers/${mangaId}/${fileName}`;
    return [
      `${baseUrl}.${sizeMap[size]}.jpg`,
      `${baseUrl}.jpg`,
      `${baseUrl}.png`,
      `${baseUrl}.webp`
    ];
  },

  // Get chapter page URL
  getChapterPageUrl(baseUrl: string, chapterHash: string, fileName: string, dataSaver: boolean = false): string {
    const quality = dataSaver ? 'data-saver' : 'data';
    return `${baseUrl}/${quality}/${chapterHash}/${fileName}`;
  },

  // Helper functions
  getEnglishTitle(manga: Manga): string {
    const titleObj = manga.attributes.title;
    return titleObj.en || titleObj['ja-ro'] || titleObj.ja || Object.values(titleObj)[0] || 'Unknown Title';
  },

  getEnglishDescription(manga: Manga): string {
    const descObj = manga.attributes.description;
    return descObj.en || descObj['ja-ro'] || descObj.ja || Object.values(descObj)[0] || 'No description available';
  },

  getCoverArt(manga: Manga): string | null {
    const coverRelation = manga.relationships.find((rel: any) => rel.type === 'cover_art');
    if (coverRelation?.attributes?.fileName) {
      return this.getCoverImageUrl(manga.id, coverRelation.attributes.fileName);
    }
    return null;
  },

  getAuthors(manga: Manga): string[] {
    return manga.relationships
      .filter((rel: any) => rel.type === 'author')
      .map((rel: any) => rel.attributes?.name)
      .filter(Boolean);
  },

  getArtists(manga: Manga): string[] {
    return manga.relationships
      .filter((rel: any) => rel.type === 'artist')
      .map((rel: any) => rel.attributes?.name)
      .filter(Boolean);
  }
};

export default mangadxService;