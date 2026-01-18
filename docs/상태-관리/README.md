# 상태 관리(제안): Zustand / TanStack Query

이 문서는 **아직 의존성을 설치하지 않은 상태**에서, 향후 상태 관리 도구 도입을 위한 기준과 가이드를 정리합니다.

## 목적

- UI 상태와 서버 데이터 상태를 분리해 복잡도를 낮춥니다.
- API 데이터 캐싱/재요청/동기화 로직을 표준화합니다.

## 용어 정리

- Client State: 서버와 무관한 앱 내부 상태(UI/폼/선택값)
- Server State: 서버에서 가져온 데이터와 그 동기화 상태(캐시/로딩/에러)

## Zustand (Client State)

### 적합한 대상

- 모달/드로어 열림 여부, 토스트 큐
- 현재 선택된 탭/필터/정렬/페이지(서버 데이터 자체가 아닌 UI 상태)
- 임시 폼 입력값(제출 전)
- 전역 UI 설정(테마, 언어 등)

### 피해야 할 패턴

- 서버에서 받은 데이터(리스트/상세 응답)를 그대로 Zustand에 복사해서 저장
  - 이유: TanStack Query 도입 시 중복 캐시가 되고, 동기화/무효화/리패치가 어려워집니다.

## TanStack Query (Server State)

### 적합한 대상

- `GET` 요청 결과 캐싱(예: 사용자 정보, 목록, 상세)
- 로딩/에러/리트라이/백오프 관리
- `POST/PUT/DELETE` 이후 관련 쿼리 무효화(invalidate) 및 재요청
- 페이지네이션/무한 스크롤

### 핵심 개념

- Query Key: 어떤 데이터를 의미하는지 식별하는 키
- Stale/Cache: 데이터 신선도와 캐시 유지 시간
- Invalidate: 변경 이후 관련 쿼리를 “오래됨” 처리하여 재요청

## 함께 사용할 때의 원칙(권장)

- 서버 데이터는 TanStack Query, UI 상태는 Zustand로 분리합니다.
- Zustand에는 서버 데이터 자체가 아니라 **서버 데이터에 대한 선택/필터/뷰 상태**만 저장합니다.

예)

- Zustand: `selectedTeamId`, `isLoginModalOpen`
- TanStack Query: `teams`, `teamDetail(selectedTeamId)`

## PWA(Service Worker)와의 관계

- 현재 프로젝트 방침은 **정적 자산만 캐시**입니다.
- API 응답을 Service Worker에서 캐시하지 않으면, TanStack Query 캐시와 충돌/이중 캐시 문제가 거의 없습니다.
- 향후 “API 오프라인 캐시”까지 요구되면, SW 캐시 전략과 Query 캐시 전략을 함께 설계해야 합니다.

## 도입 체크리스트(추후)

- [ ] `@tanstack/react-query`/`zustand` 의존성 설치
- [ ] QueryClientProvider 세팅 및 기본 옵션 정의
- [ ] API 클라이언트(axios/fetch) 표준화 및 에러 처리 규칙
- [ ] Query Key 규칙 문서화
- [ ] 전역 스토어 범위/네이밍 규칙 정의
