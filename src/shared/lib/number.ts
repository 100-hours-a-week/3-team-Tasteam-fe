export const parseNumberParam = (value: string | null | undefined): number | null => {
  if (!value) return null
  const parsed = Number(value)
  return Number.isFinite(parsed) ? parsed : null
}

export const isValidId = (value: number | null | undefined): value is number =>
  typeof value === 'number' && Number.isFinite(value) && value > 0
