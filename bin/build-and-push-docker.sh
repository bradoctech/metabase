#!/usr/bin/env bash
#
# Build Metabase JAR, build Docker image, and push to Docker Hub.
#
# Prerequisites:
#   - Log in to Docker Hub:  docker login
#   - Or set: DOCKERHUB_RELEASE_USERNAME, DOCKERHUB_RELEASE_TOKEN
#
# Usage:
#   DOCKER_IMAGE=your-dockerhub-username/metabase-sp:latest ./bin/build-and-push-docker.sh
#
# One-liner example:
#   DOCKER_IMAGE=myuser/metabase-saopaulo:latest ./bin/build-and-push-docker.sh
#
# Optional:
#   MB_EDITION=ee|oss          (default: ee; also read from .env via mise)
#   MB_BUILD_VERSION=v1.63.18  (default: derived from the latest upstream git tag)
#
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"

# Full Docker image tag (e.g. myuser/metabase-sp:latest)
DOCKER_IMAGE="${DOCKER_IMAGE:-}"

if [[ -z "$DOCKER_IMAGE" ]]; then
  echo "Error: Set DOCKER_IMAGE to your Docker Hub image tag (e.g. myuser/metabase-sp:latest)"
  echo "  export DOCKER_IMAGE=your-username/your-repo:latest"
  echo "  ./bin/build-and-push-docker.sh"
  exit 1
fi

cd "$PROJECT_ROOT"

# Activate mise so clojure is on PATH (installed by ./bin/dev-install)
if command -v mise >/dev/null 2>&1; then
  eval "$(mise activate bash)"
elif [[ -x "$HOME/.local/bin/mise" ]]; then
  export PATH="$HOME/.local/bin:$PATH"
  eval "$(mise activate bash)"
fi

# Edition: MB_EDITION (from env or .env via mise), defaulting to EE for this fork
MB_EDITION="${MB_EDITION:-ee}"
if [[ "$MB_EDITION" != "ee" && "$MB_EDITION" != "oss" ]]; then
  echo "Error: MB_EDITION must be 'ee' or 'oss' (got '$MB_EDITION')"
  exit 1
fi
export MB_EDITION
if [[ "$MB_EDITION" == "ee" ]]; then MAJOR=1; else MAJOR=0; fi

# Version shown in the app (Admin > Updates, "What's new" banner). The banner only links the right
# release notes when this matches an entry of static.metabase.com/version-info*.json exactly, so
# drop the fork's 4th component (v0.63.18.1 -> v1.63.18).
# Override with MB_BUILD_VERSION=v1.63.18 when needed.
SDK_MINOR_PATCH="$(sed -nE 's/^[[:space:]]*"version": "0\.([0-9]+\.[0-9]+)".*/\1/p' \
  enterprise/frontend/src/embedding-sdk-package/package.template.json | head -1)"
SDK_MINOR="${SDK_MINOR_PATCH%%.*}"
if [[ -z "${MB_BUILD_VERSION:-}" ]]; then
  TAG="$(git describe --tags --abbrev=0 --match 'v[01].[0-9]*.[0-9]*' 2>/dev/null || true)"
  TAG_MINOR_PATCH="$(sed -nE 's/^v[01]\.([0-9]+)\.([0-9]+).*/\1.\2/p' <<<"$TAG")"
  if [[ -n "$TAG_MINOR_PATCH" && "${TAG_MINOR_PATCH%%.*}" == "$SDK_MINOR" ]]; then
    MB_BUILD_VERSION="v${MAJOR}.${TAG_MINOR_PATCH}"
  elif [[ -n "$SDK_MINOR_PATCH" ]]; then
    echo "Warning: git tag '${TAG:-<none>}' does not match the code's major (${SDK_MINOR}); using the SDK package version."
    MB_BUILD_VERSION="v${MAJOR}.${SDK_MINOR_PATCH}"
  else
    echo "Error: could not determine the version. Set MB_BUILD_VERSION (e.g. v1.63.18)."
    exit 1
  fi
fi

echo "==> Edition: ${MB_EDITION} | Version: ${MB_BUILD_VERSION}"

echo "==> 1/5 Building JAR (./bin/build.sh)..."
./bin/build.sh "{:version \"${MB_BUILD_VERSION}\" :edition :${MB_EDITION}}"

echo "==> 2/5 Copying JAR and driver plugins to bin/docker..."
cp -v target/uberjar/metabase.jar bin/docker/
mkdir -p bin/docker/plugins
if ls resources/modules/*.jar 1>/dev/null 2>&1; then
  cp -v resources/modules/*.jar bin/docker/plugins/
else
  echo "No driver JARs in resources/modules (run full ./bin/build.sh to include drivers)"
  touch bin/docker/plugins/.keep
fi

echo "==> 3/5 Building Docker image: $DOCKER_IMAGE"
docker build --tag "$DOCKER_IMAGE" bin/docker/.

echo "==> 4/5 Pushing to Docker Hub..."
if [[ -n "${DOCKERHUB_RELEASE_USERNAME:-}" && -n "${DOCKERHUB_RELEASE_TOKEN:-}" ]]; then
  echo "$DOCKERHUB_RELEASE_TOKEN" | docker login --username "$DOCKERHUB_RELEASE_USERNAME" --password-stdin
fi
docker push "$DOCKER_IMAGE"

echo ""
echo "Done. Image pushed: $DOCKER_IMAGE"
echo "Run with: docker run -d -p 3000:3000 $DOCKER_IMAGE"
