import 'source-map-support/register'

import {
  APIGatewayProxyEvent,
  APIGatewayProxyHandler,
  APIGatewayProxyResult
} from 'aws-lambda'

import { UpdateBookRequest } from '../../requests/UpdateBookRequest'
import { updateBook } from '../../businessLogic/Books'
import { createLogger } from '../../utils/logger'
const logger = createLogger('update todo endpoint')

export const handler: APIGatewayProxyHandler = async (
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
  console.log(event)
  const bookId = event.pathParameters.bookId
  const updatedBook: UpdateBookRequest = JSON.parse(event.body)

  logger.info('attempting to update an item', updatedBook)
  await updateBook(updatedBook, bookId)
  logger.info('updated item', { bookId })
  return {
    statusCode: 204,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Credentials': true,
      'Access-Control-Allow-Methods': 'GET, PUT, POST, DELETE, HEAD'
    },
    body: ''
  }
}
