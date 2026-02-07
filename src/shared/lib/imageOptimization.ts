import imageCompression from 'browser-image-compression'
import type { UploadPurpose } from '@/entities/upload/model/types'

type OptimizationConfig = {
  maxWidth: number
  maxHeight?: number
  quality: number
  maxSizeMB: number
}

const OPTIMIZATION_CONFIGS: Record<UploadPurpose, OptimizationConfig> = {
  PROFILE_IMAGE: {
    maxWidth: 100,
    maxHeight: 100,
    quality: 0.85,
    maxSizeMB: 0.5,
  },
  REVIEW_IMAGE: {
    maxWidth: 1200,
    quality: 0.9,
    maxSizeMB: 2,
  },
  GROUP_IMAGE: {
    maxWidth: 800,
    maxHeight: 800,
    quality: 0.85,
    maxSizeMB: 1,
  },
  RESTAURANT_IMAGE: {
    maxWidth: 1200,
    quality: 0.9,
    maxSizeMB: 2,
  },
  COMMON_ASSET: {
    maxWidth: 1200,
    quality: 0.9,
    maxSizeMB: 2,
  },
}

export async function optimizeImage(file: File, purpose: UploadPurpose): Promise<File> {
  const config = OPTIMIZATION_CONFIGS[purpose] || OPTIMIZATION_CONFIGS.REVIEW_IMAGE

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
    console.error('Image optimization failed:', error)
    return file
  }
}

export function getOptimizationConfig(purpose: UploadPurpose): OptimizationConfig {
  return OPTIMIZATION_CONFIGS[purpose] || OPTIMIZATION_CONFIGS.REVIEW_IMAGE
}
