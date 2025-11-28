'use client'

import { useState } from 'react'
import { UploadDropzone } from '@/components/UploadDropzone'
import { api } from '@/lib/api'
import { ArrowRight, Zap, Shield, Clock } from 'lucide-react'
import Link from 'next/link'

export default function UploadPage() {
  const [uploadedCount, setUploadedCount] = useState(0)

  const handleUpload = async (files: File[]) => {
    const result = await api.createPhotos(files)
    setUploadedCount((prev) => prev + result.photos.length)
  }

  return (
    <div className="min-h-[calc(100vh-120px)] flex items-center justify-center px-6 py-10">
      <div className="w-full max-w-3xl">
        <header className="text-center mb-10">
          <h1 className="text-4xl font-bold mb-3">
            <span className="bg-gradient-to-r from-coral-500 to-amber-500 bg-clip-text text-transparent">
              Upload Photos
            </span>
          </h1>
          <p className="text-lg text-slate-400">
            Drop your images to start the automated processing workflow
          </p>
        </header>

        <UploadDropzone onUpload={handleUpload} />

        {uploadedCount > 0 && (
          <div className="flex items-center justify-between p-4 mt-6 bg-emerald-500/10 border border-emerald-500/30 rounded-xl animate-fadeIn">
            <div className="flex items-center gap-3 text-emerald-400">
              <span className="w-7 h-7 flex items-center justify-center bg-emerald-500 text-slate-900 rounded-full text-sm font-bold">
                ✓
              </span>
              <span>
                <strong>{uploadedCount}</strong> photos uploaded and queued for processing
              </span>
            </div>
            <Link
              href="/queue"
              className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-emerald-500 text-slate-900 text-sm font-semibold hover:translate-x-0.5 transition-transform"
            >
              View Queue
              <ArrowRight size={16} />
            </Link>
          </div>
        )}

        <div className="grid grid-cols-3 gap-5 mt-16">
          {[
            { icon: Zap, title: 'Lightning Fast', desc: 'Concurrent uploads with real-time progress tracking' },
            { icon: Shield, title: 'Reliable Processing', desc: 'Queue-based workflow ensures no photo is lost' },
            { icon: Clock, title: 'Event Tracking', desc: 'Full audit log of every status change' },
          ].map(({ icon: Icon, title, desc }) => (
            <div key={title} className="text-center p-6 bg-slate-800/30 border border-slate-700/50 rounded-xl">
              <div className="w-12 h-12 mx-auto mb-4 rounded-lg bg-coral-500/10 text-coral-500 flex items-center justify-center">
                <Icon size={20} />
              </div>
              <h3 className="text-sm font-semibold text-slate-200 mb-2">{title}</h3>
              <p className="text-xs text-slate-500 leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

