import * as AWS from 'aws-sdk'
import * as AWSXRay from 'aws-xray-sdk'
import { DocumentClient } from 'aws-sdk/clients/dynamodb'

const XAWS = AWSXRay.captureAWS(AWS)
import { BookItem } from '../models/BookItem'
import { createLogger } from '../utils/logger'
//import { UpdateAuthorRequest } from '../requests/UpdateAuthorRequest'
const logger = createLogger('Author dataLayer')

export class BooksAccess {
  constructor(
    private readonly docClient: DocumentClient = createDynamoDBClient(),
    private readonly booksTable = process.env.BOOKS_TABLE,
    private readonly booksBucketName = process.env.Books_S3_BUCKET //private readonly expires = process.env.SIGNED_URL_EXPIRATION, //private readonly thumbnailBucketName = process.env.THUMBNAILS_S3_BUCKET, //private readonly region = process.env.BUCKET_REGION
  ) {}

  async createBook(book: BookItem): Promise<BookItem> {
    book.attachmentUrl = `https://${this.booksBucketName}.s3.amazonaws.com/${book.authorId}`
    logger.info(
      'createAuthor: AuthorID ' +
        book.authorId +
        ' attempting to create book for Author'
    )
    await this.docClient
      .put({
        TableName: this.booksTable,
        Item: book
      })
      .promise()
    logger.info('item created', book)
    return book
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
