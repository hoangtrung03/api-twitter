import { Request, Response } from 'express'
import { ParamsDictionary } from 'express-serve-static-core'
import { TWEETS_MESSAGES } from '~/constants/messages'
import { TweetRequestBody } from '~/models/requests/Tweet.request'
import { TokenPayload } from '~/models/requests/User.requests'
import tweetsService from '~/services/tweets.services'

/**
 * Creates a tweet using the provided request data.
 *
 * @param {Request<ParamsDictionary, any, TweetRequestBody>} req - the request object containing tweet data
 * @param {Response} res - the response object to send back the result
 * @return {Promise<void>} a JSON response with the success message and the created tweet
 */
export const createTweetController = async (req: Request<ParamsDictionary, any, TweetRequestBody>, res: Response) => {
  const { user_id } = req.decoded_authorization as TokenPayload
  const result = await tweetsService.createTweet(user_id, req.body)

  return res.json({
    message: TWEETS_MESSAGES.CREATE_TWEET_SUCCESS,
    result
  })
}

/**
 * Retrieve a tweet controller using the tweet ID from the request parameters.
 *
 * @param {Request} req - the request object containing parameters
 * @param {Response} res - the response object to send back
 * @return {Promise<void>} Promise that resolves to sending a JSON response with the retrieved tweet
 */
export const getTweetController = async (req: Request, res: Response) => {
  const { tweet_id } = req.params
  const result = await tweetsService.getTweet(tweet_id)

  return res.json({
    message: TWEETS_MESSAGES.GET_TWEET_SUCCESS,
    result: result
  })
}
