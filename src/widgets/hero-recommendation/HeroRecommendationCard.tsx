import { ArrowRight } from 'lucide-react'
import { Card } from '@/shared/ui/card'
import { Button } from '@/shared/ui/button'
import { ImageWithFallback } from '@/shared/ui/image-with-fallback'
import { cn } from '@/shared/lib/utils'

type HeroRecommendationCardProps = {
  title: string
  description: string
  image: string
  ctaText?: string
  onCTAClick?: () => void
  className?: string
}

export function HeroRecommendationCard({
  title,
  description,
  image,
  ctaText = '바로 보기',
  onCTAClick,
  className,
}: HeroRecommendationCardProps) {
  return (
    <Card
      className={cn(
        'overflow-hidden bg-gradient-to-br from-primary/10 to-primary/5 p-0',
        className,
      )}
    >
      <div className="flex flex-row min-h-[160px]">
        <div className="flex-1 p-5 flex flex-col justify-center gap-3">
          <div>
            <h2 className="text-xl font-bold leading-tight">{title}</h2>
            <p className="text-sm text-muted-foreground mt-1.5 leading-relaxed">{description}</p>
          </div>
          <Button onClick={onCTAClick} size="sm" className="w-fit mt-1">
            {ctaText}
            <ArrowRight className="ml-1.5 h-4 w-4" />
          </Button>
        </div>
        <div className="w-36 relative overflow-hidden shrink-0">
          <ImageWithFallback
            src={image}
            alt={title}
            className="object-cover w-full h-full"
            loading="eager"
            fetchPriority="high"
            decoding="async"
          />
        </div>
      </div>
    </Card>
  )
}
