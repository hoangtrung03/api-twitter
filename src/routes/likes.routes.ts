import { Router } from 'express'
import { likeTweetController } from '~/controllers/likes.controllers'
import { accessTokenValidator, verifiedUserValidator } from '~/middlewares/users.middlewares'
import { wrapRequestHandler } from '~/utils/handlers'

const likesRouter = Router()

/**
 * Description: Like a tweet
 * Path: /
 * Method: POST
 * Body: { tweet_id: string }
 * Headers: { Authorization: Bearer <access_token> }
 */
likesRouter.post('/', accessTokenValidator, verifiedUserValidator, wrapRequestHandler(likeTweetController))

export default likesRouter
