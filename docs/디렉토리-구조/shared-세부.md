# `src/shared` 세부 문서 (2026-02-04 기준)

공통 레이어의 실제 구성과 대표 파일을 한눈에 볼 수 있도록 정리했습니다. `shared/README.md`의 개요를 보완하는 디렉토리 스냅샷입니다.

## 폴더별 역할과 핵심 파일

- `api/` – 공통 HTTP 레이어
  - `http.ts`: axios 인스턴스 + 요청/응답 인터셉터(Authorization 주입, 401 → refresh 재시도)
  - `request.ts`: `http.request` 래퍼, `response.data`만 반환
  - `query.ts`, `health.ts`: 공용 API 헬퍼
  - 참고: 토큰 흐름은 `shared/lib/authToken.ts`, `entities/auth/api/authApi.ts`, `features/auth/require-auth/RequireAuth.tsx`

- `lib/` – 범용 유틸리티
  - 인증: `authToken.ts`(인메모리 accessToken + pub-sub, 만료 파싱)
  - UI/플랫폼: `use-mobile.ts`(모바일 감지), `geolocation.ts`
  - 데이터 처리: `formatDisplayNumber.ts`, `time.ts`, `utils.ts`, `logger.ts`

- `config/` – 전역 설정
  - `env.ts`: 환경 변수 접근 래퍼
  - `routes.ts`: 라우트 상수
  - `featureFlags.ts`, `theme.ts`

- `constants/` – 전역 상수
  - `date.ts`: 날짜 포맷/상수

- `types/` – 공통 타입
  - `api.ts`, `common.ts`, `pagination.ts`

- `styles/` – 전역 스타일
  - `global.css`, `globals.css`

- `ui/` – 재사용 UI 컴포넌트 세트 (Shadcn 기반)
  - 폼/입력: `button.tsx`, `input.tsx`, `textarea.tsx`, `select.tsx`, `radio-group.tsx`, `checkbox.tsx`, `switch.tsx`, `form.tsx`
  - 레이아웃/네비: `dialog.tsx`, `sheet.tsx`, `drawer.tsx`, `navigation-menu.tsx`, `sidebar.tsx`, `tabs.tsx`, `accordion.tsx`, `breadcrumb.tsx`, `menubar.tsx`, `command.tsx`, `popover.tsx`, `hover-card.tsx`, `dropdown-menu.tsx`, `context-menu.tsx`, `collapsible.tsx`
  - 데이터 표시: `table.tsx`, `pagination.tsx`, `chart.tsx`, `skeleton.tsx`, `progress.tsx`, `badge.tsx`, `card.tsx`, `alert.tsx`, `alert-dialog.tsx`, `sonner.tsx`, `tooltip.tsx`
  - 미디어: `image-with-fallback.tsx`, `profile-image.tsx`, `group-image.tsx`, `carousel.tsx`, `category-chip.tsx`, `input-otp.tsx`
  - 스타일 토큰: `button-variants.ts`, `toggle-variants.ts`, `select`/`toggle-group` 등
  - README 있음.

- `assets/` – 정적 자산
  - `fonts/pretendard/`, `fonts/icon-font/` 디렉터리만 존재(현재 비어 있음). 추가 자산은 이 위치에 정리.

## 사용 원칙 (요약)

- 도메인/기능에 종속된 로직은 `features`/`entities`로 두고, 범용성 있는 것만 `shared`에 둡니다.
- 새 공통 유틸을 추가할 때는 해당 카테고리에 맞는 폴더를 선택하고, README나 주석으로 사용법을 짧게 남깁니다.
- UI 컴포넌트는 가능한 `shared/ui`의 기성 컴포넌트를 재사용하고, 변형이 필요하면 variants 파일(`*-variants.ts`)을 확장합니다.
