import NodeCache, { Key } from 'node-cache';

export default class LocalCache {
  private static _nodeCache: NodeCache;

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  private constructor() {}

  private static get nodeCache(): NodeCache {
    if (!this._nodeCache) {
      this._nodeCache = new NodeCache();
    }
    return this._nodeCache;
  }

  /**
   * get a cached key and change the states
   * @param key cache key
   * @returns The value stored in the key
   */
  static get<T>(key: Key): T | undefined {
    return this.nodeCache.get(key);
  }

  /**
   * Set a cached key and change the states
   * @param key Cache key
   * @param value A value to cache
   * @param ttl The time to live in seconds
   */
  static set<T>(key: Key, value: T, ttl?: number | string): boolean {
    if (ttl) return this.nodeCache.set(key, value, ttl);
    else return this.nodeCache.set(key, value);
  }

  static update<T>(key: Key, value: T): boolean {
    const oldValue = this.get<T>(key);
    if (!oldValue) {
      return this.set<T>(key, value);
    } else {
      const updatedValue = { ...oldValue, ...value };
      return this.set<T>(key, updatedValue);
    }
  }

  /**
   * Delete key or keys
   * @param keys cache key to delete or a array of cache keys.
   * @returns Number of deleted keys
   */
  static del(keys: Key | Key[]): number {
    return this.nodeCache.del(keys);
  }

  /**
   * get a cached key and remove it from the cache.
   * Equivalent to calling get(key) + del(key).
   * @param key cache key
   * @returns The value stored in the key
   */
  static take<T>(key: Key): T | undefined {
    return this.nodeCache.take(key);
  }

  /**
   * list all keys within this cache
   * @returns An array of all keys
   */
  static keys(): string[] {
    return this.nodeCache.keys();
  }

  static clearAll(): void {
    const allKeys = this.keys();
    this.del(allKeys);
  }
}
