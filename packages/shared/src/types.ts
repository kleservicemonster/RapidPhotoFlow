/**
 * Photo processing status enum
 */
export const PhotoStatus = {
  UPLOADED: 'UPLOADED',
  QUEUED: 'QUEUED',
  PROCESSING: 'PROCESSING',
  COMPLETED: 'COMPLETED',
  FAILED: 'FAILED',
} as const;

export type PhotoStatusType = (typeof PhotoStatus)[keyof typeof PhotoStatus];

/**
 * Photo event types for workflow logging
 */
export const PhotoEventType = {
  PHOTO_CREATED: 'PHOTO_CREATED',
  STATUS_CHANGED: 'STATUS_CHANGED',
  PROCESSING_STARTED: 'PROCESSING_STARTED',
  PROCESSING_COMPLETED: 'PROCESSING_COMPLETED',
  PROCESSING_FAILED: 'PROCESSING_FAILED',
} as const;

export type PhotoEventTypeValue = (typeof PhotoEventType)[keyof typeof PhotoEventType];

/**
 * Photo Data Transfer Object
 */
export interface PhotoDTO {
  id: string;
  filename: string;
  originalName: string;
  status: PhotoStatusType;
  storagePath: string;
  url?: string;
  createdAt: string;
  updatedAt: string;
  processedAt?: string | null;
}

/**
 * Photo Event Data Transfer Object
 */
export interface PhotoEventDTO {
  id: string;
  photoId: string;
  type: PhotoEventTypeValue;
  fromStatus: PhotoStatusType | null;
  toStatus: PhotoStatusType;
  message: string;
  createdAt: string;
}

/**
 * Create photo response
 */
export interface CreatePhotosResponse {
  success: boolean;
  photos: PhotoDTO[];
  message: string;
  errors?: string[];
}

/**
 * Paginated response wrapper
 */
export interface PaginatedResponse<T> {
  data: T[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

/**
 * Photo list query params
 */
export interface PhotoListParams {
  status?: PhotoStatusType;
  page?: number;
  limit?: number;
}

/**
 * Event list query params
 */
export interface EventListParams {
  photoId?: string;
  page?: number;
  limit?: number;
}

/**
 * Update status request
 */
export interface UpdateStatusRequest {
  status: PhotoStatusType;
}

/**
 * Queue message payload
 */
export interface PhotoQueueMessage {
  photoId: string;
  status: PhotoStatusType;
  timestamp: string;
}

/**
 * API Error response
 */
export interface ApiError {
  success: false;
  message: string;
  errors?: Record<string, string[]>;
}

