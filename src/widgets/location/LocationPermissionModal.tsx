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
      <AlertDialogContent>
        <AlertDialogHeader>
          <div className="flex items-center gap-2">
            <MapPin className="h-5 w-5 text-primary" />
            <AlertDialogTitle>위치 서비스 사용</AlertDialogTitle>
          </div>
          <AlertDialogDescription>
            주변 맛집을 추천받으려면 위치 정보 접근을 허용해주세요.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={onDeny}>나중에</AlertDialogCancel>
          <AlertDialogAction onClick={onAllow}>허용</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
