# PWA 설정 가이드

Tasteam은 PWA를 지원하며, Service Worker는 정적 자산만 캐시합니다.
API 응답은 캐시하지 않고 네트워크에서만 가져옵니다.

## 핵심 설정

- Manifest: 앱 정보/아이콘/시작 URL 정의
- Service Worker: 빌드 산출물만 precache
- HTTPS: Service Worker 동작 필수 조건

## 캐시 전략

- 정적 자산: Precache (Cache First)
- API 요청: 항상 네트워크에서만 가져옴 (Network Only)

## 체크리스트

- `npm run build` 후 `dist/`에 `manifest.webmanifest` 생성 확인
- 배포 환경이 HTTPS인지 확인
- 아이콘은 추후 PNG(192/512)로 교체 권장

## 참고

- 설정 위치: `vite.config.ts`
- 플러그인: `vite-plugin-pwa`

## 업데이트 UX 정책

- 적용 환경: `staging`, `production`
- 정책: 새 버전 감지 시 토스트로 사용자 승인 후 갱신
- 목적: 작성 중인 입력/작업 유실을 줄이고, 사용자가 안전한 시점에 업데이트 적용

## 업데이트 플로우

1. 새 Service Worker가 `waiting` 상태로 감지됨
2. 토스트 노출: `새 버전이 있습니다. 지금 업데이트할까요?`
3. 사용자가 `업데이트` 클릭 시 `updateServiceWorker(true)` 실행
4. `controllerchange` 이벤트 수신 후 `window.location.reload()`로 최신 리소스 반영

## 구현 위치

- 훅: `src/app/pwa/usePwaUpdatePrompt.ts`
- 연결: `src/App.tsx`
