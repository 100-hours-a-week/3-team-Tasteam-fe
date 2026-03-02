export type EvidenceCommentItem = {
  id: number
  content: string
  author?: string
}

type EvidenceCommentsProps = {
  comments: EvidenceCommentItem[]
}

export function EvidenceComments({ comments }: EvidenceCommentsProps) {
  if (comments.length === 0) return null

  return (
    <div className="mt-2 space-y-1.5">
      {comments.map((comment, index) => (
        <div key={comment.id} className="flex gap-1.5 p-2 bg-accent/30 rounded-md text-[10px]">
          <div className="flex-shrink-0 w-4 h-4 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-medium text-[9px] leading-none">
            {index + 1}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-muted-foreground line-clamp-2 leading-snug text-[10px]">
              {comment.content}
            </p>
            {comment.author != null && comment.author !== '' && (
              <p className="text-muted-foreground/60 mt-0.5 text-[9px]">- {comment.author}</p>
            )}
          </div>
        </div>
      ))}
    </div>
  )
}
