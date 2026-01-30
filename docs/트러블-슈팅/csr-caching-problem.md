# CSR 캐싱 문제 진단 및 해결

> Issue: #46 — 배포 후 CSR이 갱신되지 않는 문제

## 증상

- 배포 후에도 브라우저에서 이전 버전의 화면이 계속 표시됨
- Hard Reload (`Ctrl+Shift+R`) 또는 캐시 비활성화 시 정상 동작
- 코드/배포 문제가 아닌 **캐시 전략 문제**로 확인

## 원인 분석

### 1. 서비스워커 (Workbox) — 주 원인

`vite-plugin-pwa`의 Workbox가 `precacheAndRoute()`로 `index.html` + JS/CSS를 모두 프리캐시하고 있음.

**문제 설정 (`vite.config.ts`):**

```ts
VitePWA({
  registerType: 'autoUpdate',
  workbox: {
    mode: 'development', // 프로덕션에서도 dev 모드로 동작
    navigateFallbackDenylist: [/^\/api\//],
  },
})
```

| 설정                  | 문제점                                                   |
| --------------------- | -------------------------------------------------------- |
| `mode: 'development'` | 프로덕션 빌드에 불필요한 dev 모드 적용, 캐시 동작 비정상 |
| `skipWaiting` 미설정  | 새 SW 감지해도 탭을 닫고 다시 열어야 활성화              |
| `clientsClaim` 미설정 | 새 SW가 기존 클라이언트를 즉시 제어하지 못함             |

### 2. 서버 캐시 헤더 미설정

- `/var/www/html`에 정적 파일 직접 배포
- nginx에 `Cache-Control` 헤더 설정 없음
- `index.html`이 브라우저/프록시에 캐싱될 수 있음

### 3. JS 번들 해시 — 정상

Vite 기본값으로 `index-CwQtcmJc.js` 형태의 content hash 파일명 사용 중. 이 부분은 문제 없음.

## 올바른 캐시 전략

| 파일                   | Cache-Control                         |
| ---------------------- | ------------------------------------- |
| `index.html`           | `no-store, no-cache, must-revalidate` |
| `assets/*` (해시 포함) | `public, max-age=31536000, immutable` |
| API 응답               | 상황별 설정                           |

## 수정 사항

### vite.config.ts 수정

- `workbox.mode` 제거 (프로덕션에서 production 모드 사용)
- `skipWaiting: true` 추가 → 새 SW 즉시 활성화
- `clientsClaim: true` 추가 → 기존 클라이언트 즉시 제어

### nginx 설정 (서버 측 — 별도 작업 필요)

```nginx
location / {
    root /var/www/html;
    try_files $uri $uri/ /index.html;

    # index.html 캐시 방지
    location = /index.html {
        add_header Cache-Control "no-store, no-cache, must-revalidate";
    }

    # 해시 포함 정적 자산 장기 캐싱
    location /assets/ {
        add_header Cache-Control "public, max-age=31536000, immutable";
    }
}
```

---

## 수정 완료 내역

### ✅ vite.config.ts Workbox 설정 수정 완료

**변경 전:**

```ts
workbox: {
  mode: 'development',
  navigateFallbackDenylist: [/^\/api\//],
},
```

**변경 후:**

```ts
const appEnv = process.env.VITE_APP_ENV
const isLocal = appEnv === 'local'

VitePWA({
  disable: disablePwa,
  minify: !isLocal,
  registerType: 'autoUpdate',
  workbox: {
    navigateFallbackDenylist: [/^\/api\//],
    skipWaiting: true,
    clientsClaim: true,
    ...(isLocal && { mode: 'development' as const }),
  },
})
```

**환경별 동작:**

| `VITE_APP_ENV` | 용도              | `mode`        | `minify` |
| -------------- | ----------------- | ------------- | -------- |
| `local`        | 개발자 로컬       | `development` | off      |
| `development`  | 개발 서버 (CI/CD) | production    | on       |
| `production`   | 운영 서버         | production    | on       |

| 변경                                       | 효과                                                     |
| ------------------------------------------ | -------------------------------------------------------- |
| `mode: 'development'` → `local`에서만 적용 | 개발/운영 서버에서 Workbox가 정상 production 모드로 동작 |
| `skipWaiting: true` 추가                   | 새 SW가 대기 상태 없이 즉시 활성화                       |
| `clientsClaim: true` 추가                  | 활성화된 SW가 기존 열린 탭도 즉시 제어                   |
| `.env.example` → `VITE_APP_ENV=local`      | 로컬 기본값 변경                                         |

### ⏳ nginx 캐시 헤더 설정 — 미완료 (서버 측 작업 필요)

서버 측 nginx 설정은 별도 인프라 작업이 필요. 위 nginx 설정 섹션 참고하여 적용 필요.
