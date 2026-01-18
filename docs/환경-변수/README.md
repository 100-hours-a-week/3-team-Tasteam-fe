# 환경 변수 가이드

Vite에서는 `VITE_` 접두사가 붙은 값만 클라이언트 코드에서 접근할 수 있습니다.

## 실제 환경 기준 값

- 개발(로컬): `http://localhost:3000`
- 스테이징: `https://staging.tasteam.com`
- 운영: `https://tasteam.com`

## 백엔드 API 도메인

- 개발(로컬): `http://localhost:8080`
- 스테이징: `https://api-staging.tasteam.com`
- 운영: `https://api.tasteam.com`

## 예시 (.env)

```bash
VITE_APP_ENV=development
VITE_APP_URL=http://localhost:3000
VITE_API_BASE_URL=http://localhost:8080
```

## 예시 (.env.production)

```bash
VITE_APP_ENV=production
VITE_APP_URL=https://tasteam.com
VITE_API_BASE_URL=https://api.tasteam.com
```

## 코드에서 사용

```ts
const apiBaseUrl = import.meta.env.VITE_API_BASE_URL
```
