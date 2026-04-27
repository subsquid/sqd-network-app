#!/usr/bin/env bash
# Idempotent first-time setup for the local devnet stack.
#
#   1. Initialise / update git submodules (the squid + contracts repos).
#   2. Verify docker is installed and reachable.
#   3. Pre-build the indexer image so `pnpm mock:devnet` is fast.
#   4. Stub `packages/mock-stack/.deployments.json` if missing so docker's
#      bind mount succeeds before `pnpm mock:chain` writes the real file.
#
# Safe to re-run; nothing here destroys state.
set -euo pipefail

REPO_ROOT="$(cd "$(dirname "$0")/../.." && pwd)"
DEPLOY_PATH="${REPO_ROOT}/packages/mock-stack/.deployments.json"

log() {
    echo "[devnet-bootstrap] $*"
}

# 1. Submodules.
log "ensuring git submodules are initialised..."
git -C "${REPO_ROOT}" submodule update --init --recursive

# 2. Docker check.
if ! command -v docker >/dev/null 2>&1; then
    log "ERROR: docker is not installed. See https://docs.docker.com/engine/install/"
    exit 1
fi
if ! docker info >/dev/null 2>&1; then
    log "ERROR: docker daemon is unreachable (try \`sudo systemctl start docker\` or Docker Desktop)."
    exit 1
fi

# 3. Stub deployments file so the docker bind mount has something to attach.
if [[ ! -f "${DEPLOY_PATH}" ]]; then
    log "stubbing ${DEPLOY_PATH} (will be overwritten by \`pnpm mock:chain\`)"
    mkdir -p "$(dirname "${DEPLOY_PATH}")"
    echo "{}" > "${DEPLOY_PATH}"
fi

# 4. Pre-build indexer images. Compose builds them lazily on first up,
# but doing it eagerly makes the first `pnpm mock:devnet` quick.
log "building indexer images (this is slow on a cold cache, ~3-5 min)..."
docker compose \
    -f "${REPO_ROOT}/tools/devnet/docker-compose.yaml" \
    build workers-indexer gateways-indexer token-indexer

log "done. Next steps:"
log "  1. \`pnpm mock:chain\`              (writes ${DEPLOY_PATH})"
log "  2. \`pnpm mock:devnet\`             (boots postgres + portal + 3 indexers)"
log "  3. \`MOCK_REAL_INDEXER=1 pnpm mock:app\`  (starts client + tRPC server)"
