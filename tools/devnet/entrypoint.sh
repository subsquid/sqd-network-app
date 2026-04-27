#!/usr/bin/env bash
# Entrypoint for the squid indexer containers.
#
# Responsibilities:
#   1. Wait for /devnet/deployments.json to exist and be non-empty
#      (host-side `pnpm mock:chain` writes it after the deploy harness
#      finishes).
#   2. Run `db:migrate` (idempotent — safe across restarts).
#   3. Run `proc` and `api` side by side. If either dies the container
#      exits with the same code so docker compose surfaces the failure.
#
# The `PACKAGE` env var picks which workspace package's main.js + GraphQL
# server to run.
set -euo pipefail

PACKAGE="${PACKAGE:?PACKAGE env var must be set (workers|gateways|token)}"
DEPLOYMENTS_PATH="${DEVNET_DEPLOYMENTS_PATH:-/devnet/deployments.json}"

log() {
    echo "[devnet-indexer/${PACKAGE}] $*"
}

# 1. Wait for deployments.json to exist and parse as non-empty JSON.
log "waiting for ${DEPLOYMENTS_PATH} (host-side \`pnpm mock:chain\` writes it)..."
deadline=$(( $(date +%s) + 600 ))
while :; do
    if [[ -s "${DEPLOYMENTS_PATH}" ]] && \
       node -e "const d=require('${DEPLOYMENTS_PATH}'); if (!d.SQD && !(d.contracts && d.contracts.SQD)) process.exit(1)" \
           >/dev/null 2>&1; then
        break
    fi
    if [[ $(date +%s) -gt ${deadline} ]]; then
        log "ERROR: ${DEPLOYMENTS_PATH} did not become ready within 10 minutes."
        log "  hint: in another terminal, run 'pnpm mock:chain'."
        exit 1
    fi
    sleep 2
done
log "deployments file ready"

# 2. Run migrations.
log "applying database migrations..."
pnpm --dir "/squid/packages/${PACKAGE}" exec squid-typeorm-migration apply

# 3. Spawn proc + api in parallel.
log "starting processor + GraphQL API on :${GQL_PORT:-4350}"

# `proc` reads `dotenv/config`; we pass everything via real env so that's a
# no-op. `api` is the squid-graphql-server bin.
node -r dotenv/config "/squid/packages/${PACKAGE}/lib/main.js" &
proc_pid=$!

pnpm --dir "/squid/packages/${PACKAGE}" exec squid-graphql-server \
    --dumb-cache in-memory \
    --dumb-cache-ttl 1000 \
    --dumb-cache-size 100 \
    --dumb-cache-max-age 1000 \
    --no-squid-status &
api_pid=$!

# Forward signals.
trap 'kill -TERM "${proc_pid}" "${api_pid}" 2>/dev/null || true' TERM INT

# Exit when either process exits.
wait -n "${proc_pid}" "${api_pid}"
status=$?
log "child process exited with status ${status}; tearing down siblings"
kill -TERM "${proc_pid}" "${api_pid}" 2>/dev/null || true
wait || true
exit "${status}"
