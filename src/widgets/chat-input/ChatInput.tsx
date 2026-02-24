import { useState, useRef, type KeyboardEvent, type ChangeEvent } from 'react'
import { Send, Plus, Image as ImageIcon, X } from 'lucide-react'
import { Button } from '@/shared/ui/button'
import { Textarea } from '@/shared/ui/textarea'
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/shared/ui/sheet'

type ChatInputProps = {
  onSendMessage: (text: string, attachments?: File[]) => void
  disabled?: boolean
  placeholder?: string
}

export function ChatInput({
  onSendMessage,
  disabled = false,
  placeholder = '메시지를 입력하세요',
}: ChatInputProps) {
  const [text, setText] = useState('')
  const [attachments, setAttachments] = useState<File[]>([])
  const [isSheetOpen, setIsSheetOpen] = useState(false)
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleSend = () => {
    if ((!text.trim() && attachments.length === 0) || disabled) return

    onSendMessage(text.trim(), attachments.length > 0 ? attachments : undefined)
    setText('')
    setAttachments([])
    textareaRef.current?.focus()
  }

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.nativeEvent.isComposing) return
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  const handleImageSelect = (e: ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    const selected = files[0]
    if (!selected) return
    setAttachments([selected])
    setIsSheetOpen(false)
    e.target.value = ''
  }

  const removeAttachment = (index: number) => {
    setAttachments((prev) => prev.filter((_, i) => i !== index))
  }

  const canSend = (text.trim() || attachments.length > 0) && !disabled

  return (
    <div className="border-t bg-background p-3 space-y-2">
      {attachments.length > 0 && (
        <div className="flex gap-2 overflow-x-auto pb-2">
          {attachments.map((file, index) => (
            <div key={index} className="relative flex-shrink-0">
              <div className="h-20 w-20 rounded-lg bg-muted flex items-center justify-center overflow-hidden">
                {file.type.startsWith('image/') ? (
                  <img
                    src={URL.createObjectURL(file)}
                    alt=""
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="text-xs text-muted-foreground p-2 text-center break-all">
                    {file.name}
                  </div>
                )}
              </div>
              <Button
                size="icon"
                variant="destructive"
                className="absolute -top-2 -right-2 h-6 w-6 rounded-full"
                onClick={() => removeAttachment(index)}
              >
                <X className="h-3 w-3" />
              </Button>
            </div>
          ))}
        </div>
      )}

      <div className="flex items-end gap-2">
        <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
          <SheetTrigger asChild>
            <Button size="icon" variant="ghost" className="flex-shrink-0" disabled={disabled}>
              <Plus className="h-5 w-5" />
            </Button>
          </SheetTrigger>
          <SheetContent side="bottom" className="h-auto">
            <SheetHeader>
              <SheetTitle>첨부하기</SheetTitle>
              <SheetDescription>파일을 선택하여 첨부할 수 있습니다</SheetDescription>
            </SheetHeader>
            <div className="grid gap-3 py-4">
              <Button
                variant="outline"
                className="justify-start h-auto py-4"
                onClick={() => fileInputRef.current?.click()}
              >
                <ImageIcon className="h-5 w-5 mr-3" />
                <div className="text-left">
                  <div className="font-medium">사진</div>
                  <div className="text-xs text-muted-foreground">이미지 파일 선택</div>
                </div>
              </Button>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleImageSelect}
              />
            </div>
          </SheetContent>
        </Sheet>

        <Textarea
          ref={textareaRef}
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          disabled={disabled}
          className="min-h-[40px] max-h-[120px] resize-none"
          rows={1}
        />

        <Button size="icon" className="flex-shrink-0" onClick={handleSend} disabled={!canSend}>
          <Send className="h-5 w-5" />
        </Button>
      </div>
    </div>
  )
}
