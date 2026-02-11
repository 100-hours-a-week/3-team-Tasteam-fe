# 공지사항/이벤트 API 명세

## 개요

공지사항 및 이벤트 관련 API 명세입니다.

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

## 3. DTO 타입 정의

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

---

## 4. 프론트엔드 구현

### 디렉토리 구조

```
src/
├── entities/
│   ├── notice/
│   │   ├── api/
│   │   │   └── noticeApi.ts      # API 호출 함수
│   │   ├── model/
│   │   │   ├── dto.ts            # DTO 타입 정의
│   │   │   └── types.ts          # 프론트엔드용 타입
│   │   └── index.ts              # 모듈 export
│   └── event/
│       ├── api/
│       │   └── eventApi.ts
│       ├── model/
│       │   ├── dto.ts
│       │   └── types.ts
│       └── index.ts
├── pages/
│   ├── notices/
│   │   ├── NoticesPage.tsx       # 공지사항 목록 페이지
│   │   └── index.ts
│   └── events/
│       ├── EventsPage.tsx        # 이벤트 목록 페이지
│       └── index.ts
└── widgets/
    └── splash-popup/
        ├── SplashPopup.tsx       # 메인 팝업 컴포넌트
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
