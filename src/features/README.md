# features (기능 레이어 스냅샷, 2026-02-04)

사용자 시나리오 중심으로 UI·로직을 묶어둔 레이어입니다. 도메인 모델(entities)과 공용 리소스(shared)를 조합해 실제 액션을 완성합니다.

## 하위 폴더 역할 가이드

- `api/` : 기능 수행을 위한 요청 헬퍼(필요한 경우).
- `model/` : 기능 상태/훅/밸리데이션(있다면).
- `ui/` : 기능 완성을 위한 컴포넌트 묶음.  
  ※ 기능 폴더마다 필요 없는 레이어는 생략될 수 있습니다.

## 기능별 구성

- **auth**
  - `require-auth/`
    1. `RequireAuth.tsx` : 라우트 가드. 미인증 시 toast 후 `/login`으로 리다이렉트.
  - `social-login/`
    1. `api.ts` : OAuth 시작 URL 생성, return path 저장
    2. `SocialLoginButtons.tsx` : 구글/카카오 로그인 버튼 렌더, 클릭 시 OAuth 시작

- **groups**
  1. `GroupDetailHeader.tsx` : 그룹 상세 상단 헤더(이름/상태/액션)
  2. `GroupListCard.tsx` : 그룹 리스트 카드
  3. `GroupCategoryFilter.tsx` : 카테고리 필터 UI
  4. `GroupReviewCard.tsx` : 그룹 리뷰 카드
  5. `GroupEmailJoinGroupInfo.tsx` : 이메일 초대 정보 표시
  6. `GroupEmailVerificationForm.tsx` : 이메일 인증 폼
  7. `GroupPasswordJoinForm.tsx` : 비밀번호 기반 참여 폼
  8. `OnboardingStepPanel.tsx` : 그룹 온보딩 스텝 컨테이너
  9. `OnboardingProgressDots.tsx` : 온보딩 진행 점 표시
  10. `SubgroupList.tsx` : 하위 그룹 리스트 섹션
  - `index.ts` : 주요 컴포넌트 re-export

- **subgroups**
  1. `subgroup-create-image/SubgroupImageUploader.tsx` : 소그룹 생성 시 대표 이미지 업로드
  2. `subgroup-create-password/SubgroupPasswordSection.tsx` : 소그룹 비밀번호 설정 섹션
  - 각 디렉터리의 `index.ts` 로 re-export

- **search**
  1. `SearchGroupCarousel.tsx` : 검색 결과를 캐러셀로 노출

- **upload**
  1. `useImageUpload.ts` : 공용 이미지 업로드 훅 (파일 선택, 상태, 업로드 실행)
  2. `UploadErrorModal.tsx` : 업로드 실패 안내 모달
  3. `index.ts` : 훅/컴포넌트 re-export
