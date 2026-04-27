import * as Sentry from '@sentry/node';
import pino from 'pino';

/**
 * Application-wide pino logger.
 *
 * Log levels follow standard pino semantics (trace → debug → info → warn →
 * error → fatal).  In production the level defaults to 'info'.  Set the
 * LOG_LEVEL env var to override (e.g. 'debug' during local development).
 *
 * Sentry integration: every `error` or `fatal` call is automatically
 * forwarded to Sentry as a captured exception or message so that structured
 * log context (bindings, msg) is preserved alongside the Sentry event.
 */

function buildLogger() {
  const base = pino({
    level: process.env.LOG_LEVEL ?? 'info',
    timestamp: pino.stdTimeFunctions.isoTime,
    formatters: {
      level(label) {
        return { level: label };
      },
    },
  });

  /**
   * Wrap a pino logger so that every `error` / `fatal` call is also sent to
   * Sentry.  We decorate rather than subclass so the type stays `pino.Logger`.
   */
  function withSentryForwarding(logger: pino.Logger): pino.Logger {
    const originalError = logger.error.bind(logger);
    const originalFatal = logger.fatal.bind(logger);

    function captureToSentry(msgOrObj: unknown, ...args: unknown[]) {
      if (!Sentry.getClient()) return;

      if (msgOrObj instanceof Error) {
        Sentry.captureException(msgOrObj);
      } else if (typeof msgOrObj === 'object' && msgOrObj !== null) {
        const { err, error, ...extra } = msgOrObj as Record<string, unknown>;
        const thrown = err ?? error;
        if (thrown instanceof Error) {
          Sentry.captureException(thrown, { extra: extra as Record<string, unknown> });
        } else {
          const message = typeof args[0] === 'string' ? args[0] : JSON.stringify(msgOrObj);
          Sentry.captureMessage(message, {
            level: 'error',
            extra: extra as Record<string, unknown>,
          });
        }
      } else if (typeof msgOrObj === 'string') {
        Sentry.captureMessage(msgOrObj, 'error');
      }
    }

    (logger as any).error = (objOrMsg: unknown, msg?: string, ...params: unknown[]) => {
      captureToSentry(objOrMsg, msg);
      return (originalError as any)(objOrMsg, msg, ...params);
    };
    (logger as any).fatal = (objOrMsg: unknown, msg?: string, ...params: unknown[]) => {
      captureToSentry(objOrMsg, msg);
      return (originalFatal as any)(objOrMsg, msg, ...params);
    };

    return logger;
  }

  return withSentryForwarding(base);
}

export const logger = buildLogger();
