/**
 * API Routes
 */
export const API_ROUTES = {
  PHOTOS: "/photos",
  PHOTO_BY_ID: (id: string) => `/photos/${id}`,
  PHOTO_STATUS: (id: string) => `/photos/${id}/status`,
  PHOTO_FILE: (id: string) => `/photos/${id}/file`,
  EVENTS: "/events",
} as const;

/**
 * Queue configuration
 * Using BullMQ (Redis-based queue system)
 * - Built specifically for Node.js
 * - Uses existing Redis infrastructure
 * - Built-in retry mechanisms and job persistence
 * - Official AdonisJS queue package
 */
export const QUEUE_CONFIG = {
  QUEUE_NAME: "photo_processing",
} as const;

/**
 * Redis cache keys
 */
export const REDIS_KEYS = {
  PHOTOS_LIST: (status?: string) => `photos:list:${status || "all"}`,
  PHOTO_DETAIL: (id: string) => `photos:detail:${id}`,
  PROCESSING_LOCK: (id: string) => `photos:lock:${id}`,
} as const;

/**
 * Cache TTL in seconds
 */
export const CACHE_TTL = {
  PHOTOS_LIST: 30,
  PHOTO_DETAIL: 60,
} as const;

/**
 * Processing simulation config
 */
export const PROCESSING_CONFIG = {
  MIN_DELAY_MS: 2000,
  MAX_DELAY_MS: 5000,
  SUCCESS_RATE: 0.9,
} as const;

/**
 * Pagination defaults
 */
export const PAGINATION = {
  DEFAULT_PAGE: 1,
  DEFAULT_LIMIT: 20,
  MAX_LIMIT: 100,
} as const;

/**
 * Status display configuration
 */
export const STATUS_DISPLAY = {
  UPLOADED: { label: "Uploaded", color: "gray" },
  QUEUED: { label: "Queued", color: "gray" },
  PROCESSING: { label: "Processing", color: "yellow" },
  COMPLETED: { label: "Completed", color: "green" },
  FAILED: { label: "Failed", color: "red" },
} as const;
