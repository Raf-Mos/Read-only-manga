import axios from 'axios';
import type { MangaResponse, Manga, ChapterResponse, ChapterImagesResponse, Chapter } from '@/types';

const BASE_URL = typeof window === 'undefined' ? 'https://api.mangadex.org/' : '/api/mangadex/';

const api = axios.create({
  baseURL: BASE_URL,
  timeout: 30000,
  headers: { Accept: 'application/json' },
});

export const mangadexService = {
  async getPopularManga(): Promise<Manga[]> {
    const r = await api.get<MangaResponse>('manga', {
      params: { 'order[followedCount]': 'desc', limit: 10, 'includes[]': ['cover_art','author','artist'], 'contentRating[]': ['safe','suggestive'] },
    });
    return Array.isArray(r.data?.data) ? r.data.data : [];
  },
  async getRecentlyUpdatedManga(): Promise<Manga[]> {
    const r = await api.get<MangaResponse>('manga', {
      params: { 'order[updatedAt]': 'desc', limit: 10, 'includes[]': ['cover_art','author','artist'], 'contentRating[]': ['safe','suggestive'] },
    });
    return Array.isArray(r.data?.data) ? r.data.data : [];
  },
  async getMangaById(id: string): Promise<Manga> {
    const r = await api.get<{ data: Manga }>(`manga/${id}`, { params: { 'includes[]': ['cover_art','author','artist'] } });
    return r.data.data;
  },
  async getMangaChapters(mangaId: string, offset: number = 0): Promise<ChapterResponse> {
    const r = await api.get<ChapterResponse>(`manga/${mangaId}/feed`, {
      params: { limit: 100, offset, 'order[chapter]': 'desc', 'translatedLanguage[]': ['en'], 'includes[]': ['scanlation_group'], 'contentRating[]': ['safe','suggestive','erotica'] },
    });
    return r.data;
  },
  async getChapterImages(chapterId: string): Promise<ChapterImagesResponse> {
    const r = await api.get<ChapterImagesResponse>(`at-home/server/${chapterId}`);
    return r.data;
  },
  async getChapterMeta(chapterId: string): Promise<Chapter> {
    const r = await api.get<{ result: string; data: Chapter }>(`chapter/${chapterId}`);
    return r.data.data;
  },
  async searchManga(title: string): Promise<Manga[]> {
    const r = await api.get<MangaResponse>('manga', { params: { title, limit: 20, 'includes[]': ['cover_art','author','artist'], 'contentRating[]': ['safe','suggestive'] } });
    return Array.isArray(r.data?.data) ? r.data.data : [];
  },
  async getNewestManga(page = 1, limit = 10): Promise<MangaResponse> {
    const offset = (page - 1) * limit;
    const r = await api.get<MangaResponse>('manga', { params: { 'order[createdAt]': 'desc', limit, offset, 'includes[]': ['cover_art','author','artist'], 'contentRating[]': ['safe','suggestive'] } });
    return r.data;
  },
  async getUpdatedManga(page = 1, limit = 10): Promise<MangaResponse> {
    const offset = (page - 1) * limit;
    const r = await api.get<MangaResponse>('manga', { params: { 'order[updatedAt]': 'desc', limit, offset, 'includes[]': ['cover_art','author','artist'], 'contentRating[]': ['safe','suggestive'] } });
    return r.data;
  },
  async getPopularMangaPaginated(page = 1, limit = 10): Promise<MangaResponse> {
    const offset = (page - 1) * limit;
    const r = await api.get<MangaResponse>('manga', { params: { 'order[followedCount]': 'desc', limit, offset, 'includes[]': ['cover_art','author','artist'], 'contentRating[]': ['safe','suggestive'] } });
    return r.data;
  },
  getCoverImageUrl(mangaId: string, fileName: string, size: 'small'|'medium'|'large' = 'medium') {
    const sizeMap = { small: '256', medium: '512', large: '1024' } as const;
    return `https://uploads.mangadex.org/covers/${mangaId}/${fileName}.${sizeMap[size]}.jpg`;
  },
  getCoverImageUrlWithFallback(mangaId: string, fileName: string, size: 'small'|'medium'|'large' = 'medium') {
    const sizeMap = { small: '256', medium: '512', large: '1024' } as const;
    const baseUrl = `https://uploads.mangadex.org/covers/${mangaId}/${fileName}`;
    return [ `${baseUrl}.${sizeMap[size]}.jpg`, `${baseUrl}.jpg`, `${baseUrl}.png`, `${baseUrl}.webp` ];
  },
  getChapterPageUrl(baseUrl: string, chapterHash: string, fileName: string, dataSaver = false) {
    const quality = dataSaver ? 'data-saver' : 'data';
    return `${baseUrl}/${quality}/${chapterHash}/${fileName}`;
  },
  getEnglishTitle(manga: Manga): string {
    const titleObj: any = manga?.attributes?.title || {};
    return titleObj.en || titleObj['ja-ro'] || titleObj.ja || Object.values(titleObj)[0] || 'Unknown Title';
  },
  getEnglishDescription(manga: Manga): string {
    const descObj: any = manga?.attributes?.description || {};
    return descObj.en || descObj['ja-ro'] || descObj.ja || Object.values(descObj)[0] || 'No description available';
  },
  getCoverArt(manga: Manga): string | null {
    const rel = Array.isArray(manga.relationships) ? manga.relationships.find((r: any) => r.type === 'cover_art') : undefined;
    if (rel?.attributes?.fileName) return this.getCoverImageUrl(manga.id, rel.attributes.fileName);
    return null;
  },
  getAuthors(manga: Manga): string[] {
    return (Array.isArray(manga.relationships) ? manga.relationships : []).filter((r: any) => r.type === 'author').map((r: any) => r.attributes?.name).filter(Boolean);
  },
  getArtists(manga: Manga): string[] {
    return (Array.isArray(manga.relationships) ? manga.relationships : []).filter((r: any) => r.type === 'artist').map((r: any) => r.attributes?.name).filter(Boolean);
  },
};

export default mangadexService;
