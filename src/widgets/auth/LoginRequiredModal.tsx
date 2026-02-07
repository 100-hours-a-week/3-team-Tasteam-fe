import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/shared/ui/alert-dialog'

type LoginRequiredModalProps = {
  open: boolean
  onLogin: () => void
  onClose: () => void
}

export const LoginRequiredModal = ({ open, onLogin, onClose }: LoginRequiredModalProps) => {
  return (
    <AlertDialog open={open} onOpenChange={(nextOpen) => (!nextOpen ? onClose() : undefined)}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>로그인이 필요해요</AlertDialogTitle>
          <AlertDialogDescription>
            로그인이 필요한 기능이에요. 로그인하시겠어요?
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={onClose}>나중에</AlertDialogCancel>
          <AlertDialogAction onClick={onLogin}>로그인</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
