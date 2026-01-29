import { useEffect, useState } from 'react'
import { Camera, Check } from 'lucide-react'
import { toast } from 'sonner'
import { useNavigate } from 'react-router-dom'
import { TopAppBar } from '@/widgets/top-app-bar'
import { Container } from '@/widgets/container'
import { Button } from '@/shared/ui/button'
import { Input } from '@/shared/ui/input'
import { Label } from '@/shared/ui/label'
import { Avatar, AvatarFallback, AvatarImage } from '@/shared/ui/avatar'
import { getMe, updateMeProfile } from '@/entities/member/api/memberApi'
import type { MemberMeResponseDto } from '@/entities/member/model/dto'

type EditProfilePageProps = {
  onBack?: () => void
}

export function EditProfilePage({ onBack }: EditProfilePageProps) {
  const navigate = useNavigate()
  const [userData, setUserData] = useState<MemberMeResponseDto | null>(null)
  const [nickname, setNickname] = useState('')
  const [bio, setBio] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [initialNickname, setInitialNickname] = useState('')
  const [initialBio, setInitialBio] = useState('')

  useEffect(() => {
    getMe()
      .then((data) => {
        setUserData(data)
        const userNickname = data.data?.member?.nickname ?? '사용자'
        const userBio = ''
        setNickname(userNickname)
        setBio(userBio)
        setInitialNickname(userNickname)
        setInitialBio(userBio)
      })
      .catch(() => {
        toast.error('프로필을 불러올 수 없습니다')
      })
  }, [])

  const handleSave = async () => {
    if (!nickname.trim()) {
      toast.error('닉네임을 입력해주세요')
      return
    }

    setIsLoading(true)
    try {
      await updateMeProfile({ nickname, bio })
      toast.success('프로필이 수정되었습니다')
      navigate('/profile', { replace: true })
    } catch {
      toast.error('프로필 수정에 실패했습니다')
    } finally {
      setIsLoading(false)
    }
  }

  const isChanged = nickname !== initialNickname || bio !== initialBio
  const user = {
    nickname: userData?.data?.member?.nickname ?? '사용자',
    email: 'chulsoo@example.com',
    profileImageUrl: userData?.data?.member?.profileImageUrl,
    bio: '',
  }

  return (
    <div className="flex flex-col h-full bg-background min-h-screen">
      <TopAppBar
        title="프로필 수정"
        showBackButton
        onBack={onBack}
        actions={
          <Button variant="ghost" size="sm" onClick={handleSave} disabled={!isChanged || isLoading}>
            <Check className="w-5 h-5" />
          </Button>
        }
      />

      <Container className="flex-1 py-6 overflow-auto">
        <div className="space-y-6">
          <div className="flex flex-col items-center">
            <div className="relative">
              <Avatar className="w-24 h-24">
                <AvatarImage src={user.profileImageUrl} alt={user.nickname} />
                <AvatarFallback className="text-2xl">{user.nickname[0]}</AvatarFallback>
              </Avatar>
              <button className="absolute bottom-0 right-0 w-8 h-8 rounded-full bg-primary flex items-center justify-center text-primary-foreground">
                <Camera className="w-4 h-4" />
                <input
                  type="file"
                  accept="image/*"
                  className="absolute inset-0 opacity-0 cursor-pointer"
                />
              </button>
            </div>
            <p className="text-sm text-muted-foreground mt-2">프로필 사진 변경</p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">이메일</Label>
            <Input id="email" value={user.email} disabled className="bg-muted" />
          </div>

          <div className="space-y-2">
            <Label htmlFor="nickname">닉네임</Label>
            <Input
              id="nickname"
              value={nickname}
              onChange={(e) => setNickname(e.target.value)}
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

          <Button className="w-full" onClick={handleSave} disabled={!isChanged || isLoading}>
            {isLoading ? '저장 중...' : '저장하기'}
          </Button>
        </div>
      </Container>
    </div>
  )
}
