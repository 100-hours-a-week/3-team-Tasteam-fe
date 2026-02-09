# pages (라우트 스냅샷, 2026-02-04)

라우팅 단위 화면을 모아둔 레이어입니다. 각 폴더는 하나의 페이지 엔트리(`index.ts`)와 실제 페이지 컴포넌트(`*Page.tsx`)를 가집니다.

## 페이지별 구성

- **home**
  1. `HomePage.tsx` (+ module CSS) : 메인 홈 화면

- **splash**
  1. `SplashPage.tsx` (+ module CSS) : 초기 부트스트랩 스플래시

- **login**
  1. `LoginPage.tsx` (+ module CSS) : 로그인 화면

- **signup**
  1. `SignupPage.tsx` : 회원가입

- **oauth**
  1. `OAuthCallbackPage.tsx` (+ module CSS) : OAuth 콜백 처리

- **group**
  1. `GroupsPage.tsx` : 그룹 목록

- **group-detail**
  1. `GroupDetailPage.tsx` : 그룹 상세

- **group-email-join**
  1. `GroupEmailJoinPage.tsx` : 이메일 초대 링크 진입

- **group-password-join**
  1. `GroupPasswordJoinPage.tsx` : 비밀번호로 그룹 참여

- **create-group**
  1. `CreateGroupPage.tsx` : 그룹 생성 플로우

- **subgroups**
  1. `SubgroupsPage.tsx` : 소그룹 리스트

- **subgroup-list**
  1. `SubgroupList.tsx` : 다른 레이아웃의 소그룹 리스트

- **subgroup-create**
  1. `SubgroupCreatePage.tsx` : 소그룹 생성

- **location-select**
  1. `LocationSelectPage.tsx` : 위치 선택

- **chat-room**
  1. `ChatRoomPage.tsx` : 채팅방

- **restaurant-detail**
  1. `RestaurantDetailPage.tsx` : 식당 상세

- **restaurant-reviews**
  1. `RestaurantReviewsPage.tsx` : 식당 리뷰 목록

- **write-review**
  1. `WriteReviewPage.tsx` : 리뷰 작성

- **my-favorites**
  1. `MyFavoritesPage.tsx` : 내가 찜한 식당

- **my-reviews**
  1. `MyReviewsPage.tsx` : 내가 쓴 리뷰 목록

- **profile**
  1. `ProfilePage.tsx` : 마이 페이지(프로필)

- **edit-profile**
  1. `EditProfilePage.tsx` : 프로필 수정

- **notification-settings**
  1. `NotificationSettingsPage.tsx` : 알림 설정

- **notifications**
  1. `NotificationsPage.tsx` : 알림 목록

- **search**
  1. `SearchPage.tsx` : 통합 검색

- **today-lunch**
  1. `TodayLunchPage.tsx` : 오늘 점심 추천

- **onboarding**
  1. `OnboardingPage.tsx` : 신규 사용자 온보딩

- **error-page**
  1. `ErrorPage.tsx` : 에러/404 표시
