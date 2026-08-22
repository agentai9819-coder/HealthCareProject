import { Request, Response, NextFunction } from "express";
import { ZodSchema } from "zod";
import { uuidParamSchema } from "home-healthcare-validation";

/**
 * Validates that specified route parameters (e.g. :id, :visitId) are valid UUIDs.
 * Rejects invalid format immediately with 400 Bad Request before database queries execute,
 * preventing PostgreSQL 22P02 invalid input syntax exceptions.
 */
export function validateUuidParam(...paramNames: string[]) {
  return (req: Request, res: Response, next: NextFunction) => {
    for (const paramName of paramNames) {
      const value = req.params[paramName];
      if (value) {
        const parseResult = uuidParamSchema.safeParse(value);
        if (!parseResult.success) {
          return res.status(400).json({
            success: false,
            error: `Invalid '${paramName}' parameter format. Expected a valid UUID.`,
          });
        }
      }
    }
    next();
  };
}

/**
 * Validates and sanitizes request query parameters against a Zod schema.
 * Rejects invalid parameters with 400 Bad Request.
 */
export function validateQuery(schema: ZodSchema) {
  return (req: Request, res: Response, next: NextFunction) => {
    const parseResult = schema.safeParse(req.query);
    if (!parseResult.success) {
      return res.status(400).json({
        success: false,
        error: "Invalid query parameters",
        details: parseResult.error.format(),
      });
    }
    req.query = parseResult.data;
    next();
  };
}
