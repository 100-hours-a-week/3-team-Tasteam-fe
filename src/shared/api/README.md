# shared/api

공통 API 클라이언트와 요청 유틸을 관리합니다.

## 구성

- `http.ts`: axios 인스턴스 (baseURL/timeout/헤더 등)
- `request.ts`: 공통 요청 헬퍼 (`response.data`만 반환)

## 사용 예시

```ts
import { request } from '@/shared/api/request'

type User = { id: string; name: string }

export const getMe = () => {
  return request<User>({ method: 'GET', url: '/me' })
}
```
