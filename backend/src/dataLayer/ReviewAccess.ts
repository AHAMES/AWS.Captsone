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
      'createReview: BookId ' +
        review.bookId +
        ' attempting to create review for Book'
    )
    await this.docClient
      .put({
        TableName: this.userTableName,
        Item: review
      })
      .promise()
    logger.info('item created', review)
    return review[0] as UserReviewItem
  }

  async getReview(bookId, userId) {
    logger.info(
      'getReview: BookID ' +
        bookId +
        ' attempting to create a review for the book'
    )

    const params = {
      TableName: this.userTableName,
      KeyConditionExpression: 'userId = :userId and bookId = :bookId',

      ExpressionAttributeValues: {
        ':userId': userId,
        ':bookId': bookId
      }
    }
    const review = await this.docClient.query(params).promise()
    logger.info('item created', review)
    return review[0] as UserReviewItem
  }

  async deleteReview(bookId, userId) {
    logger.info(
      'DeleteReview: BookID ' +
        bookId +
        ' attempting to create a review for the book'
    )

    const params = {
      TableName: this.userTableName,
      Key: {
        Key: {
          bookId: bookId,
          userId: userId
        }
      }
    }
    const review = await this.docClient.delete(params).promise()
    logger.info('item created', review)
    return review[0] as UserReviewItem
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
