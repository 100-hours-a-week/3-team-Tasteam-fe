# Layout Shift 문제와 해결 방법

## 개요

Layout Shift(레이아웃 이동)은 화면이 렌더링된 뒤 요소의 위치/크기가 바뀌면서 사용자가 보는 화면이 튀는 현상이다. 이 현상은 UX를 크게 떨어뜨리고, 웹 성능 지표인 **CLS(Cumulative Layout Shift)** 점수 악화의 주요 원인이다.

## 증상

- 페이지 로드 중 버튼/텍스트가 갑자기 밀리거나 튐
- 이미지나 카드가 늦게 로드되면서 주변 콘텐츠가 재배치됨
- 폰트가 바뀌는 순간 텍스트 줄바꿈/크기가 변함
- API 데이터가 도착하면서 상단 콘텐츠가 아래로 밀림

## 주요 원인

1. **고정 크기 없이 로드되는 이미지/영상**
2. **웹폰트 로드 지연으로 인한 폰트 교체**
3. **비동기 콘텐츠 삽입 (배너, 추천 영역 등)**
4. **레이아웃 속성(top/left/width/height 등)으로 애니메이션**
5. **초기 렌더 후 높이가 변하는 컴포넌트**

## 해결 방법

### 1) 이미지/미디어에 고정 크기 또는 비율을 지정

- `img`에 `width`/`height` 속성 지정
- 반응형 레이아웃에서는 `aspect-ratio`를 활용해 공간을 예약

```html
<img src="/images/food.jpg" width="640" height="480" alt="food" />
```

```css
.card-image {
  width: 100%;
  aspect-ratio: 4 / 3;
  object-fit: cover;
}
```

### 2) 웹폰트 로딩 전략 개선

- `preconnect`로 폰트 서버 연결 지연 최소화
- `font-display: swap`으로 텍스트 지연을 막고, 폰트 교체 시 변화를 최소화
- 가능하면 fallback 폰트를 실제 폰트와 유사한 메트릭으로 선택

```html
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
```

```css
@font-face {
  font-family: 'Pretendard';
  src: url('/fonts/Pretendard.woff2') format('woff2');
  font-display: swap;
}

body {
  font-family: 'Pretendard', 'Apple SD Gothic Neo', 'Noto Sans KR', sans-serif;
}
```

### 3) 비동기 데이터 영역에 스켈레톤/고정 높이 적용

- API 데이터가 들어오는 영역에 최소 높이를 주어 레이아웃 변화 방지

```tsx
<div className="recommendation" style={{ minHeight: 240 }}>
  {data ? <List items={data} /> : <Skeleton rows={4} />}
</div>
```

### 4) 레이아웃을 변경하는 애니메이션 피하기

- `top/left/height` 대신 `transform` 사용

```css
/* bad */
.panel {
  transition: top 200ms ease;
}

/* good */
.panel {
  transition: transform 200ms ease;
}
```

### 5) 동적으로 삽입되는 컴포넌트는 상단이 아닌 하단 배치

- 상단에 삽입되면 전체 레이아웃이 밀리므로, 가능하면 하단/오프캔버스로 분리

## 체크리스트

- 이미지/영상에 `width/height` 혹은 `aspect-ratio`가 있는가?
- 폰트 로딩 전략이 적용되어 있는가?
- 비동기 데이터 영역에 스켈레톤/고정 높이를 적용했는가?
- 애니메이션이 `transform` 기반인가?
- 동적 삽입 요소가 상단에 배치되지 않았는가?

## 참고

- CLS 측정은 Chrome DevTools Performance 패널 또는 Lighthouse를 사용
- 문제가 반복될 경우, Layout Shift 이벤트를 확인해 원인 요소를 추적
