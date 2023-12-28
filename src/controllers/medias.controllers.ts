import { NextFunction, Request, Response } from 'express'
import path from 'path'
import { UPLOAD_DIR } from '~/constants/dir'
import { USER_MESSAGES } from '~/constants/messages'
import mediasService from '~/services/medias.services'

/**
 * Uploads a single image.
 *
 * @param {Request} req - the request object
 * @param {Response} res - the response object
 * @param {NextFunction} next - the next function
 * @return {Promise<void>} - a promise that resolves to void
 */
export const uploadImageController = async (req: Request, res: Response, next: NextFunction) => {
  const result = await mediasService.handleUploadImage(req)

  return res.json({
    message: USER_MESSAGES.UPLOAD_SUCCESS,
    result: result
  })
}

export const serveImageController = async (req: Request, res: Response, next: NextFunction) => {
  const { name } = req.params

  return res.sendFile(path.resolve(UPLOAD_DIR, name + '.jpg'), (err)=> {
    if(err) {
      res.status((err as any).status).send('Not found')
    }
  })
}
