#!/usr/bin/env bash
# Merge upstream/release-x.61.x into saopaulo fork while preserving SP customizations.
# Usage:
#   ./bin/merge-upstream-61-preserve-sp.sh snapshot
#   ./bin/merge-upstream-61-preserve-sp.sh merge
#   ./bin/merge-upstream-61-preserve-sp.sh restore
#   ./bin/merge-upstream-61-preserve-sp.sh verify
#   ./bin/merge-upstream-61-preserve-sp.sh all   # snapshot + merge + restore (stops before dual-changed)
set -euo pipefail

script_directory="$(dirname "${BASH_SOURCE[0]}")"
cd "$script_directory/.."

SP_REF="${SP_REF:-origin/saopaulo}"
UPSTREAM_REF="${UPSTREAM_REF:-upstream/release-x.61.x}"
BASE_REF="${BASE_REF:-upstream/release-x.60.x}"
WORK_BRANCH="${WORK_BRANCH:-update_with_upstream_61}"
LIST_FILE=".merge-61-sp-files.txt"
DUAL_CHANGED_FILE=".merge-61-dual-changed.txt"
RESTORE_OURS_FILE=".merge-61-restore-ours.txt"

# Paths requiring manual 3-way merge (upstream logic + SP styling).
default_dual_changed() {
  cat <<'EOF'
frontend/src/metabase/ui/colors/constants/themes/light.ts
frontend/src/metabase/ui/colors/constants/themes/dark.ts
frontend/src/metabase/ui/colors/constants/accent-colors.ts
frontend/src/metabase/ui/colors/groups.ts
frontend/src/metabase/ui/colors/types/color-keys.ts
frontend/src/metabase/ui/colors/theme-from-color-scheme.ts
frontend/src/metabase/home/components/HomeCaption/HomeCaption.styled.tsx
frontend/src/metabase/home/components/HomeContent/HomeContent.tsx
frontend/src/metabase/home/components/HomeGreeting/HomeGreeting.module.css
frontend/src/metabase/home/components/HomeGreeting/HomeGreeting.tsx
frontend/src/metabase/home/components/HomeHelpCard/HomeHelpCard.tsx
frontend/src/metabase/home/components/HomeModelCard/HomeModelCard.styled.tsx
frontend/src/metabase/home/components/HomeXrayCard/HomeXrayCard.styled.tsx
frontend/src/metabase/home/components/HomeXraySection/HomeXraySection.styled.tsx
frontend/src/metabase/nav/components/NewItemButton/NewItemButton.styled.tsx
frontend/src/metabase/nav/components/search/SearchButton/SearchButton.module.css
frontend/src/metabase/nav/containers/MainNavbar/SidebarItems/SidebarItems.styled.tsx
frontend/src/metabase/dashboard/components/DashboardHeader/DashboardHeaderView.module.css
frontend/src/metabase/dashboard/components/DashboardHeader/DashboardHeaderView.tsx
frontend/src/metabase/dashboard/containers/AutomaticDashboardApp/AutomaticDashboardApp.module.css
frontend/src/metabase/dashboard/containers/AutomaticDashboardApp/AutomaticDashboardApp.tsx
frontend/src/metabase/public/components/EmbedFrame/EmbedFrame.tsx
frontend/src/metabase/query_builder/components/view/ViewHeader/components/AdHocQuestionLeftSide/AdHocQuestionLeftSide.tsx
frontend/src/metabase/query_builder/components/view/ViewHeader/components/SavedQuestionLeftSide/SavedQuestionLeftSide.tsx
frontend/src/metabase/visualizations/components/ChartSettings/ChartSettingColorPicker/ChartSettingColorPicker.tsx
frontend/src/metabase/visualizations/components/ChartSettings/ChartSettingSegmentsEditor/ChartSettingSegmentsEditor.tsx
Dockerfile
deps.edn
bun.lock
locales/pt-BR.po
EOF
}

default_restore_ours() {
  cat <<'EOF'
frontend/src/metabase/lib/colors/constants/sp-colors.ts
frontend/src/metabase/ui/colors/constants/sp-colors.ts
src/metabase/config/core.clj
src/metabase/version/settings.clj
EOF
}

is_dual_changed() {
  local path="$1"
  [[ -f "$DUAL_CHANGED_FILE" ]] && grep -qxF "$path" "$DUAL_CHANGED_FILE" && return 0
  return 1
}

cmd_snapshot() {
  echo "==> Snapshot: listing fork-diverged paths ($BASE_REF..$SP_REF)"
  git fetch upstream
  git fetch origin
  git diff --name-only "$BASE_REF" "$SP_REF" > "$LIST_FILE"
  default_restore_ours >> "$LIST_FILE"
  default_dual_changed >> "$LIST_FILE"
  sort -u -o "$LIST_FILE" "$LIST_FILE"
  default_dual_changed > "$DUAL_CHANGED_FILE"
  default_restore_ours > "$RESTORE_OURS_FILE"
  echo "    Wrote $(wc -l < "$LIST_FILE") paths to $LIST_FILE"
  echo "    Dual-changed allowlist: $(wc -l < "$DUAL_CHANGED_FILE") paths"
}

cmd_prepare_branch() {
  echo "==> Tag backup and create branch $WORK_BRANCH from $SP_REF"
  git tag -f saopaulo-pre-61x "$SP_REF"
  git checkout -B "$WORK_BRANCH" "$SP_REF"
}

cmd_merge() {
  cmd_prepare_branch
  echo "==> Merging $UPSTREAM_REF into $WORK_BRANCH"
  set +e
  git merge "$UPSTREAM_REF" -m "Merge upstream release-x.61.x into saopaulo fork"
  merge_status=$?
  set -e
  if [[ $merge_status -eq 0 ]]; then
    echo "    Merge completed without conflicts."
  else
    if git rev-parse -q --verify MERGE_HEAD >/dev/null; then
      echo "    Merge paused with conflicts (expected). Run: $0 restore"
    else
      echo "    Merge failed." >&2
      exit 1
    fi
  fi
}

should_restore_path() {
  local path="$1"
  is_dual_changed "$path" && return 1
  # Upstream 61.x moved match off clojure.core.match; never restore old lib.util.match from fork.
  case "$path" in
    src/metabase/lib/util/match*|test/metabase/lib/util/match*)
      return 1
      ;;
  esac
  # restore-ours list
  grep -qxF "$path" "$RESTORE_OURS_FILE" 2>/dev/null && return 0
  # binaries and assets
  case "$path" in
    *.png|*.svg|*.jpg|*.jpeg|*.gif|*.ico|*.po|*.woff|*.woff2|*.ttf|*.eot)
      return 0
      ;;
    resources/*)
      return 0
      ;;
    frontend/src/metabase/css/*)
      return 0
      ;;
  esac
  # in fork list and not dual-changed
  grep -qxF "$path" "$LIST_FILE" 2>/dev/null && return 0
  return 1
}

cmd_restore() {
  [[ -f "$LIST_FILE" ]] || cmd_snapshot
  [[ -f "$DUAL_CHANGED_FILE" ]] || default_dual_changed > "$DUAL_CHANGED_FILE"
  [[ -f "$RESTORE_OURS_FILE" ]] || default_restore_ours > "$RESTORE_OURS_FILE"

  echo "==> Auto-restore fork files from $SP_REF"
  restored=0
  skipped_dual=0
  while IFS= read -r path || [[ -n "$path" ]]; do
    [[ -z "$path" ]] && continue
    if is_dual_changed "$path"; then
      skipped_dual=$((skipped_dual + 1))
      continue
    fi
    if ! should_restore_path "$path"; then
      continue
    fi
    if ! git cat-file -e "$SP_REF:$path" 2>/dev/null; then
      continue
    fi
    if git cat-file -e "$path" 2>/dev/null || git cat-file -e "$SP_REF:$path" 2>/dev/null; then
      git checkout "$SP_REF" -- "$path" 2>/dev/null || true
      restored=$((restored + 1))
    fi
  done < "$LIST_FILE"

  # Explicit globs for login images and logos
  for pattern in \
    'resources/frontend_client/app/assets/img/logo-sp*' \
    'resources/frontend_client/app/img/login_*' \
    'resources/frontend_client/app/img/*illustration*' \
    'resources/frontend_client/app/dist/*' ; do
    while IFS= read -r path; do
      [[ -z "$path" ]] && continue
      is_dual_changed "$path" && continue
      git checkout "$SP_REF" -- "$path" 2>/dev/null && restored=$((restored + 1)) || true
    done < <(git ls-tree -r --name-only "$SP_REF" -- "$pattern" 2>/dev/null || true)
  done

  # Resolve remaining unmerged: prefer SP snapshot for non-dual paths
  while IFS= read -r path; do
    [[ -z "$path" ]] && continue
    is_dual_changed "$path" && continue
    if git cat-file -e "$SP_REF:$path" 2>/dev/null; then
      git checkout "$SP_REF" -- "$path" 2>/dev/null || true
      git add -- "$path" 2>/dev/null || true
    fi
  done < <(git diff --name-only --diff-filter=U 2>/dev/null || true)

  git add -A 2>/dev/null || true
  echo "    Restored ~$restored paths; skipped $skipped_dual dual-changed paths"
  remaining=$(git diff --name-only --diff-filter=U 2>/dev/null | wc -l)
  echo "    Unmerged files remaining: $remaining"
}

protected_files=(
  frontend/src/metabase/ui/colors/constants/sp-colors.ts
  frontend/src/metabase/lib/colors/constants/sp-colors.ts
  resources/frontend_client/app/assets/img/logo-sp-gov.png
  resources/frontend_client/app/assets/img/logo-sp-gov.svg
  src/metabase/config/core.clj
  src/metabase/version/settings.clj
)

cmd_verify() {
  echo "==> Verify: protected files match $SP_REF"
  local failed=0
  for path in "${protected_files[@]}"; do
    if ! git cat-file -e "$path" 2>/dev/null; then
      echo "    MISSING: $path"
      failed=1
      continue
    fi
    if ! git diff --quiet "$SP_REF" -- "$path" 2>/dev/null; then
      echo "    DRIFT (protected): $path"
      git diff --stat "$SP_REF" -- "$path" | tail -1
      failed=1
    fi
  done

  echo "==> Verify: non-dual paths from list match $SP_REF"
  local drift=0
  while IFS= read -r path || [[ -n "$path" ]]; do
    [[ -z "$path" ]] && continue
    is_dual_changed "$path" && continue
    git cat-file -e "$path" 2>/dev/null || continue
    git cat-file -e "$SP_REF:$path" 2>/dev/null || continue
    if ! git diff --quiet "$SP_REF" -- "$path" 2>/dev/null; then
      # only flag if path was in fork diff vs base
      if git diff --quiet "$BASE_REF" "$SP_REF" -- "$path" 2>/dev/null; then
        continue
      fi
      echo "    DRIFT: $path"
      drift=$((drift + 1))
    fi
  done < "$LIST_FILE"
  if [[ $drift -gt 0 ]]; then
    echo "    $drift non-dual files differ from $SP_REF (may need restore or add to dual-changed)"
    failed=1
  fi

  if git diff --name-only --diff-filter=U 2>/dev/null | grep -q .; then
    echo "==> Unmerged conflicts still present:"
    git diff --name-only --diff-filter=U
    failed=1
  fi

  if grep -r '^<<<<<<< ' --include='*' . 2>/dev/null | head -5 | grep -q .; then
    echo "==> Conflict markers found in working tree"
    failed=1
  fi

  if [[ $failed -ne 0 ]]; then
    echo "VERIFY FAILED"
    exit 1
  fi
  echo "VERIFY OK"
}

cmd_status() {
  echo "Branch: $(git branch --show-current)"
  echo "Merge in progress: $(git rev-parse -q --verify MERGE_HEAD >/dev/null && echo yes || echo no)"
  echo "Unmerged: $(git diff --name-only --diff-filter=U 2>/dev/null | wc -l)"
}

usage() {
  cat <<EOF
Usage: $0 <command>

Commands:
  snapshot   Build file lists from fork diff
  merge      Create $WORK_BRANCH and merge $UPSTREAM_REF
  restore    Restore SP files from $SP_REF (skip dual-changed)
  verify     Fail if protected / non-dual files drift from $SP_REF
  all        snapshot + merge + restore
  status     Show merge state
EOF
}

main() {
  local cmd="${1:-all}"
  case "$cmd" in
    snapshot) cmd_snapshot ;;
    merge) cmd_snapshot; cmd_merge ;;
    restore) cmd_restore ;;
    verify) cmd_verify ;;
    all) cmd_snapshot; cmd_merge; cmd_restore; cmd_status ;;
    status) cmd_status ;;
    -h|--help|help) usage ;;
    *)
      echo "Unknown command: $cmd" >&2
      usage
      exit 1
      ;;
  esac
}

main "$@"
