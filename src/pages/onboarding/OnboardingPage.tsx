import { useState } from 'react'
import { MapPin, Bell, Users, ArrowRight } from 'lucide-react'
import { Container } from '@/widgets/container'
import { Button } from '@/shared/ui/button'
import { Card } from '@/shared/ui/card'
import { Badge } from '@/shared/ui/badge'
import { cn } from '@/shared/lib/utils'
import { FEATURE_FLAGS } from '@/shared/config/featureFlags'
import { requestLocationPermission } from '@/shared/lib/geolocation'
import { useAppLocation } from '@/entities/location'

type OnboardingPageProps = {
  onComplete?: () => void
}

export function OnboardingPage({ onComplete }: OnboardingPageProps) {
  const [currentStep, setCurrentStep] = useState(0)
  const [selectedPreferences, setSelectedPreferences] = useState<string[]>([])
  const { requestCurrentLocation } = useAppLocation()

  const steps = [
    {
      title: '위치 서비스 권한',
      description: '주변 맛집을 추천받으세요',
      icon: MapPin,
      action: '위치 권한 허용',
    },
    ...(FEATURE_FLAGS.enableNotifications
      ? [
          {
            title: '알림 권한',
            description: '그룹 활동과 새로운 추천을 놓치지 마세요',
            icon: Bell,
            action: '알림 권한 허용',
          },
        ]
      : []),
    {
      title: '관심사 설정',
      description: '선호하는 음식 종류를 선택해주세요',
      icon: Users,
      action: '완료',
    },
  ]

  const preferences = [
    '한식',
    '중식',
    '일식',
    '양식',
    '이탈리안',
    '프렌치',
    '멕시칸',
    '태국',
    '베트남',
    '인도',
    '카페',
    '디저트',
    '바/술집',
    '패스트푸드',
    '비건',
    '퓨전',
  ]

  const handlePreferenceToggle = (preference: string) => {
    setSelectedPreferences((prev) =>
      prev.includes(preference) ? prev.filter((p) => p !== preference) : [...prev, preference],
    )
  }

  const handleNext = async () => {
    if (currentStepData.icon === MapPin) {
      const granted = await requestLocationPermission()
      if (granted) {
        await requestCurrentLocation()
      }
    }

    if (currentStep < steps.length - 1) {
      setCurrentStep((prev) => prev + 1)
    } else {
      onComplete?.()
    }
  }

  const handleSkip = () => {
    onComplete?.()
  }

  const currentStepData = steps[currentStep]
  const Icon = currentStepData.icon

  return (
    <div className="min-h-screen flex flex-col">
      <div className="w-full h-1 bg-secondary">
        <div
          className="h-full bg-primary transition-all duration-300"
          style={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
        />
      </div>

      <Container className="flex-1 flex flex-col justify-between py-12">
        <div className="flex-1 flex flex-col justify-center">
          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-primary/10 mb-6">
              <Icon className="h-10 w-10 text-primary" />
            </div>
            <h1 className="mb-3 text-2xl font-bold">{currentStepData.title}</h1>
            <p className="text-muted-foreground text-lg">{currentStepData.description}</p>
          </div>

          {currentStep === steps.length - 1 && (
            <div className="mb-8">
              <Card className="p-6">
                <div className="flex flex-wrap gap-2">
                  {preferences.map((preference) => (
                    <Badge
                      key={preference}
                      variant={selectedPreferences.includes(preference) ? 'default' : 'outline'}
                      className={cn(
                        'cursor-pointer px-4 py-2 text-sm transition-all',
                        selectedPreferences.includes(preference)
                          ? 'bg-primary text-primary-foreground hover:bg-primary/90'
                          : 'hover:bg-accent',
                      )}
                      onClick={() => handlePreferenceToggle(preference)}
                    >
                      {preference}
                    </Badge>
                  ))}
                </div>
              </Card>
              <p className="text-sm text-muted-foreground text-center mt-4">
                {selectedPreferences.length}개 선택됨 (나중에 변경 가능)
              </p>
            </div>
          )}
        </div>

        <div className="space-y-3">
          <Button onClick={handleNext} className="w-full" size="lg">
            {currentStepData.action}
            {currentStep < steps.length - 1 && <ArrowRight className="ml-2 h-5 w-5" />}
          </Button>
          <Button onClick={handleSkip} variant="ghost" className="w-full">
            건너뛰기
          </Button>

          <div className="flex items-center justify-center gap-2 pt-4">
            {steps.map((_, idx) => (
              <div
                key={idx}
                className={cn(
                  'h-2 rounded-full transition-all',
                  idx === currentStep
                    ? 'w-8 bg-primary'
                    : idx < currentStep
                      ? 'w-2 bg-primary/50'
                      : 'w-2 bg-muted',
                )}
              />
            ))}
          </div>
        </div>
      </Container>
    </div>
  )
}
