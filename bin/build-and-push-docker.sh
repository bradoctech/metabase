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

echo "==> 1/5 Building JAR (./bin/build.sh)..."
./bin/build.sh

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
