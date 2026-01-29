import { useEffect, useMemo, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { Plus } from 'lucide-react'
import { toast } from 'sonner'
import { TopAppBar } from '@/widgets/top-app-bar'
import { Container } from '@/widgets/container'
import { Button } from '@/shared/ui/button'
import { Input } from '@/shared/ui/input'
import { Label } from '@/shared/ui/label'
import { Textarea } from '@/shared/ui/textarea'
import { SubgroupImageUploader } from '@/features/subgroups/subgroup-create-image'
import { SubgroupPasswordSection } from '@/features/subgroups/subgroup-create-password'
import { createSubgroup } from '@/entities/subgroup/api/subgroupApi'

const DESCRIPTION_LIMIT = 500

type SubgroupCreatePageProps = {
  onSubmit?: () => void
  onBack?: () => void
}

export function SubgroupCreatePage({ onSubmit, onBack }: SubgroupCreatePageProps) {
  const [searchParams] = useSearchParams()
  const groupIdParam = searchParams.get('groupId')
  const groupId = groupIdParam ? Number(groupIdParam) : null
  const [imageFile, setImageFile] = useState<File | null>(null)
  const imagePreviewUrl = useMemo(
    () => (imageFile ? URL.createObjectURL(imageFile) : null),
    [imageFile],
  )
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [isPasswordEnabled, setIsPasswordEnabled] = useState(false)
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [touched, setTouched] = useState({ name: false, password: false, confirm: false })
  const [hasSubmitted, setHasSubmitted] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)

  useEffect(() => {
    if (!imagePreviewUrl) return
    return () => {
      URL.revokeObjectURL(imagePreviewUrl)
    }
  }, [imagePreviewUrl])

  const nameError = useMemo(() => {
    if (!name.trim()) return '그룹명을 입력해주세요'
    return ''
  }, [name])

  const passwordError = useMemo(() => {
    if (!isPasswordEnabled) return ''
    if (!password.trim()) return '비밀번호를 입력해주세요'
    return ''
  }, [isPasswordEnabled, password])

  const confirmError = useMemo(() => {
    if (!isPasswordEnabled) return ''
    if (!confirmPassword.trim()) return '비밀번호를 다시 입력해주세요'
    if (confirmPassword !== password) return '비밀번호가 일치하지 않아요'
    return ''
  }, [confirmPassword, isPasswordEnabled, password])

  const isFormValid = useMemo(() => {
    if (!name.trim()) return false
    if (!groupId || Number.isNaN(groupId)) return false
    if (!isPasswordEnabled) return true
    return Boolean(password.trim()) && confirmPassword === password
  }, [confirmPassword, groupId, isPasswordEnabled, name, password])

  const shouldShowNameError = (touched.name || hasSubmitted) && Boolean(nameError)
  const shouldShowPasswordError = (touched.password || hasSubmitted) && Boolean(passwordError)
  const shouldShowConfirmError = (touched.confirm || hasSubmitted) && Boolean(confirmError)

  const handlePasswordToggle = (enabled: boolean) => {
    setIsPasswordEnabled(enabled)
    if (!enabled) {
      setPassword('')
      setConfirmPassword('')
      setTouched((prev) => ({ ...prev, password: false, confirm: false }))
    }
  }

  const handleSubmit = async () => {
    setHasSubmitted(true)
    if (!isFormValid) return

    setIsSubmitting(true)
    setSubmitError(null)
    try {
      if (!groupId || Number.isNaN(groupId)) {
        setSubmitError('그룹 정보를 찾을 수 없습니다.')
        return
      }
      await createSubgroup(groupId, {
        name: name.trim(),
        description: description.trim() || undefined,
        profileImageUrl: undefined,
        joinType: isPasswordEnabled ? 'PASSWORD' : 'OPEN',
        password: isPasswordEnabled ? password.trim() : null,
      })
      toast.success('하위그룹을 생성했습니다.')
      onSubmit?.()
    } catch (error) {
      const code = (error as any)?.response?.data?.code
      if (code === 'ALREADY_EXISTS') {
        setSubmitError('이미 존재하는 하위그룹명입니다.')
      } else if (code === 'NO_PERMISSION') {
        setSubmitError('그룹 멤버만 하위그룹을 생성할 수 있습니다.')
      } else if (code === 'GROUP_NOT_FOUND') {
        setSubmitError('그룹 정보를 찾을 수 없습니다.')
      } else if (code === 'INVALID_REQUEST') {
        setSubmitError('요청 값이 올바르지 않습니다.')
      } else if (code === 'AUTHENTICATION_REQUIRED') {
        setSubmitError('로그인이 필요합니다.')
      } else {
        setSubmitError('하위그룹 생성에 실패했습니다. 잠시 후 다시 시도해주세요.')
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="flex flex-col h-full bg-background min-h-screen">
      <TopAppBar title="하위 그룹 생성" showBackButton onBack={onBack} />

      <Container className="flex-1 py-6 overflow-auto">
        <div className="space-y-6">
          {!groupId || Number.isNaN(groupId) ? (
            <p className="text-sm text-destructive">그룹 정보를 찾을 수 없습니다.</p>
          ) : null}
          <SubgroupImageUploader previewUrl={imagePreviewUrl} onImageChange={setImageFile} />

          <div className="space-y-2">
            <Label htmlFor="subgroup-name">그룹명 *</Label>
            <Input
              id="subgroup-name"
              placeholder="그룹명을 입력 해주세요"
              value={name}
              onChange={(event) => setName(event.target.value)}
              onBlur={() => setTouched((prev) => ({ ...prev, name: true }))}
              aria-invalid={shouldShowNameError}
            />
            {shouldShowNameError ? <p className="text-xs text-destructive">{nameError}</p> : null}
          </div>

          <div className="space-y-2">
            <Label htmlFor="subgroup-description">그룹 설명</Label>
            <Textarea
              id="subgroup-description"
              placeholder="그룹에 대한 소개를 입력해주세요"
              value={description}
              onChange={(event) => setDescription(event.target.value)}
              rows={5}
              maxLength={DESCRIPTION_LIMIT}
            />
            <p className="text-xs text-muted-foreground text-right">
              {description.length}/{DESCRIPTION_LIMIT}
            </p>
          </div>

          <SubgroupPasswordSection
            enabled={isPasswordEnabled}
            password={password}
            confirmPassword={confirmPassword}
            passwordError={shouldShowPasswordError ? passwordError : ''}
            confirmError={shouldShowConfirmError ? confirmError : ''}
            onToggle={handlePasswordToggle}
            onPasswordChange={setPassword}
            onConfirmChange={setConfirmPassword}
            onPasswordBlur={() => setTouched((prev) => ({ ...prev, password: true }))}
            onConfirmBlur={() => setTouched((prev) => ({ ...prev, confirm: true }))}
          />

          <Button className="w-full" onClick={handleSubmit} disabled={!isFormValid || isSubmitting}>
            <Plus className="w-4 h-4 mr-2" />
            {isSubmitting ? '생성 중...' : '생성하기'}
          </Button>
          {submitError ? <p className="text-xs text-destructive">{submitError}</p> : null}
        </div>
      </Container>
    </div>
  )
}
