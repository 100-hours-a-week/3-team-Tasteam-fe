import { AlertDialog } from '@/shared/ui/alert-dialog'
import { ConfirmAlertDialogContent } from '@/shared/ui/confirm-alert-dialog'
import { MapPin } from 'lucide-react'

type LocationPermissionModalProps = {
  open: boolean
  onAllow: () => void
  onDeny: () => void
}

export const LocationPermissionModal = ({
  open,
  onAllow,
  onDeny,
}: LocationPermissionModalProps) => {
  return (
    <AlertDialog open={open} onOpenChange={(nextOpen) => (!nextOpen ? onDeny() : undefined)}>
      <ConfirmAlertDialogContent
        title="위치 서비스 사용"
        description="주변 맛집을 추천받으려면 위치 정보 접근을 허용해주세요."
        cancelText="나중에"
        confirmText="허용"
        onCancel={onDeny}
        onConfirm={onAllow}
        icon={<MapPin className="h-5 w-5 text-primary" />}
      />
    </AlertDialog>
  )
}
