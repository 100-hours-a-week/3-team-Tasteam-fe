import { X } from 'lucide-react'
import { Dialog, DialogContent } from '@/shared/ui/dialog'
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
          'max-w-[95vw] max-h-[95vh] w-auto h-auto p-0 bg-transparent border-none shadow-none',
          'flex items-center justify-center',
        )}
        showCloseButton={false}
      >
        <div className="relative w-full h-full flex items-center justify-center">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 z-50 p-2 bg-black/50 hover:bg-black/70 text-white rounded-full transition-colors"
            aria-label="닫기"
          >
            <X className="w-6 h-6" />
          </button>
          <img
            src={imageUrl}
            alt={alt || '이미지 미리보기'}
            className="max-w-full max-h-[90vh] object-contain rounded-lg"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      </DialogContent>
    </Dialog>
  )
}
