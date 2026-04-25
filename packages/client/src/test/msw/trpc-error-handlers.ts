/**
 * MSW v2 handlers for forcing tRPC error responses in tests.
 *
 * tRPC over HTTP uses a per-procedure URL of the form
 * `<base>/<router>.<procedure>` for `httpLink` (default) or batched as
 * `<base>/<r1>.<p1>,<r2>.<p2>` for `httpBatchLink`. Both are matched here
 * via a wildcard pattern so callers don't need to know the link variant
 * the spec under test is using.
 *
 * Usage:
 *
 *   import { mswServer } from '../msw/server';
 *   import { trpcError } from '../msw/trpc-error-handlers';
 *
 *   it('renders an error fallback when worker.list fails', async () => {
 *     mswServer.use(trpcError('worker.list', { code: 'INTERNAL_SERVER_ERROR' }));
 *     // ... render and assert
 *   });
 */
import { HttpResponse, http } from 'msw';

export interface TrpcErrorPayload {
  /** tRPC error code — see `@trpc/server` `TRPC_ERROR_CODES_BY_KEY`. */
  code:
    | 'PARSE_ERROR'
    | 'BAD_REQUEST'
    | 'UNAUTHORIZED'
    | 'FORBIDDEN'
    | 'NOT_FOUND'
    | 'METHOD_NOT_SUPPORTED'
    | 'TIMEOUT'
    | 'CONFLICT'
    | 'PRECONDITION_FAILED'
    | 'PAYLOAD_TOO_LARGE'
    | 'UNPROCESSABLE_CONTENT'
    | 'TOO_MANY_REQUESTS'
    | 'CLIENT_CLOSED_REQUEST'
    | 'INTERNAL_SERVER_ERROR'
    | 'NOT_IMPLEMENTED'
    | 'BAD_GATEWAY'
    | 'SERVICE_UNAVAILABLE'
    | 'GATEWAY_TIMEOUT';
  /** Optional message; defaults to the code name. */
  message?: string;
  /** HTTP status — derived from `code` if omitted. */
  httpStatus?: number;
}

const HTTP_STATUS_BY_CODE: Record<TrpcErrorPayload['code'], number> = {
  PARSE_ERROR: 400,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  METHOD_NOT_SUPPORTED: 405,
  TIMEOUT: 408,
  CONFLICT: 409,
  PRECONDITION_FAILED: 412,
  PAYLOAD_TOO_LARGE: 413,
  UNPROCESSABLE_CONTENT: 422,
  TOO_MANY_REQUESTS: 429,
  CLIENT_CLOSED_REQUEST: 499,
  INTERNAL_SERVER_ERROR: 500,
  NOT_IMPLEMENTED: 501,
  BAD_GATEWAY: 502,
  SERVICE_UNAVAILABLE: 503,
  GATEWAY_TIMEOUT: 504,
};

/**
 * Produce an MSW handler that returns a tRPC-shaped error for `procedure`.
 *
 * Matches both the unbatched (`httpLink`) and batched (`httpBatchLink`)
 * dispatch URL formats by using a regex on the URL path.
 */
export function trpcError(procedure: string, error: TrpcErrorPayload) {
  const status = error.httpStatus ?? HTTP_STATUS_BY_CODE[error.code];
  const message = error.message ?? error.code;
  const body = {
    error: {
      message,
      code: -32603,
      data: {
        code: error.code,
        httpStatus: status,
        path: procedure,
      },
    },
  };
  // tRPC uses `,` as a separator for batched calls — the procedure can
  // appear at any position in the path.
  const pattern = new RegExp(`/(?:[^/]*?,)?${procedure.replace(/\./g, '\\.')}(?:,|$)`);
  return http.all(pattern, () => HttpResponse.json(body, { status }));
}
