/**
 * Simple LRU Cache for username analysis results
 * Improves performance for repeated analyses
 */

class LRUCache {
  constructor(maxSize = 500) {
    this.maxSize = maxSize;
    this.cache = new Map();
  }

  get(key) {
    if (!this.cache.has(key)) {
      return undefined;
    }
    
    const value = this.cache.get(key);
    this.cache.delete(key);
    this.cache.set(key, value);
    return value;
  }

  set(key, value) {
    if (this.cache.has(key)) {
      this.cache.delete(key);
    } else if (this.cache.size >= this.maxSize) {
      const firstKey = this.cache.keys().next().value;
      this.cache.delete(firstKey);
    }
    this.cache.set(key, value);
  }

  has(key) {
    return this.cache.has(key);
  }

  clear() {
    this.cache.clear();
  }

  get size() {
    return this.cache.size;
  }
}

const analysisCache = new LRUCache(500);

export function getCachedAnalysis(key) {
  return analysisCache.get(key);
}

export function setCachedAnalysis(key, analysis) {
  analysisCache.set(key, analysis);
}

export function clearCache() {
  analysisCache.clear();
}

export function getCacheStats() {
  return {
    size: analysisCache.size,
    maxSize: analysisCache.maxSize
  };
}

export { LRUCache };
