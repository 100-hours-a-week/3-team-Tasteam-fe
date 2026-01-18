# 개발 규칙 (FSD 기준)

이 문서는 Tasteam 프론트엔드의 파일/컴포넌트 분리 규칙을 정의합니다.

## FSD 레이어 개요

- `app`: 앱 부트스트랩, 라우팅, 전역 Provider
- `pages`: 라우팅 단위 화면
- `widgets`: 페이지를 구성하는 큰 UI 블록
- `features`: 사용자 시나리오/기능 단위
- `entities`: 도메인 엔티티(예: user, team)
- `shared`: 전역 공용 리소스

## 분리 기준

- 도메인 데이터 중심이면 `entities/`
- 사용자 행동 중심 기능이면 `features/`
- 여러 기능/엔티티를 조합한 큰 UI면 `widgets/`
- 라우팅 화면은 `pages/`
- 앱 진입/전역 설정은 `app/`
- 어디서나 재사용되는 공통 요소는 `shared/`

## 컴포넌트 위치 규칙

- 페이지: `src/pages/<page>/`
- 위젯: `src/widgets/<widget>/`
- 기능: `src/features/<feature>/`
- 엔티티: `src/entities/<entity>/`
- 공통: `src/shared/ui/`

## 스타일링 규칙

- 페이지/위젯/기능/엔티티의 스타일은 **CSS Modules** 사용
  - 예: `HomePage.module.css`, `BottomTabBar.module.css`
- 전역 스타일은 `src/shared/styles/global.css`
- 전역 클래스 사용은 최소화하고, 컴포넌트 단위 캡슐화를 우선

## 네이밍 규칙

- 폴더: kebab-case (예: `bottom-tab-bar`)
- 컴포넌트: PascalCase (예: `BottomTabBar.tsx`)
- 스타일: `<Component>.module.css`

## 예시

```
src/
  pages/home/
    HomePage.tsx
    HomePage.module.css
  widgets/bottom-tab-bar/
    BottomTabBar.tsx
    BottomTabBar.module.css
```
