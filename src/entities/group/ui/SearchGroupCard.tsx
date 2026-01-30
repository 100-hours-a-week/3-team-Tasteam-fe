import { GroupImage } from '@/shared/ui/group-image'
import type { ImageResource } from '@/shared/types/common'

type SearchGroupCardProps = {
  groupId: number
  name: string
  logoImage: ImageResource | null
  onClick?: () => void
}

export function SearchGroupCard({ name, logoImage, onClick }: SearchGroupCardProps) {
  return (
    <button type="button" className="flex flex-col items-center gap-1.5 w-full" onClick={onClick}>
      <div className="w-full aspect-square rounded-lg bg-gray-100 overflow-hidden flex items-center justify-center">
        <GroupImage image={logoImage} name={name} className="object-cover w-full h-full" />
      </div>
      <span className="text-xs text-center line-clamp-2 w-full leading-tight">{name}</span>
    </button>
  )
}
