import imageCompression from 'browser-image-compression'
import { OPTIMIZATION_CONFIGS, type UploadPurpose } from '@/entities/upload/model/types'
import { logger } from '@/shared/lib/logger'

type OptimizationConfig = (typeof OPTIMIZATION_CONFIGS)[keyof typeof OPTIMIZATION_CONFIGS]

const DEFAULT_OPTIMIZATION_CONFIG = OPTIMIZATION_CONFIGS.REVIEW_IMAGE

export async function optimizeImage(file: File, purpose: UploadPurpose): Promise<File> {
  const config = getOptimizationConfig(purpose)

  try {
    const options: Parameters<typeof imageCompression>[1] = {
      maxWidthOrHeight: config.maxWidth,
      useWebWorker: true,
      fileType: 'image/webp',
      initialQuality: config.quality,
      maxSizeMB: config.maxSizeMB,
    }

    const optimized = await imageCompression(file, options)

    const webpFile = new File([optimized], file.name.replace(/\.[^.]+$/, '.webp'), {
      type: 'image/webp',
    })

    if (webpFile.size > file.size) {
      return file
    }

    return webpFile
  } catch (error) {
    logger.error('Image optimization failed:', error)
    return file
  }
}

export function getOptimizationConfig(purpose: UploadPurpose): OptimizationConfig {
  if (purpose in OPTIMIZATION_CONFIGS) {
    return OPTIMIZATION_CONFIGS[purpose as keyof typeof OPTIMIZATION_CONFIGS]
  }

  return DEFAULT_OPTIMIZATION_CONFIG
}
