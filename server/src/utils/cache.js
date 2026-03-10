'use strict';

const TTL_MS = parseInt(process.env.CACHE_TTL_MS, 10) || 60_000; // default: 60 s

/**
 * Мінімальний in-memory TTL-кеш для read-heavy endpoint-ів.
 * Не потребує зовнішніх пакетів.
 */
class TtlCache {
  constructor() {
    this._store = new Map();
  }

  /** @returns {any|null} закешовані дані або null якщо відсутні/протерміновані */
  get(key) {
    const entry = this._store.get(key);
    if (!entry) return null;
    if (Date.now() > entry.expiresAt) {
      this._store.delete(key);
      return null;
    }
    return entry.data;
  }

  /** Зберігає дані з TTL (за замовчуванням — CACHE_TTL_MS або 60 с) */
  set(key, data, ttlMs = TTL_MS) {
    this._store.set(key, { data, expiresAt: Date.now() + ttlMs });
  }

  /** Примусово видаляє запис (інвалідація при записі) */
  del(key) {
    this._store.delete(key);
  }
}

module.exports = new TtlCache();
