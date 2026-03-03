import { AlertDialog } from '@/shared/ui/alert-dialog'
import { ConfirmAlertDialogContent } from '@/shared/ui/confirm-alert-dialog'

type LoginRequiredModalProps = {
  open: boolean
  onLogin: () => void
  onClose: () => void
}

export const LoginRequiredModal = ({ open, onLogin, onClose }: LoginRequiredModalProps) => {
  return (
    <AlertDialog open={open} onOpenChange={(nextOpen) => (!nextOpen ? onClose() : undefined)}>
      <ConfirmAlertDialogContent
        title="로그인이 필요해요"
        description="로그인이 필요한 기능이에요. 로그인하시겠어요?"
        cancelText="나중에"
        confirmText="로그인"
        onCancel={onClose}
        onConfirm={onLogin}
      />
    </AlertDialog>
  )
}
