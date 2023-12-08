import { NextFunction, Request, Response } from 'express'
import { handleUploadSingleImage } from '~/utils/file'

/**
 * Uploads a single image.
 *
 * @param {Request} req - the request object
 * @param {Response} res - the response object
 * @param {NextFunction} next - the next function
 * @return {Promise<void>} - a promise that resolves to void
 */
export const uploadSingleImageController = async (req: Request, res: Response, next: NextFunction) => {
    const data = await handleUploadSingleImage(req)

    return res.json({
        message: 'Upload single image success',
        result: data
    })
}
