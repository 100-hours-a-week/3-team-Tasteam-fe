import { X } from 'lucide-react'
import { Dialog, DialogContent } from '@/shared/ui/dialog'
import { ImageWithFallback } from '@/shared/ui/image-with-fallback'
import { cn } from '@/shared/lib/utils'

type ImagePreviewDialogProps = {
  open: boolean
  onClose: () => void
  imageUrl: string
  alt?: string
}

export function ImagePreviewDialog({ open, onClose, imageUrl, alt }: ImagePreviewDialogProps) {
  return (
    <Dialog open={open} onOpenChange={(isOpen) => !isOpen && onClose()}>
      <DialogContent
        className={cn(
          'max-w-[95vw] max-h-[95vh] w-auto h-auto p-3 bg-transparent border-none shadow-none',
          'flex flex-col items-center justify-center',
        )}
        showCloseButton={false}
      >
        <button
          onClick={onClose}
          className="absolute top-2 right-2 z-50 p-1.5 rounded-full bg-muted/90 hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
          aria-label="닫기"
        >
          <X className="w-4 h-4" />
        </button>
        <div className="flex items-center justify-center w-full min-h-0 flex-1">
          <ImageWithFallback
            src={imageUrl}
            alt={alt || '이미지 미리보기'}
            className="max-w-full max-h-[85vh] object-contain rounded-lg"
            disableInteraction
          />
        </div>
      </DialogContent>
    </Dialog>
  )
}
