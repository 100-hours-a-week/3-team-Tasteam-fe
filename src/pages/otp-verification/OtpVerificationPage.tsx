import { useState, useEffect } from 'react'
import { AlertCircle } from 'lucide-react'
import { Container } from '@/shared/ui/container'
import { Button } from '@/shared/ui/button'
import { Alert, AlertDescription } from '@/shared/ui/alert'
import { InputOTP, InputOTPGroup, InputOTPSlot } from '@/shared/ui/input-otp'

type OtpVerificationPageProps = {
  onVerify: () => void
  onBack?: () => void
}

export function OtpVerificationPage({ onVerify, onBack }: OtpVerificationPageProps) {
  const [otp, setOtp] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [timeLeft, setTimeLeft] = useState(180)

  useEffect(() => {
    if (timeLeft <= 0) return

    const timer = setInterval(() => {
      setTimeLeft((prev) => prev - 1)
    }, 1000)

    return () => clearInterval(timer)
  }, [timeLeft])

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  const handleResend = () => {
    setTimeLeft(180)
    setError('')
    setOtp('')
  }

  const handleVerify = async () => {
    if (otp.length !== 6) {
      setError('6자리 인증번호를 입력해주세요')
      return
    }

    setIsLoading(true)
    setError('')

    setTimeout(() => {
      setIsLoading(false)
      if (otp === '123456') {
        onVerify()
      } else {
        setError('인증번호가 일치하지 않습니다')
      }
    }, 1000)
  }

  return (
    <div className="flex flex-col h-full bg-background min-h-screen">
      <Container className="flex-1 flex flex-col py-8">
        <div className="flex-1 flex flex-col">
          <div className="mb-8">
            <h1 className="mb-2 text-2xl font-bold">인증번호 입력</h1>
            <p className="text-muted-foreground">
              입력하신 휴대폰 번호로 전송된
              <br />
              6자리 인증번호를 입력해주세요
            </p>
          </div>

          <div className="space-y-6">
            <div className="flex flex-col items-center gap-4">
              <InputOTP
                maxLength={6}
                value={otp}
                onChange={(value) => {
                  setOtp(value)
                  setError('')
                }}
              >
                <InputOTPGroup>
                  <InputOTPSlot index={0} />
                  <InputOTPSlot index={1} />
                  <InputOTPSlot index={2} />
                  <InputOTPSlot index={3} />
                  <InputOTPSlot index={4} />
                  <InputOTPSlot index={5} />
                </InputOTPGroup>
              </InputOTP>

              {timeLeft > 0 ? (
                <p className="text-sm text-muted-foreground">남은 시간: {formatTime(timeLeft)}</p>
              ) : (
                <p className="text-sm text-destructive">인증번호가 만료되었습니다</p>
              )}
            </div>

            {error && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <div className="flex flex-col gap-3">
              <Button
                className="w-full"
                onClick={handleVerify}
                disabled={otp.length !== 6 || isLoading || timeLeft <= 0}
              >
                {isLoading ? '확인 중...' : '인증하기'}
              </Button>

              <Button
                variant="ghost"
                className="w-full"
                onClick={handleResend}
                disabled={timeLeft > 0}
              >
                인증번호 재전송
              </Button>
            </div>
          </div>
        </div>

        {onBack && (
          <Button variant="ghost" className="mt-4" onClick={onBack}>
            이전으로
          </Button>
        )}
      </Container>
    </div>
  )
}
