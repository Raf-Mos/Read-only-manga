import axios from 'axios';
import { MangaResponse, Manga, ChapterResponse, ChapterImagesResponse } from '../types';

// Use proxy API in production, direct API in development
const BASE_URL = process.env.NODE_ENV === 'production' 
  ? '/api/mangadex' 
  : 'https://api.mangadex.org';


console.log('Environment:', process.env.NODE_ENV);
console.log('API Base URL:', BASE_URL);

// Create axios instance with default config
const api = axios.create({
  baseURL: BASE_URL,
  timeout: 30000, // Increased timeout for Vercel
  headers: {
    Accept: 'application/json',
  },
  withCredentials: false,
});

// Small runtime helpers to validate upstream responses
function ensureArray<T>(value: any, fallback: T[] = []): T[] {
  return Array.isArray(value) ? value : fallback;
}

function ensureObject<T extends object>(value: any, errorMessage: string): T {
  if (value && typeof value === 'object') return value as T;
  throw new Error(errorMessage);
}

export const mangadexService = {
  // Get popular manga (most followed)
  async getPopularManga(): Promise<Manga[]> {
    try {
      // IMPORTANT: do NOT start path with '/' so axios baseURL is used
      const response = await api.get<MangaResponse>('manga', {
        params: {
          'order[followedCount]': 'desc',
          limit: 10,
          includes: ['cover_art', 'author', 'artist'],
          contentRating: ['safe', 'suggestive'],
        },
      });
      const safe = ensureObject<MangaResponse>(response.data, 'Invalid response for popular manga');
      return ensureArray<Manga>(safe.data);
    } catch (error) {
      console.error('Error fetching popular manga:', error);
      throw new Error('Failed to fetch popular manga');
    }
  },

  // Get recently updated manga
  async getRecentlyUpdatedManga(): Promise<Manga[]> {
    try {
      const response = await api.get<MangaResponse>('manga', {
        params: {
          'order[updatedAt]': 'desc',
          limit: 10,
          includes: ['cover_art', 'author', 'artist'],
          contentRating: ['safe', 'suggestive'],
        },
      });
      const safe = ensureObject<MangaResponse>(response.data, 'Invalid response for recently updated manga');
      return ensureArray<Manga>(safe.data);
    } catch (error) {
      console.error('Error fetching recently updated manga:', error);
      throw new Error('Failed to fetch recently updated manga');
    }
  },

  // Get manga details by ID
  async getMangaById(id: string): Promise<Manga> {
    try {
      const response = await api.get<{ data: Manga }>(`manga/${id}`, {
        params: {
          includes: ['cover_art', 'author', 'artist'],
        },
      });
      const safe = ensureObject<{ data: Manga }>(response.data, 'Invalid response for manga details');
      return safe.data;
    } catch (error) {
      console.error('Error fetching manga details:', error);
      throw new Error('Failed to fetch manga details');
    }
  },

  // Get chapters for a manga
  async getMangaChapters(mangaId: string, offset: number = 0): Promise<ChapterResponse> {
    try {
      const response = await api.get<ChapterResponse>(`manga/${mangaId}/feed`, {
        params: {
          limit: 100,
          offset,
          'order[chapter]': 'desc',
          translatedLanguage: ['en'],
          includes: ['scanlation_group'],
          contentRating: ['safe', 'suggestive', 'erotica'],
        },
      });
      const safe = ensureObject<ChapterResponse>(response.data, 'Invalid response for manga chapters');
      const validChapters = ensureArray<import('../types').Chapter>(safe.data).filter((chapter) => 
        chapter.attributes.pages > 0 && 
        !chapter.attributes.externalUrl
      );
      return {
        ...safe,
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
      const response = await api.get<ChapterImagesResponse>(`at-home/server/${chapterId}`);
      return ensureObject<ChapterImagesResponse>(response.data, 'Invalid response for chapter images');
    } catch (error: any) {
      console.error('Error fetching chapter images:', error);
      throw new Error(`Failed to fetch chapter images: ${error.message}`);
    }
  },

  // Search manga by title
  async searchManga(title: string): Promise<Manga[]> {
    try {
      const response = await api.get<MangaResponse>('manga', {
        params: {
          title,
          limit: 20,
          includes: ['cover_art', 'author', 'artist'],
          contentRating: ['safe', 'suggestive'],
        },
      });
      const safe = ensureObject<MangaResponse>(response.data, 'Invalid response for search');
      return ensureArray<Manga>(safe.data);
    } catch (error) {
      console.error('Error searching manga:', error);
      throw new Error('Failed to search manga');
    }
  },

  // Get newest manga with pagination
  async getNewestManga(page: number = 1, limit: number = 10): Promise<MangaResponse> {
    try {
      const offset = (page - 1) * limit;
      const response = await api.get<MangaResponse>('manga', {
        params: {
          'order[createdAt]': 'desc',
          limit,
          offset,
          includes: ['cover_art', 'author', 'artist'],
          contentRating: ['safe', 'suggestive']
        },
      });
      const safe = ensureObject<MangaResponse>(response.data, 'Invalid response for newest manga');
      // Make sure data is an array to keep downstream safe
      safe.data = ensureArray<Manga>(safe.data);
      return safe;
    } catch (error) {
      console.error('Error fetching newest manga:', error);
      throw new Error('Failed to fetch newest manga');
    }
  },

  // Get recently updated manga with pagination
  async getUpdatedManga(page: number = 1, limit: number = 10): Promise<MangaResponse> {
    try {
      const offset = (page - 1) * limit;
      const response = await api.get<MangaResponse>('manga', {
        params: {
          'order[updatedAt]': 'desc',
          limit,
          offset,
          includes: ['cover_art', 'author', 'artist'],
          contentRating: ['safe', 'suggestive'],
        },
      });
      const safe = ensureObject<MangaResponse>(response.data, 'Invalid response for updated manga');
      safe.data = ensureArray<Manga>(safe.data);
      return safe;
    } catch (error) {
      console.error('Error fetching updated manga:', error);
      throw new Error('Failed to fetch updated manga');
    }
  },

  // Get popular manga with pagination
  async getPopularMangaPaginated(page: number = 1, limit: number = 10): Promise<MangaResponse> {
    try {
      const offset = (page - 1) * limit;
      const response = await api.get<MangaResponse>('manga', {
        params: {
          'order[followedCount]': 'desc',
          limit,
          offset,
          includes: ['cover_art', 'author', 'artist'],
          contentRating: ['safe', 'suggestive'],
        },
      });
      const safe = ensureObject<MangaResponse>(response.data, 'Invalid response for popular manga (paginated)');
      safe.data = ensureArray<Manga>(safe.data);
      return safe;
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
    const titleObj: any = manga?.attributes?.title || {};
    const first = typeof titleObj === 'object' ? Object.values(titleObj)[0] : undefined;
    return (
      titleObj.en || titleObj['ja-ro'] || titleObj.ja || (typeof first === 'string' ? first : '') || 'Unknown Title'
    );
  },

  getEnglishDescription(manga: Manga): string {
    const descObj: any = manga?.attributes?.description || {};
    const first = typeof descObj === 'object' ? Object.values(descObj)[0] : undefined;
    return (
      descObj.en || descObj['ja-ro'] || descObj.ja || (typeof first === 'string' ? first : '') || 'No description available'
    );
  },

  getCoverArt(manga: Manga): string | null {
    const coverRelation = Array.isArray(manga.relationships)
      ? manga.relationships.find((rel: any) => rel.type === 'cover_art')
      : undefined;
    if (coverRelation?.attributes?.fileName) {
      return this.getCoverImageUrl(manga.id, coverRelation.attributes.fileName);
    }
    return null;
  },

  getAuthors(manga: Manga): string[] {
    return (Array.isArray(manga.relationships) ? manga.relationships : [])
      .filter((rel: any) => rel.type === 'author')
      .map((rel: any) => rel.attributes?.name)
      .filter(Boolean);
  },

  getArtists(manga: Manga): string[] {
    return (Array.isArray(manga.relationships) ? manga.relationships : [])
      .filter((rel: any) => rel.type === 'artist')
      .map((rel: any) => rel.attributes?.name)
      .filter(Boolean);
  }
};

export default mangadexService;