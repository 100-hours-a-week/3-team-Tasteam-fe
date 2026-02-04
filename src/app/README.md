# app (앱 레이어 스냅샷, 2026-02-04)

전역 부트스트랩, Provider, 라우팅 셸을 다루는 루트 레이어입니다.

## 구성

- **bootstrap/**
  1. `bootstrap.ts` : 앱 시작 시 실행되는 초기화 함수.
  2. `useBootstrap.ts` : 부트스트랩 진행/준비 상태를 노출하는 훅(ready 플래그, 에러 등).

- **providers/**
  1. `AppProviders.tsx` : 전역 Provider 합성(예: Router, QueryClient, Theme 등).

## 역할 가이드

- 앱 전역에서 한 번만 세팅되는 것만 둔다.
- 도메인 로직은 `entities`/`features`, 페이지 UI는 `pages`, 블록 UI는 `widgets`, 공용 리소스는 `shared`로 분리한다.
