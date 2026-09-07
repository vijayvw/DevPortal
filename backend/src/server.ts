import { createApp } from './app';
import { config } from './config';
import { logger } from './common/logger/logger';

const app = createApp();

const server = app.listen(
  config.server.port,
  () => {
    logger.info(
      {
        port: config.server.port,
        environment: config.env,
        apiPrefix:
          config.server.apiPrefix,
      },
      'DevPortal backend listening',
    );
  },
);

async function shutdown(
  signal: string,
) {
  logger.info(
    { signal },
    'Shutdown signal received, closing server gracefully',
  );

  server.close((err) => {
    if (err) {
      logger.error(
        { err },
        'Error during server shutdown',
      );

      process.exit(1);
    }

    logger.info(
      'HTTP server closed',
    );

    process.exit(0);
  });

  setTimeout(() => {
    logger.error(
      'Graceful shutdown timed out, forcing exit',
    );

    process.exit(1);
  }, 10_000).unref();
}

process.on(
  'SIGTERM',
  () => void shutdown('SIGTERM'),
);

process.on(
  'SIGINT',
  () => void shutdown('SIGINT'),
);

process.on(
  'unhandledRejection',
  (reason) => {
    logger.error(
      { reason },
      'Unhandled promise rejection',
    );
  },
);

process.on(
  'uncaughtException',
  (err) => {
    logger.error(
      { err },
      'Uncaught exception — shutting down',
    );

    process.exit(1);
  },
);
