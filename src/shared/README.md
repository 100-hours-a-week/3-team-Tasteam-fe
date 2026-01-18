# shared 폴더 안내

이 폴더는 **프로젝트 전역에서 재사용되는 리소스**를 모아둡니다.
각 하위 폴더의 역할은 아래와 같습니다.

## 폴더 역할 (예시 포함)

- `api/`: 공통 API 클라이언트, 요청 헬퍼  
  예: `api/http.ts`, `api/request.ts`
- `assets/`: 이미지/폰트 등 정적 자산  
  예: `assets/logo.svg`, `assets/fonts/Pretendard.woff2`
- `config/`: 전역 설정(환경 변수, 라우트, 기능 플래그 등)  
  예: `config/env.ts`, `config/routes.ts`, `config/featureFlags.ts`
- `constants/`: 전역 상수 모음(날짜 포맷, regex 등)  
  예: `constants/date.ts`, `constants/regex.ts`
- `lib/`: 유틸/헬퍼/공통 함수  
  예: `lib/formatCurrency.ts`, `lib/time.ts`
- `styles/`: 전역 스타일, 테마, CSS 토큰  
  예: `styles/global.css`, `styles/theme.ts`
- `types/`: 공통 타입 정의  
  예: `types/common.ts`, `types/api.ts`
- `ui/`: 재사용 UI 컴포넌트  
  예: `ui/Button.tsx`, `ui/Input.tsx`

## 사용 규칙(요약)

- 기능/도메인에 종속된 코드는 `features/`나 `entities/`로 분리합니다.
- `shared/`에는 범용적으로 재사용 가능한 것만 둡니다.
