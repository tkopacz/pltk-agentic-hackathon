import type { RequestHandler, Request, Response, NextFunction } from 'express';
import { MetricRegistry, startTrace, getLogger } from '@tao/core';

const logger = getLogger('routes.supplier');

const supplierRequestCounter = MetricRegistry.counter({
  name: 'supplier_requests_total',
  help: 'Total number of supplier route invocations grouped by operation and status',
  labels: ['operation', 'status']
});

const supplierErrorCounter = MetricRegistry.counter({
  name: 'supplier_errors_total',
  help: 'Total number of supplier route errors grouped by operation and status',
  labels: ['operation', 'status']
});

const extractDurationMs = (start: bigint): number => {
  const durationNs = process.hrtime.bigint() - start;
  return Number(durationNs) / 1_000_000;
};

const finalizeSpan = (
  spanName: string,
  span: ReturnType<typeof startTrace>,
  status: number,
  durationMs: number,
  metadata: Record<string, unknown>,
  error?: unknown
) => {
  span.setAttribute('status_code', status);
  span.setAttribute('duration_ms', durationMs);

  Object.entries(metadata).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      span.setAttribute(key, typeof value === 'number' || typeof value === 'boolean' ? value : String(value));
    }
  });

  if (error) {
    span.setAttribute('error', true);
    span.setAttribute('error.type', (error as Error).name ?? 'Error');
  }

  span.end();

  if (error) {
    logger.error(`${spanName} failed`, { ...metadata, status, durationMs, error });
  } else {
    logger.info(`${spanName} completed`, { ...metadata, status, durationMs });
  }
};

export const withSupplierObservability = (operation: string, handler: RequestHandler): RequestHandler => {
  return (req: Request, res: Response, next: NextFunction) => {
    const spanName = `supplier.${operation}`;
    const span = startTrace(spanName, {
      operation,
      method: req.method,
      path: req.originalUrl
    });
    const start = process.hrtime.bigint();
    let finalized = false;

    const supplierId = req.params?.id ?? req.body?.supplierId;

    const finalize = (status: number, error?: unknown) => {
      if (finalized) {
        return;
      }
      finalized = true;

      const durationMs = extractDurationMs(start);
      const statusLabel = String(status);

      supplierRequestCounter.inc({ operation, status: statusLabel });
      if (error) {
        supplierErrorCounter.inc({ operation, status: statusLabel });
      }

      finalizeSpan(spanName, span, status, durationMs, {
        operation,
        supplierId,
        status,
        method: req.method
      }, error);
    };

    try {
      const maybePromise = handler(req, res, (err?: unknown) => {
        if (err) {
          finalize(res.statusCode >= 400 ? res.statusCode : 500, err);
          next(err);
          return;
        }
        finalize(res.statusCode || 200);
        next();
      });

      Promise.resolve(maybePromise).then(
        () => {
          finalize(res.statusCode || 200);
        },
        (error) => {
          finalize(res.statusCode >= 400 ? res.statusCode : 500, error);
          next(error);
        }
      );
    } catch (error) {
      finalize(res.statusCode >= 400 ? res.statusCode : 500, error);
      next(error);
    }
  };
};
