# 번들 크기 최적화 가이드

## 현재 상황

- 메인 번들 크기: 697KB (gzip 후 223KB)
- 경고 임계값: 500KB
- 초과량: 197KB

## 최적화 방법

### 1. 라우트 기반 코드 스플리팅 (권장) ⭐

**효과:** 초기 로딩 크기 70-80% 감소

**적용 방법:**

```tsx
// src/app/router/AppRouter.tsx
import { lazy, Suspense } from 'react'

// Lazy load pages
const HomePage = lazy(() => import('@/pages/home/HomePage').then(m => ({ default: m.HomePage })))
const SearchPage = lazy(() => import('@/pages/search').then(m => ({ default: m.SearchPage })))
const WriteReviewPage = lazy(() => import('@/pages/write-review').then(m => ({ default: m.WriteReviewPage })))
// ... 나머지 페이지들도 동일하게

// Routes에서 Suspense로 감싸기
<Suspense fallback={<div>Loading...</div>}>
  <Routes>
    <Route path="/" element={<HomePage />} />
    // ...
  </Routes>
</Suspense>
```

**장점:**

- 사용자가 방문하는 페이지만 로드
- 초기 로딩 속도 대폭 개선
- 자동으로 청크 분리

**단점:**

- 페이지 전환 시 약간의 로딩 발생 가능

---

### 2. 라이브러리 청크 분리

**효과:** 캐시 효율성 향상, 번들 관리 용이

**적용 방법:**

```ts
// vite.config.ts
export default defineConfig({
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          'react-vendor': ['react', 'react-dom', 'react-router-dom'],
          'ui-vendor': [
            '@radix-ui/react-dialog',
            '@radix-ui/react-dropdown-menu',
            '@radix-ui/react-avatar',
            // 다른 Radix UI 컴포넌트들
          ],
          'chart-vendor': ['recharts'],
          utils: ['date-fns', 'clsx', 'tailwind-merge'],
        },
      },
    },
  },
})
```

**장점:**

- 라이브러리 변경 시 해당 청크만 재다운로드
- 브라우저 캐싱 효율 극대화

---

### 3. 중복 라이브러리 제거

**분석 명령:**

```bash
npx vite-bundle-visualizer
```

**일반적인 중복 항목:**

- lodash → lodash-es로 교체
- moment → date-fns 사용 (이미 사용 중)
- 중복된 Radix UI 컴포넌트 통합

---

### 4. Tree Shaking 최적화

**확인 항목:**

```ts
// ❌ 잘못된 import (전체 가져오기)
import * as icons from 'lucide-react'

// ✅ 올바른 import (필요한 것만)
import { Heart, X, ChevronDown } from 'lucide-react'
```

---

### 5. Dynamic Import for Heavy Components

**큰 컴포넌트를 동적으로 로드:**

```tsx
// 예: 차트 컴포넌트
const Chart = lazy(() => import('@/widgets/chart'))

// 사용
{
  showChart && (
    <Suspense fallback={<ChartSkeleton />}>
      <Chart data={data} />
    </Suspense>
  )
}
```

---

### 6. 이미지 최적화 (이미 적용됨) ✅

- WebP 변환
- 적절한 사이즈로 리사이징
- PWA 캐싱

---

### 7. 번들 크기 경고 임계값 조정 (최후의 수단)

```ts
// vite.config.ts
export default defineConfig({
  build: {
    chunkSizeWarningLimit: 1000, // KB
  },
})
```

⚠️ **주의:** 이는 근본적인 해결책이 아니며, 실제 성능 개선 없이 경고만 숨깁니다.

---

## 권장 적용 순서

1. **라우트 기반 코드 스플리팅** (1시간, 효과 최대)
2. **라이브러리 청크 분리** (30분, 캐싱 개선)
3. **번들 분석 및 중복 제거** (1시간, 추가 최적화)

## 예상 결과

적용 전:

- 메인 번들: 697KB

적용 후 (라우트 스플리팅):

- 메인 번들: ~150KB
- 홈 페이지 청크: ~50KB
- 리뷰 페이지 청크: ~80KB
- 기타 페이지들: 각 30-60KB
- 벤더 청크: ~200KB (캐시됨)

**총 초기 로딩:** 150KB + 200KB = 350KB (50% 감소)
