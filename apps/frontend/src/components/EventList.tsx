'use client'

import type { PhotoEventDTO } from '@rapidphotoflow/shared'
import { StatusBadge } from './StatusBadge'
import { Activity, ArrowRight, AlertCircle } from 'lucide-react'

interface EventListProps {
  events: PhotoEventDTO[]
  isLoading?: boolean
  emptyMessage?: string
}

export function EventList({ events, isLoading, emptyMessage = 'No events yet' }: EventListProps) {
  if (isLoading) {
    return (
      <div className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-5 max-h-[500px] overflow-y-auto">
        <div className="flex flex-col items-center justify-center gap-3 py-10 text-slate-500">
          <Activity className="animate-pulse" size={20} />
          <span>Loading events...</span>
        </div>
      </div>
    )
  }

  if (events.length === 0) {
    return (
      <div className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-5 max-h-[500px] overflow-y-auto">
        <div className="flex flex-col items-center justify-center gap-3 py-10 text-slate-500">
          <AlertCircle size={24} />
          <span>{emptyMessage}</span>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-5 max-h-[500px] overflow-y-auto">
      <ul className="space-y-0">
        {events.map((event, index) => (
          <li key={event.id} className="flex gap-4 animate-fadeIn" style={{ animationDelay: `${index * 50}ms` }}>
            <div className="flex flex-col items-center gap-1 pt-1.5">
              <span
                className={`w-2.5 h-2.5 rounded-full flex-shrink-0 ${
                  event.type === 'PHOTO_CREATED'
                    ? 'bg-coral-500 shadow-lg shadow-coral-500/50'
                    : event.type === 'PROCESSING_STARTED'
                      ? 'bg-amber-500'
                      : event.type === 'PROCESSING_COMPLETED'
                        ? 'bg-emerald-500 shadow-lg shadow-emerald-500/50'
                        : event.type === 'PROCESSING_FAILED'
                          ? 'bg-red-500 shadow-lg shadow-red-500/50'
                          : 'bg-slate-500'
                }`}
              />
              {index < events.length - 1 && <span className="flex-1 w-0.5 bg-slate-700 min-h-[30px]" />}
            </div>

            <div className="flex-1 pb-5">
              <p className="text-sm text-slate-200 mb-2 leading-relaxed">{event.message}</p>

              <div className="flex flex-wrap items-center gap-3">
                {event.fromStatus && (
                  <div className="flex items-center gap-2 text-slate-500">
                    <StatusBadge status={event.fromStatus} size="sm" />
                    <ArrowRight size={12} />
                    <StatusBadge status={event.toStatus} size="sm" />
                  </div>
                )}

                <time className="text-[10px] font-mono text-slate-500">
                  {new Date(event.createdAt).toLocaleString([], {
                    month: 'short',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                    second: '2-digit',
                  })}
                </time>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  )
}

