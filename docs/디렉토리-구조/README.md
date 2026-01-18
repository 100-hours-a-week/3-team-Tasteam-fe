# 프론트엔드 디렉토리 구조 (FSD 스타일)

이 구조는 **Feature-Sliced Design(FSD)** 라는 아키텍처 스타일을 참고합니다.
핵심은 “기능/도메인 단위로 나누고, 재사용 범위를 기준으로 레이어를 분리”하는 것입니다.

## 왜 쓰나요?

- 파일/폴더가 커져도 위치가 예측 가능함
- 기능별로 변경 범위를 좁혀 유지보수가 쉬움
- 팀원이 합류해도 폴더 역할을 쉽게 이해함

## 기본 원칙

- **app → pages → widgets → features → entities → shared** 순서로 “재사용 범위”가 커짐
- **shared**는 어디서든 재사용, **entities**는 도메인 중심, **features**는 사용자 기능 중심
- **pages**는 라우팅 단위의 화면, **app**은 전역 설정/부트스트랩

## 폴더 구조

```
src/
  app/              # 앱 부트스트랩, 전역 설정, 라우팅
  pages/            # 라우팅 단위 페이지
  widgets/          # 페이지를 구성하는 큰 UI 블록
  features/         # 사용자 시나리오/기능 단위
  entities/         # 도메인 엔티티(예: user, team)
  shared/           # 공통 리소스
    ui/             # 재사용 UI 컴포넌트
    api/            # API 클라이언트, 요청 모듈
    lib/            # 유틸/헬퍼/공통 함수
    assets/         # 이미지/폰트 등 정적 자산
    config/         # 상수, 환경 설정
    types/          # 공통 타입
    styles/         # 전역 스타일, 테마
```

## 각 폴더에 무엇이 들어가나

### app/

- 앱 엔트리(`main.tsx`), 전역 Provider, 라우터, 전역 스타일
- 예: `AppProviders.tsx`, `router.tsx`

### pages/

- 라우팅 단위의 화면(페이지)
- 예: `HomePage.tsx`, `LoginPage.tsx`

### widgets/

- 페이지를 구성하는 큰 UI 블록(복합 컴포넌트)
- 예: `Header`, `Footer`, `DashboardLayout`

### features/

- 사용자 행동 중심 기능(로그인, 검색, 팀 생성 등)
- 예: `login-form/`, `team-create/`, `search-bar/`

### entities/

- 도메인 중심 객체(예: user, team)
- 예: `user/`, `team/` 아래에 `model/`, `api/`, `ui/`

예시 구조:

```
src/entities/user/
  model/    # 타입, 상태, query key
  api/      # user 관련 API
  ui/       # UserAvatar, UserBadge 등
```

### shared/

- 모든 레이어에서 재사용되는 공통 리소스
- 예: `Button`, `Input`, `formatDate`, `axios instance`

## 난이도에 대한 팁

처음부터 모든 레이어를 꽉 채울 필요는 없습니다.
작게 시작해서 규모가 커지면 `features/entities/widgets`로 점진적으로 분리하세요.
