# widgets (페이지 블록 스냅샷, 2026-02-04)

페이지를 구성하는 중·대형 UI 블록 모음입니다. 여러 features/entities/shared 컴포넌트를 조합해 화면의 주요 섹션을 만듭니다.

## 하위 폴더 역할 가이드

- 각 폴더 = 하나의 위젯(대개 UI + 약간의 glue 로직)
- `index.ts`가 있으면 주요 컴포넌트를 re-export

## 위젯별 구성

- **app-shell**
  1. `AppShell.tsx` : 상단/하단 공통 레이아웃, outlet 감싸는 셸
  2. `index.ts` : export

- **auth**
  1. `LoginRequiredModal.tsx` : 세션 만료 시 로그인 요구 모달

- **auth-status**
  1. `AuthStatusIndicator.tsx` : 현재 인증 상태 뱃지 표시
  2. `AuthStatusIndicator.module.css` : 스타일

- **bottom-tab-bar**
  1. `BottomTabBar.tsx` : 모바일 하단 탭 내비게이션
  2. `index.ts` : export

- **chat-input**
  1. `ChatInput.tsx` : 채팅 입력창(텍스트 입력, 전송 버튼)
  2. `index.ts` : export

- 공통 페이지 폭 레이아웃 `Container`는 `src/shared/ui/container.tsx`로 이동

- **debug**
  1. `DebugIndicators.tsx` : 개발/디버그용 상태 표시

- **empty-state**
  1. `EmptyState.tsx` : 리스트 비어있을 때 메시지/CTA 표시
  2. `index.ts` : export

- **floating-chat-button**
  1. `FloatingChatButton.tsx` : 플로팅 채팅 진입 버튼
  2. `index.ts` : export

- **health-status**
  1. `HealthStatusIndicator.tsx` : 헬스체크 상태 표시 아이콘/텍스트
  2. `HealthStatusIndicator.module.css` : 스타일

- **hero-recommendation**
  1. `HeroRecommendationCard.tsx` : 메인 히어로 영역 추천 카드
  2. `index.ts` : export

- **list-state**
  1. `ListState.tsx` : 로딩/빈 상태/에러/컨텐츠 전환 핸들러
  2. `index.ts` : export

- **location**
  1. `LocationPermissionModal.tsx` : 위치 권한 요청 모달

- **location-header**
  1. `LocationHeader.tsx` : 현재 위치/변경 액션을 담은 헤더
  2. `index.ts` : export

- **pull-to-refresh**
  1. `PullToRefreshWrapper.tsx` : 모바일 풀투리프레시 래퍼
  2. `index.ts` : export

- **quick-action**
  1. `QuickActionButton.tsx` : 퀵 액션 단추
  2. `index.ts` : export

- **restaurant-card**
  1. `HorizontalRestaurantCard.tsx` : 가로형 레스토랑 카드
  2. `VerticalRestaurantCard.tsx` : 세로형 레스토랑 카드
  3. `index.ts` : export

- **top-app-bar**
  1. `TopAppBar.tsx` : 상단 앱 바
  2. `index.ts` : export
