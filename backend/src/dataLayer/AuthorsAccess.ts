import * as AWS from 'aws-sdk'
import * as AWSXRay from 'aws-xray-sdk'
import { DocumentClient } from 'aws-sdk/clients/dynamodb'

const XAWS = AWSXRay.captureAWS(AWS)
import { AuthorItem } from '../models/AuthorItem'
import { createLogger } from '../utils/logger'
const logger = createLogger('Author dataLayer')

export class AuthorsAccess {
  constructor(
    private readonly docClient: DocumentClient = createDynamoDBClient(),
    private readonly authorsTable = process.env.AUTHORS_TABLE,
    private readonly authorsBucketName = process.env.AUTHORS_S3_BUCKET //private readonly expires = process.env.SIGNED_URL_EXPIRATION, //private readonly thumbnailBucketName = process.env.THUMBNAILS_S3_BUCKET, //private readonly region = process.env.BUCKET_REGION
  ) {}

  async createAuthor(author: AuthorItem): Promise<AuthorItem> {
    author.attachmentUrl = `https://${this.authorsBucketName}.s3.amazonaws.com/${author.authorId}`
    logger.info(
      'createAuthor: AuthorID ' +
        author.authorId +
        ' attempting to create Author'
    )
    await this.docClient
      .put({
        TableName: this.authorsTable,
        Item: author
      })
      .promise()
    logger.info('item created', author)
    return author
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
