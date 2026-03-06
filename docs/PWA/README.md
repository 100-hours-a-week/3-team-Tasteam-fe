# PWA 설정 가이드

Tasteam은 단일 Service Worker 구조를 사용합니다.  
하나의 SW(`sw.js`)가 앱 셸 캐시, 업데이트 반영, Firebase 백그라운드 알림을 함께 처리합니다.

## 핵심 구성

- 플러그인: `vite-plugin-pwa`
- 전략: `injectManifest`
- SW 소스: `src/app/pwa/sw.ts`
- SW 등록: `injectRegister: script-defer`
- 업데이트 UX: 사용자 승인 후 갱신 (`src/app/pwa/usePwaUpdatePrompt.ts`)

## 캐시 전략

- 앱 셸(HTML/JS/CSS): Workbox precache
- 이미지(`png/jpg/jpeg/webp/svg`): `CacheFirst` + 만료 정책
- API 요청: SW 캐시 제외 (`/api/*` denylist)
- 오래된 precache: `cleanupOutdatedCaches()`로 정리

## 서버 캐시 헤더 표준 (Nginx)

| 경로                    | Cache-Control                         | 목적                    |
| ----------------------- | ------------------------------------- | ----------------------- |
| `/index.html`           | `no-store, no-cache, must-revalidate` | 신규 배포 즉시 반영     |
| `/sw.js`                | `no-store, no-cache, must-revalidate` | SW 스크립트 재검증 강제 |
| `/manifest.webmanifest` | `no-store, no-cache, must-revalidate` | 매니페스트 즉시 반영    |
| `/assets/*` (해시 파일) | `public, max-age=31536000, immutable` | 장기 캐시 최적화        |

```nginx
location = /index.html {
  add_header Cache-Control "no-store, no-cache, must-revalidate";
}

location = /sw.js {
  add_header Cache-Control "no-store, no-cache, must-revalidate";
}

location = /manifest.webmanifest {
  add_header Cache-Control "no-store, no-cache, must-revalidate";
}

location /assets/ {
  add_header Cache-Control "public, max-age=31536000, immutable";
}
```

## 업데이트 UX 정책

- 적용 환경: `staging`, `production`
- 정책: 새 버전 감지 시 토스트로 사용자 승인 후 갱신
- 목적: 작성 중인 입력/작업 유실 최소화

## 업데이트 플로우

1. 새 SW가 `waiting` 상태로 감지됨
2. 토스트 노출: `새 버전이 있습니다. 지금 업데이트할까요?`
3. 사용자가 `업데이트` 클릭 시 `updateServiceWorker(true)` 실행
4. `controllerchange` 이벤트 수신 후 `window.location.reload()` 실행

## 검증 체크리스트

- `npm run build` 후 `dist/`에 `sw.js`, `manifest.webmanifest` 생성 확인
- 배포 후 `curl -I`로 경로별 Cache-Control 검증
- 브라우저 `Application > Service Workers`에서 루트 스코프 SW가 1개인지 확인
