# Quick Start (Frontend)

이 문서는 Tasteam 프론트엔드에 새로 들어온 사람이 "지금 무슨 문서를 봐야 할지" 빠르게 확인할 수 있도록 하는 네비게이션 가이드입니다. 각 항목을 차례대로 따라가면 전체 구조와 정책을 파악할 수 있습니다.

## 1. 문서 입구

- `docs/README.md`: 전체 문서의 진입점. 이 파일에서 다른 주요 카테고리(기술 선정, 환경 변수, PWA 등)를 빠르게 파악하세요.
- `docs/디렉토리-구조/README.md` 및 `docs/디렉토리-구조/초기-단순-구조.md`: 현재 FSD 구조와 초기 파일 배치 추천. 실제 코드 구조와 비교해보면서 해당 폴더의 목적을 확인합니다.
- `docs/기술-선정/README.md`: 기술 스택(React/TypeScript/Vite/Tailwind 등) + 선정 이유 설명.
- `docs/환경-변수/README.md`: 환경변수 정책/도메인 설정 기준.

## 2. 디자인 시스템 관련

Tasteam의 UI 기준은 `docs/디자인-시스템/README.md` 아래에 집중되어 있습니다.

- `docs/디자인-시스템/README.md`: 디자인 시스템 전체 개요와 토큰/컴포넌트/운영 흐름 요약.
- `docs/디자인-시스템/컬러.md`, `docs/디자인-시스템/토큰.md`, `docs/디자인-시스템/컴포넌트.md`: 색상/토큰 네이밍, 컴포넌트 상태/접근성, shadcn 기반 운영 규칙 등이 자세히 정리되어 있습니다.
- `docs/디자인-시스템/결정사항.md`: 현재 팀이 확정한 정책(브랜드 컬러, Pretendard, lucide-react, shared/ui 경계 등)과 후속 결정 목록.
- `docs/디자인-시스템/shadcn-컴포넌트-목록.md`: shadcn/ui 공식 컴포넌트 인덱스.
- `docs/디자인-시스템/react-bits-컴포넌트-목록.md`: React Bits 애니메이션/스타일러 목록과 간단한 애니메이션 가이드.

## 3. 코드/스타일 규칙

- `docs/개발-규칙/README.md`: FSD 레이어별 파일/컴포넌트 위치 규칙과 숫자/스타일링 정책(예: formatDisplayNumber).
- `src/shared/README.md`: shared 폴더의 역할(api, styles, ui 등)을 요약.
- `src/shared/styles/global.css`와 `tailwind.config.js`: 전역 토큰과 tailwind 연결을 먼저 열어보고, 컬러/폰트 설정을 확인합니다.

## 4. 운영 및 릴리즈 관련

- `docs/디자인-시스템/운영-프로세스.md`: 토큰/컴포넌트 변경 요구 흐름, Breaking change 정책, 릴리스 노트 템플릿.
- `docs/PWA/README.md`, `docs/상태-관리/README.md`: 해당 영역의 도입/운영 가이드(필요할 때 덧붙여서 읽습니다).

## 5. 요약

1. `docs/README.md` → 전체 카테고리 확인
2. `docs/디자인-시스템/README.md` → 디자인/스타일 토큰/컴포넌트 정책 확인
3. 코드 가이드(`docs/개발-규칙`, shared README, global.css) → 실제 코드 위치 파악
4. 운영 문서(`운영-프로세스`, `PWA`, `상태-관리`) → 차후 프로세스/품질 기준 확인

필요한 문서가 보이지 않거나 새로운 항목이 있을 경우 이 문서에 추가하거나 `docs/README.md` 업데이트를 요청해 주세요.
