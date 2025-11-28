'use client'

import type { PhotoStatusType } from '@rapidphotoflow/shared'
import { STATUS_DISPLAY } from '@rapidphotoflow/shared'

interface StatusBadgeProps {
  status: PhotoStatusType
  size?: 'sm' | 'md' | 'lg'
}

const colorClasses = {
  gray: 'bg-slate-500/20 text-slate-400 border-slate-500/30',
  yellow: 'bg-amber-500/20 text-amber-400 border-amber-500/30',
  green: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
  red: 'bg-red-500/20 text-red-400 border-red-500/30',
}

const sizeClasses = {
  sm: 'px-2 py-0.5 text-[10px]',
  md: 'px-2.5 py-1 text-xs',
  lg: 'px-3 py-1.5 text-sm',
}

export function StatusBadge({ status, size = 'md' }: StatusBadgeProps) {
  const config = STATUS_DISPLAY[status]

  return (
    <span
      className={`inline-flex items-center gap-1.5 font-mono font-medium rounded border uppercase tracking-wider ${colorClasses[config.color]} ${sizeClasses[size]}`}
    >
      {status === 'PROCESSING' && (
        <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
      )}
      {config.label}
    </span>
  )
}

