/** In-memory cache for frequently accessed data. */

interface CacheEntry<T> {
  data: T;
  expiresAt: number;
}

export class Cache {
  private store = new Map<string, CacheEntry<unknown>>();
  private defaultTtl: number;
  // Security: Maximum cache size to prevent unbounded memory growth
  private readonly maxSize: number;

  constructor(defaultTtlMs = 60_000, maxSize = 10_000) {
    this.defaultTtl = defaultTtlMs;
    this.maxSize = maxSize;
  }

  get<T>(key: string): T | undefined {
    const entry = this.store.get(key) as CacheEntry<T> | undefined;
    if (!entry) return undefined;
    if (Date.now() > entry.expiresAt) {
      this.store.delete(key);
      return undefined;
    }
    return entry.data;
  }

  set<T>(key: string, data: T, ttlMs?: number): void {
    // Security: Evict oldest entries when cache exceeds max size (LRU-like)
    if (this.store.size >= this.maxSize && !this.store.has(key)) {
      this.prune(); // First try removing expired entries
      if (this.store.size >= this.maxSize) {
        // Remove the oldest entry (first key in Map iteration order)
        const oldestKey = this.store.keys().next().value;
        if (oldestKey !== undefined) {
          this.store.delete(oldestKey);
        }
      }
    }
    this.store.set(key, {
      data,
      expiresAt: Date.now() + (ttlMs ?? this.defaultTtl),
    });
  }

  delete(key: string): void {
    this.store.delete(key);
  }

  clear(): void {
    this.store.clear();
  }

  /** Remove expired entries. */
  prune(): number {
    const now = Date.now();
    let removed = 0;
    for (const [key, entry] of this.store) {
      if (now > entry.expiresAt) {
        this.store.delete(key);
        removed++;
      }
    }
    return removed;
  }

  get size(): number {
    return this.store.size;
  }
}
