'use client'

import { useState, useEffect, useCallback } from 'react'
import type { PhotoDTO, PhotoEventDTO } from '@rapidphotoflow/shared'
import { PhotoStatus } from '@rapidphotoflow/shared'
import { PhotoCard } from '@/components/PhotoCard'
import { EventList } from '@/components/EventList'
import { api } from '@/lib/api'
import { RefreshCw, Layers, Activity } from 'lucide-react'

const POLL_INTERVAL = 4000

export default function QueuePage() {
  const [photos, setPhotos] = useState<PhotoDTO[]>([])
  const [events, setEvents] = useState<PhotoEventDTO[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [lastRefresh, setLastRefresh] = useState<Date>(new Date())

  const fetchData = useCallback(async () => {
    try {
      const [uploaded, queued, processing] = await Promise.all([
        api.listPhotos({ status: PhotoStatus.UPLOADED, limit: 50 }),
        api.listPhotos({ status: PhotoStatus.QUEUED, limit: 50 }),
        api.listPhotos({ status: PhotoStatus.PROCESSING, limit: 50 }),
      ])

      const allPhotos = [...uploaded.data, ...queued.data, ...processing.data].sort(
        (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      )

      setPhotos(allPhotos)

      const eventsResponse = await api.listEvents({ limit: 20 })
      setEvents(eventsResponse.data)

      setLastRefresh(new Date())
    } catch (error) {
      console.error('Failed to fetch queue data:', error)
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchData()
    const interval = setInterval(fetchData, POLL_INTERVAL)
    return () => clearInterval(interval)
  }, [fetchData])

  const handleRefresh = () => {
    setIsLoading(true)
    fetchData()
  }

  const processingCount = photos.filter((p) => p.status === PhotoStatus.PROCESSING).length
  const queuedCount = photos.filter((p) => p.status === PhotoStatus.QUEUED || p.status === PhotoStatus.UPLOADED).length

  return (
    <div className="px-6 py-8">
      <div className="max-w-7xl mx-auto">
        <header className="flex items-start justify-between mb-8 pb-6 border-b border-slate-800">
          <div>
            <h1 className="flex items-center gap-3 text-2xl font-bold text-slate-100 mb-2">
              <Layers size={28} className="text-coral-500" />
              Processing Queue
            </h1>
            <p className="text-slate-400">
              <span className="text-coral-400 font-semibold">{processingCount}</span> processing
              <span className="mx-2 text-slate-600">•</span>
              <span className="text-coral-400 font-semibold">{queuedCount}</span> queued
            </p>
          </div>

          <div className="flex flex-col items-end gap-2">
            <button
              className="flex items-center gap-2 px-4 py-2.5 border border-slate-700 rounded-lg bg-slate-800 text-slate-200 text-sm font-medium hover:border-coral-500 hover:bg-coral-500/5 transition-colors disabled:opacity-60"
              onClick={handleRefresh}
              disabled={isLoading}
            >
              <RefreshCw size={16} className={isLoading ? 'animate-spin' : ''} />
              Refresh
            </button>
            <span className="text-[10px] font-mono text-slate-500">
              Last updated: {lastRefresh.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
            </span>
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-8">
          <section className="min-h-[400px]">
            {isLoading && photos.length === 0 ? (
              <div className="flex flex-col items-center justify-center gap-4 py-20 bg-slate-800/30 border border-slate-700/50 rounded-xl text-slate-500">
                <RefreshCw size={24} className="animate-spin" />
                <p>Loading queue...</p>
              </div>
            ) : photos.length === 0 ? (
              <div className="flex flex-col items-center justify-center gap-4 py-20 bg-slate-800/30 border border-slate-700/50 rounded-xl text-slate-500">
                <Layers size={48} className="opacity-50" />
                <h2 className="text-lg font-semibold text-slate-400">Queue is empty</h2>
                <p className="text-sm">Upload some photos to start processing</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
                {photos.map((photo, index) => (
                  <div key={photo.id} className="animate-fadeIn" style={{ animationDelay: `${index * 50}ms`, opacity: 0 }}>
                    <PhotoCard photo={photo} size="md" />
                  </div>
                ))}
              </div>
            )}
          </section>

          <aside className="lg:sticky lg:top-24 h-fit">
            <h2 className="flex items-center gap-2.5 text-sm font-semibold text-slate-200 mb-4">
              <Activity size={18} className="text-coral-500" />
              Event Log
            </h2>
            <EventList events={events} isLoading={isLoading && events.length === 0} />
          </aside>
        </div>
      </div>
    </div>
  )
}

