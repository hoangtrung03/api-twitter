import { Request, Response } from 'express'
import { ParamsDictionary } from 'express-serve-static-core'
import { TWEETS_MESSAGES } from '~/constants/messages'
import { TweetRequestBody } from '~/models/requests/Tweet.request'
import { default as tweetsService } from '~/services/tweets.services'

export const createTweetController = async (req: Request<ParamsDictionary, any, TweetRequestBody>, res: Response) => {
  const { audience, content, hashtags, medias, mentions, parent_id, type } = req.body
  const result = await tweetsService.createTweet({
    audience,
    content,
    hashtags,
    medias,
    mentions,
    parent_id,
    type
  })

  return res.json({
    message: TWEETS_MESSAGES.CREATE_TWEET_SUCCESS,
    result
  })
}
