import { Eye, EyeOff } from 'lucide-react'
import { Button } from '@/shared/ui/button'
import { Input } from '@/shared/ui/input'
import { Label } from '@/shared/ui/label'
import { cn } from '@/shared/lib/utils'

type HelperStatus = 'idle' | 'error' | 'success'

type GroupPasswordJoinFormProps = {
  password: string
  onPasswordChange: (value: string) => void
  isPasswordVisible: boolean
  onToggleVisibility: () => void
  helperText?: string
  helperStatus?: HelperStatus
  className?: string
}

export function GroupPasswordJoinForm({
  password,
  onPasswordChange,
  isPasswordVisible,
  onToggleVisibility,
  helperText,
  helperStatus = 'idle',
  className,
}: GroupPasswordJoinFormProps) {
  const helperClassName = cn('text-sm', {
    'text-destructive': helperStatus === 'error',
    'text-emerald-600': helperStatus === 'success',
    'text-muted-foreground': helperStatus === 'idle',
  })

  return (
    <div className={cn('space-y-2', className)}>
      <Label htmlFor="group-password">비밀번호</Label>
      <div className="relative">
        <Input
          id="group-password"
          type={isPasswordVisible ? 'text' : 'password'}
          placeholder="비밀번호를 입력해주세요"
          value={password}
          onChange={(event) => onPasswordChange(event.target.value)}
        />
        <Button
          type="button"
          variant="ghost"
          size="icon"
          onClick={onToggleVisibility}
          className="absolute right-1 top-1/2 -translate-y-1/2"
          aria-label={isPasswordVisible ? '비밀번호 숨기기' : '비밀번호 표시'}
        >
          {isPasswordVisible ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
        </Button>
      </div>
      {helperText && <p className={helperClassName}>{helperText}</p>}
    </div>
  )
}
