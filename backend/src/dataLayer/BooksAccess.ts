import * as AWS from 'aws-sdk'
import * as AWSXRay from 'aws-xray-sdk'
import { DocumentClient } from 'aws-sdk/clients/dynamodb'

const XAWS = AWSXRay.captureAWS(AWS)
import { BookItem } from '../models/BookItem'
import { createLogger } from '../utils/logger'
import { UpdateBookRequest } from '../requests/UpdateBookRequest'
const logger = createLogger('Books dataLayer')

export class BooksAccess {
  constructor(
    private readonly docClient: DocumentClient = createDynamoDBClient(),
    private readonly booksTable = process.env.BOOKS_TABLE,
    private readonly booksBucketName = process.env.BOOKS_S3_BUCKET, //private readonly expires = process.env.SIGNED_URL_EXPIRATION, //private readonly thumbnailBucketName = process.env.THUMBNAILS_S3_BUCKET, //private readonly region = process.env.BUCKET_REGION
    private readonly GSIName = process.env.BOOKS_ID_INDEX
  ) {}

  async createBook(book: BookItem): Promise<BookItem> {
    book.attachmentUrl = `https://${this.booksBucketName}.s3.amazonaws.com/${book.bookId}`
    logger.info(
      'createBook: bookID ' +
        book.bookId +
        ' attempting to create book for Author ' +
        book.authorId
    )
    logger.info('book details:', { book })
    await this.docClient
      .put({
        TableName: this.booksTable,
        Item: book
      })
      .promise()
    logger.info('item created', book)
    return book
  }

  async getBooks(): Promise<BookItem[]> {
    var params = {
      TableName: this.booksTable,
      ProjectionExpression:
        'bookId,authorId, createdAt, #name,genre,releaseDate, attachmentUrl',

      ExpressionAttributeNames: {
        '#name': 'name'
      }
    }
    const result = await this.docClient.scan(params).promise()
    const items = result.Items
    logger.info('getBooks', { items })
    return items as BookItem[]
  }

  async getBook(bookId: string): Promise<BookItem> {
    var params = {
      TableName: this.booksTable,
      IndexName: this.GSIName,
      KeyConditionExpression: 'bookId = :bookId',

      ExpressionAttributeValues: {
        ':bookId': bookId
      }
    }

    logger.info('getBook: bookId' + bookId + ' attempting to retreive book')
    const result = await this.docClient.query(params).promise()
    const items = result.Items
    logger.info('Get Book', { items })
    return items[0] as BookItem
  }

  async getBookByAuthor(authorId: string): Promise<BookItem[]> {
    var params = {
      TableName: this.booksTable,
      KeyConditionExpression: 'authorId = :authorId',

      ExpressionAttributeValues: {
        ':authorId': authorId
      }
    }

    logger.info(
      'getBookByAuthor: authorId' +
        authorId +
        ' attempting to retreive books by author'
    )
    const result = await this.docClient.query(params).promise()
    const items = result.Items
    logger.info('Get Book', { items })
    return items as BookItem[]
  }

  async updateBook(
    request: UpdateBookRequest,
    bookId: string,
    authorId: string
  ) {
    logger.info('updateBook: bookId ' + bookId + ' attempting to update book')
    const params = {
      TableName: this.booksTable,
      Key: {
        bookId: bookId,
        authorId: authorId
      },
      UpdateExpression: 'set #nam = :a,releaseDate = :c,genre =:d',
      ExpressionAttributeNames: {
        '#nam': 'name'
      },
      ExpressionAttributeValues: {
        ':a': request.name,
        ':c': request.releaseDate,
        ':d': request.genre
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
