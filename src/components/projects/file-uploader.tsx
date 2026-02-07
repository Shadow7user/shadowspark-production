'use client'

import { useState, useCallback } from 'react'
import { useDropzone } from 'react-dropzone'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { Upload, File, X, Download, Trash2 } from 'lucide-react'
import { getUploadSignature, saveFileRecord, deleteFile } from '@/lib/actions/project-files'
import { formatFileSize, getFileType } from '@/lib/cloudinary'

interface ProjectFile {
  id: string
  name: string
  url: string
  type: string
  size: number
  createdAt: Date
  uploadedBy: {
    id: string
    name: string | null
    email: string
  }
}

interface FileUploaderProps {
  projectId: string
  files: ProjectFile[]
  currentUserId: string
  isAdmin: boolean
}

export function FileUploader({ projectId, files: initialFiles, currentUserId, isAdmin }: FileUploaderProps) {
  const [files, setFiles] = useState(initialFiles)
  const [uploading, setUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [deleting, setDeleting] = useState<string | null>(null)

  const onDrop = useCallback(
    async (acceptedFiles: File[]) => {
      if (acceptedFiles.length === 0) return

      const file = acceptedFiles[0] // Single file upload
      const maxSize = 50 * 1024 * 1024 // 50MB

      if (file.size > maxSize) {
        alert('File size exceeds 50MB limit')
        return
      }

      setUploading(true)
      setUploadProgress(0)

      try {
        // Get upload signature from server
        const signatureResult = await getUploadSignature(projectId)

        if (!signatureResult.success || !signatureResult.signature) {
          throw new Error(signatureResult.error || 'Failed to get upload signature')
        }

        const { signature, timestamp, apiKey, cloudName } = signatureResult

        // Upload to Cloudinary
        const formData = new FormData()
        formData.append('file', file)
        formData.append('signature', signature)
        formData.append('timestamp', timestamp!.toString())
        formData.append('api_key', apiKey!)
        formData.append('folder', `projects/${projectId}`)

        const xhr = new XMLHttpRequest()

        xhr.upload.addEventListener('progress', (e) => {
          if (e.lengthComputable) {
            const progress = Math.round((e.loaded / e.total) * 100)
            setUploadProgress(progress)
          }
        })

        const uploadPromise = new Promise<any>((resolve, reject) => {
          xhr.onload = () => {
            if (xhr.status === 200) {
              resolve(JSON.parse(xhr.responseText))
            } else {
              reject(new Error('Upload failed'))
            }
          }
          xhr.onerror = () => reject(new Error('Upload failed'))
        })

        xhr.open('POST', `https://api.cloudinary.com/v1_1/${cloudName}/auto/upload`)
        xhr.send(formData)

        const cloudinaryResponse = await uploadPromise

        // Save file record to database
        const saveResult = await saveFileRecord({
          projectId,
          name: file.name,
          url: cloudinaryResponse.secure_url,
          type: getFileType(file.type),
          size: file.size,
          cloudinaryId: cloudinaryResponse.public_id,
        })

        if (saveResult.success && saveResult.file) {
          setFiles([saveResult.file, ...files])
        } else {
          throw new Error(saveResult.error || 'Failed to save file record')
        }
      } catch (error) {
        console.error('Upload failed:', error)
        alert('Upload failed. Please try again.')
      } finally {
        setUploading(false)
        setUploadProgress(0)
      }
    },
    [projectId, files]
  )

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    multiple: false,
    disabled: uploading,
  })

  const handleDelete = async (fileId: string) => {
    if (!confirm('Are you sure you want to delete this file?')) return

    setDeleting(fileId)
    try {
      const result = await deleteFile(fileId)

      if (result.success) {
        setFiles((prev) => prev.filter((f) => f.id !== fileId))
      } else {
        alert(result.error || 'Failed to delete file')
      }
    } catch (error) {
      console.error('Delete failed:', error)
      alert('Failed to delete file. Please try again.')
    } finally {
      setDeleting(null)
    }
  }

  const getFileIcon = (type: string) => {
    return <File className="h-5 w-5 text-blue-600" />
  }

  return (
    <div className="space-y-6">
      <div
        {...getRootProps()}
        className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
          isDragActive
            ? 'border-blue-500 bg-blue-50'
            : uploading
              ? 'border-gray-300 bg-gray-50 cursor-not-allowed'
              : 'border-gray-300 hover:border-blue-400 cursor-pointer'
        }`}
      >
        <input {...getInputProps()} />
        <div className="flex flex-col items-center gap-2">
          <Upload className={`h-10 w-10 ${uploading ? 'text-gray-400' : 'text-gray-500'}`} />
          {uploading ? (
            <div className="w-full max-w-xs space-y-2">
              <p className="text-sm text-gray-600">Uploading...</p>
              <Progress value={uploadProgress} />
              <p className="text-xs text-gray-500">{uploadProgress}%</p>
            </div>
          ) : (
            <>
              <p className="text-sm font-medium">
                {isDragActive ? 'Drop file here' : 'Drag & drop a file here, or click to select'}
              </p>
              <p className="text-xs text-gray-500">Maximum file size: 50MB</p>
            </>
          )}
        </div>
      </div>

      <div className="space-y-3">
        <h3 className="font-semibold">Uploaded Files ({files.length})</h3>
        {files.length > 0 ? (
          <div className="space-y-2">
            {files.map((file) => (
              <div
                key={file.id}
                className="flex items-center justify-between border rounded-lg p-3 hover:bg-gray-50"
              >
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  {getFileIcon(file.type)}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{file.name}</p>
                    <p className="text-xs text-gray-500">
                      {formatFileSize(file.size)} • Uploaded by{' '}
                      {file.uploadedBy.name || file.uploadedBy.email}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    asChild
                  >
                    <a
                      href={file.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      download
                    >
                      <Download className="h-4 w-4" />
                    </a>
                  </Button>
                  {isAdmin && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDelete(file.id)}
                      disabled={deleting === file.id}
                      className="text-red-600 hover:text-red-700 hover:bg-red-50"
                    >
                      {deleting === file.id ? (
                        <X className="h-4 w-4 animate-spin" />
                      ) : (
                        <Trash2 className="h-4 w-4" />
                      )}
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-gray-500 border rounded-lg">
            No files uploaded yet.
          </div>
        )}
      </div>
    </div>
  )
}
