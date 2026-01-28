import { Lock, ShieldCheck } from 'lucide-react'
import { Card, CardContent } from '@/shared/ui/card'
import { Input } from '@/shared/ui/input'
import { Label } from '@/shared/ui/label'
import { Switch } from '@/shared/ui/switch'
import { cn } from '@/shared/lib/utils'

type SubgroupPasswordSectionProps = {
  enabled: boolean
  password: string
  confirmPassword: string
  passwordError?: string
  confirmError?: string
  onToggle: (enabled: boolean) => void
  onPasswordChange: (value: string) => void
  onConfirmChange: (value: string) => void
  onPasswordBlur?: () => void
  onConfirmBlur?: () => void
}

export function SubgroupPasswordSection({
  enabled,
  password,
  confirmPassword,
  passwordError,
  confirmError,
  onToggle,
  onPasswordChange,
  onConfirmChange,
  onPasswordBlur,
  onConfirmBlur,
}: SubgroupPasswordSectionProps) {
  return (
    <Card>
      <CardContent className="p-4 space-y-4">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <ShieldCheck className="h-5 w-5 text-muted-foreground" />
            <div>
              <Label htmlFor="subgroup-password-toggle" className="cursor-pointer">
                비밀번호로 가입 제한
              </Label>
              <p className="text-xs text-muted-foreground">
                비공개 그룹으로 설정하면 비밀번호가 필요해요
              </p>
            </div>
          </div>
          <Switch id="subgroup-password-toggle" checked={enabled} onCheckedChange={onToggle} />
        </div>

        <div className={cn('space-y-3', !enabled && 'opacity-60')}>
          <div className="space-y-2">
            <Label htmlFor="subgroup-password" className="flex items-center gap-2">
              <Lock className="h-4 w-4" />
              비밀번호
            </Label>
            <Input
              id="subgroup-password"
              type="password"
              placeholder="비밀번호를 입력해주세요"
              value={password}
              onChange={(event) => onPasswordChange(event.target.value)}
              onBlur={onPasswordBlur}
              disabled={!enabled}
              aria-invalid={Boolean(passwordError)}
            />
            {passwordError ? <p className="text-xs text-destructive">{passwordError}</p> : null}
          </div>

          <div className="space-y-2">
            <Label htmlFor="subgroup-password-confirm">비밀번호 확인</Label>
            <Input
              id="subgroup-password-confirm"
              type="password"
              placeholder="비밀번호를 다시한번 입력해주세요"
              value={confirmPassword}
              onChange={(event) => onConfirmChange(event.target.value)}
              onBlur={onConfirmBlur}
              disabled={!enabled}
              aria-invalid={Boolean(confirmError)}
            />
            {confirmError ? <p className="text-xs text-destructive">{confirmError}</p> : null}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
