import React, { useRef, useState } from 'react'
import { formatFileSize, compressAndValidateFile } from '../utils/fileHandling'
import toast from 'react-hot-toast'

interface DocumentUploadProps {
  documentType: string
  onUpload: (file: File, fileUrl: string) => void
  maxSizeMB?: number
  acceptedFormats?: string
  onError?: (error: string) => void
}

export const DocumentUpload: React.FC<DocumentUploadProps> = ({
  documentType,
  onUpload,
  maxSizeMB = 5,
  acceptedFormats = '.pdf,.jpg,.jpeg,.png',
  onError,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [preview, setPreview] = useState<string | null>(null)
  const [uploadedFile, setUploadedFile] = useState<File | null>(null)

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setIsLoading(true)
    try {
      // Validate and compress
      const result = await compressAndValidateFile(file, maxSizeMB)
      
      if (!result.valid) {
        const errorMsg = result.error || 'File validation failed'
        onError?.(errorMsg)
        toast.error(errorMsg)
        return
      }

      const processedFile = result.file || file
      const fileUrl = URL.createObjectURL(processedFile)

      // Generate preview for images
      if (file.type.startsWith('image/')) {
        setPreview(fileUrl)
      } else {
        setPreview(null)
      }

      setUploadedFile(processedFile)
      onUpload(processedFile, fileUrl)
      toast.success(`${documentType} uploaded successfully`)
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : 'Upload failed'
      onError?.(errorMsg)
      toast.error(errorMsg)
    } finally {
      setIsLoading(false)
    }
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    e.currentTarget.classList.add('bg-blue-50', 'border-blue-300')
  }

  const handleDragLeave = (e: React.DragEvent) => {
    e.currentTarget.classList.remove('bg-blue-50', 'border-blue-300')
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.currentTarget.classList.remove('bg-blue-50', 'border-blue-300')
    
    const file = e.dataTransfer.files?.[0]
    if (file) {
      if (fileInputRef.current) {
        const dataTransfer = new DataTransfer()
        dataTransfer.items.add(file)
        fileInputRef.current.files = dataTransfer.files
        handleFileSelect({ target: fileInputRef.current } as any)
      }
    }
  }

  return (
    <div className="space-y-4">
      <div
        onClick={() => fileInputRef.current?.click()}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center cursor-pointer transition-colors hover:border-primary-500 hover:bg-primary-50"
      >
        <input
          ref={fileInputRef}
          type="file"
          accept={acceptedFormats}
          onChange={handleFileSelect}
          disabled={isLoading}
          className="hidden"
          aria-label={`Upload ${documentType}`}
        />
        
        <div className="flex justify-center mb-2">
          <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M9 19l3 3m0 0l3-3m-3 3V10" />
          </svg>
        </div>

        <p className="text-sm font-medium text-gray-700 mb-1">
          {isLoading ? 'Uploading...' : `Upload ${documentType}`}
        </p>
        <p className="text-xs text-gray-500">
          Drag and drop or click to select. Max size: {maxSizeMB}MB
        </p>
      </div>

      {preview && (
        <div className="mt-4">
          <p className="text-sm font-medium text-gray-700 mb-2">Preview:</p>
          <img src={preview} alt="Document preview" className="max-w-full h-auto rounded-lg border border-gray-200" />
        </div>
      )}

      {uploadedFile && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-3">
          <p className="text-sm text-green-800 font-medium">✓ File uploaded</p>
          <p className="text-xs text-green-700 mt-1">{uploadedFile.name} ({formatFileSize(uploadedFile.size)})</p>
        </div>
      )}
    </div>
  )
}
