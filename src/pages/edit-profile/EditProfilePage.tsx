import { useEffect, useState } from 'react'
import { Camera } from 'lucide-react'
import { toast } from 'sonner'
import { useNavigate } from 'react-router-dom'
import { TopAppBar } from '@/widgets/top-app-bar'
import { Container } from '@/widgets/container'
import { Button } from '@/shared/ui/button'
import { Input } from '@/shared/ui/input'
import { Label } from '@/shared/ui/label'
import { Avatar, AvatarFallback, AvatarImage } from '@/shared/ui/avatar'
import { getMe, updateMeProfile } from '@/entities/member/api/memberApi'
import { useImageUpload, UploadErrorModal } from '@/features/upload'
import type { MemberProfileDto } from '@/entities/member/model/dto'

type EditProfilePageProps = {
  onBack?: () => void
}

export function EditProfilePage({ onBack }: EditProfilePageProps) {
  const navigate = useNavigate()
  const [member, setMember] = useState<MemberProfileDto | null>(null)
  const [nickname, setNickname] = useState('')
  const [bio, setBio] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [isFetching, setIsFetching] = useState(true)
  const [initialNickname, setInitialNickname] = useState('')
  const [initialBio, setInitialBio] = useState('')

  const {
    files: profileImages,
    isUploading,
    uploadErrors,
    clearErrors,
    addFiles,
    uploadAll,
  } = useImageUpload({
    purpose: 'PROFILE_IMAGE',
    maxFiles: 1,
  })

  const profilePreviewUrl = profileImages.length > 0 ? profileImages[0].previewUrl : undefined

  useEffect(() => {
    setIsFetching(true)
    getMe()
      .then((data) => {
        const memberData = data.data?.member
        if (memberData) {
          setMember(memberData)
          setNickname(memberData.nickname)
          setBio(memberData.introduction ?? '')
          setInitialNickname(memberData.nickname)
          setInitialBio(memberData.introduction ?? '')
        }
      })
      .catch(() => {
        toast.error('프로필을 불러올 수 없습니다')
      })
      .finally(() => {
        setIsFetching(false)
      })
  }, [])

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      addFiles(e.target.files)
    }
    e.target.value = ''
  }

  const handleSave = async () => {
    if (!nickname.trim()) {
      toast.error('닉네임을 입력해주세요')
      return
    }
    if (/\s/.test(nickname)) {
      toast.error('닉네임에는 공백을 사용할 수 없습니다')
      return
    }

    setIsLoading(true)
    try {
      let profileImageFileUuid: string | undefined

      if (profileImages.length > 0) {
        const results = await uploadAll()
        profileImageFileUuid = results[0].fileUuid
      }

      await updateMeProfile({ nickname, bio, profileImageFileUuid })
      toast.success('프로필이 수정되었습니다')
      navigate('/profile', { replace: true })
    } catch {
      toast.error('프로필 수정에 실패했습니다')
    } finally {
      setIsLoading(false)
    }
  }

  const hasImageChange = profileImages.length > 0
  const isChanged = nickname !== initialNickname || bio !== initialBio || hasImageChange

  if (isFetching) {
    return (
      <div className="flex flex-col h-full bg-background min-h-screen">
        <TopAppBar title="프로필 수정" showBackButton onBack={onBack} />
        <Container className="flex-1 py-6 flex items-center justify-center">
          <p className="text-sm text-muted-foreground">프로필을 불러오는 중...</p>
        </Container>
      </div>
    )
  }

  if (!member) {
    return (
      <div className="flex flex-col h-full bg-background min-h-screen">
        <TopAppBar title="프로필 수정" showBackButton onBack={onBack} />
        <Container className="flex-1 py-6 flex items-center justify-center">
          <p className="text-sm text-destructive">프로필을 불러올 수 없습니다</p>
        </Container>
      </div>
    )
  }

  return (
    <div className="flex flex-col h-full bg-background min-h-screen">
      <TopAppBar title="프로필 수정" showBackButton onBack={onBack} />

      <Container className="flex-1 py-6 overflow-auto pb-24">
        <div className="space-y-6">
          <div className="flex flex-col items-center">
            <div className="relative">
              <Avatar className="w-24 h-24">
                <AvatarImage
                  src={profilePreviewUrl ?? member.profileImageUrl ?? undefined}
                  alt={member.nickname}
                />
                <AvatarFallback className="text-2xl">{member.nickname[0]}</AvatarFallback>
              </Avatar>
              <button className="absolute bottom-0 right-0 w-8 h-8 rounded-full bg-primary flex items-center justify-center text-primary-foreground">
                <Camera className="w-4 h-4" />
                <input
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  onChange={handleImageChange}
                  className="absolute inset-0 opacity-0 cursor-pointer"
                />
              </button>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="nickname">닉네임</Label>
            <Input
              id="nickname"
              value={nickname}
              onChange={(e) => setNickname(e.target.value.replace(/\s/g, ''))}
              placeholder="닉네임을 입력하세요"
              maxLength={20}
            />
            <p className="text-xs text-muted-foreground text-right">{nickname.length}/20</p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="bio">자기소개</Label>
            <textarea
              id="bio"
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              placeholder="자기소개를 입력하세요"
              maxLength={100}
              rows={2}
              className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 resize-none"
            />
            <p className="text-xs text-muted-foreground text-right">{bio.length}/100</p>
          </div>
        </div>
      </Container>

      <div className="sticky bottom-0 border-t border-border bg-background/95 backdrop-blur">
        <Container className="py-4">
          <Button
            variant="default"
            className="w-full h-11 font-medium"
            onClick={handleSave}
            disabled={!isChanged || isLoading || isUploading}
          >
            {isUploading ? '이미지 업로드 중...' : isLoading ? '저장 중...' : '저장하기'}
          </Button>
        </Container>
      </div>

      <UploadErrorModal
        open={uploadErrors.length > 0}
        onClose={clearErrors}
        errors={uploadErrors}
      />
    </div>
  )
}
