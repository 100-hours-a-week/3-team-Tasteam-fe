import { useState, useCallback, useRef, useEffect } from 'react'
import { createUploadGrant, uploadFileToS3 } from '@/entities/upload/api/uploadApi'
import {
  ALLOWED_IMAGE_TYPES,
  ALLOWED_IMAGE_EXTENSIONS,
  MAX_IMAGE_SIZE_MB,
  MAX_IMAGE_SIZE_BYTES,
  MIN_IMAGE_SIZE_BYTES,
  MAX_FILENAME_LENGTH,
} from '@/entities/upload/model/types'
import type { UploadPurpose } from '@/entities/upload/model/types'
import { toWebpSquare } from '@/shared/lib/imageTransform'

type ImageFile = {
  file: File
  previewUrl: string
}

type UploadResult = {
  fileUuid: string
  url: string
}

type UseImageUploadOptions = {
  purpose: UploadPurpose
  maxFiles?: number
  transform?: 'square-webp-100'
}

const transformImage = async (
  file: File,
  transform?: UseImageUploadOptions['transform'],
): Promise<File> => {
  if (transform === 'square-webp-100') {
    return toWebpSquare(file, 100)
  }
  return file
}

export function useImageUpload({ purpose, maxFiles = 5, transform }: UseImageUploadOptions) {
  const [files, setFiles] = useState<ImageFile[]>([])
  const [isUploading, setIsUploading] = useState(false)
  const [uploadErrors, setUploadErrors] = useState<string[]>([])
  const pendingTransformsRef = useRef<Promise<void>[]>([])
  const pendingCountRef = useRef(0)
  const filesRef = useRef<ImageFile[]>([])

  useEffect(() => {
    filesRef.current = files
  }, [files])

  const clearErrors = useCallback(() => {
    setUploadErrors([])
  }, [])

  const addFiles = useCallback(
    (fileList: FileList | File[]) => {
      const incoming = Array.from(fileList)
      const errors: string[] = []

      const valid = incoming.filter((f) => {
        if (f.name.length > MAX_FILENAME_LENGTH) {
          errors.push(`파일 이름이 너무 깁니다: ${f.name.slice(0, 50)}...`)
          return false
        }
        if (!ALLOWED_IMAGE_TYPES.includes(f.type as (typeof ALLOWED_IMAGE_TYPES)[number])) {
          errors.push(
            `지원하지 않는 이미지 형식입니다: ${f.name} (허용: ${ALLOWED_IMAGE_EXTENSIONS})`,
          )
          return false
        }
        if (f.size < MIN_IMAGE_SIZE_BYTES) {
          errors.push(`파일이 비어있거나 너무 작습니다: ${f.name}`)
          return false
        }
        if (f.size > MAX_IMAGE_SIZE_BYTES) {
          errors.push(`파일 크기가 ${MAX_IMAGE_SIZE_MB}MB를 초과합니다: ${f.name}`)
          return false
        }
        return true
      })

      if (errors.length > 0) {
        setUploadErrors(errors)
        return
      }

      setFiles((prev) => {
        const remaining = maxFiles - prev.length - pendingCountRef.current
        if (remaining <= 0) {
          setUploadErrors([`최대 ${maxFiles}개까지 업로드 가능합니다`])
          return prev
        }

        const toProcess = valid.slice(0, remaining)
        pendingCountRef.current += toProcess.length

        const processing = (async () => {
          const processed = await Promise.all(
            toProcess.map(async (file) => {
              try {
                const transformed = await transformImage(file, transform)
                return {
                  file: transformed,
                  previewUrl: URL.createObjectURL(transformed),
                }
              } catch {
                return {
                  file,
                  previewUrl: URL.createObjectURL(file),
                }
              }
            }),
          )

          setFiles((current) => [...current, ...processed])
        })()

        pendingTransformsRef.current.push(processing)
        void processing.finally(() => {
          pendingCountRef.current -= toProcess.length
          pendingTransformsRef.current = pendingTransformsRef.current.filter(
            (p) => p !== processing,
          )
        })

        return prev
      })
    },
    [maxFiles, transform],
  )

  const removeFile = useCallback((index: number) => {
    setFiles((prev) => {
      const removed = prev[index]
      if (removed) URL.revokeObjectURL(removed.previewUrl)
      return prev.filter((_, i) => i !== index)
    })
  }, [])

  const reset = useCallback(() => {
    setFiles((prev) => {
      prev.forEach((f) => URL.revokeObjectURL(f.previewUrl))
      return []
    })
  }, [])

  const uploadAll = useCallback(async (): Promise<UploadResult[]> => {
    if (pendingTransformsRef.current.length > 0) {
      await Promise.all(pendingTransformsRef.current)
    }

    const currentFiles = filesRef.current
    if (currentFiles.length === 0) return []

    setIsUploading(true)
    try {
      const grantResponse = await createUploadGrant({
        purpose,
        files: currentFiles.map((f) => ({
          fileName: f.file.name,
          contentType: f.file.type,
          size: f.file.size,
        })),
      })

      const uploads = grantResponse.data.uploads

      await Promise.all(
        uploads.map((grant, i) => uploadFileToS3(grant.url, grant.fields, currentFiles[i].file)),
      )

      return uploads.map((grant) => ({
        fileUuid: grant.fileUuid,
        url: `${grant.url}/${grant.objectKey}`,
      }))
    } catch (e) {
      setUploadErrors(['이미지 업로드에 실패했습니다. 다시 시도해주세요.'])
      throw e
    } finally {
      setIsUploading(false)
    }
  }, [files, purpose])

  return {
    files,
    isUploading,
    uploadErrors,
    clearErrors,
    addFiles,
    removeFile,
    uploadAll,
    reset,
  }
}
