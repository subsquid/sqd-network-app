#!/usr/bin/env bash
# Smoke test for the local devnet stack.
#
# Assumes `pnpm mock:devnet` is already up. Hits each squid GraphQL
# endpoint (`workers`, `gateways`, `token`) with `squidNetworkHeight`
# and asserts the response is well-formed.
#
# Exits 0 if every endpoint responds, non-zero otherwise. Useful for
# CI-of-the-mock-stack and as a quick "is everything healthy?" check
# from a developer's terminal.
set -euo pipefail

PORTS=(
    "workers:4351"
    "gateways:4352"
    "token:4353"
)
QUERY='{"query":"query squidNetworkHeight { squidStatus { height } }"}'

PASS=0
FAIL=0
for entry in "${PORTS[@]}"; do
    name="${entry%%:*}"
    port="${entry##*:}"
    url="http://127.0.0.1:${port}/graphql"

    response=$(curl -fsS -X POST -H 'Content-Type: application/json' \
        -d "${QUERY}" "${url}" 2>&1) || true

    if [[ -z "${response}" ]]; then
        echo "[smoke] ${name} (:${port}) — no response"
        FAIL=$((FAIL + 1))
        continue
    fi

    height=$(echo "${response}" | node -e "
        let s='';process.stdin.on('data',c=>s+=c);
        process.stdin.on('end',()=>{
            try {
                const j=JSON.parse(s);
                process.stdout.write(String(j?.data?.squidStatus?.height ?? ''));
            } catch (_) { process.stdout.write(''); }
        });
    " 2>/dev/null)

    if [[ -z "${height}" ]]; then
        echo "[smoke] ${name} (:${port}) — bad response: ${response}"
        FAIL=$((FAIL + 1))
    else
        echo "[smoke] ${name} (:${port}) — height=${height}"
        PASS=$((PASS + 1))
    fi
done

echo
echo "[smoke] ${PASS} passed, ${FAIL} failed"
[[ ${FAIL} -eq 0 ]]
