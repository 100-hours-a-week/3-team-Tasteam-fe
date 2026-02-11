import { useState, useEffect } from 'react'
import { toast } from 'sonner'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetFooter,
} from '@/shared/ui/sheet'
import { Button } from '@/shared/ui/button'
import { FavoriteTargetItem } from './components/FavoriteTargetItem'
import {
  getRestaurantFavoriteTargets,
  addMyFavoriteRestaurant,
  deleteMyFavoriteRestaurant,
  addSubgroupFavoriteRestaurant,
  deleteSubgroupFavoriteRestaurant,
} from '@/entities/favorite'
import type { FavoriteTarget } from '@/entities/favorite'

type FavoriteSelectionSheetProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  restaurantId: number
  onComplete?: (selectedTargets: string[]) => void
}

export function FavoriteSelectionSheet({
  open,
  onOpenChange,
  restaurantId,
  onComplete,
}: FavoriteSelectionSheetProps) {
  const [targets, setTargets] = useState<FavoriteTarget[]>([])
  const [selectedTargets, setSelectedTargets] = useState<Set<string>>(new Set())
  const [initialSelectedTargets, setInitialSelectedTargets] = useState<Set<string>>(new Set())
  const [isLoading, setIsLoading] = useState(false)
  const [isSaving, setIsSaving] = useState(false)

  // 시트가 열릴 때 찜 타겟 목록 조회
  useEffect(() => {
    if (!open || !restaurantId) return

    const loadTargets = async () => {
      setIsLoading(true)
      try {
        const response = await getRestaurantFavoriteTargets(restaurantId)
        const data = response.data

        // 타겟 목록 구성 (백엔드는 targets 배열로 반환)
        const targetList: FavoriteTarget[] = data.targets.map((target) => {
          if (target.targetType === 'ME') {
            return {
              id: 'my',
              type: 'personal',
              name: target.name,
              isFavorited: target.favoriteState === 'FAVORITED',
            }
          } else {
            return {
              id: `subgroup-${target.targetId}`,
              type: 'group',
              name: target.name,
              subgroupId: target.targetId || undefined,
              isFavorited: target.favoriteState === 'FAVORITED',
            }
          }
        })

        setTargets(targetList)

        // 현재 찜 상태를 기반으로 초기 선택 설정
        const initialSelected = new Set<string>()
        targetList.forEach((target) => {
          if (target.isFavorited) {
            initialSelected.add(target.id)
          }
        })
        setSelectedTargets(initialSelected)
        setInitialSelectedTargets(new Set(initialSelected))
      } catch (error) {
        console.error('찜 타겟 목록 조회 실패:', error)
        toast.error('찜 목록을 불러오는데 실패했습니다')
      } finally {
        setIsLoading(false)
      }
    }

    loadTargets()
  }, [open, restaurantId])

  // 타겟 토글 핸들러 (선택 상태만 변경, API 호출은 완료 버튼에서)
  const handleToggle = (targetId: string) => {
    setSelectedTargets((prev) => {
      const next = new Set(prev)
      if (next.has(targetId)) {
        next.delete(targetId)
      } else {
        next.add(targetId)
      }
      return next
    })
  }

  // 완료 버튼 핸들러 - 변경사항만 API 호출
  const handleComplete = async () => {
    if (isSaving) return

    // 초기 상태와 현재 상태 비교하여 변경사항만 처리
    const toAdd = new Set<string>()
    const toRemove = new Set<string>()

    // 추가할 항목: 현재 선택되었지만 초기에는 선택되지 않았던 것
    selectedTargets.forEach((id) => {
      if (!initialSelectedTargets.has(id)) {
        toAdd.add(id)
      }
    })

    // 삭제할 항목: 초기에는 선택되었지만 현재는 선택되지 않은 것
    initialSelectedTargets.forEach((id) => {
      if (!selectedTargets.has(id)) {
        toRemove.add(id)
      }
    })

    // 변경사항이 없으면 그냥 닫기
    if (toAdd.size === 0 && toRemove.size === 0) {
      onComplete?.(Array.from(selectedTargets))
      onOpenChange(false)
      return
    }

    setIsSaving(true)

    try {
      // 삭제 작업 먼저 수행
      for (const targetId of toRemove) {
        const target = targets.find((t) => t.id === targetId)
        if (!target) continue

        if (target.type === 'personal') {
          await deleteMyFavoriteRestaurant(restaurantId)
        } else if (target.subgroupId) {
          await deleteSubgroupFavoriteRestaurant(target.subgroupId, restaurantId)
        }
      }

      // 추가 작업 수행
      for (const targetId of toAdd) {
        const target = targets.find((t) => t.id === targetId)
        if (!target) continue

        if (target.type === 'personal') {
          await addMyFavoriteRestaurant({ restaurantId })
        } else if (target.subgroupId) {
          await addSubgroupFavoriteRestaurant(target.subgroupId, { restaurantId })
        }
      }

      onComplete?.(Array.from(selectedTargets))
      onOpenChange(false)
    } catch (error) {
      console.error('찜 목록 업데이트 실패:', error)
      toast.error('찜 목록 업데이트에 실패했습니다')
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="bottom" className="max-h-[80vh]">
        <SheetHeader>
          <SheetTitle>찜 목록</SheetTitle>
          <SheetDescription>음식점을 찜할 대상을 선택하세요</SheetDescription>
        </SheetHeader>

        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <p className="text-sm text-muted-foreground">로딩 중...</p>
          </div>
        ) : (
          <div className="max-h-[60vh] overflow-auto p-4 space-y-2">
            {targets.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <p className="text-sm text-muted-foreground">찜할 수 있는 목록이 없습니다</p>
              </div>
            ) : (
              targets.map((target) => (
                <FavoriteTargetItem
                  key={target.id}
                  target={target}
                  isSelected={selectedTargets.has(target.id)}
                  onToggle={() => handleToggle(target.id)}
                />
              ))
            )}
          </div>
        )}

        <SheetFooter>
          <Button
            onClick={handleComplete}
            className="w-full"
            size="lg"
            disabled={isLoading || isSaving}
          >
            {isSaving ? '저장 중...' : '완료'}
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  )
}
