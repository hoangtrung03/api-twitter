import { Request, Response, NextFunction, RequestHandler } from 'express'

/**
 * Wraps a request handler function with error handling middleware.
 *
 * @param {RequestHandler<P>} func - The request handler function to wrap.
 * @return {async (req: Request<P>, res: Response, next: NextFunction) => void} - The wrapped request handler function.
 */
export const wrapRequestHandler = <P>(func: RequestHandler<P>) => {
  return async (req: Request<P>, res: Response, next: NextFunction) => {
    try {
      await func(req, res, next)
    } catch (error) {
      next(error)
    }
  }
}
