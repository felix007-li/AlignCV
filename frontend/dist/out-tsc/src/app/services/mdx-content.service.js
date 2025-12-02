/**
 * MDX Content Service
 * Loads and caches MDX JSON content for SEO pages
 */
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { Injectable } from '@angular/core';
import { of } from 'rxjs';
import { catchError, filter, map, shareReplay } from 'rxjs/operators';
let MdxContentService = class MdxContentService {
    constructor(http) {
        this.http = http;
        this.cache = new Map();
        this.baseUrl = '/assets/mdx/json'; // MDX JSON files location
    }
    /**
     * Load MDX content by path
     * Path format: locale/kind/file-name
     * Example: 'en/templates/software-engineer'
     */
    loadContent(path) {
        const cacheKey = path;
        // Return cached observable if available
        if (this.cache.has(cacheKey)) {
            return this.cache.get(cacheKey);
        }
        // Create new observable and cache it
        const url = `${this.baseUrl}/${path}.json`;
        const content$ = this.http.get(url).pipe(map(data => ({
            meta: data.meta,
            body: data.body
        })), catchError(error => {
            console.error(`Failed to load MDX content: ${path}`, error);
            return of(null);
        }), shareReplay(1) // Cache the result
        );
        const validContent$ = content$.pipe(filter((content) => content !== null) // Ensure only non-null values are passed
        );
        this.cache.set(cacheKey, validContent$);
        return validContent$;
    }
    /**
     * Load content by route parameters
     * Path format: locale/kind/slug (no city layer)
     * Example: 'en/templates/software-engineer'
     */
    loadContentByParams(locale, kind, slug) {
        const path = `${locale}/${kind}/${slug}`;
        return this.loadContent(path);
    }
    /**
     * Clear cache (useful for development/testing)
     */
    clearCache() {
        this.cache.clear();
    }
    /**
     * Get cache statistics
     */
    getCacheStats() {
        return {
            size: this.cache.size,
            keys: Array.from(this.cache.keys())
        };
    }
};
MdxContentService = __decorate([
    Injectable({
        providedIn: 'root'
    })
], MdxContentService);
export { MdxContentService };
//# sourceMappingURL=mdx-content.service.js.map