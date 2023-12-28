import { Router } from 'express'
import { uploadImageController } from '~/controllers/medias.controllers'
import { wrapRequestHandler } from '~/utils/handlers'

const mediasRouter = Router()

/**
 * Description: Upload file image
 * Path: /upload-image
 * Method: POST
 * Body: { image: file }
 */
mediasRouter.post('/upload-image', wrapRequestHandler(uploadImageController))

export default mediasRouter
