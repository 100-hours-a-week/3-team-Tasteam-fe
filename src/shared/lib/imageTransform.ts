const WEBP_QUALITY = 0.92

const loadImage = (file: File): Promise<HTMLImageElement> =>
  new Promise((resolve, reject) => {
    const img = new Image()
    const objectUrl = URL.createObjectURL(file)
    img.onload = () => {
      URL.revokeObjectURL(objectUrl)
      resolve(img)
    }
    img.onerror = () => {
      URL.revokeObjectURL(objectUrl)
      reject(new Error('이미지 로드에 실패했습니다.'))
    }
    img.src = objectUrl
  })

export const toWebpSquare = async (file: File, maxDimension = 100): Promise<File> => {
  const image = await loadImage(file)
  const originalWidth = image.naturalWidth || image.width
  const originalHeight = image.naturalHeight || image.height

  if (!originalWidth || !originalHeight) {
    return file
  }

  const minSide = Math.min(originalWidth, originalHeight)
  const scale = minSide > maxDimension ? maxDimension / minSide : 1

  const resizedWidth = Math.round(originalWidth * scale)
  const resizedHeight = Math.round(originalHeight * scale)

  const resizeCanvas = document.createElement('canvas')
  resizeCanvas.width = resizedWidth
  resizeCanvas.height = resizedHeight

  const resizeContext = resizeCanvas.getContext('2d')
  if (!resizeContext) return file

  resizeContext.drawImage(image, 0, 0, resizedWidth, resizedHeight)

  const cropSize = Math.min(resizedWidth, resizedHeight, maxDimension)
  const cropX = Math.round((resizedWidth - cropSize) / 2)
  const cropY = Math.round((resizedHeight - cropSize) / 2)

  const cropCanvas = document.createElement('canvas')
  cropCanvas.width = cropSize
  cropCanvas.height = cropSize

  const cropContext = cropCanvas.getContext('2d')
  if (!cropContext) return file

  cropContext.drawImage(resizeCanvas, cropX, cropY, cropSize, cropSize, 0, 0, cropSize, cropSize)

  const blob = await new Promise<Blob | null>((resolve) => {
    cropCanvas.toBlob(resolve, 'image/webp', WEBP_QUALITY)
  })

  if (!blob) return file

  const baseName = file.name.replace(/\.[^/.]+$/, '') || 'image'
  return new File([blob], `${baseName}.webp`, { type: 'image/webp' })
}
