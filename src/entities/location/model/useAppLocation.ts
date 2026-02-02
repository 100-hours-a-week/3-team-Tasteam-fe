import { useContext } from 'react'
import { LocationContext } from './locationContext'

export function useAppLocation() {
  const ctx = useContext(LocationContext)
  if (!ctx) throw new Error('useAppLocation must be used within LocationProvider')
  return ctx
}
