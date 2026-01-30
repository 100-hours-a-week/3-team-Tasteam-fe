import { User } from 'lucide-react'
import type { ImageResource } from '@/shared/types/common'
import { Avatar, AvatarFallback, AvatarImage } from './avatar'

type ProfileImageProps = {
  image?: ImageResource | null
  name: string
  size?: 'default' | 'sm' | 'lg'
  className?: string
}

export function ProfileImage({ image, name, size = 'default', className }: ProfileImageProps) {
  const imageUrl = image?.url

  return (
    <Avatar size={size} className={className}>
      {imageUrl ? (
        <AvatarImage src={imageUrl} alt={name} />
      ) : (
        <AvatarFallback className="flex items-center justify-center">
          <User className="w-1/2 h-1/2 text-muted-foreground" strokeWidth={1} />
        </AvatarFallback>
      )}
    </Avatar>
  )
}
