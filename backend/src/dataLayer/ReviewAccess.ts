import * as AWS from 'aws-sdk'
import * as AWSXRay from 'aws-xray-sdk'
import { DocumentClient } from 'aws-sdk/clients/dynamodb'

const XAWS = AWSXRay.captureAWS(AWS)
import { UserReviewItem } from '../models/UserReviewItem'
import { createLogger } from '../utils/logger'
//import { UpdateBookRequest } from '../requests/UpdateBookRequest'
const logger = createLogger('Review dataLayer')

export class ReviewAccess {
  constructor(
    private readonly docClient: DocumentClient = createDynamoDBClient(),
    private readonly userTableName = process.env.USER_REVIEW_TABLE //private readonly expires = process.env.SIGNED_URL_EXPIRATION, //private readonly thumbnailBucketName = process.env.THUMBNAILS_S3_BUCKET, //private readonly region = process.env.BUCKET_REGION //private readonly GSIName = process.env.USER_ID_INDEX
  ) {}
  async createReview(review: UserReviewItem): Promise<UserReviewItem> {
    logger.info(
      'createAuthor: AuthorID ' +
        review.bookId +
        ' attempting to create book for Author'
    )
    await this.docClient
      .put({
        TableName: this.userTableName,
        Item: review
      })
      .promise()
    logger.info('item created', review)
    return review
  }
}
function createDynamoDBClient() {
  if (process.env.IS_OFFLINE === 'True') {
    return new XAWS.DynamoDB.DocumentClient({
      region: 'localhost',
      endpoint: 'http://localhost:8000'
    })
  }

  return new XAWS.DynamoDB.DocumentClient({ apiVersion: '2012-08-10' })
}
