# src 폴더 안내

`src/`는 애플리케이션 코드의 루트입니다.  
아래는 주요 폴더 역할입니다.

## 폴더 역할

- `app/`: 앱 부트스트랩, 전역 Provider, 라우팅  
  예: `app/router.tsx`, `app/providers.tsx`
- `pages/`: 라우팅 단위 페이지  
  예: `pages/HomePage.tsx`, `pages/LoginPage.tsx`
- `widgets/`: 페이지를 구성하는 큰 UI 블록  
  예: `widgets/Header`, `widgets/Sidebar`, `widgets/DashboardLayout`
- `features/`: 사용자 시나리오/기능 단위  
  예: `features/login`, `features/team-create`, `features/search`
- `entities/`: 도메인 엔티티(예: user, team)  
  예: `entities/user`, `entities/team`
- `shared/`: 공통 리소스  
  자세한 내용은 `src/shared/README.md` 참고

## 참고

초기에는 `pages` 중심으로 시작하고, 규모가 커지면 `features/entities/widgets`로 확장하는 방식이 일반적입니다.
