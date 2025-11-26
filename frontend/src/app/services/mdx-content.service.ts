/**
 * MDX Content Service
 * Loads and caches MDX JSON content for SEO pages
 */

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, filter, map, shareReplay } from 'rxjs/operators';

export interface MdxMeta {
  title: string;
  templateId: string;
  seo_route: string;
  route: string;
  description: string;
  locale: string;
  category?: string;
  level?: string;
}

export interface MdxContent {
  meta: MdxMeta;
  body: string;
}

@Injectable({
  providedIn: 'root'
})
export class MdxContentService {
  private cache = new Map<string, Observable<MdxContent>>();
  private readonly baseUrl = '/assets/mdx/json'; // MDX JSON files location

  constructor(private http: HttpClient) {}

  /**
   * Load MDX content by path
   * Path format: locale/kind/file-name
   * Example: 'en/templates/software-engineer'
   */
  loadContent(path: string): Observable<MdxContent | null> {
    const cacheKey = path;

    // Return cached observable if available
    if (this.cache.has(cacheKey)) {
      return this.cache.get(cacheKey)!;
    }

    // Create new observable and cache it
    const url = `${this.baseUrl}/${path}.json`;
    const content$ = this.http.get<MdxContent>(url).pipe(
      map(data => ({
        meta: data.meta,
        body: data.body
      })),
      catchError(error => {
        console.error(`Failed to load MDX content: ${path}`, error);
        return of(null);
      }),
      shareReplay(1) // Cache the result
    );

    const validContent$: Observable<MdxContent> = content$.pipe(
      filter((content): content is MdxContent => content !== null) // Ensure only non-null values are passed
    );

    this.cache.set(cacheKey, validContent$);
    return validContent$;
  }

  /**
   * Load content by route parameters
   * Path format: locale/kind/slug (no city layer)
   * Example: 'en/templates/software-engineer'
   */
  loadContentByParams(
    locale: string,
    kind: string,
    slug: string
  ): Observable<MdxContent | null> {
    const path = `${locale}/${kind}/${slug}`;
    return this.loadContent(path);
  }

  /**
   * Clear cache (useful for development/testing)
   */
  clearCache(): void {
    this.cache.clear();
  }

  /**
   * Get cache statistics
   */
  getCacheStats(): { size: number; keys: string[] } {
    return {
      size: this.cache.size,
      keys: Array.from(this.cache.keys())
    };
  }
}
