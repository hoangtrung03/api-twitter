import { Request, Response } from 'express'
import { ParamsDictionary } from 'express-serve-static-core'
import { BOOKMARK_MESSAGES } from '~/constants/messages'
import { BookmarkTweetReqBody } from '~/models/requests/Bookmark.request'
import { TokenPayload } from '~/models/requests/User.requests'
import bookmarkService from '~/services/bookmarks.services'

/**
 * Bookmark a tweet for a user.
 *
 * @param {Request<ParamsDictionary, any, BookmarkTweetReqBody>} req - the request object containing user information and tweet ID
 * @param {Response} res - the response object
 * @return {object} an object with a message and the result of bookmarking the tweet
 */
export const bookmarkTweetController = async (
  req: Request<ParamsDictionary, any, BookmarkTweetReqBody>,
  res: Response
) => {
  const { user_id } = req.decoded_authorization as TokenPayload
  const result = await bookmarkService.bookmarkTweet(user_id, req.body.tweet_id)

  return res.json({
    message: BOOKMARK_MESSAGES.BOOKMARK_SUCCESSFULLY,
    result
  })
}

/**
 * Controller function to unbookmark a tweet.
 *
 * @param {Request} req - the request object
 * @param {Response} res - the response object
 * @return {Promise<void>} JSON response with a success message
 */
export const unBookmarkTweetController = async (req: Request, res: Response) => {
  const { user_id } = req.decoded_authorization as TokenPayload
  await bookmarkService.unBookmarkTweet(user_id, req.params.tweet_id)

  return res.json({
    message: BOOKMARK_MESSAGES.UNBOOKMARK_SUCCESSFULLY
  })
}
