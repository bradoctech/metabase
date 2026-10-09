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
#   ./bin/merge-upstream-preserve-sp.sh scan            # v2: stale / orphan / missing / hybrid vs UPSTREAM_REF
#   ./bin/merge-upstream-preserve-sp.sh scan --apply    # restore stale+missing from upstream, delete orphans
#   ./bin/merge-upstream-preserve-sp.sh verify
#   ./bin/merge-upstream-preserve-sp.sh build-check     # v2: production build checks (dev passing != build passing)
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
CANON_EXTRA="$LISTS_DIR/sp-extra.txt"
SP_EXTRA_FILE="${SP_EXTRA_FILE:-$WORK_DIR/sp-extra.txt}"

# Pre-merge tip of the fork (content that may get "stuck" after the merge).
PRE_MERGE_REF="${PRE_MERGE_REF:-$BACKUP_TAG}"
# Extra snapshots of earlier steps (stale content can come from any previous major).
STALE_REFS="${STALE_REFS:-$(git tag -l 'saopaulo-pre-*' 2>/dev/null | tr '\n' ' ')}"
# Unmerged non-curated paths during `restore`: upstream (default, v2) or sp (MVP behavior).
UNMERGED_POLICY="${UNMERGED_POLICY:-upstream}"

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

SP_EXTRA_PATTERNS=()
load_sp_extra() {
  if [[ -f "$CANON_EXTRA" ]]; then
    strip_comments "$CANON_EXTRA" | sed 's/[[:space:]]*$//' | sort -u > "$SP_EXTRA_FILE"
  else
    : > "$SP_EXTRA_FILE"
  fi
  mapfile -t SP_EXTRA_PATTERNS < "$SP_EXTRA_FILE"
}

is_sp_extra() {
  local path="$1" pattern
  for pattern in "${SP_EXTRA_PATTERNS[@]}"; do
    # shellcheck disable=SC2053
    [[ "$path" == $pattern ]] && return 0
  done
  return 1
}

# Curated SP: the 3 buckets + sp-extra. Never "SP" because an EDD-* commit touched it:
# upgrade commits (EDD-1355…) touch upstream files and carry the previous major's content.
is_protected() {
  is_listed "$1" "$RESTORE_OURS_FILE" || is_manual "$1" || is_sp_extra "$1"
}

load_all_lists() {
  load_or_copy_list "$CANON_RESTORE" "$RESTORE_OURS_FILE"
  load_or_copy_list "$CANON_DUAL" "$DUAL_CHANGED_FILE"
  load_or_copy_list "$CANON_BEHAVIOR" "$BEHAVIOR_FILE"
  load_sp_extra
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
    # Brand assets only. Images elsewhere (docs/, .loki/) are upstream's: restoring them from
    # SP reverted docs screenshots and visual-test baselines (63 lesson).
    resources/frontend_client/*.png|resources/frontend_client/*.svg|resources/frontend_client/*.jpg|\
    resources/frontend_client/*.jpeg|resources/frontend_client/*.gif|resources/frontend_client/*.ico|\
    resources/frontend_client/*.woff|resources/frontend_client/*.woff2|resources/frontend_client/*.ttf|\
    resources/frontend_client/*.eot)
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

  # Do NOT restore every BASE…SP drifted path. That reverts legitimate upstream
  # upgrades (61.x: honey_sql_2/typed? private broke honeysql_guard boot).
  # Only curated restore-ours + safe asset/docs patterns above.
  return 1
}

cmd_restore() {
  [[ -f "$LIST_FILE" ]] || cmd_snapshot
  load_all_lists

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

  # Unmerged non-manual: SP-owned → SP; everything else → upstream (v2). Taking SP for any
  # conflict (MVP) left the previous major's content stuck in upstream files.
  local unmerged_log="$WORK_DIR/unmerged-resolved.txt"
  : > "$unmerged_log"
  while IFS= read -r path; do
    [[ -z "$path" ]] && continue
    is_manual "$path" && continue
    local source_ref="$UPSTREAM_REF"
    if [[ "$UNMERGED_POLICY" == "sp" ]] || is_listed "$path" "$RESTORE_OURS_FILE" || is_sp_extra "$path"; then
      source_ref="$SP_REF"
    fi
    if git cat-file -e "$source_ref:$path" 2>/dev/null; then
      git checkout "$source_ref" -- "$path" 2>/dev/null || true
      git add -- "$path" 2>/dev/null || true
    else
      git rm -q --cached -- "$path" 2>/dev/null || true
      rm -f -- "$path"
    fi
    echo "$source_ref	$path" >> "$unmerged_log"
  done < <(git diff --name-only --diff-filter=U 2>/dev/null || true)
  echo "    Unmerged resolved automatically: $(wc -l < "$unmerged_log") (see $unmerged_log)"

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

# --- v2: post-merge scan ----------------------------------------------------------------------
# Compares the working tree with UPSTREAM_REF and classifies every non-protected difference:
#   stale   – content equals the pre-merge tip or an earlier step snapshot → restore from upstream
#   missing – exists upstream, missing locally                               → restore from upstream
#   orphan  – exists locally, deleted upstream                                → delete
#   hybrid  – differs from upstream and from every snapshot (3-way mix or     → review by hand
#             post-merge fix); add to the lists if it is SP, else restore
SCAN_STALE="$WORK_DIR/scan-stale.txt"
SCAN_MISSING="$WORK_DIR/scan-missing.txt"
SCAN_ORPHANS="$WORK_DIR/scan-orphans.txt"
SCAN_HYBRID="$WORK_DIR/scan-hybrid.txt"
SCAN_REPORT="$WORK_DIR/scan-report.md"

cmd_scan() {
  local apply=0
  [[ "${1:-}" == "--apply" || "${SCAN_APPLY:-0}" == "1" ]] && apply=1
  ensure_remote_ref "$UPSTREAM_REF"
  load_all_lists

  local refs=()
  local ref
  for ref in $PRE_MERGE_REF $STALE_REFS; do
    git rev-parse -q --verify "$ref^{commit}" >/dev/null 2>&1 && refs+=("$ref")
  done
  # dedupe, keep order
  mapfile -t refs < <(printf '%s\n' "${refs[@]}" | awk '!seen[$0]++')

  echo "==> Scan: working tree vs $UPSTREAM_REF (snapshots: ${refs[*]:-none})"
  : > "$SCAN_STALE"; : > "$SCAN_MISSING"; : > "$SCAN_ORPHANS"; : > "$SCAN_HYBRID"
  local protected=0 status path wt_hash stale_ref

  while IFS=$'\t' read -r status path; do
    [[ -z "$path" ]] && continue
    if is_protected "$path"; then
      protected=$((protected + 1))
      continue
    fi
    case "$status" in
      A) echo "$path" >> "$SCAN_ORPHANS" ;;
      D) echo "$path" >> "$SCAN_MISSING" ;;
      *)
        wt_hash="$(git hash-object -- "$path" 2>/dev/null || true)"
        stale_ref=""
        for ref in "${refs[@]}"; do
          if [[ -n "$wt_hash" && "$wt_hash" == "$(git rev-parse -q --verify "$ref:$path" 2>/dev/null)" ]]; then
            stale_ref="$ref"
            break
          fi
        done
        if [[ -n "$stale_ref" ]]; then
          printf '%s\t%s\n' "$path" "$stale_ref" >> "$SCAN_STALE"
        else
          echo "$path" >> "$SCAN_HYBRID"
        fi
        ;;
    esac
  done < <(git diff --no-renames --name-status "$UPSTREAM_REF" -- . ":(exclude)$WORK_DIR")

  local n_stale n_missing n_orphans n_hybrid
  n_stale=$(wc -l < "$SCAN_STALE"); n_missing=$(wc -l < "$SCAN_MISSING")
  n_orphans=$(wc -l < "$SCAN_ORPHANS"); n_hybrid=$(wc -l < "$SCAN_HYBRID")

  local trio
  trio="$(git diff --name-only "$UPSTREAM_REF" -- package.json bun.lock patches/ 2>/dev/null || true)"

  {
    echo "# Scan pós-merge — $(git branch --show-current)"
    echo
    echo "Gerado em: $(date -u +%Y-%m-%dT%H:%MZ) · UPSTREAM_REF=\`$UPSTREAM_REF\` · snapshots: \`${refs[*]:-none}\`"
    echo
    echo "| Categoria | Qtde | Ação |"
    echo "| --- | --- | --- |"
    echo "| stale | $n_stale | restaurar do upstream (\`scan --apply\`) |"
    echo "| missing | $n_missing | restaurar do upstream (\`scan --apply\`) |"
    echo "| orphan | $n_orphans | apagar (\`scan --apply\`) |"
    echo "| hybrid | $n_hybrid | revisar: SP → adicionar às listas; senão restaurar do upstream |"
    echo "| protegidos (listas + sp-extra) | $protected | ignorados |"
    echo
    if [[ -n "$trio" ]]; then
      echo "## ⚠ Trio FE diferente do upstream (package.json + bun.lock + patches/ devem andar juntos)"
      echo; echo '```'; echo "$trio"; echo '```'; echo
    fi
    local section file
    for section in stale missing orphans hybrid; do
      file="$WORK_DIR/scan-$section.txt"
      echo "## $section"
      echo; echo '```'; cat "$file"; echo '```'; echo
    done
  } > "$SCAN_REPORT"

  echo "    stale=$n_stale missing=$n_missing orphan=$n_orphans hybrid=$n_hybrid protected=$protected"
  [[ -n "$trio" ]] && echo "    WARNING: package.json/bun.lock/patches differ from upstream: $(echo "$trio" | tr '\n' ' ')"
  echo "    Report → $SCAN_REPORT"

  if [[ $apply -eq 1 ]]; then
    echo "==> Applying: restore stale+missing from $UPSTREAM_REF, delete orphans"
    { cut -f1 "$SCAN_STALE"; cat "$SCAN_MISSING"; } | sed '/^$/d' \
      | xargs -r -d '\n' git checkout "$UPSTREAM_REF" --
    sed '/^$/d' "$SCAN_ORPHANS" | xargs -r -d '\n' git rm -q -f --
    if [[ "${APPLY_HYBRID:-0}" == "1" ]]; then
      echo "    APPLY_HYBRID=1: restoring hybrids from $UPSTREAM_REF too"
      sed '/^$/d' "$SCAN_HYBRID" | xargs -r -d '\n' git checkout "$UPSTREAM_REF" --
    fi
    echo "    Done. Re-run '$0 scan' to confirm; hybrids still need review."
  fi
}

# --- v2: production build checks ------------------------------------------------------------
# The dev run (`--hot` + rspack serve) only loads what the app touches, never compiles drivers,
# and treats broken imports as warnings. `bin/build.sh` compiles everything and fails.
BUILD_CHECK_STEPS="${BUILD_CHECK_STEPS:-backend static-viz frontend}"

write_load_all_script() {
  cat > "$WORK_DIR/load-all.clj" <<'EOF'
(require '[clojure.java.io :as io])

(defn- ns-of [^java.io.File f]
  (try
    (with-open [r (java.io.PushbackReader. (io/reader f))]
      (let [form (read {:eof nil :read-cond :allow :features #{:clj}} r)]
        (when (and (seq? form) (= 'ns (first form)))
          (second form))))
    (catch Throwable _ nil)))

(def dirs
  (concat ["src" "enterprise/backend/src"]
          (for [d (.listFiles (io/file "modules/drivers"))
                :let [s (io/file d "src")]
                :when (.isDirectory s)]
            (str s))))

(def nss
  (->> dirs
       (mapcat #(file-seq (io/file %)))
       (filter #(re-find #"\.cljc?$" (.getName ^java.io.File %)))
       (keep ns-of)
       distinct
       sort))

(def failed
  (atom 0))

(doseq [n nss]
  (try
    (require n)
    (catch Throwable e
      (swap! failed inc)
      (println "FAIL" n "::" (.getMessage e) "::" (some-> (.getCause e) .getMessage)))))

(println "DONE" (count nss) "namespaces," @failed "failed")
(shutdown-agents)
(System/exit (if (pos? @failed) 1 0))
EOF
}

cmd_build_check() {
  local failed=0 step log
  for step in $BUILD_CHECK_STEPS; do
    log="$WORK_DIR/build-check-$step.log"
    case "$step" in
      backend)
        echo "==> build-check backend: require every src/EE/driver namespace (-M:drivers:ee) → $log"
        write_load_all_script
        if clojure -M:drivers:ee "$WORK_DIR/load-all.clj" > "$log" 2>&1; then
          grep -E '^DONE' "$log" | sed 's/^/    /'
        else
          failed=1
          grep -E '^(FAIL|DONE)' "$log" | cut -c1-300 | sed 's/^/    /'
        fi
        ;;
      static-viz)
        echo "==> build-check static-viz (also compiles CLJS) → $log"
        if NODE_OPTIONS="${NODE_OPTIONS:---max-old-space-size=3072}" RSPACK_WORKER_THREADS=1 \
           bun run build-static-viz > "$log" 2>&1 && ! grep -q '^ERROR in' "$log"; then
          echo "    OK"
        else
          failed=1
          grep -E '^ERROR in|×' "$log" | head -20 | cut -c1-300 | sed 's/^/    /'
        fi
        ;;
      frontend)
        echo "==> build-check frontend: production bundle, MB_EDITION=${MB_EDITION:-ee} → $log"
        if MB_EDITION="${MB_EDITION:-ee}" WEBPACK_BUNDLE=production \
           NODE_OPTIONS="${NODE_OPTIONS:---max-old-space-size=4096}" RSPACK_WORKER_THREADS=1 \
           bun run build-release:js > "$log" 2>&1 && ! grep -q '^ERROR in' "$log"; then
          echo "    OK"
        else
          failed=1
          grep -E '^ERROR in|×' "$log" | head -20 | cut -c1-300 | sed 's/^/    /'
        fi
        ;;
      *)
        echo "Unknown build-check step: $step (valid: backend static-viz frontend)" >&2
        exit 1
        ;;
    esac
  done
  if [[ $failed -ne 0 ]]; then
    echo "BUILD-CHECK FAILED (logs in $WORK_DIR/build-check-*.log)"
    exit 1
  fi
  echo "BUILD-CHECK OK"
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

  if [[ "${VERIFY_SCAN:-1}" == "1" ]]; then
    cmd_scan
    if [[ -s "$SCAN_STALE" || -s "$SCAN_MISSING" || -s "$SCAN_ORPHANS" ]]; then
      echo "==> stale/missing/orphan paths found — run '$0 scan --apply' (see $SCAN_REPORT)"
      failed=1
    fi
    [[ -s "$SCAN_HYBRID" ]] && echo "    NOTE: $(wc -l < "$SCAN_HYBRID") hybrid paths to review (not a failure)"
  fi

  if [[ $failed -ne 0 ]]; then
    echo "VERIFY FAILED"
    exit 1
  fi
  echo "VERIFY OK (restore-ours intact; no unmerged conflicts; no stale/missing/orphan paths)"
  echo "Next: '$0 build-check' (production build) and the canonical smoke test."
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
  restore    Restore SP-owned / safe paths from SP_REF (skip manual lists);
             unmerged non-curated paths are resolved from UPSTREAM_REF
  report     Write $REPORT_FILE with conflicts + manual queues
  scan       Classify non-protected diffs vs UPSTREAM_REF (stale/missing/orphan/hybrid)
             → $SCAN_REPORT ; 'scan --apply' fixes stale/missing/orphan
  verify     restore-ours drift + unmerged conflicts + scan (fails on stale/missing/orphan)
  build-check  Production build checks: backend namespaces, static-viz, FE bundle (slow, ~15 min)
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
  PRE_MERGE_REF   ($PRE_MERGE_REF) pre-merge tip used to detect stale content
  STALE_REFS      ($STALE_REFS) earlier step snapshots
  UNMERGED_POLICY ($UNMERGED_POLICY) upstream | sp
  APPLY_HYBRID    (0) with 'scan --apply', also restore hybrids from upstream
  VERIFY_SCAN     (1) set to 0 to skip the scan inside verify
  BUILD_CHECK_STEPS ($BUILD_CHECK_STEPS)
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
    scan) cmd_scan "${2:-}" ;;
    build-check) cmd_build_check ;;
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
