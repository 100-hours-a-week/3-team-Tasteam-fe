import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

/**
 * Tailwind CSS 클래스를 병합하는 유틸리티 함수입니다.
 * @param inputs - 병합할 클래스 이름들
 * @returns 병합된 클래스 문자열
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
