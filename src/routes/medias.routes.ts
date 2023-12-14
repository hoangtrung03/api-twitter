import { Router } from 'express'
import { uploadSingleImageController } from '~/controllers/medias.controllers'
import { wrapRequestHandler } from '~/utils/handlers'

const mediasRouter = Router()

/**
 * Description: Upload single file image
 * Path: /upload-image
 * Method: POST
 * Body: { image: file }
 */
mediasRouter.post('/upload-image', wrapRequestHandler(uploadSingleImageController))

export default mediasRouter
