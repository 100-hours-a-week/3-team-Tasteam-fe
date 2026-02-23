import { Card } from '@/shared/ui/card'
import { AppVersionText } from '@/shared/ui/app-version'

type PolicyDocumentHeaderCardProps = {
  eyebrow: string
  title: string
  description: string
  effectiveDate: string
  updatedDate: string
}

export function PolicyDocumentHeaderCard({
  eyebrow,
  title,
  description,
  effectiveDate,
  updatedDate,
}: PolicyDocumentHeaderCardProps) {
  return (
    <Card className="p-5">
      <div className="flex flex-col gap-4">
        <div className="space-y-1">
          <p className="text-xs font-medium tracking-wide text-primary uppercase">{eyebrow}</p>
          <h1 className="text-xl font-semibold">{title}</h1>
          <p className="text-sm leading-6 text-muted-foreground">{description}</p>
        </div>

        <div className="grid grid-cols-3 gap-1 rounded-lg border bg-muted/30 p-2">
          <div>
            <p className="text-xs text-muted-foreground">시행일</p>
            <p className="text-xs font-medium">{effectiveDate}</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">최종 개정일</p>
            <p className="text-xs font-medium">{updatedDate}</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">버전</p>
            <AppVersionText className="block text-xs font-medium" />
          </div>
        </div>
      </div>
    </Card>
  )
}
