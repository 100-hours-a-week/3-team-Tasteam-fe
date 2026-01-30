import { useState } from 'react'
import { Camera, Plus, X } from 'lucide-react'
import { toast } from 'sonner'
import { TopAppBar } from '@/widgets/top-app-bar'
import { Container } from '@/widgets/container'
import { Button } from '@/shared/ui/button'
import { Input } from '@/shared/ui/input'
import { Label } from '@/shared/ui/label'
import { Textarea } from '@/shared/ui/textarea'
import { Badge } from '@/shared/ui/badge'
import { Card, CardContent } from '@/shared/ui/card'
import { useImageUpload, UploadErrorModal } from '@/features/upload'

type CreateGroupPageProps = {
  onSubmit?: (data: { name: string; description: string; tags: string[]; imageId?: string }) => void
  onBack?: () => void
}

const SUGGESTED_TAGS = ['한식', '양식', '일식', '중식', '카페', '브런치', '술집', '야식']

export function CreateGroupPage({ onSubmit, onBack }: CreateGroupPageProps) {
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [tags, setTags] = useState<string[]>([])
  const [isLoading, setIsLoading] = useState(false)

  const {
    files: groupImages,
    isUploading,
    uploadErrors,
    clearErrors,
    addFiles,
    uploadAll,
  } = useImageUpload({
    purpose: 'GROUP_IMAGE',
    maxFiles: 1,
  })

  const groupImagePreview = groupImages.length > 0 ? groupImages[0].previewUrl : undefined

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      addFiles(e.target.files)
    }
    e.target.value = ''
  }

  const handleTagToggle = (tag: string) => {
    setTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : prev.length < 5 ? [...prev, tag] : prev,
    )
  }

  const handleSubmit = async () => {
    if (!name.trim()) return

    setIsLoading(true)
    try {
      let imageId: string | undefined
      if (groupImages.length > 0) {
        const results = await uploadAll()
        imageId = results[0].fileUuid
      }

      onSubmit?.({ name, description, tags, imageId })
    } catch {
      toast.error('그룹 생성에 실패했습니다')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex flex-col h-full bg-background min-h-screen">
      <TopAppBar title="그룹 만들기" showBackButton onBack={onBack} />

      <Container className="flex-1 py-6 overflow-auto">
        <div className="space-y-6">
          <div className="flex justify-center">
            <button className="relative w-24 h-24 rounded-full bg-muted flex items-center justify-center overflow-hidden border-2 border-dashed border-muted-foreground/30 hover:border-primary transition-colors">
              {groupImagePreview ? (
                <img
                  src={groupImagePreview}
                  alt="그룹 이미지"
                  className="w-full h-full object-cover"
                />
              ) : (
                <Camera className="w-8 h-8 text-muted-foreground" />
              )}
              <input
                type="file"
                accept="image/jpeg,image/png,image/webp"
                onChange={handleImageChange}
                className="absolute inset-0 opacity-0 cursor-pointer"
              />
            </button>
          </div>

          <div className="space-y-2">
            <Label htmlFor="name">그룹 이름 *</Label>
            <Input
              id="name"
              placeholder="그룹 이름을 입력하세요"
              value={name}
              onChange={(e) => setName(e.target.value)}
              maxLength={30}
            />
            <p className="text-xs text-muted-foreground text-right">{name.length}/30</p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">그룹 소개</Label>
            <Textarea
              id="description"
              placeholder="그룹에 대해 소개해주세요"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={4}
              maxLength={200}
            />
            <p className="text-xs text-muted-foreground text-right">{description.length}/200</p>
          </div>

          <div className="space-y-2">
            <Label>관심 태그 (최대 5개)</Label>
            <div className="flex flex-wrap gap-2">
              {SUGGESTED_TAGS.map((tag) => (
                <Badge
                  key={tag}
                  variant={tags.includes(tag) ? 'default' : 'outline'}
                  className="cursor-pointer"
                  onClick={() => handleTagToggle(tag)}
                >
                  {tag}
                </Badge>
              ))}
            </div>
          </div>

          {tags.length > 0 && (
            <Card>
              <CardContent className="py-3">
                <p className="text-sm text-muted-foreground mb-2">선택한 태그</p>
                <div className="flex flex-wrap gap-2">
                  {tags.map((tag) => (
                    <Badge key={tag} variant="default">
                      {tag}
                      <button className="ml-1" onClick={() => handleTagToggle(tag)}>
                        <X className="w-3 h-3" />
                      </button>
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          <Button
            className="w-full"
            onClick={handleSubmit}
            disabled={!name.trim() || isLoading || isUploading}
          >
            <Plus className="w-4 h-4 mr-2" />
            {isUploading ? '이미지 업로드 중...' : isLoading ? '생성 중...' : '그룹 만들기'}
          </Button>
        </div>
      </Container>

      <UploadErrorModal
        open={uploadErrors.length > 0}
        onClose={clearErrors}
        errors={uploadErrors}
      />
    </div>
  )
}
