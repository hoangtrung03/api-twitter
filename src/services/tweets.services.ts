import { config } from 'dotenv'
import { TweetRequestBody } from '~/models/requests/Tweet.request'

config()

class TweetsService {
  async createTweet({ audience, content, hashtags, medias, mentions, parent_id, type }: TweetRequestBody) {
    return {
      audience,
      content,
      hashtags,
      medias,
      mentions,
      parent_id,
      type
    }
  }
}

const tweetsService = new TweetsService()
export default tweetsService
