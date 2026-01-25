type ChatDateDividerProps = {
  date: Date
}

function isToday(date: Date): boolean {
  const today = new Date()
  return (
    date.getDate() === today.getDate() &&
    date.getMonth() === today.getMonth() &&
    date.getFullYear() === today.getFullYear()
  )
}

function isYesterday(date: Date): boolean {
  const yesterday = new Date()
  yesterday.setDate(yesterday.getDate() - 1)
  return (
    date.getDate() === yesterday.getDate() &&
    date.getMonth() === yesterday.getMonth() &&
    date.getFullYear() === yesterday.getFullYear()
  )
}

function isThisYear(date: Date): boolean {
  return date.getFullYear() === new Date().getFullYear()
}

const WEEKDAYS = ['일', '월', '화', '수', '목', '금', '토']

function getDateLabel(date: Date): string {
  if (isToday(date)) {
    return '오늘'
  }
  if (isYesterday(date)) {
    return '어제'
  }
  const month = date.getMonth() + 1
  const day = date.getDate()
  const weekday = WEEKDAYS[date.getDay()]
  if (isThisYear(date)) {
    return `${month}월 ${day}일 (${weekday})`
  }
  return `${date.getFullYear()}년 ${month}월 ${day}일 (${weekday})`
}

export function ChatDateDivider({ date }: ChatDateDividerProps) {
  return (
    <div className="flex items-center gap-3 px-4 py-4">
      <div className="flex-1 h-px bg-border" />
      <span className="text-xs text-muted-foreground whitespace-nowrap">{getDateLabel(date)}</span>
      <div className="flex-1 h-px bg-border" />
    </div>
  )
}
