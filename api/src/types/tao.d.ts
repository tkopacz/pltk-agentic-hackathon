declare module '@tao/core' {
  interface InitOptions {
    serviceName: string;
    environment?: string;
    metrics?: {
      backend?: string;
      endpoint?: string;
    };
    tracing?: {
      backend?: string;
      samplingRate?: number;
    };
    logging?: {
      level?: string;
      format?: string;
    };
  }

  interface CounterOptions {
    name: string;
    help?: string;
    labels?: string[];
  }

  interface Counter {
    inc(labels?: Record<string, string | number>, value?: number): void;
  }

  interface TraceSpan {
    setAttribute(key: string, value: string | number | boolean): void;
    end(): void;
  }

  interface Logger {
    debug(message: string, metadata?: Record<string, unknown>): void;
    info(message: string, metadata?: Record<string, unknown>): void;
    warn(message: string, metadata?: Record<string, unknown>): void;
    error(message: string, metadata?: Record<string, unknown>): void;
  }

  export function initTAO(options: InitOptions): void;
  export function observe(): import('express').RequestHandler;
  export namespace MetricRegistry {
    function counter(options: CounterOptions): Counter;
  }
  export function startTrace(name: string, attributes?: Record<string, string | number | boolean>): TraceSpan;
  export function getLogger(name: string): Logger;
}
