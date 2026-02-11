import { Users, Check } from 'lucide-react'
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from '@/shared/ui/sheet'
import { cn } from '@/shared/lib/utils'
import type { FavoriteTarget } from '@/entities/favorite'

type SubgroupSelectorSheetProps = {
  open: boolean
  onClose: () => void
  subgroups: FavoriteTarget[] // type === 'group'인 것만
  selectedSubgroupId: number | null
  onSelect: (subgroupId: number) => void
}

export function SubgroupSelectorSheet({
  open,
  onClose,
  subgroups,
  selectedSubgroupId,
  onSelect,
}: SubgroupSelectorSheetProps) {
  const handleSelect = (subgroupId: number) => {
    onSelect(subgroupId)
    onClose()
  }

  return (
    <Sheet open={open} onOpenChange={onClose}>
      <SheetContent side="bottom" className="max-h-[80vh]">
        <SheetHeader>
          <SheetTitle>그룹 선택</SheetTitle>
          <SheetDescription>찜 목록을 볼 그룹을 선택하세요</SheetDescription>
        </SheetHeader>

        <div className="max-h-[60vh] overflow-auto p-4 space-y-2">
          {subgroups.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <p className="text-sm text-muted-foreground">가입한 하위그룹이 없습니다</p>
            </div>
          ) : (
            subgroups.map((subgroup) => {
              const isSelected = selectedSubgroupId === subgroup.subgroupId
              return (
                <button
                  key={subgroup.id}
                  onClick={() => subgroup.subgroupId && handleSelect(subgroup.subgroupId)}
                  className={cn(
                    'w-full flex items-center justify-between p-4 rounded-lg border transition-all',
                    isSelected ? 'border-primary bg-primary/5' : 'border-border hover:bg-accent',
                  )}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={cn(
                        'flex items-center justify-center w-10 h-10 rounded-full',
                        isSelected ? 'bg-primary/10' : 'bg-muted',
                      )}
                    >
                      <Users
                        className={cn(
                          'w-5 h-5',
                          isSelected ? 'text-primary' : 'text-muted-foreground',
                        )}
                      />
                    </div>
                    <div className="text-left">
                      <p className="font-semibold text-sm">{subgroup.name}</p>
                      <p className="caption text-muted-foreground">
                        찜한 맛집 {subgroup.favoriteCount || 0}개
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {isSelected && (
                      <div className="flex items-center justify-center w-6 h-6 rounded-full bg-primary">
                        <Check className="w-4 h-4 text-white" />
                      </div>
                    )}
                  </div>
                </button>
              )
            })
          )}
        </div>
      </SheetContent>
    </Sheet>
  )
}
