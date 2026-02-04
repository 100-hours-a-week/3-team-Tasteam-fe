# shared 폴더 안내 (2026-02-04 기준)

프로젝트 전역에서 재사용되는 리소스를 모은 레이어입니다. 기능/도메인에 묶이지 않는 것만 배치합니다.

## 하위 폴더와 대표 파일

- `api/` – 공통 HTTP 레이어
  - `http.ts`: axios 인스턴스, Authorization 주입·401 재시도 인터셉터
  - `request.ts`: `http.request` 래퍼(`response.data`만 반환)
  - `query.ts`, `health.ts` 추가 헬퍼

- `assets/` – 정적 자산
  - `fonts/pretendard/`, `fonts/icon-font/` (현재 비어 있음)
  - 예: 폰트, 아이콘 스프라이트, 공용 이미지/일러스트

- `config/` – 전역 설정
  - `env.ts` 환경 변수 접근, `routes.ts` 라우트 상수, `featureFlags.ts`, `theme.ts`
  - 예: 런타임 설정, 라우트/토글/테마 토큰

- `constants/` – 전역 상수
  - `date.ts` 날짜 포맷·상수
  - 예: 전역 공용 상수(날짜, 정규식, 형식 문자열)

- `lib/` – 범용 유틸리티
  - 인증: `authToken.ts`(인메모리 accessToken + pub-sub)
  - 포맷/도구: `formatDisplayNumber.ts`, `time.ts`, `utils.ts`, `logger.ts`
  - 플랫폼: `use-mobile.ts`, `geolocation.ts`
  - 예: 순수 함수, 훅, 로거, 포맷터 등 범용 도구

- `styles/` – 전역 스타일
  - `global.css`, `globals.css`
  - 예: 리셋, 전역 토큰, 폰트 선언

- `types/` – 공통 타입
  - `api.ts`, `common.ts`, `pagination.ts`
  - 예: 전역 공용 타입/유틸 타입

- `ui/` – 재사용 UI 컴포넌트 세트(Shadcn 기반)
  - 입력/폼: `button.tsx`, `input.tsx`, `textarea.tsx`, `select.tsx`, `checkbox.tsx`, `radio-group.tsx`, `switch.tsx`, `form.tsx`
  - 레이아웃/네비: `dialog.tsx`, `sheet.tsx`, `drawer.tsx`, `navigation-menu.tsx`, `sidebar.tsx`, `tabs.tsx`, `accordion.tsx`, `breadcrumb.tsx`, `menubar.tsx`, `command.tsx`, `popover.tsx`, `hover-card.tsx`, `dropdown-menu.tsx`, `context-menu.tsx`, `collapsible.tsx`
  - 데이터 표시: `table.tsx`, `pagination.tsx`, `chart.tsx`, `skeleton.tsx`, `progress.tsx`, `badge.tsx`, `card.tsx`, `alert.tsx`, `alert-dialog.tsx`, `sonner.tsx`, `tooltip.tsx`
  - 미디어/기타: `image-with-fallback.tsx`, `profile-image.tsx`, `group-image.tsx`, `carousel.tsx`, `category-chip.tsx`, `input-otp.tsx`
  - 스타일 토큰: `button-variants.ts`, `toggle-variants.ts`
  - 예: 범용 프레젠테이션 컴포넌트, 토큰/variant 정의

## 사용 규칙(요약)

- 기능/도메인에 종속된 코드는 `features/`나 `entities/`에 둡니다.
- 재사용성이 넓은 유틸·스타일·UI만 `shared/`에 추가합니다.
