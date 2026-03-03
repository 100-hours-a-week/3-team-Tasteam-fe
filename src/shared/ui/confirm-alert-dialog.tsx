import * as React from 'react'
import { Button } from '@/shared/ui/button'
import {
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/shared/ui/alert-dialog'
import { cn } from '@/shared/lib/utils'

type ConfirmAlertDialogContentProps = {
  title: React.ReactNode
  description?: React.ReactNode
  icon?: React.ReactNode
  confirmText?: string
  cancelText?: string
  onConfirm?: () => void
  onCancel?: () => void
  confirmVariant?: React.ComponentProps<typeof Button>['variant']
  confirmDisabled?: boolean
  hideCancel?: boolean
  size?: 'default' | 'sm'
  className?: string
  actionClassName?: string
}

export function ConfirmAlertDialogContent({
  title,
  description,
  icon,
  confirmText = '확인',
  cancelText = '취소',
  onConfirm,
  onCancel,
  confirmVariant = 'default',
  confirmDisabled = false,
  hideCancel = false,
  size = 'sm',
  className,
  actionClassName,
}: ConfirmAlertDialogContentProps) {
  return (
    <AlertDialogContent size={size} className={className}>
      <AlertDialogHeader>
        {icon ? (
          <div className="flex items-center gap-2">
            {icon}
            <AlertDialogTitle>{title}</AlertDialogTitle>
          </div>
        ) : (
          <AlertDialogTitle>{title}</AlertDialogTitle>
        )}
        {description ? <AlertDialogDescription>{description}</AlertDialogDescription> : null}
      </AlertDialogHeader>
      <AlertDialogFooter>
        {!hideCancel ? (
          <AlertDialogCancel onClick={onCancel}>{cancelText}</AlertDialogCancel>
        ) : null}
        <AlertDialogAction
          variant={confirmVariant}
          className={cn(actionClassName)}
          onClick={onConfirm}
          disabled={confirmDisabled}
        >
          {confirmText}
        </AlertDialogAction>
      </AlertDialogFooter>
    </AlertDialogContent>
  )
}
