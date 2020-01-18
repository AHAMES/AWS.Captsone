import * as AWS from 'aws-sdk'
import * as AWSXRay from 'aws-xray-sdk'
import { DocumentClient } from 'aws-sdk/clients/dynamodb'

const XAWS = AWSXRay.captureAWS(AWS)
import { AuthorItem } from '../models/AuthorItem'
import { createLogger } from '../utils/logger'
import { UpdateAuthorRequest } from '../requests/UpdateAuthorRequest'
const logger = createLogger('Author dataLayer')

export class AuthorsAccess {
  constructor(
    private readonly docClient: DocumentClient = createDynamoDBClient(),
    private readonly authorsTable = process.env.AUTHORS_TABLE,
    private readonly authorsBucketName = process.env.AUTHORS_S3_BUCKET //private readonly expires = process.env.SIGNED_URL_EXPIRATION, //private readonly thumbnailBucketName = process.env.THUMBNAILS_S3_BUCKET, //private readonly region = process.env.BUCKET_REGION
  ) {}

  async getAuthors(): Promise<AuthorItem[]> {
    var params = {
      TableName: this.authorsTable,
      ProjectionExpression: 'authorId, createdAt, #name, attachmentUrl',

      ExpressionAttributeNames: {
        '#name': 'name'
      }
    }

    const result = await this.docClient.scan(params).promise()
    const items = result.Items
    logger.info('getAuthors', { items })
    return items as AuthorItem[]
  }

  async getAuthor(authorId: string): Promise<AuthorItem> {
    var params = {
      TableName: this.authorsTable,
      KeyConditionExpression: 'authorId = :authorId',

      ExpressionAttributeValues: {
        ':authorId': authorId
      }
    }

    logger.info(
      'getAuthor: authorId' + authorId + ' attempting to retreive author'
    )
    const result = await this.docClient.query(params).promise()
    const items = result.Items
    logger.info('Get Author', { items })
    return items[0] as AuthorItem
  }
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

  async updateAuthor(request: UpdateAuthorRequest, authorId: string) {
    logger.info(
      'updateAuthor: authorId ' + authorId + ' attempting to update author'
    )
    const params = {
      TableName: this.authorsTable,
      Key: {
        authorId: authorId
      },
      UpdateExpression: 'set #nam = :a',
      ExpressionAttributeNames: {
        '#nam': 'name'
      },
      ExpressionAttributeValues: {
        ':a': request.name
      }
    }
    await this.docClient.update(params).promise()
    logger.info('updated Author', request)
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
