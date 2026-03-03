#!/usr/bin/env bash
set -euo pipefail

branch_name="${1:-}"

if [[ -z "${branch_name}" ]]; then
  branch_name="$(git rev-parse --abbrev-ref HEAD 2>/dev/null || true)"
fi

if [[ -z "${branch_name}" ]]; then
  echo "❌ 브랜치 이름을 확인할 수 없습니다."
  exit 1
fi

if [[ "${branch_name}" == "HEAD" ]]; then
  echo "ℹ️ detached HEAD 상태에서는 브랜치 검사를 건너뜁니다."
  exit 0
fi

if [[ "${branch_name}" == "main" || "${branch_name}" == "develop" ]]; then
  exit 0
fi

if [[ "${branch_name}" == codex/* ]]; then
  echo "❌ 금지된 브랜치 접두사입니다: ${branch_name}"
  echo "   codex/ 접두사는 사용할 수 없습니다."
  exit 1
fi

allowed_pattern='^(feat|fix|refactor|docs|test|chore|style|perf|ci|build|revert|hotfix)/#[0-9]+/[a-z0-9][a-z0-9-]*$'

if [[ ! "${branch_name}" =~ ${allowed_pattern} ]]; then
  echo "❌ 브랜치 이름 규칙 위반: ${branch_name}"
  echo "   허용 형식: type/#이슈번호/slug"
  echo "   예시: feat/#123/home-ui-refine"
  echo "   허용 type: feat, fix, refactor, docs, test, chore, style, perf, ci, build, revert, hotfix"
  exit 1
fi

echo "✅ 브랜치 이름 규칙 통과: ${branch_name}"
