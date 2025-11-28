import type {
  PhotoDTO,
  PhotoEventDTO,
  PaginatedResponse,
  CreatePhotosResponse,
  PhotoListParams,
  EventListParams,
} from '@rapidphotoflow/shared'

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3333'

class ApiClient {
  private baseUrl: string

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`

    const response = await fetch(url, {
      ...options,
      headers: {
        ...options.headers,
      },
    })

    if (!response.ok) {
      const error = await response.json().catch(() => ({ message: 'Request failed' }))
      throw new Error(error.message || `HTTP ${response.status}`)
    }

    return response.json()
  }

  async listPhotos(params?: PhotoListParams): Promise<PaginatedResponse<PhotoDTO>> {
    const searchParams = new URLSearchParams()

    if (params?.status) {
      searchParams.set('status', params.status)
    }
    if (params?.page) {
      searchParams.set('page', String(params.page))
    }
    if (params?.limit) {
      searchParams.set('limit', String(params.limit))
    }

    const query = searchParams.toString()
    return this.request<PaginatedResponse<PhotoDTO>>(
      `/photos${query ? `?${query}` : ''}`
    )
  }

  async getPhoto(id: string): Promise<PhotoDTO & { events: PhotoEventDTO[] }> {
    return this.request<PhotoDTO & { events: PhotoEventDTO[] }>(`/photos/${id}`)
  }

  async createPhotos(files: File[]): Promise<CreatePhotosResponse> {
    const formData = new FormData()

    for (const file of files) {
      formData.append('files', file)
    }

    return this.request<CreatePhotosResponse>('/photos', {
      method: 'POST',
      body: formData,
    })
  }

  async listEvents(params?: EventListParams): Promise<PaginatedResponse<PhotoEventDTO>> {
    const searchParams = new URLSearchParams()

    if (params?.photoId) {
      searchParams.set('photoId', params.photoId)
    }
    if (params?.page) {
      searchParams.set('page', String(params.page))
    }
    if (params?.limit) {
      searchParams.set('limit', String(params.limit))
    }

    const query = searchParams.toString()
    return this.request<PaginatedResponse<PhotoEventDTO>>(
      `/events${query ? `?${query}` : ''}`
    )
  }

  getPhotoUrl(id: string): string {
    return `${this.baseUrl}/photos/${id}/file`
  }

  async healthCheck(): Promise<{ status: string; checks: Record<string, boolean> }> {
    return this.request<{ status: string; checks: Record<string, boolean> }>('/health')
  }
}

export const api = new ApiClient(API_BASE)

