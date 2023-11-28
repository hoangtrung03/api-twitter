import { Request, NextFunction, Response } from 'express'
import { pick } from 'lodash'

type FilterKeys<T> = Array<keyof T>

/**
 * Middleware function that filters the request body based on the provided filter keys.
 *
 * @param {FilterKeys<T>} filterKeys - The keys used to filter the request body.
 * @param {Request} req - The Express request object.
 * @param {Response} res - The Express response object.
 * @param {NextFunction} next - The Express next function.
 * @return {void} This function does not return anything.
 */
export const filterMiddleware =
  <T>(filterKeys: FilterKeys<T>) =>
  (req: Request, res: Response, next: NextFunction) => {
    req.body = pick(req.body, filterKeys)
    next()
  }
