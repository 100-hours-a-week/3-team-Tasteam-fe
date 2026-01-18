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
