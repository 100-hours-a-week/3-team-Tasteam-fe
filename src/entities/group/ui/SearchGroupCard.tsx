import { ImageWithFallback } from '@/shared/ui/image-with-fallback'

type SearchGroupCardProps = {
  groupId: number
  name: string
  logoImageUrl: string | null
  onClick?: () => void
}

const PLACEHOLDER_SRC =
  'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iODgiIGhlaWdodD0iODgiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgc3Ryb2tlPSIjMDAwIiBzdHJva2UtbGluZWpvaW49InJvdW5kIiBvcGFjaXR5PSIuMyIgZmlsbD0ibm9uZSIgc3Ryb2tlLXdpZHRoPSIzLjciPjxyZWN0IHg9IjE2IiB5PSIxNiIgd2lkdGg9IjU2IiBoZWlnaHQ9IjU2IiByeD0iNiIvPjxwYXRoIGQ9Im0xNiA1OCAxNi0xOCAzMiAzMiIvPjxjaXJjbGUgY3g9IjUzIiBjeT0iMzUiIHI9IjciLz48L3N2Zz4KCg=='

export function SearchGroupCard({ name, logoImageUrl, onClick }: SearchGroupCardProps) {
  return (
    <button type="button" className="flex flex-col items-center gap-1.5 w-full" onClick={onClick}>
      <div className="w-full aspect-square rounded-lg bg-gray-100 overflow-hidden flex items-center justify-center">
        <ImageWithFallback
          src={logoImageUrl || PLACEHOLDER_SRC}
          alt={name}
          className="object-cover w-full h-full"
        />
      </div>
      <span className="text-xs text-center line-clamp-2 w-full leading-tight">{name}</span>
    </button>
  )
}
