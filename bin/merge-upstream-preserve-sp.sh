#!/usr/bin/env bash
# Merge an upstream Metabase release into the SP fork while preserving customizations.
#
# EDD-1356 — generalizes bin/merge-upstream-61-preserve-sp.sh
#
# Typical flow for EDD-1355 (upgrade to 63.x):
#   export UPSTREAM_REF=upstream/release-x.63.x   # or tag v0.63.18
#   export BASE_REF=upstream/release-x.60.x
#   export WORK_BRANCH=EDD-1355
#   ./bin/merge-upstream-preserve-sp.sh snapshot
#   ./bin/merge-upstream-preserve-sp.sh merge
#   ./bin/merge-upstream-preserve-sp.sh restore
#   ./bin/merge-upstream-preserve-sp.sh report
#   # resolve dual-changed + behavior-manual manually
#   ./bin/merge-upstream-preserve-sp.sh verify
#
# See docs/internal/atualizacao-metabase-sp/runbook-atualizacao.md
set -euo pipefail

script_directory="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
repo_root="$(cd "$script_directory/.." && pwd)"
cd "$repo_root"

SP_REF="${SP_REF:-origin/saopaulo}"
UPSTREAM_REF="${UPSTREAM_REF:-upstream/release-x.63.x}"
BASE_REF="${BASE_REF:-upstream/release-x.60.x}"
WORK_BRANCH="${WORK_BRANCH:-update_with_upstream}"
BACKUP_TAG="${BACKUP_TAG:-saopaulo-pre-upstream-merge}"

LISTS_DIR="${LISTS_DIR:-docs/internal/atualizacao-metabase-sp/lists}"
WORK_DIR="${WORK_DIR:-.merge-sp}"
LIST_FILE="${LIST_FILE:-$WORK_DIR/sp-files.txt}"
DUAL_CHANGED_FILE="${DUAL_CHANGED_FILE:-$WORK_DIR/dual-changed.txt}"
RESTORE_OURS_FILE="${RESTORE_OURS_FILE:-$WORK_DIR/restore-ours.txt}"
BEHAVIOR_FILE="${BEHAVIOR_FILE:-$WORK_DIR/behavior-manual.txt}"
REPORT_FILE="${REPORT_FILE:-$WORK_DIR/manual-report.md}"

CANON_RESTORE="$LISTS_DIR/restore-ours.txt"
CANON_DUAL="$LISTS_DIR/dual-changed.txt"
CANON_BEHAVIOR="$LISTS_DIR/behavior-manual.txt"

mkdir -p "$WORK_DIR"

strip_comments() {
  # drop blank lines and # comments
  sed -e 's/#.*$//' -e '/^[[:space:]]*$/d' "$1"
}

load_or_copy_list() {
  local canon="$1"
  local dest="$2"
  if [[ -f "$canon" ]]; then
    strip_comments "$canon" | sort -u > "$dest"
  elif [[ -f "$dest" ]]; then
    sort -u -o "$dest" "$dest"
  else
    echo "Missing list: $canon (and no working copy at $dest)" >&2
    exit 1
  fi
}

is_listed() {
  local path="$1"
  local file="$2"
  [[ -f "$file" ]] && grep -qxF "$path" "$file"
}

is_dual_changed() {
  is_listed "$1" "$DUAL_CHANGED_FILE"
}

is_behavior() {
  is_listed "$1" "$BEHAVIOR_FILE"
}

is_manual() {
  is_dual_changed "$1" || is_behavior "$1"
}

ensure_remote_ref() {
  local ref="$1"
  if ! git rev-parse -q --verify "$ref" >/dev/null; then
    echo "Ref not found: $ref" >&2
    echo "Hint: git fetch upstream && git fetch --deepen=2000 upstream <branch> if shallow clone." >&2
    exit 1
  fi
}

cmd_snapshot() {
  echo "==> Snapshot: fork-diverged paths ($BASE_REF...$SP_REF)"
  ensure_remote_ref "$BASE_REF"
  ensure_remote_ref "$SP_REF"

  # Full `git fetch upstream` is slow on shallow clones; opt-in via FETCH_REMOTES=1.
  if [[ "${FETCH_REMOTES:-0}" == "1" ]]; then
    if git remote get-url upstream >/dev/null 2>&1; then
      echo "    Fetching upstream (FETCH_REMOTES=1)…"
      git fetch upstream || true
    else
      echo "    WARNING: remote 'upstream' missing. Add: git remote add upstream https://github.com/metabase/metabase.git" >&2
    fi
    git fetch origin || true
  else
    if ! git remote get-url upstream >/dev/null 2>&1; then
      echo "    WARNING: remote 'upstream' missing. Add: git remote add upstream https://github.com/metabase/metabase.git" >&2
    fi
  fi

  load_or_copy_list "$CANON_RESTORE" "$RESTORE_OURS_FILE"
  load_or_copy_list "$CANON_DUAL" "$DUAL_CHANGED_FILE"
  load_or_copy_list "$CANON_BEHAVIOR" "$BEHAVIOR_FILE"

  # Prefer three-dot (changes on SP since merge-base). Fall back to two-dot if no merge-base.
  set +e
  git merge-base "$BASE_REF" "$SP_REF" >/dev/null 2>&1
  local mb_status=$?
  set -e
  if [[ $mb_status -eq 0 ]]; then
    git diff --name-only "$BASE_REF...$SP_REF" > "$LIST_FILE"
  else
    echo "    WARNING: no merge-base between $BASE_REF and $SP_REF; using two-dot diff." >&2
    git diff --name-only "$BASE_REF" "$SP_REF" > "$LIST_FILE"
  fi

  cat "$RESTORE_OURS_FILE" "$DUAL_CHANGED_FILE" "$BEHAVIOR_FILE" >> "$LIST_FILE"
  sort -u -o "$LIST_FILE" "$LIST_FILE"

  echo "    Wrote $(wc -l < "$LIST_FILE") paths → $LIST_FILE"
  echo "    restore-ours:     $(wc -l < "$RESTORE_OURS_FILE")"
  echo "    dual-changed:     $(wc -l < "$DUAL_CHANGED_FILE")"
  echo "    behavior-manual:  $(wc -l < "$BEHAVIOR_FILE")"
}

cmd_prepare_branch() {
  echo "==> Backup tag $BACKUP_TAG → $SP_REF ; checkout -B $WORK_BRANCH"
  ensure_remote_ref "$SP_REF"
  git tag -f "$BACKUP_TAG" "$SP_REF"
  git checkout -B "$WORK_BRANCH" "$SP_REF"
}

cmd_merge() {
  cmd_prepare_branch
  ensure_remote_ref "$UPSTREAM_REF"
  echo "==> Merging $UPSTREAM_REF into $WORK_BRANCH"
  set +e
  git merge "$UPSTREAM_REF" -m "Merge ${UPSTREAM_REF} into SP fork (preserve customizations)"
  local merge_status=$?
  set -e
  if [[ $merge_status -eq 0 ]]; then
    echo "    Merge completed without conflicts."
  else
    if git rev-parse -q --verify MERGE_HEAD >/dev/null; then
      echo "    Merge paused with conflicts (expected). Next: $0 restore && $0 report"
    else
      echo "    Merge failed." >&2
      exit 1
    fi
  fi
}

should_restore_path() {
  local path="$1"
  is_manual "$path" && return 1

  # Never restore known upstream-migration leftovers from older forks (61.x lesson).
  case "$path" in
    src/metabase/lib/util/match*|test/metabase/lib/util/match*)
      return 1
      ;;
    src/metabase/lib/native.cljc|src/metabase/lib/parameters/parse.cljc)
      return 1
      ;;
  esac

  is_listed "$path" "$RESTORE_OURS_FILE" && return 0

  case "$path" in
    *.png|*.svg|*.jpg|*.jpeg|*.gif|*.ico|*.woff|*.woff2|*.ttf|*.eot)
      return 0
      ;;
    docs/internal/*)
      return 0
      ;;
    resources/frontend_client/app/assets/img/logo-sp*)
      return 0
      ;;
    frontend/src/metabase/css/core/fonts.saopaulo*)
      return 0
      ;;
  esac

  # Other fork-diverged paths: restore SP (legacy 61 behavior) unless manual.
  is_listed "$path" "$LIST_FILE" && return 0
  return 1
}

cmd_restore() {
  [[ -f "$LIST_FILE" ]] || cmd_snapshot
  load_or_copy_list "$CANON_RESTORE" "$RESTORE_OURS_FILE"
  load_or_copy_list "$CANON_DUAL" "$DUAL_CHANGED_FILE"
  load_or_copy_list "$CANON_BEHAVIOR" "$BEHAVIOR_FILE"

  echo "==> Auto-restore from $SP_REF (skip dual-changed + behavior-manual)"
  local restored=0 skipped_manual=0

  while IFS= read -r path || [[ -n "$path" ]]; do
    [[ -z "$path" ]] && continue
    if is_manual "$path"; then
      skipped_manual=$((skipped_manual + 1))
      continue
    fi
    should_restore_path "$path" || continue
    git cat-file -e "$SP_REF:$path" 2>/dev/null || continue
    if git checkout "$SP_REF" -- "$path" 2>/dev/null; then
      restored=$((restored + 1))
    fi
  done < "$LIST_FILE"

  for pattern in \
    'resources/frontend_client/app/assets/img/logo-sp*' \
    'resources/frontend_client/app/img/login_*' \
    'docs/internal/**'; do
    while IFS= read -r path; do
      [[ -z "$path" ]] && continue
      is_manual "$path" && continue
      if git checkout "$SP_REF" -- "$path" 2>/dev/null; then
        restored=$((restored + 1))
      fi
    done < <(git ls-tree -r --name-only "$SP_REF" -- "$pattern" 2>/dev/null || true)
  done

  # Unmerged non-manual → prefer SP
  while IFS= read -r path; do
    [[ -z "$path" ]] && continue
    is_manual "$path" && continue
    if git cat-file -e "$SP_REF:$path" 2>/dev/null; then
      git checkout "$SP_REF" -- "$path" 2>/dev/null || true
      git add -- "$path" 2>/dev/null || true
    fi
  done < <(git diff --name-only --diff-filter=U 2>/dev/null || true)

  # Do not `git add -A` — that can stage unresolved dual/behavior files that
  # still contain conflict markers. Only paths restored above were staged.
  echo "    Restored ~$restored paths; skipped $skipped_manual manual paths"
  echo "    Unmerged remaining: $(git diff --name-only --diff-filter=U 2>/dev/null | wc -l)"
}

cmd_report() {
  load_or_copy_list "$CANON_RESTORE" "$RESTORE_OURS_FILE"
  load_or_copy_list "$CANON_DUAL" "$DUAL_CHANGED_FILE"
  load_or_copy_list "$CANON_BEHAVIOR" "$BEHAVIOR_FILE"

  echo "==> Writing manual intervention report → $REPORT_FILE"
  {
    echo "# Relatório de intervenção manual — merge SP"
    echo
    echo "Gerado em: $(date -u +%Y-%m-%dT%H:%MZ)"
    echo
    echo "- Branch: \`$(git branch --show-current)\`"
    echo "- SP_REF: \`$SP_REF\`"
    echo "- UPSTREAM_REF: \`$UPSTREAM_REF\`"
    echo "- BASE_REF: \`$BASE_REF\`"
    echo "- Merge in progress: $(git rev-parse -q --verify MERGE_HEAD >/dev/null && echo yes || echo no)"
    echo

    echo "## Unmerged (git conflicts)"
    echo
    local unmerged
    unmerged="$(git diff --name-only --diff-filter=U 2>/dev/null || true)"
    if [[ -z "$unmerged" ]]; then
      echo "_Nenhum conflito unmerged no índice._"
    else
      echo '```'
      echo "$unmerged"
      echo '```'
    fi
    echo

    echo "## Dual-changed (adapters — merge 3-way)"
    echo
    echo '```'
    cat "$DUAL_CHANGED_FILE"
    echo '```'
    echo

    echo "## Behavior-manual (features SP — reaplicar/adaptar)"
    echo
    echo '```'
    cat "$BEHAVIOR_FILE"
    echo '```'
    echo

    echo "## Dual-changed currently conflicting"
    echo
    echo '```'
    while IFS= read -r path; do
      [[ -z "$path" ]] && continue
      is_dual_changed "$path" && echo "$path"
    done < <(git diff --name-only --diff-filter=U 2>/dev/null || true)
    echo '```'
    echo

    echo "## Behavior-manual currently conflicting"
    echo
    echo '```'
    while IFS= read -r path; do
      [[ -z "$path" ]] && continue
      is_behavior "$path" && echo "$path"
    done < <(git diff --name-only --diff-filter=U 2>/dev/null || true)
    echo '```'
    echo

    echo "## Próximos passos"
    echo
    echo "1. Resolver adapters (\`dual-changed\`) preservando lógica upstream + estilo/tokens SP."
    echo "2. Reaplicar patches de \`behavior-manual\` sobre a API/estrutura da nova versão."
    echo "3. Rodar \`$0 verify\`."
    echo "4. Validar fluxos Trilhas (login, home, dashboards, charts, datagrid)."
    echo "5. Registrar conflitos reais no manifesto (entrada EDD-1362 / 1356 v2)."
  } > "$REPORT_FILE"

  echo "    Done. Open $REPORT_FILE"
}

cmd_verify() {
  load_or_copy_list "$CANON_RESTORE" "$RESTORE_OURS_FILE"
  load_or_copy_list "$CANON_DUAL" "$DUAL_CHANGED_FILE"
  [[ -f "$LIST_FILE" ]] || cmd_snapshot

  echo "==> Verify: restore-ours files match $SP_REF (when present on both sides)"
  local failed=0
  while IFS= read -r path || [[ -n "$path" ]]; do
    [[ -z "$path" ]] && continue
    if ! git cat-file -e "$SP_REF:$path" 2>/dev/null; then
      continue
    fi
    if [[ ! -e "$path" ]]; then
      echo "    MISSING: $path"
      failed=1
      continue
    fi
    if ! git diff --quiet "$SP_REF" -- "$path" 2>/dev/null; then
      echo "    DRIFT (restore-ours): $path"
      failed=1
    fi
  done < "$RESTORE_OURS_FILE"

  if git diff --name-only --diff-filter=U 2>/dev/null | grep -q .; then
    echo "==> Unmerged conflicts still present:"
    git diff --name-only --diff-filter=U
    failed=1
  fi

  if [[ $failed -ne 0 ]]; then
    echo "VERIFY FAILED"
    exit 1
  fi
  echo "VERIFY OK (restore-ours intact; no unmerged conflicts)"
}

cmd_status() {
  echo "Branch: $(git branch --show-current)"
  echo "SP_REF=$SP_REF"
  echo "UPSTREAM_REF=$UPSTREAM_REF"
  echo "BASE_REF=$BASE_REF"
  echo "WORK_BRANCH=$WORK_BRANCH"
  echo "Merge in progress: $(git rev-parse -q --verify MERGE_HEAD >/dev/null && echo yes || echo no)"
  echo "Unmerged: $(git diff --name-only --diff-filter=U 2>/dev/null | wc -l)"
  echo "Work dir: $WORK_DIR"
}

usage() {
  cat <<EOF
Usage: $0 <command>

Commands:
  snapshot   Build working lists from fork diff + canonical lists
  merge      Tag backup, create WORK_BRANCH from SP_REF, merge UPSTREAM_REF
  restore    Restore SP-owned / safe paths from SP_REF (skip manual lists)
  report     Write $REPORT_FILE with conflicts + manual queues
  verify     Check restore-ours drift and remaining unmerged conflicts
  status     Show env + merge state
  all        snapshot + merge + restore + report + status

Environment (defaults in parentheses):
  SP_REF          ($SP_REF)
  UPSTREAM_REF    ($UPSTREAM_REF)
  BASE_REF        ($BASE_REF)
  WORK_BRANCH     ($WORK_BRANCH)
  BACKUP_TAG      ($BACKUP_TAG)
  LISTS_DIR       ($LISTS_DIR)
  FETCH_REMOTES   (0) set to 1 to git fetch origin/upstream during snapshot
EOF
}

main() {
  local cmd="${1:-help}"
  case "$cmd" in
    snapshot) cmd_snapshot ;;
    merge) cmd_snapshot; cmd_merge ;;
    restore) cmd_restore ;;
    report) cmd_report ;;
    verify) cmd_verify ;;
    status) cmd_status ;;
    all) cmd_snapshot; cmd_merge; cmd_restore; cmd_report; cmd_status ;;
    -h|--help|help) usage ;;
    *)
      echo "Unknown command: $cmd" >&2
      usage
      exit 1
      ;;
  esac
}

main "$@"
