import { NextFunction, Request, Response } from 'express'
import mediasService from '~/services/medias.services'

/**
 * Uploads a single image.
 *
 * @param {Request} req - the request object
 * @param {Response} res - the response object
 * @param {NextFunction} next - the next function
 * @return {Promise<void>} - a promise that resolves to void
 */
export const uploadSingleImageController = async (req: Request, res: Response, next: NextFunction) => {
  const result = await mediasService.handleUploadSingleImage(req)

  return res.json({
    result: result
  })
}
