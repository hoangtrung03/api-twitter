import { TweetAudience, TweetType } from '~/constants/enums'
import { Media } from '../Other'

export interface TweetRequestBody {
  type: TweetType
  audience: TweetAudience
  content: string
  parent_id: null | string // Null only if original tweet, otherwise must be a valid tweet id
  hashtags: string[] // Hashtag name of the form ['javascript', 'reactjs']
  mentions: string[] // user_id[]
  medias: Media[]
}
