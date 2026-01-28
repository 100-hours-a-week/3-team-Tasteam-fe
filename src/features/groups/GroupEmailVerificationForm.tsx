import { Button } from '@/shared/ui/button'
import { Input } from '@/shared/ui/input'
import { Label } from '@/shared/ui/label'
import { cn } from '@/shared/lib/utils'

type HelperStatus = 'idle' | 'sent' | 'success' | 'error' | 'expired'

type GroupEmailVerificationFormProps = {
  email: string
  onEmailChange: (value: string) => void
  emailHelperText?: string
  canSend: boolean
  isSending: boolean
  onSend: () => void
  code: string
  onCodeChange: (value: string) => void
  helperText?: string
  helperStatus?: HelperStatus
  timeLeft?: number
}

export function GroupEmailVerificationForm({
  email,
  onEmailChange,
  emailHelperText,
  canSend,
  isSending,
  onSend,
  code,
  onCodeChange,
  helperText,
  helperStatus = 'idle',
  timeLeft,
}: GroupEmailVerificationFormProps) {
  const helperClassName = cn('text-sm', {
    'text-emerald-600': helperStatus === 'success',
    'text-destructive': helperStatus === 'error' || helperStatus === 'expired',
    'text-muted-foreground': helperStatus === 'sent' || helperStatus === 'idle',
  })

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="group-email">이메일</Label>
        <div className="flex gap-2">
          <Input
            id="group-email"
            type="email"
            placeholder="회사이메일을 입력해주세요"
            value={email}
            onChange={(event) => onEmailChange(event.target.value)}
          />
          <Button
            type="button"
            variant="secondary"
            className="shrink-0"
            onClick={onSend}
            disabled={!canSend}
          >
            {isSending ? '전송 중...' : '인증발송'}
          </Button>
        </div>
        {emailHelperText && <p className="text-sm text-destructive">{emailHelperText}</p>}
      </div>

      <div className="space-y-2">
        <Label htmlFor="group-email-code">인증번호</Label>
        <Input
          id="group-email-code"
          placeholder="인증번호를 입력해주세요"
          inputMode="numeric"
          value={code}
          onChange={(event) => onCodeChange(event.target.value)}
        />
        {typeof timeLeft === 'number' && timeLeft > 0 && (
          <p className="text-xs text-muted-foreground">남은 시간 {timeLeft}초</p>
        )}
        {helperText && <p className={helperClassName}>{helperText}</p>}
      </div>
    </div>
  )
}
