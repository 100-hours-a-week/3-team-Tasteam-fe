# entities (도메인 레이어 스냅샷, 2026-02-04)

도메인 단위로 API, 모델, UI를 모아두는 레이어입니다. 일반적인 구조는 `api/`(도메인 API), `model/`(타입·상태·훅·매퍼), `ui/`(도메인 전용 컴포넌트)로 구성됩니다.

## 하위 폴더 역할 가이드

- `api/`
  - 도메인에 특화된 HTTP 요청 모듈.
  - REST 호출 래퍼, 쿼리키 상수, 서버 DTO 변환이 여기서 끝나야 함.
  - 예: `restaurantApi.ts`에서 `getRestaurantDetail(id)` 반환 타입을 클라이언트 모델에 맞춰 변환.

- `model/`
  - 도메인 타입 정의(`types.ts`), 서버 DTO(`dto.ts`)와의 매핑(`mapper.ts`).
  - 도메인 상태/컨텍스트/훅(`useAuth`, `MemberGroupsProvider`)을 두어 UI가 의존할 수 있는 단일 진실 소스 제공.
  - 비즈니스 규칙(권한 판단, 상태 전이, 값 계산)을 여기서 처리하고 UI에는 결과만 넘긴다.

- `ui/`
  - 해당 도메인만의 시각적 컴포넌트. 데이터/핸들러는 props로 받고, 도메인 모델을 직접 렌더.
  - 로직은 최소화하고, 스타일·프리젠테이션에 집중.
  - 예: `RestaurantCard`, `ChatMessageBubble`, `ReviewCard`.

## 도메인별 구성

- **auth**
  - api
    1. `authApi.ts` : 토큰 발급/리프레시/로그아웃 API
  - model
    1. `types.ts` : 인증 도메인 타입
    2. `dto.ts` : 인증 관련 서버 DTO

- **user**
  - model
    1. `AuthProvider.tsx` : 전역 인증 컨텍스트 프로바이더
    2. `authContext.ts` : 인증 컨텍스트 정의
    3. `useAuth.ts` : 인증 상태/액션을 노출하는 훅

- **chat**
  - api
    1. `chatApi.ts` : 채팅 메시지/방 관련 API
  - model
    1. `types.ts` : 채팅 도메인 타입
    2. `dto.ts` : 채팅 서버 DTO
  - ui
    1. `ChatMessageBubble.tsx` : 송수신 버블, 전송 상태(전송 중/실패/읽음), 재시도 버튼
    2. `ChatDateDivider.tsx` : 날짜 구분선(오늘/어제/연도별 라벨)

- **favorite**
  - api
    1. `favoriteApi.ts` : 찜 추가/삭제/조회 API
  - model
    1. `types.ts` : 찜 도메인 타입
    2. `dto.ts` : 찜 관련 서버 DTO

- **group**
  - api
    1. `groupApi.ts` : 그룹 생성/조회/검색 등 API
  - model
    1. `types.ts` : 그룹 도메인 타입
    2. `dto.ts` : 그룹 서버 DTO
  - ui
    1. `GroupCard.tsx` : 그룹 기본 정보 카드
    2. `SearchGroupCard.tsx` : 검색 결과용 그룹 카드
    3. `MemberRow.tsx` : 그룹 멤버 리스트 아이템

- **subgroup**
  - api
    1. `subgroupApi.ts` : 소그룹 관련 API
  - model
    1. `types.ts` : 소그룹 도메인 타입
    2. `dto.ts` : 소그룹 서버 DTO
  - ui
    1. `SubgroupCard.tsx` : 소그룹 정보 카드

- **location**
  - api
    1. `reverseGeocode.ts` : 좌표→주소 역지오코딩 API
  - model
    1. `locationContext.ts` : 위치 컨텍스트 정의
    2. `LocationProvider.tsx` : 위치 프로바이더
    3. `useAppLocation.ts` : 위치 접근 훅
    4. `types.ts` : 위치 도메인 타입

- **member**
  - api
    1. `memberApi.ts` : 멤버 정보/그룹 조회 API
  - model
    1. `MemberGroupsProvider.tsx` : 멤버-그룹 상태 프로바이더
    2. `memberGroupsContext.ts` : 멤버 그룹 컨텍스트 정의
    3. `useMemberGroups.ts` : 멤버 그룹 훅
    4. `types.ts` : 멤버 도메인 타입
    5. `dto.ts` : 멤버 관련 서버 DTO

- **notification**
  - api
    1. `notificationApi.ts` : 알림 목록/읽음 처리 등 API
  - model
    1. `types.ts` : 알림 도메인 타입
    2. `dto.ts` : 알림 서버 DTO

- **restaurant**
  - api
    1. `restaurantApi.ts` : 레스토랑 상세/리스트/검색 등 도메인 API 래퍼
  - model
    1. `types.ts` : 도메인 타입 정의 (Restaurant, Category 등)
    2. `dto.ts` : 서버 DTO 스키마 및 매핑용 타입
  - ui
    1. `RestaurantCard.tsx` : 이름/카테고리/평점이 들어간 기본 카드
    2. `MainRestaurantCard.tsx` : 메인 섹션에서 강조용으로 쓰는 대형 카드
    3. `RestaurantListItem.tsx` : 리스트 아이템 형태의 레스토랑 셀
    4. `RestaurantMetaRow.tsx` : 위치·가격대 등 메타 정보 행

- **review**
  - api
    1. `reviewApi.ts` : 리뷰 작성/조회/삭제 등 API
  - model
    1. `types.ts` : 리뷰 도메인 타입
    2. `dto.ts` : 리뷰 서버 DTO
  - ui
    1. `ReviewCard.tsx` : 리뷰 내용/작성자/평점 카드

- **search**
  - api
    1. `searchApi.ts` : 검색 API
  - model
    1. `types.ts` : 검색 도메인 타입
    2. `useRecentSearches.ts` : 최근 검색어 로컬 상태/훅

- **main**
  - api
    1. `mainApi.ts` : 홈/메인 섹션 데이터 API
  - model
    1. `mapper.ts` : 메인 섹션 데이터 매퍼
    2. `types.ts` : 메인 섹션 타입

- **upload**
  - api
    1. `uploadApi.ts` : 파일 업로드 API
  - model
    1. `types.ts` : 업로드 도메인 타입
    2. `dto.ts` : 업로드 서버 DTO
