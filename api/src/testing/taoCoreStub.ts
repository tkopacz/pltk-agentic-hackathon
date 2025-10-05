import type { RequestHandler } from 'express';

const noop = () => void 0;

export const MetricRegistry = {
  counter: (_options: { name: string; help?: string; labels?: string[] }) => ({
    inc: noop
  })
};

export const initTAO = () => {
  // no-op for tests
};

export const observe = (): RequestHandler => (_req, _res, next) => {
  next();
};

export const startTrace = (_name: string, _attributes?: Record<string, string | number | boolean>) => ({
  setAttribute: noop,
  end: noop
});

export const getLogger = () => ({
  debug: noop,
  info: noop,
  warn: noop,
  error: noop
});
