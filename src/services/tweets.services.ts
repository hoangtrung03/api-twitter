import { config } from 'dotenv'
import { ObjectId, WithId } from 'mongodb'
import { TweetRequestBody } from '~/models/requests/Tweet.request'
import Hashtag from '~/models/schemas/Hashtag.schema'
import Tweet from '~/models/schemas/Tweet.schema'
import databaseService from './database.services'

config()

class TweetsService {
  /**
   * A description of the entire function.
   *
   * @param {string[]} hashtag - description of parameter
   * @return {string[]} description of return value
   */
  async checkAndCreateHashtag(hashtag: string[]) {
    const hashtagDocuments = await Promise.all(
      hashtag.map((hashtag) => {
        // Check if hashtag already exists, if not create it
        return databaseService.hashtags.findOneAndUpdate(
          { name: hashtag },
          {
            $setOnInsert: new Hashtag({ name: hashtag })
          },
          {
            upsert: true,
            returnDocument: 'after'
          }
        )
      })
    )

    return hashtagDocuments.map((newHashtag) => (newHashtag.value as WithId<Hashtag>)._id)
  }

  /**
   * Creates a new tweet for a given user.
   *
   * @param {string} user_id - The ID of the user creating the tweet.
   * @param {TweetRequestBody} body - The request body containing the tweet data.
   * @return {Promise<Tweet>} The newly created tweet.
   */
  async createTweet(user_id: string, body: TweetRequestBody) {
    const hashtags = await this.checkAndCreateHashtag(body.hashtags)
    const result = await databaseService.tweets.insertOne(
      new Tweet({
        audience: body.audience,
        content: body.content,
        hashtags,
        mentions: body.mentions,
        medias: body.medias,
        parent_id: body.parent_id,
        type: body.type,
        user_id: new ObjectId(user_id)
      })
    )
    const tweet = await databaseService.tweets.findOne({ _id: result.insertedId })

    return tweet
  }
}

const tweetsService = new TweetsService()
export default tweetsService
