# shared/api

공통 API 클라이언트와 요청 유틸을 관리합니다.

## 구성

- `http.ts`: axios 인스턴스 (baseURL/timeout/헤더 등)
- `request.ts`: 공통 요청 헬퍼 (`response.data`만 반환)
- `authToken.ts`: access token 저장/조회 (메모리)

## 토큰/리프레시 전략

- `accessToken`은 `Authorization: Bearer <token>` 헤더로 전송
- `refreshToken`은 `httpOnly cookie`에 저장되어 자동 전송
- `POST /api/v1/token/refresh` 로 accessToken 재발급
- 엔드포인트는 `API_ENDPOINTS.tokenRefresh`로 관리

## 사용 예시

```ts
import { request } from '@/shared/api/request'

type User = { id: string; name: string }

export const getMe = () => {
  return request<User>({ method: 'GET', url: '/me' })
}
```

## 공통 응답 타입

```ts
import type { SuccessResponse } from '@/shared/types/api'

type User = { id: string; name: string }
type UserResponse = SuccessResponse<User>
```
