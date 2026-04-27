# Local devnet "zoo"

A high-fidelity replacement for the in-process [`@subsquid/mock-stack`](../../packages/mock-stack/README.md) mini-indexer. Drives the **real** [`squid-subsquid-network`](https://github.com/subsquid/squid-subsquid-network) indexer behind an [SQD portal](https://github.com/subsquid/sqd-portal/tree/master/examples/devnet-evm) pointed at our local anvil node.

## Why two stacks?

| | Mini-indexer (default) | Real-indexer ("devnet zoo") |
|---|---|---|
| Boot time | <2 s | 30–60 s cold |
| Dependencies | tsx + viem | docker + postgres + 3 squid containers + 2 portal containers |
| Fidelity | Operation-name dispatcher with chain-derived projections | Production-shape entities, real GraphQL server, real indexer code paths |
| Use it for | Unit tests, fast UI iteration, CI smoke | High-fidelity integration, debugging indexer-shaped issues |

The default (`pnpm mock`) keeps using the mini-indexer. Set `MOCK_REAL_INDEXER=1` to opt into the real stack.

## Topology

```
Host (pnpm mock:chain)        Docker (pnpm mock:devnet)
─────────────────────────     ────────────────────────────────────────
anvil (:18545, ephemeral)     hotblocks-service ── pulls blocks
   │                            │  via debug_traceBlockByNumber
arbitrum-shim (:8545) ◀───────  hotblocks-db (:8000/datasets/local-devnet)
   │                            │
TS deploy harness writes        ▼
.deployments.json              workers-indexer (:4351/graphql)
                                gateways-indexer (:4352/graphql)
                                token-indexer (:4353/graphql)
                                postgres (3 dbs)
```

## One-time setup

```bash
pnpm mock:devnet:bootstrap
```

This:

1. Initialises git submodules (`external/squid-subsquid-network` etc.).
2. Verifies docker is installed and the daemon is reachable.
3. Eagerly builds the indexer images so the first `mock:devnet` is fast.
4. Stubs `packages/mock-stack/.deployments.json` so docker's bind mount succeeds before the chain has been deployed.

## Daily workflow

In three terminals:

```bash
# Terminal A — chain (long-lived)
pnpm mock:chain

# Terminal B — devnet zoo
pnpm mock:devnet

# Terminal C — app (set MOCK_REAL_INDEXER=1 to route at the docker stack)
MOCK_REAL_INDEXER=1 pnpm mock:app
```

Visit `http://localhost:3005`.

## Troubleshooting

### "Could not bind to /devnet/deployments.json"

You started `pnpm mock:devnet` before `pnpm mock:chain` ever ran. Run `pnpm mock:devnet:bootstrap` once to drop a stub file in place; the indexer entrypoint then waits for the chain to overwrite it with the real deploy.

### Indexers won't sync past block 0

Hotblocks needs `debug_traceBlockByNumber` on the upstream RPC. anvil supports this since 0.2.0; on older builds run `foundryup` to refresh.

### Postgres OOMs / disk full

`pnpm mock:devnet:reset` drops the docker volumes (postgres + hotblocks-db). Rerun the daily workflow.

### "host.docker.internal: name does not resolve"

Linux without Docker Desktop. The compose file already declares `extra_hosts: ["host.docker.internal:host-gateway"]`; if it still fails, you're on a docker version <20.10. Upgrade.

### Address drift after a redeploy

Restart everything from scratch:

```bash
pnpm mock:devnet:reset    # drops indexer DB + hotblocks volume
pnpm mock:chain           # also rerun if you changed contracts
pnpm mock:devnet
```

The indexer cannot pick up new contract addresses at runtime — it has to resync from genesis against them.

### Smoke-checking endpoints

```bash
pnpm mock:devnet:smoke
```

Hits `:4351`, `:4352`, `:4353` with `query squidNetworkHeight` and prints each squid's current head.

## What's pinned where

| File | Pins |
|---|---|
| `external/squid-subsquid-network` | The squid indexer source (submodule). Bump via `git -C external/... fetch && git -C external/... checkout <sha>`. |
| `tools/devnet/portal/*.yaml` | Cribbed from `subsquid/sqd-portal/examples/devnet-evm`. SHA recorded in `PORT_VERSION`. |
| `tools/devnet/patches/*.patch` | Local-devnet patches for the squid (e.g. `case 'devnet'` in network config). Applied at Docker build time. Drop them once an upstream PR lands. |
| `tools/devnet/PORT_VERSION` | Human-readable snapshot of the pinned upstream SHAs. |

## Upstream PR

The patch in `tools/devnet/patches/0001-add-devnet-network.patch` adds:

- `case 'devnet':` to `getNetworkConfig()` in the squid's `packages/shared/src/config/network.ts`.
- A `DEVNET_DEPLOYMENTS_PATH` env var that the case reads (defaults to `/devnet/deployments.json`).
- Support for both the flat shape `{ "SQD": "0x...", ... }` written by `@subsquid/mock-stack` and the structured shape used by mainnet/tethys.

Once that lands upstream, drop the patch and bump the submodule.
