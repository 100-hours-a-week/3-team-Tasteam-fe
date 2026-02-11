# 공지사항/이벤트 API 명세

## 개요

공지사항 및 이벤트 관련 API 명세입니다.

## 주요 변경사항

### 메인 페이지 스플래시 이벤트

메인 페이지 API(`GET /api/v1/main`)에 스플래시 팝업으로 표시할 이벤트 정보를 포함합니다.

#### Response에 splashEvent 필드 추가

```json
{
  "data": {
    "banners": { ... },
    "sections": [ ... ],
    "splashEvent": {
      "id": 1,
      "title": "신규 가입 이벤트",
      "content": "첫 리뷰 작성 시 특별 쿠폰을 드립니다",
      "thumbnailImageUrl": "https://example.com/event.jpg",
      "startAt": "2026-02-01T00:00:00Z",
      "endAt": "2026-02-29T23:59:59Z"
    }
  }
}
```

- `splashEvent` 필드는 **선택적(Optional)**입니다
- 스플래시로 표시할 이벤트가 있을 때만 포함됩니다
- 백엔드에서 우선순위가 가장 높은 ONGOING 이벤트를 선택하여 전달합니다
- 이벤트가 없으면 필드 자체가 응답에 포함되지 않습니다

---

## 1. 공지사항 API

### 1.1 공지사항 목록 조회

| 항목 | 내용                  |
| ---- | --------------------- |
| URL  | `GET /api/v1/notices` |
| 권한 | PUBLIC                |

#### Request Parameters (Query)

| 이름 | 타입   | 필수 | 기본값 | 설명                     |
| ---- | ------ | ---- | ------ | ------------------------ |
| page | number | X    | 0      | 페이지 번호 (0부터 시작) |
| size | number | X    | 20     | 페이지당 항목 수         |

#### Response Body

```json
{
  "data": {
    "notices": [
      {
        "id": 1,
        "title": "서비스 이용약관 개정 안내",
        "content": "안녕하세요. Tasteam입니다...",
        "createdAt": "2026-02-01T09:00:00Z",
        "updatedAt": "2026-02-01T09:00:00Z"
      }
    ],
    "totalCount": 10,
    "hasNext": false
  }
}
```

---

### 1.2 공지사항 상세 조회

| 항목 | 내용                       |
| ---- | -------------------------- |
| URL  | `GET /api/v1/notices/{id}` |
| 권한 | PUBLIC                     |

#### Path Parameters

| 이름 | 타입   | 필수 | 설명        |
| ---- | ------ | ---- | ----------- |
| id   | number | O    | 공지사항 ID |

#### Response Body

```json
{
  "data": {
    "id": 1,
    "title": "서비스 이용약관 개정 안내",
    "content": "안녕하세요. Tasteam입니다...",
    "createdAt": "2026-02-01T09:00:00Z",
    "updatedAt": "2026-02-01T09:00:00Z"
  }
}
```

---

## 2. 이벤트 API

### 2.1 이벤트 목록 조회

| 항목 | 내용                 |
| ---- | -------------------- |
| URL  | `GET /api/v1/events` |
| 권한 | PUBLIC               |

#### Request Parameters (Query)

| 이름   | 타입   | 필수 | 기본값 | 설명                                        |
| ------ | ------ | ---- | ------ | ------------------------------------------- |
| page   | number | X    | 0      | 페이지 번호 (0부터 시작)                    |
| size   | number | X    | 20     | 페이지당 항목 수                            |
| status | string | X    | -      | 이벤트 상태 필터 (ONGOING, ENDED, UPCOMING) |

#### Response Body

```json
{
  "data": {
    "events": [
      {
        "id": 1,
        "title": "신규 가입 이벤트 - 최대 10,000원 쿠폰 증정",
        "content": "신규 가입 시 특별 쿠폰을 드립니다...",
        "thumbnailImageUrl": "https://example.com/image.jpg",
        "startAt": "2026-02-01T00:00:00Z",
        "endAt": "2026-02-29T23:59:59Z",
        "status": "ONGOING",
        "createdAt": "2026-01-28T09:00:00Z",
        "updatedAt": "2026-01-28T09:00:00Z"
      }
    ],
    "totalCount": 5,
    "hasNext": false
  }
}
```

#### Event Status

| 값       | 설명   |
| -------- | ------ |
| ONGOING  | 진행중 |
| ENDED    | 종료   |
| UPCOMING | 예정   |

---

### 2.2 이벤트 상세 조회

| 항목 | 내용                      |
| ---- | ------------------------- |
| URL  | `GET /api/v1/events/{id}` |
| 권한 | PUBLIC                    |

#### Path Parameters

| 이름 | 타입   | 필수 | 설명      |
| ---- | ------ | ---- | --------- |
| id   | number | O    | 이벤트 ID |

#### Response Body

```json
{
  "data": {
    "id": 1,
    "title": "신규 가입 이벤트 - 최대 10,000원 쿠폰 증정",
    "content": "신규 가입 시 특별 쿠폰을 드립니다...",
    "thumbnailImageUrl": "https://example.com/image.jpg",
    "startAt": "2026-02-01T00:00:00Z",
    "endAt": "2026-02-29T23:59:59Z",
    "status": "ONGOING",
    "createdAt": "2026-01-28T09:00:00Z",
    "updatedAt": "2026-01-28T09:00:00Z"
  }
}
```

---

## 3. 배너 API

### 3.1 배너 목록 조회

| 항목 | 내용                  |
| ---- | --------------------- |
| URL  | `GET /api/v1/banners` |
| 권한 | PUBLIC                |

#### Response Body

```json
{
  "data": {
    "banners": [
      {
        "id": 1,
        "imageUrl": "https://example.com/banner1.jpg",
        "title": "신규 가입 이벤트",
        "deeplinkUrl": "/events",
        "bgColor": "#FF5733",
        "displayOrder": 1
      }
    ]
  }
}
```

---

## 4. DTO 타입 정의

### NoticeDto

```typescript
type NoticeDto = {
  id: number
  title: string
  content: string
  createdAt: IsoDateTimeString
  updatedAt: IsoDateTimeString
}
```

### EventDto

```typescript
type EventStatus = 'ONGOING' | 'ENDED' | 'UPCOMING'

type EventDto = {
  id: number
  title: string
  content: string
  thumbnailImageUrl: string | null
  startAt: IsoDateTimeString
  endAt: IsoDateTimeString
  status: EventStatus
  createdAt: IsoDateTimeString
  updatedAt: IsoDateTimeString
}
```

### BannerDto

```typescript
type BannerDto = {
  id: number
  imageUrl: string
  title: string | null
  deeplinkUrl: string
  bgColor: string | null
  displayOrder: number
}
```

---

## 5. 프론트엔드 구현

### 디렉토리 구조

```
src/
├── entities/
│   ├── main/
│   │   ├── api/
│   │   │   └── mainApi.ts        # Main API 호출
│   │   ├── model/
│   │   │   └── types.ts          # SplashEventDto 포함
│   │   └── index.ts
│   ├── notice/
│   │   ├── api/
│   │   │   └── noticeApi.ts      # API 호출 함수
│   │   ├── model/
│   │   │   ├── dto.ts            # DTO 타입 정의
│   │   │   └── types.ts          # 프론트엔드용 타입
│   │   └── index.ts              # 모듈 export
│   ├── event/
│   │   ├── api/
│   │   │   └── eventApi.ts
│   │   ├── model/
│   │   │   ├── dto.ts
│   │   │   └── types.ts
│   │   └── index.ts
│   └── banner/
│       ├── api/
│       │   └── bannerApi.ts
│       ├── model/
│       │   ├── dto.ts
│       │   └── types.ts
│       └── index.ts
├── pages/
│   ├── home/
│   │   └── HomePage.tsx          # 스플래시 팝업 로직
│   ├── notices/
│   │   ├── NoticesPage.tsx       # 공지사항 목록 페이지
│   │   └── index.ts
│   └── events/
│       ├── EventsPage.tsx        # 이벤트 목록 페이지
│       └── index.ts
└── widgets/
    ├── splash-popup/
    │   ├── SplashPopup.tsx       # 메인 팝업 컴포넌트 (DTO 기반)
    │   └── index.ts
    └── home-ad-carousel/
        ├── HomeAdCarousel.tsx    # 광고 배너 캐러셀
        └── index.ts
```

### 라우트

| 경로       | 페이지      | 설명          |
| ---------- | ----------- | ------------- |
| `/notices` | NoticesPage | 공지사항 목록 |
| `/events`  | EventsPage  | 이벤트 목록   |

### 접근 경로

1. **프로필 페이지** → 공지사항 / 이벤트 메뉴
2. **메인 페이지 스플래시 팝업** → 이벤트 보러가기 버튼
3. **메인 페이지 배너 캐러셀** → 배너 클릭 시 딥링크로 이동

### 스플래시 팝업 구현 상세

#### 1. FSD 아키텍처 준수

- **Entity Layer** (`entities/main`)
  - `SplashEventDto` 타입 정의
  - Main API 응답에 `splashEvent?` 필드 포함

- **Widget Layer** (`widgets/splash-popup`)
  - `SplashPopup` 컴포넌트는 `SplashEventDto`를 props로 받음
  - DTO의 데이터를 UI로 표시하는 역할만 담당
  - 비즈니스 로직 없음

- **Page Layer** (`pages/home`)
  - Main API 호출 및 `splashEvent` 데이터 처리
  - "오늘 하루 보지 않기" 로직 관리
  - 이벤트 페이지로의 라우팅 처리

#### 2. 동작 흐름

```
1. HomePage에서 Main API 호출 (latitude, longitude)
   ↓
2. API 응답에 splashEvent 포함 여부 확인
   ↓
3-1. splashEvent가 있는 경우:
   - localStorage에서 'splash-popup-dismissed-date' 확인
   - 오늘 날짜와 비교하여 표시 여부 결정
   - showSplashPopup 상태 업데이트
   ↓
3-2. splashEvent가 없는 경우:
   - 스플래시 팝업 표시하지 않음
   ↓
4. SplashPopup 컴포넌트에 event DTO 전달
   ↓
5. 사용자 인터랙션:
   - "이벤트 보러가기" 클릭 → /events로 이동
   - "오늘 하루 보지 않기" 체크 → localStorage에 오늘 날짜 저장
   - X 버튼 또는 "닫기" 클릭 → 팝업 닫기
```

#### 3. 타입 정의

```typescript
// src/entities/main/model/types.ts
export type SplashEventDto = {
  id: number
  title: string
  content: string
  thumbnailImageUrl: string | null
  startAt: IsoDateTimeString
  endAt: IsoDateTimeString
}

export type MainPageResponseDto = SuccessResponse<{
  banners: MainBannerGroupDto
  sections: MainSectionDto[]
  splashEvent?: SplashEventDto // Optional
}>
```

#### 4. 컴포넌트 Props

```typescript
// src/widgets/splash-popup/SplashPopup.tsx
type SplashPopupProps = {
  event: SplashEventDto // DTO 객체 전달
  isOpen: boolean
  onClose: () => void
  onLinkClick?: () => void
}
```

#### 5. 사용 예시

```typescript
// src/pages/home/HomePage.tsx
{mainData?.data?.splashEvent && (
  <SplashPopup
    event={mainData.data.splashEvent}
    isOpen={showSplashPopup}
    onClose={() => setShowSplashPopup(false)}
    onLinkClick={() => navigate(ROUTES.events)}
  />
)}
```

#### 6. localStorage 키

- `splash-popup-dismissed-date`: "오늘 하루 보지 않기" 체크 시 저장되는 날짜 문자열
- 형식: `new Date().toDateString()` (예: "Tue Feb 11 2026")
