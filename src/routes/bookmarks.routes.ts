import { Router } from 'express'
import { bookmarkTweetController, unBookmarkTweetController } from '~/controllers/bookmarks.controllers'
import { accessTokenValidator, verifiedUserValidator } from '~/middlewares/users.middlewares'
import { wrapRequestHandler } from '~/utils/handlers'

const bookMarksRouter = Router()

/**
 * Description: Bookmark tweet
 * Path: /
 * Method: POST
 * Body: { tweet_id: string }
 * Headers: { Authorization: Bearer <access_token> }
 */
bookMarksRouter.post('/', accessTokenValidator, verifiedUserValidator, wrapRequestHandler(bookmarkTweetController))

/**
 * Description: UnBookmark tweet
 * Path: /
 * Method: DELETE
 * Headers: { Authorization: Bearer <access_token> }
 */
bookMarksRouter.delete(
  '/tweets/:tweet_id',
  accessTokenValidator,
  verifiedUserValidator,
  wrapRequestHandler(unBookmarkTweetController)
)

export default bookMarksRouter
