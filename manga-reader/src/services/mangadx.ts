import axios from 'axios';
import { MangaResponse, Manga, ChapterResponse, ChapterImagesResponse } from '../types';

const BASE_URL = 'https://api.mangadex.org';

// Create axios instance with default config
const api = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,
});

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
      
      // Filter out chapters that don't have pages or are external links
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
      console.log('Fetching chapter images for ID:', chapterId);
      const response = await api.get<ChapterImagesResponse>(`/at-home/server/${chapterId}`);
      console.log('Chapter images response:', response.data);
      return response.data;
    } catch (error: any) {
      console.error('Detailed error fetching chapter images:', error);
      console.error('Chapter ID:', chapterId);
      if (error.response) {
        console.error('Error response status:', error.response.status);
        console.error('Error response data:', error.response.data);
      }
      throw new Error(`Failed to fetch chapter images for chapter ${chapterId}: ${error.message || 'Unknown error'}`);
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

  // Get newest manga with pagination (sorted by creation date)
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
    } catch (error: any) {
      console.error('Detailed error fetching newest manga:', error);
      if (error.response) {
        console.error('Error response:', error.response.data);
        console.error('Error status:', error.response.status);
      }
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

  // Get popular manga with pagination (sorted by followed count)
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

  // Get cover image URL with multiple format fallback
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

  // Helper function to get English title or fallback
  getEnglishTitle(manga: Manga): string {
    const titleObj = manga.attributes.title;
    return titleObj.en || titleObj['ja-ro'] || titleObj.ja || Object.values(titleObj)[0] || 'Unknown Title';
  },

  // Helper function to get English description or fallback
  getEnglishDescription(manga: Manga): string {
    const descObj = manga.attributes.description;
    return descObj.en || descObj['ja-ro'] || descObj.ja || Object.values(descObj)[0] || 'No description available';
  },

  // Helper function to get cover art from relationships
  getCoverArt(manga: Manga): string | null {
    const coverRelation = manga.relationships.find((rel: any) => rel.type === 'cover_art');
    if (coverRelation?.attributes?.fileName) {
      const imageUrl = this.getCoverImageUrl(manga.id, coverRelation.attributes.fileName);
      console.log('Generated cover URL for', manga.id, ':', imageUrl);
      return imageUrl;
    }
    console.log('No cover art found for manga:', manga.id);
    return null;
  },

  // Helper function to get authors from relationships
  getAuthors(manga: Manga): string[] {
    return manga.relationships
      .filter((rel: any) => rel.type === 'author')
      .map((rel: any) => rel.attributes?.name)
      .filter(Boolean);
  },

  // Helper function to get artists from relationships
  getArtists(manga: Manga): string[] {
    return manga.relationships
      .filter((rel: any) => rel.type === 'artist')
      .map((rel: any) => rel.attributes?.name)
      .filter(Boolean);
  }
};

export default mangadxService;