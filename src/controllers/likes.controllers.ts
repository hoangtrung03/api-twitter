import { Request, Response } from 'express'
import { ParamsDictionary } from 'express-serve-static-core'
import { BOOKMARK_MESSAGES } from '~/constants/messages'
import { BookmarkTweetReqBody } from '~/models/requests/Bookmark.request'
import { TokenPayload } from '~/models/requests/User.requests'
import bookmarkService from '~/services/bookmarks.services'

/**
 * Handles the liking of a tweet.
 *
 * @param {Request<ParamsDictionary, any, BookmarkTweetReqBody>} req - the request object
 * @param {Response} res - the response object
 * @return {Promise<void>} a JSON response with a message and the result of bookmarking the tweet
 */
export const likeTweetController = async (req: Request<ParamsDictionary, any, BookmarkTweetReqBody>, res: Response) => {
  const { user_id } = req.decoded_authorization as TokenPayload
  const result = await bookmarkService.bookmarkTweet(user_id, req.body.tweet_id)

  return res.json({
    message: BOOKMARK_MESSAGES.BOOKMARK_SUCCESSFULLY,
    result
  })
}
