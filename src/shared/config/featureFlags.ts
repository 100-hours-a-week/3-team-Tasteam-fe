/**
 * Feature Flags 설정 파일입니다.
 */
export const FEATURE_FLAGS = {
  enablePwa: true,
  enableDebugTools: false,
  /**
   * 알림(알림 탭/알림 설정) 관련 UI 노출 여부
   * - 비활성화 시: 라우트/코드는 유지하되 UI에서 숨깁니다.
   */
  enableNotifications: false,
  /**
   * 설정 화면에서 "실제로 동작하지 않는" 항목들의 상호작용 가능 여부
   * - 비활성화 시: 화면은 유지하되 회색 처리 + 클릭/토글 불가
   */
  enableSettingsInteractions: false,
} as const
