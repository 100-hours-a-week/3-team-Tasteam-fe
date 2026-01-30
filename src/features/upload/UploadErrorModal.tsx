import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/shared/ui/dialog'
import { Button } from '@/shared/ui/button'

type UploadErrorModalProps = {
  open: boolean
  onClose: () => void
  errors: string[]
}

export function UploadErrorModal({ open, onClose, errors }: UploadErrorModalProps) {
  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent showCloseButton={false}>
        <DialogHeader>
          <DialogTitle>이미지를 업로드하지 못했습니다</DialogTitle>
          <DialogDescription>아래 사유를 확인해주세요.</DialogDescription>
        </DialogHeader>
        <ul className="space-y-1 text-sm text-destructive">
          {errors.map((error, i) => (
            <li key={i}>• {error}</li>
          ))}
        </ul>
        <DialogFooter>
          <Button onClick={onClose} className="w-full">
            확인
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
