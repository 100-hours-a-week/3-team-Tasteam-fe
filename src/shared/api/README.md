# shared/api

공통 API 클라이언트와 요청 유틸을 관리합니다.

## 구성

| 파일         | 역할                                    |
| ------------ | --------------------------------------- |
| `http.ts`    | axios 인스턴스, 요청/응답 인터셉터      |
| `request.ts` | 공통 요청 헬퍼 (`response.data`만 반환) |

관련 모듈:

| 파일                                         | 역할                                              |
| -------------------------------------------- | ------------------------------------------------- |
| `shared/lib/authToken.ts`                    | accessToken 인메모리 저장, pub-sub, JWT 만료 파싱 |
| `entities/user/model/AuthProvider.tsx`       | 인증 상태 관리, 타이머 기반 사전 리프레시         |
| `entities/auth/api/authApi.ts`               | 토큰 발급/리프레시/로그아웃 API                   |
| `features/auth/require-auth/RequireAuth.tsx` | 라우트 가드 (미인증 시 로그인 리다이렉트)         |
| `features/auth/social-login/`                | OAuth 소셜 로그인 시작                            |
| `pages/oauth/OAuthCallbackPage.tsx`          | OAuth 콜백 처리                                   |
| `widgets/auth/LoginRequiredModal.tsx`        | 세션 만료 모달                                    |

---

## 토큰 저장 구조

```
accessToken  → 인메모리 변수 (shared/lib/authToken.ts)
refreshToken → httpOnly 쿠키 (백엔드 관리, 프론트에서 직접 접근 불가)
```

- `accessToken`은 페이지 새로고침 시 소실됨
- 앱 시작 시 `bootstrap`에서 refreshToken 쿠키로 accessToken 재발급 시도

---

## API 요청 흐름

```
request() → http.request()
                │
        ┌───────┴───────┐
        ▼               ▼
  요청 인터셉터      응답 인터셉터
  (토큰 주입)       (401 처리)
```

### 요청 인터셉터

모든 요청에 `Authorization: Bearer {accessToken}` 헤더를 자동 주입합니다.
토큰이 없으면 헤더 없이 요청을 보냅니다.

### 응답 인터셉터 (401 처리)

```
401 응답 수신
  │
  ├─ 이미 재시도한 요청 (_retry=true) → 에러 전파
  ├─ refresh 엔드포인트 자체의 401 → 에러 전파 (무한루프 방지)
  ├─ refreshEnabled=false → clearAccessToken() → 에러 전파
  │
  └─ 정상 401:
      1. _retry=true 설정
      2. POST /api/v1/auth/token/refresh 호출
      3. Promise 캐싱 (동시 401 요청 중복 방지)
      │
      ├─ 성공 → 새 토큰 설정 → 원래 요청 재시도
      └─ 실패 → clearAccessToken() → 에러 전파 (caller가 처리)
```

refresh 실패 시 전역 모달을 띄우지 않습니다.
에러는 호출자(페이지/컴포넌트)에게 전파되며, 각 계층에서 자체적으로 처리합니다.

---

## 인증 상태 관리 (AuthProvider)

### Context API

```ts
{
  accessToken: string | null
  user: User | null
  isAuthenticated: boolean   // Boolean(accessToken)
  showLogin: boolean         // 세션 만료 모달 표시 여부
  openLogin(): void
  closeLogin(): void
  loginWithToken(token, user?): void
  logout(): Promise<boolean>
}
```

### 사전 토큰 리프레시 (타이머)

```
토큰 설정됨
  → JWT exp 클레임 디코딩
  → 만료 60초 전에 setTimeout 등록
  → 타이머 실행 시 refreshAccessToken() 호출
    ├─ 성공 → 새 토큰 설정, 타이머 재등록
    └─ 실패 → clearAccessToken(), showLogin=true → 세션 만료 모달
```

---

## OAuth 로그인 플로우

```
1. 사용자가 소셜 로그인 버튼 클릭
   └─ sessionStorage['auth:return_to'] = 현재 경로
   └─ window.location.href = /api/v1/auth/oauth/{provider}?redirect_uri=...

2. 백엔드 → Google/Kakao 인증 화면으로 302 리다이렉트

3. 인증 완료 → 백엔드 콜백
   └─ 백엔드가 httpOnly refreshToken 쿠키 설정

4. /oauth/callback 페이지 진입
   └─ POST /api/v1/auth/token/refresh (accessToken: null)
   └─ refreshToken 쿠키로 새 accessToken 발급
   └─ loginWithToken(token) 호출
   └─ sessionStorage['auth:return_to'] 경로로 이동
```

---

## 라우트 보호 패턴

### Pattern A: 페이지 내부 인증 검사

페이지 컴포넌트 자체에서 `useAuth().isAuthenticated`를 확인하고,
미인증 시 "로그인이 필요해요" UI를 페이지 내에 표시합니다.

적용 페이지: `/profile`

```tsx
const { isAuthenticated } = useAuth()
if (!isAuthenticated) {
  return <div>로그인이 필요해요 + 로그인하기 버튼</div>
}
```

### Pattern B: RequireAuth 라우트 가드

`<RequireAuth>`로 감싸진 라우트는 진입 전에 인증을 검사합니다.
미인증 시 toast "로그인이 필요한 기능입니다"를 표시하고 `/login`으로 리다이렉트합니다.
로그인 완료 후 원래 이동하려던 페이지로 자동 복귀합니다.

적용 라우트:

| 경로                      | 페이지      |
| ------------------------- | ----------- |
| `/restaurants/:id/review` | 리뷰 작성   |
| `/my-page/edit`           | 프로필 수정 |
| `/my-page/favorites`      | 찜 목록     |
| `/my-page/reviews`        | 내 리뷰     |
| `/groups/create`          | 그룹 생성   |
| `/chat/:roomId`           | 채팅        |

```tsx
<Route
  path="/restaurants/:id/review"
  element={
    <RequireAuth>
      <WriteReviewPage />
    </RequireAuth>
  }
/>
```

### 세션 만료 모달 (LoginRequiredModal)

AuthProvider의 타이머 기반 사전 리프레시가 실패하면 전역 모달이 표시됩니다.
"세션이 만료되었습니다. 다시 로그인해 주세요." 메시지와 로그인 버튼을 제공합니다.

---

## 앱 부트스트랩

```
앱 시작 → SplashPage 표시
  → setRefreshEnabled(true)
  → POST /api/v1/auth/token/refresh (accessToken: null)
    ├─ 성공 → setAccessToken(token) → 로그인 상태 복원
    └─ 실패 → 미인증 상태로 진행 (에러 무시)
  → 최소 3초 대기 후 isReady=true
  → SplashPage 숨김, 라우트 렌더링 시작
```

---

## 401 에러 처리 요약

| 상황                           | 동작                                                 |
| ------------------------------ | ---------------------------------------------------- |
| API 요청 중 401                | refresh 1회 시도 → 성공 시 재시도, 실패 시 에러 전파 |
| refresh 실패 후                | clearAccessToken() → isAuthenticated=false           |
| Pattern B 페이지에서 토큰 소실 | RequireAuth가 감지 → toast + /login 리다이렉트       |
| Pattern A 페이지에서 토큰 소실 | 컴포넌트 re-render → "로그인이 필요해요" 표시        |
| 토큰 만료 임박 (타이머)        | 사전 refresh 시도 → 실패 시 세션 만료 모달           |

---

## 사용 예시

```ts
import { request } from '@/shared/api/request'

type User = { id: string; name: string }

export const getMe = () => request<User>({ method: 'GET', url: '/api/v1/members/me' })
```

## 공통 응답 타입

```ts
import type { SuccessResponse } from '@/shared/types/api'

type User = { id: string; name: string }
type UserResponse = SuccessResponse<User>
```
