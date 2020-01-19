import 'source-map-support/register'

import {
  APIGatewayProxyEvent,
  APIGatewayProxyHandler,
  APIGatewayProxyResult
} from 'aws-lambda'

//import { CreateTodoRequest } from '../../requests/CreateBookRequest'
import { createLogger } from '../../utils/logger'
import { CreateBookRequest } from '../../requests/CreateBookRequest'
import { createBook } from '../../businessLogic/Books'
import { BookItem } from '../../models/BookItem'
const logger = createLogger('createBook')
export const handler: APIGatewayProxyHandler = async (
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
  const newBook: CreateBookRequest = JSON.parse(event.body)
  logger.info('Attempting to create books')

  const ItemDetails: BookItem = {
    bookId: '',
    authorId: newBook.authorId,
    name: newBook.name,
    releaseDate: newBook.releaseDate,
    createdAt: new Date().toISOString(),
    genre: newBook.genre,
    attachmentUrl: ''
  }
  const newItem: BookItem = await createBook(ItemDetails)
  if (newItem == null) {
    logger.info('creation failed author does not exist')

    return {
      statusCode: 404,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': true
      },
      body: JSON.stringify({
        item: newItem
      })
    }
  }
  logger.info('created Item', newItem)
  return {
    statusCode: 201,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Credentials': true
    },
    body: JSON.stringify({
      item: newItem
    })
  }
  return undefined
}
