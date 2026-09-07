import { RequestHandler } from 'express';
import { z } from 'zod';

export function validate(schema: z.ZodTypeAny): RequestHandler {
  return (req, _res, next) => {
    try {
      const parsed = schema.parse({
        body: req.body,
        query: req.query,
        params: req.params,
      }) as {
        body?: unknown;
        query?: unknown;
        params?: unknown;
      };

      if (parsed.body !== undefined) {
        req.body = parsed.body;
      }

      if (parsed.query !== undefined) {
        req.query = parsed.query as typeof req.query;
      }

      if (parsed.params !== undefined) {
        req.params = parsed.params as typeof req.params;
      }

      next();
    } catch (err) {
      next(err);
    }
  };
}
