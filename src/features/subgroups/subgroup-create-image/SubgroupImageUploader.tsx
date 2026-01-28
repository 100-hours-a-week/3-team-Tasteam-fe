import type { ChangeEvent } from 'react'
import { useRef } from 'react'
import { Image } from 'lucide-react'
import { Button } from '@/shared/ui/button'
import { ImageWithFallback } from '@/shared/ui/image-with-fallback'
import { cn } from '@/shared/lib/utils'

type SubgroupImageUploaderProps = {
  previewUrl?: string | null
  onImageChange: (file: File | null) => void
}

export function SubgroupImageUploader({ previewUrl, onImageChange }: SubgroupImageUploaderProps) {
  const fileInputRef = useRef<HTMLInputElement | null>(null)

  const handlePickImage = () => {
    fileInputRef.current?.click()
  }

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] ?? null
    onImageChange(file)
  }

  return (
    <div className="flex flex-col items-center gap-3">
      <button
        type="button"
        className={cn(
          'relative w-28 h-28 rounded-full bg-muted flex items-center justify-center overflow-hidden border-2 border-dashed',
          previewUrl ? 'border-transparent' : 'border-muted-foreground/40',
        )}
        onClick={handlePickImage}
        aria-label="하위 그룹 대표 이미지 선택"
      >
        {previewUrl ? (
          <ImageWithFallback
            src={previewUrl}
            alt="하위 그룹 대표 이미지 미리보기"
            className="w-full h-full object-cover"
          />
        ) : (
          <Image className="w-8 h-8 text-muted-foreground" />
        )}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="hidden"
        />
      </button>
      <div className="text-center">
        <p className="text-sm font-medium">대표 이미지</p>
        <p className="text-xs text-muted-foreground">미선택 시 기본 이미지가 적용돼요</p>
      </div>
      <Button
        type="button"
        size="sm"
        onClick={handlePickImage}
        className="bg-primary text-white hover:bg-primary/90 h-7 px-3 text-sm"
      >
        이미지 업로드
      </Button>
    </div>
  )
}
