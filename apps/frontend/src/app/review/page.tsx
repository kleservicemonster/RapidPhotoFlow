'use client'

import { useState, useEffect, useCallback } from 'react'
import Image from 'next/image'
import type { PhotoDTO, PhotoEventDTO } from '@rapidphotoflow/shared'
import { PhotoStatus } from '@rapidphotoflow/shared'
import { PhotoCard } from '@/components/PhotoCard'
import { EventList } from '@/components/EventList'
import { StatusBadge } from '@/components/StatusBadge'
import { api } from '@/lib/api'
import { ImageIcon, X, CheckCircle, XCircle, ChevronLeft, ChevronRight, Download } from 'lucide-react'

export default function ReviewPage() {
  const [photos, setPhotos] = useState<PhotoDTO[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [selectedPhoto, setSelectedPhoto] = useState<(PhotoDTO & { events: PhotoEventDTO[] }) | null>(null)
  const [isModalLoading, setIsModalLoading] = useState(false)
  const [filter, setFilter] = useState<'all' | 'completed' | 'failed'>('all')

  const fetchPhotos = useCallback(async () => {
    try {
      setIsLoading(true)
      const [completed, failed] = await Promise.all([
        api.listPhotos({ status: PhotoStatus.COMPLETED, limit: 100 }),
        api.listPhotos({ status: PhotoStatus.FAILED, limit: 100 }),
      ])

      const allPhotos = [...completed.data, ...failed.data].sort(
        (a, b) => new Date(b.processedAt || b.updatedAt).getTime() - new Date(a.processedAt || a.updatedAt).getTime()
      )

      setPhotos(allPhotos)
    } catch (error) {
      console.error('Failed to fetch photos:', error)
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchPhotos()
  }, [fetchPhotos])

  const handlePhotoClick = async (photo: PhotoDTO) => {
    setIsModalLoading(true)
    try {
      const photoWithEvents = await api.getPhoto(photo.id)
      setSelectedPhoto(photoWithEvents)
    } catch (error) {
      console.error('Failed to fetch photo details:', error)
    } finally {
      setIsModalLoading(false)
    }
  }

  const closeModal = () => setSelectedPhoto(null)

  const navigatePhoto = (direction: 'prev' | 'next') => {
    if (!selectedPhoto) return
    const currentIndex = filteredPhotos.findIndex((p) => p.id === selectedPhoto.id)
    const newIndex = direction === 'prev'
      ? (currentIndex - 1 + filteredPhotos.length) % filteredPhotos.length
      : (currentIndex + 1) % filteredPhotos.length
    handlePhotoClick(filteredPhotos[newIndex])
  }

  const filteredPhotos = photos.filter((photo) => {
    if (filter === 'completed') return photo.status === PhotoStatus.COMPLETED
    if (filter === 'failed') return photo.status === PhotoStatus.FAILED
    return true
  })

  const completedCount = photos.filter((p) => p.status === PhotoStatus.COMPLETED).length
  const failedCount = photos.filter((p) => p.status === PhotoStatus.FAILED).length

  return (
    <div className="px-6 py-8">
      <div className="max-w-7xl mx-auto">
        <header className="flex items-start justify-between mb-8 pb-6 border-b border-slate-800">
          <div>
            <h1 className="flex items-center gap-3 text-2xl font-bold text-slate-100 mb-2">
              <ImageIcon size={28} className="text-coral-500" />
              Review Photos
            </h1>
            <p className="flex items-center gap-2 text-slate-400">
              <CheckCircle size={16} className="text-emerald-400" />
              <span>{completedCount} completed</span>
              <span className="text-slate-600">•</span>
              <XCircle size={16} className="text-red-400" />
              <span>{failedCount} failed</span>
            </p>
          </div>

          <div className="flex gap-2">
            {(['all', 'completed', 'failed'] as const).map((f) => (
              <button
                key={f}
                className={`px-4 py-2 rounded-lg text-sm font-medium border transition-colors ${
                  filter === f
                    ? 'bg-coral-500/10 border-coral-500 text-coral-400'
                    : 'border-slate-700 text-slate-400 hover:border-slate-600 hover:text-slate-300'
                }`}
                onClick={() => setFilter(f)}
              >
                {f.charAt(0).toUpperCase() + f.slice(1)}
              </button>
            ))}
          </div>
        </header>

        {isLoading ? (
          <div className="flex flex-col items-center justify-center gap-4 py-24 bg-slate-800/30 border border-slate-700/50 rounded-xl">
            <div className="w-8 h-8 border-2 border-slate-700 border-t-coral-500 rounded-full animate-spin" />
            <p className="text-slate-500">Loading photos...</p>
          </div>
        ) : filteredPhotos.length === 0 ? (
          <div className="flex flex-col items-center justify-center gap-4 py-24 bg-slate-800/30 border border-slate-700/50 rounded-xl text-slate-500">
            <ImageIcon size={48} className="opacity-50" />
            <h2 className="text-lg font-semibold text-slate-400">No photos to review</h2>
            <p className="text-sm">{filter === 'all' ? 'Photos will appear here once processing is complete' : `No ${filter} photos found`}</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredPhotos.map((photo, index) => (
              <div key={photo.id} className="animate-fadeIn" style={{ animationDelay: `${index * 30}ms`, opacity: 0 }}>
                <PhotoCard photo={photo} size="lg" onClick={() => handlePhotoClick(photo)} />
              </div>
            ))}
          </div>
        )}

        {/* Modal */}
        {selectedPhoto && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm animate-fadeIn" onClick={closeModal}>
            <div className="relative flex w-[95vw] max-w-6xl h-[90vh] bg-slate-900 rounded-2xl overflow-hidden" onClick={(e) => e.stopPropagation()}>
              <button className="absolute top-4 right-4 z-10 w-11 h-11 flex items-center justify-center rounded-lg bg-black/50 text-slate-200 hover:bg-black/70 transition-colors" onClick={closeModal}>
                <X size={24} />
              </button>

              <button className="absolute left-4 top-1/2 -translate-y-1/2 z-10 w-12 h-12 flex items-center justify-center rounded-full bg-black/50 text-slate-200 hover:bg-black/70 hover:scale-105 transition-all" onClick={() => navigatePhoto('prev')}>
                <ChevronLeft size={24} />
              </button>

              <button className="absolute right-[396px] top-1/2 -translate-y-1/2 z-10 w-12 h-12 flex items-center justify-center rounded-full bg-black/50 text-slate-200 hover:bg-black/70 hover:scale-105 transition-all" onClick={() => navigatePhoto('next')}>
                <ChevronRight size={24} />
              </button>

              {isModalLoading ? (
                <div className="flex-1 flex items-center justify-center">
                  <div className="w-8 h-8 border-2 border-slate-700 border-t-coral-500 rounded-full animate-spin" />
                </div>
              ) : (
                <>
                  <div className="flex-1 relative bg-slate-950">
                    <Image
                      src={api.getPhotoUrl(selectedPhoto.id)}
                      alt={selectedPhoto.originalName}
                      fill
                      sizes="80vw"
                      className="object-contain"
                      priority
                    />
                  </div>

                  <div className="w-[380px] p-6 bg-slate-800/50 border-l border-slate-700 overflow-y-auto">
                    <div className="mb-6">
                      <h2 className="text-lg font-semibold text-slate-100 break-words mb-3">{selectedPhoto.originalName}</h2>
                      <StatusBadge status={selectedPhoto.status} size="lg" />
                    </div>

                    <div className="flex flex-col gap-3 p-4 bg-slate-800 rounded-lg mb-5">
                      <div className="flex justify-between">
                        <span className="text-[10px] uppercase tracking-wider text-slate-500">Created</span>
                        <span className="text-xs font-mono text-slate-400">{new Date(selectedPhoto.createdAt).toLocaleString()}</span>
                      </div>
                      {selectedPhoto.processedAt && (
                        <div className="flex justify-between">
                          <span className="text-[10px] uppercase tracking-wider text-slate-500">Processed</span>
                          <span className="text-xs font-mono text-slate-400">{new Date(selectedPhoto.processedAt).toLocaleString()}</span>
                        </div>
                      )}
                    </div>

                    <a
                      href={api.getPhotoUrl(selectedPhoto.id)}
                      download={selectedPhoto.originalName}
                      className="flex items-center justify-center gap-2 w-full px-5 py-3 mb-5 rounded-lg bg-gradient-to-r from-coral-500 to-amber-500 text-slate-900 font-semibold hover:-translate-y-0.5 hover:shadow-lg transition-all"
                    >
                      <Download size={16} />
                      Download
                    </a>

                    <h3 className="text-sm font-semibold text-slate-200 mb-3">Event History</h3>
                    <EventList events={selectedPhoto.events} emptyMessage="No events" />
                  </div>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

