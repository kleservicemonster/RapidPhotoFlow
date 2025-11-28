'use client'

import { useCallback, useState, useRef } from 'react'
import { Upload, X, CheckCircle, AlertCircle, Loader2 } from 'lucide-react'

export type UploadStatus = 'pending' | 'uploading' | 'success' | 'error'

export interface FileUploadState {
  file: File
  status: UploadStatus
  error?: string
}

interface UploadDropzoneProps {
  onUpload: (files: File[]) => Promise<void>
  accept?: string
  multiple?: boolean
  disabled?: boolean
}

export function UploadDropzone({
  onUpload,
  accept = 'image/jpeg,image/png,image/gif,image/webp',
  multiple = true,
  disabled = false,
}: UploadDropzoneProps) {
  const [isDragOver, setIsDragOver] = useState(false)
  const [files, setFiles] = useState<FileUploadState[]>([])
  const [isUploading, setIsUploading] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    if (!disabled) setIsDragOver(true)
  }, [disabled])

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(false)
  }, [])

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(false)
    if (disabled) return

    const droppedFiles = Array.from(e.dataTransfer.files).filter((file) =>
      file.type.startsWith('image/')
    )
    if (droppedFiles.length > 0) addFiles(droppedFiles)
  }, [disabled])

  const handleFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = e.target.files
    if (selectedFiles) addFiles(Array.from(selectedFiles))
    if (inputRef.current) inputRef.current.value = ''
  }, [])

  const addFiles = (newFiles: File[]) => {
    const fileStates: FileUploadState[] = newFiles.map((file) => ({
      file,
      status: 'pending' as const,
    }))
    setFiles((prev) => [...prev, ...fileStates])
  }

  const removeFile = (index: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== index))
  }

  const handleUpload = async () => {
    const pendingFiles = files.filter((f) => f.status === 'pending')
    if (pendingFiles.length === 0) return

    setIsUploading(true)
    setFiles((prev) =>
      prev.map((f) =>
        f.status === 'pending' ? { ...f, status: 'uploading' as const } : f
      )
    )

    try {
      await onUpload(pendingFiles.map((f) => f.file))
      setFiles((prev) =>
        prev.map((f) =>
          f.status === 'uploading' ? { ...f, status: 'success' as const } : f
        )
      )
      setTimeout(() => {
        setFiles((prev) => prev.filter((f) => f.status !== 'success'))
      }, 2000)
    } catch (error) {
      setFiles((prev) =>
        prev.map((f) =>
          f.status === 'uploading'
            ? { ...f, status: 'error' as const, error: error instanceof Error ? error.message : 'Upload failed' }
            : f
        )
      )
    } finally {
      setIsUploading(false)
    }
  }

  const pendingCount = files.filter((f) => f.status === 'pending').length
  const uploadingCount = files.filter((f) => f.status === 'uploading').length

  return (
    <div className="space-y-6">
      <div
        className={`relative border-2 border-dashed rounded-2xl p-16 bg-slate-800/30 cursor-pointer transition-all ${
          isDragOver ? 'border-coral-500 bg-coral-500/10 scale-[1.01] shadow-lg shadow-coral-500/20' : 'border-slate-700 hover:border-coral-500 hover:bg-coral-500/5'
        } ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => !disabled && inputRef.current?.click()}
      >
        <input
          ref={inputRef}
          type="file"
          accept={accept}
          multiple={multiple}
          onChange={handleFileSelect}
          className="hidden"
          disabled={disabled}
        />

        <div className="flex flex-col items-center gap-4 text-center">
          <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-coral-500 to-amber-500 flex items-center justify-center text-slate-900">
            <Upload size={28} />
          </div>
          <p className="text-xl font-semibold text-slate-200">Drop photos here</p>
          <p className="text-sm text-slate-500">or click to browse • JPG, PNG, GIF, WebP up to 10MB</p>
        </div>
      </div>

      {files.length > 0 && (
        <div className="bg-slate-800/50 border border-slate-700/50 rounded-xl overflow-hidden">
          <div className="flex items-center justify-between p-4 border-b border-slate-700/50">
            <h3 className="text-sm font-semibold text-slate-200">Selected Files ({files.length})</h3>
            {pendingCount > 0 && (
              <button
                className="flex items-center gap-2 px-5 py-2.5 rounded-lg bg-gradient-to-r from-coral-500 to-amber-500 text-slate-900 text-sm font-semibold hover:-translate-y-0.5 hover:shadow-lg transition-all disabled:opacity-70 disabled:cursor-not-allowed"
                onClick={handleUpload}
                disabled={isUploading}
              >
                {isUploading ? (
                  <>
                    <Loader2 size={16} className="animate-spin" />
                    Uploading {uploadingCount}...
                  </>
                ) : (
                  <>
                    <Upload size={16} />
                    Upload {pendingCount} {pendingCount === 1 ? 'file' : 'files'}
                  </>
                )}
              </button>
            )}
          </div>

          <ul className="max-h-72 overflow-y-auto">
            {files.map((item, index) => (
              <li
                key={`${item.file.name}-${index}`}
                className={`flex items-center gap-4 p-3.5 border-b border-slate-700/50 last:border-b-0 transition-colors ${
                  item.status === 'uploading' ? 'bg-amber-500/5' : item.status === 'success' ? 'bg-emerald-500/5' : item.status === 'error' ? 'bg-red-500/5' : ''
                }`}
              >
                <div className="w-12 h-12 rounded-lg overflow-hidden flex-shrink-0 bg-slate-900">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={URL.createObjectURL(item.file)}
                    alt={item.file.name}
                    className="w-full h-full object-cover"
                  />
                </div>

                <div className="flex-1 min-w-0">
                  <span className="text-sm font-medium text-slate-200 truncate block">{item.file.name}</span>
                  <span className="text-xs font-mono text-slate-500">{(item.file.size / 1024 / 1024).toFixed(2)} MB</span>
                  {item.error && <span className="text-xs text-red-400 block">{item.error}</span>}
                </div>

                <div className="flex-shrink-0">
                  {item.status === 'pending' && (
                    <button
                      className="w-7 h-7 flex items-center justify-center rounded text-slate-500 hover:bg-red-500/10 hover:text-red-400 transition-colors"
                      onClick={(e) => { e.stopPropagation(); removeFile(index) }}
                    >
                      <X size={16} />
                    </button>
                  )}
                  {item.status === 'uploading' && <Loader2 size={18} className="animate-spin text-amber-400" />}
                  {item.status === 'success' && <CheckCircle size={18} className="text-emerald-400" />}
                  {item.status === 'error' && <AlertCircle size={18} className="text-red-400" />}
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}

