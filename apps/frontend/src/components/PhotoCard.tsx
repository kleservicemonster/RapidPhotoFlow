'use client'

import Image from 'next/image'
import type { PhotoDTO } from '@rapidphotoflow/shared'
import { StatusBadge } from './StatusBadge'
import { api } from '@/lib/api'
import { Clock, FileImage } from 'lucide-react'

interface PhotoCardProps {
  photo: PhotoDTO
  size?: 'sm' | 'md' | 'lg'
  onClick?: () => void
}

const heightClasses = {
  sm: 'h-32',
  md: 'h-44',
  lg: 'h-64',
}

export function PhotoCard({ photo, size = 'md', onClick }: PhotoCardProps) {
  const imageUrl = api.getPhotoUrl(photo.id)
  const createdDate = new Date(photo.createdAt)

  return (
    <article
      className={`bg-slate-800/50 border border-slate-700/50 rounded-xl overflow-hidden transition-all duration-200 ${onClick ? 'cursor-pointer hover:border-coral-500/50 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-coral-500/10' : ''}`}
      onClick={onClick}
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
    >
      <div className={`relative w-full bg-slate-900 ${heightClasses[size]}`}>
        <Image
          src={imageUrl}
          alt={photo.originalName}
          fill
          sizes={size === 'lg' ? '400px' : size === 'md' ? '300px' : '200px'}
          className="object-cover transition-transform duration-300 group-hover:scale-105"
          priority={false}
        />
        <div className="absolute top-2 right-2">
          <StatusBadge status={photo.status} size="sm" />
        </div>
      </div>

      <div className="p-3.5">
        <h3 className="flex items-center gap-2 text-sm font-medium text-slate-200 mb-2">
          <FileImage size={14} className="text-slate-500 flex-shrink-0" />
          <span className="truncate" title={photo.originalName}>
            {photo.originalName}
          </span>
        </h3>

        <div className="flex items-center gap-1.5 text-xs text-slate-500 font-mono">
          <Clock size={12} />
          {createdDate.toLocaleTimeString([], {
            hour: '2-digit',
            minute: '2-digit',
          })}
        </div>
      </div>
    </article>
  )
}

