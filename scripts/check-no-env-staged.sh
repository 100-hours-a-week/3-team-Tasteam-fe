#!/usr/bin/env sh
set -eu

staged_files=$(git diff --cached --name-only --diff-filter=ACMR || true)

if [ -z "$staged_files" ]; then
  exit 0
fi

echo "$staged_files" | while IFS= read -r file; do
  [ -n "$file" ] || continue

  case "$file" in
    .env|.env.*)
      case "$file" in
        .env.example|.env.production.example)
          ;;
        *)
          echo "⛔ 민감한 파일(.env)이 스테이징되었습니다: $file"
          echo "   - .env는 커밋하지 마세요."
          echo "   - 공유가 필요하면 .env.example / .env.production.example 를 사용하세요."
          exit 1
          ;;
      esac
      ;;
  esac
done
