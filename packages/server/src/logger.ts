import * as Sentry from '@sentry/node';
import pino from 'pino';

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
          Sentry.captureException(thrown, { extra });
        } else {
          const message = typeof args[0] === 'string' ? args[0] : JSON.stringify(msgOrObj);
          Sentry.captureMessage(message, {
            level: 'error',
            extra,
          });
        }
      } else if (typeof msgOrObj === 'string') {
        Sentry.captureMessage(msgOrObj, 'error');
      }
    }

    logger.error = (objOrMsg: unknown, msg?: string, ...params: unknown[]) => {
      captureToSentry(objOrMsg, msg);
      return originalError(objOrMsg, msg, ...params);
    };
    logger.fatal = (objOrMsg: unknown, msg?: string, ...params: unknown[]) => {
      captureToSentry(objOrMsg, msg);
      return originalFatal(objOrMsg, msg, ...params);
    };

    return logger;
  }

  return withSentryForwarding(base);
}

export const logger = buildLogger();
